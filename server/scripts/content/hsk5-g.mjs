// HSK5 (C1) lessons 10-11. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l10-standard-research': {
    titleZh: '做一个小研究',
    titleEn: 'Running a small study',
    titleVi: 'Làm một nghiên cứu nhỏ',
    summaryEn: 'Turning a vague question into an answerable one, why the scope of a dataset limits the claim, and why two things happening together is not one causing the other.',
    summaryVi: 'Biến một câu hỏi mơ hồ thành câu hỏi trả lời được, vì sao phạm vi dữ liệu giới hạn kết luận, và vì sao hai việc cùng xảy ra không có nghĩa cái này gây ra cái kia.',
    lines: [
      ['A', '可是数据也可能骗人吧？', 'Kě shì shù jù yě kě néng piàn rén ba?',
        'But data can mislead too, can it not?',
        'Nhưng dữ liệu cũng có thể đánh lừa người ta chứ?'],
      ['B', '会，所以要问清楚：谁收集的、在什么范围里收集的。', 'Huì, suǒ yǐ yào wèn qīng chu: shéi shōu jí de, zài shén me fàn wéi lǐ shōu jí de.',
        'It can, so ask clearly: who collected it, and within what scope.',
        'Có, nên phải hỏi cho rõ: ai thu thập, thu thập trong phạm vi nào.'],
      ['A', '范围为什么这么重要？', 'Fàn wéi wèi shén me zhè me zhòng yào?',
        'Why does scope matter so much?',
        'Vì sao phạm vi lại quan trọng đến vậy?'],
      ['B', '只在一所学校收的数据，说明不了全国的情况。', 'Zhǐ zài yì suǒ xué xiào shōu de shù jù, shuō míng bu liǎo quán guó de qíng kuàng.',
        'Data gathered at one school cannot account for the whole country.',
        'Dữ liệu chỉ thu ở một trường thì không nói lên được tình hình cả nước.'],
      ['A', '那看到两件事一起出现，能说是一个引起另一个吗？', 'Nà kàn dào liǎng jiàn shì yì qǐ chū xiàn, néng shuō shì yí gè yǐn qǐ lìng yí gè ma?',
        'If two things appear together, can we say one caused the other?',
        'Vậy thấy hai việc cùng xuất hiện thì có nói được cái này gây ra cái kia không?'],
      ['B', '不能，一起出现只是同时发生，中间还可能有第三个原因。', 'Bù néng, yì qǐ chū xiàn zhǐ shì tóng shí fā shēng, zhōng jiān hái kě néng yǒu dì sān gè yuán yīn.',
        'No — appearing together only means happening at the same time; a third cause may sit between them.',
        'Không, cùng xuất hiện chỉ là cùng lúc xảy ra, ở giữa còn có thể có nguyên nhân thứ ba.'],
      ['A', '写报告的时候要注意什么？', 'Xiě bào gào de shí hou yào zhù yì shén me?',
        'What should I watch for when writing the report?',
        'Khi viết báo cáo cần lưu ý gì?'],
      ['B', '把你没能回答的部分也写进去，别人才知道你的结论能用到哪儿。', 'Bǎ nǐ méi néng huí dá de bù fen yě xiě jìn qù, bié ren cái zhī dào nǐ de jié lùn néng yòng dào nǎr.',
        'Write in the part you could not answer as well, so others know how far your conclusion reaches.',
        'Viết cả phần bạn chưa trả lời được vào, người khác mới biết kết luận của bạn dùng được đến đâu.']
    ],
    vocab: [['研究', 'yán jiū'], ['资料', 'zī liào'], ['方法', 'fāng fǎ'], ['数据', 'shù jù'], ['分析', 'fēn xī'],
      ['收集', 'shōu jí'], ['证据', 'zhèng jù'], ['结论', 'jié lùn'], ['调查', 'diào chá'], ['观察', 'guān chá'],
      ['记录', 'jì lù'], ['客观', 'kè guān'], ['报告', 'bào gào'], ['实验', 'shí yàn'], ['参考', 'cān kǎo'],
      ['过程', 'guò chéng'], ['统计', 'tǒng jì'], ['范围', 'fàn wéi']],
    grammar: [
      {
        pattern: '动词 + 不了',
        explEn: 'The negative potential complement: the action cannot be carried through, whatever the intention. It differs from 不能, which withholds permission or possibility from outside.',
        explVi: 'Bổ ngữ khả năng phủ định: hành động không thể thực hiện trọn vẹn, dù có ý định. Khác với 不能 vốn là không được phép hoặc không có khả năng từ bên ngoài.',
        examples: [
          ['只在一所学校收的数据，说明不了全国的情况。', 'Zhǐ zài yì suǒ xué xiào shōu de shù jù, shuō míng bu liǎo quán guó de qíng kuàng.', 'Data from one school cannot account for the whole country.', 'Dữ liệu chỉ thu ở một trường thì không nói lên được tình hình cả nước.'],
          ['这么少的证据，得不出这样的结论。', 'Zhè me shǎo de zhèng jù, dé bu chū zhè yàng de jié lùn.', 'So little evidence cannot yield such a conclusion.', 'Bằng chứng ít như vậy thì không rút ra được kết luận thế này.'],
          ['一个星期分析不了这么多资料。', 'Yí gè xīng qī fēn xī bu liǎo zhè me duō zī liào.', 'One week is not enough to analyse this much material.', 'Một tuần không phân tích nổi ngần này tài liệu.']
        ]
      },
      {
        pattern: '疑问词小句作宾语（问清楚谁……）',
        explEn: 'An embedded question serves as the object of a verb like 问清楚, 知道 or 看. The question word stays in place and no 吗 is added.',
        explVi: 'Một câu hỏi nhúng làm tân ngữ cho động từ như 问清楚, 知道 hay 看. Từ để hỏi giữ nguyên vị trí và không thêm 吗.',
        examples: [
          ['要问清楚谁收集的、在什么范围里收集的。', 'Yào wèn qīng chu shéi shōu jí de, zài shén me fàn wéi lǐ shōu jí de.', 'Ask clearly who collected it and within what scope.', 'Phải hỏi rõ ai thu thập và thu thập trong phạm vi nào.'],
          ['别人才知道你的结论能用到哪儿。', 'Bié ren cái zhī dào nǐ de jié lùn néng yòng dào nǎr.', 'Only then do others know how far your conclusion reaches.', 'Người khác mới biết kết luận của bạn dùng được đến đâu.'],
          ['先看这个方法是怎么设计的。', 'Xiān kàn zhè ge fāng fǎ shì zěn me shè jì de.', 'First look at how this method was designed.', 'Trước hết xem phương pháp này được thiết kế thế nào.']
        ]
      },
      {
        pattern: '动词 + 进去',
        explEn: 'A directional complement putting something inside a container, a document or a calculation. 把 usually fronts what goes in.',
        explVi: 'Bổ ngữ xu hướng đưa cái gì đó vào bên trong một vật chứa, một văn bản hay một phép tính. 把 thường đưa vật được đưa vào lên trước.',
        examples: [
          ['把你没能回答的部分也写进去。', 'Bǎ nǐ méi néng huí dá de bù fen yě xiě jìn qù.', 'Write in the part you could not answer as well.', 'Viết cả phần bạn chưa trả lời được vào.'],
          ['这个数字忘了算进去。', 'Zhè ge shù zì wàng le suàn jìn qù.', 'This figure was left out of the calculation.', 'Con số này quên tính vào.'],
          ['把观察到的例外也记进去。', 'Bǎ guān chá dào de lì wài yě jì jìn qù.', 'Record the exceptions you observed as well.', 'Ghi cả những ngoại lệ quan sát được vào.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '把问题改成能回答的样子',
        titleEn: 'Making a question answerable',
        titleVi: 'Sửa câu hỏi thành dạng trả lời được',
        zh: '"手机对学生有什么影响"这样的问题，看起来很大，其实没办法回答：影响谁、什么影响、多长时间里的影响，一个都没说清楚。把它改窄一点就不一样了："本校高二学生睡前使用手机的时间，和第二天上午课堂上打了几次瞌睡有没有关系"。改窄以后，需要收集什么数据、在什么范围里收集、用什么方法比较，全都跟着定下来了。判断一个研究问题合不合格，可以问三件事：能不能收集到相关的数据；不同的人按同样的方法做，会不会得到差不多的结果；假如结果和你想的相反，你认不认得出来。第三条最重要——一个不可能被证明是错的问题，也没办法被证明是对的。',
        en: 'A question like "what effect do phones have on students" looks large but cannot actually be answered: affect whom, in what respect, over how long — none of it is specified. Narrow it and everything changes: "is there any relation between how long Year 11 students at this school use their phones before bed and how many times they doze off in class the next morning?" Once narrowed, what data to gather, within what scope, and by what comparison all fall into place. Three tests show whether a research question is fit for use: can the relevant data be gathered; would different people following the same method get roughly the same result; and if the result came out opposite to what you expected, would you recognise it? The third matters most — a question that cannot possibly be shown to be wrong cannot be shown to be right either.',
        vi: 'Câu hỏi kiểu "điện thoại ảnh hưởng thế nào đến học sinh" nhìn thì rất lớn, thật ra không cách nào trả lời: ảnh hưởng đến ai, ảnh hưởng cái gì, trong khoảng thời gian bao lâu — chẳng điều nào được nói rõ. Thu hẹp lại một chút thì khác hẳn: "thời gian học sinh lớp 11 của trường dùng điện thoại trước khi ngủ có liên quan gì đến mấy lần gà gật trong giờ học sáng hôm sau không". Sau khi thu hẹp, cần thu thập dữ liệu gì, thu trong phạm vi nào, dùng cách nào để so sánh, tất cả đều theo đó mà định ra. Muốn biết một câu hỏi nghiên cứu có đạt không, có thể hỏi ba điều: có thu thập được dữ liệu liên quan không; người khác làm theo đúng phương pháp ấy có ra kết quả xấp xỉ không; và giả sử kết quả ngược với điều bạn nghĩ, bạn có nhận ra không. Điều thứ ba quan trọng nhất — một câu hỏi không thể bị chứng minh là sai thì cũng không thể được chứng minh là đúng.',
        questions: [
          { q: '短文说"手机对学生有什么影响"为什么回答不了？', qPinyin: 'Duǎn wén shuō "shǒu jī duì xué sheng yǒu shén me yǐng xiǎng" wèi shén me huí dá bu liǎo?',
            qEn: 'Why can the broad question not be answered?', qVi: 'Vì sao câu hỏi rộng đó không trả lời được?',
            options: [['影响谁、什么影响、多长时间，都没说清楚', 'ảnh hưởng đến ai, ảnh hưởng gì, bao lâu, đều chưa nói rõ'], ['因为手机太多了', 'vì điện thoại quá nhiều'], ['因为学生不愿意回答', 'vì học sinh không chịu trả lời']], correct: 0,
            explEn: '影响谁、什么影响、多长时间里的影响，一个都没说清楚.', explVi: '影响谁、什么影响、多长时间里的影响，一个都没说清楚.' },
          { q: '把问题改窄以后，什么会跟着定下来？', qPinyin: 'Bǎ wèn tí gǎi zhǎi yǐ hòu, shén me huì gēn zhe dìng xià lai?',
            qEn: 'What follows once the question is narrowed?', qVi: 'Sau khi thu hẹp câu hỏi thì điều gì được định ra theo?',
            options: [['收集什么数据、在什么范围、用什么方法比较', 'thu thập dữ liệu gì, trong phạm vi nào, so sánh bằng cách nào'], ['研究要花多少钱', 'nghiên cứu tốn bao nhiêu tiền'], ['结论一定是什么', 'kết luận chắc chắn là gì']], correct: 0,
            explEn: '需要收集什么数据、在什么范围里收集、用什么方法比较，全都跟着定下来了.', explVi: '需要收集什么数据、在什么范围里收集、用什么方法比较，全都跟着定下来了.' },
          { q: '三条标准里哪一条最重要，为什么？', qPinyin: 'Sān tiáo biāo zhǔn lǐ nǎ yì tiáo zuì zhòng yào, wèi shén me?',
            qEn: 'Which of the three tests matters most, and why?', qVi: 'Trong ba tiêu chí, tiêu chí nào quan trọng nhất và vì sao?',
            options: [['第三条，因为不可能被证明是错的，也不能被证明是对的', 'tiêu chí ba, vì không thể bị chứng minh sai thì cũng không thể chứng minh đúng'], ['第一条，因为数据最贵', 'tiêu chí một, vì dữ liệu đắt nhất'], ['第二条，因为人最多', 'tiêu chí hai, vì đông người nhất']], correct: 0,
            explEn: '第三条最重要——一个不可能被证明是错的问题，也没办法被证明是对的.', explVi: '第三条最重要——一个不可能被证明是错的问题，也没办法被证明是对的.' }
        ]
      },
      {
        titleZh: '一起出现不等于一个引起另一个',
        titleEn: 'Together is not because',
        titleVi: 'Cùng xuất hiện không bằng gây ra nhau',
        zh: '夏天里，卖冰淇淋的数量上去了，在水里出事的人也多了。两条线一起往上走，可是没有人会说吃冰淇淋会让人在水里出事——真正的原因是天气热，它同时把两件事推了上去。这个例子听起来很好笑，可是换成"用某个软件的学生成绩更好""喝这种茶的人活得更久"，不少人就当真了。看到两件事一起出现的时候，至少要想三种可能：可能是A引起B，可能是B引起A，也可能有第三个原因同时引起了两个。要分清楚它们，光看数字不够，还得设计一个能把其他原因排除掉的比较。这就是为什么研究里常常要找两组条件差不多、只在一件事上不同的人来比。',
        en: 'In summer, ice-cream sales rise and so do accidents in the water. The two lines climb together, yet nobody claims that eating ice cream causes drownings — the real cause is hot weather, which pushes both up at once. The example sounds funny, but recast it as "students who use a certain app get better marks" or "people who drink this tea live longer" and plenty of readers take it seriously. Whenever two things appear together, at least three possibilities must be considered: A may cause B, B may cause A, or a third cause may produce both. Telling them apart takes more than looking at numbers; it takes a comparison designed to rule the other causes out. That is why studies so often look for two groups alike in every condition but one.',
        vi: 'Vào mùa hè, lượng kem bán ra tăng lên, số người gặp nạn dưới nước cũng nhiều lên. Hai đường cùng đi lên, nhưng chẳng ai nói ăn kem khiến người ta gặp nạn dưới nước — nguyên nhân thật sự là trời nóng, nó đồng thời đẩy cả hai việc lên. Ví dụ này nghe thì buồn cười, nhưng đổi thành "học sinh dùng một phần mềm nào đó thì điểm cao hơn", "người uống loại trà này sống lâu hơn" thì không ít người lại tin thật. Khi thấy hai việc cùng xuất hiện, ít nhất phải nghĩ đến ba khả năng: có thể A gây ra B, có thể B gây ra A, cũng có thể có nguyên nhân thứ ba đồng thời gây ra cả hai. Muốn phân biệt được chúng thì chỉ nhìn con số là chưa đủ, còn phải thiết kế một phép so sánh loại trừ được các nguyên nhân khác. Đó chính là lý do trong nghiên cứu người ta thường tìm hai nhóm có điều kiện xấp xỉ nhau, chỉ khác nhau ở đúng một điểm, để đem ra so.',
        questions: [
          { q: '冰淇淋和水里出事同时增加的真正原因是什么？', qPinyin: 'Bīng qí lín hé shuǐ lǐ chū shì tóng shí zēng jiā de zhēn zhèng yuán yīn shì shén me?',
            qEn: 'What really drives both numbers up?', qVi: 'Nguyên nhân thật sự khiến cả hai cùng tăng là gì?',
            options: [['天气热', 'trời nóng'], ['冰淇淋太甜', 'kem quá ngọt'], ['水太深', 'nước quá sâu']], correct: 0,
            explEn: '真正的原因是天气热，它同时把两件事推了上去.', explVi: '真正的原因是天气热，它同时把两件事推了上去.' },
          { q: '看到两件事一起出现要想哪三种可能？', qPinyin: 'Kàn dào liǎng jiàn shì yì qǐ chū xiàn yào xiǎng nǎ sān zhǒng kě néng?',
            qEn: 'Which three possibilities must be weighed?', qVi: 'Thấy hai việc cùng xuất hiện phải nghĩ đến ba khả năng nào?',
            options: [['A引起B、B引起A、第三个原因引起两个', 'A gây ra B, B gây ra A, nguyên nhân thứ ba gây ra cả hai'], ['数据错了、方法错了、结论错了', 'dữ liệu sai, phương pháp sai, kết luận sai'], ['太多、太少、刚好', 'quá nhiều, quá ít, vừa đủ']], correct: 0,
            explEn: '可能是A引起B，可能是B引起A，也可能有第三个原因同时引起了两个.', explVi: '可能是A引起B，可能是B引起A，也可能有第三个原因同时引起了两个.' },
          { q: '研究里为什么要找条件差不多的两组人？', qPinyin: 'Yán jiū lǐ wèi shén me yào zhǎo tiáo jiàn chà bu duō de liǎng zǔ rén?',
            qEn: 'Why compare two otherwise similar groups?', qVi: 'Vì sao nghiên cứu cần hai nhóm điều kiện xấp xỉ nhau?',
            options: [['为了把其他原因排除掉', 'để loại trừ các nguyên nhân khác'], ['为了省钱', 'để tiết kiệm tiền'], ['为了让人数一样多', 'để số người bằng nhau']], correct: 0,
            explEn: '还得设计一个能把其他原因排除掉的比较.', explVi: '还得设计一个能把其他原因排除掉的比较.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '只在一所学校收的数据，说明___全国的情况。', pinyin: 'Zhǐ zài yì suǒ xué xiào shōu de shù jù, shuō míng ___ quán guó de qíng kuàng.',
        options: [['不了', 'không nổi'], ['不给', 'không cho'], ['没有', 'không có'], ['不用', 'không cần']], correct: 0,
        explEn: '不了 is the negative potential complement: the action cannot be carried through.', explVi: '不了 là bổ ngữ khả năng phủ định: hành động không thực hiện nổi.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '把你没能回答的部分也写___。', pinyin: 'Bǎ nǐ méi néng huí dá de bù fen yě xiě ___.',
        options: [['进去', 'vào'], ['过来', 'sang'], ['起来', 'lên'], ['下去', 'xuống tiếp']], correct: 0,
        explEn: '进去 puts something inside the document; 把 fronts what goes in.', explVi: '进去 đưa cái gì đó vào bên trong văn bản; 把 đưa vật đó lên trước.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：范围为什么这么重要？ B：___', pinyin: 'A: Fàn wéi wèi shén me zhè me zhòng yào? B: ___',
        options: [['只在一所学校收的数据，说明不了全国的情况。', 'Dữ liệu chỉ thu ở một trường không nói lên được tình hình cả nước.'], ['数据越多越好。', 'Dữ liệu càng nhiều càng tốt.'], ['我不太会用电脑。', 'Mình không rành máy tính lắm.'], ['报告下周交。', 'Báo cáo tuần sau nộp.']], correct: 0,
        explEn: 'The question asks why scope matters, so the answer must show what scope limits.', explVi: 'Câu hỏi hỏi vì sao phạm vi quan trọng, nên câu trả lời phải cho thấy phạm vi giới hạn điều gì.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，"喝这种茶的人活得更久"这句话的问题在哪儿？', pinyin: 'Gēn jù dì èr piān duǎn wén, "hē zhè zhǒng chá de rén huó de gèng jiǔ" zhè jù huà de wèn tí zài nǎr?',
        passage: 2, options: [['它把一起出现当成了一个引起另一个', 'nó coi việc cùng xuất hiện là cái này gây ra cái kia'], ['它的数字太小', 'con số của nó quá nhỏ'], ['它没有说是什么茶', 'nó không nói là trà gì'], ['它不够客气', 'nó không đủ lịch sự']], correct: 0,
        explEn: 'It is the same structure as the ice-cream example: 一起出现不等于一个引起另一个.', explVi: 'Nó cùng cấu trúc với ví dụ kem: cùng xuất hiện không có nghĩa cái này gây ra cái kia.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，一个问题越大越容易研究。', pinyin: 'Gēn jù dì yī piān duǎn wén, yí gè wèn tí yuè dà yuè róng yì yán jiū.',
        isTrue: false, passage: 1,
        explEn: '看起来很大，其实没办法回答……把它改窄一点就不一样了.', explVi: '看起来很大，其实没办法回答……把它改窄一点就不一样了.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '这么少的证据 / 得不出 / 这样的 / 结论', pinyin: 'zhè me shǎo de zhèng jù / dé bu chū / zhè yàng de / jié lùn',
        answer: '这么少的证据，得不出这样的结论。', answerVi: 'Bằng chứng ít như vậy thì không rút ra được kết luận thế này.',
        options: [['这么少的证据', 'bằng chứng ít như vậy'], ['得不出', 'không rút ra được'], ['这样的', 'thế này'], ['结论', 'kết luận']],
        explEn: 'The negative potential complement sits between the verb and its result.', explVi: 'Bổ ngữ khả năng phủ định nằm giữa động từ và kết quả của nó.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，第二条标准检查的是什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, dì èr tiáo biāo zhǔn jiǎn chá de shì shén me?',
        passage: 1, options: [['别人按同样的方法做能不能得到差不多的结果', 'người khác làm theo cùng phương pháp có ra kết quả xấp xỉ không'], ['数据够不够多', 'dữ liệu có đủ nhiều không'], ['结论合不合理', 'kết luận có hợp lý không'], ['问题够不够大', 'câu hỏi có đủ lớn không']], correct: 0,
        explEn: '不同的人按同样的方法做，会不会得到差不多的结果.', explVi: '不同的人按同样的方法做，会不会得到差不多的结果.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么说光看数字不够？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me shuō guāng kàn shù zì bú gòu?',
        passage: 2, options: [['数字看不出三种可能里是哪一种', 'con số không cho thấy đó là khả năng nào trong ba khả năng'], ['因为数字常常是假的', 'vì con số thường là giả'], ['因为数字太难懂', 'vì con số quá khó hiểu'], ['因为数字会变', 'vì con số sẽ thay đổi']], correct: 0,
        explEn: '要分清楚它们，光看数字不够，还得设计一个能把其他原因排除掉的比较.', explVi: '要分清楚它们，光看数字不够，还得设计一个能把其他原因排除掉的比较.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说看到数据要先问什么？', pinyin: 'B shuō kàn dào shù jù yào xiān wèn shén me?',
        line: 8, options: [['谁收集的、在什么范围里收集的', 'ai thu thập, thu thập trong phạm vi nào'], ['花了多少钱', 'tốn bao nhiêu tiền'], ['用了什么软件', 'dùng phần mềm gì'], ['什么时候发表的', 'công bố khi nào']], correct: 0,
        explEn: 'B says: 所以要问清楚：谁收集的、在什么范围里收集的.', explVi: 'B nói: 所以要问清楚：谁收集的、在什么范围里收集的.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么要求把没能回答的部分也写进报告？', pinyin: 'B wèi shén me yāo qiú bǎ méi néng huí dá de bù fen yě xiě jìn bào gào?',
        line: 14, options: [['别人才知道你的结论能用到哪儿', 'người khác mới biết kết luận dùng được đến đâu'], ['为了让报告更长', 'để báo cáo dài hơn'], ['为了下次接着做', 'để lần sau làm tiếp'], ['为了让结论更可信', 'để kết luận nghe đáng tin hơn']], correct: 0,
        explEn: 'B says: 把你没能回答的部分也写进去，别人才知道你的结论能用到哪儿.', explVi: 'B nói: 把你没能回答的部分也写进去，别人才知道你的结论能用到哪儿.' }
    ]
  },

  'hsk5-l11-standard-public-policy': {
    titleZh: '公共政策',
    titleEn: 'Public policy',
    titleVi: 'Chính sách công',
    summaryEn: 'Who pays for a policy, why a good design still goes wrong in execution, and why counting meetings is not the same as measuring effect.',
    summaryVi: 'Ai trả giá cho một chính sách, vì sao thiết kế tốt vẫn hỏng khi thực thi, và vì sao đếm số cuộc họp không phải là đo hiệu quả.',
    lines: [
      ['A', '可是政策一改，前面按老规定做的人怎么办？', 'Kě shì zhèng cè yì gǎi, qián miàn àn lǎo guī dìng zuò de rén zěn me bàn?',
        'But when a policy changes, what about those who followed the old rules?',
        'Nhưng chính sách vừa đổi thì những người trước đó làm theo quy định cũ tính sao?'],
      ['B', '所以好的调整会留一段慢慢换过来的时间，别让守规矩的人吃亏。', 'Suǒ yǐ hǎo de tiáo zhěng huì liú yí duàn màn man huàn guò lái de shí jiān, bié ràng shǒu guī ju de rén chī kuī.',
        'That is why a good adjustment leaves a stretch of time to switch over, so the rule-abiding do not lose out.',
        'Vì vậy một điều chỉnh tốt sẽ chừa một quãng thời gian để chuyển dần, đừng để người tuân thủ chịu thiệt.'],
      ['A', '有些政策听起来很好，做起来却没效果。', 'Yǒu xiē zhèng cè tīng qǐ lái hěn hǎo, zuò qǐ lái què méi xiào guǒ.',
        'Some policies sound good but produce no effect in practice.',
        'Có những chính sách nghe rất hay, làm ra lại không có hiệu quả.'],
      ['B', '常常是因为执行的人没有资源，或者目标定得太多。', 'Cháng cháng shì yīn wèi zhí xíng de rén méi yǒu zī yuán, huò zhě mù biāo dìng de tài duō.',
        'Usually because those carrying it out have no resources, or too many goals were set.',
        'Thường là vì người thực thi không có nguồn lực, hoặc mục tiêu đặt ra quá nhiều.'],
      ['A', '目标多也是问题吗？', 'Mù biāo duō yě shì wèn tí ma?',
        'Are many goals a problem too?',
        'Nhiều mục tiêu cũng là vấn đề à?'],
      ['B', '是，目标一多就互相打架，执行的人只好挑最容易的做。', 'Shì, mù biāo yì duō jiù hù xiāng dǎ jià, zhí xíng de rén zhǐ hǎo tiāo zuì róng yì de zuò.',
        'Yes — once there are many goals they fight each other, and those executing can only pick the easiest.',
        'Đúng, mục tiêu nhiều lên là chúng đánh nhau, người thực thi đành chọn cái dễ nhất mà làm.'],
      ['A', '那怎么知道一项政策真的有用？', 'Nà zěn me zhī dào yí xiàng zhèng cè zhēn de yǒu yòng?',
        'So how do we know a policy actually works?',
        'Vậy làm sao biết một chính sách thật sự có tác dụng?'],
      ['B', '看它想帮的那群人有没有真的过得好一点，别看开了多少会。', 'Kàn tā xiǎng bāng de nà qún rén yǒu méi yǒu zhēn de guò de hǎo yì diǎn, bié kàn kāi le duō shǎo huì.',
        'See whether the people it meant to help are actually a little better off, not how many meetings were held.',
        'Xem nhóm người nó muốn giúp có thật sự sống khá hơn một chút không, đừng nhìn đã họp bao nhiêu cuộc.']
    ],
    vocab: [['政策', 'zhèng cè'], ['利益', 'lì yì'], ['平衡', 'píng héng'], ['目标', 'mù biāo'], ['效果', 'xiào guǒ'],
      ['成本', 'chéng běn'], ['合理', 'hé lǐ'], ['执行', 'zhí xíng'], ['调整', 'tiáo zhěng'], ['政府', 'zhèng fǔ'],
      ['资源', 'zī yuán'], ['分配', 'fēn pèi'], ['措施', 'cuò shī'], ['优先', 'yōu xiān'], ['评估', 'píng gū'],
      ['制定', 'zhì dìng'], ['补贴', 'bǔ tiē'], ['群众', 'qún zhòng']],
    grammar: [
      {
        pattern: '一……就……',
        explEn: 'Ties a second event immediately to the first. 一 stands before the trigger and 就 before what follows; the two clauses usually share a subject or a topic.',
        explVi: 'Gắn sự việc thứ hai ngay sau sự việc thứ nhất. 一 đứng trước điều kích hoạt, 就 đứng trước điều theo sau; hai vế thường chung chủ ngữ hoặc chủ đề.',
        examples: [
          ['目标一多就互相打架。', 'Mù biāo yì duō jiù hù xiāng dǎ jià.', 'Once there are many goals they fight each other.', 'Mục tiêu nhiều lên là chúng đánh nhau.'],
          ['政策一改，前面按老规定做的人就有麻烦。', 'Zhèng cè yì gǎi, qián miàn àn lǎo guī dìng zuò de rén jiù yǒu má fan.', 'The moment a policy changes, those who followed the old rules are in trouble.', 'Chính sách vừa đổi là những người làm theo quy định cũ gặp rắc rối.'],
          ['补贴一停，很多人就付不起了。', 'Bǔ tiē yì tíng, hěn duō rén jiù fù bu qǐ le.', 'The moment the subsidy stops, many people cannot afford it.', 'Trợ cấp vừa dừng là nhiều người không trả nổi.']
        ]
      },
      {
        pattern: '只好 + 动词',
        explEn: 'Marks a fallback taken because nothing better is available. It reports constraint, not preference, and stands before the verb.',
        explVi: 'Đánh dấu phương án bất đắc dĩ vì không còn cách nào hơn. Nó nói lên sự ràng buộc chứ không phải sở thích, và đứng trước động từ.',
        examples: [
          ['执行的人只好挑最容易的做。', 'Zhí xíng de rén zhǐ hǎo tiāo zuì róng yì de zuò.', 'Those executing can only pick the easiest.', 'Người thực thi đành chọn cái dễ nhất mà làm.'],
          ['资源不够，我们只好先做一个地区。', 'Zī yuán bú gòu, wǒ men zhǐ hǎo xiān zuò yí gè dì qū.', 'With too few resources we could only start with one region.', 'Nguồn lực không đủ, chúng tôi đành làm một khu vực trước.'],
          ['数据来不及收集，他只好推迟评估。', 'Shù jù lái bu jí shōu jí, tā zhǐ hǎo tuī chí píng gū.', 'The data could not be gathered in time, so he had to postpone the assessment.', 'Dữ liệu không kịp thu thập, anh ấy đành hoãn việc đánh giá.']
        ]
      },
      {
        pattern: '根据……（来）+ 动词',
        explEn: 'Names the basis an action is taken on. 根据 heads a phrase before the verb and reports evidence or a rule, not a cause.',
        explVi: 'Nêu căn cứ mà hành động dựa vào. 根据 dẫn đầu một ngữ đứng trước động từ và nêu bằng chứng hoặc quy tắc, không phải nguyên nhân.',
        examples: [
          ['应该根据实际情况及时调整。', 'Yīng gāi gēn jù shí jì qíng kuàng jí shí tiáo zhěng.', 'It should be adjusted in time according to the actual situation.', 'Nên điều chỉnh kịp thời căn cứ vào tình hình thực tế.'],
          ['补贴根据收入来分配。', 'Bǔ tiē gēn jù shōu rù lái fēn pèi.', 'The subsidy is allocated according to income.', 'Trợ cấp được phân bổ căn cứ theo thu nhập.'],
          ['他们根据三年的数据评估效果。', 'Tā men gēn jù sān nián de shù jù píng gū xiào guǒ.', 'They assess the effect on three years of data.', 'Họ đánh giá hiệu quả dựa trên dữ liệu ba năm.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '这项政策的钱是谁出的',
        titleEn: 'Who pays for it',
        titleVi: 'Tiền của chính sách này là ai bỏ ra',
        zh: '看一项政策，先别看它想做什么，先看这笔成本落在谁身上。几乎每项政策都是把资源从一部分人手里挪到另一部分人手里，只是有时候写得很明白，有时候藏在别的地方。降低一种药的价格，好处很集中，几十万病人立刻感觉得到；成本却很分散，可能是所有交税的人每人几块钱，也可能是生产的企业以后少研究一种新药。好处集中、成本分散的政策最容易通过，因为得到好处的人会说话，付钱的人常常不知道自己付了。反过来，好处分散、成本集中的政策最难做，哪怕它对整个社会更值得。所以评估一项政策，除了问"有没有效果"，还要问"谁得到了、谁付出了、他们知不知道"。',
        en: 'When looking at a policy, do not start with what it aims to do; start with who the cost lands on. Almost every policy moves resources from one group of hands to another; sometimes this is stated plainly and sometimes it is tucked away. Cutting the price of a medicine concentrates the benefit — several hundred thousand patients feel it at once — while the cost is spread thin: a few yuan from everyone who pays tax, or one fewer new drug researched by the manufacturer later. Policies with concentrated benefits and diffuse costs pass most easily, because those who gain speak up while those who pay often do not know they are paying. Conversely, policies with diffuse benefits and concentrated costs are hardest to enact, even when they are worth more to society as a whole. So assessing a policy means asking, beyond "does it work", also "who gained, who paid, and did they know".',
        vi: 'Nhìn một chính sách, đừng xem trước nó muốn làm gì, hãy xem trước cái chi phí ấy rơi vào ai. Gần như mọi chính sách đều chuyển nguồn lực từ tay nhóm người này sang tay nhóm người khác, chỉ là có lúc viết rất rõ, có lúc giấu ở chỗ khác. Hạ giá một loại thuốc thì lợi ích rất tập trung, mấy trăm nghìn bệnh nhân lập tức cảm nhận được; còn chi phí lại rất phân tán, có thể là mỗi người đóng thuế vài đồng, cũng có thể là doanh nghiệp sản xuất về sau nghiên cứu ít đi một loại thuốc mới. Chính sách lợi ích tập trung, chi phí phân tán là dễ được thông qua nhất, vì người hưởng lợi sẽ lên tiếng còn người trả tiền thường không biết mình đã trả. Ngược lại, chính sách lợi ích phân tán, chi phí tập trung là khó làm nhất, dù nó đáng giá hơn với toàn xã hội. Vì vậy đánh giá một chính sách, ngoài việc hỏi "có hiệu quả không", còn phải hỏi "ai được, ai trả, và họ có biết không".',
        questions: [
          { q: '短文建议看政策时先看什么？', qPinyin: 'Duǎn wén jiàn yì kàn zhèng cè shí xiān kàn shén me?',
            qEn: 'What should be looked at first?', qVi: 'Bài đọc khuyên xem chính sách thì xem gì trước?',
            options: [['这笔成本落在谁身上', 'chi phí ấy rơi vào ai'], ['它想做什么', 'nó muốn làm gì'], ['谁制定的', 'ai ban hành']], correct: 0,
            explEn: '先别看它想做什么，先看这笔成本落在谁身上.', explVi: '先别看它想做什么，先看这笔成本落在谁身上.' },
          { q: '什么样的政策最容易通过？', qPinyin: 'Shén me yàng de zhèng cè zuì róng yì tōng guò?',
            qEn: 'Which policies pass most easily?', qVi: 'Chính sách kiểu nào dễ được thông qua nhất?',
            options: [['好处集中、成本分散的', 'lợi ích tập trung, chi phí phân tán'], ['好处分散、成本集中的', 'lợi ích phân tán, chi phí tập trung'], ['花钱最少的', 'tốn ít tiền nhất']], correct: 0,
            explEn: '好处集中、成本分散的政策最容易通过.', explVi: '好处集中、成本分散的政策最容易通过.' },
          { q: '除了"有没有效果"，还应该问什么？', qPinyin: 'Chú le "yǒu méi yǒu xiào guǒ", hái yīng gāi wèn shén me?',
            qEn: 'What else should be asked?', qVi: 'Ngoài "có hiệu quả không" còn nên hỏi gì?',
            options: [['谁得到了、谁付出了、他们知不知道', 'ai được, ai trả, họ có biết không'], ['花了多长时间', 'mất bao lâu'], ['有多少人赞成', 'bao nhiêu người tán thành']], correct: 0,
            explEn: '还要问"谁得到了、谁付出了、他们知不知道".', explVi: '还要问"谁得到了、谁付出了、他们知不知道".' }
        ]
      },
      {
        titleZh: '好政策为什么会走样',
        titleEn: 'Why a good policy loses shape',
        titleVi: 'Vì sao chính sách tốt lại méo mó',
        zh: '一项政策从纸上到人的生活里，中间要经过很多层。每一层都有自己的困难：钱不够、做事的人不够、上面同时还压着别的任务。所以设计得再好的措施，如果没有给执行的人相应的资源和时间，最后做出来的常常只剩下形式。另一个常见的毛病是考核方法。上面用什么来检查，下面就做什么：如果只统计开了多少会、发了多少材料，那么会一定开够，材料一定发足，可是想帮的人未必好过一点。要让政策不走样，考核就必须落在最后那群人身上，比如看排队的时间短了没有、拿到补贴的人是不是本来最需要的。这样的数据收集起来更麻烦，可是只有它才能说明政策是不是真的到了地面上。',
        en: 'A policy passes through many layers on its way from paper into people\'s lives, and each layer has its own difficulties: not enough money, not enough people to do the work, other tasks pressing from above at the same time. However well a measure is designed, if those executing it are not given matching resources and time, what finally emerges is often no more than form. The other common fault is how performance is checked. Whatever the level above measures, the level below produces: if only the number of meetings held and documents issued is counted, then meetings will certainly be held and documents certainly issued, while the people meant to be helped may be no better off. To keep a policy in shape, the check must land on that final group — how much shorter the queue has become, whether those receiving the subsidy were the ones who needed it most. Such data is more troublesome to gather, but only it can show whether the policy reached the ground.',
        vi: 'Một chính sách đi từ trên giấy vào đời sống con người phải qua rất nhiều tầng. Mỗi tầng đều có cái khó riêng: không đủ tiền, không đủ người làm việc, phía trên còn đang ép thêm những nhiệm vụ khác. Vì vậy biện pháp dù thiết kế hay đến mấy, nếu không trao cho người thực thi nguồn lực và thời gian tương ứng thì thứ làm ra cuối cùng thường chỉ còn lại hình thức. Một tật thường gặp khác là cách kiểm tra thành tích. Trên dùng gì để kiểm thì dưới làm ra thứ đó: nếu chỉ thống kê đã họp bao nhiêu cuộc, phát bao nhiêu tài liệu thì họp chắc chắn sẽ đủ, tài liệu chắc chắn sẽ phát đủ, nhưng người muốn giúp chưa chắc đã khá hơn chút nào. Muốn chính sách không méo mó thì việc kiểm tra phải rơi vào nhóm người cuối cùng ấy, chẳng hạn xem thời gian xếp hàng có ngắn lại không, người nhận trợ cấp có đúng là người vốn cần nhất không. Loại dữ liệu này thu thập phiền hơn, nhưng chỉ nó mới nói lên được chính sách có thật sự chạm tới mặt đất hay chưa.',
        questions: [
          { q: '短文说设计得再好的措施在什么情况下只剩形式？', qPinyin: 'Duǎn wén shuō shè jì de zài hǎo de cuò shī zài shén me qíng kuàng xià zhǐ shèng xíng shì?',
            qEn: 'When does a well-designed measure become mere form?', qVi: 'Biện pháp dù hay khi nào thì chỉ còn lại hình thức?',
            options: [['没有给执行的人相应的资源和时间', 'không cho người thực thi nguồn lực và thời gian tương ứng'], ['写得太长', 'viết quá dài'], ['宣传得不够', 'tuyên truyền chưa đủ']], correct: 0,
            explEn: '如果没有给执行的人相应的资源和时间，最后做出来的常常只剩下形式.', explVi: '如果没有给执行的人相应的资源和时间，最后做出来的常常只剩下形式.' },
          { q: '"上面用什么来检查，下面就做什么"说明了什么？', qPinyin: '"Shàng miàn yòng shén me lái jiǎn chá, xià miàn jiù zuò shén me" shuō míng le shén me?',
            qEn: 'What does that sentence illustrate?', qVi: 'Câu đó cho thấy điều gì?',
            options: [['考核方法会决定下面做什么', 'cách kiểm tra quyết định bên dưới làm gì'], ['下面的人不听话', 'người bên dưới không nghe lời'], ['检查越多越好', 'càng kiểm tra nhiều càng tốt']], correct: 0,
            explEn: '另一个常见的毛病是考核方法。上面用什么来检查，下面就做什么.', explVi: '另一个常见的毛病是考核方法。上面用什么来检查，下面就做什么.' },
          { q: '短文举了哪种落在最后那群人身上的考核？', qPinyin: 'Duǎn wén jǔ le nǎ zhǒng luò zài zuì hòu nà qún rén shēn shàng de kǎo hé?',
            qEn: 'What example of a ground-level measure is given?', qVi: 'Bài đọc nêu ví dụ nào cho việc kiểm tra rơi vào nhóm cuối?',
            options: [['排队的时间短了没有', 'thời gian xếp hàng có ngắn lại không'], ['开了多少会', 'đã họp bao nhiêu cuộc'], ['发了多少材料', 'phát bao nhiêu tài liệu']], correct: 0,
            explEn: '比如看排队的时间短了没有、拿到补贴的人是不是本来最需要的.', explVi: '比如看排队的时间短了没有、拿到补贴的人是不是本来最需要的.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '目标___多___互相打架。', pinyin: 'Mù biāo ___ duō ___ hù xiāng dǎ jià.',
        options: [['一……就', 'vừa… là'], ['越……越', 'càng… càng'], ['虽然……但是', 'tuy… nhưng'], ['因为……所以', 'vì… nên']], correct: 0,
        explEn: '一 stands before the trigger and 就 before what follows immediately.', explVi: '一 đứng trước điều kích hoạt, 就 đứng trước hệ quả xảy ra ngay sau.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '资源不够，我们___先做一个地区。', pinyin: 'Zī yuán bú gòu, wǒ men ___ xiān zuò yí gè dì qū.',
        options: [['只好', 'đành'], ['只是', 'chỉ là'], ['幸亏', 'may mà'], ['难免', 'khó tránh']], correct: 0,
        explEn: '只好 marks a fallback taken because nothing better is available.', explVi: '只好 đánh dấu phương án bất đắc dĩ vì không còn cách nào hơn.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：有些政策听起来很好，做起来却没效果。 B：___', pinyin: 'A: Yǒu xiē zhèng cè tīng qǐ lái hěn hǎo, zuò qǐ lái què méi xiào guǒ. B: ___',
        options: [['常常是因为执行的人没有资源，或者目标定得太多。', 'Thường vì người thực thi không có nguồn lực, hoặc mục tiêu đặt quá nhiều.'], ['那就别做了。', 'Vậy thì đừng làm nữa.'], ['政策每年都有。', 'Năm nào cũng có chính sách.'], ['我没看过那份文件。', 'Mình chưa đọc văn bản đó.']], correct: 0,
        explEn: 'The remark states a gap between design and effect, so the answer must explain it.', explVi: 'Lời nhận xét nêu khoảng cách giữa thiết kế và hiệu quả, nên câu trả lời phải giải thích nó.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么只统计开了多少次会会让政策走样？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me zhǐ tǒng jì kāi le duō shǎo cì huì huì ràng zhèng cè zǒu yàng?',
        passage: 2, options: [['上面查什么，下面就只做什么', 'trên kiểm gì thì dưới chỉ làm cái đó'], ['因为开会最花钱', 'vì họp tốn tiền nhất'], ['因为没人愿意开会', 'vì không ai muốn họp'], ['因为会议记录会丢', 'vì biên bản họp sẽ thất lạc']], correct: 0,
        explEn: '上面用什么来检查，下面就做什么……可是想帮的人未必好过一点.', explVi: '上面用什么来检查，下面就做什么……可是想帮的人未必好过一点.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，好处分散、成本集中的政策最容易通过。', pinyin: 'Gēn jù dì yī piān duǎn wén, hǎo chu fēn sàn, chéng běn jí zhōng de zhèng cè zuì róng yì tōng guò.',
        isTrue: false, passage: 1,
        explEn: '好处分散、成本集中的政策最难做，哪怕它对整个社会更值得.', explVi: '好处分散、成本集中的政策最难做，哪怕它对整个社会更值得.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '补贴 / 根据 / 收入 / 来 / 分配', pinyin: 'bǔ tiē / gēn jù / shōu rù / lái / fēn pèi',
        answer: '补贴根据收入来分配。', answerVi: 'Trợ cấp được phân bổ căn cứ theo thu nhập.',
        options: [['补贴', 'trợ cấp'], ['根据', 'căn cứ'], ['收入', 'thu nhập'], ['来', 'mà'], ['分配', 'phân bổ']],
        explEn: '根据 heads a phrase that sits before the verb it supports.', explVi: '根据 dẫn đầu một ngữ đứng trước động từ mà nó bổ trợ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，降低药价的成本可能落在谁身上？', pinyin: 'Gēn jù dì yī piān duǎn wén, jiàng dī yào jià de chéng běn kě néng luò zài shéi shēn shàng?',
        passage: 1, options: [['所有交税的人，或者以后少研究一种新药的企业', 'tất cả người đóng thuế, hoặc doanh nghiệp sau này nghiên cứu ít đi một loại thuốc mới'], ['只有病人自己', 'chỉ có bản thân bệnh nhân'], ['只有医院', 'chỉ có bệnh viện'], ['没有人', 'không ai cả']], correct: 0,
        explEn: '可能是所有交税的人每人几块钱，也可能是生产的企业以后少研究一种新药.', explVi: '可能是所有交税的人每人几块钱，也可能是生产的企业以后少研究一种新药.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么落在最后那群人身上的数据更值得收集？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me luò zài zuì hòu nà qún rén shēn shàng de shù jù gèng zhí de shōu jí?',
        passage: 2, options: [['只有它能说明政策是不是真的到了地面上', 'chỉ có nó mới nói lên chính sách có thật sự chạm tới mặt đất'], ['因为它最容易收集', 'vì nó dễ thu thập nhất'], ['因为上面要求这样', 'vì cấp trên yêu cầu vậy'], ['因为它数字最大', 'vì con số của nó lớn nhất']], correct: 0,
        explEn: '这样的数据收集起来更麻烦，可是只有它才能说明政策是不是真的到了地面上.', explVi: '这样的数据收集起来更麻烦，可是只有它才能说明政策是不是真的到了地面上.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说好的政策调整会做什么？', pinyin: 'B shuō hǎo de zhèng cè tiáo zhěng huì zuò shén me?',
        line: 8, options: [['留一段慢慢换过来的时间，别让守规矩的人吃亏', 'chừa một quãng thời gian chuyển dần, đừng để người tuân thủ chịu thiệt'], ['马上全部执行', 'thực thi toàn bộ ngay lập tức'], ['先不告诉大家', 'tạm thời không nói cho mọi người'], ['只在一个地区做', 'chỉ làm ở một khu vực']], correct: 0,
        explEn: 'B says: 所以好的调整会留一段慢慢换过来的时间，别让守规矩的人吃亏.', explVi: 'B nói: 所以好的调整会留一段慢慢换过来的时间，别让守规矩的人吃亏.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为怎么判断一项政策真的有用？', pinyin: 'B rèn wéi zěn me pàn duàn yí xiàng zhèng cè zhēn de yǒu yòng?',
        line: 14, options: [['看想帮的那群人有没有真的过得好一点', 'xem nhóm người muốn giúp có thật sự sống khá hơn không'], ['看开了多少会', 'xem đã họp bao nhiêu cuộc'], ['看花了多少钱', 'xem tiêu bao nhiêu tiền'], ['看有多少人知道', 'xem bao nhiêu người biết']], correct: 0,
        explEn: 'B says: 看它想帮的那群人有没有真的过得好一点，别看开了多少会.', explVi: 'B nói: 看它想帮的那群人有没有真的过得好一点，别看开了多少会.' }
    ]
  }
};
