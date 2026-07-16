import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useAddActivityMutation,
  useEnrollWordMutation,
  useHanziStrokesQuery,
  useLessonDetailQuery,
  useLessonsQuery,
  useListDetailQuery,
  useListsQuery,
  useMinimalPairsQuery,
  usePracticeMistakeMutation,
  useScoreShadowingMutation,
  useShadowingPromptsQuery,
  useUserMistakesQuery,
  useVocabularyQuery,
} from "../../../api";
import type { MistakeItem } from "../../../api/users";
import type { CharDiffEntry } from "../../../api/practice";
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Target, Volume2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import HanziStrokePractice from "../../../components/HanziStrokePractice";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { playCorrectSound, playIncorrectSound } from "../../../utils/sfx";
import { speakChinese } from "../../../utils/tts";
type ListPracticeMode = "typing" | "listening" | "tone";

/** Audio cue played the moment an answer is checked, in every practice tool. */
const playAnswerSound = (correct: boolean) =>
  void (correct ? playCorrectSound() : playIncorrectSound());

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";
const minVoicedFrames = 8;
const minVoicedFrameRatio = 0.04;
const minVoicePeak = 0.1;
const minVoiceRms = 0.018;

/** The diacritic for each tone. Language-independent, unlike the tone's name. */
const TONE_MARKS: Record<number, string> = { 1: "ˉ", 2: "ˊ", 3: "ˇ", 4: "ˋ" };

type Translate = ReturnType<typeof useI18n>["t"];

const toneName = (t: Translate, tone: number) =>
  tone >= 1 && tone <= 4 ? t(`tone.${tone}.name` as TranslationKey) : t("tone.numbered", { tone });

const containsChinese = (value: string) => /[\u4e00-\u9fff]/.test(value);
const containsPinyinTone = (value: string) =>
  /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(value);

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read recorded audio."));
    reader.readAsDataURL(blob);
  });

const normalizeAnswer = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const shortenEnglish = (text: string, maxLen = 60): string => {
  if (!text) return "";
  const first = text.split(";")[0].trim();
  if (first.length <= maxLen) return first;
  return `${first.slice(0, maxLen)}...`;
};

const readHanziTotalMistakes = (summary: unknown, fallback: number) => {
  const totalMistakes =
    typeof summary === "object" && summary !== null && "totalMistakes" in summary
      ? Number((summary as { totalMistakes?: unknown }).totalMistakes)
      : fallback;
  return Number.isFinite(totalMistakes) ? totalMistakes : fallback;
};

// Practice words follow the lesson the user is currently on: the first
// uncompleted course lesson (foundation stages, hsk_level 0, carry no vocab and
// are skipped). Falls back to the HSK1 vocab list when no lesson words exist.
function usePracticeWords() {
  const lessonsQuery = useLessonsQuery();
  const courseLessons = useMemo(
    () => (lessonsQuery.data?.lessons ?? []).filter((lesson) => lesson.hskLevel >= 1),
    [lessonsQuery.data?.lessons],
  );
  const currentLesson =
    courseLessons.find((lesson) => !lesson.completedAt) ?? courseLessons[courseLessons.length - 1];
  const lessonDetailQuery = useLessonDetailQuery(currentLesson?.id ?? "", Boolean(currentLesson));
  const lessonWords = lessonDetailQuery.data?.lesson.newWords ?? [];

  const lessonResolved =
    lessonsQuery.isError ||
    lessonDetailQuery.isError ||
    (lessonsQuery.isSuccess && !currentLesson) ||
    lessonDetailQuery.isSuccess;
  const useFallback = lessonResolved && lessonWords.length === 0;
  const vocabQuery = useVocabularyQuery({ hsk: 1 }, useFallback);

  return {
    isLoading:
      lessonsQuery.isLoading || lessonDetailQuery.isLoading || (useFallback && vocabQuery.isLoading),
    words: lessonWords.length > 0 ? lessonWords : vocabQuery.data?.vocab ?? [],
    lessonTitle: lessonWords.length > 0 ? currentLesson?.title : undefined,
  };
}

export function WeakPracticeTool() {
  const { t } = useI18n();
  const mistakesQuery = useUserMistakesQuery(50);
  const practiceMistake = usePracticeMistakeMutation();
  const addActivity = useAddActivityMutation();
  const mistakes = (mistakesQuery.data?.mistakes ?? []).filter((item) => item.needsPracticeCount > 0);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [lockedMistake, setLockedMistake] = useState<MistakeItem | null>(null);
  const activeMistake = mistakes[idx % Math.max(mistakes.length, 1)];
  const displayedMistake = lockedMistake ?? activeMistake;

  if (mistakesQuery.isLoading) return <LoadingCard label={t("practice.weak.loading")} />;

  if (!displayedMistake) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-jade" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak.emptyTitle")}</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">{t("practice.weak.emptyBody")}</p>
      </div>
    );
  }

  const acceptedAnswers = [
    displayedMistake.correctAnswer,
    displayedMistake.pinyin,
    displayedMistake.english,
  ]
    .filter(Boolean)
    .map((value) => normalizeAnswer(String(value)));
  const normalizedInput = normalizeAnswer(answer);
  const trimmedInput = answer.trim();
  const requiresChinese = ["list-typing", "typing", "hanzi"].includes(displayedMistake.skill);
  const isValidLanguage =
    !requiresChinese || containsChinese(trimmedInput) || containsPinyinTone(trimmedInput);
  const isCorrect =
    normalizedInput.length > 0 &&
    isValidLanguage &&
    acceptedAnswers.some((candidate) => candidate === normalizedInput);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || checked !== null) return;
    setLockedMistake(displayedMistake);
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await practiceMistake.mutateAsync({ mistakeId: displayedMistake.id, correct: isCorrect });
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: `weak-${displayedMistake.skill}`,
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect
        ? {
            wordId: displayedMistake.wordId || undefined,
            skill: displayedMistake.skill,
            prompt: displayedMistake.prompt || displayedMistake.simplified || undefined,
            userAnswer: answer,
            correctAnswer: displayedMistake.correctAnswer || displayedMistake.pinyin || displayedMistake.english || undefined,
            simplified: displayedMistake.simplified || undefined,
            pinyin: displayedMistake.pinyin || undefined,
            english: displayedMistake.english || undefined,
            context: { source: "weak-practice" },
          }
        : undefined,
    });
  };

  const next = () => {
    setIdx((value) => value + 1);
    setAnswer("");
    setChecked(null);
    setLockedMistake(null);
  };

  return (
    <div className={panelClass}>
      <div className="mb-5 flex items-center justify-between gap-3 text-left">
        <div>
          <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak")}</h3>
          <p className="text-[0.85rem] text-muted-foreground">
            {t("practice.weak.count", {
              count: mistakes.length,
              skill: displayedMistake.skill,
            })}
          </p>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          x{displayedMistake.needsPracticeCount}
        </span>
      </div>

      <div className={cn(innerCardClass, "mb-6 p-7")}>
        <h1 className="font-serif text-6xl font-extrabold text-primary">
          {displayedMistake.simplified || displayedMistake.prompt || "?"}
        </h1>
        {displayedMistake.prompt && displayedMistake.prompt !== displayedMistake.simplified && (
          <p className="mt-3 text-[0.9rem] font-semibold text-muted-foreground">{displayedMistake.prompt}</p>
        )}
        {displayedMistake.simplified && (
          <TtsButton text={displayedMistake.simplified} className={cn(secondaryButtonClass, "mt-4 px-4 py-2")}>
            {t("practice.listen")}
          </TtsButton>
        )}
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={checked !== null}
          placeholder={t("practice.weak.placeholder")}
          className="rounded-xl border-2 bg-background p-4 text-center text-base font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />

        {checked !== null && (
          <div className={cn("rounded-xl border p-4 text-left text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {checked ? t("practice.weak.correct") : t("practice.weak.incorrect")}
            <div className="mt-2 text-foreground">
              {displayedMistake.pinyin && (
                <div>
                  {t("practice.weak.pinyinLabel")}: {displayedMistake.pinyin}
                </div>
              )}
              {displayedMistake.gloss && (
                <div>
                  {t("practice.weak.meaningLabel")}: {displayedMistake.gloss}
                </div>
              )}
              {displayedMistake.correctAnswer && (
                <div>
                  {t("practice.weak.correctLabel")}: {displayedMistake.correctAnswer}
                </div>
              )}
            </div>
          </div>
        )}

        {checked === null ? (
          <button className={primaryButtonClass} type="submit" disabled={!answer.trim() || practiceMistake.isPending || addActivity.isPending}>
            {t("practice.weak.submit")}
          </button>
        ) : (
          <button className={primaryButtonClass} type="button" onClick={next}>
            {t("practice.weak.nextItem")}
          </button>
        )}
      </form>
    </div>
  );
}
export function ListPracticeTool() {
  const { t } = useI18n();
  const listsQuery = useListsQuery();
  const lists = listsQuery.data?.lists ?? [];
  const [selectedListId, setSelectedListId] = useState("");
  const [mode, setMode] = useState<ListPracticeMode>("typing");
  const activeListId = selectedListId || lists[0]?.id || "";
  const listDetailQuery = useListDetailQuery(activeListId, Boolean(activeListId));
  const addActivity = useAddActivityMutation();
  const enrollWord = useEnrollWordMutation();
  const words = useMemo(
    () => listDetailQuery.data?.list.words ?? [],
    [listDetailQuery.data?.list.words],
  );
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const word = words[idx % Math.max(words.length, 1)];

  const options = useMemo(() => {
    if (!word) return [];
    return [...words.filter((item) => item.id !== word.id).slice(0, 3), word]
      .sort((a, b) => a.simplified.localeCompare(b.simplified));
  }, [word, words]);

  if (listsQuery.isLoading) return <LoadingCard label={t("practice.list.loadingLists")} />;

  if (lists.length === 0) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-tone-2" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">{t("practice.list.noListsTitle")}</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">{t("practice.list.noListsBody")}</p>
      </div>
    );
  }

  if (listDetailQuery.isLoading) return <LoadingCard label={t("practice.list.loadingWords")} />;

  if (!word) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-tone-2" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">{t("practice.list.emptyTitle")}</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">{t("practice.list.emptyBody")}</p>
        <ListPracticeControls
          lists={lists}
          selectedListId={activeListId}
          mode={mode}
          onListChange={setSelectedListId}
          onModeChange={setMode}
        />
      </div>
    );
  }

  const next = () => {
    setIdx((value) => value + 1);
    setAnswer("");
    setSelectedWordId(null);
    setChecked(null);
  };

  const submitTyping = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || checked !== null) return;
    const normalizedInput = normalizeAnswer(answer);
    const isCorrect =
      normalizedInput === normalizeAnswer(word.pinyin) ||
      normalizedInput === normalizeAnswer(word.english) ||
      normalizedInput === normalizeAnswer(word.simplified);
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "list-typing",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "list-typing",
        prompt: word.simplified,
        userAnswer: answer,
        correctAnswer: word.pinyin,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      } : undefined,
    });
  };

  const chooseListening = async (wordId: string) => {
    if (checked !== null) return;
    setSelectedWordId(wordId);
    const isCorrect = wordId === word.id;
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "list-listening",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "list-listening",
        prompt: t("practice.list.chooseHeard"),
        userAnswer: options.find((option) => option.id === wordId)?.simplified,
        correctAnswer: word.simplified,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      } : undefined,
    });
  };

  const chooseTone = async (tone: number) => {
    if (checked !== null) return;
    const correctTone = word.tones[0] || 1;
    const isCorrect = tone === correctTone;
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await addActivity.mutateAsync({
      xp: isCorrect ? 6 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "list-tone",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "list-tone",
        prompt: word.simplified,
        userAnswer: TONE_MARKS[tone] ?? t("tone.numbered", { tone }),
        correctAnswer: TONE_MARKS[correctTone] ?? t("tone.numbered", { tone: correctTone }),
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      } : undefined,
    });
  };

  const enrollListToSrs = async () => {
    for (const item of words) {
      await enrollWord.mutateAsync({ wordId: item.id });
    }
    toast.success(t("practice.list.addedToSrs"));
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">{t("practice.list")}</h3>
      <ListPracticeControls
        lists={lists}
        selectedListId={activeListId}
        mode={mode}
        onListChange={setSelectedListId}
        onModeChange={setMode}
      />
      <button
        type="button"
        className={cn(secondaryButtonClass, "mt-3 w-full px-4 py-2")}
        onClick={() => void enrollListToSrs()}
        disabled={words.length === 0 || enrollWord.isPending}
      >
        {t("practice.list.addToSrs")}
      </button>

      <div className={cn(innerCardClass, "my-6 p-7")}>
        <h1 className="font-serif text-6xl font-extrabold text-primary">{word.simplified}</h1>
        <p className="mt-2 text-[0.95rem] font-semibold text-muted-foreground">{word.gloss}</p>
        {mode === "listening" && (
          <button className={cn(primaryButtonClass, "mt-4 size-16 rounded-full p-0")} onClick={() => speakChinese(word.simplified)}>
            <Volume2 size={28} />
          </button>
        )}
      </div>

      {mode === "typing" ? (
        <form onSubmit={submitTyping} className="grid gap-4">
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={checked !== null}
            placeholder={t("practice.list.placeholder")}
            className="rounded-xl border-2 bg-background p-4 text-center text-base font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          />
          {checked !== null && (
            <div className={cn("rounded-xl border p-4 text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
              {checked
                ? t("practice.correct")
                : t("practice.list.incorrect", {
                    simplified: word.simplified,
                    pinyin: word.pinyin,
                    english: word.english,
                  })}
            </div>
          )}
          {checked === null ? (
            <button className={primaryButtonClass} type="submit" disabled={!answer.trim() || addActivity.isPending}>{t("practice.check")}</button>
          ) : (
            <button className={primaryButtonClass} type="button" onClick={next}>{t("practice.next")}</button>
          )}
        </form>
      ) : mode === "listening" ? (
        <div className="grid gap-3">
          {options.map((option) => {
            const isCorrect = checked !== null && option.id === word.id;
            const isWrong = checked !== null && selectedWordId === option.id && option.id !== word.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => chooseListening(option.id)}
                disabled={checked !== null}
                className={cn("rounded-xl border-2 p-4 text-left font-bold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card")}
              >
                <span className="font-serif text-2xl">{option.simplified}</span>
                <span className="ml-3 text-sm text-muted-foreground">{shortenEnglish(option.gloss)}</span>
              </button>
            );
          })}
          {checked !== null && <button className={primaryButtonClass} onClick={next}>{t("practice.next")}</button>}
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[1, 2, 3, 4].map((tone) => {
              const correctTone = word.tones[0] || 1;
              const isCorrect = checked !== null && tone === correctTone;
              return (
                <button
                  key={tone}
                  type="button"
                  onClick={() => chooseTone(tone)}
                  disabled={checked !== null}
                  className={cn("flex min-h-24 flex-col items-center justify-center rounded-xl border-2 p-4 font-extrabold", isCorrect ? "border-jade bg-jade/10 text-jade" : "border-border bg-card")}
                >
                  <span className="text-3xl leading-none">{TONE_MARKS[tone]}</span>
                  <span className="mt-1 text-xs opacity-70">{toneName(t, tone)}</span>
                </button>
              );
            })}
          </div>
          {checked !== null && (
            <div className="grid gap-3">
              <div className={cn("rounded-xl border p-4 text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
                {checked
                  ? t("practice.correct")
                  : t("practice.list.correctTone", {
                      mark: TONE_MARKS[word.tones[0] || 1],
                      name: toneName(t, word.tones[0] || 1),
                      pinyin: word.pinyin,
                    })}
              </div>
              <button className={primaryButtonClass} onClick={next}>{t("practice.next")}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListPracticeControls({
  lists,
  selectedListId,
  mode,
  onListChange,
  onModeChange,
}: {
  lists: Array<{ id: string; name: string; wordIds: string[] }>;
  selectedListId: string;
  mode: ListPracticeMode;
  onListChange: (value: string) => void;
  onModeChange: (value: ListPracticeMode) => void;
}) {
  const { t } = useI18n();
  const modeLabelKeys: Record<ListPracticeMode, TranslationKey> = {
    typing: "practice.list.modeTyping",
    listening: "practice.list.modeListening",
    tone: "practice.list.modeTone",
  };

  return (
    <div className="grid gap-3 text-left sm:grid-cols-[1fr_auto]">
      <select
        value={selectedListId}
        onChange={(event) => onListChange(event.target.value)}
        className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
      >
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name} ({list.wordIds.length})
          </option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-1 rounded-lg border bg-secondary p-1">
        {(["typing", "listening", "tone"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onModeChange(item)}
            className={cn("rounded-md px-3 py-2 text-xs font-bold", mode === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
          >
            {t(modeLabelKeys[item])}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToneDrillTool() {
  const { t } = useI18n();
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const toneWords = useMemo(() => words.filter((word) => word.tones.length > 0).slice(0, 12), [words]);
  const [idx, setIdx] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const word = toneWords[idx % Math.max(toneWords.length, 1)];
  const correctTone = word?.tones[0] ?? 1;

  const check = async (tone: number) => {
    setSelectedTone(tone);
    setChecked(true);
    playAnswerSound(tone === correctTone);
    await addActivity.mutateAsync({
      xp: tone === correctTone ? 5 : 0,
      exercisesCorrect: tone === correctTone ? 1 : 0,
      exercisesTotal: 1,
      skill: "tones",
      skillScore: tone === correctTone ? 100 : 0,
      mistake: tone !== correctTone ? {
        wordId: word.id,
        skill: "tones",
        prompt: word.simplified,
        userAnswer: TONE_MARKS[tone] ?? t("tone.numbered", { tone }),
        correctAnswer: TONE_MARKS[correctTone] ?? t("tone.numbered", { tone: correctTone }),
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "tone-drill" },
      } : undefined,
    });
  };

  if (isLoading || !word) return <LoadingCard label={t("practice.loadingWords")} />;

  return (
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">{t("practice.tones")}</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">{t("practice.tone.subtitle")}</p>
      <div className={cn(innerCardClass, "mb-6 p-8")}>
        <h1 className="font-serif text-6xl text-primary">{word.simplified}</h1>
        <TtsButton text={word.simplified} className={cn(secondaryButtonClass, "mt-3 px-4 py-2")}>
          {t("practice.listen")}
        </TtsButton>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[1, 2, 3, 4].map((tone) => {
          const isCorrect = checked && tone === correctTone;
          const isWrong = checked && selectedTone === tone && tone !== correctTone;
          return (
            <button key={tone} onClick={() => check(tone)} disabled={checked} className={cn("flex min-h-24 flex-col items-center justify-center rounded-xl border-2 p-4 font-extrabold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              <span className="text-3xl leading-none">{TONE_MARKS[tone]}</span>
              <span className="mt-1 text-xs opacity-70">{toneName(t, tone)}</span>
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="anim-pop">
          <p className={cn("mb-3.5 font-bold", selectedTone === correctTone ? "text-jade" : "text-tone-4")}>
            {selectedTone === correctTone
              ? t("practice.tone.correct")
              : t("practice.tone.incorrect", {
                  mark: TONE_MARKS[correctTone],
                  name: toneName(t, correctTone),
                })}{" "}
            {word.pinyin}
          </p>
          <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelectedTone(null); setChecked(false); }}>{t("practice.nextWord")}</button>
        </div>
      )}
    </div>
  );
}

export function MinimalPairsTool() {
  const { t } = useI18n();
  const pairsQuery = useMinimalPairsQuery();
  const addActivity = useAddActivityMutation();
  const pairs = pairsQuery.data?.pairs ?? [];
  const [pairIdx, setPairIdx] = useState(0);
  const [userSelection, setUserSelection] = useState<"A" | "B" | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const activePair = pairs[pairIdx % Math.max(pairs.length, 1)];
  const playedA = (pairIdx + (activePair?.id.length ?? 0)) % 2 === 0;

  if (pairsQuery.isLoading || !activePair) return <LoadingCard label={t("practice.pairs.loading")} />;

  const speakActiveWord = () => speakChinese(playedA ? activePair.charA : activePair.charB);

  const checkAnswer = async (selection: "A" | "B") => {
    if (isAnswerChecked) return;
    setUserSelection(selection);
    const isCorrect = (selection === "A" && playedA) || (selection === "B" && !playedA);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    setIsAnswerChecked(true);
    playAnswerSound(isCorrect);
    await addActivity.mutateAsync({
      xp: isCorrect ? 5 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "listening",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        skill: "minimal-pairs",
        prompt: activePair.label,
        userAnswer: selection === "A" ? activePair.wordA : activePair.wordB,
        correctAnswer: playedA ? activePair.wordA : activePair.wordB,
        simplified: playedA ? activePair.charA : activePair.charB,
        pinyin: playedA ? activePair.wordA : activePair.wordB,
        english: activePair.label,
        context: { tool: "minimal-pairs", selected: selection },
      } : undefined,
    });
  };

  const goToNextPair = () => {
    setPairIdx((value) => value + 1);
    setUserSelection(null);
    setIsAnswerChecked(false);
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">{t("practice.pairs.title")}</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">
        {t("practice.pairs.correctCount", { count: correctCount })}
      </span>
      <p className="mb-6 mt-3 text-[0.85rem] text-muted-foreground">{t("practice.pairs.subtitle")}</p>
      <div className={cn(innerCardClass, "mb-7 inline-flex w-full flex-col items-center gap-4 p-8")}>
        <button className={cn(primaryButtonClass, "size-20 rounded-full p-0")} onClick={speakActiveWord}>
          <Volume2 size={32} />
        </button>
        <span className="text-[0.85rem] font-bold uppercase text-muted-foreground">
          {t("practice.pairs.drill", { label: activePair.label })}
        </span>
      </div>
      <div className="mb-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
        {[
          { key: "A", pinyin: activePair.wordA, char: activePair.charA, isCorrect: playedA },
          { key: "B", pinyin: activePair.wordB, char: activePair.charB, isCorrect: !playedA },
        ].map((opt) => {
          const isWrong = isAnswerChecked && userSelection === opt.key && !opt.isCorrect;
          const stateClass = isAnswerChecked && opt.isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-primary bg-tone-4/10 text-primary" : "border-border bg-card text-foreground";
          return (
            <button key={opt.key} onClick={() => checkAnswer(opt.key as "A" | "B")} disabled={isAnswerChecked} className={cn("rounded-2xl border-2 px-4 py-6", isAnswerChecked ? "cursor-default" : "cursor-pointer", stateClass)}>
              <span className="block font-serif text-3xl font-bold">{opt.char}</span>
              <span className="mt-1 block text-[1.1rem] font-extrabold">{opt.pinyin}</span>
            </button>
          );
        })}
      </div>
      {isAnswerChecked && <button className={cn(primaryButtonClass, "w-full")} onClick={goToNextPair}>{t("practice.pairs.next")}</button>}
    </div>
  );
}

export function PinyinTypingTool() {
  const { t } = useI18n();
  const { words, isLoading, lessonTitle } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  // Prefer single-syllable words for the drill, but lesson vocab is small and
  // often multi-syllable — use every word rather than an empty/tiny pool.
  const typingWords = useMemo(() => {
    const singles = words.filter((word) => word.pinyin.split(" ").length === 1);
    return singles.length >= 4 ? singles : words;
  }, [words]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const word = typingWords[idx % Math.max(typingWords.length, 1)];

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || checked) return;
    const cleanInput = typed.trim().toLowerCase();
    const cleanPinyin = word.pinyin.trim().toLowerCase();
    const cleanStandard = cleanPinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isMatch = cleanInput === cleanPinyin || cleanInput === cleanStandard;
    setCorrect(isMatch);
    setChecked(true);
    playAnswerSound(isMatch);
    await addActivity.mutateAsync({
      xp: isMatch ? 10 : 0,
      exercisesCorrect: isMatch ? 1 : 0,
      exercisesTotal: 1,
      skill: "typing",
      skillScore: isMatch ? 100 : 0,
      mistake: !isMatch ? {
        wordId: word.id,
        skill: "typing",
        prompt: word.simplified,
        userAnswer: typed,
        correctAnswer: word.pinyin,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "pinyin-typing" },
      } : undefined,
    });
  };

  if (isLoading || !word) return <LoadingCard label={t("practice.loadingWords")} />;

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">{t("practice.typing.title")}</h3>
      <p className="mb-4 text-[0.85rem] text-muted-foreground">
        {lessonTitle
          ? t("practice.typing.fromLesson", { lesson: lessonTitle })
          : t("practice.typing.fromHsk1")}
      </p>
      <div className={cn(innerCardClass, "mb-6 p-8 sm:p-9")}>
        <h1 className="mb-2 font-serif text-6xl font-extrabold text-primary">{word.simplified}</h1>
        <p className="text-[0.95rem] text-muted-foreground">
          {t("practice.typing.meaning")} <strong>{word.gloss}</strong>
        </p>
      </div>
      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <input type="text" placeholder={t("practice.typing.placeholder")} value={typed} onChange={(e) => setTyped(e.target.value)} disabled={checked} className="rounded-xl border-2 bg-background p-4 text-center text-[1.1rem] font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60" />
        {checked && (
          <div className={cn("anim-pop rounded-xl border p-4 text-[0.95rem] font-bold", correct ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {correct
              ? t("practice.typing.correct")
              : t("practice.typing.incorrect", { pinyin: word.pinyin })}
          </div>
        )}
        {!checked ? (
          <button className={primaryButtonClass} type="submit" disabled={!typed.trim()}>{t("practice.typing.submit")}</button>
        ) : (
          <button className={primaryButtonClass} type="button" onClick={() => { setIdx((value) => value + 1); setTyped(""); setChecked(false); }}>{t("practice.nextCharacter")}</button>
        )}
      </form>
    </div>
  );
}

export function ListeningTool() {
  const { t } = useI18n();
  const { words, isLoading, lessonTitle } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const word = words[idx % Math.max(words.length, 1)];
  const options = useMemo(() => {
    if (!word) return [];
    // Wrap around the pool so small lesson vocab sets always yield distractors.
    const others = words.filter((item) => item.id !== word.id);
    const start = others.length > 0 ? idx % others.length : 0;
    const distractors = [...others, ...others].slice(start, start + Math.min(3, others.length));
    return [...distractors, word].sort((a, b) => a.id.localeCompare(b.id));
  }, [idx, word, words]);

  const choose = async (wordId: string) => {
    if (!word) return;
    setSelected(wordId);
    setChecked(true);
    const isCorrect = wordId === word.id;
    playAnswerSound(isCorrect);
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "listening",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "listening",
        prompt: t("practice.listening.chooseHeard"),
        userAnswer: options.find((option) => option.id === wordId)?.english,
        correctAnswer: word.english,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "listening-check" },
      } : undefined,
    });
  };

  if (isLoading || !word) return <LoadingCard label={t("practice.listening.loading")} />;

  return (
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">{t("practice.listening")}</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">
        {t("practice.listening.subtitle")}
        {lessonTitle ? t("practice.listening.fromLesson", { lesson: lessonTitle }) : ""}
      </p>
      <button className={cn(primaryButtonClass, "mb-6 size-20 rounded-full p-0")} onClick={() => speakChinese(word.simplified)}>
        <Volume2 size={32} />
      </button>
      <div className="mb-5 grid gap-2.5">
        {options.map((option) => {
          const isCorrect = checked && option.id === word.id;
          const isWrong = checked && selected === option.id && option.id !== word.id;
          return (
            <button key={option.id} onClick={() => choose(option.id)} disabled={checked} className={cn("flex items-center justify-between rounded-xl border-2 p-4 font-bold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              {shortenEnglish(option.gloss)}
              {isCorrect && <CheckCircle2 size={18} />}
              {isWrong && <XCircle size={18} />}
            </button>
          );
        })}
      </div>
      {checked && <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelected(null); setChecked(false); }}>{t("practice.nextWord")}</button>}
    </div>
  );
}

function CharDiffDisplay({ charDiff }: { charDiff: CharDiffEntry[] }) {
  const { t } = useI18n();

  if (!charDiff || charDiff.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {charDiff.map((entry, i) => {
        const colorClass =
          entry.status === "correct"
            ? "bg-jade/15 text-jade border-jade/30"
            : entry.status === "wrong"
              ? "bg-primary/10 text-primary border-primary/30"
              : entry.status === "missing"
                ? "bg-gold/15 text-gold border-gold/30"
                : "bg-muted text-muted-foreground border-border";
        return (
          <span
            key={`${i}-${entry.char}`}
            className={cn(
              "inline-flex min-w-8 items-center justify-center rounded-md border px-1.5 py-1 font-serif text-lg font-bold",
              colorClass,
            )}
            title={
              entry.status === "correct"
                ? t("practice.shadow.diffCorrect")
                : entry.status === "wrong"
                  ? t("practice.shadow.diffWrong", { expected: entry.char, got: entry.got ?? "" })
                  : entry.status === "missing"
                    ? t("practice.shadow.diffMissing", { expected: entry.char })
                    : t("practice.shadow.diffExtra", { got: entry.got ?? "" })
            }
          >
            {entry.status === "wrong" ? (
              <span className="flex flex-col items-center leading-tight">
                <span className="text-[0.65rem] font-semibold line-through opacity-60">{entry.got}</span>
                <span>{entry.char}</span>
              </span>
            ) : entry.status === "missing" ? (
              <span className="opacity-50">{entry.char}</span>
            ) : (
              entry.char
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ShadowingTool() {
  const { t } = useI18n();
  const promptsQuery = useShadowingPromptsQuery();
  const scoreMutation = useScoreShadowingMutation();
  const addActivity = useAddActivityMutation();
  const prompts = promptsQuery.data?.prompts ?? [];
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  // Held as a key rather than resolved text so a language switch mid-error
  // re-renders the message in the new language.
  const [recordingError, setRecordingError] = useState<TranslationKey | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<Awaited<ReturnType<typeof scoreMutation.mutateAsync>>["score"] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const voiceLevelRef = useRef({ frames: 0, peak: 0, maxRms: 0, voicedFrames: 0 });
  const audioChunksRef = useRef<Blob[]>([]);
  const autoStopRef = useRef<number | null>(null);
  const recordedAudioUrlRef = useRef<string | null>(null);
  const prompt = prompts[idx % Math.max(prompts.length, 1)];

  const clearAutoStop = useCallback(() => {
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const resetVoiceLevel = useCallback(() => {
    voiceLevelRef.current = { frames: 0, peak: 0, maxRms: 0, voicedFrames: 0 };
  }, []);

  const closeAudioMeter = useCallback(() => {
    audioSourceRef.current?.disconnect();
    audioSourceRef.current = null;
    analyserRef.current = null;
    audioDataRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
  }, []);

  const setupAudioMeter = useCallback((stream: MediaStream) => {
    closeAudioMeter();
    resetVoiceLevel();

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) return;

    try {
      const audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.35;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      audioSourceRef.current = source;
      analyserRef.current = analyser;
      audioDataRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize));
    } catch {
      closeAudioMeter();
    }
  }, [closeAudioMeter, resetVoiceLevel]);

  const readVoiceLevel = useCallback(() => {
    const analyser = analyserRef.current;
    const audioData = audioDataRef.current;

    if (!analyser || !audioData) return 0;

    analyser.getByteTimeDomainData(audioData);

    let sumSquares = 0;
    let peak = 0;

    for (const sample of audioData) {
      const centered = Math.abs((sample - 128) / 128);
      sumSquares += centered * centered;
      peak = Math.max(peak, centered);
    }

    const rms = Math.sqrt(sumSquares / audioData.length);
    const stats = voiceLevelRef.current;
    stats.frames += 1;
    stats.peak = Math.max(stats.peak, peak);
    stats.maxRms = Math.max(stats.maxRms, rms);
    if (rms >= minVoiceRms && peak >= minVoicePeak) stats.voicedFrames += 1;

    return Math.max(rms, peak * 0.5);
  }, []);

  const hasCapturedSpeech = () => {
    const stats = voiceLevelRef.current;
    if (stats.frames === 0) return false;
    const voicedFrameRatio = stats.voicedFrames / stats.frames;
    return (
      stats.voicedFrames >= minVoicedFrames &&
      voicedFrameRatio >= minVoicedFrameRatio &&
      stats.peak >= minVoicePeak &&
      stats.maxRms >= minVoiceRms
    );
  };

  const releaseMicrophone = useCallback(() => {
    closeAudioMeter();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
  }, [closeAudioMeter]);

  const clearRecordedAudio = useCallback((updateState = true) => {
    if (recordedAudioUrlRef.current) {
      URL.revokeObjectURL(recordedAudioUrlRef.current);
      recordedAudioUrlRef.current = null;
    }
    if (updateState) setRecordedAudioUrl(null);
  }, []);

  const showRecordedAudio = useCallback((audioBlob: Blob) => {
    clearRecordedAudio();
    const url = URL.createObjectURL(audioBlob);
    recordedAudioUrlRef.current = url;
    setRecordedAudioUrl(url);
  }, [clearRecordedAudio]);

  useEffect(() => {
    if (!recording || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(217, 63, 71)";
      const level = readVoiceLevel();
      const barWidth = 4;
      const gap = 2;
      const count = Math.floor(canvas.width / (barWidth + gap));
      for (let i = 0; i < count; i += 1) {
        const wave = Math.sin((i / Math.max(count - 1, 1)) * Math.PI);
        const height = Math.max(4, wave * level * canvas.height * 2.8);
        const x = i * (barWidth + gap);
        const y = (canvas.height - height) / 2;
        ctx.fillRect(x, y, barWidth, height);
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, [readVoiceLevel, recording]);

  useEffect(() => () => {
    clearAutoStop();
    releaseMicrophone();
    clearRecordedAudio(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, [clearAutoStop, clearRecordedAudio, releaseMicrophone]);

  if (promptsQuery.isLoading || !prompt) return <LoadingCard label={t("practice.shadow.loading")} />;

  const scoreRecordedAudio = async (audioBlob: Blob) => {
    const audio = await blobToDataUrl(audioBlob);
    const result = await scoreMutation.mutateAsync({
      expectedText: prompt.hanzi,
      audio,
      audioMimeType: audioBlob.type,
    });
    setScore(result.score);
    playAnswerSound(result.score.overall >= 80);
    await addActivity.mutateAsync({
      xp: 15,
      minutes: 1,
      exercisesCorrect: result.score.overall >= 80 ? 1 : 0,
      exercisesTotal: 1,
      skill: "shadow",
      skillScore: result.score.overall,
      mistake: result.score.overall < 80 ? {
        skill: "shadow",
        prompt: prompt.hanzi,
        userAnswer: result.score.transcribedText || `${result.score.overall}%`,
        correctAnswer: prompt.pinyin,
        simplified: prompt.hanzi,
        pinyin: prompt.pinyin,
        english: prompt.english,
        context: { tool: "shadowing", score: result.score },
      } : undefined,
    });
  };

  const stopRecord = () => {
    clearAutoStop();
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }

    setRecording(false);
    releaseMicrophone();
  };

  const startRecord = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecordingError("practice.shadow.noSupport");
      return;
    }

    setScore(null);
    setRecordingError(null);
    clearRecordedAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupAudioMeter(stream);
      const preferredMimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      const recorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setRecording(false);
        setRecordingError("practice.shadow.failed");
        clearAutoStop();
        releaseMicrophone();
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const capturedSpeech = hasCapturedSpeech();
        setRecording(false);
        releaseMicrophone();

        if (!audioBlob.size) {
          setRecordingError("practice.shadow.noAudio");
          return;
        }

        if (!capturedSpeech) {
          setRecordingError("practice.shadow.silent");
          return;
        }

        showRecordedAudio(audioBlob);
        void scoreRecordedAudio(audioBlob).catch(() => {
          setRecordingError("practice.shadow.scoreError");
        });
      };

      recorder.start();
      setRecording(true);
      autoStopRef.current = window.setTimeout(stopRecord, 3000);
    } catch {
      setRecording(false);
      releaseMicrophone();
      setRecordingError("practice.shadow.permission");
    }
  };

  const tryAgain = () => {
    setScore(null);
    setRecordingError(null);
    clearRecordedAudio();
  };

  const nextPrompt = () => {
    setIdx((value) => value + 1);
    setScore(null);
    setRecordingError(null);
    clearRecordedAudio();
  };

  const overallLabel =
    score && score.overall >= 90
      ? t("practice.shadow.excellent")
      : score && score.overall >= 75
        ? t("practice.shadow.great")
        : score && score.overall >= 50
          ? t("practice.shadow.goodEffort")
          : t("practice.shadow.keepPracticing");

  return (
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">{t("practice.shadow.title")}</h3>
      <div className={cn(innerCardClass, "mb-6 p-7 text-center")}>
        <h1 className="font-serif text-5xl font-extrabold text-primary">{prompt.hanzi}</h1>
        <p className="my-1 text-base font-medium text-muted-foreground">{prompt.pinyin}</p>
        <p className="text-[0.9rem] font-semibold">"{prompt.gloss}"</p>
        <TtsButton text={prompt.hanzi} className={cn(secondaryButtonClass, "mt-4 px-4 py-2 text-[0.8rem]")}>
          {t("practice.shadow.listenSample")}
        </TtsButton>
      </div>
      {recording && (
        <div className="mb-5">
          <canvas ref={canvasRef} width={280} height={60} className="h-15 w-full" />
          <span className="text-xs font-bold text-primary">{t("practice.shadow.recording")}</span>
        </div>
      )}
      {scoreMutation.isPending && (
        <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          {t("practice.shadow.analyzing")}
        </div>
      )}
      {recordingError && (
        <div className="mb-5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm font-semibold text-primary">
          {t(recordingError)}
        </div>
      )}
      {recordedAudioUrl && (
        <div className="mb-5 rounded-lg border bg-card p-4 text-left shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.yourRecording")}</p>
          <audio controls src={recordedAudioUrl} className="w-full" />
        </div>
      )}
      {score && (
        <div className="anim-pop mb-6 text-left">
          <div className="rounded-lg border border-dashed border-jade bg-jade/5 p-5 shadow-sm">
            <h4 className="mb-3 flex gap-2 text-[1.1rem] font-extrabold text-jade">
              <Sparkles size={20} /> {t("practice.shadow.result", { label: overallLabel })}
            </h4>

            {score.transcribedText !== undefined && (
              <div className="mb-4 rounded-lg border bg-card p-4">
                <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.youSaid")}</p>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {score.transcribedText || <span className="italic text-muted-foreground">{t("practice.shadow.noSpeech")}</span>}
                </p>
              </div>
            )}

            {score.details?.charDiff && score.details.charDiff.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.charBreakdown")}</p>
                <CharDiffDisplay charDiff={score.details.charDiff} />
                <div className="mt-2 flex flex-wrap gap-3 text-[0.7rem] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-jade/40" /> {t("practice.shadow.legendCorrect")}</span>
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-primary/40" /> {t("practice.shadow.legendWrong")}</span>
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-gold/40" /> {t("practice.shadow.legendMissing")}</span>
                </div>
              </div>
            )}

            {[
              { label: t("practice.shadow.accuracy"), val: score.accuracy, cls: "bg-tone-1" },
              { label: t("practice.shadow.tones"), val: score.tones, cls: "bg-tone-3" },
              { label: t("practice.shadow.fluency"), val: score.fluency, cls: "bg-tone-2" },
            ].map((bar) => (
              <div key={bar.label} className="mb-2.5">
                <div className="mb-0.5 flex justify-between text-xs font-bold">
                  <span>{bar.label}</span>
                  <span>{bar.val}%</span>
                </div>
                <div className="h-1.5 w-full rounded-[3px] bg-border">
                  <div className={cn("h-full rounded-[3px] transition-all duration-500", bar.cls)} style={{ width: `${bar.val}%` }} />
                </div>
              </div>
            ))}
            <p className="text-[0.85rem] italic text-muted-foreground">{score.tip}</p>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        {!recording ? (
          <button className={cn(primaryButtonClass, "recording-pulse flex-1")} onClick={() => void startRecord()} disabled={scoreMutation.isPending}>
            {score ? t("practice.shadow.recordAgain") : t("practice.shadow.start")}
          </button>
        ) : (
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90" onClick={stopRecord}>
            {t("practice.shadow.stop")}
          </button>
        )}
        {score && (
          <>
            <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={tryAgain}>
              {t("practice.shadow.tryAgain")}
            </button>
            <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={nextPrompt}>
              {t("practice.next")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function HanziDrawingTool() {
  const { t } = useI18n();
  const strokesQuery = useHanziStrokesQuery();
  const addActivity = useAddActivityMutation();
  const characters = strokesQuery.data?.characters ?? [];
  const [charIdx, setCharIdx] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const mistakeCountRef = useRef(0);
  const currentIndex = characters.length ? charIdx % characters.length : 0;
  const current = characters[currentIndex];
  const currentCharacter = current?.character ?? "";

  const resetPracticeProgress = () => {
    mistakeCountRef.current = 0;
    setMistakeCount(0);
    setCompleted(false);
  };

  const selectCharacter = (nextIndex: number) => {
    if (!characters.length) return;
    const normalizedIndex = (nextIndex + characters.length) % characters.length;
    setCharIdx(normalizedIndex);
    resetPracticeProgress();
  };

  const handleMistake = useCallback((summary: unknown) => {
    setMistakeCount((fallback) => {
      const nextMistakeCount = readHanziTotalMistakes(summary, fallback);
      mistakeCountRef.current = nextMistakeCount;
      return nextMistakeCount;
    });
  }, []);

  const handleComplete = useCallback(async (summary: unknown) => {
    const finalMistakes = readHanziTotalMistakes(summary, mistakeCountRef.current);
    const score = Math.max(0, 100 - finalMistakes * 10);
    mistakeCountRef.current = finalMistakes;
    setMistakeCount(finalMistakes);
    setCompleted(true);
    playAnswerSound(score >= 80);
    await addActivity.mutateAsync({
      xp: score >= 80 ? 10 : 5,
      exercisesCorrect: score >= 80 ? 1 : 0,
      exercisesTotal: 1,
      skill: "hanzi",
      skillScore: score,
    });
    if (score >= 80) {
      toast.success(t("practice.hanziComplete", { character: currentCharacter }));
    }
  }, [addActivity, currentCharacter, t]);

  const handleNext = () => {
    selectCharacter(currentIndex + 1);
  };

  if (strokesQuery.isLoading || !current) return <LoadingCard label={t("practice.hanzi.loading")} />;

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">{t("practice.hanzi.title")}</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">
        {t("practice.hanzi.quizMode", { character: current.character })}
      </span>
      <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-2 text-left">
        <button
          type="button"
          className={cn(secondaryButtonClass, "size-10 p-0")}
          onClick={() => selectCharacter(currentIndex - 1)}
          title={t("practice.hanzi.previous")}
          aria-label={t("practice.hanzi.previous")}
        >
          <ChevronLeft size={18} />
        </button>
        <select
          value={currentIndex}
          onChange={(event) => selectCharacter(Number(event.target.value))}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label={t("practice.hanzi.choose")}
        >
          {characters.map((item, index) => (
            <option key={item.id} value={index}>
              {index + 1}. {item.character}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={cn(secondaryButtonClass, "size-10 p-0")}
          onClick={() => selectCharacter(currentIndex + 1)}
          title={t("practice.hanzi.next")}
          aria-label={t("practice.hanzi.next")}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="my-6 flex justify-center">
        <HanziStrokePractice
          key={current.id}
          character={current.character}
          mode="quiz"
          size={280}
          showOutline
          onMistake={handleMistake}
          onComplete={(summary) => {
            void handleComplete(summary);
          }}
        />
      </div>
      {completed ? (
        <div className="grid gap-3">
          <div className={cn("rounded-xl border p-4 text-[0.9rem] font-semibold", mistakeCount <= 2 ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {t("practice.hanzi.result", {
              mistakes: mistakeCount,
              score: Math.max(0, 100 - mistakeCount * 10),
            })}
          </div>
          <button className={primaryButtonClass} onClick={handleNext}>{t("practice.nextCharacter")}</button>
        </div>
      ) : (
        <p className="text-[0.85rem] font-semibold text-muted-foreground">
          {t("practice.hanzi.keepWriting")}
        </p>
      )}
    </div>
  );
}
