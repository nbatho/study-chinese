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

// A grammar point joined with its lesson; the grammar's own level columns are
// aliased grammar_* because hsk_level/cefr_level belong to the lesson here.
const mapLessonGrammarEntry = (row, locale = 'en') => ({
  ...mapGrammarPoint(row, locale),
  hskLevel: row.grammar_hsk_level === null || row.grammar_hsk_level === undefined ? null : Number(row.grammar_hsk_level),
  cefrLevel: row.grammar_cefr_level || null,
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

export const mapStimulus = (stimulus, locale = 'en') => {
  if (!stimulus || typeof stimulus !== 'object' || Object.keys(stimulus).length === 0) {
    return stimulus || {};
  }

  const viText = stimulus.vi || stimulus.vietnamese || null;
  const enText = stimulus.english || stimulus.en || '';

  const result = {
    ...stimulus,
    english: chooseLocalizedText(enText, viText, locale),
    en: enText,
    vi: viText
  };

  if (Array.isArray(stimulus.lines)) {
    result.lines = stimulus.lines.map((line) => ({
      ...line,
      english: chooseLocalizedText(line.english || line.en || '', line.vi || line.vietnamese, locale),
      en: line.en || line.english || '',
      vi: line.vi || line.vietnamese || null
    }));
  }

  return result;
};

const mapExercise = (row, locale = 'en') => ({
  id: row.id,
  kind: row.kind,
  skill: row.skill || null,
  bloomLevel: row.bloom_level || null,
  prompt: chooseLocalizedText(row.prompt, row.prompt_vi, locale),
  promptZh: row.prompt,
  promptEn: row.prompt_english || null,
  promptVi: row.prompt_vi || null,
  promptHanzi: row.prompt_hanzi,
  promptPinyin: row.prompt_pinyin,
  promptEnglish: row.prompt_english,
  stimulus: mapStimulus(row.stimulus, locale),
  options: row.options || [],
  optionsZh: row.options || [],
  optionsEn: [],
  optionsVi: row.options_vi || [],
  correctIndex: row.correct_index,
  correctText: row.correct_text,
  correctTextZh: row.correct_text,
  correctTextEn: null,
  correctTextVi: row.correct_text_vi || null,
  answerExplanation: chooseLocalizedText(row.answer_explanation, row.answer_explanation_vi, locale),
  answerExplanationZh: row.answer_explanation,
  answerExplanationEn: null,
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

// The lessons.dialogue JSON column stores the legacy embedded dialogue used by
// the lesson player. Newer imports include a per-line `vi` translation; expose
// both languages and localize the default `english` field like the rest of the
// lesson content so the player can switch EN/VI.
const mapEmbeddedDialogue = (dialogue, locale = 'en') => {
  if (!dialogue || typeof dialogue !== 'object') {
    return dialogue ?? null;
  }

  return {
    ...dialogue,
    lines: (dialogue.lines || []).map((line) => ({
      ...line,
      english: chooseLocalizedText(line.english || line.en || '', line.vi, locale),
      en: line.en || line.english || '',
      vi: line.vi || null
    }))
  };
};

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
        SELECT w.*, wg.gloss AS gloss
        FROM lesson_words lw
        JOIN words w ON w.id = lw.word_id
        LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $2
        WHERE lw.lesson_id = $1 AND w.is_active = true
        ORDER BY lw.order_num, w.simplified
      `,
      [lessonId, locale]
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
        ORDER BY order_num, created_at, id
      `,
      [lessonId]
    )
  ]);

  const lesson = lessonResult.rows[0];

  // The detail payload shares the summary's mapping but carries no progress
  // fields — strip them so the response shape stays unchanged.
  const {
    grammarCount: _grammarCount,
    completedAt: _completedAt,
    bestAccuracy: _bestAccuracy,
    attempts: _attempts,
    ...summaryFields
  } = mapLessonSummary(lesson, locale);

  return {
    lesson: {
      ...summaryFields,
      learningObjectives: locale === 'vi' && lesson.learning_objectives_vi?.length
        ? lesson.learning_objectives_vi
        : lesson.learning_objectives || [],
      learningObjectivesEn: lesson.learning_objectives || [],
      learningObjectivesVi: lesson.learning_objectives_vi || [],
      warmUp: lesson.warm_up || null,
      reviewSummary: lesson.review_summary || null,
      intro: chooseLocalizedText(lesson.intro, lesson.intro_vi, locale),
      introEn: lesson.intro,
      introVi: lesson.intro_vi || null,
      newWords: wordsResult.rows.map(mapWord),
      grammar: grammarResult.rows.map((row) => mapGrammarPoint(row, locale)),
      dialogue: mapEmbeddedDialogue(lesson.dialogue, locale),
      modules: modulesResult.rows.map(mapLessonModule),
      dialogues: dialoguesResult.rows.map((row) => mapDialogue(row, locale)),
      readingPassages: passagesResult.rows.map((row) => mapReadingPassage(row, locale)),
      exercises: exercisesResult.rows.map((row) => mapExercise(row, locale))
    }
  };
};

// HSK level that guests can study for free (no account, no saved progress).
const PUBLIC_TRIAL_HSK_LEVEL = 1;

// Public trial: the real HSK1 lesson list, without any user progress join.
export const getSampleLessons = async (localeInput = 'en') =>
  getLessons(null, { hsk: PUBLIC_TRIAL_HSK_LEVEL, locale: localeInput });

// Public trial: full detail for an HSK1 lesson only. Higher levels stay gated.
export const getPublicLessonDetails = async (lessonId, localeInput = 'en') => {
  const lessonResult = await query(
    'SELECT hsk_level FROM lessons WHERE id = $1 AND is_active = true',
    [lessonId]
  );

  if (lessonResult.rowCount === 0) {
    throw notFound('Không tìm thấy bài học.');
  }

  if (Number(lessonResult.rows[0].hsk_level) !== PUBLIC_TRIAL_HSK_LEVEL) {
    throw notFound('Bài học này cần đăng nhập để học.');
  }

  return getLessonDetails(lessonId, localeInput);
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

    const enrolledResult = await client.query(
      `
        INSERT INTO srs_cards (user_id, word_id)
        SELECT $1, word_id
        FROM lesson_words
        WHERE lesson_id = $2
        ORDER BY order_num
        ON CONFLICT (user_id, word_id) DO NOTHING
        RETURNING word_id
      `,
      [userId, lessonId]
    );
    const newWordsEnrolled = enrolledResult.rows.map((row) => row.word_id);

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
