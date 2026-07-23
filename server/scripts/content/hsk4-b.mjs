// HSK4 (B2) lessons 05-08. See hsk4-a.mjs for the spec shape and the pinyin conventions.

export default {
  'hsk4-l03-standard-online-learning': {
    titleZh: '网上学习',
    titleEn: 'Learning online',
    titleVi: 'Học trực tuyến',
    summaryEn: 'Two learners weigh online courses against the classroom: freedom needs a fixed schedule, questions go to the discussion board, and explaining the material back is the real test.',
    summaryVi: 'Hai người học so sánh khóa học trực tuyến với lớp học: tự do thì cần thời khóa biểu cố định, thắc mắc thì đưa lên diễn đàn, và giảng lại nội dung mới là phép thử thật sự.',
    lines: [
      ['A', '网上的课程那么多，我不知道怎么选。', 'Wǎng shàng de kè chéng nà me duō, wǒ bù zhī dao zěn me xuǎn.',
        'There are so many online courses that I do not know how to choose.',
        'Khóa học trên mạng nhiều thế, mình không biết chọn thế nào.'],
      ['B', '先看课程的介绍和别人的评价，再听一两节试试。', 'Xiān kàn kè chéng de jiè shào hé bié rén de píng jià, zài tīng yì liǎng jié shì shi.',
        'Read the course description and other people\'s reviews first, then try one or two sessions.',
        'Trước hết xem giới thiệu khóa học và đánh giá của người khác, rồi nghe thử một hai buổi.'],
      ['A', '我看视频的时候容易分心，一会儿就想做别的。', 'Wǒ kàn shì pín de shí hou róng yì fēn xīn, yí huìr jiù xiǎng zuò bié de.',
        'I get distracted watching videos — after a moment I want to do something else.',
        'Lúc xem video mình dễ mất tập trung, một lát là lại muốn làm việc khác.'],
      ['B', '可以一边看一边做笔记，手一直动着，注意就容易集中。', 'Kě yǐ yì biān kàn yì biān zuò bǐ jì, shǒu yì zhí dòng zhe, zhù yì jiù róng yì jí zhōng.',
        'Take notes while you watch — if your hand keeps moving, your attention stays gathered.',
        'Có thể vừa xem vừa ghi chép, tay không ngừng lại thì dễ tập trung hơn.'],
      ['A', '学完以后怎么知道自己真的懂了？', 'Xué wán yǐ hòu zěn me zhī dao zì jǐ zhēn de dǒng le?',
        'After finishing, how do I know I really understood?',
        'Học xong rồi làm sao biết mình thật sự hiểu?'],
      ['B', '合上电脑，用自己的话把内容讲一遍，讲不出来就是还没懂。', 'Hé shàng diàn nǎo, yòng zì jǐ de huà bǎ nèi róng jiǎng yí biàn, jiǎng bu chū lái jiù shì hái méi dǒng.',
        'Close the laptop and explain the content in your own words; if you cannot, you have not understood it yet.',
        'Gấp máy tính lại, dùng lời của mình giảng lại nội dung; giảng không ra tức là chưa hiểu.'],
      ['A', '这个办法我可以试试。', 'Zhè ge bàn fǎ wǒ kě yǐ shì shi.',
        'I can give that method a try.',
        'Cách này mình có thể thử.'],
      ['B', '网上学习最重要的是自觉，能管好自己就比什么方法都有用。', 'Wǎng shàng xué xí zuì zhòng yào de shì zì jué, néng guǎn hǎo zì jǐ jiù bǐ shén me fāng fǎ dōu yǒu yòng.',
        'The most important thing in online study is self-discipline — managing yourself beats any method.',
        'Quan trọng nhất khi học trực tuyến là tự giác; quản được bản thân thì hơn mọi phương pháp.']
    ],
    vocab: [['课程', 'kè chéng'], ['网上', 'wǎng shàng'], ['自由', 'zì yóu'], ['固定', 'gù dìng'], ['提问', 'tí wèn'],
      ['教室', 'jiào shì'], ['管理', 'guǎn lǐ'], ['好处', 'hǎo chù'], ['视频', 'shì pín'], ['笔记', 'bǐ jì'],
      ['独立', 'dú lì'], ['自觉', 'zì jué'], ['集中', 'jí zhōng'], ['内容', 'nèi róng'], ['复习', 'fù xí'],
      ['坚持', 'jiān chí'], ['评价', 'píng jià']],
    grammar: [
      {
        pattern: '动词 + 得 / 不 + 出来',
        explEn: 'A potential complement for producing something from inside: saying it, working it out, telling things apart. 讲得出来 = can explain; 讲不出来 = cannot.',
        explVi: 'Bổ ngữ khả năng chỉ việc "đưa ra" được: nói ra, nghĩ ra, phân biệt ra. 讲得出来 = giảng ra được; 讲不出来 = không giảng ra được.',
        examples: [
          ['讲不出来就是还没懂。', 'Jiǎng bu chū lái jiù shì hái méi dǒng.', 'If you cannot explain it, you have not understood it.', 'Giảng không ra tức là chưa hiểu.'],
          ['这个问题我马上答不出来。', 'Zhè ge wèn tí wǒ mǎ shàng dá bu chū lái.', 'I cannot answer this question straight away.', 'Câu hỏi này mình không trả lời ra ngay được.'],
          ['他一看就看得出来你没复习。', 'Tā yí kàn jiù kàn de chū lái nǐ méi fù xí.', 'One look and he can tell you have not revised.', 'Anh ấy nhìn một cái là nhận ra bạn chưa ôn bài.']
        ]
      },
      {
        pattern: '比 + 名词 + 都 / 还 + 形容词',
        explEn: 'A superlative dressed as a comparison: "better than any of them". 都 after 比什么 means the comparison covers everything.',
        explVi: 'Dạng so sánh nhất núp dưới hình thức so sánh: "hơn bất cứ cái nào". 都 sau 比什么 cho biết so với tất cả.',
        examples: [
          ['能管好自己就比什么方法都有用。', 'Néng guǎn hǎo zì jǐ jiù bǐ shén me fāng fǎ dōu yǒu yòng.', 'Managing yourself is more useful than any method.', 'Quản được bản thân thì hữu ích hơn mọi phương pháp.'],
          ['自己讲一遍比听十遍还清楚。', 'Zì jǐ jiǎng yí biàn bǐ tīng shí biàn hái qīng chu.', 'Explaining it once yourself is clearer than listening ten times.', 'Tự giảng một lần còn rõ hơn nghe mười lần.'],
          ['固定的时间比什么提醒都有效。', 'Gù dìng de shí jiān bǐ shén me tí xǐng dōu yǒu xiào.', 'A fixed time works better than any reminder.', 'Thời gian cố định hiệu quả hơn mọi lời nhắc.']
        ]
      },
      {
        pattern: '用……把……动词',
        explEn: 'Combines the instrument and the object: 用 introduces the means, 把 puts the thing acted on before the verb.',
        explVi: 'Kết hợp công cụ và đối tượng: 用 nêu phương tiện, 把 đưa đối tượng ra trước động từ.',
        examples: [
          ['用自己的话把内容讲一遍。', 'Yòng zì jǐ de huà bǎ nèi róng jiǎng yí biàn.', 'Explain the content once in your own words.', 'Dùng lời của mình giảng lại nội dung một lần.'],
          ['用笔记本把重点记下来。', 'Yòng bǐ jì běn bǎ zhòng diǎn jì xià lái.', 'Write the key points down in a notebook.', 'Dùng sổ tay ghi lại các ý chính.'],
          ['用一个例子把这个词解释清楚。', 'Yòng yí gè lì zi bǎ zhè ge cí jiě shì qīng chu.', 'Use one example to explain this word clearly.', 'Dùng một ví dụ để giải thích rõ từ này.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '自由的代价',
        titleEn: 'What freedom costs',
        titleVi: 'Cái giá của sự tự do',
        zh: '网上课程最吸引人的地方是自由：什么时候学、学多快，都由自己决定。可是这份自由也是很多人学不下去的原因。在教室里，上课时间是固定的，同学都坐在旁边，你想走神也不太容易；在家里，没有人看着你，一条消息就能把你带走。有经验的学习者会做一件事：给网课定一个和上课一样固定的时间，比如每周二、周四晚上八点到九点，写在日历上，别人问他那个时间有没有空，他会说没有。他们还会准备一个只用来学习的地方，坐下就开始，不做别的。自由不等于随便，能给自己定规则的人，才真正用得上这份自由。',
        en: 'What attracts people most to online courses is freedom: when to study and how fast are entirely up to you. Yet that freedom is also why many people cannot keep going. In a classroom the time is fixed and classmates sit beside you, so drifting off is not easy; at home nobody is watching and a single message can carry you away. Experienced learners do one thing: they give the online course a fixed slot exactly like a class — say Tuesday and Thursday, eight to nine in the evening — and write it in the calendar; if someone asks whether they are free then, they say no. They also keep one place used only for study, sit down and start, and do nothing else there. Freedom is not the same as doing whatever you like; only someone who can set rules for themselves really gets to use it.',
        vi: 'Điều hấp dẫn nhất ở khóa học trực tuyến là sự tự do: học lúc nào, học nhanh bao nhiêu đều do mình quyết định. Nhưng chính sự tự do đó cũng là lý do nhiều người không học tiếp được. Trong lớp, giờ học là cố định, bạn học ngồi bên cạnh, muốn lơ đãng cũng không dễ; ở nhà không ai trông chừng, chỉ một tin nhắn là đủ cuốn bạn đi. Người học có kinh nghiệm làm một việc: đặt cho lớp học trực tuyến một khung giờ cố định như đi học thật, chẳng hạn tối thứ Ba và thứ Năm từ tám đến chín giờ, ghi vào lịch; ai hỏi giờ đó có rảnh không thì họ nói là không. Họ còn chuẩn bị một chỗ chỉ dùng để học, ngồi xuống là bắt đầu, không làm gì khác. Tự do không đồng nghĩa với tùy tiện; chỉ người biết tự đặt ra quy tắc cho mình mới thật sự dùng được sự tự do ấy.',
        questions: [
          { q: '短文认为网上课程最吸引人的是什么？', qPinyin: 'Duǎn wén rèn wéi wǎng shàng kè chéng zuì xī yǐn rén de shì shén me?',
            qEn: 'What does the text say attracts people most to online courses?', qVi: 'Bài đọc cho rằng điều hấp dẫn nhất của khóa học trực tuyến là gì?',
            options: [['自由', 'sự tự do'], ['价格便宜', 'giá rẻ'], ['老师更好', 'giáo viên giỏi hơn']], correct: 0,
            explEn: '最吸引人的地方是自由：什么时候学、学多快，都由自己决定.', explVi: '最吸引人的地方是自由：什么时候学、学多快，都由自己决定.' },
          { q: '有经验的学习者怎么安排网课时间？', qPinyin: 'Yǒu jīng yàn de xué xí zhě zěn me ān pái wǎng kè shí jiān?',
            qEn: 'How do experienced learners schedule an online course?', qVi: 'Người học có kinh nghiệm sắp xếp giờ học trực tuyến thế nào?',
            options: [['定一个和上课一样固定的时间', 'đặt một khung giờ cố định như đi học'], ['有空的时候才学', 'lúc nào rảnh mới học'], ['每天学到很晚', 'ngày nào cũng học đến khuya']], correct: 0,
            explEn: '给网课定一个和上课一样固定的时间…写在日历上.', explVi: '给网课定一个和上课一样固定的时间…写在日历上.' },
          { q: '"自由不等于随便"这句话是什么意思？', qPinyin: '"Zì yóu bù děng yú suí biàn" zhè jù huà shì shén me yì si?',
            qEn: 'What does "freedom is not the same as doing whatever you like" mean?', qVi: 'Câu "tự do không đồng nghĩa với tùy tiện" nghĩa là gì?',
            options: [['要自己给自己定规则', 'phải tự đặt ra quy tắc cho mình'], ['网上学习不好', 'học trực tuyến không tốt'], ['应该回到教室学习', 'nên quay lại lớp học']], correct: 0,
            explEn: '能给自己定规则的人，才真正用得上这份自由.', explVi: '能给自己定规则的人，才真正用得上这份自由.' }
        ]
      },
      {
        titleZh: '怎么知道自己真的懂了',
        titleEn: 'How to know you have learned it',
        titleVi: 'Làm sao biết mình đã học được',
        zh: '很多人学完一节课，觉得"都懂了"，考试的时候却什么也想不起来。原因是看视频的时候，内容是老师讲的，你只是跟着他的想法走，这种"懂"其实是借来的。要检查自己是不是真的明白了，可以用一个简单的办法：合上书和电脑，拿一张白纸，把这节课的重点写出来，再用自己的话讲一遍，最好讲给别人听。写不出来的地方，就是还没明白的地方。另一个办法是给自己出题：这个概念如果换一个例子，还成立吗？能提出问题，说明你已经站在内容外面看它了。学习不是把内容看完，而是把它变成自己能用的东西。',
        en: 'Many people finish a lesson feeling that they "got all of it", then remember nothing in the exam. The reason is that while watching a video the content is the teacher\'s: you are only following their line of thought, and that kind of understanding is borrowed. To check whether you have really learned something, use a simple method: close the book and the laptop, take a blank sheet, write out the key points of the lesson, then say them in your own words — ideally to another person. Wherever you cannot write, you have not learned it. Another method is to set yourself questions: if this idea were given a different example, would it still hold? Being able to raise questions shows you are already standing outside the material and looking at it. Learning is not getting to the end of the content but turning it into something you can use.',
        vi: 'Nhiều người học xong một buổi thấy "hiểu hết rồi", nhưng đến lúc thi lại không nhớ được gì. Nguyên nhân là khi xem video, nội dung là của thầy cô; bạn chỉ đi theo mạch suy nghĩ của họ, kiểu "hiểu" đó thực ra là vay mượn. Muốn kiểm tra mình có thật sự học được hay không, có thể dùng một cách đơn giản: gấp sách và máy tính lại, lấy một tờ giấy trắng, viết ra các ý chính của buổi học, rồi dùng lời mình giảng lại một lần, tốt nhất là giảng cho người khác nghe. Chỗ nào viết không ra chính là chỗ chưa học được. Một cách khác là tự ra đề cho mình: nếu khái niệm này đổi sang ví dụ khác thì còn đúng không? Đặt được câu hỏi tức là bạn đã đứng ngoài nội dung mà nhìn nó. Học không phải là xem hết nội dung, mà là biến nó thành thứ mình dùng được.',
        questions: [
          { q: '为什么看视频的时候觉得"都懂了"？', qPinyin: 'Wèi shén me kàn shì pín de shí hou jué de "dōu dǒng le"?',
            qEn: 'Why does watching a video make you feel you understood everything?', qVi: 'Vì sao khi xem video lại thấy "hiểu hết rồi"?',
            options: [['只是跟着老师的想法走', 'chỉ đi theo mạch suy nghĩ của thầy cô'], ['内容本来就很简单', 'nội dung vốn dĩ rất dễ'], ['已经复习过很多遍', 'đã ôn lại rất nhiều lần']], correct: 0,
            explEn: '你只是跟着他的想法走，这种"懂"其实是借来的.', explVi: '你只是跟着他的想法走，这种"懂"其实是借来的.' },
          { q: '短文说哪里是"还没明白的地方"？', qPinyin: 'Duǎn wén shuō nǎ lǐ shì "hái méi míng bai de dì fang"?',
            qEn: 'Where, according to the text, is what you have not learned?', qVi: 'Theo bài đọc, đâu là "chỗ chưa học được"?',
            options: [['写不出来的地方', 'chỗ viết không ra'], ['老师讲得快的地方', 'chỗ thầy cô giảng nhanh'], ['考试常考的地方', 'chỗ hay ra thi']], correct: 0,
            explEn: '写不出来的地方，就是还没明白的地方.', explVi: '写不出来的地方，就是还没明白的地方.' },
          { q: '能给自己出题说明什么？', qPinyin: 'Néng gěi zì jǐ chū tí shuō míng shén me?',
            qEn: 'What does being able to set yourself questions show?', qVi: 'Việc tự ra đề cho mình cho thấy điều gì?',
            options: [['已经站在内容外面看它了', 'đã đứng ngoài nội dung mà nhìn nó'], ['记住了所有的生词', 'đã nhớ hết từ mới'], ['不需要老师了', 'không cần thầy cô nữa']], correct: 0,
            explEn: '能提出问题，说明你已经站在内容外面看它了.', explVi: '能提出问题，说明你已经站在内容外面看它了.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '这个问题我马上答___出来。', pinyin: 'Zhè ge wèn tí wǒ mǎ shàng dá ___ chū lái.',
        options: [['不', 'không (dạng phủ định)'], ['得', 'được'], ['了', 'rồi'], ['过', 'từng']], correct: 0,
        explEn: 'The negative potential complement is 动词 + 不 + 出来; 得 would mean the opposite.', explVi: 'Bổ ngữ khả năng phủ định là 动词 + 不 + 出来; dùng 得 sẽ mang nghĩa ngược lại.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '能管好自己就比什么方法___有用。', pinyin: 'Néng guǎn hǎo zì jǐ jiù bǐ shén me fāng fǎ ___ yǒu yòng.',
        options: [['都', 'đều'], ['很', 'rất'], ['太', 'quá'], ['最', 'nhất']], correct: 0,
        explEn: '比什么……都…… covers every alternative; 很/太/最 cannot follow a 比 phrase.', explVi: '比什么……都…… bao trùm mọi lựa chọn; 很/太/最 không đứng sau cụm 比.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：学完以后怎么知道自己真的懂了？ B：___', pinyin: 'A: Xué wán yǐ hòu zěn me zhī dao zì jǐ zhēn de dǒng le? B: ___',
        options: [['用自己的话把内容讲一遍。', 'Dùng lời của mình giảng lại nội dung một lần.'], ['这节课有点儿长。', 'Buổi học này hơi dài.'], ['我明天再学。', 'Mai mình học tiếp.'], ['网上课程很自由。', 'Khóa học trực tuyến rất tự do.']], correct: 0,
        explEn: 'The question asks for a way to check understanding, so the answer must name a test.', explVi: 'Câu hỏi hỏi cách kiểm tra mức hiểu, nên câu trả lời phải nêu một phép thử.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据短文，为什么在家学习比在教室难坚持？', pinyin: 'Gēn jù duǎn wén, wèi shén me zài jiā xué xí bǐ zài jiào shì nán jiān chí?',
        passage: 1, options: [['没有人看着，容易被打扰', 'không ai trông chừng, dễ bị làm phiền'], ['家里的电脑比较慢', 'máy tính ở nhà khá chậm'], ['家里没有课本', 'ở nhà không có sách giáo khoa'], ['老师讲得不清楚', 'thầy cô giảng không rõ']], correct: 0,
        explEn: '在家里，没有人看着你，一条消息就能把你带走.', explVi: '在家里，没有人看着你，一条消息就能把你带走.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据短文，看完视频觉得"都懂了"就说明真的明白了。', pinyin: 'Gēn jù duǎn wén, kàn wán shì pín jué de "dōu dǒng le" jiù shuō míng zhēn de míng bai le.',
        isTrue: false, passage: 2,
        explEn: 'The text calls that kind of understanding 借来的 — borrowed from the teacher\'s line of thought.', explVi: 'Bài đọc gọi kiểu hiểu đó là 借来的 – vay mượn từ mạch suy nghĩ của thầy cô.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '用 / 自己的话 / 把 / 内容 / 讲一遍', pinyin: 'yòng / zì jǐ de huà / bǎ / nèi róng / jiǎng yí biàn',
        answer: '用自己的话把内容讲一遍。', answerVi: 'Dùng lời của mình giảng lại nội dung một lần.',
        options: [['用', 'dùng'], ['自己的话', 'lời của mình'], ['把', 'đem'], ['内容', 'nội dung'], ['讲一遍', 'giảng một lần']],
        explEn: 'The instrument phrase 用…… comes first, then 把 brings the object before the verb.', explVi: 'Cụm phương tiện 用…… đứng trước, rồi 把 đưa tân ngữ ra trước động từ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，学习者为什么准备一个只用来学习的地方？', pinyin: 'Gēn jù dì yī piān duǎn wén, xué xí zhě wèi shén me zhǔn bèi yí gè zhǐ yòng lái xué xí de dì fang?',
        passage: 1, options: [['坐下就开始，不做别的', 'ngồi xuống là bắt đầu, không làm việc khác'], ['因为家里人太多', 'vì nhà đông người'], ['为了放更多的书', 'để đựng thêm nhiều sách'], ['因为那里网速快', 'vì ở đó mạng nhanh']], correct: 0,
        explEn: '他们还会准备一个只用来学习的地方，坐下就开始，不做别的.', explVi: '他们还会准备一个只用来学习的地方，坐下就开始，不做别的.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，学习真正的目标是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, xué xí zhēn zhèng de mù biāo shì shén me?',
        passage: 2, options: [['把内容变成自己能用的东西', 'biến nội dung thành thứ mình dùng được'], ['把所有视频看完', 'xem hết mọi video'], ['记住老师说的每句话', 'nhớ từng câu của thầy cô'], ['考试拿高分', 'thi được điểm cao']], correct: 0,
        explEn: '学习不是把内容看完，而是把它变成自己能用的东西.', explVi: '学习不是把内容看完，而是把它变成自己能用的东西.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议看视频的时候做什么？', pinyin: 'B jiàn yì kàn shì pín de shí hou zuò shén me?',
        line: 10, options: [['一边看一边做笔记', 'vừa xem vừa ghi chép'], ['把视频看两遍', 'xem video hai lần'], ['先看后面的内容', 'xem phần sau trước'], ['和同学一起看', 'xem cùng bạn học']], correct: 0,
        explEn: 'B says: 可以一边看一边做笔记，手一直动着.', explVi: 'B nói: 可以一边看一边做笔记，手一直动着.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B认为网上学习最重要的是什么？', pinyin: 'B rèn wéi wǎng shàng xué xí zuì zhòng yào de shì shén me?',
        line: 14, options: [['自觉', 'tự giác'], ['选一个好老师', 'chọn được thầy giỏi'], ['网速要快', 'mạng phải nhanh'], ['每天学得久', 'mỗi ngày học lâu']], correct: 0,
        explEn: 'B says: 网上学习最重要的是自觉.', explVi: 'B nói: 网上学习最重要的是自觉.' }
    ]
  },

  'hsk4-l04-standard-public-transport': {
    titleZh: '公共交通',
    titleEn: 'Public transport',
    titleVi: 'Giao thông công cộng',
    summaryEn: 'A newcomer asks how to get around the city: subway versus driving, what to do on the wrong train, beating the crowds, and why the subway is the reliable choice.',
    summaryVi: 'Người mới đến hỏi cách đi lại trong thành phố: tàu điện ngầm hay lái xe, đi nhầm tàu thì làm gì, tránh giờ đông, và vì sao tàu điện ngầm đáng tin hơn.',
    lines: [
      ['A', '上下班的时候人特别多，有什么办法吗？', 'Shàng xià bān de shí hou rén tè bié duō, yǒu shén me bàn fǎ ma?',
        'It is extremely crowded at commuting times — is there anything I can do?',
        'Giờ đi làm về người rất đông, có cách nào không?'],
      ['B', '可以早出门二十分钟，或者选一条人少一点儿的路线。', 'Kě yǐ zǎo chū mén èr shí fēn zhōng, huò zhě xuǎn yì tiáo rén shǎo yì diǎnr de lù xiàn.',
        'You can leave twenty minutes earlier, or pick a route with fewer people.',
        'Có thể ra khỏi nhà sớm hai mươi phút, hoặc chọn tuyến ít người hơn.'],
      ['A', '我住的地方离地铁站有点儿远。', 'Wǒ zhù de dì fang lí dì tiě zhàn yǒu diǎnr yuǎn.',
        'Where I live is a bit far from the subway station.',
        'Chỗ mình ở hơi xa ga tàu điện ngầm.'],
      ['B', '那可以先骑车到地铁站，很多站外面都能租到自行车。', 'Nà kě yǐ xiān qí chē dào dì tiě zhàn, hěn duō zhàn wài mian dōu néng zū dào zì xíng chē.',
        'Then cycle to the station first — you can rent a bike outside many stations.',
        'Vậy có thể đạp xe đến ga trước, ngoài nhiều ga đều thuê được xe đạp.'],
      ['A', '坐公共汽车会不会更便宜？', 'Zuò gōng gòng qì chē huì bu huì gèng pián yi?',
        'Would taking the bus be cheaper?',
        'Đi xe buýt có rẻ hơn không?'],
      ['B', '票价差不多，可是路上要多久不好说，会受交通情况影响。', 'Piào jià chà bu duō, kě shì lù shang yào duō jiǔ bù hǎo shuō, huì shòu jiāo tōng qíng kuàng yǐng xiǎng.',
        'The fares are similar, but how long it takes is hard to say — it depends on traffic conditions.',
        'Giá vé xấp xỉ nhau, nhưng đi mất bao lâu thì khó nói, còn tùy tình hình giao thông.'],
      ['A', '看来还是坐地铁比较可靠。', 'Kàn lái hái shi zuò dì tiě bǐ jiào kě kào.',
        'It seems the subway is the more reliable choice after all.',
        'Xem ra đi tàu điện ngầm vẫn đáng tin hơn.'],
      ['B', '对，特别是你上班不能迟到的时候。', 'Duì, tè bié shì nǐ shàng bān bù néng chí dào de shí hou.',
        'Right, especially when you cannot be late for work.',
        'Đúng, nhất là khi bạn không được đi làm muộn.']
    ],
    vocab: [['交通', 'jiāo tōng'], ['地铁', 'dì tiě'], ['城市', 'chéng shì'], ['方便', 'fāng biàn'], ['停车', 'tíng chē'],
      ['路线', 'lù xiàn'], ['出发', 'chū fā'], ['迟到', 'chí dào'], ['自行车', 'zì xíng chē'], ['情况', 'qíng kuàng'],
      ['距离', 'jù lí'], ['省', 'shěng'], ['价格', 'jià gé'], ['可靠', 'kě kào'], ['环境', 'huán jìng'],
      ['污染', 'wū rǎn'], ['选择', 'xuǎn zé']],
    grammar: [
      {
        pattern: '受……影响',
        explEn: 'A passive-flavoured pattern: X is affected by Y. 受 takes the source directly, with no 被.',
        explVi: 'Cấu trúc mang sắc thái bị động: X chịu ảnh hưởng của Y. 受 đi thẳng với nguồn tác động, không dùng 被.',
        examples: [
          ['路上要多久会受交通情况影响。', 'Lù shang yào duō jiǔ huì shòu jiāo tōng qíng kuàng yǐng xiǎng.', 'How long the journey takes is affected by traffic conditions.', 'Đi mất bao lâu còn chịu ảnh hưởng của tình hình giao thông.'],
          ['地铁不太受天气影响。', 'Dì tiě bú tài shòu tiān qì yǐng xiǎng.', 'The subway is not much affected by the weather.', 'Tàu điện ngầm ít chịu ảnh hưởng của thời tiết.'],
          ['他的决定受了朋友的影响。', 'Tā de jué dìng shòu le péng you de yǐng xiǎng.', 'His decision was influenced by his friends.', 'Quyết định của anh ấy chịu ảnh hưởng từ bạn bè.']
        ]
      },
      {
        pattern: '又……又……',
        explEn: 'Stacks two qualities that both apply. Both halves must be the same kind of word — two adjectives or two verb phrases.',
        explVi: 'Nêu hai đặc điểm cùng đúng. Hai vế phải cùng loại – cùng là tính từ hoặc cùng là cụm động từ.',
        examples: [
          ['坐地铁又快又便宜。', 'Zuò dì tiě yòu kuài yòu pián yi.', 'The subway is both fast and cheap.', 'Đi tàu điện ngầm vừa nhanh vừa rẻ.'],
          ['这条路又远又不安全。', 'Zhè tiáo lù yòu yuǎn yòu bù ān quán.', 'This road is both far and unsafe.', 'Con đường này vừa xa vừa không an toàn.'],
          ['骑自行车又能锻炼又能省时间。', 'Qí zì xíng chē yòu néng duàn liàn yòu néng shěng shí jiān.', 'Cycling both exercises you and saves time.', 'Đạp xe vừa rèn luyện được vừa tiết kiệm thời gian.']
        ]
      },
      {
        pattern: '离 + 地点 + 远 / 近',
        explEn: 'States distance from a place. 离 marks the reference point; the sentence needs 远, 近 or a measured distance after it — never 从.',
        explVi: 'Nêu khoảng cách so với một nơi. 离 đánh dấu điểm mốc; sau đó phải có 远, 近 hoặc số đo – không dùng 从.',
        examples: [
          ['我住的地方离地铁站有点儿远。', 'Wǒ zhù de dì fang lí dì tiě zhàn yǒu diǎnr yuǎn.', 'Where I live is a bit far from the subway station.', 'Chỗ mình ở hơi xa ga tàu điện ngầm.'],
          ['公司离我家只有三公里。', 'Gōng sī lí wǒ jiā zhǐ yǒu sān gōng lǐ.', 'The office is only three kilometres from my home.', 'Công ty chỉ cách nhà mình ba cây số.'],
          ['这个站离机场很近。', 'Zhè ge zhàn lí jī chǎng hěn jìn.', 'This station is very close to the airport.', 'Ga này rất gần sân bay.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '为什么城市需要公共交通',
        titleEn: 'Why a city needs public transport',
        titleVi: 'Vì sao thành phố cần giao thông công cộng',
        zh: '一个人开车上班，看起来最自由，可是把整个城市放在一起看，结果就不一样了。同样一条路，一辆公共汽车能坐几十个人，而这几十个人如果各开一辆车，路上就要多出几十倍的空间。城市的路不可能一直加宽，所以人越多，开车反而越慢。除了时间，还有价格：养一辆车要花油钱、停车费和修理的钱，这些加起来常常比车票贵得多。空气也是一个原因，车少了，污染自然会减少。当然，公共交通也有它的问题——早晚人多、路线不一定到家门口。比较现实的做法是把两种方式结合起来：远的路坐地铁，最后一两公里骑自行车。这样既省时间，也不必担心停车的问题。',
        en: 'Driving to work alone looks like the freest option, but seen at the scale of a whole city the result is different. On the same road one bus carries dozens of people, and if those dozens each drove, they would take up dozens of times more space. City roads cannot be widened forever, so the more people there are, the slower driving actually becomes. Beyond time there is cost: keeping a car means fuel, parking and repairs, which together often far exceed the price of tickets. Air is another reason — fewer cars, less pollution. Public transport has its own problems, of course: crowds morning and evening, and routes that do not reach your door. The realistic approach is to combine the two: take the subway for the long stretch and cycle the last kilometre or two. That saves time and spares you the worry of parking.',
        vi: 'Một người tự lái xe đi làm nhìn qua thì tự do nhất, nhưng đặt cả thành phố vào mà xem thì kết quả lại khác. Cùng một con đường, một chiếc xe buýt chở được mấy chục người, mà mấy chục người đó nếu mỗi người một xe thì sẽ chiếm gấp mấy chục lần diện tích. Đường trong thành phố không thể mở rộng mãi, nên người càng đông thì lái xe lại càng chậm. Ngoài thời gian còn là giá cả: nuôi một chiếc xe phải tốn tiền xăng, phí gửi xe và tiền sửa chữa, cộng lại thường đắt hơn tiền vé rất nhiều. Không khí cũng là một lý do: xe ít đi thì ô nhiễm tự nhiên giảm. Dĩ nhiên giao thông công cộng cũng có vấn đề của nó – sáng tối đông người, tuyến đường chưa chắc đến tận cửa nhà. Cách làm thực tế hơn là kết hợp cả hai: đoạn xa thì đi tàu điện ngầm, một hai cây số cuối thì đạp xe. Như vậy vừa tiết kiệm thời gian, vừa khỏi lo chỗ đậu xe.',
        questions: [
          { q: '为什么人越多，开车反而越慢？', qPinyin: 'Wèi shén me rén yuè duō, kāi chē fǎn ér yuè màn?',
            qEn: 'Why does driving get slower as more people drive?', qVi: 'Vì sao người càng đông thì lái xe lại càng chậm?',
            options: [['城市的路不可能一直加宽', 'đường thành phố không thể mở rộng mãi'], ['车的速度越来越低', 'tốc độ xe ngày càng thấp'], ['司机不认识路', 'tài xế không thuộc đường']], correct: 0,
            explEn: '城市的路不可能一直加宽，所以人越多，开车反而越慢.', explVi: '城市的路不可能一直加宽，所以人越多，开车反而越慢.' },
          { q: '短文说养一辆车要花哪些钱？', qPinyin: 'Duǎn wén shuō yǎng yí liàng chē yào huā nǎ xiē qián?',
            qEn: 'What costs of car ownership does the text list?', qVi: 'Bài đọc nói nuôi một chiếc xe tốn những khoản nào?',
            options: [['油钱、停车费和修理的钱', 'tiền xăng, phí gửi xe và tiền sửa chữa'], ['只有油钱', 'chỉ tiền xăng'], ['车票和保险', 'tiền vé và bảo hiểm']], correct: 0,
            explEn: '养一辆车要花油钱、停车费和修理的钱.', explVi: '养一辆车要花油钱、停车费和修理的钱.' },
          { q: '短文建议的"比较现实的做法"是什么？', qPinyin: 'Duǎn wén jiàn yì de "bǐ jiào xiàn shí de zuò fǎ" shì shén me?',
            qEn: 'What "realistic approach" does the text propose?', qVi: 'Bài đọc đề xuất "cách làm thực tế hơn" là gì?',
            options: [['远的路坐地铁，最后一两公里骑自行车', 'đoạn xa đi tàu điện ngầm, một hai cây số cuối đạp xe'], ['每天都开车上班', 'ngày nào cũng lái xe đi làm'], ['搬到地铁站旁边住', 'chuyển đến ở cạnh ga tàu']], correct: 0,
            explEn: '远的路坐地铁，最后一两公里骑自行车.', explVi: '远的路坐地铁，最后一两公里骑自行车.' }
        ]
      },
      {
        titleZh: '第一次坐地铁',
        titleEn: 'Riding the subway for the first time',
        titleVi: 'Lần đầu đi tàu điện ngầm',
        zh: '刚到一个新城市，很多人最怕的就是坐错车。其实地铁的设计已经考虑到了这一点。每条线都有颜色和号码，站里的牌子会写清楚这趟车开往哪个方向，只要记住最后一站的名字，就不容易走错。万一真的坐反了，也不必着急：在下一站下车，走到对面上车就行，一般不用另外买票。上车以前先让下车的人出来，这是很多城市共同的习惯；车上人多的时候，往里面走一走，别站在门口。到了早上和晚上人最多的时候，前后差十分钟出门，车里的感觉可能完全不同。第一次也许有点儿紧张，坐过两三次以后，你会发现它比想象中简单得多。',
        en: 'Newly arrived in a city, what many people fear most is getting on the wrong train. In fact the subway is designed with that in mind. Every line has a colour and a number, the signs in the station say which direction a train is heading, and if you remember the name of the terminus you will rarely go wrong. If you really do ride the wrong way there is no need to panic: get off at the next stop, walk to the platform opposite, and take the next train — usually without buying another ticket. Let passengers off before you board; that habit is shared by many cities. When the carriage is full, move inside rather than standing by the doors. At the busiest morning and evening times, leaving ten minutes earlier or later can make the carriage feel completely different. The first ride may be a little nerve-racking, but after two or three you will find it far simpler than you imagined.',
        vi: 'Vừa đến một thành phố mới, điều nhiều người sợ nhất là đi nhầm tàu. Thật ra thiết kế của tàu điện ngầm đã tính đến điều đó. Mỗi tuyến đều có màu và số hiệu, biển trong ga ghi rõ chuyến tàu này chạy về hướng nào, chỉ cần nhớ tên ga cuối là khó mà đi nhầm. Lỡ đi ngược thật thì cũng không cần vội: xuống ở ga kế tiếp, đi sang sân ga đối diện rồi lên chuyến sau là được, thường không phải mua vé khác. Trước khi lên hãy để người xuống ra trước, đó là thói quen chung của nhiều thành phố; lúc đông người thì đi sâu vào trong, đừng đứng ngay cửa. Vào giờ cao điểm sáng tối, ra khỏi nhà sớm hay muộn mười phút thôi cũng đủ khiến cảm giác trong toa hoàn toàn khác. Lần đầu có thể hơi hồi hộp, nhưng đi hai ba lần rồi bạn sẽ thấy nó đơn giản hơn tưởng tượng nhiều.',
        questions: [
          { q: '短文说记住什么就不容易坐错车？', qPinyin: 'Duǎn wén shuō jì zhù shén me jiù bù róng yì zuò cuò chē?',
            qEn: 'What does the text say to remember so you do not board the wrong train?', qVi: 'Bài đọc nói nhớ gì thì khó đi nhầm tàu?',
            options: [['最后一站的名字', 'tên ga cuối'], ['车票的价格', 'giá vé'], ['司机的名字', 'tên tài xế']], correct: 0,
            explEn: '只要记住最后一站的名字，就不容易走错.', explVi: '只要记住最后一站的名字，就不容易走错.' },
          { q: '坐反了方向应该怎么办？', qPinyin: 'Zuò fǎn le fāng xiàng yīng gāi zěn me bàn?',
            qEn: 'What should you do if you ride in the wrong direction?', qVi: 'Nếu đi ngược hướng thì nên làm gì?',
            options: [['下一站下车，走到对面上车', 'xuống ga kế tiếp rồi sang phía đối diện lên tàu'], ['坐到最后一站再回来', 'đi đến ga cuối rồi quay lại'], ['出站重新买票', 'ra khỏi ga mua vé lại']], correct: 0,
            explEn: '在下一站下车，走到对面上车就行.', explVi: '在下一站下车，走到对面上车就行.' },
          { q: '车上人多的时候，短文建议怎么做？', qPinyin: 'Chē shang rén duō de shí hou, duǎn wén jiàn yì zěn me zuò?',
            qEn: 'What does the text advise when the carriage is crowded?', qVi: 'Khi trong toa đông người, bài đọc khuyên làm gì?',
            options: [['往里面走，别站在门口', 'đi vào trong, đừng đứng ở cửa'], ['站在门口方便下车', 'đứng ở cửa cho tiện xuống'], ['等下一趟车', 'chờ chuyến sau']], correct: 0,
            explEn: '车上人多的时候，往里面走一走，别站在门口.', explVi: '车上人多的时候，往里面走一走，别站在门口.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '路上要多久会___交通情况影响。', pinyin: 'Lù shang yào duō jiǔ huì ___ jiāo tōng qíng kuàng yǐng xiǎng.',
        options: [['受', 'chịu'], ['被', 'bị'], ['给', 'cho'], ['让', 'để']], correct: 0,
        explEn: '受……影响 is a fixed frame; 被 would need a different verb after it.', explVi: '受……影响 là khung cố định; dùng 被 thì phải có động từ khác theo sau.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '我家___地铁站只有五百米。', pinyin: 'Wǒ jiā ___ dì tiě zhàn zhǐ yǒu wǔ bǎi mǐ.',
        options: [['离', 'cách'], ['从', 'từ'], ['在', 'ở'], ['向', 'về phía']], correct: 0,
        explEn: '离 marks distance from a point; 从 marks a starting point of movement.', explVi: '离 nêu khoảng cách so với một điểm; 从 nêu điểm xuất phát của chuyển động.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：坐公共汽车会不会更便宜？ B：___', pinyin: 'A: Zuò gōng gòng qì chē huì bu huì gèng pián yi? B: ___',
        options: [['票价差不多，可是路上要多久不好说。', 'Giá vé xấp xỉ nhau, nhưng đi mất bao lâu thì khó nói.'], ['地铁站在那边。', 'Ga tàu ở đằng kia.'], ['我不会开车。', 'Mình không biết lái xe.'], ['这个城市很大。', 'Thành phố này rất lớn.']], correct: 0,
        explEn: 'The question compares cost, so the answer must address fares and what else differs.', explVi: 'Câu hỏi so sánh chi phí, nên câu trả lời phải nói về giá vé và điểm khác biệt còn lại.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '"坐地铁又快又便宜"这句话说明地铁有几个好处？', pinyin: '"Zuò dì tiě yòu kuài yòu pián yi" zhè jù huà shuō míng dì tiě yǒu jǐ gè hǎo chù?',
        options: [['两个：快和便宜', 'hai: nhanh và rẻ'], ['一个：便宜', 'một: rẻ'], ['三个', 'ba'], ['没有说好处', 'không nói về ưu điểm']], correct: 0,
        explEn: '又……又…… stacks two qualities that both apply.', explVi: '又……又…… nêu hai đặc điểm cùng đúng.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: '根据短文，坐反了方向必须出站重新买票。', pinyin: 'Gēn jù duǎn wén, zuò fǎn le fāng xiàng bì xū chū zhàn chóng xīn mǎi piào.',
        isTrue: false, passage: 2,
        explEn: 'The text says 一般不用另外买票 — you normally do not need another ticket.', explVi: 'Bài đọc nói 一般不用另外买票 – thường không phải mua vé khác.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '我家 / 离 / 地铁站 / 有点儿 / 远', pinyin: 'wǒ jiā / lí / dì tiě zhàn / yǒu diǎnr / yuǎn',
        answer: '我家离地铁站有点儿远。', answerVi: 'Nhà mình hơi xa ga tàu điện ngầm.',
        options: [['我家', 'nhà mình'], ['离', 'cách'], ['地铁站', 'ga tàu điện ngầm'], ['有点儿', 'hơi'], ['远', 'xa']],
        explEn: 'The order is 甲 + 离 + 乙 + 远/近, with the degree word before the adjective.', explVi: 'Trật tự là 甲 + 离 + 乙 + 远/近, từ chỉ mức độ đứng trước tính từ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么一辆公共汽车比几十辆小车省空间？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me yí liàng gōng gòng qì chē bǐ jǐ shí liàng xiǎo chē shěng kōng jiān?',
        passage: 1, options: [['一辆车就能坐几十个人', 'một chiếc xe chở được mấy chục người'], ['公共汽车开得比较快', 'xe buýt chạy nhanh hơn'], ['公共汽车比较便宜', 'xe buýt rẻ hơn'], ['小车不能上路', 'xe con không được ra đường']], correct: 0,
        explEn: '一辆公共汽车能坐几十个人，而这几十个人如果各开一辆车，路上就要多出几十倍的空间.', explVi: '一辆公共汽车能坐几十个人，而这几十个人如果各开一辆车，路上就要多出几十倍的空间.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，作者对公共交通的态度是什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, zuò zhě duì gōng gòng jiāo tōng de tài du shì shén me?',
        passage: 1, options: [['支持，但也承认它有问题', 'ủng hộ, nhưng cũng thừa nhận nó có vấn đề'], ['完全反对', 'phản đối hoàn toàn'], ['认为它没有任何问题', 'cho rằng nó không có vấn đề gì'], ['认为开车更好', 'cho rằng lái xe tốt hơn']], correct: 0,
        explEn: 'The text lists the advantages and then adds 当然，公共交通也有它的问题.', explVi: 'Bài đọc nêu ưu điểm rồi bổ sung 当然，公共交通也有它的问题.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议A怎么解决离地铁站远的问题？', pinyin: 'B jiàn yì A zěn me jiě jué lí dì tiě zhàn yuǎn de wèn tí?',
        line: 10, options: [['先骑车到地铁站', 'đạp xe đến ga tàu trước'], ['搬家', 'chuyển nhà'], ['每天打车', 'ngày nào cũng gọi taxi'], ['走路四十分钟', 'đi bộ bốn mươi phút']], correct: 0,
        explEn: 'B says: 那可以先骑车到地铁站，很多站外面都能租到自行车.', explVi: 'B nói: 那可以先骑车到地铁站，很多站外面都能租到自行车.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: '为什么B说地铁比公共汽车可靠？', pinyin: 'Wèi shén me B shuō dì tiě bǐ gōng gòng qì chē kě kào?',
        line: 12, options: [['公共汽车受交通情况影响', 'xe buýt chịu ảnh hưởng của tình hình giao thông'], ['地铁的票更便宜', 'vé tàu điện ngầm rẻ hơn'], ['地铁站离家更近', 'ga tàu gần nhà hơn'], ['公共汽车人更多', 'xe buýt đông người hơn']], correct: 0,
        explEn: 'B says the bus fare is similar but the travel time 会受交通情况影响.', explVi: 'B nói giá vé xe buýt tương đương nhưng thời gian đi 会受交通情况影响.' }
    ]
  }
};
