import type { Achievement } from "../../../api/achievements";
import type { TranslationKey } from "../../../i18n";

/**
 * Achievement rows carry English `title`/`description` straight from the
 * database, so they cannot follow the language switch on their own. The seeded
 * ids are a fixed set, so map each one to a translation key and keep the server
 * text as the fallback for any achievement added later.
 */
const achievementIds = [
  "first_lesson",
  "lesson_rookie",
  "lesson_grinder",
  "streak_3",
  "streak_7",
  "streak_30",
  "vocab_10",
  "vocab_50",
  "vocab_200",
  "xp_100",
  "xp_500",
  "xp_2000",
  "hsk_1",
  "hsk_2",
  "hsk_3",
  "hsk_4",
  "hsk_5",
  "hsk_6",
  "perfect_lesson",
  "tone_master",
  "shadow_speaker",
  "hanzi_starter",
  "listening_sharp",
  "pinyin_typist",
] as const;

const translatedIds = new Set<string>(achievementIds);

export default function getAchievementText(
  achievement: Achievement,
  t: (key: TranslationKey) => string,
) {
  if (!translatedIds.has(achievement.id)) {
    return { title: achievement.title, description: achievement.description };
  }

  return {
    title: t(`achievement.${achievement.id}.title` as TranslationKey),
    description: t(`achievement.${achievement.id}.description` as TranslationKey),
  };
}
