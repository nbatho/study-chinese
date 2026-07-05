import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { usePlacementQuestionsQuery, useSubmitPlacementMutation } from "../../api/placement/queries";
import type { PlacementQuestion, PlacementResult, PlacementSection } from "../../api/placement";
import type { CefrLevel, SkillLevel } from "../../api/users";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
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

const sectionLabels: Record<PlacementSection, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
};

const cefrToStartLevel: Record<CefrLevel, SkillLevel> = {
  A1: "beginner",
  A2: "elementary",
  B1: "intermediate",
  B2: "upper_intermediate",
  C1: "advanced",
  C2: "mastery",
};

const cefrDescriptions: Record<CefrLevel, string> = {
  A1: "Start with HSK 1 foundations: greetings, numbers, simple self-introduction.",
  A2: "HSK 1 stays open for review, and HSK 2 becomes your main path.",
  B1: "You can work through the full current HSK 1-3 curriculum.",
  B2: "Current lessons are open; early HSK lessons are best used as optional review.",
  C1: "Current lessons are open; use the app for review and targeted practice.",
  C2: "Current lessons are open; use the app for precision practice.",
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
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const questionsQuery = usePlacementQuestionsQuery(isAuthenticated);
  const submitMutation = useSubmitPlacementMutation();
  const questions = questionsQuery.data?.questions ?? [];
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
    onComplete?.(placementResult);
  };

  const goNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const nextLevel = shouldAdvanceDifficulty(questions, activeQuestions, answersByQuestionId, currentCeiling);
    if (nextLevel) {
      setCurrentCeiling(nextLevel);
      setCurrentIndex(activeQuestions.length);
      toast.success("Bài kiểm tra đã cập nhật theo trình độ hiện tại của bạn.", {
        description: `Độ khó hiện tại: CEFR ${nextLevel}`,
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
        title="Log in to take the placement test"
        description="Your CEFR result is saved to your profile so lessons can unlock at the right level."
      />
    );
  }

  const body = (
    <div className={cn("anim-slide mx-auto w-full", embedded ? "max-w-120" : "max-w-4xl")}>
      {!embedded && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-lg">
            <ArrowLeft size={18} />
            Back
          </Button>
          <Badge className="rounded-md px-3 py-1">CEFR Placement</Badge>
        </div>
      )}

      <div className="rounded-lg border bg-card p-5 shadow-sm sm:p-6">
        {result ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-jade/10 text-jade">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-xs font-extrabold uppercase text-muted-foreground">Recommended level</p>
            <h1 className="mt-1 text-4xl font-extrabold text-primary">{result.cefrLevel}</h1>
            <p className="mx-auto mt-3 max-w-120 text-sm text-muted-foreground">
              {cefrDescriptions[result.cefrLevel]}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {result.breakdown.map((item) => (
                <div key={item.section} className="rounded-lg border bg-background p-4 text-left">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">{sectionLabels[item.section]}</p>
                  <p className="mt-2 text-2xl font-extrabold">{item.correct}/{item.total}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{item.score} weighted points</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-secondary p-4 text-sm font-semibold text-muted-foreground">
              Total score: <span className="text-foreground">{result.score}</span> · Correct answers:{" "}
              <span className="text-foreground">{result.correct}/{result.total}</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="secondary" onClick={restart} className="rounded-lg">
                <RotateCcw size={18} />
                Retake
              </Button>
              <Button type="button" onClick={() => navigate("/learn")} className="rounded-lg">
                Start learning
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
                  <h1 className={cn("font-extrabold", embedded ? "text-xl" : "text-2xl")}>Quick placement test</h1>
                </div>
                <p className="max-w-150 text-sm text-muted-foreground">
                  Answer short questions across vocabulary, grammar, and reading. The test will raise the CEFR level when your answers show you are ready.
                </p>
              </div>
              {onSkip && (
                <Button type="button" variant="ghost" onClick={onSkip} className="rounded-lg">
                  Skip
                </Button>
              )}
            </div>

            {questionsQuery.isLoading ? (
              <div className="rounded-lg bg-secondary p-6 text-center text-sm font-semibold text-muted-foreground">
                Loading questions...
              </div>
            ) : !currentQuestion ? (
              <div className="rounded-lg bg-secondary p-6 text-center text-sm font-semibold text-muted-foreground">
                No placement questions are available yet.
              </div>
            ) : (
              <>
                <div className="mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>Question {currentIndex + 1} of {activeQuestions.length}</span>
                    <span>{answeredCount}/{activeQuestions.length} answered</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-md">{sectionLabels[currentQuestion.section]}</Badge>
                  <Badge className="rounded-md">{currentQuestion.cefrLevel}</Badge>
                  <Badge variant="secondary" className="rounded-md">Adaptive to {currentCeiling}</Badge>
                </div>

                <div className="rounded-lg border bg-background p-4">
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
                        "min-h-12 rounded-lg border-2 bg-card px-4 py-3 text-left text-sm font-bold transition hover:border-primary/60 hover:bg-primary/5",
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
                    className="rounded-lg"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={currentAnswer === null || currentAnswer === undefined || submitMutation.isPending}
                    className="rounded-lg"
                  >
                    {submitMutation.isPending ? "Saving..." : currentIndex === activeQuestions.length - 1 ? "Continue" : "Next"}
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
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
      {body}
    </div>
  );
}
