// HSK5 (C1) lessons 08-09. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l08-standard-negotiation': {
    titleZh: '谈判桌上',
    titleEn: 'At the negotiating table',
    titleVi: 'Trên bàn đàm phán',
    summaryEn: 'Why your alternative decides your position, when to name a number first, and what has to be written down the moment agreement is reached.',
    summaryVi: 'Vì sao phương án thay thế quyết định thế của bạn, khi nào nên ra giá trước, và điều gì phải ghi lại ngay khi vừa thoả thuận.',
    lines: [
      ['A', '那准备的时候最该做什么？', 'Nà zhǔn bèi de shí hou zuì gāi zuò shén me?',
        'So what matters most when preparing?',
        'Vậy lúc chuẩn bị thì nên làm gì nhất?'],
      ['B', '先想清楚谈不成的话你还有什么别的选择。', 'Xiān xiǎng qīng chu tán bu chéng de huà nǐ hái yǒu shén me bié de xuǎn zé.',
        'First work out what other options you have if no deal is reached.',
        'Trước hết nghĩ cho rõ nếu không thoả thuận được thì bạn còn lựa chọn nào khác.'],
      ['A', '这有什么用？', 'Zhè yǒu shén me yòng?',
        'What good does that do?',
        'Điều đó có ích gì?'],
      ['B', '有别的选择，你才不会被对方的时间压着走。', 'Yǒu bié de xuǎn zé, nǐ cái bú huì bèi duì fāng de shí jiān yā zhe zǒu.',
        'With another option you will not be pushed along by their timetable.',
        'Có lựa chọn khác thì bạn mới không bị lịch trình của đối phương ép đi.'],
      ['A', '对方问价的时候，我该先说数字吗？', 'Duì fāng wèn jià de shí hou, wǒ gāi xiān shuō shù zì ma?',
        'When they ask about price, should I name a number first?',
        'Khi đối phương hỏi giá, mình có nên nói con số trước không?'],
      ['B', '看情况：你了解市场就先说，不了解就让对方先说。', 'Kàn qíng kuàng: nǐ liǎo jiě shì chǎng jiù xiān shuō, bù liǎo jiě jiù ràng duì fāng xiān shuō.',
        'It depends: if you know the market, go first; if not, let them.',
        'Tuỳ tình hình: bạn hiểu thị trường thì nói trước, không hiểu thì để đối phương nói trước.'],
      ['A', '达成以后还要注意什么？', 'Dá chéng yǐ hòu hái yào zhù yì shén me?',
        'What else needs attention once agreement is reached?',
        'Sau khi đạt được thoả thuận còn cần lưu ý gì?'],
      ['B', '把双方说过的条件当场写下来，否则以后容易各说各的。', 'Bǎ shuāng fāng shuō guo de tiáo jiàn dāng chǎng xiě xià lai, fǒu zé yǐ hòu róng yì gè shuō gè de.',
        'Write down the terms both sides stated on the spot, or later each side will tell it differently.',
        'Ghi lại ngay tại chỗ các điều kiện hai bên đã nói, nếu không sau này dễ mỗi bên nói một kiểu.']
    ],
    vocab: [['谈判', 'tán pàn'], ['价格', 'jià gé'], ['需求', 'xū qiú'], ['条件', 'tiáo jiàn'], ['方案', 'fāng àn'],
      ['合同', 'hé tong'], ['利益', 'lì yì'], ['双方', 'shuāng fāng'], ['达成', 'dá chéng'], ['争取', 'zhēng qǔ'],
      ['交换', 'jiāo huàn'], ['灵活', 'líng huó'], ['坚持', 'jiān chí'], ['拒绝', 'jù jué'], ['时机', 'shí jī'],
      ['期限', 'qī xiàn'], ['主动', 'zhǔ dòng'], ['对方', 'duì fāng']],
    grammar: [
      {
        pattern: '被 + 施事 + 动词',
        explEn: 'Marks the subject as the one acted upon, with the doer named after 被. Chinese prefers it for events that are unwelcome, so it fits pressure and loss.',
        explVi: 'Đánh dấu chủ ngữ là bên chịu tác động, người gây ra đứng sau 被. Tiếng Trung thường dùng nó cho việc không mong muốn, nên hợp với sức ép và mất mát.',
        examples: [
          ['你才不会被对方的时间压着走。', 'Nǐ cái bú huì bèi duì fāng de shí jiān yā zhe zǒu.', 'You will not be pushed along by their timetable.', 'Bạn mới không bị lịch trình của đối phương ép đi.'],
          ['这个条件被对方拒绝了。', 'Zhè ge tiáo jiàn bèi duì fāng jù jué le.', 'This term was rejected by the other side.', 'Điều kiện này đã bị đối phương từ chối.'],
          ['他的方案被大家改了三次。', 'Tā de fāng àn bèi dà jiā gǎi le sān cì.', 'His proposal was revised three times by everyone.', 'Phương án của anh ấy bị mọi người sửa ba lần.']
        ]
      },
      {
        pattern: '……的话，就……',
        explEn: 'Wraps a supposition. 的话 closes the condition, and 就 opens what follows from it; the condition may be a full clause or a single phrase.',
        explVi: 'Bao lấy một giả định. 的话 khép lại điều kiện, 就 mở ra hệ quả; điều kiện có thể là cả mệnh đề hoặc chỉ một ngữ.',
        examples: [
          ['先想清楚谈不成的话你还有什么别的选择。', 'Xiān xiǎng qīng chu tán bu chéng de huà nǐ hái yǒu shén me bié de xuǎn zé.', 'Work out what options you have if no deal is reached.', 'Nghĩ rõ nếu không thoả thuận được thì bạn còn lựa chọn nào.'],
          ['价格不能动的话，就在期限上找空间。', 'Jià gé bù néng dòng de huà, jiù zài qī xiàn shàng zhǎo kōng jiān.', 'If the price cannot move, look for room in the deadline.', 'Nếu giá không nhúc nhích được thì tìm dư địa ở thời hạn.'],
          ['对方不主动的话，我们就先提一个方案。', 'Duì fāng bù zhǔ dòng de huà, wǒ men jiù xiān tí yí gè fāng àn.', 'If they do not take the initiative, we propose something first.', 'Nếu đối phương không chủ động thì chúng ta nêu một phương án trước.']
        ]
      },
      {
        pattern: '否则……',
        explEn: 'Names the consequence of not doing what was just said. It stands at the head of the second clause and needs no 如果 in front of it.',
        explVi: 'Nêu hậu quả của việc không làm điều vừa nói. Nó đứng đầu vế thứ hai và không cần 如果 phía trước.',
        examples: [
          ['把条件当场写下来，否则以后容易各说各的。', 'Bǎ tiáo jiàn dāng chǎng xiě xià lai, fǒu zé yǐ hòu róng yì gè shuō gè de.', 'Write the terms down on the spot, or later each side tells it differently.', 'Ghi điều kiện lại ngay tại chỗ, nếu không sau này mỗi bên nói một kiểu.'],
          ['先弄清楚对方的需求，否则很难灵活。', 'Xiān nòng qīng chu duì fāng de xū qiú, fǒu zé hěn nán líng huó.', 'Clarify their needs first, otherwise it is hard to be flexible.', 'Làm rõ nhu cầu của đối phương trước, nếu không rất khó linh hoạt.'],
          ['合同要写清楚期限，否则以后说不清。', 'Hé tong yào xiě qīng chu qī xiàn, fǒu zé yǐ hòu shuō bu qīng.', 'The contract must state the deadline clearly, or it cannot be settled later.', 'Hợp đồng phải ghi rõ thời hạn, nếu không sau này khó nói cho ra lẽ.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '谈判前先写三行字',
        titleEn: 'Three lines before you sit down',
        titleVi: 'Ba dòng trước khi ngồi vào bàn',
        zh: '谈判的结果，大半在坐下来以前就决定了。准备的时候只需要写三行字。第一行：谈不成我会怎么样。有别的买家、别的供货商、别的时间安排，你就是安全的；一行都写不出来，你在桌上就只能接受。第二行：对方为什么坐在这里。他要的常常不是最低的价格，而是准时、稳定、少麻烦，这些都比价格好给。第三行：哪些条件我可以换，哪些绝对不行。把它们提前分好，谈的时候才不会临时让出不该让的东西。这三行字花不了二十分钟，可是它决定了你是在争取，还是只是在同意。',
        en: 'The outcome of a negotiation is mostly decided before anyone sits down. Preparing takes only three lines. Line one: what happens to me if there is no deal? If there is another buyer, another supplier, another schedule, you are safe; if you cannot write a single line, all you can do at the table is accept. Line two: why is the other side here? What they want is often not the lowest price but punctuality, reliability, and fewer complications — all easier to give than money. Line three: which terms can I trade, and which absolutely not? Sorting them in advance is what stops you from giving away, in the moment, something you should have kept. These three lines take under twenty minutes, yet they decide whether you are negotiating or merely agreeing.',
        vi: 'Kết quả của một cuộc đàm phán phần lớn đã được định đoạt trước khi ngồi vào bàn. Lúc chuẩn bị chỉ cần viết ba dòng. Dòng thứ nhất: không thoả thuận được thì tôi sẽ ra sao. Có người mua khác, nhà cung cấp khác, lịch trình khác thì bạn an toàn; không viết nổi một dòng nào thì trên bàn bạn chỉ còn cách chấp nhận. Dòng thứ hai: vì sao đối phương ngồi ở đây. Thứ họ cần thường không phải giá thấp nhất, mà là đúng hẹn, ổn định, ít phiền phức — những thứ này đều dễ cho hơn tiền. Dòng thứ ba: điều kiện nào tôi có thể đổi, điều kiện nào tuyệt đối không. Phân loại trước như vậy thì lúc đàm phán mới không nhượng ra thứ đáng lẽ phải giữ. Ba dòng này không tốn đến hai mươi phút, nhưng nó quyết định bạn đang tranh thủ hay chỉ đang đồng ý.',
        questions: [
          { q: '第一行字要写什么？', qPinyin: 'Dì yī háng zì yào xiě shén me?',
            qEn: 'What goes on the first line?', qVi: 'Dòng thứ nhất viết gì?',
            options: [['谈不成我会怎么样', 'không thoả thuận được thì tôi sẽ ra sao'], ['我最想要的价格', 'mức giá tôi muốn nhất'], ['对方公司有多大', 'công ty đối phương lớn cỡ nào']], correct: 0,
            explEn: '第一行：谈不成我会怎么样.', explVi: '第一行：谈不成我会怎么样.' },
          { q: '短文说对方要的常常是什么？', qPinyin: 'Duǎn wén shuō duì fāng yào de cháng cháng shì shén me?',
            qEn: 'What does the other side usually want?', qVi: 'Bài đọc nói đối phương thường cần gì?',
            options: [['准时、稳定、少麻烦', 'đúng hẹn, ổn định, ít phiền phức'], ['最低的价格', 'giá thấp nhất'], ['最长的期限', 'thời hạn dài nhất']], correct: 0,
            explEn: '他要的常常不是最低的价格，而是准时、稳定、少麻烦.', explVi: '他要的常常不是最低的价格，而是准时、稳定、少麻烦.' },
          { q: '提前分好可换和不可换的条件有什么好处？', qPinyin: 'Tí qián fēn hǎo kě huàn hé bù kě huàn de tiáo jiàn yǒu shén me hǎo chu?',
            qEn: 'Why sort tradable terms in advance?', qVi: 'Phân loại trước điều kiện đổi được và không đổi được có lợi gì?',
            options: [['不会临时让出不该让的东西', 'không nhượng hớ thứ đáng lẽ phải giữ'], ['可以谈得更快', 'có thể đàm phán nhanh hơn'], ['对方会更客气', 'đối phương sẽ lịch sự hơn']], correct: 0,
            explEn: '把它们提前分好，谈的时候才不会临时让出不该让的东西.', explVi: '把它们提前分好，谈的时候才不会临时让出不该让的东西.' }
        ]
      },
      {
        titleZh: '价格以外的空间',
        titleEn: 'The room outside the price',
        titleVi: 'Dư địa ngoài giá cả',
        zh: '两边都盯着价格的时候，谈判就变成了一条线上的拉扯：你多一点，我就少一点，谁也没办法让对方满意。可是一笔生意从来不只有价格这一个条件，还有期限、数量、付款的时间、售后的服务、以后合作的可能。这些条件对两边的价值往往不一样：早一个月交货对你可能只是加班两天，对他却可能值很多钱。找出这种"对我便宜、对他贵"的条件，用它去换价格，双方就都能拿到自己更需要的东西。所以有经验的人在谈价格以前，会先花时间弄清楚对方最急的是什么。谈判不是把一块饼分开，而是先看看能不能把饼做大一点。',
        en: 'When both sides stare at the price, the negotiation becomes a tug along a single line: what you gain, I lose, and neither can be satisfied. But a deal never consists of price alone — there are deadlines, quantities, payment timing, after-sales service, the possibility of working together again. These terms are usually worth different amounts to each side: delivering a month early may cost you two days of overtime while being worth a great deal to them. Finding terms that are cheap for you and dear for them, and trading those against price, lets both sides walk away with what they need more. That is why experienced people spend time working out what the other side is most pressed about before price is discussed. Negotiation is not dividing a pie but first seeing whether the pie can be made bigger.',
        vi: 'Khi cả hai bên đều chăm chăm vào giá, đàm phán biến thành một cuộc kéo co trên một đường thẳng: bạn được thêm chút thì tôi mất đi chút, chẳng ai làm cho bên kia hài lòng được. Nhưng một thương vụ chưa bao giờ chỉ có mỗi điều kiện giá, còn có thời hạn, số lượng, thời điểm thanh toán, dịch vụ hậu mãi, khả năng hợp tác về sau. Những điều kiện này thường có giá trị khác nhau với mỗi bên: giao hàng sớm một tháng với bạn có thể chỉ là tăng ca hai ngày, còn với họ lại đáng rất nhiều tiền. Tìm ra loại điều kiện "rẻ với tôi, đắt với họ" rồi dùng nó đổi lấy giá, thì cả hai bên đều lấy được thứ mình cần hơn. Vì vậy người có kinh nghiệm trước khi bàn đến giá sẽ dành thời gian làm rõ đối phương đang gấp nhất điều gì. Đàm phán không phải là chia một cái bánh, mà trước hết xem có thể làm cái bánh to lên một chút không.',
        questions: [
          { q: '只盯着价格谈会变成什么样？', qPinyin: 'Zhǐ dīng zhe jià gé tán huì biàn chéng shén me yàng?',
            qEn: 'What happens when only price is discussed?', qVi: 'Chỉ chăm chăm vào giá thì đàm phán thành ra thế nào?',
            options: [['一条线上的拉扯，你多我就少', 'một cuộc kéo co trên đường thẳng, bạn được thì tôi mất'], ['很快达成', 'đạt thoả thuận rất nhanh'], ['双方都很满意', 'cả hai bên đều hài lòng']], correct: 0,
            explEn: '谈判就变成了一条线上的拉扯：你多一点，我就少一点.', explVi: '谈判就变成了一条线上的拉扯：你多一点，我就少一点.' },
          { q: '短文举的"对我便宜、对他贵"的例子是什么？', qPinyin: 'Duǎn wén jǔ de "duì wǒ pián yi, duì tā guì" de lì zi shì shén me?',
            qEn: 'What example of an asymmetric term is given?', qVi: 'Bài đọc nêu ví dụ nào cho điều kiện "rẻ với tôi, đắt với họ"?',
            options: [['早一个月交货', 'giao hàng sớm một tháng'], ['降低价格', 'hạ giá'], ['多买一些', 'mua thêm một ít']], correct: 0,
            explEn: '早一个月交货对你可能只是加班两天，对他却可能值很多钱.', explVi: '早一个月交货对你可能只是加班两天，对他却可能值很多钱.' },
          { q: '短文最后一句用了什么比喻？', qPinyin: 'Duǎn wén zuì hòu yí jù yòng le shén me bǐ yù?',
            qEn: 'What image closes the text?', qVi: 'Câu cuối bài dùng hình ảnh gì?',
            options: [['不是分饼，而是先把饼做大', 'không phải chia bánh mà trước hết làm bánh to lên'], ['把线拉长', 'kéo dài sợi dây'], ['把桌子搬走', 'dọn cái bàn đi']], correct: 0,
            explEn: '谈判不是把一块饼分开，而是先看看能不能把饼做大一点.', explVi: '谈判不是把一块饼分开，而是先看看能不能把饼做大一点.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '有别的选择，你才不会___对方的时间压着走。', pinyin: 'Yǒu bié de xuǎn zé, nǐ cái bú huì ___ duì fāng de shí jiān yā zhe zǒu.',
        options: [['被', 'bị'], ['把', 'đem'], ['给', 'cho'], ['让开', 'tránh ra']], correct: 0,
        explEn: '被 marks the subject as the one acted upon, with the doer named after it.', explVi: '被 đánh dấu chủ ngữ là bên chịu tác động, bên gây ra đứng sau nó.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '合同要写清楚期限，___以后说不清。', pinyin: 'Hé tong yào xiě qīng chu qī xiàn, ___ yǐ hòu shuō bu qīng.',
        options: [['否则', 'nếu không'], ['因此', 'do đó'], ['而且', 'hơn nữa'], ['虽然', 'tuy']], correct: 0,
        explEn: '否则 introduces what follows if the instruction is not carried out.', explVi: '否则 dẫn ra hệ quả nếu không làm theo điều vừa nói.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那准备的时候最该做什么？ B：___', pinyin: 'A: Nà zhǔn bèi de shí hou zuì gāi zuò shén me? B: ___',
        options: [['先想清楚谈不成的话你还有什么别的选择。', 'Trước hết nghĩ rõ nếu không thoả thuận được thì bạn còn lựa chọn nào.'], ['多准备几张名片。', 'Chuẩn bị thêm vài tấm danh thiếp.'], ['我明天有空。', 'Mai mình rảnh.'], ['他们公司在北京。', 'Công ty họ ở Bắc Kinh.']], correct: 0,
        explEn: 'The question asks what to prepare, so the answer must name the key preparation.', explVi: 'Câu hỏi hỏi chuẩn bị gì, nên câu trả lời phải nêu việc chuẩn bị then chốt.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么用别的条件去换价格对双方都好？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me yòng bié de tiáo jiàn qù huàn jià gé duì shuāng fāng dōu hǎo?',
        passage: 2, options: [['同一个条件对两边的价值不一样', 'cùng một điều kiện có giá trị khác nhau với mỗi bên'], ['因为价格不重要', 'vì giá không quan trọng'], ['因为条件越多越快', 'vì càng nhiều điều kiện càng nhanh'], ['因为对方不会算', 'vì đối phương không biết tính']], correct: 0,
        explEn: '这些条件对两边的价值往往不一样.', explVi: '这些条件对两边的价值往往不一样.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，写不出别的选择的人在桌上更容易争取到条件。', pinyin: 'Gēn jù dì yī piān duǎn wén, xiě bu chū bié de xuǎn zé de rén zài zhuō shàng gèng róng yì zhēng qǔ dào tiáo jiàn.',
        isTrue: false, passage: 1,
        explEn: '一行都写不出来，你在桌上就只能接受.', explVi: '一行都写不出来，你在桌上就只能接受.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '价格不能动的话 / 就 / 在期限上 / 找空间', pinyin: 'jià gé bù néng dòng de huà / jiù / zài qī xiàn shàng / zhǎo kōng jiān',
        answer: '价格不能动的话，就在期限上找空间。', answerVi: 'Nếu giá không nhúc nhích được thì tìm dư địa ở thời hạn.',
        options: [['价格不能动的话', 'nếu giá không nhúc nhích được'], ['就', 'thì'], ['在期限上', 'ở thời hạn'], ['找空间', 'tìm dư địa']],
        explEn: '的话 closes the condition and 就 opens the consequence.', explVi: '的话 khép lại điều kiện, 就 mở ra hệ quả.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么说准时和稳定"比价格好给"？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me shuō zhǔn shí hé wěn dìng "bǐ jià gé hǎo gěi"?',
        passage: 1, options: [['它们是对方真正想要的，而且不用直接少收钱', 'đó mới là thứ đối phương thật sự cần, lại không phải giảm tiền trực tiếp'], ['因为它们不用写进合同', 'vì chúng không cần ghi vào hợp đồng'], ['因为对方不在乎价格', 'vì đối phương không quan tâm giá'], ['因为它们花时间最少', 'vì chúng tốn ít thời gian nhất']], correct: 0,
        explEn: '他要的常常不是最低的价格，而是准时、稳定、少麻烦，这些都比价格好给.', explVi: '他要的常常不是最低的价格，而是准时、稳定、少麻烦，这些都比价格好给.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，有经验的人在谈价格以前会先做什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, yǒu jīng yàn de rén zài tán jià gé yǐ qián huì xiān zuò shén me?',
        passage: 2, options: [['弄清楚对方最急的是什么', 'làm rõ đối phương đang gấp nhất điều gì'], ['先报一个很低的价', 'ra một mức giá rất thấp trước'], ['先谈合作的可能', 'bàn khả năng hợp tác trước'], ['先要一份合同', 'xin một bản hợp đồng trước']], correct: 0,
        explEn: '会先花时间弄清楚对方最急的是什么.', explVi: '会先花时间弄清楚对方最急的是什么.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说该不该先说数字，要看什么？', pinyin: 'B shuō gāi bu gāi xiān shuō shù zì, yào kàn shén me?',
        line: 12, options: [['看你了不了解市场', 'xem bạn có hiểu thị trường không'], ['看对方是不是着急', 'xem đối phương có gấp không'], ['看合同有多长', 'xem hợp đồng dài bao nhiêu'], ['看时间够不够', 'xem thời gian có đủ không']], correct: 0,
        explEn: 'B says: 看情况：你了解市场就先说，不了解就让对方先说.', explVi: 'B nói: 看情况：你了解市场就先说，不了解就让对方先说.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么要求达成以后当场写下来？', pinyin: 'B wèi shén me yāo qiú dá chéng yǐ hòu dāng chǎng xiě xià lai?',
        line: 14, options: [['否则以后容易各说各的', 'nếu không sau này dễ mỗi bên nói một kiểu'], ['因为要交给领导', 'vì phải nộp cho lãnh đạo'], ['因为写字比说话快', 'vì viết nhanh hơn nói'], ['因为对方要求这样', 'vì đối phương yêu cầu thế']], correct: 0,
        explEn: 'B says: 把双方说过的条件当场写下来，否则以后容易各说各的.', explVi: 'B nói: 把双方说过的条件当场写下来，否则以后容易各说各的.' }
    ]
  },

  'hsk5-l09-standard-identity': {
    titleZh: '身份与归属',
    titleEn: 'Identity and belonging',
    titleVi: 'Bản sắc và sự thuộc về',
    summaryEn: 'Living between two places: the cost of explaining yourself, why "you have changed" is not an accusation, and reading a double identity as addition rather than loss.',
    summaryVi: 'Sống giữa hai nơi: cái giá của việc phải giải thích, vì sao "bạn đổi rồi" không phải lời trách, và đọc bản sắc kép như phép cộng chứ không phải mất mát.',
    lines: [
      ['A', '可是每次都要解释，时间长了也会累。', 'Kě shì měi cì dōu yào jiě shì, shí jiān cháng le yě huì lèi.',
        'But having to explain every time gets tiring after a while.',
        'Nhưng lần nào cũng phải giải thích, lâu dần cũng mệt.'],
      ['B', '那就不用每次都解释，只对愿意听的人多说几句。', 'Nà jiù bú yòng měi cì dōu jiě shì, zhǐ duì yuàn yì tīng de rén duō shuō jǐ jù.',
        'Then do not explain every time — say more only to those willing to listen.',
        'Vậy thì không cần lần nào cũng giải thích, chỉ nói thêm với người sẵn lòng nghe.'],
      ['A', '回到家乡，别人又说我变了。', 'Huí dào jiā xiāng, bié ren yòu shuō wǒ biàn le.',
        'Back home, people say I have changed.',
        'Về quê thì người ta lại bảo mình đổi rồi.'],
      ['B', '变了是自然的，去过不同的地方，看事情的角度当然不一样。', 'Biàn le shì zì rán de, qù guo bù tóng de dì fang, kàn shì qing de jiǎo dù dāng rán bù yí yàng.',
        'Changing is natural — having been to different places, of course you see things from another angle.',
        'Đổi là chuyện tự nhiên, đã đi qua những nơi khác nhau thì góc nhìn tất nhiên khác đi.'],
      ['A', '有时候我觉得两边都不完全属于。', 'Yǒu shí hou wǒ jué de liǎng biān dōu bù wán quán shǔ yú.',
        'Sometimes I feel I do not fully belong to either side.',
        'Đôi khi mình thấy mình không hoàn toàn thuộc về bên nào.'],
      ['B', '与其说你两边都少了一半，不如说两边都多了一点。', 'Yǔ qí shuō nǐ liǎng biān dōu shǎo le yí bàn, bù rú shuō liǎng biān dōu duō le yì diǎn.',
        'Rather than saying you are half of each, say you have a little extra of both.',
        'Thay vì nói bạn thiếu một nửa ở cả hai bên, hãy nói bạn có thêm một chút ở cả hai bên.'],
      ['A', '那语言呢？小时候说的话好像越来越不熟练了。', 'Nà yǔ yán ne? Xiǎo shí hou shuō de huà hǎo xiàng yuè lái yuè bù shú liàn le.',
        'And language? The one I spoke as a child feels less and less fluent.',
        'Còn ngôn ngữ thì sao? Thứ tiếng hồi nhỏ mình nói hình như ngày càng kém trôi chảy.'],
      ['B', '那是少用的结果，不是失去；用起来几个星期就回来了。', 'Nà shì shǎo yòng de jié guǒ, bú shì shī qù; yòng qǐ lái jǐ gè xīng qī jiù huí lái le.',
        'That is the result of using it less, not of losing it; start using it and it comes back in a few weeks.',
        'Đó là kết quả của việc ít dùng, không phải mất đi; dùng vào thì vài tuần là trở lại.']
    ],
    vocab: [['身份', 'shēn fèn'], ['文化', 'wén huà'], ['经历', 'jīng lì'], ['交流', 'jiāo liú'], ['语言', 'yǔ yán'],
      ['故乡', 'gù xiāng'], ['传统', 'chuán tǒng'], ['习惯', 'xí guàn'], ['观念', 'guān niàn'], ['环境', 'huán jìng'],
      ['记忆', 'jì yì'], ['背景', 'bèi jǐng'], ['民族', 'mín zú'], ['家乡', 'jiā xiāng'], ['适应', 'shì yìng'],
      ['距离', 'jù lí'], ['心理', 'xīn lǐ'], ['交往', 'jiāo wǎng']],
    grammar: [
      {
        pattern: '与其……，不如……',
        explEn: 'Compares two ways of putting or doing something and prefers the second. 与其 marks the version set aside, 不如 the one recommended.',
        explVi: 'So sánh hai cách nói hoặc hai cách làm và chọn cách thứ hai. 与其 nêu cách bị gạt sang bên, 不如 nêu cách được khuyên dùng.',
        examples: [
          ['与其说你两边都少了一半，不如说两边都多了一点。', 'Yǔ qí shuō nǐ liǎng biān dōu shǎo le yí bàn, bù rú shuō liǎng biān dōu duō le yì diǎn.', 'Rather than saying you are half of each, say you have a little extra of both.', 'Thay vì nói bạn thiếu một nửa ở cả hai bên, hãy nói bạn có thêm một chút ở cả hai bên.'],
          ['与其一直解释，不如让他们看你做事。', 'Yǔ qí yì zhí jiě shì, bù rú ràng tā men kàn nǐ zuò shì.', 'Rather than explaining endlessly, let them watch you work.', 'Thay vì giải thích mãi, hãy để họ nhìn bạn làm việc.'],
          ['与其怪环境，不如先适应环境。', 'Yǔ qí guài huán jìng, bù rú xiān shì yìng huán jìng.', 'Rather than blaming the environment, adapt to it first.', 'Thay vì trách môi trường, hãy thích nghi với nó trước.']
        ]
      },
      {
        pattern: '动词 + 起来',
        explEn: 'Marks the moment an action gets going, or the judgement that appears once you try. It follows the verb directly and often precedes the result.',
        explVi: 'Đánh dấu thời điểm hành động bắt đầu diễn ra, hoặc nhận định xuất hiện khi bắt tay vào làm. Nó theo ngay sau động từ và thường đứng trước kết quả.',
        examples: [
          ['用起来几个星期就回来了。', 'Yòng qǐ lái jǐ gè xīng qī jiù huí lái le.', 'Start using it and it comes back within weeks.', 'Dùng vào thì vài tuần là trở lại.'],
          ['这两种文化说起来很远，其实有不少地方一样。', 'Zhè liǎng zhǒng wén huà shuō qǐ lái hěn yuǎn, qí shí yǒu bù shǎo dì fang yí yàng.', 'These two cultures sound far apart, yet much is the same.', 'Hai nền văn hoá này nói ra thì rất xa nhau, thật ra có không ít chỗ giống nhau.'],
          ['刚交往起来会有点儿不习惯。', 'Gāng jiāo wǎng qǐ lái huì yǒu diǎnr bù xí guàn.', 'It feels a little unfamiliar when you first start mixing with them.', 'Mới bắt đầu qua lại thì sẽ hơi lạ.']
        ]
      },
      {
        pattern: '是……的结果',
        explEn: 'Identifies a state as the outcome of something, which reframes it as reversible rather than fixed. The whole phrase is the predicate after 是.',
        explVi: 'Xác định một trạng thái là kết quả của điều gì đó, qua đó đóng khung nó như một việc có thể đảo ngược chứ không cố định. Cả cụm là vị ngữ sau 是.',
        examples: [
          ['那是少用的结果，不是失去。', 'Nà shì shǎo yòng de jié guǒ, bú shì shī qù.', 'That is the result of using it less, not of losing it.', 'Đó là kết quả của việc ít dùng, không phải mất đi.'],
          ['不适应是环境变了的结果，不是你的问题。', 'Bú shì yìng shì huán jìng biàn le de jié guǒ, bú shì nǐ de wèn tí.', 'Not fitting in is the result of a changed environment, not your fault.', 'Không thích nghi là kết quả của môi trường đã đổi, không phải lỗi của bạn.'],
          ['这种距离是长期不交流的结果。', 'Zhè zhǒng jù lí shì cháng qī bù jiāo liú de jié guǒ.', 'This distance is the result of long-term lack of contact.', 'Khoảng cách này là kết quả của việc lâu ngày không giao tiếp.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '两边都多了一点',
        titleEn: 'A little extra of both',
        titleVi: 'Có thêm một chút ở cả hai bên',
        zh: '在两种文化之间生活的人，常常用减法来描述自己：中文说得不如国内的朋友好，本地的笑话又听不懂，好像哪一边都缺一块。可是同一件事换成加法就完全不同了：你比国内的朋友多了一套看问题的角度，比本地的同事多了一段别人没有的经历。这两样东西合在一起，正是别人学不来的部分。真正让人难受的往往不是身份本身，而是别人要求你选一个。可是身份从来不是一道单选题，一个人可以同时是某个地方长大的孩子、某种语言的使用者、某个行业的工作者，这些都不冲突。把"我到底算哪里人"换成"我从哪些地方学到了什么"，问题就从一道无解的题变成了一份可以慢慢写长的记录。',
        en: 'People living between two cultures often describe themselves by subtraction: their Chinese is not as good as their friends\' back home, and they miss the local jokes — as if a piece were missing on either side. Yet the same facts read as addition look entirely different: you have one more way of seeing a problem than your friends back home, and one more stretch of experience than your local colleagues. Those two things together are precisely the part nobody else can copy. What actually hurts is usually not the identity itself but other people demanding that you pick one. Identity, however, was never a single-choice question: a person can at once be a child who grew up somewhere, a speaker of a language, and someone who works in a trade, and none of these conflict. Replace "where am I really from" with "what did I learn from each place", and the question turns from an unanswerable problem into a record you can keep adding to.',
        vi: 'Người sống giữa hai nền văn hoá thường mô tả bản thân bằng phép trừ: tiếng Trung nói không bằng bạn bè trong nước, chuyện cười của người bản xứ lại nghe không hiểu, cứ như bên nào cũng thiếu một mảng. Nhưng cũng chuyện ấy đổi sang phép cộng thì hoàn toàn khác: bạn có nhiều hơn bạn bè trong nước một bộ góc nhìn, nhiều hơn đồng nghiệp bản xứ một đoạn trải nghiệm mà họ không có. Hai thứ đó gộp lại chính là phần người khác không học theo được. Thứ thật sự khiến người ta khó chịu thường không phải bản thân cái bản sắc, mà là việc người khác đòi bạn phải chọn lấy một. Nhưng bản sắc chưa bao giờ là một câu hỏi chọn một đáp án: một người có thể cùng lúc là đứa trẻ lớn lên ở một nơi nào đó, người sử dụng một thứ tiếng, người làm việc trong một ngành, và những điều này không xung đột. Đổi câu "rốt cuộc mình là người ở đâu" thành "mình đã học được gì từ những nơi nào", thì câu hỏi từ một bài toán không lời giải biến thành một bản ghi có thể viết dài thêm mãi.',
        questions: [
          { q: '短文说很多人用什么方式描述自己？', qPinyin: 'Duǎn wén shuō hěn duō rén yòng shén me fāng shì miáo shù zì jǐ?',
            qEn: 'How do many people describe themselves?', qVi: 'Bài đọc nói nhiều người mô tả bản thân theo cách nào?',
            options: [['用减法，觉得哪边都缺一块', 'bằng phép trừ, thấy bên nào cũng thiếu một mảng'], ['用加法，觉得两边都多', 'bằng phép cộng, thấy bên nào cũng nhiều hơn'], ['完全不描述', 'hoàn toàn không mô tả']], correct: 0,
            explEn: '常常用减法来描述自己……好像哪一边都缺一块.', explVi: '常常用减法来描述自己……好像哪一边都缺一块.' },
          { q: '按短文的说法，真正让人难受的是什么？', qPinyin: 'Àn duǎn wén de shuō fǎ, zhēn zhèng ràng rén nán shòu de shì shén me?',
            qEn: 'What actually hurts, according to the text?', qVi: 'Theo bài đọc, điều thật sự khiến người ta khó chịu là gì?',
            options: [['别人要求你选一个', 'người khác đòi bạn phải chọn lấy một'], ['语言说得不好', 'nói ngôn ngữ không tốt'], ['听不懂本地的笑话', 'không hiểu chuyện cười bản xứ']], correct: 0,
            explEn: '真正让人难受的往往不是身份本身，而是别人要求你选一个.', explVi: '真正让人难受的往往不是身份本身，而是别人要求你选一个.' },
          { q: '短文建议把哪个问题换成哪个问题？', qPinyin: 'Duǎn wén jiàn yì bǎ nǎ ge wèn tí huàn chéng nǎ ge wèn tí?',
            qEn: 'Which question does the text suggest replacing?', qVi: 'Bài đọc khuyên đổi câu hỏi nào thành câu hỏi nào?',
            options: [['把"我算哪里人"换成"我从哪些地方学到了什么"', 'đổi "mình là người ở đâu" thành "mình học được gì từ những nơi nào"'], ['把"我学到什么"换成"我算哪里人"', 'đổi "mình học được gì" thành "mình là người ở đâu"'], ['把两个问题都放下', 'gác cả hai câu hỏi lại']], correct: 0,
            explEn: '把"我到底算哪里人"换成"我从哪些地方学到了什么".', explVi: '把"我到底算哪里人"换成"我从哪些地方学到了什么".' }
        ]
      },
      {
        titleZh: '解释也是要花力气的',
        titleEn: 'Explaining costs energy too',
        titleVi: 'Giải thích cũng tốn sức',
        zh: '身在异地的人常常处在一种要不断说明自己的状态：名字怎么念、为什么会在这里、家里过什么节。刚开始这种问题让人高兴，说明别人对你有兴趣；可是同样的话说到第五十遍，它就变成了一份没有工资的工作。所以有必要把提问的人分成两种。第一种是真的想认识你的，他们会继续问细节，会记住你上次说过的话；第二种只是找话说，你回答得再仔细，下次他还是会问同一个问题。对第一种人值得多花时间，对第二种人，一句话带过就够了，这不是不客气，而是把力气留给真正的交流。另外也要接受一件事：有些理解需要很多年才发生，甚至永远不发生。这不代表你说得不好，只说明每个人能走进的距离本来就不一样。',
        en: 'Living far from where you began often means being permanently in the position of having to explain yourself: how your name is pronounced, why you are here, which festivals your family keeps. At first such questions are pleasant — they mean someone is interested. But the fiftieth time the same words come out, it becomes a job with no wage. It is therefore worth sorting askers into two kinds. The first genuinely wants to know you: they keep asking about details and remember what you said last time. The second is only making conversation; however carefully you answer, they will ask the same question again next time. The first deserves your time; for the second, a single sentence is enough — that is not rudeness but keeping your energy for real exchange. One more thing has to be accepted: some understanding takes years to arrive, and some never arrives at all. That does not mean you explained it badly; it only means people differ in how close they can come.',
        vi: 'Người ở nơi xa thường rơi vào trạng thái phải liên tục nói rõ về bản thân: tên đọc thế nào, vì sao lại ở đây, nhà mình ăn tết gì. Lúc đầu những câu hỏi ấy khiến người ta vui, chứng tỏ người khác quan tâm đến bạn; nhưng cùng những lời ấy nói đến lần thứ năm mươi thì nó biến thành một công việc không có lương. Vì vậy cần chia người hỏi thành hai loại. Loại thứ nhất thật sự muốn hiểu bạn, họ sẽ hỏi tiếp vào chi tiết, sẽ nhớ điều bạn nói lần trước; loại thứ hai chỉ kiếm chuyện để nói, bạn trả lời kỹ đến mấy thì lần sau họ vẫn hỏi đúng câu đó. Với loại thứ nhất thì đáng bỏ thời gian, với loại thứ hai chỉ cần một câu cho qua là đủ — đó không phải bất lịch sự, mà là dành sức cho những cuộc giao tiếp thật sự. Ngoài ra cũng phải chấp nhận một điều: có những sự thấu hiểu phải mất nhiều năm mới xảy ra, thậm chí không bao giờ xảy ra. Điều đó không có nghĩa bạn nói chưa hay, nó chỉ cho thấy khoảng cách mà mỗi người có thể bước vào vốn đã khác nhau.',
        questions: [
          { q: '同样的说明说到第五十遍会变成什么？', qPinyin: 'Tóng yàng de shuō míng shuō dào dì wǔ shí biàn huì biàn chéng shén me?',
            qEn: 'What does the fiftieth repetition become?', qVi: 'Cùng lời giải thích nói đến lần thứ năm mươi thì thành gì?',
            options: [['一份没有工资的工作', 'một công việc không có lương'], ['一个有趣的故事', 'một câu chuyện thú vị'], ['一次真正的交流', 'một cuộc giao tiếp thật sự']], correct: 0,
            explEn: '可是同样的话说到第五十遍，它就变成了一份没有工资的工作.', explVi: '可是同样的话说到第五十遍，它就变成了一份没有工资的工作.' },
          { q: '怎么看出谁是真的想认识你的人？', qPinyin: 'Zěn me kàn chū shéi shì zhēn de xiǎng rèn shi nǐ de rén?',
            qEn: 'How do you tell the genuinely interested?', qVi: 'Phân biệt người thật sự muốn hiểu bạn bằng cách nào?',
            options: [['他们继续问细节，记住你上次说过的话', 'họ hỏi tiếp chi tiết, nhớ điều bạn nói lần trước'], ['他们问得最多', 'họ hỏi nhiều nhất'], ['他们从不提问', 'họ không bao giờ hỏi']], correct: 0,
            explEn: '他们会继续问细节，会记住你上次说过的话.', explVi: '他们会继续问细节，会记住你上次说过的话.' },
          { q: '短文怎么看"有些理解永远不发生"？', qPinyin: 'Duǎn wén zěn me kàn "yǒu xiē lǐ jiě yǒng yuǎn bù fā shēng"?',
            qEn: 'How does the text view understanding that never comes?', qVi: 'Bài đọc nhìn nhận "có sự thấu hiểu không bao giờ xảy ra" thế nào?',
            options: [['不代表你说得不好，只是每个人能走进的距离不同', 'không có nghĩa bạn nói chưa hay, chỉ là khoảng cách mỗi người bước vào được khác nhau'], ['说明你应该再解释一次', 'cho thấy bạn nên giải thích thêm lần nữa'], ['说明对方不友好', 'cho thấy đối phương không thân thiện']], correct: 0,
            explEn: '这不代表你说得不好，只说明每个人能走进的距离本来就不一样.', explVi: '这不代表你说得不好，只说明每个人能走进的距离本来就不一样.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___一直解释，___让他们看你做事。', pinyin: '___ yì zhí jiě shì, ___ ràng tā men kàn nǐ zuò shì.',
        options: [['与其……不如', 'thay vì… chi bằng'], ['因为……所以', 'vì… nên'], ['虽然……但是', 'tuy… nhưng'], ['不但……而且', 'không những… mà còn']], correct: 0,
        explEn: '与其 marks the option set aside and 不如 the one preferred.', explVi: '与其 nêu phương án bị gạt đi, 不如 nêu phương án được chọn.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '那是少用的___，不是失去。', pinyin: 'Nà shì shǎo yòng de ___, bú shì shī qù.',
        options: [['结果', 'kết quả'], ['原因', 'nguyên nhân'], ['问题', 'vấn đề'], ['方法', 'phương pháp']], correct: 0,
        explEn: '是……的结果 reframes a state as an outcome, and so as reversible.', explVi: '是……的结果 đóng khung trạng thái như một kết quả, tức là có thể đảo ngược.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：回到家乡，别人又说我变了。 B：___', pinyin: 'A: Huí dào jiā xiāng, bié ren yòu shuō wǒ biàn le. B: ___',
        options: [['变了是自然的，去过不同的地方，角度当然不一样。', 'Đổi là tự nhiên, đã đi những nơi khác thì góc nhìn tất nhiên khác.'], ['那你别回去了。', 'Vậy bạn đừng về nữa.'], ['家乡的天气很好。', 'Thời tiết quê rất đẹp.'], ['我也想去旅行。', 'Mình cũng muốn đi du lịch.']], correct: 0,
        explEn: 'The remark is a complaint about being called changed, so the answer must normalise it.', explVi: 'Lời than là bị nói đã đổi, nên câu trả lời phải làm cho điều đó thành bình thường.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，对只是找话说的人一句话带过为什么不算不客气？', pinyin: 'Gēn jù dì èr piān duǎn wén, duì zhǐ shì zhǎo huà shuō de rén yí jù huà dài guò wèi shén me bú suàn bú kè qi?',
        passage: 2, options: [['因为要把力气留给真正的交流', 'vì phải dành sức cho những cuộc giao tiếp thật sự'], ['因为他们不值得尊重', 'vì họ không đáng được tôn trọng'], ['因为解释没有用', 'vì giải thích không có tác dụng'], ['因为他们不会再来', 'vì họ sẽ không đến nữa']], correct: 0,
        explEn: '这不是不客气，而是把力气留给真正的交流.', explVi: '这不是不客气，而是把力气留给真正的交流.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，一个人必须在两种身份里选一个。', pinyin: 'Gēn jù dì yī piān duǎn wén, yí gè rén bì xū zài liǎng zhǒng shēn fèn lǐ xuǎn yí gè.',
        isTrue: false, passage: 1,
        explEn: '身份从来不是一道单选题……这些都不冲突.', explVi: '身份从来不是一道单选题……这些都不冲突.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '这种距离 / 是 / 长期不交流 / 的结果', pinyin: 'zhè zhǒng jù lí / shì / cháng qī bù jiāo liú / de jié guǒ',
        answer: '这种距离是长期不交流的结果。', answerVi: 'Khoảng cách này là kết quả của việc lâu ngày không giao tiếp.',
        options: [['这种距离', 'khoảng cách này'], ['是', 'là'], ['长期不交流', 'lâu ngày không giao tiếp'], ['的结果', 'kết quả của']],
        explEn: 'The whole 是……的结果 phrase is the predicate, with the cause inside it.', explVi: 'Cả cụm 是……的结果 làm vị ngữ, nguyên nhân nằm bên trong.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，加法的说法指出了什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, jiā fǎ de shuō fǎ zhǐ chū le shén me?',
        passage: 1, options: [['你比两边的人各多了一样别人学不来的东西', 'bạn hơn cả hai bên mỗi bên một thứ mà người khác không học theo được'], ['你比两边的人都强', 'bạn giỏi hơn cả hai bên'], ['你应该只留在一边', 'bạn chỉ nên ở lại một bên'], ['两种文化其实一样', 'hai nền văn hoá thật ra giống nhau']], correct: 0,
        explEn: '你比国内的朋友多了一套看问题的角度，比本地的同事多了一段别人没有的经历……正是别人学不来的部分.', explVi: '你比国内的朋友多了一套看问题的角度，比本地的同事多了一段别人没有的经历……正是别人学不来的部分.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么刚开始被问这些问题让人高兴？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me gāng kāi shǐ bèi wèn zhè xiē wèn tí ràng rén gāo xìng?',
        passage: 2, options: [['说明别人对你有兴趣', 'chứng tỏ người khác quan tâm đến bạn'], ['因为问题很容易回答', 'vì câu hỏi rất dễ trả lời'], ['因为可以练习语言', 'vì có thể luyện ngôn ngữ'], ['因为不用花力气', 'vì không tốn sức']], correct: 0,
        explEn: '刚开始这种问题让人高兴，说明别人对你有兴趣.', explVi: '刚开始这种问题让人高兴，说明别人对你有兴趣.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B建议怎么处理"每次都要解释"的累？', pinyin: 'B jiàn yì zěn me chǔ lǐ "měi cì dōu yào jiě shì" de lèi?',
        line: 8, options: [['不用每次都解释，只对愿意听的人多说几句', 'không cần lần nào cũng giải thích, chỉ nói thêm với người sẵn lòng nghe'], ['以后都不解释了', 'từ nay không giải thích nữa'], ['写下来给别人看', 'viết ra cho người khác đọc'], ['换一个地方生活', 'đổi sang nơi khác sống']], correct: 0,
        explEn: 'B says: 那就不用每次都解释，只对愿意听的人多说几句.', explVi: 'B nói: 那就不用每次都解释，只对愿意听的人多说几句.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B怎么解释语言变得不熟练？', pinyin: 'B zěn me jiě shì yǔ yán biàn de bù shú liàn?',
        line: 14, options: [['是少用的结果，不是失去，用起来就回来了', 'là kết quả của ít dùng, không phải mất đi, dùng vào thì trở lại'], ['说明已经忘光了', 'chứng tỏ đã quên sạch'], ['说明应该放弃', 'chứng tỏ nên bỏ cuộc'], ['说明要重新学一遍', 'chứng tỏ phải học lại từ đầu']], correct: 0,
        explEn: 'B says: 那是少用的结果，不是失去；用起来几个星期就回来了.', explVi: 'B nói: 那是少用的结果，不是失去；用起来几个星期就回来了.' }
    ]
  }
};
