// HSK4 (B2) lessons 05-08. See hsk4-a.mjs for the spec shape and the pinyin conventions.

export default {
  'hsk4-l05-standard-workplace-feedback': {
    titleZh: '工作反馈',
    titleEn: 'Feedback at work',
    titleVi: 'Phản hồi trong công việc',
    summaryEn: 'Before a review meeting, a colleague explains how to take feedback: listen first, ask for a concrete example, disagree politely with reasons, and follow up later.',
    summaryVi: 'Trước buổi trao đổi đánh giá, một đồng nghiệp chỉ cách tiếp nhận phản hồi: nghe trước, xin ví dụ cụ thể, phản đối lịch sự kèm lý do, và trao đổi lại sau.',
    lines: [
      ['A', '要是他说的问题我完全没注意到呢？', 'Yào shi tā shuō de wèn tí wǒ wán quán méi zhù yì dào ne?',
        'What if I had not noticed the problem he mentions at all?',
        'Nếu vấn đề anh ấy nói mà mình hoàn toàn không để ý thì sao?'],
      ['B', '那更要问一个具体的例子，知道是哪件事才好改。', 'Nà gèng yào wèn yí gè jù tǐ de lì zi, zhī dao shì nǎ jiàn shì cái hǎo gǎi.',
        'Then all the more reason to ask for a concrete example — you can only fix it once you know which case it was.',
        'Vậy càng phải hỏi một ví dụ cụ thể, biết là việc nào thì mới sửa được.'],
      ['A', '直接问会不会显得我不接受批评？', 'Zhí jiē wèn huì bu huì xiǎn de wǒ bù jiē shòu pī píng?',
        'Would asking directly make me look like I do not accept criticism?',
        'Hỏi thẳng như vậy có khiến mình có vẻ không tiếp thu phê bình không?'],
      ['B', '不会，认真问问题的人，态度看起来更好。', 'Bú huì, rèn zhēn wèn wèn tí de rén, tài du kàn qǐ lái gèng hǎo.',
        'No — someone who asks serious questions actually looks better, not worse.',
        'Không đâu, người hỏi một cách nghiêm túc trông thái độ còn tốt hơn.'],
      ['A', '谈完以后还要做什么吗？', 'Tán wán yǐ hòu hái yào zuò shén me ma?',
        'Is there anything to do after the conversation?',
        'Nói chuyện xong rồi còn phải làm gì nữa không?'],
      ['B', '把他提到的两三点写下来，过一个月再请他看看有没有进步。', 'Bǎ tā tí dào de liǎng sān diǎn xiě xià lái, guò yí gè yuè zài qǐng tā kàn kan yǒu méi yǒu jìn bù.',
        'Write down the two or three points he raised, and in a month ask him whether he sees any progress.',
        'Ghi lại hai ba điểm anh ấy nêu, một tháng sau nhờ anh ấy xem có tiến bộ không.'],
      ['A', '这样他会知道我真的听进去了。', 'Zhè yàng tā huì zhī dao wǒ zhēn de tīng jìn qù le.',
        'That way he will know I really took it in.',
        'Như vậy anh ấy sẽ biết mình thật sự tiếp thu.'],
      ['B', '对，比当时说一百句"我一定改"更有用。', 'Duì, bǐ dāng shí shuō yì bǎi jù "wǒ yí dìng gǎi" gèng yǒu yòng.',
        'Exactly — that is more useful than saying "I will definitely change" a hundred times on the spot.',
        'Đúng vậy, hữu ích hơn là lúc đó nói cả trăm câu "mình nhất định sẽ sửa".']
    ],
    allowAbove: ['反馈'],
    vocab: [['反馈', 'fǎn kuì'], ['经理', 'jīng lǐ'], ['批评', 'pī píng'], ['建议', 'jiàn yì'], ['改进', 'gǎi jìn'],
      ['礼貌', 'lǐ mào'], ['具体', 'jù tǐ'], ['例子', 'lì zi'], ['说服', 'shuō fú'], ['接受', 'jiē shòu'],
      ['态度', 'tài du'], ['承认', 'chéng rèn'], ['表现', 'biǎo xiàn'], ['进步', 'jìn bù'], ['紧张', 'jǐn zhāng'],
      ['理解', 'lǐ jiě'], ['交流', 'jiāo liú']],
    grammar: [
      {
        pattern: '显得 + 形容词',
        explEn: 'Says how something looks to others, not how it is. 显得 is always followed by a description, never by a noun.',
        explVi: 'Nói về việc trông ra sao trong mắt người khác, không phải bản chất. Sau 显得 luôn là từ miêu tả, không phải danh từ.',
        examples: [
          ['直接问会显得我不接受批评吗？', 'Zhí jiē wèn huì xiǎn de wǒ bù jiē shòu pī píng ma?', 'Will asking directly make me look unwilling to accept criticism?', 'Hỏi thẳng có khiến mình có vẻ không tiếp thu phê bình không?'],
          ['他今天显得特别紧张。', 'Tā jīn tiān xiǎn de tè bié jǐn zhāng.', 'He looks especially nervous today.', 'Hôm nay anh ấy trông đặc biệt căng thẳng.'],
          ['没有例子的意见显得很空。', 'Méi yǒu lì zi de yì jiàn xiǎn de hěn kōng.', 'An opinion without examples comes across as empty.', 'Ý kiến không có ví dụ nghe rất sáo rỗng.']
        ]
      },
      {
        pattern: '动词 + 进去 / 出来 (听进去)',
        explEn: 'A directional complement used figuratively: 听进去 means advice actually got in, 说出来 means a thought came out.',
        explVi: 'Bổ ngữ chỉ hướng dùng theo nghĩa bóng: 听进去 là lời khuyên thật sự lọt vào, 说出来 là ý nghĩ được nói ra.',
        examples: [
          ['他会知道我真的听进去了。', 'Tā huì zhī dao wǒ zhēn de tīng jìn qù le.', 'He will know I really took it in.', 'Anh ấy sẽ biết mình thật sự tiếp thu.'],
          ['有意见就说出来，别放在心里。', 'Yǒu yì jiàn jiù shuō chū lái, bié fàng zài xīn lǐ.', 'If you have an opinion, say it — do not keep it inside.', 'Có ý kiến thì nói ra, đừng để trong lòng.'],
          ['这些建议他一句也没听进去。', 'Zhè xiē jiàn yì tā yí jù yě méi tīng jìn qù.', 'He did not take in a single one of these suggestions.', 'Những lời khuyên này anh ấy không tiếp thu câu nào.']
        ]
      },
      {
        pattern: '比 + A + 更 + 形容词',
        explEn: 'Compares two things when both already have the quality. Without 更 the sentence is a plain comparison; 更 stresses that A is high too.',
        explVi: 'So sánh hai đối tượng khi cả hai đều có đặc điểm đó. Không có 更 thì là so sánh thường; 更 nhấn rằng A cũng đã cao.',
        examples: [
          ['写下来比当时说一百句更有用。', 'Xiě xià lái bǐ dāng shí shuō yì bǎi jù gèng yǒu yòng.', 'Writing it down is more useful than saying a hundred sentences on the spot.', 'Ghi lại còn hữu ích hơn lúc đó nói cả trăm câu.'],
          ['具体的例子比长篇的解释更清楚。', 'Jù tǐ de lì zi bǐ cháng piān de jiě shì gèng qīng chu.', 'A concrete example is clearer than a long explanation.', 'Ví dụ cụ thể rõ hơn lời giải thích dài dòng.'],
          ['他的态度比过去更认真了。', 'Tā de tài du bǐ guò qù gèng rèn zhēn le.', 'His attitude is more serious than before.', 'Thái độ của anh ấy nghiêm túc hơn trước.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '批评为什么这么难听',
        titleEn: 'Why criticism is so hard to hear',
        titleVi: 'Vì sao lời phê bình khó nghe đến vậy',
        zh: '听到别人指出自己的问题，第一反应几乎都是不舒服。这很正常：我们常常把"我做的事"和"我这个人"放在一起，所以别人说事情做得不好，我们听成的却是"你不行"。想把这两件事分开，可以在心里加一个问题：他说的是我哪一次的做法？只要能想起具体的一次，感觉马上会变，因为一次做法是可以改的，而"我这个人"改不了。另外，接受批评不等于同意每句话。你可以先谢谢对方愿意说，回去以后再判断哪些有道理、哪些不适合自己的情况。真正让人进步的，从来不是听着舒服的话，而是那些当时不太好听、以后却用得上的意见。',
        en: 'Hearing someone point out your faults feels bad almost every time. That is normal: we tend to fuse "what I did" with "who I am", so when someone says a piece of work was poor, what we hear is "you are no good". To pull the two apart, add a question in your head: which occasion is he talking about? The moment you can recall a specific instance the feeling changes, because a single piece of work can be changed while "who I am" cannot. Also, accepting criticism is not the same as agreeing with every sentence. You can thank the person for being willing to speak, then decide afterwards which parts hold and which do not fit your situation. What actually makes people better has never been the comfortable remarks, but the ones that sting at the time and prove useful later.',
        vi: 'Nghe người khác chỉ ra khuyết điểm của mình, phản ứng đầu tiên hầu như luôn là khó chịu. Điều đó rất bình thường: chúng ta hay gộp "việc tôi làm" với "con người tôi", nên người ta nói việc làm chưa tốt mà ta lại nghe thành "bạn không được". Muốn tách hai điều đó ra, hãy tự thêm một câu hỏi trong đầu: anh ấy đang nói về lần làm nào của mình? Chỉ cần nhớ ra được một lần cụ thể, cảm giác sẽ khác ngay, vì một lần làm thì sửa được, còn "con người tôi" thì không đổi được. Ngoài ra, tiếp thu phê bình không có nghĩa là đồng ý với từng câu. Bạn có thể cảm ơn người ta đã chịu nói, về rồi hãy xét xem điều nào có lý, điều nào không hợp hoàn cảnh của mình. Thứ thật sự giúp người ta tiến bộ xưa nay chưa bao giờ là lời nghe êm tai, mà là những ý kiến lúc đó hơi khó nghe nhưng về sau lại dùng được.',
        questions: [
          { q: '短文说我们为什么容易把批评听成"你不行"？', qPinyin: 'Duǎn wén shuō wǒ men wèi shén me róng yì bǎ pī píng tīng chéng "nǐ bù xíng"?',
            qEn: 'Why, according to the text, do we hear criticism as "you are no good"?', qVi: 'Theo bài đọc, vì sao ta dễ nghe lời phê bình thành "bạn không được"?',
            options: [['把"我做的事"和"我这个人"放在一起', 'gộp "việc tôi làm" với "con người tôi"'], ['因为对方说得太快', 'vì người kia nói quá nhanh'], ['因为批评总是不对的', 'vì phê bình luôn sai']], correct: 0,
            explEn: '我们常常把"我做的事"和"我这个人"放在一起.', explVi: '我们常常把"我做的事"和"我这个人"放在一起.' },
          { q: '短文建议在心里加哪个问题？', qPinyin: 'Duǎn wén jiàn yì zài xīn lǐ jiā nǎ ge wèn tí?',
            qEn: 'What question does the text suggest adding in your head?', qVi: 'Bài đọc khuyên tự thêm câu hỏi nào trong đầu?',
            options: [['他说的是我哪一次的做法', 'anh ấy đang nói về lần làm nào của mình'], ['他为什么不喜欢我', 'vì sao anh ấy không thích mình'], ['我要不要换工作', 'mình có nên đổi việc không']], correct: 0,
            explEn: '可以在心里加一个问题：他说的是我哪一次的做法？', explVi: '可以在心里加一个问题：他说的是我哪一次的做法？' },
          { q: '根据短文，什么样的意见真正让人进步？', qPinyin: 'Gēn jù duǎn wén, shén me yàng de yì jiàn zhēn zhèng ràng rén jìn bù?',
            qEn: 'What kind of feedback does the text say really helps?', qVi: 'Theo bài đọc, loại ý kiến nào mới thật sự giúp tiến bộ?',
            options: [['当时不好听、以后用得上的', 'lúc đó khó nghe nhưng sau lại dùng được'], ['听着舒服的话', 'lời nghe êm tai'], ['所有人都同意的话', 'lời mà ai cũng đồng ý']], correct: 0,
            explEn: '不是听着舒服的话，而是那些当时不太好听、以后却用得上的意见.', explVi: '不是听着舒服的话，而是那些当时不太好听、以后却用得上的意见.' }
        ]
      },
      {
        titleZh: '怎么给别人提意见',
        titleEn: 'How to give someone feedback',
        titleVi: 'Cách góp ý cho người khác',
        zh: '给别人提意见，比接受意见更需要技术。第一，说事不说人：不要说"你太粗心"，而要说"上周的表格里有三个数字写错了"。前一句是判断，后一句是事实，事实才能讨论。第二，选对时间和地方：在很多人面前提问题，对方大多只会想着怎么保护自己，什么也听不进去。第三，先问后说：问一句"你觉得这次做得怎么样"，常常会发现对方早就知道问题在哪里，你要做的只是帮他说清楚。最后，意见要能落在行动上。"下次注意"没有用，"下次交给我以前先自己检查一遍数字"才有用。提意见的目的不是让对方难受，而是让下一次更顺利。',
        en: 'Giving feedback takes more skill than receiving it. First, talk about the work, not the person: not "you are careless" but "three figures in last week\'s form were wrong". The first is a judgement, the second a fact — and only facts can be discussed. Second, choose the time and place: raise a problem in front of a crowd and the other person will mostly be busy defending themselves and take nothing in. Third, ask before you tell: a single "how do you think it went?" often reveals that they already know where the problem is, and your job is only to help them say it. Finally, feedback has to land on an action. "Be careful next time" is useless; "next time check the figures yourself before handing it over" is not. The point of feedback is not to make someone feel bad but to make the next round go smoothly.',
        vi: 'Góp ý cho người khác còn cần kỹ thuật hơn là tiếp nhận góp ý. Thứ nhất, nói việc chứ đừng nói người: đừng nói "bạn quá cẩu thả", mà nói "trong biểu mẫu tuần trước có ba con số bị ghi sai". Câu trước là phán xét, câu sau là sự thật, mà chỉ sự thật mới bàn được. Thứ hai, chọn đúng thời điểm và nơi chốn: nêu vấn đề trước mặt đông người thì đối phương phần lớn chỉ nghĩ cách tự bảo vệ, chẳng tiếp thu được gì. Thứ ba, hỏi trước rồi hãy nói: chỉ một câu "bạn thấy lần này làm thế nào" thường sẽ cho thấy đối phương đã biết vấn đề nằm ở đâu, việc của bạn chỉ là giúp họ nói rõ ra. Cuối cùng, góp ý phải rơi được vào hành động. "Lần sau chú ý" thì vô ích; "lần sau trước khi giao cho mình thì tự kiểm tra lại các con số" mới có ích. Mục đích của góp ý không phải làm đối phương khó chịu, mà là để lần sau thuận lợi hơn.',
        questions: [
          { q: '短文认为"你太粗心"这句话的问题是什么？', qPinyin: 'Duǎn wén rèn wéi "nǐ tài cū xīn" zhè jù huà de wèn tí shì shén me?',
            qEn: 'What is wrong with saying "you are careless"?', qVi: 'Bài đọc cho rằng câu "bạn quá cẩu thả" có vấn đề gì?',
            options: [['是判断，不是可以讨论的事实', 'là phán xét, không phải sự thật có thể bàn'], ['太长了', 'quá dài'], ['不够礼貌但很准确', 'không lịch sự nhưng rất chính xác']], correct: 0,
            explEn: '前一句是判断，后一句是事实，事实才能讨论.', explVi: '前一句是判断，后一句是事实，事实才能讨论.' },
          { q: '为什么不要在很多人面前提问题？', qPinyin: 'Wèi shén me bú yào zài hěn duō rén miàn qián tí wèn tí?',
            qEn: 'Why should you not raise a problem in front of a crowd?', qVi: 'Vì sao không nên nêu vấn đề trước mặt đông người?',
            options: [['对方只想保护自己，听不进去', 'đối phương chỉ lo tự bảo vệ, không tiếp thu được'], ['别人会记住这件事', 'người khác sẽ nhớ chuyện này'], ['会花更多时间', 'sẽ tốn nhiều thời gian hơn']], correct: 0,
            explEn: '对方大多只会想着怎么保护自己，什么也听不进去.', explVi: '对方大多只会想着怎么保护自己，什么也听不进去.' },
          { q: '根据短文，好的意见应该是什么样的？', qPinyin: 'Gēn jù duǎn wén, hǎo de yì jiàn yīng gāi shì shén me yàng de?',
            qEn: 'What does good feedback look like, according to the text?', qVi: 'Theo bài đọc, một góp ý tốt phải như thế nào?',
            options: [['能落在具体的行动上', 'rơi được vào hành động cụ thể'], ['越短越好', 'càng ngắn càng tốt'], ['让对方记住教训', 'khiến đối phương nhớ bài học']], correct: 0,
            explEn: '意见要能落在行动上…"下次交给我以前先自己检查一遍数字"才有用.', explVi: '意见要能落在行动上…"下次交给我以前先自己检查一遍数字"才有用.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '他今天___特别紧张。', pinyin: 'Tā jīn tiān ___ tè bié jǐn zhāng.',
        options: [['显得', 'trông có vẻ'], ['觉得', 'cảm thấy'], ['记得', 'nhớ'], ['值得', 'đáng']], correct: 0,
        explEn: '显得 describes how someone looks to others; 觉得 would describe his own feeling.', explVi: '显得 nói về vẻ ngoài trong mắt người khác; 觉得 lại nói cảm nhận của chính anh ấy.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '这些建议他一句也没听___。', pinyin: 'Zhè xiē jiàn yì tā yí jù yě méi tīng ___.',
        options: [['进去', 'vào'], ['出来', 'ra'], ['起来', 'lên'], ['下去', 'xuống']], correct: 0,
        explEn: '听进去 is the figurative "take in"; 听出来 would mean detecting something in what was said.', explVi: '听进去 nghĩa bóng là "tiếp thu"; 听出来 lại là nhận ra điều gì đó qua lời nói.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：要是他说的问题我完全没注意到呢？ B：___', pinyin: 'A: Yào shi tā shuō de wèn tí wǒ wán quán méi zhù yì dào ne? B: ___',
        options: [['那更要问一个具体的例子。', 'Vậy càng phải hỏi một ví dụ cụ thể.'], ['那就别去开会了。', 'Vậy thì đừng đi họp nữa.'], ['他的态度很好。', 'Thái độ của anh ấy rất tốt.'], ['下个月再说吧。', 'Tháng sau hãy nói.']], correct: 0,
        explEn: 'If you did not notice the problem, the useful next step is to ask which case it was.', explVi: 'Nếu chưa để ý thấy vấn đề, bước hữu ích tiếp theo là hỏi đó là trường hợp nào.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据短文，"上周的表格里有三个数字写错了"属于什么？', pinyin: 'Gēn jù duǎn wén, "shàng zhōu de biǎo gé lǐ yǒu sān gè shù zì xiě cuò le" shǔ yú shén me?',
        passage: 2, options: [['事实', 'sự thật'], ['判断', 'phán xét'], ['建议', 'lời khuyên'], ['批评一个人', 'phê bình con người']], correct: 0,
        explEn: 'The text contrasts 判断 ("you are careless") with 事实 (the three wrong figures).', explVi: 'Bài đọc đối lập 判断 ("bạn cẩu thả") với 事实 (ba con số sai).' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据短文，接受批评就是同意对方说的每句话。', pinyin: 'Gēn jù duǎn wén, jiē shòu pī píng jiù shì tóng yì duì fāng shuō de měi jù huà.',
        isTrue: false, passage: 1,
        explEn: '接受批评不等于同意每句话 — you still judge afterwards which parts fit.', explVi: '接受批评不等于同意每句话 – sau đó bạn vẫn tự xét điều nào phù hợp.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '写下来 / 比 / 当时说一百句 / 更 / 有用', pinyin: 'xiě xià lái / bǐ / dāng shí shuō yì bǎi jù / gèng / yǒu yòng',
        answer: '写下来比当时说一百句更有用。', answerVi: 'Ghi lại còn hữu ích hơn lúc đó nói cả trăm câu.',
        options: [['写下来', 'ghi lại'], ['比', 'hơn'], ['当时说一百句', 'lúc đó nói cả trăm câu'], ['更', 'càng'], ['有用', 'hữu ích']],
        explEn: 'In a 比 sentence the order is A + 比 + B + 更 + adjective.', explVi: 'Trong câu 比, trật tự là A + 比 + B + 更 + tính từ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，想起具体的一次为什么会让感觉变好？', pinyin: 'Gēn jù dì yī piān duǎn wén, xiǎng qǐ jù tǐ de yí cì wèi shén me huì ràng gǎn jué biàn hǎo?',
        passage: 1, options: [['一次做法可以改，"我这个人"改不了', 'một lần làm thì sửa được, "con người tôi" thì không'], ['因为可以忘记这件事', 'vì có thể quên chuyện đó'], ['因为对方会道歉', 'vì đối phương sẽ xin lỗi'], ['因为问题会自己消失', 'vì vấn đề sẽ tự biến mất']], correct: 0,
        explEn: '因为一次做法是可以改的，而"我这个人"改不了.', explVi: '因为一次做法是可以改的，而"我这个人"改不了.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么"下次注意"没有用？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me "xià cì zhù yì" méi yǒu yòng?',
        passage: 2, options: [['它没有说出具体要做什么', 'nó không nói rõ cụ thể phải làm gì'], ['它太不礼貌', 'nó quá bất lịch sự'], ['它说得太长', 'nó nói quá dài'], ['它只能用一次', 'nó chỉ dùng được một lần']], correct: 0,
        explEn: 'The text demands feedback that 落在行动上, and contrasts it with the concrete instruction that follows.', explVi: 'Bài đọc đòi góp ý phải 落在行动上, và đối chiếu với chỉ dẫn cụ thể ngay sau đó.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议谈完以后做什么？', pinyin: 'B jiàn yì tán wán yǐ hòu zuò shén me?',
        line: 12, options: [['把两三点写下来，过一个月再请他看看', 'ghi lại hai ba điểm, một tháng sau nhờ anh ấy xem'], ['马上换一个部门', 'đổi bộ phận ngay'], ['当时多说几句', 'lúc đó nói thêm vài câu'], ['请同事一起吃饭', 'mời đồng nghiệp đi ăn']], correct: 0,
        explEn: 'B says: 把他提到的两三点写下来，过一个月再请他看看有没有进步.', explVi: 'B nói: 把他提到的两三点写下来，过一个月再请他看看有没有进步.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么认为认真问问题不会显得不接受批评？', pinyin: 'B wèi shén me rèn wéi rèn zhēn wèn wèn tí bú huì xiǎn de bù jiē shòu pī píng?',
        line: 10, options: [['认真问问题的人态度看起来更好', 'người hỏi nghiêm túc thì thái độ trông còn tốt hơn'], ['因为经理不会注意', 'vì quản lý sẽ không để ý'], ['因为问题不重要', 'vì vấn đề không quan trọng'], ['因为大家都这样做', 'vì ai cũng làm vậy']], correct: 0,
        explEn: 'B says: 认真问问题的人，态度看起来更好.', explVi: 'B nói: 认真问问题的人，态度看起来更好.' }
    ]
  },

  'hsk4-l06-standard-consumer-choice': {
    titleZh: '消费选择',
    titleEn: 'Making a purchase',
    titleVi: 'Lựa chọn khi mua sắm',
    summaryEn: 'Two shoppers compare brands: ignore the ads, read real reviews, judge price against how long it lasts, and wait a day before buying.',
    summaryVi: 'Hai người mua sắm so sánh thương hiệu: bỏ qua quảng cáo, đọc đánh giá thật, xét giá theo độ bền, và chờ một ngày trước khi mua.',
    lines: [
      ['A', '评价里说好的和说坏的都有，我该信哪个？', 'Píng jià lǐ shuō hǎo de hé shuō huài de dōu yǒu, wǒ gāi xìn nǎ ge?',
        'The reviews include both good and bad ones — which should I believe?',
        'Đánh giá có cả khen lẫn chê, mình nên tin cái nào?'],
      ['B', '看说坏的那些是不是都在说一个问题，如果是，那就要小心了。', 'Kàn shuō huài de nà xiē shì bu shì dōu zài shuō yí gè wèn tí, rú guǒ shì, nà jiù yào xiǎo xīn le.',
        'See whether the negative ones all point to the same problem; if they do, be careful.',
        'Xem những đánh giá chê có cùng một vấn đề không, nếu có thì phải cẩn thận.'],
      ['A', '打折的时候是不是应该马上买？', 'Dǎ zhé de shí hou shì bu shì yīng gāi mǎ shàng mǎi?',
        'When something is on sale, should I buy it right away?',
        'Lúc giảm giá thì có nên mua ngay không?'],
      ['B', '先问自己：不打折我会不会买？如果不会，那就不是需要，是便宜。', 'Xiān wèn zì jǐ: bù dǎ zhé wǒ huì bu huì mǎi? Rú guǒ bú huì, nà jiù bú shì xū yào, shì pián yi.',
        'Ask yourself first: would I buy it at full price? If not, it is not a need — it is just cheap.',
        'Trước hết tự hỏi: không giảm giá thì mình có mua không? Nếu không thì đó không phải nhu cầu, chỉ là rẻ.'],
      ['A', '我常常买完就后悔。', 'Wǒ cháng cháng mǎi wán jiù hòu huǐ.',
        'I often regret a purchase right after making it.',
        'Mình hay mua xong là hối hận.'],
      ['B', '那就放进购物车等一天，第二天还想要再买。', 'Nà jiù fàng jìn gòu wù chē děng yì tiān, dì èr tiān hái xiǎng yào zài mǎi.',
        'Then put it in the cart and wait a day; buy it only if you still want it the next day.',
        'Vậy thì cho vào giỏ hàng chờ một ngày, hôm sau vẫn muốn thì hãy mua.'],
      ['A', '这个办法能少花不少钱吧？', 'Zhè ge bàn fǎ néng shǎo huā bù shǎo qián ba?',
        'That method must save quite a lot of money.',
        'Cách này chắc tiết kiệm được không ít tiền nhỉ?'],
      ['B', '少花钱还是其次，主要是家里少了很多用不上的东西。', 'Shǎo huā qián hái shi qí cì, zhǔ yào shì jiā lǐ shǎo le hěn duō yòng bu shàng de dōng xi.',
        'Saving money is secondary — mainly the house ends up with far fewer things you never use.',
        'Tiết kiệm tiền chỉ là thứ yếu, chủ yếu là trong nhà bớt đi nhiều thứ không dùng đến.']
    ],
    vocab: [['广告', 'guǎng gào'], ['功能', 'gōng néng'], ['评价', 'píng jià'], ['质量', 'zhì liàng'], ['适合', 'shì hé'],
      ['价格', 'jià gé'], ['后悔', 'hòu huǐ'], ['打折', 'dǎ zhé'], ['值得', 'zhí de'], ['选择', 'xuǎn zé'],
      ['需要', 'xū yào'], ['商店', 'shāng diàn'], ['服务', 'fú wù'], ['使用', 'shǐ yòng'], ['比较', 'bǐ jiào'],
      ['判断', 'pàn duàn'], ['经验', 'jīng yàn']],
    grammar: [
      {
        pattern: '动词 + 得 / 不 + 上 (用不上)',
        explEn: 'Whether something can be put to use or reached. 用得上 = will come in handy; 用不上 = will never be used.',
        explVi: 'Chỉ việc có dùng tới được hay không. 用得上 = có lúc dùng tới; 用不上 = chẳng dùng tới.',
        examples: [
          ['家里少了很多用不上的东西。', 'Jiā lǐ shǎo le hěn duō yòng bu shàng de dōng xi.', 'The house has far fewer things that never get used.', 'Trong nhà bớt đi nhiều thứ chẳng dùng tới.'],
          ['这个功能我一年也用不上一次。', 'Zhè ge gōng néng wǒ yì nián yě yòng bu shàng yí cì.', 'I do not use this feature even once a year.', 'Chức năng này một năm mình cũng không dùng tới một lần.'],
          ['多学一门外语，将来一定用得上。', 'Duō xué yì mén wài yǔ, jiāng lái yí dìng yòng de shàng.', 'Learning another language will certainly come in handy.', 'Học thêm một ngoại ngữ, sau này chắc chắn dùng tới.']
        ]
      },
      {
        pattern: '不是……，而是……',
        explEn: 'Corrects a wrong assumption and supplies the right one. 而是 is required — 但是 would only add a contrast.',
        explVi: 'Bác bỏ giả định sai và đưa ra điều đúng. Bắt buộc dùng 而是 – 但是 chỉ nêu sự tương phản.',
        examples: [
          ['那就不是需要，而是便宜。', 'Nà jiù bú shì xū yào, ér shì pián yi.', 'That is not a need but a bargain.', 'Đó không phải nhu cầu, mà là món rẻ.'],
          ['问题不是价格，而是质量。', 'Wèn tí bú shì jià gé, ér shì zhì liàng.', 'The problem is not the price but the quality.', 'Vấn đề không phải giá cả mà là chất lượng.'],
          ['他买的不是功能，而是广告里的感觉。', 'Tā mǎi de bú shì gōng néng, ér shì guǎng gào lǐ de gǎn jué.', 'What he bought was not the feature but the feeling in the advert.', 'Thứ anh ấy mua không phải chức năng, mà là cảm giác trong quảng cáo.']
        ]
      },
      {
        pattern: '是不是……？',
        explEn: 'Asks for confirmation of something the speaker already suspects. It is softer than 吗 and expects agreement.',
        explVi: 'Hỏi để xác nhận điều người nói đã đoán. Nhẹ hơn 吗 và thường mong được đồng ý.',
        examples: [
          ['打折的时候是不是应该马上买？', 'Dǎ zhé de shí hou shì bu shì yīng gāi mǎ shàng mǎi?', 'Should you buy straight away when there is a sale?', 'Lúc giảm giá thì có nên mua ngay không?'],
          ['你是不是已经买过一个了？', 'Nǐ shì bu shì yǐ jīng mǎi guo yí gè le?', 'Have you not already bought one?', 'Bạn đã mua một cái rồi phải không?'],
          ['贵的是不是质量一定更好？', 'Guì de shì bu shì zhì liàng yí dìng gèng hǎo?', 'Does the expensive one necessarily have better quality?', 'Đồ đắt thì chất lượng nhất định tốt hơn phải không?']
        ]
      }
    ],
    passages: [
      {
        titleZh: '广告在卖什么',
        titleEn: 'What an advert is selling',
        titleVi: 'Quảng cáo đang bán gì',
        zh: '一则好的广告很少直接说产品有什么功能，它更愿意让你看见一种生活：干净的房间、笑着的家人、清早的阳光。你记住的是那种感觉，然后把感觉和产品放在了一起。这样做没有错，可是它确实让判断变难了，因为感觉没办法比较，而功能和价格可以。有一个简单的办法能把注意力拉回来：看完广告以后，用一句简单的话写下这个东西到底能替你做什么。如果写不出来，或者写出来的是"让我看起来更成功"，那就先别买。真正需要的东西通常很容易说清楚：能装下我的电脑、能用三年、坏了附近有地方修。',
        en: 'A good advert rarely tells you outright what a product does; it would rather let you see a life: a clean room, a smiling family, early morning light. What you remember is the feeling, and then you attach that feeling to the product. This is not lying, but it genuinely makes judgement harder, because feelings cannot be compared while features and prices can. There is a simple way to pull your attention back: after watching the advert, write in one sentence what this thing will actually do for you. If you cannot write it, or what you write is "make me look more successful", then do not buy it yet. What you genuinely need is usually easy to state: it holds my laptop, it will last three years, and there is somewhere nearby to repair it.',
        vi: 'Một quảng cáo hay hiếm khi nói thẳng sản phẩm có chức năng gì, nó thích cho bạn thấy một kiểu sống hơn: căn phòng sạch sẽ, người nhà đang cười, ánh nắng sớm mai. Thứ bạn nhớ là cảm giác đó, rồi bạn gắn cảm giác ấy với sản phẩm. Đây không phải lừa dối, nhưng nó thật sự khiến việc phán đoán khó hơn, vì cảm giác thì không so sánh được, còn chức năng và giá cả thì có. Có một cách đơn giản để kéo sự chú ý trở lại: xem quảng cáo xong, hãy viết một câu về việc món đồ này rốt cuộc làm được gì cho bạn. Nếu viết không ra, hoặc viết ra là "khiến mình trông thành đạt hơn", thì khoan hãy mua. Thứ thật sự cần thường rất dễ nói rõ: đựng vừa máy tính của mình, dùng được ba năm, hỏng thì gần đây có chỗ sửa.',
        questions: [
          { q: '短文说好的广告更愿意让你看见什么？', qPinyin: 'Duǎn wén shuō hǎo de guǎng gào gèng yuàn yì ràng nǐ kàn jiàn shén me?',
            qEn: 'What does the text say a good advert prefers to show you?', qVi: 'Bài đọc nói quảng cáo hay thích cho bạn thấy điều gì hơn?',
            options: [['一种生活和感觉', 'một kiểu sống và cảm giác'], ['产品的价格', 'giá của sản phẩm'], ['产品的所有功能', 'mọi chức năng của sản phẩm']], correct: 0,
            explEn: '它更愿意让你看见一种生活…你记住的是那种感觉.', explVi: '它更愿意让你看见一种生活…你记住的是那种感觉.' },
          { q: '为什么感觉会让判断变难？', qPinyin: 'Wèi shén me gǎn jué huì ràng pàn duàn biàn nán?',
            qEn: 'Why do feelings make judgement harder?', qVi: 'Vì sao cảm giác làm việc phán đoán khó hơn?',
            options: [['感觉没办法比较，功能和价格可以', 'cảm giác không so sánh được, còn chức năng và giá thì có'], ['感觉总是错的', 'cảm giác luôn sai'], ['因为广告都不能相信', 'vì quảng cáo đều không thể tin']], correct: 0,
            explEn: '因为感觉没办法比较，而功能和价格可以.', explVi: '因为感觉没办法比较，而功能和价格可以.' },
          { q: '短文建议看完广告以后做什么？', qPinyin: 'Duǎn wén jiàn yì kàn wán guǎng gào yǐ hòu zuò shén me?',
            qEn: 'What does the text suggest doing after watching an advert?', qVi: 'Bài đọc khuyên sau khi xem quảng cáo thì làm gì?',
            options: [['用一句简单的话写下它能替你做什么', 'viết một câu đơn giản về việc nó làm được gì cho bạn'], ['马上比较三家商店', 'so sánh ngay ba cửa hàng'], ['问朋友的意见', 'hỏi ý kiến bạn bè']], correct: 0,
            explEn: '看完广告以后，用一句简单的话写下这个东西到底能替你做什么.', explVi: '看完广告以后，用一句简单的话写下这个东西到底能替你做什么.' }
        ]
      },
      {
        titleZh: '便宜和值得',
        titleEn: 'Cheap versus worth it',
        titleVi: 'Rẻ và đáng tiền',
        zh: '很多人以为"便宜"和"值得"是一件事，其实两者常常相反。一双八十块的鞋穿三个月就坏了，一双三百块的鞋穿三年，第二双每个月的费用只有第一双的三分之一。所以看价格的时候，最好再看一个数字：它能用多久。当然，这个办法不是让人什么都买贵的。有些东西本来就用不了几次，比如出去玩儿一次才用的工具，那就买便宜的甚至借一个。判断的关键是用得多还是用得少：用得多的东西值得花钱，比如床、鞋和每天要用的电脑；用得少的东西，便宜就够了。另外，售后服务也应该算进价格里——同样的产品，附近能修的那个，其实更便宜。',
        en: 'Many people treat "cheap" and "worth it" as one thing, when they are often opposites. A pair of eighty-yuan shoes falls apart in three months; a three-hundred-yuan pair lasts three years, so the monthly cost of the second is a third of the first. When you look at the price, then, look at one more number: how long it will last. Of course, this is not an argument for always buying the expensive one. Some things will only be used a handful of times — a tool you need on one trip, say — and there the cheap version, or a borrowed one, is right. The deciding factor is frequency of use: things used often deserve money, like a bed, shoes, and the computer you use daily; things used rarely only need to be cheap. Repair service belongs in the price too: of two identical products, the one that can be fixed nearby is actually cheaper.',
        vi: 'Nhiều người coi "rẻ" và "đáng tiền" là một, thật ra hai điều đó thường ngược nhau. Một đôi giày tám mươi tệ đi ba tháng đã hỏng, một đôi ba trăm tệ đi được ba năm, thì chi phí mỗi tháng của đôi sau chỉ bằng một phần ba đôi trước. Vậy nên khi nhìn giá, tốt nhất hãy nhìn thêm một con số nữa: nó dùng được bao lâu. Dĩ nhiên, cách này không phải để khuyên cái gì cũng mua đắt. Có những thứ vốn chẳng dùng được mấy lần, ví dụ dụng cụ chỉ dùng khi đi chơi một chuyến, thì cứ mua loại rẻ hoặc mượn một cái. Mấu chốt của việc phán đoán là số lần sử dụng: thứ dùng nhiều thì đáng bỏ tiền, như giường, giày và máy tính dùng hằng ngày; thứ dùng ít thì rẻ là đủ. Ngoài ra, dịch vụ sau bán hàng cũng nên tính vào giá – cùng một sản phẩm, cái nào gần đây sửa được thì thật ra rẻ hơn.',
        questions: [
          { q: '短文用鞋的例子说明什么？', qPinyin: 'Duǎn wén yòng xié de lì zi shuō míng shén me?',
            qEn: 'What does the shoe example illustrate?', qVi: 'Ví dụ về đôi giày minh họa điều gì?',
            options: [['便宜的东西不一定值得', 'đồ rẻ chưa chắc đã đáng tiền'], ['贵的东西都更好', 'đồ đắt đều tốt hơn'], ['鞋应该每年换一次', 'giày nên đổi mỗi năm một lần']], correct: 0,
            explEn: 'The cheaper pair costs three times as much per month once its short life is counted.', explVi: 'Tính theo tuổi thọ ngắn thì đôi rẻ lại tốn gấp ba mỗi tháng.' },
          { q: '短文说判断的关键是什么？', qPinyin: 'Duǎn wén shuō pàn duàn de guān jiàn shì shén me?',
            qEn: 'What does the text call the deciding factor?', qVi: 'Bài đọc nói mấu chốt phán đoán là gì?',
            options: [['东西用得多还是用得少', 'đồ dùng nhiều hay dùng ít'], ['商店的广告', 'quảng cáo của cửa hàng'], ['广告好不好看', 'quảng cáo đẹp hay không']], correct: 0,
            explEn: '判断的关键是用得多还是用得少.', explVi: '判断的关键是用得多还是用得少.' },
          { q: '为什么附近能修的产品"其实更便宜"？', qPinyin: 'Wèi shén me fù jìn néng xiū de chǎn pǐn "qí shí gèng pián yi"?',
            qEn: 'Why is a product that can be repaired nearby "actually cheaper"?', qVi: 'Vì sao sản phẩm gần đây sửa được lại "thật ra rẻ hơn"?',
            options: [['售后服务也应该算进价格里', 'dịch vụ sau bán hàng cũng phải tính vào giá'], ['因为它的广告少', 'vì nó ít quảng cáo'], ['因为它质量一定更好', 'vì chất lượng nhất định tốt hơn']], correct: 0,
            explEn: '售后服务也应该算进价格里——同样的产品，附近能修的那个，其实更便宜.', explVi: '售后服务也应该算进价格里——同样的产品，附近能修的那个，其实更便宜.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '这个功能我一年也用___上一次。', pinyin: 'Zhè ge gōng néng wǒ yì nián yě yòng ___ shàng yí cì.',
        options: [['不', 'không'], ['得', 'được'], ['了', 'rồi'], ['着', 'đang']], correct: 0,
        explEn: '用不上 says the thing never gets used; 用得上 would say the opposite.', explVi: '用不上 nghĩa là chẳng dùng tới; 用得上 mang nghĩa ngược lại.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '那就不是需要，___便宜。', pinyin: 'Nà jiù bú shì xū yào, ___ pián yi.',
        options: [['而是', 'mà là'], ['但是', 'nhưng'], ['因为', 'bởi vì'], ['所以', 'cho nên']], correct: 0,
        explEn: '不是……，而是…… replaces the wrong idea with the right one; 但是 only adds a contrast.', explVi: '不是……，而是…… thay ý sai bằng ý đúng; 但是 chỉ thêm sự tương phản.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：我常常买完就后悔。 B：___', pinyin: 'A: Wǒ cháng cháng mǎi wán jiù hòu huǐ. B: ___',
        options: [['那就放进购物车等一天。', 'Vậy thì cho vào giỏ hàng chờ một ngày.'], ['这个牌子很有名。', 'Thương hiệu này rất nổi tiếng.'], ['广告拍得很好看。', 'Quảng cáo quay rất đẹp.'], ['商店就在附近。', 'Cửa hàng ở ngay gần đây.']], correct: 0,
        explEn: 'The complaint is about impulse buying, so the answer must offer a way to slow down.', explVi: 'Vấn đề là mua theo cảm hứng, nên câu trả lời phải đưa ra cách trì hoãn.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '"不打折我会不会买？"这个问题是用来判断什么的？', pinyin: '"Bù dǎ zhé wǒ huì bu huì mǎi?" zhè ge wèn tí shì yòng lái pàn duàn shén me de?',
        options: [['是真的需要还是只因为便宜', 'thật sự cần hay chỉ vì rẻ'], ['产品的质量好不好', 'chất lượng sản phẩm tốt không'], ['商店的服务怎么样', 'dịch vụ cửa hàng thế nào'], ['价格是不是最低', 'giá có thấp nhất không']], correct: 0,
        explEn: 'B uses the question to separate a genuine need from the attraction of a discount.', explVi: 'B dùng câu hỏi này để tách nhu cầu thật khỏi sức hút của việc giảm giá.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据短文，什么东西都应该买贵的。', pinyin: 'Gēn jù duǎn wén, shén me dōng xi dōu yīng gāi mǎi guì de.',
        isTrue: false, passage: 2,
        explEn: 'The text says things used rarely only need to be cheap: 用得少的东西，便宜就够了.', explVi: 'Bài đọc nói thứ ít dùng thì rẻ là đủ: 用得少的东西，便宜就够了.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '问题 / 不是 / 价格 / 而是 / 质量', pinyin: 'wèn tí / bú shì / jià gé / ér shì / zhì liàng',
        answer: '问题不是价格，而是质量。', answerVi: 'Vấn đề không phải giá cả mà là chất lượng.',
        options: [['问题', 'vấn đề'], ['不是', 'không phải'], ['价格', 'giá cả'], ['而是', 'mà là'], ['质量', 'chất lượng']],
        explEn: 'The rejected idea comes after 不是 and the correct one after 而是.', explVi: 'Ý bị bác bỏ đứng sau 不是, ý đúng đứng sau 而是.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，写不出这个东西能做什么的时候应该怎么办？', pinyin: 'Gēn jù dì yī piān duǎn wén, xiě bu chū zhè ge dōng xi néng zuò shén me de shí hou yīng gāi zěn me bàn?',
        passage: 1, options: [['先别买', 'khoan hãy mua'], ['再看一次广告', 'xem lại quảng cáo lần nữa'], ['问商店的人', 'hỏi người bán hàng'], ['买便宜的那个', 'mua cái rẻ hơn']], correct: 0,
        explEn: '如果写不出来…那就先别买.', explVi: '如果写不出来…那就先别买.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，哪种东西最值得花钱？', pinyin: 'Gēn jù dì èr piān duǎn wén, nǎ zhǒng dōng xi zuì zhí de huā qián?',
        passage: 2, options: [['每天都要用的东西', 'thứ ngày nào cũng dùng'], ['最新出的东西', 'thứ mới ra nhất'], ['广告最多的东西', 'thứ quảng cáo nhiều nhất'], ['打折最多的东西', 'thứ giảm giá nhiều nhất']], correct: 0,
        explEn: '用得多的东西值得花钱，比如床、鞋和每天要用的电脑.', explVi: '用得多的东西值得花钱，比如床、鞋和每天要用的电脑.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B说评价里说坏话的应该怎么看？', pinyin: 'B shuō píng jià lǐ shuō huài huà de yīng gāi zěn me kàn?',
        line: 8, options: [['看是不是都在说一个问题', 'xem có phải đều nói về một vấn đề không'], ['完全不用看', 'khỏi cần xem'], ['只看最新的', 'chỉ xem cái mới nhất'], ['只看最长的', 'chỉ xem cái dài nhất']], correct: 0,
        explEn: 'B says: 看说坏的那些是不是都在说一个问题.', explVi: 'B nói: 看说坏的那些是不是都在说一个问题.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为等一天再买最主要的好处是什么？', pinyin: 'B rèn wéi děng yì tiān zài mǎi zuì zhǔ yào de hǎo chù shì shén me?',
        line: 14, options: [['家里少了很多用不上的东西', 'trong nhà bớt nhiều thứ không dùng đến'], ['可以等到打折', 'có thể chờ đến lúc giảm giá'], ['能买到质量更好的', 'mua được đồ chất lượng hơn'], ['商店会送东西', 'cửa hàng sẽ tặng quà']], correct: 0,
        explEn: 'B says 少花钱还是其次，主要是家里少了很多用不上的东西.', explVi: 'B nói 少花钱还是其次，主要是家里少了很多用不上的东西.' }
    ]
  }
};
