// Authored content for HSK3-6 standard lessons.
// HSK3: a topic-agnostic advice dialogue with one authored {activity} slot per topic.
// HSK4-6: the level passage plus real EN/VI translations with a {F} focus slot.
// Pools are rotated by lesson index so distractor sets never repeat more than twice.

// Accented Vietnamese lesson titles (the generator TOPICS list is unaccented).
export const TITLES_VI = {
  3: {
    'study-method': 'Phương pháp học',
    'travel-experience': 'Trải nghiệm du lịch',
    'job-interview': 'Phỏng vấn xin việc',
    'online-shopping': 'Mua hàng trên mạng',
    neighbors: 'Hàng xóm',
    'movie-opinion': 'Cảm nhận về phim',
    fitness: 'Thói quen lành mạnh',
    library: 'Thư viện',
    'schedule-change': 'Thay đổi kế hoạch',
    'work-pressure': 'Áp lực công việc',
    friendship: 'Tình bạn',
    'lost-item': 'Mất đồ',
    bank: 'Ngân hàng',
    festival: 'Lễ hội',
    news: 'Tin tức',
    environment: 'Môi trường',
    review: 'Ôn tập tổng hợp'
  },
  4: {
    teamwork: 'Làm việc nhóm',
    'time-management': 'Quản lý thời gian',
    'online-learning': 'Học trực tuyến',
    'public-transport': 'Giao thông công cộng',
    'workplace-feedback': 'Phản hồi nơi làm việc',
    'consumer-choice': 'Lựa chọn tiêu dùng',
    community: 'Dịch vụ cộng đồng',
    culture: 'Khác biệt văn hóa',
    technology: 'Công nghệ và đời sống',
    education: 'Công bằng giáo dục',
    'health-choice': 'Lựa chọn sức khỏe',
    'city-space': 'Không gian đô thị',
    media: 'Thông tin truyền thông',
    career: 'Phát triển nghề nghiệp',
    service: 'Chất lượng dịch vụ',
    risk: 'Nhận thức rủi ro',
    review: 'Ôn tập quan điểm'
  },
  5: {
    'implicit-meaning': 'Hàm ý',
    'academic-reading': 'Đọc học thuật',
    'professional-email': 'Email công việc',
    'social-change': 'Biến đổi xã hội',
    innovation: 'Đổi mới',
    ethics: 'Lựa chọn đạo đức',
    memory: 'Trí nhớ và học tập',
    leadership: 'Năng lực lãnh đạo',
    negotiation: 'Thương lượng',
    identity: 'Bản sắc',
    research: 'Phương pháp nghiên cứu',
    persuasion: 'Chiến lược thuyết phục',
    urbanization: 'Đô thị hóa',
    'digital-life': 'Đời sống số',
    'public-policy': 'Chính sách công',
    'art-review': 'Phê bình nghệ thuật',
    review: 'Ôn tập nâng cao'
  },
  6: {
    'classical-allusion': 'Điển cố',
    rhetoric: 'Tu từ',
    'public-discourse': 'Diễn ngôn công cộng',
    philosophy: 'Suy tư triết học',
    'literary-style': 'Phong cách văn học',
    'historical-memory': 'Ký ức lịch sử',
    'cross-cultural': 'Biểu đạt liên văn hóa',
    'argument-synthesis': 'Tổng hợp lập luận',
    'policy-critique': 'Bình luận chính sách',
    metaphor: 'Ẩn dụ',
    translation: 'Lựa chọn dịch thuật',
    'innovation-risk': 'Rủi ro đổi mới',
    'collective-memory': 'Ký ức tập thể',
    'media-framing': 'Khung truyền thông',
    'aesthetic-judgment': 'Phán đoán thẩm mỹ',
    'negotiating-tone': 'Kiểm soát giọng điệu',
    review: 'Ôn tập tinh thông'
  }
};

// English/Vietnamese gloss of each topic focus word.
export const FOCUS_GLOSS = {
  3: {
    'study-method': { en: 'method', vi: 'phương pháp' },
    'travel-experience': { en: 'experience', vi: 'trải nghiệm' },
    'job-interview': { en: 'interview', vi: 'phỏng vấn' },
    'online-shopping': { en: 'online', vi: 'trên mạng' },
    neighbors: { en: 'neighbor', vi: 'hàng xóm' },
    'movie-opinion': { en: 'movie', vi: 'phim' },
    fitness: { en: 'health', vi: 'sức khỏe' },
    library: { en: 'library', vi: 'thư viện' },
    'schedule-change': { en: 'change', vi: 'sự thay đổi' },
    'work-pressure': { en: 'pressure', vi: 'áp lực' },
    friendship: { en: 'relationship', vi: 'mối quan hệ' },
    'lost-item': { en: 'to lose', vi: 'đánh mất' },
    bank: { en: 'bank', vi: 'ngân hàng' },
    festival: { en: 'festival', vi: 'ngày lễ' },
    news: { en: 'news', vi: 'tin tức' },
    environment: { en: 'environment', vi: 'môi trường' },
    review: { en: 'to review', vi: 'ôn tập' }
  },
  4: {
    teamwork: { en: 'team', vi: 'đội nhóm' },
    'time-management': { en: 'efficiency', vi: 'hiệu suất' },
    'online-learning': { en: 'platform', vi: 'nền tảng' },
    'public-transport': { en: 'traffic', vi: 'giao thông' },
    'workplace-feedback': { en: 'feedback', vi: 'phản hồi' },
    'consumer-choice': { en: 'consumption', vi: 'tiêu dùng' },
    community: { en: 'community', vi: 'cộng đồng' },
    culture: { en: 'difference', vi: 'sự khác biệt' },
    technology: { en: 'technology', vi: 'công nghệ' },
    education: { en: 'fairness', vi: 'sự công bằng' },
    'health-choice': { en: 'choice', vi: 'sự lựa chọn' },
    'city-space': { en: 'space', vi: 'không gian' },
    media: { en: 'media', vi: 'truyền thông' },
    career: { en: 'career', vi: 'nghề nghiệp' },
    service: { en: 'quality', vi: 'chất lượng' },
    risk: { en: 'risk', vi: 'rủi ro' },
    review: { en: 'viewpoint', vi: 'quan điểm' }
  },
  5: {
    'implicit-meaning': { en: 'implication', vi: 'sự ám chỉ' },
    'academic-reading': { en: 'argumentation', vi: 'lập luận' },
    'professional-email': { en: 'tone', vi: 'giọng điệu' },
    'social-change': { en: 'change', vi: 'sự thay đổi' },
    innovation: { en: 'innovation', vi: 'sự đổi mới' },
    ethics: { en: 'ethics', vi: 'đạo đức' },
    memory: { en: 'memory', vi: 'trí nhớ' },
    leadership: { en: 'leadership', vi: 'năng lực lãnh đạo' },
    negotiation: { en: 'negotiation', vi: 'thương lượng' },
    identity: { en: 'identity', vi: 'bản sắc' },
    research: { en: 'research', vi: 'nghiên cứu' },
    persuasion: { en: 'persuasion', vi: 'thuyết phục' },
    urbanization: { en: 'urbanization', vi: 'đô thị hóa' },
    'digital-life': { en: 'privacy', vi: 'quyền riêng tư' },
    'public-policy': { en: 'policy', vi: 'chính sách' },
    'art-review': { en: 'aesthetics', vi: 'thẩm mỹ' },
    review: { en: 'stance', vi: 'lập trường' }
  },
  6: {
    'classical-allusion': { en: 'classical allusions', vi: 'điển cố' },
    rhetoric: { en: 'rhetoric', vi: 'tu từ' },
    'public-discourse': { en: 'discourse', vi: 'diễn ngôn' },
    philosophy: { en: 'speculative thinking', vi: 'tư biện' },
    'literary-style': { en: 'writing technique', vi: 'bút pháp' },
    'historical-memory': { en: 'memory', vi: 'ký ức' },
    'cross-cultural': { en: 'context', vi: 'ngữ cảnh' },
    'argument-synthesis': { en: 'synthesis', vi: 'tổng hợp' },
    'policy-critique': { en: 'appraisal', vi: 'bình xét' },
    metaphor: { en: 'metaphor', vi: 'ẩn dụ' },
    translation: { en: 'trade-offs', vi: 'sự cân nhắc lấy bỏ' },
    'innovation-risk': { en: 'cost', vi: 'cái giá' },
    'collective-memory': { en: 'the collective', vi: 'tập thể' },
    'media-framing': { en: 'framing', vi: 'khung' },
    'aesthetic-judgment': { en: 'judgment', vi: 'phán đoán' },
    'negotiating-tone': { en: 'fine control', vi: 'sự nắm bắt chừng mực' },
    review: { en: 'integrated mastery', vi: 'sự quán thông' }
  }
};

// ---------------------------------------------------------------------------
// HSK3: shared advice dialogue with a per-topic activity slot.
// ---------------------------------------------------------------------------

export const HSK3 = {
  activities: {
    'study-method': { zh: '用新的方法学习中文', py: 'yong4 xin1 de5 fang1 fa3 xue2 xi2 Zhong1 wen2', en: 'studying Chinese with a new method', vi: 'học tiếng Trung theo phương pháp mới' },
    'travel-experience': { zh: '写自己的旅行经历', py: 'xie3 zi4 ji3 de5 lv3 xing2 jing1 li4', en: 'writing about my travel experiences', vi: 'viết về trải nghiệm du lịch của mình' },
    'job-interview': { zh: '准备一个重要的面试', py: 'zhun3 bei4 yi2 ge4 zhong4 yao4 de5 mian4 shi4', en: 'preparing for an important job interview', vi: 'chuẩn bị cho một buổi phỏng vấn quan trọng' },
    'online-shopping': { zh: '学着在网上买东西', py: 'xue2 zhe5 zai4 wang3 shang4 mai3 dong1 xi5', en: 'learning to shop online', vi: 'tập mua sắm trên mạng' },
    neighbors: { zh: '认识新搬来的邻居', py: 'ren4 shi5 xin1 ban1 lai2 de5 lin2 ju1', en: 'getting to know the neighbors who just moved in', vi: 'làm quen với hàng xóm mới chuyển đến' },
    'movie-opinion': { zh: '练习用中文介绍电影', py: 'lian4 xi2 yong4 Zhong1 wen2 jie4 shao4 dian4 ying3', en: 'practicing introducing movies in Chinese', vi: 'tập giới thiệu phim bằng tiếng Trung' },
    fitness: { zh: '每天锻炼身体', py: 'mei3 tian1 duan4 lian4 shen1 ti3', en: 'exercising every day', vi: 'rèn luyện sức khỏe mỗi ngày' },
    library: { zh: '在图书馆准备考试', py: 'zai4 tu2 shu1 guan3 zhun3 bei4 kao3 shi4', en: 'preparing for an exam at the library', vi: 'ôn thi ở thư viện' },
    'schedule-change': { zh: '改变自己每天的安排', py: 'gai3 bian4 zi4 ji3 mei3 tian1 de5 an1 pai2', en: 'changing my daily schedule', vi: 'thay đổi thời gian biểu hằng ngày' },
    'work-pressure': { zh: '学着不让自己太累', py: 'xue2 zhe5 bu2 rang4 zi4 ji3 tai4 lei4', en: 'learning not to wear myself out at work', vi: 'học cách không để bản thân quá mệt vì công việc' },
    friendship: { zh: '和老朋友多见面、多聊天', py: 'he2 lao3 peng2 you5 duo1 jian4 mian4, duo1 liao2 tian1', en: 'meeting and chatting more with old friends', vi: 'gặp gỡ, trò chuyện nhiều hơn với bạn cũ' },
    'lost-item': { zh: '找我丢了的钱包', py: 'zhao3 wo3 diu1 le5 de5 qian2 bao1', en: 'looking for the wallet I lost', vi: 'tìm chiếc ví bị đánh mất' },
    bank: { zh: '学着去银行办事', py: 'xue2 zhe5 qu4 yin2 hang2 ban4 shi4', en: 'learning to handle business at the bank', vi: 'tập đến ngân hàng làm thủ tục' },
    festival: { zh: '了解中国的节日', py: 'liao3 jie3 Zhong1 guo2 de5 jie2 ri4', en: 'learning about Chinese festivals', vi: 'tìm hiểu các ngày lễ của Trung Quốc' },
    news: { zh: '用中文看新闻', py: 'yong4 Zhong1 wen2 kan4 xin1 wen2', en: 'reading the news in Chinese', vi: 'đọc tin tức bằng tiếng Trung' },
    environment: { zh: '关心身边的环境', py: 'guan1 xin1 shen1 bian1 de5 huan2 jing4', en: 'paying attention to the environment around me', vi: 'quan tâm đến môi trường quanh mình' },
    review: { zh: '复习以前学过的中文', py: 'fu4 xi2 yi3 qian2 xue2 guo5 de5 Zhong1 wen2', en: 'reviewing the Chinese I learned before', vi: 'ôn lại phần tiếng Trung đã học' }
  },
  // {A*} placeholders are replaced with the topic activity (zh/py/en/vi).
  frame: [
    ['A', '最近我在{A}，可是遇到了一点儿问题。', 'Zui4 jin4 wo3 zai4 {APY}, ke3 shi4 yu4 dao4 le5 yi4 dian3r5 wen4 ti2.', "Lately I've been {AEN}, but I've run into a bit of a problem.", 'Dạo này mình đang {AVI}, nhưng gặp phải một chút vấn đề.'],
    ['B', '别着急。你可以先把问题写下来，然后再想办法。', 'Bie2 zhao2 ji2. Ni3 ke3 yi3 xian1 ba3 wen4 ti2 xie3 xia4 lai2, ran2 hou4 zai4 xiang3 ban4 fa3.', "Don't worry. You can write the problems down first, then think of a way to solve them.", 'Đừng sốt ruột. Bạn có thể ghi vấn đề ra trước, rồi sau đó mới nghĩ cách giải quyết.'],
    ['A', '我觉得这个建议很有用，我以前没有这样做过。', 'Wo3 jue2 de5 zhe4 ge5 jian4 yi4 hen3 you3 yong4, wo3 yi3 qian2 mei2 you3 zhe4 yang4 zuo4 guo5.', "I think that's a really useful suggestion — I've never done it that way before.", 'Mình thấy gợi ý này rất hữu ích, trước giờ mình chưa từng làm như vậy.'],
    ['B', '因为你是第一次做，所以觉得难，谁都会这样。', 'Yin1 wei4 ni3 shi4 di4 yi1 ci4 zuo4, suo3 yi3 jue2 de5 nan2, shei2 dou1 hui4 zhe4 yang4.', "It feels hard because it's your first time — that happens to everyone.", 'Vì là lần đầu bạn làm nên mới thấy khó, ai cũng vậy cả thôi.'],
    ['A', '那我每天做一点儿，慢慢来。', 'Na4 wo3 mei3 tian1 zuo4 yi4 dian3r5, man4 man5 lai2.', "Then I'll do a little every day and take it slowly.", 'Vậy mình sẽ làm mỗi ngày một chút, cứ từ từ.'],
    ['B', '对，你每天都做，就一定会越来越好。', 'Dui4, ni3 mei3 tian1 dou1 zuo4, jiu4 yi2 ding4 hui4 yue4 lai2 yue4 hao3.', "Exactly — if you keep at it every day, things will definitely get better and better.", 'Đúng vậy, ngày nào bạn cũng làm thì nhất định sẽ càng ngày càng tốt lên.']
  ],
  vocabBase: [
    ['遇到', 'yu4 dao4', 'verb', 'to run into, to encounter', 'gặp phải'],
    ['问题', 'wen4 ti2', 'noun', 'problem, question', 'vấn đề'],
    ['办法', 'ban4 fa3', 'noun', 'way, solution', 'cách, biện pháp'],
    ['建议', 'jian4 yi4', 'noun/verb', 'suggestion; to suggest', 'gợi ý, đề nghị'],
    ['着急', 'zhao2 ji2', 'adjective', 'anxious, worried', 'sốt ruột, lo lắng'],
    ['第一次', 'di4 yi1 ci4', 'phrase', 'the first time', 'lần đầu tiên'],
    ['一定', 'yi2 ding4', 'adverb', 'certainly, definitely', 'nhất định'],
    ['越来越', 'yue4 lai2 yue4', 'adverb', 'more and more', 'càng ngày càng']
  ],
  grammar: [
    {
      pattern: '先……，然后……',
      explanation: '说明两个动作的先后顺序：先做A，然后做B。',
      explanation_vi: 'Diễn tả thứ tự hai hành động: làm A trước, sau đó (然后) mới làm B.',
      examples: [
        ['你可以先把问题写下来，然后再想办法。', 'Ni3 ke3 yi3 xian1 ba3 wen4 ti2 xie3 xia4 lai2, ran2 hou4 zai4 xiang3 ban4 fa3.', 'You can write the problem down first and then think of a solution.', 'Bạn có thể ghi vấn đề ra trước, sau đó mới nghĩ cách giải quyết.'],
        ['我先做作业，然后休息。', 'Wo3 xian1 zuo4 zuo4 ye4, ran2 hou4 xiu1 xi5.', 'I do my homework first, then rest.', 'Mình làm bài tập trước, sau đó mới nghỉ ngơi.'],
        ['我们先买票，然后上车。', 'Wo3 men5 xian1 mai3 piao4, ran2 hou4 shang4 che1.', 'We buy the tickets first, then board.', 'Chúng mình mua vé trước rồi mới lên xe.']
      ]
    },
    {
      pattern: '越来越 + 形容词',
      explanation: '“越来越”表示程度随时间不断变高。',
      explanation_vi: '越来越 + tính từ = càng ngày càng…: mức độ tăng dần theo thời gian.',
      examples: [
        ['你的中文越来越好。', 'Ni3 de5 Zhong1 wen2 yue4 lai2 yue4 hao3.', 'Your Chinese is getting better and better.', 'Tiếng Trung của bạn càng ngày càng khá.'],
        ['天气越来越冷。', 'Tian1 qi4 yue4 lai2 yue4 leng3.', 'The weather is getting colder and colder.', 'Trời càng ngày càng lạnh.'],
        ['喜欢运动的人越来越多。', 'Xi3 huan5 yun4 dong4 de5 ren2 yue4 lai2 yue4 duo1.', 'More and more people enjoy sports.', 'Người thích thể thao càng ngày càng nhiều.']
      ]
    }
  ],
  warmup: {
    items: ['关于“{T}”，你想到什么？', '遇到问题的时候，你会先做什么？', '用“越来越”说一句话。'],
    itemsVi: ['Về chủ đề "{TV}", bạn nghĩ ngay đến điều gì?', 'Khi gặp vấn đề, bạn thường làm gì trước tiên?', 'Đặt một câu với 越来越 (càng ngày càng).']
  },
  pools: {
    // wrong activities for fill_blank ex1 / listening options
    wrongActivities: [
      ['看电视', 'kan4 dian4 shi4', 'xem tivi'],
      ['打篮球', 'da3 lan2 qiu2', 'chơi bóng rổ'],
      ['听音乐', 'ting1 yin1 yue4', 'nghe nhạc'],
      ['买东西', 'mai3 dong1 xi5', 'mua sắm'],
      ['做饭', 'zuo4 fan4', 'nấu ăn'],
      ['唱歌', 'chang4 ge1', 'hát'],
      ['睡觉', 'shui4 jiao4', 'ngủ'],
      ['踢足球', 'ti1 zu2 qiu2', 'đá bóng'],
      ['喝咖啡', 'he1 ka1 fei1', 'uống cà phê']
    ],
    // Separate pool for the listening exercise so its distractor pairs never
    // collide with the fill_blank pairs above (max_repeated_distractor_set: 2).
    listenWrongActivities: [
      ['开车', 'kai1 che1', 'lái xe'],
      ['爬山', 'pa2 shan1', 'leo núi'],
      ['画画儿', 'hua4 hua4r5', 'vẽ tranh'],
      ['打扫房间', 'da3 sao3 fang2 jian1', 'dọn phòng'],
      ['洗衣服', 'xi3 yi1 fu5', 'giặt quần áo'],
      ['跳舞', 'tiao4 wu3', 'nhảy múa'],
      ['照相', 'zhao4 xiang4', 'chụp ảnh'],
      ['骑自行车', 'qi2 zi4 xing2 che1', 'đạp xe'],
      ['玩儿游戏', 'wan2r5 you2 xi4', 'chơi trò chơi điện tử']
    ],
    readingWrong: [
      ['先去睡觉', 'ngủ trước đã'],
      ['先看电视', 'xem tivi trước'],
      ['先去玩儿', 'đi chơi trước'],
      ['先买东西', 'đi mua sắm trước'],
      ['先去吃饭', 'đi ăn trước'],
      ['先回家', 'về nhà trước'],
      ['先听音乐', 'nghe nhạc trước'],
      ['先去跑步', 'đi chạy bộ trước'],
      ['先喝咖啡', 'uống cà phê trước']
    ],
    fill2Wrong: [
      ['越来越难', 'càng ngày càng khó'],
      ['越来越冷', 'càng ngày càng lạnh'],
      ['越来越贵', 'càng ngày càng đắt'],
      ['越来越慢', 'càng ngày càng chậm'],
      ['越来越少', 'càng ngày càng ít'],
      ['越来越忙', 'càng ngày càng bận'],
      ['越来越远', 'càng ngày càng xa'],
      ['越来越晚', 'càng ngày càng muộn'],
      ['越来越小', 'càng ngày càng nhỏ']
    ],
    mcQuestions: [
      { prompt: '“别着急”的意思是……', py: '"Bie2 zhao2 ji2" de5 yi4 si5 shi4...', opts: ['不要太急，慢慢来', '快一点儿做', '不要做了'], optsVi: ['đừng vội, cứ từ từ', 'làm nhanh lên', 'đừng làm nữa'], expl: '“别着急”是请对方不要太急。', explVi: '别着急 = đừng sốt ruột, cứ bình tĩnh từ từ.' },
      { prompt: '“越来越好”的意思是……', py: '"Yue4 lai2 yue4 hao3" de5 yi4 si5 shi4...', opts: ['一天比一天好', '越做越不好', '和以前一样'], optsVi: ['mỗi ngày một tốt hơn', 'càng làm càng tệ', 'vẫn như trước'], expl: '“越来越好”就是一天比一天好。', explVi: '越来越好 = ngày càng tốt lên theo thời gian.' },
      { prompt: '“第一次”的意思是……', py: '"Di4 yi1 ci4" de5 yi4 si5 shi4...', opts: ['以前没做过', '做过很多次', '最后一次'], optsVi: ['trước đây chưa từng làm', 'đã làm rất nhiều lần', 'lần cuối cùng'], expl: '“第一次”表示以前没有做过。', explVi: '第一次 = lần đầu tiên, trước đó chưa từng làm.' },
      { prompt: '“办法”的意思是……', py: '"Ban4 fa3" de5 yi4 si5 shi4...', opts: ['解决问题的方法', '一种工作', '一个地方'], optsVi: ['cách giải quyết vấn đề', 'một loại công việc', 'một địa điểm'], expl: '“办法”就是解决问题的方法。', explVi: '办法 = biện pháp, cách để giải quyết vấn đề.' },
      { prompt: '下面哪个词表示“不快，一点儿一点儿地”？', py: 'Xia4 mian5 na3 ge5 ci2 biao3 shi4 "bu2 kuai4, yi4 dian3r5 yi4 dian3r5 de5"?', opts: ['慢慢', '快快', '越来越'], optsVi: ['chầm chậm, từ từ', 'nhanh nhanh', 'càng ngày càng'], expl: '“慢慢来”表示不用急，一点儿一点儿做。', explVi: '慢慢 (来) = từ từ, không cần vội.' },
      { prompt: '“建议”的意思是……', py: '"Jian4 yi4" de5 yi4 si5 shi4...', opts: ['告诉别人怎么做更好', '问别人问题', '帮别人做事'], optsVi: ['góp ý nên làm thế nào cho tốt hơn', 'hỏi người khác câu hỏi', 'làm việc thay người khác'], expl: '“建议”是告诉别人怎么做更好的话。', explVi: '建议 = lời khuyên, gợi ý cách làm tốt hơn.' },
      { prompt: '“遇到问题”的意思是……', py: '"Yu4 dao4 wen4 ti2" de5 yi4 si5 shi4...', opts: ['有了问题', '解决了问题', '忘了问题'], optsVi: ['gặp phải vấn đề', 'đã giải quyết vấn đề', 'quên mất vấn đề'], expl: '“遇到问题”就是有了问题、碰上了问题。', explVi: '遇到问题 = gặp phải, vấp phải vấn đề.' },
      { prompt: '“慢慢来”的意思是……', py: '"Man4 man5 lai2" de5 yi4 si5 shi4...', opts: ['不用急，一步一步做', '走路很慢', '来得很晚'], optsVi: ['không cần vội, làm từng bước', 'đi bộ rất chậm', 'đến rất muộn'], expl: '“慢慢来”请人不要急，一步一步做。', explVi: '慢慢来 = cứ bình tĩnh làm từng bước một.' },
      { prompt: '“有用”的意思是……', py: '"You3 yong4" de5 yi4 si5 shi4...', opts: ['对你有帮助', '很好看', '很贵'], optsVi: ['có ích, giúp được bạn', 'rất đẹp', 'rất đắt'], expl: '“有用”表示对人有帮助。', explVi: '有用 = hữu ích, có ích cho mình.' }
    ]
  }
};

// ---------------------------------------------------------------------------
// HSK4-6 passages with real translations. {F} = focus hanzi, {FEN}/{FVI} = gloss.
// ---------------------------------------------------------------------------

export const HIGH = {
  4: {
    passage: '这段材料讨论{F}。在现实生活中，{F}不只是一个简单话题，也会影响个人选择和团队决定。有人认为，只要目标清楚，行动就会自然有效；然而，材料提醒我们，目标、证据和原因必须放在一起看。没有证据的观点容易显得空，只有情绪的判断也容易失去平衡。因此，学习者需要先找出材料的主要观点，再说明它怎样影响具体行动。材料还强调，讨论问题时要注意对象、场合和结果，不能只看个人感受。这样的阅读训练不是背答案，而是用清楚的理由理解问题、比较选择，并提出合理建议，使表达更可靠。',
    passageEn: "This passage discusses {FEN}. In real life, {FEN} is not just a simple topic; it also affects personal choices and team decisions. Some people believe that as long as the goal is clear, action will naturally be effective; however, the passage reminds us that goals, evidence and reasons must be considered together. A viewpoint without evidence easily rings hollow, and a judgment driven only by emotion easily loses balance. Therefore, learners need to first identify the passage's main viewpoint, and then explain how it shapes concrete actions. The passage also stresses that when discussing a problem we should mind the audience, the occasion and the consequences, instead of looking only at personal feelings. Reading training of this kind is not about memorizing answers; it is about using clear reasons to understand problems, compare options and offer sensible suggestions, so that one's expression becomes more reliable.",
    passageVi: 'Bài đọc này bàn về {FVI}. Trong đời sống thực, {FVI} không chỉ là một chủ đề đơn giản mà còn ảnh hưởng đến lựa chọn cá nhân và quyết định của tập thể. Có người cho rằng chỉ cần mục tiêu rõ ràng thì hành động tự khắc sẽ hiệu quả; tuy nhiên, bài đọc nhắc chúng ta rằng mục tiêu, bằng chứng và lý do phải được xem xét cùng nhau. Quan điểm thiếu bằng chứng dễ trở nên sáo rỗng, còn phán đoán chỉ dựa vào cảm xúc thì dễ mất cân bằng. Vì vậy, người học cần tìm ra quan điểm chính của bài trước, rồi giải thích nó ảnh hưởng thế nào đến hành động cụ thể. Bài đọc cũng nhấn mạnh: khi thảo luận vấn đề phải chú ý đến đối tượng, hoàn cảnh và hệ quả, không thể chỉ nhìn cảm nhận cá nhân. Kiểu luyện đọc này không phải là học thuộc đáp án, mà là dùng lý lẽ rõ ràng để hiểu vấn đề, so sánh các lựa chọn và đưa ra đề xuất hợp lý, giúp cách diễn đạt trở nên đáng tin cậy hơn.',
    summaryEn: 'An argumentative passage on {FEN}: viewpoints need evidence and reasons, and discussions must mind audience, occasion and consequences.',
    summaryVi: 'Bài nghị luận về {FVI}: quan điểm cần bằng chứng và lý do, khi thảo luận phải chú ý đối tượng, hoàn cảnh và hệ quả.',
    listeningSentences: 2,
    vocabBase: [
      ['材料', 'cai2 liao4', 'noun', 'material, text', 'tài liệu, bài đọc'],
      ['观点', 'guan1 dian3', 'noun', 'viewpoint', 'quan điểm'],
      ['影响', 'ying3 xiang3', 'verb/noun', 'to influence; influence', 'ảnh hưởng'],
      ['原因', 'yuan2 yin1', 'noun', 'reason, cause', 'nguyên nhân'],
      ['证据', 'zheng4 ju4', 'noun', 'evidence', 'bằng chứng'],
      ['然而', 'ran2 er2', 'conjunction', 'however', 'tuy nhiên'],
      ['因此', 'yin1 ci3', 'conjunction', 'therefore', 'vì vậy'],
      ['平衡', 'ping2 heng2', 'verb/noun', 'to balance; balance', 'cân bằng']
    ],
    grammar: [
      {
        pattern: '不只是……，也……',
        explanation: '说明一个事物有两个层面的作用。',
        explanation_vi: 'Không chỉ… mà còn…: nêu hai tầng ý nghĩa/tác dụng của một sự vật.',
        examples: [
          ['{F}不只是话题，也影响选择。', '{FEN} is not just a topic; it also influences choices.', '{FVI} không chỉ là một chủ đề, nó còn ảnh hưởng đến lựa chọn.'],
          ['学习不只是记词，也训练思考。', 'Studying is not just memorizing words; it also trains thinking.', 'Học không chỉ là ghi nhớ từ, mà còn rèn luyện tư duy.'],
          ['服务不只是速度，也包括质量。', 'Service is not only about speed; it also includes quality.', 'Dịch vụ không chỉ là tốc độ, mà còn bao gồm chất lượng.']
        ]
      },
      {
        pattern: '因此 + 结果/建议',
        explanation: '用“因此”接前文理由，推出结果或建议。',
        explanation_vi: '因此 (vì vậy) nối lý do phía trước với kết quả hoặc đề xuất phía sau.',
        examples: [
          ['证据很清楚，因此观点更有力。', 'The evidence is clear; therefore the viewpoint is more convincing.', 'Bằng chứng rõ ràng, vì vậy quan điểm thuyết phục hơn.'],
          ['原因复杂，因此决定要平衡。', 'The causes are complex; therefore decisions must be balanced.', 'Nguyên nhân phức tạp, vì vậy quyết định cần cân bằng.'],
          ['{F}影响很大，因此需要讨论。', '{FEN} has a big impact; therefore it needs to be discussed.', '{FVI} có ảnh hưởng lớn, vì vậy cần được thảo luận.']
        ]
      }
    ],
    reading: {
      q: '关于{F}，材料的主要观点是什么？',
      correct: '目标、证据和原因要放在一起看',
      correctVi: 'mục tiêu, bằng chứng và lý do phải xem xét cùng nhau',
      expl: '材料说：“目标、证据和原因必须放在一起看。”',
      explVi: 'Bài đọc khẳng định: mục tiêu, bằng chứng và lý do phải được đặt cạnh nhau để xem xét.'
    },
    listening: {
      q: '这段话讨论的话题是什么？',
      expl: '第一句就说“这段材料讨论{F}”。',
      explVi: 'Câu mở đầu đã nêu rõ chủ đề của đoạn: {FVI}.'
    },
    trueFalse: {
      statement: '材料认为，没有证据的观点也很有说服力。',
      answer: false,
      expl: '材料说“没有证据的观点容易显得空”。',
      explVi: 'Sai. Bài đọc nói quan điểm thiếu bằng chứng dễ trở nên sáo rỗng, không có sức thuyết phục.'
    },
    fill2: {
      prompt: '没有证据的观点容易显得___。',
      correct: '空',
      correctVi: 'sáo rỗng',
      expl: '原文：“没有证据的观点容易显得空。”',
      explVi: 'Nguyên văn: quan điểm không có bằng chứng dễ trở nên trống rỗng (空).'
    },
    pools: {
      topicNouns: [
        ['音乐', 'âm nhạc'], ['历史', 'lịch sử'], ['天气', 'thời tiết'], ['旅行', 'du lịch'], ['美食', 'ẩm thực'],
        ['体育', 'thể thao'], ['艺术', 'nghệ thuật'], ['语言', 'ngôn ngữ'], ['动物', 'động vật'], ['植物', 'thực vật']
      ],
      readingWrong: [
        ['只要目标清楚，行动就一定有效', 'chỉ cần mục tiêu rõ ràng thì hành động chắc chắn hiệu quả'],
        ['个人感受是判断的唯一标准', 'cảm nhận cá nhân là tiêu chuẩn duy nhất để phán đoán'],
        ['有情绪的判断更有说服力', 'phán đoán giàu cảm xúc thì thuyết phục hơn'],
        ['讨论问题时不用考虑场合', 'thảo luận vấn đề không cần để ý hoàn cảnh'],
        ['背下答案就能理解材料', 'học thuộc đáp án là hiểu được bài'],
        ['证据不重要，观点才重要', 'bằng chứng không quan trọng, quan điểm mới quan trọng'],
        ['团队决定和个人选择没有关系', 'quyết định tập thể không liên quan lựa chọn cá nhân'],
        ['读得越快，理解得越好', 'đọc càng nhanh hiểu càng tốt'],
        ['别人的建议都不可靠', 'góp ý của người khác đều không đáng tin']
      ],
      fill2Wrong: [
        ['有力', 'mạnh mẽ, thuyết phục'], ['平衡', 'cân bằng'], ['清楚', 'rõ ràng'], ['可靠', 'đáng tin cậy'],
        ['自然', 'tự nhiên'], ['重要', 'quan trọng'], ['合理', 'hợp lý'], ['深刻', 'sâu sắc'], ['全面', 'toàn diện']
      ],
      mcQuestions: [
        { prompt: '“然而”用来表示什么？', opts: ['转折，引出相反的情况', '原因', '举例', '总结'], optsVi: ['chuyển ý, dẫn ra điều trái ngược', 'nguyên nhân', 'nêu ví dụ', 'tổng kết'], expl: '“然而”表示转折，相当于“但是”。', explVi: '然而 = tuy nhiên, dùng để chuyển sang ý trái ngược.' },
        { prompt: '“因此”的意思最接近……', opts: ['所以', '但是', '可是', '如果'], optsVi: ['cho nên', 'nhưng', 'thế nhưng', 'nếu như'], expl: '“因此”表示结果，相当于“所以”。', explVi: '因此 ≈ 所以 (vì vậy, cho nên), dẫn ra kết quả.' },
        { prompt: '“显得空”的意思是……', opts: ['看起来没有内容', '地方很大', '时间很多', '声音很小'], optsVi: ['trông có vẻ trống rỗng, thiếu nội dung', 'nơi rất rộng', 'thời gian rất nhiều', 'âm thanh rất nhỏ'], expl: '“显得空”是看起来没有内容、没有说服力。', explVi: '显得空 = trông sáo rỗng, thiếu sức nặng.' },
        { prompt: '“平衡”在文中指……', opts: ['不偏向一边', '站得很稳', '重量一样', '分数相同'], optsVi: ['không thiên lệch về một phía', 'đứng rất vững', 'trọng lượng bằng nhau', 'điểm số bằng nhau'], expl: '文中“失去平衡”指判断偏向情绪的一边。', explVi: 'Trong bài, 平衡 chỉ sự cân bằng trong phán đoán, không thiên lệch.' },
        { prompt: '“可靠”的意思是……', opts: ['值得相信', '可以拿走', '非常昂贵', '十分少见'], optsVi: ['đáng tin cậy', 'có thể lấy đi', 'rất đắt đỏ', 'rất hiếm gặp'], expl: '“可靠”表示值得相信、靠得住。', explVi: '可靠 = đáng tin cậy, có thể dựa vào.' },
        { prompt: '“强调”的意思是……', opts: ['特别指出，重点说明', '大声说话', '反对意见', '随便说说'], optsVi: ['đặc biệt nhấn mạnh, nói rõ trọng điểm', 'nói to', 'phản đối ý kiến', 'nói qua loa'], expl: '“强调”是特别指出重要的地方。', explVi: '强调 = nhấn mạnh điểm quan trọng.' },
        { prompt: '“合理”的意思是……', opts: ['有道理', '合在一起', '便宜', '快速'], optsVi: ['có lý, hợp lẽ', 'gộp lại với nhau', 'rẻ', 'nhanh chóng'], expl: '“合理”指符合道理。', explVi: '合理 = hợp lý, đúng lẽ.' },
        { prompt: '“提醒”的意思是……', opts: ['让人注意到', '提东西', '醒过来', '大声喊'], optsVi: ['nhắc cho người khác chú ý', 'xách đồ', 'tỉnh dậy', 'hét to'], expl: '“提醒”是让人注意到某件事。', explVi: '提醒 = nhắc nhở để người khác chú ý.' },
        { prompt: '“训练”的意思是……', opts: ['反复练习提高能力', '坐火车', '上课听讲', '考试'], optsVi: ['luyện tập lặp lại để nâng cao năng lực', 'đi tàu hỏa', 'nghe giảng trên lớp', 'thi cử'], expl: '“训练”是反复练习来提高能力。', explVi: '训练 = rèn luyện lặp đi lặp lại để giỏi lên.' }
      ]
    },
    wordOrder: {
      tokens: ['{F}', '不只是', '一个', '简单话题'],
      tokensVi: ['{FVI}', 'không chỉ là', 'một', 'chủ đề đơn giản'],
      correct: '{F}不只是一个简单话题。',
      correctVi: '{FVI} không chỉ là một chủ đề đơn giản.',
      expl: '原文：“{F}不只是一个简单话题，也会影响个人选择和团队决定。”',
      explVi: 'Cấu trúc 不只是… đứng sau chủ ngữ: {FVI} không chỉ là một chủ đề đơn giản.'
    },
    fill1: {
      prompt: '这段材料讨论的话题是___。',
      expl: '第一句说：“这段材料讨论{F}。”',
      explVi: 'Câu đầu tiên nêu chủ đề: bài đọc bàn về {FVI}.'
    },
    blooms: ['apply', 'apply', 'analyze', 'analyze', 'evaluate', 'apply', 'analyze']
  },
  5: {
    passage: '这段材料表面上讨论{F}，背后却在提醒读者注意更深的含义。作者并没有直接给出唯一答案，而是通过几个细节显示自己的倾向：一方面，{F}能够带来新的机会；另一方面，如果只看眼前利益，就可能忽略长期影响。材料中的论证取决于证据是否充分，也取决于语气是否合适。读者需要分辨哪些内容是事实，哪些只是推测，哪些话带有暗示。尤其要注意作者在转折处留下的保留态度。真正的理解不只是找关键词，而是看出观点之间的关系，评价理由的强弱，并用自己的话说明作者为什么这样安排材料。',
    passageEn: 'On the surface this passage discusses {FEN}, yet underneath it reminds the reader to attend to deeper implications. The author does not give a single direct answer, but reveals a leaning through several details: on the one hand, {FEN} can bring new opportunities; on the other, focusing only on immediate benefits may cause long-term effects to be overlooked. The argumentation in the passage depends on whether the evidence is sufficient, and also on whether the tone is appropriate. Readers need to distinguish which statements are facts, which are mere speculation, and which carry implication. Pay special attention to the reservations the author leaves at the turning points. True understanding is not just spotting keywords: it means seeing the relations between viewpoints, weighing the strength of the reasons, and explaining in your own words why the author arranged the material this way.',
    passageVi: 'Bề ngoài, bài đọc này bàn về {FVI}, nhưng đằng sau lại nhắc người đọc chú ý đến những hàm ý sâu hơn. Tác giả không đưa ra một đáp án trực tiếp duy nhất, mà để lộ khuynh hướng của mình qua vài chi tiết: một mặt, {FVI} có thể mang lại cơ hội mới; mặt khác, nếu chỉ nhìn lợi ích trước mắt thì có thể bỏ qua ảnh hưởng lâu dài. Lập luận trong bài phụ thuộc vào việc bằng chứng có đầy đủ hay không, và giọng điệu có phù hợp hay không. Người đọc cần phân biệt nội dung nào là sự thật, nội dung nào chỉ là suy đoán, câu nào mang tính ám chỉ. Đặc biệt cần chú ý thái độ dè dặt mà tác giả để lại ở những chỗ chuyển ý. Hiểu thật sự không phải chỉ là tìm từ khóa, mà là nhìn ra quan hệ giữa các quan điểm, đánh giá lý lẽ mạnh hay yếu, và tự dùng lời của mình giải thích vì sao tác giả sắp xếp bài như vậy.',
    summaryEn: 'A passage on {FEN} that trains readers to separate fact from speculation, notice implications and weigh the author\'s reservations.',
    summaryVi: 'Bài đọc về {FVI} rèn kỹ năng phân biệt sự thật với suy đoán, nhận ra hàm ý và cân nhắc thái độ dè dặt của tác giả.',
    listeningSentences: 2,
    vocabBase: [
      ['材料', 'cai2 liao4', 'noun', 'material, text', 'tài liệu, bài đọc'],
      ['观点', 'guan1 dian3', 'noun', 'viewpoint', 'quan điểm'],
      ['含义', 'han2 yi4', 'noun', 'implication, connotation', 'hàm ý'],
      ['证据', 'zheng4 ju4', 'noun', 'evidence', 'bằng chứng'],
      ['表面', 'biao3 mian4', 'noun', 'surface', 'bề mặt, bề ngoài'],
      ['背后', 'bei4 hou4', 'noun', 'behind, underneath', 'đằng sau'],
      ['倾向', 'qing1 xiang4', 'noun/verb', 'tendency, leaning', 'khuynh hướng'],
      ['取决于', 'qu3 jue2 yu2', 'verb phrase', 'to depend on', 'phụ thuộc vào'],
      ['推测', 'tui1 ce4', 'verb/noun', 'to speculate; speculation', 'suy đoán']
    ],
    grammar: [
      {
        pattern: '表面上……，背后……',
        explanation: '区分表层信息和深层含义。',
        explanation_vi: 'Bề ngoài… nhưng đằng sau…: phân biệt thông tin bề mặt với hàm ý sâu xa.',
        examples: [
          ['材料表面上谈{F}，背后谈选择。', 'On the surface the passage discusses {FEN}; underneath, it discusses choices.', 'Bề ngoài bài đọc nói về {FVI}, nhưng đằng sau là bàn về sự lựa chọn.'],
          ['他表面上同意，背后仍有担心。', 'On the surface he agrees, but underneath he still has worries.', 'Bề ngoài anh ấy đồng ý, nhưng trong lòng vẫn còn lo lắng.'],
          ['问题表面上简单，背后很复杂。', 'The problem looks simple on the surface but is complex underneath.', 'Vấn đề nhìn bề ngoài đơn giản nhưng thực chất rất phức tạp.']
        ]
      },
      {
        pattern: '取决于……',
        explanation: '说明结果由某个条件决定。',
        explanation_vi: '取决于 = phụ thuộc vào: kết quả do điều kiện nào đó quyết định.',
        examples: [
          ['效果取决于证据。', 'The effect depends on the evidence.', 'Hiệu quả phụ thuộc vào bằng chứng.'],
          ['判断取决于{F}的背景。', 'The judgment depends on the context of {FEN}.', 'Phán đoán phụ thuộc vào bối cảnh của {FVI}.'],
          ['语气取决于对象和场合。', 'The tone depends on the audience and the occasion.', 'Giọng điệu phụ thuộc vào đối tượng và hoàn cảnh.']
        ]
      }
    ],
    reading: {
      q: '读这段材料时，读者最需要做什么？',
      correct: '分辨事实、推测和带暗示的话',
      correctVi: 'phân biệt sự thật, suy đoán và câu mang hàm ý',
      expl: '材料要求读者“分辨哪些内容是事实，哪些只是推测，哪些话带有暗示”。',
      explVi: 'Bài yêu cầu người đọc phân biệt sự thật, suy đoán và những câu mang tính ám chỉ.'
    },
    listening: {
      q: '作者是怎么表达自己的看法的？',
      correct: '通过细节显示倾向，不直接给答案',
      correctVi: 'thể hiện khuynh hướng qua chi tiết, không đưa đáp án trực tiếp',
      expl: '“作者并没有直接给出唯一答案，而是通过几个细节显示自己的倾向。”',
      explVi: 'Tác giả không trả lời thẳng mà để lộ khuynh hướng qua các chi tiết.'
    },
    trueFalse: {
      statement: '材料说，只看眼前利益可能忽略长期影响。',
      answer: true,
      expl: '原文：“如果只看眼前利益，就可能忽略长期影响。”',
      explVi: 'Đúng. Nguyên văn: chỉ nhìn lợi ích trước mắt thì có thể bỏ qua ảnh hưởng lâu dài.'
    },
    fill2: {
      prompt: '材料中的论证取决于___是否充分。',
      correct: '证据',
      correctVi: 'bằng chứng',
      expl: '原文：“论证取决于证据是否充分。”',
      explVi: 'Nguyên văn: lập luận phụ thuộc vào việc bằng chứng có đầy đủ hay không.'
    },
    pools: {
      topicNouns: [
        ['音乐', 'âm nhạc'], ['美食', 'ẩm thực'], ['体育', 'thể thao'], ['天气', 'thời tiết'], ['植物', 'thực vật'],
        ['动物', 'động vật'], ['绘画', 'hội họa'], ['建筑', 'kiến trúc'], ['服装', 'trang phục'], ['交通', 'giao thông']
      ],
      readingWrong: [
        ['把所有关键词背下来', 'học thuộc tất cả từ khóa'],
        ['只看开头和结尾', 'chỉ đọc mở bài và kết bài'],
        ['相信所有的内容都是事实', 'tin mọi nội dung đều là sự thật'],
        ['忽略作者的保留态度', 'bỏ qua thái độ dè dặt của tác giả'],
        ['只找自己同意的观点', 'chỉ tìm quan điểm mình đồng ý'],
        ['把推测都当成结论', 'coi mọi suy đoán là kết luận'],
        ['跳过转折的部分', 'bỏ qua các đoạn chuyển ý'],
        ['只注意生词的意思', 'chỉ chú ý nghĩa từ mới'],
        ['数一数文章有多少句话', 'đếm xem bài có bao nhiêu câu']
      ],
      listeningWrong: [
        ['在开头直接给出唯一答案', 'đưa ngay đáp án duy nhất ở phần mở đầu'],
        ['只引用别人的话，没有自己的看法', 'chỉ trích dẫn người khác, không có ý kiến riêng'],
        ['用很大的声音强调结论', 'nhấn mạnh kết luận bằng giọng thật to'],
        ['把所有内容都写成事实', 'viết mọi nội dung như sự thật hiển nhiên'],
        ['只用一个例子说明一切', 'chỉ dùng một ví dụ để giải thích tất cả'],
        ['完全不表达任何倾向', 'hoàn toàn không thể hiện khuynh hướng nào'],
        ['先给答案，再给细节', 'đưa đáp án trước rồi mới nêu chi tiết'],
        ['让读者自己随便猜', 'để người đọc tự đoán tùy ý'],
        ['用图表代替文字说明', 'dùng biểu đồ thay cho lời văn']
      ],
      fill2Wrong: [
        ['感情', 'tình cảm'], ['篇幅', 'độ dài bài'], ['词汇', 'từ vựng'], ['标点', 'dấu câu'], ['插图', 'tranh minh họa'],
        ['长度', 'độ dài'], ['速度', 'tốc độ'], ['字体', 'kiểu chữ'], ['颜色', 'màu sắc']
      ],
      mcQuestions: [
        { prompt: '“倾向”的意思是……', opts: ['偏向某一边的态度', '身体向前倒', '喜欢听音乐', '走路的方向'], optsVi: ['thái độ nghiêng về một phía', 'người ngả về phía trước', 'thích nghe nhạc', 'hướng đi bộ'], expl: '“倾向”指偏向某一边的态度或趋势。', explVi: '倾向 = khuynh hướng, thái độ nghiêng về một phía.' },
        { prompt: '“推测”的意思是……', opts: ['根据线索猜测', '用力推开', '测量长度', '准确的结论'], optsVi: ['phỏng đoán dựa trên manh mối', 'đẩy mạnh ra', 'đo chiều dài', 'kết luận chính xác'], expl: '“推测”是根据已知线索去猜测。', explVi: '推测 = suy đoán dựa trên manh mối, chưa chắc chắn.' },
        { prompt: '“暗示”的意思是……', opts: ['不直接说出来的提示', '灯光很暗', '秘密文件', '明确的要求'], optsVi: ['gợi ý không nói thẳng ra', 'ánh đèn rất tối', 'tài liệu bí mật', 'yêu cầu rõ ràng'], expl: '“暗示”是不直接说、让人自己体会的提示。', explVi: '暗示 = ám chỉ, gợi ý ngầm không nói thẳng.' },
        { prompt: '“保留态度”是指……', opts: ['不完全同意，留有余地', '保存文件', '留在原地', '态度很热情'], optsVi: ['chưa hoàn toàn đồng ý, còn để ngỏ', 'lưu trữ tài liệu', 'ở nguyên tại chỗ', 'thái độ rất nhiệt tình'], expl: '“保留态度”指不完全同意、留有余地的态度。', explVi: '保留态度 = thái độ dè dặt, chưa khẳng định hẳn.' },
        { prompt: '“充分”的意思是……', opts: ['足够', '非常快', '十分新鲜', '平均分配'], optsVi: ['đầy đủ', 'rất nhanh', 'rất tươi mới', 'chia đều'], expl: '“充分”表示足够、完全。', explVi: '充分 = đầy đủ, trọn vẹn.' },
        { prompt: '“忽略”的意思是……', opts: ['没有注意到', '忽然出现', '简单处理', '重点强调'], optsVi: ['không chú ý tới, bỏ sót', 'đột nhiên xuất hiện', 'xử lý sơ sài', 'nhấn mạnh trọng điểm'], expl: '“忽略”是没有注意到、漏掉了。', explVi: '忽略 = bỏ qua, không để ý tới.' },
        { prompt: '“转折”在文章里指……', opts: ['意思发生变化的地方', '道路的拐弯', '文章的结尾', '段落的开头'], optsVi: ['chỗ ý nghĩa chuyển hướng', 'khúc cua trên đường', 'phần kết của bài', 'phần đầu đoạn văn'], expl: '文章里的“转折”是意思改变方向的地方。', explVi: '转折 trong bài văn = chỗ ý chuyển hướng (như 但是/然而).' },
        { prompt: '“评价理由的强弱”是指……', opts: ['判断理由有没有说服力', '比较声音大小', '计算字数多少', '检查语法对错'], optsVi: ['đánh giá lý lẽ có thuyết phục không', 'so sánh âm lượng', 'đếm số chữ', 'soát lỗi ngữ pháp'], expl: '就是判断理由是否有说服力。', explVi: 'Tức là xem lý lẽ đưa ra mạnh hay yếu, có thuyết phục không.' },
        { prompt: '“安排材料”的意思是……', opts: ['组织内容的顺序和结构', '购买写作材料', '打扫房间', '准备考试题目'], optsVi: ['tổ chức trình tự và bố cục nội dung', 'mua vật liệu viết lách', 'dọn dẹp phòng', 'soạn đề thi'], expl: '“安排材料”指组织内容的顺序和结构。', explVi: '安排材料 = cách tác giả tổ chức, bố cục nội dung.' }
      ]
    },
    wordOrder: {
      tokens: ['{F}', '能够', '带来', '新的机会'],
      tokensVi: ['{FVI}', 'có thể', 'mang lại', 'cơ hội mới'],
      correct: '{F}能够带来新的机会。',
      correctVi: '{FVI} có thể mang lại cơ hội mới.',
      expl: '原文：“一方面，{F}能够带来新的机会。”',
      explVi: 'Theo nguyên văn: một mặt, {FVI} có thể mang lại cơ hội mới.'
    },
    fill1: {
      prompt: '这段材料表面上讨论___，背后却在提醒读者注意更深的含义。',
      expl: '第一句说材料表面上讨论{F}。',
      explVi: 'Câu đầu tiên: bề ngoài bài đọc bàn về {FVI}.'
    },
    blooms: ['analyze', 'analyze', 'analyze', 'evaluate', 'evaluate', 'analyze', 'analyze']
  },
  6: {
    passage: '这段材料借{F}展开讨论，真正考查的是读者能否在语境中拿捏分寸。作者的观点并非直线推进，而是先设置一个看似不言自明的预设，再用细节慢慢松动它。某些词语表面平和，实际却带有评议意味；某些转折看似轻描淡写，却改变了整段话的重心。理解这类文本，不能只追求字面对应，还要斟酌修辞、含义和文化背景之间的关系。若把所有表达都译成直接结论，文章的神韵便会被削弱；若只欣赏风格而忽视证据，又会失去判断标准。因此，恰到好处的理解，需要在观点、语气、预设与分寸之间融会贯通。',
    passageEn: "This passage uses {FEN} as the starting point of its discussion, but what it really tests is whether the reader can exercise fine judgment within context. The author's viewpoint does not advance in a straight line: it first sets up a seemingly self-evident presupposition, then slowly loosens it with details. Some expressions appear mild on the surface yet carry an evaluative edge; some transitions seem casually understated yet shift the weight of the whole passage. To understand such a text, one cannot chase literal correspondence alone; one must weigh the relations among rhetoric, implication and cultural background. If every expression is flattened into a blunt conclusion, the spirit of the writing is weakened; if one savors only the style while ignoring the evidence, the standard of judgment is lost. Well-measured understanding therefore requires integrating viewpoint, tone, presupposition and nuance into a single coherent reading.",
    passageVi: 'Bài đọc mượn {FVI} để mở ra cuộc bàn luận, nhưng điều thật sự được kiểm tra là người đọc có biết cân nhắc chừng mực trong ngữ cảnh hay không. Quan điểm của tác giả không tiến theo đường thẳng: trước tiên dựng lên một tiền giả định tưởng như hiển nhiên, rồi dùng chi tiết để từ từ lay chuyển nó. Có những từ ngữ bề ngoài ôn hòa nhưng thực chất mang ý bình phẩm; có những chỗ chuyển ý tưởng như nhẹ nhàng nhưng lại làm thay đổi trọng tâm của cả đoạn. Để hiểu loại văn bản này, không thể chỉ chạy theo sự tương ứng mặt chữ, mà còn phải cân nhắc quan hệ giữa tu từ, hàm ý và bối cảnh văn hóa. Nếu quy mọi cách diễn đạt về một kết luận thẳng đuột, cái thần của bài văn sẽ bị suy giảm; nếu chỉ thưởng thức văn phong mà bỏ qua bằng chứng, lại đánh mất chuẩn mực phán đoán. Vì vậy, sự thấu hiểu đúng mức đòi hỏi phải quán thông giữa quan điểm, giọng điệu, tiền giả định và chừng mực.',
    summaryEn: 'An advanced passage built around {FEN}: reading between the lines, weighing rhetoric against evidence, and keeping judgment well-measured.',
    summaryVi: 'Bài đọc nâng cao xoay quanh {FVI}: đọc giữa các dòng chữ, cân nhắc tu từ với bằng chứng và giữ phán đoán đúng mực.',
    listeningSentences: 2,
    vocabBase: [
      ['材料', 'cai2 liao4', 'noun', 'material, text', 'tài liệu, bài đọc'],
      ['观点', 'guan1 dian3', 'noun', 'viewpoint', 'quan điểm'],
      ['含义', 'han2 yi4', 'noun', 'implication', 'hàm ý'],
      ['分寸', 'fen1 cun4', 'noun', 'sense of proportion', 'chừng mực'],
      ['语境', 'yu3 jing4', 'noun', 'context', 'ngữ cảnh'],
      ['预设', 'yu4 she4', 'noun/verb', 'presupposition', 'tiền giả định'],
      ['斟酌', 'zhen1 zhuo2', 'verb', 'to weigh carefully', 'cân nhắc kỹ'],
      ['不言自明', 'bu4 yan2 zi4 ming2', 'idiom', 'self-evident', 'hiển nhiên, không nói cũng rõ'],
      ['恰到好处', 'qia4 dao4 hao3 chu4', 'idiom', 'just right, well-measured', 'vừa đúng mức']
    ],
    grammar: [
      {
        pattern: '并非……，而是……',
        explanation: '否定一个理解，再提出更准确的理解。',
        explanation_vi: '并非… 而是…: phủ định một cách hiểu, rồi đưa ra cách hiểu chính xác hơn (trang trọng hơn 不是…而是…).',
        examples: [
          ['重点并非{F}本身，而是语境。', 'The point is not {FEN} itself, but the context.', 'Trọng tâm không phải bản thân {FVI}, mà là ngữ cảnh.'],
          ['问题并非没有答案，而是答案有分寸。', 'It is not that the question has no answer, but that the answer requires nuance.', 'Không phải câu hỏi không có lời đáp, mà là lời đáp cần có chừng mực.'],
          ['作者并非反对创新，而是提醒代价。', 'The author does not oppose innovation, but reminds us of its costs.', 'Tác giả không phản đối đổi mới, mà nhắc nhở về cái giá của nó.']
        ]
      },
      {
        pattern: '若……，便……',
        explanation: '用较书面的方式说明条件和结果。',
        explanation_vi: '若… 便… = nếu… thì… (văn viết, trang trọng hơn 如果…就…).',
        examples: [
          ['若只看字面，便会误解含义。', 'If one reads only the surface, one will misread the meaning.', 'Nếu chỉ nhìn mặt chữ thì sẽ hiểu sai hàm ý.'],
          ['若忽视语境，便难以拿捏分寸。', 'If one ignores the context, it is hard to strike the right measure.', 'Nếu bỏ qua ngữ cảnh thì khó lòng nắm được chừng mực.'],
          ['若理解{F}，便能看出预设。', 'If one understands {FEN}, one can see the presupposition.', 'Nếu hiểu được {FVI} thì có thể nhận ra tiền giả định.']
        ]
      }
    ],
    reading: {
      q: '怎样才算“恰到好处”的理解？',
      correct: '在观点、语气、预设与分寸之间融会贯通',
      correctVi: 'quán thông giữa quan điểm, giọng điệu, tiền giả định và chừng mực',
      expl: '结尾说：“恰到好处的理解，需要在观点、语气、预设与分寸之间融会贯通。”',
      explVi: 'Câu kết của bài: hiểu đúng mức là quán thông quan điểm, giọng điệu, tiền giả định và chừng mực.'
    },
    listening: {
      q: '作者的观点是怎么推进的？',
      correct: '先设置预设，再用细节慢慢松动它',
      correctVi: 'dựng tiền giả định trước, rồi dùng chi tiết lay chuyển dần',
      expl: '“先设置一个看似不言自明的预设，再用细节慢慢松动它。”',
      explVi: 'Tác giả dựng một tiền giả định tưởng như hiển nhiên rồi dùng chi tiết lay chuyển nó dần dần.'
    },
    trueFalse: {
      statement: '材料认为，把所有表达都译成直接结论，文章的神韵会更清楚。',
      answer: false,
      expl: '原文说这样“文章的神韵便会被削弱”。',
      explVi: 'Sai. Nguyên văn: làm vậy cái thần của bài văn sẽ bị suy giảm, không phải rõ hơn.'
    },
    fill2: {
      prompt: '若只欣赏风格而忽视证据，又会失去___标准。',
      correct: '判断',
      correctVi: 'phán đoán',
      expl: '原文：“若只欣赏风格而忽视证据，又会失去判断标准。”',
      explVi: 'Nguyên văn: chỉ thưởng thức văn phong mà bỏ qua bằng chứng sẽ mất chuẩn mực phán đoán.'
    },
    pools: {
      topicNouns: [
        ['书法', 'thư pháp'], ['武术', 'võ thuật'], ['戏曲', 'hí khúc'], ['园林', 'nghệ thuật vườn cảnh'], ['瓷器', 'đồ sứ'],
        ['诗歌', 'thơ ca'], ['雕塑', 'điêu khắc'], ['舞蹈', 'múa'], ['棋艺', 'kỳ nghệ (cờ)'], ['刺绣', 'nghệ thuật thêu']
      ],
      readingWrong: [
        ['把所有表达都译成直接结论', 'quy mọi diễn đạt về kết luận thẳng đuột'],
        ['只欣赏风格，不看证据', 'chỉ thưởng thức văn phong, bỏ qua bằng chứng'],
        ['追求每个字的字面对应', 'chạy theo tương ứng mặt chữ từng từ'],
        ['跳过看似平和的词语', 'bỏ qua các từ ngữ có vẻ ôn hòa'],
        ['把转折都当作装饰', 'coi mọi chỗ chuyển ý là trang trí'],
        ['只关注文化背景', 'chỉ quan tâm bối cảnh văn hóa'],
        ['记住所有修辞的名字', 'nhớ tên tất cả biện pháp tu từ'],
        ['用最快的速度读完', 'đọc xong với tốc độ nhanh nhất'],
        ['避免评价作者的观点', 'né tránh đánh giá quan điểm tác giả']
      ],
      listeningWrong: [
        ['从头到尾直线推进', 'tiến thẳng một mạch từ đầu đến cuối'],
        ['先给结论，再重复结论', 'nêu kết luận trước rồi lặp lại kết luận'],
        ['完全没有自己的观点', 'hoàn toàn không có quan điểm riêng'],
        ['只靠引用名人名言', 'chỉ dựa vào trích dẫn danh ngôn'],
        ['用数字和图表证明一切', 'dùng số liệu, biểu đồ chứng minh tất cả'],
        ['在结尾才提出问题', 'đến cuối bài mới nêu vấn đề'],
        ['把预设当成最终答案', 'coi tiền giả định là đáp án cuối cùng'],
        ['避免使用任何细节', 'tránh dùng bất kỳ chi tiết nào'],
        ['先否定一切，再全部肯定', 'phủ định tất cả rồi lại khẳng định tất cả']
      ],
      fill2Wrong: [
        ['时间', 'thời gian'], ['金钱', 'tiền bạc'], ['速度', 'tốc độ'], ['数量', 'số lượng'], ['温度', 'nhiệt độ'],
        ['重量', 'trọng lượng'], ['距离', 'khoảng cách'], ['颜色', 'màu sắc'], ['声音', 'âm thanh']
      ],
      mcQuestions: [
        { prompt: '“不言自明”的意思是……', opts: ['不用说就很清楚', '自己不会说话', '说了也不明白', '不想说明'], optsVi: ['không cần nói cũng rõ ràng', 'bản thân không biết nói', 'nói rồi vẫn không hiểu', 'không muốn giải thích'], expl: '“不言自明”指道理清楚，不用说明。', explVi: '不言自明 = hiển nhiên, không cần nói cũng rõ.' },
        { prompt: '“轻描淡写”的意思是……', opts: ['说得很轻，好像不重要', '画画用的颜色很浅', '字写得很小', '声音很好听'], optsVi: ['nói nhẹ đi như thể không quan trọng', 'màu vẽ rất nhạt', 'chữ viết rất nhỏ', 'giọng nói dễ nghe'], expl: '“轻描淡写”指故意说得很轻、很淡。', explVi: '轻描淡写 = nói lướt qua, làm nhẹ vấn đề.' },
        { prompt: '“松动”在文中指……', opts: ['让原来的预设不再牢固', '牙齿有问题', '放松身体', '土地不结实'], optsVi: ['làm tiền giả định ban đầu lung lay', 'răng có vấn đề', 'thư giãn cơ thể', 'đất không chắc'], expl: '文中“松动”指让预设不再牢固。', explVi: 'Trong bài, 松动 = làm lung lay tiền giả định ban đầu.' },
        { prompt: '“评议意味”是指……', opts: ['带有评价、议论的味道', '会议的内容', '意见不合', '食物的味道'], optsVi: ['mang sắc thái đánh giá, bình phẩm', 'nội dung cuộc họp', 'ý kiến bất đồng', 'mùi vị món ăn'], expl: '“评议意味”指话里带着评价的态度。', explVi: '评议意味 = hàm ý đánh giá, bình phẩm ẩn trong câu chữ.' },
        { prompt: '“神韵”的意思是……', opts: ['文章内在的风采和味道', '神话故事', '音乐的节奏', '神秘的事件'], optsVi: ['cái hồn, phong vị bên trong của bài văn', 'truyện thần thoại', 'tiết tấu âm nhạc', 'sự kiện bí ẩn'], expl: '“神韵”指文章内在的风采、味道。', explVi: '神韵 = cái thần, cái hồn của áng văn.' },
        { prompt: '“削弱”的意思是……', opts: ['变弱、受损', '用刀削皮', '身体瘦弱', '减少数量'], optsVi: ['bị yếu đi, suy giảm', 'gọt vỏ bằng dao', 'thân thể gầy yếu', 'giảm số lượng'], expl: '“削弱”是使变弱。', explVi: '削弱 = làm suy yếu, giảm sút.' },
        { prompt: '“重心”在文中指……', opts: ['整段话的重点', '物体的中心', '心脏的位置', '最重的东西'], optsVi: ['trọng tâm của cả đoạn', 'tâm của vật thể', 'vị trí trái tim', 'vật nặng nhất'], expl: '文中“重心”指整段话的重点。', explVi: 'Trong bài, 重心 = trọng tâm ý nghĩa của đoạn văn.' },
        { prompt: '“斟酌”的意思是……', opts: ['反复考虑、权衡', '倒酒', '喝茶', '快速决定'], optsVi: ['cân nhắc, đắn đo kỹ lưỡng', 'rót rượu', 'uống trà', 'quyết định nhanh'], expl: '“斟酌”是反复考虑、权衡。', explVi: '斟酌 = cân nhắc đi cân nhắc lại.' },
        { prompt: '“融会贯通”的意思是……', opts: ['把各方面理解打通，变成整体', '冰雪融化', '交通顺畅', '会议顺利'], optsVi: ['thông suốt mọi mặt, hợp thành chỉnh thể', 'băng tuyết tan chảy', 'giao thông thông suốt', 'cuộc họp suôn sẻ'], expl: '“融会贯通”指把各方面的理解打通成整体。', explVi: '融会贯通 = quán thông, hiểu thấu và kết nối mọi mặt.' }
      ]
    },
    wordOrder: {
      tokens: ['重点', '并非', '{F}本身', '而是', '语境'],
      tokensVi: ['trọng tâm', 'không phải là', 'bản thân {FVI}', 'mà là', 'ngữ cảnh'],
      correct: '重点并非{F}本身，而是语境。',
      correctVi: 'Trọng tâm không phải bản thân {FVI}, mà là ngữ cảnh.',
      expl: '“并非……而是……”：否定前者，肯定后者。',
      explVi: 'Cấu trúc 并非…而是…: phủ định vế trước, khẳng định vế sau.'
    },
    fill1: {
      prompt: '这段材料借___展开讨论，真正考查的是读者能否在语境中拿捏分寸。',
      expl: '第一句说材料借{F}展开讨论。',
      explVi: 'Câu mở đầu: bài đọc mượn {FVI} để triển khai bàn luận.'
    },
    blooms: ['analyze', 'analyze', 'analyze', 'evaluate', 'evaluate', 'analyze', 'analyze']
  }
};

// HSK4 lacks listeningWrong (its listening options are other topic foci); HSK5/6 use listeningWrong pools.
export const HIGH_WARMUP = {
  items: ['快速判断：{F}是个人问题还是社会问题？', '找出一个支持观点和一个反对观点。', '预测材料可能如何评价{F}。'],
  itemsVi: ['Phán đoán nhanh: {FVI} là vấn đề cá nhân hay vấn đề xã hội?', 'Tìm một ý ủng hộ và một ý phản đối quan điểm của bài.', 'Dự đoán bài đọc sẽ đánh giá {FVI} như thế nào.']
};
