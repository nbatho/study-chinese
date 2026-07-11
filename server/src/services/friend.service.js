import { query, withTransaction } from '../config/db.config.js';
import { badRequest, conflict, notFound } from '../utils/http-error.js';
import { emailPattern } from '../utils/patterns.js';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeIdentifier = ({ email, userId, identifier } = {}) => {
  const raw = String(userId || email || identifier || '').trim();

  if (!raw) {
    throw badRequest('Please provide an email or userId.');
  }

  if (uuidPattern.test(raw)) {
    return { column: 'id', value: raw };
  }

  if (emailPattern.test(raw.toLowerCase())) {
    return { column: 'email', value: raw.toLowerCase() };
  }

  throw badRequest('Friend target must be a valid email or userId.');
};

const mapFriendUser = (row, prefix = 'friend') => ({
  id: row[`${prefix}_id`],
  name: row[`${prefix}_name`],
  avatar: row[`${prefix}_avatar`],
  startLevel: row[`${prefix}_start_level`],
  streak: {
    current: Number(row[`${prefix}_current_streak`] || 0),
    best: Number(row[`${prefix}_best_streak`] || 0)
  },
  totalXp: Number(row[`${prefix}_total_xp`] || 0)
});

const mapFriendship = (row, currentUserId) => ({
  id: row.id,
  status: row.status,
  direction: row.requester_id === currentUserId ? 'outgoing' : 'incoming',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  user: mapFriendUser(row)
});

const getFriendshipOrThrow = async (client, friendshipId, userId) => {
  if (!uuidPattern.test(String(friendshipId || ''))) {
    throw badRequest('Friendship id is invalid.');
  }

  const result = await client.query(
    `
      SELECT *
      FROM friendships
      WHERE id = $1
        AND (requester_id = $2 OR addressee_id = $2)
      FOR UPDATE
    `,
    [friendshipId, userId]
  );

  if (result.rowCount === 0) {
    throw notFound('Friendship was not found.');
  }

  return result.rows[0];
};

export const listFriends = async (userId) => {
  const result = await query(
    `
      WITH user_totals AS (
        SELECT user_id, COALESCE(SUM(xp), 0)::int AS total_xp
        FROM daily_stats
        GROUP BY user_id
      )
      SELECT
        f.id,
        f.requester_id,
        f.addressee_id,
        f.status,
        f.created_at,
        f.updated_at,
        friend.id AS friend_id,
        friend.name AS friend_name,
        friend.avatar AS friend_avatar,
        friend.start_level AS friend_start_level,
        friend.current_streak AS friend_current_streak,
        friend.best_streak AS friend_best_streak,
        COALESCE(ut.total_xp, 0)::int AS friend_total_xp
      FROM friendships f
      JOIN users friend
        ON friend.id = CASE
          WHEN f.requester_id = $1 THEN f.addressee_id
          ELSE f.requester_id
        END
      LEFT JOIN user_totals ut ON ut.user_id = friend.id
      WHERE (f.requester_id = $1 OR f.addressee_id = $1)
        AND friend.is_active = true
      ORDER BY
        CASE f.status WHEN 'pending' THEN 0 ELSE 1 END,
        f.updated_at DESC
    `,
    [userId]
  );

  const rows = result.rows.map((row) => mapFriendship(row, userId));

  return {
    friends: rows.filter((item) => item.status === 'accepted'),
    pending: {
      received: rows.filter((item) => item.status === 'pending' && item.direction === 'incoming'),
      sent: rows.filter((item) => item.status === 'pending' && item.direction === 'outgoing')
    }
  };
};

export const sendFriendRequest = async (userId, payload) =>
  withTransaction(async (client) => {
    const target = normalizeIdentifier(payload);
    const userResult = await client.query(
      `
        SELECT id, name, avatar, start_level, current_streak, best_streak
        FROM users
        WHERE ${target.column} = $1 AND is_active = true
      `,
      [target.value]
    );

    if (userResult.rowCount === 0) {
      throw notFound('User was not found.');
    }

    const addressee = userResult.rows[0];

    if (addressee.id === userId) {
      throw badRequest('You cannot send a friend request to yourself.');
    }

    const existingResult = await client.query(
      `
        SELECT *
        FROM friendships
        WHERE user_low_id = LEAST($1::uuid, $2::uuid)
          AND user_high_id = GREATEST($1::uuid, $2::uuid)
        FOR UPDATE
      `,
      [userId, addressee.id]
    );

    if (existingResult.rowCount > 0) {
      const existing = existingResult.rows[0];

      if (existing.status === 'accepted') {
        throw conflict('You are already friends.');
      }

      if (existing.requester_id === userId) {
        throw conflict('Friend request is already pending.');
      }

      throw conflict('This user already sent you a friend request.');
    }

    const insertResult = await client.query(
      `
        WITH inserted AS (
          INSERT INTO friendships (requester_id, addressee_id)
          VALUES ($1, $2)
          RETURNING *
        ),
        user_totals AS (
          SELECT user_id, COALESCE(SUM(xp), 0)::int AS total_xp
          FROM daily_stats
          WHERE user_id = $2
          GROUP BY user_id
        )
        SELECT
          inserted.id,
          inserted.requester_id,
          inserted.addressee_id,
          inserted.status,
          inserted.created_at,
          inserted.updated_at,
          u.id AS friend_id,
          u.name AS friend_name,
          u.avatar AS friend_avatar,
          u.start_level AS friend_start_level,
          u.current_streak AS friend_current_streak,
          u.best_streak AS friend_best_streak,
          COALESCE(ut.total_xp, 0)::int AS friend_total_xp
        FROM inserted
        JOIN users u ON u.id = inserted.addressee_id
        LEFT JOIN user_totals ut ON ut.user_id = u.id
      `,
      [userId, addressee.id]
    );

    return {
      friendship: mapFriendship(insertResult.rows[0], userId)
    };
  });

export const acceptFriendRequest = async (userId, friendshipId) =>
  withTransaction(async (client) => {
    const friendship = await getFriendshipOrThrow(client, friendshipId, userId);

    if (friendship.status !== 'pending' || friendship.addressee_id !== userId) {
      throw notFound('Pending friend request was not found.');
    }

    const updateResult = await client.query(
      `
        WITH updated AS (
          UPDATE friendships
          SET status = 'accepted',
              updated_at = now()
          WHERE id = $1
          RETURNING *
        ),
        user_totals AS (
          SELECT user_id, COALESCE(SUM(xp), 0)::int AS total_xp
          FROM daily_stats
          WHERE user_id = $2
          GROUP BY user_id
        )
        SELECT
          updated.id,
          updated.requester_id,
          updated.addressee_id,
          updated.status,
          updated.created_at,
          updated.updated_at,
          u.id AS friend_id,
          u.name AS friend_name,
          u.avatar AS friend_avatar,
          u.start_level AS friend_start_level,
          u.current_streak AS friend_current_streak,
          u.best_streak AS friend_best_streak,
          COALESCE(ut.total_xp, 0)::int AS friend_total_xp
        FROM updated
        JOIN users u ON u.id = updated.requester_id
        LEFT JOIN user_totals ut ON ut.user_id = u.id
      `,
      [friendshipId, friendship.requester_id]
    );

    return {
      friendship: mapFriendship(updateResult.rows[0], userId)
    };
  });

export const removeFriendship = async (userId, friendshipId) =>
  withTransaction(async (client) => {
    await getFriendshipOrThrow(client, friendshipId, userId);

    await client.query(
      `
        DELETE FROM friendships
        WHERE id = $1
      `,
      [friendshipId]
    );

    return null;
  });

export const __private__ = {
  mapFriendship,
  mapFriendUser,
  normalizeIdentifier
};
