// Merges `words` rows that share the same `simplified` form.
//
// Three import paths seeded the table independently and each kept something the
// others lack, so the duplicates cannot simply be deleted:
//   wd_*      mock-data.sql seed  -> only source of `english_vi` (Vietnamese gloss)
//   hsk_*     import-hsk-vocabulary.js -> only rows mapped in `word_topic_map`
//   lesson_*  import-generated-lessons.mjs -> linked from `lesson_words`
// On top of that, srs_cards / user_favorite_words / custom_list_words / lesson_words
// cascade on delete, so dropping a row would silently take user progress with it.
//
// This script therefore keeps one canonical row per form, fills its empty columns
// from the rows being retired, repoints every foreign key onto it, and only then
// deletes the leftovers.
//
// Usage: node server/scripts/merge-duplicate-words.mjs [--apply]
//        (without --apply it reports what would change and rolls back)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const { closeDB, query, withTransaction } = await import('../src/config/db.config.js');

const apply = process.argv.slice(2).includes('--apply');

// Columns copied from a retired row onto the canonical row when the canonical
// value is NULL / empty. Never overwrites a value the canonical row already has.
const MERGEABLE_COLUMNS = [
  'traditional',
  'pinyin',
  'pinyin_plain',
  'tones',
  'english',
  'english_vi',
  'part_of_speech',
  'hsk_level',
  'category',
  'cefr_level',
  'radical',
  'frequency',
  'han_viet',
  'level_sources',
  'all_forms',
  'classifiers'
];

// `tones` / `classifiers` are native arrays the driver maps on its own, but the
// jsonb columns have to be handed over as JSON text or pg sends an array literal.
const JSONB_COLUMNS = new Set(['level_sources', 'all_forms']);

// Foreign keys onto words(id). Tables keyed by (word_id + something) can collide
// when two duplicates are referenced by the same parent, so they are repointed
// with a NOT EXISTS guard and the surviving stragglers are dropped.
const CASCADING_REFS = [
  { table: 'srs_cards', column: 'word_id', peer: 'user_id' },
  { table: 'user_favorite_words', column: 'word_id', peer: 'user_id' },
  { table: 'custom_list_words', column: 'word_id', peer: 'list_id' },
  { table: 'lesson_words', column: 'word_id', peer: 'lesson_id' },
  { table: 'word_topic_map', column: 'word_id', peer: 'topic_id' }
];

// These null out instead of cascading, and have no uniqueness on word_id.
const NULLABLE_REFS = [
  { table: 'course_issue_reports', column: 'word_id' },
  { table: 'user_mistakes', column: 'word_id' },
  { table: 'exercises', column: 'audio_word_id' }
];

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && !value.trim()) ||
  (Array.isArray(value) && value.length === 0);

const sourceRank = (id) => {
  if (id.startsWith('lesson_')) return 0; // authored: pinyin carries tone sandhi
  if (id.startsWith('wd_')) return 1; // seed: carries the Vietnamese glosses
  return 2; // hsk_*: bulk CC-CEDICT import
};

const usageOf = (row) => Number(row.srs) + Number(row.lw) + Number(row.fav) + Number(row.lists);

// The canonical row is the one the most user data already points at, so the
// merge moves as few rows as possible. Ties fall back to the authored sources.
const pickCanonical = (rows) =>
  [...rows].sort((a, b) => usageOf(b) - usageOf(a) || sourceRank(a.id) - sourceRank(b.id) || a.id.localeCompare(b.id))[0];

const loadDuplicateGroups = async () => {
  const { rows } = await query(`
    SELECT
      w.*,
      (SELECT count(*) FROM srs_cards s WHERE s.word_id = w.id)::int AS srs,
      (SELECT count(*) FROM lesson_words lw WHERE lw.word_id = w.id)::int AS lw,
      (SELECT count(*) FROM user_favorite_words f WHERE f.word_id = w.id)::int AS fav,
      (SELECT count(*) FROM custom_list_words c WHERE c.word_id = w.id)::int AS lists
    FROM words w
    WHERE w.simplified IN (SELECT simplified FROM words GROUP BY simplified HAVING count(*) > 1)
    ORDER BY w.simplified, w.id
  `);

  const groups = new Map();

  for (const row of rows) {
    if (!groups.has(row.simplified)) {
      groups.set(row.simplified, []);
    }

    groups.get(row.simplified).push(row);
  }

  return [...groups.values()];
};

const mergeGroup = async (client, group) => {
  const canonical = pickCanonical(group);
  const retired = group.filter((row) => row.id !== canonical.id);
  const retiredIds = retired.map((row) => row.id);
  const filled = {};

  for (const column of MERGEABLE_COLUMNS) {
    if (!isEmpty(canonical[column])) {
      continue;
    }

    const donor = retired.find((row) => !isEmpty(row[column]));

    if (donor) {
      filled[column] = donor[column];
    }
  }

  for (const ref of CASCADING_REFS) {
    await client.query(
      `
        UPDATE ${ref.table} t SET ${ref.column} = $1
        WHERE t.${ref.column} = ANY($2::varchar[])
          AND NOT EXISTS (
            SELECT 1 FROM ${ref.table} k
            WHERE k.${ref.column} = $1 AND k.${ref.peer} = t.${ref.peer}
          )
      `,
      [canonical.id, retiredIds]
    );
    await client.query(`DELETE FROM ${ref.table} WHERE ${ref.column} = ANY($1::varchar[])`, [retiredIds]);
  }

  for (const ref of NULLABLE_REFS) {
    await client.query(
      `UPDATE ${ref.table} SET ${ref.column} = $1 WHERE ${ref.column} = ANY($2::varchar[])`,
      [canonical.id, retiredIds]
    );
  }

  const entries = Object.entries(filled);

  if (entries.length) {
    const assignments = entries
      .map(([column], index) => `${column} = $${index + 2}${JSONB_COLUMNS.has(column) ? '::jsonb' : ''}`)
      .join(', ');

    await client.query(
      `UPDATE words SET ${assignments}, updated_at = now() WHERE id = $1`,
      [canonical.id, ...entries.map(([column, value]) => (JSONB_COLUMNS.has(column) ? JSON.stringify(value) : value))]
    );
  }

  await client.query(`DELETE FROM words WHERE id = ANY($1::varchar[])`, [retiredIds]);

  // search_text drives dictionary lookup, so it has to reflect the merged gloss.
  await client.query(
    `
      UPDATE words
      SET search_text = concat_ws(' ', simplified, traditional, pinyin, pinyin_plain, english, english_vi, han_viet)
      WHERE id = $1
    `,
    [canonical.id]
  );

  return { canonical, retiredIds, filled: Object.keys(filled) };
};

// A merge must never lose a user's card, favourite or list entry — only collapse
// two rows that pointed at the same thing. Counting distinct (owner, form) pairs
// stays stable across the repoint, so any drop here means a real data loss.
const linkageSnapshot = async (client) => {
  const { rows } = await client.query(`
    SELECT
      (SELECT count(DISTINCT (s.user_id, w.simplified)) FROM srs_cards s JOIN words w ON w.id = s.word_id)::int AS srs,
      (SELECT count(DISTINCT (f.user_id, w.simplified)) FROM user_favorite_words f JOIN words w ON w.id = f.word_id)::int AS fav,
      (SELECT count(DISTINCT (c.list_id, w.simplified)) FROM custom_list_words c JOIN words w ON w.id = c.word_id)::int AS lists,
      (SELECT count(DISTINCT (lw.lesson_id, w.simplified)) FROM lesson_words lw JOIN words w ON w.id = lw.word_id)::int AS lesson_words,
      (SELECT count(DISTINCT (m.topic_id, w.simplified)) FROM word_topic_map m JOIN words w ON w.id = m.word_id)::int AS topics,
      (SELECT count(*) FROM words)::int AS words,
      (SELECT count(*) FROM words WHERE english_vi IS NOT NULL)::int AS with_vi
  `);

  return rows[0];
};

const run = async () => {
  const groups = await loadDuplicateGroups();

  if (!groups.length) {
    console.log('No duplicate `simplified` forms found. Nothing to merge.');
    return;
  }

  console.log(`Found ${groups.length} duplicated forms (${groups.reduce((sum, g) => sum + g.length, 0)} rows).\n`);

  const results = [];

  await withTransaction(async (client) => {
    const before = await linkageSnapshot(client);

    for (const group of groups) {
      results.push(await mergeGroup(client, group));
    }

    const after = await linkageSnapshot(client);
    const lost = Object.keys(before).filter((key) => key !== 'words' && after[key] < before[key]);

    for (const result of results) {
      const filled = result.filled.length ? `  +filled: ${result.filled.join(', ')}` : '';
      console.log(`${result.canonical.simplified}  keep ${result.canonical.id}  drop ${result.retiredIds.join(', ')}${filled}`);
    }

    const { rows } = await client.query(
      `SELECT count(*)::int AS remaining FROM (SELECT simplified FROM words GROUP BY simplified HAVING count(*) > 1) x`
    );

    console.log(`\nDuplicated forms remaining after merge: ${rows[0].remaining}`);
    console.log('\n                 before -> after');

    for (const key of Object.keys(before)) {
      console.log(`  ${key.padEnd(14)} ${String(before[key]).padStart(6)} -> ${after[key]}`);
    }

    if (lost.length) {
      throw new Error(`Refusing to merge: this would drop ${lost.join(', ')} linkage.`);
    }

    if (!apply) {
      // Everything above ran for real inside this transaction; rolling back is
      // what makes the run a preview.
      throw new Error('DRY_RUN_ROLLBACK');
    }
  }).catch((error) => {
    if (error.message !== 'DRY_RUN_ROLLBACK') {
      throw error;
    }
  });

  console.log(
    apply
      ? `\nApplied: merged ${results.length} forms, deleted ${results.reduce((sum, r) => sum + r.retiredIds.length, 0)} rows.`
      : '\nDry run — rolled back. Re-run with --apply to commit.'
  );
};

try {
  await run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await closeDB();
}
