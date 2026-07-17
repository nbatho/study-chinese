import { useRef, useState } from "react";
import { ArrowRight, PartyPopper, RotateCcw } from "lucide-react";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import type { FoundationStage } from "../foundationCourse";
import ListenButton from "./ListenButton";

export default function StageQuiz({ stage, onDone }: { stage: FoundationStage; onDone: (accuracy: number) => void }) {
  const { t } = useI18n();
  const questions = stage.questions ?? [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const correctRef = useRef(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === question.answer) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      onDone(Math.round((correctRef.current / questions.length) * 100));
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  };

  const restart = () => {
    correctRef.current = 0;
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="rounded-xl border bg-background p-6 text-center">
        <PartyPopper className="mx-auto mb-3 text-jade" size={40} />
        <p className="text-lg font-extrabold">
          {t("foundation.quizScore", { correct: correctCount, total: questions.length })}
        </p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">{t("foundation.quizDone")}</p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
        >
          <RotateCcw size={16} /> {t("foundation.quizRestart")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-3 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
        <span>{t("foundation.quizProgress", { index: index + 1, total: questions.length })}</span>
        <span>{t("foundation.quizCorrect", { count: correctCount })}</span>
      </div>
      <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-primary/5 py-6">
        <span className="font-serif text-5xl font-extrabold text-primary">{question.hanzi}</span>
        <ListenButton text={question.hanzi} className="size-12" />
        <span className="text-xs font-semibold text-muted-foreground">{t("foundation.quizHint")}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option) => {
          const isAnswer = option === question.answer;
          const isPicked = option === picked;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              disabled={Boolean(picked)}
              className={cn(
                "rounded-xl border-2 px-3 py-3 text-center text-base font-bold transition active:translate-y-px",
                !picked && "border-border bg-card hover:border-primary hover:text-primary",
                picked && isAnswer && "border-jade bg-jade/10 text-jade",
                picked && isPicked && !isAnswer && "border-destructive bg-destructive/10 text-destructive",
                picked && !isAnswer && !isPicked && "border-border bg-card opacity-60",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {picked && (
        <button
          type="button"
          onClick={next}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
        >
          {index + 1 >= questions.length ? t("foundation.quizResults") : t("foundation.quizNext")}
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}
