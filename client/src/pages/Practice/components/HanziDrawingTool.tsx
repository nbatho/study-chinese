import { useI18n } from "../../../i18n";
import HanziStrokePractice from "../../../components/HanziStrokePractice";
import { useAddActivityMutation, useHanziStrokesQuery } from "../../../api";
import { useCallback, useRef, useState } from "react";
import { playAnswerSound } from "./practiceActivity";
import { toast } from "sonner";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HanziDrawingTool() {
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
    const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
    const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";
    const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
    const readHanziTotalMistakes = (summary: unknown, fallback: number) => {
        const totalMistakes =
            typeof summary === "object" && summary !== null && "totalMistakes" in summary
                ? Number((summary as { totalMistakes?: unknown }).totalMistakes)
                : fallback;
        return Number.isFinite(totalMistakes) ? totalMistakes : fallback;
    };
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
