// Imports hand-written glosses into `word_glosses` from a JSON file, with no AI
// provider involved — the sibling translate-word-glosses.mjs calls an LLM and is
// rate-limited into uselessness at scale (Groq 429s), and its output needs
// cleanup anyway. Rows land with source='manual' so a later AI backfill can skip
// them: translate-word-glosses.mjs only fills rows where no gloss exists.
//
// The JSON is an object keyed by simplified form:
//   { "谢谢": "cảm ơn", "东西": "đồ vật; thứ" }
//
// A simplified form can map to several word rows (variants, different HSK
// releases); every active match is updated, which is what the Translate screen
// looks up.
//
// Usage:
//   node server/scripts/import-word-glosses.mjs --file=path/to/glosses.json [--locale=vi] [--dry-run] [--force]
//
//   --locale=X  Target language; must be listed in GLOSS_LOCALES (default vi).
//   --dry-run   Report what would change without writing.
//   --force     Overwrite existing glosses for this locale (default: skip them).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { argValue, resolveLocale } from './lib/gloss-translation.mjs';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const { query, closeDB } = await import('../src/config/db.config.js');

const locale = resolveLocale();
const file = argValue('file');
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

if (!file) {
  console.error('Missing --file=path/to/glosses.json');
  process.exit(1);
}

const raw = await fs.readFile(path.resolve(file), 'utf8');
const glosses = JSON.parse(raw);
const entries = Object.entries(glosses)
  .map(([simplified, gloss]) => [String(simplified).trim(), String(gloss ?? '').trim()])
  .filter(([simplified, gloss]) => simplified && gloss);

console.log(`Importing ${entries.length} ${locale} glosses from ${file}${dryRun ? ' (dry run)' : ''}.`);

const stats = { updated: 0, skipped: 0, unmatched: [] };

for (const [simplified, gloss] of entries) {
  const { rows } = await query(
    `
      SELECT w.id, wg.gloss AS existing
      FROM words w
      LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $2
      WHERE w.is_active AND w.simplified = $1
    `,
    [simplified, locale]
  );

  if (rows.length === 0) {
    stats.unmatched.push(simplified);
    continue;
  }

  for (const row of rows) {
    if (row.existing && !force) {
      stats.skipped += 1;
      continue;
    }

    if (!dryRun) {
      await query(
        `
          INSERT INTO word_glosses (word_id, locale, gloss, source, updated_at)
          VALUES ($1, $2, $3, 'manual', now())
          ON CONFLICT (word_id, locale)
          DO UPDATE SET gloss = EXCLUDED.gloss, source = 'manual', updated_at = now()
        `,
        [row.id, locale, gloss]
      );
    }

    stats.updated += 1;
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      locale,
      dryRun,
      updated: stats.updated,
      skippedExisting: stats.skipped,
      unmatchedCount: stats.unmatched.length,
      unmatched: stats.unmatched.slice(0, 20)
    },
    null,
    2
  )
);

await closeDB();
process.exit(0);
