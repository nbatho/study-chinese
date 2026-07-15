// Generates `dictionary_entry_glosses` rows for CC-CEDICT: one gloss per
// (entry, locale), translated from the English definition via the configured AI
// provider (AI_PROVIDER / AI_MODEL / *_API_KEY in server/.env).
//
// Sibling of translate-word-glosses.mjs, which does the same for `words`. The
// Translate screen segments text against both tables, so a gap in either one
// shows up as mixed-language glosses.
//
// Scale matters here: dictionary_entries holds ~125k rows against ~11.5k in
// `words`, so this is a long, paid job — per language. Entries are processed
// shortest-first because 1-2 character entries cover the bulk of real lookups —
// run with --max-len and --limit to backfill the useful head of the table
// incrementally rather than translating all of CC-CEDICT in one go.
//
// Usage:
//   node server/scripts/translate-dictionary-glosses.mjs [--locale=vi] [--dry-run] [--force] [--limit=N] [--batch=N] [--max-len=N]
//
//   --locale=X  Target language; must be listed in GLOSS_LOCALES (default vi).
//   --dry-run   Print translations without writing to the database.
//   --force     Re-translate entries that already have a gloss for this locale.
//   --limit=N   Only process the first N eligible rows.
//   --batch=N   Entries per AI request (default 25).
//   --max-len=N Only entries whose simplified form is at most N characters.

import { argValue, resolveLocale, runGlossBackfill } from './lib/gloss-translation.mjs';

const locale = resolveLocale();
const MAX_LEN = Number(argValue('max-len', '0')) || 0;

await runGlossBackfill({
  scriptName: 'translate-dictionary-glosses',
  locale,
  fetchRows: async (client, { force, limit }) => {
    const { rows } = await client.query(
      `
        SELECT d.id, d.simplified, d.pinyin, d.english
        FROM dictionary_entries d
        LEFT JOIN dictionary_entry_glosses dg ON dg.entry_id = d.id AND dg.locale = $1
        WHERE d.english IS NOT NULL AND d.english <> ''
          ${force ? '' : 'AND dg.gloss IS NULL'}
          ${MAX_LEN ? `AND char_length(d.simplified) <= ${MAX_LEN}` : ''}
        ORDER BY char_length(d.simplified), d.simplified, d.id
        ${limit ? `LIMIT ${limit}` : ''}
      `,
      [locale]
    );
    return rows;
  },
  formatRow: (entry) => `${entry.simplified} (${entry.pinyin}): ${entry.english}`,
  writeGloss: (client, entry, gloss) =>
    client.query(
      `
        INSERT INTO dictionary_entry_glosses (entry_id, locale, gloss, source)
        VALUES ($1, $2, $3, 'ai')
        ON CONFLICT (entry_id, locale)
        DO UPDATE SET gloss = EXCLUDED.gloss, source = EXCLUDED.source, updated_at = now()
      `,
      [entry.id, locale, gloss]
    )
});
