import type { Achievement } from "../../../api/achievements";
import type { TranslationKey } from "../../../i18n/translations";

export const categoryLabelKeys: Record<Achievement["category"], TranslationKey> = {
  lessons: "achievements.categoryLessons",
  streak: "achievements.categoryStreak",
  vocabulary: "achievements.categoryVocabulary",
  xp: "achievements.categoryXp",
  hsk: "achievements.categoryHsk",
  skill: "achievements.categorySkill",
};

export const categoryStyles: Record<Achievement["category"], string> = {
  lessons: "border-tone-2/30 bg-tone-2/10 text-tone-2",
  streak: "border-tone-4/30 bg-tone-4/10 text-tone-4",
  vocabulary: "border-tone-3/30 bg-tone-3/10 text-tone-3",
  xp: "border-gold/30 bg-gold/10 text-gold",
  hsk: "border-primary/30 bg-primary/10 text-primary",
  skill: "border-jade/30 bg-jade/10 text-jade",
};
