import { query, withTransaction } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';
import { mapDailyStats, mapStreak, recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';

const mapProfile = (row) => ({
  name: row.name,
  avatar: row.avatar,
  startLevel: row.start_level,
  goalPurpose: row.goal_purpose,
  dailyMinutes: Number(row.daily_minutes),
  showPinyin: row.show_pinyin,
  audioAutoPlay: row.audio_auto_play,
  appAppearance: row.app_appearance,
  hasCompletedOnboarding: row.has_completed_onboarding,
  timezone: row.timezone,
  joinDate: row.join_date
});

const editableProfileFields = {
  name: 'name',
  avatar: 'avatar',
  startLevel: 'start_level',
  goalPurpose: 'goal_purpose',
  dailyMinutes: 'daily_minutes',
  showPinyin: 'show_pinyin',
  audioAutoPlay: 'audio_auto_play',
  appAppearance: 'app_appearance',
  hasCompletedOnboarding: 'has_completed_onboarding',
  timezone: 'timezone'
};

export const getUserProfile = async (userId) => {
  const result = await query(
    `
      SELECT *
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  const user = result.rows[0];

  return {
    profile: mapProfile(user),
    streak: mapStreak(user)
  };
};

export const updateUserProfile = async (userId, payload) => {
  const entries = Object.entries(editableProfileFields).filter(([field]) =>
    Object.prototype.hasOwnProperty.call(payload, field)
  );

  if (entries.length === 0) {
    return getUserProfile(userId);
  }

  const values = [userId];
  const setters = entries.map(([field, column], index) => {
    values.push(payload[field]);
    return `${column} = $${index + 2}`;
  });

  const result = await query(
    `
      UPDATE users
      SET ${setters.join(', ')},
          updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    values
  );

  return {
    profile: mapProfile(result.rows[0]),
    streak: mapStreak(result.rows[0])
  };
};

export const getUserStats = async (userId, days = 7) => {
  const normalizedDays = Math.min(Math.max(Number(days) || 7, 1), 365);
  const result = await query(
    `
      SELECT *
      FROM daily_stats
      WHERE user_id = $1
      ORDER BY date_key DESC
      LIMIT $2
    `,
    [userId, normalizedDays]
  );

  return {
    stats: result.rows.map(mapDailyStats)
  };
};

export const addUserActivity = async (userId, payload) => {
  const xp = Number(payload.xp || 0);
  const minutes = Number(payload.minutes || 0);
  const exercisesCorrect = Number(payload.exercisesCorrect || 0);
  const exercisesTotal = Number(payload.exercisesTotal || 0);
  const skillScore = Number(payload.skillScore || 0);

  if ([xp, minutes, exercisesCorrect, exercisesTotal, skillScore].some((value) => value < 0)) {
    throw badRequest('Các chỉ số hoạt động không được âm.');
  }

  return withTransaction(async (client) => {
    const activity = await recordActivity(client, userId, {
      xp,
      minutesStudied: minutes,
      exercisesCorrect,
      exercisesTotal
    });
    const unlockedAchievements = await evaluateAchievements(client, userId, {
      event: 'activity_recorded',
      skill: payload.skill,
      skillScore,
      xpEarned: xp,
      exercisesCorrect,
      exercisesTotal
    });

    return {
      ...activity,
      unlockedAchievements
    };
  });
};
