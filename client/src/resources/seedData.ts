export interface DailyPhrase {
  simplified: string;
  pinyin: string;
  english: string;
  note: string;
}

export interface ExampleSentence {
  simplified: string;
  pinyin: string;
  english: string;
}

export interface GrammarLibraryEntry {
  id: string;
  title: string;
  pattern: string;
  summary: string;
  examples: ExampleSentence[];
}

export interface ChatScenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  initialMessage: {
    simplified: string;
    pinyin: string;
    english: string;
  };
}

export const DAILY_PHRASES: DailyPhrase[] = [
  { simplified: "一步一个脚印", pinyin: "Yī bù yī gè jiǎo yìn", english: "One step at a time.", note: "Steady progress is the key to mastery." },
  { simplified: "加油！", pinyin: "Jiā yóu!", english: "Keep it up! (Add oil!)", note: "Encouragement used everywhere in China." },
  { simplified: "慢慢来", pinyin: "Màn màn lái", english: "Take your time.", note: "Literally 'slow slow come'." },
  { simplified: "学无止境", pinyin: "Xué wú zhǐ jìng", english: "Learning has no end.", note: "Keep exploring — there's always more." },
  { simplified: "熟能生巧", pinyin: "Shú néng shēng qiǎo", english: "Practice makes perfect.", note: "Literally 'skill is born from familiarity'." },
  { simplified: "有志者事竟成", pinyin: "Yǒu zhì zhě shì jìng chéng", english: "Where there is a will, there is a way.", note: "Classical Chinese saying." },
  { simplified: "一日一句", pinyin: "Yī rì yī jù", english: "One sentence a day.", note: "Small daily gains compound." }
];

export const GRAMMAR_LIBRARY: GrammarLibraryEntry[] = [
  {
    id: "g_shi",
    title: "是 (shì) — to be",
    pattern: "Subject + 是 + Noun",
    summary: "Used to equate a subject with a noun.",
    examples: [{ simplified: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." }]
  },
  {
    id: "g_le",
    title: "了 (le) — completion",
    pattern: "Verb + 了",
    summary: "Marks completed or changed state.",
    examples: [{ simplified: "我吃了饭。", pinyin: "Wǒ chī le fàn.", english: "I ate." }]
  },
  {
    id: "g_ma",
    title: "吗 (ma) — yes/no question",
    pattern: "Statement + 吗?",
    summary: "Turns a statement into a yes/no question.",
    examples: [{ simplified: "你是学生吗？", pinyin: "Nǐ shì xuéshēng ma?", english: "Are you a student?" }]
  },
  {
    id: "g_de",
    title: "的 (de) — possessive / modifier",
    pattern: "A 的 B",
    summary: "Marks possession or modifies a noun.",
    examples: [{ simplified: "我的书", pinyin: "wǒ de shū", english: "my book" }]
  },
  {
    id: "g_bi",
    title: "比 (bǐ) — comparison",
    pattern: "A 比 B + adjective",
    summary: "Compare two items.",
    examples: [{ simplified: "他比我高。", pinyin: "Tā bǐ wǒ gāo.", english: "He is taller than me." }]
  },
  {
    id: "g_ba",
    title: "吧 (ba) — suggestion / softener",
    pattern: "Sentence + 吧",
    summary: "Softens requests, makes suggestions.",
    examples: [{ simplified: "我们走吧。", pinyin: "Wǒmen zǒu ba.", english: "Let's go." }]
  },
  {
    id: "g_ne",
    title: "呢 (ne) — follow-up question",
    pattern: "Topic + 呢?",
    summary: "Asks 'And you? / What about…?'",
    examples: [{ simplified: "我很好，你呢？", pinyin: "Wǒ hěn hǎo, nǐ ne?", english: "I'm good, and you?" }]
  },
  {
    id: "g_hui",
    title: "会 (huì) — can / will",
    pattern: "Subject + 会 + Verb",
    summary: "Ability (learned skill) or future tense.",
    examples: [{ simplified: "我会说中文。", pinyin: "Wǒ huì shuō zhōngwén.", english: "I can speak Chinese." }]
  }
];

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: "general",
    title: "Free Talk",
    emoji: "💬",
    description: "Practice conversational Chinese on any topic with Xiao Hong.",
    initialMessage: { simplified: "你好！很高兴认识你。我们今天聊点什么？", pinyin: "Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Wǒmen jīntiān liáo diǎn shénme?", english: "Hello! Nice to meet you. What shall we talk about today?" }
  },
  {
    id: "cafe",
    title: "At the Coffee Shop",
    emoji: "☕",
    description: "Practice ordering coffee, tea, and juice in Chinese.",
    initialMessage: { simplified: "欢迎光临！请问您要喝点什么？我们有咖啡、茶和果汁。", pinyin: "Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme? Wǒmen yǒu kāfēi, chá hé guǒzhī.", english: "Welcome! What would you like to drink? We have coffee, tea and juice." }
  },
  {
    id: "restaurant",
    title: "Ordering Dinner",
    emoji: "🍜",
    description: "Order dishes at a local restaurant and ask for the special.",
    initialMessage: { simplified: "您好！这是菜单。我们今天的招牌菜是宫保鸡丁，非常好吃！", pinyin: "Nín hǎo! Zhè shì càidān. Wǒmen jīntiān de zhāopái cài shì gōngbǎo jīdīng, fēicháng hǎochī!", english: "Hello! Here is the menu. Today's special is Kung Pao Chicken, very delicious!" }
  },
  {
    id: "directions",
    title: "Asking Directions",
    emoji: "🧭",
    description: "Practice finding your way around town to the station or airport.",
    initialMessage: { simplified: "你好！请问地铁站怎么走？我好像迷路了。", pinyin: "Nǐ hǎo! Qǐngwèn dìtiězhàn zěnme zǒu? Wǒ hǎoxiàng mílù le.", english: "Hello! Excuse me, how do I get to the subway station? I seem to be lost." }
  },
  {
    id: "shopping",
    title: "Bargaining / Shopping",
    emoji: "🛍️",
    description: "Shop for clothes, ask for prices, and try to get a discount.",
    initialMessage: { simplified: "你好！看看衣服吧，这件衣服三百元。你要试一下吗？", pinyin: "Nǐ hǎo! Kànkan yīfú ba, zhè jiàn yīfú sānbǎi yuán. Nǐ yào shì yīxià ma?", english: "Hello! Check out some clothes. This piece of clothing is 300 yuan. Would you like to try it?" }
  },
  {
    id: "hotel",
    title: "Hotel Check-in",
    emoji: "🏨",
    description: "Verify your passport details and check in to your room.",
    initialMessage: { simplified: "下午好！欢迎来到北京大酒店。请给我您的护照办理入住。", pinyin: "Xiàwǔ hǎo! Huānyíng lái dào Běijīng dà jiǔdiàn. Qǐng gěi wǒ nín de hùzhào bànlǐ rùzhù.", english: "Good afternoon! Welcome to Beijing Hotel. Please give me your passport for check-in." }
  },
  {
    id: "taxi",
    title: "Taking a Taxi",
    emoji: "🚕",
    description: "Tell the driver where to go and ask how long it will take.",
    initialMessage: { simplified: "你好！去哪里？外面下雨了，路上有点堵。", pinyin: "Nǐ hǎo! Qù nǎlǐ? Wàimiàn xiàyǔ le, lùshang yǒudiǎn dǔ.", english: "Hello! Where to? It's raining outside, the road is a bit congested." }
  },
  {
    id: "business",
    title: "Business Introduction",
    emoji: "💼",
    description: "Greet a business partner, exchange cards, and introduce your project.",
    initialMessage: { simplified: "李先生您好！很高兴认识您。这是我的名片，我们先讨论一下项目计划好吗？", pinyin: "Lǐ xiānshēng nín hǎo! Hěn gāoxìng rènshí nín. Zhè shì wǒ de míngpiàn, wǒmen xiān tǎolùn yīxià xiàngmù jìhuà hǎo ma?", english: "Hello Mr. Li! Nice to meet you. Here is my business card, shall we discuss the project plan first?" }
  }
];
