import { useMemo, useState } from "react";
import {
    useAddActivityMutation,
} from "../../../api";
import { CheckCircle2, Volume2, XCircle } from "lucide-react";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import { speakChinese } from "../../../utils/tts";
import usePracticeWords from "./usePracticeWords";
import { playAnswerSound, recordAnswer } from "./practiceActivity";




export default function ListeningTool() {
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

    const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
    const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";



    const shortenEnglish = (text: string, maxLen = 60): string => {
        if (!text) return "";
        const first = text.split(";")[0].trim();
        if (first.length <= maxLen) return first;
        return `${first.slice(0, maxLen)}...`;
    };


    const choose = async (wordId: string) => {
        if (!word) return;
        setSelected(wordId);
        setChecked(true);
        const isCorrect = wordId === word.id;
        playAnswerSound(isCorrect);
        await recordAnswer(addActivity, {
            correct: isCorrect,
            xp: 8,
            skill: "listening",
            mistake: {
                wordId: word.id,
                skill: "listening",
                prompt: t("practice.listening.chooseHeard"),
                userAnswer: options.find((option) => option.id === wordId)?.english,
                correctAnswer: word.english,
                simplified: word.simplified,
                pinyin: word.pinyin,
                english: word.english,
                context: { tool: "listening-check" },
            },
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