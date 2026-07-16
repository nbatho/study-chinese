import type { SkillLevel } from "../api/users/types";
import type { TranslationKey } from "./translations";

/**
 * `startLevel` is stored as an English enum, so anything showing it to the user
 * has to resolve it through these keys rather than printing the raw value.
 */
export const startLevelKeys: Record<SkillLevel, TranslationKey> = {
  beginner: "placement.levelBeginner",
  elementary: "placement.levelElementary",
  intermediate: "placement.levelIntermediate",
  upper_intermediate: "placement.levelUpperIntermediate",
  advanced: "placement.levelAdvanced",
  mastery: "placement.levelMastery",
};
