import { store } from "../store/configureStore";
import { getDictionary, translations } from "./translations";
import type { TranslationKey } from "./translations";
import type { Language } from "./languages";

export type TranslationVars = Record<string, string | number>;

/** Resolves a key in `language`, falling back to English and then to the key. */
export const translateWith = (
  language: Language,
  key: TranslationKey,
  vars?: TranslationVars,
): string => {
  const template = String(getDictionary(language)[key] ?? translations.en[key] ?? key);

  if (!vars) {
    return template;
  }

  return Object.entries(vars).reduce<string>(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
};

/**
 * Translate from outside React, where `useI18n` is unavailable — react-query
 * callbacks that raise toasts, for example. Reads the language from the store
 * at call time, so the text matches whatever the user has selected. Inside a
 * component prefer `useI18n`, which re-renders when the language changes.
 */
export const translate = (key: TranslationKey, vars?: TranslationVars): string =>
  translateWith(store.getState().app.language, key, vars);
