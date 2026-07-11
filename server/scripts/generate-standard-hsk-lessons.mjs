import { rm, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, resolveContentPath } from '../src/config/content-paths.js';
import { writeLessonEntry } from './lesson-data-files.mjs';
import { convertPinyinDeep } from './pinyin-utils.mjs';
import HSK1_LESSONS from './standard-content/hsk1.mjs';
import HSK2_LESSONS from './standard-content/hsk2.mjs';
import { HSK3, HIGH, HIGH_WARMUP, TITLES_VI, FOCUS_GLOSS } from './standard-content/high.mjs';

const CEFR_BY_HSK = {
  1: 'A1',
  2: 'A2',
  3: 'B1',
  4: 'B2',
  5: 'C1',
  6: 'C2'
};

const CAN_DO = {
  A1: 'Dùng các cụm từ rất đơn giản để giới thiệu, hỏi và đáp về thông tin quen thuộc.',
  A2: 'Trao đổi trực tiếp về nhu cầu, lịch trình và thói quen quen thuộc.',
  B1: 'Hiểu và xử lý hội thoại rõ ràng về học tập, công việc, du lịch và đời sống.',
  B2: 'Trình bày, phân tích quan điểm trong văn bản rõ ràng về chủ đề cụ thể hoặc trừu tượng.',
  C1: 'Hiểu văn bản dài, nhận ra hàm ý, sắc thái và lập luận phức tạp.',
  C2: 'Tổng hợp và đánh giá ngôn ngữ giàu sắc thái, thành ngữ và chiều sâu văn hóa.'
};

// slug, title_zh, title_en, focus hanzi, focus pinyin. Slugs/titles must stay
// stable: lesson ids and SRS word ids are derived from them.
const TOPICS = {
  1: [
    ['greetings', '问候', 'Greetings', '你好', 'ni3 hao3'],
    ['name', '名字', 'Names', '名字', 'ming2 zi5'],
    ['family', '家人', 'Family', '妈妈', 'ma1 ma5'],
    ['numbers', '数字', 'Numbers', '三', 'san1'],
    ['date', '日期', 'Dates', '今天', 'jin1 tian1'],
    ['time', '时间', 'Time', '上午', 'shang4 wu3'],
    ['food', '吃饭', 'Food', '米饭', 'mi3 fan4'],
    ['drink', '喝水', 'Drinks', '水', 'shui3'],
    ['school', '学校', 'School', '学校', 'xue2 xiao4'],
    ['class', '上课', 'Class', '课', 'ke4'],
    ['book', '看书', 'Books', '书', 'shu1'],
    ['shopping', '买东西', 'Shopping', '买', 'mai3'],
    ['money', '钱', 'Money', '钱', 'qian2'],
    ['weather', '天气', 'Weather', '天气', 'tian1 qi4'],
    ['place', '地点', 'Places', '家', 'jia1'],
    ['doctor', '医生', 'Seeing a Doctor', '医生', 'yi1 sheng1'],
    ['review', '复习', 'Review', '中文', 'Zhong1 wen2']
  ],
  2: [
    ['appointment', '约时间', 'Making an appointment', '时间', 'shi2 jian1'],
    ['transport', '坐车', 'Transport', '公共汽车', 'gong1 gong4 qi4 che1'],
    ['weather-plan', '天气计划', 'Weather plans', '下雨', 'xia4 yu3'],
    ['restaurant', '饭馆点菜', 'Restaurant', '饭馆', 'fan4 guan3'],
    ['shopping-clothes', '买衣服', 'Buying clothes', '衣服', 'yi1 fu5'],
    ['phone', '打电话', 'Phone call', '电话', 'dian4 hua4'],
    ['hotel', '住旅馆', 'Hotel', '房间', 'fang2 jian1'],
    ['health', '身体不舒服', 'Health', '身体', 'shen1 ti3'],
    ['sports', '运动', 'Sports', '运动', 'yun4 dong4'],
    ['birthday', '生日', 'Birthday', '生日', 'sheng1 ri4'],
    ['workday', '工作日', 'Workday', '工作', 'gong1 zuo4'],
    ['weekend', '周末', 'Weekend', '周末', 'zhou1 mo4'],
    ['city', '城市', 'City', '城市', 'cheng2 shi4'],
    ['home', '在家', 'At home', '家里', 'jia1 li3'],
    ['travel', '旅游', 'Travel', '旅游', 'lv3 you2'],
    ['gift', '礼物', 'Gift', '礼物', 'li3 wu4'],
    ['routine', '日常', 'Routine', '每天', 'mei3 tian1']
  ],
  3: [
    ['study-method', '学习方法', 'Study methods', '方法', 'fang1 fa3'],
    ['travel-experience', '旅行经历', 'Travel experience', '经历', 'jing1 li4'],
    ['job-interview', '面试', 'Job interview', '面试', 'mian4 shi4'],
    ['online-shopping', '网购', 'Online shopping', '网上', 'wang3 shang4'],
    ['neighbors', '邻居', 'Neighbors', '邻居', 'lin2 ju1'],
    ['movie-opinion', '电影看法', 'Movie opinions', '电影', 'dian4 ying3'],
    ['fitness', '健康习惯', 'Healthy habits', '健康', 'jian4 kang1'],
    ['library', '图书馆', 'Library', '图书馆', 'tu2 shu1 guan3'],
    ['schedule-change', '改变计划', 'Changing plans', '改变', 'gai3 bian4'],
    ['work-pressure', '工作压力', 'Work pressure', '压力', 'ya1 li4'],
    ['friendship', '朋友关系', 'Friendship', '关系', 'guan1 xi5'],
    ['lost-item', '丢东西', 'Lost item', '丢', 'diu1'],
    ['bank', '银行办事', 'Banking', '银行', 'yin2 hang2'],
    ['festival', '节日', 'Festival', '节日', 'jie2 ri4'],
    ['news', '新闻', 'News', '新闻', 'xin1 wen2'],
    ['environment', '环境', 'Environment', '环境', 'huan2 jing4'],
    ['review', '综合复习', 'Integrated review', '复习', 'fu4 xi2']
  ],
  4: [
    ['teamwork', '团队合作', 'Teamwork', '团队', 'tuan2 dui4'],
    ['time-management', '时间管理', 'Time management', '效率', 'xiao4 lv4'],
    ['online-learning', '在线学习', 'Online learning', '平台', 'ping2 tai2'],
    ['public-transport', '公共交通', 'Public transport', '交通', 'jiao1 tong1'],
    ['workplace-feedback', '职场反馈', 'Workplace feedback', '反馈', 'fan3 kui4'],
    ['consumer-choice', '消费选择', 'Consumer choice', '消费', 'xiao1 fei4'],
    ['community', '社区服务', 'Community service', '社区', 'she4 qu1'],
    ['culture', '文化差异', 'Cultural differences', '差异', 'cha1 yi4'],
    ['technology', '技术生活', 'Technology in life', '技术', 'ji4 shu4'],
    ['education', '教育公平', 'Education equity', '公平', 'gong1 ping2'],
    ['health-choice', '健康选择', 'Health choices', '选择', 'xuan3 ze2'],
    ['city-space', '城市空间', 'Urban space', '空间', 'kong1 jian1'],
    ['media', '媒体信息', 'Media information', '媒体', 'mei2 ti3'],
    ['career', '职业发展', 'Career development', '职业', 'zhi2 ye4'],
    ['service', '服务质量', 'Service quality', '质量', 'zhi4 liang4'],
    ['risk', '风险意识', 'Risk awareness', '风险', 'feng1 xian3'],
    ['review', '观点复习', 'Viewpoint review', '观点', 'guan1 dian3']
  ],
  5: [
    ['implicit-meaning', '言外之意', 'Implicit meaning', '暗示', 'an4 shi4'],
    ['academic-reading', '学术阅读', 'Academic reading', '论证', 'lun4 zheng4'],
    ['professional-email', '职业邮件', 'Professional email', '语气', 'yu3 qi4'],
    ['social-change', '社会变化', 'Social change', '变化', 'bian4 hua4'],
    ['innovation', '创新', 'Innovation', '创新', 'chuang4 xin1'],
    ['ethics', '伦理选择', 'Ethical choice', '伦理', 'lun2 li3'],
    ['memory', '记忆与学习', 'Memory and learning', '记忆', 'ji4 yi4'],
    ['leadership', '领导力', 'Leadership', '领导', 'ling3 dao3'],
    ['negotiation', '协商', 'Negotiation', '协商', 'xie2 shang1'],
    ['identity', '身份认同', 'Identity', '身份', 'shen1 fen4'],
    ['research', '研究方法', 'Research methods', '研究', 'yan2 jiu1'],
    ['persuasion', '说服策略', 'Persuasion', '说服', 'shuo1 fu2'],
    ['urbanization', '城市化', 'Urbanization', '城市化', 'cheng2 shi4 hua4'],
    ['digital-life', '数字生活', 'Digital life', '隐私', 'yin3 si1'],
    ['public-policy', '公共政策', 'Public policy', '政策', 'zheng4 ce4'],
    ['art-review', '艺术评论', 'Art critique', '审美', 'shen3 mei3'],
    ['review', '高级复习', 'Advanced review', '立场', 'li4 chang3']
  ],
  6: [
    ['classical-allusion', '典故', 'Allusion', '典故', 'dian3 gu4'],
    ['rhetoric', '修辞', 'Rhetoric', '修辞', 'xiu1 ci2'],
    ['public-discourse', '公共话语', 'Public discourse', '话语', 'hua4 yu3'],
    ['philosophy', '哲学思辨', 'Philosophical reflection', '思辨', 'si1 bian4'],
    ['literary-style', '文学风格', 'Literary style', '笔法', 'bi3 fa3'],
    ['historical-memory', '历史记忆', 'Historical memory', '记忆', 'ji4 yi4'],
    ['cross-cultural', '跨文化表达', 'Cross-cultural expression', '语境', 'yu3 jing4'],
    ['argument-synthesis', '论证综合', 'Argument synthesis', '综合', 'zong1 he2'],
    ['policy-critique', '政策评议', 'Policy critique', '评议', 'ping2 yi4'],
    ['metaphor', '隐喻', 'Metaphor', '隐喻', 'yin3 yu4'],
    ['translation', '翻译取舍', 'Translation choices', '取舍', 'qu3 she3'],
    ['innovation-risk', '创新风险', 'Innovation risk', '代价', 'dai4 jia4'],
    ['collective-memory', '集体记忆', 'Collective memory', '集体', 'ji2 ti3'],
    ['media-framing', '媒体框架', 'Media framing', '框架', 'kuang4 jia4'],
    ['aesthetic-judgment', '审美判断', 'Aesthetic judgment', '判断', 'pan4 duan4'],
    ['negotiating-tone', '语气拿捏', 'Tone control', '拿捏', 'na2 nie1'],
    ['review', '精通复习', 'Mastery review', '融会贯通', 'rong2 hui4 guan4 tong1']
  ]
};

const PROMPT_STRINGS = {
  fill_blank: { vi: 'Điền từ đúng vào chỗ trống.', en: 'Fill in the blank with the correct word.' },
  word_order: { vi: 'Sắp xếp các từ thành câu đúng.', en: 'Arrange the words into a correct sentence.' },
  multiple_choice: { vi: 'Chọn đáp án đúng.', en: 'Choose the correct answer.' },
  true_false: { vi: 'Câu sau đúng hay sai theo bài khóa?', en: 'True or false, according to the text?' },
  reading_comprehension: { vi: 'Đọc bài khóa và trả lời câu hỏi.', en: 'Read the text and answer the question.' },
  listening_comprehension: { vi: 'Nghe đoạn audio và trả lời câu hỏi.', en: 'Listen to the audio and answer the question.' }
};

const hanziCount = (value) => [...String(value || '')].filter((char) => /\p{Script=Han}/u.test(char)).length;

const stripPunct = (value) => String(value).replace(/[。？！，、]/g, '');

// Rotate options deterministically so the correct answer is not always first.
const placeOptions = (options, optionsVi, correctIdx, seed) => {
  const target = seed % options.length;
  const rotated = options.slice();
  const rotatedVi = optionsVi.slice();
  const [correct] = rotated.splice(correctIdx, 1);
  const [correctVi] = rotatedVi.splice(correctIdx, 1);
  rotated.splice(target, 0, correct);
  rotatedVi.splice(target, 0, correctVi);
  return { options: rotated, optionsVi: rotatedVi, correct, correctVi };
};

const pickPool = (pool, start, count) => Array.from({ length: count }, (_, k) => pool[(start + k) % pool.length]);

const choiceExercise = ({ kind, bloom, prompt, promptPinyin, options, optionsVi, correctIdx, explanation, explanationVi, stimulus = null, seed = 0 }) => {
  const placed = placeOptions(options, optionsVi, correctIdx, seed);
  return {
    kind,
    skill: 'mixed',
    bloom_level: bloom,
    prompt,
    prompt_pinyin: promptPinyin,
    prompt_vi: PROMPT_STRINGS[kind].vi,
    prompt_english: PROMPT_STRINGS[kind].en,
    options: placed.options,
    options_vi: placed.optionsVi,
    correct_answer: placed.correct,
    correct_answer_vi: placed.correctVi,
    acceptable_variants: [placed.correct],
    explanation,
    explanation_vi: explanationVi,
    stimulus
  };
};

const wordOrderExercise = ({ bloom, tokens, tokensPinyin, tokensVi, correct, correctVi, explanation, explanationVi }) => ({
  kind: 'word_order',
  skill: 'mixed',
  bloom_level: bloom,
  prompt: tokens.join(' / '),
  prompt_pinyin: tokensPinyin,
  prompt_vi: PROMPT_STRINGS.word_order.vi,
  prompt_english: PROMPT_STRINGS.word_order.en,
  options: tokens,
  options_vi: tokensVi,
  correct_answer: correct,
  correct_answer_vi: correctVi,
  acceptable_variants: [correct, stripPunct(correct)],
  explanation,
  explanation_vi: explanationVi,
  stimulus: null
});

const trueFalseExercise = ({ bloom, statement, statementPinyin, answer, explanation, explanationVi }) => ({
  kind: 'true_false',
  skill: 'mixed',
  bloom_level: bloom,
  prompt: statement,
  prompt_pinyin: statementPinyin,
  prompt_vi: PROMPT_STRINGS.true_false.vi,
  prompt_english: PROMPT_STRINGS.true_false.en,
  options: ['对', '错'],
  options_vi: ['Đúng', 'Sai'],
  correct_answer: answer ? '对' : '错',
  correct_answer_vi: answer ? 'Đúng' : 'Sai',
  acceptable_variants: [answer ? '对' : '错'],
  explanation,
  explanation_vi: explanationVi,
  stimulus: null
});

const readingStimulus = ({ hsk, title, text, pinyin, english, vi }) => ({
  type: 'reading',
  title,
  text,
  ...(hsk <= 3 ? { pinyin } : {}),
  english,
  vietnamese: vi
});

const listeningStimulus = ({ hsk, title, lines, english }) => {
  const text = lines.map((line) => line.simplified).join('');
  return {
    type: 'listening',
    title,
    text,
    audioText: text,
    ...(hsk <= 3 ? { pinyin: lines.map((line) => line.pinyin).join('\n') } : {}),
    english: english || lines.map((line) => line.english).filter(Boolean).join(' '),
    lines
  };
};

const finalizeExercises = (lessonId, exercises) =>
  exercises.map((exercise, index) => ({ id: `${lessonId}-ex${index + 1}`, ...exercise }));

const lessonShell = ({ hsk, index, topic, titleEn, titleVi, objectivesVi, warmup, vocab, coreModule, grammar, exercises, summaryVi }) => {
  const cefr = CEFR_BY_HSK[hsk];
  const [slug, titleZh] = topic;
  const lessonId = `hsk${hsk}-l${String(index + 1).padStart(2, '0')}-standard-${slug}`;
  const wordIdBase = `std_hsk${hsk}_${slug.replace(/[^a-z0-9]+/g, '_')}`;

  const vocabulary = vocab.map((item, itemIndex) => ({
    word_id: `${wordIdBase}_${itemIndex + 1}`,
    simplified: item[0],
    pinyin: item[1],
    part_of_speech: item[2],
    english: item[3],
    vi: item[4],
    is_new: item[5] !== false
  }));

  return {
    lesson_id: lessonId,
    metadata: {
      title_zh: titleZh,
      title_en: `${titleEn} (HSK ${hsk})`,
      title_vi: `${titleVi} (HSK ${hsk})`,
      hsk_level: hsk,
      cefr_level: cefr,
      cefr_activities: ['reception', 'production', 'interaction'],
      primary_skill: 'mixed',
      secondary_skills: ['reading', 'listening', 'speaking', 'writing'],
      topic: slug,
      estimated_minutes: hsk <= 2 ? 15 : hsk <= 4 ? 20 : 25,
      xp_reward: 30 + hsk * 10,
      tags: [`hsk${hsk}`, cefr.toLowerCase(), 'standard-hsk', slug]
    },
    learning_objectives: [
      `理解${titleZh}中的核心词语。`,
      `使用本课句式完成${titleZh}表达。`,
      '根据课文回答不超出本课范围的问题。'
    ],
    learning_objectives_vi: objectivesVi || [
      `Hiểu các từ then chốt về chủ đề "${titleVi}".`,
      `Dùng mẫu câu trong bài để diễn đạt về "${titleVi}".`,
      'Trả lời câu hỏi dựa trên bài khóa, không dùng từ vượt cấp.'
    ],
    warm_up: warmup,
    vocabulary_focus: vocabulary,
    core_modules: [coreModule],
    grammar_focus: grammar,
    practice: {
      title: '练习',
      title_pinyin: hsk <= 3 ? 'lian4 xi2' : '',
      closed_loop_data_rule: true,
      exercise_types: [...new Set(exercises.map((exercise) => exercise.kind))],
      exercises: finalizeExercises(lessonId, exercises)
    },
    practical_application: {
      title: '运用',
      title_pinyin: hsk <= 3 ? 'yun4 yong4' : '',
      can_do: CAN_DO[cefr],
      task_zh: hsk <= 3
        ? `和同学用本课词语完成一段关于${titleZh}的短对话。`
        : `用本课词语概括${titleZh}的主要观点，并补充一个理由。`,
      task_vi: hsk <= 3
        ? `Đóng vai cùng bạn học một hội thoại ngắn về "${titleVi}", chỉ dùng từ của bài và các cấp thấp hơn.`
        : `Tóm tắt quan điểm chính của bài về "${titleVi}" và bổ sung một lý do, chỉ dùng từ trong bài và cấp thấp hơn.`
    },
    review: {
      key_takeaways: [
        `本课围绕${titleZh}学习。`,
        '练习只使用本课或更低等级词语。',
        `对应等级：${cefr}。`
      ],
      key_takeaways_vi: [
        `Bài học xoay quanh chủ đề "${titleVi}".`,
        'Bài tập chỉ dùng từ vựng của bài hoặc cấp thấp hơn.',
        `Tương ứng trình độ ${cefr}.`
      ],
      can_do_task: CAN_DO[cefr],
      practical_application_vi: hsk <= 3
        ? `Hội thoại ngắn về "${titleVi}".`
        : `Tóm tắt và đánh giá ngắn về "${titleVi}".`,
      srs_inject_word_ids: vocabulary.map((word) => word.word_id)
    }
  };
};

// ---------------------------------------------------------------------------
// HSK1-2: fully hand-authored lessons.
// ---------------------------------------------------------------------------

const buildAuthoredExercise = (spec, context) => {
  const { titleZh, dialogueLines, contentZh, contentPinyin, summaryEn, summaryVi, hsk, seed } = context;
  const [kind] = spec;

  if (kind === 'word_order') {
    const [, bloom, tokens, tokensPinyin, tokensVi, correct, correctVi, explanation, explanationVi] = spec;
    return wordOrderExercise({ bloom, tokens, tokensPinyin, tokensVi, correct, correctVi, explanation, explanationVi });
  }

  if (kind === 'true_false') {
    const [, bloom, statement, statementPinyin, answer, explanation, explanationVi] = spec;
    return trueFalseExercise({ bloom, statement, statementPinyin, answer, explanation, explanationVi });
  }

  if (kind === 'listening_comprehension') {
    const [, bloom, lineIdxs, prompt, promptPinyin, options, correctIdx, optionsVi, explanation, explanationVi] = spec;
    const lines = lineIdxs.map((lineIndex) => {
      const line = dialogueLines[lineIndex];
      return { speaker: line[0], simplified: line[1], pinyin: line[2], english: line[3], vi: line[4] };
    });
    return choiceExercise({
      kind, bloom, prompt, promptPinyin, options, optionsVi, correctIdx, explanation, explanationVi, seed,
      stimulus: listeningStimulus({ hsk, title: titleZh, lines })
    });
  }

  const [, bloom, prompt, promptPinyin, options, correctIdx, optionsVi, explanation, explanationVi] = spec;
  const stimulus = kind === 'reading_comprehension'
    ? readingStimulus({ hsk, title: titleZh, text: contentZh, pinyin: contentPinyin, english: summaryEn, vi: summaryVi })
    : null;

  return choiceExercise({ kind, bloom, prompt, promptPinyin, options, optionsVi, correctIdx, explanation, explanationVi, stimulus, seed });
};

const buildLowLesson = (hsk, index, topic, authored) => {
  if (authored.slug !== topic[0]) {
    throw new Error(`Authored HSK${hsk} lesson order mismatch: expected ${topic[0]}, got ${authored.slug}.`);
  }

  const dialogue = authored.dialogue.map((line) => ({
    speaker: line[0],
    zh: line[1],
    simplified: line[1],
    pinyin: line[2],
    en: line[3],
    vi: line[4]
  }));

  const contentZh = dialogue.map((line) => line.zh).join('');
  const contentPinyin = dialogue.map((line) => line.pinyin).join('\n');

  const coreModule = {
    module_type: 'reading',
    phases: [
      {
        type: 'dialogue',
        title: '课文',
        title_pinyin: 'ke4 wen2',
        scenario: authored.titleEn,
        dialogue,
        content_zh: contentZh,
        content_pinyin: contentPinyin,
        content_en: authored.summaryEn,
        content_vi: authored.summaryVi
      }
    ]
  };

  const grammar = authored.grammar.map((rule) => ({
    pattern: rule.pattern,
    explanation: rule.explanation,
    explanation_vi: rule.explanation_vi,
    examples: rule.examples.map(([zh, pinyin, en, vi]) => ({ zh, simplified: zh, pinyin, en, english: en, vi })),
    example_pinyin: rule.examples.map(([, pinyin]) => pinyin),
    hsk_level: hsk,
    cefr_level: CEFR_BY_HSK[hsk]
  }));

  const context = {
    titleZh: topic[1],
    dialogueLines: authored.dialogue,
    contentZh,
    contentPinyin,
    summaryEn: authored.summaryEn,
    summaryVi: authored.summaryVi,
    hsk
  };

  const exercises = authored.exercises.map((spec, exerciseIndex) =>
    buildAuthoredExercise(spec, { ...context, seed: index + exerciseIndex }));

  return lessonShell({
    hsk,
    index,
    topic,
    titleEn: authored.titleEn,
    titleVi: authored.titleVi,
    warmup: {
      title: '热身',
      title_pinyin: 're4 shen1',
      title_vi: 'Khởi động',
      items: authored.warmup.items,
      items_vi: authored.warmup.itemsVi
    },
    vocab: authored.vocab,
    coreModule,
    grammar,
    exercises,
    summaryVi: authored.summaryVi
  });
};

// ---------------------------------------------------------------------------
// HSK3: shared advice dialogue with per-topic activity.
// ---------------------------------------------------------------------------

const buildHsk3Lesson = (index, topic) => {
  const hsk = 3;
  const [slug, titleZh, titleEn, focus, focusPinyin] = topic;
  const activity = HSK3.activities[slug];
  const titleVi = TITLES_VI[3][slug];
  const gloss = FOCUS_GLOSS[3][slug];

  const fill = (value) => String(value)
    .replaceAll('{A}', activity.zh)
    .replaceAll('{APY}', activity.py)
    .replaceAll('{AEN}', activity.en)
    .replaceAll('{AVI}', activity.vi);

  const dialogue = HSK3.frame.map((line) => ({
    speaker: line[0],
    zh: fill(line[1]),
    simplified: fill(line[1]),
    pinyin: fill(line[2]),
    en: fill(line[3]),
    vi: fill(line[4])
  }));

  const contentZh = dialogue.map((line) => line.zh).join('');
  const contentPinyin = dialogue.map((line) => line.pinyin).join('\n');
  const summaryEn = `An advice dialogue: one speaker has been ${activity.en} and runs into problems; the other suggests writing the problems down and improving a little every day.`;
  const summaryVi = `Hội thoại khuyên nhủ: một người đang ${activity.vi} và gặp khó khăn; người kia khuyên ghi vấn đề ra giấy và mỗi ngày tiến bộ một chút.`;

  const coreModule = {
    module_type: 'reading',
    phases: [
      {
        type: 'dialogue',
        title: '课文',
        title_pinyin: 'ke4 wen2',
        scenario: titleEn,
        dialogue,
        content_zh: contentZh,
        content_pinyin: contentPinyin,
        content_en: summaryEn,
        content_vi: summaryVi
      }
    ]
  };

  const vocab = [
    [focus, focusPinyin, 'noun/phrase', gloss.en, gloss.vi],
    ...HSK3.vocabBase.filter((item) => item[0] !== focus)
  ];

  const grammar = HSK3.grammar.map((rule) => ({
    pattern: rule.pattern,
    explanation: rule.explanation,
    explanation_vi: rule.explanation_vi,
    examples: rule.examples.map(([zh, pinyin, en, vi]) => ({ zh, simplified: zh, pinyin, en, english: en, vi })),
    example_pinyin: rule.examples.map(([, pinyin]) => pinyin),
    hsk_level: hsk,
    cefr_level: 'B1'
  }));

  const pools = HSK3.pools;
  const readingStim = readingStimulus({ hsk, title: titleZh, text: contentZh, pinyin: contentPinyin, english: summaryEn, vi: summaryVi });
  const listeningLines = dialogue.slice(0, 2).map((line) => ({ speaker: line.speaker, simplified: line.zh, pinyin: line.pinyin, english: line.en, vi: line.vi }));

  const fillDistractors = pickPool(pools.wrongActivities, index, 2);
  const listenDistractors = pickPool(pools.listenWrongActivities, index, 2);
  const readingDistractors = pickPool(pools.readingWrong, index, 2);
  const fill2Distractors = pickPool(pools.fill2Wrong, index, 2);
  const mc = pools.mcQuestions[index % pools.mcQuestions.length];

  const exercises = [
    choiceExercise({
      kind: 'fill_blank', bloom: 'apply', seed: index,
      prompt: '最近我在___，可是遇到了一点儿问题。',
      promptPinyin: 'Zui4 jin4 wo3 zai4 ___, ke3 shi4 yu4 dao4 le5 yi4 dian3r5 wen4 ti2.',
      options: [activity.zh, ...fillDistractors.map((item) => item[0])],
      optionsVi: [activity.vi, ...fillDistractors.map((item) => item[2])],
      correctIdx: 0,
      explanation: `课文第一句说：“最近我在${activity.zh}。”`,
      explanationVi: `Câu mở đầu bài khóa cho biết người nói đang ${activity.vi}.`
    }),
    wordOrderExercise({
      bloom: 'apply',
      tokens: ['你的', '中文', '越来越', '好'],
      tokensPinyin: 'ni3 de5 / Zhong1 wen2 / yue4 lai2 yue4 / hao3',
      tokensVi: ['của bạn', 'tiếng Trung', 'càng ngày càng', 'tốt'],
      correct: '你的中文越来越好。',
      correctVi: 'Tiếng Trung của bạn càng ngày càng khá.',
      explanation: '本课语法：越来越 + 形容词，放在主语后面。',
      explanationVi: 'Ngữ pháp của bài: 越来越 + tính từ, đặt sau chủ ngữ: 你的中文越来越好.'
    }),
    choiceExercise({
      kind: 'listening_comprehension', bloom: 'understand', seed: index + 1,
      prompt: '说话人最近在做什么？',
      promptPinyin: 'Shuo1 hua4 ren2 zui4 jin4 zai4 zuo4 shen2 me5?',
      options: [activity.zh, ...listenDistractors.map((item) => item[0])],
      optionsVi: [activity.vi, ...listenDistractors.map((item) => item[2])],
      correctIdx: 0,
      explanation: `他说：“最近我在${activity.zh}，可是遇到了一点儿问题。”`,
      explanationVi: `Trong audio, người nói cho biết mình đang ${activity.vi} và gặp một chút vấn đề.`,
      stimulus: listeningStimulus({ hsk, title: titleZh, lines: listeningLines })
    }),
    choiceExercise({
      kind: 'reading_comprehension', bloom: 'analyze', seed: index + 2,
      prompt: '遇到问题以后，朋友建议先做什么？',
      promptPinyin: 'Yu4 dao4 wen4 ti2 yi3 hou4, peng2 you5 jian4 yi4 xian1 zuo4 shen2 me5?',
      options: ['先把问题写下来', ...readingDistractors.map((item) => item[0])],
      optionsVi: ['ghi vấn đề ra giấy trước', ...readingDistractors.map((item) => item[1])],
      correctIdx: 0,
      explanation: '朋友说：“你可以先把问题写下来，然后再想办法。”',
      explanationVi: 'Người bạn khuyên: hãy ghi vấn đề ra trước, sau đó mới nghĩ cách giải quyết.',
      stimulus: readingStim
    }),
    trueFalseExercise({
      bloom: 'understand',
      statement: '说话人以前经常这样做。',
      statementPinyin: 'Shuo1 hua4 ren2 yi3 qian2 jing1 chang2 zhe4 yang4 zuo4.',
      answer: false,
      explanation: '他说：“我以前没有这样做过。”',
      explanationVi: 'Sai. Người nói thừa nhận trước giờ chưa từng làm theo cách này.'
    }),
    choiceExercise({
      kind: 'multiple_choice', bloom: 'understand', seed: index + 3,
      prompt: mc.prompt,
      promptPinyin: mc.py,
      options: mc.opts,
      optionsVi: mc.optsVi,
      correctIdx: 0,
      explanation: mc.expl,
      explanationVi: mc.explVi
    }),
    choiceExercise({
      kind: 'fill_blank', bloom: 'apply', seed: index + 4,
      prompt: '你每天都做，就一定会___。',
      promptPinyin: 'Ni3 mei3 tian1 dou1 zuo4, jiu4 yi2 ding4 hui4 ___.',
      options: ['越来越好', ...fill2Distractors.map((item) => item[0])],
      optionsVi: ['càng ngày càng tốt', ...fill2Distractors.map((item) => item[1])],
      correctIdx: 0,
      explanation: '课文最后说：“你每天都做，就一定会越来越好。”',
      explanationVi: 'Câu cuối bài: ngày nào cũng làm thì nhất định sẽ càng ngày càng tốt lên.'
    })
  ];

  return lessonShell({
    hsk,
    index,
    topic,
    titleEn,
    titleVi,
    warmup: {
      title: '热身',
      title_pinyin: 're4 shen1',
      title_vi: 'Khởi động',
      items: HSK3.warmup.items.map((item) => item.replaceAll('{T}', titleZh)),
      items_vi: HSK3.warmup.itemsVi.map((item) => item.replaceAll('{TV}', titleVi))
    },
    vocab,
    coreModule,
    grammar,
    exercises,
    summaryVi
  });
};

// ---------------------------------------------------------------------------
// HSK4-6: level passage with focus slot, translated exercises.
// ---------------------------------------------------------------------------

const buildHighLesson = (hsk, index, topic) => {
  const [slug, titleZh, titleEn, focus, focusPinyin] = topic;
  const level = HIGH[hsk];
  const titleVi = TITLES_VI[hsk][slug];
  const gloss = FOCUS_GLOSS[hsk][slug];

  const fill = (value) => String(value)
    .replaceAll('{F}', focus)
    .replaceAll('{FEN}', gloss.en)
    .replaceAll('{FVI}', gloss.vi);

  const passage = fill(level.passage);
  const passageEn = fill(level.passageEn);
  const passageVi = fill(level.passageVi);
  const summaryVi = fill(level.summaryVi);

  const coreModule = {
    module_type: 'reading',
    phases: [
      {
        type: 'reading_passage',
        title: '课文',
        scenario: titleEn,
        content_zh: passage,
        content_pinyin: '',
        content_en: passageEn,
        content_vi: passageVi
      }
    ]
  };

  const vocab = [
    [focus, focusPinyin, 'noun/phrase', gloss.en, gloss.vi],
    ...level.vocabBase.filter((item) => item[0] !== focus)
  ];

  const grammar = level.grammar.map((rule) => ({
    pattern: rule.pattern,
    explanation: rule.explanation,
    explanation_vi: rule.explanation_vi,
    examples: rule.examples.map(([zh, en, vi]) => ({ zh: fill(zh), simplified: fill(zh), pinyin: '', en: fill(en), english: fill(en), vi: fill(vi) })),
    example_pinyin: [],
    hsk_level: hsk,
    cefr_level: CEFR_BY_HSK[hsk]
  }));

  const pools = level.pools;
  const sentences = passage.split('。').filter(Boolean);
  const audioLines = sentences.slice(0, level.listeningSentences).map((sentence) => ({ simplified: `${sentence}。`, pinyin: '', english: '' }));
  const audioEnglish = passageEn.split(/(?<=\.)\s+/).slice(0, level.listeningSentences).join(' ');

  const readingStim = readingStimulus({ hsk, title: titleZh, text: passage, pinyin: '', english: passageEn, vi: passageVi });

  const fill1Distractors = pickPool(pools.topicNouns, index, 3);
  const readingDistractors = pickPool(pools.readingWrong, index, 3);
  const fill2Distractors = pickPool(pools.fill2Wrong, index, 3);
  const mc = pools.mcQuestions[index % pools.mcQuestions.length];
  const blooms = level.blooms;

  let listeningOptions;
  let listeningOptionsVi;
  if (hsk === 4) {
    const foci = TOPICS[4].map((item) => [item[3], FOCUS_GLOSS[4][item[0]].vi]);
    const others = [1, 3, 6].map((offset) => foci[(index + offset) % foci.length]);
    listeningOptions = [focus, ...others.map((item) => item[0])];
    listeningOptionsVi = [gloss.vi, ...others.map((item) => item[1])];
  } else {
    const wrong = pickPool(pools.listeningWrong, index, 3);
    listeningOptions = [level.listening.correct, ...wrong.map((item) => item[0])];
    listeningOptionsVi = [level.listening.correctVi, ...wrong.map((item) => item[1])];
  }

  const exercises = [
    choiceExercise({
      kind: 'fill_blank', bloom: blooms[0], seed: index,
      prompt: level.fill1.prompt,
      promptPinyin: undefined,
      options: [focus, ...fill1Distractors.map((item) => item[0])],
      optionsVi: [gloss.vi, ...fill1Distractors.map((item) => item[1])],
      correctIdx: 0,
      explanation: fill(level.fill1.expl),
      explanationVi: fill(level.fill1.explVi)
    }),
    wordOrderExercise({
      bloom: blooms[1],
      tokens: level.wordOrder.tokens.map(fill),
      tokensPinyin: undefined,
      tokensVi: level.wordOrder.tokensVi.map(fill),
      correct: fill(level.wordOrder.correct),
      correctVi: fill(level.wordOrder.correctVi),
      explanation: fill(level.wordOrder.expl),
      explanationVi: fill(level.wordOrder.explVi)
    }),
    choiceExercise({
      kind: 'listening_comprehension', bloom: blooms[2], seed: index + 1,
      prompt: level.listening.q,
      promptPinyin: undefined,
      options: listeningOptions,
      optionsVi: listeningOptionsVi,
      correctIdx: 0,
      explanation: fill(level.listening.expl),
      explanationVi: fill(level.listening.explVi),
      stimulus: listeningStimulus({ hsk, title: titleZh, lines: audioLines, english: audioEnglish })
    }),
    choiceExercise({
      kind: 'reading_comprehension', bloom: blooms[3], seed: index + 2,
      prompt: fill(level.reading.q),
      promptPinyin: undefined,
      options: [level.reading.correct, ...readingDistractors.map((item) => item[0])],
      optionsVi: [level.reading.correctVi, ...readingDistractors.map((item) => item[1])],
      correctIdx: 0,
      explanation: fill(level.reading.expl),
      explanationVi: fill(level.reading.explVi),
      stimulus: readingStim
    }),
    trueFalseExercise({
      bloom: blooms[4],
      statement: fill(level.trueFalse.statement),
      statementPinyin: undefined,
      answer: level.trueFalse.answer,
      explanation: fill(level.trueFalse.expl),
      explanationVi: fill(level.trueFalse.explVi)
    }),
    choiceExercise({
      kind: 'multiple_choice', bloom: blooms[5], seed: index + 3,
      prompt: mc.prompt,
      promptPinyin: undefined,
      options: mc.opts,
      optionsVi: mc.optsVi,
      correctIdx: 0,
      explanation: mc.expl,
      explanationVi: mc.explVi
    }),
    choiceExercise({
      kind: 'fill_blank', bloom: blooms[6], seed: index + 4,
      prompt: level.fill2.prompt,
      promptPinyin: undefined,
      options: [level.fill2.correct, ...fill2Distractors.map((item) => item[0])],
      optionsVi: [level.fill2.correctVi, ...fill2Distractors.map((item) => item[1])],
      correctIdx: 0,
      explanation: fill(level.fill2.expl),
      explanationVi: fill(level.fill2.explVi)
    })
  ];

  return lessonShell({
    hsk,
    index,
    topic,
    titleEn,
    titleVi,
    warmup: {
      title: '热身',
      title_pinyin: '',
      title_vi: 'Khởi động',
      items: HIGH_WARMUP.items.map(fill),
      items_vi: HIGH_WARMUP.itemsVi.map(fill)
    },
    vocab,
    coreModule,
    grammar,
    exercises,
    summaryVi
  });
};

// ---------------------------------------------------------------------------
// Rules + validation
// ---------------------------------------------------------------------------

const ALLOWED_KINDS = ['fill_blank', 'word_order', 'multiple_choice', 'true_false', 'reading_comprehension', 'listening_comprehension'];
const REQUIRED_KINDS = ['fill_blank', 'word_order', 'reading_comprehension'];

const buildRules = () => ({
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  version: '2026-07-11-standard-hsk-v2',
  purpose: 'Standard HSK lesson generation with CEFR mapping, closed-loop exercise data and authored translations.',
  hsk_to_cefr: CEFR_BY_HSK,
  lesson_contract: {
    required_sections: ['warm_up', 'vocabulary_focus', 'core_modules', 'grammar_focus', 'practice.exercises', 'practical_application'],
    vocabulary_per_lesson: { min: 5, max: 12 },
    grammar_rules_per_lesson: { min: 2, max: 3 },
    examples_per_grammar_rule: 3,
    exercise_kinds_required: REQUIRED_KINDS,
    exercise_kinds_allowed: ALLOWED_KINDS,
    closed_loop_data_rule: 'Every Chinese item in exercises must come from current lesson vocabulary, grammar, text, or lower HSK/CEFR levels.'
  },
  levels: Object.fromEntries(Object.entries(CEFR_BY_HSK).map(([hsk, cefr]) => [
    cefr,
    {
      hsk_level: Number(hsk),
      can_do: CAN_DO[cefr],
      allowed_kinds: ALLOWED_KINDS,
      allowed_bloom_levels: Number(hsk) <= 2
        ? ['remember', 'understand']
        : Number(hsk) === 3
          ? ['understand', 'apply', 'analyze']
          : Number(hsk) === 4
            ? ['apply', 'analyze', 'evaluate']
            : ['analyze', 'evaluate', 'create'],
      bloom_distribution: [],
      option_count: Number(hsk) <= 3 ? 3 : 4,
      text_complexity: {
        reading: {
          hanzi: Number(hsk) <= 3 ? [50, 120] : [200, 500],
          pinyin: Number(hsk) <= 3
        },
        listening: {
          hanzi: Number(hsk) <= 3 ? [4, 120] : [15, 300],
          pinyin: Number(hsk) <= 3
        }
      }
    }
  ])),
  distractor_rules: {
    forbidden_options: [],
    max_repeated_distractor_set: 2
  },
  validation: {
    lesson_count_per_hsk: 17,
    exercise_count: { min: 6, max: 10 },
    min_distinct_kinds: 4,
    min_distinct_bloom_levels: 2,
    min_explanation_chars: 8,
    require_prompt_english: true,
    strict_pinyin: {
      hsk_1_to_3: 'Pinyin (diacritics) required in text and exercise pinyin fields.',
      hsk_4_to_6: 'No pinyin inside Text/Dialogue or Exercises.'
    },
    anti_random_difficulty_leak: true
  }
});

const ruleMarkdown = `# Standard HSK/CEFR Lesson Rules

This directory holds the standard HSK lesson set with authored content and real EN/VI translations.

## Level Mapping

| HSK | CEFR | Text Style |
| --- | --- | --- |
| 1 | A1 | Hand-authored survival dialogues with full diacritic pinyin. |
| 2 | A2 | Hand-authored routine dialogues with full diacritic pinyin. |
| 3 | B1 | Advice dialogue with per-topic activity, full diacritic pinyin. |
| 4 | B2 | 200-500 character passage, no pinyin in text/exercises. |
| 5 | C1 | Longer implicit-meaning passage, no pinyin in text/exercises. |
| 6 | C2 | Nuanced idiomatic/cultural passage, no pinyin in text/exercises. |

## Required Lesson Sections

Each lesson must include:

1. Warm-up (热身)
2. Vocabulary (生词), 5-12 words (HSK1-2 include core function words)
3. Text/Dialogue (课文) with per-line EN + VI translations
4. Grammar Notes (注释), 2-3 rules, exactly 3 examples per rule, translated
5. Exercises (练习), 6-10 per lesson. Required kinds: fill_blank, word_order,
   reading_comprehension. Also allowed: multiple_choice, true_false,
   listening_comprehension (with TTS-ready audioText stimulus).
6. Practical Application (运用), CEFR can-do task

## Closed-Loop Data Rule

Chinese used in exercises must come from the current lesson vocabulary, current lesson grammar/text, or lower HSK/CEFR levels. Do not raise difficulty by injecting random advanced words.

## Pinyin Rule

HSK 1-3 includes diacritic pinyin (nǐ hǎo, not Ni3 hao3) in lesson text and exercise pinyin fields. HSK 4-6 has no pinyin in Text/Dialogue or Exercises.

## Content Sources

- HSK1-2: fully hand-authored per lesson (server/scripts/standard-content/hsk1.mjs, hsk2.mjs).
- HSK3: authored dialogue frame + per-topic activity (standard-content/high.mjs).
- HSK4-6: level passage with focus slot + authored translations (standard-content/high.mjs).

Regenerate with: node server/scripts/generate-standard-hsk-lessons.mjs
`;

const assertInside = (target, parent) => {
  const resolvedTarget = path.resolve(target);
  const resolvedParent = path.resolve(parent);
  const relative = path.relative(resolvedParent, resolvedTarget);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to modify path outside workspace: ${resolvedTarget}`);
  }
};

const cleanDir = async (dir) => {
  assertInside(dir, repoRoot);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
};

const validateLesson = (lesson) => {
  const hsk = Number(lesson.metadata.hsk_level);
  const phase = lesson.core_modules[0].phases[0];
  const text = phase.content_zh;
  const textCount = hanziCount(text);
  const expectedRange = hsk <= 3 ? [50, 120] : [200, 500];
  const exercises = lesson.practice.exercises;
  const kinds = new Set(exercises.map((exercise) => exercise.kind));

  if (lesson.vocabulary_focus.length < 5 || lesson.vocabulary_focus.length > 12) {
    throw new Error(`${lesson.lesson_id}: vocabulary count must be 5-12.`);
  }

  if (lesson.grammar_focus.length < 2 || lesson.grammar_focus.length > 3) {
    throw new Error(`${lesson.lesson_id}: grammar count must be 2-3.`);
  }

  for (const grammarRule of lesson.grammar_focus) {
    if (grammarRule.examples.length !== 3) {
      throw new Error(`${lesson.lesson_id}: each grammar rule must have exactly 3 examples.`);
    }
  }

  if (exercises.length < 6 || exercises.length > 10) {
    throw new Error(`${lesson.lesson_id}: expected 6-10 exercises, got ${exercises.length}.`);
  }

  for (const requiredKind of REQUIRED_KINDS) {
    if (!kinds.has(requiredKind)) {
      throw new Error(`${lesson.lesson_id}: missing required exercise kind ${requiredKind}.`);
    }
  }

  for (const kind of kinds) {
    if (!ALLOWED_KINDS.includes(kind)) {
      throw new Error(`${lesson.lesson_id}: exercise kind ${kind} is not allowed.`);
    }
  }

  for (const exercise of exercises) {
    if (exercise.kind !== 'word_order') {
      const correctIdx = exercise.options.findIndex((option) => String(option) === String(exercise.correct_answer));
      if (correctIdx === -1) {
        throw new Error(`${lesson.lesson_id}/${exercise.id}: correct_answer not in options.`);
      }
    }
    if (exercise.options.length !== exercise.options_vi.length) {
      throw new Error(`${lesson.lesson_id}/${exercise.id}: options_vi length mismatch.`);
    }
  }

  if (textCount < expectedRange[0] || textCount > expectedRange[1]) {
    throw new Error(`${lesson.lesson_id}: text has ${textCount} Hanzi, expected ${expectedRange.join('-')}.`);
  }

  if (hsk <= 3 && !phase.content_pinyin) {
    throw new Error(`${lesson.lesson_id}: HSK 1-3 text must include pinyin.`);
  }

  if (hsk >= 4) {
    if (phase.content_pinyin) {
      throw new Error(`${lesson.lesson_id}: HSK 4-6 text must not include pinyin.`);
    }

    for (const exercise of exercises) {
      if (exercise.prompt_pinyin || exercise.stimulus?.pinyin) {
        throw new Error(`${lesson.lesson_id}: HSK 4-6 exercises must not include pinyin.`);
      }
    }
  }

  return {
    lesson_id: lesson.lesson_id,
    hsk,
    cefr: lesson.metadata.cefr_level,
    text_hanzi: textCount,
    vocabulary: lesson.vocabulary_focus.length,
    exercises: exercises.length
  };
};

const run = async () => {
  const authoredBySlug = {
    1: new Map(HSK1_LESSONS.map((lesson) => [lesson.slug, lesson])),
    2: new Map(HSK2_LESSONS.map((lesson) => [lesson.slug, lesson]))
  };

  const lessons = Object.entries(TOPICS).flatMap(([hskKey, topics]) => {
    const hsk = Number(hskKey);
    return topics.map((topic, index) => {
      if (hsk <= 2) {
        const authored = authoredBySlug[hsk].get(topic[0]);
        if (!authored) {
          throw new Error(`Missing authored HSK${hsk} lesson for topic ${topic[0]}.`);
        }
        return buildLowLesson(hsk, index, topic, authored);
      }
      if (hsk === 3) {
        return buildHsk3Lesson(index, topic);
      }
      return buildHighLesson(hsk, index, topic);
    });
  }).map((lesson) => convertPinyinDeep(lesson));

  const validation = lessons.map(validateLesson);
  const normalizedDir = resolveContentPath('data/lessons/normalized');

  await cleanDir(normalizedDir);

  for (const lesson of lessons) {
    await writeLessonEntry({ targetDir: normalizedDir, lesson });
  }

  await writeFile(resolveContentPath('data/lessons/cefr-exercise-rules.json'), `${JSON.stringify(buildRules(), null, 2)}\n`, 'utf8');
  await writeFile(resolveContentPath('data/lessons/rule.md'), ruleMarkdown, 'utf8');
  await writeFile(resolveContentPath('data/rule.md'), ruleMarkdown, 'utf8');

  console.log(JSON.stringify({
    ok: true,
    lesson_count: lessons.length,
    by_hsk: Object.fromEntries(Object.keys(TOPICS).map((hsk) => [hsk, validation.filter((lesson) => lesson.hsk === Number(hsk)).length])),
    exercises_total: validation.reduce((sum, lesson) => sum + lesson.exercises, 0),
    normalized: path.relative(repoRoot, normalizedDir)
  }, null, 2));
};

await run();
