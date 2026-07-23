// HSK5 (C1) lessons 06-07. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l06-standard-ethics': {
    titleZh: '法律之上的判断',
    titleEn: 'Judgement above the law',
    titleVi: 'Phán đoán trên cả luật pháp',
    summaryEn: 'What to do when the rule itself looks wrong, why "nobody will see" is not a reason, and the visibility test for decisions the law says nothing about.',
    summaryVi: 'Làm gì khi chính quy định có vấn đề, vì sao "không ai thấy" không phải một lý do, và phép thử công khai cho những quyết định luật không nói tới.',
    lines: [
      ['A', '可是在公司里，说出不同意见常常有风险。', 'Kě shì zài gōng sī lǐ, shuō chū bù tóng yì jiàn cháng cháng yǒu fēng xiǎn.',
        'But in a company, voicing a different opinion often carries risk.',
        'Nhưng trong công ty, nói ra ý kiến khác thường có rủi ro.'],
      ['B', '所以要看这个地方允不允许有人说"我觉得不对"。', 'Suǒ yǐ yào kàn zhè ge dì fang yǔn bu yǔn xǔ yǒu rén shuō "wǒ jué de bú duì".',
        'So it depends on whether the place allows anyone to say "I think this is wrong".',
        'Vì vậy phải xem nơi đó có cho phép ai đó nói "tôi thấy không đúng" hay không.'],
      ['A', '万一规定本来就有问题呢？', 'Wàn yī guī dìng běn lái jiù yǒu wèn tí ne?',
        'What if the rule itself is the problem?',
        'Lỡ chính quy định đã có vấn đề thì sao?'],
      ['B', '那就先按规定做，再把问题正式提出来，这两件事不冲突。', 'Nà jiù xiān àn guī dìng zuò, zài bǎ wèn tí zhèng shì tí chū lái, zhè liǎng jiàn shì bù chōng tū.',
        'Then follow the rule first and raise the problem formally after — the two do not conflict.',
        'Vậy thì trước hết cứ làm theo quy định, rồi nêu vấn đề một cách chính thức, hai việc này không xung đột.'],
      ['A', '有些事法律没规定，怎么判断？', 'Yǒu xiē shì fǎ lǜ méi guī dìng, zěn me pàn duàn?',
        'How do you judge things the law says nothing about?',
        'Có những việc luật không quy định, phán đoán thế nào?'],
      ['B', '问自己一句：这件事如果被所有人看见，我还愿意这么做吗？', 'Wèn zì jǐ yí jù: zhè jiàn shì rú guǒ bèi suǒ yǒu rén kàn jiàn, wǒ hái yuàn yì zhè me zuò ma?',
        'Ask yourself one question: if everyone could see this, would I still be willing to do it?',
        'Hãy tự hỏi một câu: nếu việc này bị tất cả mọi người nhìn thấy, mình còn muốn làm vậy không?'],
      ['A', '那要是为了帮朋友，稍微违反一点规定呢？', 'Nà yào shi wèi le bāng péng you, shāo wēi wéi fǎn yì diǎn guī dìng ne?',
        'And what about bending a rule slightly to help a friend?',
        'Thế còn vì giúp bạn mà vi phạm quy định một chút thì sao?'],
      ['B', '宁可让朋友失望，也不要让自己以后不敢说这件事。', 'Nìng kě ràng péng you shī wàng, yě bú yào ràng zì jǐ yǐ hòu bù gǎn shuō zhè jiàn shì.',
        'Better to disappoint a friend than to end up unable to talk about what you did.',
        'Thà để bạn thất vọng, còn hơn để sau này chính mình không dám nói ra chuyện đó.']
    ],
    vocab: [['法律', 'fǎ lǜ'], ['判断', 'pàn duàn'], ['公平', 'gōng píng'], ['后果', 'hòu guǒ'], ['标准', 'biāo zhǔn'],
      ['沟通', 'gōu tōng'], ['责任', 'zé rèn'], ['诚实', 'chéng shí'], ['原则', 'yuán zé'], ['利益', 'lì yì'],
      ['冲突', 'chōng tū'], ['尊重', 'zūn zhòng'], ['道德', 'dào dé'], ['允许', 'yǔn xǔ'], ['违反', 'wéi fǎn'],
      ['信任', 'xìn rèn'], ['规定', 'guī dìng'], ['保密', 'bǎo mì']],
    grammar: [
      {
        pattern: 'A不AB（允不允许、同不同意）',
        explEn: 'The A-not-A question for a two-syllable verb: the first syllable is repeated around 不, and the second syllable appears only once at the end.',
        explVi: 'Dạng câu hỏi A-không-A với động từ hai âm tiết: âm tiết đầu lặp lại quanh 不, âm tiết thứ hai chỉ xuất hiện một lần ở cuối.',
        examples: [
          ['要看这个地方允不允许有人说"我觉得不对"。', 'Yào kàn zhè ge dì fang yǔn bu yǔn xǔ yǒu rén shuō "wǒ jué de bú duì".', 'It depends on whether the place allows anyone to say "I think this is wrong".', 'Phải xem nơi đó có cho phép ai nói "tôi thấy không đúng" không.'],
          ['你先问他同不同意这个标准。', 'Nǐ xiān wèn tā tóng bu tóng yì zhè ge biāo zhǔn.', 'First ask him whether he agrees with this standard.', 'Trước hết hỏi anh ấy có đồng ý với tiêu chuẩn này không.'],
          ['这个做法公不公平，得听听两边的意见。', 'Zhè ge zuò fǎ gōng bu gōng píng, děi tīng ting liǎng biān de yì jiàn.', 'Whether this is fair requires hearing both sides.', 'Cách làm này công bằng hay không, phải nghe ý cả hai bên.']
        ]
      },
      {
        pattern: '宁可……，也不……',
        explEn: 'Chooses the lesser of two costs. 宁可 marks the price you accept, 也不 the one you refuse; both clauses share the same subject.',
        explVi: 'Chọn cái giá nhẹ hơn trong hai cái giá. 宁可 nêu điều bạn chấp nhận, 也不 nêu điều bạn từ chối; hai vế cùng một chủ ngữ.',
        examples: [
          ['宁可让朋友失望，也不要让自己以后不敢说这件事。', 'Nìng kě ràng péng you shī wàng, yě bú yào ràng zì jǐ yǐ hòu bù gǎn shuō zhè jiàn shì.', 'Better to disappoint a friend than to end up unable to talk about it.', 'Thà để bạn thất vọng còn hơn sau này không dám nói ra chuyện đó.'],
          ['他宁可少赚一点，也不违反规定。', 'Tā nìng kě shǎo zhuàn yì diǎn, yě bù wéi fǎn guī dìng.', 'He would rather earn less than break the rules.', 'Anh ấy thà kiếm ít đi chứ không vi phạm quy định.'],
          ['宁可把话说清楚，也不留下误会。', 'Nìng kě bǎ huà shuō qīng chu, yě bù liú xià wù huì.', 'Better to say it plainly than to leave a misunderstanding.', 'Thà nói cho rõ còn hơn để lại hiểu lầm.']
        ]
      },
      {
        pattern: '本来就 + 形容词/动词',
        explEn: 'Says a condition was already there before the current situation, so it is not a new consequence. 就 follows 本来 and precedes what was already true.',
        explVi: 'Nói rằng một tình trạng đã có sẵn từ trước tình huống hiện tại, nên nó không phải hệ quả mới. 就 đứng sau 本来 và trước điều vốn đã đúng.',
        examples: [
          ['万一规定本来就有问题呢？', 'Wàn yī guī dìng běn lái jiù yǒu wèn tí ne?', 'What if the rule was flawed to begin with?', 'Lỡ quy định vốn đã có vấn đề thì sao?'],
          ['这两个原则本来就不一样。', 'Zhè liǎng gè yuán zé běn lái jiù bù yí yàng.', 'These two principles were never the same.', 'Hai nguyên tắc này vốn đã khác nhau.'],
          ['道德的要求本来就比法律高。', 'Dào dé de yāo qiú běn lái jiù bǐ fǎ lǜ gāo.', 'Ethical demands were always higher than legal ones.', 'Yêu cầu đạo đức vốn đã cao hơn pháp luật.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '法律是地板，不是天花板',
        titleEn: 'The law is a floor, not a ceiling',
        titleVi: 'Luật là sàn nhà, không phải trần nhà',
        zh: '法律规定的是每个人都不能低于的那条线，它管的事情其实很少。一天里我们做的大部分决定，法律都没有意见：要不要把坏消息告诉同事，要不要在别人不在的时候替他说话，收到不该收到的资料该怎么处理。这些事没有条文可查，只能自己判断。有三个问题可以用：第一，我的决定会影响谁，他们有没有机会说话；第二，如果换成我在他的位置上，我会觉得这样公平吗；第三，这件事三年以后我还愿意承认吗。第一个问题看的是利益，第二个看的是尊重，第三个看的是自己。三个都过得去，一般就不会错得太远。',
        en: 'The law sets the line below which nobody may fall, and it governs surprisingly little. Most of the decisions we make in a day draw no comment from it: whether to pass bad news to a colleague, whether to speak up for someone who is not in the room, what to do with material that reached you by mistake. There is no clause to look up for these; you can only judge for yourself. Three questions help. First, who does my decision affect, and have they had any chance to speak? Second, if I were in their position, would this look fair to me? Third, will I still be willing to admit to this in three years? The first question is about interests, the second about respect, the third about yourself. Pass all three and you will usually not be far wrong.',
        vi: 'Pháp luật quy định cái ranh giới mà không ai được xuống dưới, và thật ra nó quản rất ít việc. Phần lớn quyết định ta đưa ra trong một ngày, luật chẳng có ý kiến gì: có nên báo tin xấu cho đồng nghiệp không, có nên nói đỡ cho người vắng mặt không, nhận được tài liệu lẽ ra không được nhận thì xử lý thế nào. Những việc này không có điều khoản nào để tra, chỉ có thể tự mình phán đoán. Có ba câu hỏi dùng được: một, quyết định của tôi ảnh hưởng đến ai, họ có cơ hội lên tiếng không; hai, nếu đổi lại tôi ở vị trí của họ, tôi có thấy như vậy là công bằng không; ba, ba năm sau tôi còn muốn thừa nhận việc này không. Câu thứ nhất nhìn vào lợi ích, câu thứ hai nhìn vào sự tôn trọng, câu thứ ba nhìn vào chính mình. Vượt được cả ba thì thường sẽ không sai quá xa.',
        questions: [
          { q: '短文用什么比喻说明法律的作用？', qPinyin: 'Duǎn wén yòng shén me bǐ yù shuō míng fǎ lǜ de zuò yòng?',
            qEn: 'What image does the text use for the law?', qVi: 'Bài đọc dùng hình ảnh gì để nói về vai trò của luật?',
            options: [['每个人都不能低于的那条线', 'ranh giới mà không ai được xuống dưới'], ['谁都够不到的高处', 'chỗ cao không ai với tới'], ['一份完整的说明书', 'một bản hướng dẫn đầy đủ']], correct: 0,
            explEn: '法律规定的是每个人都不能低于的那条线.', explVi: '法律规定的是每个人都不能低于的那条线.' },
          { q: '第二个问题看的是什么？', qPinyin: 'Dì èr gè wèn tí kàn de shì shén me?',
            qEn: 'What is the second question about?', qVi: 'Câu hỏi thứ hai nhìn vào điều gì?',
            options: [['尊重', 'sự tôn trọng'], ['利益', 'lợi ích'], ['自己', 'chính mình']], correct: 0,
            explEn: '第一个问题看的是利益，第二个看的是尊重，第三个看的是自己.', explVi: '第一个问题看的是利益，第二个看的是尊重，第三个看的是自己.' },
          { q: '短文举了哪一类法律不管的决定？', qPinyin: 'Duǎn wén jǔ le nǎ yí lèi fǎ lǜ bù guǎn de jué dìng?',
            qEn: 'Which kind of decision does the text give as an example?', qVi: 'Bài đọc nêu ví dụ loại quyết định nào luật không quản?',
            options: [['收到不该收到的资料该怎么处理', 'nhận tài liệu lẽ ra không được nhận thì xử lý ra sao'], ['公司该交多少税', 'công ty phải nộp bao nhiêu thuế'], ['合同该怎么签', 'hợp đồng phải ký thế nào']], correct: 0,
            explEn: '收到不该收到的资料该怎么处理……这些事没有条文可查.', explVi: '收到不该收到的资料该怎么处理……这些事没有条文可查.' }
        ]
      },
      {
        titleZh: '"大家都这么做"为什么不是理由',
        titleEn: 'Why "everyone does it" is not a reason',
        titleVi: 'Vì sao "ai cũng làm thế" không phải lý do',
        zh: '为一个做法找理由时，最容易出口的说法是"大家都这么做"。它听起来很有力，其实什么也没说明：它只报告了一个事实，没有回答这件事为什么是对的。如果有一天大家都改了，同样的说法就会得出相反的结论，这就说明它不是一个真的理由。另一个常见的说法是"反正没人知道"。这句话更值得小心，因为它承认了这件事经不起被看见——一个要靠没人发现才能成立的决定，本来就已经回答了它自己。所以有一个简单的办法：把你的理由完整地说给一个不相干的人听。如果说到一半你自己都想改口，那问题不在听的人身上。',
        en: 'The easiest thing to say in justifying a practice is "everyone does it". It sounds forceful yet explains nothing: it reports a fact without answering why the thing is right. If one day everyone changed, the same sentence would produce the opposite conclusion — which shows it was never a real reason. Another common line is "nobody will know anyway". That one deserves more caution, because it concedes that the act cannot survive being seen; a decision that only stands while nobody notices has already answered the question about itself. So there is a simple method: state your reason in full to someone with no stake in it. If you find yourself wanting to rephrase halfway through, the problem does not lie with the listener.',
        vi: 'Khi tìm lý do cho một cách làm, câu dễ buột ra nhất là "ai cũng làm thế". Nghe thì rất có lực, thực ra chẳng nói lên điều gì: nó chỉ báo cáo một sự thật chứ không trả lời vì sao việc đó là đúng. Nếu một ngày nào đó mọi người đều đổi, chính câu ấy sẽ cho ra kết luận ngược lại — điều đó cho thấy nó chưa bao giờ là một lý do thật. Một câu thường gặp khác là "dù sao cũng chẳng ai biết". Câu này càng đáng dè chừng, vì nó đã thừa nhận rằng việc đó không chịu nổi việc bị nhìn thấy — một quyết định phải dựa vào chuyện không ai phát hiện mới đứng vững thì vốn đã tự trả lời cho chính nó. Vậy nên có một cách đơn giản: nói trọn vẹn lý do của bạn cho một người không liên quan nghe. Nếu nói được nửa chừng mà chính bạn đã muốn đổi cách nói, thì vấn đề không nằm ở người nghe.',
        questions: [
          { q: '短文为什么说"大家都这么做"不是理由？', qPinyin: 'Duǎn wén wèi shén me shuō "dà jiā dōu zhè me zuò" bú shì lǐ yóu?',
            qEn: 'Why is "everyone does it" not a reason?', qVi: 'Vì sao "ai cũng làm thế" không phải lý do?',
            options: [['它只报告事实，没说明为什么是对的', 'nó chỉ báo cáo sự thật, không nói vì sao là đúng'], ['因为它太长了', 'vì nó quá dài'], ['因为大家其实没这么做', 'vì thật ra mọi người không làm thế']], correct: 0,
            explEn: '它只报告了一个事实，没有回答这件事为什么是对的.', explVi: '它只报告了一个事实，没有回答这件事为什么是对的.' },
          { q: '"反正没人知道"这句话承认了什么？', qPinyin: '"Fǎn zhèng méi rén zhī dào" zhè jù huà chéng rèn le shén me?',
            qEn: 'What does "nobody will know" concede?', qVi: 'Câu "dù sao cũng chẳng ai biết" đã thừa nhận điều gì?',
            options: [['这件事经不起被看见', 'việc đó không chịu nổi bị nhìn thấy'], ['这件事很难做', 'việc đó rất khó làm'], ['这件事很花钱', 'việc đó rất tốn tiền']], correct: 0,
            explEn: '因为它承认了这件事经不起被看见.', explVi: '因为它承认了这件事经不起被看见.' },
          { q: '短文提出的检查办法是什么？', qPinyin: 'Duǎn wén tí chū de jiǎn chá bàn fǎ shì shén me?',
            qEn: 'What checking method does the text propose?', qVi: 'Bài đọc đưa ra cách kiểm tra nào?',
            options: [['把理由完整地说给一个不相干的人听', 'nói trọn lý do cho một người không liên quan nghe'], ['问自己的好朋友', 'hỏi bạn thân của mình'], ['查一查法律条文', 'tra điều khoản luật']], correct: 0,
            explEn: '把你的理由完整地说给一个不相干的人听.', explVi: '把你的理由完整地说给一个不相干的人听.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '要看这个地方___有人说"我觉得不对"。', pinyin: 'Yào kàn zhè ge dì fang ___ yǒu rén shuō "wǒ jué de bú duì".',
        options: [['允不允许', 'có cho phép không'], ['允许不', 'cho phép không'], ['不允许吗', 'không cho phép à'], ['允许了没', 'đã cho phép chưa']], correct: 0,
        explEn: 'A two-syllable verb splits as A不AB, so 允许 becomes 允不允许.', explVi: 'Động từ hai âm tiết tách thành A不AB, nên 允许 thành 允不允许.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '他___少赚一点，也不违反规定。', pinyin: 'Tā ___ shǎo zhuàn yì diǎn, yě bù wéi fǎn guī dìng.',
        options: [['宁可', 'thà'], ['不但', 'không những'], ['因为', 'vì'], ['除了', 'ngoài']], correct: 0,
        explEn: '宁可 marks the cost accepted, and 也不 the one refused.', explVi: '宁可 nêu cái giá chấp nhận, 也不 nêu cái bị từ chối.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：有些事法律没规定，怎么判断？ B：___', pinyin: 'A: Yǒu xiē shì fǎ lǜ méi guī dìng, zěn me pàn duàn? B: ___',
        options: [['问自己：这件事如果被所有人看见，我还愿意这么做吗？', 'Tự hỏi: nếu việc này bị mọi người nhìn thấy, mình còn muốn làm không?'], ['那就不用管了。', 'Vậy thì khỏi cần quan tâm.'], ['法律书很厚。', 'Sách luật rất dày.'], ['我明天再判断。', 'Mai mình phán đoán tiếp.']], correct: 0,
        explEn: 'The question asks for a method of judgement, so the answer must supply a test.', explVi: 'Câu hỏi hỏi cách phán đoán, nên câu trả lời phải đưa ra một phép thử.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么"大家都改了"这个假想能说明问题？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me "dà jiā dōu gǎi le" zhè ge jiǎ xiǎng néng shuō míng wèn tí?',
        passage: 2, options: [['同样的说法会得出相反的结论', 'cùng một câu sẽ cho ra kết luận ngược lại'], ['因为大家不会改', 'vì mọi người sẽ không đổi'], ['因为改了就合法了', 'vì đổi rồi là hợp pháp'], ['因为没人愿意改', 'vì chẳng ai muốn đổi']], correct: 0,
        explEn: '如果有一天大家都改了，同样的说法就会得出相反的结论.', explVi: '如果有一天大家都改了，同样的说法就会得出相反的结论.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，法律能管到我们一天中大部分的决定。', pinyin: 'Gēn jù dì yī piān duǎn wén, fǎ lǜ néng guǎn dào wǒ men yì tiān zhōng dà bù fen de jué dìng.',
        isTrue: false, passage: 1,
        explEn: '一天里我们做的大部分决定，法律都没有意见.', explVi: '一天里我们做的大部分决定，法律都没有意见.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '道德的要求 / 本来 / 就 / 比 / 法律高', pinyin: 'dào dé de yāo qiú / běn lái / jiù / bǐ / fǎ lǜ gāo',
        answer: '道德的要求本来就比法律高。', answerVi: 'Yêu cầu đạo đức vốn đã cao hơn pháp luật.',
        options: [['道德的要求', 'yêu cầu đạo đức'], ['本来', 'vốn dĩ'], ['就', 'đã'], ['比', 'hơn'], ['法律高', 'pháp luật cao']],
        explEn: '本来就 comes before the comparison it says was already true.', explVi: '本来就 đứng trước phép so sánh vốn đã đúng từ trước.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，三个问题分别看的是什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, sān gè wèn tí fēn bié kàn de shì shén me?',
        passage: 1, options: [['利益、尊重、自己', 'lợi ích, sự tôn trọng, chính mình'], ['法律、道德、习惯', 'pháp luật, đạo đức, thói quen'], ['过去、现在、将来', 'quá khứ, hiện tại, tương lai'], ['公司、朋友、家人', 'công ty, bạn bè, người nhà']], correct: 0,
        explEn: '第一个问题看的是利益，第二个看的是尊重，第三个看的是自己.', explVi: '第一个问题看的是利益，第二个看的是尊重，第三个看的是自己.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，说到一半自己想改口说明了什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, shuō dào yí bàn zì jǐ xiǎng gǎi kǒu shuō míng le shén me?',
        passage: 2, options: [['问题在这个理由本身，不在听的人身上', 'vấn đề nằm ở chính lý do đó, không phải ở người nghe'], ['听的人不够专心', 'người nghe không đủ chú ý'], ['这件事太复杂', 'việc này quá phức tạp'], ['说话的人太紧张', 'người nói quá căng thẳng']], correct: 0,
        explEn: '如果说到一半你自己都想改口，那问题不在听的人身上.', explVi: '如果说到一半你自己都想改口，那问题不在听的人身上.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说规定本来就有问题时该怎么办？', pinyin: 'B shuō guī dìng běn lái jiù yǒu wèn tí shí gāi zěn me bàn?',
        line: 10, options: [['先按规定做，再把问题正式提出来', 'trước hết làm theo quy định, rồi nêu vấn đề chính thức'], ['立刻不按规定做', 'lập tức không làm theo quy định'], ['等别人先说', 'chờ người khác nói trước'], ['什么都不说', 'không nói gì cả']], correct: 0,
        explEn: 'B says: 那就先按规定做，再把问题正式提出来，这两件事不冲突.', explVi: 'B nói: 那就先按规定做，再把问题正式提出来，这两件事不冲突.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么不同意为帮朋友而违反规定？', pinyin: 'B wèi shén me bù tóng yì wèi bāng péng you ér wéi fǎn guī dìng?',
        line: 14, options: [['宁可让朋友失望，也不要让自己以后不敢说这件事', 'thà để bạn thất vọng còn hơn sau này không dám nói ra'], ['因为朋友不会感谢你', 'vì bạn sẽ không cảm ơn bạn'], ['因为规定很难改', 'vì quy định rất khó sửa'], ['因为公司会发现', 'vì công ty sẽ phát hiện']], correct: 0,
        explEn: 'B says: 宁可让朋友失望，也不要让自己以后不敢说这件事.', explVi: 'B nói: 宁可让朋友失望，也不要让自己以后不敢说这件事.' }
    ]
  },

  'hsk5-l07-standard-leadership': {
    titleZh: '带团队',
    titleEn: 'Leading a team',
    titleVi: 'Dẫn dắt nhóm',
    summaryEn: 'Handing work over without handing over the standard, correcting the work instead of the person, and where a team lead\'s authority actually comes from.',
    summaryVi: 'Giao việc mà không giao mất tiêu chuẩn, sửa việc chứ không sửa người, và quyền lực của một nhóm trưởng thật ra đến từ đâu.',
    lines: [
      ['A', '可是承担责任是不是意味着什么都自己做？', 'Kě shì chéng dān zé rèn shì bu shì yì wèi zhe shén me dōu zì jǐ zuò?',
        'But does taking responsibility mean doing everything yourself?',
        'Nhưng gánh trách nhiệm có nghĩa là việc gì cũng tự làm không?'],
      ['B', '不是，把事情交出去也是一种责任，只是要交得清楚。', 'Bú shì, bǎ shì qing jiāo chū qù yě shì yì zhǒng zé rèn, zhǐ shì yào jiāo de qīng chu.',
        'No — handing work over is a responsibility too; it just has to be handed over clearly.',
        'Không, giao việc đi cũng là một loại trách nhiệm, chỉ là phải giao cho rõ.'],
      ['A', '交得清楚指什么？', 'Jiāo de qīng chu zhǐ shén me?',
        'What does handing over clearly mean?',
        'Giao cho rõ là thế nào?'],
      ['B', '说明要什么结果、什么时候要，别去管人家用什么方法做。', 'Shuō míng yào shén me jié guǒ, shén me shí hou yào, bié qù guǎn rén jia yòng shén me fāng fǎ zuò.',
        'State what result you need and by when, and do not police the method they use.',
        'Nói rõ cần kết quả gì, cần khi nào, đừng can thiệp vào việc người ta dùng cách nào.'],
      ['A', '那成员做得不好的时候呢？', 'Nà chéng yuán zuò de bù hǎo de shí hou ne?',
        'And when a member does the work badly?',
        'Vậy khi thành viên làm chưa tốt thì sao?'],
      ['B', '对事不对人：先说清楚差在哪儿，再问他需要什么支持。', 'Duì shì bú duì rén: xiān shuō qīng chu chà zài nǎr, zài wèn tā xū yào shén me zhī chí.',
        'Address the work, not the person: say exactly where it falls short, then ask what support he needs.',
        'Nói về việc chứ không nói về người: trước hết chỉ rõ kém ở đâu, rồi hỏi anh ấy cần hỗ trợ gì.'],
      ['A', '我担心太客气会没有权力。', 'Wǒ dān xīn tài kè qi huì méi yǒu quán lì.',
        'I worry that being too courteous leaves me without authority.',
        'Mình lo lịch sự quá thì sẽ không có quyền lực.'],
      ['B', '权力不是要来的，是别人愿意给的；你能解决问题，权力自然就在手里。', 'Quán lì bú shì yào lái de, shì bié ren yuàn yì gěi de; nǐ néng jiě jué wèn tí, quán lì zì rán jiù zài shǒu lǐ.',
        'Authority is not demanded, it is given; solve problems and it ends up in your hands by itself.',
        'Quyền lực không phải đòi mà có, mà là do người khác sẵn lòng trao; bạn giải quyết được vấn đề thì quyền lực tự khắc nằm trong tay.']
    ],
    vocab: [['领导', 'lǐng dǎo'], ['团队', 'tuán duì'], ['成员', 'chéng yuán'], ['矛盾', 'máo dùn'], ['信任', 'xìn rèn'],
      ['责任', 'zé rèn'], ['目标', 'mù biāo'], ['鼓励', 'gǔ lì'], ['权力', 'quán lì'], ['沟通', 'gōu tōng'],
      ['压力', 'yā lì'], ['承担', 'chéng dān'], ['处理', 'chǔ lǐ'], ['能力', 'néng lì'], ['表现', 'biǎo xiàn'],
      ['培养', 'péi yǎng'], ['指导', 'zhǐ dǎo'], ['安排', 'ān pái']],
    grammar: [
      {
        pattern: '动词 + 得 + 补语（交得清楚、做得不好）',
        explEn: 'Rates how an action turns out. 得 joins the verb to the assessment; the object, if any, moves before the verb or repeats it.',
        explVi: 'Đánh giá hành động diễn ra thế nào. 得 nối động từ với lời đánh giá; tân ngữ nếu có thì đưa lên trước hoặc lặp lại động từ.',
        examples: [
          ['把事情交出去也是一种责任，只是要交得清楚。', 'Bǎ shì qing jiāo chū qù yě shì yì zhǒng zé rèn, zhǐ shì yào jiāo de qīng chu.', 'Handing work over is a responsibility too; it just has to be done clearly.', 'Giao việc đi cũng là trách nhiệm, chỉ là phải giao cho rõ.'],
          ['那成员做得不好的时候呢？', 'Nà chéng yuán zuò de bù hǎo de shí hou ne?', 'And when a member does it badly?', 'Vậy khi thành viên làm chưa tốt thì sao?'],
          ['他这次表现得比上次好多了。', 'Tā zhè cì biǎo xiàn de bǐ shàng cì hǎo duō le.', 'He performed much better this time than last.', 'Lần này anh ấy thể hiện tốt hơn lần trước nhiều.']
        ]
      },
      {
        pattern: '不是……的，是……的',
        explEn: 'Two 是……的 frames set side by side to reject one account of how something came about and give the right one. The 的 keeps the focus on the manner, not the event.',
        explVi: 'Hai khung 是……的 đặt cạnh nhau để bác bỏ một cách giải thích về việc gì đó xảy ra thế nào và đưa ra cách đúng. 的 giữ trọng tâm ở cách thức, không phải ở sự việc.',
        examples: [
          ['权力不是要来的，是别人愿意给的。', 'Quán lì bú shì yào lái de, shì bié ren yuàn yì gěi de.', 'Authority is not demanded, it is given.', 'Quyền lực không phải đòi mà có, mà do người khác sẵn lòng trao.'],
          ['信任不是说出来的，是做出来的。', 'Xìn rèn bú shì shuō chū lái de, shì zuò chū lái de.', 'Trust is not talked into being, it is done into being.', 'Niềm tin không phải nói ra mà có, mà là làm ra mà có.'],
          ['这个目标不是我定的，是大家一起定的。', 'Zhè ge mù biāo bú shì wǒ dìng de, shì dà jiā yì qǐ dìng de.', 'This goal was not set by me but by all of us together.', 'Mục tiêu này không phải do mình đặt, mà là cả nhóm cùng đặt.']
        ]
      },
      {
        pattern: '……意味着……',
        explEn: 'Names what a fact implies. It takes a clause on both sides and states an entailment, not a cause.',
        explVi: 'Nêu điều mà một sự việc hàm ý. Hai bên đều là một mệnh đề, và nó diễn đạt hệ quả logic chứ không phải nguyên nhân.',
        examples: [
          ['承担责任是不是意味着什么都自己做？', 'Chéng dān zé rèn shì bu shì yì wèi zhe shén me dōu zì jǐ zuò?', 'Does taking responsibility mean doing everything yourself?', 'Gánh trách nhiệm có nghĩa là việc gì cũng tự làm không?'],
          ['他不说话，并不意味着他同意。', 'Tā bù shuō huà, bìng bú yì wèi zhe tā tóng yì.', 'His silence does not mean he agrees.', 'Anh ấy không nói không có nghĩa là anh ấy đồng ý.'],
          ['给他更多权力，也意味着更大的压力。', 'Gěi tā gèng duō quán lì, yě yì wèi zhe gèng dà de yā lì.', 'Giving him more authority also means greater pressure.', 'Trao cho anh ấy nhiều quyền hơn cũng đồng nghĩa với áp lực lớn hơn.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '交出去的三句话',
        titleEn: 'Three sentences that hand work over',
        titleVi: 'Ba câu để giao việc',
        zh: '很多新领导不敢把事情交给别人，理由是"我自己做更快"。第一次确实更快，第三次就不是了：你越不交出去，成员的能力越得不到培养，你手上的事就越多。交事情其实只要三句话。第一句说结果："这份材料要能让不了解项目的人在五分钟内看懂。"第二句说时间和范围："周四下午之前给我，需要跟别的部门要数据的话直接找我。"第三句说支持："做到一半有拿不准的地方，随时来问。"这三句话里没有一句在说方法，方法应该留给做事的人自己决定。领导要守住的是结果的标准，不是做事的步骤；把标准说清楚，比盯着过程有用得多。',
        en: 'Many new leaders dare not hand work to others, on the grounds that "it is faster if I do it myself". The first time it genuinely is faster; by the third it is not: the less you delegate, the less your members\' ability develops, and the more work piles up on you. Handing work over really takes only three sentences. The first states the result: "this document has to make sense in five minutes to someone who does not know the project." The second states timing and scope: "I need it by Thursday afternoon; if you need data from another department, come straight to me." The third offers support: "if you hit something you are unsure about halfway through, ask any time." Not one of the three says anything about method — method should be left to the person doing the work. What a leader must hold onto is the standard for the result, not the steps of the work; stating the standard clearly is far more useful than watching the process.',
        vi: 'Nhiều lãnh đạo mới không dám giao việc cho người khác, lý do là "tự mình làm nhanh hơn". Lần đầu quả thật nhanh hơn, đến lần thứ ba thì không: bạn càng không giao, năng lực của thành viên càng không được bồi dưỡng, việc trong tay bạn càng nhiều. Giao việc thật ra chỉ cần ba câu. Câu thứ nhất nói về kết quả: "tài liệu này phải để một người không biết dự án đọc năm phút là hiểu." Câu thứ hai nói về thời gian và phạm vi: "trước chiều thứ Năm đưa cho tôi, cần lấy dữ liệu từ bộ phận khác thì đến gặp tôi trực tiếp." Câu thứ ba nói về hỗ trợ: "làm nửa chừng có chỗ nào chưa chắc thì hỏi bất cứ lúc nào." Trong ba câu ấy không câu nào nói về phương pháp, phương pháp nên để người làm tự quyết định. Cái mà lãnh đạo phải giữ là tiêu chuẩn của kết quả, chứ không phải các bước làm việc; nói rõ tiêu chuẩn hữu ích hơn nhiều so với chăm chăm nhìn vào quy trình.',
        questions: [
          { q: '短文说"我自己做更快"这个理由问题在哪儿？', qPinyin: 'Duǎn wén shuō "wǒ zì jǐ zuò gèng kuài" zhè ge lǐ yóu wèn tí zài nǎr?',
            qEn: 'What is wrong with "it is faster if I do it"?', qVi: 'Lý do "tự mình làm nhanh hơn" sai ở đâu?',
            options: [['只有第一次快，越不交出去手上的事越多', 'chỉ nhanh lần đầu, càng không giao thì việc càng nhiều'], ['其实一次也不快', 'thật ra chẳng lần nào nhanh'], ['成员会不高兴', 'thành viên sẽ không vui']], correct: 0,
            explEn: '第一次确实更快，第三次就不是了……你手上的事就越多.', explVi: '第一次确实更快，第三次就不是了……你手上的事就越多.' },
          { q: '三句话分别说什么？', qPinyin: 'Sān jù huà fēn bié shuō shén me?',
            qEn: 'What do the three sentences cover?', qVi: 'Ba câu lần lượt nói về gì?',
            options: [['结果、时间和范围、支持', 'kết quả, thời gian và phạm vi, hỗ trợ'], ['方法、步骤、检查', 'phương pháp, các bước, kiểm tra'], ['目标、奖励、批评', 'mục tiêu, khen thưởng, phê bình']], correct: 0,
            explEn: '第一句说结果……第二句说时间和范围……第三句说支持.', explVi: '第一句说结果……第二句说时间和范围……第三句说支持.' },
          { q: '领导应该守住什么？', qPinyin: 'Lǐng dǎo yīng gāi shǒu zhù shén me?',
            qEn: 'What should a leader hold onto?', qVi: 'Lãnh đạo nên giữ điều gì?',
            options: [['结果的标准', 'tiêu chuẩn của kết quả'], ['做事的步骤', 'các bước làm việc'], ['所有的数据', 'toàn bộ dữ liệu']], correct: 0,
            explEn: '领导要守住的是结果的标准，不是做事的步骤.', explVi: '领导要守住的是结果的标准，不是做事的步骤.' }
        ]
      },
      {
        titleZh: '权力是别人给的',
        titleEn: 'Authority is given',
        titleVi: 'Quyền lực do người khác trao',
        zh: '刚当上领导的人常常担心一件事：大家会不会不听我的。这个担心把关系想反了。职位只能让人执行，不能让人认真；愿意多想一步、愿意在你不在的时候还按标准做事，这些都不是命令换来的。真正让成员愿意跟着你的，是他们发现跟着你能解决问题、能学到东西、遇到麻烦时你会站出来。这三样都是要用具体的事一次一次证明的。所以新领导最该做的不是立规矩，而是先把团队卡住的那件事解决掉——哪怕是很小的一件事。等大家看见问题真的动了，你说的话自然就有人听。同样的道理也解释了为什么"对事不对人"这么重要：批评人只会让对方保护自己，说清楚事情差在哪儿，才能让他下次做对。',
        en: 'People newly promoted often worry about one thing: will anyone listen to me? The worry has the relationship backwards. A position can make people comply, not make them care; being willing to think one step further, or to keep to the standard while you are not there, is not bought with orders. What actually makes members want to follow you is discovering that following you solves problems, teaches them something, and that you step forward when trouble comes. All three have to be proved with concrete events, one at a time. So the first thing a new leader should do is not to lay down rules but to clear the one thing the team is stuck on — even a very small thing. Once people see a problem actually move, people listen to you by themselves. The same logic explains why addressing the work rather than the person matters so much: criticising a person only makes them defend themselves, whereas saying exactly where the work fell short is what lets them get it right next time.',
        vi: 'Người vừa lên làm lãnh đạo thường lo một chuyện: mọi người có nghe mình không. Nỗi lo ấy đã đảo ngược quan hệ. Chức vụ chỉ khiến người ta chấp hành, chứ không khiến người ta nghiêm túc; sẵn lòng nghĩ thêm một bước, sẵn lòng làm đúng tiêu chuẩn cả khi bạn không có mặt — những điều đó không đổi được bằng mệnh lệnh. Thứ thật sự khiến thành viên muốn đi theo bạn là họ nhận ra đi theo bạn thì giải quyết được vấn đề, học được điều gì đó, và khi gặp rắc rối thì bạn sẽ đứng ra. Cả ba điều này đều phải chứng minh bằng những việc cụ thể, từng lần một. Vì vậy việc đầu tiên một lãnh đạo mới nên làm không phải là đặt ra quy tắc, mà là giải quyết cái việc đang làm cả nhóm mắc kẹt — dù đó là việc rất nhỏ. Khi mọi người thấy vấn đề thật sự nhúc nhích, lời bạn nói tự khắc có người nghe. Cùng đạo lý ấy cũng giải thích vì sao "nói việc chứ không nói người" lại quan trọng: phê bình con người chỉ khiến đối phương bảo vệ bản thân, còn nói rõ việc kém ở chỗ nào mới giúp họ lần sau làm đúng.',
        questions: [
          { q: '短文说职位能带来什么，不能带来什么？', qPinyin: 'Duǎn wén shuō zhí wèi néng dài lái shén me, bù néng dài lái shén me?',
            qEn: 'What can a position bring, and what can it not?', qVi: 'Bài đọc nói chức vụ mang lại gì và không mang lại gì?',
            options: [['能让人执行，不能让人认真', 'khiến người ta chấp hành, không khiến người ta nghiêm túc'], ['能让人认真，不能让人执行', 'khiến người ta nghiêm túc, không khiến người ta chấp hành'], ['两样都能带来', 'cả hai đều mang lại được']], correct: 0,
            explEn: '职位只能让人执行，不能让人认真.', explVi: '职位只能让人执行，不能让人认真.' },
          { q: '短文建议新领导先做什么？', qPinyin: 'Duǎn wén jiàn yì xīn lǐng dǎo xiān zuò shén me?',
            qEn: 'What should a new leader do first?', qVi: 'Bài đọc khuyên lãnh đạo mới làm gì trước?',
            options: [['先解决团队卡住的那件事', 'giải quyết việc đang làm cả nhóm mắc kẹt trước'], ['先立一套新规矩', 'đặt ra bộ quy tắc mới trước'], ['先换掉几个成员', 'thay vài thành viên trước']], correct: 0,
            explEn: '新领导最该做的不是立规矩，而是先把团队卡住的那件事解决掉.', explVi: '新领导最该做的不是立规矩，而是先把团队卡住的那件事解决掉.' },
          { q: '短文怎么解释"对事不对人"？', qPinyin: 'Duǎn wén zěn me jiě shì "duì shì bú duì rén"?',
            qEn: 'How does the text explain addressing the work not the person?', qVi: 'Bài đọc giải thích "nói việc chứ không nói người" thế nào?',
            options: [['批评人只会让对方保护自己', 'phê bình người chỉ khiến đối phương bảo vệ bản thân'], ['因为批评人不礼貌', 'vì phê bình người là bất lịch sự'], ['因为人比事重要', 'vì người quan trọng hơn việc']], correct: 0,
            explEn: '批评人只会让对方保护自己，说清楚事情差在哪儿，才能让他下次做对.', explVi: '批评人只会让对方保护自己，说清楚事情差在哪儿，才能让他下次做对.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '把事情交出去也是一种责任，只是要交___清楚。', pinyin: 'Bǎ shì qing jiāo chū qù yě shì yì zhǒng zé rèn, zhǐ shì yào jiāo ___ qīng chu.',
        options: [['得', 'được (bổ ngữ)'], ['的', 'của'], ['地', 'một cách'], ['了', 'rồi']], correct: 0,
        explEn: '得 joins a verb to the assessment of how the action turns out.', explVi: '得 nối động từ với lời đánh giá về cách hành động diễn ra.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '信任不是说出来的，___做出来的。', pinyin: 'Xìn rèn bú shì shuō chū lái de, ___ zuò chū lái de.',
        options: [['是', 'mà là'], ['有', 'có'], ['被', 'bị'], ['把', 'đem']], correct: 0,
        explEn: 'The 不是……的，是……的 frame needs a second 是 to introduce the right account.', explVi: 'Khung 不是……的，是……的 cần 是 thứ hai để dẫn ra cách giải thích đúng.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：交得清楚指什么？ B：___', pinyin: 'A: Jiāo de qīng chu zhǐ shén me? B: ___',
        options: [['说明要什么结果、什么时候要，别去管方法。', 'Nói rõ cần kết quả gì, khi nào cần, đừng can thiệp phương pháp.'], ['交给谁都一样。', 'Giao cho ai cũng như nhau.'], ['我们团队有八个人。', 'Nhóm chúng tôi có tám người.'], ['下周再交吧。', 'Tuần sau hãy giao.']], correct: 0,
        explEn: 'The question asks what the phrase means, so the answer must unpack it.', explVi: 'Câu hỏi hỏi cụm từ nghĩa là gì, nên câu trả lời phải diễn giải nó.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么新领导应该先解决一件小事？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me xīn lǐng dǎo yīng gāi xiān jiě jué yí jiàn xiǎo shì?',
        passage: 2, options: [['大家看见问题真的动了，说的话才有人听', 'mọi người thấy vấn đề thật sự nhúc nhích thì lời nói mới có người nghe'], ['因为小事最容易', 'vì việc nhỏ dễ nhất'], ['因为大事不归他管', 'vì việc lớn không thuộc quyền anh ấy'], ['因为规矩不重要', 'vì quy tắc không quan trọng']], correct: 0,
        explEn: '等大家看见问题真的动了，你说的话自然就有人听.', explVi: '等大家看见问题真的动了，你说的话自然就有人听.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，交事情的时候应该把做事的方法也规定好。', pinyin: 'Gēn jù dì yī piān duǎn wén, jiāo shì qing de shí hou yīng gāi bǎ zuò shì de fāng fǎ yě guī dìng hǎo.',
        isTrue: false, passage: 1,
        explEn: '这三句话里没有一句在说方法，方法应该留给做事的人自己决定.', explVi: '这三句话里没有一句在说方法，方法应该留给做事的人自己决定.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '他不说话 / 并不 / 意味着 / 他同意', pinyin: 'tā bù shuō huà / bìng bú / yì wèi zhe / tā tóng yì',
        answer: '他不说话，并不意味着他同意。', answerVi: 'Anh ấy không nói không có nghĩa là anh ấy đồng ý.',
        options: [['他不说话', 'anh ấy không nói'], ['并不', 'không hề'], ['意味着', 'có nghĩa là'], ['他同意', 'anh ấy đồng ý']],
        explEn: '意味着 takes a clause on each side; 并不 negates the implication, not the fact.', explVi: '意味着 nối hai mệnh đề; 并不 phủ định hàm ý, không phủ định sự việc.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，第二句话为什么要说范围？', pinyin: 'Gēn jù dì yī piān duǎn wén, dì èr jù huà wèi shén me yào shuō fàn wéi?',
        passage: 1, options: [['让成员知道超出自己范围的事该找谁', 'để thành viên biết việc ngoài phạm vi của mình thì tìm ai'], ['为了让他做得更快', 'để anh ấy làm nhanh hơn'], ['为了规定方法', 'để quy định phương pháp'], ['为了减少会议', 'để bớt họp hành']], correct: 0,
        explEn: '需要跟别的部门要数据的话直接找我 — the scope tells him where to escalate.', explVi: '需要跟别的部门要数据的话直接找我 — phạm vi cho biết khi nào phải tìm đến lãnh đạo.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，成员愿意跟着一个领导是因为看到了什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, chéng yuán yuàn yì gēn zhe yí gè lǐng dǎo shì yīn wèi kàn dào le shén me?',
        passage: 2, options: [['能解决问题、能学到东西、有麻烦时他会站出来', 'giải quyết được vấn đề, học được điều gì đó, có rắc rối thì anh ấy đứng ra'], ['他的职位比别人高', 'chức vụ anh ấy cao hơn người khác'], ['他定的规矩最多', 'anh ấy đặt nhiều quy tắc nhất'], ['他从不批评人', 'anh ấy không bao giờ phê bình ai']], correct: 0,
        explEn: '跟着你能解决问题、能学到东西、遇到麻烦时你会站出来.', explVi: '跟着你能解决问题、能学到东西、遇到麻烦时你会站出来.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说成员做得不好时应该怎么处理？', pinyin: 'B shuō chéng yuán zuò de bù hǎo shí yīng gāi zěn me chǔ lǐ?',
        line: 12, options: [['先说清楚差在哪儿，再问他需要什么支持', 'trước hết chỉ rõ kém ở đâu, rồi hỏi cần hỗ trợ gì'], ['马上换人做', 'đổi người làm ngay'], ['自己接过来做', 'tự mình nhận làm'], ['等下次再说', 'để lần sau hãy nói']], correct: 0,
        explEn: 'B says: 对事不对人：先说清楚差在哪儿，再问他需要什么支持.', explVi: 'B nói: 对事不对人：先说清楚差在哪儿，再问他需要什么支持.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为权力是怎么来的？', pinyin: 'B rèn wéi quán lì shì zěn me lái de?',
        line: 14, options: [['别人愿意给的，能解决问题就自然有', 'do người khác sẵn lòng trao, giải quyết được vấn đề thì tự có'], ['职位一到就有了', 'có chức vụ là có ngay'], ['靠严格的规矩得来', 'nhờ quy tắc nghiêm khắc mà có'], ['靠不客气说话得来', 'nhờ nói năng không khách sáo mà có']], correct: 0,
        explEn: 'B says: 权力不是要来的，是别人愿意给的；你能解决问题，权力自然就在手里.', explVi: 'B nói: 权力不是要来的，是别人愿意给的；你能解决问题，权力自然就在手里.' }
    ]
  }
};
