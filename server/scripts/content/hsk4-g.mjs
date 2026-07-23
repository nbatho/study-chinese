// HSK4 (B2) lesson 13, the level review. See hsk4-a.mjs for the spec shape and conventions.

export default {
  'hsk4-l13-standard-review': {
    titleZh: '学期总复习',
    titleEn: 'Reviewing the term',
    titleVi: 'Tổng ôn cuối kỳ',
    summaryEn: 'Two students plan a term review: explain it aloud instead of rereading, start with what is forgotten fastest, test yourself, and space the sessions out.',
    summaryVi: 'Hai sinh viên lên kế hoạch tổng ôn: giảng thành tiếng thay vì đọc lại, bắt đầu từ phần quên nhanh nhất, tự kiểm tra, và chia nhỏ các buổi ôn.',
    lines: [
      ['A', '怎么知道哪部分最容易忘？', 'Zěn me zhī dao nǎ bù fen zuì róng yì wàng?',
        'How do I know which part I forget fastest?',
        'Làm sao biết phần nào dễ quên nhất?'],
      ['B', '合上书，把这一课的重点说一遍，说不出来的就是。', 'Hé shàng shū, bǎ zhè yí kè de zhòng diǎn shuō yí biàn, shuō bu chū lái de jiù shì.',
        'Close the book and say the key points of the lesson; whatever you cannot say is the answer.',
        'Gấp sách lại, nói lại các ý chính của bài; chỗ nào không nói ra được chính là chỗ đó.'],
      ['A', '我一看书就觉得都会了，一考试就想不起来。', 'Wǒ yí kàn shū jiù jué de dōu huì le, yì kǎo shì jiù xiǎng bu qǐ lái.',
        'When I read the book I feel I know it all, but in the exam I cannot recall anything.',
        'Cứ nhìn sách là mình thấy như thuộc hết, vào thi lại không nhớ ra.'],
      ['B', '因为看是认出来，考试是想出来，两件事不一样。', 'Yīn wèi kàn shì rèn chū lái, kǎo shì shì xiǎng chū lái, liǎng jiàn shì bù yí yàng.',
        'Because reading is recognising while an exam is producing — two different things.',
        'Vì đọc là nhận ra, còn thi là nghĩ ra, hai việc khác nhau.'],
      ['A', '那我应该一次复习几课？', 'Nà wǒ yīng gāi yí cì fù xí jǐ kè?',
        'So how many lessons should I review at a time?',
        'Vậy mỗi lần mình nên ôn mấy bài?'],
      ['B', '两三课就够了，隔两天再回来看一遍，比一天看十课有用。', 'Liǎng sān kè jiù gòu le, gé liǎng tiān zài huí lái kàn yí biàn, bǐ yì tiān kàn shí kè yǒu yòng.',
        'Two or three is enough — coming back to them two days later beats doing ten in one day.',
        'Hai ba bài là đủ, cách hai hôm quay lại xem một lượt còn hữu ích hơn một ngày xem mười bài.'],
      ['A', '这样安排下来，时间好像也不多。', 'Zhè yàng ān pái xià lái, shí jiān hǎo xiàng yě bù duō.',
        'Planned this way, it does not even take much time.',
        'Sắp xếp như vậy thì thời gian hình như cũng không nhiều.'],
      ['B', '对，复习难的不是时间，是方法。', 'Duì, fù xí nán de bú shì shí jiān, shì fāng fǎ.',
        'Right — what makes revision hard is not the time but the method.',
        'Đúng, cái khó của việc ôn tập không phải thời gian mà là phương pháp.']
    ],
    vocab: [['复习', 'fù xí'], ['重点', 'zhòng diǎn'], ['整理', 'zhěng lǐ'], ['记忆', 'jì yì'], ['考试', 'kǎo shì'],
      ['安排', 'ān pái'], ['总结', 'zǒng jié'], ['效率', 'xiào lǜ'], ['坚持', 'jiān chí'], ['方法', 'fāng fǎ'],
      ['判断', 'pàn duàn'], ['理解', 'lǐ jiě'], ['集中', 'jí zhōng'], ['提前', 'tí qián'], ['笔记', 'bǐ jì'],
      ['内容', 'nèi róng'], ['结果', 'jié guǒ']],
    grammar: [
      {
        pattern: '隔 + 时间 + 再……',
        explEn: 'States the gap before repeating an action. 隔 takes a length of time, and 再 introduces the repeat.',
        explVi: 'Nêu khoảng cách trước khi lặp lại hành động. 隔 đi với một quãng thời gian, 再 dẫn ra lần lặp lại.',
        examples: [
          ['隔两天再回来看一遍。', 'Gé liǎng tiān zài huí lái kàn yí biàn.', 'Come back and go through it again two days later.', 'Cách hai hôm quay lại xem một lượt.'],
          ['隔一个星期再做一次这些题。', 'Gé yí gè xīng qī zài zuò yí cì zhè xiē tí.', 'Do these questions again a week later.', 'Cách một tuần làm lại các bài này một lần.'],
          ['隔一天复习，比连着看两小时好。', 'Gé yì tiān fù xí, bǐ lián zhe kàn liǎng xiǎo shí hǎo.', 'Revising every other day beats two hours in one sitting.', 'Cách một ngày ôn một lần tốt hơn ngồi xem liền hai tiếng.']
        ]
      },
      {
        pattern: '难的不是……，是……',
        explEn: 'Names the real difficulty after ruling out the assumed one. The two halves take the same kind of phrase.',
        explVi: 'Nêu cái khó thật sự sau khi loại bỏ cái khó người ta tưởng. Hai vế nhận cùng loại thành phần.',
        examples: [
          ['复习难的不是时间，是方法。', 'Fù xí nán de bú shì shí jiān, shì fāng fǎ.', 'What makes revision hard is not time but method.', 'Cái khó của ôn tập không phải thời gian mà là phương pháp.'],
          ['难的不是开始，是坚持。', 'Nán de bú shì kāi shǐ, shì jiān chí.', 'The hard part is not starting but keeping on.', 'Cái khó không phải bắt đầu mà là kiên trì.'],
          ['难的不是记住，是用出来。', 'Nán de bú shì jì zhù, shì yòng chū lái.', 'The hard part is not memorising but using it.', 'Cái khó không phải nhớ mà là dùng được ra.']
        ]
      },
      {
        pattern: '动词 + 得 / 不 + 起来 (想不起来)',
        explEn: 'Whether something can be brought back or got going. 想不起来 = cannot recall; 说得起来 is not used, so learn the common pairs.',
        explVi: 'Chỉ việc có gợi lại hay khởi động được không. 想不起来 = không nhớ ra; không nói 说得起来, nên hãy nhớ các cặp thông dụng.',
        examples: [
          ['一考试就想不起来。', 'Yì kǎo shì jiù xiǎng bu qǐ lái.', 'In the exam I cannot recall it.', 'Vào thi là không nhớ ra.'],
          ['这个字我想得起来，可是写不出来。', 'Zhè ge zì wǒ xiǎng de qǐ lái, kě shì xiě bu chū lái.', 'I can recall this character but cannot write it.', 'Chữ này mình nhớ ra được nhưng viết không ra.'],
          ['时间太久，名字想不起来了。', 'Shí jiān tài jiǔ, míng zi xiǎng bu qǐ lái le.', 'It has been too long — I cannot recall the name.', 'Lâu quá rồi, tên thì không nhớ ra nữa.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '为什么"看懂了"不等于"明白了"',
        titleEn: 'Why "I followed it" is not "I learned it"',
        titleVi: 'Vì sao "hiểu rồi" chưa phải là "học được"',
        zh: '复习的时候，最舒服的做法是把书再看一遍。字都认识，内容也熟悉，看完感觉很好。可是这种"很好"常常是假的。看书的时候，答案就在眼前，你做的只是认出它；考试的时候，纸上是空的，你得自己把它拿出来。两件事用的是不同的能力，所以只看不练的人，进了考试的时候会突然发现自己什么也想不起来。改的办法就一个：合上书。合上以后，把这一课的内容说给自己听，或者在纸上写下三个重点。哪里卡住了，哪里就是要复习的地方。这个过程比看书累，可是二十分钟的效果，常常比一个小时的"看"还好。',
        en: 'The most comfortable way to revise is to read the book again. The characters are all familiar, the content is known, and it feels good afterwards. But that "good" is usually false. When reading, the answer sits in front of you and all you do is recognise it; in the exam the page is blank and you must produce it yourself. The two use different abilities, so people who only read without practising suddenly find in the exam hall that nothing comes back. There is one fix: close the book. Then say the lesson\'s content to yourself, or write three key points on paper. Wherever you get stuck is what needs revising. The process is more tiring than reading, yet twenty minutes of it often beats an hour of "looking".',
        vi: 'Khi ôn tập, cách dễ chịu nhất là đọc lại sách một lượt. Chữ đều biết, nội dung cũng quen, xem xong thấy rất ổn. Nhưng cái "ổn" ấy thường là giả. Lúc đọc sách, đáp án nằm ngay trước mắt, việc bạn làm chỉ là nhận ra nó; lúc thi, tờ giấy trống trơn, bạn phải tự lấy nó ra. Hai việc dùng những năng lực khác nhau, nên người chỉ đọc mà không luyện, vào phòng thi sẽ đột nhiên thấy mình chẳng nhớ ra gì. Cách sửa chỉ có một: gấp sách lại. Gấp xong rồi, hãy nói nội dung bài học cho chính mình nghe, hoặc viết ra giấy ba ý chính. Chỗ nào tắc thì chỗ đó chính là chỗ cần ôn. Quá trình này mệt hơn đọc sách, nhưng hai mươi phút như vậy thường hiệu quả hơn cả một tiếng "nhìn".',
        questions: [
          { q: '短文说看书时你做的是什么？', qPinyin: 'Duǎn wén shuō kàn shū shí nǐ zuò de shì shén me?',
            qEn: 'What are you doing when you read, according to the text?', qVi: 'Bài đọc nói lúc đọc sách bạn đang làm gì?',
            options: [['认出答案', 'nhận ra đáp án'], ['自己想出答案', 'tự nghĩ ra đáp án'], ['写下答案', 'viết ra đáp án']], correct: 0,
            explEn: '答案就在眼前，你做的只是认出它.', explVi: '答案就在眼前，你做的只是认出它.' },
          { q: '短文给的改法是什么？', qPinyin: 'Duǎn wén gěi de gǎi fǎ shì shén me?',
            qEn: 'What fix does the text offer?', qVi: 'Bài đọc đưa ra cách sửa nào?',
            options: [['合上书，自己说或者写重点', 'gấp sách lại, tự nói hoặc viết ý chính'], ['把书多看两遍', 'đọc sách thêm hai lượt'], ['和同学一起看书', 'cùng bạn học đọc sách']], correct: 0,
            explEn: '改的办法就一个：合上书…把内容说给自己听，或者写下三个重点.', explVi: '改的办法就一个：合上书…把内容说给自己听，或者写下三个重点.' },
          { q: '"哪里卡住了"说明什么？', qPinyin: '"Nǎ lǐ qiǎ zhù le" shuō míng shén me?',
            qEn: 'What does getting stuck tell you?', qVi: 'Chỗ bị tắc cho thấy điều gì?',
            options: [['那里就是要复习的地方', 'đó chính là chỗ cần ôn'], ['那里已经学会了', 'chỗ đó đã học được rồi'], ['那里不会考', 'chỗ đó sẽ không thi']], correct: 0,
            explEn: '哪里卡住了，哪里就是要复习的地方.', explVi: '哪里卡住了，哪里就是要复习的地方.' }
        ]
      },
      {
        titleZh: '把复习分开来做',
        titleEn: 'Spreading revision out',
        titleVi: 'Chia nhỏ việc ôn tập',
        zh: '考试前一天看八个小时，和考试前一个月每天看二十分钟，总的时间差不多，效果却差很多。原因和记忆的规律有关：一样东西刚学完忘得最快，几天以后忘得慢下来。所以在快要忘的时候再看一次，记住的时间就会明显变长；而在一天里重复十遍，第二遍以后几乎没有新的作用。比较实用的安排是：学完那天晚上花五分钟想一想，第二天再看一次，一个星期后再看一次，考试前一周做一次完整的总结。每次不必看全部，只看上一次卡住的部分。这样做还有一个好处：因为每次都很短，人不容易放弃，而坚持下来的复习，才是真正有效率的复习。',
        en: 'Eight hours the day before an exam and twenty minutes a day for four weeks add up to about the same time, yet the results differ widely. The reason lies in how memory works: something just learned is forgotten fastest, and the forgetting slows after a few days. Looking again just as it is about to fade lengthens how long it stays; repeating it ten times within one day, by contrast, adds almost nothing after the second pass. A practical schedule is: five minutes of recall on the evening you learn it, another look the next day, another a week later, and one full summary in the week before the exam. Each session need not cover everything — only what you got stuck on last time. There is a further benefit: because each session is short, people rarely give up, and revision that is kept up is the only revision that is really efficient.',
        vi: 'Xem tám tiếng vào hôm trước ngày thi và mỗi ngày xem hai mươi phút suốt bốn tuần trước kỳ thi có tổng thời gian xấp xỉ nhau, nhưng hiệu quả chênh lệch rất nhiều. Nguyên nhân liên quan đến quy luật của trí nhớ: một thứ vừa học xong thì quên nhanh nhất, vài hôm sau thì quên chậm lại. Vậy nên xem lại đúng lúc sắp quên thì thời gian nhớ được sẽ dài ra rõ rệt; còn lặp lại mười lượt trong một ngày thì từ lượt thứ hai trở đi gần như không có tác dụng mới. Cách sắp xếp thiết thực là: tối hôm học xong dành năm phút hồi tưởng, hôm sau xem lại một lần, một tuần sau xem lại một lần nữa, và trước kỳ thi một tuần thì làm một bản tổng kết đầy đủ. Mỗi lần không cần xem hết, chỉ xem phần lần trước bị tắc. Cách này còn một cái lợi nữa: vì mỗi lần đều rất ngắn nên người ta khó bỏ cuộc, mà việc ôn tập duy trì được mới là ôn tập thật sự hiệu quả.',
        questions: [
          { q: '短文说一样东西什么时候忘得最快？', qPinyin: 'Duǎn wén shuō yí yàng dōng xi shén me shí hou wàng de zuì kuài?',
            qEn: 'When is something forgotten fastest?', qVi: 'Bài đọc nói một thứ quên nhanh nhất vào lúc nào?',
            options: [['刚学完的时候', 'lúc vừa học xong'], ['一个月以后', 'sau một tháng'], ['考试以后', 'sau kỳ thi']], correct: 0,
            explEn: '一样东西刚学完忘得最快，几天以后忘得慢下来.', explVi: '一样东西刚学完忘得最快，几天以后忘得慢下来.' },
          { q: '在一天里重复十遍效果怎么样？', qPinyin: 'Zài yì tiān lǐ chóng fù shí biàn xiào guǒ zěn me yàng?',
            qEn: 'How effective is repeating something ten times in one day?', qVi: 'Lặp lại mười lượt trong một ngày thì hiệu quả ra sao?',
            options: [['第二遍以后几乎没有新的作用', 'từ lượt thứ hai trở đi gần như không có tác dụng mới'], ['比分开做还好', 'còn tốt hơn chia nhỏ ra'], ['能一直记住', 'nhớ được mãi']], correct: 0,
            explEn: '在一天里重复十遍，第二遍以后几乎没有新的作用.', explVi: '在一天里重复十遍，第二遍以后几乎没有新的作用.' },
          { q: '每次复习为什么不必看全部？', qPinyin: 'Měi cì fù xí wèi shén me bú bì kàn quán bù?',
            qEn: 'Why need each session not cover everything?', qVi: 'Vì sao mỗi lần ôn không cần xem hết?',
            options: [['只看上一次卡住的部分就够了', 'chỉ xem phần lần trước bị tắc là đủ'], ['因为时间不够', 'vì không đủ thời gian'], ['因为老师不要求', 'vì thầy cô không yêu cầu']], correct: 0,
            explEn: '每次不必看全部，只看上一次卡住的部分.', explVi: '每次不必看全部，只看上一次卡住的部分.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___两天再回来看一遍。', pinyin: '___ liǎng tiān zài huí lái kàn yí biàn.',
        options: [['隔', 'cách'], ['过', 'qua'], ['从', 'từ'], ['离', 'cách (khoảng cách)']], correct: 0,
        explEn: '隔 + a length of time states the gap before repeating; 离 marks distance, not intervals.', explVi: '隔 + quãng thời gian nêu khoảng cách trước khi lặp lại; 离 chỉ khoảng cách, không phải quãng nghỉ.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '时间太久，名字想___起来了。', pinyin: 'Shí jiān tài jiǔ, míng zi xiǎng ___ qǐ lái le.',
        options: [['不', 'không'], ['得', 'được'], ['了', 'rồi'], ['过', 'từng']], correct: 0,
        explEn: '想不起来 is the negative potential complement: unable to recall.', explVi: '想不起来 là bổ ngữ khả năng phủ định: không nhớ ra được.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：怎么知道哪部分最容易忘？ B：___', pinyin: 'A: Zěn me zhī dao nǎ bù fen zuì róng yì wàng? B: ___',
        options: [['合上书，说不出来的就是。', 'Gấp sách lại, chỗ nào không nói ra được chính là chỗ đó.'], ['这本书很厚。', 'Cuốn sách này rất dày.'], ['考试在下星期。', 'Thi vào tuần sau.'], ['我每天看两个小时。', 'Mỗi ngày mình xem hai tiếng.']], correct: 0,
        explEn: 'The question asks how to find the weak part, so the answer must give a test.', explVi: 'Câu hỏi hỏi cách tìm phần yếu, nên câu trả lời phải nêu một phép thử.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第一篇短文，看书和考试用的能力有什么不同？', pinyin: 'Gēn jù dì yī piān duǎn wén, kàn shū hé kǎo shì yòng de néng lì yǒu shén me bù tóng?',
        passage: 1, options: [['一个是认出来，一个是自己拿出来', 'một bên là nhận ra, một bên là tự lấy ra'], ['一个快一个慢', 'một bên nhanh một bên chậm'], ['一个需要笔记', 'một bên cần ghi chép'], ['没有什么不同', 'không khác gì nhau']], correct: 0,
        explEn: '看书的时候，答案就在眼前…考试的时候，纸上是空的，你得自己把它拿出来.', explVi: '看书的时候，答案就在眼前…考试的时候，纸上是空的，你得自己把它拿出来.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第二篇短文，考试前一天看八个小时和分开一个月看效果一样。', pinyin: 'Gēn jù dì èr piān duǎn wén, kǎo shì qián yì tiān kàn bā gè xiǎo shí hé fēn kāi yí gè yuè kàn xiào guǒ yí yàng.',
        isTrue: false, passage: 2,
        explEn: '总时间差不多，效果却差很多.', explVi: '总时间差不多，效果却差很多.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '复习 / 难的 / 不是 / 时间 / 是方法', pinyin: 'fù xí / nán de / bú shì / shí jiān / shì fāng fǎ',
        answer: '复习难的不是时间，是方法。', answerVi: 'Cái khó của ôn tập không phải thời gian mà là phương pháp.',
        options: [['复习', 'ôn tập'], ['难的', 'cái khó'], ['不是', 'không phải'], ['时间', 'thời gian'], ['是方法', 'mà là phương pháp']],
        explEn: 'The assumed difficulty follows 不是 and the real one follows 是.', explVi: 'Cái khó người ta tưởng đứng sau 不是, cái khó thật đứng sau 是.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，为什么二十分钟比一个小时还有用？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me èr shí fēn zhōng bǐ yí gè xiǎo shí hái yǒu yòng?',
        passage: 1, options: [['因为练的是考试时真正要用的能力', 'vì luyện đúng năng lực thật sự cần khi thi'], ['因为时间短更容易集中', 'vì thời gian ngắn dễ tập trung hơn'], ['因为书太厚了', 'vì sách quá dày'], ['因为老师这样要求', 'vì thầy cô yêu cầu vậy']], correct: 0,
        explEn: 'Closing the book trains producing the answer, which is what the exam asks for.', explVi: 'Gấp sách lại là luyện việc tự đưa ra đáp án, đúng thứ kỳ thi đòi hỏi.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，为什么每次复习都很短反而好？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me měi cì fù xí dōu hěn duǎn fǎn ér hǎo?',
        passage: 2, options: [['人不容易放弃，能坚持下来', 'người ta khó bỏ cuộc, duy trì được'], ['因为可以少学一些', 'vì học được ít hơn'], ['因为老师看不见', 'vì thầy cô không thấy'], ['因为考试内容不多', 'vì nội dung thi không nhiều']], correct: 0,
        explEn: '因为每次都很短，人不容易放弃，而坚持下来的复习，才是真正有效率的复习.', explVi: '因为每次都很短，人不容易放弃，而坚持下来的复习，才是真正有效率的复习.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议一次复习几课？', pinyin: 'B jiàn yì yí cì fù xí jǐ kè?',
        line: 12, options: [['两三课', 'hai ba bài'], ['十课', 'mười bài'], ['一课', 'một bài'], ['全部', 'toàn bộ']], correct: 0,
        explEn: 'B says: 两三课就够了，隔两天再回来看一遍.', explVi: 'B nói: 两三课就够了，隔两天再回来看一遍.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么说看书和考试不一样？', pinyin: 'B wèi shén me shuō kàn shū hé kǎo shì bù yí yàng?',
        line: 10, options: [['看是认出来，考试是想出来', 'đọc là nhận ra, thi là nghĩ ra'], ['考试的时间比较短', 'thời gian thi ngắn hơn'], ['书上的内容更多', 'nội dung trong sách nhiều hơn'], ['考试不用复习', 'thi thì không cần ôn']], correct: 0,
        explEn: 'B says: 看是认出来，考试是想出来，两件事不一样.', explVi: 'B nói: 看是认出来，考试是想出来，两件事不一样.' }
    ]
  }
};
