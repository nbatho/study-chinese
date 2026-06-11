import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyPassword,
  verifyRefreshToken
} from '../../src/utils/auth.js';

test('password hashing verifies matching passwords only', async () => {
  const hash = await hashPassword('correct horse battery staple');

  assert.equal(await verifyPassword('correct horse battery staple', hash), true);
  assert.equal(await verifyPassword('wrong password', hash), false);
});

test('access and refresh tokens round-trip expected payloads', () => {
  const accessToken = signAccessToken({ sub: 'user_1', email: 'learner@example.com' });
  const refreshToken = signRefreshToken({ sub: 'user_1', tokenUse: 'refresh' });

  assert.equal(verifyAccessToken(accessToken).sub, 'user_1');
  assert.equal(verifyRefreshToken(refreshToken).tokenUse, 'refresh');
});

test('tampered token is rejected', () => {
  const token = signAccessToken({ sub: 'user_1' });
  const tampered = token.replace(/.$/, token.endsWith('a') ? 'b' : 'a');

  assert.throws(() => verifyAccessToken(tampered), /token/);
});
