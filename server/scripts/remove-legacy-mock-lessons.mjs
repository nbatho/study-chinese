import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const { closeDB, query } = await import('../src/config/db.config.js');

const apply = process.argv.slice(2).includes('--apply');

// The original seed shipped 19 placeholder lessons ("Pinyin Basics", "The Four
// Tones", ...) under ids like l1_1 / l2_3. The authored HSK curriculum replaced
// them at the same (hsk_level, order_num) slots, so every leftover row is a
// duplicate that skews progress counts and can surface as a "ghost" lesson.
const LEGACY_ID_PATTERN = '^l[0-9]+_[0-9]+$';

const counts = async () => {
  const { rows } = await query(
    `
      SELECT
        (SELECT count(*) FROM lessons WHERE id ~ $1) AS lessons,
        (SELECT count(*) FROM lessons WHERE id ~ $1 AND is_active) AS active_lessons,
        (SELECT count(*) FROM exercises WHERE lesson_id ~ $1) AS exercises,
        (SELECT count(*) FROM grammar_points WHERE lesson_id ~ $1) AS grammar_points,
        (SELECT count(*) FROM lesson_words WHERE lesson_id ~ $1) AS lesson_words,
        (SELECT count(*) FROM user_lesson_progress WHERE lesson_id ~ $1) AS user_progress
    `,
    [LEGACY_ID_PATTERN]
  );
  return rows[0];
};

try {
  const before = await counts();
  console.log('Legacy mock rows found:', before);

  if (Number(before.active_lessons) > 0) {
    throw new Error(
      `Refusing to run: ${before.active_lessons} legacy lesson(s) are still active. ` +
        'Verify the authored curriculum has replaced them before deleting.'
    );
  }

  if (Number(before.lessons) === 0) {
    console.log('Nothing to clean up.');
  } else if (!apply) {
    console.log('\nDry run - pass --apply to delete. Child rows cascade from lessons.');
  } else {
    // exercises / grammar_points / lesson_words / user_lesson_progress all
    // declare ON DELETE CASCADE against lessons(id).
    const { rows } = await query(`DELETE FROM lessons WHERE id ~ $1 RETURNING id`, [LEGACY_ID_PATTERN]);
    console.log(`\nDeleted ${rows.length} legacy lessons:`, rows.map((row) => row.id).join(', '));
    console.log('Remaining legacy rows:', await counts());
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closeDB();
}
