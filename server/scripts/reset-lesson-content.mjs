import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { repoRoot, resolveExistingPath } from '../src/config/content-paths.js';
import { loadLessonEntries } from './lesson-data-files.mjs';

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
const deleteOldLessons = hasFlag('delete-old-lessons');
const loadLessonIds = async (sourceDir) => {
  const entries = await loadLessonEntries(sourceDir);
  return [...new Set(entries.map(({ lesson }) => lesson.lesson_id).filter(Boolean))];
};

const countRows = async (client, table, lessonIds) => {
  const result = await client.query(
    `SELECT COUNT(*)::int AS count FROM ${table} WHERE lesson_id = ANY($1::text[])`,
    [lessonIds]
  );

  return Number(result.rows[0]?.count || 0);
};

const deleteRows = async (client, table, lessonIds) => {
  const result = await client.query(
    `DELETE FROM ${table} WHERE lesson_id = ANY($1::text[])`,
    [lessonIds]
  );

  return result.rowCount;
};

const grammarLibrarySql = `
  WHERE EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(source_lesson_ids) AS source_lesson_id(value)
    WHERE source_lesson_id.value = ANY($1::text[])
  )
`;

const run = async () => {
  const sourceDir = await resolveExistingPath(readArg('source', 'data/lessons/normalized'), ['lessons', 'normalized']);
  const targetLessonIds = await loadLessonIds(sourceDir);

  if (targetLessonIds.length === 0) {
    throw new Error('No lesson JSON files found in the source directory.');
  }

  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();
  const childTables = [
    'lesson_words',
    'grammar_points',
    'lesson_modules',
    'exercises',
    'dialogues',
    'reading_passages'
  ];

  try {
    await client.query('BEGIN');

    const activeResult = await client.query(
      'SELECT id FROM lessons WHERE is_active = true ORDER BY id'
    );
    const allLessonResult = await client.query(
      'SELECT id FROM lessons ORDER BY id'
    );
    const activeLessonIds = activeResult.rows.map((row) => row.id);
    const allLessonIds = allLessonResult.rows.map((row) => row.id);
    const targetSet = new Set(targetLessonIds);
    const activeNotInSource = activeLessonIds.filter((id) => !targetSet.has(id));
    const oldLessonIds = deleteOldLessons
      ? allLessonIds.filter((id) => !targetSet.has(id))
      : activeNotInSource;
    const lessonIdsToClear = [...new Set([...targetLessonIds, ...oldLessonIds])];

    const before = {};
    for (const table of childTables) {
      before[table] = await countRows(client, table, lessonIdsToClear);
    }

    const grammarLibraryBefore = await client.query(
      `SELECT COUNT(*)::int AS count FROM grammar_library ${grammarLibrarySql}`,
      [lessonIdsToClear]
    ).catch((error) => ({ rows: [{ count: 0, skipped: error.message }] }));

    const summary = {
      apply,
      source: path.relative(repoRoot, sourceDir),
      targetLessons: targetLessonIds.length,
      targetLessonIds,
      activeLessonsBefore: activeLessonIds.length,
      activeLessonsToDeactivate: activeNotInSource.length,
      oldLessonsToDelete: deleteOldLessons ? oldLessonIds.length : 0,
      lessonIdsToClear,
      childRowsBefore: before,
      grammarLibraryRowsToDeactivate: Number(grammarLibraryBefore.rows[0]?.count || 0)
    };

    if (!apply) {
      await client.query('ROLLBACK');
      console.log(JSON.stringify({
        ...summary,
        dryRun: true,
        message: deleteOldLessons
          ? 'Pass --apply to clear lesson child rows, delete lesson rows outside the source set, and deactivate any remaining active lessons outside the source set.'
          : 'Pass --apply to clear lesson child rows and deactivate active lessons outside the source set.'
      }, null, 2));
      return;
    }

    const deleted = {};
    for (const table of childTables) {
      deleted[table] = await deleteRows(client, table, lessonIdsToClear);
    }

    const deactivatedLessons = await client.query(
      `
        UPDATE lessons
        SET is_active = false, updated_at = now()
        WHERE is_active = true
          AND NOT (id = ANY($1::text[]))
      `,
      [targetLessonIds]
    );
    const deletedOldLessons = deleteOldLessons
      ? await client.query(
          `
            DELETE FROM lessons
            WHERE NOT (id = ANY($1::text[]))
          `,
          [targetLessonIds]
        )
      : { rowCount: 0 };
    const deactivatedGrammarLibrary = await client.query(
      `UPDATE grammar_library SET is_active = false, updated_at = now() ${grammarLibrarySql}`,
      [lessonIdsToClear]
    ).catch((error) => ({ rowCount: 0, skipped: error.message }));

    await client.query('COMMIT');

    console.log(JSON.stringify({
      ...summary,
      dryRun: false,
      childRowsDeleted: deleted,
      deactivatedLessons: deactivatedLessons.rowCount,
      deletedOldLessons: deletedOldLessons.rowCount,
      deactivatedGrammarLibrary: deactivatedGrammarLibrary.rowCount,
      grammarLibrarySkipped: deactivatedGrammarLibrary.skipped || null
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closeDB();
  }
};

await run();
