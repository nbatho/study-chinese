import { ArrowRight, ClipboardCheck } from "lucide-react";
import type { PlacementQuestion } from "../../../api/placement";
import type { CefrLevel } from "../../../api/users";
import { useI18n } from "../../../i18n";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { cn } from "../../../utils/cn";
import { sectionKeys } from "./placementScoring";

interface PlacementQuizViewProps {
  embedded: boolean;
  isLoading: boolean;
  currentQuestion?: PlacementQuestion;
  activeQuestionsCount: number;
  currentIndex: number;
  answeredCount: number;
  progress: number;
  currentAnswer: number | null | undefined;
  currentCeiling: CefrLevel;
  isSubmitting: boolean;
  onSkip?: () => void;
  onChoose: (optionIndex: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function PlacementQuizView({
  embedded,
  isLoading,
  currentQuestion,
  activeQuestionsCount,
  currentIndex,
  answeredCount,
  progress,
  currentAnswer,
  currentCeiling,
  isSubmitting,
  onSkip,
  onChoose,
  onBack,
  onNext,
}: PlacementQuizViewProps) {
  const { t } = useI18n();

  return (
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

      {isLoading ? (
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
              <span>{t("placement.questionOf", { current: currentIndex + 1, total: activeQuestionsCount })}</span>
              <span>{t("placement.answered", { count: answeredCount, total: activeQuestionsCount })}</span>
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
                onClick={() => onChoose(optionIndex)}
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
              onClick={onBack}
              disabled={currentIndex === 0 || isSubmitting}
              className="rounded-xl"
            >
              {t("common.back")}
            </Button>
            <Button
              type="button"
              onClick={onNext}
              disabled={currentAnswer === null || currentAnswer === undefined || isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? t("placement.saving") : currentIndex === activeQuestionsCount - 1 ? t("common.continue") : t("placement.next")}
              <ArrowRight size={18} />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
