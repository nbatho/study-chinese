import { query } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';
import { getUserProfile } from './user.service.js';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CEFR_TO_START_LEVEL = {
  A1: 'beginner',
  A2: 'elementary',
  B1: 'intermediate',
  B2: 'upper_intermediate',
  C1: 'advanced',
  C2: 'mastery'
};

const BUILT_IN_ADVANCED_QUESTIONS = [
  {
    id: 'placement_builtin_b2_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'B2',
    prompt: 'Which option best matches 采取措施?',
    promptHanzi: '采取措施',
    promptPinyin: 'caiqu cuoshi',
    options: ['take measures', 'change seats', 'lose confidence', 'make a reservation'],
    correctIndex: 0,
    correctText: 'take measures',
    explanation: '采取措施 means to take measures or action.',
    difficulty: 4,
    order: 300
  },
  {
    id: 'placement_builtin_b2_grammar_01',
    section: 'grammar',
    cefrLevel: 'B2',
    prompt: 'Choose the structure that means "not only..., but also...".',
    promptHanzi: '他___会说中文，___了解中国文化。',
    promptPinyin: 'ta ___ hui shuo zhongwen, ___ liaojie zhongguo wenhua',
    options: ['不但...而且...', '因为...所以...', '虽然...但是...', '一边...一边...'],
    correctIndex: 0,
    correctText: '不但...而且...',
    explanation: '不但...而且... links two positive facts with emphasis.',
    difficulty: 4,
    order: 310
  },
  {
    id: 'placement_builtin_b2_reading_01',
    section: 'reading',
    cefrLevel: 'B2',
    prompt: '这项政策短期内会增加成本，但从长远来看有助于提高效率。 What is the main idea?',
    promptHanzi: '这项政策短期内会增加成本，但从长远来看有助于提高效率。',
    promptPinyin: 'zhe xiang zhengce duanqi nei hui zengjia chengben, dan cong changyuan lai kan youzhu yu tigao xiaolü',
    options: ['It costs more now but may improve efficiency later', 'It immediately reduces costs', 'It has no effect on efficiency', 'It should be cancelled today'],
    correctIndex: 0,
    correctText: 'It costs more now but may improve efficiency later',
    explanation: '短期内 contrasts with 从长远来看.',
    difficulty: 4,
    order: 320
  },
  {
    id: 'placement_builtin_c1_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'C1',
    prompt: 'Which word is closest in meaning to 阐述?',
    promptHanzi: '阐述',
    promptPinyin: 'chanshu',
    options: ['elaborate on', 'hide from', 'repeat loudly', 'purchase quickly'],
    correctIndex: 0,
    correctText: 'elaborate on',
    explanation: '阐述 means to explain or elaborate a point in detail.',
    difficulty: 5,
    order: 400
  },
  {
    id: 'placement_builtin_c1_grammar_01',
    section: 'grammar',
    cefrLevel: 'C1',
    prompt: 'Choose the most natural completion: 这份报告___数据充分，___结论仍需进一步验证。',
    promptHanzi: '这份报告___数据充分，___结论仍需进一步验证。',
    promptPinyin: 'zhe fen baogao ___ shuju chongfen, ___ jielun reng xu jinyibu yanzheng',
    options: ['尽管...但...', '只要...就...', '与其...不如...', '不是...就是...'],
    correctIndex: 0,
    correctText: '尽管...但...',
    explanation: '尽管...但... introduces concession and contrast.',
    difficulty: 5,
    order: 410
  },
  {
    id: 'placement_builtin_c1_reading_01',
    section: 'reading',
    cefrLevel: 'C1',
    prompt: '他并非反对改革本身，而是担心执行过程中缺乏透明度。 What is his concern?',
    promptHanzi: '他并非反对改革本身，而是担心执行过程中缺乏透明度。',
    promptPinyin: 'ta bingfei fandui gaige benshen, er shi danxin zhixing guocheng zhong quefa toumingdu',
    options: ['the reform process may lack transparency', 'the reform goal is impossible', 'the reform is already complete', 'the reform is too transparent'],
    correctIndex: 0,
    correctText: 'the reform process may lack transparency',
    explanation: '并非...而是... corrects the focus of the concern.',
    difficulty: 5,
    order: 420
  },
  {
    id: 'placement_builtin_c2_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'C2',
    prompt: 'Which interpretation best fits 微妙?',
    promptHanzi: '微妙',
    promptPinyin: 'weimiao',
    options: ['subtle and delicate', 'obvious and simple', 'illegal and public', 'ancient and broken'],
    correctIndex: 0,
    correctText: 'subtle and delicate',
    explanation: '微妙 describes something subtle, delicate, or hard to handle.',
    difficulty: 6,
    order: 500
  },
  {
    id: 'placement_builtin_c2_grammar_01',
    section: 'grammar',
    cefrLevel: 'C2',
    prompt: 'Choose the idiomatic completion: 他的发言看似平淡，实则___。',
    promptHanzi: '他的发言看似平淡，实则___。',
    promptPinyin: 'ta de fayan kansi pingdan, shize ___',
    options: ['意味深长', '乱七八糟', '半途而废', '马马虎虎'],
    correctIndex: 0,
    correctText: '意味深长',
    explanation: '意味深长 means rich in implication or meaning.',
    difficulty: 6,
    order: 510
  },
  {
    id: 'placement_builtin_c2_reading_01',
    section: 'reading',
    cefrLevel: 'C2',
    prompt: '文章表面上是在讨论技术创新，实际上折射出作者对社会公平的深层关切。 What does the sentence imply?',
    promptHanzi: '文章表面上是在讨论技术创新，实际上折射出作者对社会公平的深层关切。',
    promptPinyin: 'wenzhang biaomian shang shi zai taolun jishu chuangxin, shijishang zheshe chu zuozhe dui shehui gongping de shenceng guanqie',
    options: ['The article uses technology to reveal concern about social fairness', 'The article rejects all technology', 'The author only discusses grammar', 'The author avoids social topics'],
    correctIndex: 0,
    correctText: 'The article uses technology to reveal concern about social fairness',
    explanation: '表面上...实际上... signals a deeper implied focus.',
    difficulty: 6,
    order: 520
  }
];

const mapPlacementQuestion = (row) => ({
  id: row.id,
  section: row.section,
  cefrLevel: row.cefr_level,
  prompt: row.prompt,
  promptHanzi: row.prompt_hanzi,
  promptPinyin: row.prompt_pinyin,
  options: row.options || [],
  correctIndex: Number(row.correct_index),
  correctText: row.correct_text,
  explanation: row.explanation,
  difficulty: Number(row.difficulty),
  order: Number(row.order_num)
});

const normalizeCefrLevel = (value) => {
  const level = String(value || '').toUpperCase();

  if (!CEFR_LEVELS.includes(level)) {
    throw badRequest('CEFR level khong hop le.');
  }

  return level;
};

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw badRequest('Placement score khong hop le.');
  }

  return Math.round(score);
};

export const getPlacementQuestions = async () => {
  const result = await query(
    `
      SELECT *
      FROM placement_questions
      WHERE is_active = true
      ORDER BY order_num, difficulty, id
    `
  );

  const questions = result.rows.map(mapPlacementQuestion);
  const existingIds = new Set(questions.map((question) => question.id));
  const builtInQuestions = BUILT_IN_ADVANCED_QUESTIONS.filter((question) => !existingIds.has(question.id));

  return {
    questions: [...questions, ...builtInQuestions].sort((left, right) =>
      left.order - right.order || left.difficulty - right.difficulty || left.id.localeCompare(right.id)
    )
  };
};

export const submitPlacementResult = async (userId, payload = {}) => {
  const cefrLevel = normalizeCefrLevel(payload.cefrLevel);
  const score = normalizeScore(payload.score);
  const startLevel = CEFR_TO_START_LEVEL[cefrLevel];

  await query(
    `
      UPDATE users
      SET cefr_level = $2,
          start_level = $3,
          placement_test_score = $4,
          placement_test_completed_at = COALESCE($5::timestamptz, now()),
          updated_at = now()
      WHERE id = $1
    `,
    [userId, cefrLevel, startLevel, score, payload.completedAt || null]
  );

  return getUserProfile(userId);
};

export const __private__ = {
  mapPlacementQuestion,
  CEFR_TO_START_LEVEL,
  BUILT_IN_ADVANCED_QUESTIONS,
  normalizeCefrLevel,
  normalizeScore
};
