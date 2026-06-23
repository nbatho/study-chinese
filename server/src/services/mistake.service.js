import crypto from 'crypto';
import { query } from '../config/db.config.js';
import { notFound } from '../utils/http-error.js';

const compact = (value) => String(value || '').trim();

const makeTextMistakeKey = (payload) => {
  const hash = crypto
    .createHash('sha1')
    .update(
      [
        payload.skill,
        payload.simplified || payload.prompt,
        payload.correctAnswer || payload.correct_answer,
        payload.pinyin,
        payload.english
      ]
        .map(compact)
        .join('|')
    )
    .digest('hex')
    .slice(0, 32);

  return `text:${hash}`;
};

const getMistakeKey = (payload) => {
  if (payload.wordId || payload.word_id) {
    return `word:${payload.wordId || payload.word_id}`;
  }

  return makeTextMistakeKey(payload);
};

export const mapMistake = (row) => ({
  id: row.id,
  wordId: row.word_id,
  skill: row.skill,
  prompt: row.prompt,
  userAnswer: row.user_answer,
  correctAnswer: row.correct_answer,
  simplified: row.word_simplified || row.simplified,
  pinyin: row.word_pinyin || row.pinyin,
  english: row.word_english || row.english,
  context: row.context || {},
  mistakeCount: Number(row.mistake_count),
  resolvedCount: Number(row.resolved_count),
  needsPracticeCount: Math.max(0, Number(row.mistake_count) - Number(row.resolved_count)),
  lastMistakeAt: row.last_mistake_at,
  lastPracticedAt: row.last_practiced_at
});

export const recordMistake = async (client, userId, payload = {}) => {
  const skill = compact(payload.skill || 'general').slice(0, 50);
  const mistakeKey = getMistakeKey({ ...payload, skill }).slice(0, 120);
  const context = payload.context && typeof payload.context === 'object' ? payload.context : {};

  const result = await client.query(
    `
      INSERT INTO user_mistakes (
        user_id,
        mistake_key,
        word_id,
        skill,
        prompt,
        user_answer,
        correct_answer,
        simplified,
        pinyin,
        english,
        context
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_id, mistake_key, skill)
      DO UPDATE SET
        word_id = COALESCE(EXCLUDED.word_id, user_mistakes.word_id),
        prompt = COALESCE(EXCLUDED.prompt, user_mistakes.prompt),
        user_answer = EXCLUDED.user_answer,
        correct_answer = COALESCE(EXCLUDED.correct_answer, user_mistakes.correct_answer),
        simplified = COALESCE(EXCLUDED.simplified, user_mistakes.simplified),
        pinyin = COALESCE(EXCLUDED.pinyin, user_mistakes.pinyin),
        english = COALESCE(EXCLUDED.english, user_mistakes.english),
        context = user_mistakes.context || EXCLUDED.context,
        mistake_count = user_mistakes.mistake_count + 1,
        last_mistake_at = now(),
        updated_at = now()
      RETURNING *
    `,
    [
      userId,
      mistakeKey,
      payload.wordId || payload.word_id || null,
      skill,
      compact(payload.prompt) || null,
      compact(payload.userAnswer || payload.user_answer) || null,
      compact(payload.correctAnswer || payload.correct_answer) || null,
      compact(payload.simplified) || null,
      compact(payload.pinyin) || null,
      compact(payload.english) || null,
      JSON.stringify(context)
    ]
  );

  return mapMistake(result.rows[0]);
};

export const listMistakes = async (userId, { limit = 30 } = {}) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const result = await query(
    `
      SELECT
        um.*,
        w.simplified AS word_simplified,
        w.pinyin AS word_pinyin,
        w.english AS word_english
      FROM user_mistakes um
      LEFT JOIN words w ON w.id = um.word_id
      WHERE um.user_id = $1
      ORDER BY
        GREATEST(um.mistake_count - um.resolved_count, 0) DESC,
        um.last_mistake_at DESC
      LIMIT $2
    `,
    [userId, normalizedLimit]
  );

  return {
    mistakes: result.rows.map(mapMistake)
  };
};

export const practiceMistake = async (userId, mistakeId, { correct }) => {
  const result = await query(
    `
      UPDATE user_mistakes
      SET resolved_count = CASE
            WHEN $3 = true THEN LEAST(mistake_count, resolved_count + 1)
            ELSE resolved_count
          END,
          mistake_count = CASE
            WHEN $3 = true THEN mistake_count
            ELSE mistake_count + 1
          END,
          last_practiced_at = now(),
          last_mistake_at = CASE
            WHEN $3 = true THEN last_mistake_at
            ELSE now()
          END,
          updated_at = now()
      WHERE user_id = $1 AND id = $2
      RETURNING *
    `,
    [userId, mistakeId, Boolean(correct)]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay loi can luyen.');
  }

  return {
    mistake: mapMistake(result.rows[0])
  };
};
