import { query } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';

const allowedCategories = new Set(['content', 'translation', 'audio', 'exercise', 'technical', 'other']);
const allowedStatuses = new Set(['open', 'reviewing', 'resolved', 'dismissed']);

export const mapCourseIssueReport = (row) => ({
  id: row.id,
  userId: row.user_id,
  userEmail: row.user_email,
  userName: row.user_name,
  lessonId: row.lesson_id,
  lessonTitle: row.lesson_title,
  wordId: row.word_id,
  wordText: row.word_text,
  exerciseId: row.exercise_id,
  category: row.category,
  status: row.status,
  message: row.message,
  adminNote: row.admin_note,
  resolvedBy: row.resolved_by,
  resolvedAt: row.resolved_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const createCourseIssueReport = async (userId, lessonId, payload) => {
  const category = String(payload.category || 'content').trim();
  const message = String(payload.message || '').trim();
  const wordId = payload.wordId ? String(payload.wordId).trim() : null;
  const exerciseId = payload.exerciseId ? String(payload.exerciseId).trim() : null;

  if (!allowedCategories.has(category)) {
    throw badRequest('Loại báo lỗi không hợp lệ.');
  }

  if (!message || message.length < 5) {
    throw badRequest('Noi dung bao loi phai co it nhat 5 ky tu.');
  }

  const lessonResult = await query(
    `
      SELECT id
      FROM lessons
      WHERE id = $1
    `,
    [lessonId]
  );

  if (lessonResult.rowCount === 0) {
    throw notFound('Khong tim thay bai hoc.');
  }

  const result = await query(
    `
      INSERT INTO course_issue_reports (
        user_id,
        lesson_id,
        word_id,
        exercise_id,
        category,
        message
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [userId, lessonId, wordId, exerciseId, category, message]
  );

  return {
    report: mapCourseIssueReport(result.rows[0])
  };
};

export const listCourseIssueReports = async ({ status, limit = 50 } = {}) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const values = [];
  const conditions = [];

  if (status && allowedStatuses.has(status)) {
    values.push(status);
    conditions.push(`cir.status = $${values.length}`);
  }

  values.push(normalizedLimit);

  const result = await query(
    `
      SELECT
        cir.*,
        u.email AS user_email,
        u.name AS user_name,
        l.title AS lesson_title,
        w.simplified AS word_text
      FROM course_issue_reports cir
      LEFT JOIN users u ON u.id = cir.user_id
      LEFT JOIN lessons l ON l.id = cir.lesson_id
      LEFT JOIN words w ON w.id = cir.word_id
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY
        CASE cir.status
          WHEN 'open' THEN 1
          WHEN 'reviewing' THEN 2
          WHEN 'resolved' THEN 3
          ELSE 4
        END,
        cir.created_at DESC
      LIMIT $${values.length}
    `,
    values
  );

  return {
    reports: result.rows.map(mapCourseIssueReport)
  };
};

export const updateCourseIssueReport = async (adminUserId, reportId, payload) => {
  const entries = [];
  const values = [reportId];

  if (Object.prototype.hasOwnProperty.call(payload, 'status')) {
    if (!allowedStatuses.has(payload.status)) {
      throw badRequest('Trạng thái báo lỗi không hợp lệ.');
    }
    values.push(payload.status);
    entries.push(`status = $${values.length}`);
    if (payload.status === 'resolved' || payload.status === 'dismissed') {
      values.push(adminUserId);
      entries.push(`resolved_by = $${values.length}`);
      entries.push('resolved_at = now()');
    } else {
      entries.push('resolved_by = NULL');
      entries.push('resolved_at = NULL');
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'adminNote')) {
    values.push(String(payload.adminNote || '').trim() || null);
    entries.push(`admin_note = $${values.length}`);
  }

  if (entries.length === 0) {
    throw badRequest('Khong co du lieu cap nhat.');
  }

  const result = await query(
    `
      UPDATE course_issue_reports
      SET ${entries.join(', ')},
          updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    values
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay bao loi.');
  }

  return {
    report: mapCourseIssueReport(result.rows[0])
  };
};
