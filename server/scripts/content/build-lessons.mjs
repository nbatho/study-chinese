// Applies an authored lesson spec across all six bundle folders plus lessons/.
// Usage: node build-lessons.mjs <spec-module.mjs> [...]
//
// For HSK1-3 the reading passage is the dialogue concatenated, so the dialogue lines are
// the single source of truth and get written to lessons/, dialogues/, lesson_modules/ and
// reading_passages/ in one pass.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DATA, loadWords, resolve, countHanzi, effectiveLevel } from './lib.mjs';

const NOW = new Date().toISOString();
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

const { byId, bySimplified } = await loadWords();
const problems = [];

const buildLesson = async (lessonId, spec) => {
  const level = Number(/^hsk(\d)-/.exec(lessonId)[1]);
  const lines = spec.lines;

  // --- vocabulary: every headword must exist in words/ at or below the lesson level ---
  const wordIds = [];
  // A lesson may declare its topic word even when every standard puts it a level higher
  // (面试 for the job-interview lesson); the validator carries a matching exception.
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

  const contentZh = lines.map(([, zh]) => zh).join('');
  const contentPinyin = lines.map(([, , pinyin]) => pinyin).join('\n');

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
      reading_passages: 1,
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
    dialogue.word_count = countHanzi(contentZh);
    dialogue.updated_at = NOW;
    await writeJson(file, [dialogue]);
  }

  // --- lesson_modules/ (the dialogue phase mirrors the same lines) ---
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'lesson_modules', lessonId, `${lang}.json`);
    const modules = await readJson(file);
    for (const module of modules) {
      for (const phase of module.phases || []) {
        if (phase.type !== 'dialogue') continue;
        phase.dialogue = lines.map(([speaker, zh, pinyin, en, vi]) => ({
          en, vi, zh, pinyin, speaker, simplified: zh
        }));
        phase.scenario = lang === 'vi' ? spec.titleVi : spec.titleEn;
        phase.content_zh = contentZh;
        phase.content_pinyin = contentPinyin;
        phase.content_en = spec.summaryEn;
        phase.content_vi = spec.summaryVi;
      }
      module.updated_at = NOW;
    }
    await writeJson(file, modules);
  }

  // --- reading_passages/ (content is the dialogue, plus comprehension questions) ---
  for (const lang of ['en', 'vi']) {
    const file = path.join(DATA, 'reading_passages', lessonId, `${lang}.json`);
    const [passage] = await readJson(file);
    passage.title_zh = spec.titleZh;
    passage.title_en = lang === 'vi' ? spec.titleVi : spec.titleEn;
    passage.content_zh = contentZh;
    passage.content_pinyin = contentPinyin;
    passage.content_en = lang === 'vi' ? spec.summaryVi : spec.summaryEn;
    passage.word_count = countHanzi(contentZh);
    passage.new_word_ids = wordIds;
    passage.questions = spec.questions.map((q, i) => ({
      id: `${passage.id}-q${i + 1}`,
      question: q.q,
      question_pinyin: q.qPinyin,
      question_en: q.qEn,
      question_vi: q.qVi,
      options: q.options.map(([zh]) => zh),
      correct_index: q.correct,
      correct_text: q.options[q.correct][0],
      answer_explanation: q.explEn,
      answer_explanation_vi: q.explVi,
      order_num: i + 1
    }));
    passage.updated_at = NOW;
    await writeJson(file, [passage]);
  }

  // --- lesson_words/ ---
  for (const lang of ['en', 'vi']) {
    await writeJson(
      path.join(DATA, 'lesson_words', lessonId, `${lang}.json`),
      wordIds.map((wordId, i) => ({ lesson_id: lessonId, word_id: wordId, order_num: i + 1, created_at: NOW }))
    );
  }

  // --- grammar_points/ ---
  const CEFR = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2' };
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
  const passageStimulus = (lang) => ({
    text: contentZh,
    type: 'reading',
    title: spec.titleZh,
    pinyin: contentPinyin,
    english: spec.summaryEn,
    vietnamese: spec.summaryVi
  });
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
        stimulus: ex.kind === 'readingComprehension'
          ? passageStimulus(lang)
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

  return { wordIds, lines: lines.length, hanzi: countHanzi(contentZh) };
};

for (const module of process.argv.slice(2)) {
  const specs = (await import(path.resolve(module))).default;
  for (const [lessonId, spec] of Object.entries(specs)) {
    const info = await buildLesson(lessonId, spec);
    console.log(`${lessonId}: ${info.lines} lines / ${info.hanzi} hanzi, ${info.wordIds.length} words, ${spec.grammar.length} grammar, ${spec.exercises.length} exercises, ${spec.questions.length} questions`);
  }
}

if (problems.length) {
  console.log('\nPROBLEMS:');
  for (const p of problems) console.log('  - ' + p);
  process.exitCode = 1;
}
