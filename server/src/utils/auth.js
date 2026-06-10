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

export const signAccessToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + env.JWT_EXPIRES_IN_SECONDS
    })
  ).toString('base64url');
  const signature = createSignature(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
};

export const verifyAccessToken = (token) => {
  try {
    const parts = token?.split('.');

    if (!parts || parts.length !== 3) {
      throw unauthorized('Access token không hợp lệ.');
    }

    const [header, body, signature] = parts;
    const expectedSignature = createSignature(`${header}.${body}`);

    if (!safeEqual(signature, expectedSignature)) {
      throw unauthorized('Access token không hợp lệ.');
    }

    const payload = parseJson(body);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      throw unauthorized('Access token đã hết hạn.');
    }

    return payload;
  } catch (error) {
    if (error.statusCode === 401) {
      throw error;
    }

    throw unauthorized('Access token không hợp lệ.');
  }
};

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
