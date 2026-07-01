import { query } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';
import { getUserProfile } from './user.service.js';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const mapPlacementQuestion = (row) => ({
  id: row.id,
  section: row.section,
  cefrLevel: row.cefr_level,
  prompt: row.prompt,
  promptHanzi: row.prompt_hanzi,
  promptPinyin: row.prompt_pinyin,
  options: row.options || [],
  correctIndex: Number(row.correct_index),
  correctText: row.correct_text,
  explanation: row.explanation,
  difficulty: Number(row.difficulty),
  order: Number(row.order_num)
});

const normalizeCefrLevel = (value) => {
  const level = String(value || '').toUpperCase();

  if (!CEFR_LEVELS.includes(level)) {
    throw badRequest('CEFR level khong hop le.');
  }

  return level;
};

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw badRequest('Placement score khong hop le.');
  }

  return Math.round(score);
};

export const getPlacementQuestions = async () => {
  const result = await query(
    `
      SELECT *
      FROM placement_questions
      WHERE is_active = true
      ORDER BY order_num, difficulty, id
    `
  );

  return {
    questions: result.rows.map(mapPlacementQuestion)
  };
};

export const submitPlacementResult = async (userId, payload = {}) => {
  const cefrLevel = normalizeCefrLevel(payload.cefrLevel);
  const score = normalizeScore(payload.score);

  await query(
    `
      UPDATE users
      SET cefr_level = $2,
          placement_test_score = $3,
          placement_test_completed_at = COALESCE($4::timestamptz, now()),
          updated_at = now()
      WHERE id = $1
    `,
    [userId, cefrLevel, score, payload.completedAt || null]
  );

  return getUserProfile(userId);
};

export const __private__ = {
  mapPlacementQuestion,
  normalizeCefrLevel,
  normalizeScore
};
