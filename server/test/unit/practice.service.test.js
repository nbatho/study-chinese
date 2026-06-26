import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/practice.service.js';

test('pronunciation score is based on STT transcript, not sample answer', () => {
  const score = __private__.scoreFromTranscription('你好', '再见', 1.2);

  assert.equal(score.transcribedText, '再见');
  assert.equal(score.accuracy, 0);
  assert.ok(score.overall < 50);
  assert.equal(score.details.charDiff[0].status, 'wrong');
});

test('pronunciation score rewards matching STT transcript', () => {
  const score = __private__.scoreFromTranscription('你好', '你好', 1.2);

  assert.equal(score.accuracy, 100);
  assert.ok(score.overall >= 90);
  assert.ok(score.details.charDiff.every((entry) => entry.status === 'correct'));
});
