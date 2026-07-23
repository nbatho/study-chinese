// Applies an authored HSK4-6 lesson spec across all six bundle folders plus lessons/.
// Usage: node build-lessons46.mjs <spec-module.mjs> [...]
//
// Differs from build-lessons.mjs (HSK1-3) in two ways that plan.md treats as deliberate:
//   - a lesson carries TWO reading passages and they are independent texts, not the
//     dialogue concatenated, so `spec.passages` is authored separately from `spec.lines`;
//   - the dialogue continues the frozen opening in base-dialogues-46.mjs instead of
//     replacing it, so `spec.lines` holds only the continuation.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DATA, loadWords, resolve, countHanzi } from './lib.mjs';
import { buildPinyinizer } from './pinyinize.mjs';
import BASE_LINES from './base-dialogues-46.mjs';

const NOW = new Date().toISOString();
const CEFR = { 4: 'B2', 5: 'C1', 6: 'C2' };
const TF_OPTIONS = { en: ['对', '错'], vi: ['Đúng', 'Sai'] };
const KIND_INSTRUCTION = {
  fillBlank: { en: 'Fill in the blank with the correct word.', vi: 'Điền từ đúng vào chỗ trống.' },
  multipleChoice: { en: 'Choose the correct answer.', vi: 'Chọn đáp án đúng.' },
  trueFalse: { en: 'True or false, according to the text?', vi: 'Câu sau đúng hay sai theo bài khóa?' },
  arrangeSentence: { en: 'Arrange the words into a correct sentence.', vi: 'Sắp xếp các từ thành câu đúng.' },
  readingComprehension: { en: 'Read the text and answer the question.', vi: 'Đọc bài khóa và trả lời câu hỏi.' },
  listeningComprehension: { en: 'Listen to the audio and answer the question.', vi: 'Nghe đoạn audio và trả lời câu hỏi.' }
};

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const writeJson = (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const { bySimplified } = await loadWords();
// Passage pinyin is derived from the dictionary rather than hand-written; a spec may still
// supply `pinyin` explicitly to override it.
const pinyinize = await buildPinyinizer();
const problems = [];

const buildLesson = async (lessonId, spec) => {
  const level = Number(/^hsk(\d)-/.exec(lessonId)[1]);
  const base = BASE_LINES[lessonId];
  if (!base) problems.push(`${lessonId}: no frozen opening in base-dialogues-46.mjs`);
  const lines = [...(base || []), ...spec.lines];

  // --- vocabulary ---
  const wordIds = [];
  // A lesson may declare its own topic word even when every standard puts it a level
  // higher (团队 for the teamwork lesson); the validator carries a matching exception.
  const allowAbove = new Set(spec.allowAbove || []);
  for (const [simplified, pinyin] of spec.vocab) {
    const word = resolve(bySimplified, simplified, allowAbove.has(simplified) ? 9 : level, pinyin);
    if (!word) {
      problems.push(`${lessonId}: no word_id for ${simplified} (${pinyin}) at HSK<=${level}`);
      continue;
    }
    if (wordIds.includes(word.id)) {
      problems.push(`${lessonId}: duplicate word ${simplified} -> ${word.id}`);
      continue;
    }
    wordIds.push(word.id);
  }

  // --- lessons/ ---
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'lessons', lessonId, `${lang}.json`);
    const lesson = await readJson(file);
    lesson.dialogue = {
      id: `${lessonId}-dialogue`,
      title: lang === 'vi' ? spec.titleVi : spec.titleEn,
      scenario: lang === 'vi' ? spec.titleVi : spec.titleEn,
      lines: lines.map(([speaker, zh, pinyin, en, vi], i) => ({
        id: `${lessonId}-dialogue-line-${i + 1}`,
        vi,
        isUser: speaker === 'A',
        pinyin,
        english: en,
        speaker,
        simplified: zh,
        traditional: zh
      }))
    };
    if (lesson.review_summary) lesson.review_summary.srs_inject_word_ids = wordIds;
    lesson.content_counts = {
      vocab: wordIds.length,
      grammar: spec.grammar.length,
      dialogue_lines: lines.length,
      reading_passages: spec.passages.length,
      exercises: spec.exercises.length
    };
    lesson.updated_at = NOW;
    await writeJson(file, lesson);
  }

  // --- dialogues/ ---
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'dialogues', lessonId, `${lang}.json`);
    const [dialogue] = await readJson(file);
    dialogue.title_zh = spec.titleZh;
    dialogue.title_en = lang === 'vi' ? spec.titleVi : spec.titleEn;
    dialogue.lines = lines.map(([speaker, zh, pinyin, en, vi], i) => ({
      id: `${dialogue.id}-${i + 1}`,
      vi,
      pinyin,
      english: en,
      speaker,
      simplified: zh
    }));
    dialogue.word_count = countHanzi(lines.map(([, zh]) => zh).join(''));
    dialogue.updated_at = NOW;
    await writeJson(file, [dialogue]);
  }

  // --- reading_passages/ (independent texts; the first keeps its established id) ---
  const passageIds = spec.passages.map((_, i) => `${lessonId}-passage-1-${i + 1}`);
  for (const passage of spec.passages) passage.pinyin = passage.pinyin || pinyinize(passage.zh);
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'reading_passages', lessonId, `${lang}.json`);
    const [template] = await readJson(file);
    const rows = spec.passages.map((passage, index) => ({
      ...template,
      id: passageIds[index],
      lesson_id: lessonId,
      title_zh: passage.titleZh,
      title_en: lang === 'vi' ? passage.titleVi : passage.titleEn,
      hsk_level: level,
      content_zh: passage.zh,
      content_pinyin: passage.pinyin,
      content_en: lang === 'vi' ? passage.vi : passage.en,
      word_count: countHanzi(passage.zh),
      new_word_ids: wordIds,
      grammar_point_ids: [],
      questions: passage.questions.map((q, i) => ({
        id: `${passageIds[index]}-q${i + 1}`,
        question: q.q,
        question_pinyin: q.qPinyin,
        question_en: q.qEn,
        question_vi: q.qVi,
        options: q.options.map(([zh, vi]) => (lang === 'vi' ? vi : zh)),
        correct_index: q.correct,
        correct_text: q.options[q.correct][lang === 'vi' ? 1 : 0],
        answer_explanation: lang === 'vi' ? q.explVi : q.explEn,
        order_num: i + 1
      })),
      order_num: index + 1,
      is_active: true,
      updated_at: NOW
    }));
    await writeJson(file, rows);
  }

  // --- lesson_modules/ (the reading phase mirrors the first passage) ---
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'lesson_modules', lessonId, `${lang}.json`);
    const modules = await readJson(file);
    for (const module of modules) {
      for (const phase of module.phases || []) {
        if (phase.type !== 'reading_passage') continue;
        const [first] = spec.passages;
        phase.scenario = lang === 'vi' ? spec.titleVi : spec.titleEn;
        phase.content_zh = first.zh;
        phase.content_pinyin = first.pinyin;
        phase.content_en = first.en;
        phase.content_vi = first.vi;
      }
      module.updated_at = NOW;
    }
    await writeJson(file, modules);
  }

  // --- lesson_words/ ---
  for (const lang of ['en', 'vi']) {
    await writeJson(
      path.join(DATA, 'lesson_words', lessonId, `${lang}.json`),
      wordIds.map((wordId, i) => ({ lesson_id: lessonId, word_id: wordId, order_num: i + 1, created_at: NOW }))
    );
  }

  // --- grammar_points/ ---
  for (const lang of ['en', 'vi']) {
    await writeJson(
      path.join(DATA, 'grammar_points', lessonId, `${lang}.json`),
      spec.grammar.map((g, i) => ({
        id: `${lessonId}-grammar-${i + 1}`,
        lesson_id: lessonId,
        pattern: g.pattern,
        explanation: lang === 'vi' ? g.explVi : g.explEn,
        tips: [],
        examples: g.examples.map(([zh, pinyin, en, vi]) => ({
          en, vi, zh, pinyin, english: en, simplified: zh
        })),
        order_num: i + 1,
        created_at: NOW,
        updated_at: NOW,
        hsk_level: level,
        cefr_level: CEFR[level]
      }))
    );
  }

  // --- exercises/ ---
  const passageStimulus = (index) => {
    const passage = spec.passages[index - 1];
    return {
      text: passage.zh,
      type: 'reading',
      title: passage.titleZh,
      pinyin: passage.pinyin,
      english: passage.en,
      vietnamese: passage.vi
    };
  };
  const lineStimulus = (n) => {
    const [speaker, zh, pinyin, en, vi] = lines[n - 1];
    return {
      text: zh,
      type: 'listening',
      lines: [{ vi, pinyin, english: en, speaker, simplified: zh }],
      title: spec.titleZh,
      pinyin,
      english: en,
      audioText: zh
    };
  };

  for (const lang of ['en', 'vi']) {
    const rows = spec.exercises.map((ex, i) => {
      const n = i + 1;
      const isTrueFalse = ex.kind === 'trueFalse';
      const isArrange = ex.kind === 'arrangeSentence';
      const options = isTrueFalse
        ? TF_OPTIONS[lang]
        : (ex.options || []).map(([zh, vi]) => (lang === 'vi' ? vi : zh));
      const correctIndex = isArrange ? null : isTrueFalse ? (ex.isTrue ? 0 : 1) : ex.correct;
      const correctText = isArrange
        ? (lang === 'vi' ? ex.answerVi : ex.answer)
        : options[correctIndex];
      return {
        id: `${lessonId}-ex${n}`,
        lesson_id: lessonId,
        kind: ex.kind,
        // en.json carries the Chinese prompt (the client reads it as promptZh);
        // vi.json carries the Vietnamese instruction line shown underneath.
        prompt: lang === 'vi' ? KIND_INSTRUCTION[ex.kind].vi : ex.prompt,
        prompt_hanzi: null,
        prompt_pinyin: ex.pinyin || null,
        prompt_english: KIND_INSTRUCTION[ex.kind].en,
        options,
        correct_index: correctIndex,
        correct_text: correctText,
        audio_word_id: null,
        tone: null,
        order_num: n,
        created_at: NOW,
        updated_at: NOW,
        answer_explanation: lang === 'vi' ? ex.explVi : ex.explEn,
        stimulus: ex.passage
          ? passageStimulus(ex.passage)
          : ex.line
            ? lineStimulus(ex.line)
            : {},
        skill: 'mixed',
        bloom_level: ex.bloom,
        ai_grading_enabled: false,
        acceptable_variants: isArrange
          ? [ex.answer, ex.answer.replace(/[。？！]$/, '')]
          : [correctText]
      };
    });
    await writeJson(path.join(DATA, 'exercises', lessonId, `${lang}.json`), rows);
  }

  return { wordIds, lines: lines.length };
};

for (const module of process.argv.slice(2)) {
  const specs = (await import(path.resolve(module))).default;
  for (const [lessonId, spec] of Object.entries(specs)) {
    const info = await buildLesson(lessonId, spec);
    const questions = spec.passages.reduce((sum, p) => sum + p.questions.length, 0);
    console.log(`${lessonId}: ${info.lines} lines, ${info.wordIds.length} words, ${spec.grammar.length} grammar, ${spec.exercises.length} exercises, ${spec.passages.length} passages / ${questions} questions`);
  }
}

if (problems.length) {
  console.log('\nPROBLEMS:');
  for (const p of problems) console.log('  - ' + p);
  process.exitCode = 1;
}
