import crypto from 'node:crypto';
import { query, withTransaction } from '../config/db.config.js';
import { adminEmails, env } from '../config/env.config.js';
import { badRequest, conflict, unauthorized } from '../utils/http-error.js';
import { emailPattern } from '../utils/patterns.js';
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken
} from '../utils/auth.js';

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

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('base64url');

const createRefreshToken = (user, tokenId = crypto.randomUUID()) =>
  signRefreshToken({
    sub: user.id,
    tokenUse: 'refresh',
    jti: tokenId
  });

const storeRefreshToken = async (client, user, tokenId, refreshToken) => {
  await client.query(
    `
      INSERT INTO auth_refresh_tokens (token_id, user_id, token_hash, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
    [
      tokenId,
      user.id,
      hashToken(refreshToken),
      new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000)
    ]
  );
};

const createAuthResponse = async (user, client = { query }) => {
  const tokenId = crypto.randomUUID();
  const refreshToken = createRefreshToken(user, tokenId);
  await storeRefreshToken(client, user, tokenId, refreshToken);

  return {
    accessToken: createAccessToken(user),
    refreshToken,
    user
  };
};

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
    throw unauthorized('Refresh token không hợp lệ.');
  }

  if (!payload.jti) {
    throw unauthorized('Refresh token không hợp lệ.');
  }

  return withTransaction(async (client) => {
    const result = await client.query(
      `
        SELECT u.id, u.email, u.name, u.avatar, u.role
        FROM auth_refresh_tokens rt
        JOIN users u ON u.id = rt.user_id
        WHERE rt.token_id = $1
          AND rt.user_id = $2
          AND rt.token_hash = $3
          AND rt.revoked_at IS NULL
          AND rt.expires_at > now()
          AND u.is_active = true
        FOR UPDATE OF rt
      `,
      [payload.jti, payload.sub, hashToken(refreshToken)]
    );

    if (result.rowCount === 0) {
      throw unauthorized('Refresh token không hợp lệ hoặc đã bị thu hồi.');
    }

    const user = mapAuthUser(result.rows[0]);
    const nextTokenId = crypto.randomUUID();
    const nextRefreshToken = createRefreshToken(user, nextTokenId);
    await storeRefreshToken(client, user, nextTokenId, nextRefreshToken);
    await client.query(
      `
        UPDATE auth_refresh_tokens
        SET revoked_at = now(),
            replaced_by_token_id = $2
        WHERE token_id = $1
      `,
      [payload.jti, nextTokenId]
    );

    return {
      accessToken: createAccessToken(user),
      refreshToken: nextRefreshToken,
      user
    };
  });
};

export const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (payload.tokenUse !== 'refresh' || !payload.jti) {
      return;
    }

    await query(
      `
        UPDATE auth_refresh_tokens
        SET revoked_at = COALESCE(revoked_at, now())
        WHERE token_id = $1
          AND user_id = $2
          AND token_hash = $3
      `,
      [payload.jti, payload.sub, hashToken(refreshToken)]
    );
  } catch {
    // Logout should still clear the browser cookie even if the token is malformed.
  }
};

export const __private__ = {
  hashToken
};
