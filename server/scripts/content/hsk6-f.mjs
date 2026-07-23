// HSK6 (C2) lessons 11-12. See hsk6-a.mjs for the shape this level uses.

export default {
  'hsk6-l11-standard-translation': {
    titleZh: '翻译的分寸',
    titleEn: 'The measure of translation',
    titleVi: 'Chừng mực trong dịch thuật',
    summaryEn: 'What fidelity is actually owed to, why a joke translated word for word stops being funny, when to break a long sentence, and how to read your own draft cold.',
    summaryVi: 'Trung thành thật ra là trung thành với cái gì, vì sao câu đùa dịch từng chữ thì hết buồn cười, khi nào nên cắt câu dài, và cách đọc lại bản nháp của chính mình.',
    lines: [
      ['A', '加注释会不会打断阅读？', 'Jiā zhù shì huì bu huì dǎ duàn yuè dú?',
        'Do notes interrupt the reading?',
        'Thêm chú thích có làm đứt mạch đọc không?'],
      ['B', '会，所以注释越少越好；若能在句子里说清楚，便不必加。', 'Huì, suǒ yǐ zhù shì yuè shǎo yuè hǎo; ruò néng zài jù zi lǐ shuō qīng chu, biàn bú bì jiā.',
        'They do, so the fewer the better; if it can be made clear inside the sentence, no note is needed.',
        'Có, nên chú thích càng ít càng tốt; nếu nói rõ được ngay trong câu thì khỏi cần thêm.'],
      ['A', '那"忠实"到底忠于什么？', 'Nà "zhōng shí" dào dǐ zhōng yú shén me?',
        'So what is fidelity actually faithful to?',
        'Vậy "trung thành" rốt cuộc là trung thành với cái gì?'],
      ['B', '忠于作者想产生的效果，而不是每一个字的表面。', 'Zhōng yú zuò zhě xiǎng chǎn shēng de xiào guǒ, ér bú shì měi yí gè zì de biǎo miàn.',
        'To the effect the author wanted to produce, not to the surface of every character.',
        'Trung thành với hiệu quả tác giả muốn tạo ra, chứ không phải bề mặt của từng chữ.'],
      ['A', '幽默最难吧？', 'Yōu mò zuì nán ba?',
        'Humour must be the hardest?',
        'Sự hài hước là khó nhất phải không?'],
      ['B', '是，笑话直接照字翻往往不好笑，这时使得读者笑出来才算忠实。', 'Shì, xiào hua zhí jiē zhào zì fān wǎng wǎng bù hǎo xiào, zhè shí shǐ de dú zhě xiào chū lái cái suàn zhōng shí.',
        'It is — a joke rendered character by character usually is not funny, and there making the reader laugh is what counts as faithful.',
        'Đúng, câu đùa dịch sát từng chữ thường không buồn cười, lúc đó làm cho người đọc bật cười mới là trung thành.'],
      ['A', '遇到很长的句子怎么办？', 'Yù dào hěn cháng de jù zi zěn me bàn?',
        'What about very long sentences?',
        'Gặp câu rất dài thì làm sao?'],
      ['B', '不妨拆成两三句，中文不喜欢一口气拖太长。', 'Bù fáng chāi chéng liǎng sān jù, zhōng wén bù xǐ huan yì kǒu qì tuō tài cháng.',
        'You might as well break it into two or three; Chinese does not like being dragged out in one breath.',
        'Chẳng ngại gì mà không tách thành hai ba câu, tiếng Trung không thích kéo dài một hơi.'],
      ['A', '怎么检查自己翻的东西？', 'Zěn me jiǎn chá zì jǐ fān de dōng xi?',
        'How do I check what I have translated?',
        'Kiểm tra thứ mình dịch thế nào?'],
      ['B', '放两天再读一遍，读得别扭的地方多半就是没转过来的地方。', 'Fàng liǎng tiān zài dú yí biàn, dú de bié niu de dì fang duō bàn jiù shì méi zhuǎn guò lái de dì fang.',
        'Leave it two days and read again; wherever it reads awkwardly is usually where it has not come across.',
        'Để hai ngày rồi đọc lại, chỗ nào đọc thấy trúc trắc thì phần nhiều là chỗ chưa chuyển được.']
    ],
    vocab: [['翻译', 'fān yì'], ['地道', 'dì dao'], ['表达', 'biǎo dá'], ['自由', 'zì yóu'], ['发挥', 'fā huī'],
      ['忠实', 'zhōng shí'], ['读者', 'dú zhě'], ['习惯', 'xí guàn'], ['对应', 'duì yìng'], ['注释', 'zhù shì'],
      ['转换', 'zhuǎn huàn'], ['损失', 'sǔn shī'], ['分寸', 'fēn cun'], ['别扭', 'bié niu'], ['传达', 'chuán dá'],
      ['词语', 'cí yǔ'], ['说法', 'shuō fǎ'], ['用法', 'yòng fǎ'], ['表面', 'biǎo miàn'], ['补救', 'bǔ jiù']],
    grammar: [
      {
        pattern: '若……，便……',
        explEn: 'The classical pair for 如果……就……. It belongs to formal written Chinese, and both halves stay short — 若 and 便 each stand before their clause.',
        explVi: 'Cặp cổ văn tương ứng với 如果……就……. Nó thuộc văn viết trang trọng, hai vế đều ngắn — 若 và 便 mỗi từ đứng trước mệnh đề của mình.',
        examples: [
          ['若能在句子里说清楚，便不必加注释。', 'Ruò néng zài jù zi lǐ shuō qīng chu, biàn bú bì jiā zhù shì.', 'If it can be made clear inside the sentence, no note is needed.', 'Nếu nói rõ được ngay trong câu thì khỏi cần chú thích.'],
          ['若原文本来就模糊，便不该译得比它清楚。', 'Ruò yuán wén běn lái jiù mó hu, biàn bù gāi yì de bǐ tā qīng chu.', 'If the original is vague to begin with, it should not be translated clearer than it is.', 'Nếu nguyên bản vốn đã mơ hồ thì không nên dịch rõ hơn nó.'],
          ['若两种说法都可以，便选读者更熟悉的那个。', 'Ruò liǎng zhǒng shuō fǎ dōu kě yǐ, biàn xuǎn dú zhě gèng shú xī de nà ge.', 'If both phrasings work, choose the one readers know better.', 'Nếu cả hai cách nói đều được thì chọn cách người đọc quen hơn.']
        ]
      },
      {
        pattern: '使得……',
        explEn: 'Reports a result brought about by what precedes. Unlike 使, it takes a whole clause rather than a single adjective, and it names no agent.',
        explVi: 'Nêu kết quả do điều phía trước gây ra. Khác với 使, nó nhận cả một mệnh đề chứ không chỉ một tính từ, và không nêu chủ thể gây ra.',
        examples: [
          ['使得读者笑出来才算忠实。', 'Shǐ de dú zhě xiào chū lái cái suàn zhōng shí.', 'Making the reader laugh is what counts as faithful.', 'Làm cho người đọc bật cười mới là trung thành.'],
          ['句子太长，使得意思很难跟上。', 'Jù zi tài cháng, shǐ de yì si hěn nán gēn shàng.', 'The sentence is so long that the sense is hard to follow.', 'Câu quá dài khiến ý rất khó theo kịp.'],
          ['注释太多，使得阅读一直被打断。', 'Zhù shì tài duō, shǐ de yuè dú yì zhí bèi dǎ duàn.', 'Too many notes keep interrupting the reading.', 'Chú thích quá nhiều khiến việc đọc liên tục bị ngắt.']
        ]
      },
      {
        pattern: '不妨 + 动词',
        explEn: 'Offers a suggestion as costing nothing to try. It softens advice, stands before the verb, and never takes a negative.',
        explVi: 'Đưa ra một gợi ý như thể thử cũng chẳng mất gì. Nó làm lời khuyên nhẹ đi, đứng trước động từ và không đi với phủ định.',
        examples: [
          ['不妨拆成两三句。', 'Bù fáng chāi chéng liǎng sān jù.', 'You might as well break it into two or three sentences.', 'Chẳng ngại gì mà không tách thành hai ba câu.'],
          ['不妨先放两天再改。', 'Bù fáng xiān fàng liǎng tiān zài gǎi.', 'It does no harm to leave it two days before revising.', 'Cứ để hai ngày rồi hãy sửa cũng chẳng sao.'],
          ['遇到不好翻的词，不妨换一个说法。', 'Yù dào bù hǎo fān de cí, bù fáng huàn yí gè shuō fǎ.', 'For a word that resists translation, you might as well rephrase.', 'Gặp từ khó dịch thì cứ đổi sang một cách nói khác.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '忠于效果，不是忠于字',
        titleEn: 'Faithful to the effect, not the characters',
        titleVi: 'Trung thành với hiệu quả, không phải với con chữ',
        zh: '"忠实"这两个字骗过很多人，让他们以为把每个词都对上就算做到了。可是一句话在原文里产生的效果，往往不是由词造成的，而是由词和读者之间的关系造成的。原文里一个人人皆知的品牌名，读者一看就笑；照原样搬过来，另一群读者只会觉得莫名其妙。这时候真正忠实的做法，是找一个在新读者心里位置相当的东西换掉它。同样，原文如果故意写得笨拙，译文就不该写得漂亮；原文如果模糊，译文也不该替作者把话说清楚——那已经不是翻译，是改写。所以译者随时要问的不是"这个词对不对"，而是"读到这里的人，得到的感觉和原来的读者一样吗"。这个标准比对字难得多，因为它逼你先弄清楚原文到底想干什么。',
        en: 'The word "faithful" has misled many people into thinking that matching every word is enough. But the effect a sentence has in the original usually comes not from its words but from the relation between those words and their readers. A brand name everyone knows in the original makes readers smile at sight; carried across unchanged, it leaves a different readership merely puzzled. The genuinely faithful move here is to replace it with something occupying a comparable place in the new readers\' minds. Equally, if the original is deliberately clumsy the translation should not be elegant, and if the original is vague the translation should not clarify on the author\'s behalf — that is no longer translation but rewriting. So the question a translator must keep asking is not "is this word right" but "does the person reading this get the same feeling the original reader did". That standard is far harder than matching words, because it forces you to work out first what the original was trying to do.',
        vi: 'Hai chữ "trung thành" đã lừa được nhiều người, khiến họ tưởng khớp từng từ là đã làm được. Nhưng hiệu quả mà một câu tạo ra trong nguyên bản thường không do từ ngữ tạo nên, mà do quan hệ giữa từ ngữ ấy với người đọc. Trong nguyên bản, một tên thương hiệu ai cũng biết, người đọc nhìn là bật cười; bê nguyên xi sang, một lớp người đọc khác chỉ thấy khó hiểu. Lúc này cách làm trung thành thật sự là tìm một thứ có vị trí tương đương trong lòng người đọc mới để thay vào. Cũng vậy, nếu nguyên bản cố tình viết vụng thì bản dịch không nên viết đẹp; nếu nguyên bản mơ hồ thì bản dịch cũng không nên nói rõ hộ tác giả — như thế không còn là dịch nữa mà là viết lại. Vì vậy câu người dịch phải luôn tự hỏi không phải "từ này đúng chưa", mà là "người đọc đến đây có được cảm giác giống người đọc nguyên bản không". Tiêu chuẩn ấy khó hơn việc khớp chữ rất nhiều, vì nó buộc bạn phải làm rõ trước đã: nguyên bản rốt cuộc muốn làm gì.',
        questions: [
          { q: '短文说一句话的效果由什么造成？', qPinyin: 'Duǎn wén shuō yí jù huà de xiào guǒ yóu shén me zào chéng?',
            qEn: 'What produces a sentence\'s effect?', qVi: 'Bài đọc nói hiệu quả của một câu do đâu mà có?',
            options: [['词和读者之间的关系', 'quan hệ giữa từ ngữ và người đọc'], ['词本身', 'bản thân từ ngữ'], ['句子的长度', 'độ dài của câu']], correct: 0,
            explEn: '往往不是由词造成的，而是由词和读者之间的关系造成的.', explVi: '往往不是由词造成的，而是由词和读者之间的关系造成的.' },
          { q: '原文故意写得笨拙时译文应该怎样？', qPinyin: 'Yuán wén gù yì xiě de bèn zhuō shí yì wén yīng gāi zěn yàng?',
            qEn: 'What if the original is deliberately clumsy?', qVi: 'Nguyên bản cố tình viết vụng thì bản dịch nên thế nào?',
            options: [['也不该写得漂亮', 'cũng không nên viết đẹp'], ['应该改好一点', 'nên sửa cho hay hơn'], ['应该加注释解释', 'nên thêm chú thích giải thích']], correct: 0,
            explEn: '原文如果故意写得笨拙，译文就不该写得漂亮.', explVi: '原文如果故意写得笨拙，译文就不该写得漂亮.' },
          { q: '译者随时要问的问题是什么？', qPinyin: 'Yì zhě suí shí yào wèn de wèn tí shì shén me?',
            qEn: 'What must a translator keep asking?', qVi: 'Người dịch phải luôn tự hỏi câu gì?',
            options: [['读到这里的人感觉和原来的读者一样吗', 'người đọc đến đây có cảm giác giống người đọc nguyên bản không'], ['这个词对不对', 'từ này đúng chưa'], ['句子够不够长', 'câu có đủ dài không']], correct: 0,
            explEn: '不是"这个词对不对"，而是"读到这里的人，得到的感觉和原来的读者一样吗".', explVi: '不是"这个词对不对"，而是"读到这里的人，得到的感觉和原来的读者一样吗".' }
        ]
      },
      {
        titleZh: '放两天再读',
        titleEn: 'Leave it two days',
        titleVi: 'Để hai ngày rồi đọc',
        zh: '刚翻完的时候，你脑子里还留着原文的样子，所以读自己的句子会自动补上原文的意思，看不出问题。放两天，那层记忆淡了，你才能像普通读者一样读它。这时会发现几类固定的毛病。一类是"翻译腔"：句子在语法上没错，可是中文里没有人这样说话，多半是把原文的结构原样搬了过来。一类是主语忽然变了：原文一句话里主语从头到尾是同一个，中文分成两句以后第二句悄悄换了人，读者要停下来想一下。还有一类是词用对了但轻重不对：原文只是"不喜欢"，译文写成了"讨厌"。这三类都不需要对照原文才能发现，只需要一双陌生的眼睛。所以最有效的检查不是再对一遍字，而是先让自己变成陌生人。',
        en: 'Just after finishing, the shape of the original is still in your head, so you supply its meaning automatically while reading your own sentences and see nothing wrong. Leave it two days, let that memory fade, and only then can you read it as an ordinary reader would. Several standard faults then show up. One is translationese: the sentence is grammatical, yet nobody speaks that way in Chinese, and usually the original\'s structure has simply been carried across. Another is a subject that shifts: the original keeps one subject throughout, but once split into two Chinese sentences the second quietly changes person, and the reader has to stop and work it out. A third is a word that is correct but wrongly weighted: the original merely said "does not like" and the translation says "detests". None of the three requires the original to spot — only a stranger\'s eyes. The most effective check, then, is not to compare the words again but to first turn yourself into a stranger.',
        vi: 'Lúc vừa dịch xong, trong đầu bạn còn nguyên dáng dấp của bản gốc, nên đọc câu của chính mình thì tự động bù vào ý của bản gốc, chẳng thấy vấn đề gì. Để hai ngày, khi lớp ký ức ấy nhạt đi, bạn mới đọc nó được như một người đọc bình thường. Lúc này sẽ phát hiện mấy loại lỗi cố định. Một loại là "giọng dịch": câu đúng ngữ pháp, nhưng trong tiếng Trung chẳng ai nói như vậy, phần nhiều là bê nguyên cấu trúc của bản gốc sang. Một loại là chủ thể của câu bỗng đổi: trong bản gốc một câu từ đầu đến cuối cùng một chủ thể, tiếng Trung tách thành hai câu thì câu thứ hai lặng lẽ đổi người, người đọc phải dừng lại nghĩ một chút. Còn một loại là dùng đúng từ nhưng sai mức độ nặng nhẹ: bản gốc chỉ là "không thích", bản dịch viết thành "ghét". Ba loại này đều không cần đối chiếu bản gốc mới thấy, chỉ cần một đôi mắt xa lạ. Vì vậy cách kiểm tra hiệu quả nhất không phải đối chữ thêm lần nữa, mà là biến chính mình thành người xa lạ trước đã.',
        questions: [
          { q: '刚翻完时为什么看不出问题？', qPinyin: 'Gāng fān wán shí wèi shén me kàn bu chū wèn tí?',
            qEn: 'Why can you not see problems right after finishing?', qVi: 'Vì sao vừa dịch xong thì không thấy vấn đề?',
            options: [['脑子里还留着原文，会自动补上意思', 'trong đầu còn bản gốc, tự động bù vào ý'], ['因为太累了', 'vì quá mệt'], ['因为句子太长', 'vì câu quá dài']], correct: 0,
            explEn: '你脑子里还留着原文的样子，所以读自己的句子会自动补上原文的意思.', explVi: '你脑子里还留着原文的样子，所以读自己的句子会自动补上原文的意思.' },
          { q: '"翻译腔"指的是什么？', qPinyin: '"Fān yì qiāng" zhǐ de shì shén me?',
            qEn: 'What is translationese?', qVi: '"Giọng dịch" là gì?',
            options: [['语法没错，但中文里没有人这样说话', 'ngữ pháp không sai nhưng tiếng Trung chẳng ai nói vậy'], ['用词太少', 'dùng quá ít từ'], ['句子太短', 'câu quá ngắn']], correct: 0,
            explEn: '句子在语法上没错，可是中文里没有人这样说话.', explVi: '句子在语法上没错，可是中文里没有人这样说话.' },
          { q: '发现这三类毛病需要什么？', qPinyin: 'Fā xiàn zhè sān lèi máo bìng xū yào shén me?',
            qEn: 'What is needed to spot the three faults?', qVi: 'Phát hiện ba loại lỗi ấy cần gì?',
            options: [['一双陌生的眼睛，不需要对照原文', 'một đôi mắt xa lạ, không cần đối chiếu bản gốc'], ['把原文再读三遍', 'đọc lại bản gốc ba lần'], ['一本更好的词典', 'một cuốn từ điển tốt hơn']], correct: 0,
            explEn: '这三类都不需要对照原文才能发现，只需要一双陌生的眼睛.', explVi: '这三类都不需要对照原文才能发现，只需要一双陌生的眼睛.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___能在句子里说清楚，___不必加注释。', pinyin: '___ néng zài jù zi lǐ shuō qīng chu, ___ bú bì jiā zhù shì.',
        options: [['若……便', 'nếu… thì'], ['虽……但', 'tuy… nhưng'], ['既……又', 'vừa… vừa'], ['非……不可', 'nhất định phải']], correct: 0,
        explEn: '若……便 is the formal written counterpart of 如果……就.', explVi: '若……便 là dạng văn viết trang trọng của 如果……就.' },
      { kind: 'fillBlank', bloom: 'analyze', prompt: '句子太长，___意思很难跟上。', pinyin: 'Jù zi tài cháng, ___ yì si hěn nán gēn shàng.',
        options: [['使得', 'khiến cho'], ['以免', 'kẻo'], ['出于', 'xuất phát từ'], ['随着', 'cùng với']], correct: 0,
        explEn: '使得 takes a whole clause as the result and names no agent.', explVi: '使得 nhận cả mệnh đề làm kết quả và không nêu chủ thể gây ra.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那"忠实"到底忠于什么？ B：___', pinyin: 'A: Nà "zhōng shí" dào dǐ zhōng yú shén me? B: ___',
        options: [['忠于作者想产生的效果，而不是每一个字的表面。', 'Trung thành với hiệu quả tác giả muốn tạo ra, không phải bề mặt từng chữ.'], ['忠于每一个字。', 'Trung thành với từng chữ một.'], ['翻译很难。', 'Dịch rất khó.'], ['我用词典。', 'Mình dùng từ điển.']], correct: 0,
        explEn: 'The question asks what fidelity is owed to, so the answer must name the object of fidelity.', explVi: 'Câu hỏi hỏi trung thành với cái gì, nên câu trả lời phải nêu đối tượng của sự trung thành.' },
      { kind: 'multipleChoice', bloom: 'evaluate', prompt: '根据第二篇短文，"不喜欢"译成"讨厌"属于哪一类毛病？', pinyin: 'Gēn jù dì èr piān duǎn wén, "bù xǐ huan" yì chéng "tǎo yàn" shǔ yú nǎ yí lèi máo bìng?',
        passage: 2, options: [['词用对了但轻重不对', 'dùng đúng từ nhưng sai mức độ nặng nhẹ'], ['翻译腔', 'giọng dịch'], ['主语忽然变了', 'chủ thể bỗng đổi'], ['注释太多', 'chú thích quá nhiều']], correct: 0,
        explEn: '还有一类是词用对了但轻重不对：原文只是"不喜欢"，译文写成了"讨厌".', explVi: '还有一类是词用对了但轻重不对：原文只是"不喜欢"，译文写成了"讨厌".' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，原文模糊的地方译者应该替作者说清楚。', pinyin: 'Gēn jù dì yī piān duǎn wén, yuán wén mó hu de dì fang yì zhě yīng gāi tì zuò zhě shuō qīng chu.',
        isTrue: false, passage: 1,
        explEn: '原文如果模糊，译文也不该替作者把话说清楚——那已经不是翻译，是改写.', explVi: '原文如果模糊，译文也不该替作者把话说清楚——那已经不是翻译，是改写.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '遇到不好翻的词 / 不妨 / 换 / 一个说法', pinyin: 'yù dào bù hǎo fān de cí / bù fáng / huàn / yí gè shuō fǎ',
        answer: '遇到不好翻的词，不妨换一个说法。', answerVi: 'Gặp từ khó dịch thì cứ đổi sang một cách nói khác.',
        options: [['遇到不好翻的词', 'gặp từ khó dịch'], ['不妨', 'chẳng ngại gì'], ['换', 'đổi'], ['一个说法', 'một cách nói']],
        explEn: '不妨 stands before the verb and never takes a negative.', explVi: '不妨 đứng trước động từ và không đi với phủ định.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '若 / 两种说法都可以 / 便 / 选读者更熟悉的那个', pinyin: 'ruò / liǎng zhǒng shuō fǎ dōu kě yǐ / biàn / xuǎn dú zhě gèng shú xī de nà ge',
        answer: '若两种说法都可以，便选读者更熟悉的那个。', answerVi: 'Nếu cả hai cách nói đều được thì chọn cách người đọc quen hơn.',
        options: [['若', 'nếu'], ['两种说法都可以', 'cả hai cách nói đều được'], ['便', 'thì'], ['选读者更熟悉的那个', 'chọn cách người đọc quen hơn']],
        explEn: '若 and 便 each stand at the head of their own clause.', explVi: '若 và 便 mỗi từ đứng đầu mệnh đề của mình.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，原文里人人皆知的品牌名该怎么处理？', pinyin: 'Gēn jù dì yī piān duǎn wén, yuán wén lǐ rén rén jiē zhī de pǐn pái míng gāi zěn me chǔ lǐ?',
        passage: 1, options: [['换成在新读者心里位置相当的东西', 'thay bằng thứ có vị trí tương đương trong lòng người đọc mới'], ['照原样搬过来', 'bê nguyên xi sang'], ['直接删掉', 'xoá thẳng đi'], ['加一个长注释', 'thêm một chú thích dài']], correct: 0,
        explEn: '真正忠实的做法，是找一个在新读者心里位置相当的东西换掉它.', explVi: '真正忠实的做法，是找一个在新读者心里位置相当的东西换掉它.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，最有效的检查办法是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, zuì yǒu xiào de jiǎn chá bàn fǎ shì shén me?',
        passage: 2, options: [['先让自己变成陌生人，而不是再对一遍字', 'biến mình thành người xa lạ trước, chứ không phải đối chữ thêm lần nữa'], ['把原文背下来', 'học thuộc bản gốc'], ['请人重翻一遍', 'nhờ người dịch lại'], ['多加几个注释', 'thêm vài chú thích']], correct: 0,
        explEn: '最有效的检查不是再对一遍字，而是先让自己变成陌生人.', explVi: '最有效的检查不是再对一遍字，而是先让自己变成陌生人.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说笑话怎么翻才算忠实？', pinyin: 'B shuō xiào hua zěn me fān cái suàn zhōng shí?',
        line: 12, options: [['使得读者笑出来', 'làm cho người đọc bật cười'], ['一个字一个字照翻', 'dịch sát từng chữ'], ['加注释解释笑点', 'thêm chú thích giải thích chỗ cười'], ['干脆删掉', 'xoá thẳng đi']], correct: 0,
        explEn: 'B says: 笑话直接照字翻往往不好笑，这时使得读者笑出来才算忠实.', explVi: 'B nói: 笑话直接照字翻往往不好笑，这时使得读者笑出来才算忠实.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B建议怎么检查自己翻的东西？', pinyin: 'B jiàn yì zěn me jiǎn chá zì jǐ fān de dōng xi?',
        line: 16, options: [['放两天再读，读得别扭的地方就是问题', 'để hai ngày rồi đọc, chỗ trúc trắc chính là chỗ có vấn đề'], ['马上再读一遍', 'đọc lại ngay lập tức'], ['和词典对一遍', 'đối chiếu với từ điển'], ['交给作者看', 'đưa cho tác giả xem']], correct: 0,
        explEn: 'B says: 放两天再读一遍，读得别扭的地方多半就是没转过来的地方.', explVi: 'B nói: 放两天再读一遍，读得别扭的地方多半就是没转过来的地方.' }
    ]
  },

  'hsk6-l12-standard-media-framing': {
    titleZh: '媒体的框架',
    titleEn: 'Media framing',
    titleVi: 'Khung của truyền thông',
    summaryEn: 'Why objective is not the same as neutral, how the word placed first assigns responsibility, what a growth figure hides, and the cheapest way to make a frame visible.',
    summaryVi: 'Vì sao khách quan không đồng nghĩa với trung lập, từ đặt lên đầu câu phân bổ trách nhiệm ra sao, con số tăng trưởng giấu điều gì, và cách rẻ nhất để nhìn thấy cái khung.',
    lines: [
      ['A', '可是每家都说自己客观。', 'Kě shì měi jiā dōu shuō zì jǐ kè guān.',
        'But every outlet says it is objective.',
        'Nhưng nhà nào cũng nói mình khách quan.'],
      ['B', '值得注意的是，客观不等于中立——把两种说法都放上来，其中一种可能根本没有证据。', 'Zhí de zhù yì de shì, kè guān bù děng yú zhōng lì — bǎ liǎng zhǒng shuō fǎ dōu fàng shàng lái, qí zhōng yì zhǒng kě néng gēn běn méi yǒu zhèng jù.',
        'Note that objective is not the same as neutral — putting both accounts up may mean one of them has no evidence at all.',
        'Đáng chú ý là khách quan không đồng nghĩa với trung lập — đưa cả hai cách nói lên thì một trong hai có thể chẳng có bằng chứng nào.'],
      ['A', '那怎么看出框架？', 'Nà zěn me kàn chū kuàng jià?',
        'So how do I see the frame?',
        'Vậy làm sao nhìn ra cái khung?'],
      ['B', '看标题用了什么动词，看谁被放在句子的最前面。', 'Kàn biāo tí yòng le shén me dòng cí, kàn shéi bèi fàng zài jù zi de zuì qián miàn.',
        'Look at what verb the headline uses, and at who is placed at the front of the sentence.',
        'Xem tiêu đề dùng động từ gì, xem ai được đặt ở đầu câu.'],
      ['A', '放在最前面有什么讲究？', 'Fàng zài zuì qián miàn yǒu shén me jiǎng jiu?',
        'Why does the front position matter?',
        'Đặt ở đầu câu thì có gì đáng nói?'],
      ['B', '"警察打了人，两个人受伤"和"两个人在冲突中受伤"，责任的位置完全不同。', '"Jǐng chá dǎ le rén, liǎng gè rén shòu shāng" hé "liǎng gè rén zài chōng tū zhōng shòu shāng", zé rèn de wèi zhi wán quán bù tóng.',
        '"Police struck people and two were injured" versus "two people were injured in a clash" — responsibility sits in a completely different place.',
        '"Cảnh sát đánh người, hai người bị thương" và "hai người bị thương trong xô xát" — vị trí của trách nhiệm khác hẳn.'],
      ['A', '数据也能做框架吗？', 'Shù jù yě néng zuò kuàng jià ma?',
        'Can data frame things too?',
        'Dữ liệu cũng làm khung được à?'],
      ['B', '能，一旦只报道增长的比例，不报道原来的数量，读者就会把情况想得太好。', 'Néng, yí dàn zhǐ bào dào zēng zhǎng de bǐ lì, bú bào dào yuán lái de shù liàng, dú zhě jiù huì bǎ qíng kuàng xiǎng de tài hǎo.',
        'It can — once only the growth rate is reported and not the original figure, readers picture things as better than they are.',
        'Có, hễ chỉ đưa tỷ lệ tăng mà không đưa con số ban đầu là người đọc sẽ hình dung tình hình tốt hơn thực tế.'],
      ['A', '那普通读者能做什么？', 'Nà pǔ tōng dú zhě néng zuò shén me?',
        'What can an ordinary reader do?',
        'Vậy người đọc bình thường làm được gì?'],
      ['B', '换一家立场不同的媒体看同一件事，差别势必让你看见框架。', 'Huàn yì jiā lì chǎng bù tóng de méi tǐ kàn tóng yí jiàn shì, chā bié shì bì ràng nǐ kàn jiàn kuàng jià.',
        'Read the same event in an outlet with a different stance; the difference is bound to make the frame visible.',
        'Đổi sang một báo có lập trường khác đọc cùng một sự việc, khác biệt tất sẽ khiến bạn nhìn thấy cái khung.']
    ],
    vocab: [['媒体', 'méi tǐ'], ['角度', 'jiǎo dù'], ['框架', 'kuàng jià'], ['判断', 'pàn duàn'], ['强调', 'qiáng diào'],
      ['省略', 'shěng lüè'], ['客观', 'kè guān'], ['结论', 'jié lùn'], ['报道', 'bào dào'], ['标题', 'biāo tí'],
      ['选择', 'xuǎn zé'], ['引导', 'yǐn dǎo'], ['消息', 'xiāo xi'], ['来源', 'lái yuán'], ['中立', 'zhōng lì'],
      ['数据', 'shù jù'], ['印象', 'yìn xiàng'], ['舆论', 'yú lùn'], ['事实', 'shì shí'], ['手段', 'shǒu duàn']],
    grammar: [
      {
        pattern: '值得注意的是，……',
        explEn: 'Flags the point the writer does not want passed over. The whole phrase is the subject and a comma always follows before the claim.',
        explVi: 'Đánh dấu điểm mà người viết không muốn bị lướt qua. Cả cụm làm chủ ngữ và luôn có dấu phẩy trước luận điểm.',
        examples: [
          ['值得注意的是，客观不等于中立。', 'Zhí de zhù yì de shì, kè guān bù děng yú zhōng lì.', 'It is worth noting that objective is not the same as neutral.', 'Đáng chú ý là khách quan không đồng nghĩa với trung lập.'],
          ['值得注意的是，这条消息只有一个来源。', 'Zhí de zhù yì de shì, zhè tiáo xiāo xi zhǐ yǒu yí gè lái yuán.', 'It is worth noting that this report has only one source.', 'Đáng chú ý là tin này chỉ có một nguồn.'],
          ['值得注意的是，标题和内容并不一致。', 'Zhí de zhù yì de shì, biāo tí hé nèi róng bìng bù yí zhì.', 'It is worth noting that the headline and the content do not match.', 'Đáng chú ý là tiêu đề và nội dung không khớp nhau.']
        ]
      },
      {
        pattern: '一旦……，就……',
        explEn: 'Marks the point after which a consequence becomes unavoidable. Unlike 一……就……, the trigger is a condition that may not yet have happened.',
        explVi: 'Đánh dấu thời điểm mà từ đó hệ quả không tránh khỏi. Khác với 一……就……, điều kích hoạt là một điều kiện có thể chưa xảy ra.',
        examples: [
          ['一旦只报道比例，不报道数量，读者就会把情况想得太好。', 'Yí dàn zhǐ bào dào bǐ lì, bú bào dào shù liàng, dú zhě jiù huì bǎ qíng kuàng xiǎng de tài hǎo.', 'Once only the rate is reported and not the figure, readers picture things too favourably.', 'Hễ chỉ đưa tỷ lệ mà không đưa con số là người đọc hình dung quá tốt.'],
          ['一旦印象形成，就很难用数据改过来。', 'Yí dàn yìn xiàng xíng chéng, jiù hěn nán yòng shù jù gǎi guò lái.', 'Once an impression forms, data can hardly change it back.', 'Một khi ấn tượng đã hình thành thì rất khó dùng dữ liệu sửa lại.'],
          ['一旦省略了来源，这条消息就没法核查。', 'Yí dàn shěng lüè le lái yuán, zhè tiáo xiāo xi jiù méi fǎ hé chá.', 'Once the source is omitted, the report cannot be checked.', 'Một khi bỏ nguồn đi thì tin này không kiểm chứng được.']
        ]
      },
      {
        pattern: '势必 + 动词',
        explEn: 'States that an outcome must follow from what has been set up. It is stronger than 一定 and belongs to written argument.',
        explVi: 'Nêu rằng một kết quả tất yếu sẽ theo sau điều vừa được thiết lập. Mạnh hơn 一定 và thuộc văn nghị luận viết.',
        examples: [
          ['差别势必让你看见框架。', 'Chā bié shì bì ràng nǐ kàn jiàn kuàng jià.', 'The difference is bound to make the frame visible.', 'Khác biệt tất sẽ khiến bạn nhìn thấy cái khung.'],
          ['只看一家媒体，判断势必受它引导。', 'Zhǐ kàn yì jiā méi tǐ, pàn duàn shì bì shòu tā yǐn dǎo.', 'Read one outlet only and your judgement is bound to be led by it.', 'Chỉ đọc một tờ báo thì phán đoán tất bị nó dẫn dắt.'],
          ['省略关键事实，结论势必偏离。', 'Shěng lüè guān jiàn shì shí, jié lùn shì bì piān lí.', 'Omit a key fact and the conclusion must go astray.', 'Bỏ đi sự thật then chốt thì kết luận tất sẽ lệch.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '谁被放在句子前面',
        titleEn: 'Who goes at the front of the sentence',
        titleVi: 'Ai được đặt ở đầu câu',
        zh: '同一件事，句子的排法可以把责任放到不同的地方，而读者几乎不会发现。"公司裁掉了三百人"把动作和做动作的人都写了出来；"三百人失去了工作"只剩下承受的一方，做的人不见了；"由于市场变化，三百个岗位被取消"连人都没有了，剩下的只有一个没有面孔的原因。三句话可以同时是真的，选哪一句却已经是判断。动词也一样："提价"和"调整价格"说的是同一件事，后者听起来像是被迫的、技术性的。所以读新闻时可以做一个很小的练习：把每个句子改写成"谁对谁做了什么"，看看改写以后有没有多出一个原来没有出现的人。多出来了，那说明原句把他藏在了后面；改写不了，那多半是记者自己也不知道。这个练习不需要任何专业知识，却能挡住大部分不动声色的引导。',
        en: 'For one event, the arrangement of a sentence can put responsibility in different places while the reader hardly notices. "The company laid off three hundred people" states both the act and the actor; "three hundred people lost their jobs" leaves only the party affected and the actor disappears; "owing to market changes, three hundred posts were cut" removes people altogether, leaving a faceless cause. All three can be true at once, yet choosing one is already a judgement. Verbs work the same way: "raise prices" and "adjust prices" describe the same act, but the second sounds forced upon someone and technical. So a small exercise is available when reading the news: rewrite each sentence as "who did what to whom" and see whether a person appears who was not there before. If one does, the original had hidden them at the back; if the rewrite is impossible, the reporter probably did not know either. The exercise needs no specialist knowledge, yet it blocks most of the quiet steering.',
        vi: 'Cùng một sự việc, cách sắp đặt câu có thể đặt trách nhiệm vào những chỗ khác nhau mà người đọc hầu như không nhận thấy. "Công ty cắt giảm ba trăm người" viết ra cả hành động lẫn người thực hiện; "ba trăm người mất việc" chỉ còn lại bên chịu tác động, người làm biến mất; "do thị trường biến động, ba trăm vị trí bị cắt bỏ" thì đến con người cũng không còn, chỉ còn lại một nguyên nhân không mặt mũi. Ba câu có thể cùng đúng, nhưng chọn câu nào thì đã là một phán đoán. Động từ cũng vậy: "tăng giá" và "điều chỉnh giá" nói cùng một việc, nhưng cách sau nghe như bị buộc phải làm và mang tính kỹ thuật. Vì thế khi đọc tin có thể làm một bài tập rất nhỏ: viết lại mỗi câu thành "ai làm gì với ai", xem sau khi viết lại có mọc thêm một người trước đó không xuất hiện không. Có mọc thêm thì tức là câu gốc đã giấu người ấy ra phía sau; không viết lại được thì phần nhiều là chính nhà báo cũng không biết. Bài tập này chẳng cần kiến thức chuyên môn nào, nhưng chặn được phần lớn những dẫn dắt lặng lẽ.',
        questions: [
          { q: '"三百人失去了工作"这句话省掉了什么？', qPinyin: '"Sān bǎi rén shī qù le gōng zuò" zhè jù huà shěng diào le shén me?',
            qEn: 'What does that sentence leave out?', qVi: 'Câu đó đã bỏ mất cái gì?',
            options: [['做动作的人', 'người thực hiện hành động'], ['受影响的人', 'người chịu tác động'], ['具体的数字', 'con số cụ thể']], correct: 0,
            explEn: '只剩下承受的一方，做的人不见了.', explVi: '只剩下承受的一方，做的人不见了.' },
          { q: '"调整价格"和"提价"的差别在哪儿？', qPinyin: '"Tiáo zhěng jià gé" hé "tí jià" de chā bié zài nǎr?',
            qEn: 'How do those two verbs differ?', qVi: 'Khác biệt giữa hai động từ ấy là gì?',
            options: [['后者听起来像被迫的、技术性的', 'cách sau nghe như bị buộc phải làm, mang tính kỹ thuật'], ['后者说的是另一件事', 'cách sau nói một việc khác'], ['前者更长', 'cách trước dài hơn']], correct: 0,
            explEn: '后者听起来像是被迫的、技术性的.', explVi: '后者听起来像是被迫的、技术性的.' },
          { q: '短文建议的练习是什么？', qPinyin: 'Duǎn wén jiàn yì de liàn xí shì shén me?',
            qEn: 'What exercise does the text suggest?', qVi: 'Bài đọc gợi ý bài tập nào?',
            options: [['把句子改写成"谁对谁做了什么"', 'viết lại câu thành "ai làm gì với ai"'], ['数一数有几个数字', 'đếm xem có mấy con số'], ['查记者是谁', 'tra xem nhà báo là ai']], correct: 0,
            explEn: '把每个句子改写成"谁对谁做了什么".', explVi: '把每个句子改写成"谁对谁做了什么".' }
        ]
      },
      {
        titleZh: '一个比例能藏住多少东西',
        titleEn: 'How much a percentage can hide',
        titleVi: 'Một tỷ lệ giấu được bao nhiêu thứ',
        zh: '"某种病例增长了百分之三百"，听上去很可怕；如果原来是两例，现在是八例，那么这句话也完全属实。比例天生放大小数字，所以任何只给比例、不给原来数量的报道，都应该先打一个问号。同一个手段反过来也能用：把绝对数量报出来而不给总数——"去年有一万人因此受影响"，听上去很多，可是如果基数是一千万，那就是千分之一。第三种是选时间：任何一组起伏的数字，都能通过挑选起点变成"持续上升"或者"明显下降"。这三招都不需要造出任何假数字，全部用真实数据就能完成，这也正是它们难被发现的原因。读者能做的很实际：看到比例就找数量，看到数量就找总数，看到趋势就问"从哪一年开始算"。三个问题问下来，大部分数字上的引导就站不住了。',
        en: 'Cases of a certain disease "rose three hundred percent" sounds frightening; if the figure went from two to eight, the sentence is also entirely true. Percentages inherently magnify small numbers, so any report giving a rate without the underlying figure deserves a question mark first. The same device works in reverse: give the absolute number without the total — "ten thousand people were affected last year" sounds like a great many, but against a base of ten million it is one in a thousand. A third move is choosing the period: any set of fluctuating figures can be made to show "sustained growth" or "marked decline" by choosing where to start. None of the three requires making up a false figure; all can be done with real data, which is exactly why they are hard to catch. What a reader can do is practical: given a rate, find the figure; given a figure, find the total; given a trend, ask what year the count starts from. Ask those three and most numerical steering stops standing up.',
        vi: '"Số ca của một loại bệnh tăng ba trăm phần trăm" nghe rất kinh khủng; nếu trước đây là hai ca, giờ là tám ca thì câu ấy cũng hoàn toàn đúng sự thật. Tỷ lệ vốn dĩ phóng to những con số nhỏ, nên bất kỳ bản tin nào chỉ đưa tỷ lệ mà không đưa con số gốc đều nên bị đặt một dấu hỏi trước đã. Cùng thủ pháp ấy dùng ngược lại cũng được: đưa ra con số tuyệt đối mà không cho tổng số — "năm ngoái có một vạn người bị ảnh hưởng" nghe rất nhiều, nhưng nếu mẫu số là mười triệu thì đó là một phần nghìn. Chiêu thứ ba là chọn khoảng thời gian: bất kỳ dãy số lên xuống nào cũng có thể thành "tăng liên tục" hay "giảm rõ rệt" tuỳ chỗ bạn chọn làm điểm bắt đầu. Cả ba chiêu đều không cần dựng ra con số giả nào, dùng toàn dữ liệu thật là làm được, và đó chính là lý do chúng khó bị phát hiện. Điều người đọc làm được thì rất thực tế: thấy tỷ lệ thì tìm con số, thấy con số thì tìm tổng số, thấy xu hướng thì hỏi "tính từ năm nào". Hỏi xong ba câu ấy, phần lớn những dẫn dắt bằng con số sẽ không còn đứng vững.',
        questions: [
          { q: '为什么"增长百分之三百"可能不吓人？', qPinyin: 'Wèi shén me "zēng zhǎng bǎi fēn zhī sān bǎi" kě néng bú xià rén?',
            qEn: 'Why might "up three hundred percent" not be alarming?', qVi: 'Vì sao "tăng ba trăm phần trăm" có thể không đáng sợ?',
            options: [['原来两例现在八例，比例放大了小数字', 'trước hai ca nay tám ca, tỷ lệ phóng to con số nhỏ'], ['因为数据是假的', 'vì dữ liệu là giả'], ['因为病不严重', 'vì bệnh không nghiêm trọng']], correct: 0,
            explEn: '如果原来是两例，现在是八例……比例天生放大小数字.', explVi: '如果原来是两例，现在是八例……比例天生放大小数字.' },
          { q: '第三种手段是什么？', qPinyin: 'Dì sān zhǒng shǒu duàn shì shén me?',
            qEn: 'What is the third device?', qVi: 'Thủ pháp thứ ba là gì?',
            options: [['选时间，靠挑起点改变趋势的样子', 'chọn khoảng thời gian, chọn điểm bắt đầu để đổi dáng xu hướng'], ['造出假数字', 'dựng ra số liệu giả'], ['只用图不用字', 'chỉ dùng hình không dùng chữ']], correct: 0,
            explEn: '第三种是选时间：任何一组起伏的数字，都能通过挑选起点变成"持续上升"或者"明显下降".', explVi: '第三种是选时间：任何一组起伏的数字，都能通过挑选起点变成"持续上升"或者"明显下降".' },
          { q: '这三招为什么难被发现？', qPinyin: 'Zhè sān zhāo wèi shén me nán bèi fā xiàn?',
            qEn: 'Why are the three devices hard to catch?', qVi: 'Vì sao ba chiêu này khó bị phát hiện?',
            options: [['全部用真实数据就能完成', 'dùng toàn dữ liệu thật là làm được'], ['因为数字太大', 'vì con số quá lớn'], ['因为读者不识字', 'vì người đọc không biết chữ']], correct: 0,
            explEn: '这三招都不需要造出任何假数字，全部用真实数据就能完成.', explVi: '这三招都不需要造出任何假数字，全部用真实数据就能完成.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___，这条消息只有一个来源。', pinyin: '___, zhè tiáo xiāo xi zhǐ yǒu yí gè lái yuán.',
        options: [['值得注意的是', 'đáng chú ý là'], ['归根到底', 'xét cho cùng'], ['在我看来', 'theo tôi thấy'], ['不管怎么说', 'dù nói thế nào']], correct: 0,
        explEn: '值得注意的是 is the subject of the sentence and a comma always follows.', explVi: '值得注意的是 làm chủ ngữ của câu và luôn có dấu phẩy theo sau.' },
      { kind: 'fillBlank', bloom: 'analyze', prompt: '___印象形成，___很难用数据改过来。', pinyin: '___ yìn xiàng xíng chéng, ___ hěn nán yòng shù jù gǎi guò lái.',
        options: [['一旦……就', 'một khi… thì'], ['尽管……仍然', 'mặc dù… vẫn'], ['凡是……都', 'phàm là… đều'], ['以免……', 'kẻo…']], correct: 0,
        explEn: '一旦 marks a condition that may not yet have happened, after which the consequence is unavoidable.', explVi: '一旦 đánh dấu điều kiện có thể chưa xảy ra, mà sau đó hệ quả là không tránh khỏi.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那怎么看出框架？ B：___', pinyin: 'A: Nà zěn me kàn chū kuàng jià? B: ___',
        options: [['看标题用了什么动词，看谁被放在句子的最前面。', 'Xem tiêu đề dùng động từ gì, xem ai được đặt ở đầu câu.'], ['多看几遍就懂了。', 'Đọc thêm vài lần là hiểu.'], ['媒体都不可信。', 'Truyền thông đều không đáng tin.'], ['我很少看新闻。', 'Mình ít khi đọc tin.']], correct: 0,
        explEn: 'The question asks how to detect a frame, so the answer must name observable features.', explVi: 'Câu hỏi hỏi cách nhìn ra cái khung, nên câu trả lời phải nêu dấu hiệu quan sát được.' },
      { kind: 'multipleChoice', bloom: 'evaluate', prompt: '根据第二篇短文，"去年有一万人受影响"这句话还缺什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, "qù nián yǒu yí wàn rén shòu yǐng xiǎng" zhè jù huà hái quē shén me?',
        passage: 2, options: [['总数，一万相对于一千万是千分之一', 'tổng số, một vạn so với mười triệu là một phần nghìn'], ['受影响的原因', 'nguyên nhân bị ảnh hưởng'], ['报道的日期', 'ngày đăng tin'], ['记者的名字', 'tên nhà báo']], correct: 0,
        explEn: '把绝对数量报出来而不给总数……如果基数是一千万，那就是千分之一.', explVi: '把绝对数量报出来而不给总数……如果基数是一千万，那就是千分之一.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，"三百人失去了工作"是假话。', pinyin: 'Gēn jù dì yī piān duǎn wén, "sān bǎi rén shī qù le gōng zuò" shì jiǎ huà.',
        isTrue: false, passage: 1,
        explEn: '三句话可以同时是真的，选哪一句却已经是判断.', explVi: '三句话可以同时是真的，选哪一句却已经是判断.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '省略关键事实 / 结论 / 势必 / 偏离', pinyin: 'shěng lüè guān jiàn shì shí / jié lùn / shì bì / piān lí',
        answer: '省略关键事实，结论势必偏离。', answerVi: 'Bỏ đi sự thật then chốt thì kết luận tất sẽ lệch.',
        options: [['省略关键事实', 'bỏ đi sự thật then chốt'], ['结论', 'kết luận'], ['势必', 'tất sẽ'], ['偏离', 'đi lệch']],
        explEn: '势必 stands before the verb and states that the outcome must follow.', explVi: '势必 đứng trước động từ và nói rằng kết quả tất yếu xảy ra.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '值得注意的是 / 标题和内容 / 并 / 不一致', pinyin: 'zhí de zhù yì de shì / biāo tí hé nèi róng / bìng / bù yí zhì',
        answer: '值得注意的是，标题和内容并不一致。', answerVi: 'Đáng chú ý là tiêu đề và nội dung không khớp nhau.',
        options: [['值得注意的是', 'đáng chú ý là'], ['标题和内容', 'tiêu đề và nội dung'], ['并', 'hề'], ['不一致', 'không khớp']],
        explEn: 'The flagging phrase comes first, then the claim it protects from being skimmed.', explVi: 'Cụm đánh dấu đứng trước, rồi đến luận điểm mà nó bảo vệ khỏi bị lướt qua.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，改写不出"谁对谁做了什么"说明什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, gǎi xiě bu chū "shéi duì shéi zuò le shén me" shuō míng shén me?',
        passage: 1, options: [['多半是记者自己也不知道', 'phần nhiều là chính nhà báo cũng không biết'], ['说明句子写得好', 'cho thấy câu viết hay'], ['说明事情不重要', 'cho thấy việc không quan trọng'], ['说明读者水平不够', 'cho thấy trình độ người đọc chưa đủ']], correct: 0,
        explEn: '改写不了，那多半是记者自己也不知道.', explVi: '改写不了，那多半是记者自己也不知道.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，读者应该问的三个问题是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, dú zhě yīng gāi wèn de sān gè wèn tí shì shén me?',
        passage: 2, options: [['比例找数量、数量找总数、趋势问从哪年算', 'tỷ lệ tìm con số, con số tìm tổng số, xu hướng hỏi tính từ năm nào'], ['谁写的、谁看的、谁付钱', 'ai viết, ai đọc, ai trả tiền'], ['多长、多新、多有名', 'dài bao nhiêu, mới thế nào, nổi tiếng ra sao'], ['真的、假的、不知道', 'thật, giả, không biết']], correct: 0,
        explEn: '看到比例就找数量，看到数量就找总数，看到趋势就问"从哪一年开始算".', explVi: '看到比例就找数量，看到数量就找总数，看到趋势就问"从哪一年开始算".' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么说客观不等于中立？', pinyin: 'B wèi shén me shuō kè guān bù děng yú zhōng lì?',
        line: 8, options: [['两种说法都放上来，其中一种可能没有证据', 'đưa cả hai cách nói lên, một trong hai có thể không có bằng chứng'], ['因为没有人客观', 'vì chẳng ai khách quan'], ['因为中立更难', 'vì trung lập khó hơn'], ['因为媒体都有立场', 'vì báo nào cũng có lập trường']], correct: 0,
        explEn: 'B says: 客观不等于中立——把两种说法都放上来，其中一种可能根本没有证据.', explVi: 'B nói: 客观不等于中立——把两种说法都放上来，其中一种可能根本没有证据.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B建议普通读者怎么看见框架？', pinyin: 'B jiàn yì pǔ tōng dú zhě zěn me kàn jiàn kuàng jià?',
        line: 16, options: [['换一家立场不同的媒体看同一件事', 'đổi sang báo có lập trường khác đọc cùng sự việc'], ['只看官方消息', 'chỉ đọc tin chính thức'], ['多看几遍同一篇', 'đọc lại cùng một bài nhiều lần'], ['不看新闻', 'không đọc tin tức']], correct: 0,
        explEn: 'B says: 换一家立场不同的媒体看同一件事，差别势必让你看见框架.', explVi: 'B nói: 换一家立场不同的媒体看同一件事，差别势必让你看见框架.' }
    ]
  }
};
