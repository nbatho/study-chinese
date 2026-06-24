import { query, withTransaction } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';
import { mapDailyStats, mapStreak, recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';
import { listMistakes, practiceMistake, recordMistake } from './mistake.service.js';

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

export const getTodayPlan = async (userId) => {
  const [
    profileResult,
    dueResult,
    mistakesResult,
    lessonsResult,
    statsResult
  ] = await Promise.all([
    query(
      `
        SELECT daily_minutes
        FROM users
        WHERE id = $1
      `,
      [userId]
    ),
    query(
      `
        SELECT count(*)::int AS due_count
        FROM srs_cards
        WHERE user_id = $1 AND due_date <= now()
      `,
      [userId]
    ),
    query(
      `
        SELECT
          skill,
          count(*)::int AS total,
          sum(GREATEST(mistake_count - resolved_count, 0))::int AS needs_practice
        FROM user_mistakes
        WHERE user_id = $1
        GROUP BY skill
        ORDER BY sum(GREATEST(mistake_count - resolved_count, 0)) DESC, max(last_mistake_at) DESC
        LIMIT 1
      `,
      [userId]
    ),
    query(
      `
        SELECT l.id, l.title, l.skill, l.estimated_minutes
        FROM lessons l
        LEFT JOIN user_lesson_progress ulp
          ON ulp.lesson_id = l.id AND ulp.user_id = $1
        WHERE l.is_active = true AND ulp.completed_at IS NULL
        ORDER BY l.hsk_level, l.order_num
        LIMIT 1
      `,
      [userId]
    ),
    query(
      `
        SELECT *
        FROM daily_stats
        WHERE user_id = $1
        ORDER BY date_key DESC
        LIMIT 1
      `,
      [userId]
    )
  ]);

  const dailyMinutes = Number(profileResult.rows[0]?.daily_minutes || 15);
  const dueCount = Number(dueResult.rows[0]?.due_count || 0);
  const weakSkill = mistakesResult.rows[0] || null;
  const nextLesson = lessonsResult.rows[0] || null;
  const todayStats = statsResult.rows[0] ? mapDailyStats(statsResult.rows[0]) : null;
  const xpTarget = Math.max(dailyMinutes * 3, 45);
  const steps = [];

  if (dueCount > 0) {
    steps.push({
      id: 'srs-review',
      kind: 'review',
      title: 'Ôn SRS đến hạn',
      description: `${dueCount} thẻ đang chờ ôn`,
      estimateMinutes: Math.min(10, Math.max(3, Math.ceil(dueCount / 3))),
      href: '/review',
      status: 'current',
      meta: { dueCount }
    });
  }

  if (weakSkill && Number(weakSkill.needs_practice || 0) > 0) {
    steps.push({
      id: 'weak-practice',
      kind: 'practice',
      title: 'Luyện điểm yếu',
      description: `${weakSkill.needs_practice} lỗi cần làm nguội - ${weakSkill.skill}`,
      estimateMinutes: 5,
      href: '/practice?tool=weak',
      status: steps.length === 0 ? 'current' : 'next',
      meta: {
        skill: weakSkill.skill,
        needsPracticeCount: Number(weakSkill.needs_practice)
      }
    });
  }

  if (nextLesson) {
    steps.push({
      id: 'next-lesson',
      kind: 'lesson',
      title: 'Học bài tiếp theo',
      description: `${nextLesson.title} - ${nextLesson.skill}`,
      estimateMinutes: Number(nextLesson.estimated_minutes || 5),
      href: `/learn?lesson=${nextLesson.id}`,
      status: steps.length === 0 ? 'current' : 'next',
      meta: {
        lessonId: nextLesson.id,
        skill: nextLesson.skill
      }
    });
  }

  steps.push({
    id: 'ai-warmup',
    kind: 'ai',
    title: 'Nói 3 câu với AI Tutor',
    description: weakSkill ? `Dùng điểm yếu ${weakSkill.skill} trong hội thoại` : 'Khởi động hội thoại ngắn',
    estimateMinutes: 4,
    href: '/ai-tutor',
    status: steps.length === 0 ? 'current' : 'next',
    meta: {
      focusSkill: weakSkill?.skill || null
    }
  });

  return {
    plan: {
      dateKey: new Date().toISOString().slice(0, 10),
      xpTarget,
      todayXp: todayStats?.xp || 0,
      dailyMinutes,
      steps: steps.slice(0, 4)
    }
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
    const mistake = payload.mistake ? await recordMistake(client, userId, payload.mistake) : null;

    return {
      ...activity,
      mistake,
      unlockedAchievements
    };
  });
};

export const getUserMistakes = async (userId, options) => listMistakes(userId, options);

export const createUserMistake = async (userId, payload) =>
  withTransaction(async (client) => ({
    mistake: await recordMistake(client, userId, payload)
  }));

export const recordMistakePractice = async (userId, mistakeId, payload) =>
  practiceMistake(userId, mistakeId, payload);
