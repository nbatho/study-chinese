import type { TranslationKey } from "../../../i18n";

/** Weak-spot categories shown in list screens, in display order. */
export const CATEGORY_ORDER = [
    "multipleChoice",
    "fillBlank",
    "trueFalse",
    "arrangeSentence",
    "reading",
    "listening",
    "tones",
    "pinyin",
    "hanzi",
    "srs",
    "conversation",
    "other",
] as const;

export type WeakCategory = (typeof CATEGORY_ORDER)[number];

const CATEGORY_BY_SKILL: Record<string, WeakCategory> = {
    srs: "srs",
    tones: "tones",
    "list-tone": "tones",
    "lesson-tonePicker": "tones",
    listening: "listening",
    "list-listening": "listening",
    "minimal-pairs": "listening",
    "lesson-listeningComprehension": "listening",
    typing: "pinyin",
    shadow: "pinyin",
    "list-typing": "hanzi",
    hanzi: "hanzi",
    "lesson-multipleChoice": "multipleChoice",
    "lesson-matchPinyin": "multipleChoice",
    "lesson-fillBlank": "fillBlank",
    "lesson-trueFalse": "trueFalse",
    "lesson-arrangeSentence": "arrangeSentence",
    "lesson-readingComprehension": "reading",
    "ai-tutor": "conversation",
};

export const categoryOf = (skill: string): WeakCategory => CATEGORY_BY_SKILL[skill] ?? "other";

export const isLessonSkill = (skill: string) => skill.startsWith("lesson-");

type TFn = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export const weakCategoryLabel = (t: TFn, category: WeakCategory) =>
    t(`practice.weak.cat.${category}` as TranslationKey);
