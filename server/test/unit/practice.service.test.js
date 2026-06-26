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

test('pronunciation score gives zero when no speech is detected', () => {
  const score = __private__.scoreFromTranscription('\u4f60\u597d', '', 1.2);

  assert.equal(score.transcribedText, '');
  assert.equal(score.accuracy, 0);
  assert.equal(score.tones, 0);
  assert.equal(score.fluency, 0);
  assert.equal(score.overall, 0);
  assert.ok(score.details.charDiff.every((entry) => entry.status === 'missing'));
});

test('pronunciation score ignores hallucinated STT text flagged as no speech', () => {
  const score = __private__.scoreFromSttResult('\u4f60\u597d', {
    text: '\u4f60\u597d',
    duration: 2.4,
    noSpeechProbability: 0.92
  });

  assert.equal(score.transcribedText, '');
  assert.equal(score.overall, 0);
  assert.ok(score.details.charDiff.every((entry) => entry.status === 'missing'));
});
