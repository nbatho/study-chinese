import { tOrRaw } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";

type TFn = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export const clampPercent = (current: number, goal: number) => {
  if (!goal) return 0;
  return Math.max(0, Math.min(100, Math.round((current / goal) * 100)));
};

export const asString = (value: unknown) => (typeof value === "string" && value ? value : null);
export const asNumber = (value: unknown) => (typeof value === "number" ? value : null);

// The server sends skills as bare ids; an id with no `skill.<id>` entry falls
// back to the id itself rather than rendering an empty label.
export const skillLabel = (t: TFn, skill: unknown) => {
  const id = asString(skill);
  return id ? tOrRaw(t, "skill", id) : "";
};
