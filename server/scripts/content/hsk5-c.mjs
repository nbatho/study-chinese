// HSK5 (C1) lessons 03-04. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l03-standard-professional-email': {
    titleZh: '职业邮件',
    titleEn: 'Professional email',
    titleVi: 'Email công việc',
    summaryEn: 'Writing to a client: how formal to be, why the request goes near the top, how to chase a reply politely, and what to do when the tone has already gone wrong.',
    summaryVi: 'Viết thư cho khách hàng: trang trọng đến đâu, vì sao đề nghị nên đặt ở đầu, cách nhắc hồi âm cho lịch sự, và làm gì khi giọng thư đã lỡ nặng.',
    lines: [
      ['A', '请求应该放在开始还是最后？', 'Qǐng qiú yīng gāi fàng zài kāi shǐ hái shi zuì hòu?',
        'Should the request go at the beginning or at the end?',
        'Đề nghị nên đặt ở đầu hay ở cuối?'],
      ['B', '放在前三行，对方一打开就知道你要什么。', 'Fàng zài qián sān háng, duì fāng yì dǎ kāi jiù zhī dao nǐ yào shén me.',
        'In the first three lines — the moment they open it they know what you want.',
        'Đặt trong ba dòng đầu, đối phương vừa mở là biết bạn cần gì.'],
      ['A', '那客气话呢？完全不写会不会太冷？', 'Nà kè qi huà ne? Wán quán bù xiě huì bu huì tài lěng?',
        'What about the polite phrases? Would leaving them out entirely be too cold?',
        'Vậy còn lời khách sáo? Không viết gì cả có lạnh lùng quá không?'],
      ['B', '写一句就够，长的客气话反而让人怀疑你有什么难说的事。', 'Xiě yí jù jiù gòu, cháng de kè qi huà fǎn ér ràng rén huái yí nǐ yǒu shén me nán shuō de shì.',
        'One line is enough; a long courteous opening actually makes people suspect you have something awkward to say.',
        'Viết một câu là đủ, lời khách sáo dài dòng ngược lại khiến người ta ngờ bạn có chuyện khó nói.'],
      ['A', '如果我写完发现语气太重了呢？', 'Rú guǒ wǒ xiě wán fā xiàn yǔ qì tài zhòng le ne?',
        'What if I finish it and find the tone too harsh?',
        'Nếu viết xong mình thấy giọng nặng quá thì sao?'],
      ['B', '把带情绪的形容词删掉，只留事实和时间，语气自然就平了。', 'Bǎ dài qíng xù de xíng róng cí shān diào, zhǐ liú shì shí hé shí jiān, yǔ qì zì rán jiù píng le.',
        'Delete the adjectives that carry feeling and keep only facts and dates — the tone levels out by itself.',
        'Xóa các tính từ mang cảm xúc, chỉ giữ sự thật và mốc thời gian, giọng văn tự khắc dịu lại.'],
      ['A', '发出去以前还有什么要检查的？', 'Fā chū qù yǐ qián hái yǒu shén me yào jiǎn chá de?',
        'Anything else to check before sending?',
        'Trước khi gửi còn phải kiểm tra gì nữa?'],
      ['B', '看两样：附件在不在，收件人对不对，这两个错最贵。', 'Kàn liǎng yàng: fù jiàn zài bu zài, shōu jiàn rén duì bu duì, zhè liǎng gè cuò zuì guì.',
        'Two things: is the attachment there, and is the recipient right — those two mistakes cost the most.',
        'Xem hai thứ: tệp đính kèm có chưa, người nhận đúng chưa — hai lỗi này đắt giá nhất.']
    ],
    vocab: [['邮件', 'yóu jiàn'], ['客户', 'kè hù'], ['正式', 'zhèng shì'], ['语气', 'yǔ qì'], ['请求', 'qǐng qiú'],
      ['回复', 'huí fù'], ['礼貌', 'lǐ mào'], ['附件', 'fù jiàn'], ['主题', 'zhǔ tí'], ['称呼', 'chēng hu'],
      ['抱歉', 'bào qiàn'], ['及时', 'jí shí'], ['联系', 'lián xì'], ['说明', 'shuō míng'], ['期限', 'qī xiàn'],
      ['表达', 'biǎo dá'], ['确认', 'què rèn'], ['情绪', 'qíng xù']],
    grammar: [
      {
        pattern: '把……删掉',
        explEn: 'Removes something. 掉 is the result complement that marks disappearance, and 把 puts the removed thing before the verb.',
        explVi: 'Loại bỏ cái gì đó. 掉 là bổ ngữ kết quả chỉ sự biến mất, 把 đưa vật bị bỏ ra trước động từ.',
        examples: [
          ['把带情绪的形容词删掉。', 'Bǎ dài qíng xù de xíng róng cí shān diào.', 'Delete the adjectives that carry feeling.', 'Xóa các tính từ mang cảm xúc.'],
          ['把不必要的客气话也删掉。', 'Bǎ bú bì yào de kè qi huà yě shān diào.', 'Cut the unnecessary courtesies.', 'Bỏ những lời khách sáo không cần thiết.'],
          ['他把最后一段整个删掉了。', 'Tā bǎ zuì hòu yí duàn zhěng gè shān diào le.', 'He deleted the entire last paragraph.', 'Anh ấy đã xóa nguyên đoạn cuối.']
        ]
      },
      {
        pattern: '动词 + 不 + 动词（在不在、对不对）',
        explEn: 'A compact checklist question: subject + A-not-A. It asks for confirmation of a state rather than for a decision.',
        explVi: 'Câu hỏi kiểm tra gọn: chủ ngữ + A-không-A. Dùng để xác nhận trạng thái chứ không phải để hỏi quyết định.',
        examples: [
          ['附件在不在，收件人对不对？', 'Fù jiàn zài bu zài, shōu jiàn rén duì bu duì?', 'Is the attachment there, is the recipient right?', 'Tệp đính kèm có chưa, người nhận đúng chưa?'],
          ['先确认时间对不对。', 'Xiān què rèn shí jiān duì bu duì.', 'First confirm whether the time is right.', 'Trước hết xác nhận thời gian có đúng không.'],
          ['你看看这个说法客气不客气。', 'Nǐ kàn kan zhè ge shuō fǎ kè qi bu kè qi.', 'See whether this phrasing is polite enough.', 'Bạn xem cách nói này có lịch sự không.']
        ]
      },
      {
        pattern: '反而 + 动词',
        explEn: 'Introduces the opposite of the expected effect. The expectation is stated just before, and 反而 stands before the verb.',
        explVi: 'Dẫn ra hiệu quả ngược với mong đợi. Điều mong đợi nêu ngay trước, còn 反而 đứng trước động từ.',
        examples: [
          ['长的客气话反而让人怀疑。', 'Cháng de kè qi huà fǎn ér ràng rén huái yí.', 'A long courteous opening actually raises suspicion.', 'Lời khách sáo dài dòng ngược lại khiến người ta nghi ngờ.'],
          ['写得太满，对方反而不愿意读。', 'Xiě de tài mǎn, duì fāng fǎn ér bú yuàn yì dú.', 'Written too densely, the reader is actually less willing to read it.', 'Viết quá kín, đối phương lại càng không muốn đọc.'],
          ['道歉太多，反而显得没有把握。', 'Dào qiàn tài duō, fǎn ér xiǎn de méi yǒu bǎ wò.', 'Too many apologies actually make you look unsure.', 'Xin lỗi quá nhiều lại trông thiếu tự tin.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '一封邮件的前三行',
        titleEn: 'The first three lines',
        titleVi: 'Ba dòng đầu của một email',
        zh: '收件人每天要处理几十封邮件，他决定是否继续读下去，往往只用三行的时间。所以专业的写法是把最重要的信息放在最前面：你是谁、要什么、什么时候要。背景和理由可以放在后面，愿意了解的人自然会往下看。相反，很多人习惯先铺垫半页，写完才提出请求，结果对方读到一半已经放下了。主题行同样重要：写"关于三月报告的两个问题"，比写"询问"有用得多，因为对方在收件箱里就能判断要不要现在打开。清楚不等于不礼貌——把事情说明白，就是对别人时间的尊重。',
        en: 'A recipient handling dozens of emails a day usually decides whether to keep reading within three lines. The professional approach is therefore to put the most important information first: who you are, what you need, and by when. Background and reasons can follow; anyone who wants them will read on. Many people instead spend half a page setting the scene and only then make the request — by which time the reader has put it down. The subject line matters equally: "Two questions about the March report" is far more useful than "Enquiry", because it lets the reader decide from the inbox whether to open it now. Being clear is not the same as being impolite — stating a matter plainly is itself respect for another person\'s time.',
        vi: 'Người nhận mỗi ngày phải xử lý mấy chục email, họ quyết định có đọc tiếp hay không thường chỉ trong ba dòng. Vì vậy cách viết chuyên nghiệp là đặt thông tin quan trọng nhất lên đầu: bạn là ai, cần gì, cần khi nào. Bối cảnh và lý do có thể để phía sau, ai muốn tìm hiểu tự khắc sẽ đọc tiếp. Ngược lại, nhiều người quen dạo đầu nửa trang, viết xong mới nêu đề nghị, kết quả là đối phương đọc đến giữa đã buông. Dòng chủ đề cũng quan trọng như vậy: viết "Hai câu hỏi về báo cáo tháng Ba" hữu ích hơn nhiều so với viết "Hỏi thăm", vì đối phương ngay trong hộp thư đã phán đoán được có cần mở ngay không. Rõ ràng không đồng nghĩa với bất lịch sự – nói rõ sự việc bản thân nó đã là tôn trọng thời gian của người khác.',
        questions: [
          { q: '短文建议把什么放在邮件最前面？', qPinyin: 'Duǎn wén jiàn yì bǎ shén me fàng zài yóu jiàn zuì qián miàn?',
            qEn: 'What does the text say should come first?', qVi: 'Bài đọc khuyên đặt gì lên đầu email?',
            options: [['你是谁、要什么、什么时候要', 'bạn là ai, cần gì, cần khi nào'], ['背景和理由', 'bối cảnh và lý do'], ['客气话', 'lời khách sáo']], correct: 0,
            explEn: '把最重要的信息放在最前面：你是谁、要什么、什么时候要.', explVi: '把最重要的信息放在最前面：你是谁、要什么、什么时候要.' },
          { q: '为什么"关于三月报告的两个问题"比"询问"好？', qPinyin: 'Wèi shén me "guān yú sān yuè bào gào de liǎng gè wèn tí" bǐ "xún wèn" hǎo?',
            qEn: 'Why is the specific subject line better?', qVi: 'Vì sao dòng chủ đề cụ thể lại tốt hơn?',
            options: [['对方在收件箱里就能判断要不要现在打开', 'đối phương ngay trong hộp thư đã biết có cần mở ngay không'], ['因为它更长', 'vì nó dài hơn'], ['因为它更客气', 'vì nó lịch sự hơn']], correct: 0,
            explEn: '因为对方在收件箱里就能判断要不要现在打开.', explVi: '因为对方在收件箱里就能判断要不要现在打开.' },
          { q: '短文怎么看"清楚"和"礼貌"的关系？', qPinyin: 'Duǎn wén zěn me kàn "qīng chu" hé "lǐ mào" de guān xi?',
            qEn: 'How does the text relate clarity and politeness?', qVi: 'Bài đọc nhìn nhận quan hệ giữa "rõ ràng" và "lịch sự" thế nào?',
            options: [['说明白就是尊重别人的时间', 'nói rõ chính là tôn trọng thời gian người khác'], ['越清楚越不礼貌', 'càng rõ càng bất lịch sự'], ['礼貌比清楚重要', 'lịch sự quan trọng hơn rõ ràng']], correct: 0,
            explEn: '清楚不等于不礼貌——把事情说明白，就是对别人时间的尊重.', explVi: '清楚不等于不礼貌——把事情说明白，就是对别人时间的尊重.' }
        ]
      },
      {
        titleZh: '怎么催才不失礼',
        titleEn: 'Chasing a reply without offence',
        titleVi: 'Nhắc hồi âm sao cho không thất lễ',
        zh: '对方一直不回复，可能是忘了，也可能是还在等别人的答复，很少是故意不回你。所以催的邮件应该先按前两种情况来写。有效的写法有三个部分：一句说明背景（"上周三我发过一封关于报价的邮件"），一句给对方台阶（"可能已经在处理，或者邮件被漏掉了"），一句给出具体的时间（"如果本周五之前能回复，我们就来得及安排"）。这三句里没有一个带情绪的词，可是把责任、时间和后果都说清楚了。相反，"为什么还没回复？"这样的句子，只会让对方先想怎么为自己解释，而不是怎么解决问题。',
        en: 'When someone does not reply, they may have forgotten, or may still be waiting on somebody else; rarely are they ignoring you deliberately. A chasing email should therefore assume one of the first two. An effective one has three parts: a line of background ("I wrote last Wednesday about the quotation"), a line that leaves them a way out ("you may already be dealing with it, or the email may have been missed"), and a line giving a concrete date ("if you can reply before Friday we will still have time to arrange it"). Not one of the three carries an emotional word, yet together they make responsibility, timing and consequence clear. By contrast, "why have you not replied?" only makes the other person think about defending themselves rather than solving the problem.',
        vi: 'Đối phương mãi không hồi âm có thể là quên, cũng có thể là còn đang chờ trả lời từ người khác, rất hiếm khi là cố tình phớt lờ bạn. Vì vậy email nhắc nên giả định trước hai khả năng đầu. Cách viết hiệu quả gồm ba phần: một câu nêu bối cảnh ("thứ Tư tuần trước tôi có gửi một email về báo giá"), một câu chừa lối cho đối phương ("có lẽ anh/chị đang xử lý, hoặc email bị lọt mất"), và một câu đưa ra mốc thời gian cụ thể ("nếu trước thứ Sáu tuần này có hồi âm thì chúng tôi còn kịp sắp xếp"). Trong ba câu ấy không có lấy một từ mang cảm xúc, nhưng đã nói rõ trách nhiệm, thời gian và hệ quả. Ngược lại, câu như "sao vẫn chưa trả lời?" chỉ khiến đối phương nghĩ cách giải thích cho mình trước, chứ không phải nghĩ cách giải quyết vấn đề.',
        questions: [
          { q: '短文说对方不回复最可能是什么原因？', qPinyin: 'Duǎn wén shuō duì fāng bù huí fù zuì kě néng shì shén me yuán yīn?',
            qEn: 'What is the most likely reason for no reply?', qVi: 'Bài đọc nói đối phương không hồi âm nhiều khả năng vì sao?',
            options: [['忘了，或者还在等别人的答复', 'quên, hoặc còn đang chờ trả lời từ người khác'], ['故意不回你', 'cố tình không trả lời bạn'], ['不同意你的请求', 'không đồng ý đề nghị của bạn']], correct: 0,
            explEn: '可能是忘了，也可能是还在等别人的答复，很少是故意不回你.', explVi: '可能是忘了，也可能是还在等别人的答复，很少是故意不回你.' },
          { q: '有效的催复邮件包括哪三个部分？', qPinyin: 'Yǒu xiào de cuī fù yóu jiàn bāo kuò nǎ sān gè bù fen?',
            qEn: 'Which three parts make an effective chaser?', qVi: 'Email nhắc hiệu quả gồm ba phần nào?',
            options: [['背景、给对方台阶、具体时间', 'bối cảnh, chừa lối cho đối phương, mốc thời gian cụ thể'], ['问候、批评、请求', 'chào hỏi, phê bình, đề nghị'], ['背景、道歉、结论', 'bối cảnh, xin lỗi, kết luận']], correct: 0,
            explEn: 'The passage lists background, a way out, and a concrete date.', explVi: 'Bài đọc liệt kê bối cảnh, lối thoát cho đối phương và mốc thời gian cụ thể.' },
          { q: '为什么"为什么还没回复？"效果不好？', qPinyin: 'Wèi shén me "wèi shén me hái méi huí fù?" xiào guǒ bù hǎo?',
            qEn: 'Why is "why have you not replied?" ineffective?', qVi: 'Vì sao câu "sao vẫn chưa trả lời?" lại kém hiệu quả?',
            options: [['让对方先想怎么解释自己', 'khiến đối phương nghĩ cách giải thích cho mình trước'], ['因为句子太短', 'vì câu quá ngắn'], ['因为没有主题行', 'vì không có dòng chủ đề']], correct: 0,
            explEn: '只会让对方先想怎么为自己解释，而不是怎么解决问题.', explVi: '只会让对方先想怎么为自己解释，而不是怎么解决问题.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '把带情绪的形容词___。', pinyin: 'Bǎ dài qíng xù de xíng róng cí ___.',
        options: [['删掉', 'xóa đi'], ['删着', 'đang xóa'], ['删过', 'từng xóa'], ['删了没', 'xóa chưa']], correct: 0,
        explEn: 'A 把 sentence needs a result after the verb; 掉 marks the disappearance.', explVi: 'Câu 把 cần bổ ngữ kết quả sau động từ; 掉 chỉ sự biến mất.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '长的客气话___让人怀疑。', pinyin: 'Cháng de kè qi huà ___ ràng rén huái yí.',
        options: [['反而', 'ngược lại'], ['因此', 'do đó'], ['并且', 'hơn nữa'], ['本来', 'vốn dĩ']], correct: 0,
        explEn: '反而 marks the opposite of the expected effect of being polite.', explVi: '反而 đánh dấu hiệu quả ngược với điều người ta mong đợi khi khách sáo.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：请求应该放在开始还是最后？ B：___', pinyin: 'A: Qǐng qiú yīng gāi fàng zài kāi shǐ hái shi zuì hòu? B: ___',
        options: [['放在前三行，对方一打开就知道你要什么。', 'Đặt trong ba dòng đầu, mở ra là biết bạn cần gì.'], ['邮件写得越长越好。', 'Email càng dài càng tốt.'], ['我不常写邮件。', 'Mình không hay viết email.'], ['客户在国外。', 'Khách hàng ở nước ngoài.']], correct: 0,
        explEn: 'The question is about placement, so the answer must give a position and a reason.', explVi: 'Câu hỏi về vị trí, nên câu trả lời phải nêu chỗ đặt và lý do.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，"可能已经在处理"这句话的作用是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, "kě néng yǐ jīng zài chǔ lǐ" zhè jù huà de zuò yòng shì shén me?',
        passage: 2, options: [['给对方一个台阶', 'chừa cho đối phương một lối thoát'], ['说明自己很忙', 'cho thấy mình rất bận'], ['表示不再等了', 'tỏ ý không chờ nữa'], ['提出新的请求', 'nêu một đề nghị mới']], correct: 0,
        explEn: 'It is the second of the three parts: 一句给对方台阶.', explVi: 'Đó là phần thứ hai trong ba phần: 一句给对方台阶.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，写得清楚就显得不够礼貌。', pinyin: 'Gēn jù dì yī piān duǎn wén, xiě de qīng chu jiù xiǎn de bú gòu lǐ mào.',
        isTrue: false, passage: 1,
        explEn: '清楚不等于不礼貌——把事情说明白，就是对别人时间的尊重.', explVi: '清楚不等于不礼貌——把事情说明白，就是对别人时间的尊重.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '道歉 / 太多 / 反而 / 显得 / 没有把握', pinyin: 'dào qiàn / tài duō / fǎn ér / xiǎn de / méi yǒu bǎ wò',
        answer: '道歉太多，反而显得没有把握。', answerVi: 'Xin lỗi quá nhiều lại trông thiếu tự tin.',
        options: [['道歉', 'xin lỗi'], ['太多', 'quá nhiều'], ['反而', 'ngược lại'], ['显得', 'trông có vẻ'], ['没有把握', 'thiếu tự tin']],
        explEn: 'The expectation comes first and 反而 introduces the opposite result before the verb.', explVi: 'Điều mong đợi nêu trước, 反而 dẫn ra kết quả ngược, đứng trước động từ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么先铺垫半页的写法效果不好？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me xiān pū diàn bàn yè de xiě fǎ xiào guǒ bù hǎo?',
        passage: 1, options: [['对方读到一半已经放下了', 'đối phương đọc đến giữa đã buông'], ['因为背景不重要', 'vì bối cảnh không quan trọng'], ['因为纸不够', 'vì không đủ giấy'], ['因为主题行太短', 'vì dòng chủ đề quá ngắn']], correct: 0,
        explEn: '写完才提出请求，结果对方读到一半已经放下了.', explVi: '写完才提出请求，结果对方读到一半已经放下了.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，三句话里没有情绪词为什么反而更有力？', pinyin: 'Gēn jù dì èr piān duǎn wén, sān jù huà lǐ méi yǒu qíng xù cí wèi shén me fǎn ér gèng yǒu lì?',
        passage: 2, options: [['责任、时间和后果都说清楚了', 'trách nhiệm, thời gian và hệ quả đều được nói rõ'], ['因为写得最短', 'vì viết ngắn nhất'], ['因为对方会害怕', 'vì đối phương sẽ sợ'], ['因为不用回复', 'vì khỏi phải hồi âm']], correct: 0,
        explEn: '这三句里没有一个带情绪的词，可是把责任、时间和后果都说清楚了.', explVi: '这三句里没有一个带情绪的词，可是把责任、时间和后果都说清楚了.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说发出去以前要检查哪两样？', pinyin: 'B shuō fā chū qù yǐ qián yào jiǎn chá nǎ liǎng yàng?',
        line: 14, options: [['附件和收件人', 'tệp đính kèm và người nhận'], ['主题和称呼', 'chủ đề và cách xưng hô'], ['时间和地点', 'thời gian và địa điểm'], ['语气和长度', 'giọng văn và độ dài']], correct: 0,
        explEn: 'B says: 附件在不在，收件人对不对，这两个错最贵.', explVi: 'B nói: 附件在不在，收件人对不对，这两个错最贵.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B建议语气太重时怎么改？', pinyin: 'B jiàn yì yǔ qì tài zhòng shí zěn me gǎi?',
        line: 12, options: [['删掉带情绪的形容词，只留事实和时间', 'xóa tính từ mang cảm xúc, chỉ giữ sự thật và thời gian'], ['多写几句道歉', 'viết thêm vài câu xin lỗi'], ['明天再发', 'mai hãy gửi'], ['让别人代写', 'nhờ người khác viết hộ']], correct: 0,
        explEn: 'B says: 把带情绪的形容词删掉，只留事实和时间.', explVi: 'B nói: 把带情绪的形容词删掉，只留事实和时间.' }
    ]
  }
};
