import crypto from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { resolveExistingPath } from '../src/config/content-paths.js';
import { localizeLesson, normalizeGrammarExample } from '../src/services/content-language.service.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const inputDirArg = args.find((arg) => arg.startsWith('--input-dir='))?.split('=')[1];
const releaseIdArg = args.find((arg) => arg.startsWith('--release-id='))?.split('=')[1];

const CEFR_BY_HSK = new Map([
  [1, 'A1'],
  [2, 'A2'],
  [3, 'B1'],
  [4, 'B2'],
  [5, 'C1'],
  [6, 'C2'],
  [7, 'C2'],
  [8, 'C2'],
  [9, 'C2']
]);

const KIND_MAP = {
  multiple_choice: 'multipleChoice',
  word_order: 'arrangeSentence',
  fill_blank: 'fillBlank',
  cloze: 'multipleChoice',
  dialogue_choice: 'multipleChoice',
  matching: 'multipleChoice',
  true_false: 'trueFalse',
  listening_comprehension: 'listeningComprehension',
  reading_comprehension: 'readingComprehension'
};

const toJson = (value) => JSON.stringify(value ?? null);
const toJsonArray = (value) => JSON.stringify(Array.isArray(value) ? value : []);
const NON_LESSON_JSON_FILES = new Set([
  'manifest.json',
  'validation-report.json',
  'language-audit-report.json',
  'grammar-sync-report.json',
  'agent-review-report.json',
  'ai-review-report.json'
]);

const isLessonJson = (file) =>
  file.endsWith('.json') &&
  !file.endsWith('.validation.json') &&
  !file.endsWith('.review.json') &&
  !file.endsWith('.release.json') &&
  !NON_LESSON_JSON_FILES.has(file);

const slugify = (value, fallback = 'item') => {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

  return slug || fallback;
};

const toPlainPinyin = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[1-5]/g, '')
    .replace(/u:/gi, 'v')
    .replace(/ü/gi, 'v')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const makeWordId = ({ simplified, pinyin, english }) => {
  const hash = crypto
    .createHash('sha1')
    .update(`${simplified}|${pinyin}|${english}`)
    .digest('hex')
    .slice(0, 16);
  const slug = slugify(toPlainPinyin(pinyin) || simplified, 'word').slice(0, 28);

  return `lesson_${slug}_${hash}`;
};

const extractOrder = (lessonId, fallback) => {
  const match = String(lessonId || '').match(/(?:^|-)l(\d+)(?:-|$)/i);
  return match ? Number(match[1]) : fallback;
};

const titleForLesson = (lesson) => lesson?.metadata?.title_en || lesson?.metadata?.title_zh || lesson.lesson_id;
const titleViForLesson = (lesson) => lesson?.metadata?.title_vi || titleForLesson(lesson);

const subtitleForLesson = (lesson) => {
  const titleZh = lesson?.metadata?.title_zh;
  const topic = lesson?.metadata?.topic;
  const skill = lesson?.metadata?.primary_skill;
  return [titleZh, topic, skill].filter(Boolean).join(' · ') || lesson.lesson_id;
};

const subtitleViForLesson = (lesson) => {
  const topic = lesson?.metadata?.topic;
  const skill = lesson?.metadata?.primary_skill;
  return [lesson?.metadata?.title_vi, topic, skill].filter(Boolean).join(' - ') || subtitleForLesson(lesson);
};

const introForLesson = (lesson) => {
  const objectives = Array.isArray(lesson.learning_objectives) ? lesson.learning_objectives : [];
  if (objectives.length > 0) {
    return objectives.join(' ');
  }

  return `Practice ${lesson?.metadata?.primary_skill || 'Chinese'} with ${titleForLesson(lesson)}.`;
};

const introViForLesson = (lesson) => {
  const objectives = Array.isArray(lesson.learning_objectives_vi) ? lesson.learning_objectives_vi : [];
  if (objectives.length > 0) {
    return objectives.join(' ');
  }

  return introForLesson(lesson);
};

const firstDialoguePhase = (lesson) => {
  for (const module of lesson.core_modules || []) {
    for (const phase of module.phases || []) {
      if (Array.isArray(phase.dialogue) && phase.dialogue.length > 0) {
        return phase;
      }
    }
  }

  return null;
};

const normalizeLegacyDialogue = (lesson) => {
  const phase = firstDialoguePhase(lesson);
  if (!phase) {
    return null;
  }

  return {
    id: `${lesson.lesson_id}-dialogue`,
    title: lesson.metadata?.title_en || 'Dialogue',
    scenario: phase.scenario || lesson.metadata?.topic || lesson.metadata?.primary_skill || 'Practice dialogue',
    lines: phase.dialogue.map((line, index) => ({
      id: `${lesson.lesson_id}-dialogue-line-${index + 1}`,
      speaker: line.speaker || (index % 2 === 0 ? 'A' : 'B'),
      isUser: index % 2 === 0,
      simplified: line.zh || line.simplified || '',
      traditional: line.traditional || line.zh || line.simplified || '',
      pinyin: line.pinyin || '',
      english: line.en || line.english || '',
      vi: line.vi || line.en || line.english || ''
    }))
  };
};

const normalizeDialogueRows = (lesson) => {
  const rows = [];

  for (const [moduleIndex, module] of (lesson.core_modules || []).entries()) {
    for (const [phaseIndex, phase] of (module.phases || []).entries()) {
      if (!Array.isArray(phase.dialogue) || phase.dialogue.length === 0) {
        continue;
      }

      const lines = phase.dialogue.map((line, index) => ({
        id: `${lesson.lesson_id}-dialogue-${moduleIndex + 1}-${phaseIndex + 1}-${index + 1}`,
        speaker: line.speaker || (index % 2 === 0 ? 'A' : 'B'),
        simplified: line.zh || line.simplified || '',
        pinyin: line.pinyin || '',
        english: line.en || line.english || '',
        vi: line.vi || line.en || line.english || ''
      }));

      rows.push({
        id: `${lesson.lesson_id}-dialogue-${moduleIndex + 1}-${phaseIndex + 1}`,
        lessonId: lesson.lesson_id,
        titleZh: lesson.metadata?.title_zh || null,
        titleEn: lesson.metadata?.title_en || null,
        titleVi: lesson.metadata?.title_vi || null,
        hskLevel: Number(lesson.metadata?.hsk_level || 1),
        topic: lesson.metadata?.topic || null,
        lines,
        wordCount: lines.reduce((count, line) => count + [...String(line.simplified || '')].length, 0)
      });
    }
  }

  return rows;
};

const normalizePassageRows = (lesson) => {
  const rows = [];

  for (const [moduleIndex, module] of (lesson.core_modules || []).entries()) {
    for (const [phaseIndex, phase] of (module.phases || []).entries()) {
      const contentZh = phase.content_zh || phase.model_dialogue_zh;
      if (!contentZh) {
        continue;
      }

      rows.push({
        id: `${lesson.lesson_id}-passage-${moduleIndex + 1}-${phaseIndex + 1}`,
        lessonId: lesson.lesson_id,
        titleZh: lesson.metadata?.title_zh || null,
        titleEn: lesson.metadata?.title_en || null,
        titleVi: lesson.metadata?.title_vi || null,
        hskLevel: Number(lesson.metadata?.hsk_level || 1),
        topic: lesson.metadata?.topic || null,
        contentZh,
        contentPinyin: phase.content_pinyin || phase.model_dialogue_pinyin || null,
        contentEn: phase.content_en || phase.model_dialogue_en || null,
        contentVi: phase.content_vi || phase.model_dialogue_vi || phase.content_en || phase.model_dialogue_en || null,
        wordCount: [...String(contentZh)].filter((char) => /\S/.test(char)).length,
        newWordIds: lesson.review?.srs_inject_word_ids || [],
        grammarPointIds: [],
        questions: []
      });
    }
  }

  return rows;
};

const normalizeMatchingExercise = (exercise) => {
  const pairs = Array.isArray(exercise.pairs) ? exercise.pairs.filter((pair) => pair?.left && pair?.right) : [];

  if (pairs.length === 0) {
    return exercise;
  }

  const target = pairs[0];
  const viAnswers = exercise.correct_answer_vi && typeof exercise.correct_answer_vi === 'object'
    ? exercise.correct_answer_vi
    : {};
  const optionValues = [...new Set(pairs.map((pair) => pair.right).filter(Boolean))];
  const optionValuesVi = optionValues.map((value) => {
    const pair = pairs.find((item) => item.right === value);
    return pair ? viAnswers[pair.left] || value : value;
  });

  return {
    ...exercise,
    kind: 'matching',
    prompt: `Which meaning matches ${target.left}?`,
    prompt_vi: `Nghĩa nào khớp với ${target.left}?`,
    options: optionValues,
    options_vi: optionValuesVi,
    correct_answer: target.right,
    correct_answer_vi: viAnswers[target.left] || target.right,
    acceptable_variants: [target.right]
  };
};

const normalizeExercise = (lesson, exercise, index) => {
  exercise = exercise.kind === 'matching' ? normalizeMatchingExercise(exercise) : exercise;
  const options = Array.isArray(exercise.options) && exercise.options.length > 0
    ? exercise.options
    : Array.isArray(exercise.tokens)
      ? exercise.tokens
      : [];
  const correctAnswer = exercise.correct_answer ?? exercise.correctText ?? exercise.model_answer ?? '';
  const correctIndex = options.findIndex((option) => String(option) === String(correctAnswer));

  return {
    id: exercise.id || `${lesson.lesson_id}-exercise-${index + 1}`,
    lessonId: lesson.lesson_id,
    kind: KIND_MAP[exercise.kind] || exercise.kind || 'multipleChoice',
    skill: exercise.skill || lesson.metadata?.primary_skill || null,
    bloomLevel: exercise.bloom_level || null,
    prompt: exercise.prompt || '',
    promptHanzi: exercise.prompt_hanzi || exercise.promptHanzi || null,
    promptPinyin: exercise.prompt_pinyin || exercise.promptPinyin || null,
    promptEnglish: exercise.prompt_english || exercise.promptEnglish || null,
    stimulus: exercise.stimulus || {},
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : null,
    correctText: String(correctAnswer),
    answerExplanation: exercise.explanation || exercise.answer_explanation || null,
    promptVi: exercise.prompt_vi || null,
    optionsVi: exercise.options_vi || [],
    correctTextVi: exercise.correct_answer_vi || exercise.correctTextVi || null,
    answerExplanationVi: exercise.explanation_vi || exercise.answer_explanation_vi || null,
    acceptableVariants: exercise.acceptable_variants || [],
    order: index + 1
  };
};

const validateLesson = (lesson, filename) => {
  const required = ['lesson_id', 'metadata', 'learning_objectives', 'core_modules', 'practice'];
  const missing = required.filter((key) => lesson[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`${filename} is missing required fields: ${missing.join(', ')}`);
  }

  if (!lesson.metadata?.title_en && !lesson.metadata?.title_zh) {
    throw new Error(`${filename} is missing metadata.title_en/title_zh`);
  }
};

const loadLessons = async () => {
  const inputDir = await resolveExistingPath(inputDirArg, ['lessons', 'generated']);
  const files = (await readdir(inputDir))
    .filter(isLessonJson)
    .sort();
  const lessons = [];

  for (const file of files) {
    const lessonPath = path.join(inputDir, file);
    const lesson = JSON.parse(await readFile(lessonPath, 'utf8'));
    validateLesson(lesson, file);
    lessons.push({ file, lesson });
  }

  return { inputDir, lessons };
};

const getActiveReleaseId = async (client) => {
  if (releaseIdArg) {
    return releaseIdArg;
  }

  const result = await client.query(
    `
      SELECT id
      FROM content_releases
      WHERE is_active = true
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT 1
    `
  );

  return result.rows[0]?.id || null;
};

const ensureWord = async (client, item, lesson) => {
  if (item.word_id) {
    return item.word_id;
  }

  const simplified = String(item.simplified || '').trim();
  if (!simplified) {
    return null;
  }

  const existing = await client.query(
    `
      SELECT id
      FROM words
      WHERE simplified = $1 AND is_active = true
      ORDER BY hsk_level, id
      LIMIT 1
    `,
    [simplified]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const pinyin = String(item.pinyin || simplified).trim();
  const english = String(item.english || 'Lesson vocabulary').trim();
  const pinyinPlain = toPlainPinyin(pinyin);
  const id = makeWordId({ simplified, pinyin, english });
  const category = lesson.metadata?.topic || 'lesson';
  const searchText = [simplified, pinyin, pinyinPlain, english, category].filter(Boolean).join(' ');

  await client.query(
    `
      INSERT INTO words (
        id, simplified, traditional, pinyin, pinyin_plain, tones, english,
        part_of_speech, hsk_level, cefr_level, category, search_text
      )
      VALUES ($1, $2, $2, $3, $4, '{}', $5, 'phrase', $6, $7, $8, $9)
      ON CONFLICT (id)
      DO UPDATE SET
        simplified = EXCLUDED.simplified,
        traditional = EXCLUDED.traditional,
        pinyin = EXCLUDED.pinyin,
        pinyin_plain = EXCLUDED.pinyin_plain,
        english = EXCLUDED.english,
        hsk_level = EXCLUDED.hsk_level,
        cefr_level = EXCLUDED.cefr_level,
        category = EXCLUDED.category,
        search_text = EXCLUDED.search_text,
        is_active = true,
        updated_at = now()
    `,
    [
      id,
      simplified,
      pinyin,
      pinyinPlain,
      english,
      Number(lesson.metadata?.hsk_level || 1),
      lesson.metadata?.cefr_level || CEFR_BY_HSK.get(Number(lesson.metadata?.hsk_level || 1)) || 'A1',
      category,
      searchText
    ]
  );

  return id;
};

const importLesson = async (client, lesson, orderFallback, releaseId) => {
  lesson = localizeLesson(lesson);
  const metadata = lesson.metadata || {};
  const hskLevel = Number(metadata.hsk_level || 1);
  const legacyDialogue = normalizeLegacyDialogue(lesson);
  const exercises = (lesson.practice?.exercises || []).map((exercise, index) =>
    normalizeExercise(lesson, exercise, index)
  );

  await client.query(
    `
      INSERT INTO lessons (
        id, release_id, title, subtitle, hsk_level, cefr_level, order_num, skill,
        primary_skill, secondary_skills, topic, learning_objectives, warm_up,
        review_summary, tags, estimated_minutes, xp_reward, intro, dialogue,
        title_vi, subtitle_vi, intro_vi, learning_objectives_vi,
        content_version, is_active
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $8, $9::varchar(20)[], $10, $11::jsonb, $12::jsonb,
        $13::jsonb, $14::text[], $15, $16, $17, $18::jsonb,
        $19, $20, $21, $22::jsonb,
        1, true
      )
      ON CONFLICT (id)
      DO UPDATE SET
        release_id = EXCLUDED.release_id,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        hsk_level = EXCLUDED.hsk_level,
        cefr_level = EXCLUDED.cefr_level,
        order_num = EXCLUDED.order_num,
        skill = EXCLUDED.skill,
        primary_skill = EXCLUDED.primary_skill,
        secondary_skills = EXCLUDED.secondary_skills,
        topic = EXCLUDED.topic,
        learning_objectives = EXCLUDED.learning_objectives,
        warm_up = EXCLUDED.warm_up,
        review_summary = EXCLUDED.review_summary,
        tags = EXCLUDED.tags,
        estimated_minutes = EXCLUDED.estimated_minutes,
        xp_reward = EXCLUDED.xp_reward,
        intro = EXCLUDED.intro,
        dialogue = EXCLUDED.dialogue,
        title_vi = EXCLUDED.title_vi,
        subtitle_vi = EXCLUDED.subtitle_vi,
        intro_vi = EXCLUDED.intro_vi,
        learning_objectives_vi = EXCLUDED.learning_objectives_vi,
        content_version = lessons.content_version + 1,
        is_active = true,
        updated_at = now()
    `,
    [
      lesson.lesson_id,
      releaseId,
      titleForLesson(lesson),
      subtitleForLesson(lesson),
      hskLevel,
      metadata.cefr_level || CEFR_BY_HSK.get(hskLevel) || 'A1',
      extractOrder(lesson.lesson_id, orderFallback),
      metadata.primary_skill || 'mixed',
      metadata.secondary_skills || [],
      metadata.topic || null,
      toJsonArray(lesson.learning_objectives),
      toJson(lesson.warm_up),
      toJson(lesson.review || {}),
      metadata.tags || [],
      Number(metadata.estimated_minutes || 8),
      Number(metadata.xp_reward || 20),
      introForLesson(lesson),
      toJson(legacyDialogue),
      titleViForLesson(lesson),
      subtitleViForLesson(lesson),
      introViForLesson(lesson),
      toJsonArray(lesson.learning_objectives_vi)
    ]
  );

  await client.query('DELETE FROM lesson_words WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const [index, item] of (lesson.vocabulary_focus || []).entries()) {
    const wordId = await ensureWord(client, item, lesson);
    if (!wordId) {
      continue;
    }

    await client.query(
      `
        INSERT INTO lesson_words (lesson_id, word_id, order_num)
        VALUES ($1, $2, $3)
        ON CONFLICT (lesson_id, word_id)
        DO UPDATE SET order_num = EXCLUDED.order_num
      `,
      [lesson.lesson_id, wordId, index + 1]
    );
  }

  await client.query('DELETE FROM grammar_points WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const [index, grammar] of (lesson.grammar_focus || []).entries()) {
    await client.query(
      `
        INSERT INTO grammar_points (
          id, lesson_id, pattern, explanation, explanation_vi, tips, tips_vi,
          examples, hsk_level, cefr_level, order_num
        )
        VALUES ($1, $2, $3, $4, $5, $6::text[], $7::text[], $8::jsonb, $9, $10, $11)
        ON CONFLICT (id)
        DO UPDATE SET
          pattern = EXCLUDED.pattern,
          explanation = EXCLUDED.explanation,
          explanation_vi = EXCLUDED.explanation_vi,
          tips = EXCLUDED.tips,
          tips_vi = EXCLUDED.tips_vi,
          examples = EXCLUDED.examples,
          hsk_level = EXCLUDED.hsk_level,
          cefr_level = EXCLUDED.cefr_level,
          order_num = EXCLUDED.order_num,
          updated_at = now()
      `,
      [
        `${lesson.lesson_id}-grammar-${index + 1}`,
        lesson.lesson_id,
        grammar.pattern || `Grammar ${index + 1}`,
        grammar.explanation || '',
        grammar.explanation_vi || null,
        grammar.tips || [],
        grammar.tips_vi || [],
        toJsonArray((grammar.examples || []).map(normalizeGrammarExample)),
        Number(grammar.hsk_level || hskLevel),
        grammar.cefr_level || metadata.cefr_level || CEFR_BY_HSK.get(hskLevel) || 'A1',
        index + 1
      ]
    );
  }

  await client.query('DELETE FROM lesson_modules WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const [index, module] of (lesson.core_modules || []).entries()) {
    await client.query(
      `
        INSERT INTO lesson_modules (id, lesson_id, module_type, order_num, phases, is_active)
        VALUES ($1, $2, $3, $4, $5::jsonb, true)
        ON CONFLICT (id)
        DO UPDATE SET
          module_type = EXCLUDED.module_type,
          order_num = EXCLUDED.order_num,
          phases = EXCLUDED.phases,
          is_active = true,
          updated_at = now()
      `,
      [
        `${lesson.lesson_id}-module-${index + 1}`,
        lesson.lesson_id,
        module.module_type || metadata.primary_skill || 'reading',
        index + 1,
        toJsonArray(module.phases)
      ]
    );
  }

  await client.query('DELETE FROM exercises WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const exercise of exercises) {
    await client.query(
      `
        INSERT INTO exercises (
          id, lesson_id, kind, skill, bloom_level, prompt, prompt_hanzi,
          prompt_pinyin, prompt_english, stimulus, options, correct_index,
          correct_text, answer_explanation, ai_grading_enabled,
          acceptable_variants, prompt_vi, options_vi, correct_text_vi,
          answer_explanation_vi, order_num
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10::jsonb, $11::jsonb, $12,
          $13, $14, false,
          $15::jsonb, $16, $17::jsonb, $18,
          $19, $20
        )
        ON CONFLICT (id)
        DO UPDATE SET
          kind = EXCLUDED.kind,
          skill = EXCLUDED.skill,
          bloom_level = EXCLUDED.bloom_level,
          prompt = EXCLUDED.prompt,
          prompt_hanzi = EXCLUDED.prompt_hanzi,
          prompt_pinyin = EXCLUDED.prompt_pinyin,
          prompt_english = EXCLUDED.prompt_english,
          stimulus = EXCLUDED.stimulus,
          options = EXCLUDED.options,
          correct_index = EXCLUDED.correct_index,
          correct_text = EXCLUDED.correct_text,
          answer_explanation = EXCLUDED.answer_explanation,
          acceptable_variants = EXCLUDED.acceptable_variants,
          prompt_vi = EXCLUDED.prompt_vi,
          options_vi = EXCLUDED.options_vi,
          correct_text_vi = EXCLUDED.correct_text_vi,
          answer_explanation_vi = EXCLUDED.answer_explanation_vi,
          order_num = EXCLUDED.order_num,
          updated_at = now()
      `,
      [
        exercise.id,
        exercise.lessonId,
        exercise.kind,
        exercise.skill,
        exercise.bloomLevel,
        exercise.prompt,
        exercise.promptHanzi,
        exercise.promptPinyin,
        exercise.promptEnglish,
        toJson(exercise.stimulus),
        toJsonArray(exercise.options),
        exercise.correctIndex,
        exercise.correctText,
        exercise.answerExplanation,
        toJsonArray(exercise.acceptableVariants),
        exercise.promptVi,
        toJsonArray(exercise.optionsVi),
        exercise.correctTextVi,
        exercise.answerExplanationVi,
        exercise.order
      ]
    );
  }

  await client.query('DELETE FROM dialogues WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const dialogue of normalizeDialogueRows(lesson)) {
    await client.query(
      `
        INSERT INTO dialogues (
          id, lesson_id, title_zh, title_en, hsk_level, topic, lines,
          word_count, title_vi, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, true)
        ON CONFLICT (id)
        DO UPDATE SET
          title_zh = EXCLUDED.title_zh,
          title_en = EXCLUDED.title_en,
          hsk_level = EXCLUDED.hsk_level,
          topic = EXCLUDED.topic,
          lines = EXCLUDED.lines,
          word_count = EXCLUDED.word_count,
          title_vi = EXCLUDED.title_vi,
          is_active = true,
          updated_at = now()
      `,
      [
        dialogue.id,
        dialogue.lessonId,
        dialogue.titleZh,
        dialogue.titleEn,
        dialogue.hskLevel,
        dialogue.topic,
        toJsonArray(dialogue.lines),
        dialogue.wordCount,
        dialogue.titleVi
      ]
    );
  }

  await client.query('DELETE FROM reading_passages WHERE lesson_id = $1', [lesson.lesson_id]);
  for (const passage of normalizePassageRows(lesson)) {
    await client.query(
      `
        INSERT INTO reading_passages (
          id, lesson_id, title_zh, title_en, hsk_level, topic,
          content_zh, content_pinyin, content_en, word_count,
          new_word_ids, grammar_point_ids, questions, title_vi, content_vi, is_active
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11::jsonb, $12::jsonb, $13::jsonb, $14, $15, true
        )
        ON CONFLICT (id)
        DO UPDATE SET
          title_zh = EXCLUDED.title_zh,
          title_en = EXCLUDED.title_en,
          hsk_level = EXCLUDED.hsk_level,
          topic = EXCLUDED.topic,
          content_zh = EXCLUDED.content_zh,
          content_pinyin = EXCLUDED.content_pinyin,
          content_en = EXCLUDED.content_en,
          word_count = EXCLUDED.word_count,
          new_word_ids = EXCLUDED.new_word_ids,
          grammar_point_ids = EXCLUDED.grammar_point_ids,
          questions = EXCLUDED.questions,
          title_vi = EXCLUDED.title_vi,
          content_vi = EXCLUDED.content_vi,
          is_active = true,
          updated_at = now()
      `,
      [
        passage.id,
        passage.lessonId,
        passage.titleZh,
        passage.titleEn,
        passage.hskLevel,
        passage.topic,
        passage.contentZh,
        passage.contentPinyin,
        passage.contentEn,
        passage.wordCount,
        toJsonArray(passage.newWordIds),
        toJsonArray(passage.grammarPointIds),
        toJsonArray(passage.questions),
        passage.titleVi,
        passage.contentVi
      ]
    );
  }

  return {
    exercises: exercises.length,
    modules: lesson.core_modules?.length || 0,
    words: lesson.vocabulary_focus?.length || 0,
    grammar: lesson.grammar_focus?.length || 0
  };
};

const run = async () => {
  const { inputDir, lessons } = await loadLessons();

  if (DRY_RUN) {
    console.log(JSON.stringify({
      inputDir,
      lessons: lessons.length,
      lessonIds: lessons.map(({ lesson }) => lesson.lesson_id),
      dryRun: true
    }, null, 2));
    return;
  }

  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();
  const summary = {
    inputDir,
    importedLessons: 0,
    importedWords: 0,
    importedGrammar: 0,
    importedModules: 0,
    importedExercises: 0
  };

  try {
    await client.query('BEGIN');
    const releaseId = await getActiveReleaseId(client);

    for (const [{ lesson }, index] of lessons.map((entry, entryIndex) => [entry, entryIndex + 1])) {
      const result = await importLesson(client, lesson, index, releaseId);
      summary.importedLessons += 1;
      summary.importedWords += result.words;
      summary.importedGrammar += result.grammar;
      summary.importedModules += result.modules;
      summary.importedExercises += result.exercises;
    }

    await client.query('COMMIT');
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closeDB();
  }
};

await run();
