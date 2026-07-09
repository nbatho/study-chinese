import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { auditLessonLanguage } from '../src/services/content-language.service.js';
import { repoRoot, resolveContentPath, resolveExistingPath, findLessonFiles } from '../src/config/content-paths.js';
import { isLessonJson } from './lesson-data-files.mjs';

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

const loadLessons = async (sourceDir) => {
  const files = (await findLessonFiles(sourceDir, isLessonJson)).sort();
  const lessons = [];

  for (const fullPath of files) {
    lessons.push({
      file: path.relative(repoRoot, fullPath),
      lesson: JSON.parse(await readFile(fullPath, 'utf8'))
    });
  }

  return lessons;
};

const databaseAudit = async () => {
  const { hasDatabaseConfig } = await import('../src/config/env.config.js');

  if (!hasDatabaseConfig()) {
    return {
      skipped: true,
      reason: 'Missing PostgreSQL configuration.'
    };
  }

  const db = await import('../src/config/db.config.js');
  const issues = [];

  try {
    const requiredColumns = [
      ['lessons', 'title_vi'],
      ['lessons', 'learning_objectives_vi'],
      ['grammar_points', 'hsk_level'],
      ['grammar_points', 'cefr_level'],
      ['grammar_points', 'explanation_vi'],
      ['exercises', 'prompt_vi'],
      ['dialogues', 'title_vi'],
      ['reading_passages', 'content_vi'],
      ['grammar_library', 'source_lesson_ids']
    ];
    const columnResult = await db.query(
      `
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = ANY($1::text[])
      `,
      [[...new Set(requiredColumns.map(([table]) => table))]]
    );
    const existing = new Set(columnResult.rows.map((row) => `${row.table_name}.${row.column_name}`));

    for (const [table, column] of requiredColumns) {
      if (!existing.has(`${table}.${column}`)) {
        issues.push({
          severity: 'error',
          code: 'db_column_missing',
          message: `${table}.${column} is missing. Run migrations/001-content-localization.sql first.`
        });
      }
    }

    const grammarLevelResult = await db.query(
      `
        SELECT COUNT(*)::int AS count
        FROM grammar_points
        WHERE hsk_level IS NULL OR cefr_level IS NULL
      `
    ).catch((error) => ({ rows: [{ count: 0, skipped: error.message }] }));

    if (Number(grammarLevelResult.rows[0]?.count || 0) > 0) {
      issues.push({
        severity: 'error',
        code: 'db_grammar_level_missing',
        message: 'Some grammar_points rows are missing hsk_level or cefr_level.',
        details: { count: Number(grammarLevelResult.rows[0].count) }
      });
    }

    const activeLessonResult = await db.query(
      `
        SELECT hsk_level, cefr_level, COUNT(*)::int AS count
        FROM lessons
        WHERE is_active = true
        GROUP BY hsk_level, cefr_level
        ORDER BY hsk_level, cefr_level
      `
    );
    const learnerEnglishPattern = '%(answer|arrange|choose|complete|does|listen|match|mean|question|read|select|what|which)%';
    const learnerEnglishResult = await db.query(
      `
        SELECT e.id, e.prompt
        FROM exercises e
        JOIN lessons l ON l.id = e.lesson_id
        WHERE l.is_active = true
          AND lower(e.prompt) SIMILAR TO $1
        ORDER BY e.id
        LIMIT 20
      `,
      [learnerEnglishPattern]
    );

    if (learnerEnglishResult.rowCount > 0) {
      issues.push({
        severity: 'error',
        code: 'db_learner_facing_english',
        message: 'Active lesson exercises still contain learner-facing English prompts.',
        details: { matches: learnerEnglishResult.rows }
      });
    }

    return {
      skipped: false,
      issues,
      activeLessonsByLevel: activeLessonResult.rows,
      learnerFacingEnglishPromptMatches: learnerEnglishResult.rows
    };
  } finally {
    await db.closeDB();
  }
};

const run = async () => {
  const sourceDir = await resolveExistingPath(readArg('source', 'data/lessons/normalized'), ['lessons', 'normalized']);
  const outputDir = resolveContentPath(readArg('output-dir', sourceDir));
  const lessons = await loadLessons(sourceDir);
  const results = lessons.map(({ file, lesson }) => {
    const audit = auditLessonLanguage(lesson);
    return {
      lesson_id: lesson.lesson_id || path.basename(file, '.json'),
      file,
      ok: audit.ok,
      errors: audit.errors,
      warnings: audit.warnings
    };
  });
  const dbAudit = hasFlag('db') ? await databaseAudit() : { skipped: true, reason: 'Pass --db to audit database metadata.' };
  const allIssues = [
    ...results.flatMap((result) => result.errors),
    ...((dbAudit.skipped ? [] : dbAudit.issues) || []).filter((issue) => issue.severity === 'error')
  ];
  const report = {
    audited_at: new Date().toISOString(),
    source: path.relative(repoRoot, sourceDir),
    count: results.length,
    ok: allIssues.length === 0,
    results,
    database: dbAudit
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'language-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exitCode = 1;
  }
};

await run();
