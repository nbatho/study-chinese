import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/ai.service.js';

test('AI correction payload is recorded as a weak-practice mistake', () => {
  const payload = __private__.buildCorrectionMistakePayload({
    correction: {
      original: 'wo yao cha',
      improved: '我要茶。',
      explanation: 'Use the corrected sentence.'
    },
    userText: 'wo yao cha',
    sessionId: 'session-1',
    scenario: { id: 'personal-weak' }
  });

  assert.deepEqual(payload, {
    skill: 'ai-tutor',
    prompt: 'wo yao cha',
    userAnswer: 'wo yao cha',
    correctAnswer: '我要茶。',
    simplified: '我要茶。',
    english: 'Use the corrected sentence.',
    context: {
      source: 'ai-tutor',
      sessionId: 'session-1',
      scenarioId: 'personal-weak',
      explanation: 'Use the corrected sentence.'
    }
  });
});

test('AI correction payload is skipped when no correction is present', () => {
  assert.equal(__private__.buildCorrectionMistakePayload({
    correction: null,
    userText: '你好',
    sessionId: 'session-1',
    scenario: null
  }), null);
});

test('learning context is compact and empty-safe for a new user', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    }
  };

  const context = await __private__.getLearningContext(client, 'user-1');

  assert.deepEqual(context, {
    mistakes: [],
    listWords: [],
    recentLesson: null
  });
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map((call) => call.params), [['user-1'], ['user-1'], ['user-1']]);
});

test('AI message length is capped before opening a transaction', () => {
  assert.throws(
    () => __private__.validateChatText('x'.repeat(2001)),
    (error) => error.statusCode === 400 && error.details.maxLength === 2000
  );
});
