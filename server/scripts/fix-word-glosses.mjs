// Repairs `words` rows whose gloss landed on the wrong CC-CEDICT sense
// (surname/variant entries picked first during the HSK vocabulary import).
// For each affected row it selects the best non-surname, non-variant sense
// from dictionary_entries for the same simplified form and rewrites
// pinyin / pinyin_plain / tones / english / search_text.
//
// Usage: node server/scripts/fix-word-glosses.mjs [--dry-run]

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { toDiacriticPinyin } from './pinyin-utils.mjs';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const DRY_RUN = process.argv.includes('--dry-run');

const BAD_GLOSS = /^(surname |variant of|old variant|used in |\(archaic\)|see [一-鿿])/i;

const isBadSense = (english, pinyin) =>
  BAD_GLOSS.test(String(english || '')) || /^[A-Z]/.test(String(pinyin || '')) === (String(english || '').startsWith('surname'));

const scoreCandidate = (candidate, word) => {
  let score = 0;
  const english = String(candidate.english || '');
  if (BAD_GLOSS.test(english)) score -= 100;
  // Prefer the same reading (tone-insensitive) as the original row.
  if (candidate.pinyin_plain === word.pinyin_plain) score += 10;
  // Prefer non-proper-noun readings.
  if (!/^[A-Z]/.test(String(candidate.pinyin || ''))) score += 5;
  // Prefer everyday senses over bound-form/literary/onomatopoeia stubs.
  if (/^\((bound form|literary|onom\.|dialect|coll\.)\)/.test(english)) score -= 3;
  // Prefer richer definitions over one-word stubs, but not enormously long ones.
  score += Math.min(String(english).length, 120) / 120;
  return score;
};

const numberedTones = (numbered) => [...String(numbered).matchAll(/[a-zü]+([1-5])/gi)].map((match) => Number(match[1]));

const run = async () => {
  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    const { rows: badWords } = await client.query(`
      SELECT id, simplified, pinyin, pinyin_plain, english
      FROM words
      WHERE is_active = true
        AND (english ILIKE 'surname %' OR english ILIKE 'variant of%' OR english ILIKE 'old variant%')
    `);

    console.log(`Found ${badWords.length} words with surname/variant glosses.`);
    let fixed = 0;
    let skipped = 0;

    for (const word of badWords) {
      const { rows: candidates } = await client.query(
        `SELECT pinyin, pinyin_plain, english FROM dictionary_entries WHERE simplified = $1`,
        [word.simplified]
      );

      const viable = candidates
        .filter((candidate) => !BAD_GLOSS.test(String(candidate.english || '')))
        .sort((a, b) => scoreCandidate(b, word) - scoreCandidate(a, word));

      if (viable.length === 0) {
        skipped += 1;
        continue;
      }

      const best = viable[0];
      const diacritic = toDiacriticPinyin(best.pinyin);
      const tones = numberedTones(best.pinyin);
      // Keep definitions readable in the UI: first three sense fragments.
      const english = String(best.english).split(';').slice(0, 3).join(';').trim();

      if (DRY_RUN) {
        console.log(`${word.simplified}: "${word.english}" (${word.pinyin}) -> "${english}" (${diacritic})`);
      } else {
        await client.query(
          `
            UPDATE words
            SET pinyin = $2::text,
                pinyin_plain = $3::text,
                tones = $4::int[],
                english = $5::text,
                search_text = concat_ws(' ', simplified, traditional, $2::text, $3::text, $5::text, category),
                updated_at = now()
            WHERE id = $1
          `,
          [word.id, diacritic, best.pinyin_plain, tones, english]
        );
      }
      fixed += 1;
    }

    console.log(JSON.stringify({ ok: true, dryRun: DRY_RUN, candidatesFixed: fixed, skippedNoAlternative: skipped }, null, 2));
  } catch (error) {
    console.error('fix-word-glosses failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await closeDB?.().catch(() => {});
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  }
};

await run();
