// HSK5 (C1) lessons 01-02. Same spec shape as the HSK4 files; see hsk4-a.mjs.
// Bloom bands differ by level on purpose (plan.md 2.4): HSK5 leans on analyse/evaluate and
// carries one `create` item, while HSK6 leans on evaluate/create.

export default {
  'hsk5-l01-standard-implicit-meaning': {
    titleZh: '言外之意',
    titleEn: 'Reading between the lines',
    titleVi: 'Ý tại ngôn ngoại',
    summaryEn: 'Two colleagues decode indirect speech: praise that is really a reservation, how tone and setting carry the meaning, and how to check what someone meant without embarrassing them.',
    summaryVi: 'Hai đồng nghiệp giải mã lối nói gián tiếp: lời khen thực ra là dè dặt, cách ngữ điệu và bối cảnh mang nghĩa, và cách xác nhận ý người nói mà không làm họ khó xử.',
    lines: [
      ['A', '为什么不直接说"我不同意"呢？这样不是更清楚吗？', 'Wèi shén me bù zhí jiē shuō "wǒ bù tóng yì" ne? Zhè yàng bú shì gèng qīng chu ma?',
        'Why not just say "I disagree"? Would that not be clearer?',
        'Sao không nói thẳng "tôi không đồng ý"? Như vậy chẳng phải rõ hơn sao?'],
      ['B', '清楚是清楚，可是在很多人面前拒绝，对方会觉得没面子。', 'Qīng chu shì qīng chu, kě shì zài hěn duō rén miàn qián jù jué, duì fāng huì jué de méi miàn zi.',
        'Clear it would be, but refusing in front of a group makes the other person lose face.',
        'Rõ thì rõ, nhưng từ chối trước mặt đông người thì đối phương sẽ thấy mất mặt.'],
      ['A', '这么说，间接的表达其实是在保护关系？', 'Zhè me shuō, jiàn jiē de biǎo dá qí shí shì zài bǎo hù guān xi?',
        'So indirect expression is really about protecting the relationship?',
        'Vậy nghĩa là cách nói gián tiếp thực ra là để giữ quan hệ?'],
      ['B', '不只是关系，也是给对方留一个可以改变主意的空间。', 'Bù zhǐ shì guān xi, yě shì gěi duì fāng liú yí gè kě yǐ gǎi biàn zhǔ yi de kōng jiān.',
        'Not only the relationship — it also leaves the other side room to change their mind.',
        'Không chỉ quan hệ, mà còn chừa cho đối phương một khoảng để đổi ý.'],
      ['A', '可是对外国同事，这种说法他们可能完全听不出来。', 'Kě shì duì wài guó tóng shì, zhè zhǒng shuō fǎ tā men kě néng wán quán tīng bu chū lái.',
        'But with foreign colleagues, they may not catch this kind of phrasing at all.',
        'Nhưng với đồng nghiệp nước ngoài, kiểu nói này có khi họ hoàn toàn không nhận ra.'],
      ['B', '所以跨文化沟通时，最好在客气之后补一句具体的结论。', 'Suǒ yǐ kuà wén huà gōu tōng shí, zuì hǎo zài kè qi zhī hòu bǔ yí jù jù tǐ de jié lùn.',
        'So in cross-cultural communication it is best to add one concrete conclusion after the polite part.',
        'Nên khi giao tiếp liên văn hóa, tốt nhất là sau phần khách sáo hãy thêm một câu kết luận cụ thể.'],
      ['A', '看来听懂别人，比说清楚自己还难。', 'Kàn lái tīng dǒng bié rén, bǐ shuō qīng chu zì jǐ hái nán.',
        'It seems understanding others is harder than making yourself clear.',
        'Xem ra hiểu người khác còn khó hơn nói rõ ý mình.'],
      ['B', '难就难在，语言只是一半，另一半在语气和场合里。', 'Nán jiù nán zài, yǔ yán zhǐ shì yí bàn, lìng yí bàn zài yǔ qì hé chǎng hé lǐ.',
        'The difficulty is exactly that language is only half; the other half sits in tone and setting.',
        'Cái khó chính là ở chỗ ngôn từ chỉ là một nửa, nửa còn lại nằm trong ngữ điệu và bối cảnh.']
    ],
    vocab: [['语气', 'yǔ qì'], ['场合', 'chǎng hé'], ['保留', 'bǎo liú'], ['暗示', 'àn shì'], ['确认', 'què rèn'],
      ['具体', 'jù tǐ'], ['拒绝', 'jù jué'], ['面子', 'miàn zi'], ['表达', 'biǎo dá'], ['误解', 'wù jiě'],
      ['前提', 'qián tí'], ['判断', 'pàn duàn'], ['间接', 'jiàn jiē'], ['直接', 'zhí jiē'], ['沟通', 'gōu tōng'],
      ['理解', 'lǐ jiě'], ['客气', 'kè qi'], ['结论', 'jié lùn']],
    grammar: [
      {
        pattern: '形容词 + 是 + 形容词，可是……',
        explEn: 'Concedes the point before qualifying it: "clear it may be, but…". The adjective is repeated on both sides of 是.',
        explVi: 'Thừa nhận rồi mới hạn định: "rõ thì rõ, nhưng…". Tính từ được lặp lại ở hai bên chữ 是.',
        examples: [
          ['清楚是清楚，可是对方会觉得没面子。', 'Qīng chu shì qīng chu, kě shì duì fāng huì jué de méi miàn zi.', 'Clear it may be, but the other person will lose face.', 'Rõ thì rõ, nhưng đối phương sẽ thấy mất mặt.'],
          ['这个方案好是好，就是成本太高。', 'Zhè ge fāng àn hǎo shì hǎo, jiù shì chéng běn tài gāo.', 'The plan is good enough, only the cost is too high.', 'Phương án này hay thì hay, chỉ có điều chi phí quá cao.'],
          ['他懂是懂，可是说不出理由。', 'Tā dǒng shì dǒng, kě shì shuō bu chū lǐ yóu.', 'He understands all right, but cannot give the reason.', 'Anh ấy hiểu thì hiểu, nhưng không nói ra được lý do.']
        ]
      },
      {
        pattern: '难就难在……',
        explEn: 'Points at exactly where the difficulty lies. 在 is followed by a clause or a noun phrase, never by a bare adjective.',
        explVi: 'Chỉ đúng chỗ khó nằm ở đâu. Sau 在 là một mệnh đề hoặc cụm danh từ, không phải tính từ trơ.',
        examples: [
          ['难就难在，语言只是一半。', 'Nán jiù nán zài, yǔ yán zhǐ shì yí bàn.', 'The difficulty is precisely that language is only half of it.', 'Cái khó chính là ở chỗ ngôn từ chỉ là một nửa.'],
          ['难就难在没有标准答案。', 'Nán jiù nán zài méi yǒu biāo zhǔn dá àn.', 'The hard part is that there is no standard answer.', 'Cái khó nằm ở chỗ không có đáp án chuẩn.'],
          ['问题就出在他没有说明前提。', 'Wèn tí jiù chū zài tā méi yǒu shuō míng qián tí.', 'The problem lies exactly in his not stating the premise.', 'Vấn đề nằm đúng ở chỗ anh ấy không nêu tiền đề.']
        ]
      },
      {
        pattern: '不只是……，也是……',
        explEn: 'Adds a second, usually deeper, function to the first. Both halves take the same kind of phrase.',
        explVi: 'Bổ sung chức năng thứ hai, thường sâu hơn, bên cạnh chức năng đầu. Hai vế nhận cùng loại thành phần.',
        examples: [
          ['不只是关系，也是给对方留空间。', 'Bù zhǐ shì guān xi, yě shì gěi duì fāng liú kōng jiān.', 'Not only the relationship — it also leaves the other side room.', 'Không chỉ là quan hệ, mà còn để chừa khoảng cho đối phương.'],
          ['客气话不只是礼貌，也是一种保留。', 'Kè qi huà bù zhǐ shì lǐ mào, yě shì yì zhǒng bǎo liú.', 'Polite phrases are not only manners but also a form of reservation.', 'Lời khách sáo không chỉ là lễ phép mà còn là một cách dè dặt.'],
          ['沉默不只是不说话，也是一种回答。', 'Chén mò bù zhǐ shì bù shuō huà, yě shì yì zhǒng huí dá.', 'Silence is not merely not speaking; it is also an answer.', 'Im lặng không chỉ là không nói, mà cũng là một câu trả lời.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '"再说吧"到底是什么意思',
        titleEn: 'What "we\'ll see" actually means',
        titleVi: '"Để tính sau" rốt cuộc nghĩa là gì',
        zh: '同一句"再说吧"，可以是真的要以后再谈，也可以是一次不想说破的拒绝。判断的依据不在这三个字里，而在它周围的信息：说话人有没有问细节？他的语气是轻松还是犹豫？这件事本来在他的计划里吗？如果对方既不问时间也不问条件，"再说吧"大多就是结束这个话题的方式。有人认为这种表达不够坦率，可是它在很多场合里承担着实际的功能——它让双方都不必当场做决定，也为以后留下空间。真正的问题不是该不该用间接表达，而是我们能不能读懂它。读不懂的人，会一直等一个永远不会来的答复；读懂的人，则会换一个说法，或者干脆换一个方向。',
        en: 'The same phrase "we\'ll see" can genuinely mean "let us talk later" or can be a refusal nobody wants to spell out. What decides it is not the words but the information around them: did the speaker ask for details? Was the tone relaxed or hesitant? Was the matter ever in their plans? If the other side asks neither about timing nor about terms, "we\'ll see" is most likely a way of closing the topic. Some find such expression insufficiently frank, yet in many settings it performs a real function — it spares both sides from having to commit on the spot and leaves room for later. The real question is not whether indirect expression should be used, but whether we can read it. Those who cannot will wait for a reply that never comes; those who can will rephrase the request, or simply change direction.',
        vi: 'Cùng một câu "để tính sau" có thể thật sự là hẹn bàn lại về sau, mà cũng có thể là một lời từ chối không ai muốn nói toạc. Căn cứ để phán đoán không nằm trong ba chữ ấy mà nằm ở những thông tin xung quanh: người nói có hỏi chi tiết không? Ngữ điệu của họ thoải mái hay ngập ngừng? Việc này vốn có nằm trong kế hoạch của họ không? Nếu đối phương không hỏi thời gian cũng chẳng hỏi điều kiện thì "để tính sau" phần lớn là cách khép lại chủ đề. Có người cho rằng cách nói ấy chưa đủ thẳng thắn, nhưng ở nhiều bối cảnh nó đảm nhận một chức năng thực tế – nó khiến hai bên đều không phải bày tỏ thái độ ngay tại chỗ, đồng thời chừa đường cho về sau. Vấn đề thật sự không phải là có nên dùng lối nói gián tiếp hay không, mà là chúng ta có đọc hiểu được nó hay không. Người không hiểu sẽ cứ chờ một hồi âm chẳng bao giờ đến; người hiểu thì sẽ đổi cách nói, hoặc dứt khoát đổi hướng.',
        questions: [
          { q: '判断"再说吧"的依据在哪里？', qPinyin: 'Pàn duàn "zài shuō ba" de yī jù zài nǎ lǐ?',
            qEn: 'Where does the text locate the basis for judging "we\'ll see"?', qVi: 'Căn cứ để phán đoán câu "để tính sau" nằm ở đâu?',
            options: [['它周围的信息，比如语气和问不问细节', 'thông tin xung quanh, như ngữ điệu và có hỏi chi tiết không'], ['这三个字本身', 'chính ba chữ đó'], ['说话人的身份', 'thân phận của người nói']], correct: 0,
            explEn: '判断的依据不在这三个字里，而在它周围的信息.', explVi: '判断的依据不在这三个字里，而在它周围的信息.' },
          { q: '短文认为间接表达承担了什么功能？', qPinyin: 'Duǎn wén rèn wéi jiàn jiē biǎo dá chéng dān le shén me gōng néng?',
            qEn: 'What function does the text attribute to indirect expression?', qVi: 'Bài đọc cho rằng lối nói gián tiếp đảm nhận chức năng gì?',
            options: [['让双方不必当场做决定，为以后留空间', 'để hai bên khỏi phải quyết ngay, chừa đường về sau'], ['让说话人显得更有能力', 'khiến người nói trông có năng lực hơn'], ['让对话变得更短', 'làm cho cuộc nói chuyện ngắn lại']], correct: 0,
            explEn: '它让双方都不必当场做决定，也为以后留下空间.', explVi: '它让双方都不必当场做决定，也为以后留下空间.' },
          { q: '短文说读懂的人会怎么做？', qPinyin: 'Duǎn wén shuō dú dǒng de rén huì zěn me zuò?',
            qEn: 'What do those who can read it do?', qVi: 'Bài đọc nói người hiểu được sẽ làm gì?',
            options: [['换一个说法或者换一个方向', 'đổi cách nói hoặc đổi hướng'], ['继续等答复', 'tiếp tục chờ hồi âm'], ['直接责问对方', 'gặng hỏi thẳng đối phương']], correct: 0,
            explEn: '读懂的人，则会换一个说法，或者干脆换一个方向.', explVi: '读懂的人，则会换一个说法，或者干脆换一个方向.' }
        ]
      },
      {
        titleZh: '当直接遇上间接',
        titleEn: 'When direct meets indirect',
        titleVi: 'Khi thẳng thắn gặp gián tiếp',
        zh: '在跨文化的团队里，最常见的冲突并不是观点不同，而是表达习惯不同。一方觉得"有话直说"是尊重时间，另一方觉得"把话说满"是不给对方余地；一方把沉默理解成同意，另一方把沉默当作反对。双方都按自己的规则理解对方，结果谁都觉得对方奇怪。解决的办法不是要求谁改变风格，而是把规则说出来。很多国际团队会在项目开始时约定几条：反对要明说，"我再想想"不算同意，重要结论一律写进邮件。这些约定看起来不太自然，可是它把本来藏在语气里的信息搬到了桌面上。等到成员彼此熟悉了，语气和表情才重新变得可靠。',
        en: 'In a cross-cultural team the commonest conflict is not a difference of views but a difference of expressive habits. One side thinks saying it straight respects everyone\'s time; the other thinks stating it flatly leaves no room. One side reads silence as agreement, the other as objection. Both interpret the other by their own rules, and each ends up finding the other strange. The solution is not to demand that someone change style but to say the rules out loud. Many international teams agree on a few at the start of a project: objections must be stated explicitly, "let me think about it" does not count as agreement, and important conclusions always go into an email. Such agreements look stiff, yet they move onto the table the information that used to hide in tone of voice. Only once members know each other well do tone and expression become reliable again.',
        vi: 'Trong một nhóm liên văn hóa, xung đột thường gặp nhất không phải là khác quan điểm mà là khác thói quen diễn đạt. Bên này cho rằng "có gì nói thẳng" là tôn trọng thời gian, bên kia lại thấy "nói cạn lời" là không chừa đường cho đối phương; bên này hiểu im lặng là đồng ý, bên kia coi im lặng là phản đối. Cả hai đều giải mã đối phương theo quy tắc của mình, kết quả là ai cũng thấy bên kia kỳ lạ. Cách giải quyết không phải là bắt ai đó đổi phong cách, mà là nói rõ quy tắc ra. Nhiều nhóm quốc tế khi bắt đầu dự án sẽ thống nhất vài điều: phản đối thì phải nói rõ, "để tôi nghĩ thêm" không tính là đồng ý, kết luận quan trọng nhất loạt phải ghi vào email. Những thỏa thuận ấy nghe có vẻ cứng nhắc, nhưng chúng đưa lên mặt bàn những thông tin vốn ẩn trong ngữ điệu. Đến khi các thành viên đã quen nhau, ngữ điệu và nét mặt mới lại trở nên đáng tin.',
        questions: [
          { q: '短文认为跨文化团队最常见的冲突来自什么？', qPinyin: 'Duǎn wén rèn wéi kuà wén huà tuán duì zuì cháng jiàn de chōng tū lái zì shén me?',
            qEn: 'What does the text say causes most conflict in cross-cultural teams?', qVi: 'Bài đọc cho rằng xung đột thường gặp nhất trong nhóm liên văn hóa đến từ đâu?',
            options: [['表达习惯不同', 'khác thói quen diễn đạt'], ['观点不同', 'khác quan điểm'], ['语言水平不同', 'khác trình độ ngôn ngữ']], correct: 0,
            explEn: '最常见的冲突并不是观点不同，而是表达习惯不同.', explVi: '最常见的冲突并不是观点不同，而是表达习惯不同.' },
          { q: '国际团队约定的规则有什么作用？', qPinyin: 'Guó jì tuán duì yuē dìng de guī zé yǒu shén me zuò yòng?',
            qEn: 'What do the agreed rules accomplish?', qVi: 'Những quy tắc mà nhóm quốc tế thống nhất có tác dụng gì?',
            options: [['把藏在语气里的信息搬到桌面上', 'đưa thông tin ẩn trong ngữ điệu lên mặt bàn'], ['让大家都用同一种语言', 'buộc mọi người dùng chung một ngôn ngữ'], ['减少开会的时间', 'giảm thời gian họp']], correct: 0,
            explEn: '它把本来藏在语气里的信息搬到了桌面上.', explVi: '它把本来藏在语气里的信息搬到了桌面上.' },
          { q: '根据短文，什么时候语气和表情重新变得可靠？', qPinyin: 'Gēn jù duǎn wén, shén me shí hou yǔ qì hé biǎo qíng chóng xīn biàn de kě kào?',
            qEn: 'When do tone and expression become reliable again?', qVi: 'Theo bài đọc, khi nào ngữ điệu và nét mặt lại trở nên đáng tin?',
            options: [['成员彼此熟悉以后', 'sau khi các thành viên đã quen nhau'], ['项目开始的时候', 'lúc dự án bắt đầu'], ['写完邮件以后', 'sau khi viết xong email']], correct: 0,
            explEn: '等到成员彼此熟悉了，语气和表情才重新变得可靠.', explVi: '等到成员彼此熟悉了，语气和表情才重新变得可靠.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '这个方案好___好，就是成本太高。', pinyin: 'Zhè ge fāng àn hǎo ___ hǎo, jiù shì chéng běn tài gāo.',
        options: [['是', 'thì'], ['也', 'cũng'], ['都', 'đều'], ['很', 'rất']], correct: 0,
        explEn: 'The 形容词 + 是 + 形容词 frame concedes the quality before the qualification.', explVi: 'Khung 形容词 + 是 + 形容词 thừa nhận đặc điểm trước khi hạn định.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '难就难___没有标准答案。', pinyin: 'Nán jiù nán ___ méi yǒu biāo zhǔn dá àn.',
        options: [['在', 'ở chỗ'], ['是', 'là'], ['有', 'có'], ['把', 'đem']], correct: 0,
        explEn: '难就难在 + clause points at exactly where the difficulty lies.', explVi: '难就难在 + mệnh đề chỉ đúng chỗ cái khó nằm ở đâu.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：为什么不直接说"我不同意"呢？ B：___', pinyin: 'A: Wèi shén me bù zhí jiē shuō "wǒ bù tóng yì" ne? B: ___',
        options: [['在很多人面前拒绝，对方会觉得没面子。', 'Từ chối trước mặt đông người thì đối phương thấy mất mặt.'], ['这个方案很有意思。', 'Phương án này rất thú vị.'], ['我明天再给你答复。', 'Mai mình trả lời bạn.'], ['他的中文很好。', 'Tiếng Trung của anh ấy rất tốt.']], correct: 0,
        explEn: 'The question asks why not be blunt, so the answer must give the social cost.', explVi: 'Câu hỏi hỏi vì sao không nói thẳng, nên câu trả lời phải nêu cái giá về mặt quan hệ.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第一篇短文，对方既不问时间也不问条件，说明什么？', pinyin: 'Gēn jù dì yī piān duǎn wén, duì fāng jì bú wèn shí jiān yě bú wèn tiáo jiàn, shuō míng shén me?',
        passage: 1, options: [['"再说吧"大多是结束话题的方式', '"để tính sau" phần lớn là cách khép lại chủ đề'], ['他还没想清楚', 'anh ấy chưa nghĩ kỹ'], ['他很忙', 'anh ấy rất bận'], ['他同意了', 'anh ấy đã đồng ý']], correct: 0,
        explEn: '如果对方既不问时间也不问条件，"再说吧"大多就是结束这个话题的方式.', explVi: '如果对方既不问时间也不问条件，"再说吧"大多就是结束这个话题的方式.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，作者认为应该完全不用间接表达。', pinyin: 'Gēn jù dì yī piān duǎn wén, zuò zhě rèn wéi yīng gāi wán quán bú yòng jiàn jiē biǎo dá.',
        isTrue: false, passage: 1,
        explEn: '真正的问题不是该不该用间接表达，而是我们能不能读懂它.', explVi: '真正的问题不是该不该用间接表达，而是我们能不能读懂它.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '沉默 / 不只是 / 不说话 / 也是 / 一种回答', pinyin: 'chén mò / bù zhǐ shì / bù shuō huà / yě shì / yì zhǒng huí dá',
        answer: '沉默不只是不说话，也是一种回答。', answerVi: 'Im lặng không chỉ là không nói, mà cũng là một câu trả lời.',
        options: [['沉默', 'im lặng'], ['不只是', 'không chỉ là'], ['不说话', 'không nói'], ['也是', 'mà cũng là'], ['一种回答', 'một câu trả lời']],
        explEn: '不只是……，也是…… adds the second, deeper reading after the surface one.', explVi: '不只是……，也是…… thêm cách hiểu thứ hai sâu hơn sau cách hiểu bề mặt.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，为什么双方都觉得对方奇怪？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me shuāng fāng dōu jué de duì fāng qí guài?',
        passage: 2, options: [['都按自己的规则理解对方', 'đều hiểu đối phương theo quy tắc của mình'], ['都不愿意开会', 'đều không muốn họp'], ['语言水平差太多', 'trình độ ngôn ngữ chênh quá xa'], ['都不写邮件', 'đều không viết email']], correct: 0,
        explEn: '双方都按自己的规则理解对方，结果谁都觉得对方奇怪.', explVi: '双方都按自己的规则理解对方，结果谁都觉得对方奇怪.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么这些不太自然的约定仍然有价值？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me zhè xiē bú tài zì rán de yuē dìng réng rán yǒu jià zhí?',
        passage: 2, options: [['它让原本靠猜的信息变得可以看见', 'nó biến thông tin vốn phải đoán thành thứ nhìn thấy được'], ['它能减少开会', 'nó giúp bớt họp hành'], ['它让团队更快结束项目', 'nó khiến nhóm kết thúc dự án nhanh hơn'], ['它代替了所有沟通', 'nó thay thế mọi giao tiếp']], correct: 0,
        explEn: 'The rules move into the open what used to hide in tone, which is why the stiffness is worth it.', explVi: 'Quy tắc đưa ra ánh sáng thứ vốn ẩn trong ngữ điệu, nên sự cứng nhắc là đáng giá.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B认为间接表达除了保护关系还有什么作用？', pinyin: 'B rèn wéi jiàn jiē biǎo dá chú le bǎo hù guān xi hái yǒu shén me zuò yòng?',
        line: 10, options: [['给对方留一个改变主意的空间', 'chừa cho đối phương khoảng để đổi ý'], ['让谈话更短', 'làm cuộc nói chuyện ngắn hơn'], ['显得更专业', 'trông chuyên nghiệp hơn'], ['避免写邮件', 'tránh phải viết email']], correct: 0,
        explEn: 'B says: 也是给对方留一个可以改变主意的空间.', explVi: 'B nói: 也是给对方留一个可以改变主意的空间.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B建议跨文化沟通时怎么做？', pinyin: 'B jiàn yì kuà wén huà gōu tōng shí zěn me zuò?',
        line: 12, options: [['在客气之后补一句具体的结论', 'sau phần khách sáo thêm một câu kết luận cụ thể'], ['完全不用客气话', 'bỏ hẳn lời khách sáo'], ['只写下来，不说话', 'chỉ viết ra, không nói'], ['让对方先表态', 'để đối phương bày tỏ trước']], correct: 0,
        explEn: 'B says: 最好在客气之后补一句具体的结论.', explVi: 'B nói: 最好在客气之后补一句具体的结论.' }
    ]
  }
};
