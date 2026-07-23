// Writes exercises/ and lesson_modules/ bundles for the 13 HSK0 pronunciation lessons,
// and refreshes each lesson's content_counts.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { lessons, LISTEN_PROMPT } from './hsk0-content.mjs';

import { DATA } from './lib.mjs';
const NOW = new Date().toISOString();

const TF_OPTIONS = { en: ['True', 'False'], vi: ['Đúng', 'Sai'] };
const KIND_PROMPT = {
  multipleChoice: { en: 'Choose the correct answer.', vi: 'Chọn đáp án đúng.' },
  trueFalse: { en: 'Decide whether the statement is true or false.', vi: 'Xác định phát biểu đúng hay sai.' },
  listeningComprehension: LISTEN_PROMPT
};

const writeJson = async (dir, lang, value) => {
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${lang}.json`), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const buildExercise = (lessonId, item, index, lang) => {
  const n = index + 1;
  const base = {
    id: `${lessonId}-ex${n}`,
    lesson_id: lessonId,
    kind: item.kind,
    prompt_hanzi: null,
    prompt_pinyin: null,
    audio_word_id: null,
    tone: null,
    order_num: n,
    created_at: NOW,
    updated_at: NOW,
    stimulus: {},
    skill: item.kind === 'listeningComprehension' ? 'listening' : 'reading',
    // pre-A1 recognition work: everything sits in the remember/understand band.
    bloom_level: item.kind === 'listeningComprehension' ? 'remember' : 'understand',
    ai_grading_enabled: false
  };

  if (item.kind === 'listeningComprehension') {
    base.prompt = KIND_PROMPT.listeningComprehension[lang];
    base.prompt_hanzi = item.hanzi;
    base.prompt_pinyin = item.pinyin;
    base.prompt_english = LISTEN_PROMPT.en;
    base.options = item.options;
    base.stimulus = {
      type: 'listening',
      text: item.hanzi,
      pinyin: item.pinyin,
      english: item.en,
      vi: item.vi,
      audioText: item.hanzi
    };
  } else if (item.kind === 'trueFalse') {
    base.prompt = item.prompt[lang];
    base.prompt_english = item.prompt.en;
    base.options = TF_OPTIONS[lang];
  } else {
    base.prompt = item.prompt[lang];
    base.prompt_english = item.prompt.en;
    base.options = item.options.map((option) => option[lang]);
  }

  base.correct_index = item.kind === 'trueFalse' ? (item.isTrue ? 0 : 1) : item.correct;
  base.correct_text = base.options[base.correct_index];
  base.acceptable_variants = [base.correct_text];
  base.answer_explanation = item.expl[lang];
  return base;
};

const buildModule = (lessonId, lesson, lang) => [
  {
    id: `${lessonId}-module-1`,
    lesson_id: lessonId,
    module_type: 'pronunciation',
    order_num: 1,
    phases: [
      {
        type: 'pronunciation',
        title: '发音',
        title_pinyin: 'fā yīn',
        title_en: 'Sounds',
        title_vi: 'Luyện âm',
        content_en: 'Listen to each sound and repeat it out loud a few times before moving on.',
        content_vi: 'Nghe từng âm rồi đọc to lặp lại vài lần trước khi sang bước sau.',
        sounds: lesson.sounds.map(([hanzi, pinyin, en, vi]) => ({
          zh: hanzi,
          simplified: hanzi,
          pinyin,
          hint: lang === 'vi' ? vi : en,
          hint_en: en,
          hint_vi: vi
        }))
      },
      {
        type: 'practice',
        title: '练习',
        title_pinyin: 'liàn xí',
        title_en: 'Practice',
        title_vi: 'Luyện tập',
        content_en: 'Work through the exercises: listen, choose, and check the explanation for each answer.',
        content_vi: 'Làm các bài tập: nghe, chọn đáp án và đọc phần giải thích cho mỗi câu.'
      }
    ],
    is_active: true,
    created_at: NOW,
    updated_at: NOW
  }
];

for (const [lessonId, lesson] of Object.entries(lessons)) {
  for (const lang of ['en', 'vi']) {
    await writeJson(
      path.join(DATA, 'exercises', lessonId),
      lang,
      lesson.exercises.map((item, index) => buildExercise(lessonId, item, index, lang))
    );
    await writeJson(path.join(DATA, 'lesson_modules', lessonId), lang, buildModule(lessonId, lesson, lang));
  }

  // content_counts is denormalized for the UI and must match the real record count.
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'lessons', lessonId, `${lang}.json`);
    const row = JSON.parse(await readFile(file, 'utf8'));
    row.content_counts = {
      vocab: 0,
      grammar: 0,
      dialogue_lines: 0,
      reading_passages: 0,
      exercises: lesson.exercises.length
    };
    row.updated_at = NOW;
    await writeFile(file, `${JSON.stringify(row, null, 2)}\n`, 'utf8');
  }

  console.log(`${lessonId}: ${lesson.exercises.length} exercises, ${lesson.sounds.length} sounds`);
}
