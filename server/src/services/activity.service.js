import { getDateKey, previousDateKey } from '../utils/date.js';

export const toDateKey = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

export const mapDailyStats = (row) => ({
  dateKey: toDateKey(row.date_key),
  xp: Number(row.xp),
  minutesStudied: Number(row.minutes_studied),
  lessonsCompleted: Number(row.lessons_completed),
  wordsReviewed: Number(row.words_reviewed),
  exercisesCorrect: Number(row.exercises_correct),
  exercisesTotal: Number(row.exercises_total)
});

export const mapStreak = (row) => ({
  current: Number(row.current_streak),
  best: Number(row.best_streak),
  lastStudyDateKey: toDateKey(row.last_study_date)
});

const updateStreak = async (client, userId, dateKey) => {
  const userResult = await client.query(
    `
      SELECT current_streak, best_streak, last_study_date
      FROM users
      WHERE id = $1
      FOR UPDATE
    `,
    [userId]
  );

  const user = userResult.rows[0];
  const lastStudyDate = toDateKey(user.last_study_date);

  if (lastStudyDate === dateKey) {
    return mapStreak(user);
  }

  const currentStreak =
    lastStudyDate === previousDateKey(dateKey) ? Number(user.current_streak) + 1 : 1;
  const bestStreak = Math.max(Number(user.best_streak), currentStreak);

  const updatedResult = await client.query(
    `
      UPDATE users
      SET current_streak = $2,
          best_streak = $3,
          last_study_date = $4,
          updated_at = now()
      WHERE id = $1
      RETURNING current_streak, best_streak, last_study_date
    `,
    [userId, currentStreak, bestStreak, dateKey]
  );

  return mapStreak(updatedResult.rows[0]);
};

export const recordActivity = async (client, userId, increments = {}) => {
  const userResult = await client.query('SELECT timezone FROM users WHERE id = $1', [userId]);
  const timezone = userResult.rows[0]?.timezone || 'UTC';
  const dateKey = getDateKey(timezone);

  const statsResult = await client.query(
    `
      INSERT INTO daily_stats (
        user_id,
        date_key,
        xp,
        minutes_studied,
        lessons_completed,
        words_reviewed,
        exercises_correct,
        exercises_total
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, date_key)
      DO UPDATE SET
        xp = daily_stats.xp + EXCLUDED.xp,
        minutes_studied = daily_stats.minutes_studied + EXCLUDED.minutes_studied,
        lessons_completed = daily_stats.lessons_completed + EXCLUDED.lessons_completed,
        words_reviewed = daily_stats.words_reviewed + EXCLUDED.words_reviewed,
        exercises_correct = daily_stats.exercises_correct + EXCLUDED.exercises_correct,
        exercises_total = daily_stats.exercises_total + EXCLUDED.exercises_total,
        updated_at = now()
      RETURNING *
    `,
    [
      userId,
      dateKey,
      Number(increments.xp || 0),
      Number(increments.minutesStudied || increments.minutes || 0),
      Number(increments.lessonsCompleted || 0),
      Number(increments.wordsReviewed || 0),
      Number(increments.exercisesCorrect || 0),
      Number(increments.exercisesTotal || 0)
    ]
  );

  const streak = await updateStreak(client, userId, dateKey);

  return {
    todayStats: mapDailyStats(statsResult.rows[0]),
    streak
  };
};
