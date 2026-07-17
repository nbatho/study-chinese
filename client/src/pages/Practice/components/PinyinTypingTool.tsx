import { useMemo, useState } from "react";
import { useAddActivityMutation } from "../../../api";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import usePracticeWords from "./usePracticeWords";
import { playAnswerSound, recordAnswer } from "./practiceActivity";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";


export default function PinyinTypingTool() {
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
        await recordAnswer(addActivity, {
            correct: isMatch,
            xp: 10,
            skill: "typing",
            mistake: {
                wordId: word.id,
                skill: "typing",
                prompt: word.simplified,
                userAnswer: typed,
                correctAnswer: word.pinyin,
                simplified: word.simplified,
                pinyin: word.pinyin,
                english: word.english,
                context: { tool: "pinyin-typing" },
            },
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