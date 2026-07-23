// HSK3 (B1) lessons 01-04, authored to replace the shared boilerplate dialogue.
// Line format: [speaker, simplified, pinyin, english, vietnamese]
// Pinyin follows the project convention: unmarked neutral tone (xué sheng), written
// sandhi for 一/不 (yí dìng, bú shì), capitalised proper nouns.

export default {
  'hsk3-l01-standard-study-method': {
    titleZh: '学习方法',
    titleEn: 'Study methods',
    titleVi: 'Phương pháp học',
    summaryEn: 'Two students compare study habits: reviewing a little every day beats cramming, and short daily sessions are easier to keep up.',
    summaryVi: 'Hai bạn học so sánh thói quen học: ôn ít mỗi ngày tốt hơn nhồi nhét, và học từng buổi ngắn thì dễ duy trì hơn.',
    lines: [
      ['A', '你的中文进步得真快，能告诉我你的学习方法吗？', 'Nǐ de Zhōng wén jìn bù de zhēn kuài, néng gào su wǒ nǐ de xué xí fāng fǎ ma?',
        'Your Chinese is improving so fast — can you tell me your study method?',
        'Tiếng Trung của bạn tiến bộ nhanh thật, chia sẻ phương pháp học của bạn được không?'],
      ['B', '其实很简单，我每天早上都花半个小时复习昨天的生词。', 'Qí shí hěn jiǎn dān, wǒ měi tiān zǎo shang dōu huā bàn gè xiǎo shí fù xí zuó tiān de shēng cí.',
        "It's actually simple — every morning I spend half an hour reviewing yesterday's new words.",
        'Thật ra rất đơn giản, mỗi sáng mình đều dành nửa tiếng ôn lại từ mới hôm qua.'],
      ['A', '只复习半个小时就够了吗？我以前一次记五十个，可是很快就忘了。', 'Zhǐ fù xí bàn gè xiǎo shí jiù gòu le ma? Wǒ yǐ qián yí cì jì wǔ shí gè, kě shì hěn kuài jiù wàng le.',
        'Is half an hour really enough? I used to learn fifty at a time, but I forgot them quickly.',
        'Chỉ ôn nửa tiếng là đủ à? Trước đây mình học một lúc năm mươi từ, nhưng quên rất nhanh.'],
      ['B', '一次记太多，当然容易忘。每天少记一些，时间长了就记住了。', 'Yí cì jì tài duō, dāng rán róng yì wàng. Měi tiān shǎo jì yì xiē, shí jiān cháng le jiù jì zhù le.',
        "If you learn too many at once you'll naturally forget them. Learn a few each day and over time they stick.",
        'Học một lúc quá nhiều thì tất nhiên dễ quên. Mỗi ngày học ít một, lâu dần sẽ nhớ được.'],
      ['A', '除了记生词以外，你还做什么练习？', 'Chú le jì shēng cí yǐ wài, nǐ hái zuò shén me liàn xí?',
        'Besides learning new words, what other practice do you do?',
        'Ngoài học từ mới ra, bạn còn luyện tập gì nữa?'],
      ['B', '我一边听课文一边跟着读，这样发音会更清楚。', 'Wǒ yì biān tīng kè wén yì biān gēn zhe dú, zhè yàng fā yīn huì gèng qīng chu.',
        'I listen to the text and read along at the same time — that makes my pronunciation clearer.',
        'Mình vừa nghe bài khóa vừa đọc theo, như vậy phát âm sẽ rõ hơn.'],
      ['A', '听起来不难。可是我总是学两三天就不想学了。', 'Tīng qǐ lái bù nán. Kě shì wǒ zǒng shì xué liǎng sān tiān jiù bù xiǎng xué le.',
        "That doesn't sound hard. But I always study for two or three days and then lose interest.",
        'Nghe có vẻ không khó. Nhưng mình cứ học được hai ba ngày là lại không muốn học nữa.'],
      ['B', '那就把时间定得短一点儿，比如每天只学十五分钟，这样比较容易做到。', 'Nà jiù bǎ shí jiān dìng de duǎn yì diǎnr, bǐ rú měi tiān zhǐ xué shí wǔ fēn zhōng, zhè yàng bǐ jiào róng yì zuò dào.',
        "Then make the sessions shorter — say only fifteen minutes a day. That's much easier to manage.",
        'Vậy thì đặt thời gian ngắn lại thôi, ví dụ mỗi ngày chỉ học mười lăm phút, như vậy sẽ dễ làm được hơn.'],
      ['A', '这个办法真不错，我明天就开始试试。', 'Zhè ge bàn fǎ zhēn bú cuò, wǒ míng tiān jiù kāi shǐ shì shi.',
        "That's a really good approach — I'll start trying it tomorrow.",
        'Cách này hay thật, ngày mai mình sẽ bắt đầu thử.'],
      ['B', '别忘了，学习不用太着急，只要每天进步一点儿就好。', 'Bié wàng le, xué xí bú yòng tài zháo jí, zhǐ yào měi tiān jìn bù yì diǎnr jiù hǎo.',
        "Don't forget: there's no need to rush. As long as you improve a little every day, that's enough.",
        'Đừng quên nhé, học thì không cần vội, chỉ cần mỗi ngày tiến bộ một chút là được.']
    ],
    vocab: [['方法', 'fāng fǎ'], ['进步', 'jìn bù'], ['其实', 'qí shí'], ['简单', 'jiǎn dān'], ['复习', 'fù xí'],
      ['生词', 'shēng cí'], ['忘', 'wàng'], ['容易', 'róng yì'], ['练习', 'liàn xí'], ['课文', 'kè wén'],
      ['清楚', 'qīng chu'], ['办法', 'bàn fǎ'], ['着急', 'zháo jí']],
    grammar: [
      {
        pattern: '除了……以外，还……',
        explEn: 'Adds something on top of what is already mentioned: "besides A, also B". Use 还 (in addition) rather than 都 (which would mean "apart from A, all the rest").',
        explVi: 'Bổ sung thêm ngoài điều đã nêu: "ngoài A ra, còn B". Dùng 还 (còn thêm) chứ không dùng 都 (nghĩa là "trừ A ra thì tất cả").',
        examples: [
          ['除了记生词以外，你还做什么练习？', 'Chú le jì shēng cí yǐ wài, nǐ hái zuò shén me liàn xí?', 'Besides learning new words, what other practice do you do?', 'Ngoài học từ mới ra, bạn còn luyện tập gì nữa?'],
          ['除了汉语以外，他还会说英语。', 'Chú le Hàn yǔ yǐ wài, tā hái huì shuō Yīng yǔ.', 'Besides Chinese, he can also speak English.', 'Ngoài tiếng Hán ra, anh ấy còn nói được tiếng Anh.'],
          ['除了周末以外，我还要上晚上的课。', 'Chú le zhōu mò yǐ wài, wǒ hái yào shàng wǎn shang de kè.', 'Besides weekends, I also have evening classes.', 'Ngoài cuối tuần ra, mình còn phải học lớp buổi tối.']
        ]
      },
      {
        pattern: '一边……一边……',
        explEn: 'Two actions done at the same time by the same subject. Each 一边 comes directly before a verb phrase.',
        explVi: 'Hai hành động cùng một chủ ngữ diễn ra đồng thời. Mỗi 一边 đứng ngay trước một cụm động từ.',
        examples: [
          ['我一边听课文一边跟着读。', 'Wǒ yì biān tīng kè wén yì biān gēn zhe dú.', 'I listen to the text and read along at the same time.', 'Mình vừa nghe bài khóa vừa đọc theo.'],
          ['他一边吃饭一边看手机。', 'Tā yì biān chī fàn yì biān kàn shǒu jī.', 'He eats while looking at his phone.', 'Anh ấy vừa ăn cơm vừa xem điện thoại.'],
          ['我们一边走一边聊。', 'Wǒ men yì biān zǒu yì biān liáo.', "Let's talk as we walk.", 'Chúng mình vừa đi vừa trò chuyện.']
        ]
      },
      {
        pattern: '只要……就……',
        explEn: 'States a sufficient condition: "as long as A, then B". 只要 opens the condition and 就 introduces the result.',
        explVi: 'Nêu điều kiện đủ: "chỉ cần A thì B". 只要 mở đầu điều kiện, 就 dẫn ra kết quả.',
        examples: [
          ['只要每天进步一点儿就好。', 'Zhǐ yào měi tiān jìn bù yì diǎnr jiù hǎo.', 'As long as you improve a little every day, that\'s enough.', 'Chỉ cần mỗi ngày tiến bộ một chút là được.'],
          ['只要你努力，就一定能学好。', 'Zhǐ yào nǐ nǔ lì, jiù yí dìng néng xué hǎo.', 'As long as you work hard, you will definitely learn it well.', 'Chỉ cần bạn cố gắng thì nhất định sẽ học tốt.'],
          ['只要不下雨，我们就去公园。', 'Zhǐ yào bú xià yǔ, wǒ men jiù qù gōng yuán.', "As long as it doesn't rain, we'll go to the park.", 'Chỉ cần trời không mưa là chúng mình sẽ đi công viên.']
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '我每天早上花半个小时___昨天的生词。', pinyin: 'Wǒ měi tiān zǎo shang huā bàn gè xiǎo shí ___ zuó tiān de shēng cí.',
        options: [['复习', 'ôn tập'], ['发音', 'phát âm'], ['进步', 'tiến bộ']], correct: 0,
        explEn: 'B says: 我每天早上都花半个小时复习昨天的生词.', explVi: 'B nói: 我每天早上都花半个小时复习昨天的生词 (mỗi sáng dành nửa tiếng ôn từ mới hôm qua).' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：除了记生词以外，你还做什么练习？ B：___', pinyin: 'A: Chú le jì shēng cí yǐ wài, nǐ hái zuò shén me liàn xí? B: ___',
        options: [['我一边听课文一边跟着读。', 'Mình vừa nghe bài khóa vừa đọc theo.'], ['半个小时。', 'Nửa tiếng.'], ['我不喜欢中文。', 'Mình không thích tiếng Trung.']], correct: 0,
        explEn: 'The question asks what other practice, so the answer must name an activity.', explVi: 'Câu hỏi hỏi còn luyện tập gì, nên câu trả lời phải nêu một hoạt động.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: 'B建议一次记五十个生词。', pinyin: 'B jiàn yì yí cì jì wǔ shí gè shēng cí.',
        isTrue: false, explEn: 'The opposite: B says learning too many at once makes them easy to forget.', explVi: 'Ngược lại: B nói học một lúc quá nhiều thì dễ quên.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '我 / 一边 / 听课文 / 一边 / 跟着读', pinyin: 'wǒ / yì biān / tīng kè wén / yì biān / gēn zhe dú',
        answer: '我一边听课文一边跟着读。', answerVi: 'Mình vừa nghe bài khóa vừa đọc theo.',
        options: [['我', 'mình'], ['一边', 'vừa'], ['听课文', 'nghe bài khóa'], ['一边', 'vừa'], ['跟着读', 'đọc theo']],
        explEn: 'Each 一边 goes directly before its own verb phrase: 一边 + V1 + 一边 + V2.', explVi: 'Mỗi 一边 đứng ngay trước cụm động từ của nó: 一边 + V1 + 一边 + V2.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: 'B每天早上做什么？', pinyin: 'B měi tiān zǎo shang zuò shén me?',
        options: [['复习昨天的生词', 'ôn lại từ mới hôm qua'], ['听音乐', 'nghe nhạc'], ['写作业', 'làm bài tập']], correct: 0,
        explEn: 'B spends half an hour each morning reviewing the previous day\'s new words.', explVi: 'B dành nửa tiếng mỗi sáng để ôn lại từ mới của hôm trước.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '___每天进步一点儿，就一定能学好。', pinyin: '___ měi tiān jìn bù yì diǎnr, jiù yí dìng néng xué hǎo.',
        options: [['只要', 'chỉ cần'], ['因为', 'bởi vì'], ['虽然', 'tuy rằng']], correct: 0,
        explEn: '只要……就…… states a sufficient condition; 因为 and 虽然 do not pair with 就 this way.', explVi: '只要……就…… nêu điều kiện đủ; 因为 và 虽然 không kết hợp với 就 theo cách này.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'A为什么学不下去？', pinyin: 'A wèi shén me xué bu xià qù?',
        line: 6, options: [['学两三天就不想学了', 'học hai ba ngày là không muốn học nữa'], ['没有时间', 'không có thời gian'], ['觉得太容易', 'thấy quá dễ']], correct: 0,
        explEn: 'A says: 我总是学两三天就不想学了.', explVi: 'A nói: 我总是学两三天就不想学了 (cứ học hai ba ngày là không muốn học nữa).' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: 'B为什么建议每天只学十五分钟？', pinyin: 'B wèi shén me jiàn yì měi tiān zhǐ xué shí wǔ fēn zhōng?',
        options: [['时间短，比较容易做到', 'thời gian ngắn nên dễ làm được'], ['十五分钟能记住五十个词', 'mười lăm phút nhớ được năm mươi từ'], ['因为他没有时间', 'vì anh ấy không có thời gian']], correct: 0,
        explEn: 'B ties the shorter session directly to 比较容易做到 — easier to keep up.', explVi: 'B gắn buổi học ngắn với 比较容易做到 – dễ duy trì hơn.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: 'A打算什么时候开始用新方法？', pinyin: 'A dǎ suàn shén me shí hou kāi shǐ yòng xīn fāng fǎ?',
        options: [['明天', 'ngày mai'], ['下个月', 'tháng sau'], ['今天晚上', 'tối nay']], correct: 0,
        explEn: 'A says: 我明天就开始试试.', explVi: 'A nói: 我明天就开始试试 (ngày mai mình sẽ bắt đầu thử).' }
    ],
    questions: [
      { q: 'B每天花多长时间复习生词？', qPinyin: 'B měi tiān huā duō cháng shí jiān fù xí shēng cí?', qEn: 'How long does B spend reviewing new words each day?', qVi: 'Mỗi ngày B dành bao lâu để ôn từ mới?',
        options: [['半个小时', 'nửa tiếng'], ['两三天', 'hai ba ngày'], ['十五分钟', 'mười lăm phút']], correct: 0,
        explEn: 'B says 花半个小时复习昨天的生词. The fifteen minutes is the suggestion made to A later.', explVi: 'B nói 花半个小时复习昨天的生词. Mười lăm phút là gợi ý dành cho A ở phần sau.' },
      { q: 'A以前学生词有什么问题？', qPinyin: 'A yǐ qián xué shēng cí yǒu shén me wèn tí?', qEn: 'What problem did A have when learning new words before?', qVi: 'Trước đây A gặp vấn đề gì khi học từ mới?',
        options: [['一次记太多，很快就忘', 'học một lúc quá nhiều nên quên nhanh'], ['发音不清楚', 'phát âm không rõ'], ['没有课文可以听', 'không có bài khóa để nghe']], correct: 0,
        explEn: 'A used to learn fifty words at a time and forgot them quickly.', explVi: 'A từng học năm mươi từ một lúc và quên rất nhanh.' },
      { q: '根据课文，学习最重要的是什么？', qPinyin: 'Gēn jù kè wén, xué xí zuì zhòng yào de shì shén me?', qEn: 'According to the text, what matters most in studying?', qVi: 'Theo bài khóa, điều quan trọng nhất khi học là gì?',
        options: [['每天进步一点儿', 'mỗi ngày tiến bộ một chút'], ['学得越快越好', 'học càng nhanh càng tốt'], ['一次记很多生词', 'nhớ thật nhiều từ trong một lần']], correct: 0,
        explEn: 'The closing line: 学习不用太着急，只要每天进步一点儿就好.', explVi: 'Câu kết: 学习不用太着急，只要每天进步一点儿就好.' }
    ]
  },

  'hsk3-l02-standard-travel-experience': {
    titleZh: '旅行经历',
    titleEn: 'Travel experience',
    titleVi: 'Trải nghiệm du lịch',
    summaryEn: 'A traveller describes a trip to Yunnan: why they took the train, how they prepared, the rainy day that changed the plan, and what they learned.',
    summaryVi: 'Một người kể chuyến đi Vân Nam: vì sao chọn tàu hỏa, chuẩn bị thế nào, ngày mưa làm đổi kế hoạch, và bài học rút ra.',
    lines: [
      ['A', '你上个月去云南旅行了，玩儿得怎么样？', 'Nǐ shàng gè yuè qù Yún nán lǚ xíng le, wánr de zěn me yàng?',
        'You travelled to Yunnan last month — how was it?', 'Tháng trước bạn đi du lịch Vân Nam, chơi có vui không?'],
      ['B', '特别好！那儿的天气很舒服，我拍了很多照片。', 'Tè bié hǎo! Nàr de tiān qì hěn shū fu, wǒ pāi le hěn duō zhào piàn.',
        'Really great! The weather there was lovely and I took a lot of photos.', 'Cực kỳ tuyệt! Thời tiết ở đó rất dễ chịu, mình chụp được nhiều ảnh.'],
      ['A', '你是坐飞机去的还是坐火车去的？', 'Nǐ shì zuò fēi jī qù de hái shì zuò huǒ chē qù de?',
        'Did you go by plane or by train?', 'Bạn đi bằng máy bay hay tàu hỏa?'],
      ['B', '我是坐火车去的。虽然花的时间比较长，但是一路上都能看到漂亮的地方。', 'Wǒ shì zuò huǒ chē qù de. Suī rán huā de shí jiān bǐ jiào cháng, dàn shì yí lù shang dōu néng kàn dào piào liang de dì fang.',
        'I went by train. It took longer, but you see beautiful places the whole way.', 'Mình đi tàu hỏa. Tuy mất nhiều thời gian hơn nhưng suốt dọc đường đều thấy được những nơi đẹp.'],
      ['A', '一个人去的吗？会不会不太安全？', 'Yí gè rén qù de ma? Huì bu huì bú tài ān quán?',
        "Did you go alone? Wasn't that a bit unsafe?", 'Bạn đi một mình à? Có không an toàn lắm không?'],
      ['B', '我跟两个同学一起去的。去以前我们就把宾馆和车票都准备好了。', 'Wǒ gēn liǎng gè tóng xué yì qǐ qù de. Qù yǐ qián wǒ men jiù bǎ bīn guǎn hé chē piào dōu zhǔn bèi hǎo le.',
        "I went with two classmates. Before we left we'd already sorted out the hotel and the tickets.", 'Mình đi cùng hai bạn học. Trước khi đi tụi mình đã chuẩn bị sẵn khách sạn và vé xe.'],
      ['A', '准备得这么好！有没有遇到什么问题？', 'Zhǔn bèi de zhè me hǎo! Yǒu méi yǒu yù dào shén me wèn tí?',
        'So well prepared! Did you run into any problems?', 'Chuẩn bị chu đáo thế! Có gặp vấn đề gì không?'],
      ['B', '有，第三天下大雨，我们只好在宾馆里休息了一天。', 'Yǒu, dì sān tiān xià dà yǔ, wǒ men zhǐ hǎo zài bīn guǎn lǐ xiū xi le yì tiān.',
        'Yes — on the third day it poured, so we had no choice but to rest at the hotel for a day.', 'Có, ngày thứ ba mưa to nên tụi mình đành nghỉ ở khách sạn một ngày.'],
      ['A', '那也不错，休息一天以后再出去玩儿更舒服。', 'Nà yě bú cuò, xiū xi yì tiān yǐ hòu zài chū qù wánr gèng shū fu.',
        "That's not bad either — going out again after a day's rest is more pleasant.", 'Vậy cũng hay, nghỉ một ngày rồi đi chơi tiếp lại thấy dễ chịu hơn.'],
      ['B', '是啊。这次经历让我明白，旅行的时候计划要简单一点儿。', 'Shì a. Zhè cì jīng lì ràng wǒ míng bai, lǚ xíng de shí hou jì huà yào jiǎn dān yì diǎnr.',
        'Exactly. This trip made me realise that travel plans should be kept simple.', 'Đúng vậy. Chuyến này khiến mình hiểu ra rằng khi đi du lịch thì kế hoạch nên đơn giản một chút.']
    ],
    vocab: [['旅行', 'lǚ xíng'], ['经历', 'jīng lì'], ['照片', 'zhào piàn'], ['火车', 'huǒ chē'], ['飞机', 'fēi jī'],
      ['虽然', 'suī rán'], ['安全', 'ān quán'], ['同学', 'tóng xué'], ['准备', 'zhǔn bèi'], ['宾馆', 'bīn guǎn'],
      ['计划', 'jì huà'], ['舒服', 'shū fu'], ['简单', 'jiǎn dān']],
    grammar: [
      {
        pattern: '是……的',
        explEn: 'Highlights the time, place or manner of a completed past action. The known fact sits outside; 是 … 的 wraps the detail being asked about.',
        explVi: 'Nhấn mạnh thời gian, nơi chốn hoặc cách thức của một hành động đã xảy ra. Sự việc đã biết nằm ngoài; 是 … 的 bao lấy chi tiết được hỏi.',
        examples: [
          ['你是坐飞机去的还是坐火车去的？', 'Nǐ shì zuò fēi jī qù de hái shì zuò huǒ chē qù de?', 'Did you go by plane or by train?', 'Bạn đi bằng máy bay hay tàu hỏa?'],
          ['我是坐火车去的。', 'Wǒ shì zuò huǒ chē qù de.', 'I went by train.', 'Mình đi bằng tàu hỏa.'],
          ['他是去年来北京的。', 'Tā shì qù nián lái Běi jīng de.', 'He came to Beijing last year.', 'Anh ấy đến Bắc Kinh vào năm ngoái.']
        ]
      },
      {
        pattern: '虽然……，但是……',
        explEn: 'Concession: "although A, B". Unlike English, Chinese keeps both halves of the pair.',
        explVi: 'Nhượng bộ: "tuy A nhưng B". Khác tiếng Anh, tiếng Trung giữ cả hai vế của cặp liên từ.',
        examples: [
          ['虽然花的时间比较长，但是一路上都能看到漂亮的地方。', 'Suī rán huā de shí jiān bǐ jiào cháng, dàn shì yí lù shang dōu néng kàn dào piào liang de dì fang.', 'Although it takes longer, you see beautiful places the whole way.', 'Tuy mất nhiều thời gian hơn nhưng suốt dọc đường đều thấy được những nơi đẹp.'],
          ['虽然下雨，但是我们还是去了。', 'Suī rán xià yǔ, dàn shì wǒ men hái shi qù le.', 'Although it was raining, we still went.', 'Tuy trời mưa nhưng chúng mình vẫn đi.'],
          ['虽然他很忙，但是每天都运动。', 'Suī rán tā hěn máng, dàn shì měi tiān dōu yùn dòng.', 'Although he is busy, he exercises every day.', 'Tuy anh ấy rất bận nhưng ngày nào cũng tập thể dục.']
        ]
      },
      {
        pattern: '只好 + 动词',
        explEn: 'Marks a fallback: the speaker had no better option. It comes before the verb and often follows the reason.',
        explVi: 'Diễn tả lựa chọn bất đắc dĩ: người nói không còn cách nào hay hơn. Đứng trước động từ và thường theo sau lý do.',
        examples: [
          ['下大雨，我们只好在宾馆里休息。', 'Xià dà yǔ, wǒ men zhǐ hǎo zài bīn guǎn lǐ xiū xi.', 'It poured, so we had no choice but to rest at the hotel.', 'Mưa to nên tụi mình đành nghỉ ở khách sạn.'],
          ['没有票了，我只好坐公共汽车。', 'Méi yǒu piào le, wǒ zhǐ hǎo zuò gōng gòng qì chē.', 'There were no tickets left, so I had to take the bus.', 'Hết vé rồi nên mình đành đi xe buýt.'],
          ['他不在家，我只好明天再来。', 'Tā bú zài jiā, wǒ zhǐ hǎo míng tiān zài lái.', "He wasn't home, so I had to come again tomorrow.", 'Anh ấy không có nhà nên mình đành mai quay lại.']
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '我___坐火车去的。', pinyin: 'Wǒ ___ zuò huǒ chē qù de.',
        options: [['是', 'là (dùng trong 是…的)'], ['在', 'đang'], ['把', 'đem (giới từ 把)']], correct: 0,
        explEn: 'The 是……的 frame emphasises how the past trip was made.', explVi: 'Cấu trúc 是……的 nhấn mạnh cách thức của chuyến đi đã xảy ra.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：你是一个人去的吗？ B：___', pinyin: 'A: Nǐ shì yí gè rén qù de ma? B: ___',
        options: [['我跟两个同学一起去的。', 'Mình đi cùng hai bạn học.'], ['我拍了很多照片。', 'Mình chụp nhiều ảnh lắm.'], ['天气很舒服。', 'Thời tiết rất dễ chịu.']], correct: 0,
        explEn: 'The question is about who went, so the answer names the companions.', explVi: 'Câu hỏi hỏi đi với ai, nên câu trả lời nêu người đi cùng.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: 'B是坐飞机去云南的。', pinyin: 'B shì zuò fēi jī qù Yún nán de.',
        isTrue: false, explEn: 'B says 我是坐火车去的 — by train, not by plane.', explVi: 'B nói 我是坐火车去的 – đi tàu hỏa chứ không phải máy bay.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '虽然 / 花的时间 / 比较长 / 但是 / 能看到漂亮的地方', pinyin: 'suī rán / huā de shí jiān / bǐ jiào cháng / dàn shì / néng kàn dào piào liang de dì fang',
        answer: '虽然花的时间比较长，但是能看到漂亮的地方。', answerVi: 'Tuy mất nhiều thời gian hơn nhưng thấy được những nơi đẹp.',
        options: [['虽然', 'tuy rằng'], ['花的时间', 'thời gian bỏ ra'], ['比较长', 'khá dài'], ['但是', 'nhưng'], ['能看到漂亮的地方', 'thấy được những nơi đẹp']],
        explEn: '虽然 opens the concession clause and 但是 opens the contrasting result.', explVi: '虽然 mở vế nhượng bộ, 但是 mở vế kết quả tương phản.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '第三天他们为什么没出去玩儿？', pinyin: 'Dì sān tiān tā men wèi shén me méi chū qù wánr?',
        options: [['因为下大雨', 'vì mưa to'], ['因为没有车票', 'vì không có vé xe'], ['因为宾馆很舒服', 'vì khách sạn dễ chịu']], correct: 0,
        explEn: 'On the third day it poured, so they rested at the hotel.', explVi: 'Ngày thứ ba mưa to nên họ nghỉ ở khách sạn.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '没有票了，我们___坐公共汽车。', pinyin: 'Méi yǒu piào le, wǒ men ___ zuò gōng gòng qì chē.',
        options: [['只好', 'đành phải'], ['一边', 'vừa'], ['虽然', 'tuy rằng']], correct: 0,
        explEn: '只好 marks the fallback option after the reason.', explVi: '只好 đánh dấu lựa chọn bất đắc dĩ sau khi nêu lý do.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: '他们去以前准备了什么？', pinyin: 'Tā men qù yǐ qián zhǔn bèi le shén me?',
        line: 6, options: [['宾馆和车票', 'khách sạn và vé xe'], ['照片和地图', 'ảnh và bản đồ'], ['什么都没准备', 'không chuẩn bị gì cả']], correct: 0,
        explEn: 'B says: 去以前我们就把宾馆和车票都准备好了.', explVi: 'B nói: 去以前我们就把宾馆和车票都准备好了.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: 'B为什么选择坐火车？', pinyin: 'B wèi shén me xuǎn zé zuò huǒ chē?',
        options: [['一路上能看到漂亮的地方', 'suốt đường thấy được những nơi đẹp'], ['火车比飞机快', 'tàu hỏa nhanh hơn máy bay'], ['飞机票卖完了', 'vé máy bay đã bán hết']], correct: 0,
        explEn: 'B accepts the longer journey in exchange for the views along the way.', explVi: 'B chấp nhận đi lâu hơn để đổi lấy cảnh đẹp dọc đường.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '这次旅行让B明白了什么？', pinyin: 'Zhè cì lǚ xíng ràng B míng bai le shén me?',
        options: [['计划要简单一点儿', 'kế hoạch nên đơn giản một chút'], ['旅行一定要一个人去', 'du lịch nhất định phải đi một mình'], ['坐飞机比坐火车好', 'đi máy bay tốt hơn tàu hỏa']], correct: 0,
        explEn: 'The closing line: 旅行的时候计划要简单一点儿.', explVi: 'Câu kết: 旅行的时候计划要简单一点儿.' }
    ],
    questions: [
      { q: 'B是怎么去云南的？', qPinyin: 'B shì zěn me qù Yún nán de?', qEn: 'How did B get to Yunnan?', qVi: 'B đến Vân Nam bằng cách nào?',
        options: [['坐火车', 'bằng tàu hỏa'], ['坐飞机', 'bằng máy bay'], ['坐公共汽车', 'bằng xe buýt']], correct: 0,
        explEn: 'B answers the plane-or-train question with 我是坐火车去的.', explVi: 'B trả lời câu hỏi máy bay hay tàu bằng 我是坐火车去的.' },
      { q: 'B跟谁一起去旅行？', qPinyin: 'B gēn shéi yì qǐ qù lǚ xíng?', qEn: 'Who did B travel with?', qVi: 'B đi du lịch cùng ai?',
        options: [['两个同学', 'hai bạn học'], ['一个人', 'đi một mình'], ['他的家人', 'người nhà của mình']], correct: 0,
        explEn: 'B says 我跟两个同学一起去的.', explVi: 'B nói 我跟两个同学一起去的.' },
      { q: '下大雨的那天他们做了什么？', qPinyin: 'Xià dà yǔ de nà tiān tā men zuò le shén me?', qEn: 'What did they do on the day it poured?', qVi: 'Ngày mưa to họ đã làm gì?',
        options: [['在宾馆里休息', 'nghỉ ở khách sạn'], ['去拍照片', 'đi chụp ảnh'], ['坐火车回家', 'đi tàu về nhà']], correct: 0,
        explEn: '我们只好在宾馆里休息了一天.', explVi: '我们只好在宾馆里休息了一天.' }
    ]
  }
};
