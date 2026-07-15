// Pre-HSK1 foundation course: pinyin sound system + tones, taught in a fixed order
// for absolute beginners (especially Vietnamese speakers). Content is authored in
// Vietnamese to match the Learn page, which also hard-codes Vietnamese copy.

export type ToneContour = "level" | "rising" | "dipping" | "falling" | "neutral";

/** A single syllable card the learner can listen to. */
export interface SoundCard {
  hanzi: string;
  pinyin: string;
  /** Short Vietnamese hint on how to pronounce / what it means. */
  hint: string;
}

export interface ToneCard {
  name: string;
  mark: string;
  pinyin: string;
  hanzi: string;
  contour: ToneContour;
  description: string;
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
  title: string;
  subtitle: string;
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
    title: "Bốn thanh điệu + thanh nhẹ",
    subtitle:
      "Trong tiếng Trung, cùng một âm nhưng khác thanh điệu là khác nghĩa. Nghe kỹ 5 thanh với âm “ma”.",
    minutes: 3,
    tones: [
      { name: "Thanh 1 – Âm bình", mark: "mā", pinyin: "mā", hanzi: "妈", contour: "level", description: "Cao và đều, giữ nguyên cao độ như đang ngân một nốt. Nghĩa: mẹ." },
      { name: "Thanh 2 – Dương bình", mark: "má", pinyin: "má", hanzi: "麻", contour: "rising", description: "Đi lên từ trung xuống cao, giống khi bạn hỏi lại “hả?”. Nghĩa: cây gai." },
      { name: "Thanh 3 – Thượng thanh", mark: "mǎ", pinyin: "mǎ", hanzi: "马", contour: "dipping", description: "Hạ xuống thật thấp rồi mới kéo lên. Nghĩa: con ngựa." },
      { name: "Thanh 4 – Khứ thanh", mark: "mà", pinyin: "mà", hanzi: "骂", contour: "falling", description: "Rơi nhanh và dứt khoát từ cao xuống thấp, như khi ra lệnh. Nghĩa: mắng." },
      { name: "Thanh nhẹ – Khinh thanh", mark: "ma", pinyin: "ma", hanzi: "吗", contour: "neutral", description: "Đọc nhẹ và ngắn, không nhấn. Thường đứng cuối câu hỏi." },
    ],
  },
  {
    id: "tone-check",
    lessonId: "hsk0-l02-tone-check",
    xp: 15,
    kind: "quiz",
    title: "Kiểm tra: nghe và chọn thanh điệu",
    subtitle: "Nghe âm rồi chọn đúng pinyin. Sai không sao, bạn có thể nghe lại.",
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
    title: "Thanh mẫu (phụ âm đầu)",
    subtitle:
      "Phụ âm đứng đầu âm tiết. Nhiều âm gần giống tiếng Việt; chú ý nhóm uốn lưỡi zh/ch/sh/r vốn không có trong tiếng Việt.",
    minutes: 4,
    sounds: [
      { hanzi: "爸", pinyin: "bà", hint: "b – gần như “p” nhẹ trong tiếng Việt (bố)." },
      { hanzi: "妈", pinyin: "mā", hint: "m – như “m” tiếng Việt (mẹ)." },
      { hanzi: "大", pinyin: "dà", hint: "d – như “t” nhẹ, không bật hơi (to/lớn)." },
      { hanzi: "他", pinyin: "tā", hint: "t – như “th” bật hơi mạnh (anh ấy)." },
      { hanzi: "哥", pinyin: "gē", hint: "g – như “c/k” nhẹ, không bật hơi (anh trai)." },
      { hanzi: "喝", pinyin: "hē", hint: "h – ma sát ở cổ họng, mạnh hơn “h” tiếng Việt (uống)." },
      { hanzi: "几", pinyin: "jǐ", hint: "j – như “ch” nhẹ, đầu lưỡi sát răng dưới (mấy)." },
      { hanzi: "七", pinyin: "qī", hint: "q – như “ch” nhưng bật hơi mạnh (bảy)." },
      { hanzi: "小", pinyin: "xiǎo", hint: "x – như “x” tiếng Việt nhưng nhẹ và mảnh (nhỏ)." },
      { hanzi: "中", pinyin: "zhōng", hint: "zh – uốn lưỡi ra sau, như “tr” (ở giữa/Trung)." },
      { hanzi: "吃", pinyin: "chī", hint: "ch – như zh nhưng bật hơi mạnh (ăn)." },
      { hanzi: "是", pinyin: "shì", hint: "sh – uốn lưỡi, như “s” nặng (là/đúng)." },
      { hanzi: "热", pinyin: "rè", hint: "r – uốn lưỡi, giữa “r” và “j” tiếng Anh (nóng)." },
    ],
  },
  {
    id: "finals",
    lessonId: "hsk0-l04-finals",
    xp: 15,
    kind: "sounds",
    title: "Vận mẫu (nguyên âm)",
    subtitle: "Phần vần đứng sau phụ âm. Đây là các nguyên âm nền tảng bạn sẽ gặp liên tục.",
    minutes: 4,
    sounds: [
      { hanzi: "阿", pinyin: "ā", hint: "a – mở rộng miệng, như “a” tiếng Việt." },
      { hanzi: "哦", pinyin: "ò", hint: "o – tròn môi, như “ô/o”." },
      { hanzi: "饿", pinyin: "è", hint: "e – như “ơ” hơi trầm (đói)." },
      { hanzi: "一", pinyin: "yī", hint: "i – như “i” tiếng Việt (một)." },
      { hanzi: "五", pinyin: "wǔ", hint: "u – tròn môi như “u” (năm)." },
      { hanzi: "绿", pinyin: "lǜ", hint: "ü – chúm môi như “u” nhưng lưỡi ở vị trí “i” (xanh lá)." },
      { hanzi: "爱", pinyin: "ài", hint: "ai – như “ai” tiếng Việt (yêu)." },
      { hanzi: "要", pinyin: "yào", hint: "ao – như “ao” (muốn/cần)." },
      { hanzi: "有", pinyin: "yǒu", hint: "ou – như “âu” (có)." },
      { hanzi: "安", pinyin: "ān", hint: "an – vần “an” đóng bằng lưỡi ở lợi." },
      { hanzi: "很", pinyin: "hěn", hint: "en – như “ân” nhẹ (rất)." },
      { hanzi: "冷", pinyin: "lěng", hint: "eng – đuôi “ng” vang ở mũi (lạnh)." },
    ],
  },
  {
    id: "tone-pairs",
    lessonId: "hsk0-l05-syllables",
    xp: 15,
    kind: "sounds",
    title: "Ghép âm thành từ",
    subtitle:
      "Giờ ghép phụ âm + vần + thanh điệu thành từ thật. Nghe và lặp lại từng từ vài lần.",
    minutes: 3,
    sounds: [
      { hanzi: "你好", pinyin: "nǐ hǎo", hint: "Xin chào – hai thanh 3 liền nhau: thanh 3 đầu đọc thành thanh 2 (ní hǎo)." },
      { hanzi: "谢谢", pinyin: "xiè xie", hint: "Cảm ơn – tiếng thứ hai đọc thanh nhẹ." },
      { hanzi: "老师", pinyin: "lǎo shī", hint: "Giáo viên – thanh 3 + thanh 1." },
      { hanzi: "中国", pinyin: "zhōng guó", hint: "Trung Quốc – thanh 1 + thanh 2." },
      { hanzi: "学生", pinyin: "xué sheng", hint: "Học sinh – thanh 2 + thanh nhẹ." },
      { hanzi: "再见", pinyin: "zài jiàn", hint: "Tạm biệt – hai thanh 4 dứt khoát." },
    ],
  },
  {
    id: "final-check",
    lessonId: "hsk0-l06-review",
    xp: 20,
    kind: "quiz",
    title: "Kiểm tra cuối: nghe và chọn từ",
    subtitle: "Nghe và chọn pinyin đúng để hoàn thành khóa nền tảng.",
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
