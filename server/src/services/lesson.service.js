import { query, withTransaction } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';
import { mapWord } from './vocab.service.js';

const mapLessonSummary = (row) => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  hskLevel: Number(row.hsk_level),
  order: Number(row.order_num),
  skill: row.skill,
  estimatedMinutes: Number(row.estimated_minutes),
  xpReward: Number(row.xp_reward),
  completedAt: row.completed_at,
  bestAccuracy: Number(row.best_accuracy || 0),
  attempts: Number(row.attempts || 0)
});

const mapGrammarPoint = (row) => ({
  id: row.id,
  pattern: row.pattern,
  explanation: row.explanation,
  tips: row.tips || [],
  examples: row.examples || []
});

const mapExercise = (row) => ({
  id: row.id,
  kind: row.kind,
  prompt: row.prompt,
  promptHanzi: row.prompt_hanzi,
  promptPinyin: row.prompt_pinyin,
  promptEnglish: row.prompt_english,
  options: row.options || [],
  correctIndex: row.correct_index,
  correctText: row.correct_text,
  audioWordId: row.audio_word_id,
  tone: row.tone
});

export const getLessons = async (userId) => {
  const result = await query(
    `
      SELECT
        l.*,
        ulp.completed_at,
        ulp.best_accuracy,
        ulp.attempts
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $1
      WHERE l.is_active = true
      ORDER BY l.hsk_level, l.order_num
    `,
    [userId]
  );

  return {
    lessons: result.rows.map(mapLessonSummary)
  };
};

export const getLessonDetails = async (lessonId) => {
  const lessonResult = await query(
    `
      SELECT *
      FROM lessons
      WHERE id = $1 AND is_active = true
    `,
    [lessonId]
  );

  if (lessonResult.rowCount === 0) {
    throw notFound('Không tìm thấy bài học.');
  }

  const [wordsResult, grammarResult, exercisesResult] = await Promise.all([
    query(
      `
        SELECT w.*
        FROM lesson_words lw
        JOIN words w ON w.id = lw.word_id
        WHERE lw.lesson_id = $1 AND w.is_active = true
        ORDER BY lw.order_num, w.simplified
      `,
      [lessonId]
    ),
    query(
      `
        SELECT *
        FROM grammar_points
        WHERE lesson_id = $1
        ORDER BY order_num, id
      `,
      [lessonId]
    ),
    query(
      `
        SELECT *
        FROM exercises
        WHERE lesson_id = $1
        ORDER BY order_num, id
      `,
      [lessonId]
    )
  ]);

  const lesson = lessonResult.rows[0];

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      subtitle: lesson.subtitle,
      hskLevel: Number(lesson.hsk_level),
      order: Number(lesson.order_num),
      skill: lesson.skill,
      estimatedMinutes: Number(lesson.estimated_minutes),
      xpReward: Number(lesson.xp_reward),
      intro: lesson.intro,
      newWords: wordsResult.rows.map(mapWord),
      grammar: grammarResult.rows.map(mapGrammarPoint),
      dialogue: lesson.dialogue,
      exercises: exercisesResult.rows.map(mapExercise)
    }
  };
};

export const completeLesson = async (userId, lessonId, payload) => {
  const accuracy = Number(payload.accuracy);
  const minutes = Number(payload.minutes || 0);

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
    throw badRequest('accuracy phải nằm trong khoảng 0-100.');
  }

  if (minutes < 0) {
    throw badRequest('minutes không được âm.');
  }

  return withTransaction(async (client) => {
    const lessonResult = await client.query(
      `
        SELECT id, xp_reward, content_version, hsk_level, skill
        FROM lessons
        WHERE id = $1 AND is_active = true
      `,
      [lessonId]
    );

    if (lessonResult.rowCount === 0) {
      throw notFound('Không tìm thấy bài học.');
    }

    const lesson = lessonResult.rows[0];
    const progressResult = await client.query(
      `
        INSERT INTO user_lesson_progress (
          user_id,
          lesson_id,
          completed_at,
          best_accuracy,
          attempts,
          content_version
        )
        VALUES ($1, $2, now(), $3, 1, $4)
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET
          completed_at = now(),
          best_accuracy = GREATEST(user_lesson_progress.best_accuracy, EXCLUDED.best_accuracy),
          attempts = user_lesson_progress.attempts + 1,
          content_version = EXCLUDED.content_version,
          updated_at = now()
        RETURNING *
      `,
      [userId, lessonId, accuracy, lesson.content_version]
    );

    const lessonWordsResult = await client.query(
      `
        SELECT word_id
        FROM lesson_words
        WHERE lesson_id = $1
        ORDER BY order_num
      `,
      [lessonId]
    );

    const newWordsEnrolled = [];

    for (const row of lessonWordsResult.rows) {
      const insertResult = await client.query(
        `
          INSERT INTO srs_cards (user_id, word_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, word_id) DO NOTHING
          RETURNING word_id
        `,
        [userId, row.word_id]
      );

      if (insertResult.rowCount > 0) {
        newWordsEnrolled.push(row.word_id);
      }
    }

    const activity = await recordActivity(client, userId, {
      xp: Number(lesson.xp_reward),
      minutesStudied: minutes,
      lessonsCompleted: 1
    });
    const unlockedAchievements = await evaluateAchievements(client, userId, {
      event: 'lesson_completed',
      lessonId,
      hskLevel: Number(lesson.hsk_level),
      lessonSkill: lesson.skill,
      lessonAccuracy: accuracy,
      newWordsEnrolled: newWordsEnrolled.length,
      xpEarned: Number(lesson.xp_reward)
    });

    const progress = progressResult.rows[0];

    return {
      xpEarned: Number(lesson.xp_reward),
      newWordsEnrolled,
      progress: {
        lessonId: progress.lesson_id,
        completedAt: progress.completed_at,
        bestAccuracy: Number(progress.best_accuracy),
        attempts: Number(progress.attempts)
      },
      streak: activity.streak,
      unlockedAchievements
    };
  });
};
