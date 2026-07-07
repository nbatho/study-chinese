import { readFile } from 'node:fs/promises';
import { query as defaultQuery } from '../config/db.config.js';
import { contentPath } from '../config/content-paths.js';
import { auditLessonLanguage } from './content-language.service.js';

const schemaPath = contentPath('schemas', 'lesson-template.schema.json');
const HANZI_PATTERN = /[\u3400-\u9fff]+/g;
const ALLOWED_SKILLS = new Set(['listening', 'speaking', 'reading', 'writing', 'mixed']);
const ALLOWED_BLOOM_LEVELS = new Set([
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create'
]);

const LEVEL_LENGTHS = [
  { maxLevel: 2, min: 20, max: 100 },
  { maxLevel: 4, min: 50, max: 220 },
  { maxLevel: 6, min: 120, max: 420 },
  { maxLevel: 9, min: 200, max: 800 }
];

const pushIssue = (issues, severity, code, message, details = undefined) => {
  issues.push({ severity, code, message, details });
};

const collectStrings = (value, output = []) => {
  if (typeof value === 'string') {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, output);
    }
    return output;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectStrings(item, output);
    }
  }

  return output;
};

const extractHanziTerms = (lesson) => {
  const textTerms = collectStrings(lesson)
    .flatMap((text) => text.match(HANZI_PATTERN) || [])
    .filter(Boolean);
  const vocabTerms = (lesson?.vocabulary_focus || [])
    .map((item) => item?.simplified)
    .filter(Boolean);

  return [...new Set([...textTerms, ...vocabTerms])];
};

const countHanzi = (lesson) =>
  collectStrings(lesson)
    .join('')
    .match(/[\u3400-\u9fff]/g)?.length || 0;

const validateRequired = (value, fields, pathLabel, issues) => {
  for (const field of fields) {
    if (value?.[field] === undefined || value?.[field] === null || value?.[field] === '') {
      pushIssue(issues, 'error', 'schema_required', `${pathLabel}.${field} is required.`);
    }
  }
};

export class ContentValidator {
  constructor({ query = defaultQuery, skipDatabaseChecks = false, requireDatabaseChecks = false } = {}) {
    this.query = query;
    this.skipDatabaseChecks = skipDatabaseChecks;
    this.requireDatabaseChecks = requireDatabaseChecks;
  }

  pushDatabaseUnavailableIssue(issues, code, message, error) {
    pushIssue(
      issues,
      this.requireDatabaseChecks ? 'error' : 'warning',
      code,
      message,
      error ? { reason: error.message } : undefined
    );
  }

  async schemaValidate(lesson) {
    const issues = [];
    validateRequired(lesson, [
      'lesson_id',
      'metadata',
      'learning_objectives',
      'vocabulary_focus',
      'grammar_focus',
      'warm_up',
      'core_modules',
      'practice',
      'review'
    ], 'lesson', issues);

    validateRequired(lesson?.metadata, [
      'title_zh',
      'title_en',
      'hsk_level',
      'cefr_level',
      'primary_skill',
      'topic',
      'estimated_minutes',
      'xp_reward'
    ], 'metadata', issues);

    if (lesson?.metadata?.primary_skill && !ALLOWED_SKILLS.has(lesson.metadata.primary_skill)) {
      pushIssue(issues, 'error', 'schema_enum', 'metadata.primary_skill is not supported.');
    }

    if (!Array.isArray(lesson?.learning_objectives) || lesson.learning_objectives.length === 0) {
      pushIssue(issues, 'error', 'schema_min_items', 'learning_objectives must contain at least one item.');
    }

    if (!Array.isArray(lesson?.core_modules) || lesson.core_modules.length === 0) {
      pushIssue(issues, 'error', 'schema_min_items', 'core_modules must contain at least one module.');
    }

    for (const [index, module] of (lesson?.core_modules || []).entries()) {
      if (!['listening', 'speaking', 'reading', 'writing'].includes(module?.module_type)) {
        pushIssue(issues, 'error', 'schema_enum', `core_modules[${index}].module_type is not supported.`);
      }

      if (!Array.isArray(module?.phases) || module.phases.length === 0) {
        pushIssue(issues, 'error', 'schema_min_items', `core_modules[${index}].phases must not be empty.`);
      }
    }

    for (const [index, exercise] of (lesson?.practice?.exercises || []).entries()) {
      validateRequired(exercise, ['kind', 'prompt'], `practice.exercises[${index}]`, issues);

      if (exercise?.skill && !ALLOWED_SKILLS.has(exercise.skill)) {
        pushIssue(issues, 'error', 'schema_enum', `practice.exercises[${index}].skill is not supported.`);
      }

      if (exercise?.bloom_level && !ALLOWED_BLOOM_LEVELS.has(exercise.bloom_level)) {
        pushIssue(issues, 'error', 'schema_enum', `practice.exercises[${index}].bloom_level is not supported.`);
      }
    }

    try {
      await readFile(schemaPath, 'utf8');
    } catch {
      pushIssue(issues, 'warning', 'schema_file_missing', 'Lesson schema file is not available on disk.');
    }

    return issues;
  }

  async vocabCheck(lesson, targetLevel = lesson?.metadata?.hsk_level) {
    const issues = [];

    if (this.skipDatabaseChecks) {
      if (this.requireDatabaseChecks) {
        pushIssue(
          issues,
          'error',
          'database_checks_disabled',
          'Vocabulary DB checks are required for production lesson validation.'
        );
      }

      return issues;
    }

    const terms = extractHanziTerms(lesson);

    if (terms.length === 0) {
      return issues;
    }

    try {
      const result = await this.query(
        `
          SELECT simplified, MIN(hsk_level)::int AS hsk_level
          FROM words
          WHERE simplified = ANY($1::text[])
            AND is_active = true
          GROUP BY simplified
        `,
        [terms]
      );
      const allowed = new Map(result.rows.map((row) => [row.simplified, Number(row.hsk_level)]));
      const unknown = terms.filter((term) => !allowed.has(term));
      const aboveLevel = terms.filter((term) => allowed.has(term) && allowed.get(term) > targetLevel);

      if (unknown.length > 0) {
        pushIssue(issues, 'error', 'vocab_unknown', 'Some Chinese terms are not in the vocabulary table.', {
          terms: unknown.slice(0, 50)
        });
      }

      if (aboveLevel.length > 0) {
        pushIssue(issues, 'error', 'vocab_above_level', 'Some Chinese terms exceed the target HSK level.', {
          targetLevel,
          terms: aboveLevel.slice(0, 50)
        });
      }
    } catch (error) {
      this.pushDatabaseUnavailableIssue(
        issues,
        'vocab_check_skipped',
        'Vocabulary check was skipped because the database was unavailable.',
        error
      );
    }

    return issues;
  }

  async pinyinVerify(lesson) {
    const issues = [];

    if (this.skipDatabaseChecks) {
      if (this.requireDatabaseChecks) {
        pushIssue(
          issues,
          'error',
          'database_checks_disabled',
          'Pinyin DB checks are required for production lesson validation.'
        );
      }

      return issues;
    }

    const focus = (lesson?.vocabulary_focus || []).filter((item) => item?.simplified && item?.pinyin);

    if (focus.length === 0) {
      return issues;
    }

    try {
      const result = await this.query(
        `
          SELECT simplified, pinyin
          FROM words
          WHERE simplified = ANY($1::text[])
            AND is_active = true
        `,
        [[...new Set(focus.map((item) => item.simplified))]]
      );
      const known = new Map(result.rows.map((row) => [row.simplified, row.pinyin]));
      const mismatches = focus.filter((item) => known.has(item.simplified) && known.get(item.simplified) !== item.pinyin);

      if (mismatches.length > 0) {
        pushIssue(issues, 'error', 'pinyin_mismatch', 'Some vocabulary pinyin values differ from the words table.', {
          terms: mismatches.map((item) => ({
            simplified: item.simplified,
            provided: item.pinyin,
            expected: known.get(item.simplified)
          }))
        });
      }
    } catch (error) {
      this.pushDatabaseUnavailableIssue(
        issues,
        'pinyin_check_skipped',
        'Pinyin check was skipped because the database was unavailable.',
        error
      );
    }

    return issues;
  }

  lengthCheck(lesson, targetLevel = lesson?.metadata?.hsk_level || 1) {
    const issues = [];
    const hanziCount = countHanzi(lesson);
    const range = LEVEL_LENGTHS.find((item) => targetLevel <= item.maxLevel) || LEVEL_LENGTHS.at(-1);

    if (hanziCount < range.min || hanziCount > range.max) {
      pushIssue(issues, 'warning', 'length_out_of_range', 'Chinese text length is outside the suggested range.', {
        targetLevel,
        hanziCount,
        suggestedMin: range.min,
        suggestedMax: range.max
      });
    }

    return issues;
  }

  async duplicateDetect(lesson) {
    const issues = [];

    if (this.skipDatabaseChecks) {
      if (this.requireDatabaseChecks) {
        pushIssue(
          issues,
          'error',
          'database_checks_disabled',
          'Duplicate DB checks are required for production lesson validation.'
        );
      }

      return issues;
    }

    const title = lesson?.metadata?.title_zh || lesson?.metadata?.title_en || lesson?.lesson_id;

    if (!title) {
      return issues;
    }

    try {
      const result = await this.query(
        `
          SELECT id, title, similarity(title, $1) AS score
          FROM lessons
          WHERE similarity(title, $1) >= 0.85
          ORDER BY score DESC
          LIMIT 5
        `,
        [title]
      );

      if (result.rowCount > 0) {
        pushIssue(issues, 'warning', 'possible_duplicate', 'Lesson title is similar to existing content.', {
          matches: result.rows
        });
      }
    } catch (error) {
      this.pushDatabaseUnavailableIssue(
        issues,
        'duplicate_check_skipped',
        'Duplicate check was skipped because the database was unavailable.',
        error
      );
    }

    return issues;
  }

  grammarCheck(lesson) {
    const issues = [];
    const grammarFocus = lesson?.grammar_focus || [];
    const targetLevel = Number(lesson?.metadata?.hsk_level || 1);
    const targetCefr = lesson?.metadata?.cefr_level;

    if (!Array.isArray(grammarFocus) || grammarFocus.length === 0) {
      pushIssue(issues, 'warning', 'grammar_missing', 'Lesson has no grammar focus.');
      return issues;
    }

    for (const [index, item] of grammarFocus.entries()) {
      if (!Array.isArray(item?.examples) || item.examples.length === 0) {
        pushIssue(issues, 'warning', 'grammar_examples_missing', `grammar_focus[${index}] has no examples.`);
      }

      if (!item?.hsk_level || !item?.cefr_level) {
        pushIssue(
          issues,
          'error',
          'grammar_level_missing',
          `grammar_focus[${index}] must include hsk_level and cefr_level.`
        );
      } else if (Number(item.hsk_level) > targetLevel) {
        pushIssue(
          issues,
          'error',
          'grammar_above_lesson_level',
          `grammar_focus[${index}] exceeds lesson HSK level.`,
          { grammarLevel: Number(item.hsk_level), targetLevel }
        );
      } else if (targetCefr && item.cefr_level && item.cefr_level !== targetCefr && Number(item.hsk_level) === targetLevel) {
        pushIssue(
          issues,
          'warning',
          'grammar_cefr_mismatch',
          `grammar_focus[${index}] CEFR level differs from the lesson CEFR level.`,
          { grammarCefr: item.cefr_level, targetCefr }
        );
      }
    }

    return issues;
  }

  languageCheck(lesson) {
    const audit = auditLessonLanguage(lesson);
    return audit.issues;
  }

  async validateLesson(lesson, targetLevel = lesson?.metadata?.hsk_level || 1) {
    const issueGroups = await Promise.all([
      this.schemaValidate(lesson),
      this.vocabCheck(lesson, targetLevel),
      this.pinyinVerify(lesson),
      this.duplicateDetect(lesson)
    ]);
    const issues = [
      ...issueGroups.flat(),
      ...this.lengthCheck(lesson, targetLevel),
      ...this.grammarCheck(lesson),
      ...this.languageCheck(lesson)
    ];
    const errors = issues.filter((issue) => issue.severity === 'error');
    const warnings = issues.filter((issue) => issue.severity === 'warning');

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      issues,
      summary: {
        errorCount: errors.length,
        warningCount: warnings.length
      }
    };
  }
}

export const validateLesson = async (lesson, targetLevel, options) => {
  const validator = new ContentValidator(options);
  return validator.validateLesson(lesson, targetLevel);
};
