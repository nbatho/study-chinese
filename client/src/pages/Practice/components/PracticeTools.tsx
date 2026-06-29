import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAddActivityMutation,
  useEnrollWordMutation,
  useHanziStrokesQuery,
  useListDetailQuery,
  useListsQuery,
  useMinimalPairsQuery,
  usePracticeMistakeMutation,
  useScoreShadowingMutation,
  useShadowingPromptsQuery,
  useUserMistakesQuery,
  useVocabularyQuery,
} from "../../../api";
import type { CharDiffEntry, HanziStrokeCharacter } from "../../../api/practice";
import { CheckCircle2, Sparkles, Target, Volume2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { speakChinese } from "../../../utils/tts";

export type Tool = "menu" | "weak" | "tones" | "pairs" | "typing" | "shadow" | "hanzi" | "listening" | "list";
type ListPracticeMode = "typing" | "listening" | "tone";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";
const silentRecordingMessage = "No speech was detected. Please speak clearly and try again.";
const minVoicedFrames = 8;
const minVoicedFrameRatio = 0.04;
const minVoicePeak = 0.1;
const minVoiceRms = 0.018;

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

export function isPracticeTool(value: string | null): value is Tool {
  return ["weak", "tones", "pairs", "typing", "shadow", "hanzi", "listening", "list"].includes(value || "");
}

function usePracticeWords() {
  const vocabQuery = useVocabularyQuery({ hsk: 1 });
  return {
    ...vocabQuery,
    words: vocabQuery.data?.vocab ?? [],
  };
}

export function WeakPracticeTool() {
  const mistakesQuery = useUserMistakesQuery(50);
  const practiceMistake = usePracticeMistakeMutation();
  const addActivity = useAddActivityMutation();
  const mistakes = (mistakesQuery.data?.mistakes ?? []).filter((item) => item.needsPracticeCount > 0);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const activeMistake = mistakes[idx % Math.max(mistakes.length, 1)];

  if (mistakesQuery.isLoading) return <LoadingCard label="Loading weak spots..." />;

  if (!activeMistake) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-jade" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">No weak spots yet</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">
          Missed answers from review and practice will appear here automatically.
        </p>
      </div>
    );
  }

  const acceptedAnswers = [
    activeMistake.correctAnswer,
    activeMistake.pinyin,
    activeMistake.english,
  ]
    .filter(Boolean)
    .map((value) => normalizeAnswer(String(value)));
  const normalizedInput = normalizeAnswer(answer);
  const isCorrect =
    normalizedInput.length > 0 &&
    acceptedAnswers.some((candidate) => candidate === normalizedInput || candidate.includes(normalizedInput));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || checked !== null) return;
    setChecked(isCorrect);
    await practiceMistake.mutateAsync({ mistakeId: activeMistake.id, correct: isCorrect });
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: `weak-${activeMistake.skill}`,
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect
        ? {
            wordId: activeMistake.wordId || undefined,
            skill: activeMistake.skill,
            prompt: activeMistake.prompt || activeMistake.simplified || undefined,
            userAnswer: answer,
            correctAnswer: activeMistake.correctAnswer || activeMistake.pinyin || activeMistake.english || undefined,
            simplified: activeMistake.simplified || undefined,
            pinyin: activeMistake.pinyin || undefined,
            english: activeMistake.english || undefined,
            context: { source: "weak-practice" },
          }
        : undefined,
    });
  };

  const next = () => {
    setIdx((value) => value + 1);
    setAnswer("");
    setChecked(null);
  };

  return (
    <div className={panelClass}>
      <div className="mb-5 flex items-center justify-between gap-3 text-left">
        <div>
          <h3 className="text-[1.3rem] font-extrabold">Weak Practice</h3>
          <p className="text-[0.85rem] text-muted-foreground">
            {mistakes.length} active weak spots - {activeMistake.skill}
          </p>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          x{activeMistake.needsPracticeCount}
        </span>
      </div>

      <div className={cn(innerCardClass, "mb-6 p-7")}>
        <h1 className="font-serif text-6xl font-extrabold text-primary">
          {activeMistake.simplified || activeMistake.prompt || "?"}
        </h1>
        {activeMistake.prompt && activeMistake.prompt !== activeMistake.simplified && (
          <p className="mt-3 text-[0.9rem] font-semibold text-muted-foreground">{activeMistake.prompt}</p>
        )}
        {activeMistake.simplified && (
          <TtsButton text={activeMistake.simplified} className={cn(secondaryButtonClass, "mt-4 px-4 py-2")}>
            Listen
          </TtsButton>
        )}
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={checked !== null}
          placeholder="Type pinyin, meaning, or the corrected answer..."
          className="rounded-xl border-2 bg-background p-4 text-center text-[1rem] font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />

        {checked !== null && (
          <div className={cn("rounded-xl border p-4 text-left text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {checked ? "Correct. This weak spot is cooling down." : "Not yet. Review the target answer below."}
            <div className="mt-2 text-foreground">
              {activeMistake.pinyin && <div>Pinyin: {activeMistake.pinyin}</div>}
              {activeMistake.english && <div>Meaning: {activeMistake.english}</div>}
              {activeMistake.correctAnswer && <div>Correct: {activeMistake.correctAnswer}</div>}
            </div>
          </div>
        )}

        {checked === null ? (
          <button className={primaryButtonClass} type="submit" disabled={!answer.trim() || practiceMistake.isPending || addActivity.isPending}>
            Check Weak Spot
          </button>
        ) : (
          <button className={primaryButtonClass} type="button" onClick={next}>
            Next Weak Spot
          </button>
        )}
      </form>
    </div>
  );
}

export function ListPracticeTool() {
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

  if (listsQuery.isLoading) return <LoadingCard label="Loading your lists..." />;

  if (lists.length === 0) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-tone-2" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">No saved lists yet</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">
          Save words from Dictionary or OCR, then come back to practice that list.
        </p>
      </div>
    );
  }

  if (listDetailQuery.isLoading) return <LoadingCard label="Loading list words..." />;

  if (!word) {
    return (
      <div className={panelClass}>
        <Target className="mx-auto mb-4 text-tone-2" size={56} />
        <h3 className="text-[1.3rem] font-extrabold">This list is empty</h3>
        <p className="mt-2 text-[0.9rem] text-muted-foreground">
          Add a few words before practicing this list.
        </p>
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
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "list-listening",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "list-listening",
        prompt: "Choose the word you heard",
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
        userAnswer: `Tone ${tone}`,
        correctAnswer: `Tone ${correctTone}`,
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
    toast.success("Added this list to SRS.");
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">Practice List</h3>
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
        Add List to SRS
      </button>

      <div className={cn(innerCardClass, "my-6 p-7")}>
        <h1 className="font-serif text-6xl font-extrabold text-primary">{word.simplified}</h1>
        <p className="mt-2 text-[0.95rem] font-semibold text-muted-foreground">{word.english}</p>
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
            placeholder="Type pinyin, meaning, or hanzi..."
            className="rounded-xl border-2 bg-background p-4 text-center text-[1rem] font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          />
          {checked !== null && (
            <div className={cn("rounded-xl border p-4 text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
              {checked ? "Correct." : `Not yet. ${word.simplified} - ${word.pinyin} - ${word.english}`}
            </div>
          )}
          {checked === null ? (
            <button className={primaryButtonClass} type="submit" disabled={!answer.trim() || addActivity.isPending}>Check</button>
          ) : (
            <button className={primaryButtonClass} type="button" onClick={next}>Next</button>
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
                <span className="ml-3 text-sm text-muted-foreground">{option.english}</span>
              </button>
            );
          })}
          {checked !== null && <button className={primaryButtonClass} onClick={next}>Next</button>}
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
                  className={cn("rounded-xl border-2 p-4 font-extrabold", isCorrect ? "border-jade bg-jade/10 text-jade" : "border-border bg-card")}
                >
                  Tone {tone}
                </button>
              );
            })}
          </div>
          {checked !== null && (
            <div className="grid gap-3">
              <div className={cn("rounded-xl border p-4 text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
                {checked ? "Correct." : `Correct tone: ${word.tones[0] || 1}. ${word.pinyin}`}
              </div>
              <button className={primaryButtonClass} onClick={next}>Next</button>
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
            className={cn("rounded-md px-3 py-2 text-xs font-bold capitalize", mode === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToneDrillTool() {
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
        userAnswer: `Tone ${tone}`,
        correctAnswer: `Tone ${correctTone}`,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "tone-drill" },
      } : undefined,
    });
  };

  if (isLoading || !word) return <LoadingCard label="Loading practice words..." />;

  return (
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">Tone Drill</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">Listen to the word and choose its first tone.</p>
      <div className={cn(innerCardClass, "mb-6 p-8")}>
        <h1 className="font-serif text-6xl text-primary">{word.simplified}</h1>
        <TtsButton text={word.simplified} className={cn(secondaryButtonClass, "mt-3 px-4 py-2")}>
          Listen
        </TtsButton>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[1, 2, 3, 4].map((tone) => {
          const isCorrect = checked && tone === correctTone;
          const isWrong = checked && selectedTone === tone && tone !== correctTone;
          return (
            <button key={tone} onClick={() => check(tone)} disabled={checked} className={cn("rounded-xl border-2 p-4 font-extrabold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              Tone {tone}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="anim-pop">
          <p className={cn("mb-3.5 font-bold", selectedTone === correctTone ? "text-jade" : "text-tone-4")}>
            {selectedTone === correctTone ? "Correct!" : `Correct tone is ${correctTone}.`} {word.pinyin}
          </p>
          <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelectedTone(null); setChecked(false); }}>Next Word</button>
        </div>
      )}
    </div>
  );
}

export function MinimalPairsTool() {
  const pairsQuery = useMinimalPairsQuery();
  const addActivity = useAddActivityMutation();
  const pairs = pairsQuery.data?.pairs ?? [];
  const [pairIdx, setPairIdx] = useState(0);
  const [userSelection, setUserSelection] = useState<"A" | "B" | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const activePair = pairs[pairIdx % Math.max(pairs.length, 1)];
  const playedA = (pairIdx + (activePair?.id.length ?? 0)) % 2 === 0;

  if (pairsQuery.isLoading || !activePair) return <LoadingCard label="Loading minimal pairs from server..." />;

  const speakActiveWord = () => speakChinese(playedA ? activePair.charA : activePair.charB);

  const checkAnswer = async (selection: "A" | "B") => {
    if (isAnswerChecked) return;
    setUserSelection(selection);
    const isCorrect = (selection === "A" && playedA) || (selection === "B" && !playedA);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    setIsAnswerChecked(true);
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
      <h3 className="mb-1 text-[1.3rem] font-extrabold">Minimal Pairs Drill</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">Correct: {correctCount}</span>
      <p className="mb-6 mt-3 text-[0.85rem] text-muted-foreground">Listen to the spoken word and select which syllable you heard.</p>
      <div className={cn(innerCardClass, "mb-7 inline-flex w-full flex-col items-center gap-4 p-8")}>
        <button className={cn(primaryButtonClass, "size-20 rounded-full p-0")} onClick={speakActiveWord}>
          <Volume2 size={32} />
        </button>
        <span className="text-[0.85rem] font-bold uppercase text-muted-foreground">Drill: {activePair.label}</span>
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
      {isAnswerChecked && <button className={cn(primaryButtonClass, "w-full")} onClick={goToNextPair}>Next Pair</button>}
    </div>
  );
}

export function PinyinTypingTool() {
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const typingWords = useMemo(() => words.filter((word) => word.pinyin.split(" ").length === 1), [words]);
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

  if (isLoading || !word) return <LoadingCard label="Loading practice words..." />;

  return (
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">Pinyin Keyboard Typing</h3>
      <div className={cn(innerCardClass, "mb-6 p-8 sm:p-9")}>
        <h1 className="mb-2 font-serif text-6xl font-extrabold text-primary">{word.simplified}</h1>
        <p className="text-[0.95rem] text-muted-foreground">Meaning: <strong>{word.english}</strong></p>
      </div>
      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <input type="text" placeholder="Type the pinyin..." value={typed} onChange={(e) => setTyped(e.target.value)} disabled={checked} className="rounded-xl border-2 bg-background p-4 text-center text-[1.1rem] font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60" />
        {checked && (
          <div className={cn("anim-pop rounded-xl border p-4 text-[0.95rem] font-bold", correct ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
            {correct ? "Correct! +10 XP" : `Incorrect. The correct pinyin is: ${word.pinyin}`}
          </div>
        )}
        {!checked ? (
          <button className={primaryButtonClass} type="submit" disabled={!typed.trim()}>Check Typing</button>
        ) : (
          <button className={primaryButtonClass} type="button" onClick={() => { setIdx((value) => value + 1); setTyped(""); setChecked(false); }}>Next Character</button>
        )}
      </form>
    </div>
  );
}

export function ListeningTool() {
  const { words, isLoading } = usePracticeWords();
  const addActivity = useAddActivityMutation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const word = words[idx % Math.max(words.length, 1)];
  const options = useMemo(() => {
    if (!word) return [];
    const nearby = words.filter((item) => item.id !== word.id).slice(idx, idx + 3);
    return [...nearby, word].sort((a, b) => a.id.localeCompare(b.id));
  }, [idx, word, words]);

  const choose = async (wordId: string) => {
    if (!word) return;
    setSelected(wordId);
    setChecked(true);
    const isCorrect = wordId === word.id;
    await addActivity.mutateAsync({
      xp: isCorrect ? 8 : 0,
      exercisesCorrect: isCorrect ? 1 : 0,
      exercisesTotal: 1,
      skill: "listening",
      skillScore: isCorrect ? 100 : 0,
      mistake: !isCorrect ? {
        wordId: word.id,
        skill: "listening",
        prompt: "Choose the meaning you heard",
        userAnswer: options.find((option) => option.id === wordId)?.english,
        correctAnswer: word.english,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "listening-check" },
      } : undefined,
    });
  };

  if (isLoading || !word) return <LoadingCard label="Loading listening words..." />;

  return (
    <div className={panelClass}>
      <h3 className="mb-2 text-[1.3rem] font-extrabold">Listening Check</h3>
      <p className="mb-5 text-[0.85rem] text-muted-foreground">Listen and choose the correct meaning.</p>
      <button className={cn(primaryButtonClass, "mb-6 size-20 rounded-full p-0")} onClick={() => speakChinese(word.simplified)}>
        <Volume2 size={32} />
      </button>
      <div className="mb-5 grid gap-2.5">
        {options.map((option) => {
          const isCorrect = checked && option.id === word.id;
          const isWrong = checked && selected === option.id && option.id !== word.id;
          return (
            <button key={option.id} onClick={() => choose(option.id)} disabled={checked} className={cn("flex items-center justify-between rounded-xl border-2 p-4 font-bold", isCorrect ? "border-jade bg-jade/10 text-jade" : isWrong ? "border-tone-4 bg-tone-4/10 text-tone-4" : "border-border bg-card text-foreground")}>
              {option.english}
              {isCorrect && <CheckCircle2 size={18} />}
              {isWrong && <XCircle size={18} />}
            </button>
          );
        })}
      </div>
      {checked && <button className={primaryButtonClass} onClick={() => { setIdx((value) => value + 1); setSelected(null); setChecked(false); }}>Next Word</button>}
    </div>
  );
}

function CharDiffDisplay({ charDiff }: { charDiff: CharDiffEntry[] }) {
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
              "inline-flex min-w-[2rem] items-center justify-center rounded-md border px-1.5 py-1 font-serif text-lg font-bold",
              colorClass,
            )}
            title={
              entry.status === "correct"
                ? "Correct"
                : entry.status === "wrong"
                  ? `Expected "${entry.char}", got "${entry.got}"`
                  : entry.status === "missing"
                    ? `Missing: "${entry.char}"`
                    : `Extra: "${entry.got}"`
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
  const promptsQuery = useShadowingPromptsQuery();
  const scoreMutation = useScoreShadowingMutation();
  const addActivity = useAddActivityMutation();
  const prompts = promptsQuery.data?.prompts ?? [];
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
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

  const clearAutoStop = () => {
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  };

  const resetVoiceLevel = () => {
    voiceLevelRef.current = { frames: 0, peak: 0, maxRms: 0, voicedFrames: 0 };
  };

  const closeAudioMeter = () => {
    audioSourceRef.current?.disconnect();
    audioSourceRef.current = null;
    analyserRef.current = null;
    audioDataRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
  };

  const setupAudioMeter = (stream: MediaStream) => {
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
  };

  const readVoiceLevel = () => {
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
  };

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

  const releaseMicrophone = () => {
    closeAudioMeter();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
  };

  const clearRecordedAudio = (updateState = true) => {
    if (recordedAudioUrlRef.current) {
      URL.revokeObjectURL(recordedAudioUrlRef.current);
      recordedAudioUrlRef.current = null;
    }
    if (updateState) setRecordedAudioUrl(null);
  };

  const showRecordedAudio = (audioBlob: Blob) => {
    clearRecordedAudio();
    const url = URL.createObjectURL(audioBlob);
    recordedAudioUrlRef.current = url;
    setRecordedAudioUrl(url);
  };

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
  }, [recording]);

  useEffect(() => () => {
    clearAutoStop();
    releaseMicrophone();
    clearRecordedAudio(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  if (promptsQuery.isLoading || !prompt) return <LoadingCard label="Loading shadowing prompts from server..." />;

  const scoreRecordedAudio = async (audioBlob: Blob) => {
    const audio = await blobToDataUrl(audioBlob);
    const result = await scoreMutation.mutateAsync({
      expectedText: prompt.hanzi,
      audio,
      audioMimeType: audioBlob.type,
    });
    setScore(result.score);
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
      setRecordingError("Your browser does not support microphone recording.");
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
        setRecordingError("Recording failed. Please try again.");
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
          setRecordingError("No audio was captured. Please try again.");
          return;
        }

        if (!capturedSpeech) {
          setRecordingError(silentRecordingMessage);
          return;
        }

        showRecordedAudio(audioBlob);
        void scoreRecordedAudio(audioBlob).catch(() => {
          setRecordingError("Could not score this recording. Please try again.");
        });
      };

      recorder.start();
      setRecording(true);
      autoStopRef.current = window.setTimeout(stopRecord, 3000);
    } catch {
      setRecording(false);
      releaseMicrophone();
      setRecordingError("Microphone permission is required for shadowing practice.");
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
      ? "Excellent"
      : score && score.overall >= 75
        ? "Great"
        : score && score.overall >= 50
          ? "Good effort"
          : "Keep practicing";

  return (
    <div className={panelClass}>
      <h3 className="mb-4 text-[1.3rem] font-extrabold">Shadowing & Pronunciation</h3>
      <div className={cn(innerCardClass, "mb-6 p-7 text-center")}>
        <h1 className="font-serif text-5xl font-extrabold text-primary">{prompt.hanzi}</h1>
        <p className="my-1 text-base font-medium text-muted-foreground">{prompt.pinyin}</p>
        <p className="text-[0.9rem] font-semibold">"{prompt.english}"</p>
        <TtsButton text={prompt.hanzi} className={cn(secondaryButtonClass, "mt-4 px-4 py-2 text-[0.8rem]")}>
          Listen Sample
        </TtsButton>
      </div>
      {recording && (
        <div className="mb-5">
          <canvas ref={canvasRef} width={280} height={60} className="h-[60px] w-full" />
          <span className="text-xs font-bold text-primary">RECORDING VOICE...</span>
        </div>
      )}
      {scoreMutation.isPending && (
        <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Analyzing pronunciation...
        </div>
      )}
      {recordingError && (
        <div className="mb-5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm font-semibold text-primary">
          {recordingError}
        </div>
      )}
      {recordedAudioUrl && (
        <div className="mb-5 rounded-lg border bg-card p-4 text-left shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Your recording</p>
          <audio controls src={recordedAudioUrl} className="w-full" />
        </div>
      )}
      {score && (
        <div className="anim-pop mb-6 text-left">
          <div className="rounded-lg border border-dashed border-jade bg-jade/5 p-5 shadow-sm">
            <h4 className="mb-3 flex gap-2 text-[1.1rem] font-extrabold text-jade">
              <Sparkles size={20} /> Pronunciation: {overallLabel}
            </h4>

            {score.transcribedText !== undefined && (
              <div className="mb-4 rounded-lg border bg-card p-4">
                <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">You said:</p>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {score.transcribedText || <span className="italic text-muted-foreground">No speech detected</span>}
                </p>
              </div>
            )}

            {score.details?.charDiff && score.details.charDiff.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Character breakdown:</p>
                <CharDiffDisplay charDiff={score.details.charDiff} />
                <div className="mt-2 flex flex-wrap gap-3 text-[0.7rem] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-jade/40" /> Correct</span>
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-primary/40" /> Wrong</span>
                  <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-gold/40" /> Missing</span>
                </div>
              </div>
            )}

            {[
              { label: "Accuracy", val: score.accuracy, cls: "bg-tone-1" },
              { label: "Tones", val: score.tones, cls: "bg-tone-3" },
              { label: "Fluency", val: score.fluency, cls: "bg-tone-2" },
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
            {score ? "Record Again" : "Start Speak"}
          </button>
        ) : (
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90" onClick={stopRecord}>
            Stop
          </button>
        )}
        {score && (
          <>
            <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={tryAgain}>
              Try Again
            </button>
            <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={nextPrompt}>
              Next
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
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const current = characters[charIdx % Math.max(characters.length, 1)];

  useEffect(() => {
    if (current) drawBackground(current, activeStrokeIdx, canvasRef.current);
  }, [activeStrokeIdx, current]);

  if (strokesQuery.isLoading || !current) return <LoadingCard label="Loading stroke data from server..." />;

  const handleNext = () => {
    setCharIdx((prev) => prev + 1);
    setActiveStrokeIdx(0);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDrawingRef.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "rgb(217, 63, 71)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleCanvasMouseUp = async () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (activeStrokeIdx + 1 < current.strokes.length) {
      setActiveStrokeIdx((prev) => prev + 1);
      return;
    }
    await addActivity.mutateAsync({
      xp: 10,
      exercisesCorrect: 1,
      exercisesTotal: 1,
      skill: "hanzi",
      skillScore: 100,
    });
    toast.success(t("practice.hanziComplete", { character: current.character }));
    handleNext();
  };

  return (
    <div className={panelClass}>
      <h3 className="mb-1 text-[1.3rem] font-extrabold">Hanzi Stroke Writing</h3>
      <span className="text-[0.8rem] font-semibold text-muted-foreground">
        Character: <strong className="text-primary">{current.character}</strong> · Stroke {activeStrokeIdx + 1} of {current.strokes.length}
      </span>
      <div className="my-6 flex justify-center">
        <canvas ref={canvasRef} width={280} height={280} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={() => void handleCanvasMouseUp()} onMouseLeave={() => void handleCanvasMouseUp()} className="aspect-square w-full max-w-[280px] cursor-crosshair rounded-2xl border-2 bg-card" />
      </div>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button className={secondaryButtonClass} onClick={() => { setActiveStrokeIdx(0); drawBackground(current, 0, canvasRef.current); }}>Reset Canvas</button>
        <button className={primaryButtonClass} onClick={handleNext}>Skip Word</button>
      </div>
    </div>
  );
}

function drawBackground(character: HanziStrokeCharacter, activeStrokeIdx: number, canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(217, 63, 71, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 0); ctx.lineTo(0, canvas.height);
  ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.strokeStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  character.strokes.forEach((path) => drawSvgPathOnCanvas(ctx, path, canvas.width, canvas.height));
  ctx.strokeStyle = "rgba(242, 191, 76, 0.35)";
  drawSvgPathOnCanvas(ctx, character.strokes[activeStrokeIdx], canvas.width, canvas.height);
}

function drawSvgPathOnCanvas(ctx: CanvasRenderingContext2D, path: string, w: number, h: number) {
  const tokens = path.split(" ");
  ctx.beginPath();
  tokens.forEach((tok) => {
    if (tok.startsWith("M")) {
      const [x, y] = tok.slice(1).split(",").map(Number);
      ctx.moveTo((x / 100) * w, (y / 100) * h);
    } else if (tok.startsWith("L")) {
      const [x, y] = tok.slice(1).split(",").map(Number);
      ctx.lineTo((x / 100) * w, (y / 100) * h);
    }
  });
  ctx.stroke();
}

