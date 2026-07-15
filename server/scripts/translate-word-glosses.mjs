// Generates `word_glosses` rows for the curated HSK vocabulary: one gloss per
// (word, locale), translated from the CC-CEDICT English definition via the
// configured AI provider (AI_PROVIDER / AI_MODEL / *_API_KEY in server/.env).
//
// The SRS (Review) and Dictionary screens show the gloss matching the UI
// language, falling back to the English definition when that locale has no
// gloss for the word yet.
//
// Sibling of translate-dictionary-glosses.mjs, which does the same for the much
// larger `dictionary_entries`. The Translate screen segments text against both
// tables, so a gap in either one shows up as mixed-language glosses.
//
// Usage:
//   node server/scripts/translate-word-glosses.mjs [--locale=vi] [--dry-run] [--force] [--limit=N] [--batch=N]
//
//   --locale=X  Target language; must be listed in GLOSS_LOCALES (default vi).
//   --dry-run   Print translations without writing to the database.
//   --force     Re-translate words that already have a gloss for this locale.
//   --limit=N   Only process the first N eligible rows.
//   --batch=N   Words per AI request (default 25).

import { resolveLocale, runGlossBackfill } from './lib/gloss-translation.mjs';

const locale = resolveLocale();

await runGlossBackfill({
  scriptName: 'translate-word-glosses',
  locale,
  fetchRows: async (client, { force, limit }) => {
    const { rows } = await client.query(
      `
        SELECT w.id, w.simplified, w.pinyin, w.english
        FROM words w
        LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $1
        WHERE w.is_active = true
          AND w.english IS NOT NULL AND w.english <> ''
          ${force ? '' : 'AND wg.gloss IS NULL'}
        ORDER BY w.hsk_level, w.frequency NULLS LAST, w.id
        ${limit ? `LIMIT ${limit}` : ''}
      `,
      [locale]
    );
    return rows;
  },
  formatRow: (word) => `${word.simplified} (${word.pinyin}): ${word.english}`,
  writeGloss: (client, word, gloss) =>
    client.query(
      `
        INSERT INTO word_glosses (word_id, locale, gloss, source)
        VALUES ($1, $2, $3, 'ai')
        ON CONFLICT (word_id, locale)
        DO UPDATE SET gloss = EXCLUDED.gloss, source = EXCLUDED.source, updated_at = now()
      `,
      [word.id, locale, gloss]
    )
});
