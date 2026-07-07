import { query, withTransaction } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';
import { awardGems } from './gamification.service.js';
import { mapWord } from './vocab.service.js';
import { chooseLocalizedText, normalizeLocale } from './content-language.service.js';

const mapExample = (example, locale) => ({
  ...example,
  simplified: example.simplified || example.zh || '',
  english: chooseLocalizedText(example.english || example.en || '', example.vi, locale),
  en: example.en || example.english || '',
  vi: example.vi || null
});

const mapLessonSummary = (row, locale = 'en') => ({
  id: row.id,
  title: chooseLocalizedText(row.title, row.title_vi, locale),
  subtitle: chooseLocalizedText(row.subtitle, row.subtitle_vi, locale),
  titleEn: row.title,
  titleVi: row.title_vi || null,
  subtitleEn: row.subtitle,
  subtitleVi: row.subtitle_vi || null,
  hskLevel: Number(row.hsk_level),
  cefrLevel: row.cefr_level || 'A1',
  order: Number(row.order_num),
  skill: row.primary_skill || row.skill,
  primarySkill: row.primary_skill || row.skill,
  secondarySkills: row.secondary_skills || [],
  topic: row.topic || null,
  difficultyScore: row.difficulty_score === null || row.difficulty_score === undefined
    ? null
    : Number(row.difficulty_score),
  tags: row.tags || [],
  estimatedMinutes: Number(row.estimated_minutes),
  xpReward: Number(row.xp_reward),
  grammarCount: Number(row.grammar_count || 0),
  completedAt: row.completed_at,
  bestAccuracy: Number(row.best_accuracy || 0),
  attempts: Number(row.attempts || 0)
});

const mapGrammarPoint = (row, locale = 'en') => ({
  id: row.id,
  pattern: row.pattern,
  explanation: chooseLocalizedText(row.explanation, row.explanation_vi, locale),
  explanationEn: row.explanation,
  explanationVi: row.explanation_vi || null,
  tips: locale === 'vi' && row.tips_vi?.length ? row.tips_vi : row.tips || [],
  tipsEn: row.tips || [],
  tipsVi: row.tips_vi || [],
  hskLevel: row.hsk_level === null || row.hsk_level === undefined ? null : Number(row.hsk_level),
  cefrLevel: row.cefr_level || null,
  examples: (row.examples || []).map((example) => mapExample(example, locale))
});

const mapLessonGrammarEntry = (row, locale = 'en') => ({
  id: row.id,
  pattern: row.pattern,
  explanation: chooseLocalizedText(row.explanation, row.explanation_vi, locale),
  explanationEn: row.explanation,
  explanationVi: row.explanation_vi || null,
  tips: locale === 'vi' && row.tips_vi?.length ? row.tips_vi : row.tips || [],
  tipsEn: row.tips || [],
  tipsVi: row.tips_vi || [],
  hskLevel: row.grammar_hsk_level === null || row.grammar_hsk_level === undefined ? null : Number(row.grammar_hsk_level),
  cefrLevel: row.grammar_cefr_level || null,
  examples: (row.examples || []).map((example) => mapExample(example, locale)),
  lesson: {
    id: row.lesson_id,
    title: chooseLocalizedText(row.lesson_title, row.lesson_title_vi, locale),
    subtitle: chooseLocalizedText(row.lesson_subtitle, row.lesson_subtitle_vi, locale),
    hskLevel: Number(row.hsk_level),
    cefrLevel: row.cefr_level || 'A1',
    order: Number(row.order_num),
    skill: row.primary_skill || row.skill,
    completedAt: row.completed_at,
    bestAccuracy: Number(row.best_accuracy || 0),
    attempts: Number(row.attempts || 0)
  }
});

const mapExercise = (row, locale = 'en') => ({
  id: row.id,
  kind: row.kind,
  skill: row.skill || null,
  bloomLevel: row.bloom_level || null,
  prompt: chooseLocalizedText(row.prompt, row.prompt_vi, locale),
  promptEn: row.prompt,
  promptVi: row.prompt_vi || null,
  promptHanzi: row.prompt_hanzi,
  promptPinyin: row.prompt_pinyin,
  promptEnglish: row.prompt_english,
  stimulus: row.stimulus || {},
  options: locale === 'vi' && row.options_vi?.length ? row.options_vi : row.options || [],
  optionsEn: row.options || [],
  optionsVi: row.options_vi || [],
  correctIndex: row.correct_index,
  correctText: chooseLocalizedText(row.correct_text, row.correct_text_vi, locale),
  correctTextEn: row.correct_text,
  correctTextVi: row.correct_text_vi || null,
  answerExplanation: chooseLocalizedText(row.answer_explanation, row.answer_explanation_vi, locale),
  answerExplanationEn: row.answer_explanation,
  answerExplanationVi: row.answer_explanation_vi || null,
  aiGradingEnabled: Boolean(row.ai_grading_enabled),
  acceptableVariants: row.acceptable_variants || [],
  audioWordId: row.audio_word_id,
  tone: row.tone
});

const mapLessonModule = (row) => ({
  id: row.id,
  lessonId: row.lesson_id,
  moduleType: row.module_type,
  order: Number(row.order_num),
  phases: row.phases || []
});

const mapDialogue = (row, locale = 'en') => ({
  id: row.id,
  lessonId: row.lesson_id,
  titleZh: row.title_zh,
  titleEn: row.title_en,
  titleVi: row.title_vi || null,
  title: chooseLocalizedText(row.title_en, row.title_vi, locale),
  hskLevel: Number(row.hsk_level),
  topic: row.topic,
  lines: (row.lines || []).map((line) => ({
    ...line,
    english: chooseLocalizedText(line.english || line.en || '', line.vi, locale),
    en: line.en || line.english || '',
    vi: line.vi || null
  })),
  audioFullRef: row.audio_full_ref,
  wordCount: row.word_count === null || row.word_count === undefined ? null : Number(row.word_count)
});

const mapReadingPassage = (row, locale = 'en') => ({
  id: row.id,
  lessonId: row.lesson_id,
  titleZh: row.title_zh,
  titleEn: row.title_en,
  titleVi: row.title_vi || null,
  title: chooseLocalizedText(row.title_en, row.title_vi, locale),
  hskLevel: Number(row.hsk_level),
  topic: row.topic,
  contentZh: row.content_zh,
  contentPinyin: row.content_pinyin,
  contentEn: chooseLocalizedText(row.content_en, row.content_vi, locale),
  contentVi: row.content_vi || null,
  wordCount: Number(row.word_count),
  newWordIds: row.new_word_ids || [],
  grammarPointIds: row.grammar_point_ids || [],
  questions: row.questions || []
});

const buildLessonFilters = ({ skill, topic, hsk_level: hskLevel, hsk } = {}) => {
  const values = [];
  const conditions = ['l.is_active = true'];
  const normalizedLevel = hskLevel || hsk;

  if (skill) {
    values.push(String(skill));
    conditions.push(`COALESCE(l.primary_skill, l.skill) = $${values.length}`);
  }

  if (topic) {
    values.push(String(topic));
    conditions.push(`l.topic = $${values.length}`);
  }

  if (normalizedLevel) {
    values.push(Number(normalizedLevel));
    conditions.push(`l.hsk_level = $${values.length}`);
  }

  return {
    values,
    whereSql: conditions.join(' AND ')
  };
};

export const getLessons = async (userId, filters = {}) => {
  const locale = normalizeLocale(filters.locale);
  const { values, whereSql } = buildLessonFilters(filters);
  const result = await query(
    `
      SELECT
        l.*,
        COALESCE(grammar_counts.grammar_count, 0) AS grammar_count,
        ulp.completed_at,
        ulp.best_accuracy,
        ulp.attempts
      FROM lessons l
      LEFT JOIN (
        SELECT lesson_id, COUNT(*)::int AS grammar_count
        FROM grammar_points
        GROUP BY lesson_id
      ) grammar_counts ON grammar_counts.lesson_id = l.id
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $${values.length + 1}
      WHERE ${whereSql}
      ORDER BY l.hsk_level, l.order_num
    `,
    [...values, userId]
  );

  return {
    lessons: result.rows.map((row) => mapLessonSummary(row, locale))
  };
};

export const getLessonGrammarIndex = async (userId, localeInput = 'en') => {
  const locale = normalizeLocale(localeInput);
  const result = await query(
    `
      SELECT
        gp.*,
        gp.hsk_level AS grammar_hsk_level,
        gp.cefr_level AS grammar_cefr_level,
        l.id AS lesson_id,
        l.title AS lesson_title,
        l.title_vi AS lesson_title_vi,
        l.subtitle AS lesson_subtitle,
        l.subtitle_vi AS lesson_subtitle_vi,
        l.hsk_level,
        l.cefr_level,
        l.order_num,
        l.skill,
        l.primary_skill,
        ulp.completed_at,
        ulp.best_accuracy,
        ulp.attempts
      FROM grammar_points gp
      JOIN lessons l ON l.id = gp.lesson_id
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $1
      WHERE l.is_active = true
      ORDER BY l.hsk_level, l.order_num, gp.order_num, gp.id
    `,
    [userId]
  );

  return {
    grammar: result.rows.map((row) => mapLessonGrammarEntry(row, locale))
  };
};

export const getLessonDetails = async (lessonId, localeInput = 'en') => {
  const locale = normalizeLocale(localeInput);
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

  const [wordsResult, grammarResult, exercisesResult, modulesResult, dialoguesResult, passagesResult] = await Promise.all([
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
    ),
    query(
      `
        SELECT *
        FROM lesson_modules
        WHERE lesson_id = $1 AND is_active = true
        ORDER BY order_num, id
      `,
      [lessonId]
    ),
    query(
      `
        SELECT *
        FROM dialogues
        WHERE lesson_id = $1 AND is_active = true
        ORDER BY created_at, id
      `,
      [lessonId]
    ),
    query(
      `
        SELECT *
        FROM reading_passages
        WHERE lesson_id = $1 AND is_active = true
        ORDER BY created_at, id
      `,
      [lessonId]
    )
  ]);

  const lesson = lessonResult.rows[0];

  return {
    lesson: {
      id: lesson.id,
      title: chooseLocalizedText(lesson.title, lesson.title_vi, locale),
      subtitle: chooseLocalizedText(lesson.subtitle, lesson.subtitle_vi, locale),
      titleEn: lesson.title,
      titleVi: lesson.title_vi || null,
      subtitleEn: lesson.subtitle,
      subtitleVi: lesson.subtitle_vi || null,
      hskLevel: Number(lesson.hsk_level),
      cefrLevel: lesson.cefr_level || 'A1',
      order: Number(lesson.order_num),
      skill: lesson.primary_skill || lesson.skill,
      primarySkill: lesson.primary_skill || lesson.skill,
      secondarySkills: lesson.secondary_skills || [],
      topic: lesson.topic || null,
      learningObjectives: locale === 'vi' && lesson.learning_objectives_vi?.length
        ? lesson.learning_objectives_vi
        : lesson.learning_objectives || [],
      learningObjectivesEn: lesson.learning_objectives || [],
      learningObjectivesVi: lesson.learning_objectives_vi || [],
      warmUp: lesson.warm_up || null,
      reviewSummary: lesson.review_summary || null,
      difficultyScore: lesson.difficulty_score === null || lesson.difficulty_score === undefined
        ? null
        : Number(lesson.difficulty_score),
      tags: lesson.tags || [],
      estimatedMinutes: Number(lesson.estimated_minutes),
      xpReward: Number(lesson.xp_reward),
      intro: chooseLocalizedText(lesson.intro, lesson.intro_vi, locale),
      introEn: lesson.intro,
      introVi: lesson.intro_vi || null,
      newWords: wordsResult.rows.map(mapWord),
      grammar: grammarResult.rows.map((row) => mapGrammarPoint(row, locale)),
      dialogue: lesson.dialogue,
      modules: modulesResult.rows.map(mapLessonModule),
      dialogues: dialoguesResult.rows.map((row) => mapDialogue(row, locale)),
      readingPassages: passagesResult.rows.map((row) => mapReadingPassage(row, locale)),
      exercises: exercisesResult.rows.map((row) => mapExercise(row, locale))
    }
  };
};

export const getLessonModules = async (lessonId) => {
  const lessonResult = await query(
    'SELECT id FROM lessons WHERE id = $1 AND is_active = true',
    [lessonId]
  );

  if (lessonResult.rowCount === 0) {
    throw notFound('Khong tim thay bai hoc.');
  }

  const result = await query(
    `
      SELECT *
      FROM lesson_modules
      WHERE lesson_id = $1 AND is_active = true
      ORDER BY order_num, id
    `,
    [lessonId]
  );

  return {
    modules: result.rows.map(mapLessonModule)
  };
};

export const getDialogue = async (dialogueId) => {
  const result = await query(
    `
      SELECT *
      FROM dialogues
      WHERE id = $1 AND is_active = true
    `,
    [dialogueId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay hoi thoai.');
  }

  return {
    dialogue: mapDialogue(result.rows[0])
  };
};

export const getReadingPassage = async (passageId) => {
  const result = await query(
    `
      SELECT *
      FROM reading_passages
      WHERE id = $1 AND is_active = true
    `,
    [passageId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay bai doc.');
  }

  return {
    passage: mapReadingPassage(result.rows[0])
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
    const previousProgressResult = await client.query(
      `
        SELECT completed_at
        FROM user_lesson_progress
        WHERE user_id = $1 AND lesson_id = $2
        FOR UPDATE
      `,
      [userId, lessonId]
    );
    const isFirstCompletion = !previousProgressResult.rows[0]?.completed_at;
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
    const gemReward = isFirstCompletion ? Math.max(5, Math.round(Number(lesson.xp_reward) / 4)) : 0;
    const gems = await awardGems(client, userId, gemReward, 'lesson_completed', {
      lessonId,
      xpEarned: Number(lesson.xp_reward),
      firstCompletion: isFirstCompletion
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
      gemsEarned: gems.gemsEarned,
      wallet: gems.wallet,
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
