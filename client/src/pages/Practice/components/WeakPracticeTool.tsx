import { useState } from "react";
import {
    useAddActivityMutation,
    usePracticeMistakeMutation,
    useUserMistakesQuery,
} from "../../../api";
import type { MistakeItem } from "../../../api/users";
import { Target} from "lucide-react";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { playAnswerSound, recordAnswer } from "./practiceActivity";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";

const containsChinese = (value: string) => /[\u4e00-\u9fff]/.test(value);
const containsPinyinTone = (value: string) =>
    /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(value);


const normalizeAnswer = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");


export default function WeakPracticeTool() {
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
        await recordAnswer(addActivity, {
            correct: isCorrect,
            xp: 8,
            skill: `weak-${displayedMistake.skill}`,
            mistake: {
                wordId: displayedMistake.wordId || undefined,
                skill: displayedMistake.skill,
                prompt: displayedMistake.prompt || displayedMistake.simplified || undefined,
                userAnswer: answer,
                correctAnswer: displayedMistake.correctAnswer || displayedMistake.pinyin || displayedMistake.english || undefined,
                simplified: displayedMistake.simplified || undefined,
                pinyin: displayedMistake.pinyin || undefined,
                english: displayedMistake.english || undefined,
                context: { source: "weak-practice" },
            },
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