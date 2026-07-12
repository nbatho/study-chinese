// Populates words.han_viet with the Sino-Vietnamese (âm Hán-Việt) reading composed
// from the curated per-character map in src/utils/han-viet.js.
//
// Run the migration first (migrations/2026-07-add-han-viet.sql), then:
//   node server/scripts/seed-han-viet.mjs [--dry-run] [--force]
//
// By default only rows whose han_viet is empty are filled. Pass --force to recompute
// every row (e.g. after expanding the character map).

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { toHanViet } from '../src/utils/han-viet.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

const run = async () => {
  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT id, simplified, han_viet FROM words ${FORCE ? '' : 'WHERE han_viet IS NULL OR han_viet = \'\''}`
    );

    console.log(`Scanning ${rows.length} word rows${FORCE ? ' (force)' : ' (missing only)'}.`);
    let unresolved = 0;
    let unchanged = 0;

    // Compute readings up front, then apply in batched bulk UPDATEs (one round-trip
    // per BATCH_SIZE rows) — a per-row UPDATE over a remote DB is far too slow.
    const pending = [];
    for (const word of rows) {
      const hanViet = toHanViet(word.simplified);
      if (!hanViet) {
        unresolved += 1;
        continue;
      }
      if (hanViet === word.han_viet) {
        unchanged += 1;
        continue;
      }
      pending.push({ id: word.id, hanViet });
      if (DRY_RUN) console.log(`${word.simplified} -> ${hanViet}`);
    }

    let updated = 0;
    const BATCH_SIZE = 500;
    if (!DRY_RUN) {
      for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        const values = [];
        const tuples = batch.map((row, idx) => {
          values.push(row.id, row.hanViet);
          return `($${idx * 2 + 1}, $${idx * 2 + 2})`;
        });
        await client.query(
          `
            UPDATE words AS w
            SET han_viet = v.han_viet, updated_at = now()
            FROM (VALUES ${tuples.join(', ')}) AS v(id, han_viet)
            WHERE w.id = v.id
          `,
          values
        );
        updated += batch.length;
        process.stdout.write(`\rUpdated ${updated}/${pending.length}...`);
      }
      if (updated) process.stdout.write('\n');
    } else {
      updated = pending.length;
    }

    console.log(
      JSON.stringify({ ok: true, dryRun: DRY_RUN, force: FORCE, updated, unchanged, unresolved }, null, 2)
    );
  } finally {
    client.release();
    await closeDB();
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
