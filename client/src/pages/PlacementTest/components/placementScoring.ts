import type { PlacementQuestion, PlacementResult, PlacementSection } from "../../../api/placement";
import type { CefrLevel, SkillLevel } from "../../../api/users";
import type { TranslationKey } from "../../../i18n";

const CEFR_WEIGHTS: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const INITIAL_CEFR_CEILING: CefrLevel = "A2";
const PASS_LEVEL_ACCURACY = 2 / 3;
const ADVANCE_LEVEL_ACCURACY = 2 / 3;
export const EMPTY_PLACEMENT_QUESTIONS: PlacementQuestion[] = [];

export const sectionKeys: Record<PlacementSection, TranslationKey> = {
  vocabulary: "placement.sectionVocabulary",
  grammar: "placement.sectionGrammar",
  reading: "placement.sectionReading",
};

const cefrToStartLevel: Record<CefrLevel, SkillLevel> = {
  A1: "beginner",
  A2: "elementary",
  B1: "intermediate",
  B2: "upper_intermediate",
  C1: "advanced",
  C2: "mastery",
};

export const cefrDescKeys: Record<CefrLevel, TranslationKey> = {
  A1: "cefr.descA1",
  A2: "cefr.descA2",
  B1: "cefr.descB1",
  B2: "cefr.descB2",
  C1: "cefr.descC1",
  C2: "cefr.descC2",
};

export const calculatePlacementResult = (
  questions: PlacementQuestion[],
  answersByQuestionId: Record<string, number | null>,
): PlacementResult => {
  let score = 0;
  let correct = 0;
  const answeredQuestions = questions.filter((question) => answersByQuestionId[question.id] !== null && answersByQuestionId[question.id] !== undefined);

  const breakdown = (["vocabulary", "grammar", "reading"] as PlacementSection[]).map((section) => {
    const sectionQuestions = answeredQuestions.filter((question) => question.section === section);
    let sectionScore = 0;
    let sectionCorrect = 0;

    sectionQuestions.forEach((question) => {
      if (answersByQuestionId[question.id] === question.correctIndex) {
        const weight = CEFR_WEIGHTS[question.cefrLevel] ?? 1;
        sectionScore += weight;
        sectionCorrect += 1;
      }
    });

    score += sectionScore;
    correct += sectionCorrect;

    return {
      section,
      correct: sectionCorrect,
      total: sectionQuestions.length,
      score: sectionScore,
    };
  });

  let cefrLevel: CefrLevel = "A1";

  for (const level of CEFR_LEVELS) {
    const levelQuestions = answeredQuestions.filter((question) => question.cefrLevel === level);
    if (!levelQuestions.length) continue;

    const levelCorrect = levelQuestions.filter((question) => answersByQuestionId[question.id] === question.correctIndex).length;
    const accuracy = levelCorrect / levelQuestions.length;

    if (accuracy >= PASS_LEVEL_ACCURACY) {
      cefrLevel = level;
      continue;
    }

    if (level !== "A1") break;
  }

  return {
    cefrLevel,
    startLevel: cefrToStartLevel[cefrLevel],
    score,
    correct,
    total: answeredQuestions.length,
    breakdown,
  };
};

export const getCefrRank = (level: CefrLevel) => CEFR_LEVELS.indexOf(level);

const getNextAvailableLevel = (questions: PlacementQuestion[], currentCeiling: CefrLevel) => {
  const currentRank = getCefrRank(currentCeiling);
  return CEFR_LEVELS.find((level) =>
    getCefrRank(level) > currentRank && questions.some((question) => question.cefrLevel === level)
  ) ?? null;
};

export const shouldAdvanceDifficulty = (
  questions: PlacementQuestion[],
  activeQuestions: PlacementQuestion[],
  answersByQuestionId: Record<string, number | null>,
  currentCeiling: CefrLevel,
) => {
  const nextLevel = getNextAvailableLevel(questions, currentCeiling);
  if (!nextLevel) return null;

  const answeredQuestions = activeQuestions.filter((question) => answersByQuestionId[question.id] !== null && answersByQuestionId[question.id] !== undefined);
  if (answeredQuestions.length !== activeQuestions.length) return null;

  const ceilingQuestions = activeQuestions.filter((question) => question.cefrLevel === currentCeiling);
  if (!ceilingQuestions.length) return null;

  const correctAtCeiling = ceilingQuestions.filter((question) => answersByQuestionId[question.id] === question.correctIndex).length;
  const correctOverall = answeredQuestions.filter((question) => answersByQuestionId[question.id] === question.correctIndex).length;
  const ceilingAccuracy = correctAtCeiling / ceilingQuestions.length;
  const overallAccuracy = correctOverall / answeredQuestions.length;

  return ceilingAccuracy >= ADVANCE_LEVEL_ACCURACY && overallAccuracy >= ADVANCE_LEVEL_ACCURACY ? nextLevel : null;
};
