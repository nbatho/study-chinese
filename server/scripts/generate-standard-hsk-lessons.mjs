import { rm, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, resolveContentPath } from '../src/config/content-paths.js';
import { writeLessonEntry } from './lesson-data-files.mjs';
import { accentVietnameseDeep } from './vietnamese-diacritics.mjs';

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

const COMMON = {
  pronoun: { simplified: '我', pinyin: 'wo3', part_of_speech: 'pronoun', english: 'I', vi: 'toi' },
  you: { simplified: '你', pinyin: 'ni3', part_of_speech: 'pronoun', english: 'you', vi: 'ban' },
  today: { simplified: '今天', pinyin: 'jin1 tian1', part_of_speech: 'time word', english: 'today', vi: 'hom nay' },
  study: { simplified: '学', pinyin: 'xue2', part_of_speech: 'verb', english: 'to study', vi: 'hoc' },
  like: { simplified: '喜欢', pinyin: 'xi3 huan5', part_of_speech: 'verb', english: 'to like', vi: 'thich' },
  because: { simplified: '因为', pinyin: 'yin1 wei4', part_of_speech: 'conjunction', english: 'because', vi: 'boi vi' },
  so: { simplified: '所以', pinyin: 'suo3 yi3', part_of_speech: 'conjunction', english: 'so', vi: 'cho nen' },
  think: { simplified: '觉得', pinyin: 'jue2 de5', part_of_speech: 'verb', english: 'to think/feel', vi: 'cam thay' },
  material: { simplified: '材料', pinyin: 'cai2 liao4', part_of_speech: 'noun', english: 'material', vi: 'tai lieu' },
  viewpoint: { simplified: '观点', pinyin: 'guan1 dian3', part_of_speech: 'noun', english: 'viewpoint', vi: 'quan diem' },
  influence: { simplified: '影响', pinyin: 'ying3 xiang3', part_of_speech: 'verb/noun', english: 'influence', vi: 'anh huong' },
  reason: { simplified: '原因', pinyin: 'yuan2 yin1', part_of_speech: 'noun', english: 'reason', vi: 'nguyen nhan' },
  implication: { simplified: '含义', pinyin: 'han2 yi4', part_of_speech: 'noun', english: 'implication', vi: 'ham y' },
  nuance: { simplified: '分寸', pinyin: 'fen1 cun4', part_of_speech: 'noun', english: 'sense of proportion', vi: 'chung muc' }
};

const TOPICS = {
  1: [
    ['greetings', '问候', 'Greetings', 'chao hoi', '你好', 'ni3 hao3', '打招呼'],
    ['name', '名字', 'Name', 'ten', '名字', 'ming2 zi5', '说名字'],
    ['family', '家人', 'Family', 'gia dinh', '妈妈', 'ma1 ma5', '说家人'],
    ['numbers', '数字', 'Numbers', 'so dem', '三', 'san1', '说数字'],
    ['date', '日期', 'Date', 'ngay thang', '今天', 'jin1 tian1', '说日期'],
    ['time', '时间', 'Time', 'thoi gian', '上午', 'shang4 wu3', '说时间'],
    ['food', '吃饭', 'Food', 'an uong', '米饭', 'mi3 fan4', '说食物'],
    ['drink', '喝水', 'Drinks', 'do uong', '水', 'shui3', '说饮料'],
    ['school', '学校', 'School', 'truong hoc', '学校', 'xue2 xiao4', '说学校'],
    ['class', '上课', 'Class', 'lop hoc', '课', 'ke4', '说课堂'],
    ['book', '看书', 'Books', 'sach', '书', 'shu1', '说书本'],
    ['shopping', '买东西', 'Shopping', 'mua sam', '买', 'mai3', '说购物'],
    ['money', '钱', 'Money', 'tien', '钱', 'qian2', '说价钱'],
    ['weather', '天气', 'Weather', 'thoi tiet', '天气', 'tian1 qi4', '说天气'],
    ['place', '地点', 'Places', 'dia diem', '家', 'jia1', '说地点'],
    ['doctor', '医生', 'Doctor', 'bac si', '医生', 'yi1 sheng1', '说身体'],
    ['review', '复习', 'Review', 'on tap', '中文', 'zhong1 wen2', '复习中文']
  ],
  2: [
    ['appointment', '约时间', 'Making an appointment', 'hen lich', '时间', 'shi2 jian1', '安排时间'],
    ['transport', '坐车', 'Transport', 'di xe', '公共汽车', 'gong1 gong4 qi4 che1', '问路线'],
    ['weather-plan', '天气计划', 'Weather plans', 'ke hoach thoi tiet', '下雨', 'xia4 yu3', '改计划'],
    ['restaurant', '饭馆点菜', 'Restaurant', 'nha hang', '饭馆', 'fan4 guan3', '点菜'],
    ['shopping-clothes', '买衣服', 'Buying clothes', 'mua quan ao', '衣服', 'yi1 fu5', '问价格'],
    ['phone', '打电话', 'Phone call', 'goi dien', '电话', 'dian4 hua4', '约朋友'],
    ['hotel', '住旅馆', 'Hotel', 'khach san', '房间', 'fang2 jian1', '住一晚'],
    ['health', '身体不舒服', 'Health', 'suc khoe', '身体', 'shen1 ti3', '看医生'],
    ['sports', '运动', 'Sports', 'the thao', '运动', 'yun4 dong4', '说习惯'],
    ['birthday', '生日', 'Birthday', 'sinh nhat', '生日', 'sheng1 ri4', '送礼物'],
    ['workday', '工作日', 'Workday', 'ngay lam viec', '工作', 'gong1 zuo4', '说日程'],
    ['weekend', '周末', 'Weekend', 'cuoi tuan', '周末', 'zhou1 mo4', '安排活动'],
    ['city', '城市', 'City', 'thanh pho', '城市', 'cheng2 shi4', '问地方'],
    ['home', '在家', 'At home', 'o nha', '家里', 'jia1 li3', '做家务'],
    ['travel', '旅游', 'Travel', 'du lich', '旅游', 'lv3 you2', '买票'],
    ['gift', '礼物', 'Gift', 'qua tang', '礼物', 'li3 wu4', '表达喜欢'],
    ['routine', '日常', 'Routine', 'sinh hoat', '每天', 'mei3 tian1', '说习惯']
  ],
  3: [
    ['study-method', '学习方法', 'Study methods', 'phuong phap hoc', '方法', 'fang1 fa3', '改进学习'],
    ['travel-experience', '旅行经历', 'Travel experience', 'trai nghiem du lich', '经历', 'jing1 li4', '讲过去'],
    ['job-interview', '面试', 'Job interview', 'phong van', '面试', 'mian4 shi4', '说明能力'],
    ['online-shopping', '网购', 'Online shopping', 'mua hang online', '网上', 'wang3 shang4', '比较选择'],
    ['neighbors', '邻居', 'Neighbors', 'hang xom', '邻居', 'lin2 ju1', '处理问题'],
    ['movie-opinion', '电影看法', 'Movie opinions', 'y kien ve phim', '电影', 'dian4 ying3', '表达看法'],
    ['fitness', '健康习惯', 'Healthy habits', 'thoi quen lanh manh', '健康', 'jian4 kang1', '坚持运动'],
    ['library', '图书馆', 'Library', 'thu vien', '图书馆', 'tu2 shu1 guan3', '借书学习'],
    ['schedule-change', '改变计划', 'Changing plans', 'doi ke hoach', '改变', 'gai3 bian4', '解释原因'],
    ['work-pressure', '工作压力', 'Work pressure', 'ap luc cong viec', '压力', 'ya1 li4', '提出建议'],
    ['friendship', '朋友关系', 'Friendship', 'tinh ban', '关系', 'guan1 xi5', '沟通想法'],
    ['lost-item', '丢东西', 'Lost item', 'mat do', '丢', 'diu1', '描述经过'],
    ['bank', '银行办事', 'Banking', 'ngan hang', '银行', 'yin2 hang2', '办事情'],
    ['festival', '节日', 'Festival', 'le hoi', '节日', 'jie2 ri4', '介绍习俗'],
    ['news', '新闻', 'News', 'tin tuc', '新闻', 'xin1 wen2', '说明重点'],
    ['environment', '环境', 'Environment', 'moi truong', '环境', 'huan2 jing4', '表达责任'],
    ['review', '综合复习', 'Integrated review', 'on tap tong hop', '复习', 'fu4 xi2', '总结经验']
  ],
  4: [
    ['teamwork', '团队合作', 'Teamwork', 'lam viec nhom', '团队', 'tuan2 dui4', '分析合作'],
    ['time-management', '时间管理', 'Time management', 'quan ly thoi gian', '效率', 'xiao4 lv4', '评价安排'],
    ['online-learning', '在线学习', 'Online learning', 'hoc truc tuyen', '平台', 'ping2 tai2', '讨论学习'],
    ['public-transport', '公共交通', 'Public transport', 'giao thong cong cong', '交通', 'jiao1 tong1', '提出建议'],
    ['workplace-feedback', '职场反馈', 'Workplace feedback', 'phan hoi noi lam viec', '反馈', 'fan3 kui4', '说明观点'],
    ['consumer-choice', '消费选择', 'Consumer choice', 'lua chon tieu dung', '消费', 'xiao1 fei4', '比较价值'],
    ['community', '社区服务', 'Community service', 'dich vu cong dong', '社区', 'she4 qu1', '讨论责任'],
    ['culture', '文化差异', 'Cultural differences', 'khac biet van hoa', '差异', 'cha1 yi4', '解释原因'],
    ['technology', '技术生活', 'Technology in life', 'cong nghe doi song', '技术', 'ji4 shu4', '分析影响'],
    ['education', '教育公平', 'Education equity', 'cong bang giao duc', '公平', 'gong1 ping2', '提出看法'],
    ['health-choice', '健康选择', 'Health choices', 'lua chon suc khoe', '选择', 'xuan3 ze2', '说明理由'],
    ['city-space', '城市空间', 'Urban space', 'khong gian do thi', '空间', 'kong1 jian1', '评价设计'],
    ['media', '媒体信息', 'Media information', 'thong tin truyen thong', '媒体', 'mei2 ti3', '判断信息'],
    ['career', '职业发展', 'Career development', 'phat trien nghe nghiep', '职业', 'zhi2 ye4', '规划发展'],
    ['service', '服务质量', 'Service quality', 'chat luong dich vu', '质量', 'zhi4 liang4', '提出改进'],
    ['risk', '风险意识', 'Risk awareness', 'nhan thuc rui ro', '风险', 'feng1 xian3', '权衡决定'],
    ['review', '观点复习', 'Viewpoint review', 'on tap quan diem', '观点', 'guan1 dian3', '组织论证']
  ],
  5: [
    ['implicit-meaning', '言外之意', 'Implicit meaning', 'ham y', '暗示', 'an4 shi4', '识别含义'],
    ['academic-reading', '学术阅读', 'Academic reading', 'doc hoc thuat', '论证', 'lun4 zheng4', '评价证据'],
    ['professional-email', '职业邮件', 'Professional email', 'email cong viec', '语气', 'yu3 qi4', '调整表达'],
    ['social-change', '社会变化', 'Social change', 'bien doi xa hoi', '变化', 'bian4 hua4', '分析趋势'],
    ['innovation', '创新', 'Innovation', 'doi moi', '创新', 'chuang4 xin1', '评价价值'],
    ['ethics', '伦理选择', 'Ethical choice', 'lua chon dao duc', '伦理', 'lun2 li3', '权衡后果'],
    ['memory', '记忆与学习', 'Memory and learning', 'tri nho va hoc', '记忆', 'ji4 yi4', '反思方法'],
    ['leadership', '领导力', 'Leadership', 'lanh dao', '领导', 'ling3 dao3', '判断风格'],
    ['negotiation', '协商', 'Negotiation', 'thuong luong', '协商', 'xie2 shang1', '理解立场'],
    ['identity', '身份认同', 'Identity', 'ban sac', '身份', 'shen1 fen4', '讨论认同'],
    ['research', '研究方法', 'Research methods', 'phuong phap nghien cuu', '研究', 'yan2 jiu1', '分析限制'],
    ['persuasion', '说服策略', 'Persuasion', 'thuyet phuc', '说服', 'shuo1 fu2', '评价策略'],
    ['urbanization', '城市化', 'Urbanization', 'do thi hoa', '城市化', 'cheng2 shi4 hua4', '观察代价'],
    ['digital-life', '数字生活', 'Digital life', 'doi song so', '隐私', 'yin3 si1', '平衡便利'],
    ['public-policy', '公共政策', 'Public policy', 'chinh sach cong', '政策', 'zheng4 ce4', '辨析影响'],
    ['art-review', '艺术评论', 'Art critique', 'phe binh nghe thuat', '审美', 'shen3 mei3', '解读风格'],
    ['review', '高级复习', 'Advanced review', 'on tap nang cao', '立场', 'li4 chang3', '综合判断']
  ],
  6: [
    ['classical-allusion', '典故', 'Allusion', 'dien co', '典故', 'dian3 gu4', '体会文化'],
    ['rhetoric', '修辞', 'Rhetoric', 'tu tu', '修辞', 'xiu1 ci2', '辨析风格'],
    ['public-discourse', '公共话语', 'Public discourse', 'dien ngon cong', '话语', 'hua4 yu3', '审视立场'],
    ['philosophy', '哲学思辨', 'Philosophical reflection', 'suy tu triet hoc', '思辨', 'si1 bian4', '追问前提'],
    ['literary-style', '文学风格', 'Literary style', 'phong cach van hoc', '笔法', 'bi3 fa3', '品评文本'],
    ['historical-memory', '历史记忆', 'Historical memory', 'ky uc lich su', '记忆', 'ji4 yi4', '重构叙事'],
    ['cross-cultural', '跨文化表达', 'Cross-cultural expression', 'bieu dat lien van hoa', '语境', 'yu3 jing4', '拿捏分寸'],
    ['argument-synthesis', '论证综合', 'Argument synthesis', 'tong hop lap luan', '综合', 'zong1 he2', '整合证据'],
    ['policy-critique', '政策评议', 'Policy critique', 'binh luan chinh sach', '评议', 'ping2 yi4', '衡量利弊'],
    ['metaphor', '隐喻', 'Metaphor', 'an du', '隐喻', 'yin3 yu4', '解读象征'],
    ['translation', '翻译取舍', 'Translation choices', 'lua chon dich thuat', '取舍', 'qu3 she3', '保持神韵'],
    ['innovation-risk', '创新风险', 'Innovation risk', 'rui ro doi moi', '代价', 'dai4 jia4', '斟酌后果'],
    ['collective-memory', '集体记忆', 'Collective memory', 'ky uc tap the', '集体', 'ji2 ti3', '辨认叙述'],
    ['media-framing', '媒体框架', 'Media framing', 'khung truyen thong', '框架', 'kuang4 jia4', '识破预设'],
    ['aesthetic-judgment', '审美判断', 'Aesthetic judgment', 'phan doan tham my', '判断', 'pan4 duan4', '阐明标准'],
    ['negotiating-tone', '语气拿捏', 'Tone control', 'kiem soat giong dieu', '拿捏', 'na2 nie1', '把握分寸'],
    ['review', '精通复习', 'Mastery review', 'on tap tinh thong', '融会贯通', 'rong2 hui4 guan4 tong1', '综合表达']
  ]
};

const levelBaseWords = (hsk, topic) => {
  const [slug, titleZh, titleEn, titleVi, focus, focusPinyin] = topic;
  const base = [
    { simplified: focus, pinyin: focusPinyin, part_of_speech: 'noun/phrase', english: titleEn.toLowerCase(), vi: titleVi }
  ];

  if (hsk === 1) {
    return [
      ...base,
      { simplified: '学生', pinyin: 'xue2 sheng5', part_of_speech: 'noun', english: 'student', vi: 'hoc sinh' },
      { simplified: '老师', pinyin: 'lao3 shi1', part_of_speech: 'noun', english: 'teacher', vi: 'giao vien' },
      { simplified: '读', pinyin: 'du2', part_of_speech: 'verb', english: 'to read', vi: 'doc' },
      { simplified: '写', pinyin: 'xie3', part_of_speech: 'verb', english: 'to write', vi: 'viet' }
    ];
  }

  if (hsk === 2) {
    return [
      ...base,
      { simplified: '计划', pinyin: 'ji4 hua4', part_of_speech: 'noun/verb', english: 'plan', vi: 'ke hoach' },
      { simplified: '一起', pinyin: 'yi4 qi3', part_of_speech: 'adverb', english: 'together', vi: 'cung nhau' },
      { simplified: '准备', pinyin: 'zhun3 bei4', part_of_speech: 'verb', english: 'prepare', vi: 'chuan bi' },
      { simplified: '可以', pinyin: 'ke3 yi3', part_of_speech: 'modal verb', english: 'can/may', vi: 'co the' },
      COMMON.like
    ];
  }

  if (hsk === 3) {
    return [
      ...base,
      { simplified: '经验', pinyin: 'jing1 yan4', part_of_speech: 'noun', english: 'experience', vi: 'kinh nghiem' },
      { simplified: '解决', pinyin: 'jie3 jue2', part_of_speech: 'verb', english: 'solve', vi: 'giai quyet' },
      { simplified: '建议', pinyin: 'jian4 yi4', part_of_speech: 'noun/verb', english: 'suggestion', vi: 'goi y' },
      { simplified: '比较', pinyin: 'bi3 jiao4', part_of_speech: 'adverb/verb', english: 'comparatively/compare', vi: 'so sanh' },
      COMMON.because,
      COMMON.so,
      COMMON.think
    ];
  }

  if (hsk === 4) {
    return [
      ...base,
      COMMON.material,
      COMMON.viewpoint,
      COMMON.influence,
      COMMON.reason,
      { simplified: '证据', pinyin: 'zheng4 ju4', part_of_speech: 'noun', english: 'evidence', vi: 'bang chung' },
      { simplified: '然而', pinyin: 'ran2 er2', part_of_speech: 'conjunction', english: 'however', vi: 'tuy nhien' },
      { simplified: '因此', pinyin: 'yin1 ci3', part_of_speech: 'conjunction', english: 'therefore', vi: 'vi vay' },
      { simplified: '平衡', pinyin: 'ping2 heng2', part_of_speech: 'verb/noun', english: 'balance', vi: 'can bang' }
    ];
  }

  if (hsk === 5) {
    return [
      ...base,
      COMMON.material,
      COMMON.viewpoint,
      COMMON.influence,
      COMMON.implication,
      { simplified: '证据', pinyin: 'zheng4 ju4', part_of_speech: 'noun', english: 'evidence', vi: 'bang chung' },
      { simplified: '表面', pinyin: 'biao3 mian4', part_of_speech: 'noun', english: 'surface', vi: 'be mat' },
      { simplified: '背后', pinyin: 'bei4 hou4', part_of_speech: 'noun', english: 'behind', vi: 'phia sau' },
      { simplified: '倾向', pinyin: 'qing1 xiang4', part_of_speech: 'noun/verb', english: 'tendency', vi: 'khuynh huong' },
      { simplified: '取决于', pinyin: 'qu3 jue2 yu2', part_of_speech: 'verb phrase', english: 'depend on', vi: 'phu thuoc vao' }
    ];
  }

  return [
    ...base,
    COMMON.material,
    COMMON.viewpoint,
    COMMON.implication,
    COMMON.nuance,
    { simplified: '语境', pinyin: 'yu3 jing4', part_of_speech: 'noun', english: 'context', vi: 'ngu canh' },
    { simplified: '预设', pinyin: 'yu4 she4', part_of_speech: 'noun/verb', english: 'presupposition', vi: 'tien gia dinh' },
    { simplified: '斟酌', pinyin: 'zhen1 zhuo2', part_of_speech: 'verb', english: 'weigh carefully', vi: 'can nhac ky' },
    { simplified: '不言自明', pinyin: 'bu4 yan2 zi4 ming2', part_of_speech: 'idiom', english: 'self-evident', vi: 'khong noi cung ro' },
    { simplified: '恰到好处', pinyin: 'qia4 dao4 hao3 chu4', part_of_speech: 'idiom', english: 'perfectly measured', vi: 'vua dung muc' }
  ];
};

const hanziCount = (value) => [...String(value || '')].filter((char) => /\p{Script=Han}/u.test(char)).length;

const chars = (value) => [...String(value || '')].filter((char) => /\S/.test(char)).length;

const pinyinForLowLine = (hsk, focusPinyin) => {
  if (hsk === 1) {
    return [
      'Ni3 hao3, wo3 jiao4 Xiao3 Ming2. Wo3 shi4 xue2 sheng5.',
      'Ni3 hao3, Xiao3 Ming2. Wo3 shi4 lao3 shi1.',
      `Jin1 tian1 wo3 xue2 ${focusPinyin}, ye3 du2 ${focusPinyin}.`,
      `Hen3 hao3. Ni3 xie3 ${focusPinyin} ma?`,
      `Wo3 xie3 ${focusPinyin}, ye3 shuo1 ${focusPinyin}.`,
      'Hao3, wo3 men5 yi4 qi3 du2.',
      'Xie4 xie5 lao3 shi1, zai4 jian4.'
    ];
  }

  if (hsk === 2) {
    return [
      `Ni3 ming2 tian1 you3 shi2 jian1 ma? Wo3 xiang3 lian4 xi2 ${focusPinyin}.`,
      'Ke3 yi3. Wo3 men5 xia4 wu3 yi4 qi3 qu4 ba.',
      `Wo3 yi3 jing1 zhun3 bei4 hao3 le5. Yin1 wei4 wo3 xi3 huan5 ${focusPinyin}.`,
      'Hen3 hao3. Wo3 ye3 xiang3 gen1 ni3 yi4 qi3 xue2.',
      'Na4 wo3 men5 san1 dian3 jian4, bu2 yao4 chi2 dao4.',
      'Mei2 wen4 ti2, yi2 hui4 er2 jian4.'
    ];
  }

  return [
    `Zui4 jin4 wo3 zai4 xue2 ${focusPinyin}, dan4 you3 yi4 dian3 nan2.`,
    'Ni3 ke3 yi3 xian1 zong3 jie2 wen4 ti2, ran2 hou4 zai4 zhao3 fang1 fa3.',
    'Wo3 jue2 de5 zhe4 ge5 jian4 yi4 hen3 you3 yong4.',
    `Yin1 wei4 wo3 yi3 qian2 mei2 you3 zhe4 yang4 lian4 xi2, suo3 yi3 jin4 bu4 hen3 man4.`,
    'Mei2 guan1 xi5, ni3 mei3 tian1 lian4 xi2 yi4 dian3, xiao4 guo3 hui4 geng4 hao3.',
    'Hao3, wo3 jin1 tian1 jiu4 shi4 yi2 shi4.'
  ];
};

const lowDialogue = (hsk, topic) => {
  const focus = topic[4];
  const focusPinyin = topic[5];
  const zhLines = hsk === 1
    ? [
        '你好，我叫小明。我是学生。',
        '你好，小明。我是老师。',
        `今天我学${focus}，也读${focus}。`,
        `很好。你写${focus}吗？`,
        `我写${focus}，也说${focus}。`,
        '好，我们一起读。',
        '谢谢老师，再见。'
      ]
    : hsk === 2
      ? [
          `你明天有时间吗？我想练习${focus}。`,
          '可以。我们下午一起去吧。',
          `我已经准备好了，因为我喜欢${focus}。`,
          '很好。我也想跟你一起学。',
          '那我们三点见，不要迟到。',
          '没问题，一会儿见。'
        ]
      : [
          `最近我在学${focus}，但是有一点难。`,
          '你可以先总结问题，然后再找方法。',
          '我觉得这个建议很有用。',
          '因为我以前没有这样练习，所以进步很慢。',
          '没关系，你每天练习一点，效果会更好。',
          '好，我今天就试一试。'
        ];

  const pyLines = pinyinForLowLine(hsk, focusPinyin);

  return zhLines.map((line, index) => ({
    speaker: index % 2 === 0 ? 'A' : 'B',
    zh: line,
    simplified: line,
    pinyin: pyLines[index],
    en: `Dialogue line ${index + 1} about ${topic[2].toLowerCase()}.`,
    vi: `Cau hoi thoai ${index + 1} ve ${topic[3]}.`
  }));
};

const highPassage = (hsk, topic) => {
  const focus = topic[4];
  if (hsk === 4) {
    return `这段材料讨论${focus}。在现实生活中，${focus}不只是一个简单话题，也会影响个人选择和团队决定。有人认为，只要目标清楚，行动就会自然有效；然而，材料提醒我们，目标、证据和原因必须放在一起看。没有证据的观点容易显得空，只有情绪的判断也容易失去平衡。因此，学习者需要先找出材料的主要观点，再说明它怎样影响具体行动。材料还强调，讨论问题时要注意对象、场合和结果，不能只看个人感受。这样的阅读训练不是背答案，而是用清楚的理由理解问题、比较选择，并提出合理建议，使表达更可靠。`;
  }

  if (hsk === 5) {
    return `这段材料表面上讨论${focus}，背后却在提醒读者注意更深的含义。作者并没有直接给出唯一答案，而是通过几个细节显示自己的倾向：一方面，${focus}能够带来新的机会；另一方面，如果只看眼前利益，就可能忽略长期影响。材料中的论证取决于证据是否充分，也取决于语气是否合适。读者需要分辨哪些内容是事实，哪些只是推测，哪些话带有暗示。尤其要注意作者在转折处留下的保留态度。真正的理解不只是找关键词，而是看出观点之间的关系，评价理由的强弱，并用自己的话说明作者为什么这样安排材料。`;
  }

  return `这段材料借${focus}展开讨论，真正考查的是读者能否在语境中拿捏分寸。作者的观点并非直线推进，而是先设置一个看似不言自明的预设，再用细节慢慢松动它。某些词语表面平和，实际却带有评议意味；某些转折看似轻描淡写，却改变了整段话的重心。理解这类文本，不能只追求字面对应，还要斟酌修辞、含义和文化背景之间的关系。若把所有表达都译成直接结论，文章的神韵便会被削弱；若只欣赏风格而忽视证据，又会失去判断标准。因此，恰到好处的理解，需要在观点、语气、预设与分寸之间融会贯通。`;
};

const grammar = (hsk, topic, vocab) => {
  const focus = topic[4];
  const focusPinyin = topic[5];
  const cefr = CEFR_BY_HSK[hsk];
  const rules = hsk === 1
    ? [
        {
          pattern: '主语 + 是 + 身份',
          explanation: '用“是”说明一个人的身份。',
          explanation_vi: 'Dung “是” de noi than phan cua mot nguoi.',
          examples: ['我是学生。', '你是老师。', '他是医生。'],
          example_pinyin: ['Wo3 shi4 xue2 sheng5.', 'Ni3 shi4 lao3 shi1.', 'Ta1 shi4 yi1 sheng1.']
        },
        {
          pattern: '主语 + 学/读/写 + 内容',
          explanation: '动词后面直接放学习的内容。',
          explanation_vi: 'Sau dong tu dat truc tiep noi dung hoc.',
          examples: [`我学${focus}。`, `我读${focus}。`, `我写${focus}。`],
          example_pinyin: [`Wo3 xue2 ${focusPinyin}.`, `Wo3 du2 ${focusPinyin}.`, `Wo3 xie3 ${focusPinyin}.`]
        }
      ]
    : hsk === 2
      ? [
          {
            pattern: '想 + 动词',
            explanation: '“想”表示计划或愿望。',
            explanation_vi: '“想” dien ta ke hoach hoac mong muon.',
            examples: [`我想练习${focus}。`, '我想去学校。', '你想喝水吗？'],
            example_pinyin: [`Wo3 xiang3 lian4 xi2 ${focusPinyin}.`, 'Wo3 xiang3 qu4 xue2 xiao4.', 'Ni3 xiang3 he1 shui3 ma?']
          },
          {
            pattern: '因为...所以...',
            explanation: '先说原因，再说结果。',
            explanation_vi: 'Noi nguyen nhan truoc, roi noi ket qua.',
            examples: [`因为我喜欢${focus}，所以我练习。`, '因为下雨，所以我在家。', '因为他忙，所以他晚来。'],
            example_pinyin: [`Yin1 wei4 wo3 xi3 huan5 ${focusPinyin}, suo3 yi3 wo3 lian4 xi2.`, 'Yin1 wei4 xia4 yu3, suo3 yi3 wo3 zai4 jia1.', 'Yin1 wei4 ta1 mang2, suo3 yi3 ta1 wan3 lai2.']
          }
        ]
      : hsk === 3
        ? [
            {
              pattern: '先...然后...',
              explanation: '说明两个动作的先后顺序。',
              explanation_vi: 'Dien ta thu tu truoc sau cua hai hanh dong.',
              examples: ['我先看问题，然后回答。', `他先练习${focus}，然后休息。`, '我们先买票，然后上车。'],
              example_pinyin: ['Wo3 xian1 kan4 wen4 ti2, ran2 hou4 hui2 da2.', `Ta1 xian1 lian4 xi2 ${focusPinyin}, ran2 hou4 xiu1 xi5.`, 'Wo3 men5 xian1 mai3 piao4, ran2 hou4 shang4 che1.']
            },
            {
              pattern: '虽然...但是...',
              explanation: '前后意思有转折。',
              explanation_vi: 'Hai ve co y chuyen huong doi lap.',
              examples: [`虽然${focus}有点难，但是我想学。`, '虽然今天很忙，但是我会来。', '虽然他不舒服，但是他去上课。'],
              example_pinyin: [`Sui1 ran2 ${focusPinyin} you3 dian3 nan2, dan4 shi4 wo3 xiang3 xue2.`, 'Sui1 ran2 jin1 tian1 hen3 mang2, dan4 shi4 wo3 hui4 lai2.', 'Sui1 ran2 ta1 bu4 shu1 fu5, dan4 shi4 ta1 qu4 shang4 ke4.']
            }
          ]
        : hsk === 4
          ? [
              {
                pattern: '不只是...也...',
                explanation: '说明一个事物有两个层面的作用。',
                explanation_vi: 'Dien ta mot su viec co hon mot tac dung/tang nghia.',
                examples: [`${focus}不只是话题，也影响选择。`, '学习不只是记词，也训练思考。', '服务不只是速度，也包括质量。']
              },
              {
                pattern: '因此 + 结果/建议',
                explanation: '用“因此”接前文理由推出结果。',
                explanation_vi: 'Dung “因此” de rut ra ket qua tu ly do truoc do.',
                examples: [`证据很清楚，因此观点更有力。`, '原因复杂，因此决定要平衡。', `${focus}影响很大，因此需要讨论。`]
              }
            ]
          : hsk === 5
            ? [
                {
                  pattern: '表面上...背后...',
                  explanation: '区分表层信息和深层含义。',
                  explanation_vi: 'Phan biet thong tin be mat va ham y sau do.',
                  examples: [`材料表面上谈${focus}，背后谈选择。`, '他表面上同意，背后仍有担心。', '问题表面上简单，背后很复杂。']
                },
                {
                  pattern: '取决于...',
                  explanation: '说明结果由某个条件决定。',
                  explanation_vi: 'Dien ta ket qua phu thuoc vao dieu kien nao do.',
                  examples: ['效果取决于证据。', `判断取决于${focus}的背景。`, '语气取决于对象和场合。']
                }
              ]
            : [
                {
                  pattern: '并非...而是...',
                  explanation: '否定一个理解，再提出更准确的理解。',
                  explanation_vi: 'Phu dinh mot cach hieu, sau do dua ra cach hieu chinh xac hon.',
                  examples: [`重点并非${focus}本身，而是语境。`, '问题并非没有答案，而是答案有分寸。', '作者并非反对创新，而是提醒代价。']
                },
                {
                  pattern: '若...便...',
                  explanation: '用较书面的方式说明条件和结果。',
                  explanation_vi: 'Cau dieu kien-ket qua trang trong hon.',
                  examples: ['若只看字面，便会误解含义。', '若忽视语境，便难以拿捏分寸。', `若理解${focus}，便能看出预设。`]
                }
              ];

  return rules.map((rule) => ({
    ...rule,
    hsk_level: hsk,
    cefr_level: cefr,
    examples: rule.examples.map((zh, index) => ({
      zh,
      simplified: zh,
      pinyin: hsk <= 3 ? (rule.example_pinyin?.[index] || '') : '',
      en: `Example ${index + 1} for ${rule.pattern}.`,
      english: `Example ${index + 1} for ${rule.pattern}.`,
      vi: `Vi du ${index + 1} cho mau ${rule.pattern}.`
    }))
  }));
};

const warmUp = (hsk, topic) => {
  const focus = topic[4];
  const titleVi = topic[3];
  const items = hsk <= 2
    ? [
        `看图选词：${focus} / 学生 / 老师`,
        `你今天想学${focus}吗？`,
        `把${focus}和正确场景配对。`
      ]
    : hsk === 3
      ? [
          `说一说你最近一次接触${focus}的经历。`,
          `判断：这个场景更需要建议还是原因？`,
          `用一句话说明你对${focus}的看法。`
        ]
      : [
          `快速判断：${focus}是个人问题还是社会问题？`,
          `找出一个支持观点和一个反对观点。`,
          `预测材料可能如何评价${focus}。`
        ];

  return {
    title: '热身',
    title_pinyin: hsk <= 3 ? 're4 shen1' : '',
    title_vi: 'Khoi dong',
    items,
    items_vi: [
      `Kich hoat kien thuc nen ve ${titleVi}.`,
      `Du doan ngon ngu se dung trong chu de ${titleVi}.`,
      `Noi nhanh mot tinh huong lien quan den ${titleVi}.`
    ]
  };
};

const coreModule = (hsk, topic) => {
  if (hsk <= 3) {
    const dialogue = lowDialogue(hsk, topic);
    return {
      module_type: 'reading',
      phases: [
        {
          type: 'dialogue',
          title: '课文',
          title_pinyin: 'ke4 wen2',
          scenario: topic[2],
          dialogue,
          content_zh: dialogue.map((line) => line.zh).join(''),
          content_pinyin: dialogue.map((line) => line.pinyin).join('\n'),
          content_en: `Situational dialogue about ${topic[2].toLowerCase()}.`,
          content_vi: `Hoi thoai tinh huong ve ${topic[3]}.`
        }
      ]
    };
  }

  return {
    module_type: 'reading',
    phases: [
      {
        type: 'reading_passage',
        title: '课文',
        scenario: topic[2],
        content_zh: highPassage(hsk, topic),
        content_pinyin: '',
        content_en: `Short passage about ${topic[2].toLowerCase()}.`,
        content_vi: `Doan van ngan ve ${topic[3]}.`
      }
    ]
  };
};

const exercisePinyin = (hsk, value) => (hsk <= 3 ? value : undefined);

const exercises = (hsk, topic, module) => {
  const cefr = CEFR_BY_HSK[hsk];
  const focus = topic[4];
  const focusPinyin = topic[5];
  const text = module.phases[0].content_zh;
  const textPinyin = hsk <= 3 ? module.phases[0].content_pinyin : '';
  const base = {
    skill: 'mixed',
    prompt_vi: '',
    prompt_english: '',
    options_vi: [],
    correct_answer_vi: '',
    explanation_vi: '',
    stimulus: null
  };
  const options = hsk <= 3
    ? [focus, '学生', '老师']
    : [focus, '证据', '原因', '观点'];

  return [
    {
      ...base,
      id: '',
      kind: 'fill_blank',
      bloom_level: hsk <= 2 ? 'remember' : hsk <= 4 ? 'apply' : 'analyze',
      prompt: hsk <= 3 ? `今天我学___。` : `${focus}影响___。`,
      prompt_pinyin: exercisePinyin(hsk, hsk <= 3 ? `Jin1 tian1 wo3 xue2 ___.` : ''),
      prompt_vi: 'Dien tu dung vao cho trong.',
      prompt_english: 'Fill in the blank with the correct lesson word.',
      options,
      options_vi: options.map((item) => `Lua chon: ${item}`),
      correct_answer: focus,
      correct_answer_vi: focus,
      acceptable_variants: [focus],
      explanation: hsk <= 3 ? `课文说“今天我学${focus}”。` : `材料围绕${focus}说明影响。`,
      explanation_vi: 'Dap an lay truc tiep tu tu vung va ngu canh cua bai.'
    },
    {
      ...base,
      id: '',
      kind: 'word_order',
      bloom_level: hsk <= 2 ? 'understand' : hsk <= 4 ? 'apply' : 'evaluate',
      prompt: hsk <= 3 ? `我 / 学 / ${focus}` : `${focus} / 影响 / 观点`,
      prompt_pinyin: exercisePinyin(hsk, hsk <= 3 ? `Wo3 / xue2 / ${focusPinyin}` : ''),
      prompt_vi: 'Sap xep tu thanh cau dung.',
      prompt_english: 'Unscramble the words into a correct sentence.',
      options: hsk <= 3 ? ['我', '学', focus] : [focus, '影响', '观点'],
      options_vi: hsk <= 3 ? ['toi', 'hoc', topic[3]] : [topic[3], 'anh huong', 'quan diem'],
      correct_answer: hsk <= 3 ? `我学${focus}。` : `${focus}影响观点。`,
      correct_answer_vi: hsk <= 3 ? `Toi hoc ${topic[3]}.` : `${topic[3]} anh huong quan diem.`,
      acceptable_variants: [hsk <= 3 ? `我学${focus}` : `${focus}影响观点`],
      explanation: hsk <= 3 ? `顺序是主语“我”加动词“学”加内容“${focus}”。` : `顺序是主题、动词、对象。`,
      explanation_vi: 'Bai nay kiem tra trat tu cau duoc day trong phan ngu phap.'
    },
    {
      ...base,
      id: '',
      kind: 'reading_comprehension',
      bloom_level: hsk <= 2 ? 'understand' : hsk <= 4 ? 'analyze' : 'evaluate',
      prompt: hsk <= 3 ? `小明今天学什么？` : `${focus}和什么有关？`,
      prompt_pinyin: exercisePinyin(hsk, hsk <= 3 ? 'Xiao3 Ming2 jin1 tian1 xue2 shen2 me5?' : ''),
      prompt_vi: 'Tra loi dua tren bai doc/hoi thoai.',
      prompt_english: 'Answer based only on the text/dialogue.',
      options,
      options_vi: options.map((item) => `Lua chon: ${item}`),
      correct_answer: focus,
      correct_answer_vi: focus,
      acceptable_variants: [focus],
      explanation: hsk <= 3 ? `对话中说“今天我学${focus}”。` : `材料从${focus}出发讨论观点、原因和影响。`,
      explanation_vi: 'Cau tra loi nam trong chinh bai khoa, khong can tu ngoai bai.',
      stimulus: {
        type: 'reading',
        title: topic[1],
        text,
        pinyin: textPinyin,
        english: `Reading stimulus for ${topic[2].toLowerCase()}.`
      }
    }
  ];
};

const makeLesson = (hsk, index, topic) => {
  const cefr = CEFR_BY_HSK[hsk];
  const lessonId = `hsk${hsk}-l${String(index + 1).padStart(2, '0')}-standard-${topic[0]}`;
  const vocab = levelBaseWords(hsk, topic).slice(0, hsk <= 2 ? 7 : hsk <= 3 ? 9 : 10);
  const module = coreModule(hsk, topic);
  const ex = exercises(hsk, topic, module).map((exercise, exerciseIndex) => ({
    ...exercise,
    id: `${lessonId}-ex${exerciseIndex + 1}`
  }));

  return accentVietnameseDeep({
    lesson_id: lessonId,
    metadata: {
      title_zh: topic[1],
      title_en: `${topic[2]} - Standard HSK ${hsk}`,
      title_vi: `${topic[3]} - HSK ${hsk}`,
      hsk_level: hsk,
      cefr_level: cefr,
      cefr_activities: ['reception', 'production', 'interaction'],
      primary_skill: 'mixed',
      secondary_skills: ['reading', 'speaking', 'writing'],
      topic: topic[0],
      estimated_minutes: hsk <= 2 ? 15 : hsk <= 4 ? 20 : 25,
      xp_reward: 30 + hsk * 10,
      tags: [`hsk${hsk}`, cefr.toLowerCase(), 'standard-hsk', topic[0]]
    },
    learning_objectives: [
      `理解${topic[1]}中的核心词语。`,
      `使用本课句式完成${topic[1]}表达。`,
      `根据课文回答不超出本课范围的问题。`
    ],
    learning_objectives_vi: [
      `Hieu tu vung cot loi ve ${topic[3]}.`,
      `Dung mau cau cua bai de dien dat ve ${topic[3]}.`,
      `Tra loi cau hoi dua tren bai khoa, khong dung tu vuot cap.`
    ],
    warm_up: warmUp(hsk, topic),
    vocabulary_focus: vocab.map((item, itemIndex) => ({
      word_id: `std_hsk${hsk}_${topic[0].replace(/[^a-z0-9]+/g, '_')}_${itemIndex + 1}`,
      simplified: item.simplified,
      pinyin: item.pinyin,
      part_of_speech: item.part_of_speech,
      english: item.english,
      vi: item.vi,
      is_new: true
    })),
    core_modules: [module],
    grammar_focus: grammar(hsk, topic, vocab),
    practice: {
      title: '练习',
      title_pinyin: hsk <= 3 ? 'lian4 xi2' : '',
      closed_loop_data_rule: true,
      exercise_types: ['fill_blank', 'word_order', 'reading_comprehension'],
      exercises: ex
    },
    practical_application: {
      title: '运用',
      title_pinyin: hsk <= 3 ? 'yun4 yong4' : '',
      can_do: CAN_DO[cefr],
      task_zh: hsk <= 3
        ? `和同学用本课词语完成一段关于${topic[1]}的短对话。`
        : `用本课词语概括${topic[1]}的主要观点，并补充一个理由。`,
      task_vi: hsk <= 3
        ? `Dong vai voi ban hoc mot hoi thoai ngan ve ${topic[3]}, chi dung tu cua bai va cap thap hon.`
        : `Tom tat quan diem chinh ve ${topic[3]} va them mot ly do, chi dung tu trong bai va cap thap hon.`
    },
    review: {
      key_takeaways: [
        `本课围绕${topic[1]}学习。`,
        '练习只使用本课或更低等级词语。',
        `对应等级：${cefr}。`
      ],
      key_takeaways_vi: [
        `Bai hoc xoay quanh ${topic[3]}.`,
        'Bai tap chi dung tu cua bai hoac cap thap hon.',
        cefr
      ],
      can_do_task: CAN_DO[cefr],
      practical_application_vi: hsk <= 3
        ? `Hoi thoai ngan ve ${topic[3]}.`
        : `Tom tat va danh gia ngan ve ${topic[3]}.`,
      srs_inject_word_ids: vocab.map((_, itemIndex) => `std_hsk${hsk}_${topic[0].replace(/[^a-z0-9]+/g, '_')}_${itemIndex + 1}`)
    }
  });
};

const buildRules = () => ({
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  version: '2026-07-09-standard-hsk',
  purpose: 'Standard HSK lesson generation with CEFR mapping and closed-loop exercise data.',
  hsk_to_cefr: CEFR_BY_HSK,
  lesson_contract: {
    required_sections: ['warm_up', 'vocabulary_focus', 'core_modules', 'grammar_focus', 'practice.exercises', 'practical_application'],
    vocabulary_per_lesson: { min: 5, max: 12 },
    grammar_rules_per_lesson: { min: 2, max: 3 },
    examples_per_grammar_rule: 3,
    exercise_kinds_exactly: ['fill_blank', 'word_order', 'reading_comprehension'],
    closed_loop_data_rule: 'Every Chinese item in exercises must come from current lesson vocabulary, grammar, text, or lower HSK/CEFR levels.'
  },
  levels: Object.fromEntries(Object.entries(CEFR_BY_HSK).map(([hsk, cefr]) => [
    cefr,
    {
      hsk_level: Number(hsk),
      can_do: CAN_DO[cefr],
      allowed_kinds: ['fill_blank', 'word_order', 'reading_comprehension'],
      allowed_bloom_levels: Number(hsk) <= 2
        ? ['remember', 'understand']
        : Number(hsk) === 3
          ? ['understand', 'apply', 'analyze']
          : Number(hsk) === 4
            ? ['apply', 'analyze', 'evaluate']
            : ['analyze', 'evaluate', 'create'],
      bloom_distribution: Number(hsk) <= 2
        ? ['remember', 'understand', 'understand']
        : Number(hsk) === 3
          ? ['apply', 'apply', 'analyze']
          : Number(hsk) === 4
            ? ['apply', 'apply', 'analyze']
            : Number(hsk) === 5
              ? ['analyze', 'evaluate', 'evaluate']
              : ['analyze', 'evaluate', 'evaluate'],
      text_complexity: {
        reading: {
          hanzi: Number(hsk) <= 3 ? [50, 120] : [200, 500],
          pinyin: Number(hsk) <= 3
        }
      }
    }
  ])),
  validation: {
    lesson_count_per_hsk: 17,
    exercise_count: 3,
    strict_pinyin: {
      hsk_1_to_3: 'Pinyin required in text and exercise pinyin fields.',
      hsk_4_to_6: 'No pinyin inside Text/Dialogue or Exercises.'
    },
    anti_random_difficulty_leak: true
  }
});

const ruleMarkdown = `# Standard HSK/CEFR Lesson Rules

This directory has been reset to the standard HSK lesson framework.

## Level Mapping

| HSK | CEFR | Text Style |
| --- | --- | --- |
| 1 | A1 | Extremely simple survival phrases with full pinyin. |
| 2 | A2 | Simple routine exchanges with full pinyin. |
| 3 | B1 | Clear familiar dialogue with full pinyin in this app data set. |
| 4 | B2 | 200-500 character passage, no pinyin in text/exercises. |
| 5 | C1 | Longer implicit-meaning passage, no pinyin in text/exercises. |
| 6 | C2 | Nuanced idiomatic/cultural passage, no pinyin in text/exercises. |

## Required Lesson Sections

Each lesson must include:

1. Warm-up (热身)
2. Vocabulary (生词), 5-12 words
3. Text/Dialogue (课文)
4. Grammar Notes (注释), 2-3 rules, exactly 3 examples per rule
5. Exercises (练习), exactly these types: fill_blank, word_order, reading_comprehension
6. Practical Application (运用), CEFR can-do task

## Closed-Loop Data Rule

Chinese used in exercises must come from the current lesson vocabulary, current lesson grammar/text, or lower HSK/CEFR levels. Do not raise difficulty by injecting random advanced words.

## Pinyin Rule

HSK 1-3 includes pinyin in lesson text and exercise pinyin fields. HSK 4-6 has no pinyin in Text/Dialogue or Exercises.
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
  const exerciseKinds = lesson.practice.exercises.map((exercise) => exercise.kind).sort().join(',');

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

  if (exerciseKinds !== 'fill_blank,reading_comprehension,word_order') {
    throw new Error(`${lesson.lesson_id}: exercise kinds are not exactly the required three.`);
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

    for (const exercise of lesson.practice.exercises) {
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
    exercises: lesson.practice.exercises.length,
    chars: chars(JSON.stringify(lesson))
  };
};

const run = async () => {
  const lessons = Object.entries(TOPICS).flatMap(([hsk, topics]) =>
    topics.map((topic, index) => makeLesson(Number(hsk), index, topic))
  );

  const validation = lessons.map(validateLesson);
  const normalizedDir = resolveContentPath('data/lessons/normalized');

  await cleanDir(normalizedDir);

  for (const lesson of lessons) {
    await writeLessonEntry({ targetDir: normalizedDir, lesson });
  }

  await writeFile(resolveContentPath('data/lessons/cefr-exercise-rules.json'), `${JSON.stringify(buildRules(), null, 2)}\n`, 'utf8');
  await writeFile(resolveContentPath('data/lessons/rule.md'), ruleMarkdown, 'utf8');

  console.log(JSON.stringify({
    ok: true,
    lesson_count: lessons.length,
    by_hsk: Object.fromEntries(Object.keys(TOPICS).map((hsk) => [hsk, validation.filter((lesson) => lesson.hsk === Number(hsk)).length])),
    normalized: path.relative(repoRoot, normalizedDir)
  }, null, 2));
};

await run();
