import { spawn } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import {
  auditLessonLanguage,
  buildGrammarLibraryEntries,
  localizeLesson
} from '../src/services/content-language.service.js';
import { hasDatabaseConfig } from '../src/config/env.config.js';
import { repoRoot, resolveExistingPath } from '../src/config/content-paths.js';

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

const apply = hasFlag('apply');

const isLessonJson = (filename) =>
  filename.endsWith('.json') &&
  !filename.endsWith('.validation.json') &&
  !filename.endsWith('.review.json') &&
  !filename.endsWith('.release.json') &&
  !['manifest.json', 'validation-report.json', 'language-audit-report.json', 'grammar-sync-report.json', 'agent-review-report.json'].includes(filename);

const loadLessons = async (sourceDir) => {
  const files = (await readdir(sourceDir)).filter(isLessonJson).sort();
  const lessons = [];

  for (const file of files) {
    const fullPath = path.join(sourceDir, file);
    lessons.push(JSON.parse(await readFile(fullPath, 'utf8')));
  }

  return lessons;
};

const runImportScript = (sourceDir) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      path.join(serverRoot, 'scripts', 'import-generated-lessons.mjs'),
      `--input-dir=${sourceDir}`
    ], {
      cwd: serverRoot,
      stdio: 'inherit'
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Lesson import failed with exit code ${code}.`));
    });
  });

const upsertGrammarLibrary = async (lessons) => {
  if (!hasDatabaseConfig()) {
    return {
      skipped: true,
      reason: 'Missing PostgreSQL configuration.'
    };
  }

  const db = await import('../src/config/db.config.js');
  const entries = buildGrammarLibraryEntries(lessons.map(localizeLesson));

  try {
    for (const entry of entries) {
      await db.query(
        `
          INSERT INTO grammar_library (
            id, title, title_vi, pattern, summary, summary_vi, examples,
            hsk_level, cefr_level, source_lesson_ids, search_text, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10::jsonb, $11, true)
          ON CONFLICT (id)
          DO UPDATE SET
            title = EXCLUDED.title,
            title_vi = EXCLUDED.title_vi,
            pattern = EXCLUDED.pattern,
            summary = EXCLUDED.summary,
            summary_vi = EXCLUDED.summary_vi,
            examples = EXCLUDED.examples,
            hsk_level = EXCLUDED.hsk_level,
            cefr_level = EXCLUDED.cefr_level,
            source_lesson_ids = EXCLUDED.source_lesson_ids,
            search_text = EXCLUDED.search_text,
            is_active = true,
            updated_at = now()
        `,
        [
          entry.id,
          entry.title,
          entry.title_vi,
          entry.pattern,
          entry.summary,
          entry.summary_vi,
          JSON.stringify(entry.examples),
          entry.hsk_level,
          entry.cefr_level,
          JSON.stringify(entry.source_lesson_ids),
          entry.search_text
        ]
      );
    }

    return {
      skipped: false,
      imported: entries.length
    };
  } finally {
    await db.closeDB();
  }
};

const run = async () => {
  const sourceDir = await resolveExistingPath(readArg('source', 'data/lessons/normalized'), ['lessons', 'normalized']);
  const lessons = await loadLessons(sourceDir);
  const audits = lessons.map((lesson) => ({
    lesson_id: lesson.lesson_id,
    audit: auditLessonLanguage(lesson)
  }));
  const errors = audits.flatMap((item) => item.audit.errors.map((issue) => ({ lesson_id: item.lesson_id, ...issue })));
  const summary = {
    apply,
    source: path.relative(repoRoot, sourceDir),
    lessons: lessons.length,
    okToImport: errors.length === 0,
    errors
  };

  if (!summary.okToImport) {
    console.log(JSON.stringify(summary, null, 2));
    process.exitCode = 1;
    return;
  }

  if (!apply) {
    console.log(JSON.stringify({
      ...summary,
      dryRun: true,
      message: 'Pass --apply to import lessons and grammar_library into the configured database.'
    }, null, 2));
    return;
  }

  await runImportScript(sourceDir);
  const grammarLibrary = await upsertGrammarLibrary(lessons);

  console.log(JSON.stringify({
    ...summary,
    dryRun: false,
    grammarLibrary
  }, null, 2));
};

await run();
