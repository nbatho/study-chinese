import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { callOpenAiCompatibleJson } from '../src/services/content-ai-client.js';
import { hasDatabaseConfig } from '../src/config/env.config.js';
import { ContentReviewer } from '../src/services/content-reviewer.js';
import { ContentValidator } from '../src/services/content-validator.js';
import { resolveContentPath } from '../src/config/content-paths.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const readArg = (name, fallback) => {
  const equalsArg = args.find((arg) => arg.startsWith(`--${name}=`));

  if (equalsArg) {
    return equalsArg.split('=').slice(1).join('=');
  }

  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1] && !args[index + 1].startsWith('--')) {
    return args[index + 1];
  }

  return fallback;
};

const level = Number(readArg('level', 1));
const lessonNo = Number(readArg('lesson-no', readArg('lessonNo', 1)));
const topic = readArg('topic', 'daily_life');
const skill = readArg('skill', 'reading');
const maxRetries = Number(readArg('retries', 3));
const saveOutput = hasFlag('save');
const reviewEnabled = !hasFlag('skip-ai-review');
const logToDatabase = !hasFlag('no-db-log');
const outputDir = resolveContentPath(readArg('output-dir'), ['lessons', 'real']);
const targetWords = readArg('target-words', '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const grammarPatterns = readArg('grammar', '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const lessonTemplateSkeleton = {
  lesson_id: '<lesson_id>',
  metadata: {
    title_zh: '<Chinese title>',
    title_en: '<English title>',
    hsk_level: 2,
    cefr_level: 'A1',
    primary_skill: '<primary_skill>',
    secondary_skills: [],
    topic: '<topic>',
    estimated_minutes: 10,
    xp_reward: 30,
    tags: ['hsk2', 'food', 'reading']
  },
  learning_objectives: ['<objective 1>', '<objective 2>'],
  vocabulary_focus: [
    {
      simplified: '<Chinese word>',
      pinyin: '<pinyin with tone marks>',
      english: '<English meaning>',
      is_new: true
    }
  ],
  grammar_focus: [
    {
      pattern: '<grammar pattern>',
      explanation: '<short explanation>',
      examples: [{ zh: '<Chinese example>', pinyin: '<pinyin>', en: '<English translation>' }]
    }
  ],
  warm_up: {
    type: 'vocabulary_review',
    items: ['<Chinese word>']
  },
  core_modules: [
    {
      module_type: 'reading',
      phases: [
        {
          type: 'reading_passage',
          content_zh: '<Chinese passage>',
          content_pinyin: '<pinyin>',
          content_en: '<English translation>'
        }
      ]
    }
  ],
  practice: {
    exercises: [
      {
        kind: 'multiple_choice',
        skill: '<exact primary_skill>',
        bloom_level: 'understand',
        prompt: '<question>',
        options: ['<option A>', '<option B>', '<option C>'],
        correct_answer: '<correct option>',
        acceptable_variants: ['<correct option>'],
        explanation: '<why this is correct>'
      }
    ]
  },
  review: {
    key_takeaways: ['<takeaway>'],
    srs_inject_word_ids: []
  }
};

const requireValidArgs = () => {
  if (!Number.isInteger(level) || level < 1 || level > 9) {
    throw new Error('--level must be an integer from 1 to 9.');
  }

  if (!Number.isInteger(lessonNo) || lessonNo < 1 || lessonNo > 999) {
    throw new Error('--lesson-no must be an integer from 1 to 999.');
  }

  if (!['listening', 'speaking', 'reading', 'writing', 'mixed'].includes(skill)) {
    throw new Error('--skill must be listening, speaking, reading, writing, or mixed.');
  }
};

const buildLessonId = () =>
  `hsk${level}-l${String(lessonNo).padStart(2, '0')}-${skill}-${topic}`
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const loadGenerationPrompt = async () => {
  const moduleType = skill === 'mixed' ? 'reading' : skill;
  const exactSkeleton = {
    ...lessonTemplateSkeleton,
    lesson_id: buildLessonId(),
    metadata: {
      ...lessonTemplateSkeleton.metadata,
      hsk_level: level,
      cefr_level: level <= 2 ? 'A1' : level <= 3 ? 'A2' : level <= 4 ? 'B1' : level <= 6 ? 'B2' : 'C1',
      primary_skill: skill,
      secondary_skills: skill === 'reading' ? ['writing'] : skill === 'listening' ? ['speaking'] : [],
      topic,
      tags: [`hsk${level}`, topic, skill]
    },
    core_modules: [
      {
        module_type: moduleType,
        phases: [
          {
            type: moduleType === 'reading' ? 'reading_passage' : `${moduleType}_practice`,
            content_zh: '<Chinese lesson content>',
            content_pinyin: '<pinyin with tone marks>',
            content_en: '<English translation>'
          }
        ]
      }
    ]
  };

  return `Create one original Mandarin lesson for production use.

Lesson spec:
${JSON.stringify(
  {
    lesson_id: buildLessonId(),
    hsk_level: level,
    lesson_no: lessonNo,
    topic,
    primary_skill: skill,
    target_words: targetWords,
    grammar_patterns: grammarPatterns
  },
  null,
  2
)}

Hard requirements:
- Return only one JSON object. Do not return markdown, prose, an array, or an empty object.
- The top-level keys must be exactly compatible with: lesson_id, metadata, learning_objectives, vocabulary_focus, grammar_focus, warm_up, core_modules, practice, review.
- Use the exact lesson_id, metadata.hsk_level, metadata.primary_skill, and metadata.topic from the lesson spec.
- Fill every placeholder with real lesson content. Do not leave placeholder text.
- Use only HSK ${level} or lower vocabulary unless target_words lists a word.
- Keep Chinese content original. Do not copy textbook passages, exam items, paid courses, or existing online content.
- For HSK 1-2, keep total Chinese lesson text around 30-80 Chinese characters.
- Every exercise must include kind, skill, bloom_level, prompt, correct_answer, acceptable_variants, and explanation.

Return this shape with real values:
${JSON.stringify(exactSkeleton, null, 2)}
`;
};

const validationFeedback = (validation) =>
  [...(validation?.errors || []), ...(validation?.warnings || [])]
    .map((issue) => `${issue.severity}:${issue.code}:${issue.message}`)
    .slice(0, 12)
    .join('\n');

const reviewFeedback = (reviewResult) => {
  if (!reviewResult) {
    return '';
  }

  return JSON.stringify(
    {
      overall_score: reviewResult.review?.overall_score,
      low_criteria: reviewResult.lowCriteria,
      blocking_issues: reviewResult.review?.blocking_issues,
      suggested_revisions: reviewResult.review?.suggested_revisions
    },
    null,
    2
  );
};

const parseLesson = (payload) => {
  const lesson = payload?.lesson || payload;

  if (!lesson || typeof lesson !== 'object' || Array.isArray(lesson)) {
    throw new Error('Generation output must be one lesson JSON object.');
  }

  const requiredKeys = [
    'lesson_id',
    'metadata',
    'learning_objectives',
    'vocabulary_focus',
    'grammar_focus',
    'warm_up',
    'core_modules',
    'practice',
    'review'
  ];
  const missingKeys = requiredKeys.filter((key) => lesson[key] === undefined);

  if (missingKeys.length > 0) {
    throw new Error(`Generation output is missing required lesson keys: ${missingKeys.join(', ')}`);
  }

  return lesson;
};

const withProductionSpecValidation = (validation, lesson) => {
  const errors = [];
  const expectedLessonId = buildLessonId();

  if (lesson?.lesson_id !== expectedLessonId) {
    errors.push({
      severity: 'error',
      code: 'production_spec_mismatch',
      message: 'lesson_id does not match the requested production lesson spec.',
      details: { expected: expectedLessonId, actual: lesson?.lesson_id }
    });
  }

  if (Number(lesson?.metadata?.hsk_level) !== level) {
    errors.push({
      severity: 'error',
      code: 'production_spec_mismatch',
      message: 'metadata.hsk_level does not match the requested production lesson spec.',
      details: { expected: level, actual: lesson?.metadata?.hsk_level }
    });
  }

  if (lesson?.metadata?.primary_skill !== skill) {
    errors.push({
      severity: 'error',
      code: 'production_spec_mismatch',
      message: 'metadata.primary_skill does not match the requested production lesson spec.',
      details: { expected: skill, actual: lesson?.metadata?.primary_skill }
    });
  }

  if (lesson?.metadata?.topic !== topic) {
    errors.push({
      severity: 'error',
      code: 'production_spec_mismatch',
      message: 'metadata.topic does not match the requested production lesson spec.',
      details: { expected: topic, actual: lesson?.metadata?.topic }
    });
  }

  if (errors.length === 0) {
    return validation;
  }

  const allErrors = [...validation.errors, ...errors];
  const issues = [...validation.issues, ...errors];

  return {
    ...validation,
    ok: false,
    errors: allErrors,
    issues,
    summary: {
      errorCount: allErrors.length,
      warningCount: validation.warnings.length
    }
  };
};

const statusFrom = ({ validation, aiReview }) => {
  if (!validation?.ok) {
    return 'pending';
  }

  if (!aiReview) {
    return 'auto_validated';
  }

  return aiReview.ok ? 'ai_reviewed' : 'rejected';
};

const saveGenerationLog = async ({ lesson, prompt, validation, aiReview, modelName, status }) => {
  if (!hasDatabaseConfig()) {
    return {
      skipped: true,
      reason: 'Missing PostgreSQL configuration. Set DATABASE_URL or DB_HOST, DB_NAME and DB_USER in server/.env.'
    };
  }

  const db = await import('../src/config/db.config.js');

  try {
    await db.query(
      `
        INSERT INTO content_generation_logs (
          content_type,
          target_lesson_id,
          hsk_level,
          topic,
          skill,
          prompt_used,
          model_name,
          raw_output,
          validation_result,
          ai_review_result,
          status
        )
        VALUES ('lesson', NULL, $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9)
      `,
      [
        level,
        topic,
        skill,
        prompt,
        modelName,
        JSON.stringify(lesson),
        JSON.stringify(validation),
        aiReview ? JSON.stringify(aiReview) : null,
        status
      ]
    );

    return { skipped: false };
  } finally {
    await db.closeDB();
  }
};

const saveLessonBundle = async ({ lesson, validation, aiReview, status }) => {
  await mkdir(outputDir, { recursive: true });
  const basename = lesson.lesson_id || buildLessonId();
  const lessonPath = path.join(outputDir, `${basename}.json`);
  const validationPath = path.join(outputDir, `${basename}.validation.json`);
  const reviewPath = path.join(outputDir, `${basename}.review.json`);
  const metadataPath = path.join(outputDir, `${basename}.release.json`);

  await writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`, 'utf8');
  await writeFile(validationPath, `${JSON.stringify(validation, null, 2)}\n`, 'utf8');

  if (aiReview) {
    await writeFile(reviewPath, `${JSON.stringify(aiReview, null, 2)}\n`, 'utf8');
  }

  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        lesson_id: basename,
        status,
        generated_at: new Date().toISOString(),
        validation_file: path.basename(validationPath),
        ai_review_file: aiReview ? path.basename(reviewPath) : null
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  return {
    lessonPath,
    validationPath,
    reviewPath: aiReview ? reviewPath : null,
    metadataPath
  };
};

const run = async () => {
  requireValidArgs();

  const basePrompt = await loadGenerationPrompt();
  const validator = new ContentValidator({ requireDatabaseChecks: true });
  const reviewer = reviewEnabled ? new ContentReviewer() : null;
  let lastResult;
  let feedback = '';
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const prompt = `${basePrompt}

Attempt ${attempt} of ${maxRetries}.
${feedback ? `Previous issues to fix before returning the next JSON:\n${feedback}` : ''}
`;
    try {
      const generation = await callOpenAiCompatibleJson({
        purpose: 'generation',
        systemPrompt: 'Return valid JSON only. Create original Mandarin lesson content for production use.',
        prompt,
        temperature: 0.35
      });
      const lesson = parseLesson(generation.json);
      const validation = withProductionSpecValidation(await validator.validateLesson(lesson, level), lesson);
      let aiReview = null;

      lastResult = {
        lesson,
        validation,
        aiReview,
        modelName: generation.modelName,
        prompt
      };

      if (!validation.ok) {
        feedback = `Auto-validation failed:\n${validationFeedback(validation)}`;
        continue;
      }

      if (reviewer) {
        aiReview = await reviewer.reviewLesson(lesson, { validation, targetLevel: level, topic, skill });
        lastResult.aiReview = aiReview;

        if (!aiReview.ok) {
          feedback = `AI review failed:\n${reviewFeedback(aiReview)}`;
          continue;
        }
      }

      break;
    } catch (error) {
      lastError = error;
      feedback = `Generation failed before validation: ${error.message}`;
    }
  }

  if (!lastResult) {
    throw new Error(`Lesson generation failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'unknown error'}`);
  }

  const status = statusFrom(lastResult || {});
  const saved = saveOutput ? await saveLessonBundle({ ...lastResult, status }) : null;
  let databaseLog = null;

  if (logToDatabase && lastResult) {
    databaseLog = await saveGenerationLog({ ...lastResult, status });
  }

  console.log(JSON.stringify(
    {
      ok: status === 'ai_reviewed' || (!reviewEnabled && status === 'auto_validated'),
      status,
      saved,
      databaseLog,
      validation: lastResult?.validation,
      aiReview: lastResult?.aiReview,
      lesson: lastResult?.lesson
    },
    null,
    2
  ));

  if (status !== 'ai_reviewed' && reviewEnabled) {
    process.exitCode = 1;
  }
};

await run();
