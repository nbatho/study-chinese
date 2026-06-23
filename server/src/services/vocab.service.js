import crypto from 'crypto';
import { query } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';

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

const toPlainPinyin = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .toLowerCase()
    .trim();

const makeCustomWordId = ({ simplified, pinyin, english }) => {
  const hash = crypto
    .createHash('sha1')
    .update(`${simplified}|${pinyin}|${english}`)
    .digest('hex')
    .slice(0, 24);

  return `ocr_${hash}`;
};

export const ensureVocabularyWord = async (input, client = { query }) => {
  const payload = typeof input === 'string' ? { wordId: input } : input || {};

  if (payload.wordId) {
    return mapWord(await getWordOrThrow(payload.wordId, client));
  }

  const simplified = String(payload.simplified || payload.text || '').trim();
  const traditional = String(payload.traditional || simplified).trim();
  const pinyin = String(payload.pinyin || '').trim();
  const english = String(payload.english || payload.meaning || 'Saved from OCR').trim();

  if (!simplified) {
    throw badRequest('Can luu mot tu hoac cum tu hop le.');
  }

  const existingResult = await client.query(
    `
      SELECT *
      FROM words
      WHERE is_active = true
        AND simplified = $1
      ORDER BY hsk_level, id
      LIMIT 1
    `,
    [simplified]
  );

  if (existingResult.rowCount > 0) {
    return mapWord(existingResult.rows[0]);
  }

  const id = makeCustomWordId({ simplified, pinyin, english });
  const pinyinPlain = toPlainPinyin(pinyin);
  const searchText = [simplified, traditional, pinyin, pinyinPlain, english, 'ocr saved custom']
    .filter(Boolean)
    .join(' ');

  const result = await client.query(
    `
      INSERT INTO words (
        id,
        simplified,
        traditional,
        pinyin,
        pinyin_plain,
        tones,
        english,
        part_of_speech,
        hsk_level,
        category,
        search_text
      )
      VALUES ($1, $2, $3, $4, $5, '{}', $6, 'phrase', 0, 'OCR', $7)
      ON CONFLICT (id)
      DO UPDATE SET
        simplified = EXCLUDED.simplified,
        traditional = EXCLUDED.traditional,
        pinyin = EXCLUDED.pinyin,
        pinyin_plain = EXCLUDED.pinyin_plain,
        english = EXCLUDED.english,
        search_text = EXCLUDED.search_text,
        updated_at = now()
      RETURNING *
    `,
    [id, simplified, traditional, pinyin || simplified, pinyinPlain, english, searchText]
  );

  return mapWord(result.rows[0]);
};
