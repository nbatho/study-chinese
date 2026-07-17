import { useMemo, useState } from "react";
import {
  useAddActivityMutation,
  useEnrollWordMutation,
  useListDetailQuery,
  useListsQuery,
} from "../../../api";
import { Target, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import { speakChinese } from "../../../utils/tts";
import ListPracticeControls from "./ListPracticeControls";
import { playAnswerSound, recordAnswer } from "./practiceActivity";


export default function ListPracticeTool() {
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
  type ListPracticeMode = "typing" | "listening" | "tone";

  const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
  const innerCardClass = "rounded-lg border bg-card shadow-sm";
  const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
  const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";


  /** The diacritic for each tone. Language-independent, unlike the tone's name. */
  const TONE_MARKS: Record<number, string> = { 1: "ˉ", 2: "ˊ", 3: "ˇ", 4: "ˋ" };

  type Translate = ReturnType<typeof useI18n>["t"];

  const toneName = (t: Translate, tone: number) =>
    tone >= 1 && tone <= 4 ? t(`tone.${tone}.name` as TranslationKey) : t("tone.numbered", { tone });


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
    await recordAnswer(addActivity, {
      correct: isCorrect,
      xp: 8,
      skill: "list-typing",
      mistake: {
        wordId: word.id,
        skill: "list-typing",
        prompt: word.simplified,
        userAnswer: answer,
        correctAnswer: word.pinyin,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      },
    });
  };

  const chooseListening = async (wordId: string) => {
    if (checked !== null) return;
    setSelectedWordId(wordId);
    const isCorrect = wordId === word.id;
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await recordAnswer(addActivity, {
      correct: isCorrect,
      xp: 8,
      skill: "list-listening",
      mistake: {
        wordId: word.id,
        skill: "list-listening",
        prompt: t("practice.list.chooseHeard"),
        userAnswer: options.find((option) => option.id === wordId)?.simplified,
        correctAnswer: word.simplified,
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      },
    });
  };

  const chooseTone = async (tone: number) => {
    if (checked !== null) return;
    const correctTone = word.tones[0] || 1;
    const isCorrect = tone === correctTone;
    setChecked(isCorrect);
    playAnswerSound(isCorrect);
    await recordAnswer(addActivity, {
      correct: isCorrect,
      xp: 6,
      skill: "list-tone",
      mistake: {
        wordId: word.id,
        skill: "list-tone",
        prompt: word.simplified,
        userAnswer: TONE_MARKS[tone] ?? t("tone.numbered", { tone }),
        correctAnswer: TONE_MARKS[correctTone] ?? t("tone.numbered", { tone: correctTone }),
        simplified: word.simplified,
        pinyin: word.pinyin,
        english: word.english,
        context: { tool: "practice-list", listId: activeListId },
      },
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