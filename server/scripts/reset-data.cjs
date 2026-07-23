/**
 * Full data reset: wipes every learner's progress and every content table, so that
 * `import_data.cjs` can repopulate content from `data/` with no stale rows left over.
 *
 * Why deleting is needed at all: import_data.cjs only upserts. After a lesson is
 * rewritten (fewer/renamed exercises, passages, grammar points), the rows it no
 * longer produces stay in the database forever and keep showing up in the app.
 *
 * Kept on purpose:
 *   - users  (accounts, settings, avatar, onboarding flag)
 *   - words / word_glosses / word_topics / word_topic_map / dictionary_entries
 *     (they already match `data/`, and half the schema has FKs into words)
 *   - ocr_scan_events, course_issue_reports (history, not progress)
 *
 * Usage:
 *   node scripts/reset-data.cjs            # dry run — prints what would change
 *   node scripts/reset-data.cjs --apply    # actually deletes
 *   node scripts/reset-data.cjs --apply --content-only
 *   node scripts/reset-data.cjs --apply --user-only
 *
 * After --apply (unless --user-only), run: node scripts/import_data.cjs
 */
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const contentOnly = args.includes('--content-only');
const userOnly = args.includes('--user-only');

// Learner state. Order matters only where a child has no ON DELETE CASCADE.
const USER_TABLES = [
  'user_lesson_progress',
  'user_achievements',
  'srs_cards',
  'user_mistakes',
  'daily_stats',
  'gem_transactions',
  'user_shop_items',
  'user_favorite_words',
  'custom_list_words',
  'custom_lists',
  'chat_messages',
  'chat_sessions'
];

// Content, children before parents.
const CONTENT_TABLES = [
  'exercises',
  'grammar_points',
  'dialogues',
  'reading_passages',
  'lesson_modules',
  'lesson_words',
  'lessons',
  'placement_questions',
  'achievements',
  'shop_items',
  'chat_scenarios',
  'practice_minimal_pairs',
  'practice_hanzi_strokes',
  'grammar_library',
  'daily_phrase_glosses',
  'daily_phrases',
  'content_releases'
];

// Counters on `users` that only make sense alongside the progress rows above.
const USER_RESET_SQL = `
  UPDATE users SET
    current_streak = 0,
    best_streak = 0,
    last_study_date = NULL,
    gem_balance = 0,
    streak_freezes = 0,
    premium_expires_at = NULL,
    ai_tutor_skin = 'classic',
    placement_test_completed_at = NULL,
    placement_test_score = NULL,
    updated_at = now()
`;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function counts(tables) {
  const out = {};
  for (const t of tables) {
    const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM ${t}`);
    out[t] = rows[0].n;
  }
  return out;
}

async function main() {
  await client.connect();

  const targets = [
    ...(contentOnly ? [] : USER_TABLES),
    ...(userOnly ? [] : CONTENT_TABLES)
  ];

  const before = await counts(targets);
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}${contentOnly ? ' (content only)' : ''}${userOnly ? ' (user only)' : ''}\n`);
  for (const t of targets) console.log(String(before[t]).padStart(8), t);

  if (!apply) {
    console.log('\nDry run — nothing deleted. Re-run with --apply.');
    await client.end();
    return;
  }

  await client.query('BEGIN');
  try {
    const deleted = {};
    for (const t of targets) {
      const res = await client.query(`DELETE FROM ${t}`);
      deleted[t] = res.rowCount;
    }
    let usersReset = 0;
    if (!contentOnly) {
      usersReset = (await client.query(USER_RESET_SQL)).rowCount;
    }
    await client.query('COMMIT');

    console.log('\nDeleted:');
    for (const t of targets) console.log(String(deleted[t]).padStart(8), t);
    if (!contentOnly) console.log(`\nusers rows reset (streak/gems/placement): ${usersReset}`);
    if (!userOnly) console.log('\nNext: node scripts/import_data.cjs');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  await client.end();
}

main().catch(err => { console.error(err); process.exit(1); });
