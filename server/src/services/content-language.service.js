const MOJIBAKE_MARKERS = [
  'Ã',
  'Â',
  'Ä',
  'Å',
  'ä',
  'å',
  'æ',
  'ç',
  'ÇŽ',
  'Ç’',
  'â€',
  'â€™',
  'â€œ',
  'â€¦',
  'â€”',
  'â€“',
  'â”',
  'á»',
  'áº',
  'ðŸ'
];

const CP1252_REVERSE = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f]
]);

const CJK_PATTERN = /[\u3400-\u9fff]/;
const VIETNAMESE_MARK_PATTERN = /[ăâđêôơưĂÂĐÊÔƠƯáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
const ENGLISH_WORD_PATTERN = /\b(the|and|use|what|how|hello|name|lesson|practice|answer|correct|question)\b/i;
const LEARNER_ENGLISH_PATTERN = /\b(answer|arrange|choose|complete|does|explain|listen|match|mean|means|option|order|put|question|read|select|sentence|what|which|words?)\b/i;
const LEARNER_FACING_PATHS = [
  /^\$\.learning_objectives\[\d+\]$/,
  /^\$\.grammar_focus\[\d+\]\.explanation$/,
  /^\$\.grammar_focus\[\d+\]\.tips\[\d+\]$/,
  /^\$\.practice\.exercises\[\d+\]\.prompt$/,
  /^\$\.practice\.exercises\[\d+\]\.options\[\d+\]$/,
  /^\$\.practice\.exercises\[\d+\]\.correct_answer(?:\.|$)/,
  /^\$\.practice\.exercises\[\d+\]\.explanation$/,
  /^\$\.review\.key_takeaways\[\d+\]$/
];

const VI_PHRASES = new Map([
  ['Hello!', 'Xin chào!'],
  ['Hello', 'Xin chào'],
  ['Recognize simple greetings.', 'Nhận biết các câu chào hỏi đơn giản.'],
  ['Answer with your name.', 'Trả lời bằng tên của bạn.'],
  ['Use this pattern to say your name.', 'Dùng mẫu câu này để nói tên của bạn.'],
  ['My name is Xiao Ming.', 'Tên tôi là Tiểu Minh.'],
  ['What is your name?', 'Bạn tên là gì?'],
  ['What does 你好 mean?', '你好 có nghĩa là gì?'],
  ['hello', 'xin chào'],
  ['thank you', 'cảm ơn'],
  ['goodbye', 'tạm biệt']
]);

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

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const scoreLanguageText = (value) => {
  const text = String(value || '');

  return {
    hasChinese: CJK_PATTERN.test(text) || /^[\d\s:.,?!\-+/*%()#@$[\]{}]+$/.test(text),
    hasVietnamese: VIETNAMESE_MARK_PATTERN.test(text),
    hasEnglish: ENGLISH_WORD_PATTERN.test(text)
  };
};

const isLearnerFacingPath = (path) =>
  LEARNER_FACING_PATHS.some((pattern) => pattern.test(path));

export const hasMojibake = (value) => {
  const text = String(value || '');

  return MOJIBAKE_MARKERS.some((marker) => text.includes(marker));
};

const encodeWindows1252 = (value) => {
  const bytes = [];

  for (const char of String(value)) {
    const code = char.codePointAt(0);
    const mapped = CP1252_REVERSE.get(code);

    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }

    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    return null;
  }

  return Buffer.from(bytes);
};

export const repairMojibakeString = (value) => {
  if (typeof value !== 'string' || !hasMojibake(value)) {
    return value;
  }

  const encoded = encodeWindows1252(value);

  if (!encoded) {
    return value;
  }

  const repaired = encoded.toString('utf8');

  if (repaired.includes('\uFFFD') || repaired === value || hasMojibake(repaired)) {
    return value;
  }

  return repaired;
};

export const deepRepairMojibake = (value) => {
  if (typeof value === 'string') {
    return repairMojibakeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepRepairMojibake(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, deepRepairMojibake(item)])
    );
  }

  return value;
};

const localizedFallback = (value) => {
  const source = String(value || '').trim();

  if (!source) {
    return '';
  }

  return VI_PHRASES.get(source) || source;
};

const uniqueStrings = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.trim()))];

export const normalizeGrammarExample = (example) => {
  if (!isPlainObject(example)) {
    return example;
  }

  const simplified = example.simplified || example.zh || '';
  const english = example.english || example.en || '';
  const vi = example.vi || localizedFallback(english);

  return {
    ...example,
    simplified,
    zh: example.zh || simplified,
    pinyin: example.pinyin || '',
    english,
    en: example.en || english,
    vi
  };
};

export const localizeLesson = (lesson) => {
  const repaired = deepRepairMojibake(lesson);
  const metadata = repaired.metadata || {};
  const hskLevel = Number(metadata.hsk_level || 1);
  const cefrLevel = metadata.cefr_level || CEFR_BY_HSK.get(hskLevel) || 'A1';

  return {
    ...repaired,
    metadata: {
      ...metadata,
      cefr_level: cefrLevel,
      title_vi: metadata.title_vi || localizedFallback(metadata.title_en || metadata.title_zh)
    },
    learning_objectives_vi:
      repaired.learning_objectives_vi ||
      (Array.isArray(repaired.learning_objectives)
        ? repaired.learning_objectives.map(localizedFallback)
        : []),
    grammar_focus: (repaired.grammar_focus || []).map((item) => ({
      ...item,
      hsk_level: Number(item.hsk_level || hskLevel),
      cefr_level: item.cefr_level || cefrLevel,
      explanation_vi: item.explanation_vi || localizedFallback(item.explanation),
      tips_vi: item.tips_vi || (Array.isArray(item.tips) ? item.tips.map(localizedFallback) : []),
      examples: (item.examples || []).map(normalizeGrammarExample)
    })),
    core_modules: (repaired.core_modules || []).map((module) => ({
      ...module,
      phases: (module.phases || []).map((phase) => ({
        ...phase,
        content_vi: phase.content_vi || localizedFallback(phase.content_en || phase.model_dialogue_en),
        model_dialogue_vi: phase.model_dialogue_vi || localizedFallback(phase.model_dialogue_en),
        dialogue: Array.isArray(phase.dialogue)
          ? phase.dialogue.map((line) => ({
              ...line,
              vi: line.vi || localizedFallback(line.en || line.english)
            }))
          : phase.dialogue
      }))
    })),
    practice: {
      ...(repaired.practice || {}),
      exercises: (repaired.practice?.exercises || []).map((exercise) => ({
        ...exercise,
        prompt_vi: exercise.prompt_vi || localizedFallback(exercise.prompt),
        options_vi: exercise.options_vi || (Array.isArray(exercise.options) ? exercise.options.map(localizedFallback) : []),
        correct_answer_vi: exercise.correct_answer_vi || localizedFallback(exercise.correct_answer ?? exercise.correctText),
        explanation_vi: exercise.explanation_vi || localizedFallback(exercise.explanation || exercise.answer_explanation)
      }))
    },
    review: {
      ...(repaired.review || {}),
      key_takeaways_vi:
        repaired.review?.key_takeaways_vi ||
        (Array.isArray(repaired.review?.key_takeaways)
          ? repaired.review.key_takeaways.map(localizedFallback)
          : [])
    }
  };
};

export const collectStrings = (value, output = [], path = '$') => {
  if (typeof value === 'string') {
    output.push({ path, value });
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, output, `${path}[${index}]`));
    return output;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, output, `${path}.${key}`));
  }

  return output;
};

export const auditLessonLanguage = (lesson) => {
  const issues = [];
  const targetLevel = Number(lesson?.metadata?.hsk_level || 1);

  for (const item of collectStrings(lesson)) {
    if (hasMojibake(item.value)) {
      issues.push({
        severity: 'error',
        code: 'mojibake_detected',
        message: 'Text appears to be incorrectly decoded.',
        path: item.path,
        sample: item.value.slice(0, 120)
      });
    }

    if (isLearnerFacingPath(item.path)) {
      const score = scoreLanguageText(item.value);

      if (!score.hasChinese) {
        issues.push({
          severity: 'error',
          code: 'learner_facing_not_chinese',
          message: 'Learner-facing lesson text must be Chinese-first.',
          path: item.path,
          sample: item.value.slice(0, 120)
        });
      }

      if (LEARNER_ENGLISH_PATTERN.test(item.value)) {
        issues.push({
          severity: 'error',
          code: 'learner_facing_english',
          message: 'Learner-facing lesson text contains English instruction words.',
          path: item.path,
          sample: item.value.slice(0, 120)
        });
      }
    }
  }

  if (!lesson?.metadata?.title_en) {
    issues.push({ severity: 'error', code: 'missing_english', message: 'metadata.title_en is required.' });
  }

  if (!lesson?.metadata?.title_vi) {
    issues.push({ severity: 'warning', code: 'missing_vietnamese', message: 'metadata.title_vi is missing.' });
  }

  for (const [index, grammar] of (lesson?.grammar_focus || []).entries()) {
    if (!grammar.explanation) {
      issues.push({ severity: 'error', code: 'missing_english', message: `grammar_focus[${index}].explanation is required.` });
    }

    if (!grammar.explanation_vi) {
      issues.push({ severity: 'warning', code: 'missing_vietnamese', message: `grammar_focus[${index}].explanation_vi is missing.` });
    }

    if (!grammar.hsk_level || !grammar.cefr_level) {
      issues.push({ severity: 'error', code: 'grammar_level_missing', message: `grammar_focus[${index}] must include hsk_level and cefr_level.` });
    } else if (Number(grammar.hsk_level) > targetLevel) {
      issues.push({
        severity: 'error',
        code: 'grammar_above_lesson_level',
        message: `grammar_focus[${index}] exceeds the lesson HSK level.`,
        details: { grammarLevel: Number(grammar.hsk_level), targetLevel }
      });
    }
  }

  for (const [index, exercise] of (lesson?.practice?.exercises || []).entries()) {
    if (!exercise.prompt) {
      issues.push({ severity: 'error', code: 'missing_english', message: `practice.exercises[${index}].prompt is required.` });
    }

    if (!exercise.prompt_vi) {
      issues.push({ severity: 'warning', code: 'missing_vietnamese', message: `practice.exercises[${index}].prompt_vi is missing.` });
    }
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
    errors: issues.filter((issue) => issue.severity === 'error'),
    warnings: issues.filter((issue) => issue.severity === 'warning')
  };
};

export const buildGrammarLibraryEntries = (lessons) => {
  const byPattern = new Map();

  for (const lesson of lessons) {
    const localized = localizeLesson(lesson);
    const lessonId = localized.lesson_id;
    const hskLevel = Number(localized.metadata?.hsk_level || 1);
    const cefrLevel = localized.metadata?.cefr_level || CEFR_BY_HSK.get(hskLevel) || 'A1';

    for (const grammar of localized.grammar_focus || []) {
      const pattern = String(grammar.pattern || '').trim();

      if (!pattern) {
        continue;
      }

      const id = `grammar_${Buffer.from(pattern).toString('hex').slice(0, 40)}`;
      const current = byPattern.get(pattern);
      const entry = current || {
        id,
        title: pattern,
        title_vi: pattern,
        pattern,
        summary: grammar.explanation || '',
        summary_vi: grammar.explanation_vi || localizedFallback(grammar.explanation),
        examples: [],
        hsk_level: Number(grammar.hsk_level || hskLevel),
        cefr_level: grammar.cefr_level || cefrLevel,
        source_lesson_ids: []
      };

      entry.hsk_level = Math.min(entry.hsk_level, Number(grammar.hsk_level || hskLevel));
      entry.cefr_level = entry.cefr_level || grammar.cefr_level || cefrLevel;
      entry.examples = [...entry.examples, ...(grammar.examples || []).map(normalizeGrammarExample)];
      entry.source_lesson_ids = uniqueStrings([...entry.source_lesson_ids, lessonId]);
      byPattern.set(pattern, entry);
    }
  }

  return [...byPattern.values()].map((entry) => ({
    ...entry,
    search_text: uniqueStrings([
      entry.pattern,
      entry.summary,
      entry.summary_vi,
      ...entry.examples.flatMap((example) => [example.simplified, example.pinyin, example.english, example.vi])
    ]).join(' ')
  }));
};

export const chooseLocalizedText = (englishValue, vietnameseValue, locale = 'en') => {
  if (locale === 'vi' && vietnameseValue) {
    return vietnameseValue;
  }

  return englishValue;
};

export const normalizeLocale = (value) => (value === 'vi' ? 'vi' : 'en');

export const __private__ = {
  scoreLanguageText,
  localizedFallback,
  encodeWindows1252
};
