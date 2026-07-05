import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/placement.service.js';

test('built-in placement bank covers advanced CEFR levels', () => {
  const levels = new Set(__private__.BUILT_IN_ADVANCED_QUESTIONS.map((question) => question.cefrLevel));

  assert.equal(levels.has('B2'), true);
  assert.equal(levels.has('C1'), true);
  assert.equal(levels.has('C2'), true);
});

test('placement CEFR maps to the matching start level', () => {
  assert.equal(__private__.CEFR_TO_START_LEVEL.A1, 'beginner');
  assert.equal(__private__.CEFR_TO_START_LEVEL.B2, 'upper_intermediate');
  assert.equal(__private__.CEFR_TO_START_LEVEL.C2, 'mastery');
});

test('placement score normalization rejects impossible scores', () => {
  assert.equal(__private__.normalizeScore('27.4'), 27);
  assert.throws(() => __private__.normalizeScore(-1), /Placement score/);
  assert.throws(() => __private__.normalizeScore(101), /Placement score/);
});
