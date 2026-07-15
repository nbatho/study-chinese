// Pre-HSK1 foundation course: pinyin sound system + tones, taught in a fixed order
// for absolute beginners. Content is authored in English and Vietnamese; the UI
// picks the variant matching the app language.

import type { Language } from "../../i18n";

export type LocalizedText = Record<Language, string>;

export type ToneContour = "level" | "rising" | "dipping" | "falling" | "neutral";

/** A single syllable card the learner can listen to. */
export interface SoundCard {
  hanzi: string;
  pinyin: string;
  /** Short localized hint on how to pronounce / what it means. */
  hint: LocalizedText;
}

export interface ToneCard {
  name: LocalizedText;
  mark: string;
  pinyin: string;
  hanzi: string;
  contour: ToneContour;
  description: LocalizedText;
}

/** A listen-and-choose question. The learner hears `hanzi` and picks the pinyin. */
export interface ListenQuestion {
  hanzi: string;
  answer: string;
  options: string[];
}

export type StageKind = "tones" | "sounds" | "quiz";

export interface FoundationStage {
  id: string;
  /** Matching `lessons` row id (hsk_level 0) so completion syncs per account. */
  lessonId: string;
  kind: StageKind;
  title: LocalizedText;
  subtitle: LocalizedText;
  /** Estimated minutes, shown so learners know it is short. */
  minutes: number;
  /** XP awarded on first completion; must match the DB row's xp_reward. */
  xp: number;
  tones?: ToneCard[];
  sounds?: SoundCard[];
  questions?: ListenQuestion[];
}

export const FOUNDATION_STAGES: FoundationStage[] = [
  {
    id: "tones",
    lessonId: "hsk0-l01-tones",
    xp: 15,
    kind: "tones",
    title: {
      en: "The four tones + neutral tone",
      vi: "Bốn thanh điệu + thanh nhẹ",
    },
    subtitle: {
      en: "In Chinese, the same sound with a different tone means a different word. Listen closely to the 5 tones on the sound “ma”.",
      vi: "Trong tiếng Trung, cùng một âm nhưng khác thanh điệu là khác nghĩa. Nghe kỹ 5 thanh với âm “ma”.",
    },
    minutes: 3,
    tones: [
      {
        name: { en: "Tone 1 – High level", vi: "Thanh 1 – Âm bình" },
        mark: "mā",
        pinyin: "mā",
        hanzi: "妈",
        contour: "level",
        description: {
          en: "High and flat — hold the pitch steady like singing one note. Meaning: mother.",
          vi: "Cao và đều, giữ nguyên cao độ như đang ngân một nốt. Nghĩa: mẹ.",
        },
      },
      {
        name: { en: "Tone 2 – Rising", vi: "Thanh 2 – Dương bình" },
        mark: "má",
        pinyin: "má",
        hanzi: "麻",
        contour: "rising",
        description: {
          en: "Rises from mid to high, like asking “huh?”. Meaning: hemp.",
          vi: "Đi lên từ trung xuống cao, giống khi bạn hỏi lại “hả?”. Nghĩa: cây gai.",
        },
      },
      {
        name: { en: "Tone 3 – Dipping", vi: "Thanh 3 – Thượng thanh" },
        mark: "mǎ",
        pinyin: "mǎ",
        hanzi: "马",
        contour: "dipping",
        description: {
          en: "Dips down low first, then rises back up. Meaning: horse.",
          vi: "Hạ xuống thật thấp rồi mới kéo lên. Nghĩa: con ngựa.",
        },
      },
      {
        name: { en: "Tone 4 – Falling", vi: "Thanh 4 – Khứ thanh" },
        mark: "mà",
        pinyin: "mà",
        hanzi: "骂",
        contour: "falling",
        description: {
          en: "Falls fast and sharply from high to low, like giving an order. Meaning: to scold.",
          vi: "Rơi nhanh và dứt khoát từ cao xuống thấp, như khi ra lệnh. Nghĩa: mắng.",
        },
      },
      {
        name: { en: "Neutral tone", vi: "Thanh nhẹ – Khinh thanh" },
        mark: "ma",
        pinyin: "ma",
        hanzi: "吗",
        contour: "neutral",
        description: {
          en: "Light and short, unstressed. Often ends a question.",
          vi: "Đọc nhẹ và ngắn, không nhấn. Thường đứng cuối câu hỏi.",
        },
      },
    ],
  },
  {
    id: "tone-check",
    lessonId: "hsk0-l02-tone-check",
    xp: 15,
    kind: "quiz",
    title: {
      en: "Check: listen and pick the tone",
      vi: "Kiểm tra: nghe và chọn thanh điệu",
    },
    subtitle: {
      en: "Listen to the sound, then choose the correct pinyin. Mistakes are fine — you can listen again.",
      vi: "Nghe âm rồi chọn đúng pinyin. Sai không sao, bạn có thể nghe lại.",
    },
    minutes: 2,
    questions: [
      { hanzi: "妈", answer: "mā", options: ["mā", "má", "mǎ", "mà"] },
      { hanzi: "马", answer: "mǎ", options: ["mā", "má", "mǎ", "mà"] },
      { hanzi: "骂", answer: "mà", options: ["mā", "má", "mǎ", "mà"] },
      { hanzi: "麻", answer: "má", options: ["mā", "má", "mǎ", "mà"] },
    ],
  },
  {
    id: "initials",
    lessonId: "hsk0-l03-initials",
    xp: 15,
    kind: "sounds",
    title: {
      en: "Initials (starting consonants)",
      vi: "Thanh mẫu (phụ âm đầu)",
    },
    subtitle: {
      en: "Consonants that start a syllable. Many are close to sounds you already know; pay attention to the curled-tongue group zh/ch/sh/r.",
      vi: "Phụ âm đứng đầu âm tiết. Nhiều âm gần giống tiếng Việt; chú ý nhóm uốn lưỡi zh/ch/sh/r vốn không có trong tiếng Việt.",
    },
    minutes: 4,
    sounds: [
      {
        hanzi: "爸",
        pinyin: "bà",
        hint: { en: "b – like a soft, unaspirated “p” (dad).", vi: "b – gần như “p” nhẹ trong tiếng Việt (bố)." },
      },
      {
        hanzi: "妈",
        pinyin: "mā",
        hint: { en: "m – like an ordinary “m” (mom).", vi: "m – như “m” tiếng Việt (mẹ)." },
      },
      {
        hanzi: "大",
        pinyin: "dà",
        hint: { en: "d – like a soft “t”, no puff of air (big).", vi: "d – như “t” nhẹ, không bật hơi (to/lớn)." },
      },
      {
        hanzi: "他",
        pinyin: "tā",
        hint: { en: "t – like “t” with a strong puff of air (he).", vi: "t – như “th” bật hơi mạnh (anh ấy)." },
      },
      {
        hanzi: "哥",
        pinyin: "gē",
        hint: { en: "g – like a soft “k”, no puff of air (older brother).", vi: "g – như “c/k” nhẹ, không bật hơi (anh trai)." },
      },
      {
        hanzi: "喝",
        pinyin: "hē",
        hint: { en: "h – friction in the throat, rougher than an English “h” (to drink).", vi: "h – ma sát ở cổ họng, mạnh hơn “h” tiếng Việt (uống)." },
      },
      {
        hanzi: "几",
        pinyin: "jǐ",
        hint: { en: "j – like a light “j”, tongue tip behind the lower teeth (how many).", vi: "j – như “ch” nhẹ, đầu lưỡi sát răng dưới (mấy)." },
      },
      {
        hanzi: "七",
        pinyin: "qī",
        hint: { en: "q – like “ch” with a strong puff of air (seven).", vi: "q – như “ch” nhưng bật hơi mạnh (bảy)." },
      },
      {
        hanzi: "小",
        pinyin: "xiǎo",
        hint: { en: "x – a light, thin “sh” sound (small).", vi: "x – như “x” tiếng Việt nhưng nhẹ và mảnh (nhỏ)." },
      },
      {
        hanzi: "中",
        pinyin: "zhōng",
        hint: { en: "zh – curl the tongue back, like “j” in “judge” (middle/China).", vi: "zh – uốn lưỡi ra sau, như “tr” (ở giữa/Trung)." },
      },
      {
        hanzi: "吃",
        pinyin: "chī",
        hint: { en: "ch – like zh but with a strong puff of air (to eat).", vi: "ch – như zh nhưng bật hơi mạnh (ăn)." },
      },
      {
        hanzi: "是",
        pinyin: "shì",
        hint: { en: "sh – tongue curled back, a heavy “sh” (to be).", vi: "sh – uốn lưỡi, như “s” nặng (là/đúng)." },
      },
      {
        hanzi: "热",
        pinyin: "rè",
        hint: { en: "r – tongue curled back, between an English “r” and the “s” in “vision” (hot).", vi: "r – uốn lưỡi, giữa “r” và “j” tiếng Anh (nóng)." },
      },
    ],
  },
  {
    id: "finals",
    lessonId: "hsk0-l04-finals",
    xp: 15,
    kind: "sounds",
    title: {
      en: "Finals (vowels)",
      vi: "Vận mẫu (nguyên âm)",
    },
    subtitle: {
      en: "The rhyme part that follows the consonant. These are the core vowels you will meet constantly.",
      vi: "Phần vần đứng sau phụ âm. Đây là các nguyên âm nền tảng bạn sẽ gặp liên tục.",
    },
    minutes: 4,
    sounds: [
      {
        hanzi: "阿",
        pinyin: "ā",
        hint: { en: "a – open wide, like “a” in “father”.", vi: "a – mở rộng miệng, như “a” tiếng Việt." },
      },
      {
        hanzi: "哦",
        pinyin: "ò",
        hint: { en: "o – round the lips, like “o” in “or”.", vi: "o – tròn môi, như “ô/o”." },
      },
      {
        hanzi: "饿",
        pinyin: "è",
        hint: { en: "e – like a low “uh” in the throat (hungry).", vi: "e – như “ơ” hơi trầm (đói)." },
      },
      {
        hanzi: "一",
        pinyin: "yī",
        hint: { en: "i – like “ee” in “see” (one).", vi: "i – như “i” tiếng Việt (một)." },
      },
      {
        hanzi: "五",
        pinyin: "wǔ",
        hint: { en: "u – round lips, like “oo” in “food” (five).", vi: "u – tròn môi như “u” (năm)." },
      },
      {
        hanzi: "绿",
        pinyin: "lǜ",
        hint: { en: "ü – say “ee” while rounding your lips (green).", vi: "ü – chúm môi như “u” nhưng lưỡi ở vị trí “i” (xanh lá)." },
      },
      {
        hanzi: "爱",
        pinyin: "ài",
        hint: { en: "ai – like “eye” (to love).", vi: "ai – như “ai” tiếng Việt (yêu)." },
      },
      {
        hanzi: "要",
        pinyin: "yào",
        hint: { en: "ao – like “ow” in “cow” (to want).", vi: "ao – như “ao” (muốn/cần)." },
      },
      {
        hanzi: "有",
        pinyin: "yǒu",
        hint: { en: "ou – like “oh” (to have).", vi: "ou – như “âu” (có)." },
      },
      {
        hanzi: "安",
        pinyin: "ān",
        hint: { en: "an – “ah” closed with an “n” at the gums.", vi: "an – vần “an” đóng bằng lưỡi ở lợi." },
      },
      {
        hanzi: "很",
        pinyin: "hěn",
        hint: { en: "en – like “un” in “fun”, said lightly (very).", vi: "en – như “ân” nhẹ (rất)." },
      },
      {
        hanzi: "冷",
        pinyin: "lěng",
        hint: { en: "eng – ends in a nasal “ng” (cold).", vi: "eng – đuôi “ng” vang ở mũi (lạnh)." },
      },
    ],
  },
  {
    id: "tone-pairs",
    lessonId: "hsk0-l05-syllables",
    xp: 15,
    kind: "sounds",
    title: {
      en: "Combine sounds into words",
      vi: "Ghép âm thành từ",
    },
    subtitle: {
      en: "Now combine initial + final + tone into real words. Listen and repeat each word a few times.",
      vi: "Giờ ghép phụ âm + vần + thanh điệu thành từ thật. Nghe và lặp lại từng từ vài lần.",
    },
    minutes: 3,
    sounds: [
      {
        hanzi: "你好",
        pinyin: "nǐ hǎo",
        hint: {
          en: "Hello – two 3rd tones in a row: the first is read as a 2nd tone (ní hǎo).",
          vi: "Xin chào – hai thanh 3 liền nhau: thanh 3 đầu đọc thành thanh 2 (ní hǎo).",
        },
      },
      {
        hanzi: "谢谢",
        pinyin: "xiè xie",
        hint: { en: "Thank you – the second syllable takes the neutral tone.", vi: "Cảm ơn – tiếng thứ hai đọc thanh nhẹ." },
      },
      {
        hanzi: "老师",
        pinyin: "lǎo shī",
        hint: { en: "Teacher – tone 3 + tone 1.", vi: "Giáo viên – thanh 3 + thanh 1." },
      },
      {
        hanzi: "中国",
        pinyin: "zhōng guó",
        hint: { en: "China – tone 1 + tone 2.", vi: "Trung Quốc – thanh 1 + thanh 2." },
      },
      {
        hanzi: "学生",
        pinyin: "xué sheng",
        hint: { en: "Student – tone 2 + neutral tone.", vi: "Học sinh – thanh 2 + thanh nhẹ." },
      },
      {
        hanzi: "再见",
        pinyin: "zài jiàn",
        hint: { en: "Goodbye – two sharp 4th tones.", vi: "Tạm biệt – hai thanh 4 dứt khoát." },
      },
    ],
  },
  {
    id: "final-check",
    lessonId: "hsk0-l06-review",
    xp: 20,
    kind: "quiz",
    title: {
      en: "Final check: listen and pick the word",
      vi: "Kiểm tra cuối: nghe và chọn từ",
    },
    subtitle: {
      en: "Listen and choose the correct pinyin to finish the foundation course.",
      vi: "Nghe và chọn pinyin đúng để hoàn thành khóa nền tảng.",
    },
    minutes: 2,
    questions: [
      { hanzi: "你好", answer: "nǐ hǎo", options: ["nǐ hǎo", "nì hào", "ní háo", "nī hāo"] },
      { hanzi: "谢谢", answer: "xiè xie", options: ["xiè xie", "xié xié", "xǐ xǐ", "qiè qie"] },
      { hanzi: "中国", answer: "zhōng guó", options: ["zhōng guó", "chōng kuó", "zhòng guǒ", "zhōng kuò"] },
      { hanzi: "再见", answer: "zài jiàn", options: ["zài jiàn", "zǎi jiān", "cài jiàn", "zài qiàn"] },
    ],
  },
];

export const FOUNDATION_TOTAL_MINUTES = FOUNDATION_STAGES.reduce((total, stage) => total + stage.minutes, 0);

const PROGRESS_KEY = "study_chinese_foundation_progress_v1";

/** Set of completed stage ids, persisted in localStorage (no backend needed). */
export function loadFoundationProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export function saveFoundationProgress(completed: Set<string>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    // Progress persistence is best-effort only.
  }
}

export function isFoundationComplete(completed: Set<string>): boolean {
  return FOUNDATION_STAGES.every((stage) => completed.has(stage.id));
}
