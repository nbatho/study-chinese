import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ContentValidator } from '../src/services/content-validator.js';
import { contentPath } from '../src/config/content-paths.js';

const outputRoot = contentPath('lessons', 'generated');
const args = process.argv.slice(2);
const CLEAN = args.includes('--clean');

const CEFR_BY_HSK = new Map([
  [1, 'A1'],
  [2, 'A1'],
  [3, 'A2'],
  [4, 'B1'],
  [5, 'B2'],
  [6, 'B2'],
  [7, 'C1'],
  [8, 'C1'],
  [9, 'C2']
]);

const skillToModule = (skill) => (skill === 'mixed' ? 'reading' : skill);

const zh = {
  todayEat: '\u4eca\u5929\u4f60\u5403\u4ec0\u4e48\uff1f\u6211\u5403\u7c73\u996d\u3002',
  greet: '\u4f60\u597d\uff01\u6211\u53eb\u5c0f\u660e\u3002\u4f60\u53eb\u4ec0\u4e48\uff1f',
  shopping: '\u8fd9\u4e2a\u676f\u5b50\u591a\u5c11\u94b1\uff1f\u4e8c\u5341\u5757\u3002\u592a\u8d35\u4e86\uff01',
  school: '\u6211\u4eec\u4eca\u5929\u6709\u4e2d\u6587\u8bfe\u3002\u8001\u5e08\u8bf4\u8981\u591a\u542c\u3001\u591a\u8bf4\uff0c\u8fd8\u8981\u6bcf\u5929\u7ec3\u4e60\u65b0\u53e5\u5b50\u3002',
  travel: '\u6211\u60f3\u5750\u706b\u8f66\u53bb\u5317\u4eac\u3002\u8bf7\u95ee\uff0c\u8f66\u7ad9\u5728\u54ea\u91cc\uff1f'
};

const makeVocab = (items) =>
  items.map(([simplified, pinyin, english, isNew = true]) => ({
    simplified,
    pinyin,
    english,
    is_new: isNew
  }));

const baseExercise = ({ id, skill, prompt, options, correctAnswer, explanation }) => ({
  id,
  kind: 'multiple_choice',
  skill,
  bloom_level: 'understand',
  prompt,
  options,
  correct_answer: correctAnswer,
  acceptable_variants: [correctAnswer],
  explanation
});

const wordOrderExercise = ({ id, skill, prompt, tokens, correctAnswer, explanation }) => ({
  id,
  kind: 'word_order',
  skill,
  bloom_level: 'apply',
  prompt,
  tokens,
  correct_answer: correctAnswer,
  acceptable_variants: [correctAnswer.replaceAll(' ', '')],
  explanation
});

const makeLesson = ({
  number,
  level,
  skill,
  topic,
  titleZh,
  titleEn,
  objectives,
  vocab,
  grammar,
  warmUpItems,
  modulePhases,
  exercises,
  review
}) => {
  const lessonId = `hsk${level}-l${String(number).padStart(2, '0')}-${skill}-${topic}`;

  return {
    lesson_id: lessonId,
    metadata: {
      title_zh: titleZh,
      title_en: titleEn,
      hsk_level: level,
      cefr_level: CEFR_BY_HSK.get(level) || 'C2',
      primary_skill: skill,
      secondary_skills: skill === 'listening' ? ['speaking'] : skill === 'reading' ? ['writing'] : [],
      topic,
      estimated_minutes: level <= 1 ? 8 : level <= 2 ? 10 : 12,
      xp_reward: 20 + level * 5,
      tags: [topic, skill, `hsk${level}`]
    },
    learning_objectives: objectives,
    vocabulary_focus: vocab,
    grammar_focus: grammar,
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
    titleZh: '\u4f60\u597d\uff01',
    titleEn: 'Hello!',
    objectives: ['Recognize simple greetings.', 'Answer with your name.'],
    vocab: makeVocab([
      ['\u4f60\u597d', 'nǐ hǎo', 'hello'],
      ['\u6211', 'wǒ', 'I; me'],
      ['\u53eb', 'jiào', 'to be called'],
      ['\u4ec0\u4e48', 'shén me', 'what']
    ]),
    grammar: [
      {
        pattern: '\u6211\u53eb...',
        explanation: 'Use this pattern to say your name.',
        examples: [{ zh: '\u6211\u53eb\u5c0f\u660e\u3002', pinyin: 'Wǒ jiào Xiǎo Míng.', en: 'My name is Xiao Ming.' }]
      }
    ],
    warmUpItems: ['\u4f60\u597d', '\u6211', '\u53eb'],
    modulePhases: [
      {
        type: 'dialogue_listen',
        dialogue: [
          { speaker: 'A', zh: '\u4f60\u597d\uff01', pinyin: 'Nǐ hǎo!', en: 'Hello!' },
          { speaker: 'B', zh: '\u4f60\u597d\uff01\u6211\u53eb\u5c0f\u660e\u3002', pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎo Míng.', en: 'Hello! My name is Xiao Ming.' },
          { speaker: 'A', zh: '\u4f60\u53eb\u4ec0\u4e48\uff1f', pinyin: 'Nǐ jiào shén me?', en: 'What is your name?' }
        ]
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk1-l01-ex1',
        skill: 'listening',
        prompt: 'What does \u4f60\u597d mean?',
        options: ['hello', 'thank you', 'goodbye'],
        correctAnswer: 'hello',
        explanation: '\u4f60\u597d is the basic greeting hello.'
      })
    ],
    review: ['\u4f60\u597d means hello.', 'Use \u6211\u53eb... to say your name.']
  },
  {
    number: 2,
    level: 1,
    skill: 'reading',
    topic: 'numbers',
    titleZh: '\u4e00\u4e8c\u4e09',
    titleEn: 'One, Two, Three',
    objectives: ['Read numbers from one to ten.', 'Match numbers with simple quantities.'],
    vocab: makeVocab([
      ['\u4e00', 'yī', 'one'],
      ['\u4e8c', 'èr', 'two'],
      ['\u4e09', 'sān', 'three'],
      ['\u5341', 'shí', 'ten']
    ]),
    grammar: [
      {
        pattern: '\u6570\u5b57 + \u4e2a',
        explanation: 'A number can appear before a measure word.',
        examples: [{ zh: '\u4e09\u4e2a\u4eba', pinyin: 'sān ge rén', en: 'three people' }]
      }
    ],
    warmUpItems: ['\u4e00', '\u4e8c', '\u4e09'],
    modulePhases: [
      {
        type: 'character_match',
        content_zh: '\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341',
        content_pinyin: 'yī èr sān sì wǔ liù qī bā jiǔ shí',
        content_en: 'one two three four five six seven eight nine ten'
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk1-l02-ex1',
        skill: 'reading',
        prompt: 'Which character means three?',
        options: ['\u4e00', '\u4e8c', '\u4e09'],
        correctAnswer: '\u4e09',
        explanation: '\u4e09 means three.'
      })
    ],
    review: ['\u4e00, \u4e8c, \u4e09 are the first three numbers.']
  },
  {
    number: 3,
    level: 1,
    skill: 'speaking',
    topic: 'food',
    titleZh: '\u4eca\u5929\u5403\u4ec0\u4e48\uff1f',
    titleEn: 'What Are We Eating Today?',
    objectives: ['Ask what someone eats.', 'Answer with a simple food word.'],
    vocab: makeVocab([
      ['\u4eca\u5929', 'jīn tiān', 'today'],
      ['\u5403', 'chī', 'to eat'],
      ['\u7c73\u996d', 'mǐ fàn', 'rice'],
      ['\u559d', 'hē', 'to drink']
    ]),
    grammar: [
      {
        pattern: '...\u5403\u4ec0\u4e48\uff1f',
        explanation: 'Ask what someone eats.',
        examples: [{ zh: '\u4f60\u5403\u4ec0\u4e48\uff1f', pinyin: 'Nǐ chī shén me?', en: 'What do you eat?' }]
      }
    ],
    warmUpItems: ['\u5403', '\u559d', '\u7c73\u996d'],
    modulePhases: [
      {
        type: 'shadowing',
        content_zh: zh.todayEat,
        content_pinyin: 'Jīn tiān nǐ chī shén me? Wǒ chī mǐ fàn.',
        content_en: 'What are you eating today? I am eating rice.'
      }
    ],
    exercises: [
      wordOrderExercise({
        id: 'hsk1-l03-ex1',
        skill: 'speaking',
        prompt: 'Arrange the words: I eat rice.',
        tokens: ['\u6211', '\u5403', '\u7c73\u996d'],
        correctAnswer: '\u6211 \u5403 \u7c73\u996d',
        explanation: 'Chinese word order is subject + verb + object.'
      })
    ],
    review: ['Use \u5403 for eating and \u559d for drinking.']
  },
  {
    number: 4,
    level: 2,
    skill: 'reading',
    topic: 'shopping',
    titleZh: '\u591a\u5c11\u94b1\uff1f',
    titleEn: 'How Much Is It?',
    objectives: ['Read a short shopping exchange.', 'Ask and answer prices.'],
    vocab: makeVocab([
      ['\u8fd9\u4e2a', 'zhè ge', 'this one'],
      ['\u591a\u5c11', 'duō shao', 'how much'],
      ['\u94b1', 'qián', 'money'],
      ['\u8d35', 'guì', 'expensive']
    ]),
    grammar: [
      {
        pattern: '...\u591a\u5c11\u94b1\uff1f',
        explanation: 'Ask for a price.',
        examples: [{ zh: '\u8fd9\u4e2a\u591a\u5c11\u94b1\uff1f', pinyin: 'Zhè ge duō shao qián?', en: 'How much is this?' }]
      }
    ],
    warmUpItems: ['\u591a\u5c11', '\u94b1', '\u8d35'],
    modulePhases: [
      {
        type: 'short_passage',
        content_zh: zh.shopping,
        content_pinyin: 'Zhè ge bēi zi duō shao qián? Èr shí kuài. Tài guì le!',
        content_en: 'How much is this cup? Twenty yuan. That is too expensive!'
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk2-l04-ex1',
        skill: 'reading',
        prompt: 'What question asks for a price?',
        options: ['\u591a\u5c11\u94b1\uff1f', '\u4f60\u597d\u5417\uff1f', '\u5728\u54ea\u91cc\uff1f'],
        correctAnswer: '\u591a\u5c11\u94b1\uff1f',
        explanation: '\u591a\u5c11\u94b1 means how much money.'
      })
    ],
    review: ['Use \u591a\u5c11\u94b1 to ask prices.']
  },
  {
    number: 5,
    level: 2,
    skill: 'listening',
    topic: 'transportation',
    titleZh: '\u53bb\u5b66\u6821',
    titleEn: 'Going to School',
    objectives: ['Understand simple transport choices.', 'Identify destination words.'],
    vocab: makeVocab([
      ['\u53bb', 'qù', 'to go'],
      ['\u5b66\u6821', 'xué xiào', 'school'],
      ['\u5750', 'zuò', 'to ride; to sit'],
      ['\u516c\u5171\u6c7d\u8f66', 'gōng gòng qì chē', 'bus']
    ]),
    grammar: [
      {
        pattern: '\u5750 + transport + \u53bb...',
        explanation: 'Say how someone goes somewhere.',
        examples: [{ zh: '\u6211\u5750\u516c\u5171\u6c7d\u8f66\u53bb\u5b66\u6821\u3002', pinyin: 'Wǒ zuò gōng gòng qì chē qù xué xiào.', en: 'I take the bus to school.' }]
      }
    ],
    warmUpItems: ['\u53bb', '\u5b66\u6821', '\u5750'],
    modulePhases: [
      {
        type: 'dialogue_listen',
        dialogue: [
          { speaker: 'A', zh: '\u4f60\u600e\u4e48\u53bb\u5b66\u6821\uff1f', pinyin: 'Nǐ zěn me qù xué xiào?', en: 'How do you go to school?' },
          { speaker: 'B', zh: '\u6211\u5750\u516c\u5171\u6c7d\u8f66\u53bb\u5b66\u6821\u3002', pinyin: 'Wǒ zuò gōng gòng qì chē qù xué xiào.', en: 'I take the bus to school.' }
        ]
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk2-l05-ex1',
        skill: 'listening',
        prompt: 'What transport does B use?',
        options: ['bus', 'train', 'taxi'],
        correctAnswer: 'bus',
        explanation: '\u516c\u5171\u6c7d\u8f66 means bus.'
      })
    ],
    review: ['Use \u5750 before many transport words.']
  },
  {
    number: 6,
    level: 2,
    skill: 'writing',
    topic: 'family',
    titleZh: '\u6211\u7684\u5bb6',
    titleEn: 'My Family',
    objectives: ['Write a simple family sentence.', 'Use \u6709 to say what a family has.'],
    vocab: makeVocab([
      ['\u5bb6', 'jiā', 'family; home'],
      ['\u7238\u7238', 'bà ba', 'father'],
      ['\u5988\u5988', 'mā ma', 'mother'],
      ['\u6709', 'yǒu', 'to have']
    ]),
    grammar: [
      {
        pattern: '\u6211\u5bb6\u6709...',
        explanation: 'Use \u6709 to say there is or someone has.',
        examples: [{ zh: '\u6211\u5bb6\u6709\u4e09\u4e2a\u4eba\u3002', pinyin: 'Wǒ jiā yǒu sān ge rén.', en: 'There are three people in my family.' }]
      }
    ],
    warmUpItems: ['\u5bb6', '\u7238\u7238', '\u5988\u5988'],
    modulePhases: [
      {
        type: 'sentence_building',
        prompt: 'Write one sentence about your family.',
        model_answer_zh: '\u6211\u5bb6\u6709\u7238\u7238\u548c\u5988\u5988\u3002',
        model_answer_pinyin: 'Wǒ jiā yǒu bà ba hé mā ma.',
        model_answer_en: 'My family has my father and mother.'
      }
    ],
    exercises: [
      wordOrderExercise({
        id: 'hsk2-l06-ex1',
        skill: 'writing',
        prompt: 'Arrange the sentence: My family has three people.',
        tokens: ['\u6211\u5bb6', '\u6709', '\u4e09\u4e2a\u4eba'],
        correctAnswer: '\u6211\u5bb6 \u6709 \u4e09\u4e2a\u4eba',
        explanation: 'Use place/person + \u6709 + noun phrase.'
      })
    ],
    review: ['\u6211\u5bb6\u6709... is useful for family descriptions.']
  },
  {
    number: 7,
    level: 3,
    skill: 'reading',
    topic: 'education',
    titleZh: '\u4eca\u5929\u7684\u4e2d\u6587\u8bfe',
    titleEn: "Today's Chinese Class",
    objectives: ['Read a short paragraph about class.', 'Find the teacher advice in a passage.'],
    vocab: makeVocab([
      ['\u4e2d\u6587\u8bfe', 'zhōng wén kè', 'Chinese class'],
      ['\u8001\u5e08', 'lǎo shī', 'teacher'],
      ['\u591a', 'duō', 'more'],
      ['\u7ec3\u4e60', 'liàn xí', 'to practice']
    ]),
    grammar: [
      {
        pattern: '\u8981 + verb',
        explanation: 'Use \u8981 before a verb to express need or intention.',
        examples: [{ zh: '\u6211\u8981\u591a\u7ec3\u4e60\u3002', pinyin: 'Wǒ yào duō liàn xí.', en: 'I need to practice more.' }]
      }
    ],
    warmUpItems: ['\u4e2d\u6587\u8bfe', '\u8001\u5e08', '\u7ec3\u4e60'],
    modulePhases: [
      {
        type: 'reading_passage',
        content_zh: zh.school,
        content_pinyin: 'Wǒ men jīn tiān yǒu Zhōng wén kè. Lǎo shī shuō yào duō tīng, duō shuō, hái yào měi tiān liàn xí xīn jù zi.',
        content_en: 'We have Chinese class today. The teacher says we should listen more, speak more, and practice new sentences every day.'
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk3-l07-ex1',
        skill: 'reading',
        prompt: 'What does the teacher suggest?',
        options: ['listen and speak more', 'sleep earlier', 'buy a book'],
        correctAnswer: 'listen and speak more',
        explanation: '\u591a\u542c\u3001\u591a\u8bf4 means listen more and speak more.'
      })
    ],
    review: ['Use \u8981 before a verb for need or intention.']
  },
  {
    number: 8,
    level: 3,
    skill: 'listening',
    topic: 'health',
    titleZh: '\u4f60\u600e\u4e48\u4e86\uff1f',
    titleEn: 'What Happened?',
    objectives: ['Understand a simple health complaint.', 'Choose an appropriate response.'],
    vocab: makeVocab([
      ['\u600e\u4e48\u4e86', 'zěn me le', 'what happened'],
      ['\u4e0d\u8212\u670d', 'bù shū fu', 'unwell'],
      ['\u533b\u751f', 'yī shēng', 'doctor'],
      ['\u4f11\u606f', 'xiū xi', 'to rest']
    ]),
    grammar: [
      {
        pattern: '\u6709\u70b9\u513f + adjective',
        explanation: 'Use this to soften a description.',
        examples: [{ zh: '\u6211\u6709\u70b9\u513f\u4e0d\u8212\u670d\u3002', pinyin: 'Wǒ yǒu diǎnr bù shū fu.', en: 'I feel a little unwell.' }]
      }
    ],
    warmUpItems: ['\u4e0d\u8212\u670d', '\u533b\u751f', '\u4f11\u606f'],
    modulePhases: [
      {
        type: 'dialogue_comprehension',
        dialogue: [
          { speaker: 'A', zh: '\u4f60\u600e\u4e48\u4e86\uff1f', pinyin: 'Nǐ zěn me le?', en: 'What happened?' },
          { speaker: 'B', zh: '\u6211\u6709\u70b9\u513f\u4e0d\u8212\u670d\u3002', pinyin: 'Wǒ yǒu diǎnr bù shū fu.', en: 'I feel a little unwell.' },
          { speaker: 'A', zh: '\u4f60\u8981\u591a\u4f11\u606f\u3002', pinyin: 'Nǐ yào duō xiū xi.', en: 'You should rest more.' }
        ]
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk3-l08-ex1',
        skill: 'listening',
        prompt: 'How does B feel?',
        options: ['a little unwell', 'very happy', 'very busy'],
        correctAnswer: 'a little unwell',
        explanation: '\u6709\u70b9\u513f\u4e0d\u8212\u670d means a little unwell.'
      })
    ],
    review: ['\u4f60\u600e\u4e48\u4e86\uff1f asks what happened.']
  },
  {
    number: 9,
    level: 3,
    skill: 'speaking',
    topic: 'travel',
    titleZh: '\u8f66\u7ad9\u5728\u54ea\u91cc\uff1f',
    titleEn: 'Where Is the Station?',
    objectives: ['Ask for a location while traveling.', 'Say where you want to go.'],
    vocab: makeVocab([
      ['\u706b\u8f66', 'huǒ chē', 'train'],
      ['\u5317\u4eac', 'Běi jīng', 'Beijing'],
      ['\u8f66\u7ad9', 'chē zhàn', 'station'],
      ['\u8bf7\u95ee', 'qǐng wèn', 'excuse me; may I ask']
    ]),
    grammar: [
      {
        pattern: '\u8bf7\u95ee...',
        explanation: 'Use this polite opener before asking a question.',
        examples: [{ zh: '\u8bf7\u95ee\uff0c\u8f66\u7ad9\u5728\u54ea\u91cc\uff1f', pinyin: 'Qǐng wèn, chē zhàn zài nǎ lǐ?', en: 'Excuse me, where is the station?' }]
      }
    ],
    warmUpItems: ['\u8bf7\u95ee', '\u8f66\u7ad9', '\u706b\u8f66'],
    modulePhases: [
      {
        type: 'role_play',
        scenario: 'Ask a passerby where the train station is.',
        model_dialogue_zh: zh.travel,
        model_dialogue_pinyin: 'Wǒ xiǎng zuò huǒ chē qù Běi jīng. Qǐng wèn, chē zhàn zài nǎ lǐ?',
        model_dialogue_en: 'I want to take the train to Beijing. Excuse me, where is the station?'
      }
    ],
    exercises: [
      wordOrderExercise({
        id: 'hsk3-l09-ex1',
        skill: 'speaking',
        prompt: 'Arrange the question: Excuse me, where is the station?',
        tokens: ['\u8bf7\u95ee', '\u8f66\u7ad9', '\u5728', '\u54ea\u91cc'],
        correctAnswer: '\u8bf7\u95ee \u8f66\u7ad9 \u5728 \u54ea\u91cc',
        explanation: 'Use \u8bf7\u95ee first, then ask the location.'
      })
    ],
    review: ['\u8bf7\u95ee makes travel questions more polite.']
  },
  {
    number: 10,
    level: 3,
    skill: 'mixed',
    topic: 'weather',
    titleZh: '\u660e\u5929\u4f1a\u4e0b\u96e8\u5417\uff1f',
    titleEn: 'Will It Rain Tomorrow?',
    objectives: ['Understand a simple weather forecast.', 'Use \u4f1a for a likely future event.'],
    vocab: makeVocab([
      ['\u660e\u5929', 'míng tiān', 'tomorrow'],
      ['\u4f1a', 'huì', 'will; can'],
      ['\u4e0b\u96e8', 'xià yǔ', 'to rain'],
      ['\u5929\u6c14', 'tiān qì', 'weather']
    ]),
    grammar: [
      {
        pattern: '\u4f1a + verb',
        explanation: 'Use \u4f1a for something that will probably happen.',
        examples: [{ zh: '\u660e\u5929\u4f1a\u4e0b\u96e8\u3002', pinyin: 'Míng tiān huì xià yǔ.', en: 'It will rain tomorrow.' }]
      }
    ],
    warmUpItems: ['\u660e\u5929', '\u5929\u6c14', '\u4e0b\u96e8'],
    modulePhases: [
      {
        type: 'reading_and_speaking',
        content_zh: '\u660e\u5929\u5929\u6c14\u4e0d\u597d\uff0c\u53ef\u80fd\u4f1a\u4e0b\u96e8\u3002\u6211\u4eec\u5728\u5bb6\u5b66\u4e60\u5427\u3002',
        content_pinyin: 'Míng tiān tiān qì bù hǎo, kě néng huì xià yǔ. Wǒ men zài jiā xué xí ba.',
        content_en: 'The weather will not be good tomorrow. It may rain. Let us study at home.'
      }
    ],
    exercises: [
      baseExercise({
        id: 'hsk3-l10-ex1',
        skill: 'mixed',
        prompt: 'What may happen tomorrow?',
        options: ['It may rain.', 'It may snow.', 'It may be very hot.'],
        correctAnswer: 'It may rain.',
        explanation: '\u53ef\u80fd\u4f1a\u4e0b\u96e8 means it may rain.'
      })
    ],
    review: ['Use \u4f1a before a verb to discuss likely future events.']
  }
];

const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const run = async () => {
  if (CLEAN) {
    // Intentionally left as overwrite-only generation; no recursive delete is needed.
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
