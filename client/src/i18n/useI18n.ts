import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLanguage } from "../store/modules/appSlice";
import { translations } from "./translations";
import type { Language, TranslationKey } from "./translations";

type Vars = Record<string, string | number>;

export const useI18n = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.app.language);

  const t = useCallback(
    (key: TranslationKey, vars?: Vars): string => {
      const template = String(translations[language][key] ?? translations.en[key] ?? key);

      if (!vars) {
        return template;
      }

      return Object.entries(vars).reduce<string>(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        template
      );
    },
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
    setAppLanguage(language === "en" ? "vi" : "en");
  }, [language, setAppLanguage]);

  return { language, setLanguage: setAppLanguage, t, toggleLanguage };
};
