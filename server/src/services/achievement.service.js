import { badRequest, notFound } from '../utils/http-error.js';

export const mapAchievement = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  emoji: row.emoji,
  targetValue: Number(row.target_value),
  category: row.category,
  unlockedAt: row.unlocked_at
});

const numberFrom = (row, key) => Number(row?.[key] || 0);

export const getAchievements = async (client, userId) => {
  const result = await client.query(
    `
      SELECT a.*, ua.unlocked_at
      FROM achievements a
      LEFT JOIN user_achievements ua
        ON ua.achievement_id = a.id AND ua.user_id = $1
      WHERE a.is_active = true
      ORDER BY a.category, a.target_value, a.id
    `,
    [userId]
  );

  return {
    achievements: result.rows.map(mapAchievement)
  };
};

const getUserAchievementProgress = async (client, userId) => {
  // This runs inside write transactions on every graded exercise, so the four
  // scalar lookups are folded into one statement (2 round trips instead of 5).
  const scalarResult = await client.query(
    `
      SELECT
        u.current_streak,
        u.best_streak,
        ds.total_xp,
        ds.words_reviewed,
        ds.exercises_correct,
        lp.lessons_completed,
        lp.best_lesson_accuracy,
        vc.vocabulary_count
      FROM users u
      LEFT JOIN LATERAL (
        SELECT
          COALESCE(SUM(xp), 0) AS total_xp,
          COALESCE(SUM(words_reviewed), 0) AS words_reviewed,
          COALESCE(SUM(exercises_correct), 0) AS exercises_correct
        FROM daily_stats
        WHERE user_id = u.id
      ) ds ON true
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS lessons_completed,
          COALESCE(MAX(ulp.best_accuracy), 0) AS best_lesson_accuracy
        FROM user_lesson_progress ulp
        JOIN lessons l ON l.id = ulp.lesson_id
        WHERE ulp.user_id = u.id
          AND ulp.completed_at IS NOT NULL
          AND l.is_active = true
      ) lp ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS vocabulary_count
        FROM srs_cards
        WHERE user_id = u.id
      ) vc ON true
      WHERE u.id = $1
    `,
    [userId]
  );

  const hskResult = await client.query(
    `
      SELECT
        l.hsk_level,
        COUNT(*) AS active_count,
        COUNT(ulp.completed_at) AS completed_count
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id
       AND ulp.user_id = $1
       AND ulp.completed_at IS NOT NULL
      WHERE l.is_active = true
      GROUP BY l.hsk_level
    `,
    [userId]
  );

  const scalars = scalarResult.rows[0] || {};

  return {
    totalXp: numberFrom(scalars, 'total_xp'),
    lessonsCompleted: numberFrom(scalars, 'lessons_completed'),
    bestLessonAccuracy: numberFrom(scalars, 'best_lesson_accuracy'),
    wordsReviewed: numberFrom(scalars, 'words_reviewed'),
    vocabularyCount: numberFrom(scalars, 'vocabulary_count'),
    exercisesCorrect: numberFrom(scalars, 'exercises_correct'),
    currentStreak: numberFrom(scalars, 'current_streak'),
    bestStreak: numberFrom(scalars, 'best_streak'),
    completedHskLevels: new Set(
      hskResult.rows
        .filter((row) => Number(row.active_count) > 0 && Number(row.completed_count) >= Number(row.active_count))
        .map((row) => Number(row.hsk_level))
    )
  };
};

const normalizeSkill = (value) => String(value || '').toLowerCase().replace(/[_\s-]+/g, '');

const skillMatches = (achievement, progress, context) => {
  const id = normalizeSkill(achievement.id);
  const skill = normalizeSkill(context.skill || context.lessonSkill);
  const target = Number(achievement.target_value);
  const lessonAccuracy = Number(context.lessonAccuracy ?? context.accuracy ?? 0);
  const skillScore = Number(context.skillScore ?? 0);
  const eventScore = Math.max(skillScore, lessonAccuracy);

  if (id.includes('tone')) {
    return ['tone', 'tones', 'tonedrill', 'pronunciation'].includes(skill) && eventScore >= target;
  }

  if (id.includes('shadow') || id.includes('speak') || id.includes('pronunciation')) {
    return ['shadow', 'speaking', 'pronunciation'].includes(skill) && eventScore >= target;
  }

  if (id.includes('hanzi') || id.includes('write') || id.includes('stroke')) {
    return ['hanzi', 'writing', 'stroke'].includes(skill) && eventScore >= target;
  }

  if (id.includes('listen')) {
    return ['listening', 'listen'].includes(skill) && eventScore >= target;
  }

  if (id.includes('typing') || id.includes('pinyin')) {
    return ['typing', 'pinyin'].includes(skill) && eventScore >= target;
  }

  if (id.includes('perfect') || id.includes('accuracy')) {
    return Math.max(eventScore, progress.bestLessonAccuracy) >= target;
  }

  return Math.max(progress.exercisesCorrect, eventScore) >= target;
};

export const isAchievementEarned = (achievement, progress, context = {}) => {
  const target = Number(achievement.target_value);

  switch (achievement.category) {
    case 'lessons':
      return progress.lessonsCompleted >= target;
    case 'streak':
      return Math.max(progress.currentStreak, progress.bestStreak) >= target;
    case 'vocabulary':
      return Math.max(progress.vocabularyCount, progress.wordsReviewed) >= target;
    case 'xp':
      return progress.totalXp >= target;
    case 'hsk':
      return progress.completedHskLevels.has(target);
    case 'skill':
      return skillMatches(achievement, progress, context);
    default:
      return false;
  }
};

export const evaluateAchievements = async (client, userId, context = {}) => {
  const achievementsResult = await client.query(
    `
      SELECT a.*
      FROM achievements a
      LEFT JOIN user_achievements ua
        ON ua.achievement_id = a.id AND ua.user_id = $1
      WHERE a.is_active = true
        AND ua.achievement_id IS NULL
      ORDER BY a.category, a.target_value, a.id
    `,
    [userId]
  );

  if (achievementsResult.rowCount === 0) {
    return [];
  }

  const progress = await getUserAchievementProgress(client, userId);
  const earned = achievementsResult.rows.filter((achievement) =>
    isAchievementEarned(achievement, progress, context)
  );

  const unlocked = [];

  for (const achievement of earned) {
    const insertResult = await client.query(
      `
        INSERT INTO user_achievements (user_id, achievement_id, trigger_context)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, achievement_id) DO NOTHING
        RETURNING unlocked_at
      `,
      [userId, achievement.id, JSON.stringify(context)]
    );

    if (insertResult.rowCount > 0) {
      unlocked.push(
        mapAchievement({
          ...achievement,
          unlocked_at: insertResult.rows[0].unlocked_at
        })
      );
    }
  }

  return unlocked;
};

export const unlockAchievement = async (client, userId, achievementId) => {
  const achievementResult = await client.query(
    `
      SELECT *
      FROM achievements
      WHERE id = $1 AND is_active = true
    `,
    [achievementId]
  );

  if (achievementResult.rowCount === 0) {
    throw notFound('Khong tim thay thanh tuu.');
  }

  const existingResult = await client.query(
    `
      SELECT unlocked_at
      FROM user_achievements
      WHERE user_id = $1 AND achievement_id = $2
    `,
    [userId, achievementId]
  );

  if (existingResult.rowCount > 0) {
    return {
      unlocked: false,
      achievement: mapAchievement({
        ...achievementResult.rows[0],
        unlocked_at: existingResult.rows[0].unlocked_at
      })
    };
  }

  const context = {
    event: 'manual_unlock_check',
    requestedAchievementId: achievementId
  };
  const progress = await getUserAchievementProgress(client, userId);
  const achievementRow = achievementResult.rows[0];

  if (!isAchievementEarned(achievementRow, progress, context)) {
    throw badRequest('Ban chua dat dieu kien mo thanh tuu nay.');
  }

  const insertResult = await client.query(
    `
      INSERT INTO user_achievements (user_id, achievement_id, trigger_context)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, achievement_id) DO NOTHING
      RETURNING unlocked_at
    `,
    [userId, achievementId, JSON.stringify(context)]
  );
  const achievement = mapAchievement({
    ...achievementRow,
    unlocked_at: insertResult.rows[0]?.unlocked_at
  });

  return {
    unlocked: true,
    achievement
  };
};

export const __private__ = {
  isAchievementEarned,
  skillMatches
};
