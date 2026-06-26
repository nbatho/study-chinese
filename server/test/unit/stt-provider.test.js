import assert from 'node:assert/strict';
import test from 'node:test';
import { createMockTranscription } from '../../src/services/stt-provider.service.js';

test('mock STT does not return the expected answer as transcript', () => {
  const result = createMockTranscription('你好');

  assert.equal(result.text, '');
  assert.notEqual(result.text, '你好');
  assert.equal(result.provider, 'mock');
});
