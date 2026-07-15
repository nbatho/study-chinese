// Single source of truth for the languages glosses and translations are served in.
//
// `english` on `words` / `dictionary_entries` is the source text every gloss is
// translated from, so 'en' needs no rows in the gloss tables and is the
// fallback whenever a locale has no gloss for an entry yet.
//
// To add a language: add its code to GLOSS_LOCALES and its English name to
// LOCALE_NAMES, add the matching locale to the client's translations.ts, then
// generate the data with
//   node server/scripts/translate-word-glosses.mjs --locale=<code>
//   node server/scripts/translate-dictionary-glosses.mjs --locale=<code>

export const SOURCE_LOCALE = 'en';

export const GLOSS_LOCALES = ['vi'];

export const SUPPORTED_LOCALES = [SOURCE_LOCALE, ...GLOSS_LOCALES];

// English names, used to address the AI provider in translation prompts.
export const LOCALE_NAMES = {
  en: 'English',
  vi: 'Vietnamese'
};

/**
 * Resolve a client-supplied language tag to a locale we can serve. Accepts full
 * tags like `vi-VN` and falls back rather than throwing, since a stale or
 * unknown tag should still return usable definitions.
 *
 * Gloss lookups pass no `fallback`: an untranslated entry should read as its
 * English source. The Translate screen passes 'vi', its long-standing default
 * for requests that omit a target language.
 */
export const normalizeLocale = (value, fallback = SOURCE_LOCALE) => {
  const tag = String(value ?? '')
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return SUPPORTED_LOCALES.includes(tag) ? tag : fallback;
};
