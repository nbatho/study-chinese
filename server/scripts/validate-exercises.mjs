import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { repoRoot, resolveContentPath, resolveExistingPath } from '../src/config/content-paths.js';
import { isLessonJson, loadLessonEntries } from './lesson-data-files.mjs';

export { isLessonJson };

const toArray = (value) => (Array.isArray(value) ? value : []);
const unique = (values) => [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))];

export const wildcardToRegExp = (value) => {
  const escaped = String(value)
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
};

export const parseLessonFilters = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(wildcardToRegExp);
};

export const readArg = (args, name, fallback = null) => {
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

export const hasFlag = (args, name) => args.includes(`--${name}`);

const normalizeKind = (kind) => {
  if (kind === 'reading_comp') {
    return 'reading_comprehension';
  }

  if (kind === 'listening_comp') {
    return 'listening_comprehension';
  }

  return kind;
};

export const normalizeExercise = (exercise, lesson, index) => ({
  id: exercise?.id || `${lesson.lesson_id}-ex${index + 1}`,
  kind: normalizeKind(exercise?.kind),
  skill: exercise?.skill || lesson.metadata?.primary_skill || 'mixed',
  bloom_level: exercise?.bloom_level,
  prompt: exercise?.prompt || '',
  prompt_vi: exercise?.prompt_vi || '',
  prompt_english: exercise?.prompt_english || exercise?.promptEnglish || '',
  options: toArray(exercise?.options),
  options_vi: toArray(exercise?.options_vi),
  correct_answer: exercise?.correct_answer ?? exercise?.correctText ?? '',
  correct_answer_vi: exercise?.correct_answer_vi ?? exercise?.correctTextVi ?? '',
  acceptable_variants: toArray(exercise?.acceptable_variants),
  explanation: exercise?.explanation || exercise?.answer_explanation || '',
  explanation_vi: exercise?.explanation_vi || exercise?.answer_explanation_vi || '',
  stimulus: exercise?.stimulus ?? null
});

const sameValue = (a, b) => String(a) === String(b);
const optionIndex = (options, correct) => options.findIndex((option) => sameValue(option, correct));
const isComprehensionKind = (kind) => ['reading_comprehension', 'listening_comprehension'].includes(kind);

const distractorSignature = (exercise) => {
  const correct = String(exercise.correct_answer || '');
  const distractors = toArray(exercise.options)
    .filter((option) => String(option) !== correct)
    .map((option) => String(option).trim())
    .filter(Boolean)
    .sort();

  return distractors.length > 0 ? distractors.join(' || ') : '';
};

const validateStimulus = (exercise, errors) => {
  if (!isComprehensionKind(exercise.kind)) {
    return;
  }

  if (!exercise.stimulus || typeof exercise.stimulus !== 'object') {
    errors.push(`${exercise.id}: ${exercise.kind} requires stimulus.`);
    return;
  }

  if (exercise.kind === 'reading_comprehension') {
    for (const key of ['type', 'title', 'text', 'english']) {
      if (!exercise.stimulus[key]) {
        errors.push(`${exercise.id}: reading stimulus missing ${key}.`);
      }
    }
  }

  if (exercise.kind === 'listening_comprehension') {
    for (const key of ['type', 'title', 'text', 'audioText', 'english']) {
      if (!exercise.stimulus[key]) {
        errors.push(`${exercise.id}: listening stimulus missing ${key}.`);
      }
    }

    if (!Array.isArray(exercise.stimulus.lines) || exercise.stimulus.lines.length === 0) {
      errors.push(`${exercise.id}: listening stimulus requires non-empty lines.`);
    }
  }
};

export const levelRulesFor = (rules, lesson) => {
  const hsk = Number(lesson.metadata?.hsk_level || String(lesson.lesson_id || '').match(/hsk(\d+)/i)?.[1] || 1);
  const cefr = lesson.metadata?.cefr_level || rules.hsk_to_cefr?.[String(hsk)] || 'A1';
  const levelRules = rules.levels?.[cefr];

  if (!levelRules) {
    throw new Error(`No CEFR rules found for ${cefr}.`);
  }

  return { hsk, cefr, levelRules };
};

export const validateExercises = ({ lesson, exercises, rules, distractorUsage = new Map(), commitDistractors = false }) => {
  const { cefr, levelRules } = levelRulesFor(rules, lesson);
  const validationRules = rules.validation || {};
  const allowedKinds = new Set(levelRules.allowed_kinds || []);
  const allowedBloom = new Set(levelRules.allowed_bloom_levels || []);
  const expectedBloom = levelRules.bloom_distribution || [];
  const forbiddenOptions = new Set(rules.distractor_rules?.forbidden_options || []);
  const maxRepeatedDistractorSet = Number(rules.distractor_rules?.max_repeated_distractor_set || 2);
  const exerciseCountRule = validationRules.exercise_count ?? 5;
  const exerciseCountMin = Number(exerciseCountRule?.min ?? exerciseCountRule);
  const exerciseCountMax = Number(exerciseCountRule?.max ?? exerciseCountRule);
  const errors = [];
  const warnings = [];
  const normalized = toArray(exercises).map((exercise, index) => normalizeExercise(exercise, lesson, index));

  if (normalized.length < exerciseCountMin || normalized.length > exerciseCountMax) {
    errors.push(`Expected ${exerciseCountMin}-${exerciseCountMax} exercises, received ${normalized.length}.`);
  }

  const prompts = new Set();
  const ids = new Set();
  const correctIndexes = [];

  normalized.forEach((exercise, index) => {
    const expectedId = `${lesson.lesson_id}-ex${index + 1}`;
    const options = toArray(exercise.options);
    const optionsVi = toArray(exercise.options_vi);
    const correctIdx = optionIndex(options, exercise.correct_answer);
    const correctViIdx = optionIndex(optionsVi, exercise.correct_answer_vi);

    if (exercise.id !== expectedId) {
      errors.push(`${exercise.id || `exercise ${index + 1}`}: expected id ${expectedId}.`);
    }

    if (ids.has(exercise.id)) {
      errors.push(`${exercise.id}: duplicate id.`);
    }
    ids.add(exercise.id);

    if (!allowedKinds.has(exercise.kind)) {
      errors.push(`${exercise.id}: kind ${exercise.kind} is not allowed for ${cefr}.`);
    }

    if (!allowedBloom.has(exercise.bloom_level)) {
      errors.push(`${exercise.id}: bloom_level ${exercise.bloom_level} is not allowed for ${cefr}.`);
    }

    if (expectedBloom[index] && exercise.bloom_level !== expectedBloom[index]) {
      errors.push(`${exercise.id}: expected bloom_level ${expectedBloom[index]} at position ${index + 1}, got ${exercise.bloom_level}.`);
    }

    if (exercise.skill !== (lesson.metadata?.primary_skill || 'mixed') && lesson.metadata?.primary_skill !== 'mixed') {
      warnings.push(`${exercise.id}: skill ${exercise.skill} differs from lesson primary_skill ${lesson.metadata?.primary_skill}.`);
    }

    if (!exercise.prompt || prompts.has(exercise.prompt)) {
      errors.push(`${exercise.id}: prompt is empty or duplicated.`);
    }
    prompts.add(exercise.prompt);

    if (options.length === 0) {
      errors.push(`${exercise.id}: options must not be empty.`);
    }

    if (exercise.kind === 'true_false') {
      if (![2, 4].includes(options.length)) {
        errors.push(`${exercise.id}: true_false should have 2 options, or 4 only if the UI needs richer choices.`);
      }
    } else if (exercise.kind === 'word_order') {
      if (options.length < 3 || options.length > 8) {
        errors.push(`${exercise.id}: word_order should have 3-8 tokens, got ${options.length}.`);
      }
    } else if (levelRules.option_count && options.length !== levelRules.option_count) {
      errors.push(`${exercise.id}: expected ${levelRules.option_count} options for ${cefr}, got ${options.length}.`);
    }

    if (options.length !== optionsVi.length) {
      errors.push(`${exercise.id}: options_vi length must match options length.`);
    }

    // word_order: correct_answer is the assembled sentence, not one of the tokens.
    if (exercise.kind !== 'word_order') {
      if (correctIdx === -1) {
        errors.push(`${exercise.id}: correct_answer is not in options.`);
      }

      if (correctViIdx === -1) {
        errors.push(`${exercise.id}: correct_answer_vi is not in options_vi.`);
      }

      if (correctIdx !== -1 && correctViIdx !== -1 && correctIdx !== correctViIdx) {
        errors.push(`${exercise.id}: correct_answer and correct_answer_vi point to different option indexes.`);
      }
    }

    correctIndexes.push(correctIdx);

    for (const option of options) {
      if (forbiddenOptions.has(option)) {
        errors.push(`${exercise.id}: forbidden repeated distractor used: ${option}`);
      }
    }

    if ([...String(exercise.explanation || '')].length < Number(validationRules.min_explanation_chars || 20)) {
      errors.push(`${exercise.id}: explanation is too short.`);
    }

    if (!exercise.explanation_vi) {
      errors.push(`${exercise.id}: explanation_vi is required.`);
    }

    if (validationRules.require_prompt_english && !exercise.prompt_english) {
      errors.push(`${exercise.id}: prompt_english is required.`);
    }

    validateStimulus(exercise, errors);

    // word_order options are sentence tokens and true_false options are the
    // fixed 对/错 pair, so repeated "distractor sets" are structural there.
    const signature = ['word_order', 'true_false'].includes(exercise.kind) ? '' : distractorSignature(exercise);
    if (signature) {
      const seen = distractorUsage.get(signature) || 0;
      if (seen >= maxRepeatedDistractorSet) {
        errors.push(`${exercise.id}: distractor set already appeared ${seen} times.`);
      }
      if (commitDistractors) {
        distractorUsage.set(signature, seen + 1);
      }
    }
  });

  if (unique(normalized.map((exercise) => normalizeKind(exercise.kind))).length < Number(validationRules.min_distinct_kinds || 2)) {
    errors.push(`Lesson must contain at least ${validationRules.min_distinct_kinds || 2} distinct exercise kinds.`);
  }

  if (unique(normalized.map((exercise) => exercise.bloom_level)).length < Number(validationRules.min_distinct_bloom_levels || 2)) {
    errors.push(`Lesson must contain at least ${validationRules.min_distinct_bloom_levels || 2} distinct Bloom levels.`);
  }

  if (correctIndexes.length > 1 && correctIndexes.every((index) => index === correctIndexes[0])) {
    warnings.push(`All correct answers use option index ${correctIndexes[0]}; shuffle positions more evenly.`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized
  };
};

export const loadRules = async (rulesArg = 'data/lessons/cefr-exercise-rules.json') => {
  const rulesPath = await resolveExistingPath(rulesArg, ['lessons', 'cefr-exercise-rules.json']);
  const rules = JSON.parse(await readFile(rulesPath, 'utf8'));
  return { rulesPath, rules };
};

export const loadLessons = async ({
  inputDirArg = 'data/lessons/normalized',
  lessonFilterArg = null,
  levelFilterArg = null,
  limitArg = null
} = {}) => {
  const sourceDir = await resolveExistingPath(inputDirArg, ['lessons', 'normalized']);
  return {
    sourceDir,
    entries: await loadLessonEntries(sourceDir, { lessonFilterArg, levelFilterArg, limitArg })
  };
};

export const validateLessonEntries = ({ entries, rules }) => {
  const distractorUsage = new Map();

  return entries.map((entry) => {
    const validation = validateExercises({
      lesson: entry.lesson,
      exercises: entry.lesson.practice?.exercises || [],
      rules,
      distractorUsage,
      commitDistractors: true
    });

    return {
      lesson_id: entry.lesson.lesson_id,
      file: path.relative(repoRoot, entry.fullPath),
      ok: validation.ok,
      errors: validation.errors,
      warnings: validation.warnings
    };
  });
};

const run = async () => {
  const args = process.argv.slice(2);
  const inputDirArg = readArg(args, 'input-dir', 'data/lessons/normalized');
  const rulesArg = readArg(args, 'rules', 'data/lessons/cefr-exercise-rules.json');
  const reportArg = readArg(args, 'report', 'data/lessons/normalized/cefr-validation-report.json');
  const lessonFilterArg = readArg(args, 'lesson', null);
  const levelFilterArg = readArg(args, 'level', null);
  const limitArg = readArg(args, 'limit', null);
  const jsonOnly = hasFlag(args, 'json');

  const { rulesPath, rules } = await loadRules(rulesArg);
  const { sourceDir, entries } = await loadLessons({ inputDirArg, lessonFilterArg, levelFilterArg, limitArg });

  if (entries.length === 0) {
    throw new Error('No lesson files matched the requested filters.');
  }

  const results = validateLessonEntries({ entries, rules });
  const failed = results.filter((result) => !result.ok);
  const warningCount = results.reduce((sum, result) => sum + result.warnings.length, 0);
  const errorCount = results.reduce((sum, result) => sum + result.errors.length, 0);
  const report = {
    generated_at: new Date().toISOString(),
    mode: 'validate_exercises',
    rules: path.relative(repoRoot, rulesPath),
    source: path.relative(repoRoot, sourceDir),
    filters: {
      lesson: lessonFilterArg,
      level: levelFilterArg,
      limit: limitArg
    },
    lesson_count: entries.length,
    ok: failed.length === 0,
    pass_count: results.length - failed.length,
    failure_count: failed.length,
    error_count: errorCount,
    warning_count: warningCount,
    results
  };

  const reportPath = resolveContentPath(reportArg);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Validated ${report.lesson_count} lesson(s): ${report.pass_count} passed, ${report.failure_count} failed.`);
    console.log(`Errors: ${report.error_count}; warnings: ${report.warning_count}.`);
    console.log(`Report: ${path.relative(repoRoot, reportPath)}`);

    for (const result of failed.slice(0, 10)) {
      console.log(`\n${result.lesson_id}`);
      for (const error of result.errors.slice(0, 8)) {
        console.log(`- ${error}`);
      }
      if (result.errors.length > 8) {
        console.log(`- ... ${result.errors.length - 8} more error(s)`);
      }
    }
  }

  if (!report.ok) {
    process.exitCode = 1;
  }
};

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath || fileURLToPath(import.meta.url) === process.argv[1]) {
  await run();
}
