import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Lock, PartyPopper, RotateCcw, Volume2 } from "lucide-react";
import { useCompleteLessonByIdMutation, useLessonsQuery } from "../../api";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";
import {
  FOUNDATION_STAGES,
  FOUNDATION_TOTAL_MINUTES,
  loadFoundationProgress,
  saveFoundationProgress,
  type FoundationStage,
  type ToneContour,
} from "./foundationCourse";

function ToneContourIcon({ contour }: { contour: ToneContour }) {
  if (contour === "neutral") {
    return (
      <svg aria-hidden="true" viewBox="0 0 72 56" className="size-12 overflow-visible">
        <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="28" r="9" className="fill-primary" />
      </svg>
    );
  }
  const path = {
    level: "M14 18H58",
    rising: "M16 42L58 14",
    dipping: "M14 22C24 45 43 45 58 18",
    falling: "M16 14L58 42",
  }[contour];
  return (
    <svg aria-hidden="true" viewBox="0 0 72 56" className="size-12 overflow-visible">
      <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={path} className="stroke-primary" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ListenButton({ text, className }: { text: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => speakChinese(text)}
      aria-label={`Nghe ${text}`}
      title={`Nghe ${text}`}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground transition hover:border-primary hover:text-primary active:translate-y-px",
        className,
      )}
    >
      <Volume2 size={18} />
    </button>
  );
}

function StageBody({ stage, onDone }: { stage: FoundationStage; onDone: (accuracy: number) => void }) {
  if (stage.kind === "tones" && stage.tones) {
    return (
      <div className="grid gap-2">
        {stage.tones.map((tone) => (
          <article key={tone.name} className="rounded-xl border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <ToneContourIcon contour={tone.contour} />
                </span>
                <div className="min-w-0">
                  <div className="font-extrabold leading-tight">{tone.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-serif text-2xl font-extrabold text-primary">{tone.hanzi}</span>
                    <span className="text-sm font-bold text-muted-foreground">{tone.pinyin}</span>
                  </div>
                </div>
              </div>
              <ListenButton text={tone.hanzi} />
            </div>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">{tone.description}</p>
          </article>
        ))}
      </div>
    );
  }

  if (stage.kind === "sounds" && stage.sounds) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {stage.sounds.map((sound) => (
          <article key={sound.hanzi + sound.pinyin} className="flex items-start justify-between gap-3 rounded-xl border bg-background p-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-extrabold text-primary">{sound.hanzi}</span>
                <span className="text-sm font-bold text-muted-foreground">{sound.pinyin}</span>
              </div>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{sound.hint}</p>
            </div>
            <ListenButton text={sound.hanzi} />
          </article>
        ))}
      </div>
    );
  }

  if (stage.kind === "quiz" && stage.questions) {
    return <StageQuiz stage={stage} onDone={onDone} />;
  }

  return null;
}

function StageQuiz({ stage, onDone }: { stage: FoundationStage; onDone: (accuracy: number) => void }) {
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
        <p className="text-lg font-extrabold">Đúng {correctCount}/{questions.length} câu</p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">Phần này đã hoàn thành. Bấm “Tiếp theo” để đi tiếp.</p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
        >
          <RotateCcw size={16} /> Làm lại
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-3 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
        <span>Câu {index + 1}/{questions.length}</span>
        <span>Đúng {correctCount}</span>
      </div>
      <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-primary/5 py-6">
        <span className="font-serif text-5xl font-extrabold text-primary">{question.hanzi}</span>
        <ListenButton text={question.hanzi} className="size-12" />
        <span className="text-xs font-semibold text-muted-foreground">Bấm loa để nghe rồi chọn pinyin đúng</span>
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
          {index + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}

export default function Foundation() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const completeMutation = useCompleteLessonByIdMutation();

  // Guest progress lives in localStorage; signed-in progress lives in the DB
  // (lessons table, hsk_level 0) so it counts toward XP/streak and syncs per account.
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(() => loadFoundationProgress());
  const [activeIndex, setActiveIndex] = useState(() => {
    const done = loadFoundationProgress();
    const firstUnfinished = FOUNDATION_STAGES.findIndex((stage) => !done.has(stage.id));
    return firstUnfinished === -1 ? 0 : firstUnfinished;
  });

  const dbCompletedLessonIds = useMemo(
    () => new Set((lessonsQuery.data?.lessons ?? []).filter((lesson) => lesson.completedAt).map((lesson) => lesson.id)),
    [lessonsQuery.data?.lessons],
  );

  // A stage counts as done if the DB says so (signed-in) or localStorage says so (guest / offline).
  const completedStageIds = useMemo(() => {
    const ids = new Set<string>();
    for (const stage of FOUNDATION_STAGES) {
      if (localCompleted.has(stage.id) || dbCompletedLessonIds.has(stage.lessonId)) ids.add(stage.id);
    }
    return ids;
  }, [localCompleted, dbCompletedLessonIds]);

  const stage = FOUNDATION_STAGES[activeIndex];
  const totalStages = FOUNDATION_STAGES.length;
  const completedCount = completedStageIds.size;
  const percent = Math.round((completedCount / totalStages) * 100);
  const courseDone = completedCount === totalStages;
  const isStageDone = completedStageIds.has(stage.id);

  const markStageDone = (target: FoundationStage, accuracy = 100) => {
    setLocalCompleted((prev) => {
      if (prev.has(target.id)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(target.id);
      saveFoundationProgress(nextSet);
      return nextSet;
    });

    if (isAuthenticated && !dbCompletedLessonIds.has(target.lessonId)) {
      completeMutation.mutate({ lessonId: target.lessonId, accuracy, minutes: target.minutes });
    }
  };

  const goNext = () => {
    markStageDone(stage);
    if (activeIndex + 1 < totalStages) setActiveIndex(activeIndex + 1);
  };

  return (
    <div className="app-page">
      <div className="grid gap-5">
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                <GraduationCap size={17} />
                {t("foundation.badge")}
              </span>
              <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                {t("foundation.beforeHsk1")}
              </span>
              <span className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-bold text-muted-foreground">
                ~{FOUNDATION_TOTAL_MINUTES} {t("common.minutes")}
              </span>
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">{t("foundation.title")}</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
              {t("foundation.subtitle")}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                <span>{t("foundation.progress")}</span>
                <span>{completedCount}/{totalStages} · {percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
            {courseDone && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-jade bg-jade/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-jade">
                  <CheckCircle2 size={18} />
                  {t("foundation.doneBanner")}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/learn")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.goToHsk1")}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.32fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl border bg-card p-3 shadow-sm">
            <h2 className="px-2 py-1 text-sm font-extrabold text-muted-foreground">{t("foundation.stages")}</h2>
            <ol className="mt-1 grid gap-1">
              {FOUNDATION_STAGES.map((item, itemIndex) => {
                const done = completedStageIds.has(item.id);
                const locked = itemIndex > 0 && !completedStageIds.has(FOUNDATION_STAGES[itemIndex - 1].id) && !done;
                const isActive = itemIndex === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => setActiveIndex(itemIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary",
                        locked && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold",
                          done ? "bg-jade/15 text-jade" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {done ? <CheckCircle2 size={16} /> : locked ? <Lock size={13} /> : itemIndex + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{item.title}</span>
                        <span className="block text-xs font-semibold text-muted-foreground">~{item.minutes} {t("common.minutes")}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          <section className="rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold text-primary">
                  {t("foundation.stepOf", { current: activeIndex + 1, total: totalStages })}
                </div>
                <h2 className="mt-1 text-2xl font-extrabold">{stage.title}</h2>
                <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground">{stage.subtitle}</p>
              </div>
              {isStageDone && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-jade/10 px-2 py-1 text-xs font-extrabold text-jade">
                  <CheckCircle2 size={14} /> {t("foundation.completed")}
                </span>
              )}
            </div>

            <StageBody stage={stage} onDone={(accuracy) => markStageDone(stage, accuracy)} />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} /> {t("common.back")}
              </button>
              {activeIndex + 1 < totalStages ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.markAndNext")}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    markStageDone(stage);
                    navigate("/learn");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
                >
                  {t("foundation.finish")}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
