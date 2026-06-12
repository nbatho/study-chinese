import { query } from '../config/db.config.js';
import { asyncHandler } from '../utils/async-handler.js';
import { unauthorized } from '../utils/http-error.js';
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
      SELECT id, email, name, avatar, timezone
      FROM users
      WHERE id = $1
    `,
    [payload.sub]
  );

  if (result.rowCount === 0) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  req.user = {
    ...result.rows[0],
    role: payload.role || 'student'
  };

  next();
});
