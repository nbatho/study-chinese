import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDailyContentQuery, useLessonDetailQuery, useLessonsQuery } from "../api";
import { useCompleteLessonMutation } from "../api/lessons/queries";
import type { LessonDetail } from "../api/lessons";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Search, ToggleLeft, ToggleRight, Volume2, XCircle } from "lucide-react";
import { useI18n } from "../i18n";
import { cn } from "../utils/cn";
import LoadingCard from "../components/LoadingCard";
import { speakChinese } from "../utils/tts";

export default function Learn() {
  const { t } = useI18n();
  const { selectedLessonId, setSelectedLessonId } = useOutletContext<{
    selectedLessonId: string | null;
    setSelectedLessonId: (lessonId: string | null) => void;
  }>();
  const lessonsQuery = useLessonsQuery();
  const dailyContentQuery = useDailyContentQuery();
  const [activeTab, setActiveTab] = useState<"curriculum" | "grammar">("curriculum");
  const [selectedHSK, setSelectedHSK] = useState<number>(1);
  const [grammarQuery, setGrammarQuery] = useState("");
  const lessons = lessonsQuery.data?.lessons ?? [];
  const levelLessons = lessons.filter((lesson) => lesson.hskLevel === selectedHSK).sort((a, b) => a.order - b.order);
  const grammarLibrary = dailyContentQuery.data?.grammarLibrary ?? [];
  const filteredGrammar = grammarLibrary.filter((entry) =>
    entry.title.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.summary.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.pattern.toLowerCase().includes(grammarQuery.toLowerCase())
  );

  return (
    <div className="anim-slide">
      {selectedLessonId ? (
        <LessonPlayer lessonId={selectedLessonId} onClose={() => setSelectedLessonId(null)} />
      ) : (
        <>
          <div className="mb-6 flex rounded-xl border bg-secondary p-1">
            {[
              { id: "curriculum", label: t("learn.curriculum") },
              { id: "grammar", label: t("learn.grammar") },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={cn("flex-1 rounded-lg p-2.5 font-bold transition", activeTab === tab.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "curriculum" ? (
            <div>
              <div className="mb-5 flex gap-2.5">
                {[1, 2, 3].map((level) => (
                  <button key={level} onClick={() => setSelectedHSK(level)} className={cn("flex-1 rounded-xl border-2 bg-card p-3 font-extrabold transition", selectedHSK === level ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground")}>
                    HSK {level}
                  </button>
                ))}
              </div>
              <div className="mb-4 text-left text-[0.85rem] font-semibold text-muted-foreground">
                {t("learn.progress", { level: selectedHSK, percent: Math.round(levelLessons.length ? (levelLessons.filter((lesson) => lesson.completedAt).length / levelLessons.length) * 100 : 0) })}
              </div>
              <div className="grid gap-3.5">
                {levelLessons.map((lesson) => {
                  const isCompleted = !!lesson.completedAt;
                  return (
                    <div key={lesson.id} onClick={() => setSelectedLessonId(lesson.id)} className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-lg border bg-card p-[18px] text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", isCompleted ? "border-l-4 border-l-jade" : "border-l-4 border-l-border")}>
                      <div className="min-w-0">
                        <span className={cn("text-xs font-bold", isCompleted ? "text-jade" : "text-primary")}>
                          Lesson {lesson.order} · {lesson.skill.toUpperCase()}
                        </span>
                        <h4 className="mt-0.5 truncate text-[1.1rem] font-extrabold">{lesson.title}</h4>
                        <p className="mt-0.5 line-clamp-2 text-[0.85rem] text-muted-foreground">{lesson.subtitle}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {isCompleted && (
                          <span className="rounded-md bg-jade/10 px-2 py-1 text-xs font-bold text-jade">
                            {Math.round(lesson.bestAccuracy)}% Acc
                          </span>
                        )}
                        <BookOpen size={20} className={isCompleted ? "text-tone-2" : "text-tone-4"} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="anim-slide">
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border bg-card px-4 py-2">
                <Search size={18} className="text-muted-foreground" />
                <input type="text" placeholder={t("learn.searchGrammar")} value={grammarQuery} onChange={(e) => setGrammarQuery(e.target.value)} className="w-full bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
              <div className="grid gap-4">
                {filteredGrammar.map((entry) => (
                  <div key={entry.id} className="rounded-lg border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="text-[1.1rem] font-extrabold text-primary">{entry.title}</h4>
                    <div className="my-2 rounded-lg bg-background px-3 py-2 text-[0.85rem] font-semibold">{t("learn.pattern")} {entry.pattern}</div>
                    <p className="mb-3 text-[0.9rem] text-muted-foreground">{entry.summary}</p>
                    <div className="border-t border-dashed pt-2.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground">{t("learn.example")}</label>
                      {entry.examples.map((ex, i) => (
                        <div key={i} className="mt-1">
                          <span className="font-serif text-xl font-bold">{ex.simplified}</span>
                          <span className="ml-2.5 text-[0.85rem] text-muted-foreground">({ex.pinyin})</span>
                          <p className="mt-0.5 text-[0.9rem]">{ex.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LessonPlayer({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const { t } = useI18n();
  const lessonQuery = useLessonDetailQuery(lessonId);
  const completeLessonMutation = useCompleteLessonMutation(lessonId);
  const lesson = lessonQuery.data?.lesson;
  const [stage, setStage] = useState<"intro" | "dialogue" | "exercises" | "completed">("intro");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);

  const currentExercise = lesson?.exercises[exerciseIdx];
  const exerciseCount = lesson?.exercises.length ?? 0;
  const finalAccuracy = exerciseCount ? Math.round((correctAnswersCount / exerciseCount) * 100) : 0;

  const initExerciseState = () => {
    setSelectedOptionIdx(null);
    setIsAnswerChecked(false);
    setArrangedWords([]);
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
    if (selectedOptionIdx === null && arrangedWords.length === 0 && currentExercise.kind === "arrangeSentence") return;
    const correct = currentExercise.kind === "arrangeSentence"
      ? arrangedWords.join("") === currentExercise.correctText.replace(/\s+/g, "")
      : selectedOptionIdx === currentExercise.correctIndex;
    if (correct) setCorrectAnswersCount((prev) => prev + 1);
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
    await completeLessonMutation.mutateAsync({ accuracy: finalAccuracy, minutes: lesson.estimatedMinutes });
    setStage("completed");
  };

  const handleWordArrangeToggle = (word: string) => {
    if (isAnswerChecked) return;
    setArrangedWords((prev) => prev.includes(word) ? prev.filter((item) => item !== word) : [...prev, word]);
  };

  if (lessonQuery.isLoading || !lesson) {
    return <LoadingCard label={t("learn.loading")} />;
  }

  return (
    <div className="anim-pop mx-auto max-w-[640px] rounded-[20px] border bg-card p-4 shadow-sm sm:p-6">
      {stage === "intro" && (
        <div className="anim-slide">
          <div className="mb-4 flex items-center gap-2.5">
            <button onClick={onClose} className="text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
            <span className="text-[0.8rem] font-bold text-primary">HSK {lesson.hskLevel} · Curriculum Path</span>
          </div>
          <h2 className="text-left text-2xl font-extrabold sm:text-[1.6rem]">{lesson.title}</h2>
          <p className="mb-4 text-left text-[0.9rem] text-muted-foreground">{lesson.subtitle}</p>
          <div className="mb-6 rounded-xl bg-background p-4 text-left text-[0.9rem] leading-relaxed">
            {lesson.intro}
          </div>
          <WordList lesson={lesson} />
          {lesson.grammar.length > 0 && (
            <div className="mb-8 text-left">
              <h4 className="mb-2.5 text-[0.9rem] font-bold uppercase text-muted-foreground">{t("learn.targetGrammar")}</h4>
              {lesson.grammar.map((gp) => (
                <div key={gp.id} className="mb-3">
                  <div className="font-bold text-primary">{gp.pattern}</div>
                  <p className="mt-0.5 text-[0.85rem] text-muted-foreground">{gp.explanation}</p>
                </div>
              ))}
            </div>
          )}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={handleStart}>{t("learn.start")}</button>
        </div>
      )}

      {stage === "dialogue" && lesson.dialogue && (
        <div className="anim-slide">
          <div className="mb-[18px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-left text-[1.2rem] font-extrabold">{t("learn.dialogue")} {lesson.dialogue.title}</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowPinyin(!showPinyin)} className={cn("flex items-center gap-1 text-xs font-semibold", showPinyin ? "text-primary" : "text-muted-foreground")}>
                {t("learn.pinyin")} {showPinyin ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              <button onClick={() => setShowTranslation(!showTranslation)} className={cn("flex items-center gap-1 text-xs font-semibold", showTranslation ? "text-primary" : "text-muted-foreground")}>
                {t("learn.english")} {showTranslation ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
          <p className="mb-5 text-left text-[0.8rem] italic text-muted-foreground">{t("learn.scenario")} {lesson.dialogue.scenario}</p>
          <div className="mb-8 flex max-h-[360px] flex-col gap-4 overflow-y-auto p-2.5">
            {lesson.dialogue.lines.map((line) => (
              <div key={line.id} onClick={() => speakChinese(line.simplified)} className={cn("max-w-[88%] cursor-pointer border p-3 text-left sm:max-w-[80%] sm:px-4", line.isUser ? "self-end rounded-2xl rounded-tr bg-primary/10" : "self-start rounded-2xl rounded-tl bg-secondary")}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[0.7rem] font-extrabold text-muted-foreground">{line.speaker}</span>
                  <Volume2 size={12} className="text-muted-foreground" />
                </div>
                <h3 className="font-serif text-[1.45rem] font-bold">{line.simplified}</h3>
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
          <div className="mb-[18px] flex items-center justify-between gap-3">
            <span className="text-[0.8rem] font-bold text-muted-foreground">{t("learn.question", { current: exerciseIdx + 1, total: lesson.exercises.length })}</span>
            <span className="text-[0.8rem] font-bold text-jade">{t("learn.score", { count: correctAnswersCount })}</span>
          </div>
          <div className="mb-6 rounded-lg border bg-card px-5 py-[30px] text-center shadow-sm">
            <h4 className="mb-3 text-base uppercase text-muted-foreground">{currentExercise.kind}</h4>
            {currentExercise.kind === "listening" && (
              <button className="mb-5 inline-flex size-20 items-center justify-center rounded-full border bg-secondary text-secondary-foreground transition hover:bg-accent" onClick={() => speakChinese(currentExercise.correctText)}>
                <Volume2 size={36} />
              </button>
            )}
            {currentExercise.promptHanzi && <h2 className="mb-2 font-serif text-5xl font-extrabold text-primary">{currentExercise.promptHanzi}</h2>}
            {currentExercise.promptPinyin && <p className="mb-2 text-base font-semibold text-muted-foreground">{currentExercise.promptPinyin}</p>}
            <h3 className="text-[1.2rem] font-bold">{currentExercise.prompt}</h3>
          </div>
          <div className="mb-7 grid gap-2.5">
            {currentExercise.kind === "arrangeSentence" ? (
              <ArrangeExercise options={currentExercise.options || []} arrangedWords={arrangedWords} isAnswerChecked={isAnswerChecked} onToggle={handleWordArrangeToggle} />
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
              <p className="text-[0.85rem] text-muted-foreground"><strong>{currentExercise.correctText}</strong></p>
            </div>
          )}
          {!isAnswerChecked ? (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" disabled={selectedOptionIdx === null && arrangedWords.length === 0 && currentExercise.kind === "arrangeSentence"} onClick={handleCheckAnswer}>{t("learn.check")}</button>
          ) : (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90 disabled:opacity-60" onClick={handleNextExercise} disabled={completeLessonMutation.isPending}>
              {exerciseIdx + 1 === lesson.exercises.length ? t("learn.finish") : t("learn.nextQuestion")}
            </button>
          )}
        </div>
      )}

      {stage === "completed" && (
        <div className="anim-slide py-5 text-center">
          <Award size={72} className="mx-auto mb-4 text-gold" />
          <h2 className="text-3xl font-extrabold">{t("learn.completed")}</h2>
          <p className="mb-6 mt-2 text-muted-foreground">{t("learn.completedBody")} <strong>{lesson.title}</strong></p>
          <div className="mx-auto mb-9 grid max-w-80 grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card px-2 py-4 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground">{t("learn.xpReward")}</span>
              <h3 className="mt-1 text-2xl font-extrabold text-gold">+{lesson.xpReward}</h3>
            </div>
            <div className="rounded-lg border bg-card px-2 py-4 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground">{t("learn.accuracy")}</span>
              <h3 className="mt-1 text-2xl font-extrabold text-jade">{finalAccuracy}%</h3>
            </div>
          </div>
          <WordList lesson={lesson} compact />
          <button className="mt-6 inline-flex w-full max-w-60 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90" onClick={onClose}>{t("learn.backPath")}</button>
        </div>
      )}
    </div>
  );
}

function WordList({ lesson, compact = false }: { lesson: LessonDetail; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={cn("text-left", !compact && "mb-6")}>
      <h4 className="mb-2.5 text-[0.9rem] font-bold uppercase text-muted-foreground">
        {compact ? t("learn.srsWords") : t("learn.newWords")}
      </h4>
      <div className={cn("flex flex-wrap gap-2.5", compact ? "justify-center" : "justify-start")}>
        {lesson.newWords.map((word) => (
          <button key={word.id} onClick={() => speakChinese(word.simplified)} className="flex items-center gap-1.5 rounded-[10px] border bg-secondary px-3 py-2">
            <span className="font-serif text-[1.1rem] font-bold">{word.simplified}</span>
            <span className="text-xs text-muted-foreground">({word.pinyin})</span>
            <Volume2 size={12} className="text-tone-1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ArrangeExercise({ options, arrangedWords, isAnswerChecked, onToggle }: { options: string[]; arrangedWords: string[]; isAnswerChecked: boolean; onToggle: (word: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-14 flex-wrap justify-center gap-2 rounded-xl border-2 border-dashed bg-background p-4">
        {arrangedWords.map((word, i) => (
          <button key={`${word}-${i}`} onClick={() => onToggle(word)} className="anim-pop rounded-lg border bg-card px-3 py-1.5 font-serif text-xl font-bold">
            {word}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {options.map((word, idx) => {
          const isSelected = arrangedWords.includes(word);
          return (
            <button key={`${word}-${idx}`} disabled={isSelected || isAnswerChecked} onClick={() => onToggle(word)} className={cn("rounded-[10px] border px-4 py-2 font-serif text-xl font-bold", isSelected ? "cursor-default bg-transparent text-transparent opacity-25" : "bg-card text-foreground")}>
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
