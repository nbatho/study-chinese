import { query } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { badRequest, conflict, unauthorized } from '../utils/http-error.js';
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken
} from '../utils/auth.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const adminEmails = new Set(
  env.ADMIN_EMAILS.split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const mapAuthUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatar: row.avatar,
  role: row.role || (adminEmails.has(String(row.email).toLowerCase()) ? 'admin' : 'student')
});

const createAccessToken = (user) =>
  signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role || 'student'
  });

const createRefreshToken = (user) =>
  signRefreshToken({
    sub: user.id,
    tokenUse: 'refresh'
  });

const createAuthResponse = (user) => ({
  accessToken: createAccessToken(user),
  refreshToken: createRefreshToken(user),
  user
});

export const registerUser = async ({ email, password, name }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!emailPattern.test(normalizedEmail)) {
    throw badRequest('Email không hợp lệ.', { field: 'email' });
  }

  if (!password || password.length < 8) {
    throw badRequest('Mật khẩu phải có ít nhất 8 ký tự.', { field: 'password' });
  }

  const passwordHash = await hashPassword(password);

  const role = adminEmails.has(normalizedEmail) ? 'admin' : 'student';

  try {
    const result = await query(
      `
        INSERT INTO users (email, password_hash, name, role)
        VALUES ($1, $2, COALESCE(NULLIF($3, ''), 'Learner'), $4)
        RETURNING id, email, name, avatar, role
      `,
      [normalizedEmail, passwordHash, name?.trim(), role]
    );

    const user = mapAuthUser(result.rows[0]);

    return createAuthResponse(user);
  } catch (error) {
    if (error.code === '23505') {
      throw conflict('Email đã được sử dụng.');
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const result = await query(
    `
      SELECT id, email, password_hash, name, avatar, role, is_active
      FROM users
      WHERE lower(email) = $1 AND is_active = true
    `,
    [normalizedEmail]
  );

  const user = result.rows[0];

  if (!user || !(await verifyPassword(password || '', user.password_hash))) {
    throw unauthorized('Email hoặc mật khẩu không đúng.');
  }

  const authUser = mapAuthUser(user);

  return createAuthResponse(authUser);
};

export const refreshAuth = async (refreshToken) => {
  if (!refreshToken) {
    throw unauthorized('Refresh token is required.');
  }

  const payload = verifyRefreshToken(refreshToken);

  if (payload.tokenUse !== 'refresh') {
    throw unauthorized('Refresh token khong hop le.');
  }

  const result = await query(
    `
      SELECT id, email, name, avatar, role
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [payload.sub]
  );

  if (result.rowCount === 0) {
    throw unauthorized('Tai khoan khong con ton tai.');
  }

  return createAuthResponse(mapAuthUser(result.rows[0]));
};
