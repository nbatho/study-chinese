import { useMemo, useState } from "react";
import {
    useAddActivityMutation,
    useLessonsQuery,
    useLessonDetailQuery,
    useVocabularyQuery
} from "../../../api";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { playAnswerSound, recordAnswer } from "./practiceActivity";
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

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";


/** The diacritic for each tone. Language-independent, unlike the tone's name. */
const TONE_MARKS: Record<number, string> = { 1: "ˉ", 2: "ˊ", 3: "ˇ", 4: "ˋ" };

type Translate = ReturnType<typeof useI18n>["t"];

const toneName = (t: Translate, tone: number) =>
    tone >= 1 && tone <= 4 ? t(`tone.${tone}.name` as TranslationKey) : t("tone.numbered", { tone });


export default function ToneDrillTool() {
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
        await recordAnswer(addActivity, {
            correct: tone === correctTone,
            xp: 5,
            skill: "tones",
            mistake: {
                wordId: word.id,
                skill: "tones",
                prompt: word.simplified,
                userAnswer: TONE_MARKS[tone] ?? t("tone.numbered", { tone }),
                correctAnswer: TONE_MARKS[correctTone] ?? t("tone.numbered", { tone: correctTone }),
                simplified: word.simplified,
                pinyin: word.pinyin,
                english: word.english,
                context: { tool: "tone-drill" },
            },
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
