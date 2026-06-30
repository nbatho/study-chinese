import assert from 'node:assert/strict';
import test from 'node:test';
import { mapDailyStats, mapStreak, toDateKey } from '../../src/services/activity.service.js';

test('toDateKey normalizes Date and string values', () => {
  assert.equal(toDateKey(new Date('2026-06-12T10:30:00.000Z')), '2026-06-12');
  assert.equal(toDateKey('2026-06-12T23:59:59.000Z'), '2026-06-12');
  assert.equal(toDateKey(null), null);
});

test('mapDailyStats coerces database numeric fields to numbers', () => {
  const stats = mapDailyStats({
    date_key: '2026-06-12',
    xp: '15',
    minutes_studied: '5',
    lessons_completed: '1',
    words_reviewed: '12',
    exercises_correct: '8',
    exercises_total: '10'
  });

  assert.deepEqual(stats, {
    dateKey: '2026-06-12',
    xp: 15,
    minutesStudied: 5,
    lessonsCompleted: 1,
    wordsReviewed: 12,
    exercisesCorrect: 8,
    exercisesTotal: 10
  });
});

test('mapStreak coerces streak counters and date keys', () => {
  const streak = mapStreak({
    current_streak: '3',
    best_streak: '8',
    last_study_date: new Date('2026-06-12T00:00:00.000Z'),
    streak_freezes: '2'
  });

  assert.deepEqual(streak, {
    current: 3,
    best: 8,
    lastStudyDateKey: '2026-06-12',
    streakFreezes: 2
  });
});
