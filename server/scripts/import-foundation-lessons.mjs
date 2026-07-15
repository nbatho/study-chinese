// Upserts the pre-HSK1 pinyin/tones foundation lessons into the `lessons` table
// at hsk_level 0. Idempotent (ON CONFLICT (id) DO UPDATE). The interactive teaching
// content lives in the client; these rows carry metadata so completion counts toward
// XP/streak and syncs per account, matching the curriculum-in-code + rows-in-DB pattern.
//
// Usage (from server/, with server/.env pointing at the target DB):
//   node scripts/import-foundation-lessons.mjs --dry-run
//   node scripts/import-foundation-lessons.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const DRY_RUN = process.argv.slice(2).includes('--dry-run');

const dataPath = path.resolve(serverRoot, '..', 'data', 'lessons', 'foundation', 'foundation-lessons.json');

const readSource = () => {
  const raw = fs.readFileSync(dataPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.lessons) || parsed.lessons.length === 0) {
    throw new Error(`No lessons found in ${dataPath}`);
  }
  return parsed;
};

const upsertSql = `
  INSERT INTO lessons (
    id, title, subtitle, hsk_level, cefr_level, order_num, skill, primary_skill,
    topic, estimated_minutes, xp_reward, intro,
    title_vi, subtitle_vi, intro_vi, learning_objectives_vi,
    content_version, is_active
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12,
    $13, $14, $15, $16::jsonb,
    1, true
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    hsk_level = EXCLUDED.hsk_level,
    cefr_level = EXCLUDED.cefr_level,
    order_num = EXCLUDED.order_num,
    skill = EXCLUDED.skill,
    primary_skill = EXCLUDED.primary_skill,
    topic = EXCLUDED.topic,
    estimated_minutes = EXCLUDED.estimated_minutes,
    xp_reward = EXCLUDED.xp_reward,
    intro = EXCLUDED.intro,
    title_vi = EXCLUDED.title_vi,
    subtitle_vi = EXCLUDED.subtitle_vi,
    intro_vi = EXCLUDED.intro_vi,
    learning_objectives_vi = EXCLUDED.learning_objectives_vi,
    is_active = true,
    updated_at = now()
`;

const buildParams = (source, lesson) => [
  lesson.id,
  lesson.title,
  lesson.subtitle,
  source.hsk_level ?? 0,
  source.cefr_level ?? 'A1',
  lesson.order_num,
  lesson.skill,
  lesson.skill, // primary_skill mirrors skill (both are valid: listening/speaking)
  source.topic ?? 'pronunciation-foundation',
  lesson.estimated_minutes,
  lesson.xp_reward,
  lesson.intro,
  lesson.title_vi ?? null,
  lesson.subtitle_vi ?? null,
  lesson.intro_vi ?? null,
  JSON.stringify(lesson.objectives_vi ?? [])
];

const run = async () => {
  const source = readSource();
  console.log(`Foundation import: ${source.lessons.length} lesson(s) at hsk_level ${source.hsk_level ?? 0}${DRY_RUN ? ' (dry-run)' : ''}`);

  if (DRY_RUN) {
    for (const lesson of source.lessons) {
      console.log(`  would upsert ${lesson.id} — order ${lesson.order_num} — ${lesson.title_vi} (${lesson.xp_reward} XP)`);
    }
    console.log('Dry-run complete. No changes written.');
    return;
  }

  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const lesson of source.lessons) {
      await client.query(upsertSql, buildParams(source, lesson));
      console.log(`  upserted ${lesson.id}`);
    }
    await client.query('COMMIT');
    const { rows } = await client.query(
      'SELECT id, hsk_level, order_num, xp_reward FROM lessons WHERE hsk_level = $1 ORDER BY order_num',
      [source.hsk_level ?? 0]
    );
    console.log(`Done. ${rows.length} foundation lesson row(s) now in DB:`);
    for (const row of rows) console.log(`  ${row.id} (order ${row.order_num}, ${row.xp_reward} XP)`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closeDB();
  }
};

run().catch((error) => {
  console.error('Foundation import failed:', error.message);
  process.exit(1);
});
