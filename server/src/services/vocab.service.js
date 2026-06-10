import { query } from '../config/db.config.js';
import { notFound } from '../utils/http-error.js';

export const mapWord = (row) => ({
  id: row.id,
  simplified: row.simplified,
  traditional: row.traditional,
  pinyin: row.pinyin,
  tones: row.tones || [],
  english: row.english,
  partOfSpeech: row.part_of_speech,
  hskLevel: Number(row.hsk_level),
  category: row.category
});

export const searchVocabulary = async ({ q, hsk, category } = {}) => {
  const values = [];
  const conditions = ['is_active = true'];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`
      (
        simplified ILIKE $${values.length}
        OR traditional ILIKE $${values.length}
        OR pinyin ILIKE $${values.length}
        OR pinyin_plain ILIKE $${values.length}
        OR english ILIKE $${values.length}
        OR search_text ILIKE $${values.length}
      )
    `);
  }

  if (hsk) {
    values.push(Number(hsk));
    conditions.push(`hsk_level = $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  const result = await query(
    `
      SELECT *
      FROM words
      WHERE ${conditions.join(' AND ')}
      ORDER BY hsk_level, category, simplified
      LIMIT 100
    `,
    values
  );

  return {
    vocab: result.rows.map(mapWord)
  };
};

export const getWordOrThrow = async (wordId, client = { query }) => {
  const result = await client.query(
    `
      SELECT *
      FROM words
      WHERE id = $1 AND is_active = true
    `,
    [wordId]
  );

  if (result.rowCount === 0) {
    throw notFound('Không tìm thấy từ vựng.');
  }

  return result.rows[0];
};
