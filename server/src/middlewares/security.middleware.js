import crypto from 'node:crypto';
import { AppError } from '../utils/http-error.js';

const securityHeaderMap = {
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'; base-uri 'self'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none'
};

export const requestId = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const id = Array.isArray(incomingId) ? incomingId[0] : incomingId || crypto.randomUUID();

  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};

export const securityHeaders = (req, res, next) => {
  Object.entries(securityHeaderMap).forEach(([header, value]) => {
    res.setHeader(header, value);
  });

  next();
};

const getClientKey = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  return forwardedIp?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
};

export const createRateLimiter = ({
  windowMs,
  max,
  keyPrefix = 'global',
  message = 'Too many requests. Please try again later.'
}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${getClientKey(req)}`;
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - current.count)));
    res.setHeader('RateLimit-Reset', String(retryAfterSeconds));

    if (current.count > max) {
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return next(new AppError(429, 'RATE_LIMITED', message));
    }

    return next();
  };
};

export const generalRateLimit = createRateLimiter({
  keyPrefix: 'general',
  windowMs: 60 * 1000,
  max: 300
});

export const authRateLimit = createRateLimiter({
  keyPrefix: 'auth',
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again later.'
});

export const aiRateLimit = createRateLimiter({
  keyPrefix: 'ai',
  windowMs: 60 * 1000,
  max: 30,
  message: 'AI request limit reached. Please try again in a minute.'
});

export const ocrRateLimit = createRateLimiter({
  keyPrefix: 'ocr',
  windowMs: 60 * 1000,
  max: 10,
  message: 'OCR request limit reached. Please try again in a minute.'
});
