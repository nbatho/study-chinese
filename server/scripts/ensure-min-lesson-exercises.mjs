import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveExistingPath } from '../src/config/content-paths.js';

const MIN_EXERCISES = 5;
const DEFAULT_DIRS = ['data/lessons/generated', 'data/lessons/normalized'];
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

const unique = (items) => [...new Set(items.filter((item) => item !== null && item !== undefined && String(item).trim() !== ''))];

const pick = (items, index, fallback = '') => items[index % Math.max(items.length, 1)] || fallback;

const lessonTitleZh = (lesson) => lesson.metadata?.title_zh || lesson.metadata?.title_en || lesson.lesson_id;
const lessonTitleVi = (lesson) => lesson.metadata?.title_vi || lesson.metadata?.title_en || lesson.lesson_id;

const topicVi = (lesson) => {
  const value = String(lesson.metadata?.title_vi || lesson.metadata?.topic || 'bài học').split(' - ')[0];
  return value || 'bài học';
};

const sourceTextForLesson = (lesson) => {
  for (const module of lesson.core_modules || []) {
    for (const phase of module.phases || []) {
      if (phase.content_zh) {
        return {
          type: 'reading',
          text: phase.content_zh,
          pinyin: phase.content_pinyin || '',
          english: phase.content_en || '',
          vi: phase.content_vi || ''
        };
      }

      if (phase.model_dialogue_zh) {
        return {
          type: 'reading',
          text: phase.model_dialogue_zh,
          pinyin: phase.model_dialogue_pinyin || '',
          english: phase.model_dialogue_en || '',
          vi: phase.model_dialogue_vi || ''
        };
      }

      if (Array.isArray(phase.dialogue) && phase.dialogue.length > 0) {
        const text = phase.dialogue.map((line) => line.zh || line.simplified || '').filter(Boolean).join('');
        return {
          type: 'dialogue',
          text,
          pinyin: '',
          english: phase.dialogue.map((line) => line.en || line.english || '').filter(Boolean).join(' '),
          vi: phase.dialogue.map((line) => line.vi || '').filter(Boolean).join(' '),
          lines: phase.dialogue.map((line) => ({
            speaker: line.speaker || '',
            simplified: line.zh || line.simplified || '',
            pinyin: line.pinyin || '',
            english: line.en || line.english || ''
          }))
        };
      }
    }
  }

  return {
    type: 'reading',
    text: lessonTitleZh(lesson),
    pinyin: '',
    english: lesson.metadata?.title_en || '',
    vi: lesson.metadata?.title_vi || ''
  };
};

const optionSet = (correct, distractors, fallbackDistractors) => {
  const values = unique([correct, ...distractors, ...fallbackDistractors]).slice(0, 4);
  while (values.length < 3) {
    values.push(`选项${values.length + 1}`);
  }
  return values;
};

const optionSetVi = (correct, distractors, fallbackDistractors) => {
  const values = unique([correct, ...distractors, ...fallbackDistractors]).slice(0, 4);
  while (values.length < 3) {
    values.push(`Lựa chọn ${values.length + 1}`);
  }
  return values;
};

const promptEnglish = (prompt) => {
  const value = String(prompt || '').trim();
  const quoted = value.match(/^“(.+)”的拼音是什么？$/u);
  if (quoted) return `What is the pinyin of "${quoted[1]}"?`;

  const meaning = value.match(/^“(.+)”是什么意思？$/u);
  if (meaning) return `What does "${meaning[1]}" mean?`;

  const choose = value.match(/^选“(.+)”。$/u);
  if (choose) return `Choose "${choose[1]}".`;

  const grammar = value.match(/^哪个句子使用了“(.+)”？$/u);
  if (grammar) return `Which sentence uses "${grammar[1]}"?`;

  const fillBlank = value.match(/^补全句子：(.+)和___有关。$/u);
  if (fillBlank) return `Complete the sentence: ${fillBlank[1]} is related to ___.`;

  const practice = value.match(/^学习“(.+)”时，最合适的练习是什么？$/u);
  if (practice) return `When studying "${practice[1]}", what is the most suitable practice?`;

  const topic = value.match(/^本课会练习“(.+)”。$/u);
  if (topic) return `This lesson practices "${topic[1]}".`;

  if (value === '这段内容提到什么？') return 'What does this passage mention?';
  if (value === '听力内容提到什么？') return 'What does the listening mention?';
  if (value === '这段内容主要说明什么？') return 'What is the main idea of this passage?';
  if (value.startsWith('这课的主题是')) return 'Is this the topic of the lesson?';

  return value;
};

const firstSentence = (text) => {
  const cleaned = String(text || '').trim();
  if (!cleaned) return '';
  const match = cleaned.match(/^.+?[。！？.!?]/u);
  return match ? match[0] : cleaned;
};

const makeExercise = (lesson, order, data) => ({
  id: `${lesson.lesson_id}-ex${order}`,
  skill: lesson.metadata?.primary_skill || 'mixed',
  ...data
});

const buildCandidates = (lesson) => {
  const vocab = lesson.vocabulary_focus || [];
  const grammar = lesson.grammar_focus || [];
  const source = sourceTextForLesson(lesson);
  const skill = lesson.metadata?.primary_skill || 'reading';
  const words = vocab.map((item) => item.simplified).filter(Boolean);
  const pinyins = vocab.map((item) => item.pinyin).filter(Boolean);
  const meanings = vocab.map((item) => item.english).filter(Boolean);
  const titleZh = lessonTitleZh(lesson);
  const titleVi = lessonTitleVi(lesson);
  const primaryWord = pick(vocab, 0, { simplified: titleZh, pinyin: '', english: lesson.metadata?.title_en || titleZh });
  const secondWord = pick(vocab, 1, primaryWord);
  const thirdWord = pick(vocab, 2, secondWord);
  const grammarPoint = pick(grammar, 0, null);
  const grammarExample = grammarPoint?.examples?.[0];
  const sourceSentence = firstSentence(source.text) || titleZh;
  const sourceVi = firstSentence(source.vi) || titleVi;
  const unrelatedZh = ['只介绍一个数字。', '只列出三个生词。', '说明相反的意思。', '谈论一个不相关的话题。'];
  const unrelatedVi = ['Chỉ giới thiệu một con số.', 'Chỉ liệt kê ba từ mới.', 'Diễn đạt ý ngược lại.', 'Nói về một chủ đề không liên quan.'];
  const stimulus = {
    type: source.type,
    title: titleZh,
    text: source.text,
    pinyin: source.pinyin,
    english: source.english,
    audioText: skill === 'listening' ? source.text : undefined,
    lines: source.lines
  };

  return [
    makeExercise(lesson, 2, {
      kind: 'multiple_choice',
      bloom_level: 'remember',
      prompt: `“${secondWord.simplified}”的拼音是什么？`,
      prompt_english: promptEnglish(`“${secondWord.simplified}”的拼音是什么？`),
      prompt_vi: `Pinyin của “${secondWord.simplified}” là gì?`,
      options: optionSet(secondWord.pinyin, pinyins.filter((item) => item !== secondWord.pinyin), ['xué', 'hǎo', 'dà']),
      options_vi: optionSet(secondWord.pinyin, pinyins.filter((item) => item !== secondWord.pinyin), ['xué', 'hǎo', 'dà']),
      correct_answer: secondWord.pinyin,
      correct_answer_vi: secondWord.pinyin,
      acceptable_variants: [secondWord.pinyin],
      explanation: `“${secondWord.simplified}”读作 ${secondWord.pinyin}。`,
      explanation_vi: `“${secondWord.simplified}” đọc là ${secondWord.pinyin}.`
    }),
    makeExercise(lesson, 3, {
      kind: 'multiple_choice',
      bloom_level: 'remember',
      prompt: `“${thirdWord.simplified}”是什么意思？`,
      prompt_english: promptEnglish(`“${thirdWord.simplified}”是什么意思？`),
      prompt_vi: `“${thirdWord.simplified}” nghĩa là gì?`,
      options: optionSet(thirdWord.english, meanings.filter((item) => item !== thirdWord.english), ['student', 'home', 'friend']),
      options_vi: optionSetVi(thirdWord.english, meanings.filter((item) => item !== thirdWord.english), ['học sinh', 'nhà', 'bạn bè']),
      correct_answer: thirdWord.english,
      correct_answer_vi: thirdWord.english,
      acceptable_variants: [thirdWord.english],
      explanation: `“${thirdWord.simplified}”的意思是 ${thirdWord.english}。`,
      explanation_vi: `“${thirdWord.simplified}” có nghĩa là ${thirdWord.english}.`
    }),
    makeExercise(lesson, 4, grammarPoint && grammarExample ? {
      kind: 'multiple_choice',
      bloom_level: 'apply',
      prompt: `哪个句子使用了“${grammarPoint.pattern}”？`,
      prompt_english: promptEnglish(`哪个句子使用了“${grammarPoint.pattern}”？`),
      prompt_vi: `Câu nào dùng mẫu “${grammarPoint.pattern}”?`,
      options: optionSet(grammarExample.zh || grammarExample.simplified, ['今天天气很好。', '这是三个词语。', '请再说一遍。'], []),
      options_vi: optionSetVi(grammarExample.vi || grammarExample.en || grammarExample.english, ['Hôm nay thời tiết rất đẹp.', 'Đây là ba từ mới.', 'Vui lòng nói lại một lần.'], []),
      correct_answer: grammarExample.zh || grammarExample.simplified,
      correct_answer_vi: grammarExample.vi || grammarExample.en || grammarExample.english,
      acceptable_variants: [grammarExample.zh || grammarExample.simplified],
      explanation: `这个句子体现了“${grammarPoint.pattern}”。`,
      explanation_vi: `Câu này thể hiện mẫu “${grammarPoint.pattern}”.`
    } : {
      kind: 'true_false',
      bloom_level: 'understand',
      prompt: `这课的主题是“${titleZh}”。`,
      prompt_english: promptEnglish(`这课的主题是“${titleZh}”。`),
      prompt_vi: `Chủ đề bài này là “${titleVi}”.`,
      options: ['对', '错'],
      options_vi: ['Đúng', 'Sai'],
      correct_answer: '对',
      correct_answer_vi: 'Đúng',
      acceptable_variants: ['对'],
      explanation: `本课围绕“${titleZh}”练习。`,
      explanation_vi: `Bài này luyện quanh chủ đề “${titleVi}”.`
    }),
    makeExercise(lesson, 5, {
      kind: skill === 'listening' ? 'listening_comprehension' : 'reading_comprehension',
      bloom_level: 'understand',
      prompt: skill === 'listening' ? '听力内容提到什么？' : '这段内容提到什么？',
      prompt_english: promptEnglish(skill === 'listening' ? '听力内容提到什么？' : '这段内容提到什么？'),
      prompt_vi: skill === 'listening' ? 'Nội dung nghe nhắc đến điều gì?' : 'Đoạn này nhắc đến điều gì?',
      stimulus,
      options: optionSet(sourceSentence, unrelatedZh, []),
      options_vi: optionSetVi(sourceVi, unrelatedVi, []),
      correct_answer: sourceSentence,
      correct_answer_vi: sourceVi,
      acceptable_variants: [sourceSentence],
      explanation: `原文中有“${sourceSentence}”。`,
      explanation_vi: `Trong nội dung có ý: “${sourceVi}”.`
    }),
    makeExercise(lesson, 6, {
      kind: 'true_false',
      bloom_level: 'understand',
      prompt: `本课会练习“${primaryWord.simplified}”。`,
      prompt_english: promptEnglish(`本课会练习“${primaryWord.simplified}”。`),
      prompt_vi: `Bài này có luyện từ “${primaryWord.simplified}”.`,
      options: ['对', '错'],
      options_vi: ['Đúng', 'Sai'],
      correct_answer: '对',
      correct_answer_vi: 'Đúng',
      acceptable_variants: ['对'],
      explanation: `“${primaryWord.simplified}”在本课词汇中。`,
      explanation_vi: `“${primaryWord.simplified}” nằm trong từ vựng của bài.`
    }),
    makeExercise(lesson, 7, {
      kind: 'multiple_choice',
      bloom_level: 'apply',
      prompt: `学习“${titleZh}”时，最合适的练习是什么？`,
      prompt_english: promptEnglish(`学习“${titleZh}”时，最合适的练习是什么？`),
      prompt_vi: `Khi học “${titleVi}”, bài luyện nào phù hợp nhất?`,
      options: optionSet(`围绕${topicVi(lesson)}完成${skill}练习。`, ['只看图片，不读句子。', '完全跳过新词。', '只记一个数字。'], []),
      options_vi: optionSetVi(`Hoàn thành bài luyện ${skill} về ${topicVi(lesson)}.`, ['Chỉ xem hình, không đọc câu.', 'Bỏ qua hoàn toàn từ mới.', 'Chỉ nhớ một con số.'], []),
      correct_answer: `围绕${topicVi(lesson)}完成${skill}练习。`,
      correct_answer_vi: `Hoàn thành bài luyện ${skill} về ${topicVi(lesson)}.`,
      acceptable_variants: [`围绕${topicVi(lesson)}完成${skill}练习。`],
      explanation: '练习应当和本课主题与技能一致。',
      explanation_vi: 'Bài luyện nên bám vào chủ đề và kỹ năng chính của bài.'
    })
  ];
};

const ensureLessonExercises = (lesson) => {
  lesson.practice = lesson.practice || {};
  lesson.practice.exercises = Array.isArray(lesson.practice.exercises) ? lesson.practice.exercises : [];
  let changed = false;

  for (const exercise of lesson.practice.exercises) {
    if (!exercise.prompt_english && !exercise.promptEnglish) {
      exercise.prompt_english = promptEnglish(exercise.prompt);
      changed = true;
    }
  }

  if (lesson.practice.exercises.length >= MIN_EXERCISES) {
    return changed;
  }

  const existingIds = new Set(lesson.practice.exercises.map((exercise) => exercise.id));
  const candidates = buildCandidates(lesson);

  for (const candidate of candidates) {
    if (lesson.practice.exercises.length >= MIN_EXERCISES) {
      break;
    }

    if (existingIds.has(candidate.id)) {
      continue;
    }

    const nextOrder = lesson.practice.exercises.length + 1;
    lesson.practice.exercises.push({
      ...candidate,
      id: `${lesson.lesson_id}-ex${nextOrder}`
    });
    existingIds.add(`${lesson.lesson_id}-ex${nextOrder}`);
    changed = true;
  }

  return changed;
};

const updateDir = async (dirArg) => {
  const inputDir = await resolveExistingPath(dirArg);
  const files = (await readdir(inputDir)).filter(isLessonJson).sort();
  const summary = {
    inputDir,
    files: files.length,
    updated: 0,
    minExercises: Infinity,
    maxExercises: 0
  };

  for (const file of files) {
    const lessonPath = path.join(inputDir, file);
    const lesson = JSON.parse(await readFile(lessonPath, 'utf8'));
    const changed = ensureLessonExercises(lesson);
    const count = lesson.practice?.exercises?.length || 0;
    summary.minExercises = Math.min(summary.minExercises, count);
    summary.maxExercises = Math.max(summary.maxExercises, count);

    if (changed) {
      await writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
      summary.updated += 1;
    }
  }

  if (summary.files === 0) {
    summary.minExercises = 0;
  }

  return summary;
};

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_DIRS;
const summaries = [];

for (const dir of dirs) {
  summaries.push(await updateDir(dir));
}

console.log(JSON.stringify({ minRequired: MIN_EXERCISES, summaries }, null, 2));
