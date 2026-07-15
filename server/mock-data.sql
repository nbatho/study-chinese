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

-- Vietnamese glosses for the seed vocabulary. Review (SRS) and Dictionary show
-- these when the UI language is Vietnamese, falling back to `english` otherwise.
-- Backfill the full imported dictionary with: node server/scripts/translate-word-glosses.mjs
UPDATE words AS w
SET english_vi = v.vi, updated_at = now()
FROM (VALUES
  ('wd_hello', 'xin chào'),
  ('wd_goodbye', 'tạm biệt'),
  ('wd_thankyou', 'cảm ơn'),
  ('wd_youre_welcome', 'không có chi'),
  ('wd_sorry', 'xin lỗi'),
  ('wd_no_problem', 'không sao / không có gì'),
  ('wd_i', 'tôi / mình'),
  ('wd_you', 'bạn'),
  ('wd_you_formal', 'ngài (bạn - trang trọng)'),
  ('wd_one', 'một'),
  ('wd_two', 'hai'),
  ('wd_three', 'ba'),
  ('wd_four', 'bốn'),
  ('wd_water', 'nước'),
  ('wd_tea', 'trà'),
  ('wd_coffee', 'cà phê'),
  ('wd_drink', 'uống'),
  ('wd_eat', 'ăn'),
  ('wd_china', 'Trung Quốc'),
  ('wd_station', 'ga / trạm'),
  ('wd_name', 'tên'),
  ('wd_called', 'được gọi là / tên là'),
  ('wd_chinese', 'tiếng Trung'),
  ('wd_five', 'năm'),
  ('wd_six', 'sáu'),
  ('wd_seven', 'bảy'),
  ('wd_eight', 'tám'),
  ('wd_nine', 'chín'),
  ('wd_ten', 'mười'),
  ('wd_dad', 'bố'),
  ('wd_mom', 'mẹ'),
  ('wd_older_brother', 'anh trai'),
  ('wd_older_sister', 'chị gái'),
  ('wd_younger_brother', 'em trai'),
  ('wd_younger_sister', 'em gái'),
  ('wd_friend', 'bạn bè'),
  ('wd_yes', 'phải / là'),
  ('wd_no', 'không'),
  ('wd_student', 'học sinh'),
  ('wd_teacher', 'giáo viên'),
  ('wd_doctor', 'bác sĩ'),
  ('wd_rice', 'cơm'),
  ('wd_noodles', 'mì'),
  ('wd_apple', 'táo'),
  ('wd_how_much', 'bao nhiêu'),
  ('wd_money', 'tiền'),
  ('wd_yuan', 'nhân dân tệ (đồng)'),
  ('wd_kuai', 'tệ (đồng, khẩu ngữ)'),
  ('wd_buy', 'mua'),
  ('wd_sell', 'bán'),
  ('wd_today', 'hôm nay'),
  ('wd_yesterday', 'hôm qua'),
  ('wd_tomorrow', 'ngày mai'),
  ('wd_morning', 'buổi sáng'),
  ('wd_afternoon', 'buổi chiều'),
  ('wd_evening', 'buổi tối'),
  ('wd_now', 'bây giờ'),
  ('wd_week', 'tuần'),
  ('wd_go', 'đi'),
  ('wd_school', 'trường học'),
  ('wd_bus', 'xe buýt'),
  ('wd_taxi', 'taxi'),
  ('wd_train', 'tàu hỏa'),
  ('wd_airport', 'sân bay'),
  ('wd_subway', 'tàu điện ngầm'),
  ('wd_left_turn', 'rẽ trái'),
  ('wd_right_turn', 'rẽ phải'),
  ('wd_straight', 'đi thẳng'),
  ('wd_delicious', 'ngon'),
  ('wd_spicy', 'cay'),
  ('wd_beef', 'thịt bò'),
  ('wd_chicken', 'thịt gà'),
  ('wd_suggest', 'đề nghị / gợi ý'),
  ('wd_decide', 'quyết định'),
  ('wd_help', 'giúp đỡ'),
  ('wd_big', 'to / lớn'),
  ('wd_small', 'nhỏ'),
  ('wd_good', 'tốt'),
  ('wd_expensive', 'đắt'),
  ('wd_meeting', 'cuộc họp'),
  ('wd_schedule', 'lịch trình'),
  ('wd_contract', 'hợp đồng'),
  ('wd_opportunity', 'cơ hội'),
  ('wd_experience', 'kinh nghiệm'),
  ('wd_practice', 'luyện tập / bài tập'),
  ('wd_exam', 'kỳ thi'),
  ('wd_homework', 'bài tập về nhà'),
  ('wd_library', 'thư viện'),
  ('wd_difficult', 'khó'),
  ('wd_easy', 'dễ'),
  ('wd_important', 'quan trọng'),
  ('wd_culture', 'văn hóa'),
  ('wd_history', 'lịch sử'),
  ('wd_environment', 'môi trường'),
  ('wd_future', 'tương lai'),
  ('wd_memory', 'ký ức'),
  ('wd_opinion', 'ý kiến'),
  ('wd_remember', 'nhớ'),
  ('wd_forget', 'quên'),
  ('wd_interesting', 'thú vị'),
  ('wd_boring', 'nhàm chán'),
  ('wd_feel', 'cảm thấy / nghĩ rằng')
) AS v(id, vi)
WHERE w.id = v.id;

ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS stimulus JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS answer_explanation TEXT;

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
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english, init_msg_vi
)
VALUES
('general', 'Free Talk', '💬', 'Practice conversational Chinese on any topic with Xiao Hong.', '你好！很高兴认识你。我们今天聊点什么？', 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Wǒmen jīntiān liáo diǎn shénme?', 'Hello! Nice to meet you. What shall we talk about today?', 'Xin chào! Rất vui được gặp bạn. Hôm nay chúng ta trò chuyện về chủ đề gì nhỉ?'),
('cafe', 'At the Coffee Shop', '☕', 'Practice ordering coffee, tea, and juice in Chinese.', '欢迎光临！请问您要喝点什么？我们有咖啡、茶和果汁。', 'Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme? Wǒmen yǒu kāfēi, chá hé guǒzhī.', 'Welcome! What would you like to drink? We have coffee, tea and juice.', 'Chào mừng quý khách! Bạn muốn uống gì ạ? Chúng tôi có cà phê, trà và nước ép.'),
('directions', 'Asking Directions', '🧭', 'Practice finding your way around town to the station or airport.', '你好！请问地铁站怎么走？', 'Nǐ hǎo! Qǐngwèn dìtiězhàn zěnme zǒu?', 'Hello! Excuse me, how do I get to the subway station?', 'Xin chào! Cho hỏi ga tàu điện ngầm đi đường nào ạ?')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              init_msg_vi = EXCLUDED.init_msg_vi,
              is_active = true;

INSERT INTO chat_scenarios (
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english, init_msg_vi
)
VALUES
('personal-weak', 'Luyện điểm yếu', U&'\+01F3AF', 'Hội thoại dùng các từ và kỹ năng bạn hay sai.', '我们来练习你的难点吧。', 'Wǒmen lái liànxí nǐ de nándiǎn ba.', 'Let us practice your weak spots.', 'Chúng ta cùng luyện những điểm khó của bạn nhé.'),
('personal-list', 'Luyện từ trong list', U&'\+01F4CB', 'AI Tutor ưu tiên từ vựng trong danh sách bạn lưu gần đây.', '请用你保存的词说一句话。', 'Qǐng yòng nǐ bǎocún de cí shuō yí jù huà.', 'Please make a sentence with a word you saved.', 'Hãy dùng một từ bạn đã lưu để đặt một câu.'),
('personal-lesson', 'Ôn bài vừa học', U&'\+01F9E0', 'Luyện hội thoại xoay quanh bài học gần nhất.', '我们复习你刚学的内容。', 'Wǒmen fùxí nǐ gāng xué de nèiróng.', 'Let us review what you just learned.', 'Chúng ta cùng ôn lại nội dung bạn vừa học.')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              init_msg_vi = EXCLUDED.init_msg_vi,
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

UPDATE lessons
SET cefr_level = CASE
  WHEN hsk_level <= 1 THEN 'A1'
  WHEN hsk_level = 2 THEN 'A2'
  WHEN hsk_level = 3 THEN 'B1'
  WHEN hsk_level = 4 THEN 'B2'
  WHEN hsk_level = 5 THEN 'C1'
  ELSE 'C2'
END;

UPDATE words
SET cefr_level = CASE
  WHEN hsk_level <= 1 THEN 'A1'
  WHEN hsk_level = 2 THEN 'A2'
  WHEN hsk_level = 3 THEN 'B1'
  WHEN hsk_level = 4 THEN 'B2'
  WHEN hsk_level = 5 THEN 'C1'
  ELSE 'C2'
END;

INSERT INTO placement_questions (
  id, section, cefr_level, prompt, prompt_hanzi, prompt_pinyin,
  options, correct_index, correct_text, explanation, difficulty, order_num
)
VALUES
('placement_vocab_01', 'vocabulary', 'A1', '你好 means...', '你好', 'ni hao', '["hello", "goodbye", "teacher", "airport"]'::jsonb, 0, 'hello', '你好 is the common greeting for hello.', 1, 10),
('placement_vocab_02', 'vocabulary', 'A1', '谢谢 means...', '谢谢', 'xie xie', '["thank you", "sorry", "water", "student"]'::jsonb, 0, 'thank you', '谢谢 is used to say thank you.', 1, 20),
('placement_vocab_03', 'vocabulary', 'A1', '三 means...', '三', 'san', '["three", "five", "ten", "one"]'::jsonb, 0, 'three', '三 is the number three.', 1, 30),
('placement_vocab_04', 'vocabulary', 'A2', '地铁 means...', '地铁', 'di tie', '["subway", "airport", "library", "contract"]'::jsonb, 0, 'subway', '地铁 means subway or metro.', 2, 40),
('placement_vocab_05', 'vocabulary', 'A2', '机场 means...', '机场', 'ji chang', '["airport", "school", "apple", "meeting"]'::jsonb, 0, 'airport', '机场 means airport.', 2, 50),
('placement_vocab_06', 'vocabulary', 'B1', '建议 means...', '建议', 'jian yi', '["to suggest", "to forget", "expensive", "history"]'::jsonb, 0, 'to suggest', '建议 means to suggest or suggestion.', 3, 60),
('placement_vocab_07', 'vocabulary', 'B1', '经验 means...', '经验', 'jing yan', '["experience", "opportunity", "homework", "culture"]'::jsonb, 0, 'experience', '经验 means experience.', 3, 70),
('placement_grammar_01', 'grammar', 'A1', 'Choose the word: 我___学生。', '我是学生。', 'wo shi xue sheng', '["是", "了", "比", "吧"]'::jsonb, 0, '是', '是 links the subject with a noun.', 1, 80),
('placement_grammar_02', 'grammar', 'A1', 'Choose the word: 你叫什么___？', '你叫什么名字？', 'ni jiao shenme mingzi', '["名字", "学生", "地铁", "合同"]'::jsonb, 0, '名字', '名字 means name.', 1, 90),
('placement_grammar_03', 'grammar', 'A2', 'Choose the completed-action marker: 我吃___苹果。', '我吃了苹果。', 'wo chi le pingguo', '["了", "吗", "比", "在"]'::jsonb, 0, '了', '了 can mark a completed action.', 2, 100),
('placement_grammar_04', 'grammar', 'A2', 'Choose the word: 请问地铁站___走？', '请问地铁站怎么走？', 'qingwen ditie zhan zenme zou', '["怎么", "多少", "什么", "哪里"]'::jsonb, 0, '怎么', '怎么 asks how to do something.', 2, 110),
('placement_grammar_05', 'grammar', 'B1', 'Choose the suggestion particle: 我们去图书馆___。', '我们去图书馆吧。', 'women qu tushuguan ba', '["吧", "了", "比", "是"]'::jsonb, 0, '吧', '吧 softens a sentence into a suggestion.', 3, 120),
('placement_grammar_06', 'grammar', 'B1', 'Choose the comparison word: 今天___昨天冷。', '今天比昨天冷。', 'jintian bi zuotian leng', '["比", "吧", "了", "叫"]'::jsonb, 0, '比', '比 compares two things.', 3, 130),
('placement_grammar_07', 'grammar', 'B1', 'Choose the opinion verb: 我___中文很有意思。', '我觉得中文很有意思。', 'wo juede zhongwen hen you yisi', '["觉得", "帮助", "决定", "练习"]'::jsonb, 0, '觉得', '觉得 introduces an opinion or feeling.', 3, 140),
('placement_reading_01', 'reading', 'A1', '我叫安娜。我是学生。 Who is Anna?', '我叫安娜。我是学生。', 'wo jiao Anna. wo shi xue sheng', '["a student", "a teacher", "a doctor", "a driver"]'::jsonb, 0, 'a student', 'The passage says 我是学生.', 1, 150),
('placement_reading_02', 'reading', 'A1', '今天早上我喝了茶。 What did the speaker drink?', '今天早上我喝了茶。', 'jintian zaoshang wo he le cha', '["tea", "coffee", "water", "juice"]'::jsonb, 0, 'tea', '茶 means tea.', 1, 160),
('placement_reading_03', 'reading', 'A2', '请问，去地铁站怎么走？直走然后左转。 What is the direction?', '请问，去地铁站怎么走？直走然后左转。', 'qingwen, qu ditie zhan zenme zou? zhi zou ranhou zuo zhuan', '["go straight then turn left", "turn right immediately", "take a taxi", "go to the airport"]'::jsonb, 0, 'go straight then turn left', '直走然后左转 means go straight, then turn left.', 2, 170),
('placement_reading_04', 'reading', 'A2', '这个苹果三十块，我买两个。 How much is one apple?', '这个苹果三十块，我买两个。', 'zhe ge pingguo sanshi kuai, wo mai liang ge', '["30 kuai", "2 kuai", "13 kuai", "20 kuai"]'::jsonb, 0, '30 kuai', '三十块 means 30 kuai.', 2, 180),
('placement_reading_05', 'reading', 'B1', '我觉得中文考试有点难，但是很重要。 How does the speaker feel?', '我觉得中文考试有点难，但是很重要。', 'wo juede zhongwen kaoshi youdian nan, danshi hen zhongyao', '["difficult but important", "easy and unimportant", "fun but short", "expensive but useful"]'::jsonb, 0, 'difficult but important', '难 means difficult and 重要 means important.', 3, 190),
('placement_reading_06', 'reading', 'B1', '我们讨论一下合同吧，这是一个好机会。 What do they want to discuss?', '我们讨论一下合同吧，这是一个好机会。', 'women taolun yixia hetong ba, zhe shi yi ge hao jihui', '["contract", "homework", "airport", "history"]'::jsonb, 0, 'contract', '合同 means contract.', 3, 200)
ON CONFLICT (id)
DO UPDATE SET section = EXCLUDED.section,
              cefr_level = EXCLUDED.cefr_level,
              prompt = EXCLUDED.prompt,
              prompt_hanzi = EXCLUDED.prompt_hanzi,
              prompt_pinyin = EXCLUDED.prompt_pinyin,
              options = EXCLUDED.options,
              correct_index = EXCLUDED.correct_index,
              correct_text = EXCLUDED.correct_text,
              explanation = EXCLUDED.explanation,
              difficulty = EXCLUDED.difficulty,
              order_num = EXCLUDED.order_num,
               is_active = true,
              updated_at = now();

COMMIT;

