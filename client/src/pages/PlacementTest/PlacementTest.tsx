import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { usePlacementQuestionsQuery, useSubmitPlacementMutation } from "../../api/placement/queries";
import { useUserProfileQuery } from "../../api/users/queries";
import type { PlacementQuestion, PlacementResult, PlacementSection } from "../../api/placement";
import type { CefrLevel, SkillLevel } from "../../api/users";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";

const CEFR_WEIGHTS: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const INITIAL_CEFR_CEILING: CefrLevel = "A2";
const PASS_LEVEL_ACCURACY = 2 / 3;
const ADVANCE_LEVEL_ACCURACY = 2 / 3;
const EMPTY_PLACEMENT_QUESTIONS: PlacementQuestion[] = [];

const sectionKeys: Record<PlacementSection, TranslationKey> = {
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

const startLevelKeys: Record<SkillLevel, TranslationKey> = {
  beginner: "placement.levelBeginner",
  elementary: "placement.levelElementary",
  intermediate: "placement.levelIntermediate",
  upper_intermediate: "placement.levelUpperIntermediate",
  advanced: "placement.levelAdvanced",
  mastery: "placement.levelMastery",
};

const cefrDescKeys: Record<CefrLevel, TranslationKey> = {
  A1: "cefr.descA1",
  A2: "cefr.descA2",
  B1: "cefr.descB1",
  B2: "cefr.descB2",
  C1: "cefr.descC1",
  C2: "cefr.descC2",
};

const calculatePlacementResult = (
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

const getCefrRank = (level: CefrLevel) => CEFR_LEVELS.indexOf(level);

const getNextAvailableLevel = (questions: PlacementQuestion[], currentCeiling: CefrLevel) => {
  const currentRank = getCefrRank(currentCeiling);
  return CEFR_LEVELS.find((level) =>
    getCefrRank(level) > currentRank && questions.some((question) => question.cefrLevel === level)
  ) ?? null;
};

const shouldAdvanceDifficulty = (
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

interface PlacementTestProps {
  embedded?: boolean;
  onComplete?: (result: PlacementResult) => void;
  onSkip?: () => void;
}

export default function PlacementTest({ embedded = false, onComplete, onSkip }: PlacementTestProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated && !embedded);
  const questionsQuery = usePlacementQuestionsQuery(isAuthenticated);
  const submitMutation = useSubmitPlacementMutation();
  const questions = questionsQuery.data?.questions ?? EMPTY_PLACEMENT_QUESTIONS;
  const [currentCeiling, setCurrentCeiling] = useState<CefrLevel>(INITIAL_CEFR_CEILING);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, number | null>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  const activeQuestions = useMemo(
    () => questions.filter((question) => getCefrRank(question.cefrLevel) <= getCefrRank(currentCeiling)),
    [currentCeiling, questions],
  );
  const currentQuestion = activeQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answersByQuestionId[currentQuestion.id] : null;
  const answeredCount = useMemo(
    () => activeQuestions.filter((question) => answersByQuestionId[question.id] !== null && answersByQuestionId[question.id] !== undefined).length,
    [activeQuestions, answersByQuestionId],
  );
  const progress = activeQuestions.length ? (answeredCount / activeQuestions.length) * 100 : 0;
  const hasCompletedPlacement = Boolean(profileQuery.data?.profile.placementTestCompletedAt);

  useEffect(() => {
    if (!embedded && hasCompletedPlacement) {
      navigate("/learn", { replace: true });
    }
  }, [embedded, hasCompletedPlacement, navigate]);

  const chooseAnswer = (optionIndex: number) => {
    if (!currentQuestion) return;

    setAnswersByQuestionId((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const finish = async () => {
    const placementResult = calculatePlacementResult(activeQuestions, answersByQuestionId);
    setResult(placementResult);
    await submitMutation.mutateAsync({
      cefrLevel: placementResult.cefrLevel,
      score: placementResult.score,
      completedAt: new Date().toISOString(),
    });
    // Do not auto-advance: show the result screen so the learner can see their
    // level. onComplete is fired when they press Continue on that screen.
  };

  const goNext = async () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const nextLevel = shouldAdvanceDifficulty(questions, activeQuestions, answersByQuestionId, currentCeiling);
    if (nextLevel) {
      setCurrentCeiling(nextLevel);
      setCurrentIndex(activeQuestions.length);
      toast.success(t("placement.advancedToast"), {
        description: t("placement.advancedDesc", { level: nextLevel }),
        duration: 5000,
      });
      return;
    }

    await finish();
  };

  const restart = () => {
    setAnswersByQuestionId({});
    setCurrentIndex(0);
    setCurrentCeiling(INITIAL_CEFR_CEILING);
    setResult(null);
  };

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={LockKeyhole}
        title={t("placement.loginTitle")}
        description={t("placement.loginBody")}
      />
    );
  }

  if (!embedded && hasCompletedPlacement) {
    return null;
  }

  const body = (
    <div className={cn("anim-slide mx-auto w-full", embedded ? "max-w-120" : "max-w-4xl")}>
      {!embedded && (
        <div className="app-page-header mb-5 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft size={18} />
            {t("common.back")}
          </Button>
          <Badge className="rounded-lg px-3 py-1">{t("placement.badge")}</Badge>
        </div>
      )}

      <div className="app-surface p-5 sm:p-6">
        {result ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-jade/10 text-jade">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-xs font-extrabold text-muted-foreground">{t("placement.recommended")}</p>
            <h1 className="mt-1 text-4xl font-extrabold text-primary">{result.cefrLevel}</h1>
            <p className="mt-2 text-sm font-bold text-foreground">
              {t("placement.resultLevel", { level: result.cefrLevel, label: t(startLevelKeys[result.startLevel]) })}
            </p>
            <p className="mx-auto mt-3 max-w-120 text-sm text-muted-foreground">
              {t(cefrDescKeys[result.cefrLevel])}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {result.breakdown.map((item) => (
                <div key={item.section} className="rounded-xl border bg-background p-4 text-left">
                  <p className="text-xs font-extrabold text-muted-foreground">{t(sectionKeys[item.section])}</p>
                  <p className="mt-2 text-2xl font-extrabold">{item.correct}/{item.total}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{t("placement.weightedPoints", { score: item.score })}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-secondary p-4 text-sm font-semibold text-muted-foreground">
              {t("placement.totalScore")} <span className="text-foreground">{result.score}</span> · {t("placement.correctAnswers")}{" "}
              <span className="text-foreground">{result.correct}/{result.total}</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="secondary" onClick={restart} className="rounded-xl">
                <RotateCcw size={18} />
                {t("placement.retake")}
              </Button>
              <Button
                type="button"
                onClick={() => (onComplete ? onComplete(result) : navigate("/learn"))}
                className="rounded-xl"
              >
                {onComplete ? t("common.continue") : t("placement.startLearning")}
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <ClipboardCheck className="text-primary" size={22} />
                  <h1 className={cn("font-extrabold", embedded ? "text-xl" : "text-2xl")}>{t("placement.title")}</h1>
                </div>
                <p className="max-w-150 text-sm text-muted-foreground">
                  {t("placement.subtitle")}
                </p>
              </div>
              {onSkip && (
                <Button type="button" variant="ghost" onClick={onSkip} className="rounded-xl">
                  {t("placement.skip")}
                </Button>
              )}
            </div>

            {questionsQuery.isLoading ? (
              <div className="rounded-xl bg-secondary p-6 text-center text-sm font-semibold text-muted-foreground">
                {t("placement.loading")}
              </div>
            ) : !currentQuestion ? (
              <div className="rounded-xl bg-secondary p-6 text-center text-sm font-semibold text-muted-foreground">
                {t("placement.noQuestions")}
              </div>
            ) : (
              <>
                <div className="mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>{t("placement.questionOf", { current: currentIndex + 1, total: activeQuestions.length })}</span>
                    <span>{t("placement.answered", { count: answeredCount, total: activeQuestions.length })}</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-lg">{t(sectionKeys[currentQuestion.section])}</Badge>
                  <Badge className="rounded-lg">{currentQuestion.cefrLevel}</Badge>
                  <Badge variant="secondary" className="rounded-lg">{t("placement.testingLevel", { level: currentCeiling })}</Badge>
                </div>

                <div className="rounded-xl border bg-background p-4">
                  <p className="text-lg font-extrabold">{currentQuestion.prompt}</p>
                  {currentQuestion.promptHanzi && (
                    <p className="mt-3 font-serif text-3xl font-bold">{currentQuestion.promptHanzi}</p>
                  )}
                  {currentQuestion.promptPinyin && (
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">{currentQuestion.promptPinyin}</p>
                  )}
                </div>

                <div className="mt-4 grid gap-3">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <button
                      key={`${currentQuestion.id}-${option}`}
                      type="button"
                      onClick={() => chooseAnswer(optionIndex)}
                      className={cn(
                        "min-h-12 rounded-xl border-2 bg-card px-4 py-3 text-left text-sm font-bold transition hover:border-primary/60 hover:bg-primary/5 active:translate-y-px",
                        currentAnswer === optionIndex ? "border-primary bg-primary/10 text-primary" : "border-border",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    disabled={currentIndex === 0 || submitMutation.isPending}
                    className="rounded-xl"
                  >
                    {t("common.back")}
                  </Button>
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={currentAnswer === null || currentAnswer === undefined || submitMutation.isPending}
                    className="rounded-xl"
                  >
                    {submitMutation.isPending ? t("placement.saving") : currentIndex === activeQuestions.length - 1 ? t("common.continue") : t("placement.next")}
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <div className="app-workspace-bg min-h-[100dvh] px-4 py-6 sm:px-6">
      {body}
    </div>
  );
}
