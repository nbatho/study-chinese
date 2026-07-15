import type { ChatScenario } from "../../api/aiTutor";

export const chatScenarios: ChatScenario[] = [
  {
    id: "cafe",
    title: "At the Coffee Shop",
    emoji: "☕",
    description: "Practice ordering coffee, tea, and juice in Chinese.",
    initialMessage: {
      simplified: "欢迎光临！请问您要喝点什么？我们有咖啡、茶和果汁。",
      pinyin: "Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme? Wǒmen yǒu kāfēi, chá hé guǒzhī.",
      english: "Welcome! What would you like to drink? We have coffee, tea and juice.",
      vietnamese: "Chào mừng quý khách! Bạn muốn uống gì ạ? Chúng tôi có cà phê, trà và nước ép.",
    },
  },
  {
    id: "directions",
    title: "Asking Directions",
    emoji: "🧭",
    description: "Practice finding your way around town to the station or airport.",
    initialMessage: {
      simplified: "你好！请问地铁站怎么走？",
      pinyin: "Nǐ hǎo! Qǐngwèn dìtiězhàn zěnme zǒu?",
      english: "Hello! Excuse me, how do I get to the subway station?",
      vietnamese: "Xin chào! Cho hỏi ga tàu điện ngầm đi đường nào ạ?",
    },
  },
  {
    id: "general",
    title: "Free Talk",
    emoji: "💬",
    description: "Practice conversational Chinese on any topic with Xiao Hong.",
    initialMessage: {
      simplified: "你好！很高兴认识你。我们今天聊点什么？",
      pinyin: "Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Wǒmen jīntiān liáo diǎn shénme?",
      english: "Hello! Nice to meet you. What shall we talk about today?",
      vietnamese: "Xin chào! Rất vui được gặp bạn. Hôm nay chúng ta trò chuyện về chủ đề gì nhỉ?",
    },
  },
  {
    id: "personal-lesson",
    title: "Ôn bài vừa học",
    emoji: "🧠",
    description: "Luyện hội thoại xoay quanh bài học gần nhất.",
    initialMessage: {
      simplified: "我们复习你刚学的内容。",
      pinyin: "Wǒmen fùxí nǐ gāng xué de nèiróng.",
      english: "Let us review what you just learned.",
      vietnamese: "Chúng ta cùng ôn lại nội dung bạn vừa học.",
    },
  },
  {
    id: "personal-list",
    title: "Luyện từ trong list",
    emoji: "📋",
    description: "AI Tutor ưu tiên từ vựng trong danh sách bạn lưu gần đây.",
    initialMessage: {
      simplified: "请用你保存的词说一句话。",
      pinyin: "Qǐng yòng nǐ bǎocún de cí shuō yí jù huà.",
      english: "Please make a sentence with a word you saved.",
      vietnamese: "Hãy dùng một từ bạn đã lưu để đặt một câu.",
    },
  },
  {
    id: "personal-weak",
    title: "Luyện điểm yếu",
    emoji: "🎯",
    description: "Hội thoại dùng các từ và kỹ năng bạn hay sai.",
    initialMessage: {
      simplified: "我们来练习你的难点吧。",
      pinyin: "Wǒmen lái liànxí nǐ de nándiǎn ba.",
      english: "Let us practice your weak spots.",
      vietnamese: "Chúng ta cùng luyện những điểm khó của bạn nhé.",
    },
  },
];
