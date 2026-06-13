import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/achievement.service.js';

const baseProgress = {
  totalXp: 0,
  lessonsCompleted: 0,
  bestLessonAccuracy: 0,
  wordsReviewed: 0,
  vocabularyCount: 0,
  exercisesCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  completedHskLevels: new Set()
};

const achievement = (category, targetValue, id = `${category}_${targetValue}`) => ({
  id,
  category,
  target_value: targetValue
});

test('isAchievementEarned evaluates progress categories', () => {
  const progress = {
    ...baseProgress,
    totalXp: 120,
    lessonsCompleted: 5,
    wordsReviewed: 8,
    vocabularyCount: 12,
    bestStreak: 3
  };

  assert.equal(__private__.isAchievementEarned(achievement('xp', 100), progress), true);
  assert.equal(__private__.isAchievementEarned(achievement('lessons', 5), progress), true);
  assert.equal(__private__.isAchievementEarned(achievement('vocabulary', 10), progress), true);
  assert.equal(__private__.isAchievementEarned(achievement('streak', 7), progress), false);
});

test('isAchievementEarned requires every active lesson in an HSK level to be complete', () => {
  const progress = {
    ...baseProgress,
    completedHskLevels: new Set([1, 3])
  };

  assert.equal(__private__.isAchievementEarned(achievement('hsk', 1), progress), true);
  assert.equal(__private__.isAchievementEarned(achievement('hsk', 2), progress), false);
});

test('isAchievementEarned evaluates skill achievements from activity context', () => {
  assert.equal(
    __private__.isAchievementEarned(
      achievement('skill', 80, 'tone_master'),
      baseProgress,
      { skill: 'tones', skillScore: 100 }
    ),
    true
  );

  assert.equal(
    __private__.isAchievementEarned(
      achievement('skill', 80, 'shadow_speaker'),
      baseProgress,
      { skill: 'typing', skillScore: 100 }
    ),
    false
  );

  assert.equal(
    __private__.isAchievementEarned(
      achievement('skill', 80, 'tone_master'),
      { ...baseProgress, bestLessonAccuracy: 100 },
      { skill: 'tones', skillScore: 0 }
    ),
    false
  );

  assert.equal(
    __private__.isAchievementEarned(
      achievement('skill', 100, 'perfect_lesson'),
      { ...baseProgress, bestLessonAccuracy: 100 }
    ),
    true
  );
});
