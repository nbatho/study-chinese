import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/srs.service.js';

const baseCard = {
  ease_factor: 2.5,
  interval_days: 0,
  repetitions: 0,
  correct_streak: 0,
  wrong_count: 0
};

test('calculateReview schedules a new good review for tomorrow', () => {
  const nextCard = __private__.calculateReview(baseCard, 'good');

  assert.equal(nextCard.easeFactor, 2.5);
  assert.equal(nextCard.intervalDays, 1);
  assert.equal(nextCard.repetitions, 1);
  assert.equal(nextCard.correctStreak, 1);
  assert.equal(nextCard.wrongCount, 0);
  assert.equal(nextCard.masteryLevel, 'learning');
  assert.equal(nextCard.xpEarned, 5);
  assert.ok(nextCard.dueDate instanceof Date);
});

test('calculateReview resets repetitions and lowers ease when answered again', () => {
  const nextCard = __private__.calculateReview(
    {
      ...baseCard,
      ease_factor: 1.35,
      interval_days: 3,
      repetitions: 3,
      correct_streak: 3
    },
    'again'
  );

  assert.equal(nextCard.easeFactor, 1.3);
  assert.equal(nextCard.intervalDays, 0.01);
  assert.equal(nextCard.repetitions, 0);
  assert.equal(nextCard.correctStreak, 0);
  assert.equal(nextCard.wrongCount, 1);
  assert.equal(nextCard.masteryLevel, 'learning');
  assert.equal(nextCard.xpEarned, 0);
});

test('calculateReview caps ease and maps long intervals to mastery', () => {
  const nextCard = __private__.calculateReview(
    {
      ...baseCard,
      ease_factor: 2.95,
      interval_days: 20,
      repetitions: 4,
      correct_streak: 4
    },
    'easy'
  );

  assert.equal(nextCard.easeFactor, 3);
  assert.equal(nextCard.intervalDays, 78);
  assert.equal(nextCard.repetitions, 5);
  assert.equal(nextCard.correctStreak, 5);
  assert.equal(nextCard.masteryLevel, 'mastered');
  assert.equal(nextCard.xpEarned, 8);
});

test('masteryFromInterval covers all review stages', () => {
  assert.equal(__private__.masteryFromInterval(0), 'new');
  assert.equal(__private__.masteryFromInterval(0.01), 'learning');
  assert.equal(__private__.masteryFromInterval(3), 'young');
  assert.equal(__private__.masteryFromInterval(14), 'mature');
  assert.equal(__private__.masteryFromInterval(30), 'mastered');
});
