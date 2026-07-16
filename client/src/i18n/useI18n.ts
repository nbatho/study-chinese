import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLanguage } from "../store/modules/appSlice";
import { translateWith } from "./translate";
import type { TranslationVars } from "./translate";
import type { TranslationKey } from "./translations";
import { LANGUAGES } from "./languages";
import type { Language } from "./languages";

export const useI18n = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.app.language);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslationVars): string => translateWith(language, key, vars),
    [language]
  );

  const setAppLanguage = useCallback(
    (nextLanguage: Language) => {
      dispatch(setLanguage(nextLanguage));
      document.documentElement.lang = nextLanguage;
    },
    [dispatch]
  );

  const toggleLanguage = useCallback(() => {
    setAppLanguage(LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length]);
  }, [language, setAppLanguage]);

  return { language, setLanguage: setAppLanguage, t, toggleLanguage };
};

/**
 * Keeps `<html lang>` in step with the app language.
 *
 * `setLanguage` already updates the attribute when the user switches, but a
 * fresh page load restores the language from localStorage without going through
 * it, so a screen reader would be told the wrong language. Call this from the
 * roots that can render on their own: the app layout and the landing page.
 */
export const useDocumentLanguage = () => {
  const language = useAppSelector((state) => state.app.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
};
