import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentValidator } from '../src/services/content-validator.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(serverRoot, '..');
const curriculumPath = path.join(repoRoot, 'client/src/pages/Learn/curriculum.ts');
const generatedDir = path.join(repoRoot, 'data/lessons/generated');

const CEFR_BY_HSK = new Map([
  [1, 'A1'],
  [2, 'A2'],
  [3, 'B1'],
  [4, 'B2'],
  [5, 'C1'],
  [6, 'C2']
]);

const CEFR_ACTIVITIES_BY_SKILL = {
  listening: ['reception'],
  reading: ['reception'],
  speaking: ['production', 'interaction'],
  writing: ['production'],
  mixed: ['reception', 'production', 'interaction']
};

const MODULE_BY_SKILL = {
  listening: 'listening',
  reading: 'reading',
  speaking: 'speaking',
  writing: 'writing',
  mixed: 'reading'
};

const SKILL_ZH = {
  listening: '听力',
  reading: '阅读',
  speaking: '口语',
  writing: '写作',
  mixed: '综合'
};

const SKILL_VI = {
  listening: 'nghe',
  reading: 'đọc',
  speaking: 'nói',
  writing: 'viết',
  mixed: 'tổng hợp'
};

const TOPIC_ZH = {
  introductions: '自我介绍',
  family: '家庭',
  'daily-life': '日常生活',
  shopping: '购物',
  'end-test': '阶段复习',
  'home-city': '家和城市',
  plans: '计划',
  'food-travel': '饮食和出行',
  'health-weather': '健康和天气',
  experiences: '个人经历',
  travel: '旅行',
  'study-work': '学习和工作',
  'media-opinions': '媒体和观点',
  arguments: '观点讨论',
  workplace: '职场学习',
  culture: '文化比较',
  news: '新闻趋势',
  'implicit-meaning': '言外之意',
  academic: '学术分析',
  'social-professional': '社交和职场',
  debate: '辩论综合',
  synthesis: '信息综合',
  precision: '精确表达',
  'public-discourse': '公共话语',
  masterclass: '高级任务'
};

const TOPIC_VI = {
  introductions: 'giới thiệu bản thân',
  family: 'gia đình',
  'daily-life': 'sinh hoạt hằng ngày',
  shopping: 'mua sắm',
  'end-test': 'ôn tập cuối cấp',
  'home-city': 'nhà và thành phố',
  plans: 'kế hoạch',
  'food-travel': 'ăn uống và đi lại',
  'health-weather': 'sức khỏe và thời tiết',
  experiences: 'trải nghiệm cá nhân',
  travel: 'du lịch',
  'study-work': 'học tập và công việc',
  'media-opinions': 'truyền thông và quan điểm',
  arguments: 'thảo luận quan điểm',
  workplace: 'nơi làm việc và học thuật',
  culture: 'so sánh văn hóa',
  news: 'tin tức và xu hướng',
  'implicit-meaning': 'hàm ý',
  academic: 'phân tích học thuật',
  'social-professional': 'giao tiếp xã hội và nghề nghiệp',
  debate: 'tranh luận và tổng hợp',
  synthesis: 'tổng hợp thông tin',
  precision: 'diễn đạt chính xác',
  'public-discourse': 'diễn ngôn công cộng',
  masterclass: 'nhiệm vụ nâng cao'
};

const LEVEL_VOCAB = {
  1: [
    ['我', 'wǒ', 'I; me', 'tôi'],
    ['你', 'nǐ', 'you', 'bạn'],
    ['他', 'tā', 'he; him', 'anh ấy'],
    ['她', 'tā', 'she; her', 'cô ấy'],
    ['家', 'jiā', 'home; family', 'nhà; gia đình'],
    ['人', 'rén', 'person', 'người'],
    ['吃', 'chī', 'to eat', 'ăn'],
    ['喝', 'hē', 'to drink', 'uống'],
    ['买', 'mǎi', 'to buy', 'mua'],
    ['去', 'qù', 'to go', 'đi'],
    ['来', 'lái', 'to come', 'đến'],
    ['看', 'kàn', 'to look; read', 'xem; đọc'],
    ['听', 'tīng', 'to listen', 'nghe'],
    ['说', 'shuō', 'to speak', 'nói'],
    ['写', 'xiě', 'to write', 'viết'],
    ['学', 'xué', 'to study', 'học'],
    ['好', 'hǎo', 'good', 'tốt'],
    ['大', 'dà', 'big', 'lớn'],
    ['小', 'xiǎo', 'small', 'nhỏ'],
    ['多', 'duō', 'many; much', 'nhiều'],
    ['少', 'shǎo', 'few; little', 'ít'],
    ['今天', 'jīn tiān', 'today', 'hôm nay'],
    ['明天', 'míng tiān', 'tomorrow', 'ngày mai'],
    ['现在', 'xiàn zài', 'now', 'bây giờ'],
    ['上午', 'shàng wǔ', 'morning', 'buổi sáng'],
    ['下午', 'xià wǔ', 'afternoon', 'buổi chiều'],
    ['一', 'yī', 'one', 'một'],
    ['二', 'èr', 'two', 'hai'],
    ['三', 'sān', 'three', 'ba'],
    ['十', 'shí', 'ten', 'mười']
  ],
  2: [
    ['学校', 'xué xiào', 'school', 'trường học'],
    ['公司', 'gōng sī', 'company', 'công ty'],
    ['商店', 'shāng diàn', 'shop', 'cửa hàng'],
    ['饭店', 'fàn diàn', 'restaurant', 'nhà hàng'],
    ['车站', 'chē zhàn', 'station', 'nhà ga'],
    ['路', 'lù', 'road', 'đường'],
    ['左边', 'zuǒ bian', 'left side', 'bên trái'],
    ['右边', 'yòu bian', 'right side', 'bên phải'],
    ['前面', 'qián mian', 'front', 'phía trước'],
    ['后面', 'hòu mian', 'behind', 'phía sau'],
    ['时间', 'shí jiān', 'time', 'thời gian'],
    ['一起', 'yì qǐ', 'together', 'cùng nhau'],
    ['帮助', 'bāng zhù', 'to help', 'giúp đỡ'],
    ['问题', 'wèn tí', 'problem', 'vấn đề'],
    ['身体', 'shēn tǐ', 'body; health', 'cơ thể; sức khỏe'],
    ['天气', 'tiān qì', 'weather', 'thời tiết'],
    ['生病', 'shēng bìng', 'to get sick', 'bị ốm'],
    ['票', 'piào', 'ticket', 'vé'],
    ['菜', 'cài', 'dish', 'món ăn'],
    ['比', 'bǐ', 'than', 'so với']
  ],
  3: [
    ['经历', 'jīng lì', 'experience', 'trải nghiệm'],
    ['故事', 'gù shi', 'story', 'câu chuyện'],
    ['以前', 'yǐ qián', 'before', 'trước đây'],
    ['以后', 'yǐ hòu', 'afterwards', 'sau này'],
    ['因为', 'yīn wèi', 'because', 'bởi vì'],
    ['所以', 'suǒ yǐ', 'so', 'vì vậy'],
    ['如果', 'rú guǒ', 'if', 'nếu'],
    ['应该', 'yīng gāi', 'should', 'nên'],
    ['选择', 'xuǎn zé', 'to choose', 'lựa chọn'],
    ['计划', 'jì huà', 'plan', 'kế hoạch'],
    ['工作', 'gōng zuò', 'work', 'công việc'],
    ['学习', 'xué xí', 'study', 'học tập'],
    ['旅游', 'lǚ yóu', 'travel', 'du lịch'],
    ['办法', 'bàn fǎ', 'method', 'cách làm'],
    ['新闻', 'xīn wén', 'news', 'tin tức'],
    ['认为', 'rèn wéi', 'to think', 'cho rằng'],
    ['觉得', 'jué de', 'to feel; think', 'cảm thấy; nghĩ'],
    ['影响', 'yǐng xiǎng', 'influence', 'ảnh hưởng'],
    ['重要', 'zhòng yào', 'important', 'quan trọng'],
    ['清楚', 'qīng chu', 'clear', 'rõ ràng']
  ],
  4: [
    ['观点', 'guān diǎn', 'viewpoint', 'quan điểm'],
    ['理由', 'lǐ yóu', 'reason', 'lý do'],
    ['结果', 'jié guǒ', 'result', 'kết quả'],
    ['责任', 'zé rèn', 'responsibility', 'trách nhiệm'],
    ['任务', 'rèn wu', 'task', 'nhiệm vụ'],
    ['会议', 'huì yì', 'meeting', 'cuộc họp'],
    ['要求', 'yāo qiú', 'requirement', 'yêu cầu'],
    ['文化', 'wén huà', 'culture', 'văn hóa'],
    ['习惯', 'xí guàn', 'habit', 'thói quen'],
    ['比较', 'bǐ jiào', 'to compare', 'so sánh'],
    ['社会', 'shè huì', 'society', 'xã hội'],
    ['变化', 'biàn huà', 'change', 'thay đổi'],
    ['支持', 'zhī chí', 'to support', 'ủng hộ'],
    ['反对', 'fǎn duì', 'to oppose', 'phản đối'],
    ['说明', 'shuō míng', 'to explain', 'giải thích'],
    ['总结', 'zǒng jié', 'to summarize', 'tóm tắt']
  ],
  5: [
    ['含义', 'hán yì', 'meaning', 'ý nghĩa'],
    ['态度', 'tài du', 'attitude', 'thái độ'],
    ['语气', 'yǔ qì', 'tone', 'giọng điệu'],
    ['分析', 'fēn xī', 'to analyze', 'phân tích'],
    ['证据', 'zhèng jù', 'evidence', 'bằng chứng'],
    ['结构', 'jié gòu', 'structure', 'cấu trúc'],
    ['专业', 'zhuān yè', 'professional; major', 'chuyên ngành; chuyên nghiệp'],
    ['正式', 'zhèng shì', 'formal', 'trang trọng'],
    ['灵活', 'líng huó', 'flexible', 'linh hoạt'],
    ['立场', 'lì chǎng', 'position', 'lập trường'],
    ['挑战', 'tiǎo zhàn', 'challenge', 'thách thức'],
    ['综合', 'zōng hé', 'to synthesize', 'tổng hợp'],
    ['资料', 'zī liào', 'materials', 'tài liệu'],
    ['矛盾', 'máo dùn', 'conflict', 'mâu thuẫn']
  ],
  6: [
    ['整合', 'zhěng hé', 'to integrate', 'tích hợp'],
    ['来源', 'lái yuán', 'source', 'nguồn'],
    ['细微', 'xì wēi', 'subtle', 'tinh vi'],
    ['差别', 'chā bié', 'difference', 'khác biệt'],
    ['修辞', 'xiū cí', 'rhetoric', 'tu từ'],
    ['假设', 'jiǎ shè', 'assumption', 'giả định'],
    ['论证', 'lùn zhèng', 'argumentation', 'lập luận'],
    ['反驳', 'fǎn bó', 'to refute', 'phản bác'],
    ['概括', 'gài kuò', 'to summarize', 'khái quát'],
    ['精准', 'jīng zhǔn', 'precise', 'chính xác'],
    ['复杂', 'fù zá', 'complex', 'phức tạp'],
    ['对象', 'duì xiàng', 'audience; object', 'đối tượng'],
    ['篇章', 'piān zhāng', 'discourse', 'văn bản'],
    ['脉络', 'mài luò', 'thread; context', 'mạch văn']
  ]
};

const TOPIC_VOCAB = {
  introductions: [['名字', 'míng zi', 'name', 'tên'], ['中国', 'Zhōng guó', 'China', 'Trung Quốc'], ['老师', 'lǎo shī', 'teacher', 'giáo viên'], ['学生', 'xué sheng', 'student', 'học sinh']],
  family: [['爸爸', 'bà ba', 'father', 'bố'], ['妈妈', 'mā ma', 'mother', 'mẹ'], ['儿子', 'ér zi', 'son', 'con trai'], ['女儿', 'nǚ ér', 'daughter', 'con gái']],
  'daily-life': [['早上', 'zǎo shang', 'morning', 'buổi sáng'], ['睡觉', 'shuì jiào', 'to sleep', 'ngủ'], ['吃饭', 'chī fàn', 'to eat', 'ăn cơm'], ['每天', 'měi tiān', 'every day', 'mỗi ngày']],
  shopping: [['钱', 'qián', 'money', 'tiền'], ['东西', 'dōng xi', 'thing', 'đồ vật'], ['杯子', 'bēi zi', 'cup', 'cốc'], ['水果', 'shuǐ guǒ', 'fruit', 'trái cây']],
  'home-city': [['房间', 'fáng jiān', 'room', 'phòng'], ['城市', 'chéng shì', 'city', 'thành phố'], ['附近', 'fù jìn', 'nearby', 'gần đó'], ['地方', 'dì fang', 'place', 'nơi chốn']],
  plans: [['周末', 'zhōu mò', 'weekend', 'cuối tuần'], ['请客', 'qǐng kè', 'to invite', 'mời khách'], ['准备', 'zhǔn bèi', 'to prepare', 'chuẩn bị'], ['参加', 'cān jiā', 'to attend', 'tham gia']],
  'food-travel': [['米饭', 'mǐ fàn', 'rice', 'cơm'], ['面条', 'miàn tiáo', 'noodles', 'mì'], ['出租车', 'chū zū chē', 'taxi', 'taxi'], ['火车', 'huǒ chē', 'train', 'tàu hỏa']],
  'health-weather': [['头疼', 'tóu téng', 'headache', 'đau đầu'], ['休息', 'xiū xi', 'to rest', 'nghỉ ngơi'], ['下雨', 'xià yǔ', 'to rain', 'mưa'], ['阴天', 'yīn tiān', 'cloudy day', 'trời âm u']],
  experiences: [['回忆', 'huí yì', 'memory', 'ký ức'], ['发生', 'fā shēng', 'to happen', 'xảy ra'], ['难忘', 'nán wàng', 'memorable', 'khó quên'], ['突然', 'tū rán', 'suddenly', 'đột nhiên']],
  travel: [['宾馆', 'bīn guǎn', 'hotel', 'khách sạn'], ['机场', 'jī chǎng', 'airport', 'sân bay'], ['护照', 'hù zhào', 'passport', 'hộ chiếu'], ['行李', 'xíng li', 'luggage', 'hành lý']],
  'study-work': [['目标', 'mù biāo', 'goal', 'mục tiêu'], ['经验', 'jīng yàn', 'experience', 'kinh nghiệm'], ['同事', 'tóng shì', 'colleague', 'đồng nghiệp'], ['机会', 'jī huì', 'opportunity', 'cơ hội']],
  'media-opinions': [['节目', 'jié mù', 'program', 'chương trình'], ['手机', 'shǒu jī', 'mobile phone', 'điện thoại'], ['看法', 'kàn fǎ', 'opinion', 'cách nhìn'], ['事实', 'shì shí', 'fact', 'sự thật']],
  arguments: [['优点', 'yōu diǎn', 'advantage', 'ưu điểm'], ['缺点', 'quē diǎn', 'shortcoming', 'nhược điểm'], ['证据', 'zhèng jù', 'evidence', 'bằng chứng'], ['结论', 'jié lùn', 'conclusion', 'kết luận']],
  workplace: [['进度', 'jìn dù', 'progress', 'tiến độ'], ['日期', 'rì qī', 'date', 'ngày tháng'], ['安排', 'ān pái', 'arrangement', 'sắp xếp'], ['合作', 'hé zuò', 'cooperation', 'hợp tác']],
  culture: [['传统', 'chuán tǒng', 'tradition', 'truyền thống'], ['风俗', 'fēng sú', 'custom', 'phong tục'], ['价值', 'jià zhí', 'value', 'giá trị'], ['差异', 'chā yì', 'difference', 'khác biệt']],
  news: [['报道', 'bào dào', 'report', 'bản tin'], ['趋势', 'qū shì', 'trend', 'xu hướng'], ['公众', 'gōng zhòng', 'public', 'công chúng'], ['背景', 'bèi jǐng', 'background', 'bối cảnh']],
  'implicit-meaning': [['暗示', 'àn shì', 'hint', 'gợi ý ngầm'], ['推断', 'tuī duàn', 'to infer', 'suy luận'], ['委婉', 'wěi wǎn', 'indirect', 'uyển chuyển'], ['意图', 'yì tú', 'intention', 'ý định']],
  academic: [['理论', 'lǐ lùn', 'theory', 'lý thuyết'], ['框架', 'kuàng jià', 'framework', 'khung'], ['数据', 'shù jù', 'data', 'dữ liệu'], ['论点', 'lùn diǎn', 'claim', 'luận điểm']],
  'social-professional': [['场合', 'chǎng hé', 'occasion', 'ngữ cảnh'], ['礼貌', 'lǐ mào', 'politeness', 'lịch sự'], ['身份', 'shēn fèn', 'identity', 'vai trò'], ['策略', 'cè lüè', 'strategy', 'chiến lược']],
  debate: [['反方', 'fǎn fāng', 'opposing side', 'bên phản biện'], ['正方', 'zhèng fāng', 'affirmative side', 'bên ủng hộ'], ['让步', 'ràng bù', 'concession', 'nhượng bộ'], ['归纳', 'guī nà', 'to generalize', 'quy nạp']],
  synthesis: [['摘要', 'zhāi yào', 'abstract', 'tóm tắt'], ['互补', 'hù bǔ', 'complementary', 'bổ sung'], ['冲突', 'chōng tū', 'conflict', 'xung đột'], ['取舍', 'qǔ shě', 'trade-off', 'cân nhắc lựa chọn']],
  precision: [['搭配', 'dā pèi', 'collocation', 'kết hợp từ'], ['语境', 'yǔ jìng', 'context', 'ngữ cảnh'], ['含蓄', 'hán xù', 'implicit', 'hàm súc'], ['分寸', 'fēn cun', 'measure; propriety', 'chừng mực']],
  'public-discourse': [['社论', 'shè lùn', 'editorial', 'xã luận'], ['演讲', 'yǎn jiǎng', 'speech', 'bài phát biểu'], ['立意', 'lì yì', 'main intent', 'ý chính'], ['说服', 'shuō fú', 'to persuade', 'thuyết phục']],
  masterclass: [['受众', 'shòu zhòng', 'audience', 'người nghe'], ['转述', 'zhuǎn shù', 'to relay', 'truyền đạt lại'], ['凝练', 'níng liàn', 'concise', 'cô đọng'], ['完善', 'wán shàn', 'to refine', 'hoàn thiện']]
};

const GRAMMAR_BY_LEVEL = {
  1: { pattern: '主语 + 是 + 名词', zh: '用“是”说明身份。', vi: 'Dùng “是” để nêu thân phận hoặc vai trò.', example: '我是学生。', pinyin: 'Wǒ shì xué sheng.', en: 'I am a student.', exampleVi: 'Tôi là học sinh.' },
  2: { pattern: '在 + 地点 + 动作', zh: '用“在”说明动作发生的地方。', vi: 'Dùng “在” để nêu nơi hành động xảy ra.', example: '我在学校学习。', pinyin: 'Wǒ zài xué xiào xué xí.', en: 'I study at school.', exampleVi: 'Tôi học ở trường.' },
  3: { pattern: '因为...所以...', zh: '用“因为...所以...”说明原因和结果。', vi: 'Dùng “因为...所以...” để nêu nguyên nhân và kết quả.', example: '因为下雨，所以我晚到了。', pinyin: 'Yīn wèi xià yǔ, suǒ yǐ wǒ wǎn dào le.', en: 'Because it rained, I arrived late.', exampleVi: 'Vì trời mưa nên tôi đến muộn.' },
  4: { pattern: '虽然...但是...', zh: '用“虽然...但是...”表达让步和转折。', vi: 'Dùng “虽然...但是...” để diễn đạt nhượng bộ và chuyển ý.', example: '虽然任务很急，但是计划很清楚。', pinyin: 'Suī rán rèn wu hěn jí, dàn shì jì huà hěn qīng chu.', en: 'Although the task is urgent, the plan is clear.', exampleVi: 'Dù nhiệm vụ gấp, kế hoạch vẫn rõ ràng.' },
  5: { pattern: '不仅...而且...', zh: '用“不仅...而且...”连接递进信息。', vi: 'Dùng “不仅...而且...” để nối thông tin tăng tiến.', example: '这段话不仅有证据，而且有清楚的结构。', pinyin: 'Zhè duàn huà bù jǐn yǒu zhèng jù, ér qiě yǒu qīng chu de jié gòu.', en: 'This passage has not only evidence but also a clear structure.', exampleVi: 'Đoạn này không chỉ có bằng chứng mà còn có cấu trúc rõ.' },
  6: { pattern: '既...又...', zh: '用“既...又...”概括并列的复杂特点。', vi: 'Dùng “既...又...” để khái quát hai đặc điểm phức tạp song song.', example: '这个论证既关注来源，又说明细微差别。', pinyin: 'Zhè ge lùn zhèng jì guān zhù lái yuán, yòu shuō míng xì wēi chā bié.', en: 'This argument considers sources and explains subtle differences.', exampleVi: 'Lập luận này vừa chú ý nguồn vừa giải thích khác biệt tinh vi.' }
};

const CORE_TEXT_BY_LEVEL = {
  1: '我在家学习。妈妈买水果。',
  2: '下午我在学校等朋友。我们吃面条，然后坐车回家。',
  3: '上个月我去外地学习。开始时路不熟，后来同学帮我找车站。这次经历很有用，因为我学会了先看信息。',
  4: '小组讨论新计划时，大家看法不同。有人支持马上开始，也有人担心任务太多。最后我们先总结理由。',
  5: '这篇材料表面上讨论学习方法，实际重点是时间管理。作者先提出常见问题，再用数据说明习惯的影响。读者需要注意语气变化，才能判断作者真正支持的立场。',
  6: '两份资料都谈公共表达，但侧重点不同。第一份强调论证结构，第二份关注受众反应。综合时不能简单合并结论，而要说明来源、假设和细微差别。'
};

const CORE_EN_BY_LEVEL = {
  1: 'I study at home. Mom buys fruit.',
  2: 'In the afternoon, I wait for a friend at school. We eat noodles, then go home by vehicle.',
  3: 'Last month I went to another place to study. At first I did not know the road well; later a classmate helped me find the station. This experience was useful because I learned to look at information first.',
  4: 'When the group discussed the new plan, people had different views. Some supported starting immediately, while others worried there were too many tasks. In the end, we summarized the reasons first.',
  5: 'This material appears to discuss study methods, but its real focus is time management. The author first raises common problems and then uses data to explain the influence of habits. Readers need to notice changes in tone to judge the position the author truly supports.',
  6: 'Both sources discuss public expression, but their emphases differ. The first stresses argument structure, while the second focuses on audience response. In synthesis, one should not simply merge conclusions but explain sources, assumptions, and subtle differences.'
};

const CORE_VI_BY_LEVEL = {
  1: 'Tôi học ở nhà. Mẹ mua trái cây.',
  2: 'Buổi chiều tôi đợi bạn ở trường. Chúng tôi ăn mì, rồi đi xe về nhà.',
  3: 'Tháng trước tôi đi nơi khác để học. Ban đầu tôi không quen đường, sau đó bạn học giúp tôi tìm nhà ga. Trải nghiệm này hữu ích vì tôi học cách xem thông tin trước.',
  4: 'Khi nhóm thảo luận kế hoạch mới, mọi người có quan điểm khác nhau. Có người ủng hộ bắt đầu ngay, có người lo nhiệm vụ quá nhiều. Cuối cùng, chúng tôi tóm tắt lý do trước.',
  5: 'Tài liệu này bề ngoài bàn về phương pháp học, nhưng trọng tâm thật sự là quản lý thời gian. Tác giả nêu vấn đề thường gặp trước, rồi dùng dữ liệu giải thích ảnh hưởng của thói quen. Người đọc cần chú ý thay đổi giọng điệu để xác định lập trường tác giả thật sự ủng hộ.',
  6: 'Hai nguồn đều bàn về diễn đạt công cộng, nhưng trọng điểm khác nhau. Nguồn thứ nhất nhấn mạnh cấu trúc lập luận, nguồn thứ hai chú ý phản ứng của người nghe. Khi tổng hợp, không thể chỉ gộp kết luận mà cần giải thích nguồn, giả định và khác biệt tinh vi.'
};

const toPrimarySkill = (skill) => {
  if (skill === 'test') return 'mixed';
  if (skill === 'grammar' || skill === 'vocabulary') return 'reading';
  return skill;
};

const slugify = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const parseCurriculum = async () => {
  const content = await fs.readFile(curriculumPath, 'utf8');
  const lessonRegex = /hskLevel:\s*(\d+)[\s\S]*?topics:\s*\[([\s\S]*?)\],\s*endTest:\s*lesson\(\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"(?:,\s*(\d+)\s*,\s*(\d+))?/g;
  const topicRegex = /id:\s*"hsk\d+-([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*,\s*lessons:\s*\[([\s\S]*?)\]\s*,/g;
  const itemRegex = /lesson\(\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"(?:,\s*(\d+)\s*,\s*(\d+))?\s*\)/g;
  const specs = [];
  let levelMatch;

  while ((levelMatch = lessonRegex.exec(content)) !== null) {
    const level = Number(levelMatch[1]);
    const topicsBlock = levelMatch[2];
    let topicMatch;

    while ((topicMatch = topicRegex.exec(topicsBlock)) !== null) {
      const topic = topicMatch[1];
      const topicTitle = topicMatch[2];
      const lessonsBlock = topicMatch[3];
      let itemMatch;

      while ((itemMatch = itemRegex.exec(lessonsBlock)) !== null) {
        const order = Number(itemMatch[1]);
        const rawSkill = itemMatch[2];
        const skill = toPrimarySkill(rawSkill);
        specs.push({
          level,
          order,
          rawSkill,
          skill,
          topic,
          topicTitle,
          sourceTitle: itemMatch[3],
          sourceObjective: itemMatch[4],
          estimatedMinutes: Number(itemMatch[5] || (level <= 2 ? 12 : level <= 4 ? 16 : 20)),
          xpReward: Number(itemMatch[6] || (30 + level * 5))
        });
      }
    }

    specs.push({
      level,
      order: Number(levelMatch[3]),
      rawSkill: levelMatch[4],
      skill: toPrimarySkill(levelMatch[4]),
      topic: 'end-test',
      topicTitle: `HSK ${level} end-of-level can-do test`,
      sourceTitle: levelMatch[5],
      sourceObjective: levelMatch[6],
      estimatedMinutes: Number(levelMatch[7] || 25),
      xpReward: Number(levelMatch[8] || 60)
    });
  }

  return specs.sort((a, b) => a.level - b.level || a.order - b.order || a.topic.localeCompare(b.topic));
};

const entriesFor = (level, topic) => {
  const vocab = [];
  for (let current = 1; current <= level; current += 1) {
    vocab.push(...(LEVEL_VOCAB[current] || []));
  }
  vocab.push(...(TOPIC_VOCAB[topic] || []));

  const seen = new Set();
  return vocab.filter(([word]) => {
    if (seen.has(word)) return false;
    seen.add(word);
    return !/^[a-z]/i.test(word);
  });
};

const selectVocab = (level, topic, seed) => {
  const all = entriesFor(level, topic);
  const offset = seed % Math.max(1, all.length - 4);
  return all.slice(offset, offset + 5).map(([simplified, pinyin, english, vi], index) => ({
    word_id: `hsk${level}_${slugify(pinyin || simplified)}_${index + 1}`,
    simplified,
    pinyin,
    english,
    vi,
    is_new: index < 3
  }));
};

const lessonIdFor = ({ level, order, skill, topic }) =>
  `hsk${level}-l${String(order).padStart(2, '0')}-${skill}-${topic}`;

const titleZhFor = (spec) => {
  const topic = TOPIC_ZH[spec.topic] || spec.topicTitle;
  if (spec.level <= 2) {
    return topic;
  }
  return spec.topic === 'end-test'
    ? `HSK${spec.level}阶段复习`
    : `${topic}${SKILL_ZH[spec.skill]}`;
};

const titleEnFor = (spec) =>
  spec.topic === 'end-test'
    ? `HSK ${spec.level} end-of-level review`
    : spec.sourceTitle;

const titleViFor = (spec) =>
  spec.topic === 'end-test'
    ? `Ôn tập cuối HSK ${spec.level}`
    : `${TOPIC_VI[spec.topic] || spec.topicTitle} - ${SKILL_VI[spec.skill]}`;

const objectiveZhFor = (spec) => {
  const topic = TOPIC_ZH[spec.topic] || '主题';
  if (spec.level === 1) return [`认读${topic}词。`];
  if (spec.level === 2) return [`理解${topic}信息。`];
  if (spec.level === 3) return [`理解${topic}的内容。`];
  if (spec.level === 4) return [`分析${topic}的观点。`];
  if (spec.level === 5) return [`辨认${topic}中的态度和隐含信息。`, `整合材料并表达有层次的看法。`];
  return [`综合${topic}中的多重信息。`, `精准说明立场、假设和细微差别。`];
};

const objectiveViFor = (spec) => {
  const topic = TOPIC_VI[spec.topic] || spec.topicTitle;
  if (spec.level === 1) return [`Nhận biết từ về ${topic}.`];
  if (spec.level === 2) return [`Hiểu thông tin về ${topic}.`];
  if (spec.level === 3) return [`Hiểu nội dung về ${topic}.`];
  if (spec.level === 4) return [`Phân tích quan điểm về ${topic}.`];
  if (spec.level === 5) return [`Nhận ra thái độ và thông tin hàm ẩn trong chủ đề ${topic}.`, 'Tổng hợp tài liệu và trình bày quan điểm có tầng bậc.'];
  return [`Tổng hợp nhiều lớp thông tin trong chủ đề ${topic}.`, 'Trình bày chính xác lập trường, giả định và khác biệt tinh vi.'];
};

const modulePhaseFor = (spec) => {
  const text = CORE_TEXT_BY_LEVEL[spec.level];
  const base = {
    content_zh: text,
    content_pinyin: '',
    content_en: CORE_EN_BY_LEVEL[spec.level],
    content_vi: CORE_VI_BY_LEVEL[spec.level]
  };

  if (spec.skill === 'listening') {
    return {
      type: 'dialogue_listen',
      scenario: titleZhFor(spec),
      dialogue: [
        { speaker: 'A', zh: text.slice(0, Math.ceil(text.length / 2)), pinyin: '', en: CORE_EN_BY_LEVEL[spec.level].split('.').slice(0, 1).join('.'), vi: CORE_VI_BY_LEVEL[spec.level].split('.').slice(0, 1).join('.') },
        { speaker: 'B', zh: text.slice(Math.ceil(text.length / 2)), pinyin: '', en: CORE_EN_BY_LEVEL[spec.level].split('.').slice(1).join('.').trim(), vi: CORE_VI_BY_LEVEL[spec.level].split('.').slice(1).join('.').trim() }
      ]
    };
  }

  if (spec.skill === 'speaking') {
    return {
      type: 'speaking_model',
      model_dialogue_zh: text,
      model_dialogue_pinyin: '',
      model_dialogue_en: CORE_EN_BY_LEVEL[spec.level],
      model_dialogue_vi: CORE_VI_BY_LEVEL[spec.level]
    };
  }

  if (spec.skill === 'writing') {
    return {
      type: 'writing_model',
      ...base,
      writing_task_vi: `Viết một đoạn ngắn về ${TOPIC_VI[spec.topic] || spec.topicTitle}.`
    };
  }

  return {
    type: spec.skill === 'mixed' ? 'integrated_task' : 'reading_passage',
    ...base
  };
};

const grammarFor = (spec) => {
  const grammar = GRAMMAR_BY_LEVEL[spec.level];
  if (spec.level === 1) {
    return [{
      pattern: '我是...',
      explanation: '介绍自己。',
      explanation_vi: 'Dùng để giới thiệu bản thân.',
      hsk_level: spec.level,
      cefr_level: CEFR_BY_HSK.get(spec.level),
      examples: [{
        zh: '我是学生。',
        simplified: '我是学生。',
        pinyin: 'Wǒ shì xué sheng.',
        en: 'I am a student.',
        english: 'I am a student.',
        vi: 'Tôi là học sinh.'
      }]
    }];
  }

  if (spec.level === 2) {
    return [{
      pattern: '在+地点',
      explanation: '说明地点。',
      explanation_vi: 'Dùng để nêu địa điểm.',
      hsk_level: spec.level,
      cefr_level: CEFR_BY_HSK.get(spec.level),
      examples: [{
        zh: '我在学校。',
        simplified: '我在学校。',
        pinyin: 'Wǒ zài xué xiào.',
        en: 'I am at school.',
        english: 'I am at school.',
        vi: 'Tôi ở trường.'
      }]
    }];
  }

  return [{
    pattern: grammar.pattern,
    explanation: grammar.zh,
    explanation_vi: grammar.vi,
    hsk_level: spec.level,
    cefr_level: CEFR_BY_HSK.get(spec.level),
    examples: [{
      zh: grammar.example,
      simplified: grammar.example,
      pinyin: grammar.pinyin,
      en: grammar.en,
      english: grammar.en,
      vi: grammar.exampleVi
    }]
  }];
};

const exercisesFor = (spec, vocab) => {
  const [first, second, third] = vocab;
  const topic = TOPIC_ZH[spec.topic] || '内容';
  const skill = spec.skill;
  const bloom = spec.level <= 2 ? 'understand' : spec.level <= 4 ? 'analyze' : 'evaluate';
  const prompt = spec.level <= 2
    ? `选“${first.simplified}”。`
    : `这段内容主要说明什么？`;
  const options = spec.level <= 2
    ? [first.simplified, second.simplified, third.simplified]
    : [`说明${topic}的主要信息。`, `只介绍一个数字。`, `只列出三个生词。`];
  const answer = options[0];

  const firstExercise = {
    id: `${lessonIdFor(spec)}-ex1`,
    kind: 'multiple_choice',
    skill,
    bloom_level: bloom,
    prompt,
    prompt_vi: spec.level <= 2
      ? `Chọn “${first.simplified}”.`
      : 'Nội dung chính của đoạn là gì?',
    options,
    options_vi: spec.level <= 2
      ? [first.vi, second.vi, third.vi]
      : [`Nêu thông tin chính về ${TOPIC_VI[spec.topic] || spec.topicTitle}.`, 'Chỉ giới thiệu một con số.', 'Chỉ liệt kê ba từ mới.'],
    correct_answer: answer,
    correct_answer_vi: spec.level <= 2 ? first.vi : `Nêu thông tin chính về ${TOPIC_VI[spec.topic] || spec.topicTitle}.`,
    acceptable_variants: [answer],
    explanation: spec.level <= 2 ? `答案是${first.simplified}。` : `这句话和${topic}内容相符。`,
    explanation_vi: spec.level <= 2 ? `Đáp án là ${first.vi}.` : `Câu này phù hợp với nội dung ${TOPIC_VI[spec.topic] || spec.topicTitle}.`
  };

  if (spec.level <= 4) {
    return [firstExercise];
  }

  const secondExercise = {
    id: `${lessonIdFor(spec)}-ex2`,
    kind: 'fill_blank',
    skill,
    bloom_level: spec.level <= 3 ? 'apply' : 'create',
    prompt: `补全句子：${second.simplified}和___有关。`,
    prompt_vi: `Hoàn thành câu: ${second.simplified} liên quan đến ___.`,
    options: [topic, third.simplified, '今天'],
    options_vi: [TOPIC_VI[spec.topic] || spec.topicTitle, third.vi, 'hôm nay'],
    correct_answer: topic,
    correct_answer_vi: TOPIC_VI[spec.topic] || spec.topicTitle,
    acceptable_variants: [topic],
    explanation: `“${topic}”概括本课主题。`,
    explanation_vi: `“${topic}” khái quát chủ đề bài học.`
  };

  return [firstExercise, secondExercise];
};

const makeLesson = (spec) => {
  const cefrLevel = CEFR_BY_HSK.get(spec.level);
  const vocab = selectVocab(spec.level, spec.topic, spec.order + spec.topic.length + spec.level)
    .slice(0, spec.level <= 2 ? 3 : spec.level <= 4 ? 4 : 5);
  const lessonId = lessonIdFor(spec);

  return {
    lesson_id: lessonId,
    metadata: {
      title_zh: titleZhFor(spec),
      title_en: titleEnFor(spec),
      title_vi: titleViFor(spec),
      hsk_level: spec.level,
      cefr_level: cefrLevel,
      cefr_activities: CEFR_ACTIVITIES_BY_SKILL[spec.skill],
      primary_skill: spec.skill,
      secondary_skills: spec.skill === 'reading' ? ['writing'] : spec.skill === 'listening' ? ['speaking'] : [],
      topic: spec.topic,
      estimated_minutes: spec.estimatedMinutes,
      xp_reward: spec.xpReward,
      tags: [`hsk${spec.level}`, cefrLevel.toLowerCase(), spec.topic, spec.skill]
    },
    learning_objectives: objectiveZhFor(spec),
    learning_objectives_vi: objectiveViFor(spec),
    vocabulary_focus: vocab.map(({ vi, ...item }) => item),
    grammar_focus: grammarFor(spec),
    warm_up: {
      type: 'vocabulary_review',
      items: vocab.slice(0, 3).map((item) => item.simplified)
    },
    core_modules: [{
      module_type: MODULE_BY_SKILL[spec.skill],
      phases: [modulePhaseFor(spec)]
    }],
    practice: {
      exercises: exercisesFor(spec, vocab)
    },
    review: {
      key_takeaways: spec.level <= 4
        ? [`记住${TOPIC_ZH[spec.topic] || '主题'}词。`]
        : [
          `本课练习${TOPIC_ZH[spec.topic] || '主题'}表达。`,
          `回答时先看主题，再看关键词。`
        ],
      key_takeaways_vi: [
        ...(spec.level <= 4
          ? [`Ghi nhớ từ về ${TOPIC_VI[spec.topic] || spec.topicTitle}.`]
          : [
            `Bài này luyện cách diễn đạt về ${TOPIC_VI[spec.topic] || spec.topicTitle}.`,
            'Khi trả lời, hãy nhìn chủ đề trước rồi nhìn từ khóa.'
          ])
      ],
      srs_inject_word_ids: vocab.slice(0, 3).map((item) => item.word_id)
    }
  };
};

const isGeneratedJson = (name) =>
  name.endsWith('.json') &&
  !name.endsWith('.release.json') &&
  !name.endsWith('.review.json') &&
  !name.endsWith('.validation.json');

const cleanGeneratedDir = async () => {
  await fs.mkdir(generatedDir, { recursive: true });
  const files = await fs.readdir(generatedDir);
  await Promise.all(files.filter(isGeneratedJson).map((file) => fs.unlink(path.join(generatedDir, file))));
};

const writeJson = (file, value) =>
  fs.writeFile(path.join(generatedDir, file), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const run = async () => {
  const specs = await parseCurriculum();
  const lessons = specs.map(makeLesson);
  const validator = new ContentValidator({ skipDatabaseChecks: true });
  const validationResults = [];

  await cleanGeneratedDir();

  for (const lesson of lessons) {
    await writeJson(`${lesson.lesson_id}.json`, lesson);
    const validation = await validator.validateLesson(lesson, lesson.metadata.hsk_level);
    validationResults.push({
      lesson_id: lesson.lesson_id,
      ok: validation.ok,
      summary: validation.summary,
      errors: validation.errors,
      warnings: validation.warnings
    });
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    schema: '../schemas/lesson-template.schema.json',
    count: lessons.length,
    lessons: lessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      file: `${lesson.lesson_id}.json`,
      hsk_level: lesson.metadata.hsk_level,
      cefr_level: lesson.metadata.cefr_level,
      cefr_activities: lesson.metadata.cefr_activities,
      primary_skill: lesson.metadata.primary_skill,
      topic: lesson.metadata.topic,
      title_zh: lesson.metadata.title_zh,
      title_en: lesson.metadata.title_en,
      title_vi: lesson.metadata.title_vi
    }))
  };

  const validationReport = {
    generated_at: new Date().toISOString(),
    count: validationResults.length,
    ok: validationResults.every((result) => result.ok),
    results: validationResults
  };

  await writeJson('manifest.json', manifest);
  await writeJson('validation-report.json', validationReport);

  console.log(JSON.stringify({
    ok: validationReport.ok,
    generated: lessons.length,
    output: path.relative(repoRoot, generatedDir),
    errors: validationResults.flatMap((result) => result.errors).length,
    warnings: validationResults.flatMap((result) => result.warnings).length
  }, null, 2));

  if (!validationReport.ok) {
    process.exitCode = 1;
  }
};

await run();
