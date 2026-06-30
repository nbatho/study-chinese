import { query, withTransaction } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';

export const FREE_AI_DAILY_MESSAGE_LIMIT = 10;

const PREMIUM_BUFFER_MS = 0;

export const mapWallet = (row = {}) => ({
  gemBalance: Number(row.gem_balance || 0),
  streakFreezes: Number(row.streak_freezes || 0)
});

export const mapPremium = (row = {}) => {
  const expiresAt = row.premium_expires_at || null;
  const isActive = expiresAt ? new Date(expiresAt).getTime() > Date.now() + PREMIUM_BUFFER_MS : false;

  return {
    isActive,
    expiresAt,
    aiDailyMessageLimit: isActive ? null : FREE_AI_DAILY_MESSAGE_LIMIT
  };
};

export const mapCosmetics = (row = {}) => ({
  aiTutorSkin: row.ai_tutor_skin || 'classic'
});

const mapShopItem = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  emoji: row.emoji,
  category: row.category,
  priceGems: Number(row.price_gems),
  grantType: row.grant_type,
  grantQuantity: Number(row.grant_quantity),
  metadata: row.metadata || {},
  ownedQuantity: Number(row.owned_quantity || 0),
  isOwned: Number(row.owned_quantity || 0) > 0,
  isEquipped: Boolean(row.equipped_at)
});

const getShopSnapshot = async (client, userId) => {
  const [userResult, itemsResult] = await Promise.all([
    client.query(
      `
        SELECT gem_balance, streak_freezes, premium_expires_at, ai_tutor_skin
        FROM users
        WHERE id = $1
      `,
      [userId]
    ),
    client.query(
      `
        SELECT
          si.*,
          COALESCE(usi.quantity, 0) AS owned_quantity,
          usi.equipped_at
        FROM shop_items si
        LEFT JOIN user_shop_items usi
          ON usi.item_id = si.id AND usi.user_id = $1
        WHERE si.is_active = true
        ORDER BY
          CASE si.category
            WHEN 'premium' THEN 1
            WHEN 'streak' THEN 2
            WHEN 'avatar' THEN 3
            ELSE 4
          END,
          si.price_gems,
          si.id
      `,
      [userId]
    )
  ]);

  const user = userResult.rows[0] || {};

  return {
    wallet: mapWallet(user),
    premium: mapPremium(user),
    cosmetics: mapCosmetics(user),
    items: itemsResult.rows.map(mapShopItem)
  };
};

export const getUserGamificationState = async (userId) => {
  const result = await query(
    `
      SELECT gem_balance, streak_freezes, premium_expires_at, ai_tutor_skin
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  const user = result.rows[0] || {};

  return {
    wallet: mapWallet(user),
    premium: mapPremium(user),
    cosmetics: mapCosmetics(user)
  };
};

export const getShop = async (userId) =>
  withTransaction((client) => getShopSnapshot(client, userId));

export const awardGems = async (client, userId, amount, reason, metadata = {}) => {
  const normalizedAmount = Math.max(0, Math.round(Number(amount || 0)));

  if (normalizedAmount <= 0) {
    return {
      gemsEarned: 0,
      wallet: null
    };
  }

  const userResult = await client.query(
    `
      UPDATE users
      SET gem_balance = gem_balance + $2,
          updated_at = now()
      WHERE id = $1
      RETURNING gem_balance, streak_freezes, premium_expires_at, ai_tutor_skin
    `,
    [userId, normalizedAmount]
  );

  await client.query(
    `
      INSERT INTO gem_transactions (user_id, amount, reason, metadata)
      VALUES ($1, $2, $3, $4)
    `,
    [userId, normalizedAmount, reason, JSON.stringify(metadata)]
  );

  return {
    gemsEarned: normalizedAmount,
    wallet: mapWallet(userResult.rows[0])
  };
};

const ensureCanSpend = (user, item) => {
  if (Number(user.gem_balance || 0) < Number(item.price_gems || 0)) {
    throw badRequest('Ban khong du Gems de mua vat pham nay.', {
      gemBalance: Number(user.gem_balance || 0),
      priceGems: Number(item.price_gems || 0)
    });
  }
};

const upsertInventory = (client, userId, itemId, quantity, { equipped = false } = {}) =>
  client.query(
    `
      INSERT INTO user_shop_items (user_id, item_id, quantity, equipped_at)
      VALUES ($1, $2, $3, ${equipped ? 'now()' : 'NULL'})
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET
        quantity = user_shop_items.quantity + EXCLUDED.quantity,
        purchased_at = now(),
        equipped_at = COALESCE(EXCLUDED.equipped_at, user_shop_items.equipped_at)
      RETURNING *
    `,
    [userId, itemId, quantity]
  );

const unequipCategory = async (client, userId, category) => {
  await client.query(
    `
      UPDATE user_shop_items usi
      SET equipped_at = NULL
      FROM shop_items si
      WHERE si.id = usi.item_id
        AND usi.user_id = $1
        AND si.category = $2
    `,
    [userId, category]
  );
};

const equipInventoryItem = async (client, userId, item) => {
  await unequipCategory(client, userId, item.category);
  await client.query(
    `
      UPDATE user_shop_items
      SET equipped_at = now()
      WHERE user_id = $1 AND item_id = $2
    `,
    [userId, item.id]
  );

  if (item.grant_type === 'avatar') {
    const avatar = item.metadata?.avatar || item.emoji;
    await client.query('UPDATE users SET avatar = $2, updated_at = now() WHERE id = $1', [userId, avatar]);
  }

  if (item.grant_type === 'ai_tutor_skin') {
    const skin = item.metadata?.skin || item.id;
    await client.query('UPDATE users SET ai_tutor_skin = $2, updated_at = now() WHERE id = $1', [userId, skin]);
  }
};

const grantPurchasedItem = async (client, userId, item) => {
  if (item.grant_type === 'streak_freeze') {
    await client.query(
      `
        UPDATE users
        SET streak_freezes = streak_freezes + $2,
            updated_at = now()
        WHERE id = $1
      `,
      [userId, Number(item.grant_quantity)]
    );
    await upsertInventory(client, userId, item.id, Number(item.grant_quantity));
    return;
  }

  if (item.grant_type === 'premium_days') {
    await client.query(
      `
        UPDATE users
        SET premium_expires_at =
              GREATEST(COALESCE(premium_expires_at, now()), now()) + ($2::text || ' days')::interval,
            updated_at = now()
        WHERE id = $1
      `,
      [userId, Number(item.grant_quantity)]
    );
    await upsertInventory(client, userId, item.id, 1);
    return;
  }

  await upsertInventory(client, userId, item.id, 1, { equipped: true });
  await equipInventoryItem(client, userId, item);
};

export const purchaseShopItem = async (userId, itemId) =>
  withTransaction(async (client) => {
    const itemResult = await client.query(
      `
        SELECT *
        FROM shop_items
        WHERE id = $1 AND is_active = true
      `,
      [itemId]
    );

    if (itemResult.rowCount === 0) {
      throw notFound('Khong tim thay vat pham trong cua hang.');
    }

    const item = itemResult.rows[0];
    const inventoryResult = await client.query(
      `
        SELECT quantity
        FROM user_shop_items
        WHERE user_id = $1 AND item_id = $2
      `,
      [userId, itemId]
    );
    const isOwnedCosmetic =
      ['avatar', 'ai_tutor_skin'].includes(item.grant_type) &&
      Number(inventoryResult.rows[0]?.quantity || 0) > 0;

    if (isOwnedCosmetic) {
      await equipInventoryItem(client, userId, item);
      return {
        purchased: false,
        equipped: true,
        item: mapShopItem({ ...item, owned_quantity: inventoryResult.rows[0].quantity, equipped_at: new Date() }),
        ...(await getShopSnapshot(client, userId))
      };
    }

    const userResult = await client.query(
      `
        SELECT gem_balance, streak_freezes, premium_expires_at, ai_tutor_skin
        FROM users
        WHERE id = $1
        FOR UPDATE
      `,
      [userId]
    );
    const user = userResult.rows[0];

    ensureCanSpend(user, item);

    await client.query(
      `
        UPDATE users
        SET gem_balance = gem_balance - $2,
            updated_at = now()
        WHERE id = $1
      `,
      [userId, Number(item.price_gems)]
    );
    await client.query(
      `
        INSERT INTO gem_transactions (user_id, amount, reason, metadata)
        VALUES ($1, $2, 'shop_purchase', $3)
      `,
      [userId, -Number(item.price_gems), JSON.stringify({ itemId: item.id, itemName: item.name })]
    );

    await grantPurchasedItem(client, userId, item);

    return {
      purchased: true,
      equipped: ['avatar', 'ai_tutor_skin'].includes(item.grant_type),
      item: mapShopItem({ ...item, owned_quantity: Number(item.grant_quantity), equipped_at: new Date() }),
      ...(await getShopSnapshot(client, userId))
    };
  });

export const getAiEntitlement = async (client, userId) => {
  const result = await client.query(
    `
      SELECT premium_expires_at, ai_tutor_skin
      FROM users
      WHERE id = $1
    `,
    [userId]
  );
  const user = result.rows[0] || {};

  return {
    premium: mapPremium(user),
    cosmetics: mapCosmetics(user)
  };
};

export const getAiUsage = async (client, userId) => {
  const entitlement = await getAiEntitlement(client, userId);
  const usageResult = await client.query(
    `
      SELECT COUNT(*)::int AS used
      FROM chat_messages cm
      JOIN chat_sessions cs ON cs.id = cm.session_id
      JOIN users u ON u.id = cs.user_id
      WHERE cs.user_id = $1
        AND cm.role = 'user'
        AND (cm.created_at AT TIME ZONE u.timezone)::date = (now() AT TIME ZONE u.timezone)::date
    `,
    [userId]
  );
  const used = Number(usageResult.rows[0]?.used || 0);
  const limit = entitlement.premium.isActive ? null : FREE_AI_DAILY_MESSAGE_LIMIT;

  return {
    used,
    limit,
    remaining: limit === null ? null : Math.max(limit - used, 0),
    isPremium: entitlement.premium.isActive,
    premiumExpiresAt: entitlement.premium.expiresAt,
    aiTutorSkin: entitlement.cosmetics.aiTutorSkin
  };
};
