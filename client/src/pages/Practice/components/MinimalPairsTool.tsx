import { useState } from "react";
import {
  useAddActivityMutation,
  useMinimalPairsQuery,
} from "../../../api";
import { Volume2 } from "lucide-react";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import { speakChinese } from "../../../utils/tts";
import { playAnswerSound, recordAnswer } from "./practiceActivity";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";


export default function MinimalPairsTool() {
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
    await recordAnswer(addActivity, {
      correct: isCorrect,
      xp: 5,
      skill: "listening",
      mistake: {
        skill: "minimal-pairs",
        prompt: activePair.label,
        userAnswer: selection === "A" ? activePair.wordA : activePair.wordB,
        correctAnswer: playedA ? activePair.wordA : activePair.wordB,
        simplified: playedA ? activePair.charA : activePair.charB,
        pinyin: playedA ? activePair.wordA : activePair.wordB,
        english: activePair.label,
        context: { tool: "minimal-pairs", selected: selection },
      },
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