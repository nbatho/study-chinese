import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { usePlacementQuestionsQuery, useSubmitPlacementMutation } from "../../api/placement/queries";
import { useUserProfileQuery } from "../../api/users/queries";
import type { PlacementResult } from "../../api/placement";
import type { CefrLevel } from "../../api/users";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  EMPTY_PLACEMENT_QUESTIONS,
  INITIAL_CEFR_CEILING,
  calculatePlacementResult,
  getCefrRank,
  shouldAdvanceDifficulty,
} from "./components/placementScoring";
import PlacementResultView from "./components/PlacementResultView";
import PlacementQuizView from "./components/PlacementQuizView";

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
          <PlacementResultView
            result={result}
            onRetake={restart}
            onContinue={() => (onComplete ? onComplete(result) : navigate("/learn"))}
            continueLabel={onComplete ? t("common.continue") : t("placement.startLearning")}
          />
        ) : (
          <PlacementQuizView
            embedded={embedded}
            isLoading={questionsQuery.isLoading}
            currentQuestion={currentQuestion}
            activeQuestionsCount={activeQuestions.length}
            currentIndex={currentIndex}
            answeredCount={answeredCount}
            progress={progress}
            currentAnswer={currentAnswer}
            currentCeiling={currentCeiling}
            isSubmitting={submitMutation.isPending}
            onSkip={onSkip}
            onChoose={chooseAnswer}
            onBack={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            onNext={goNext}
          />
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
