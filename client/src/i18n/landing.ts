import type { Language } from "./languages";

/**
 * Copy for the Landing page in every supported language.
 *
 * Landing is the app's public shell, so unlike the app-wide dictionary in
 * `./translations` (English/Vietnamese only) it is fully translated into all
 * four languages. Typing it as `Record<Language, LandingCopy>` makes an
 * untranslated locale a compile error rather than a silent English fallback.
 *
 * Only copy lives here. Icons, routes, and layout stay in the component and are
 * matched up by the ids below.
 */

export type LandingFeatureId = "path" | "practice" | "dictionary" | "translate" | "tutor" | "community";
export type LandingFlowId = "goal" | "lessons" | "review";
export type LandingFooterGroupId = "learn" | "practice" | "tools";
export type LandingLinkId =
  | "learn"
  | "foundation"
  | "grammar"
  | "radicals"
  | "practice"
  | "review"
  | "tutor"
  | "dictionary"
  | "translate"
  | "community"
  | "guide";

interface FeatureCopy {
  title: string;
  description: string;
}

interface FlowCopy {
  label: string;
  title: string;
  description: string;
}

export interface LandingCopy {
  nav: {
    tagline: string;
    languageLabel: string;
    roadmap: string;
    practice: string;
    translate: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaGuest: string;
    ctaAuthed: string;
    secondary: string;
  };
  preview: {
    sessionTitle: string;
    sessionSubtitle: string;
    statSession: string;
    statNewWords: string;
    statReviews: string;
    wordsTitle: string;
    wordsBadge: string;
    meanings: [string, string, string];
    aiTitle: string;
    aiBody: string;
  };
  features: {
    title: string;
    subtitle: string;
    open: string;
    items: Record<LandingFeatureId, FeatureCopy>;
  };
  flow: {
    title: string;
    subtitle: string;
    steps: Record<LandingFlowId, FlowCopy>;
  };
  cta: {
    title: string;
    subtitle: string;
    translate: string;
  };
  footer: {
    tagline: string;
    navLabel: string;
    groups: Record<LandingFooterGroupId, string>;
    links: Record<LandingLinkId, string>;
    /** `{year}` is replaced with the current year at render time. */
    copyright: string;
  };
}

export const landingCopy: Record<Language, LandingCopy> = {
  en: {
    nav: {
      tagline: "HSK Learning",
      languageLabel: "Change language",
      roadmap: "Path",
      practice: "Practice",
      translate: "Translate",
    },
    hero: {
      badge: "A complete Chinese learning platform",
      title: "Learn Chinese with rhythm and a clear path",
      subtitle:
        "HSK lessons, reflex practice, a dictionary, and an AI tutor all in one focused study space.",
      ctaGuest: "Start learning free",
      ctaAuthed: "Jump back in",
      secondary: "Watch the guide",
    },
    preview: {
      sessionTitle: "Today's session",
      sessionSubtitle: "HSK 2 - Everyday conversation",
      statSession: "Session",
      statNewWords: "New words",
      statReviews: "Reviews",
      wordsTitle: "Words to remember",
      wordsBadge: "Learning",
      meanings: ["Hello", "I'd like to order", "Today is very busy"],
      aiTitle: "Your AI tutor is ready",
      aiBody:
        "Ask how a word is used, have a sentence corrected, or set up a speaking scenario right inside the lesson.",
    },
    features: {
      title: "A toolkit small enough to use every day",
      subtitle:
        "The main features connect along your learning journey instead of sitting in separate screens.",
      open: "Open tool",
      items: {
        path: {
          title: "A clear HSK path",
          description: "Track lessons, levels, and progress in one thread you can always come back to.",
        },
        practice: {
          title: "Speaking and reflex practice",
          description: "Listen, speak, arrange sentences, and memorise characters with short drills.",
        },
        dictionary: {
          title: "Dictionary in context",
          description: "Look up pinyin, meanings, and examples, and save words to review later.",
        },
        translate: {
          title: "Translate text and images",
          description: "Type a sentence or snap a photo of Hanzi to get a quick explanation.",
        },
        tutor: {
          title: "AI tutor",
          description: "Ask about grammar, get sentences corrected, and practise conversation by situation.",
        },
        community: {
          title: "Learning community",
          description: "Share questions, study tips, and useful notes with other learners.",
        },
      },
    },
    flow: {
      title: "A rhythm that is easy to keep",
      subtitle:
        "Each session is broken down so you know where to start, what to review, and when to drill your reflexes.",
      steps: {
        goal: {
          label: "Set a goal",
          title: "Pick the right level",
          description: "Start from where you are now so every lesson stays within reach.",
        },
        lessons: {
          label: "Learn by lesson",
          title: "Move through short content",
          description: "Vocabulary, sentence patterns, pinyin, and examples gathered into one session.",
        },
        review: {
          label: "Review with rhythm",
          title: "Turn knowledge into reflex",
          description: "Practise listening, speaking, writing, and translating with interactive drills.",
        },
      },
    },
    cta: {
      title: "Ready for a short session today?",
      subtitle:
        "Start with the path waiting for you, or try translating a piece of Chinese you ran into today.",
      translate: "Try translating text",
    },
    footer: {
      tagline: "Lessons, review, and an AI tutor for Chinese, all in one place.",
      navLabel: "Footer",
      groups: { learn: "Learn", practice: "Practice", tools: "Tools" },
      links: {
        learn: "HSK path",
        foundation: "Foundation",
        grammar: "Grammar",
        radicals: "Radicals",
        practice: "Practice",
        review: "Review",
        tutor: "AI tutor",
        dictionary: "Dictionary",
        translate: "Translate",
        community: "Community",
        guide: "Guide",
      },
      copyright: "© {year} Study Chinese. All rights reserved.",
    },
  },

  vi: {
    nav: {
      tagline: "HSK Learning",
      languageLabel: "Đổi ngôn ngữ",
      roadmap: "Lộ trình",
      practice: "Luyện tập",
      translate: "Dịch nhanh",
    },
    hero: {
      badge: "Nền tảng học tiếng Trung toàn diện",
      title: "Học tiếng Trung có nhịp, có lộ trình",
      subtitle:
        "Bài học HSK, luyện phản xạ, từ điển và AI tutor cùng nằm trong một không gian học rõ ràng.",
      ctaGuest: "Bắt đầu học miễn phí",
      ctaAuthed: "Vào học ngay",
      secondary: "Xem hướng dẫn",
    },
    preview: {
      sessionTitle: "Phiên học hôm nay",
      sessionSubtitle: "HSK 2 - Giao tiếp thường ngày",
      statSession: "Phiên học",
      statNewWords: "Từ mới",
      statReviews: "Ôn lại",
      wordsTitle: "Từ cần nhớ",
      wordsBadge: "Đang học",
      meanings: ["Xin chào", "Tôi muốn gọi món", "Hôm nay rất bận"],
      aiTitle: "Gia sư AI sẵn sàng hỗ trợ",
      aiBody:
        "Hỏi cách dùng từ, nhờ sửa câu hoặc tạo tình huống luyện nói ngay trong bài học.",
    },
    features: {
      title: "Một bộ công cụ đủ gọn để học mỗi ngày",
      subtitle:
        "Các tính năng chính được nối với nhau theo hành trình học, không tách thành những màn rời rạc.",
      open: "Mở công cụ",
      items: {
        path: {
          title: "Lộ trình HSK rõ ràng",
          description: "Theo dõi bài học, cấp độ và tiến độ trong một mạch học dễ quay lại.",
        },
        practice: {
          title: "Luyện nói và phản xạ",
          description: "Nghe, nói, sắp xếp câu và ghi nhớ mặt chữ bằng bài tập ngắn.",
        },
        dictionary: {
          title: "Từ điển trong ngữ cảnh",
          description: "Tra pinyin, nghĩa, ví dụ và lưu từ cần ôn tiếp.",
        },
        translate: {
          title: "Dịch văn bản và hình ảnh",
          description: "Nhập câu hoặc chụp chữ Hán để nhận giải thích nhanh.",
        },
        tutor: {
          title: "Gia sư AI",
          description: "Hỏi ngữ pháp, sửa câu và luyện hội thoại theo tình huống.",
        },
        community: {
          title: "Cộng đồng học tập",
          description: "Chia sẻ câu hỏi, mẹo học và ghi chú hữu ích với người cùng học.",
        },
      },
    },
    flow: {
      title: "Học theo một nhịp dễ duy trì",
      subtitle:
        "Mỗi phiên học được chia nhỏ để bạn biết nên bắt đầu ở đâu, cần ôn gì và khi nào nên luyện phản xạ.",
      steps: {
        goal: {
          label: "Đặt mục tiêu",
          title: "Chọn cấp độ phù hợp",
          description: "Bắt đầu từ nền tảng hiện tại để bài học vừa sức.",
        },
        lessons: {
          label: "Học theo bài",
          title: "Đi qua nội dung ngắn",
          description: "Từ vựng, mẫu câu, pinyin và ví dụ được gom thành từng phiên học.",
        },
        review: {
          label: "Ôn có nhịp",
          title: "Biến kiến thức thành phản xạ",
          description: "Luyện nghe, nói, viết, dịch và ôn lại bằng bài tập tương tác.",
        },
      },
    },
    cta: {
      title: "Sẵn sàng học một phiên ngắn hôm nay?",
      subtitle:
        "Bắt đầu với lộ trình đang chờ sẵn, hoặc thử dịch nhanh một đoạn tiếng Trung bạn gặp trong ngày.",
      translate: "Thử dịch văn bản",
    },
    footer: {
      tagline: "Bài học, ôn tập và gia sư AI cho tiếng Trung, gom trong một nơi.",
      navLabel: "Chân trang",
      groups: { learn: "Học tập", practice: "Luyện tập", tools: "Công cụ" },
      links: {
        learn: "Lộ trình HSK",
        foundation: "Nền tảng",
        grammar: "Ngữ pháp",
        radicals: "Bộ thủ",
        practice: "Luyện tập",
        review: "Ôn tập",
        tutor: "Gia sư AI",
        dictionary: "Từ điển",
        translate: "Dịch",
        community: "Cộng đồng",
        guide: "Hướng dẫn",
      },
      copyright: "© {year} Study Chinese. Bảo lưu mọi quyền.",
    },
  },

  "zh-Hans": {
    nav: {
      tagline: "HSK 学习",
      languageLabel: "切换语言",
      roadmap: "学习路径",
      practice: "练习",
      translate: "快速翻译",
    },
    hero: {
      badge: "全面的中文学习平台",
      title: "有节奏、有路径地学中文",
      subtitle: "HSK 课程、反应练习、词典和 AI 导师，都在同一个清晰的学习空间里。",
      ctaGuest: "免费开始学习",
      ctaAuthed: "继续学习",
      secondary: "查看指南",
    },
    preview: {
      sessionTitle: "今天的学习",
      sessionSubtitle: "HSK 2 - 日常交流",
      statSession: "学习时长",
      statNewWords: "新词",
      statReviews: "复习",
      wordsTitle: "要记住的词",
      wordsBadge: "学习中",
      // The preview shows hanzi + pinyin + this column, so a Chinese gloss would
      // just repeat the hanzi. Describe when the phrase is used instead.
      meanings: ["打招呼时使用", "在餐厅点菜", "描述今天的状态"],
      aiTitle: "AI 导师随时待命",
      aiBody: "在课程中直接提问词语用法、请求改句，或创建口语练习情景。",
    },
    features: {
      title: "一套足够精简、可以天天用的工具",
      subtitle: "主要功能沿着学习路径串联起来，而不是散落在互不相关的页面里。",
      open: "打开工具",
      items: {
        path: {
          title: "清晰的 HSK 路径",
          description: "在一条随时可以回到的主线上追踪课程、等级和进度。",
        },
        practice: {
          title: "口语与反应练习",
          description: "通过简短练习来听、说、组句并记住汉字字形。",
        },
        dictionary: {
          title: "结合语境的词典",
          description: "查询拼音、释义和例句，并保存需要复习的生词。",
        },
        translate: {
          title: "翻译文字和图片",
          description: "输入句子或拍下汉字，即可获得快速讲解。",
        },
        tutor: {
          title: "AI 导师",
          description: "询问语法、修改句子，并按情景练习对话。",
        },
        community: {
          title: "学习社区",
          description: "与其他学习者分享问题、学习技巧和实用笔记。",
        },
      },
    },
    flow: {
      title: "一种容易坚持的学习节奏",
      subtitle: "每次学习都被拆成小块，让你知道从哪里开始、要复习什么、什么时候练反应。",
      steps: {
        goal: {
          label: "设定目标",
          title: "选择合适的等级",
          description: "从你现在的基础出发，让每节课都难度适中。",
        },
        lessons: {
          label: "按课学习",
          title: "学完简短的内容",
          description: "生词、句型、拼音和例句被整合成一次学习。",
        },
        review: {
          label: "有节奏地复习",
          title: "把知识变成反应",
          description: "通过互动练习来练听、说、写、译并复习。",
        },
      },
    },
    cta: {
      title: "今天来一次简短的学习吗？",
      subtitle: "从已经为你准备好的路径开始，或者试着翻译一段你今天遇到的中文。",
      translate: "试试翻译文字",
    },
    footer: {
      tagline: "中文课程、复习和 AI 导师，全都集中在一处。",
      navLabel: "页脚导航",
      groups: { learn: "学习", practice: "练习", tools: "工具" },
      links: {
        learn: "HSK 路径",
        foundation: "入门基础",
        grammar: "语法",
        radicals: "部首",
        practice: "练习",
        review: "复习",
        tutor: "AI 导师",
        dictionary: "词典",
        translate: "翻译",
        community: "社区",
        guide: "使用指南",
      },
      copyright: "© {year} Study Chinese. 保留所有权利。",
    },
  },

  "zh-Hant": {
    nav: {
      tagline: "HSK 學習",
      languageLabel: "切換語言",
      roadmap: "學習路徑",
      practice: "練習",
      translate: "快速翻譯",
    },
    hero: {
      badge: "全面的中文學習平台",
      title: "有節奏、有路徑地學中文",
      subtitle: "HSK 課程、反應練習、詞典和 AI 導師，都在同一個清晰的學習空間裡。",
      ctaGuest: "免費開始學習",
      ctaAuthed: "繼續學習",
      secondary: "查看指南",
    },
    preview: {
      sessionTitle: "今天的學習",
      sessionSubtitle: "HSK 2 - 日常交流",
      statSession: "學習時長",
      statNewWords: "新詞",
      statReviews: "複習",
      wordsTitle: "要記住的詞",
      wordsBadge: "學習中",
      // See the zh-Hans note above: usage context, not a same-language gloss.
      meanings: ["打招呼時使用", "在餐廳點菜", "描述今天的狀態"],
      aiTitle: "AI 導師隨時待命",
      aiBody: "在課程中直接提問詞語用法、請求改句，或建立口說練習情境。",
    },
    features: {
      title: "一套足夠精簡、可以天天用的工具",
      subtitle: "主要功能沿著學習路徑串連起來，而不是散落在互不相關的頁面裡。",
      open: "開啟工具",
      items: {
        path: {
          title: "清晰的 HSK 路徑",
          description: "在一條隨時可以回來的主線上追蹤課程、等級和進度。",
        },
        practice: {
          title: "口說與反應練習",
          description: "透過簡短練習來聽、說、組句並記住漢字字形。",
        },
        dictionary: {
          title: "結合語境的詞典",
          description: "查詢拼音、釋義和例句，並儲存需要複習的生詞。",
        },
        translate: {
          title: "翻譯文字和圖片",
          description: "輸入句子或拍下漢字，即可獲得快速講解。",
        },
        tutor: {
          title: "AI 導師",
          description: "詢問文法、修改句子，並依情境練習對話。",
        },
        community: {
          title: "學習社群",
          description: "與其他學習者分享問題、學習技巧和實用筆記。",
        },
      },
    },
    flow: {
      title: "一種容易堅持的學習節奏",
      subtitle: "每次學習都被拆成小塊，讓你知道從哪裡開始、要複習什麼、什麼時候練反應。",
      steps: {
        goal: {
          label: "設定目標",
          title: "選擇合適的等級",
          description: "從你現在的基礎出發，讓每堂課都難度適中。",
        },
        lessons: {
          label: "按課學習",
          title: "學完簡短的內容",
          description: "生詞、句型、拼音和例句被整合成一次學習。",
        },
        review: {
          label: "有節奏地複習",
          title: "把知識變成反應",
          description: "透過互動練習來練聽、說、寫、譯並複習。",
        },
      },
    },
    cta: {
      title: "今天來一次簡短的學習嗎？",
      subtitle: "從已經為你準備好的路徑開始，或者試著翻譯一段你今天遇到的中文。",
      translate: "試試翻譯文字",
    },
    footer: {
      tagline: "中文課程、複習和 AI 導師，全都集中在一處。",
      navLabel: "頁尾導覽",
      groups: { learn: "學習", practice: "練習", tools: "工具" },
      links: {
        learn: "HSK 路徑",
        foundation: "入門基礎",
        grammar: "文法",
        radicals: "部首",
        practice: "練習",
        review: "複習",
        tutor: "AI 導師",
        dictionary: "詞典",
        translate: "翻譯",
        community: "社群",
        guide: "使用指南",
      },
      copyright: "© {year} Study Chinese. 保留所有權利。",
    },
  },
};
