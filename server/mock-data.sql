BEGIN;

INSERT INTO content_releases (id, version, description, is_active, published_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '2026.06.1',
  'Initial production seed for Study Chinese',
  true,
  now()
)
ON CONFLICT (version)
DO UPDATE SET is_active = EXCLUDED.is_active,
              description = EXCLUDED.description,
              published_at = EXCLUDED.published_at;

INSERT INTO words (
  id, release_id, simplified, traditional, pinyin, pinyin_plain, tones,
  english, part_of_speech, hsk_level, category, search_text
)
VALUES
('wd_hello', '00000000-0000-0000-0000-000000000001', '你好', '你好', 'nǐ hǎo', 'ni hao', ARRAY[3,3]::smallint[], 'hello', 'phrase', 1, 'Greetings', '你好 你好 ni hao hello Greetings'),
('wd_goodbye', '00000000-0000-0000-0000-000000000001', '再见', '再見', 'zài jiàn', 'zai jian', ARRAY[4,4]::smallint[], 'goodbye', 'phrase', 1, 'Greetings', '再见 再見 zai jian goodbye Greetings'),
('wd_thankyou', '00000000-0000-0000-0000-000000000001', '谢谢', '謝謝', 'xiè xiè', 'xie xie', ARRAY[4,4]::smallint[], 'thank you', 'phrase', 1, 'Greetings', '谢谢 謝謝 xie xie thank you Greetings'),
('wd_youre_welcome', '00000000-0000-0000-0000-000000000001', '不客气', '不客氣', 'bú kè qì', 'bu ke qi', ARRAY[2,4,4]::smallint[], 'you''re welcome', 'phrase', 1, 'Greetings', '不客气 不客氣 bu ke qi youre welcome Greetings'),
('wd_sorry', '00000000-0000-0000-0000-000000000001', '对不起', '對不起', 'duì bù qǐ', 'dui bu qi', ARRAY[4,4,3]::smallint[], 'sorry', 'phrase', 1, 'Greetings', '对不起 對不起 dui bu qi sorry Greetings'),
('wd_no_problem', '00000000-0000-0000-0000-000000000001', '没关系', '沒關係', 'méi guān xì', 'mei guan xi', ARRAY[2,1,5]::smallint[], 'it is ok / no problem', 'phrase', 1, 'Greetings', '没关系 沒關係 mei guan xi no problem Greetings'),
('wd_i', '00000000-0000-0000-0000-000000000001', '我', '我', 'wǒ', 'wo', ARRAY[3]::smallint[], 'I / me', 'pronoun', 1, 'General', '我 我 wo I me General'),
('wd_you', '00000000-0000-0000-0000-000000000001', '你', '你', 'nǐ', 'ni', ARRAY[3]::smallint[], 'you', 'pronoun', 1, 'General', '你 你 ni you General'),
('wd_you_formal', '00000000-0000-0000-0000-000000000001', '您', '您', 'nín', 'nin', ARRAY[2]::smallint[], 'you formal', 'pronoun', 1, 'General', '您 您 nin you formal General'),
('wd_one', '00000000-0000-0000-0000-000000000001', '一', '一', 'yī', 'yi', ARRAY[1]::smallint[], 'one', 'numeral', 1, 'Numbers', '一 一 yi one Numbers'),
('wd_two', '00000000-0000-0000-0000-000000000001', '二', '二', 'èr', 'er', ARRAY[4]::smallint[], 'two', 'numeral', 1, 'Numbers', '二 二 er two Numbers'),
('wd_three', '00000000-0000-0000-0000-000000000001', '三', '三', 'sān', 'san', ARRAY[1]::smallint[], 'three', 'numeral', 1, 'Numbers', '三 三 san three Numbers'),
('wd_four', '00000000-0000-0000-0000-000000000001', '四', '四', 'sì', 'si', ARRAY[4]::smallint[], 'four', 'numeral', 1, 'Numbers', '四 四 si four Numbers'),
('wd_water', '00000000-0000-0000-0000-000000000001', '水', '水', 'shuǐ', 'shui', ARRAY[3]::smallint[], 'water', 'noun', 1, 'Food', '水 水 shui water Food'),
('wd_tea', '00000000-0000-0000-0000-000000000001', '茶', '茶', 'chá', 'cha', ARRAY[2]::smallint[], 'tea', 'noun', 1, 'Food', '茶 茶 cha tea Food'),
('wd_coffee', '00000000-0000-0000-0000-000000000001', '咖啡', '咖啡', 'kā fēi', 'ka fei', ARRAY[1,1]::smallint[], 'coffee', 'noun', 1, 'Food', '咖啡 咖啡 ka fei coffee Food'),
('wd_drink', '00000000-0000-0000-0000-000000000001', '喝', '喝', 'hē', 'he', ARRAY[1]::smallint[], 'to drink', 'verb', 1, 'Food', '喝 喝 he drink Food'),
('wd_eat', '00000000-0000-0000-0000-000000000001', '吃', '吃', 'chī', 'chi', ARRAY[1]::smallint[], 'to eat', 'verb', 1, 'Food', '吃 吃 chi eat Food'),
('wd_china', '00000000-0000-0000-0000-000000000001', '中国', '中國', 'zhōng guó', 'zhong guo', ARRAY[1,2]::smallint[], 'China', 'noun', 1, 'General', '中国 中國 zhong guo China General'),
('wd_station', '00000000-0000-0000-0000-000000000001', '站', '站', 'zhàn', 'zhan', ARRAY[4]::smallint[], 'station / stop', 'noun', 2, 'Transportation', '站 站 zhan station stop Transportation'),
('wd_name', '00000000-0000-0000-0000-000000000001', '名字', '名字', 'míng zi', 'ming zi', ARRAY[2,5]::smallint[], 'name', 'noun', 1, 'General', '名字 名字 ming zi name General'),
('wd_called', '00000000-0000-0000-0000-000000000001', '叫', '叫', 'jiào', 'jiao', ARRAY[4]::smallint[], 'to be called', 'verb', 1, 'General', '叫 叫 jiao called General'),
('wd_chinese', '00000000-0000-0000-0000-000000000001', '中文', '中文', 'zhōng wén', 'zhong wen', ARRAY[1,2]::smallint[], 'Chinese language', 'noun', 1, 'General', '中文 中文 zhong wen Chinese language General'),
('wd_five', '00000000-0000-0000-0000-000000000001', '五', '五', 'wǔ', 'wu', ARRAY[3]::smallint[], 'five', 'numeral', 1, 'Numbers', '五 五 wu five Numbers'),
('wd_six', '00000000-0000-0000-0000-000000000001', '六', '六', 'liù', 'liu', ARRAY[4]::smallint[], 'six', 'numeral', 1, 'Numbers', '六 六 liu six Numbers'),
('wd_seven', '00000000-0000-0000-0000-000000000001', '七', '七', 'qī', 'qi', ARRAY[1]::smallint[], 'seven', 'numeral', 1, 'Numbers', '七 七 qi seven Numbers'),
('wd_eight', '00000000-0000-0000-0000-000000000001', '八', '八', 'bā', 'ba', ARRAY[1]::smallint[], 'eight', 'numeral', 1, 'Numbers', '八 八 ba eight Numbers'),
('wd_nine', '00000000-0000-0000-0000-000000000001', '九', '九', 'jiǔ', 'jiu', ARRAY[3]::smallint[], 'nine', 'numeral', 1, 'Numbers', '九 九 jiu nine Numbers'),
('wd_ten', '00000000-0000-0000-0000-000000000001', '十', '十', 'shí', 'shi', ARRAY[2]::smallint[], 'ten', 'numeral', 1, 'Numbers', '十 十 shi ten Numbers'),
('wd_dad', '00000000-0000-0000-0000-000000000001', '爸爸', '爸爸', 'bà ba', 'ba ba', ARRAY[4,5]::smallint[], 'dad', 'noun', 1, 'Family', '爸爸 爸爸 ba ba dad Family'),
('wd_mom', '00000000-0000-0000-0000-000000000001', '妈妈', '媽媽', 'mā ma', 'ma ma', ARRAY[1,5]::smallint[], 'mom', 'noun', 1, 'Family', '妈妈 媽媽 ma ma mom Family'),
('wd_older_brother', '00000000-0000-0000-0000-000000000001', '哥哥', '哥哥', 'gē ge', 'ge ge', ARRAY[1,5]::smallint[], 'older brother', 'noun', 1, 'Family', '哥哥 哥哥 ge ge older brother Family'),
('wd_older_sister', '00000000-0000-0000-0000-000000000001', '姐姐', '姐姐', 'jiě jie', 'jie jie', ARRAY[3,5]::smallint[], 'older sister', 'noun', 1, 'Family', '姐姐 姐姐 jie jie older sister Family'),
('wd_younger_brother', '00000000-0000-0000-0000-000000000001', '弟弟', '弟弟', 'dì di', 'di di', ARRAY[4,5]::smallint[], 'younger brother', 'noun', 1, 'Family', '弟弟 弟弟 di di younger brother Family'),
('wd_younger_sister', '00000000-0000-0000-0000-000000000001', '妹妹', '妹妹', 'mèi mei', 'mei mei', ARRAY[4,5]::smallint[], 'younger sister', 'noun', 1, 'Family', '妹妹 妹妹 mei mei younger sister Family'),
('wd_friend', '00000000-0000-0000-0000-000000000001', '朋友', '朋友', 'péng yǒu', 'peng you', ARRAY[2,3]::smallint[], 'friend', 'noun', 1, 'Family', '朋友 朋友 peng you friend Family'),
('wd_yes', '00000000-0000-0000-0000-000000000001', '是', '是', 'shì', 'shi', ARRAY[4]::smallint[], 'yes / to be', 'verb', 1, 'General', '是 是 shi yes to be General'),
('wd_no', '00000000-0000-0000-0000-000000000001', '不', '不', 'bù', 'bu', ARRAY[4]::smallint[], 'no / not', 'adverb', 1, 'General', '不 不 bu no not General'),
('wd_student', '00000000-0000-0000-0000-000000000001', '学生', '學生', 'xué shēng', 'xue sheng', ARRAY[2,1]::smallint[], 'student', 'noun', 1, 'School', '学生 學生 xue sheng student School'),
('wd_teacher', '00000000-0000-0000-0000-000000000001', '老师', '老師', 'lǎo shī', 'lao shi', ARRAY[3,1]::smallint[], 'teacher', 'noun', 1, 'School', '老师 老師 lao shi teacher School'),
('wd_doctor', '00000000-0000-0000-0000-000000000001', '医生', '醫生', 'yī shēng', 'yi sheng', ARRAY[1,1]::smallint[], 'doctor', 'noun', 1, 'Health', '医生 醫生 yi sheng doctor Health'),
('wd_rice', '00000000-0000-0000-0000-000000000001', '米饭', '米飯', 'mǐ fàn', 'mi fan', ARRAY[3,4]::smallint[], 'rice', 'noun', 1, 'Food', '米饭 米飯 mi fan rice Food'),
('wd_noodles', '00000000-0000-0000-0000-000000000001', '面条', '麵條', 'miàn tiáo', 'mian tiao', ARRAY[4,2]::smallint[], 'noodles', 'noun', 1, 'Food', '面条 麵條 mian tiao noodles Food'),
('wd_apple', '00000000-0000-0000-0000-000000000001', '苹果', '蘋果', 'píng guǒ', 'ping guo', ARRAY[2,3]::smallint[], 'apple', 'noun', 1, 'Food', '苹果 蘋果 ping guo apple Food'),
('wd_how_much', '00000000-0000-0000-0000-000000000001', '多少', '多少', 'duō shǎo', 'duo shao', ARRAY[1,3]::smallint[], 'how much / how many', 'pronoun', 1, 'Shopping', '多少 多少 duo shao how much many Shopping'),
('wd_money', '00000000-0000-0000-0000-000000000001', '钱', '錢', 'qián', 'qian', ARRAY[2]::smallint[], 'money', 'noun', 1, 'Shopping', '钱 錢 qian money Shopping'),
('wd_yuan', '00000000-0000-0000-0000-000000000001', '元', '元', 'yuán', 'yuan', ARRAY[2]::smallint[], 'yuan', 'measure', 1, 'Shopping', '元 元 yuan Shopping'),
('wd_kuai', '00000000-0000-0000-0000-000000000001', '块', '塊', 'kuài', 'kuai', ARRAY[4]::smallint[], 'kuai / yuan', 'measure', 1, 'Shopping', '块 塊 kuai yuan Shopping'),
('wd_buy', '00000000-0000-0000-0000-000000000001', '买', '買', 'mǎi', 'mai', ARRAY[3]::smallint[], 'to buy', 'verb', 1, 'Shopping', '买 買 mai buy Shopping'),
('wd_sell', '00000000-0000-0000-0000-000000000001', '卖', '賣', 'mài', 'mai', ARRAY[4]::smallint[], 'to sell', 'verb', 2, 'Shopping', '卖 賣 mai sell Shopping'),
('wd_today', '00000000-0000-0000-0000-000000000001', '今天', '今天', 'jīn tiān', 'jin tian', ARRAY[1,1]::smallint[], 'today', 'noun', 1, 'Time', '今天 今天 jin tian today Time'),
('wd_yesterday', '00000000-0000-0000-0000-000000000001', '昨天', '昨天', 'zuó tiān', 'zuo tian', ARRAY[2,1]::smallint[], 'yesterday', 'noun', 1, 'Time', '昨天 昨天 zuo tian yesterday Time'),
('wd_tomorrow', '00000000-0000-0000-0000-000000000001', '明天', '明天', 'míng tiān', 'ming tian', ARRAY[2,1]::smallint[], 'tomorrow', 'noun', 1, 'Time', '明天 明天 ming tian tomorrow Time'),
('wd_morning', '00000000-0000-0000-0000-000000000001', '早上', '早上', 'zǎo shang', 'zao shang', ARRAY[3,5]::smallint[], 'morning', 'noun', 1, 'Time', '早上 早上 zao shang morning Time'),
('wd_afternoon', '00000000-0000-0000-0000-000000000001', '下午', '下午', 'xià wǔ', 'xia wu', ARRAY[4,3]::smallint[], 'afternoon', 'noun', 1, 'Time', '下午 下午 xia wu afternoon Time'),
('wd_evening', '00000000-0000-0000-0000-000000000001', '晚上', '晚上', 'wǎn shang', 'wan shang', ARRAY[3,5]::smallint[], 'evening', 'noun', 1, 'Time', '晚上 晚上 wan shang evening Time'),
('wd_now', '00000000-0000-0000-0000-000000000001', '现在', '現在', 'xiàn zài', 'xian zai', ARRAY[4,4]::smallint[], 'now', 'noun', 1, 'Time', '现在 現在 xian zai now Time'),
('wd_week', '00000000-0000-0000-0000-000000000001', '星期', '星期', 'xīng qī', 'xing qi', ARRAY[1,1]::smallint[], 'week', 'noun', 1, 'Time', '星期 星期 xing qi week Time'),
('wd_go', '00000000-0000-0000-0000-000000000001', '去', '去', 'qù', 'qu', ARRAY[4]::smallint[], 'to go', 'verb', 1, 'Travel', '去 去 qu go Travel'),
('wd_school', '00000000-0000-0000-0000-000000000001', '学校', '學校', 'xué xiào', 'xue xiao', ARRAY[2,4]::smallint[], 'school', 'noun', 1, 'School', '学校 學校 xue xiao school School'),
('wd_bus', '00000000-0000-0000-0000-000000000001', '公共汽车', '公共汽車', 'gōng gòng qì chē', 'gong gong qi che', ARRAY[1,4,4,1]::smallint[], 'bus', 'noun', 1, 'Transportation', '公共汽车 公共汽車 gong gong qi che bus Transportation'),
('wd_taxi', '00000000-0000-0000-0000-000000000001', '出租车', '出租車', 'chū zū chē', 'chu zu che', ARRAY[1,1,1]::smallint[], 'taxi', 'noun', 1, 'Transportation', '出租车 出租車 chu zu che taxi Transportation'),
('wd_train', '00000000-0000-0000-0000-000000000001', '火车', '火車', 'huǒ chē', 'huo che', ARRAY[3,1]::smallint[], 'train', 'noun', 1, 'Transportation', '火车 火車 huo che train Transportation'),
('wd_airport', '00000000-0000-0000-0000-000000000001', '机场', '機場', 'jī chǎng', 'ji chang', ARRAY[1,3]::smallint[], 'airport', 'noun', 2, 'Transportation', '机场 機場 ji chang airport Transportation'),
('wd_subway', '00000000-0000-0000-0000-000000000001', '地铁', '地鐵', 'dì tiě', 'di tie', ARRAY[4,3]::smallint[], 'subway', 'noun', 2, 'Transportation', '地铁 地鐵 di tie subway Transportation'),
('wd_left_turn', '00000000-0000-0000-0000-000000000001', '左转', '左轉', 'zuǒ zhuǎn', 'zuo zhuan', ARRAY[3,3]::smallint[], 'turn left', 'phrase', 2, 'Directions', '左转 左轉 zuo zhuan turn left Directions'),
('wd_right_turn', '00000000-0000-0000-0000-000000000001', '右转', '右轉', 'yòu zhuǎn', 'you zhuan', ARRAY[4,3]::smallint[], 'turn right', 'phrase', 2, 'Directions', '右转 右轉 you zhuan turn right Directions'),
('wd_straight', '00000000-0000-0000-0000-000000000001', '直走', '直走', 'zhí zǒu', 'zhi zou', ARRAY[2,3]::smallint[], 'go straight', 'phrase', 2, 'Directions', '直走 直走 zhi zou go straight Directions'),
('wd_delicious', '00000000-0000-0000-0000-000000000001', '好吃', '好吃', 'hǎo chī', 'hao chi', ARRAY[3,1]::smallint[], 'delicious', 'adjective', 1, 'Food', '好吃 好吃 hao chi delicious Food'),
('wd_spicy', '00000000-0000-0000-0000-000000000001', '辣', '辣', 'là', 'la', ARRAY[4]::smallint[], 'spicy', 'adjective', 2, 'Food', '辣 辣 la spicy Food'),
('wd_beef', '00000000-0000-0000-0000-000000000001', '牛肉', '牛肉', 'niú ròu', 'niu rou', ARRAY[2,4]::smallint[], 'beef', 'noun', 1, 'Food', '牛肉 牛肉 niu rou beef Food'),
('wd_chicken', '00000000-0000-0000-0000-000000000001', '鸡', '雞', 'jī', 'ji', ARRAY[1]::smallint[], 'chicken', 'noun', 1, 'Food', '鸡 雞 ji chicken Food'),
('wd_suggest', '00000000-0000-0000-0000-000000000001', '建议', '建議', 'jiàn yì', 'jian yi', ARRAY[4,4]::smallint[], 'to suggest / suggestion', 'verb', 3, 'Business', '建议 建議 jian yi suggest suggestion Business'),
('wd_decide', '00000000-0000-0000-0000-000000000001', '决定', '決定', 'jué dìng', 'jue ding', ARRAY[2,4]::smallint[], 'to decide', 'verb', 3, 'General', '决定 決定 jue ding decide General'),
('wd_help', '00000000-0000-0000-0000-000000000001', '帮助', '幫助', 'bāng zhù', 'bang zhu', ARRAY[1,4]::smallint[], 'to help', 'verb', 3, 'General', '帮助 幫助 bang zhu help General'),
('wd_big', '00000000-0000-0000-0000-000000000001', '大', '大', 'dà', 'da', ARRAY[4]::smallint[], 'big', 'adjective', 1, 'General', '大 大 da big General'),
('wd_small', '00000000-0000-0000-0000-000000000001', '小', '小', 'xiǎo', 'xiao', ARRAY[3]::smallint[], 'small', 'adjective', 1, 'General', '小 小 xiao small General'),
('wd_good', '00000000-0000-0000-0000-000000000001', '好', '好', 'hǎo', 'hao', ARRAY[3]::smallint[], 'good', 'adjective', 1, 'General', '好 好 hao good General'),
('wd_expensive', '00000000-0000-0000-0000-000000000001', '贵', '貴', 'guì', 'gui', ARRAY[4]::smallint[], 'expensive', 'adjective', 2, 'Shopping', '贵 貴 gui expensive Shopping'),
('wd_meeting', '00000000-0000-0000-0000-000000000001', '会议', '會議', 'huì yì', 'hui yi', ARRAY[4,4]::smallint[], 'meeting', 'noun', 3, 'Business', '会议 會議 hui yi meeting Business'),
('wd_schedule', '00000000-0000-0000-0000-000000000001', '日程', '日程', 'rì chéng', 'ri cheng', ARRAY[4,2]::smallint[], 'schedule', 'noun', 3, 'Business', '日程 日程 ri cheng schedule Business'),
('wd_contract', '00000000-0000-0000-0000-000000000001', '合同', '合同', 'hé tóng', 'he tong', ARRAY[2,2]::smallint[], 'contract', 'noun', 3, 'Business', '合同 合同 he tong contract Business'),
('wd_opportunity', '00000000-0000-0000-0000-000000000001', '机会', '機會', 'jī huì', 'ji hui', ARRAY[1,4]::smallint[], 'opportunity', 'noun', 3, 'Business', '机会 機會 ji hui opportunity Business'),
('wd_experience', '00000000-0000-0000-0000-000000000001', '经验', '經驗', 'jīng yàn', 'jing yan', ARRAY[1,4]::smallint[], 'experience', 'noun', 3, 'Business', '经验 經驗 jing yan experience Business'),
('wd_practice', '00000000-0000-0000-0000-000000000001', '练习', '練習', 'liàn xí', 'lian xi', ARRAY[4,2]::smallint[], 'to practice / exercise', 'verb', 3, 'School', '练习 練習 lian xi practice exercise School'),
('wd_exam', '00000000-0000-0000-0000-000000000001', '考试', '考試', 'kǎo shì', 'kao shi', ARRAY[3,4]::smallint[], 'exam', 'noun', 3, 'School', '考试 考試 kao shi exam School'),
('wd_homework', '00000000-0000-0000-0000-000000000001', '作业', '作業', 'zuò yè', 'zuo ye', ARRAY[4,4]::smallint[], 'homework', 'noun', 3, 'School', '作业 作業 zuo ye homework School'),
('wd_library', '00000000-0000-0000-0000-000000000001', '图书馆', '圖書館', 'tú shū guǎn', 'tu shu guan', ARRAY[2,1,3]::smallint[], 'library', 'noun', 3, 'School', '图书馆 圖書館 tu shu guan library School'),
('wd_difficult', '00000000-0000-0000-0000-000000000001', '难', '難', 'nán', 'nan', ARRAY[2]::smallint[], 'difficult', 'adjective', 3, 'General', '难 難 nan difficult General'),
('wd_easy', '00000000-0000-0000-0000-000000000001', '容易', '容易', 'róng yì', 'rong yi', ARRAY[2,4]::smallint[], 'easy', 'adjective', 3, 'General', '容易 容易 rong yi easy General'),
('wd_important', '00000000-0000-0000-0000-000000000001', '重要', '重要', 'zhòng yào', 'zhong yao', ARRAY[4,4]::smallint[], 'important', 'adjective', 3, 'General', '重要 重要 zhong yao important General'),
('wd_culture', '00000000-0000-0000-0000-000000000001', '文化', '文化', 'wén huà', 'wen hua', ARRAY[2,4]::smallint[], 'culture', 'noun', 3, 'General', '文化 文化 wen hua culture General'),
('wd_history', '00000000-0000-0000-0000-000000000001', '历史', '歷史', 'lì shǐ', 'li shi', ARRAY[4,3]::smallint[], 'history', 'noun', 3, 'School', '历史 歷史 li shi history School'),
('wd_environment', '00000000-0000-0000-0000-000000000001', '环境', '環境', 'huán jìng', 'huan jing', ARRAY[2,4]::smallint[], 'environment', 'noun', 3, 'Nature', '环境 環境 huan jing environment Nature'),
('wd_future', '00000000-0000-0000-0000-000000000001', '未来', '未來', 'wèi lái', 'wei lai', ARRAY[4,2]::smallint[], 'future', 'noun', 3, 'Time', '未来 未來 wei lai future Time'),
('wd_memory', '00000000-0000-0000-0000-000000000001', '记忆', '記憶', 'jì yì', 'ji yi', ARRAY[4,4]::smallint[], 'memory', 'noun', 3, 'General', '记忆 記憶 ji yi memory General'),
('wd_opinion', '00000000-0000-0000-0000-000000000001', '意见', '意見', 'yì jiàn', 'yi jian', ARRAY[4,4]::smallint[], 'opinion', 'noun', 3, 'General', '意见 意見 yi jian opinion General'),
('wd_remember', '00000000-0000-0000-0000-000000000001', '记住', '記住', 'jì zhù', 'ji zhu', ARRAY[4,4]::smallint[], 'to remember', 'verb', 3, 'General', '记住 記住 ji zhu remember General'),
('wd_forget', '00000000-0000-0000-0000-000000000001', '忘记', '忘記', 'wàng jì', 'wang ji', ARRAY[4,4]::smallint[], 'to forget', 'verb', 3, 'General', '忘记 忘記 wang ji forget General'),
('wd_interesting', '00000000-0000-0000-0000-000000000001', '有意思', '有意思', 'yǒu yì si', 'you yi si', ARRAY[3,4,5]::smallint[], 'interesting', 'adjective', 3, 'Emotions', '有意思 有意思 you yi si interesting Emotions'),
('wd_boring', '00000000-0000-0000-0000-000000000001', '无聊', '無聊', 'wú liáo', 'wu liao', ARRAY[2,2]::smallint[], 'boring', 'adjective', 3, 'Emotions', '无聊 無聊 wu liao boring Emotions'),
('wd_feel', '00000000-0000-0000-0000-000000000001', '觉得', '覺得', 'jué de', 'jue de', ARRAY[2,5]::smallint[], 'to feel / to think', 'verb', 3, 'General', '觉得 覺得 jue de feel think General')
ON CONFLICT (id)
DO UPDATE SET release_id = EXCLUDED.release_id,
              simplified = EXCLUDED.simplified,
              traditional = EXCLUDED.traditional,
              pinyin = EXCLUDED.pinyin,
              pinyin_plain = EXCLUDED.pinyin_plain,
              tones = EXCLUDED.tones,
              english = EXCLUDED.english,
              part_of_speech = EXCLUDED.part_of_speech,
              hsk_level = EXCLUDED.hsk_level,
              category = EXCLUDED.category,
              search_text = EXCLUDED.search_text,
              is_active = true;

INSERT INTO lessons (
  id, release_id, title, subtitle, hsk_level, order_num, skill,
  estimated_minutes, xp_reward, intro, dialogue
)
VALUES
('l1_1', '00000000-0000-0000-0000-000000000001', 'Pinyin Basics', 'Initials & finals', 1, 1, 'pinyin', 7, 20, 'Pinyin uses Roman letters to spell the sounds of Mandarin. Start with common initials and single finals.', NULL),
('l1_2', '00000000-0000-0000-0000-000000000001', 'The Four Tones', 'High, rising, dip, falling', 1, 2, 'tones', 8, 25, 'Mandarin has four tones plus a neutral tone. Tones change word meaning.', NULL),
('l1_3', '00000000-0000-0000-0000-000000000001', 'Greetings', 'Hello & goodbye', 1, 3, 'vocabulary', 6, 20, 'Basic greetings let you start conversations politely.', $${
  "id": "d1_3",
  "title": "Meeting a friend",
  "scenario": "You run into a friend on the street.",
  "lines": [
    {
      "id": "dl1_3_1",
      "speaker": "A",
      "isUser": true,
      "simplified": "你好！",
      "traditional": "你好！",
      "pinyin": "Nǐ hǎo!",
      "english": "Hello!"
    },
    {
      "id": "dl1_3_2",
      "speaker": "B",
      "isUser": false,
      "simplified": "你好！",
      "traditional": "你好！",
      "pinyin": "Nǐ hǎo!",
      "english": "Hello!"
    },
    {
      "id": "dl1_3_3",
      "speaker": "A",
      "isUser": true,
      "simplified": "再见！",
      "traditional": "再見！",
      "pinyin": "Zàijiàn!",
      "english": "Goodbye!"
    }
  ]
}$$::jsonb),
('l1_4', '00000000-0000-0000-0000-000000000001', 'Numbers 1-10', 'Count in Mandarin', 1, 4, 'vocabulary', 6, 20, 'Learn to count from one to ten and recognize the first number characters.', NULL),
('l1_5', '00000000-0000-0000-0000-000000000001', 'Self Introduction', '我叫...', 1, 5, 'conversation', 8, 30, 'Introduce yourself with 我叫 and ask someone for their name politely.', $${
  "id": "d1_5",
  "title": "Meeting someone new",
  "scenario": "You meet a new classmate.",
  "lines": [
    {"id":"dl1_5_1","speaker":"A","isUser":true,"simplified":"你好！你叫什么名字？","traditional":"你好！你叫什麼名字？","pinyin":"Nǐ hǎo! Nǐ jiào shénme míngzì?","english":"Hi! What is your name?"},
    {"id":"dl1_5_2","speaker":"B","isUser":false,"simplified":"我叫李明。你呢？","traditional":"我叫李明。你呢？","pinyin":"Wǒ jiào Lǐ Míng. Nǐ ne?","english":"My name is Li Ming. And you?"},
    {"id":"dl1_5_3","speaker":"A","isUser":true,"simplified":"我叫安娜。很高兴认识你！","traditional":"我叫安娜。很高興認識你！","pinyin":"Wǒ jiào Ānnà. Hěn gāoxìng rènshí nǐ!","english":"My name is Anna. Nice to meet you!"}
  ]
}$$::jsonb),
('l1_6', '00000000-0000-0000-0000-000000000001', 'Family Words', 'Meet the family', 1, 6, 'vocabulary', 7, 25, 'Learn common family member words and how to say this is my family member.', NULL),
('l1_7', '00000000-0000-0000-0000-000000000001', 'Basic Verb 是', 'To be', 1, 7, 'grammar', 8, 30, 'Use 是 to link a subject with a noun identity, such as student, teacher, or doctor.', NULL),
('l1_8', '00000000-0000-0000-0000-000000000001', 'Food & Drinks', 'Eat and drink', 1, 8, 'vocabulary', 7, 25, 'Order basic food and drinks in Mandarin using 吃, 喝, and common food words.', NULL),
('l1_9', '00000000-0000-0000-0000-000000000001', 'Asking How Much', '多少钱', 1, 9, 'conversation', 8, 30, 'Use 多少钱 to ask prices and practice buying common items.', $${
  "id": "d1_9",
  "title": "At the market",
  "scenario": "Buying fruit at a stall.",
  "lines": [
    {"id":"dl1_9_1","speaker":"You","isUser":true,"simplified":"你好！这个多少钱？","traditional":"你好！這個多少錢？","pinyin":"Nǐ hǎo! Zhège duōshǎo qián?","english":"Hi! How much is this?"},
    {"id":"dl1_9_2","speaker":"Seller","isUser":false,"simplified":"三十块。","traditional":"三十塊。","pinyin":"Sānshí kuài.","english":"Thirty yuan."},
    {"id":"dl1_9_3","speaker":"You","isUser":true,"simplified":"我买两个苹果。","traditional":"我買兩個蘋果。","pinyin":"Wǒ mǎi liǎng ge píngguǒ.","english":"I will buy two apples."}
  ]
}$$::jsonb),
('l1_10', '00000000-0000-0000-0000-000000000001', 'Days & Time', '今天, 明天, 昨天', 1, 10, 'vocabulary', 7, 25, 'Talk about today, yesterday, tomorrow, and simple daily schedules.', NULL),
('l2_1', '00000000-0000-0000-0000-000000000001', 'Transport & Directions', '地铁, 公交', 2, 1, 'vocabulary', 8, 30, 'Get around a Chinese city with transport words and simple direction phrases.', NULL),
('l2_2', '00000000-0000-0000-0000-000000000001', 'Completed Actions with 了', 'Verb + 了', 2, 2, 'grammar', 9, 35, 'Use 了 after a verb to show a completed action or a changed state.', NULL),
('l2_3', '00000000-0000-0000-0000-000000000001', 'At a Restaurant', '点菜', 2, 3, 'conversation', 10, 40, 'Order food at a restaurant and ask for simple preferences like not too spicy.', $${
  "id": "d2_3",
  "title": "Ordering dinner",
  "scenario": "At a noodle shop.",
  "lines": [
    {"id":"dl2_3_1","speaker":"Server","isUser":false,"simplified":"请问您要什么？","traditional":"請問您要什麼？","pinyin":"Qǐngwèn nín yào shénme?","english":"Excuse me, what would you like?"},
    {"id":"dl2_3_2","speaker":"You","isUser":true,"simplified":"我要一碗牛肉面，不要太辣。","traditional":"我要一碗牛肉麵，不要太辣。","pinyin":"Wǒ yào yī wǎn niúròu miàn, búyào tài là.","english":"I want a bowl of beef noodles, not too spicy."},
    {"id":"dl2_3_3","speaker":"Server","isUser":false,"simplified":"好的，还要别的吗？","traditional":"好的，還要別的嗎？","pinyin":"Hǎo de, hái yào biéde ma?","english":"Ok, anything else?"},
    {"id":"dl2_3_4","speaker":"You","isUser":true,"simplified":"一杯茶，谢谢。","traditional":"一杯茶，謝謝。","pinyin":"Yī bēi chá, xièxiè.","english":"A cup of tea, thanks."}
  ]
}$$::jsonb),
('l3_1', '00000000-0000-0000-0000-000000000001', 'Making Suggestions', '建议 patterns', 3, 1, 'grammar', 9, 40, 'Make friendly suggestions and soften plans with 吧.', NULL),
('l3_2', '00000000-0000-0000-0000-000000000001', 'Comparison 比', 'A is bigger than B', 3, 2, 'grammar', 10, 40, 'Use 比 to compare people, places, prices, and daily situations.', NULL),
('l3_3', '00000000-0000-0000-0000-000000000001', 'Business Chinese Basics', 'Meetings & contracts', 3, 3, 'conversation', 12, 50, 'Practice polite business introductions and simple meeting language.', $${
  "id": "d3_3",
  "title": "Business introduction",
  "scenario": "Meeting a business partner.",
  "lines": [
    {"id":"dl3_3_1","speaker":"You","isUser":true,"simplified":"很高兴认识您。","traditional":"很高興認識您。","pinyin":"Hěn gāoxìng rènshí nín.","english":"Nice to meet you."},
    {"id":"dl3_3_2","speaker":"Partner","isUser":false,"simplified":"这是我的名片。","traditional":"這是我的名片。","pinyin":"Zhè shì wǒ de míngpiàn.","english":"Here is my business card."},
    {"id":"dl3_3_3","speaker":"You","isUser":true,"simplified":"我们讨论一下合同好吗？","traditional":"我們討論一下合同好嗎？","pinyin":"Wǒmen tǎolùn yīxià hétóng hǎo ma?","english":"Shall we discuss the contract?"}
  ]
}$$::jsonb),
('l3_4', '00000000-0000-0000-0000-000000000001', 'Study & Exams', '练习, 考试, 作业', 3, 4, 'vocabulary', 10, 40, 'Talk about exam preparation, homework, library study, and what feels difficult or easy.', NULL),
('l3_5', '00000000-0000-0000-0000-000000000001', 'Culture & History', '文化 and 历史', 3, 5, 'vocabulary', 10, 40, 'Discuss culture, history, environment, and future plans in simple HSK3 sentences.', NULL),
('l3_6', '00000000-0000-0000-0000-000000000001', 'Opinions & Memory', '我觉得...', 3, 6, 'conversation', 11, 45, 'Share opinions with 我觉得 and talk about remembering, forgetting, and whether something is interesting.', $${
  "id": "d3_6",
  "title": "After class",
  "scenario": "Talking with a classmate after Chinese class.",
  "lines": [
    {"id":"dl3_6_1","speaker":"Classmate","isUser":false,"simplified":"你觉得今天的课怎么样？","traditional":"你覺得今天的課怎麼樣？","pinyin":"Nǐ juéde jīntiān de kè zěnmeyàng?","english":"What do you think of today class?"},
    {"id":"dl3_6_2","speaker":"You","isUser":true,"simplified":"我觉得很有意思，但是有点难。","traditional":"我覺得很有意思，但是有點難。","pinyin":"Wǒ juéde hěn yǒu yìsi, dànshì yǒudiǎn nán.","english":"I think it is interesting, but a little difficult."},
    {"id":"dl3_6_3","speaker":"Classmate","isUser":false,"simplified":"没关系，我们一起练习吧。","traditional":"沒關係，我們一起練習吧。","pinyin":"Méi guānxi, wǒmen yìqǐ liànxí ba.","english":"No problem, let us practice together."}
  ]
}$$::jsonb)
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              subtitle = EXCLUDED.subtitle,
              hsk_level = EXCLUDED.hsk_level,
              order_num = EXCLUDED.order_num,
              skill = EXCLUDED.skill,
              estimated_minutes = EXCLUDED.estimated_minutes,
              xp_reward = EXCLUDED.xp_reward,
              intro = EXCLUDED.intro,
              dialogue = EXCLUDED.dialogue,
              is_active = true;

INSERT INTO lesson_words (lesson_id, word_id, order_num)
VALUES
('l1_1', 'wd_hello', 1),
('l1_1', 'wd_goodbye', 2),
('l1_1', 'wd_i', 3),
('l1_1', 'wd_you', 4),
('l1_2', 'wd_one', 1),
('l1_2', 'wd_two', 2),
('l1_2', 'wd_three', 3),
('l1_2', 'wd_four', 4),
('l1_3', 'wd_hello', 1),
('l1_3', 'wd_goodbye', 2),
('l1_3', 'wd_thankyou', 3),
('l1_3', 'wd_youre_welcome', 4),
('l1_3', 'wd_sorry', 5),
('l1_3', 'wd_no_problem', 6),
('l1_4', 'wd_one', 1),
('l1_4', 'wd_two', 2),
('l1_4', 'wd_three', 3),
('l1_4', 'wd_four', 4),
('l1_4', 'wd_five', 5),
('l1_4', 'wd_six', 6),
('l1_4', 'wd_seven', 7),
('l1_4', 'wd_eight', 8),
('l1_4', 'wd_nine', 9),
('l1_4', 'wd_ten', 10),
('l1_5', 'wd_name', 1),
('l1_5', 'wd_called', 2),
('l1_5', 'wd_china', 3),
('l1_5', 'wd_chinese', 4),
('l1_6', 'wd_dad', 1),
('l1_6', 'wd_mom', 2),
('l1_6', 'wd_older_brother', 3),
('l1_6', 'wd_older_sister', 4),
('l1_6', 'wd_younger_brother', 5),
('l1_6', 'wd_younger_sister', 6),
('l1_6', 'wd_friend', 7),
('l1_7', 'wd_yes', 1),
('l1_7', 'wd_no', 2),
('l1_7', 'wd_student', 3),
('l1_7', 'wd_teacher', 4),
('l1_7', 'wd_doctor', 5),
('l1_8', 'wd_eat', 1),
('l1_8', 'wd_drink', 2),
('l1_8', 'wd_water', 3),
('l1_8', 'wd_tea', 4),
('l1_8', 'wd_coffee', 5),
('l1_8', 'wd_rice', 6),
('l1_8', 'wd_noodles', 7),
('l1_8', 'wd_apple', 8),
('l1_9', 'wd_how_much', 1),
('l1_9', 'wd_money', 2),
('l1_9', 'wd_yuan', 3),
('l1_9', 'wd_kuai', 4),
('l1_9', 'wd_buy', 5),
('l1_9', 'wd_sell', 6),
('l1_10', 'wd_today', 1),
('l1_10', 'wd_yesterday', 2),
('l1_10', 'wd_tomorrow', 3),
('l1_10', 'wd_morning', 4),
('l1_10', 'wd_afternoon', 5),
('l1_10', 'wd_evening', 6),
('l1_10', 'wd_now', 7),
('l1_10', 'wd_week', 8),
('l1_10', 'wd_go', 9),
('l1_10', 'wd_school', 10),
('l2_1', 'wd_subway', 1),
('l2_1', 'wd_bus', 2),
('l2_1', 'wd_taxi', 3),
('l2_1', 'wd_train', 4),
('l2_1', 'wd_airport', 5),
('l2_1', 'wd_station', 6),
('l2_1', 'wd_left_turn', 7),
('l2_1', 'wd_right_turn', 8),
('l2_1', 'wd_straight', 9),
('l2_2', 'wd_eat', 1),
('l2_2', 'wd_drink', 2),
('l2_2', 'wd_go', 3),
('l2_2', 'wd_buy', 4),
('l2_3', 'wd_delicious', 1),
('l2_3', 'wd_spicy', 2),
('l2_3', 'wd_beef', 3),
('l2_3', 'wd_chicken', 4),
('l2_3', 'wd_noodles', 5),
('l2_3', 'wd_rice', 6),
('l3_1', 'wd_suggest', 1),
('l3_1', 'wd_decide', 2),
('l3_1', 'wd_help', 3),
('l3_1', 'wd_go', 4),
('l3_1', 'wd_buy', 5),
('l3_2', 'wd_big', 1),
('l3_2', 'wd_small', 2),
('l3_2', 'wd_good', 3),
('l3_2', 'wd_expensive', 4),
('l3_2', 'wd_today', 5),
('l3_2', 'wd_yesterday', 6),
('l3_3', 'wd_meeting', 1),
('l3_3', 'wd_schedule', 2),
('l3_3', 'wd_contract', 3),
('l3_3', 'wd_opportunity', 4),
('l3_3', 'wd_experience', 5),
('l3_3', 'wd_you_formal', 6),
('l3_4', 'wd_practice', 1),
('l3_4', 'wd_exam', 2),
('l3_4', 'wd_homework', 3),
('l3_4', 'wd_library', 4),
('l3_4', 'wd_difficult', 5),
('l3_4', 'wd_easy', 6),
('l3_4', 'wd_important', 7),
('l3_5', 'wd_culture', 1),
('l3_5', 'wd_history', 2),
('l3_5', 'wd_environment', 3),
('l3_5', 'wd_future', 4),
('l3_5', 'wd_china', 5),
('l3_5', 'wd_chinese', 6),
('l3_6', 'wd_feel', 1),
('l3_6', 'wd_opinion', 2),
('l3_6', 'wd_memory', 3),
('l3_6', 'wd_remember', 4),
('l3_6', 'wd_forget', 5),
('l3_6', 'wd_interesting', 6),
('l3_6', 'wd_boring', 7)
ON CONFLICT (lesson_id, word_id)
DO UPDATE SET order_num = EXCLUDED.order_num;

INSERT INTO grammar_points (id, lesson_id, pattern, explanation, tips, examples, order_num)
VALUES
('gp_1_1_1', 'l1_1', 'Initial + Final + Tone', 'Every pinyin syllable combines an optional initial consonant, a final vowel, and a tone mark.', ARRAY['Practice each initial slowly before combining syllables.'], $$[
  {"simplified":"妈","traditional":"媽","pinyin":"mā","english":"mother (第一声)"},
  {"simplified":"马","traditional":"馬","pinyin":"mǎ","english":"horse (第三声)"}
]$$::jsonb, 1),
('gp_1_2_1', 'l1_2', 'Tone contour', '第一声 is high level, 第二声 rising, 第三声 low dipping, 第四声 falling, neutral short and light.', ARRAY['Over-emphasize tones while starting out.'], '[]'::jsonb, 1),
('gp_1_5_1', 'l1_5', 'Subject + 叫 + Name', 'Use 叫 after a person to say what someone is called.', ARRAY['我叫 is the most natural beginner pattern for giving your name.'], $$[
  {"simplified":"我叫安娜。","traditional":"我叫安娜。","pinyin":"Wǒ jiào Ānnà.","english":"My name is Anna."},
  {"simplified":"你叫什么名字？","traditional":"你叫什麼名字？","pinyin":"Nǐ jiào shénme míngzì?","english":"What is your name?"}
]$$::jsonb, 1),
('gp_1_7_1', 'l1_7', 'A + 是 + B', 'Use 是 between a subject and a noun identity. Negate it with 不是.', ARRAY['Do not use 是 before ordinary adjectives such as 好 or 忙.'], $$[
  {"simplified":"我是学生。","traditional":"我是學生。","pinyin":"Wǒ shì xuéshēng.","english":"I am a student."},
  {"simplified":"他不是老师。","traditional":"他不是老師。","pinyin":"Tā bú shì lǎoshī.","english":"He is not a teacher."}
]$$::jsonb, 1),
('gp_1_9_1', 'l1_9', 'Item + 多少钱?', 'Place 多少钱 after the item to ask its price.', ARRAY['块 is the common spoken word for yuan.'], $$[
  {"simplified":"这个多少钱？","traditional":"這個多少錢？","pinyin":"Zhège duōshǎo qián?","english":"How much is this?"},
  {"simplified":"苹果多少钱？","traditional":"蘋果多少錢？","pinyin":"Píngguǒ duōshǎo qián?","english":"How much are the apples?"}
]$$::jsonb, 1),
('gp_2_1_1', 'l2_1', 'Place + 怎么走?', 'Use 怎么走 to ask how to get to a place.', ARRAY['Add 请问 at the beginning to sound polite.'], $$[
  {"simplified":"请问地铁站怎么走？","traditional":"請問地鐵站怎麼走？","pinyin":"Qǐngwèn dìtiězhàn zěnme zǒu?","english":"Excuse me, how do I get to the subway station?"}
]$$::jsonb, 1),
('gp_2_2_1', 'l2_2', 'Verb + 了', 'Add 了 after a verb to mark a completed action or a changed state.', ARRAY['了 is not only past tense; it marks completion or change.'], $$[
  {"simplified":"我吃了。","traditional":"我吃了。","pinyin":"Wǒ chī le.","english":"I have eaten."},
  {"simplified":"他去了中国。","traditional":"他去了中國。","pinyin":"Tā qù le Zhōngguó.","english":"He went to China."}
]$$::jsonb, 1),
('gp_2_3_1', 'l2_3', '我要 + food/drink', 'Use 我要 to order what you want in a restaurant.', ARRAY['Add 不要太辣 to ask for food that is not too spicy.'], $$[
  {"simplified":"我要一碗牛肉面。","traditional":"我要一碗牛肉麵。","pinyin":"Wǒ yào yī wǎn niúròu miàn.","english":"I want a bowl of beef noodles."}
]$$::jsonb, 1),
('gp_3_1_1', 'l3_1', '我们...吧', 'Put 吧 at the end of a sentence to make a friendly suggestion.', ARRAY['吧 makes the sentence softer than a direct command.'], $$[
  {"simplified":"我们去图书馆吧。","traditional":"我們去圖書館吧。","pinyin":"Wǒmen qù túshūguǎn ba.","english":"Let us go to the library."},
  {"simplified":"我们练习中文吧。","traditional":"我們練習中文吧。","pinyin":"Wǒmen liànxí Zhōngwén ba.","english":"Let us practice Chinese."}
]$$::jsonb, 1),
('gp_3_2_1', 'l3_2', 'A 比 B + adjective', 'Use 比 to compare two things. The adjective comes after the compared item.', ARRAY['Do not add 很 after 比 in a simple comparison.'], $$[
  {"simplified":"今天比昨天冷。","traditional":"今天比昨天冷。","pinyin":"Jīntiān bǐ zuótiān lěng.","english":"Today is colder than yesterday."},
  {"simplified":"这个比那个贵。","traditional":"這個比那個貴。","pinyin":"Zhège bǐ nàge guì.","english":"This one is more expensive than that one."}
]$$::jsonb, 1),
('gp_3_3_1', 'l3_3', 'Verb + 一下', 'Use 一下 after a verb to make an action sound brief or polite.', ARRAY['讨论一下 is useful in meetings because it sounds softer.'], $$[
  {"simplified":"我们讨论一下合同。","traditional":"我們討論一下合同。","pinyin":"Wǒmen tǎolùn yīxià hétóng.","english":"Let us discuss the contract briefly."}
]$$::jsonb, 1),
('gp_3_4_1', 'l3_4', '对...来说', 'Use 对...来说 to say from someone perspective.', ARRAY['This pattern is useful for talking about difficulty and importance.'], $$[
  {"simplified":"对我来说，考试很重要。","traditional":"對我來說，考試很重要。","pinyin":"Duì wǒ lái shuō, kǎoshì hěn zhòngyào.","english":"For me, the exam is important."}
]$$::jsonb, 1),
('gp_3_5_1', 'l3_5', '关于 + topic', 'Use 关于 before a topic to mean about or regarding.', ARRAY['关于文化 means about culture.'], $$[
  {"simplified":"我想学习关于中国历史的内容。","traditional":"我想學習關於中國歷史的內容。","pinyin":"Wǒ xiǎng xuéxí guānyú Zhōngguó lìshǐ de nèiróng.","english":"I want to study content about Chinese history."}
]$$::jsonb, 1),
('gp_3_6_1', 'l3_6', '我觉得 + opinion', 'Use 我觉得 to share what you think or feel.', ARRAY['This is a natural pattern for personal opinions.'], $$[
  {"simplified":"我觉得中文很有意思。","traditional":"我覺得中文很有意思。","pinyin":"Wǒ juéde Zhōngwén hěn yǒu yìsi.","english":"I think Chinese is interesting."},
  {"simplified":"我觉得这本书有点无聊。","traditional":"我覺得這本書有點無聊。","pinyin":"Wǒ juéde zhè běn shū yǒudiǎn wúliáo.","english":"I think this book is a little boring."}
]$$::jsonb, 1)
ON CONFLICT (id)
DO UPDATE SET lesson_id = EXCLUDED.lesson_id,
              pattern = EXCLUDED.pattern,
              explanation = EXCLUDED.explanation,
              tips = EXCLUDED.tips,
              examples = EXCLUDED.examples,
              order_num = EXCLUDED.order_num;

INSERT INTO exercises (
  id, lesson_id, kind, prompt, prompt_hanzi, options, correct_index,
  correct_text, audio_word_id, tone, order_num
)
VALUES
('e1_1_1', 'l1_1', 'matchPinyin', 'Match 你好 to its pinyin', '你好', '["nǐ hǎo", "nǐ hào", "nǐ háo", "nì hǎo"]'::jsonb, 0, 'nǐ hǎo', 'wd_hello', NULL, 1),
('e1_1_2', 'l1_1', 'multipleChoice', 'Which means hello?', NULL, '["再见", "你好", "谢谢", "对不起"]'::jsonb, 1, '你好', 'wd_hello', NULL, 2),
('e1_2_1', 'l1_2', 'tonePicker', 'nǐ 是第几声？', NULL, '["第一声", "第二声", "第三声", "第四声"]'::jsonb, 2, '第三声', NULL, 3, 1),
('e1_3_1', 'l1_3', 'multipleChoice', '你好 means...', '你好', '["goodbye", "hello", "sorry", "thank you"]'::jsonb, 1, 'hello', 'wd_hello', NULL, 1),
('e1_3_2', 'l1_3', 'multipleChoice', '再见 means...', '再见', '["hello", "thank you", "goodbye", "please"]'::jsonb, 2, 'goodbye', 'wd_goodbye', NULL, 2),
('e1_4_1', 'l1_4', 'multipleChoice', '三 means...', '三', '["2", "3", "4", "5"]'::jsonb, 1, '3', 'wd_three', NULL, 1),
('e1_4_2', 'l1_4', 'multipleChoice', '九 means...', '九', '["6", "7", "8", "9"]'::jsonb, 3, '9', 'wd_nine', NULL, 2),
('e1_4_3', 'l1_4', 'matchPinyin', 'Pinyin for 五', '五', '["wǔ", "wú", "wù", "wū"]'::jsonb, 0, 'wǔ', 'wd_five', NULL, 3),
('e1_4_4', 'l1_4', 'listening', 'Listen: which number?', NULL, '["六", "七", "八", "九"]'::jsonb, 1, '七', 'wd_seven', NULL, 4),
('e1_5_1', 'l1_5', 'arrangeSentence', 'Arrange: I am called Anna', NULL, '["我", "叫", "安娜"]'::jsonb, 0, '我叫安娜', NULL, NULL, 1),
('e1_5_2', 'l1_5', 'fillBlank', '我___安娜。(blank = called)', '我___安娜。', '["是", "叫", "去", "有"]'::jsonb, 1, '叫', 'wd_called', NULL, 2),
('e1_5_3', 'l1_5', 'multipleChoice', '你叫什么名字？ means...', '你叫什么名字？', '["Where are you?", "Who is he?", "What is your name?", "How old?"]'::jsonb, 2, 'What is your name?', NULL, NULL, 3),
('e1_6_1', 'l1_6', 'multipleChoice', '妈妈 means...', '妈妈', '["dad", "mom", "sister", "brother"]'::jsonb, 1, 'mom', 'wd_mom', NULL, 1),
('e1_6_2', 'l1_6', 'multipleChoice', '哥哥 is...', '哥哥', '["older brother", "younger brother", "older sister", "younger sister"]'::jsonb, 0, 'older brother', 'wd_older_brother', NULL, 2),
('e1_6_3', 'l1_6', 'matchPinyin', 'Pinyin for 朋友', '朋友', '["péng yǒu", "féng yǒu", "bēng yǒu", "péng yòu"]'::jsonb, 0, 'péng yǒu', 'wd_friend', NULL, 3),
('e1_7_1', 'l1_7', 'fillBlank', '我___学生。', '我___学生。', '["有", "是", "去", "叫"]'::jsonb, 1, '是', 'wd_yes', NULL, 1),
('e1_7_2', 'l1_7', 'fillBlank', '他___是老师。', '他___是老师。', '["不", "没", "别", "很"]'::jsonb, 0, '不', 'wd_no', NULL, 2),
('e1_7_3', 'l1_7', 'trueFalse', '是 can come before an adjective.', NULL, '["True", "False"]'::jsonb, 1, 'False', NULL, NULL, 3),
('e1_8_1', 'l1_8', 'multipleChoice', '茶 means...', '茶', '["water", "tea", "coffee", "juice"]'::jsonb, 1, 'tea', 'wd_tea', NULL, 1),
('e1_8_2', 'l1_8', 'matchPinyin', '咖啡 pinyin', '咖啡', '["kā fēi", "gā fēi", "jiā fēi", "qiā fēi"]'::jsonb, 0, 'kā fēi', 'wd_coffee', NULL, 2),
('e1_8_3', 'l1_8', 'arrangeSentence', 'Arrange: I drink tea', NULL, '["我", "喝", "茶"]'::jsonb, 0, '我喝茶', NULL, NULL, 3),
('e1_9_1', 'l1_9', 'multipleChoice', '多少钱 means...', '多少钱', '["where?", "how much?", "what?", "when?"]'::jsonb, 1, 'how much?', 'wd_how_much', NULL, 1),
('e1_9_2', 'l1_9', 'fillBlank', '这个___钱？', '这个___钱？', '["多少", "什么", "哪", "怎么"]'::jsonb, 0, '多少', 'wd_how_much', NULL, 2),
('e1_9_3', 'l1_9', 'arrangeSentence', 'Arrange: I buy apples', NULL, '["我", "买", "苹果"]'::jsonb, 0, '我买苹果', NULL, NULL, 3),
('e1_10_1', 'l1_10', 'multipleChoice', '今天 means...', '今天', '["yesterday", "tomorrow", "today", "tonight"]'::jsonb, 2, 'today', 'wd_today', NULL, 1),
('e1_10_2', 'l1_10', 'multipleChoice', '明天 means...', '明天', '["yesterday", "tomorrow", "today", "evening"]'::jsonb, 1, 'tomorrow', 'wd_tomorrow', NULL, 2),
('e1_10_3', 'l1_10', 'matchPinyin', '早上 pinyin', '早上', '["zǎo shang", "zhǎo shàng", "zāo shang", "zuǒ shang"]'::jsonb, 0, 'zǎo shang', 'wd_morning', NULL, 3),
('e2_1_1', 'l2_1', 'multipleChoice', '地铁 means...', '地铁', '["bus", "subway", "taxi", "train"]'::jsonb, 1, 'subway', 'wd_subway', NULL, 1),
('e2_1_2', 'l2_1', 'multipleChoice', '左转 means...', '左转', '["turn right", "turn left", "go straight", "stop"]'::jsonb, 1, 'turn left', 'wd_left_turn', NULL, 2),
('e2_1_3', 'l2_1', 'arrangeSentence', 'Arrange: Go straight then turn right', NULL, '["直走", "然后", "右转"]'::jsonb, 0, '直走然后右转', NULL, NULL, 3),
('e2_2_1', 'l2_2', 'fillBlank', '我买___苹果。', '我买___苹果。', '["了", "的", "得", "地"]'::jsonb, 0, '了', NULL, NULL, 1),
('e2_2_2', 'l2_2', 'arrangeSentence', 'Arrange: I drank coffee', NULL, '["我", "喝", "了", "咖啡"]'::jsonb, 0, '我喝了咖啡', NULL, NULL, 2),
('e2_2_3', 'l2_2', 'trueFalse', '了 is only used in past tense.', NULL, '["True", "False"]'::jsonb, 1, 'False', NULL, NULL, 3),
('e2_3_1', 'l2_3', 'multipleChoice', '好吃 means...', '好吃', '["smelly", "delicious", "spicy", "salty"]'::jsonb, 1, 'delicious', 'wd_delicious', NULL, 1),
('e2_3_2', 'l2_3', 'multipleChoice', '辣 means...', '辣', '["cold", "spicy", "sweet", "cheap"]'::jsonb, 1, 'spicy', 'wd_spicy', NULL, 2),
('e2_3_3', 'l2_3', 'arrangeSentence', 'Arrange: I want beef noodles', NULL, '["我", "要", "牛肉面"]'::jsonb, 0, '我要牛肉面', NULL, NULL, 3),
('e3_1_1', 'l3_1', 'fillBlank', '我们去图书馆___。', '我们去图书馆___。', '["吗", "吧", "呢", "了"]'::jsonb, 1, '吧', NULL, NULL, 1),
('e3_1_2', 'l3_1', 'multipleChoice', '建议 means...', '建议', '["to decide", "to suggest", "to forget", "to compare"]'::jsonb, 1, 'to suggest', 'wd_suggest', NULL, 2),
('e3_1_3', 'l3_1', 'arrangeSentence', 'Arrange: Let us practice Chinese', NULL, '["我们", "练习", "中文", "吧"]'::jsonb, 0, '我们练习中文吧', NULL, NULL, 3),
('e3_1_4', 'l3_1', 'multipleChoice', '决定 means...', '决定', '["meeting", "to decide", "experience", "homework"]'::jsonb, 1, 'to decide', 'wd_decide', NULL, 4),
('e3_2_1', 'l3_2', 'arrangeSentence', 'Arrange: Today is colder than yesterday', NULL, '["今天", "比", "昨天", "冷"]'::jsonb, 0, '今天比昨天冷', NULL, NULL, 1),
('e3_2_2', 'l3_2', 'trueFalse', 'You can say 她比他很高 in a simple 比 comparison.', NULL, '["True", "False"]'::jsonb, 1, 'False', NULL, NULL, 2),
('e3_2_3', 'l3_2', 'multipleChoice', '贵 means...', '贵', '["cheap", "expensive", "small", "easy"]'::jsonb, 1, 'expensive', 'wd_expensive', NULL, 3),
('e3_2_4', 'l3_2', 'fillBlank', '这个___那个贵。', '这个___那个贵。', '["比", "吧", "了", "吗"]'::jsonb, 0, '比', NULL, NULL, 4),
('e3_3_1', 'l3_3', 'multipleChoice', '会议 means...', '会议', '["company", "meeting", "schedule", "contract"]'::jsonb, 1, 'meeting', 'wd_meeting', NULL, 1),
('e3_3_2', 'l3_3', 'multipleChoice', '合同 means...', '合同', '["contract", "opportunity", "experience", "library"]'::jsonb, 0, 'contract', 'wd_contract', NULL, 2),
('e3_3_3', 'l3_3', 'arrangeSentence', 'Arrange: Let us discuss the contract briefly', NULL, '["我们", "讨论", "一下", "合同"]'::jsonb, 0, '我们讨论一下合同', NULL, NULL, 3),
('e3_3_4', 'l3_3', 'matchPinyin', 'Pinyin for 机会', '机会', '["jī huì", "jīng yàn", "huì yì", "hé tóng"]'::jsonb, 0, 'jī huì', 'wd_opportunity', NULL, 4),
('e3_4_1', 'l3_4', 'multipleChoice', '考试 means...', '考试', '["homework", "exam", "library", "practice"]'::jsonb, 1, 'exam', 'wd_exam', NULL, 1),
('e3_4_2', 'l3_4', 'multipleChoice', '作业 means...', '作业', '["homework", "history", "future", "opinion"]'::jsonb, 0, 'homework', 'wd_homework', NULL, 2),
('e3_4_3', 'l3_4', 'fillBlank', '对我来说，考试很___。', '对我来说，考试很___。', '["重要", "无聊", "贵", "小"]'::jsonb, 0, '重要', 'wd_important', NULL, 3),
('e3_4_4', 'l3_4', 'arrangeSentence', 'Arrange: This homework is not difficult', NULL, '["这个", "作业", "不", "难"]'::jsonb, 0, '这个作业不难', NULL, NULL, 4),
('e3_5_1', 'l3_5', 'multipleChoice', '文化 means...', '文化', '["culture", "history", "environment", "future"]'::jsonb, 0, 'culture', 'wd_culture', NULL, 1),
('e3_5_2', 'l3_5', 'multipleChoice', '历史 means...', '历史', '["future", "history", "memory", "opinion"]'::jsonb, 1, 'history', 'wd_history', NULL, 2),
('e3_5_3', 'l3_5', 'matchPinyin', 'Pinyin for 环境', '环境', '["huán jìng", "wén huà", "lì shǐ", "wèi lái"]'::jsonb, 0, 'huán jìng', 'wd_environment', NULL, 3),
('e3_5_4', 'l3_5', 'arrangeSentence', 'Arrange: I want to study Chinese culture', NULL, '["我", "想", "学习", "中国", "文化"]'::jsonb, 0, '我想学习中国文化', NULL, NULL, 4),
('e3_6_1', 'l3_6', 'fillBlank', '我___中文很有意思。', '我___中文很有意思。', '["觉得", "忘记", "帮助", "决定"]'::jsonb, 0, '觉得', 'wd_feel', NULL, 1),
('e3_6_2', 'l3_6', 'multipleChoice', '忘记 means...', '忘记', '["to remember", "to forget", "opinion", "memory"]'::jsonb, 1, 'to forget', 'wd_forget', NULL, 2),
('e3_6_3', 'l3_6', 'multipleChoice', '有意思 means...', '有意思', '["boring", "important", "interesting", "difficult"]'::jsonb, 2, 'interesting', 'wd_interesting', NULL, 3),
('e3_6_4', 'l3_6', 'arrangeSentence', 'Arrange: I remember your opinion', NULL, '["我", "记住", "你的", "意见"]'::jsonb, 0, '我记住你的意见', NULL, NULL, 4)
ON CONFLICT (id)
DO UPDATE SET lesson_id = EXCLUDED.lesson_id,
              kind = EXCLUDED.kind,
              prompt = EXCLUDED.prompt,
              prompt_hanzi = EXCLUDED.prompt_hanzi,
              options = EXCLUDED.options,
              correct_index = EXCLUDED.correct_index,
              correct_text = EXCLUDED.correct_text,
              audio_word_id = EXCLUDED.audio_word_id,
              tone = EXCLUDED.tone,
              order_num = EXCLUDED.order_num;

ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS answer_explanation TEXT;

UPDATE exercises AS e
SET
  prompt_pinyin = details.prompt_pinyin,
  prompt_english = details.prompt_english,
  answer_explanation = details.answer_explanation,
  updated_at = now()
FROM (
  VALUES
    ('e1_1_1', 'nǐ hǎo', 'hello', '你好 is read nǐ hǎo: 你 and 好 both use third tone marks.'),
    ('e1_1_2', 'nǐ hǎo', 'hello', '你好 is the standard greeting for hello.'),
    ('e1_2_1', 'nǐ', 'you', 'nǐ has the dipping third-tone mark ǐ, so the answer is 第三声.'),
    ('e1_3_1', 'nǐ hǎo', 'hello', '你好 literally joins 你 (you) and 好 (good), and is used to say hello.'),
    ('e1_3_2', 'zài jiàn', 'goodbye', '再见 means see you again and is used for goodbye.'),
    ('e1_4_1', 'sān', 'three', '三 is the Chinese number 3.'),
    ('e1_4_2', 'jiǔ', 'nine', '九 is the Chinese number 9.'),
    ('e1_4_3', 'wǔ', 'five', '五 is pronounced wǔ with a third tone.'),
    ('e1_4_4', 'qī', 'seven', 'The listening word is 七, which means seven.'),
    ('e1_5_1', 'wǒ jiào Ānnà', 'I am called Anna.', '我叫... is the common pattern for saying your name.'),
    ('e1_5_2', 'wǒ jiào Ānnà', 'I am called Anna.', '叫 means to be called, so it completes 我叫安娜.'),
    ('e1_5_3', 'nǐ jiào shénme míngzi?', 'What is your name?', '你叫什么名字？ asks what someone is called.'),
    ('e1_6_1', 'māma', 'mom', '妈妈 means mom or mother.'),
    ('e1_6_2', 'gēge', 'older brother', '哥哥 refers to an older brother.'),
    ('e1_6_3', 'péngyou', 'friend', '朋友 is pronounced péngyou and means friend.'),
    ('e1_7_1', 'wǒ shì xuésheng', 'I am a student.', '是 links the subject 我 with the noun 学生.'),
    ('e1_7_2', 'tā bú shì lǎoshī', 'He is not a teacher.', '不 negates 是, giving 不是.'),
    ('e1_7_3', 'shì', 'to be', '是 links nouns, but adjectives usually do not take 是 directly.'),
    ('e1_8_1', 'chá', 'tea', '茶 means tea.'),
    ('e1_8_2', 'kā fēi', 'coffee', '咖啡 is pronounced kā fēi.'),
    ('e1_8_3', 'wǒ hē chá', 'I drink tea.', 'The sentence order is subject + verb + object: 我 + 喝 + 茶.'),
    ('e1_9_1', 'duōshao qián', 'how much money', '多少钱 is the common way to ask how much something costs.'),
    ('e1_9_2', 'zhège duōshao qián?', 'How much is this?', '多少 asks how much or how many.'),
    ('e1_9_3', 'wǒ mǎi píngguǒ', 'I buy apples.', 'The sentence order is subject + verb + object: 我 + 买 + 苹果.'),
    ('e1_10_1', 'jīntiān', 'today', '今天 means today.'),
    ('e1_10_2', 'míngtiān', 'tomorrow', '明天 means tomorrow.'),
    ('e1_10_3', 'zǎoshang', 'morning', '早上 is pronounced zǎoshang and means morning.'),
    ('e2_1_1', 'dìtiě', 'subway', '地铁 means subway or metro.'),
    ('e2_1_2', 'zuǒ zhuǎn', 'turn left', '左 means left and 转 means turn.'),
    ('e2_1_3', 'zhí zǒu ránhòu yòu zhuǎn', 'Go straight, then turn right.', '然后 marks the next step, so it sits between 直走 and 右转.'),
    ('e2_2_1', 'wǒ mǎi le píngguǒ', 'I bought apples.', '了 after the verb marks a completed action.'),
    ('e2_2_2', 'wǒ hē le kāfēi', 'I drank coffee.', 'Place 了 after the verb 喝 to show the action was completed.'),
    ('e2_2_3', 'le', 'completed-action marker', '了 is not only past tense; it marks completion or a changed state.'),
    ('e2_3_1', 'hǎochī', 'delicious', '好吃 describes food that tastes good.'),
    ('e2_3_2', 'là', 'spicy', '辣 means spicy.'),
    ('e2_3_3', 'wǒ yào niúròu miàn', 'I want beef noodles.', '要 means want, followed by the item 牛肉面.'),
    ('e3_1_1', 'wǒmen qù túshūguǎn ba', 'Let us go to the library.', '吧 softens the sentence into a suggestion.'),
    ('e3_1_2', 'jiànyì', 'to suggest', '建议 means to suggest or suggestion.'),
    ('e3_1_3', 'wǒmen liànxí Zhōngwén ba', 'Let us practice Chinese.', '吧 makes 我们练习中文 sound like a suggestion.'),
    ('e3_1_4', 'juédìng', 'to decide', '决定 means to decide.'),
    ('e3_2_1', 'jīntiān bǐ zuótiān lěng', 'Today is colder than yesterday.', 'In a 比 comparison, the pattern is A + 比 + B + adjective.'),
    ('e3_2_2', 'tā bǐ tā gāo', 'She is taller than him.', 'A simple 比 comparison does not use 很 before the adjective.'),
    ('e3_2_3', 'guì', 'expensive', '贵 means expensive.'),
    ('e3_2_4', 'zhège bǐ nàge guì', 'This one is more expensive than that one.', '比 connects the two things being compared.'),
    ('e3_3_1', 'huìyì', 'meeting', '会议 means meeting.'),
    ('e3_3_2', 'hétong', 'contract', '合同 means contract.'),
    ('e3_3_3', 'wǒmen tǎolùn yíxià hétong', 'Let us discuss the contract briefly.', '一下 after 讨论 makes the action sound brief or light.'),
    ('e3_3_4', 'jīhuì', 'opportunity', '机会 is pronounced jīhuì and means opportunity.'),
    ('e3_4_1', 'kǎoshì', 'exam', '考试 means exam or test.'),
    ('e3_4_2', 'zuòyè', 'homework', '作业 means homework.'),
    ('e3_4_3', 'duì wǒ lái shuō, kǎoshì hěn zhòngyào', 'For me, exams are important.', '重要 means important and fits after 很.'),
    ('e3_4_4', 'zhège zuòyè bù nán', 'This homework is not difficult.', '不 negates the adjective 难.'),
    ('e3_5_1', 'wénhuà', 'culture', '文化 means culture.'),
    ('e3_5_2', 'lìshǐ', 'history', '历史 means history.'),
    ('e3_5_3', 'huánjìng', 'environment', '环境 is pronounced huánjìng and means environment.'),
    ('e3_5_4', 'wǒ xiǎng xuéxí Zhōngguó wénhuà', 'I want to study Chinese culture.', '想 means want to, followed by the action 学习中国文化.'),
    ('e3_6_1', 'wǒ juéde Zhōngwén hěn yǒu yìsi', 'I think Chinese is interesting.', '觉得 introduces an opinion or feeling.'),
    ('e3_6_2', 'wàngjì', 'to forget', '忘记 means to forget.'),
    ('e3_6_3', 'yǒu yìsi', 'interesting', '有意思 describes something interesting.'),
    ('e3_6_4', 'wǒ jìzhù nǐ de yìjiàn', 'I remember your opinion.', '记住 means to remember, followed by the thing remembered.')
) AS details(id, prompt_pinyin, prompt_english, answer_explanation)
WHERE e.id = details.id;

INSERT INTO achievements (id, title, description, emoji, target_value, category)
VALUES
('first_lesson', 'First Step', 'Complete your first lesson', U&'\+01F463', 1, 'lessons'),
('lesson_rookie', 'Lesson Rookie', 'Complete 5 lessons', U&'\+01F4DA', 5, 'lessons'),
('lesson_grinder', 'Lesson Grinder', 'Complete 20 lessons', U&'\+01F3CB', 20, 'lessons'),
('streak_3', 'Warming Up', 'Build a 3-day study streak', U&'\+01F525', 3, 'streak'),
('streak_7', 'One Week Flame', 'Build a 7-day study streak', U&'\+01F4C5', 7, 'streak'),
('streak_30', 'Monthly Momentum', 'Build a 30-day study streak', U&'\+01F680', 30, 'streak'),
('vocab_10', 'Word Collector', 'Learn or review 10 vocabulary items', U&'\+01F9E0', 10, 'vocabulary'),
('vocab_50', 'Vocabulary Builder', 'Learn or review 50 vocabulary items', U&'\+01F4D6', 50, 'vocabulary'),
('vocab_200', 'Word Bank', 'Learn or review 200 vocabulary items', U&'\+01F3E6', 200, 'vocabulary'),
('xp_100', 'XP Spark', 'Earn 100 XP', U&'\2728', 100, 'xp'),
('xp_500', 'XP Engine', 'Earn 500 XP', U&'\26A1', 500, 'xp'),
('xp_2000', 'XP Legend', 'Earn 2,000 XP', U&'\+01F3C6', 2000, 'xp'),
('hsk_1', 'HSK 1 Clear', 'Complete all active HSK 1 lessons', U&'\+01F396', 1, 'hsk'),
('hsk_2', 'HSK 2 Clear', 'Complete all active HSK 2 lessons', U&'\+01F3D4', 2, 'hsk'),
('hsk_3', 'HSK 3 Clear', 'Complete all active HSK 3 lessons', U&'\+01F3AF', 3, 'hsk'),
('perfect_lesson', 'Perfect Lesson', 'Complete any lesson with 100% accuracy', U&'\+01F48E', 100, 'skill'),
('tone_master', 'Tone Master', 'Score at least 80 in tone practice', U&'\+01F3B5', 80, 'skill'),
('shadow_speaker', 'Shadow Speaker', 'Score at least 80 in shadowing practice', U&'\+01F399', 80, 'skill'),
('hanzi_starter', 'Hanzi Starter', 'Complete a Hanzi writing practice', U&'\270D', 80, 'skill'),
('listening_sharp', 'Sharp Listener', 'Score at least 80 in listening practice', U&'\+01F3A7', 80, 'skill'),
('pinyin_typist', 'Pinyin Typist', 'Score at least 80 in pinyin typing practice', U&'\2328', 80, 'skill')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              description = EXCLUDED.description,
              emoji = EXCLUDED.emoji,
              target_value = EXCLUDED.target_value,
              category = EXCLUDED.category,
              is_active = true;

INSERT INTO chat_scenarios (
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english
)
VALUES
('general', 'Free Talk', '💬', 'Practice conversational Chinese on any topic with Xiao Hong.', '你好！很高兴认识你。我们今天聊点什么？', 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Wǒmen jīntiān liáo diǎn shénme?', 'Hello! Nice to meet you. What shall we talk about today?'),
('cafe', 'At the Coffee Shop', '☕', 'Practice ordering coffee, tea, and juice in Chinese.', '欢迎光临！请问您要喝点什么？我们有咖啡、茶和果汁。', 'Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme? Wǒmen yǒu kāfēi, chá hé guǒzhī.', 'Welcome! What would you like to drink? We have coffee, tea and juice.'),
('directions', 'Asking Directions', '🧭', 'Practice finding your way around town to the station or airport.', '你好！请问地铁站怎么走？', 'Nǐ hǎo! Qǐngwèn dìtiězhàn zěnme zǒu?', 'Hello! Excuse me, how do I get to the subway station?')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              is_active = true;

INSERT INTO chat_scenarios (
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english
)
VALUES
('personal-weak', 'Luyen diem yeu', U&'\+01F3AF', 'Hoi thoai dung cac tu va ky nang ban hay sai.', '我们来练习你的难点吧。', 'Wǒmen lái liànxí nǐ de nándiǎn ba.', 'Let us practice your weak spots.'),
('personal-list', 'Luyen tu trong list', U&'\+01F4CB', 'AI Tutor uu tien tu vung trong danh sach ban luu gan day.', '请用你保存的词说一句话。', 'Qǐng yòng nǐ bǎocún de cí shuō yí jù huà.', 'Please make a sentence with a word you saved.'),
('personal-lesson', 'On bai vua hoc', U&'\+01F9E0', 'Luyen hoi thoai xoay quanh bai hoc gan nhat.', '我们复习你刚学的内容。', 'Wǒmen fùxí nǐ gāng xué de nèiróng.', 'Let us review what you just learned.')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              is_active = true;

INSERT INTO practice_minimal_pairs (
  id, word_a, word_b, char_a, char_b, tone_a, tone_b, label, order_num
)
VALUES
('ma-1-3', 'mā', 'mǎ', '妈', '马', 1, 3, 'mother vs horse', 10),
('ma-1-2', 'mā', 'má', '妈', '麻', 1, 2, 'mother vs hemp', 20),
('ma-1-4', 'mā', 'mà', '妈', '骂', 1, 4, 'mother vs scold', 30),
('shu-1-3', 'shū', 'shǔ', '书', '鼠', 1, 3, 'book vs mouse', 40),
('cha-2-4', 'chá', 'chà', '茶', '差', 2, 4, 'tea vs poor', 50),
('mai-3-4', 'mǎi', 'mài', '买', '卖', 3, 4, 'buy vs sell', 60)
ON CONFLICT (id)
DO UPDATE SET word_a = EXCLUDED.word_a,
              word_b = EXCLUDED.word_b,
              char_a = EXCLUDED.char_a,
              char_b = EXCLUDED.char_b,
              tone_a = EXCLUDED.tone_a,
              tone_b = EXCLUDED.tone_b,
              label = EXCLUDED.label,
              order_num = EXCLUDED.order_num,
              is_active = true;

INSERT INTO practice_hanzi_strokes (id, character, strokes, order_num)
VALUES
('ren', '人', ARRAY['M50,20 L20,80', 'M50,20 L80,80'], 10),
('da', '大', ARRAY['M15,35 L85,35', 'M50,20 L25,80', 'M50,35 L80,80'], 20),
('zhong', '中', ARRAY['M25,20 L25,70', 'M75,20 L75,70', 'M25,20 L75,20', 'M50,10 L50,90'], 30),
('guo', '国', ARRAY['M15,10 L15,90', 'M85,10 L85,90', 'M15,10 L85,10', 'M15,90 L85,90', 'M35,30 L65,30', 'M35,50 L65,50', 'M35,70 L65,70', 'M50,25 L50,75'], 40),
('hao', '好', ARRAY['M30,20 L20,60', 'M20,60 L40,65', 'M20,45 L40,45', 'M60,20 L60,70', 'M55,35 L75,35', 'M55,55 L75,55'], 50),
('shui', '水', ARRAY['M50,15 L50,85', 'M30,35 L20,75', 'M25,55 L35,65', 'M50,55 L75,35', 'M50,55 L80,80'], 60),
('huo', '火', ARRAY['M30,25 L20,50', 'M70,25 L80,50', 'M50,15 L30,85', 'M50,15 L70,85'], 70),
('shan', '山', ARRAY['M15,85 L15,50', 'M50,85 L50,25', 'M85,85 L85,50', 'M15,85 L85,85'], 80),
('kou', '口', ARRAY['M25,20 L25,80', 'M75,20 L75,80', 'M25,20 L75,20', 'M25,80 L75,80'], 90)
ON CONFLICT (id)
DO UPDATE SET character = EXCLUDED.character,
              strokes = EXCLUDED.strokes,
              order_num = EXCLUDED.order_num,
              is_active = true;

INSERT INTO daily_phrases (simplified, pinyin, english, note)
VALUES
('一步一个脚印', 'Yī bù yī gè jiǎo yìn', 'One step at a time.', 'Steady progress is the key to mastery.'),
('加油！', 'Jiā yóu!', 'Keep it up!', 'A common encouragement phrase in Chinese.'),
('熟能生巧', 'Shú néng shēng qiǎo', 'Practice makes perfect.', 'Skill grows from repeated practice.')
ON CONFLICT (simplified)
DO UPDATE SET pinyin = EXCLUDED.pinyin,
              english = EXCLUDED.english,
              note = EXCLUDED.note,
              is_active = true;

INSERT INTO grammar_library (id, title, pattern, summary, examples, search_text)
VALUES
('g_shi', '是 (shì) - to be', 'Subject + 是 + Noun', 'Used to equate a subject with a noun.', '[{"simplified":"我是学生。","pinyin":"Wǒ shì xuéshēng.","english":"I am a student."}]'::jsonb, '是 shi to be Subject Noun'),
('g_ma', '吗 (ma) - yes/no question', 'Statement + 吗?', 'Turns a statement into a yes/no question.', '[{"simplified":"你是学生吗？","pinyin":"Nǐ shì xuéshēng ma?","english":"Are you a student?"}]'::jsonb, '吗 ma yes no question'),
('g_ne', '呢 (ne) - follow-up question', 'Topic + 呢?', 'Asks and you or what about.', '[{"simplified":"我很好，你呢？","pinyin":"Wǒ hěn hǎo, nǐ ne?","english":"I am good, and you?"}]'::jsonb, '呢 ne follow up question')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              pattern = EXCLUDED.pattern,
              summary = EXCLUDED.summary,
              examples = EXCLUDED.examples,
              search_text = EXCLUDED.search_text,
              is_active = true;

COMMIT;
