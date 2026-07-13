import crypto from 'node:crypto';
import { badRequest } from './http-error.js';

// Verifies Google Sign-In ID tokens locally, mirroring this codebase's dependency-free
// JWT handling instead of pulling in google-auth-library. We fetch Google's public
// JWKS (cached per Cache-Control), verify the RS256 signature, then check the standard
// issuer / audience / expiry claims. See:
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);
const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000;

let jwksCache = { keys: new Map(), expiresAt: 0 };

const decodeSegment = (segment) => JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));

const invalidToken = () => badRequest('Google token không hợp lệ.');

const fetchJwks = async () => {
  if (jwksCache.expiresAt > Date.now() && jwksCache.keys.size > 0) {
    return jwksCache.keys;
  }

  const response = await fetch(GOOGLE_JWKS_URL);

  if (!response.ok) {
    throw new Error(`Không tải được khóa công khai của Google (HTTP ${response.status}).`);
  }

  const body = await response.json();
  const keys = new Map();

  for (const jwk of body.keys ?? []) {
    keys.set(jwk.kid, jwk);
  }

  const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('cache-control') || '')?.[1]);
  const ttl = Number.isFinite(maxAge) && maxAge > 0 ? maxAge * 1000 : DEFAULT_CACHE_TTL_MS;
  jwksCache = { keys, expiresAt: Date.now() + ttl };

  return keys;
};

// Google rotates signing keys; if the token's kid is missing we bust the cache once
// before giving up in case we're holding a stale key set.
const resolveJwk = async (kid) => {
  let keys = await fetchJwks();
  let jwk = keys.get(kid);

  if (!jwk) {
    jwksCache.expiresAt = 0;
    keys = await fetchJwks();
    jwk = keys.get(kid);
  }

  return jwk;
};

export const verifyGoogleIdToken = async (idToken, clientId) => {
  if (!clientId) {
    throw badRequest('Đăng nhập bằng Google chưa được cấu hình.');
  }

  if (typeof idToken !== 'string' || idToken.split('.').length !== 3) {
    throw invalidToken();
  }

  const [headerSegment, payloadSegment, signatureSegment] = idToken.split('.');

  let header;
  let payload;

  try {
    header = decodeSegment(headerSegment);
    payload = decodeSegment(payloadSegment);
  } catch {
    throw invalidToken();
  }

  if (header.alg !== 'RS256' || !header.kid) {
    throw invalidToken();
  }

  const jwk = await resolveJwk(header.kid);

  if (!jwk) {
    throw invalidToken();
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const isValidSignature = crypto.verify(
    'RSA-SHA256',
    Buffer.from(`${headerSegment}.${payloadSegment}`),
    publicKey,
    Buffer.from(signatureSegment, 'base64url')
  );

  if (!isValidSignature) {
    throw invalidToken();
  }

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (!GOOGLE_ISSUERS.has(payload.iss)) {
    throw invalidToken();
  }

  if (!audiences.includes(clientId)) {
    throw invalidToken();
  }

  if (!Number.isFinite(payload.exp) || payload.exp < now) {
    throw badRequest('Phiên đăng nhập Google đã hết hạn. Vui lòng thử lại.');
  }

  return payload;
};
