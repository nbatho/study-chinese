import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createRateLimiter,
  requestId,
  requireTrustedOrigin,
  securityHeaders
} from '../../src/middlewares/security.middleware.js';

const createResponse = () => {
  const headers = new Map();

  return {
    headers,
    setHeader: (key, value) => headers.set(key, value)
  };
};

test('securityHeaders adds baseline hardening headers', () => {
  const res = createResponse();
  let calledNext = false;

  securityHeaders({}, res, () => {
    calledNext = true;
  });

  assert.equal(calledNext, true);
  assert.equal(res.headers.get('X-Frame-Options'), 'DENY');
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.match(res.headers.get('Content-Security-Policy'), /https:\/\/fonts\.googleapis\.com/);
  assert.match(res.headers.get('Content-Security-Policy'), /https:\/\/fonts\.gstatic\.com/);
  assert.match(res.headers.get('Content-Security-Policy'), /https:\/\/cdn\.jsdelivr\.net/);
});

test('requestId keeps incoming request id or creates one', () => {
  const req = { headers: { 'x-request-id': 'req_123' } };
  const res = createResponse();

  requestId(req, res, () => {});

  assert.equal(req.id, 'req_123');
  assert.equal(res.headers.get('X-Request-Id'), 'req_123');
});

test('requestId replaces malformed incoming values', () => {
  const req = { headers: { 'x-request-id': 'bad\r\nheader' } };
  const res = createResponse();

  requestId(req, res, () => {});

  assert.notEqual(req.id, 'bad\r\nheader');
  assert.match(req.id, /^[0-9a-f-]{36}$/);
  assert.equal(res.headers.get('X-Request-Id'), req.id);
});

test('trusted origin guard allows configured origins and rejects cross-site requests', () => {
  const allowedReq = { headers: { origin: 'http://localhost:5173' } };
  const blockedReq = { headers: { origin: 'https://evil.example' } };
  const errors = [];

  requireTrustedOrigin(allowedReq, createResponse(), (error) => errors.push(error));
  requireTrustedOrigin(blockedReq, createResponse(), (error) => errors.push(error));

  assert.equal(errors[0], undefined);
  assert.equal(errors[1].statusCode, 403);
  assert.equal(errors[1].errorCode, 'UNTRUSTED_ORIGIN');
});

test('rate limiter blocks after configured limit', () => {
  const limiter = createRateLimiter({ windowMs: 1000, max: 2, keyPrefix: 'test' });
  const req = { headers: {}, ip: '127.0.0.1', socket: {} };
  const res = createResponse();
  const errors = [];
  const next = (error) => errors.push(error);

  limiter(req, res, next);
  limiter(req, res, next);
  limiter(req, res, next);

  assert.equal(errors.length, 3);
  assert.equal(errors[0], undefined);
  assert.equal(errors[1], undefined);
  assert.equal(errors[2].statusCode, 429);
});

test('rate limiter keys by trusted request ip instead of spoofable forwarded header', () => {
  const limiter = createRateLimiter({ windowMs: 1000, max: 1, keyPrefix: 'spoof' });
  const req = {
    headers: { 'x-forwarded-for': '198.51.100.10' },
    ip: '127.0.0.1',
    socket: {}
  };
  const res = createResponse();
  const errors = [];

  limiter(req, res, (error) => errors.push(error));
  req.headers['x-forwarded-for'] = '203.0.113.20';
  limiter(req, res, (error) => errors.push(error));

  assert.equal(errors[0], undefined);
  assert.equal(errors[1].statusCode, 429);
});
