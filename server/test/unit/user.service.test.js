import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/user.service.js';

test('today plan falls back to AI warmup for a new user', () => {
  const result = __private__.buildTodayPlanResponse({ dailyMinutes: 10 });

  assert.equal(result.plan.xpTarget, 45);
  assert.equal(result.plan.dailyMinutes, 10);
  assert.deepEqual(result.plan.steps.map((step) => step.id), ['ai-warmup']);
  assert.equal(result.plan.steps[0].status, 'current');
});

test('today plan prioritizes SRS, weak practice, lesson, then AI warmup', () => {
  const result = __private__.buildTodayPlanResponse({
    dailyMinutes: 20,
    dueCount: 9,
    weakSkill: { skill: 'tones', needs_practice: '3' },
    nextLesson: { id: 'hsk1-1', title: 'Hello', skill: 'speaking', estimated_minutes: 7 },
    todayStats: { xp: 12 }
  });

  assert.equal(result.plan.xpTarget, 60);
  assert.equal(result.plan.todayXp, 12);
  assert.deepEqual(result.plan.steps.map((step) => step.id), [
    'srs-review',
    'weak-practice',
    'next-lesson',
    'ai-warmup'
  ]);
  assert.equal(result.plan.steps[0].status, 'current');
  assert.equal(result.plan.steps[1].status, 'next');
  assert.equal(result.plan.steps[2].href, '/learn?lesson=hsk1-1');
});

test('activity numbers are bounded before recording client-provided stats', () => {
  assert.equal(
    __private__.normalizeActivityNumber('12.4', { field: 'minutes', max: 180 }),
    12
  );
  assert.throws(
    () => __private__.normalizeActivityNumber(181, { field: 'minutes', max: 180 }),
    /minutes/
  );
  assert.throws(
    () => __private__.normalizeActivityNumber(-1, { field: 'exercisesTotal', max: 200 }),
    /exercisesTotal/
  );
});
