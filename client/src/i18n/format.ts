import { LANGUAGE_META, type Language } from "./languages";
import type { TranslationKey } from "./translations";

/** Locale-aware number formatting keyed off the selected app language. */
export const formatNumber = (value: number, language: Language) =>
  new Intl.NumberFormat(LANGUAGE_META[language].localeTag).format(value);

/** Locale-aware date formatting keyed off the selected app language. */
export const formatDate = (
  value: string | number | Date,
  language: Language,
  options?: Intl.DateTimeFormatOptions,
) => new Intl.DateTimeFormat(LANGUAGE_META[language].localeTag, options).format(new Date(value));

/**
 * Translate `prefix.raw`, falling back to the raw value when no dictionary
 * entry exists (the server sends bare ids for skills, topics, etc.).
 */
export const tOrRaw = (
  t: (key: TranslationKey) => string,
  prefix: string,
  raw: string,
) => {
  const key = `${prefix}.${raw}` as TranslationKey;
  const label = t(key);
  return label === key ? raw : label;
};
