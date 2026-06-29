import { query } from '../config/db.config.js';
import { badRequest, conflict, notFound } from '../utils/http-error.js';
import { listCourseIssueReports, updateCourseIssueReport } from './report.service.js';

const wordPartsOfSpeech = new Set([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'numeral',
  'measure',
  'phrase'
]);
const userRoles = new Set(['student', 'admin']);

const toPlainPinyin = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .toLowerCase()
    .trim();

const slugifyId = (value, fallbackPrefix) => {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40);

  return slug || `${fallbackPrefix}-${Date.now()}`;
};

const mapAdminLesson = (row) => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  hskLevel: Number(row.hsk_level),
  order: Number(row.order_num),
  skill: row.skill,
  estimatedMinutes: Number(row.estimated_minutes),
  xpReward: Number(row.xp_reward),
  intro: row.intro,
  dialogue: row.dialogue,
  isActive: row.is_active,
  contentVersion: Number(row.content_version),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapAdminWord = (row) => ({
  id: row.id,
  simplified: row.simplified,
  traditional: row.traditional,
  pinyin: row.pinyin,
  tones: row.tones || [],
  english: row.english,
  partOfSpeech: row.part_of_speech,
  hskLevel: Number(row.hsk_level),
  category: row.category,
  isActive: row.is_active,
  contentVersion: Number(row.content_version),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapAdminUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatar: row.avatar,
  role: row.role,
  isActive: row.is_active,
  startLevel: row.start_level,
  dailyMinutes: Number(row.daily_minutes),
  currentStreak: Number(row.current_streak),
  bestStreak: Number(row.best_streak),
  joinDate: row.join_date,
  updatedAt: row.updated_at
});

const mapAiLogSession = (row) => ({
  id: row.id,
  userId: row.user_id,
  userEmail: row.user_email,
  userName: row.user_name,
  scenarioId: row.scenario_id,
  scenarioTitle: row.scenario_title || row.title,
  title: row.title,
  messageCount: Number(row.message_count || 0),
  lastModelName: row.last_model_name,
  totalInputTokens: Number(row.total_input_tokens || 0),
  totalOutputTokens: Number(row.total_output_tokens || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  messages: row.messages || []
});

export const getAdminSummary = async () => {
  const [users, lessons, words, reports, chats] = await Promise.all([
    query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE role = 'admin')::int AS admins FROM users`),
    query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE is_active = true)::int AS active FROM lessons`),
    query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE is_active = true)::int AS active FROM words`),
    query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE status IN ('open', 'reviewing'))::int AS pending FROM course_issue_reports`),
    query(`SELECT count(*)::int AS sessions, count(*) FILTER (WHERE updated_at >= now() - interval '7 days')::int AS recent FROM chat_sessions`)
  ]);

  return {
    summary: {
      users: users.rows[0],
      lessons: lessons.rows[0],
      words: words.rows[0],
      reports: reports.rows[0],
      chats: chats.rows[0]
    }
  };
};

const shouldIncludeInactive = (value) => value === true || value === 'true' || value === '1';

export const listAdminLessons = async ({ q, includeInactive, limit = 100 } = {}) => {
  const values = [];
  const conditions = [];

  if (!shouldIncludeInactive(includeInactive)) {
    conditions.push('is_active = true');
  }

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(title ILIKE $${values.length} OR subtitle ILIKE $${values.length} OR id ILIKE $${values.length})`);
  }

  values.push(Math.min(Math.max(Number(limit) || 100, 1), 300));

  const result = await query(
    `
      SELECT *
      FROM lessons
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY hsk_level, order_num, title
      LIMIT $${values.length}
    `,
    values
  );

  return { lessons: result.rows.map(mapAdminLesson) };
};

export const upsertAdminLesson = async (payload, existingId = null) => {
  const id = existingId || String(payload.id || slugifyId(payload.title, 'lesson')).trim();
  const title = String(payload.title || '').trim();
  const subtitle = String(payload.subtitle || '').trim();
  const skill = String(payload.skill || 'vocabulary').trim();
  const intro = String(payload.intro || '').trim();
  const hskLevel = Number(payload.hskLevel || 1);
  const order = Number(payload.order || 1);
  const estimatedMinutes = Number(payload.estimatedMinutes || 5);
  const xpReward = Number(payload.xpReward || 20);
  const isActive = payload.isActive ?? true;

  if (!title || !subtitle || !intro) {
    throw badRequest('Bai hoc can co title, subtitle va intro.');
  }

  if (!Number.isInteger(hskLevel) || hskLevel < 0 || hskLevel > 9) {
    throw badRequest('HSK level khong hop le.');
  }

  const dialogue =
    typeof payload.dialogue === 'string'
      ? JSON.parse(payload.dialogue || 'null')
      : payload.dialogue || null;

  const result = existingId
    ? await query(
        `
          UPDATE lessons
          SET title = $2,
              subtitle = $3,
              hsk_level = $4,
              order_num = $5,
              skill = $6,
              estimated_minutes = $7,
              xp_reward = $8,
              intro = $9,
              dialogue = $10,
              is_active = $11,
              content_version = content_version + 1,
              updated_at = now()
          WHERE id = $1
          RETURNING *
        `,
        [id, title, subtitle, hskLevel, order, skill, estimatedMinutes, xpReward, intro, dialogue, isActive]
      )
    : await query(
        `
          INSERT INTO lessons (
            id,
            title,
            subtitle,
            hsk_level,
            order_num,
            skill,
            estimated_minutes,
            xp_reward,
            intro,
            dialogue,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `,
        [id, title, subtitle, hskLevel, order, skill, estimatedMinutes, xpReward, intro, dialogue, isActive]
      );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay bai hoc.');
  }

  return { lesson: mapAdminLesson(result.rows[0]) };
};

export const deleteAdminLesson = async (lessonId) => {
  const result = await query(
    `
      UPDATE lessons
      SET is_active = false,
          content_version = content_version + 1,
          updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    [lessonId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay bai hoc.');
  }

  return { lesson: mapAdminLesson(result.rows[0]) };
};

export const listAdminWords = async ({ q, includeInactive, limit = 100 } = {}) => {
  const values = [];
  const conditions = [];

  if (!shouldIncludeInactive(includeInactive)) {
    conditions.push('is_active = true');
  }

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`
      (
        simplified ILIKE $${values.length}
        OR traditional ILIKE $${values.length}
        OR pinyin ILIKE $${values.length}
        OR english ILIKE $${values.length}
        OR id ILIKE $${values.length}
      )
    `);
  }

  values.push(Math.min(Math.max(Number(limit) || 100, 1), 300));

  const result = await query(
    `
      SELECT *
      FROM words
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY hsk_level, category, simplified
      LIMIT $${values.length}
    `,
    values
  );

  return { words: result.rows.map(mapAdminWord) };
};

export const upsertAdminWord = async (payload, existingId = null) => {
  const simplified = String(payload.simplified || '').trim();
  const traditional = String(payload.traditional || simplified).trim();
  const pinyin = String(payload.pinyin || '').trim();
  const english = String(payload.english || '').trim();
  const partOfSpeech = String(payload.partOfSpeech || 'phrase').trim();
  const hskLevel = Number(payload.hskLevel ?? 1);
  const category = String(payload.category || 'General').trim();
  const tones = Array.isArray(payload.tones) ? payload.tones.map(Number).filter(Number.isFinite) : [];
  const id = existingId || String(payload.id || slugifyId(`${simplified}-${pinyin}`, 'word')).trim();
  const isActive = payload.isActive ?? true;

  if (!simplified || !pinyin || !english) {
    throw badRequest('Tu vung can co simplified, pinyin va english.');
  }

  if (!wordPartsOfSpeech.has(partOfSpeech)) {
    throw badRequest('Loai tu khong hop le.');
  }

  const pinyinPlain = toPlainPinyin(pinyin);
  const searchText = [simplified, traditional, pinyin, pinyinPlain, english, category].join(' ');

  const result = existingId
    ? await query(
        `
          UPDATE words
          SET simplified = $2,
              traditional = $3,
              pinyin = $4,
              pinyin_plain = $5,
              tones = $6,
              english = $7,
              part_of_speech = $8,
              hsk_level = $9,
              category = $10,
              search_text = $11,
              is_active = $12,
              content_version = content_version + 1,
              updated_at = now()
          WHERE id = $1
          RETURNING *
        `,
        [id, simplified, traditional, pinyin, pinyinPlain, tones, english, partOfSpeech, hskLevel, category, searchText, isActive]
      )
    : await query(
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
            search_text,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *
        `,
        [id, simplified, traditional, pinyin, pinyinPlain, tones, english, partOfSpeech, hskLevel, category, searchText, isActive]
      );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay tu vung.');
  }

  return { word: mapAdminWord(result.rows[0]) };
};

export const deleteAdminWord = async (wordId) => {
  const result = await query(
    `
      UPDATE words
      SET is_active = false,
          content_version = content_version + 1,
          updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    [wordId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay tu vung.');
  }

  return { word: mapAdminWord(result.rows[0]) };
};

export const listAdminUsers = async ({ q, limit = 100 } = {}) => {
  const values = [];
  const conditions = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(email ILIKE $${values.length} OR name ILIKE $${values.length})`);
  }

  values.push(Math.min(Math.max(Number(limit) || 100, 1), 300));

  const result = await query(
    `
      SELECT *
      FROM users
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY join_date DESC
      LIMIT $${values.length}
    `,
    values
  );

  return { users: result.rows.map(mapAdminUser) };
};

export const updateAdminUser = async (adminUserId, userId, payload) => {
  const entries = [];
  const values = [userId];

  if (Object.prototype.hasOwnProperty.call(payload, 'role')) {
    if (!userRoles.has(payload.role)) {
      throw badRequest('Role khong hop le.');
    }
    values.push(payload.role);
    entries.push(`role = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'isActive')) {
    if (userId === adminUserId && payload.isActive === false) {
      throw conflict('Admin khong the tu khoa tai khoan dang dung.');
    }
    values.push(Boolean(payload.isActive));
    entries.push(`is_active = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
    values.push(String(payload.name || '').trim() || 'Learner');
    entries.push(`name = $${values.length}`);
  }

  if (entries.length === 0) {
    throw badRequest('Khong co du lieu cap nhat.');
  }

  const result = await query(
    `
      UPDATE users
      SET ${entries.join(', ')},
          updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    values
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay nguoi dung.');
  }

  return { user: mapAdminUser(result.rows[0]) };
};

export const listAiLogs = async ({ limit = 30 } = {}) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const result = await query(
    `
      WITH selected_sessions AS (
        SELECT s.*
        FROM chat_sessions s
        ORDER BY s.updated_at DESC
        LIMIT $1
      )
      SELECT
        s.*,
        u.email AS user_email,
        u.name AS user_name,
        cs.title AS scenario_title,
        count(cm.id)::int AS message_count,
        max(cm.model_name) FILTER (WHERE cm.model_name IS NOT NULL) AS last_model_name,
        coalesce(sum((cm.token_usage->>'promptTokens')::int) FILTER (WHERE cm.token_usage ? 'promptTokens'), 0)::int AS total_input_tokens,
        coalesce(sum((cm.token_usage->>'completionTokens')::int) FILTER (WHERE cm.token_usage ? 'completionTokens'), 0)::int AS total_output_tokens,
        coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id', cm.id,
              'role', cm.role,
              'rawText', cm.raw_text,
              'simplified', coalesce(cm.normalized_simplified, cm.raw_text),
              'pinyin', cm.pinyin,
              'english', cm.english,
              'correction', cm.correction,
              'modelName', cm.model_name,
              'tokenUsage', cm.token_usage,
              'createdAt', cm.created_at
            )
            ORDER BY cm.created_at
          ) FILTER (WHERE cm.id IS NOT NULL),
          '[]'::jsonb
        ) AS messages
      FROM selected_sessions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN chat_scenarios cs ON cs.id = s.scenario_id
      LEFT JOIN chat_messages cm ON cm.session_id = s.id
      GROUP BY s.id, s.user_id, s.scenario_id, s.title, s.created_at, s.updated_at, u.email, u.name, cs.title
      ORDER BY s.updated_at DESC
    `,
    [normalizedLimit]
  );

  return { sessions: result.rows.map(mapAiLogSession) };
};

export const listAdminReports = listCourseIssueReports;
export const updateAdminReport = updateCourseIssueReport;
