import { useMemo, useState } from "react";
import {
    useAddActivityMutation,
    usePracticeMistakeMutation,
    useUserMistakesQuery,
} from "../../../api";
import type { MistakeItem } from "../../../api/users";
import { ArrowLeft, Target, Volume2 } from "lucide-react";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { playAnswerSound, recordAnswer } from "./practiceActivity";
import { speakChinese } from "../../../utils/tts";
import {
    CATEGORY_ORDER,
    categoryOf,
    isLessonSkill,
    weakCategoryLabel,
} from "./weakCategories";
import type { WeakCategory } from "./weakCategories";

const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-accent";

const containsChinese = (value: string) => /[㐀-鿿]/.test(value);
const containsPinyinTone = (value: string) =>
    /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(value);

const normalizeAnswer = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[。！？；，、!?;,.\s]+/g, "");

/** Split a dictionary-style gloss ("what?; something; anything") into acceptable short answers. */
const glossSegments = (value: string) =>
    value
        .split(/[;；]/)
        .map((segment) => segment.trim())
        .filter(Boolean);

const TONE_MARKS: Record<number, string> = { 1: "ˉ", 2: "ˊ", 3: "ˇ", 4: "ˋ" };
const TONE_BY_CN_NUMERAL: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4 };
const TONE_VOWELS: Array<[RegExp, number]> = [
    [/[āēīōūǖ]/, 1],
    [/[áéíóúǘ]/, 2],
    [/[ǎěǐǒǔǚ]/, 3],
    [/[àèìòùǜ]/, 4],
];

const TONE_SKILLS = new Set(["tones", "list-tone", "lesson-tonePicker"]);
const AUDIO_QUESTION_SKILLS = new Set(["listening", "list-listening", "minimal-pairs"]);
const HANZI_TYPING_SKILLS = new Set(["list-typing", "hanzi", "lesson-arrangeSentence"]);
const CHOICE_SKILLS = new Set([
    "listening",
    "list-listening",
    "minimal-pairs",
    "lesson-multipleChoice",
    "lesson-matchPinyin",
    "lesson-fillBlank",
    "lesson-readingComprehension",
    "lesson-listeningComprehension",
]);

/** Derive the correct tone (1-4) from however the mistake row encoded it. */
const toneFromMistake = (mistake: MistakeItem): number | null => {
    const correct = (mistake.correctAnswer ?? "").trim();
    for (const [tone, mark] of Object.entries(TONE_MARKS)) {
        if (correct === mark) return Number(tone);
    }
    const numeralMatch = correct.match(/第([一二三四])声/);
    if (numeralMatch) return TONE_BY_CN_NUMERAL[numeralMatch[1]];
    const digitMatch = correct.match(/[1-4]/);
    if (digitMatch) return Number(digitMatch[0]);
    for (const char of mistake.pinyin ?? "") {
        for (const [pattern, tone] of TONE_VOWELS) {
            if (pattern.test(char)) return tone;
        }
    }
    return null;
};

/** Deterministic order so options don't jump around between renders. */
const stableShuffle = (options: string[], seed: string) => {
    const hash = (value: string) => {
        let h = 0;
        for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0;
        return h;
    };
    return [...options].sort((a, b) => hash(seed + a) - hash(seed + b));
};

const choiceOptions = (mistake: MistakeItem): string[] => {
    const fromContext = Array.isArray(mistake.context?.options)
        ? (mistake.context.options as unknown[]).filter(
              (option): option is string => typeof option === "string" && option.trim().length > 0,
          )
        : [];
    const correct = (mistake.correctAnswer ?? "").trim();
    if (!correct) return [];
    const pool = fromContext.length >= 2 ? fromContext : [correct, (mistake.userAnswer ?? "").trim()];
    const unique = Array.from(new Set(pool.map((option) => option.trim()).filter(Boolean)));
    if (unique.length < 2 || !unique.includes(correct)) return [];
    return stableShuffle(unique, mistake.id);
};

type QuestionMode =
    | { kind: "tone"; correctTone: number }
    | { kind: "trueFalse"; options: string[]; correct: string }
    | { kind: "choice"; options: string[]; correct: string }
    | { kind: "typing" };

const questionMode = (mistake: MistakeItem): QuestionMode => {
    if (TONE_SKILLS.has(mistake.skill)) {
        const correctTone = toneFromMistake(mistake);
        if (correctTone) return { kind: "tone", correctTone };
    }
    const correct = (mistake.correctAnswer ?? "").trim();
    if (mistake.skill === "lesson-trueFalse" && ["对", "错"].includes(correct)) {
        return { kind: "trueFalse", options: ["对", "错"], correct };
    }
    if (CHOICE_SKILLS.has(mistake.skill)) {
        const options = choiceOptions(mistake);
        if (options.length >= 2) return { kind: "choice", options, correct };
    }
    return { kind: "typing" };
};

/** Answers accepted in typing mode, matched to what each skill actually asks for. */
const acceptedTypingAnswers = (mistake: MistakeItem): string[] => {
    const correct = (mistake.correctAnswer ?? "").trim();
    if (isLessonSkill(mistake.skill)) {
        const correctOption =
            typeof mistake.context?.correctOption === "string" ? mistake.context.correctOption : "";
        return [correct, correctOption].filter(Boolean);
    }
    if (HANZI_TYPING_SKILLS.has(mistake.skill)) {
        return [correct, mistake.simplified ?? "", mistake.pinyin ?? ""].filter(Boolean);
    }
    if (mistake.skill === "typing" || mistake.skill === "shadow") {
        return [correct, mistake.pinyin ?? "", mistake.simplified ?? ""].filter(Boolean);
    }
    // Meaning-style answers (srs, ai-tutor, fallbacks): accept any gloss segment too.
    return [
        correct,
        ...glossSegments(correct),
        mistake.pinyin ?? "",
        mistake.simplified ?? "",
        ...glossSegments(mistake.gloss ?? ""),
        ...glossSegments(mistake.english ?? ""),
    ].filter(Boolean);
};

type Translate = ReturnType<typeof useI18n>["t"];

const categoryLabel = weakCategoryLabel;

const toneName = (t: Translate, tone: number) =>
    tone >= 1 && tone <= 4 ? t(`tone.${tone}.name` as TranslationKey) : t("tone.numbered", { tone });

export default function WeakPracticeTool() {
    const { t } = useI18n();
    const mistakesQuery = useUserMistakesQuery(50);
    const practiceMistake = usePracticeMistakeMutation();
    const addActivity = useAddActivityMutation();
    const mistakes = useMemo(
        () => (mistakesQuery.data?.mistakes ?? []).filter((item) => item.needsPracticeCount > 0),
        [mistakesQuery.data?.mistakes],
    );
    const [category, setCategory] = useState<WeakCategory | "all" | null>(null);
    const [idx, setIdx] = useState(0);
    const [answer, setAnswer] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedTone, setSelectedTone] = useState<number | null>(null);
    const [checked, setChecked] = useState<null | boolean>(null);
    const [lockedMistake, setLockedMistake] = useState<MistakeItem | null>(null);

    const grouped = useMemo(() => {
        const groups = new Map<WeakCategory, MistakeItem[]>();
        for (const mistake of mistakes) {
            const key = categoryOf(mistake.skill);
            groups.set(key, [...(groups.get(key) ?? []), mistake]);
        }
        return groups;
    }, [mistakes]);

    const queue = useMemo(
        () =>
            category === "all" || category === null
                ? mistakes
                : grouped.get(category) ?? [],
        [category, grouped, mistakes],
    );

    if (mistakesQuery.isLoading) return <LoadingCard label={t("practice.weak.loading")} />;

    if (mistakes.length === 0) {
        return (
            <div className={panelClass}>
                <Target className="mx-auto mb-4 text-jade" size={56} />
                <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak.emptyTitle")}</h3>
                <p className="mt-2 text-[0.9rem] text-muted-foreground">{t("practice.weak.emptyBody")}</p>
            </div>
        );
    }

    // --- Category list screen ---
    if (category === null) {
        return (
            <div className={panelClass}>
                <div className="mb-5 text-left">
                    <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak.listTitle")}</h3>
                    <p className="text-[0.85rem] text-muted-foreground">{t("practice.weak.listSubtitle")}</p>
                </div>
                <div className="grid gap-2.5">
                    <button
                        type="button"
                        onClick={() => { setCategory("all"); setIdx(0); }}
                        className="flex items-center justify-between rounded-xl border-2 border-primary/40 bg-primary/5 p-4 font-bold text-primary transition hover:bg-primary/10"
                    >
                        <span>{t("practice.weak.practiceAll")}</span>
                        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold">
                            {t("practice.weak.itemsCount", { count: mistakes.length })}
                        </span>
                    </button>
                    {CATEGORY_ORDER.filter((key) => (grouped.get(key)?.length ?? 0) > 0).map((key) => {
                        const items = grouped.get(key) ?? [];
                        const pending = items.reduce((sum, item) => sum + item.needsPracticeCount, 0);
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => { setCategory(key); setIdx(0); }}
                                className="flex items-center justify-between rounded-xl border-2 border-border bg-card p-4 text-left font-bold text-foreground transition hover:border-primary/50 hover:bg-secondary"
                            >
                                <span className="min-w-0">
                                    <span className="block">{categoryLabel(t, key)}</span>
                                    <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                                        {t("practice.weak.itemsCount", { count: items.length })}
                                    </span>
                                </span>
                                <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                    x{pending}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    const activeMistake = queue[idx % Math.max(queue.length, 1)];
    const displayedMistake = lockedMistake ?? activeMistake;

    // Category finished (all its items were resolved this session).
    if (!displayedMistake) {
        return (
            <div className={panelClass}>
                <Target className="mx-auto mb-4 text-jade" size={56} />
                <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak.catClearedTitle")}</h3>
                <p className="mt-2 text-[0.9rem] text-muted-foreground">{t("practice.weak.catClearedBody")}</p>
                <button type="button" className={cn(primaryButtonClass, "mt-5")} onClick={() => setCategory(null)}>
                    <ArrowLeft size={16} /> {t("practice.weak.backToList")}
                </button>
            </div>
        );
    }

    const mode = questionMode(displayedMistake);
    const correctAnswerText = (displayedMistake.correctAnswer ?? "").trim();
    const isAudioQuestion = AUDIO_QUESTION_SKILLS.has(displayedMistake.skill);
    const lesson = isLessonSkill(displayedMistake.skill);
    // Never reveal the expected answer inside the question card.
    const leaks = (value?: string | null) =>
        Boolean(value && correctAnswerText && value.trim() === correctAnswerText);
    const bigText =
        !isAudioQuestion && displayedMistake.simplified && !leaks(displayedMistake.simplified)
            ? displayedMistake.simplified
            : null;
    const promptText =
        displayedMistake.prompt &&
        displayedMistake.prompt !== bigText &&
        !leaks(displayedMistake.prompt)
            ? displayedMistake.prompt
            : null;
    // For lesson rows `pinyin` holds the question's pinyin; for word rows it is the answer.
    const promptPinyin = lesson && !leaks(displayedMistake.pinyin) ? displayedMistake.pinyin : null;
    const ttsText =
        displayedMistake.simplified && !leaks(displayedMistake.simplified)
            ? displayedMistake.simplified
            : promptText && containsChinese(promptText)
              ? promptText
              : null;

    const trimmedInput = answer.trim();
    const requiresChinese = HANZI_TYPING_SKILLS.has(displayedMistake.skill);
    const isValidLanguage =
        !requiresChinese || containsChinese(trimmedInput) || containsPinyinTone(trimmedInput);

    const evaluate = (): { userAnswer: string; correct: boolean } => {
        if (mode.kind === "tone") {
            return {
                userAnswer: selectedTone ? TONE_MARKS[selectedTone] : "",
                correct: selectedTone === mode.correctTone,
            };
        }
        if (mode.kind === "choice" || mode.kind === "trueFalse") {
            return {
                userAnswer: selectedOption ?? "",
                correct: selectedOption === mode.correct,
            };
        }
        const normalizedInput = normalizeAnswer(answer);
        const accepted = acceptedTypingAnswers(displayedMistake).map(normalizeAnswer);
        return {
            userAnswer: answer,
            correct:
                normalizedInput.length > 0 &&
                isValidLanguage &&
                accepted.some((candidate) => candidate.length > 0 && candidate === normalizedInput),
        };
    };

    const submit = async () => {
        if (checked !== null) return;
        const { userAnswer, correct } = evaluate();
        if (!userAnswer) return;
        setLockedMistake(displayedMistake);
        setChecked(correct);
        playAnswerSound(correct);
        await practiceMistake.mutateAsync({ mistakeId: displayedMistake.id, correct });
        await recordAnswer(addActivity, {
            correct,
            xp: 8,
            skill: `weak-${displayedMistake.skill}`.slice(0, 50),
            mistake: {
                wordId: displayedMistake.wordId || undefined,
                skill: displayedMistake.skill,
                prompt: displayedMistake.prompt || displayedMistake.simplified || undefined,
                userAnswer,
                correctAnswer: displayedMistake.correctAnswer || undefined,
                simplified: displayedMistake.simplified || undefined,
                pinyin: displayedMistake.pinyin || undefined,
                english: displayedMistake.english || undefined,
                context: { source: "weak-practice" },
            },
        });
    };

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault();
        void submit();
    };

    const chooseOption = (option: string) => {
        if (checked !== null) return;
        setSelectedOption(option);
    };

    const next = () => {
        setIdx((value) => value + 1);
        setAnswer("");
        setSelectedOption(null);
        setSelectedTone(null);
        setChecked(null);
        setLockedMistake(null);
    };

    const isPending = practiceMistake.isPending || addActivity.isPending;
    const canSubmit =
        mode.kind === "typing"
            ? Boolean(answer.trim())
            : mode.kind === "tone"
              ? selectedTone !== null
              : selectedOption !== null;

    return (
        <div className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                    <h3 className="text-[1.3rem] font-extrabold">{t("practice.weak")}</h3>
                    <p className="text-[0.85rem] text-muted-foreground">
                        {t("practice.weak.count", {
                            count: queue.length,
                            skill: categoryLabel(t, categoryOf(displayedMistake.skill)),
                        })}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        x{displayedMistake.needsPracticeCount}
                    </span>
                    <button type="button" className={secondaryButtonClass} onClick={() => { setCategory(null); next(); }}>
                        <ArrowLeft size={14} /> {t("practice.weak.backToList")}
                    </button>
                </div>
            </div>

            <div className="mb-6 rounded-lg border bg-card px-5 py-7.5 text-center shadow-sm">
                <h4 className="mb-3 text-base uppercase text-muted-foreground">
                    {categoryLabel(t, categoryOf(displayedMistake.skill))}
                </h4>
                {isAudioQuestion && ttsText ? (
                    <>
                        <p className="mb-3 text-[0.9rem] font-semibold text-muted-foreground">
                            {t("practice.weak.tapToListen")}
                        </p>
                        <button
                            type="button"
                            className={cn(primaryButtonClass, "mb-2 size-20 rounded-full p-0")}
                            onClick={() => speakChinese(ttsText)}
                        >
                            <Volume2 size={32} />
                        </button>
                    </>
                ) : (
                    <>
                        {bigText && (
                            <h2 className="mb-2 font-serif text-5xl font-extrabold text-primary">{bigText}</h2>
                        )}
                        {promptText && (
                            <h3 className="font-serif text-[1.35rem] font-bold leading-relaxed">{promptText}</h3>
                        )}
                        {promptPinyin && (
                            <p className="mt-1 text-[0.95rem] font-semibold text-muted-foreground">{promptPinyin}</p>
                        )}
                        {ttsText && !bigText && !promptText && (
                            <h2 className="mb-2 font-serif text-5xl font-extrabold text-primary">{ttsText}</h2>
                        )}
                        {ttsText && mode.kind !== "typing" && (
                            <TtsButton
                                text={ttsText}
                                iconSize={28}
                                className="p-0! mb-2 mt-4 inline-flex size-14 items-center justify-center rounded-full border bg-secondary text-secondary-foreground transition hover:bg-accent"
                            />
                        )}
                    </>
                )}
            </div>

            <form onSubmit={submitForm} className="grid gap-4">
                {mode.kind === "tone" && (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {[1, 2, 3, 4].map((tone) => {
                            const isCorrect = checked !== null && tone === mode.correctTone;
                            const isWrong = checked !== null && selectedTone === tone && tone !== mode.correctTone;
                            return (
                                <button
                                    key={tone}
                                    type="button"
                                    onClick={() => checked === null && setSelectedTone(tone)}
                                    disabled={checked !== null}
                                    className={cn(
                                        "flex min-h-24 flex-col items-center justify-center rounded-xl border-2 p-4 font-extrabold transition",
                                        isCorrect
                                            ? "border-jade bg-jade/10 text-jade"
                                            : isWrong
                                              ? "border-tone-4 bg-tone-4/10 text-tone-4"
                                              : selectedTone === tone
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-card text-foreground",
                                    )}
                                >
                                    <span className="text-3xl leading-none">{TONE_MARKS[tone]}</span>
                                    <span className="mt-1 text-xs opacity-70">{toneName(t, tone)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {(mode.kind === "choice" || mode.kind === "trueFalse") && (
                    <div
                        className={cn(
                            "grid gap-2.5",
                            mode.kind === "trueFalse" && "grid-cols-2",
                        )}
                    >
                        {mode.options.map((option) => {
                            const isCorrect = checked !== null && option === mode.correct;
                            const isWrong = checked !== null && selectedOption === option && option !== mode.correct;
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => chooseOption(option)}
                                    disabled={checked !== null}
                                    className={cn(
                                        "rounded-xl border-2 p-4 text-center font-bold transition",
                                        isCorrect
                                            ? "border-jade bg-jade/10 text-jade"
                                            : isWrong
                                              ? "border-tone-4 bg-tone-4/10 text-tone-4"
                                              : selectedOption === option
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-card text-foreground",
                                    )}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                )}

                {mode.kind === "typing" && (
                    <textarea
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        disabled={checked !== null}
                        placeholder={t("practice.weak.placeholder")}
                        className="min-h-28 rounded-xl border bg-card px-4 py-3 text-base font-semibold outline-none transition focus:border-primary disabled:cursor-default disabled:opacity-80"
                    />
                )}

                {checked !== null && (
                    <div className={cn("rounded-xl border p-4 text-left text-[0.9rem] font-semibold", checked ? "border-jade bg-jade/10 text-jade" : "border-primary bg-tone-4/10 text-primary")}>
                        {checked ? t("practice.weak.correct") : t("practice.weak.incorrect")}
                        <div className="mt-2 text-foreground">
                            {!lesson && displayedMistake.pinyin && (
                                <div>
                                    {t("practice.weak.pinyinLabel")}: {displayedMistake.pinyin}
                                </div>
                            )}
                            {!lesson && displayedMistake.gloss && (
                                <div>
                                    {t("practice.weak.meaningLabel")}: {displayedMistake.gloss}
                                </div>
                            )}
                            {mode.kind === "tone" ? (
                                <div>
                                    {t("practice.weak.correctLabel")}: {TONE_MARKS[mode.correctTone]}{" "}
                                    {toneName(t, mode.correctTone)}
                                </div>
                            ) : (
                                displayedMistake.correctAnswer && (
                                    <div>
                                        {t("practice.weak.correctLabel")}: {displayedMistake.correctAnswer}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {checked === null ? (
                    <button className={primaryButtonClass} type="submit" disabled={!canSubmit || isPending}>
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
