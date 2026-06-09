export interface DialogueLine {
  id: string;
  speaker: string;
  isUser: boolean;
  simplified: string;
  traditional: string;
  pinyin: string;
  english: string;
}

export interface Dialogue {
  id: string;
  title: string;
  scenario: string;
  lines: DialogueLine[];
}

export interface ExampleSentence {
  simplified: string;
  traditional: string;
  pinyin: string;
  english: string;
}

export interface GrammarPoint {
  pattern: string;
  explanation: string;
  examples: ExampleSentence[];
  tips: string[];
}

export interface Exercise {
  id: string;
  kind: 'multipleChoice' | 'matchPinyin' | 'tonePicker' | 'listening' | 'typing' | 'speaking' | 'arrangeSentence' | 'fillBlank' | 'trueFalse';
  prompt: string;
  promptHanzi?: string;
  promptPinyin?: string;
  promptEnglish?: string;
  options?: string[];
  correctIndex?: number;
  correctText: string;
  audioWordId?: string;
  tone?: number;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  hskLevel: number;
  order: number;
  skill: string; // 'pinyin' | 'tones' | 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'conversation'
  estimatedMinutes: number;
  xpReward: number;
  intro: string;
  newWords: string[];
  grammar: GrammarPoint[];
  exercises: Exercise[];
  dialogue?: Dialogue;
}

export const LESSONS: Lesson[] = [
  // HSK 1
  {
    id: "l1_1",
    title: "Pinyin Basics",
    subtitle: "Initials & finals",
    hskLevel: 1,
    order: 1,
    skill: "pinyin",
    estimatedMinutes: 7,
    xpReward: 20,
    intro: "Pinyin uses Roman letters to spell the sounds of Mandarin. Start with the most common initials (b, p, m, f, d, t, n, l) and single finals (a, o, e, i, u, ü).",
    newWords: ["wd_hello", "wd_goodbye", "wd_i", "wd_you"],
    grammar: [
      {
        pattern: "Initial + Final + Tone",
        explanation: "Every pinyin syllable combines an initial consonant (optional), a final vowel, and a tone mark above the main vowel.",
        examples: [
          { simplified: "妈", traditional: "媽", pinyin: "mā", english: "mother (1st tone)" },
          { simplified: "麻", traditional: "麻", pinyin: "má", english: "hemp (2nd tone)" },
          { simplified: "马", traditional: "馬", pinyin: "mǎ", english: "horse (3rd tone)" },
          { simplified: "骂", traditional: "罵", pinyin: "mà", english: "scold (4th tone)" }
        ],
        tips: ["Pinyin letters do not always match English sounds — practice each initial slowly."]
      }
    ],
    exercises: [
      { id: "e1_1_1", kind: "matchPinyin", prompt: "Match 你好 to its pinyin", promptHanzi: "你好", options: ["nǐ hǎo", "nǐ hào", "nǐ háo", "nì hǎo"], correctIndex: 0, correctText: "nǐ hǎo" },
      { id: "e1_1_2", kind: "matchPinyin", prompt: "Match 再见 to its pinyin", promptHanzi: "再见", options: ["zài jiàn", "zhǎi jiàn", "cài jiàn", "zài jiǎn"], correctIndex: 0, correctText: "zài jiàn" },
      { id: "e1_1_3", kind: "tonePicker", prompt: "Which tone is mā?", options: ["1st", "2nd", "3rd", "4th"], correctIndex: 0, correctText: "1st", tone: 1 },
      { id: "e1_1_4", kind: "multipleChoice", prompt: "Which means 'hello'?", options: ["再见", "你好", "谢谢", "对不起"], correctIndex: 1, correctText: "你好" },
      { id: "e1_1_5", kind: "listening", prompt: "Listen and choose", options: ["你好", "谢谢", "再见", "我"], correctIndex: 0, correctText: "你好", audioWordId: "wd_hello" }
    ]
  },
  {
    id: "l1_2",
    title: "The Four Tones",
    subtitle: "High, rising, dip, falling",
    hskLevel: 1,
    order: 2,
    skill: "tones",
    estimatedMinutes: 8,
    xpReward: 25,
    intro: "Mandarin has 4 tones plus a neutral tone. Tones change word meaning.",
    newWords: ["wd_one", "wd_two", "wd_three", "wd_four"],
    grammar: [
      {
        pattern: "Tone contour",
        explanation: "1st = high level, 2nd = rising, 3rd = low dip, 4th = falling, neutral = short and light.",
        examples: [],
        tips: ["Over-emphasize tones at first — native listeners expect them."]
      }
    ],
    exercises: [
      { id: "e1_2_1", kind: "tonePicker", prompt: "Which tone is nǐ?", options: ["1st", "2nd", "3rd", "4th"], correctIndex: 2, correctText: "3rd", tone: 3 },
      { id: "e1_2_2", kind: "tonePicker", prompt: "Which tone is zài?", options: ["1st", "2nd", "3rd", "4th"], correctIndex: 3, correctText: "4th", tone: 4 },
      { id: "e1_2_3", kind: "tonePicker", prompt: "Which tone is lái?", options: ["1st", "2nd", "3rd", "4th"], correctIndex: 1, correctText: "2nd", tone: 2 },
      { id: "e1_2_4", kind: "multipleChoice", prompt: "mǎ means…", options: ["mother", "hemp", "horse", "scold"], correctIndex: 2, correctText: "horse" },
      { id: "e1_2_5", kind: "multipleChoice", prompt: "mà means…", options: ["mother", "hemp", "horse", "scold"], correctIndex: 3, correctText: "scold" }
    ]
  },
  {
    id: "l1_3",
    title: "Greetings",
    subtitle: "Hello & goodbye",
    hskLevel: 1,
    order: 3,
    skill: "vocabulary",
    estimatedMinutes: 6,
    xpReward: 20,
    intro: "Basic greetings let you start conversations politely.",
    newWords: ["wd_hello", "wd_goodbye", "wd_thankyou", "wd_youre_welcome", "wd_sorry", "wd_no_problem"],
    grammar: [],
    exercises: [
      { id: "e1_3_1", kind: "multipleChoice", prompt: "你好 means…", options: ["goodbye", "hello", "sorry", "thank you"], correctIndex: 1, correctText: "hello" },
      { id: "e1_3_2", kind: "multipleChoice", prompt: "再见 means…", options: ["hello", "thank you", "goodbye", "please"], correctIndex: 2, correctText: "goodbye" },
      { id: "e1_3_3", kind: "matchPinyin", prompt: "Pinyin for 谢谢", promptHanzi: "谢谢", options: ["xiè xiè", "qiè qiè", "shè shè", "xié xié"], correctIndex: 0, correctText: "xiè xiè" },
      { id: "e1_3_4", kind: "speaking", prompt: "Say 你好", promptHanzi: "你好", promptPinyin: "nǐ hǎo", correctText: "你好" },
      { id: "e1_3_5", kind: "multipleChoice", prompt: "对不起 means…", options: ["hello", "thanks", "sorry", "yes"], correctIndex: 2, correctText: "sorry" }
    ],
    dialogue: {
      id: "d1_3",
      title: "Meeting a friend",
      scenario: "You run into a friend on the street.",
      lines: [
        { id: "dl1_3_1", speaker: "A", isUser: true, simplified: "你好！", traditional: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!" },
        { id: "dl1_3_2", speaker: "B", isUser: false, simplified: "你好！", traditional: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!" },
        { id: "dl1_3_3", speaker: "A", isUser: true, simplified: "最近好吗？", traditional: "最近好嗎？", pinyin: "Zuìjìn hǎo ma?", english: "How have you been lately?" },
        { id: "dl1_3_4", speaker: "B", isUser: false, simplified: "很好，谢谢！", traditional: "很好，謝謝！", pinyin: "Hěn hǎo, xièxiè!", english: "Very good, thanks!" },
        { id: "dl1_3_5", speaker: "A", isUser: true, simplified: "再见！", traditional: "再見！", pinyin: "Zàijiàn!", english: "Goodbye!" }
      ]
    }
  },
  {
    id: "l1_4",
    title: "Numbers 1–10",
    subtitle: "Count in Mandarin",
    hskLevel: 1,
    order: 4,
    skill: "vocabulary",
    estimatedMinutes: 6,
    xpReward: 20,
    intro: "Learn to count from 1 to 10.",
    newWords: ["wd_one", "wd_two", "wd_three", "wd_four", "wd_five", "wd_six", "wd_seven", "wd_eight", "wd_nine", "wd_ten"],
    grammar: [],
    exercises: [
      { id: "e1_4_1", kind: "multipleChoice", prompt: "三 means…", options: ["2", "3", "4", "5"], correctIndex: 1, correctText: "3" },
      { id: "e1_4_2", kind: "multipleChoice", prompt: "九 means…", options: ["6", "7", "8", "9"], correctIndex: 3, correctText: "9" },
      { id: "e1_4_3", kind: "matchPinyin", prompt: "Pinyin for 五", promptHanzi: "五", options: ["wǔ", "wú", "wù", "wū"], correctIndex: 0, correctText: "wǔ" },
      { id: "e1_4_4", kind: "listening", prompt: "Listen: which number?", options: ["六", "七", "八", "九"], correctIndex: 1, correctText: "七", audioWordId: "wd_seven" }
    ]
  },
  {
    id: "l1_5",
    title: "Self Introduction",
    subtitle: "我叫…",
    hskLevel: 1,
    order: 5,
    skill: "conversation",
    estimatedMinutes: 8,
    xpReward: 30,
    intro: "Introduce yourself using 我叫 (wǒ jiào).",
    newWords: ["wd_name", "wd_called", "wd_china", "wd_chinese"],
    grammar: [
      {
        pattern: "Subject + 叫 + Name",
        explanation: "我叫 literally means 'I am called'. Used to give your name.",
        examples: [
          { simplified: "我叫小明。", traditional: "我叫小明。", pinyin: "Wǒ jiào Xiǎo Míng.", english: "My name is Xiao Ming." }
        ],
        tips: ["Use 您贵姓 to ask someone's surname politely."]
      }
    ],
    exercises: [
      { id: "e1_5_1", kind: "arrangeSentence", prompt: "Arrange: I am called Anna", options: ["我", "叫", "安娜"], correctIndex: 0, correctText: "我叫安娜" },
      { id: "e1_5_2", kind: "fillBlank", prompt: "我___安娜。(blank = called)", options: ["是", "叫", "去", "有"], correctIndex: 1, correctText: "叫" },
      { id: "e1_5_3", kind: "multipleChoice", prompt: "你叫什么名字？ means…", options: ["Where are you?", "Who is he?", "What is your name?", "How old?"], correctIndex: 2, correctText: "What is your name?" },
      { id: "e1_5_4", kind: "speaking", prompt: "Say 我叫 + your name", promptHanzi: "我叫___", promptPinyin: "wǒ jiào ___", correctText: "我叫" }
    ],
    dialogue: {
      id: "d1_5",
      title: "Meeting someone new",
      scenario: "You meet a new classmate.",
      lines: [
        { id: "dl1_5_1", speaker: "A", isUser: true, simplified: "你好！你叫什么名字？", traditional: "你好！你叫什麼名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzì?", english: "Hi! What's your name?" },
        { id: "dl1_5_2", speaker: "B", isUser: false, simplified: "我叫李明。你呢？", traditional: "我叫李明。你呢？", pinyin: "Wǒ jiào Lǐ Míng. Nǐ ne?", english: "My name is Li Ming. And you?" },
        { id: "dl1_5_3", speaker: "A", isUser: true, simplified: "我叫安娜。很高兴认识你！", traditional: "我叫安娜。很高興認識你！", pinyin: "Wǒ jiào Ānnà. Hěn gāoxìng rènshí nǐ!", english: "I'm Anna. Nice to meet you!" }
      ]
    }
  },
  {
    id: "l1_6",
    title: "Family Words",
    subtitle: "Meet the family",
    hskLevel: 1,
    order: 6,
    skill: "vocabulary",
    estimatedMinutes: 7,
    xpReward: 25,
    intro: "Learn how to talk about family members.",
    newWords: ["wd_dad", "wd_mom", "wd_older_brother", "wd_older_sister", "wd_younger_brother", "wd_younger_sister", "wd_friend"],
    grammar: [],
    exercises: [
      { id: "e1_6_1", kind: "multipleChoice", prompt: "妈妈 means…", options: ["dad", "mom", "sister", "brother"], correctIndex: 1, correctText: "mom" },
      { id: "e1_6_2", kind: "multipleChoice", prompt: "哥哥 is…", options: ["older brother", "younger brother", "older sister", "younger sister"], correctIndex: 0, correctText: "older brother" },
      { id: "e1_6_3", kind: "matchPinyin", prompt: "Pinyin for 朋友", promptHanzi: "朋友", options: ["péng yǒu", "féng yǒu", "bēng yǒu", "péng yòu"], correctIndex: 0, correctText: "péng yǒu" },
      { id: "e1_6_4", kind: "arrangeSentence", prompt: "Arrange: This is my mom", options: ["这", "是", "我", "妈妈"], correctIndex: 0, correctText: "这是我妈妈" }
    ]
  },
  {
    id: "l1_7",
    title: "Basic Verb 是",
    subtitle: "To be",
    hskLevel: 1,
    order: 7,
    skill: "grammar",
    estimatedMinutes: 8,
    xpReward: 30,
    intro: "是 (shì) links a subject to a noun.",
    newWords: ["wd_yes", "wd_student", "wd_teacher", "wd_doctor"],
    grammar: [
      {
        pattern: "A + 是 + B",
        explanation: "Use 是 between a subject and a noun identity. Negate with 不是.",
        examples: [
          { simplified: "我是学生。", traditional: "我是學生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." },
          { simplified: "他不是老师。", traditional: "他不是老師。", pinyin: "Tā bú shì lǎoshī.", english: "He is not a teacher." }
        ],
        tips: ["是 is not used before adjectives — use 很 instead for 'to be + adj'."]
      }
    ],
    exercises: [
      { id: "e1_7_1", kind: "fillBlank", prompt: "我___学生。", options: ["有", "是", "去", "叫"], correctIndex: 1, correctText: "是" },
      { id: "e1_7_2", kind: "fillBlank", prompt: "他___是老师。", options: ["不", "没", "别", "很"], correctIndex: 0, correctText: "不" },
      { id: "e1_7_3", kind: "arrangeSentence", prompt: "Arrange: I am a doctor", options: ["我", "是", "医生"], correctIndex: 0, correctText: "我是医生" },
      { id: "e1_7_4", kind: "trueFalse", prompt: "是 can come before an adjective.", options: ["True", "False"], correctIndex: 1, correctText: "False" }
    ]
  },
  {
    id: "l1_8",
    title: "Food & Drinks",
    subtitle: "Eat and drink",
    hskLevel: 1,
    order: 8,
    skill: "vocabulary",
    estimatedMinutes: 7,
    xpReward: 25,
    intro: "Order basic food and drinks in Mandarin.",
    newWords: ["wd_eat", "wd_drink", "wd_water", "wd_tea", "wd_coffee", "wd_rice", "wd_noodles", "wd_apple"],
    grammar: [],
    exercises: [
      { id: "e1_8_1", kind: "multipleChoice", prompt: "茶 means…", options: ["water", "tea", "coffee", "juice"], correctIndex: 1, correctText: "tea" },
      { id: "e1_8_2", kind: "matchPinyin", prompt: "咖啡 pinyin", promptHanzi: "咖啡", options: ["kā fēi", "gā fēi", "jiā fēi", "qiā fēi"], correctIndex: 0, correctText: "kā fēi" },
      { id: "e1_8_3", kind: "arrangeSentence", prompt: "Arrange: I want to drink tea", options: ["我", "想", "喝", "茶"], correctIndex: 0, correctText: "我想喝茶" },
      { id: "e1_8_4", kind: "listening", prompt: "Listen: what am I drinking?", options: ["水", "茶", "咖啡", "牛奶"], correctIndex: 0, correctText: "水", audioWordId: "wd_water" }
    ]
  },
  {
    id: "l1_9",
    title: "Asking 'How much?'",
    subtitle: "多少钱",
    hskLevel: 1,
    order: 9,
    skill: "conversation",
    estimatedMinutes: 8,
    xpReward: 30,
    intro: "Use 多少钱 (duō shǎo qián) to ask the price.",
    newWords: ["wd_how_much", "wd_money", "wd_yuan", "wd_kuai", "wd_buy", "wd_sell"],
    grammar: [
      {
        pattern: "Item + 多少钱?",
        explanation: "Place 多少钱 after the item to ask its price.",
        examples: [
          { simplified: "这个多少钱？", traditional: "這個多少錢？", pinyin: "Zhège duōshǎo qián?", english: "How much is this?" }
        ],
        tips: []
      }
    ],
    exercises: [
      { id: "e1_9_1", kind: "multipleChoice", prompt: "多少钱 means…", options: ["where?", "how much?", "what?", "when?"], correctIndex: 1, correctText: "how much?" },
      { id: "e1_9_2", kind: "fillBlank", prompt: "这个___钱？", options: ["多少", "什么", "哪", "怎么"], correctIndex: 0, correctText: "多少" },
      { id: "e1_9_3", kind: "arrangeSentence", prompt: "Arrange: I want to buy apples", options: ["我", "要", "买", "苹果"], correctIndex: 0, correctText: "我要买苹果" }
    ],
    dialogue: {
      id: "d1_9",
      title: "At the market",
      scenario: "Bargaining at a stall.",
      lines: [
        { id: "dl1_9_1", speaker: "A", isUser: true, simplified: "你好！这个多少钱？", traditional: "你好！這個多少錢？", pinyin: "Nǐ hǎo! Zhège duōshǎo qián?", english: "Hi! How much is this?" },
        { id: "dl1_9_2", speaker: "B", isUser: false, simplified: "三十块。", traditional: "三十塊。", pinyin: "Sānshí kuài.", english: "30 yuan." },
        { id: "dl1_9_3", speaker: "A", isUser: true, simplified: "太贵了！便宜一点吧。", traditional: "太貴了！便宜一點吧。", pinyin: "Tài guì le! Piányi yīdiǎn ba.", english: "Too expensive! A bit cheaper please." },
        { id: "dl1_9_4", speaker: "B", isUser: false, simplified: "二十五。", traditional: "二十五。", pinyin: "Èrshí wǔ.", english: "25." }
      ]
    }
  },
  {
    id: "l1_10",
    title: "Days & Time",
    subtitle: "今天, 明天, 昨天",
    hskLevel: 1,
    order: 10,
    skill: "vocabulary",
    estimatedMinutes: 7,
    xpReward: 25,
    intro: "Learn time words and days.",
    newWords: ["wd_today", "wd_yesterday", "wd_tomorrow", "wd_morning", "wd_afternoon", "wd_evening", "wd_now", "wd_week"],
    grammar: [],
    exercises: [
      { id: "e1_10_1", kind: "multipleChoice", prompt: "今天 means…", options: ["yesterday", "tomorrow", "today", "tonight"], correctIndex: 2, correctText: "today" },
      { id: "e1_10_2", kind: "multipleChoice", prompt: "明天 means…", options: ["yesterday", "tomorrow", "today", "yesterday"], correctIndex: 1, correctText: "tomorrow" },
      { id: "e1_10_3", kind: "matchPinyin", prompt: "早上 pinyin", promptHanzi: "早上", options: ["zǎo shang", "zhǎo shàng", "zāo shang", "zuǒ shang"], correctIndex: 0, correctText: "zǎo shang" },
      { id: "e1_10_4", kind: "arrangeSentence", prompt: "Arrange: I go to school today", options: ["我", "今天", "去", "学校"], correctIndex: 0, correctText: "我今天去学校" }
    ]
  },

  // HSK 2
  {
    id: "l2_1",
    title: "Transport & Directions",
    subtitle: "地铁, 公交",
    hskLevel: 2,
    order: 1,
    skill: "vocabulary",
    estimatedMinutes: 8,
    xpReward: 30,
    intro: "Get around a Chinese city using public transport and directions.",
    newWords: ["wd_subway", "wd_bus", "wd_taxi", "wd_train", "wd_airport", "wd_station", "wd_left_turn", "wd_right_turn", "wd_straight"],
    grammar: [],
    exercises: [
      { id: "e2_1_1", kind: "multipleChoice", prompt: "地铁 means…", options: ["bus", "subway", "taxi", "train"], correctIndex: 1, correctText: "subway" },
      { id: "e2_1_2", kind: "multipleChoice", prompt: "左转 means…", options: ["turn right", "turn left", "go straight", "stop"], correctIndex: 1, correctText: "turn left" },
      { id: "e2_1_3", kind: "arrangeSentence", prompt: "Arrange: Go straight then turn right", options: ["直走", "然后", "右转"], correctIndex: 0, correctText: "直走然后右转" }
    ]
  },
  {
    id: "l2_2",
    title: "Past Tense with 了",
    subtitle: "Completed actions",
    hskLevel: 2,
    order: 2,
    skill: "grammar",
    estimatedMinutes: 9,
    xpReward: 35,
    intro: "了 signals completion or change of state.",
    newWords: ["wd_eat", "wd_drink", "wd_go", "wd_buy"],
    grammar: [
      {
        pattern: "Verb + 了",
        explanation: "Add 了 after a verb to show the action has been completed.",
        examples: [
          { simplified: "我吃了。", traditional: "我吃了。", pinyin: "Wǒ chī le.", english: "I have eaten." },
          { simplified: "他去了北京。", traditional: "他去了北京。", pinyin: "Tā qù le Běijīng.", english: "He went to Beijing." }
        ],
        tips: ["了 is not only past tense — it marks completion/change."]
      }
    ],
    exercises: [
      { id: "e2_2_1", kind: "fillBlank", prompt: "我买___一本书。", options: ["了", "的", "得", "地"], correctIndex: 0, correctText: "了" },
      { id: "e2_2_2", kind: "arrangeSentence", prompt: "Arrange: I drank coffee", options: ["我", "喝", "了", "咖啡"], correctIndex: 0, correctText: "我喝了咖啡" },
      { id: "e2_2_3", kind: "trueFalse", prompt: "了 is only used in past tense.", options: ["True", "False"], correctIndex: 1, correctText: "False" }
    ]
  },
  {
    id: "l2_3",
    title: "At a Restaurant",
    subtitle: "点菜",
    hskLevel: 2,
    order: 3,
    skill: "conversation",
    estimatedMinutes: 10,
    xpReward: 40,
    intro: "Order food and chat at a Chinese restaurant.",
    newWords: ["wd_delicious", "wd_spicy", "wd_beef", "wd_chicken", "wd_noodles", "wd_rice"],
    grammar: [],
    exercises: [
      { id: "e2_3_1", kind: "multipleChoice", prompt: "好吃 means…", options: ["smelly", "delicious", "spicy", "salty"], correctIndex: 1, correctText: "delicious" },
      { id: "e2_3_2", kind: "arrangeSentence", prompt: "Arrange: I want a bowl of beef noodles", options: ["我", "要", "一碗", "牛肉面"], correctIndex: 0, correctText: "我要一碗牛肉面" },
      { id: "e2_3_3", kind: "speaking", prompt: "Say 买单", promptHanzi: "买单", promptPinyin: "mǎi dān", correctText: "买单" }
    ],
    dialogue: {
      id: "d2_3",
      title: "Ordering dinner",
      scenario: "At a noodle shop.",
      lines: [
        { id: "dl2_3_1", speaker: "Server", isUser: false, simplified: "请问您要什么？", traditional: "請問您要什麼？", pinyin: "Qǐngwèn nín yào shénme?", english: "Excuse me, what would you like?" },
        { id: "dl2_3_2", speaker: "You", isUser: true, simplified: "我要一碗牛肉面，不要太辣。", traditional: "我要一碗牛肉麵，不要太辣。", pinyin: "Wǒ yào yī wǎn niúròu miàn, búyào tài là.", english: "I want a bowl of beef noodles, not too spicy." },
        { id: "dl2_3_3", speaker: "Server", isUser: false, simplified: "好的，还要别的吗？", traditional: "好的，還要別的嗎？", pinyin: "Hǎo de, hái yào biéde ma?", english: "Ok, anything else?" },
        { id: "dl2_3_4", speaker: "You", isUser: true, simplified: "一杯茶，谢谢。", traditional: "一杯茶，謝謝。", pinyin: "Yī bēi chá, xièxiè.", english: "A cup of tea, thanks." }
      ]
    }
  },
  {
    id: "l2_4",
    title: "Weather & Seasons",
    subtitle: "天气怎么样",
    hskLevel: 2,
    order: 4,
    skill: "vocabulary",
    estimatedMinutes: 7,
    xpReward: 30,
    intro: "Talk about the weather and seasons.",
    newWords: ["wd_weather", "wd_sun", "wd_rain", "wd_snow", "wd_wind", "wd_hot", "wd_cold"],
    grammar: [],
    exercises: [
      { id: "e2_4_1", kind: "multipleChoice", prompt: "天气 means…", options: ["sky", "weather", "sun", "cold"], correctIndex: 1, correctText: "weather" },
      { id: "e2_4_2", kind: "fillBlank", prompt: "今天很___。(hot)", options: ["冷", "热", "快", "慢"], correctIndex: 1, correctText: "热" },
      { id: "e2_4_3", kind: "arrangeSentence", prompt: "Arrange: It's raining today", options: ["今天", "下", "雨"], correctIndex: 0, correctText: "今天下雨" }
    ]
  },
  {
    id: "l2_5",
    title: "Feelings",
    subtitle: "Emotions and states",
    hskLevel: 2,
    order: 5,
    skill: "vocabulary",
    estimatedMinutes: 7,
    xpReward: 30,
    intro: "Express how you feel physically and emotionally.",
    newWords: ["wd_happy", "wd_happy2", "wd_sad", "wd_angry", "wd_tired", "wd_busy"],
    grammar: [],
    exercises: [
      { id: "e2_5_1", kind: "multipleChoice", prompt: "高兴 means…", options: ["angry", "happy", "sad", "tired"], correctIndex: 1, correctText: "happy" },
      { id: "e2_5_2", kind: "fillBlank", prompt: "我今天很___(tired)", options: ["忙", "累", "饿", "渴"], correctIndex: 1, correctText: "累" },
      { id: "e2_5_3", kind: "arrangeSentence", prompt: "Arrange: She is very happy", options: ["她", "很", "高兴"], correctIndex: 0, correctText: "她很高兴" }
    ]
  },

  // HSK 3
  {
    id: "l3_1",
    title: "Making Suggestions",
    subtitle: "建议 patterns",
    hskLevel: 3,
    order: 1,
    skill: "grammar",
    estimatedMinutes: 9,
    xpReward: 40,
    intro: "Learn to make polite suggestions to others.",
    newWords: ["wd_suggest", "wd_decide", "wd_help"],
    grammar: [
      {
        pattern: "我们…吧",
        explanation: "Use …吧 at the end of a sentence to make a suggestion.",
        examples: [
          { simplified: "我们吃饭吧。", traditional: "我們吃飯吧。", pinyin: "Wǒmen chīfàn ba.", english: "Let's eat." }
        ],
        tips: []
      }
    ],
    exercises: [
      { id: "e3_1_1", kind: "fillBlank", prompt: "我们去公园___。", options: ["吗", "吧", "呢", "了"], correctIndex: 1, correctText: "吧" },
      { id: "e3_1_2", kind: "arrangeSentence", prompt: "Arrange: Let's go shopping", options: ["我们", "去", "买东西", "吧"], correctIndex: 0, correctText: "我们去买东西吧" }
    ]
  },
  {
    id: "l3_2",
    title: "Comparison 比",
    subtitle: "A is bigger than B",
    hskLevel: 3,
    order: 2,
    skill: "grammar",
    estimatedMinutes: 10,
    xpReward: 40,
    intro: "Use 比 (bǐ) to compare size, quantity, and qualities.",
    newWords: ["wd_big", "wd_small", "wd_good", "wd_expensive"],
    grammar: [
      {
        pattern: "A 比 B + adj",
        explanation: "Compare two things. No need for 很.",
        examples: [
          { simplified: "中国比日本大。", traditional: "中國比日本大。", pinyin: "Zhōngguó bǐ Rìběn dà.", english: "China is bigger than Japan." }
        ],
        tips: ["Do NOT add 很 in 比 comparisons."]
      }
    ],
    exercises: [
      { id: "e3_2_1", kind: "arrangeSentence", prompt: "Arrange: Today is colder than yesterday", options: ["今天", "比", "昨天", "冷"], correctIndex: 0, correctText: "今天比昨天冷" },
      { id: "e3_2_2", kind: "trueFalse", prompt: "You can say '她比他很高'.", options: ["True", "False"], correctIndex: 1, correctText: "False" }
    ]
  },
  {
    id: "l3_3",
    title: "Business Chinese Basics",
    subtitle: "Meetings & emails",
    hskLevel: 3,
    order: 3,
    skill: "conversation",
    estimatedMinutes: 12,
    xpReward: 50,
    intro: "Essentials for business meetings, business cards, and project discussions.",
    newWords: ["wd_meeting", "wd_schedule", "wd_contract", "wd_opportunity", "wd_experience"],
    grammar: [],
    exercises: [
      { id: "e3_3_1", kind: "multipleChoice", prompt: "会议 means…", options: ["company", "meeting", "schedule", "contract"], correctIndex: 1, correctText: "meeting" },
      { id: "e3_3_2", kind: "arrangeSentence", prompt: "Arrange: Let's discuss the contract", options: ["我们", "讨论", "一下", "合同"], correctIndex: 0, correctText: "我们讨论一下合同" }
    ],
    dialogue: {
      id: "d3_3",
      title: "Business intro",
      scenario: "Meeting a business partner.",
      lines: [
        { id: "dl3_3_1", speaker: "You", isUser: true, simplified: "很高兴认识您。", traditional: "很高興認識您。", pinyin: "Hěn gāoxìng rènshí nín.", english: "Nice to meet you." },
        { id: "dl3_3_2", speaker: "Partner", isUser: false, simplified: "这是我的名片。", traditional: "這是我的名片。", pinyin: "Zhè shì wǒ de míngpiàn.", english: "Here is my business card." },
        { id: "dl3_3_3", speaker: "You", isUser: true, simplified: "我们谈一下合同好吗？", traditional: "我們談一下合同好嗎？", pinyin: "Wǒmen tán yīxià hétóng hǎo ma?", english: "Shall we discuss the contract?" }
      ]
    }
  }
];
