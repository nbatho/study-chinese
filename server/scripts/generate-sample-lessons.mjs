import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ContentValidator } from '../src/services/content-validator.js';
import { contentPath } from '../src/config/content-paths.js';

const outputRoot = contentPath('lessons', 'generated');
const args = process.argv.slice(2);
const CLEAN = args.includes('--clean');

const CEFR_BY_HSK = new Map([
  [1, 'A1'],
  [2, 'A2'],
  [3, 'B1']
]);

const CEFR_ACTIVITIES_BY_SKILL = {
  listening: ['reception'],
  reading: ['reception'],
  speaking: ['production', 'interaction'],
  writing: ['production'],
  mixed: ['reception', 'production', 'interaction']
};

const skillToModule = (skill) => (skill === 'mixed' ? 'reading' : skill);

const makeVocab = (items) =>
  items.map(([simplified, pinyin, english, isNew = true]) => ({
    simplified,
    pinyin,
    english,
    is_new: isNew
  }));

const makeExercise = ({
  id,
  kind = 'multiple_choice',
  skill,
  bloomLevel = 'understand',
  prompt,
  promptVi,
  options = [],
  optionsVi = [],
  correctAnswer,
  correctAnswerVi,
  explanation,
  explanationVi,
  tokens,
  acceptableVariants
}) => ({
  id,
  kind,
  skill,
  bloom_level: bloomLevel,
  prompt,
  prompt_vi: promptVi,
  ...(options.length ? { options } : {}),
  ...(optionsVi.length ? { options_vi: optionsVi } : {}),
  ...(tokens?.length ? { tokens } : {}),
  correct_answer: correctAnswer,
  correct_answer_vi: correctAnswerVi,
  acceptable_variants: acceptableVariants || [String(correctAnswer).replace(/\s+/g, '')],
  explanation,
  explanation_vi: explanationVi
});

const makeLesson = ({
  number,
  level,
  skill,
  topic,
  titleZh,
  titleEn,
  titleVi,
  objectives,
  objectivesVi,
  vocab,
  grammar,
  warmUpItems,
  modulePhases,
  exercises,
  review,
  reviewVi
}) => {
  const lessonId = `hsk${level}-l${String(number).padStart(2, '0')}-${skill}-${topic}`;
  const cefrLevel = CEFR_BY_HSK.get(level) || 'B1';

  return {
    lesson_id: lessonId,
    metadata: {
      title_zh: titleZh,
      title_en: titleEn,
      title_vi: titleVi,
      hsk_level: level,
      cefr_level: cefrLevel,
      cefr_activities: CEFR_ACTIVITIES_BY_SKILL[skill],
      primary_skill: skill,
      secondary_skills: skill === 'listening' ? ['speaking'] : skill === 'reading' ? ['writing'] : [],
      topic,
      estimated_minutes: level <= 1 ? 8 : level <= 2 ? 10 : 12,
      xp_reward: 20 + level * 5,
      tags: [topic, skill, `hsk${level}`, cefrLevel.toLowerCase()]
    },
    learning_objectives: objectives,
    learning_objectives_vi: objectivesVi,
    vocabulary_focus: vocab,
    grammar_focus: grammar.map((item) => ({
      ...item,
      hsk_level: item.hsk_level || level,
      cefr_level: item.cefr_level || cefrLevel
    })),
    warm_up: {
      type: 'vocabulary_review',
      items: warmUpItems
    },
    core_modules: [
      {
        module_type: skillToModule(skill),
        phases: modulePhases
      }
    ],
    practice: {
      exercises
    },
    review: {
      key_takeaways: review,
      key_takeaways_vi: reviewVi,
      srs_inject_word_ids: []
    }
  };
};

const lessonSpecs = [
  {
    number: 1,
    level: 1,
    skill: 'listening',
    topic: 'greetings',
    titleZh: '你好！',
    titleEn: 'Hello!',
    titleVi: 'Xin chào!',
    objectives: ['听懂简单问候。', '用“我叫...”回答名字。'],
    objectivesVi: ['Nghe hiểu lời chào đơn giản.', 'Dùng “我叫...” để trả lời tên.'],
    vocab: makeVocab([
      ['你好', 'nǐ hǎo', 'hello'],
      ['我', 'wǒ', 'I; me'],
      ['叫', 'jiào', 'to be called'],
      ['什么', 'shén me', 'what']
    ]),
    grammar: [
      {
        pattern: '我叫...',
        explanation: '用“我叫...”介绍自己的名字。',
        explanation_vi: 'Dùng “我叫...” để giới thiệu tên của mình.',
        examples: [{ zh: '我叫小明。', pinyin: 'Wǒ jiào Xiǎo Míng.', en: 'My name is Xiao Ming.', vi: 'Tôi tên là Tiểu Minh.' }]
      }
    ],
    warmUpItems: ['你好', '我', '叫'],
    modulePhases: [
      {
        type: 'dialogue_listen',
        dialogue: [
          { speaker: 'A', zh: '你好！', pinyin: 'Nǐ hǎo!', en: 'Hello!', vi: 'Xin chào!' },
          { speaker: 'B', zh: '你好！我叫小明。', pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎo Míng.', en: 'Hello! My name is Xiao Ming.', vi: 'Xin chào! Tôi tên là Tiểu Minh.' },
          { speaker: 'A', zh: '你叫什么？', pinyin: 'Nǐ jiào shén me?', en: 'What is your name?', vi: 'Bạn tên là gì?' }
        ]
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk1-l01-ex1',
        skill: 'listening',
        prompt: '听：你好。意思是哪一个？',
        promptVi: 'Nghe: 你好. Nghĩa là câu nào?',
        options: ['你好', '谢谢', '再见'],
        optionsVi: ['xin chào', 'cảm ơn', 'tạm biệt'],
        correctAnswer: '你好',
        correctAnswerVi: 'xin chào',
        explanation: '“你好”是最常用的问候语。',
        explanationVi: '“你好” là lời chào thông dụng nhất.'
      }),
      makeExercise({
        id: 'hsk1-l01-ex2',
        kind: 'fill_blank',
        skill: 'speaking',
        bloomLevel: 'apply',
        prompt: '补全句子：我___小明。',
        promptVi: 'Hoàn thành câu: 我___小明.',
        options: ['叫', '什么', '你好'],
        optionsVi: ['tên là', 'cái gì', 'xin chào'],
        correctAnswer: '叫',
        correctAnswerVi: '叫',
        explanation: '“我叫小明”表示自己的名字。',
        explanationVi: '“我叫小明” dùng để nói tên của mình.'
      })
    ],
    review: ['“你好”可以用来打招呼。', '“我叫...”可以介绍名字。'],
    reviewVi: ['“你好” dùng để chào hỏi.', '“我叫...” dùng để giới thiệu tên.']
  },
  {
    number: 2,
    level: 1,
    skill: 'reading',
    topic: 'numbers',
    titleZh: '一二三',
    titleEn: 'One, Two, Three',
    titleVi: 'Một, hai, ba',
    objectives: ['认读一到十。', '用数字说简单数量。'],
    objectivesVi: ['Nhận biết số từ một đến mười.', 'Dùng số để nói số lượng đơn giản.'],
    vocab: makeVocab([
      ['一', 'yī', 'one'],
      ['二', 'èr', 'two'],
      ['三', 'sān', 'three'],
      ['十', 'shí', 'ten']
    ]),
    grammar: [
      {
        pattern: '数字 + 个',
        explanation: '数字可以放在量词“个”前面。',
        explanation_vi: 'Số có thể đứng trước lượng từ “个”.',
        examples: [{ zh: '三个人', pinyin: 'sān ge rén', en: 'three people', vi: 'ba người' }]
      }
    ],
    warmUpItems: ['一', '二', '三'],
    modulePhases: [
      {
        type: 'character_match',
        content_zh: '一二三四五六七八九十',
        content_pinyin: 'yī èr sān sì wǔ liù qī bā jiǔ shí',
        content_en: 'one two three four five six seven eight nine ten',
        content_vi: 'một hai ba bốn năm sáu bảy tám chín mười'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk1-l02-ex1',
        skill: 'reading',
        prompt: '哪个字是“三”？',
        promptVi: 'Chữ nào là “ba”?',
        options: ['一', '二', '三'],
        optionsVi: ['một', 'hai', 'ba'],
        correctAnswer: '三',
        correctAnswerVi: 'ba',
        explanation: '“三”表示数字三。',
        explanationVi: '“三” biểu thị số ba.'
      })
    ],
    review: ['一、二、三是最基本的数字。'],
    reviewVi: ['一、二、三 là các số cơ bản nhất.']
  },
  {
    number: 3,
    level: 1,
    skill: 'speaking',
    topic: 'food',
    titleZh: '今天吃什么？',
    titleEn: 'What Are We Eating Today?',
    titleVi: 'Hôm nay ăn gì?',
    objectives: ['用“吃”说食物。', '问别人今天吃什么。'],
    objectivesVi: ['Dùng “吃” để nói món ăn.', 'Hỏi người khác hôm nay ăn gì.'],
    vocab: makeVocab([
      ['今天', 'jīn tiān', 'today'],
      ['吃', 'chī', 'to eat'],
      ['米饭', 'mǐ fàn', 'rice'],
      ['喝', 'hē', 'to drink']
    ]),
    grammar: [
      {
        pattern: '...吃什么？',
        explanation: '用“吃什么”询问食物。',
        explanation_vi: 'Dùng “吃什么” để hỏi về món ăn.',
        examples: [{ zh: '你吃什么？', pinyin: 'Nǐ chī shén me?', en: 'What do you eat?', vi: 'Bạn ăn gì?' }]
      }
    ],
    warmUpItems: ['吃', '喝', '米饭'],
    modulePhases: [
      {
        type: 'shadowing',
        content_zh: '今天你吃什么？我吃米饭。',
        content_pinyin: 'Jīn tiān nǐ chī shén me? Wǒ chī mǐ fàn.',
        content_en: 'What are you eating today? I am eating rice.',
        content_vi: 'Hôm nay bạn ăn gì? Tôi ăn cơm.'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk1-l03-ex1',
        kind: 'word_order',
        skill: 'speaking',
        bloomLevel: 'apply',
        prompt: '排词成句：我 / 吃 / 米饭',
        promptVi: 'Sắp xếp thành câu: 我 / 吃 / 米饭',
        tokens: ['我', '吃', '米饭'],
        correctAnswer: '我 吃 米饭',
        correctAnswerVi: 'Tôi ăn cơm.',
        explanation: '汉语常用“主语 + 动词 + 宾语”的顺序。',
        explanationVi: 'Tiếng Trung thường dùng thứ tự chủ ngữ + động từ + tân ngữ.'
      })
    ],
    review: ['“吃”说食物，“喝”说饮料。'],
    reviewVi: ['“吃” dùng với đồ ăn, “喝” dùng với đồ uống.']
  },
  {
    number: 4,
    level: 2,
    skill: 'reading',
    topic: 'shopping',
    titleZh: '多少钱？',
    titleEn: 'How Much Is It?',
    titleVi: 'Bao nhiêu tiền?',
    objectives: ['读懂简单购物对话。', '用“多少钱”询问价格。'],
    objectivesVi: ['Đọc hiểu hội thoại mua sắm đơn giản.', 'Dùng “多少钱” để hỏi giá.'],
    vocab: makeVocab([
      ['这个', 'zhè ge', 'this one'],
      ['多少', 'duō shao', 'how much'],
      ['钱', 'qián', 'money'],
      ['贵', 'guì', 'expensive']
    ]),
    grammar: [
      {
        pattern: '...多少钱？',
        explanation: '用“多少钱”询问东西的价格。',
        explanation_vi: 'Dùng “多少钱” để hỏi giá của đồ vật.',
        examples: [{ zh: '这个多少钱？', pinyin: 'Zhè ge duō shao qián?', en: 'How much is this?', vi: 'Cái này bao nhiêu tiền?' }]
      }
    ],
    warmUpItems: ['多少', '钱', '贵'],
    modulePhases: [
      {
        type: 'short_passage',
        content_zh: '这个杯子多少钱？二十块。太贵了！',
        content_pinyin: 'Zhè ge bēi zi duō shao qián? Èr shí kuài. Tài guì le!',
        content_en: 'How much is this cup? Twenty yuan. That is too expensive!',
        content_vi: 'Cái cốc này bao nhiêu tiền? Hai mươi tệ. Đắt quá!'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk2-l04-ex1',
        skill: 'reading',
        prompt: '哪句话可以问价格？',
        promptVi: 'Câu nào có thể hỏi giá?',
        options: ['多少钱？', '你好吗？', '在哪里？'],
        optionsVi: ['bao nhiêu tiền?', 'bạn khỏe không?', 'ở đâu?'],
        correctAnswer: '多少钱？',
        correctAnswerVi: 'bao nhiêu tiền?',
        explanation: '“多少钱”用来问价格。',
        explanationVi: '“多少钱” dùng để hỏi giá.'
      })
    ],
    review: ['买东西时可以说“多少钱”。'],
    reviewVi: ['Khi mua đồ có thể nói “多少钱”.']
  },
  {
    number: 5,
    level: 2,
    skill: 'listening',
    topic: 'transportation',
    titleZh: '去学校',
    titleEn: 'Going to School',
    titleVi: 'Đi học',
    objectives: ['听懂简单交通方式。', '说出目的地和交通工具。'],
    objectivesVi: ['Nghe hiểu phương tiện đi lại đơn giản.', 'Nói điểm đến và phương tiện.'],
    vocab: makeVocab([
      ['去', 'qù', 'to go'],
      ['学校', 'xué xiào', 'school'],
      ['坐', 'zuò', 'to ride; to sit'],
      ['公共汽车', 'gōng gòng qì chē', 'bus']
    ]),
    grammar: [
      {
        pattern: '坐 + 交通工具 + 去...',
        explanation: '用“坐”说明去某地的交通方式。',
        explanation_vi: 'Dùng “坐” để nói cách đi đến một nơi.',
        examples: [{ zh: '我坐公共汽车去学校。', pinyin: 'Wǒ zuò gōng gòng qì chē qù xué xiào.', en: 'I take the bus to school.', vi: 'Tôi đi xe buýt đến trường.' }]
      }
    ],
    warmUpItems: ['去', '学校', '坐'],
    modulePhases: [
      {
        type: 'dialogue_listen',
        dialogue: [
          { speaker: 'A', zh: '你怎么去学校？', pinyin: 'Nǐ zěn me qù xué xiào?', en: 'How do you go to school?', vi: 'Bạn đi học bằng gì?' },
          { speaker: 'B', zh: '我坐公共汽车去学校。', pinyin: 'Wǒ zuò gōng gòng qì chē qù xué xiào.', en: 'I take the bus to school.', vi: 'Tôi đi xe buýt đến trường.' }
        ]
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk2-l05-ex1',
        skill: 'listening',
        prompt: '听对话，B坐什么去学校？',
        promptVi: 'Nghe hội thoại, B đi học bằng gì?',
        options: ['公共汽车', '火车', '出租车'],
        optionsVi: ['xe buýt', 'tàu hỏa', 'taxi'],
        correctAnswer: '公共汽车',
        correctAnswerVi: 'xe buýt',
        explanation: 'B说“我坐公共汽车去学校”。',
        explanationVi: 'B nói “我坐公共汽车去学校”.'
      })
    ],
    review: ['“坐”常放在交通工具前面。'],
    reviewVi: ['“坐” thường đứng trước phương tiện giao thông.']
  },
  {
    number: 6,
    level: 2,
    skill: 'writing',
    topic: 'family',
    titleZh: '我的家',
    titleEn: 'My Family',
    titleVi: 'Gia đình tôi',
    objectives: ['写一个简单家庭句子。', '用“有”说明家里有什么人。'],
    objectivesVi: ['Viết một câu đơn giản về gia đình.', 'Dùng “有” để nói trong nhà có ai.'],
    vocab: makeVocab([
      ['家', 'jiā', 'family; home'],
      ['爸爸', 'bà ba', 'father'],
      ['妈妈', 'mā ma', 'mother'],
      ['有', 'yǒu', 'to have']
    ]),
    grammar: [
      {
        pattern: '我家有...',
        explanation: '用“有”表示某处或某人拥有。',
        explanation_vi: 'Dùng “有” để diễn tả nơi nào/người nào có gì.',
        examples: [{ zh: '我家有三个人。', pinyin: 'Wǒ jiā yǒu sān ge rén.', en: 'There are three people in my family.', vi: 'Nhà tôi có ba người.' }]
      }
    ],
    warmUpItems: ['家', '爸爸', '妈妈'],
    modulePhases: [
      {
        type: 'sentence_building',
        prompt: '写一个关于家的句子。',
        prompt_vi: 'Viết một câu về gia đình.',
        model_answer_zh: '我家有爸爸和妈妈。',
        model_answer_pinyin: 'Wǒ jiā yǒu bà ba hé mā ma.',
        model_answer_en: 'My family has my father and mother.',
        model_answer_vi: 'Nhà tôi có bố và mẹ.'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk2-l06-ex1',
        kind: 'word_order',
        skill: 'writing',
        bloomLevel: 'apply',
        prompt: '排词成句：我家 / 有 / 三个人',
        promptVi: 'Sắp xếp thành câu: 我家 / 有 / 三个人',
        tokens: ['我家', '有', '三个人'],
        correctAnswer: '我家 有 三个人',
        correctAnswerVi: 'Nhà tôi có ba người.',
        explanation: '“我家有...”可以介绍家里的人。',
        explanationVi: '“我家有...” có thể giới thiệu người trong gia đình.'
      })
    ],
    review: ['“我家有...”适合写家庭介绍。'],
    reviewVi: ['“我家有...” phù hợp để viết giới thiệu gia đình.']
  },
  {
    number: 7,
    level: 3,
    skill: 'reading',
    topic: 'education',
    titleZh: '今天的中文课',
    titleEn: "Today's Chinese Class",
    titleVi: 'Tiết tiếng Trung hôm nay',
    objectives: ['读懂一段关于课堂的短文。', '找出老师给学生的建议。'],
    objectivesVi: ['Đọc hiểu đoạn văn ngắn về lớp học.', 'Tìm lời khuyên giáo viên đưa cho học sinh.'],
    vocab: makeVocab([
      ['中文课', 'zhōng wén kè', 'Chinese class'],
      ['老师', 'lǎo shī', 'teacher'],
      ['多', 'duō', 'more'],
      ['练习', 'liàn xí', 'to practice']
    ]),
    grammar: [
      {
        pattern: '要 + 动词',
        explanation: '“要”放在动词前，表示需要或打算做一件事。',
        explanation_vi: '“要” đứng trước động từ, diễn tả cần hoặc định làm việc gì.',
        examples: [{ zh: '我要多练习。', pinyin: 'Wǒ yào duō liàn xí.', en: 'I need to practice more.', vi: 'Tôi cần luyện tập nhiều hơn.' }]
      }
    ],
    warmUpItems: ['中文课', '老师', '练习'],
    modulePhases: [
      {
        type: 'reading_passage',
        content_zh: '我们今天有中文课。老师说，学习中文要多听、多说，还要每天练习新句子。下课以后，我和同学一起读课文，也一起回答问题。',
        content_pinyin: 'Wǒ men jīn tiān yǒu Zhōng wén kè. Lǎo shī shuō, xué xí Zhōng wén yào duō tīng, duō shuō, hái yào měi tiān liàn xí xīn jù zi. Xià kè yǐ hòu, wǒ hé tóng xué yì qǐ dú kè wén, yě yì qǐ huí dá wèn tí.',
        content_en: 'We have Chinese class today. The teacher says learning Chinese requires more listening and speaking, and daily sentence practice. After class, my classmate and I read the text and answer questions together.',
        content_vi: 'Hôm nay chúng tôi có tiết tiếng Trung. Giáo viên nói học tiếng Trung cần nghe nhiều, nói nhiều và luyện câu mới mỗi ngày. Sau giờ học, tôi cùng bạn đọc bài khóa và trả lời câu hỏi.'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk3-l07-ex1',
        skill: 'reading',
        bloomLevel: 'analyze',
        prompt: '老师建议学生怎么学习中文？',
        promptVi: 'Giáo viên khuyên học sinh học tiếng Trung như thế nào?',
        options: ['多听、多说、每天练习', '只买一本书', '每天早睡'],
        optionsVi: ['nghe nhiều, nói nhiều, luyện tập mỗi ngày', 'chỉ mua một quyển sách', 'ngủ sớm mỗi ngày'],
        correctAnswer: '多听、多说、每天练习',
        correctAnswerVi: 'nghe nhiều, nói nhiều, luyện tập mỗi ngày',
        explanation: '短文中说“要多听、多说，还要每天练习新句子”。',
        explanationVi: 'Đoạn văn nói “要多听、多说，还要每天练习新句子”.'
      })
    ],
    review: ['B1阅读要抓住清楚短文的主要信息。'],
    reviewVi: ['Đọc B1 cần nắm thông tin chính trong đoạn văn rõ ràng.']
  },
  {
    number: 8,
    level: 3,
    skill: 'listening',
    topic: 'health',
    titleZh: '你怎么了？',
    titleEn: 'What Happened?',
    titleVi: 'Bạn sao vậy?',
    objectives: ['听懂身体不舒服的简单说明。', '根据对话选择合适的建议。'],
    objectivesVi: ['Nghe hiểu mô tả đơn giản về sức khỏe.', 'Dựa vào hội thoại chọn lời khuyên phù hợp.'],
    vocab: makeVocab([
      ['怎么了', 'zěn me le', 'what happened'],
      ['不舒服', 'bù shū fu', 'unwell'],
      ['医生', 'yī shēng', 'doctor'],
      ['休息', 'xiū xi', 'to rest']
    ]),
    grammar: [
      {
        pattern: '有点儿 + 形容词',
        explanation: '“有点儿”可以让描述听起来不太强烈。',
        explanation_vi: '“有点儿” làm cho miêu tả nhẹ hơn.',
        examples: [{ zh: '我有点儿不舒服。', pinyin: 'Wǒ yǒu diǎnr bù shū fu.', en: 'I feel a little unwell.', vi: 'Tôi hơi không khỏe.' }]
      }
    ],
    warmUpItems: ['不舒服', '医生', '休息'],
    modulePhases: [
      {
        type: 'dialogue_comprehension',
        dialogue: [
          { speaker: 'A', zh: '你怎么了？', pinyin: 'Nǐ zěn me le?', en: 'What happened?', vi: 'Bạn sao vậy?' },
          { speaker: 'B', zh: '我有点儿不舒服，昨天晚上没睡好。', pinyin: 'Wǒ yǒu diǎnr bù shū fu, zuó tiān wǎn shang méi shuì hǎo.', en: 'I feel a little unwell and did not sleep well last night.', vi: 'Tôi hơi không khỏe, tối qua ngủ không ngon.' },
          { speaker: 'A', zh: '你要多休息，也可以去看医生。', pinyin: 'Nǐ yào duō xiū xi, yě kě yǐ qù kàn yī shēng.', en: 'You should rest more and can see a doctor.', vi: 'Bạn nên nghỉ nhiều hơn, cũng có thể đi khám bác sĩ.' }
        ]
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk3-l08-ex1',
        skill: 'listening',
        bloomLevel: 'analyze',
        prompt: 'B为什么不舒服？',
        promptVi: 'Vì sao B không khỏe?',
        options: ['昨天晚上没睡好', '今天买了书', '明天去旅行'],
        optionsVi: ['tối qua ngủ không ngon', 'hôm nay mua sách', 'ngày mai đi du lịch'],
        correctAnswer: '昨天晚上没睡好',
        correctAnswerVi: 'tối qua ngủ không ngon',
        explanation: 'B说“昨天晚上没睡好”。',
        explanationVi: 'B nói “昨天晚上没睡好”.'
      })
    ],
    review: ['听力中要注意原因和建议。'],
    reviewVi: ['Trong nghe hiểu cần chú ý nguyên nhân và lời khuyên.']
  },
  {
    number: 9,
    level: 3,
    skill: 'speaking',
    topic: 'travel',
    titleZh: '车站在哪里？',
    titleEn: 'Where Is the Station?',
    titleVi: 'Nhà ga ở đâu?',
    objectives: ['在旅行中询问地点。', '用礼貌开头说明自己的需要。'],
    objectivesVi: ['Hỏi địa điểm khi đi du lịch.', 'Dùng cách mở đầu lịch sự để nói nhu cầu.'],
    vocab: makeVocab([
      ['火车', 'huǒ chē', 'train'],
      ['北京', 'Běi jīng', 'Beijing'],
      ['车站', 'chē zhàn', 'station'],
      ['请问', 'qǐng wèn', 'excuse me; may I ask']
    ]),
    grammar: [
      {
        pattern: '请问...',
        explanation: '“请问”放在问题前，让问题更礼貌。',
        explanation_vi: '“请问” đặt trước câu hỏi để lịch sự hơn.',
        examples: [{ zh: '请问，车站在哪里？', pinyin: 'Qǐng wèn, chē zhàn zài nǎ lǐ?', en: 'Excuse me, where is the station?', vi: 'Xin hỏi, nhà ga ở đâu?' }]
      }
    ],
    warmUpItems: ['请问', '车站', '火车'],
    modulePhases: [
      {
        type: 'role_play',
        scenario: 'Ask a passerby where the train station is.',
        scenario_vi: 'Hỏi người đi đường nhà ga ở đâu.',
        model_dialogue_zh: '我想坐火车去北京。请问，车站在哪里？从这里走路远吗？',
        model_dialogue_pinyin: 'Wǒ xiǎng zuò huǒ chē qù Běi jīng. Qǐng wèn, chē zhàn zài nǎ lǐ? Cóng zhè lǐ zǒu lù yuǎn ma?',
        model_dialogue_en: 'I want to take the train to Beijing. Excuse me, where is the station? Is it far to walk from here?',
        model_dialogue_vi: 'Tôi muốn đi tàu hỏa đến Bắc Kinh. Xin hỏi, nhà ga ở đâu? Đi bộ từ đây có xa không?'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk3-l09-ex1',
        kind: 'word_order',
        skill: 'speaking',
        bloomLevel: 'create',
        prompt: '排词成句：请问 / 车站 / 在哪里',
        promptVi: 'Sắp xếp thành câu: 请问 / 车站 / 在哪里',
        tokens: ['请问', '车站', '在哪里'],
        correctAnswer: '请问 车站 在哪里',
        correctAnswerVi: 'Xin hỏi, nhà ga ở đâu?',
        explanation: '先说“请问”，再问地点。',
        explanationVi: 'Nói “请问” trước, sau đó hỏi địa điểm.'
      })
    ],
    review: ['旅行场景中，“请问”能让问题更自然。'],
    reviewVi: ['Trong bối cảnh du lịch, “请问” giúp câu hỏi tự nhiên hơn.']
  },
  {
    number: 10,
    level: 3,
    skill: 'mixed',
    topic: 'weather',
    titleZh: '明天会下雨吗？',
    titleEn: 'Will It Rain Tomorrow?',
    titleVi: 'Ngày mai có mưa không?',
    objectives: ['读懂简单天气安排。', '用“会”讨论可能发生的事。'],
    objectivesVi: ['Đọc hiểu kế hoạch thời tiết đơn giản.', 'Dùng “会” để nói việc có thể xảy ra.'],
    vocab: makeVocab([
      ['明天', 'míng tiān', 'tomorrow'],
      ['会', 'huì', 'will; can'],
      ['下雨', 'xià yǔ', 'to rain'],
      ['天气', 'tiān qì', 'weather']
    ]),
    grammar: [
      {
        pattern: '会 + 动词',
        explanation: '“会”可以表示将来可能发生的事情。',
        explanation_vi: '“会” có thể diễn tả việc có thể xảy ra trong tương lai.',
        examples: [{ zh: '明天会下雨。', pinyin: 'Míng tiān huì xià yǔ.', en: 'It will rain tomorrow.', vi: 'Ngày mai sẽ mưa.' }]
      }
    ],
    warmUpItems: ['明天', '天气', '下雨'],
    modulePhases: [
      {
        type: 'reading_and_speaking',
        content_zh: '明天天气不太好，可能会下雨。我们上午在家学习中文，下午如果不下雨，就去公园散步。你觉得这个计划怎么样？',
        content_pinyin: 'Míng tiān tiān qì bú tài hǎo, kě néng huì xià yǔ. Wǒ men shàng wǔ zài jiā xué xí Zhōng wén, xià wǔ rú guǒ bú xià yǔ, jiù qù gōng yuán sàn bù. Nǐ jué de zhè ge jì huà zěn me yàng?',
        content_en: 'The weather will not be very good tomorrow and it may rain. We will study Chinese at home in the morning, and if it does not rain in the afternoon, we will walk in the park. What do you think of this plan?',
        content_vi: 'Thời tiết ngày mai không tốt lắm, có thể mưa. Buổi sáng chúng ta học tiếng Trung ở nhà, buổi chiều nếu không mưa thì đi dạo công viên. Bạn thấy kế hoạch này thế nào?'
      }
    ],
    exercises: [
      makeExercise({
        id: 'hsk3-l10-ex1',
        skill: 'mixed',
        bloomLevel: 'analyze',
        prompt: '如果下午不下雨，他们会做什么？',
        promptVi: 'Nếu buổi chiều không mưa, họ sẽ làm gì?',
        options: ['去公园散步', '在家睡觉', '买火车票'],
        optionsVi: ['đi dạo công viên', 'ngủ ở nhà', 'mua vé tàu'],
        correctAnswer: '去公园散步',
        correctAnswerVi: 'đi dạo công viên',
        explanation: '短文说“如果不下雨，就去公园散步”。',
        explanationVi: 'Đoạn văn nói “如果不下雨，就去公园散步”.'
      })
    ],
    review: ['B1任务可以围绕清楚的计划和原因进行理解与表达。'],
    reviewVi: ['Nhiệm vụ B1 có thể xoay quanh việc hiểu và diễn đạt kế hoạch, lý do rõ ràng.']
  }
];

const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const run = async () => {
  if (CLEAN) {
    // Generation overwrites known sample filenames; no recursive delete is needed.
  }

  await mkdir(outputRoot, { recursive: true });
  const validator = new ContentValidator({ skipDatabaseChecks: true });
  const generated = [];
  const validationResults = [];

  for (const spec of lessonSpecs) {
    const lesson = makeLesson(spec);
    const validation = await validator.validateLesson(lesson, lesson.metadata.hsk_level);
    const filename = `${lesson.lesson_id}.json`;

    await writeJson(path.join(outputRoot, filename), lesson);
    generated.push({
      lesson_id: lesson.lesson_id,
      file: filename,
      hsk_level: lesson.metadata.hsk_level,
      cefr_level: lesson.metadata.cefr_level,
      cefr_activities: lesson.metadata.cefr_activities,
      primary_skill: lesson.metadata.primary_skill,
      topic: lesson.metadata.topic,
      title_zh: lesson.metadata.title_zh,
      title_en: lesson.metadata.title_en
    });
    validationResults.push({
      lesson_id: lesson.lesson_id,
      ok: validation.ok,
      summary: validation.summary,
      warnings: validation.warnings
    });
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    schema: '../schemas/lesson-template.schema.json',
    count: generated.length,
    lessons: generated
  };
  const report = {
    generated_at: manifest.generated_at,
    count: generated.length,
    ok: validationResults.every((item) => item.ok),
    results: validationResults
  };

  await writeJson(path.join(outputRoot, 'manifest.json'), manifest);
  await writeJson(path.join(outputRoot, 'validation-report.json'), report);

  console.log(JSON.stringify({
    outputRoot,
    count: generated.length,
    validationOk: report.ok
  }, null, 2));
};

await run();
