import { useState } from "react";
import { ArrowLeft, Award, CheckCircle2, Flag, Gem, ToggleLeft, ToggleRight, Volume2, XCircle } from "lucide-react";
import { useLessonDetailQuery, useRecordMistakeMutation } from "../../../api";
import { useCompleteLessonMutation, usePublicLessonDetailQuery, useReportLessonIssueMutation } from "../../../api/lessons/queries";
import type { LessonDetail } from "../../../api/lessons";
import type { MistakePayload } from "../../../api/users";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import LoadingCard from "../../../components/LoadingCard";
import Confetti from "../../../components/Confetti";
import { cn } from "../../../utils/cn";
import { speakChinese } from "../../../utils/tts";
import TtsSpeedControl from "../../../components/TtsSpeedControl";
import { HanziText } from "../../../components/HanziLookup";
import ArrangeExercise from "./ArrangeExercise";
import WordList from "./WordList";

const exerciseKindTranslationKeys: Record<string, TranslationKey> = {
  arrangeSentence: "learn.exerciseKind.arrangeSentence",
  fillBlank: "learn.exerciseKind.fillBlank",
  listening: "learn.exerciseKind.listening",
  listeningComprehension: "learn.exerciseKind.listeningComprehension",
  matchPinyin: "learn.exerciseKind.matchPinyin",
  multipleChoice: "learn.exerciseKind.multipleChoice",
  readingComprehension: "learn.exerciseKind.readingComprehension",
  tonePicker: "learn.exerciseKind.tonePicker",
  trueFalse: "learn.exerciseKind.trueFalse",
};

export default function LessonPlayer({ lessonId, onClose, demo = false }: { lessonId: string; onClose: () => void; demo?: boolean }) {
  const { t } = useI18n();
  const detailQuery = useLessonDetailQuery(lessonId, !demo);
  const publicDetailQuery = usePublicLessonDetailQuery(lessonId, demo);
  const lessonQuery = demo ? publicDetailQuery : detailQuery;
  const completeLessonMutation = useCompleteLessonMutation(lessonId);
  const reportIssueMutation = useReportLessonIssueMutation(lessonId);
  const recordMistakeMutation = useRecordMistakeMutation();
  const lesson = lessonQuery.data?.lesson;
  const [stage, setStage] = useState<"intro" | "dialogue" | "exercises" | "completed">("intro");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [shortAnswer, setShortAnswer] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<"content" | "translation" | "audio" | "exercise" | "technical" | "other">("content");
  const [reportMessage, setReportMessage] = useState("");
  const [gemsEarned, setGemsEarned] = useState(0);

  const currentExercise = lesson?.exercises[exerciseIdx];
  const exerciseCount = lesson?.exercises.length ?? 0;
  const finalAccuracy = exerciseCount ? Math.round((correctAnswersCount / exerciseCount) * 100) : 0;
  const lessonSteps = [
    { id: "intro", label: t("learn.player.stepIntro") },
    ...(lesson?.dialogue ? [{ id: "dialogue", label: t("learn.player.stepDialogue") }] : []),
    { id: "exercises", label: t("learn.player.stepExercises") },
    { id: "completed", label: t("learn.player.stepCompleted") },
  ] as const;
  const activeStepIndex = Math.max(0, lessonSteps.findIndex((step) => step.id === stage));
  // The "Kết quả" (completed) step is only shown once the exercises are done.
  // The other steps (intro / dialogue / exercises) are freely navigable tabs.
  const visibleSteps = lessonSteps.filter((step) => step.id !== "completed" || stage === "completed");

  const canNavigateToStep = (index: number) => {
    const target = lessonSteps[index];
    return (
      stage !== "completed" &&
      Boolean(target) &&
      target.id !== "completed" &&
      index !== activeStepIndex
    );
  };

  const goToStep = (index: number) => {
    if (!canNavigateToStep(index)) return;
    setStage(lessonSteps[index].id as typeof stage);
  };

  const initExerciseState = () => {
    setSelectedOptionIdx(null);
    setIsAnswerChecked(false);
    setArrangedWords([]);
    setShortAnswer("");
  };

  const handleStart = () => {
    if (!lesson) return;
    if (lesson.dialogue) {
      setStage("dialogue");
    } else {
      setStage("exercises");
      initExerciseState();
    }
  };

  const handleCheckAnswer = () => {
    if (!currentExercise) return;
    if (isAnswerChecked) return;
    const isArrangeExercise = currentExercise.kind === "arrangeSentence";
    const isShortAnswerExercise = currentExercise.kind === "short_answer" || currentExercise.kind === "shortAnswer";
    if (isArrangeExercise ? arrangedWords.length === 0 : isShortAnswerExercise ? !shortAnswer.trim() : selectedOptionIdx === null) return;
    const correct = isShortAnswerExercise
      ? getAcceptedAnswers(currentExercise).includes(normalizeAnswer(shortAnswer))
      : currentExercise.kind === "arrangeSentence"
      ? arrangedWords.join("") === currentExercise.correctText.replace(/\s+/g, "")
      : selectedOptionIdx === currentExercise.correctIndex;
    if (correct) setCorrectAnswersCount((prev) => prev + 1);
    if (!correct && !demo) {
      void recordMistakeMutation
        .mutateAsync(buildLessonMistakePayload(lesson, currentExercise, selectedOptionIdx, arrangedWords, shortAnswer))
        .catch(() => undefined);
    }
    setIsAnswerChecked(true);
    if (currentExercise.audioWordId || currentExercise.kind === "listening") {
      speakChinese(currentExercise.correctText);
    }
  };

  const handleNextExercise = async () => {
    if (!lesson) return;
    if (exerciseIdx + 1 < lesson.exercises.length) {
      setExerciseIdx((prev) => prev + 1);
      initExerciseState();
      return;
    }
    if (demo) {
      // Trial lessons don't persist progress or award rewards.
      setGemsEarned(0);
      setStage("completed");
      return;
    }
    const result = await completeLessonMutation.mutateAsync({ accuracy: finalAccuracy, minutes: lesson.estimatedMinutes });
    setGemsEarned(result.gemsEarned ?? 0);
    setStage("completed");
  };

  const handleWordArrangeToggle = (word: string) => {
    if (isAnswerChecked) return;
    setArrangedWords((prev) => prev.includes(word) ? prev.filter((item) => item !== word) : [...prev, word]);
  };

  const submitReport = async () => {
    if (!reportMessage.trim()) return;
    await reportIssueMutation.mutateAsync({
      category: reportCategory,
      message: reportMessage.trim(),
      exerciseId: currentExercise?.id ?? null,
      wordId: currentExercise?.audioWordId ?? null,
    });
    setReportMessage("");
    setIsReportOpen(false);
  };

  const handleBack = () => {
    if (!lesson) {
      onClose();
      return;
    }
    if (stage === "exercises") {
      if (lesson.dialogue) {
        setStage("dialogue");
      } else {
        setStage("intro");
      }
    } else if (stage === "dialogue") {
      setStage("intro");
    } else {
      if (stage !== "completed" && (exerciseIdx > 0 || isAnswerChecked || correctAnswersCount > 0)) {
        const confirmExit = window.confirm(t("learn.player.confirmExit"));
        if (!confirmExit) return;
      }
      onClose();
    }
  };

  if (lessonQuery.isLoading || !lesson) {
    return <LoadingCard label={t("learn.loading")} />;
  }

  return (
    <div className="anim-pop mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="sticky top-0 z-20 border-b bg-card/95 p-4 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground transition hover:border-primary hover:text-primary active:translate-y-px"
              aria-label={t("learn.player.backToPath")}
              title={t("learn.player.backToPath")}
            >
              <ArrowLeft size={19} />
            </button>
            <div className="min-w-0 text-left">
              <div className="text-xs font-extrabold text-primary">HSK {lesson.hskLevel} - {lesson.estimatedMinutes} {t("learn.player.minutes")}</div>
              <h2 className="truncate text-lg font-extrabold sm:text-xl">{lesson.title}</h2>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              {visibleSteps.map((step, visibleIndex) => {
                const index = lessonSteps.findIndex((item) => item.id === step.id);
                const isActive = index === activeStepIndex;
                const isDone = index < activeStepIndex;
                const isNavigable = canNavigateToStep(index);
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      disabled={!isNavigable}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "inline-flex min-h-8 items-center justify-center rounded-xl px-3 text-xs font-extrabold transition",
                        isActive && "bg-primary text-primary-foreground",
                        isDone && "bg-jade/10 text-jade",
                        !isActive && !isDone && "bg-secondary text-muted-foreground",
                        isNavigable ? "cursor-pointer hover:opacity-80 active:translate-y-px" : "cursor-default",
                      )}
                    >
                      {step.label}
                    </button>
                    {visibleIndex < visibleSteps.length - 1 && <span className="hidden h-px w-5 bg-border sm:block" />}
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${lessonSteps.length > 1 ? (activeStepIndex / (lessonSteps.length - 1)) * 100 : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
      {demo && (
        <div className="mb-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-center text-xs font-bold text-primary">
          {t("learn.demoBanner")}
        </div>
      )}
      {stage === "intro" && (
        <div className="anim-slide">
          {!demo && (
            <button type="button" onClick={() => setIsReportOpen(true)} className="mb-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-muted-foreground transition hover:bg-secondary hover:text-primary">
              <Flag size={14} />
              {t("learn.player.reportIssue")}
            </button>
          )}
          <h2 className="text-left text-2xl font-extrabold sm:text-[1.6rem]">{lesson.title}</h2>
          <p className="mb-4 text-left text-[0.9rem] text-muted-foreground">{lesson.subtitle}</p>
          <div className="mb-6 rounded-xl bg-background p-4 text-left text-[0.9rem] leading-relaxed">
            {lesson.intro}
          </div>
          <WordList lesson={lesson} />
          {lesson.grammar.length > 0 && (
            <div className="mb-8 text-left">
              <h4 className="mb-2.5 text-[0.9rem] font-bold uppercase text-muted-foreground">{t("learn.targetGrammar")}</h4>
              <div className="grid gap-3">
                {lesson.grammar.map((gp) => (
                  <section key={gp.id} className="rounded-lg border bg-background p-4">
                    <div className="rounded-md bg-card px-3 py-2 font-serif text-xl font-extrabold text-primary">{gp.pattern}</div>
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{gp.explanation}</p>
                    {gp.tips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {gp.tips.map((tip) => (
                          <span key={tip} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground">
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                    {gp.examples.length > 0 && (
                      <div className="mt-3 grid gap-2 border-t border-dashed pt-3">
                        {gp.examples.map((example, index) => (
                          <div key={`${gp.id}-${index}`} className="rounded-md bg-card p-3">
                            <div className="font-serif text-xl font-bold">{example.simplified}</div>
                            <div className="text-xs font-semibold text-muted-foreground">{example.pinyin}</div>
                            <div className="mt-1 text-sm">{example.english}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          )}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={handleStart}>{t("learn.start")}</button>
        </div>
      )}

      {stage === "dialogue" && lesson.dialogue && (
        <div className="anim-slide">
          <div className="mb-4.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-left text-[1.2rem] font-extrabold">{t("learn.dialogue")} {lesson.dialogue.title}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <TtsSpeedControl label={t("tts.speed")} />
              <button onClick={() => setShowPinyin(!showPinyin)} className={cn("flex items-center gap-1 text-xs font-semibold", showPinyin ? "text-primary" : "text-muted-foreground")}>
                {t("learn.pinyin")} {showPinyin ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              <button onClick={() => setShowTranslation(!showTranslation)} className={cn("flex items-center gap-1 text-xs font-semibold", showTranslation ? "text-primary" : "text-muted-foreground")}>
                {t("learn.english")} {showTranslation ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
          <p className="mb-5 text-left text-[0.8rem] italic text-muted-foreground">{t("learn.scenario")} {lesson.dialogue.scenario}</p>
          <div className="mb-8 flex max-h-90 flex-col gap-4 overflow-y-auto p-2.5">
            {lesson.dialogue.lines.map((line) => (
              <div key={line.id} onClick={() => speakChinese(line.simplified)} className={cn("max-w-[88%] cursor-pointer border p-3 text-left sm:max-w-[80%] sm:px-4", line.isUser ? "self-end rounded-2xl rounded-tr bg-primary/10" : "self-start rounded-2xl rounded-tl bg-secondary")}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[0.7rem] font-extrabold text-muted-foreground">{line.speaker}</span>
                  <Volume2 size={12} className="text-muted-foreground" />
                </div>
                <HanziText as="h3" className="font-serif text-[1.45rem] font-bold">{line.simplified}</HanziText>
                {showPinyin && <div className="mt-0.5 text-[0.85rem] text-muted-foreground">{line.pinyin}</div>}
                {showTranslation && <p className="mt-1.5 border-t border-black/5 pt-1 text-[0.85rem]">{line.english}</p>}
              </div>
            ))}
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={() => { setStage("exercises"); initExerciseState(); }}>{t("learn.exercises")}</button>
        </div>
      )}

      {stage === "exercises" && currentExercise && (
        <div className="anim-slide">
          {(() => {
            const kindLabelKey = exerciseKindTranslationKeys[currentExercise.kind];
            const isArrangeExercise = currentExercise.kind === "arrangeSentence";
            const isShortAnswerExercise = currentExercise.kind === "short_answer" || currentExercise.kind === "shortAnswer";
            const isCheckDisabled = isArrangeExercise ? arrangedWords.length === 0 : isShortAnswerExercise ? !shortAnswer.trim() : selectedOptionIdx === null;
            const isReadingComprehension = currentExercise.kind === "readingComprehension";
            const isListeningComprehension = currentExercise.kind === "listeningComprehension";
            const listeningAudioText = currentExercise.stimulus?.audioText ||
              currentExercise.stimulus?.lines?.map((line) => line.simplified).join("");
            const promptZh = currentExercise.promptZh || currentExercise.prompt;
            const promptEn = currentExercise.promptEn || currentExercise.promptEnglish;
            const promptVi = currentExercise.promptVi;
            const isPinyinTested = currentExercise.kind === "matchPinyin" || currentExercise.kind === "tonePicker";
            const usePinyinPrompt = lesson.hskLevel <= 3 && Boolean(currentExercise.promptPinyin) && !isPinyinTested;
            const primaryPrompt = usePinyinPrompt ? currentExercise.promptPinyin : promptZh;

            return (
              <>
          <div className="mb-4.5 flex items-center justify-between gap-3">
            <span className="text-[0.8rem] font-bold text-muted-foreground">{t("learn.question", { current: exerciseIdx + 1, total: lesson.exercises.length })}</span>
            <div className="flex items-center gap-3">
              {!demo && (
                <button type="button" onClick={() => setIsReportOpen(true)} className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground transition hover:text-primary">
                  <Flag size={14} />
                  {t("learn.player.reportIssue")}
                </button>
              )}
              <span className="text-[0.8rem] font-bold text-jade">{t("learn.score", { count: correctAnswersCount })}</span>
            </div>
          </div>
          <div className="mb-6 rounded-lg border bg-card px-5 py-7.5 text-center shadow-sm">
            <h4 className="mb-3 text-base uppercase text-muted-foreground">{isShortAnswerExercise ? t("learn.player.shortAnswer") : kindLabelKey ? t(kindLabelKey) : currentExercise.kind}</h4>
            {currentExercise.kind === "listening" && (
              <button className="mb-5 inline-flex size-20 items-center justify-center rounded-full border bg-secondary text-secondary-foreground transition hover:bg-accent" onClick={() => speakChinese(currentExercise.correctText)}>
                <Volume2 size={36} />
              </button>
            )}
            {isListeningComprehension && (
              <button
                className="mb-5 inline-flex size-20 items-center justify-center rounded-full border bg-secondary text-secondary-foreground transition hover:bg-accent"
                onClick={() => speakChinese(listeningAudioText || currentExercise.correctText)}
                aria-label={t("learn.playDialogue")}
              >
                <Volume2 size={36} />
              </button>
            )}
            {currentExercise.promptHanzi && <h2 className="mb-2 font-serif text-5xl font-extrabold text-primary">{currentExercise.promptHanzi}</h2>}
            {!usePinyinPrompt && currentExercise.promptPinyin && !isPinyinTested && (
              <p className="mb-2 text-base font-semibold text-muted-foreground">{currentExercise.promptPinyin}</p>
            )}
            <h3 className={cn(usePinyinPrompt ? "text-[1.45rem]" : "font-serif text-[1.35rem]", "font-bold leading-relaxed")}>{primaryPrompt}</h3>
            {(promptEn || promptVi) && (
              <div className="mx-auto mt-4 grid max-w-2xl gap-2 text-left">
                {usePinyinPrompt && promptZh && promptZh !== primaryPrompt && (
                  <p className="rounded-md bg-background px-3 py-2 text-sm font-semibold text-muted-foreground">
                    <span className="mr-2 text-xs font-extrabold uppercase text-primary">ZH</span>
                    {promptZh}
                  </p>
                )}
                {promptEn && promptEn !== promptZh && (
                  <p className="rounded-md bg-background px-3 py-2 text-sm font-semibold text-muted-foreground">
                    <span className="mr-2 text-xs font-extrabold uppercase text-primary">EN</span>
                    {promptEn}
                  </p>
                )}
                {promptVi && promptVi !== promptZh && promptVi !== promptEn && (
                  <p className="rounded-md bg-background px-3 py-2 text-sm font-semibold text-muted-foreground">
                    <span className="mr-2 text-xs font-extrabold uppercase text-primary">VI</span>
                    {promptVi}
                  </p>
                )}
              </div>
            )}
          </div>
          {isReadingComprehension && currentExercise.stimulus?.text && (
            <div className="mb-5 rounded-lg border bg-background p-4 text-left">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase text-muted-foreground">{t("learn.readingPassage")}</span>
                {currentExercise.stimulus.title && <span className="text-xs font-bold text-primary">{currentExercise.stimulus.title}</span>}
              </div>
              <HanziText as="p" className="font-serif text-2xl font-bold leading-relaxed">{currentExercise.stimulus.text}</HanziText>
              {currentExercise.stimulus.pinyin && <p className="mt-2 text-sm font-semibold text-muted-foreground">{currentExercise.stimulus.pinyin}</p>}
              {currentExercise.stimulus.english && <p className="mt-2 border-t border-border pt-2 text-sm text-muted-foreground">{currentExercise.stimulus.english}</p>}
              {!!currentExercise.stimulus.vocabulary?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground">{t("learn.keyWords")}</span>
                  {currentExercise.stimulus.vocabulary.map((word) => (
                    <span key={word} className="rounded-md bg-card px-2 py-1 font-serif text-sm font-bold">{word}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {isListeningComprehension && currentExercise.stimulus?.title && (
            <div className="mb-5 rounded-lg border bg-background p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase text-muted-foreground">{t("learn.listeningDialogue")}</span>
                <span className="text-xs font-bold text-primary">{currentExercise.stimulus.title}</span>
              </div>
              {isAnswerChecked && !!currentExercise.stimulus.lines?.length && (
                <div className="mt-3 space-y-3 border-t border-border pt-3">
                  <span className="text-xs font-bold uppercase text-muted-foreground">{t("learn.transcript")}</span>
                  {currentExercise.stimulus.lines.map((line, idx) => (
                    <div key={`${line.speaker}-${idx}`} className="rounded-md bg-card p-3">
                      <div className="mb-1 text-xs font-extrabold text-muted-foreground">{line.speaker}</div>
                      <div className="font-serif text-xl font-bold">{line.simplified}</div>
                      {line.pinyin && <div className="text-sm font-semibold text-muted-foreground">{line.pinyin}</div>}
                      {line.english && <div className="mt-1 text-sm text-muted-foreground">{line.english}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mb-7 grid gap-2.5">
            {currentExercise.kind === "arrangeSentence" ? (
              <ArrangeExercise options={currentExercise.options || []} arrangedWords={arrangedWords} isAnswerChecked={isAnswerChecked} onToggle={handleWordArrangeToggle} />
            ) : isShortAnswerExercise ? (
              <textarea
                value={shortAnswer}
                disabled={isAnswerChecked}
                onChange={(event) => setShortAnswer(event.target.value)}
                className="min-h-28 rounded-xl border bg-card px-4 py-3 text-base font-semibold outline-none transition focus:border-primary disabled:cursor-default disabled:opacity-80"
                placeholder={t("learn.player.answerPlaceholder")}
              />
            ) : (
              (currentExercise.options || []).map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                let stateClass = isSelected ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground";
                if (isAnswerChecked) {
                  if (idx === currentExercise.correctIndex) {
                    stateClass = "border-jade bg-jade/10 text-jade";
                  } else if (isSelected) {
                    stateClass = "border-primary bg-tone-4/10 text-primary";
                  }
                }
                return (
                  <button key={idx} disabled={isAnswerChecked} onClick={() => setSelectedOptionIdx(idx)} className={cn("flex items-center justify-between rounded-[14px] border-2 px-5 py-4 text-left text-base font-semibold", isAnswerChecked ? "cursor-default" : "cursor-pointer", stateClass)}>
                    <span>{option}</span>
                    {isAnswerChecked && idx === currentExercise.correctIndex && <CheckCircle2 size={18} />}
                    {isAnswerChecked && isSelected && idx !== currentExercise.correctIndex && <XCircle size={18} />}
                  </button>
                );
              })
            )}
          </div>
          {isAnswerChecked && (
            <div className="anim-pop mb-6 rounded-xl border bg-secondary p-4 text-left">
              <h5 className="mb-1 font-bold">{t("learn.correctMatch")}</h5>
              <div className="space-y-1.5 text-[0.9rem] text-muted-foreground">
                <p><strong className="text-foreground">{currentExercise.correctText}</strong></p>
                {currentExercise.promptPinyin && (
                  <p><span className="font-semibold text-foreground">{t("learn.answerPinyin")}</span> {currentExercise.promptPinyin}</p>
                )}
                {currentExercise.promptEnglish && (
                  <p><span className="font-semibold text-foreground">{t("learn.answerMeaning")}</span> {currentExercise.promptEnglish}</p>
                )}
                {currentExercise.answerExplanation && <p>{currentExercise.answerExplanation}</p>}
              </div>
            </div>
          )}
          {!isAnswerChecked ? (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" disabled={isCheckDisabled} onClick={handleCheckAnswer}>{t("learn.check")}</button>
          ) : (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90 disabled:opacity-60" onClick={handleNextExercise} disabled={completeLessonMutation.isPending}>
              {exerciseIdx + 1 === lesson.exercises.length ? t("learn.finish") : t("learn.nextQuestion")}
            </button>
          )}
              </>
            );
          })()}
        </div>
      )}

      {stage === "completed" && (
        <div className="anim-slide py-5 text-center">
          <Confetti />
          <Award size={72} className="mx-auto mb-4 text-gold" />
          <h2 className="text-3xl font-extrabold">{t("learn.completed")}</h2>
          <p className="mb-6 mt-2 text-muted-foreground">{t("learn.completedBody")} <strong>{lesson.title}</strong></p>
          <div className="mx-auto mb-9 grid max-w-105 grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card px-2 py-4 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground">{t("learn.xpReward")}</span>
              <h3 className="anim-xp-rise mt-1 text-2xl font-extrabold text-gold">+{lesson.xpReward}</h3>
            </div>
            <div className="rounded-lg border bg-card px-2 py-4 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground">{t("learn.gemsReward")}</span>
              <h3 className="anim-xp-rise mt-1 flex items-center justify-center gap-1 text-2xl font-extrabold text-tone-1" style={{ animationDelay: "0.12s" }}>
                <Gem size={20} /> +{gemsEarned}
              </h3>
            </div>
            <div className="rounded-lg border bg-card px-2 py-4 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground">{t("learn.accuracy")}</span>
              <h3 className="anim-xp-rise mt-1 text-2xl font-extrabold text-jade" style={{ animationDelay: "0.24s" }}>{finalAccuracy}%</h3>
            </div>
          </div>
          <WordList lesson={lesson} compact />
          <button className="mt-6 inline-flex w-full max-w-60 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={onClose}>{t("learn.backPath")}</button>
        </div>
      )}

      {isReportOpen && (
        <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-4 text-left shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-extrabold">{t("learn.player.reportTitle")}</h3>
              <button type="button" onClick={() => setIsReportOpen(false)} className="text-muted-foreground">
                <XCircle size={20} />
              </button>
            </div>
            <label className="mb-3 block">
              <span className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">{t("learn.player.issueType")}</span>
              <select value={reportCategory} onChange={(event) => setReportCategory(event.target.value as typeof reportCategory)} className="h-10 w-full rounded-lg border bg-background px-3 text-sm font-semibold outline-none">
                <option value="content">{t("learn.player.issueContent")}</option>
                <option value="translation">{t("learn.player.issueTranslation")}</option>
                <option value="audio">{t("learn.player.issueAudio")}</option>
                <option value="exercise">{t("learn.player.issueExercise")}</option>
                <option value="technical">{t("learn.player.issueTechnical")}</option>
                <option value="other">{t("learn.player.issueOther")}</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">{t("learn.player.reportDescription")}</span>
              <textarea
                value={reportMessage}
                onChange={(event) => setReportMessage(event.target.value)}
                className="min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={t("learn.player.reportPlaceholder")}
              />
            </label>
            <button
              type="button"
              onClick={submitReport}
              disabled={reportIssueMutation.isPending || !reportMessage.trim()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {reportIssueMutation.isPending ? t("learn.player.sending") : t("learn.player.sendReport")}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

type LessonExercise = LessonDetail["exercises"][number];

const normalizeAnswer = (value: string) =>
  value
    .trim()
    .replace(/[。！？!?，,\s]+/g, "")
    .toLowerCase();

const getAcceptedAnswers = (exercise: LessonExercise) => {
  const answers = [
    exercise.correctText,
    exercise.correctTextEn,
    exercise.correctTextVi ?? undefined,
    ...(exercise.acceptableVariants ?? []),
  ].filter((answer): answer is string => Boolean(answer));

  return Array.from(new Set(answers.map(normalizeAnswer).filter(Boolean)));
};

function hasChineseText(value?: string | null) {
  return /[\u3400-\u9fff]/.test(value || "");
}

function buildLessonMistakePayload(
  lesson: LessonDetail,
  exercise: LessonExercise,
  selectedOptionIdx: number | null,
  arrangedWords: string[],
  shortAnswer = "",
): MistakePayload {
  const matchedWord =
    lesson.newWords.find((word) => word.id === exercise.audioWordId) ??
    lesson.newWords.find((word) =>
      word.simplified === exercise.promptHanzi ||
      word.simplified === exercise.correctText ||
      exercise.prompt.includes(word.simplified),
    );
  const selectedOption =
    selectedOptionIdx === null ? undefined : exercise.options?.[selectedOptionIdx];
  const correctOption =
    exercise.correctIndex === undefined ? undefined : exercise.options?.[exercise.correctIndex];
  const userAnswer =
    exercise.kind === "arrangeSentence"
      ? arrangedWords.join("")
      : exercise.kind === "short_answer" || exercise.kind === "shortAnswer"
        ? shortAnswer
        : selectedOption;
  const simplified =
    exercise.promptHanzi ||
    matchedWord?.simplified ||
    (hasChineseText(exercise.correctText) ? exercise.correctText : undefined);

  return {
    wordId: matchedWord?.id,
    skill: `lesson-${exercise.kind}`.slice(0, 50),
    prompt: exercise.prompt,
    userAnswer: userAnswer || "(blank)",
    correctAnswer: exercise.correctText || correctOption,
    simplified,
    pinyin: exercise.promptPinyin || matchedWord?.pinyin,
    english: exercise.promptEnglish || matchedWord?.english,
    context: {
      source: "lesson",
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonSkill: lesson.skill,
      exerciseId: exercise.id,
      exerciseKind: exercise.kind,
      selectedOptionIndex: selectedOptionIdx,
      correctOptionIndex: exercise.correctIndex,
      correctOption,
    },
  };
}
