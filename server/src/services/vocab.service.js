import crypto from 'crypto';
import { query } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { toLikePattern } from '../utils/sql.js';

export const mapWord = (row) => ({
  id: row.id,
  simplified: row.simplified,
  traditional: row.traditional,
  pinyin: row.pinyin,
  tones: row.tones || [],
  english: row.english,
  partOfSpeech: row.part_of_speech,
  hskLevel: Number(row.hsk_level),
  cefrLevel: row.cefr_level || 'A1',
  category: row.category,
  radical: row.radical || null,
  frequency: row.frequency === null || row.frequency === undefined ? null : Number(row.frequency),
  topics: row.topics || []
});

const clampInt = (value, { min, max, fallback }) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
};

const SORT_SQL = {
  frequency: 'w.frequency ASC NULLS LAST, w.hsk_level ASC, w.simplified ASC',
  alphabetical: 'w.pinyin_plain ASC, w.simplified ASC',
  hsk: 'w.hsk_level ASC, w.frequency ASC NULLS LAST, w.simplified ASC'
};

export const searchVocabulary = async ({
  q,
  hsk,
  category,
  cefr,
  radical,
  topic,
  sort = 'hsk',
  page = 1,
  limit = 24
} = {}) => {
  const values = [];
  const conditions = ['w.is_active = true'];

  if (q) {
    values.push(toLikePattern(q));
    conditions.push(`
      (
        w.simplified ILIKE $${values.length}
        OR w.traditional ILIKE $${values.length}
        OR w.pinyin ILIKE $${values.length}
        OR w.pinyin_plain ILIKE $${values.length}
        OR w.english ILIKE $${values.length}
        OR w.search_text ILIKE $${values.length}
      )
    `);
  }

  if (hsk) {
    values.push(Number(hsk));
    conditions.push(`w.hsk_level = $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`w.category = $${values.length}`);
  }

  if (cefr) {
    values.push(String(cefr).toUpperCase());
    conditions.push(`w.cefr_level = $${values.length}`);
  }

  if (radical) {
    values.push(radical);
    conditions.push(`w.radical = $${values.length}`);
  }

  if (topic) {
    values.push(topic);
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM word_topic_map wtm_filter
        WHERE wtm_filter.word_id = w.id
          AND wtm_filter.topic_id = $${values.length}
      )
    `);
  }

  const safePage = clampInt(page, { min: 1, max: 10000, fallback: 1 });
  const safeLimit = clampInt(limit, { min: 1, max: 100, fallback: 24 });
  const offset = (safePage - 1) * safeLimit;
  const whereSql = conditions.join(' AND ');
  const orderSql = Object.hasOwn(SORT_SQL, sort) ? SORT_SQL[sort] : SORT_SQL.hsk;

  const countResult = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM words w
      WHERE ${whereSql}
    `,
    values
  );

  const dataValues = [...values, safeLimit, offset];
  const result = await query(
    `
      SELECT
        w.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', wt.id,
              'nameEn', wt.name_en,
              'nameZh', wt.name_zh,
              'emoji', wt.emoji
            )
            ORDER BY wt.display_order, wt.name_en
          ) FILTER (WHERE wt.id IS NOT NULL),
          '[]'
        ) AS topics
      FROM words w
      LEFT JOIN word_topic_map wtm ON wtm.word_id = w.id
      LEFT JOIN word_topics wt ON wt.id = wtm.topic_id AND wt.is_active = true
      WHERE ${whereSql}
      GROUP BY w.id
      ORDER BY ${orderSql}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `,
    dataValues
  );

  const total = Number(countResult.rows[0]?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    vocab: result.rows.map(mapWord),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1
    }
  };
};

export const listVocabularyTopics = async () => {
  const result = await query(
    `
      SELECT
        wt.id,
        wt.name_en AS "nameEn",
        wt.name_zh AS "nameZh",
        wt.emoji,
        wt.display_order AS "displayOrder",
        COUNT(wtm.word_id)::int AS "wordCount"
      FROM word_topics wt
      LEFT JOIN word_topic_map wtm ON wtm.topic_id = wt.id
      WHERE wt.is_active = true
      GROUP BY wt.id
      ORDER BY wt.display_order, wt.name_en
    `
  );

  return { topics: result.rows };
};

export const listVocabularyRadicals = async () => {
  const result = await query(
    `
      SELECT radical, COUNT(*)::int AS count
      FROM words
      WHERE is_active = true
        AND radical IS NOT NULL
        AND radical <> ''
      GROUP BY radical
      ORDER BY count DESC, radical ASC
    `
  );

  return { radicals: result.rows };
};

export const getVocabularyStats = async () => {
  const [hskResult, cefrResult, topicResult] = await Promise.all([
    query(`
      SELECT hsk_level AS level, COUNT(*)::int AS count
      FROM words
      WHERE is_active = true
      GROUP BY hsk_level
      ORDER BY hsk_level
    `),
    query(`
      SELECT cefr_level AS level, COUNT(*)::int AS count
      FROM words
      WHERE is_active = true
      GROUP BY cefr_level
      ORDER BY cefr_level
    `),
    query(`
      SELECT wt.id, wt.name_en AS "nameEn", COUNT(wtm.word_id)::int AS count
      FROM word_topics wt
      LEFT JOIN word_topic_map wtm ON wtm.topic_id = wt.id
      WHERE wt.is_active = true
      GROUP BY wt.id
      ORDER BY wt.display_order, wt.name_en
    `)
  ]);

  return {
    hsk: hskResult.rows,
    cefr: cefrResult.rows,
    topics: topicResult.rows
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
