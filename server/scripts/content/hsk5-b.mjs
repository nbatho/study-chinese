// HSK5 (C1) lessons 02-04. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l02-standard-academic-reading': {
    titleZh: '读学术文章',
    titleEn: 'Reading academic writing',
    titleVi: 'Đọc văn bản học thuật',
    summaryEn: 'A student learns to read a paper by structure rather than sentence by sentence: claim, evidence, limits, and where the author actually disagrees with others.',
    summaryVi: 'Một sinh viên học cách đọc bài nghiên cứu theo cấu trúc thay vì từng câu: luận điểm, bằng chứng, giới hạn, và chỗ tác giả thật sự khác người khác.',
    lines: [
      ['A', '可是每一段我都觉得有道理，怎么分得出强弱？', 'Kě shì měi yí duàn wǒ dōu jué de yǒu dào li, zěn me fēn de chū qiáng ruò?',
        'But every paragraph seems reasonable to me — how do I tell the strong parts from the weak?',
        'Nhưng đoạn nào mình cũng thấy có lý, làm sao phân biệt được chỗ mạnh chỗ yếu?'],
      ['B', '看每个观点后面跟着什么：数据、例子，还是另一个观点。', 'Kàn měi gè guān diǎn hòu miàn gēn zhe shén me: shù jù, lì zi, hái shi lìng yí gè guān diǎn.',
        'Look at what follows each claim: data, an example, or merely another claim.',
        'Xem sau mỗi luận điểm là gì: số liệu, ví dụ, hay lại là một luận điểm khác.'],
      ['A', '如果后面还是观点呢？', 'Rú guǒ hòu miàn hái shi guān diǎn ne?',
        'And if what follows is another claim?',
        'Nếu phía sau vẫn là luận điểm thì sao?'],
      ['B', '那这一段就只是重复，没有真正的支持。', 'Nà zhè yí duàn jiù zhǐ shì chóng fù, méi yǒu zhēn zhèng de zhī chí.',
        'Then that paragraph is only repetition, with no real support.',
        'Vậy thì đoạn đó chỉ là lặp lại, không có sự chứng minh thật sự.'],
      ['A', '作者自己承认的不足，要不要重视？', 'Zuò zhě zì jǐ chéng rèn de bù zú, yào bu yào zhòng shì?',
        'Should I pay attention to the limitations the author admits?',
        'Những hạn chế tác giả tự thừa nhận có cần chú ý không?'],
      ['B', '要，那一段常常最诚实，也最容易看出结论能推到多远。', 'Yào, nà yí duàn cháng cháng zuì chéng shí, yě zuì róng yì kàn chū jié lùn néng tuī dào duō yuǎn.',
        'Yes — that section is often the most honest, and shows best how far the conclusion can be pushed.',
        'Có, đoạn đó thường thành thật nhất, và cũng dễ thấy nhất kết luận có thể đi xa đến đâu.'],
      ['A', '这样读一篇要花不少时间吧？', 'Zhè yàng dú yì piān yào huā bù shǎo shí jiān ba?',
        'Reading one paper this way must take quite a while.',
        'Đọc một bài theo cách này chắc mất khá nhiều thời gian nhỉ?'],
      ['B', '第一篇很慢，读到第十篇，你三分钟就知道值不值得细读。', 'Dì yī piān hěn màn, dú dào dì shí piān, nǐ sān fēn zhōng jiù zhī dao zhí bu zhí de xì dú.',
        'The first is slow; by the tenth you can tell in three minutes whether it deserves a close reading.',
        'Bài đầu thì chậm, đến bài thứ mười thì ba phút là bạn biết có đáng đọc kỹ hay không.']
    ],
    vocab: [['论文', 'lùn wén'], ['结论', 'jié lùn'], ['证据', 'zhèng jù'], ['支持', 'zhī chí'], ['研究', 'yán jiū'],
      ['观点', 'guān diǎn'], ['作者', 'zuò zhě'], ['逻辑', 'luó ji'], ['分析', 'fēn xī'], ['数据', 'shù jù'],
      ['结构', 'jié gòu'], ['主题', 'zhǔ tí'], ['前提', 'qián tí'], ['参考', 'cān kǎo'], ['资料', 'zī liào'],
      ['总结', 'zǒng jié'], ['重复', 'chóng fù'], ['承认', 'chéng rèn']],
    grammar: [
      {
        pattern: '动词 + 得出 / 不出',
        explEn: 'Whether an act of judgement can succeed. 分得出 = can tell apart; 看不出 = cannot make out.',
        explVi: 'Chỉ việc phán đoán có thành hay không. 分得出 = phân biệt được; 看不出 = không nhận ra được.',
        examples: [
          ['怎么分得出强弱？', 'Zěn me fēn de chū qiáng ruò?', 'How can one tell the strong from the weak?', 'Làm sao phân biệt được mạnh yếu?'],
          ['从这段话看不出他的前提。', 'Cóng zhè duàn huà kàn bu chū tā de qián tí.', 'This passage does not reveal his premise.', 'Từ đoạn này không thấy ra được tiền đề của anh ấy.'],
          ['数据太少，得不出可靠的结论。', 'Shù jù tài shǎo, dé bu chū kě kào de jié lùn.', 'With so little data no reliable conclusion can be drawn.', 'Số liệu quá ít, không rút ra được kết luận đáng tin.']
        ]
      },
      {
        pattern: '要不要 + 动词',
        explEn: 'The A-not-A form used to ask for advice about whether to do something. It is softer than 应该……吗.',
        explVi: 'Dạng A-không-A dùng để hỏi ý kiến về việc có nên làm hay không. Nhẹ hơn 应该……吗.',
        examples: [
          ['作者承认的不足，要不要重视？', 'Zuò zhě chéng rèn de bù zú, yào bu yào zhòng shì?', 'Should the limitations the author admits be taken seriously?', 'Hạn chế tác giả thừa nhận có cần coi trọng không?'],
          ['这些资料要不要都看一遍？', 'Zhè xiē zī liào yào bu yào dōu kàn yí biàn?', 'Should all these materials be read through?', 'Những tài liệu này có cần đọc hết một lượt không?'],
          ['结论要不要写在最前面？', 'Jié lùn yào bu yào xiě zài zuì qián miàn?', 'Should the conclusion go right at the front?', 'Kết luận có nên viết ngay ở đầu không?']
        ]
      },
      {
        pattern: '读到第……，就……',
        explEn: 'Marks the point in a sequence at which something changes. 到 + an ordinal sets the threshold, and 就 states the new result.',
        explVi: 'Đánh dấu điểm trong một chuỗi mà từ đó có thay đổi. 到 + số thứ tự nêu ngưỡng, 就 nêu kết quả mới.',
        examples: [
          ['读到第十篇，三分钟就知道值不值得细读。', 'Dú dào dì shí piān, sān fēn zhōng jiù zhī dao zhí bu zhí de xì dú.', 'By the tenth paper, three minutes tell you whether it merits close reading.', 'Đến bài thứ mười thì ba phút là biết có đáng đọc kỹ không.'],
          ['写到第三遍，结构就清楚了。', 'Xiě dào dì sān biàn, jié gòu jiù qīng chu le.', 'By the third draft the structure becomes clear.', 'Viết đến lần thứ ba thì cấu trúc trở nên rõ ràng.'],
          ['做到第五个，方法就熟悉了。', 'Zuò dào dì wǔ gè, fāng fǎ jiù shú xī le.', 'By the fifth one the method feels familiar.', 'Làm đến cái thứ năm thì đã quen phương pháp.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '一篇论文的骨架',
        titleEn: 'The skeleton of a paper',
        titleVi: 'Bộ khung của một bài nghiên cứu',
        zh: '学术文章看起来复杂，其实结构相当固定：作者先说别人已经研究了什么，再指出还有哪个问题没解决，然后说明自己用什么方法、得到什么结果，最后回答"这说明了什么"。知道这个骨架以后，读法就变了——不必从第一个字读到最后一个字，而是先找出这四个位置。第一遍只读第一段、结论和每一段的第一句，用五分钟画出整篇文章的地图；第二遍再回到自己关心的那一部分细看。很多人读得慢，不是因为读得不够仔细，而是因为一开始就陷进了细节，读到一半已经忘了作者到底想证明什么。先看骨架，再看肉，这个顺序几乎适用于所有说理的文章。',
        en: 'Academic writing looks complicated, but its structure is fairly fixed: the author first says what others have studied, then points to a question still unanswered, then explains the method used and the results obtained, and finally answers "what does this show?". Once you know that skeleton the way you read changes — instead of going from the first word to the last, you locate those four positions. On a first pass read only the opening, the conclusion and the first sentence of each paragraph, drawing a map of the whole in five minutes; on a second pass return to the part you care about. Many people read slowly not because they read carelessly but because they sink into detail from the start and are halfway through before realising they have forgotten what the author set out to prove. Skeleton first, flesh second: the order applies to almost any piece of reasoning.',
        vi: 'Văn bản học thuật nhìn có vẻ phức tạp, nhưng cấu trúc thì khá cố định: tác giả trước hết nói người khác đã nghiên cứu những gì, rồi chỉ ra còn vấn đề nào chưa giải quyết, sau đó trình bày mình dùng phương pháp gì, thu được kết quả gì, và cuối cùng trả lời "điều này cho thấy gì". Biết được bộ khung ấy rồi thì cách đọc sẽ khác – không cần đọc từ chữ đầu đến chữ cuối, mà hãy tìm ra bốn vị trí đó trước. Lượt đầu chỉ đọc phần mở, phần kết và câu đầu của mỗi đoạn, dùng năm phút vẽ ra bản đồ toàn bài; lượt hai mới quay lại đọc kỹ phần mình quan tâm. Nhiều người đọc chậm không phải vì đọc chưa kỹ, mà vì ngay từ đầu đã sa vào chi tiết, đọc đến giữa bài thì đã quên tác giả rốt cuộc muốn chứng minh điều gì. Xem khung trước, xem thịt sau – trình tự này gần như dùng được cho mọi bài viết lập luận.',
        questions: [
          { q: '短文说学术文章的结构包括哪几个部分？', qPinyin: 'Duǎn wén shuō xué shù wén zhāng de jié gòu bāo kuò nǎ jǐ gè bù fen?',
            qEn: 'What parts make up the structure described?', qVi: 'Bài đọc nói cấu trúc bài học thuật gồm những phần nào?',
            options: [['别人研究了什么、还有什么问题、方法和结果、这说明什么', 'người khác đã nghiên cứu gì, còn vấn đề gì, phương pháp và kết quả, điều đó cho thấy gì'], ['第一段、中间和最后一段', 'đoạn đầu, phần giữa và đoạn cuối'], ['问题、答案和参考资料', 'câu hỏi, đáp án và tài liệu tham khảo']], correct: 0,
            explEn: 'The passage lists exactly those four positions.', explVi: 'Bài đọc liệt kê đúng bốn vị trí đó.' },
          { q: '第一遍应该读什么？', qPinyin: 'Dì yī biàn yīng gāi dú shén me?',
            qEn: 'What should the first pass cover?', qVi: 'Lượt đọc đầu nên đọc gì?',
            options: [['第一段、结论和每段的第一句', 'đoạn đầu, phần kết và câu đầu mỗi đoạn'], ['文章的每一个字', 'từng chữ của bài'], ['只读数据部分', 'chỉ đọc phần số liệu']], correct: 0,
            explEn: '第一遍只读第一段、结论和每一段的第一句.', explVi: '第一遍只读第一段、结论和每一段的第一句.' },
          { q: '短文认为很多人读得慢的原因是什么？', qPinyin: 'Duǎn wén rèn wéi hěn duō rén dú de màn de yuán yīn shì shén me?',
            qEn: 'Why do many people read slowly, according to the text?', qVi: 'Bài đọc cho rằng nhiều người đọc chậm vì đâu?',
            options: [['一开始就陷进了细节', 'ngay từ đầu đã sa vào chi tiết'], ['读得不够仔细', 'đọc chưa đủ kỹ'], ['资料太多', 'tài liệu quá nhiều']], correct: 0,
            explEn: '不是因为读得不够仔细，而是因为一开始就陷进了细节.', explVi: '不是因为读得不够仔细，而是因为一开始就陷进了细节.' }
        ]
      },
      {
        titleZh: '数据支持的是哪一句',
        titleEn: 'Which sentence the data supports',
        titleVi: 'Số liệu chống đỡ cho câu nào',
        zh: '一份研究报告里出现了数据，并不等于它的每个结论都有数据支持。常见的情况是：数据支持的是一个小的、具体的说法，而作者在最后一段把它扩大成了一个大得多的主张。比如调查显示"参加课外阅读的学生，考试成绩平均高六分"，这只说明两件事同时出现，并不说明是阅读带来了成绩。如果参加课外阅读的学生本来家庭条件就更好、时间更多，那么真正起作用的可能是别的因素。所以读到一个有力的结论时，最有用的习惯是回头找一句话：支持它的证据到底是哪一条？把结论和证据放在一起看，你常常会发现两者之间还差着好几步。这几步，正是作者需要说明而有时没有说明的地方。',
        en: 'Data appearing in a research report does not mean every conclusion in it is backed by data. The common pattern is this: the data supports one small, specific statement, and in the final paragraph the author expands it into a far larger claim. A survey showing that "students who read outside class score six points higher on average" establishes only that the two occur together, not that the reading produced the marks. If those students already had better family circumstances and more time, the real cause may be something else entirely. So when you reach a forceful conclusion, the most useful habit is to look back for one sentence: which piece of evidence actually supports it? Put conclusion and evidence side by side and you will often find several steps missing between them. Those steps are exactly what the author needs to explain — and sometimes has not.',
        vi: 'Một báo cáo nghiên cứu có số liệu không có nghĩa là mọi kết luận trong đó đều được số liệu chống đỡ. Tình huống thường gặp là: số liệu chỉ chống đỡ cho một phát biểu nhỏ và cụ thể, còn tác giả ở đoạn cuối lại mở rộng nó thành một luận điểm lớn hơn nhiều. Chẳng hạn khảo sát cho thấy "học sinh có đọc sách ngoài giờ đạt điểm thi cao hơn trung bình sáu điểm", điều này chỉ nói lên hai việc cùng xuất hiện, chứ không nói rằng việc đọc đem lại điểm số. Nếu những học sinh đọc sách ngoài giờ vốn có điều kiện gia đình tốt hơn, thời gian nhiều hơn, thì thứ thật sự phát huy tác dụng có thể là yếu tố khác. Vậy nên khi đọc đến một kết luận mạnh mẽ, thói quen hữu ích nhất là quay lại tìm một câu: bằng chứng chống đỡ cho nó rốt cuộc là câu nào? Đặt kết luận và bằng chứng cạnh nhau, bạn thường sẽ thấy giữa hai bên còn thiếu mấy bước. Chính mấy bước ấy là chỗ tác giả cần giải thích mà đôi khi lại không giải thích.',
        questions: [
          { q: '"成绩高六分"的数据说明了什么？', qPinyin: '"Chéng jì gāo liù fēn" de shù jù shuō míng le shén me?',
            qEn: 'What does the six-point finding establish?', qVi: 'Số liệu "cao hơn sáu điểm" cho thấy điều gì?',
            options: [['两件事同时出现', 'hai việc cùng xuất hiện'], ['阅读带来了成绩', 'việc đọc đem lại điểm số'], ['家庭条件不重要', 'điều kiện gia đình không quan trọng']], correct: 0,
            explEn: '这只说明两件事同时出现，并不说明是阅读带来了成绩.', explVi: '这只说明两件事同时出现，并不说明是阅读带来了成绩.' },
          { q: '短文建议读到有力的结论时做什么？', qPinyin: 'Duǎn wén jiàn yì dú dào yǒu lì de jié lùn shí zuò shén me?',
            qEn: 'What does the text advise on reaching a strong conclusion?', qVi: 'Bài đọc khuyên khi đọc đến kết luận mạnh thì làm gì?',
            options: [['回头找支持它的那条证据', 'quay lại tìm bằng chứng chống đỡ cho nó'], ['马上记下来', 'ghi lại ngay'], ['跳过这一段', 'bỏ qua đoạn đó']], correct: 0,
            explEn: '最有用的习惯是回头找一句话：支持它的证据到底是哪一条？', explVi: '最有用的习惯是回头找一句话：支持它的证据到底是哪一条？' },
          { q: '把结论和证据放在一起看，常常会发现什么？', qPinyin: 'Bǎ jié lùn hé zhèng jù fàng zài yì qǐ kàn, cháng cháng huì fā xiàn shén me?',
            qEn: 'What do you often find when you compare conclusion and evidence?', qVi: 'Đặt kết luận và bằng chứng cạnh nhau thường sẽ thấy gì?',
            options: [['两者之间还差着好几步', 'giữa hai bên còn thiếu mấy bước'], ['两者完全一样', 'hai bên hoàn toàn giống nhau'], ['证据比结论更大', 'bằng chứng lớn hơn kết luận']], correct: 0,
            explEn: '你常常会发现两者之间还差着好几步.', explVi: '你常常会发现两者之间还差着好几步.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '数据太少，___不出可靠的结论。', pinyin: 'Shù jù tài shǎo, ___ bu chū kě kào de jié lùn.',
        options: [['得', 'rút ra'], ['说', 'nói'], ['写', 'viết'], ['听', 'nghe']], correct: 0,
        explEn: '得出结论 is the fixed collocation; its negative potential form is 得不出.', explVi: '得出结论 là kết hợp cố định; dạng khả năng phủ định là 得不出.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '这些资料___看一遍？', pinyin: 'Zhè xiē zī liào ___ kàn yí biàn?',
        options: [['要不要都', 'có cần đều'], ['要都不', 'cần đều không'], ['不要都', 'đừng đều'], ['都要不', 'đều cần không']], correct: 0,
        explEn: 'The A-not-A frame is 要不要, and 都 stays before the verb.', explVi: 'Khung A-không-A là 要不要, còn 都 vẫn đứng trước động từ.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：如果观点后面还是观点呢？ B：___', pinyin: 'A: Rú guǒ guān diǎn hòu miàn hái shi guān diǎn ne? B: ___',
        options: [['那这一段只是重复，没有真正的支持。', 'Vậy đoạn đó chỉ là lặp lại, không có sự chứng minh thật sự.'], ['这篇论文很长。', 'Bài nghiên cứu này rất dài.'], ['作者是一位教授。', 'Tác giả là một giáo sư.'], ['我明天再读。', 'Mai mình đọc tiếp.']], correct: 0,
        explEn: 'The question is about a claim backed only by another claim, so the answer must name the flaw.', explVi: 'Câu hỏi nói về luận điểm chỉ được đỡ bằng luận điểm khác, nên câu trả lời phải nêu điểm yếu.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么"阅读提高成绩"这个结论不可靠？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me "yuè dú tí gāo chéng jì" zhè ge jié lùn bù kě kào?',
        passage: 2, options: [['真正起作用的可能是别的因素', 'thứ thật sự có tác dụng có thể là yếu tố khác'], ['六分太少了', 'sáu điểm là quá ít'], ['调查的人数不够', 'số người khảo sát chưa đủ'], ['学生不喜欢阅读', 'học sinh không thích đọc sách']], correct: 0,
        explEn: 'Better family circumstances and more time may be the real cause behind both.', explVi: 'Điều kiện gia đình tốt hơn và nhiều thời gian hơn có thể là nguyên nhân thật sự của cả hai.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第二篇短文，报告里有数据就说明结论可靠。', pinyin: 'Gēn jù dì èr piān duǎn wén, bào gào lǐ yǒu shù jù jiù shuō míng jié lùn kě kào.',
        isTrue: false, passage: 2,
        explEn: '出现了数据，并不等于它的每个结论都有数据支持.', explVi: '出现了数据，并不等于它的每个结论都有数据支持.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '写到 / 第三遍 / 结构 / 就 / 清楚了', pinyin: 'xiě dào / dì sān biàn / jié gòu / jiù / qīng chu le',
        answer: '写到第三遍，结构就清楚了。', answerVi: 'Viết đến lần thứ ba thì cấu trúc trở nên rõ ràng.',
        options: [['写到', 'viết đến'], ['第三遍', 'lần thứ ba'], ['结构', 'cấu trúc'], ['就', 'thì'], ['清楚了', 'rõ ràng rồi']],
        explEn: '到 + ordinal sets the threshold and 就 introduces the new result.', explVi: '到 + số thứ tự nêu ngưỡng, 就 dẫn ra kết quả mới.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么先读每段的第一句？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me xiān dú měi duàn de dì yī jù?',
        passage: 1, options: [['为了用五分钟画出整篇文章的地图', 'để dùng năm phút vẽ ra bản đồ toàn bài'], ['因为后面的句子不重要', 'vì các câu sau không quan trọng'], ['因为第一句最难', 'vì câu đầu khó nhất'], ['因为老师这样要求', 'vì thầy cô yêu cầu vậy']], correct: 0,
        explEn: '第一遍只读第一段、结论和每一段的第一句，用五分钟画出整篇文章的地图.', explVi: '第一遍只读第一段、结论和每一段的第一句，用五分钟画出整篇文章的地图.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '"先看骨架，再看肉"这个说法强调什么？', pinyin: '"Xiān kàn gǔ jià, zài kàn ròu" zhè ge shuō fǎ qiáng diào shén me?',
        passage: 1, options: [['先掌握整体结构，再进入细节', 'nắm cấu trúc tổng thể trước rồi mới vào chi tiết'], ['细节比结构重要', 'chi tiết quan trọng hơn cấu trúc'], ['读得越快越好', 'đọc càng nhanh càng tốt'], ['只读结论就够了', 'chỉ đọc kết luận là đủ']], correct: 0,
        explEn: 'The metaphor restates the two-pass method: map first, detail second.', explVi: 'Phép ví này nhắc lại cách đọc hai lượt: bản đồ trước, chi tiết sau.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说怎么判断一个观点有没有支持？', pinyin: 'B shuō zěn me pàn duàn yí gè guān diǎn yǒu méi yǒu zhī chí?',
        line: 8, options: [['看后面跟着数据、例子还是另一个观点', 'xem sau đó là số liệu, ví dụ hay lại là luận điểm khác'], ['看这一段有多长', 'xem đoạn đó dài bao nhiêu'], ['看作者是谁', 'xem tác giả là ai'], ['看发表在哪里', 'xem đăng ở đâu']], correct: 0,
        explEn: 'B says: 看每个观点后面跟着什么：数据、例子，还是另一个观点.', explVi: 'B nói: 看每个观点后面跟着什么：数据、例子，还是另一个观点.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么重视作者承认的不足？', pinyin: 'B wèi shén me zhòng shì zuò zhě chéng rèn de bù zú?',
        line: 12, options: [['那一段最诚实，能看出结论能推到多远', 'đoạn đó thành thật nhất, cho thấy kết luận đi xa được đến đâu'], ['因为那一段最短', 'vì đoạn đó ngắn nhất'], ['因为考试会考', 'vì sẽ ra thi'], ['因为那里有数据', 'vì ở đó có số liệu']], correct: 0,
        explEn: 'B says: 那一段常常最诚实，也最容易看出结论能推到多远.', explVi: 'B nói: 那一段常常最诚实，也最容易看出结论能推到多远.' }
    ]
  }
};
