import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { env } from '../config/env.config.js';
import { unauthorized } from './http-error.js';

const scrypt = promisify(crypto.scrypt);

const createSignature = (data) =>
  crypto.createHmac('sha256', env.JWT_SECRET).update(data).digest('base64url');

const parseJson = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const signToken = (payload, expiresInSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds
    })
  ).toString('base64url');
  const signature = createSignature(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
};

const verifyToken = (token, tokenName) => {
  try {
    const parts = token?.split('.');

    if (!parts || parts.length !== 3) {
      throw unauthorized(`${tokenName} token không hợp lệ.`);
    }

    const [header, body, signature] = parts;
    const expectedSignature = createSignature(`${header}.${body}`);

    if (!safeEqual(signature, expectedSignature)) {
      throw unauthorized(`${tokenName} token không hợp lệ.`);
    }

    const payload = parseJson(body);
    const now = Math.floor(Date.now() / 1000);

    if (!Number.isFinite(payload.exp)) {
      throw unauthorized(`${tokenName} token không hợp lệ.`);
    }

    if (payload.exp < now) {
      throw unauthorized(`${tokenName} token đã hết hạn.`);
    }

    return payload;
  } catch (error) {
    if (error.statusCode === 401) {
      throw error;
    }

    throw unauthorized(`${tokenName} token không hợp lệ.`);
  }
};

export const signAccessToken = (payload) => signToken(payload, env.JWT_EXPIRES_IN_SECONDS);

export const signRefreshToken = (payload) =>
  signToken(payload, env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);

export const verifyAccessToken = (token) => verifyToken(token, 'Access');

export const verifyRefreshToken = (token) => verifyToken(token, 'Refresh');

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('base64url');
  const derivedKey = await scrypt(password, salt, 64);

  return `scrypt$${salt}$${derivedKey.toString('base64url')}`;
};

export const verifyPassword = async (password, passwordHash) => {
  const [algorithm, salt, key] = passwordHash.split('$');

  if (algorithm !== 'scrypt' || !salt || !key) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64);
  return safeEqual(derivedKey.toString('base64url'), key);
};
