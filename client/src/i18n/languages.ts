/**
 * The languages the app can be switched to, and the single source of truth for
 * the `Language` union. `appSlice` and the translation dictionaries both derive
 * from this list, so adding a locale here is what makes it selectable.
 *
 * Only `en` and `vi` have a complete app-wide dictionary. The Chinese locales
 * are fully translated on the Landing page (see `./landing`); everywhere else
 * `useI18n` falls back to English until those dictionaries are filled in.
 */
export const LANGUAGES = ["en", "vi", "zh-Hans", "zh-Hant"] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * Each language named in itself, the short code shown on the switcher, and the
 * BCP 47 tag passed to `Intl` formatters (see `./format`).
 */
export const LANGUAGE_META: Record<Language, { code: string; nativeLabel: string; localeTag: string }> = {
  en: { code: "EN", nativeLabel: "English", localeTag: "en-US" },
  vi: { code: "VI", nativeLabel: "Tiếng Việt", localeTag: "vi-VN" },
  "zh-Hans": { code: "简", nativeLabel: "简体中文", localeTag: "zh-Hans" },
  "zh-Hant": { code: "繁", nativeLabel: "繁體中文", localeTag: "zh-Hant" },
};

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
