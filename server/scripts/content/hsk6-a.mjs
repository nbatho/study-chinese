// HSK6 (C2) lessons 01-02. Spec shape as in hsk4-a.mjs. HSK6 runs longer than HSK5:
// ten continuation lines (6+10=16), 20 headwords, and eleven exercises of which two are
// `create` — see todo.md §3 for the bloom distribution this level uses.

export default {
  'hsk6-l01-standard-classical-allusion': {
    titleZh: '用典',
    titleEn: 'Using allusions',
    titleVi: 'Dùng điển cố',
    summaryEn: 'Reading an allusion you do not know, why so many have quietly entered everyday speech, and the one question that decides whether to use one in your own writing.',
    summaryVi: 'Đọc một điển cố mình không biết, vì sao nhiều điển cố đã lặng lẽ đi vào lời nói hằng ngày, và câu hỏi quyết định có nên dùng nó khi mình viết.',
    lines: [
      ['A', '那不知道来历的时候，怎么办？', 'Nà bù zhī dào lái lì de shí hou, zěn me bàn?',
        'And when you do not know where it comes from?',
        'Vậy lúc không biết xuất xứ thì làm sao?'],
      ['B', '先看上下文，作者用它是想说好还是想说不好。', 'Xiān kàn shàng xià wén, zuò zhě yòng tā shì xiǎng shuō hǎo hái shi xiǎng shuō bù hǎo.',
        'Look at the context first: is the writer using it to praise or to criticise?',
        'Trước hết xem ngữ cảnh: tác giả dùng nó để khen hay để chê.'],
      ['A', '光靠上下文够吗？', 'Guāng kào shàng xià wén gòu ma?',
        'Is context alone enough?',
        'Chỉ dựa vào ngữ cảnh có đủ không?'],
      ['B', '够判断方向，细节再去查也不迟。', 'Gòu pàn duàn fāng xiàng, xì jié zài qù chá yě bù chí.',
        'Enough to judge the direction; looking the details up afterwards is not too late.',
        'Đủ để đoán hướng, chi tiết tra sau cũng chưa muộn.'],
      ['A', '现在还有必要学这些吗？', 'Xiàn zài hái yǒu bì yào xué zhè xiē ma?',
        'Is there still any need to learn these?',
        'Bây giờ còn cần học những cái này không?'],
      ['B', '有，很多说法已经进了日常语言，你不知道来历也在用。', 'Yǒu, hěn duō shuō fǎ yǐ jīng jìn le rì cháng yǔ yán, nǐ bù zhī dào lái lì yě zài yòng.',
        'Yes — many have entered everyday language, and you use them without knowing their origin.',
        'Có, nhiều cách nói đã đi vào ngôn ngữ hằng ngày, bạn không biết xuất xứ vẫn đang dùng.'],
      ['A', '比如呢？', 'Bǐ rú ne?',
        'Such as?',
        'Ví dụ như?'],
      ['B', '比如"守株待兔"，谁都会用，可是原来的故事很多人说不上来。', 'Bǐ rú "shǒu zhū dài tù", shéi dōu huì yòng, kě shì yuán lái de gù shi hěn duō rén shuō bu shàng lái.',
        'Like "waiting by a tree for a rabbit" — everyone uses it, yet few can tell you the original story.',
        'Như "ôm cây đợi thỏ", ai cũng dùng được, nhưng câu chuyện gốc thì nhiều người không kể nổi.'],
      ['A', '那写文章的时候，我该不该用？', 'Nà xiě wén zhāng de shí hou, wǒ gāi bu gāi yòng?',
        'So when I write, should I use them?',
        'Vậy khi viết bài mình có nên dùng không?'],
      ['B', '看读者是谁：读者不熟悉的典故，用了就等于没写。', 'Kàn dú zhě shì shéi: dú zhě bù shú xī de diǎn gù, yòng le jiù děng yú méi xiě.',
        'It depends who is reading: an allusion your reader does not know is the same as writing nothing.',
        'Tuỳ người đọc là ai: điển cố người đọc không quen thì dùng cũng như không viết.']
    ],
    vocab: [['典故', 'diǎn gù'], ['背景', 'bèi jǐng'], ['引用', 'yǐn yòng'], ['历史', 'lì shǐ'], ['文学', 'wén xué'],
      ['表达', 'biǎo dá'], ['含义', 'hán yì'], ['深刻', 'shēn kè'], ['恰当', 'qià dàng'], ['传统', 'chuán tǒng'],
      ['经典', 'jīng diǎn'], ['故事', 'gù shi'], ['理解', 'lǐ jiě'], ['联想', 'lián xiǎng'], ['常识', 'cháng shí'],
      ['修养', 'xiū yǎng'], ['来历', 'lái lì'], ['表面', 'biǎo miàn'], ['通俗', 'tōng sú'], ['深度', 'shēn dù']],
    grammar: [
      {
        pattern: '所谓……，指的是……',
        explEn: 'Defines a term that has just been used. 所谓 quotes the label without endorsing it, and 指的是 supplies the content; the pair belongs to written explanation.',
        explVi: 'Định nghĩa một thuật ngữ vừa được dùng. 所谓 nhắc lại cái tên mà không tán thành nó, còn 指的是 nêu nội dung; cặp này thuộc văn viết giải thích.',
        examples: [
          ['所谓典故，指的是借历史或文学里的故事来表达意思。', 'Suǒ wèi diǎn gù, zhǐ de shì jiè lì shǐ huò wén xué lǐ de gù shi lái biǎo dá yì si.', 'An allusion means borrowing a story from history or literature to express a meaning.', 'Cái gọi là điển cố là mượn câu chuyện trong lịch sử hay văn học để diễn đạt ý.'],
          ['所谓常识，指的是不必解释就能共用的知识。', 'Suǒ wèi cháng shí, zhǐ de shì bú bì jiě shì jiù néng gòng yòng de zhī shi.', 'Common knowledge means knowledge shared without needing explanation.', 'Cái gọi là thường thức là kiến thức không cần giải thích mà vẫn dùng chung được.'],
          ['所谓修养，指的不是读过多少书，而是怎么对待别人。', 'Suǒ wèi xiū yǎng, zhǐ de bú shì dú guo duō shǎo shū, ér shì zěn me duì dài bié ren.', 'Cultivation means not how many books you have read but how you treat others.', 'Cái gọi là tu dưỡng không phải đọc bao nhiêu sách, mà là đối xử với người khác thế nào.']
        ]
      },
      {
        pattern: '借……来 + 动词',
        explEn: 'Names the thing used as a vehicle for saying something else. 借 takes the borrowed material and 来 links it to the purpose that follows.',
        explVi: 'Nêu thứ được mượn làm phương tiện để nói điều khác. 借 dẫn ra chất liệu được mượn, 来 nối nó với mục đích phía sau.',
        examples: [
          ['典故是借历史里的故事，来表达更深的意思。', 'Diǎn gù shì jiè lì shǐ lǐ de gù shi, lái biǎo dá gèng shēn de yì si.', 'An allusion borrows a story from history to express a deeper meaning.', 'Điển cố là mượn chuyện trong lịch sử để diễn đạt ý sâu hơn.'],
          ['他借一个旧故事来说今天的事。', 'Tā jiè yí gè jiù gù shi lái shuō jīn tiān de shì.', 'He uses an old story to speak about today.', 'Anh ấy mượn một câu chuyện cũ để nói chuyện hôm nay.'],
          ['作者借这个人物来表达自己的看法。', 'Zuò zhě jiè zhè ge rén wù lái biǎo dá zì jǐ de kàn fǎ.', 'The author uses this character to express his own view.', 'Tác giả mượn nhân vật này để bày tỏ quan điểm của mình.']
        ]
      },
      {
        pattern: '表面上……，实际上……',
        explEn: 'Separates what a text appears to say from what it does. The two halves must describe the same object, and the second carries the writer\'s real claim.',
        explVi: 'Tách điều một văn bản có vẻ nói ra khỏi điều nó thật sự làm. Hai vế phải nói về cùng một đối tượng, vế sau mang luận điểm thật của người viết.',
        examples: [
          ['表面上他在讲古人，实际上说的是今天。', 'Biǎo miàn shàng tā zài jiǎng gǔ rén, shí jì shàng shuō de shì jīn tiān.', 'On the surface he is discussing the ancients; in fact he is speaking of today.', 'Bề ngoài anh ấy đang nói người xưa, thực chất là nói hôm nay.'],
          ['表面上是一句客气话，实际上是拒绝。', 'Biǎo miàn shàng shì yí jù kè qi huà, shí jì shàng shì jù jué.', 'On the surface a courtesy, in fact a refusal.', 'Bề ngoài là một câu khách sáo, thực chất là lời từ chối.'],
          ['这个典故表面上很通俗，实际上有深度。', 'Zhè ge diǎn gù biǎo miàn shàng hěn tōng sú, shí jì shàng yǒu shēn dù.', 'This allusion looks plain on the surface but has depth.', 'Điển cố này bề ngoài rất bình dân, thực chất có chiều sâu.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '四个字装下一个故事',
        titleEn: 'A story packed into four characters',
        titleVi: 'Bốn chữ chứa cả một câu chuyện',
        zh: '典故最实在的作用是省字。"守株待兔"四个字，背后是一整个关于运气和懒惰的故事；说话的人不必把故事讲一遍，听的人也不必听完，双方在一瞬间就共用了同一个判断。这种效率不是凭空来的，它靠的是一批共同读过的书。所以典故其实是一种共同背景的证明：能听懂，说明我们在同一个传统里长大。麻烦也从这里开始——共同的部分正在变小。今天的读者来自不同的教育、不同的语言，你以为是常识的东西，对方可能第一次听到。于是同一个典故，在一群人那里是省字，在另一群人那里是障碍。判断该不该用，其实是在判断你和读者共用的那部分还剩多少。',
        en: 'The most practical function of an allusion is economy. The four characters of "waiting by a tree for a rabbit" carry behind them a whole story about luck and laziness; the speaker need not retell it and the listener need not sit through it, yet in an instant both share the same judgement. That efficiency does not come from nowhere: it rests on a body of books read in common. An allusion is therefore a proof of shared background — understanding it shows we grew up inside the same tradition. And that is exactly where the trouble starts, because the shared part is shrinking. Today\'s readers come from different educations and different languages, and what you take for common knowledge they may be hearing for the first time. The same allusion is economy to one group and an obstacle to another. Deciding whether to use one is really deciding how much of that shared ground is left.',
        vi: 'Tác dụng thiết thực nhất của điển cố là tiết kiệm chữ. Bốn chữ "ôm cây đợi thỏ" phía sau là nguyên một câu chuyện về may rủi và lười biếng; người nói không cần kể lại, người nghe cũng không cần nghe hết, mà trong khoảnh khắc cả hai đã dùng chung một phán đoán. Hiệu quả ấy không tự dưng mà có, nó dựa vào một số sách mà mọi người cùng đọc. Vì vậy điển cố thực ra là bằng chứng của một nền tảng chung: nghe hiểu được nghĩa là chúng ta lớn lên trong cùng một truyền thống. Rắc rối cũng bắt đầu từ đây — phần chung đang nhỏ dần. Người đọc hôm nay đến từ những nền giáo dục khác nhau, những ngôn ngữ khác nhau, thứ bạn tưởng là thường thức thì với họ có thể là lần đầu nghe thấy. Thế là cùng một điển cố, với nhóm này là tiết kiệm chữ, với nhóm kia lại là chướng ngại. Phán đoán có nên dùng hay không, thực chất là phán đoán phần chung giữa bạn và người đọc còn lại bao nhiêu.',
        questions: [
          { q: '短文说典故最实在的作用是什么？', qPinyin: 'Duǎn wén shuō diǎn gù zuì shí zài de zuò yòng shì shén me?',
            qEn: 'What is an allusion\'s most practical function?', qVi: 'Bài đọc nói tác dụng thiết thực nhất của điển cố là gì?',
            options: [['省字', 'tiết kiệm chữ'], ['显示修养', 'thể hiện tu dưỡng'], ['让文章好听', 'làm bài viết nghe hay']], correct: 0,
            explEn: '典故最实在的作用是省字.', explVi: '典故最实在的作用是省字.' },
          { q: '这种效率靠的是什么？', qPinyin: 'Zhè zhǒng xiào lǜ kào de shì shén me?',
            qEn: 'What does that efficiency rest on?', qVi: 'Hiệu quả ấy dựa vào cái gì?',
            options: [['一批共同读过的书', 'một số sách mà mọi người cùng đọc'], ['作者的名气', 'danh tiếng của tác giả'], ['文章的长度', 'độ dài bài viết']], correct: 0,
            explEn: '它靠的是一批共同读过的书.', explVi: '它靠的是一批共同读过的书.' },
          { q: '为什么同一个典故对不同的人作用相反？', qPinyin: 'Wèi shén me tóng yí gè diǎn gù duì bù tóng de rén zuò yòng xiāng fǎn?',
            qEn: 'Why does one allusion work oppositely for different readers?', qVi: 'Vì sao cùng một điển cố lại có tác dụng ngược nhau với các nhóm người?',
            options: [['共同的部分正在变小，有人第一次听到', 'phần chung đang nhỏ dần, có người lần đầu nghe thấy'], ['因为有人读得快有人读得慢', 'vì có người đọc nhanh có người đọc chậm'], ['因为典故本身在变', 'vì bản thân điển cố đang thay đổi']], correct: 0,
            explEn: '共同的部分正在变小……在一群人那里是省字，在另一群人那里是障碍.', explVi: '共同的部分正在变小……在一群人那里是省字，在另一群人那里是障碍.' }
        ]
      },
      {
        titleZh: '用了等于没写',
        titleEn: 'Used but not written',
        titleVi: 'Dùng cũng như không viết',
        zh: '一个典故要真的起作用，读者必须在读到它的一瞬间就想起背后的故事。想不起来，这句话在他眼里就只剩下几个字，你想说的那层意思整个丢掉了——用了等于没写。所以写文章的人真正要判断的不是这个典故好不好，而是这批读者认不认得。有三种处理办法。第一种是不用，换成直接的说法，损失一点味道，换来所有人都读懂。第二种是用，但在后半句把意思补出来，让不认得的人也跟得上，代价是句子变长。第三种是只在写给熟悉的读者时用，比如同行之间的文章。三种都可以，唯独不可以的是明知读者不懂还照用不误，然后责怪读者没有修养。写作是把意思送到对方那里，不是摆出自己读过什么。',
        en: 'For an allusion to work, the reader must recall the story behind it the instant they meet it. If nothing comes, the sentence is just a few characters to them and the layer of meaning you intended is lost entirely — used, but not written. What a writer must judge is therefore not whether the allusion is good but whether this particular readership will recognise it. There are three ways to handle it. First, drop it and say the thing directly: some flavour is lost, but everyone follows. Second, keep it and unpack the sense in the second half of the sentence, so those who do not know it can keep up, at the cost of a longer sentence. Third, use it only when writing for readers who share the background, as between colleagues in a field. All three are legitimate; the one thing that is not is using it regardless, knowing the reader will not follow, and then blaming the reader for lacking cultivation. Writing is delivering meaning to someone, not displaying what you have read.',
        vi: 'Muốn một điển cố thật sự phát huy tác dụng thì người đọc phải nhớ ra câu chuyện phía sau ngay khoảnh khắc gặp nó. Không nhớ ra thì câu ấy trong mắt họ chỉ còn mấy chữ, tầng ý bạn muốn nói mất sạch — dùng cũng như không viết. Vì vậy điều người viết thật sự phải cân nhắc không phải là điển cố này hay hay dở, mà là lớp người đọc này có nhận ra nó không. Có ba cách xử lý. Cách thứ nhất là không dùng, đổi sang cách nói trực tiếp, mất đi một chút dư vị nhưng đổi lại ai cũng hiểu. Cách thứ hai là vẫn dùng, nhưng ở nửa câu sau bổ sung ý ra, để người không biết vẫn theo kịp, cái giá là câu dài thêm. Cách thứ ba là chỉ dùng khi viết cho người đọc quen thuộc, chẳng hạn bài viết giữa những người cùng nghề. Cả ba cách đều được, chỉ có một điều không được: biết rõ người đọc không hiểu mà vẫn cứ dùng, rồi trách người đọc thiếu tu dưỡng. Viết là đưa ý đến chỗ người khác, không phải bày ra mình đã đọc những gì.',
        questions: [
          { q: '读者想不起背后的故事会怎么样？', qPinyin: 'Dú zhě xiǎng bu qǐ bèi hòu de gù shi huì zěn me yàng?',
            qEn: 'What happens if the reader cannot recall the story?', qVi: 'Người đọc không nhớ ra câu chuyện phía sau thì sao?',
            options: [['那层意思整个丢掉，用了等于没写', 'tầng ý đó mất sạch, dùng cũng như không viết'], ['他会去查资料', 'họ sẽ đi tra tài liệu'], ['句子会显得更深', 'câu văn sẽ có vẻ sâu hơn']], correct: 0,
            explEn: '你想说的那层意思整个丢掉了——用了等于没写.', explVi: '你想说的那层意思整个丢掉了——用了等于没写.' },
          { q: '第二种办法的代价是什么？', qPinyin: 'Dì èr zhǒng bàn fǎ de dài jià shì shén me?',
            qEn: 'What does the second approach cost?', qVi: 'Cái giá của cách thứ hai là gì?',
            options: [['句子变长', 'câu dài thêm'], ['意思变浅', 'ý nông đi'], ['读者变少', 'người đọc ít đi']], correct: 0,
            explEn: '在后半句把意思补出来……代价是句子变长.', explVi: '在后半句把意思补出来……代价是句子变长.' },
          { q: '短文认为唯独不可以的做法是什么？', qPinyin: 'Duǎn wén rèn wéi wéi dú bù kě yǐ de zuò fǎ shì shén me?',
            qEn: 'Which approach does the text rule out?', qVi: 'Bài đọc cho rằng cách nào là không được phép?',
            options: [['明知读者不懂还照用，然后责怪读者', 'biết người đọc không hiểu vẫn cứ dùng rồi trách người đọc'], ['换成直接的说法', 'đổi sang cách nói trực tiếp'], ['只写给同行看', 'chỉ viết cho người cùng nghề']], correct: 0,
            explEn: '唯独不可以的是明知读者不懂还照用不误，然后责怪读者没有修养.', explVi: '唯独不可以的是明知读者不懂还照用不误，然后责怪读者没有修养.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___典故，___借历史或文学里的故事来表达意思。', pinyin: '___ diǎn gù, ___ jiè lì shǐ huò wén xué lǐ de gù shi lái biǎo dá yì si.',
        options: [['所谓……指的是', 'cái gọi là… là'], ['因为……所以', 'vì… nên'], ['虽然……但是', 'tuy… nhưng'], ['不但……而且', 'không những… mà còn']], correct: 0,
        explEn: '所谓 quotes the term and 指的是 supplies its content.', explVi: '所谓 nhắc lại thuật ngữ, 指的是 nêu nội dung của nó.' },
      { kind: 'fillBlank', bloom: 'analyze', prompt: '___他在讲古人，___说的是今天。', pinyin: '___ tā zài jiǎng gǔ rén, ___ shuō de shì jīn tiān.',
        options: [['表面上……实际上', 'bề ngoài… thực chất'], ['一方面……另一方面', 'một mặt… mặt khác'], ['既然……就', 'đã… thì'], ['与其……不如', 'thay vì… chi bằng']], correct: 0,
        explEn: 'The two halves describe the same act, and 实际上 carries the real claim.', explVi: 'Hai vế nói về cùng một việc, 实际上 mang luận điểm thật.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那不知道来历的时候，怎么办？ B：___', pinyin: 'A: Nà bù zhī dào lái lì de shí hou, zěn me bàn? B: ___',
        options: [['先看上下文，作者用它是想说好还是想说不好。', 'Xem ngữ cảnh trước: tác giả dùng nó để khen hay để chê.'], ['那就别读了。', 'Vậy thì đừng đọc nữa.'], ['典故都很old。', 'Điển cố đều rất cũ.'], ['我最近很忙。', 'Dạo này mình rất bận.']], correct: 0,
        explEn: 'The question asks what to do without the source, so the answer must give a reading strategy.', explVi: 'Câu hỏi hỏi làm gì khi không biết xuất xứ, nên câu trả lời phải nêu cách đọc.' },
      { kind: 'multipleChoice', bloom: 'evaluate', prompt: '根据第二篇短文，作者会怎么评价"读者没有修养"这个说法？', pinyin: 'Gēn jù dì èr piān duǎn wén, zuò zhě huì zěn me píng jià "dú zhě méi yǒu xiū yǎng" zhè ge shuō fǎ?',
        passage: 2, options: [['把写作的责任推给了读者', 'đẩy trách nhiệm của việc viết sang người đọc'], ['说得很有道理', 'nói rất có lý'], ['只适用于短文章', 'chỉ đúng với bài ngắn'], ['说明典故太难', 'cho thấy điển cố quá khó']], correct: 0,
        explEn: '写作是把意思送到对方那里，不是摆出自己读过什么.', explVi: '写作是把意思送到对方那里，不是摆出自己读过什么.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，一个典故对所有读者的作用都一样。', pinyin: 'Gēn jù dì yī piān duǎn wén, yí gè diǎn gù duì suǒ yǒu dú zhě de zuò yòng dōu yí yàng.',
        isTrue: false, passage: 1,
        explEn: '同一个典故，在一群人那里是省字，在另一群人那里是障碍.', explVi: '同一个典故，在一群人那里是省字，在另一群人那里是障碍.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '作者 / 借 / 这个人物 / 来 / 表达自己的看法', pinyin: 'zuò zhě / jiè / zhè ge rén wù / lái / biǎo dá zì jǐ de kàn fǎ',
        answer: '作者借这个人物来表达自己的看法。', answerVi: 'Tác giả mượn nhân vật này để bày tỏ quan điểm của mình.',
        options: [['作者', 'tác giả'], ['借', 'mượn'], ['这个人物', 'nhân vật này'], ['来', 'để'], ['表达自己的看法', 'bày tỏ quan điểm của mình']],
        explEn: '借 takes the borrowed material and 来 links it to the purpose.', explVi: '借 dẫn ra chất liệu được mượn, 来 nối nó với mục đích.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '这个典故 / 表面上 / 很通俗 / 实际上 / 有深度', pinyin: 'zhè ge diǎn gù / biǎo miàn shàng / hěn tōng sú / shí jì shàng / yǒu shēn dù',
        answer: '这个典故表面上很通俗，实际上有深度。', answerVi: 'Điển cố này bề ngoài rất bình dân, thực chất có chiều sâu.',
        options: [['这个典故', 'điển cố này'], ['表面上', 'bề ngoài'], ['很通俗', 'rất bình dân'], ['实际上', 'thực chất'], ['有深度', 'có chiều sâu']],
        explEn: 'The topic comes first, then the surface reading, then what is really the case.', explVi: 'Chủ đề nêu trước, rồi đến cách hiểu bề ngoài, sau cùng là thực chất.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么说典故是共同背景的证明？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me shuō diǎn gù shì gòng tóng bèi jǐng de zhèng míng?',
        passage: 1, options: [['能听懂说明双方在同一个传统里长大', 'nghe hiểu được nghĩa là hai bên lớn lên trong cùng truyền thống'], ['因为它出自历史书', 'vì nó xuất phát từ sách sử'], ['因为它只有四个字', 'vì nó chỉ có bốn chữ'], ['因为大家都爱用', 'vì ai cũng thích dùng']], correct: 0,
        explEn: '能听懂，说明我们在同一个传统里长大.', explVi: '能听懂，说明我们在同一个传统里长大.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，写作者真正要判断的是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, xiě zuò zhě zhēn zhèng yào pàn duàn de shì shén me?',
        passage: 2, options: [['这批读者认不认得这个典故', 'lớp người đọc này có nhận ra điển cố đó không'], ['这个典故好不好', 'điển cố này hay hay dở'], ['文章有多长', 'bài viết dài bao nhiêu'], ['自己读过多少书', 'mình đã đọc bao nhiêu sách']], correct: 0,
        explEn: '真正要判断的不是这个典故好不好，而是这批读者认不认得.', explVi: '真正要判断的不是这个典故好不好，而是这批读者认不认得.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B举"守株待兔"是为了说明什么？', pinyin: 'B jǔ "shǒu zhū dài tù" shì wèi le shuō míng shén me?',
        line: 14, options: [['很多典故已经进了日常语言，用的人不知道来历', 'nhiều điển cố đã vào ngôn ngữ hằng ngày, người dùng không biết xuất xứ'], ['这个故事特别有名', 'câu chuyện này đặc biệt nổi tiếng'], ['古代人很懒', 'người xưa rất lười'], ['典故都很难懂', 'điển cố đều rất khó hiểu']], correct: 0,
        explEn: 'B says: 谁都会用，可是原来的故事很多人说不上来 — the point is everyday use without knowing the origin.', explVi: 'B nói: 谁都会用，可是原来的故事很多人说不上来 — ý là dùng hằng ngày mà không biết xuất xứ.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为该不该用典故取决于什么？', pinyin: 'B rèn wéi gāi bu gāi yòng diǎn gù qǔ jué yú shén me?',
        line: 16, options: [['读者是谁，读者不熟悉就等于没写', 'người đọc là ai, người đọc không quen thì như không viết'], ['典故有多经典', 'điển cố kinh điển đến đâu'], ['文章有多正式', 'bài viết trang trọng đến đâu'], ['自己喜不喜欢', 'bản thân có thích không']], correct: 0,
        explEn: 'B says: 看读者是谁：读者不熟悉的典故，用了就等于没写.', explVi: 'B nói: 看读者是谁：读者不熟悉的典故，用了就等于没写.' }
    ]
  },

  'hsk6-l02-standard-rhetoric': {
    titleZh: '修辞的分量',
    titleEn: 'The weight of rhetoric',
    titleVi: 'Sức nặng của tu từ',
    summaryEn: 'Testing a metaphor by how fast it lands, why a beautiful figure can stop the reader short of the point, and the division of labour between rhetoric and evidence.',
    summaryVi: 'Thử một phép ví bằng tốc độ nó đến được với người đọc, vì sao hình ảnh đẹp lại chặn người đọc trước luận điểm, và sự phân vai giữa tu từ và bằng chứng.',
    lines: [
      ['A', '那怎么判断一个比喻用得好不好？', 'Nà zěn me pàn duàn yí gè bǐ yù yòng de hǎo bu hǎo?',
        'So how do you judge whether a metaphor works?',
        'Vậy đánh giá một phép ví dùng hay hay dở thế nào?'],
      ['B', '看它有没有让人更快地明白，而不是更慢。', 'Kàn tā yǒu méi yǒu ràng rén gèng kuài de míng bai, ér bú shì gèng màn.',
        'See whether it makes people understand faster, not slower.',
        'Xem nó có làm người ta hiểu nhanh hơn không, chứ không phải chậm hơn.'],
      ['A', '有些比喻很漂亮，可是想半天才懂。', 'Yǒu xiē bǐ yù hěn piào liang, kě shì xiǎng bàn tiān cái dǒng.',
        'Some metaphors are lovely but take ages to work out.',
        'Có những phép ví rất đẹp nhưng nghĩ mãi mới hiểu.'],
      ['B', '那多半是为了漂亮而漂亮；它之所以失败，是因为读者停在了修辞上。', 'Nà duō bàn shì wèi le piào liang ér piào liang; tā zhī suǒ yǐ shī bài, shì yīn wèi dú zhě tíng zài le xiū cí shàng.',
        'That is usually beauty for beauty\'s sake; it fails because the reader stops at the rhetoric.',
        'Đó phần nhiều là đẹp vì đẹp; nó thất bại là vì người đọc dừng lại ở phần tu từ.'],
      ['A', '重复会不会显得啰嗦？', 'Chóng fù huì bu huì xiǎn de luō suo?',
        'Does repetition come across as long-winded?',
        'Lặp lại có bị thành dài dòng không?'],
      ['B', '重复的是句子的形式，变化的是内容，这样才有力量。', 'Chóng fù de shì jù zi de xíng shì, biàn huà de shì nèi róng, zhè yàng cái yǒu lì liàng.',
        'What repeats is the shape of the sentence; what changes is the content — that is where the force comes from.',
        'Cái lặp lại là hình thức của câu, cái thay đổi là nội dung, như vậy mới có sức mạnh.'],
      ['A', '朴素的说法就没有修辞吗？', 'Pǔ sù de shuō fǎ jiù méi yǒu xiū cí ma?',
        'Does plain phrasing have no rhetoric at all?',
        'Cách nói mộc mạc thì không có tu từ à?'],
      ['B', '也有，选择不加形容词，本身就是一种手法。', 'Yě yǒu, xuǎn zé bù jiā xíng róng cí, běn shēn jiù shì yì zhǒng shǒu fǎ.',
        'It does — choosing to add no adjectives is itself a device.',
        'Cũng có, chọn không thêm tính từ bản thân nó đã là một thủ pháp.'],
      ['A', '那修辞和事实的关系呢？', 'Nà xiū cí hé shì shí de guān xi ne?',
        'And how do rhetoric and fact relate?',
        'Vậy quan hệ giữa tu từ và sự thật thì sao?'],
      ['B', '修辞负责让人听进去，事实负责让人留下来。', 'Xiū cí fù zé ràng rén tīng jìn qù, shì shí fù zé ràng rén liú xià lái.',
        'Rhetoric gets people to listen; fact makes them stay.',
        'Tu từ lo cho người ta chịu nghe, sự thật lo cho người ta ở lại.']
    ],
    vocab: [['修辞', 'xiū cí'], ['比喻', 'bǐ yù'], ['支撑', 'zhī chēng'], ['力量', 'lì liàng'], ['观点', 'guān diǎn'],
      ['语言', 'yǔ yán'], ['生动', 'shēng dòng'], ['强调', 'qiáng diào'], ['节奏', 'jié zòu'], ['重复', 'chóng fù'],
      ['感染', 'gǎn rǎn'], ['说服', 'shuō fú'], ['效果', 'xiào guǒ'], ['手法', 'shǒu fǎ'], ['华丽', 'huá lì'],
      ['朴素', 'pǔ sù'], ['精确', 'jīng què'], ['打动', 'dǎ dòng'], ['对比', 'duì bǐ'], ['停顿', 'tíng dùn']],
    grammar: [
      {
        pattern: '为了……而……',
        explEn: 'Names a purpose that has swallowed the thing it was meant to serve. With the same word on both sides it becomes a criticism: the means has become the end.',
        explVi: 'Nêu một mục đích đã nuốt mất chính thứ mà nó phục vụ. Khi hai bên là cùng một từ, nó thành lời phê phán: phương tiện đã trở thành mục đích.',
        examples: [
          ['那多半是为了漂亮而漂亮。', 'Nà duō bàn shì wèi le piào liang ér piào liang.', 'That is usually beauty for beauty\'s sake.', 'Đó phần nhiều là đẹp vì đẹp.'],
          ['不要为了强调而强调，读者会累。', 'Bú yào wèi le qiáng diào ér qiáng diào, dú zhě huì lèi.', 'Do not emphasise for emphasis\' sake; the reader tires.', 'Đừng nhấn mạnh chỉ để nhấn mạnh, người đọc sẽ mệt.'],
          ['他为了节奏而删掉了一个重要的事实。', 'Tā wèi le jié zòu ér shān diào le yí gè zhòng yào de shì shí.', 'For the sake of rhythm he cut an important fact.', 'Vì nhịp điệu mà anh ấy đã bỏ đi một sự thật quan trọng.']
        ]
      },
      {
        pattern: '之所以……，是因为……',
        explEn: 'Puts the result first and the cause second, so the sentence begins with what the reader already knows. The clause after 之所以 must be a fact already on the table.',
        explVi: 'Đặt kết quả trước, nguyên nhân sau, để câu bắt đầu bằng điều người đọc đã biết. Mệnh đề sau 之所以 phải là sự việc đã được nêu.',
        examples: [
          ['它之所以失败，是因为读者停在了修辞上。', 'Tā zhī suǒ yǐ shī bài, shì yīn wèi dú zhě tíng zài le xiū cí shàng.', 'It fails because the reader stops at the rhetoric.', 'Nó thất bại là vì người đọc dừng lại ở phần tu từ.'],
          ['这句话之所以打动人，是因为它足够精确。', 'Zhè jù huà zhī suǒ yǐ dǎ dòng rén, shì yīn wèi tā zú gòu jīng què.', 'This line moves people because it is precise enough.', 'Câu này lay động lòng người là vì nó đủ chính xác.'],
          ['朴素的说法之所以有力量，是因为它不挡在意思前面。', 'Pǔ sù de shuō fǎ zhī suǒ yǐ yǒu lì liàng, shì yīn wèi tā bù dǎng zài yì si qián miàn.', 'Plain phrasing has force because it does not stand in front of the meaning.', 'Cách nói mộc mạc có sức mạnh vì nó không chắn trước ý.']
        ]
      },
      {
        pattern: '……的是……，……的是……',
        explEn: 'Two parallel 的 phrases split one thing into the part that stays and the part that changes. The verbs must be of the same kind for the contrast to read.',
        explVi: 'Hai ngữ 的 song song tách một sự việc thành phần giữ nguyên và phần thay đổi. Hai động từ phải cùng loại thì phép đối mới đọc được.',
        examples: [
          ['重复的是句子的形式，变化的是内容。', 'Chóng fù de shì jù zi de xíng shì, biàn huà de shì nèi róng.', 'What repeats is the sentence\'s shape; what changes is the content.', 'Cái lặp lại là hình thức của câu, cái thay đổi là nội dung.'],
          ['修辞负责的是入口，事实负责的是分量。', 'Xiū cí fù zé de shì rù kǒu, shì shí fù zé de shì fèn liàng.', 'Rhetoric handles the way in; fact handles the weight.', 'Tu từ lo phần lối vào, sự thật lo phần sức nặng.'],
          ['他改的是节奏，没改的是观点。', 'Tā gǎi de shì jié zòu, méi gǎi de shì guān diǎn.', 'What he changed was the rhythm, not the view.', 'Thứ anh ấy sửa là nhịp điệu, thứ không sửa là quan điểm.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '比喻的速度',
        titleEn: 'The speed of a metaphor',
        titleVi: 'Tốc độ của phép ví',
        zh: '衡量一个比喻，最可靠的标准是速度：读者需要多久才明白你想说什么。好的比喻用一个大家早就熟悉的东西去说一个陌生的东西，中间的距离刚好——太近就等于没说，太远就变成猜谜。"时间是一条河"之所以能用几千年，是因为河的样子人人见过，而它和时间共用的那几点（一直往前、不能回头、看着慢其实很快）正是要说的重点。相反，一个只在作者脑子里成立的比喻，读者要先猜出你为什么这样比，才能开始想你到底说了什么，中间多出来的这一步就是全部的损失。所以修改的时候可以自问：删掉这个比喻，意思会不会更快到达？如果会，那它就不是在帮忙。',
        en: 'The most reliable measure of a metaphor is speed: how long the reader takes to see what you mean. A good one explains something unfamiliar through something long familiar, at just the right distance — too close and nothing has been said, too far and it becomes a riddle. "Time is a river" has lasted for millennia because everyone has seen a river, and the few points it shares with time (always moving forward, never turning back, seeming slow while running fast) are exactly the points to be made. A metaphor that holds only inside the writer\'s head, by contrast, forces the reader first to guess why you drew the comparison before they can begin to consider what you said; that extra step is the whole of the loss. When revising, then, ask yourself: if I delete this figure, does the meaning arrive faster? If it does, the figure was not helping.',
        vi: 'Thước đo đáng tin nhất cho một phép ví là tốc độ: người đọc mất bao lâu mới hiểu bạn muốn nói gì. Phép ví hay dùng một thứ ai cũng quen từ lâu để nói về một thứ xa lạ, khoảng cách ở giữa vừa đúng — quá gần thì coi như chưa nói gì, quá xa thì thành câu đố. "Thời gian là một dòng sông" dùng được mấy nghìn năm là vì dáng con sông ai cũng từng thấy, mà mấy điểm nó dùng chung với thời gian (luôn đi tới, không quay lại được, trông chậm mà thật ra rất nhanh) chính là những điểm cần nói. Ngược lại, một phép ví chỉ đứng vững trong đầu tác giả thì buộc người đọc phải đoán ra vì sao bạn ví như vậy đã, rồi mới bắt đầu nghĩ xem bạn nói gì; bước dư ra ở giữa ấy chính là toàn bộ phần mất mát. Vậy nên khi sửa bài có thể tự hỏi: bỏ phép ví này đi thì ý có đến nhanh hơn không? Nếu có thì nó không hề đang giúp bạn.',
        questions: [
          { q: '短文用什么标准衡量比喻？', qPinyin: 'Duǎn wén yòng shén me biāo zhǔn héng liáng bǐ yù?',
            qEn: 'What standard does the text use?', qVi: 'Bài đọc dùng tiêu chuẩn nào để đo phép ví?',
            options: [['速度，读者多久才明白', 'tốc độ, người đọc mất bao lâu mới hiểu'], ['长度，比喻有多长', 'độ dài của phép ví'], ['新鲜，有没有人用过', 'độ mới, đã có ai dùng chưa']], correct: 0,
            explEn: '最可靠的标准是速度：读者需要多久才明白你想说什么.', explVi: '最可靠的标准是速度：读者需要多久才明白你想说什么.' },
          { q: '"时间是一条河"能用几千年的原因是什么？', qPinyin: '"Shí jiān shì yì tiáo hé" néng yòng jǐ qiān nián de yuán yīn shì shén me?',
            qEn: 'Why has "time is a river" lasted?', qVi: 'Vì sao "thời gian là dòng sông" dùng được mấy nghìn năm?',
            options: [['河人人见过，共用的几点正是要说的重点', 'ai cũng thấy sông, mấy điểm dùng chung chính là điểm cần nói'], ['因为它很华丽', 'vì nó rất hoa mỹ'], ['因为古人先用了', 'vì người xưa dùng trước']], correct: 0,
            explEn: '因为河的样子人人见过，而它和时间共用的那几点……正是要说的重点.', explVi: '因为河的样子人人见过，而它和时间共用的那几点……正是要说的重点.' },
          { q: '修改时短文建议怎么自问？', qPinyin: 'Xiū gǎi shí duǎn wén jiàn yì zěn me zì wèn?',
            qEn: 'What question does the text suggest when revising?', qVi: 'Khi sửa bài, bài đọc khuyên tự hỏi câu gì?',
            options: [['删掉这个比喻，意思会不会更快到达', 'bỏ phép ví này thì ý có đến nhanh hơn không'], ['这个比喻够不够新', 'phép ví này có đủ mới không'], ['读者喜不喜欢', 'người đọc có thích không']], correct: 0,
            explEn: '删掉这个比喻，意思会不会更快到达？如果会，那它就不是在帮忙.', explVi: '删掉这个比喻，意思会不会更快到达？如果会，那它就不是在帮忙.' }
        ]
      },
      {
        titleZh: '修辞开门，事实留人',
        titleEn: 'Rhetoric opens the door, fact keeps them in',
        titleVi: 'Tu từ mở cửa, sự thật giữ người',
        zh: '一篇文章要走完两段路：先让人愿意读下去，再让人愿意相信。这两段路由不同的东西负责。修辞管的是第一段——节奏、对比、一个恰当的停顿，都是为了让读者不在第三行就走开。事实管的是第二段，它决定读完以后你说的话还剩下多少分量。把两者的位置弄反，麻烦就来了：只有修辞的文章读起来很痛快，可是合上以后想不起它到底主张什么；只有事实的文章句句可靠，可是很多人根本读不到第二段。真正的问题不是"该不该用修辞"，而是修辞有没有把读者送到事实那里。一个简单的检查办法：把所有形容词去掉，看剩下的骨架还站不站得住。站得住，那些形容词就是帮忙的；站不住，它们其实是在替一个空的观点撑场面。',
        en: 'A piece of writing has two stretches to cover: first making someone willing to read on, then making them willing to believe. Different things are responsible for each. Rhetoric governs the first — rhythm, contrast, a well-placed pause, all so the reader does not leave at line three. Fact governs the second, deciding how much weight your words retain once the reading is done. Reverse the two and trouble follows: a piece with only rhetoric is a pleasure to read, yet once closed nobody can recall what it argued; a piece with only fact is reliable line by line, yet many never reach the second stretch. The real question is not whether to use rhetoric but whether the rhetoric delivers the reader to the facts. A simple test: strip out every adjective and see whether the remaining frame still stands. If it does, those adjectives were helping; if it does not, they were propping up an empty claim.',
        vi: 'Một bài viết phải đi hết hai chặng: trước hết khiến người ta chịu đọc tiếp, sau đó khiến người ta chịu tin. Hai chặng ấy do những thứ khác nhau đảm nhiệm. Tu từ lo chặng đầu — nhịp điệu, phép đối, một chỗ ngắt đúng lúc, tất cả để người đọc không bỏ đi ngay ở dòng thứ ba. Sự thật lo chặng sau, nó quyết định đọc xong rồi thì lời bạn nói còn lại bao nhiêu sức nặng. Đảo vị trí hai thứ ấy là rắc rối tới: bài chỉ có tu từ đọc rất đã, nhưng gấp lại thì không nhớ nổi rốt cuộc nó chủ trương điều gì; bài chỉ có sự thật thì câu nào cũng đáng tin, nhưng nhiều người chẳng bao giờ đọc tới chặng thứ hai. Vấn đề thật sự không phải "có nên dùng tu từ không", mà là tu từ có đưa được người đọc đến chỗ sự thật hay không. Một cách kiểm tra đơn giản: bỏ hết tính từ đi, xem bộ khung còn lại có đứng vững không. Đứng vững thì những tính từ ấy là đang giúp; không đứng vững thì thật ra chúng đang chống đỡ cho một luận điểm rỗng.',
        questions: [
          { q: '短文说文章要走完哪两段路？', qPinyin: 'Duǎn wén shuō wén zhāng yào zǒu wán nǎ liǎng duàn lù?',
            qEn: 'Which two stretches must writing cover?', qVi: 'Bài đọc nói bài viết phải đi hết hai chặng nào?',
            options: [['让人愿意读下去，让人愿意相信', 'khiến người ta chịu đọc tiếp, khiến người ta chịu tin'], ['写得快，改得慢', 'viết nhanh, sửa chậm'], ['开头和结尾', 'mở bài và kết bài']], correct: 0,
            explEn: '先让人愿意读下去，再让人愿意相信.', explVi: '先让人愿意读下去，再让人愿意相信.' },
          { q: '只有修辞的文章有什么毛病？', qPinyin: 'Zhǐ yǒu xiū cí de wén zhāng yǒu shén me máo bìng?',
            qEn: 'What is wrong with rhetoric alone?', qVi: 'Bài chỉ có tu từ mắc tật gì?',
            options: [['合上以后想不起它主张什么', 'gấp lại rồi không nhớ nó chủ trương gì'], ['太短', 'quá ngắn'], ['没有人读', 'không ai đọc']], correct: 0,
            explEn: '读起来很痛快，可是合上以后想不起它到底主张什么.', explVi: '读起来很痛快，可是合上以后想不起它到底主张什么.' },
          { q: '把形容词去掉这个办法用来检查什么？', qPinyin: 'Bǎ xíng róng cí qù diào zhè ge bàn fǎ yòng lái jiǎn chá shén me?',
            qEn: 'What does stripping adjectives test?', qVi: 'Cách bỏ hết tính từ dùng để kiểm tra điều gì?',
            options: [['剩下的骨架还站不站得住', 'bộ khung còn lại có đứng vững không'], ['文章够不够长', 'bài có đủ dài không'], ['作者会不会写', 'tác giả có biết viết không']], correct: 0,
            explEn: '把所有形容词去掉，看剩下的骨架还站不站得住.', explVi: '把所有形容词去掉，看剩下的骨架还站不站得住.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '不要___强调___强调，读者会累。', pinyin: 'Bú yào ___ qiáng diào ___ qiáng diào, dú zhě huì lèi.',
        options: [['为了……而', 'vì… mà'], ['因为……所以', 'vì… nên'], ['一边……一边', 'vừa… vừa'], ['连……都', 'ngay cả… cũng']], correct: 0,
        explEn: 'With the same word on both sides, 为了……而 says the means has become the end.', explVi: 'Khi hai bên cùng một từ, 为了……而 nói phương tiện đã thành mục đích.' },
      { kind: 'fillBlank', bloom: 'analyze', prompt: '这句话___打动人，___它足够精确。', pinyin: 'Zhè jù huà ___ dǎ dòng rén, ___ tā zú gòu jīng què.',
        options: [['之所以……是因为', 'sở dĩ… là vì'], ['既然……就', 'đã… thì'], ['无论……都', 'bất kể… đều'], ['只要……就', 'miễn là… thì']], correct: 0,
        explEn: '之所以 fronts the known result and 是因为 supplies the cause.', explVi: '之所以 đưa kết quả đã biết lên trước, 是因为 nêu nguyên nhân.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：朴素的说法就没有修辞吗？ B：___', pinyin: 'A: Pǔ sù de shuō fǎ jiù méi yǒu xiū cí ma? B: ___',
        options: [['也有，选择不加形容词，本身就是一种手法。', 'Cũng có, chọn không thêm tính từ bản thân đã là một thủ pháp.'], ['朴素的文章都很短。', 'Bài mộc mạc đều rất ngắn.'], ['我不喜欢华丽的句子。', 'Mình không thích câu hoa mỹ.'], ['那要看作者是谁。', 'Cái đó tuỳ tác giả là ai.']], correct: 0,
        explEn: 'The question asks whether plainness excludes rhetoric, so the answer must reframe plainness as a device.', explVi: 'Câu hỏi hỏi mộc mạc có loại trừ tu từ không, nên câu trả lời phải coi mộc mạc là một thủ pháp.' },
      { kind: 'multipleChoice', bloom: 'evaluate', prompt: '根据第二篇短文，一篇句句可靠却没人读完的文章问题出在哪儿？', pinyin: 'Gēn jù dì èr piān duǎn wén, yì piān jù jù kě kào què méi rén dú wán de wén zhāng wèn tí chū zài nǎr?',
        passage: 2, options: [['第一段路没人带，读者到不了事实那里', 'chặng đầu không ai dẫn, người đọc không tới được chỗ sự thật'], ['事实太多了', 'sự thật quá nhiều'], ['作者不够诚实', 'tác giả không đủ trung thực'], ['句子太短', 'câu quá ngắn']], correct: 0,
        explEn: '只有事实的文章句句可靠，可是很多人根本读不到第二段.', explVi: '只有事实的文章句句可靠，可是很多人根本读不到第二段.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，比喻和被比的东西离得越远就越好。', pinyin: 'Gēn jù dì yī piān duǎn wén, bǐ yù hé bèi bǐ de dōng xi lí de yuè yuǎn jiù yuè hǎo.',
        isTrue: false, passage: 1,
        explEn: '中间的距离刚好——太近就等于没说，太远就变成猜谜.', explVi: '中间的距离刚好——太近就等于没说，太远就变成猜谜.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '重复的是 / 句子的形式 / 变化的是 / 内容', pinyin: 'chóng fù de shì / jù zi de xíng shì / biàn huà de shì / nèi róng',
        answer: '重复的是句子的形式，变化的是内容。', answerVi: 'Cái lặp lại là hình thức của câu, cái thay đổi là nội dung.',
        options: [['重复的是', 'cái lặp lại là'], ['句子的形式', 'hình thức của câu'], ['变化的是', 'cái thay đổi là'], ['内容', 'nội dung']],
        explEn: 'The two 的 phrases must be parallel for the contrast to read.', explVi: 'Hai ngữ 的 phải song song thì phép đối mới đọc được.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '他 / 为了节奏 / 而 / 删掉了 / 一个重要的事实', pinyin: 'tā / wèi le jié zòu / ér / shān diào le / yí gè zhòng yào de shì shí',
        answer: '他为了节奏而删掉了一个重要的事实。', answerVi: 'Vì nhịp điệu mà anh ấy đã bỏ đi một sự thật quan trọng.',
        options: [['他', 'anh ấy'], ['为了节奏', 'vì nhịp điệu'], ['而', 'mà'], ['删掉了', 'đã bỏ đi'], ['一个重要的事实', 'một sự thật quan trọng']],
        explEn: 'The purpose phrase comes before 而, and the action follows it.', explVi: 'Ngữ mục đích đứng trước 而, hành động theo sau.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，只在作者脑子里成立的比喻多出了哪一步？', pinyin: 'Gēn jù dì yī piān duǎn wén, zhǐ zài zuò zhě nǎo zi lǐ chéng lì de bǐ yù duō chū le nǎ yí bù?',
        passage: 1, options: [['读者要先猜出你为什么这样比', 'người đọc phải đoán ra vì sao bạn ví như vậy trước đã'], ['读者要查资料', 'người đọc phải tra tài liệu'], ['作者要重写一遍', 'tác giả phải viết lại'], ['读者要读两遍', 'người đọc phải đọc hai lần']], correct: 0,
        explEn: '读者要先猜出你为什么这样比，才能开始想你到底说了什么.', explVi: '读者要先猜出你为什么这样比，才能开始想你到底说了什么.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，形容词在什么情况下是有害的？', pinyin: 'Gēn jù dì èr piān duǎn wén, xíng róng cí zài shén me qíng kuàng xià shì yǒu hài de?',
        passage: 2, options: [['去掉以后骨架站不住，它们在替空观点撑场面', 'bỏ đi thì bộ khung không đứng vững, chúng chống đỡ cho luận điểm rỗng'], ['数量超过十个', 'nhiều hơn mười cái'], ['出现在开头', 'xuất hiện ở mở bài'], ['和比喻一起用', 'dùng chung với phép ví']], correct: 0,
        explEn: '站不住，它们其实是在替一个空的观点撑场面.', explVi: '站不住，它们其实是在替一个空的观点撑场面.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说判断比喻好不好的标准是什么？', pinyin: 'B shuō pàn duàn bǐ yù hǎo bu hǎo de biāo zhǔn shì shén me?',
        line: 8, options: [['有没有让人更快地明白', 'có làm người ta hiểu nhanh hơn không'], ['有没有人用过', 'đã có ai dùng chưa'], ['好不好听', 'nghe có hay không'], ['长不长', 'dài hay ngắn']], correct: 0,
        explEn: 'B says: 看它有没有让人更快地明白，而不是更慢.', explVi: 'B nói: 看它有没有让人更快地明白，而不是更慢.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B怎么划分修辞和事实的分工？', pinyin: 'B zěn me huà fēn xiū cí hé shì shí de fēn gōng?',
        line: 16, options: [['修辞让人听进去，事实让人留下来', 'tu từ khiến người ta chịu nghe, sự thật khiến người ta ở lại'], ['修辞比事实重要', 'tu từ quan trọng hơn sự thật'], ['事实可以代替修辞', 'sự thật có thể thay tu từ'], ['两者不能同时用', 'hai thứ không dùng cùng lúc được']], correct: 0,
        explEn: 'B says: 修辞负责让人听进去，事实负责让人留下来.', explVi: 'B nói: 修辞负责让人听进去，事实负责让人留下来.' }
    ]
  }
};
