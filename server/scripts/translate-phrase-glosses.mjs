// Generates `daily_phrase_glosses` rows: one gloss per (daily phrase, locale),
// translated from the English text via the configured AI provider
// (AI_PROVIDER / AI_MODEL / *_API_KEY in server/.env).
//
// The Shadowing tool mixes prompts from `daily_phrases` and `words`, so a gap
// here shows up as an English gloss sitting among translated ones. Sibling of
// translate-word-glosses.mjs and translate-dictionary-glosses.mjs.
//
// Usage:
//   node server/scripts/translate-phrase-glosses.mjs [--locale=vi] [--dry-run] [--force] [--limit=N] [--batch=N]
//
//   --locale=X  Target language; must be listed in GLOSS_LOCALES (default vi).
//   --dry-run   Print translations without writing to the database.
//   --force     Re-translate phrases that already have a gloss for this locale.
//               Rows with source = 'human' are skipped either way -- a
//               hand-written gloss outranks anything this script produces.
//   --limit=N   Only process the first N eligible rows.
//   --batch=N   Phrases per AI request (default 25).

import { resolveLocale, runGlossBackfill } from './lib/gloss-translation.mjs';

const locale = resolveLocale();

await runGlossBackfill({
  scriptName: 'translate-phrase-glosses',
  locale,
  fetchRows: async (client, { force, limit }) => {
    const { rows } = await client.query(
      `
        SELECT dp.id, dp.simplified, dp.pinyin, dp.english
        FROM daily_phrases dp
        LEFT JOIN daily_phrase_glosses dpg ON dpg.phrase_id = dp.id AND dpg.locale = $1
        WHERE dp.is_active = true
          AND dp.english IS NOT NULL AND dp.english <> ''
          AND (dpg.source IS NULL OR dpg.source <> 'human')
          ${force ? '' : 'AND dpg.gloss IS NULL'}
        ORDER BY dp.id
        ${limit ? `LIMIT ${limit}` : ''}
      `,
      [locale]
    );
    return rows;
  },
  formatRow: (phrase) => `${phrase.simplified} (${phrase.pinyin}): ${phrase.english}`,
  writeGloss: (client, phrase, gloss) =>
    client.query(
      `
        INSERT INTO daily_phrase_glosses (phrase_id, locale, gloss, source)
        VALUES ($1, $2, $3, 'ai')
        ON CONFLICT (phrase_id, locale)
        DO UPDATE SET gloss = EXCLUDED.gloss, source = EXCLUDED.source, updated_at = now()
      `,
      [phrase.id, locale, gloss]
    )
});
