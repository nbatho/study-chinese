import { query, withTransaction } from '../config/db.config.js';
import { notFound } from '../utils/http-error.js';
import { getWordOrThrow } from './vocab.service.js';

const mapCustomList = (row) => ({
  id: row.id,
  name: row.name,
  emoji: row.emoji,
  wordIds: row.word_ids || []
});

const getListWordIds = async (client, listId, userId) => {
  const result = await client.query(
    `
      SELECT
        cl.id,
        cl.name,
        cl.emoji,
        COALESCE(array_remove(array_agg(clw.word_id ORDER BY clw.order_num), NULL), '{}') AS word_ids
      FROM custom_lists cl
      LEFT JOIN custom_list_words clw ON clw.list_id = cl.id
      WHERE cl.id = $1 AND cl.user_id = $2
      GROUP BY cl.id
    `,
    [listId, userId]
  );

  if (result.rowCount === 0) {
    throw notFound('Không tìm thấy danh sách từ vựng.');
  }

  return mapCustomList(result.rows[0]);
};

export const toggleFavorite = async (userId, wordId) =>
  withTransaction(async (client) => {
    await getWordOrThrow(wordId, client);

    const existingResult = await client.query(
      `
        SELECT 1
        FROM user_favorite_words
        WHERE user_id = $1 AND word_id = $2
      `,
      [userId, wordId]
    );

    if (existingResult.rowCount > 0) {
      await client.query(
        `
          DELETE FROM user_favorite_words
          WHERE user_id = $1 AND word_id = $2
        `,
        [userId, wordId]
      );

      return {
        wordId,
        isFavorite: false
      };
    }

    await client.query(
      `
        INSERT INTO user_favorite_words (user_id, word_id)
        VALUES ($1, $2)
      `,
      [userId, wordId]
    );

    return {
      wordId,
      isFavorite: true
    };
  });

export const getCustomLists = async (userId) => {
  const result = await query(
    `
      SELECT
        cl.id,
        cl.name,
        cl.emoji,
        COALESCE(array_remove(array_agg(clw.word_id ORDER BY clw.order_num), NULL), '{}') AS word_ids
      FROM custom_lists cl
      LEFT JOIN custom_list_words clw ON clw.list_id = cl.id
      WHERE cl.user_id = $1
      GROUP BY cl.id
      ORDER BY cl.created_at DESC
    `,
    [userId]
  );

  return {
    lists: result.rows.map(mapCustomList)
  };
};

export const createCustomList = async (userId, { name, emoji }) => {
  const result = await query(
    `
      INSERT INTO custom_lists (user_id, name, emoji)
      VALUES ($1, $2, COALESCE(NULLIF($3, ''), '📗'))
      RETURNING id, name, emoji, '{}'::varchar[] AS word_ids
    `,
    [userId, name, emoji]
  );

  return {
    list: mapCustomList(result.rows[0])
  };
};

export const deleteCustomList = async (userId, listId) => {
  const result = await query(
    `
      DELETE FROM custom_lists
      WHERE id = $1 AND user_id = $2
    `,
    [listId, userId]
  );

  if (result.rowCount === 0) {
    throw notFound('Không tìm thấy danh sách từ vựng.');
  }

  return null;
};

export const addWordToList = async (userId, listId, wordId) =>
  withTransaction(async (client) => {
    await getWordOrThrow(wordId, client);
    await getListWordIds(client, listId, userId);

    await client.query(
      `
        INSERT INTO custom_list_words (list_id, word_id, order_num)
        VALUES (
          $1,
          $2,
          COALESCE((SELECT MAX(order_num) + 1 FROM custom_list_words WHERE list_id = $1), 1)
        )
        ON CONFLICT (list_id, word_id) DO NOTHING
      `,
      [listId, wordId]
    );

    const list = await getListWordIds(client, listId, userId);

    return {
      listId: list.id,
      wordIds: list.wordIds
    };
  });

export const removeWordFromList = async (userId, listId, wordId) =>
  withTransaction(async (client) => {
    await getListWordIds(client, listId, userId);

    await client.query(
      `
        DELETE FROM custom_list_words
        WHERE list_id = $1 AND word_id = $2
      `,
      [listId, wordId]
    );

    const list = await getListWordIds(client, listId, userId);

    return {
      listId: list.id,
      wordIds: list.wordIds
    };
  });
