import crypto from 'node:crypto';
import { query, withTransaction } from '../config/db.config.js';
import { adminEmails, env } from '../config/env.config.js';
import { badRequest, conflict, unauthorized } from '../utils/http-error.js';
import { emailPattern } from '../utils/patterns.js';
import {
  sendChangePasswordOtpEmail,
  sendPasswordResetOtpEmail,
  sendVerificationEmail
} from './email.service.js';
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

const createEmailToken = () => {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, tokenHash: hashToken(token) };
};

const OTP_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 5;

export const OTP_PURPOSES = {
  passwordReset: 'password_reset',
  changePassword: 'change_password'
};

const createOtpCode = () =>
  crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');

// One live code per (user, purpose); re-requesting replaces it and resets attempts.
const issueOtpCode = async (userId, purpose) => {
  const code = createOtpCode();
  const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);

  await query(
    `
      INSERT INTO auth_otp_codes (user_id, purpose, code_hash, expires_at, attempts)
      VALUES ($1, $2, $3, $4, 0)
      ON CONFLICT (user_id, purpose)
      DO UPDATE SET code_hash = EXCLUDED.code_hash,
                    expires_at = EXCLUDED.expires_at,
                    attempts = 0,
                    created_at = now()
    `,
    [userId, purpose, hashToken(code), expiresAt]
  );

  return code;
};

// Single-use: a matching live code is deleted atomically; a wrong guess burns one
// of OTP_MAX_ATTEMPTS. Runs outside the caller's transaction on purpose — a rolled
// back password update must not refund a spent attempt.
const consumeOtpCode = async (userId, purpose, code) => {
  const invalidOtp = () => badRequest('Mã OTP không đúng hoặc đã hết hạn.', { field: 'otp' });

  if (typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
    throw invalidOtp();
  }

  const consumed = await query(
    `
      DELETE FROM auth_otp_codes
      WHERE user_id = $1
        AND purpose = $2
        AND code_hash = $3
        AND expires_at > now()
        AND attempts < $4
    `,
    [userId, purpose, hashToken(code.trim()), OTP_MAX_ATTEMPTS]
  );

  if (consumed.rowCount > 0) {
    return;
  }

  await query(
    `
      UPDATE auth_otp_codes
      SET attempts = attempts + 1
      WHERE user_id = $1 AND purpose = $2
    `,
    [userId, purpose]
  );

  throw invalidOtp();
};

const revokeAllRefreshTokens = (client, userId) =>
  client.query(
    `
      UPDATE auth_refresh_tokens
      SET revoked_at = now()
      WHERE user_id = $1 AND revoked_at IS NULL
    `,
    [userId]
  );

// Stores a fresh verification token then emails it. Email failures are logged,
// never surfaced — registration must not fail because the mail provider is down.
const issueEmailVerification = async (userId, email) => {
  const { token, tokenHash } = createEmailToken();
  const expiresAt = new Date(Date.now() + env.EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000);

  await query(
    `
      UPDATE users
      SET email_verification_token_hash = $2,
          email_verification_expires_at = $3
      WHERE id = $1
    `,
    [userId, tokenHash, expiresAt]
  );

  try {
    await sendVerificationEmail(email, token);
  } catch (error) {
    console.error(`[email] Gửi email xác thực tới ${email} thất bại:`, error.message);
  }
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

    await issueEmailVerification(user.id, user.email);

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

export const verifyEmail = async (token) => {
  if (typeof token !== 'string' || token.length === 0) {
    throw badRequest('Token xác thực không hợp lệ.');
  }

  const result = await query(
    `
      UPDATE users
      SET email_verified = true,
          email_verification_token_hash = NULL,
          email_verification_expires_at = NULL
      WHERE email_verification_token_hash = $1
        AND email_verification_expires_at > now()
        AND is_active = true
      RETURNING id
    `,
    [hashToken(token)]
  );

  if (result.rowCount === 0) {
    throw badRequest('Token xác thực không hợp lệ hoặc đã hết hạn.');
  }

  return { verified: true };
};

export const resendVerificationEmail = async (userId) => {
  const result = await query(
    `
      SELECT id, email, email_verified
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  if (user.email_verified) {
    return { alreadyVerified: true };
  }

  await issueEmailVerification(user.id, user.email);

  return { sent: true };
};

const findActiveUserByEmail = async (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!emailPattern.test(normalizedEmail)) {
    throw badRequest('Email không hợp lệ.', { field: 'email' });
  }

  const result = await query(
    `
      SELECT id, email
      FROM users
      WHERE lower(email) = $1 AND is_active = true
    `,
    [normalizedEmail]
  );

  return result.rows[0] ?? null;
};

// Always resolves successfully so the endpoint never leaks whether an email exists.
export const requestPasswordReset = async (email) => {
  const user = await findActiveUserByEmail(email);

  if (!user) {
    return { sent: true };
  }

  const code = await issueOtpCode(user.id, OTP_PURPOSES.passwordReset);

  try {
    await sendPasswordResetOtpEmail(user.email, code);
  } catch (error) {
    console.error(`[email] Gửi mã OTP đặt lại mật khẩu tới ${user.email} thất bại:`, error.message);
  }

  return { sent: true };
};

export const resetPassword = async (email, otp, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw badRequest('Mật khẩu phải có ít nhất 8 ký tự.', { field: 'password' });
  }

  const user = await findActiveUserByEmail(email);

  if (!user) {
    // Same error as a wrong code, so the endpoint never leaks whether an email exists.
    throw badRequest('Mã OTP không đúng hoặc đã hết hạn.', { field: 'otp' });
  }

  await consumeOtpCode(user.id, OTP_PURPOSES.passwordReset, otp);

  const passwordHash = await hashPassword(newPassword);

  return withTransaction(async (client) => {
    await client.query(
      `
        UPDATE users
        SET password_hash = $2,
            updated_at = now()
        WHERE id = $1
      `,
      [user.id, passwordHash]
    );

    await revokeAllRefreshTokens(client, user.id);

    return { reset: true };
  });
};

export const requestChangePasswordOtp = async (userId) => {
  const result = await query(
    `
      SELECT id, email
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  const code = await issueOtpCode(user.id, OTP_PURPOSES.changePassword);

  try {
    await sendChangePasswordOtpEmail(user.email, code);
  } catch (error) {
    console.error(`[email] Gửi mã OTP đổi mật khẩu tới ${user.email} thất bại:`, error.message);
    throw badRequest('Không gửi được email chứa mã OTP. Vui lòng thử lại.');
  }

  return { sent: true };
};

export const changePassword = async (userId, currentPassword, newPassword, otp) => {
  if (!newPassword || newPassword.length < 8) {
    throw badRequest('Mật khẩu mới phải có ít nhất 8 ký tự.', { field: 'newPassword' });
  }

  const result = await query(
    `
      SELECT id, email, password_hash, name, avatar, role
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  if (!(await verifyPassword(currentPassword || '', user.password_hash))) {
    throw unauthorized('Mật khẩu hiện tại không đúng.');
  }

  await consumeOtpCode(user.id, OTP_PURPOSES.changePassword, otp);

  const passwordHash = await hashPassword(newPassword);

  return withTransaction(async (client) => {
    await client.query(
      `
        UPDATE users
        SET password_hash = $2,
            updated_at = now()
        WHERE id = $1
      `,
      [userId, passwordHash]
    );

    // Other devices are forced to re-login; this session gets a fresh token pair.
    await revokeAllRefreshTokens(client, userId);

    return createAuthResponse(mapAuthUser(user), client);
  });
};

export const deleteUserAccount = async (userId, password) => {
  const result = await query(
    `
      SELECT id, password_hash
      FROM users
      WHERE id = $1 AND is_active = true
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw unauthorized('Tài khoản không còn tồn tại.');
  }

  if (!(await verifyPassword(password || '', user.password_hash))) {
    throw unauthorized('Mật khẩu không đúng.');
  }

  // Hard delete: every table referencing users(id) has ON DELETE CASCADE,
  // including auth_refresh_tokens, so all sessions and data go with the row.
  await query('DELETE FROM users WHERE id = $1', [userId]);

  return { deleted: true };
};

export const __private__ = {
  hashToken
};
