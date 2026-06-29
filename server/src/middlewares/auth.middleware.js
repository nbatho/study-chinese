import { query } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { asyncHandler } from '../utils/async-handler.js';
import { forbidden, unauthorized } from '../utils/http-error.js';
import { verifyAccessToken } from '../utils/auth.js';

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length);
};

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    throw unauthorized();
  }

  const payload = verifyAccessToken(token);
  const result = await query(
    `
      SELECT id, email, name, avatar, timezone, role, is_active
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [payload.sub]
  );

  if (result.rowCount === 0) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  const user = result.rows[0];
  const isEnvAdmin = adminEmails.has(String(user.email).toLowerCase());

  req.user = {
    ...user,
    role: isEnvAdmin ? 'admin' : user.role || payload.role || 'student'
  };

  next();
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(forbidden('Chi admin moi co quyen thuc hien thao tac nay.'));
  }

  return next();
};

const adminEmails = new Set(
  env.ADMIN_EMAILS.split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);
