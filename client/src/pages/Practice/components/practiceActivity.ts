import { useAddActivityMutation } from "../../../api";
import type { MistakePayload } from "../../../api/users";
import { playCorrectSound, playIncorrectSound } from "../../../utils/sfx";

export type AddActivityMutation = ReturnType<typeof useAddActivityMutation>;

/** Audio cue played the moment an answer is checked, in every practice tool. */
export const playAnswerSound = (correct: boolean) =>
  void (correct ? playCorrectSound() : playIncorrectSound());

/**
 * Standard activity row for one graded exercise: XP and a perfect skill score
 * on success, and the mistake payload recorded only on failure.
 */
export const recordAnswer = (
  addActivity: AddActivityMutation,
  { correct, xp, skill, mistake }: { correct: boolean; xp: number; skill: string; mistake: MistakePayload },
) =>
  addActivity.mutateAsync({
    xp: correct ? xp : 0,
    exercisesCorrect: correct ? 1 : 0,
    exercisesTotal: 1,
    skill,
    skillScore: correct ? 100 : 0,
    mistake: correct ? undefined : mistake,
  });
