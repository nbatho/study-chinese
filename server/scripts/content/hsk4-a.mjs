// HSK4 (B2) lessons 01-04. The six-line opening of each dialogue lives in
// base-dialogues-46.mjs and was kept: unlike the passages, grammar and exercises that
// shipped alongside it, it was already written for its own topic. Everything here is new.
//
// Line format: [speaker, simplified, pinyin, english, vietnamese]
// Pinyin follows the project convention: unmarked neutral tone (xué sheng), written
// sandhi for 一/不 (yí dìng, bú shì), capitalised proper nouns.

export default {
  'hsk4-l01-standard-teamwork': {
    titleZh: '团队合作',
    titleEn: 'Teamwork',
    titleVi: 'Làm việc nhóm',
    summaryEn: 'Two colleagues plan how to run a project together: clear tasks, a weekly check-in, disagreement settled by evidence, and cover for whoever drops out.',
    summaryVi: 'Hai đồng nghiệp bàn cách chạy dự án chung: nhiệm vụ rõ ràng, họp ngắn hằng tuần, bất đồng thì giải quyết bằng bằng chứng, và có người thay khi ai đó bận đột xuất.',
    lines: [
      ['A', '可是有人不愿意说出真实的想法，怕影响关系。', 'Kě shì yǒu rén bú yuàn yì shuō chū zhēn shí de xiǎng fǎ, pà yǐng xiǎng guān xi.',
        'But some people are unwilling to say what they really think, afraid it will affect the relationship.',
        'Nhưng có người không muốn nói ra suy nghĩ thật, sợ ảnh hưởng đến quan hệ.'],
      ['B', '所以开会的时候要让每个人都有机会发言，不能只听声音最大的。', 'Suǒ yǐ kāi huì de shí hou yào ràng měi gè rén dōu yǒu jī huì fā yán, bù néng zhǐ tīng shēng yīn zuì dà de.',
        'That is why in a meeting everyone must get a chance to speak — you cannot listen only to the loudest voice.',
        'Vì vậy khi họp phải để mọi người đều có cơ hội phát biểu, không thể chỉ nghe người nói to nhất.'],
      ['A', '那最后由谁来做决定呢？', 'Nà zuì hòu yóu shéi lái zuò jué dìng ne?',
        'Then who makes the final decision?',
        'Vậy cuối cùng ai là người ra quyết định?'],
      ['B', '谁负责哪部分，谁就先提出办法，再由大家一起讨论。', 'Shéi fù zé nǎ bù fen, shéi jiù xiān tí chū bàn fǎ, zài yóu dà jiā yì qǐ tǎo lùn.',
        'Whoever is responsible for a part proposes the approach first, and then everyone discusses it together.',
        'Ai phụ trách phần nào thì người đó đề xuất cách làm trước, rồi cả nhóm cùng thảo luận.'],
      ['A', '万一有人临时有事，任务怎么安排？', 'Wàn yī yǒu rén lín shí yǒu shì, rèn wu zěn me ān pái?',
        'And if someone has something come up at the last minute, how do we arrange their task?',
        'Lỡ có người bận đột xuất thì nhiệm vụ sắp xếp thế nào?'],
      ['B', '每个任务都让另一个人也了解一下，这样不会影响整个计划。', 'Měi gè rèn wu dōu ràng lìng yí gè rén yě liǎo jiě yí xià, zhè yàng bú huì yǐng xiǎng zhěng gè jì huà.',
        'Let a second person get familiar with each task too, so the whole plan is not affected.',
        'Mỗi nhiệm vụ đều cho thêm một người nữa nắm sơ qua, như vậy sẽ không ảnh hưởng toàn bộ kế hoạch.'],
      ['A', '这样听起来清楚多了，我也有信心了。', 'Zhè yàng tīng qǐ lái qīng chu duō le, wǒ yě yǒu xìn xīn le.',
        'Put that way it sounds much clearer — now I feel confident too.',
        'Nghe vậy thì rõ hơn nhiều, mình cũng thấy tự tin hơn.'],
      ['B', '只要大家互相配合，按时完成并不难。', 'Zhǐ yào dà jiā hù xiāng pèi hé, àn shí wán chéng bìng bù nán.',
        'As long as everyone cooperates, finishing on time is not hard at all.',
        'Chỉ cần mọi người phối hợp với nhau thì hoàn thành đúng hạn không hề khó.']
    ],
    allowAbove: ['团队'],
    vocab: [['团队', 'tuán duì'], ['合作', 'hé zuò'], ['项目', 'xiàng mù'], ['明确', 'míng què'], ['任务', 'rèn wu'],
      ['安排', 'ān pái'], ['及时', 'jí shí'], ['解决', 'jiě jué'], ['意见', 'yì jiàn'], ['理由', 'lǐ yóu'],
      ['证据', 'zhèng jù'], ['责任', 'zé rèn'], ['配合', 'pèi hé'], ['效率', 'xiào lǜ'], ['万一', 'wàn yī'],
      ['临时', 'lín shí'], ['按时', 'àn shí']],
    grammar: [
      {
        pattern: '由……来 + 动词',
        explEn: 'Names the person who carries out an action, and is common when responsibility is assigned. 由 marks the doer; 来 introduces the action.',
        explVi: 'Nêu rõ người thực hiện hành động, thường dùng khi phân công trách nhiệm. 由 đánh dấu người làm, 来 dẫn ra hành động.',
        examples: [
          ['最后由谁来做决定？', 'Zuì hòu yóu shéi lái zuò jué dìng?', 'Who makes the final decision?', 'Cuối cùng ai là người ra quyết định?'],
          ['这部分由小李来负责。', 'Zhè bù fen yóu Xiǎo Lǐ lái fù zé.', 'This part will be handled by Xiao Li.', 'Phần này do Tiểu Lý phụ trách.'],
          ['报告由我来写，表格由你来做。', 'Bào gào yóu wǒ lái xiě, biǎo gé yóu nǐ lái zuò.', 'I will write the report and you will fill in the form.', 'Báo cáo do mình viết, biểu mẫu do bạn làm.']
        ]
      },
      {
        pattern: '无论……，都……',
        explEn: 'Says the result holds in every case. 无论 is followed by a question word or an "A还是B" choice, never by a plain statement.',
        explVi: 'Diễn tả kết quả đúng trong mọi trường hợp. Sau 无论 phải là từ để hỏi hoặc lựa chọn "A还是B", không phải câu trần thuật.',
        examples: [
          ['无论谁临时有事，工作都不会停下来。', 'Wú lùn shéi lín shí yǒu shì, gōng zuò dōu bú huì tíng xià lái.', 'No matter who has something come up, the work will not stop.', 'Bất kể ai bận đột xuất, công việc cũng không dừng lại.'],
          ['无论多忙，他都会参加每周的短会。', 'Wú lùn duō máng, tā dōu huì cān jiā měi zhōu de duǎn huì.', 'No matter how busy he is, he attends the weekly short meeting.', 'Dù bận đến đâu, anh ấy cũng dự cuộc họp ngắn hằng tuần.'],
          ['无论同意还是反对，都要说清楚理由。', 'Wú lùn tóng yì hái shi fǎn duì, dōu yào shuō qīng chu lǐ yóu.', 'Whether you agree or object, you must state your reasons clearly.', 'Dù đồng ý hay phản đối, đều phải nói rõ lý do.']
        ]
      },
      {
        pattern: '并不 / 并没有 + 动词',
        explEn: 'Strengthens a denial of what the listener assumed: "actually not". 并 only ever appears before the negative, never before a positive verb.',
        explVi: 'Nhấn mạnh sự phủ định điều người nghe tưởng: "thật ra không". 并 chỉ đứng trước từ phủ định, không đứng trước động từ khẳng định.',
        examples: [
          ['按时完成并不难。', 'Àn shí wán chéng bìng bù nán.', 'Finishing on time is not hard at all.', 'Hoàn thành đúng hạn không hề khó.'],
          ['他并没有反对这个安排。', 'Tā bìng méi yǒu fǎn duì zhè ge ān pái.', 'He did not actually object to this arrangement.', 'Anh ấy thật ra không phản đối cách sắp xếp này.'],
          ['开会时间长并不等于效率高。', 'Kāi huì shí jiān cháng bìng bù děng yú xiào lǜ gāo.', 'A long meeting does not equal high efficiency.', 'Họp lâu không đồng nghĩa với hiệu quả cao.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '分工与责任',
        titleEn: 'Dividing the work, dividing the responsibility',
        titleVi: 'Phân công và trách nhiệm',
        zh: '在一个团队里，最常见的问题往往不是能力不够，而是责任不清楚。很多人以为只要大家都努力，工作自然会完成，可是如果没有人明确自己负责哪一部分，重要的事情就容易被放在一边。比较有效的做法是先把整个项目分为几个小任务，再让每个人写下自己要完成的内容和时间。这样，无论谁临时有事，别人都能很快接着做下去。团队还需要固定的短会，让大家互相了解工作到了哪一步。会上不必讨论所有细节，只要说清楚三件事：已经完成了什么、遇到了什么问题、下一步需要谁的配合。责任清楚以后，效率自然会提高。',
        en: 'In a team the most common problem is usually not a lack of ability but unclear responsibility. Many people assume that as long as everyone works hard the job will get done by itself, yet if nobody has spelled out which part is theirs, the important things are easily set aside. A more effective approach is to split the whole project into small tasks first, then have each person write down what they will finish and by when. That way, no matter who is unexpectedly unavailable, someone else can quickly pick the work up. A team also needs a fixed short meeting so everyone knows how far the work has come. There is no need to discuss every detail — only three things: what has been finished, what problems came up, and whose cooperation the next step needs. Once responsibility is clear, efficiency rises by itself.',
        vi: 'Trong một nhóm, vấn đề thường gặp nhất thường không phải là thiếu năng lực mà là trách nhiệm không rõ ràng. Nhiều người tưởng rằng chỉ cần ai cũng cố gắng thì công việc tự khắc xong, nhưng nếu không ai xác định rõ mình phụ trách phần nào thì những việc quan trọng rất dễ bị bỏ sang một bên. Cách làm hiệu quả hơn là chia cả dự án thành các nhiệm vụ nhỏ trước, rồi để mỗi người viết ra nội dung và thời hạn mình phải hoàn thành. Như vậy, bất kể ai bận đột xuất, người khác cũng có thể tiếp tục ngay. Nhóm còn cần những cuộc họp ngắn cố định để mọi người biết công việc đã đi đến đâu. Trong cuộc họp không cần bàn mọi chi tiết, chỉ cần nói rõ ba điều: đã hoàn thành gì, gặp vấn đề gì, và bước tiếp theo cần ai phối hợp. Khi trách nhiệm rõ ràng, hiệu suất tự nhiên sẽ tăng.',
        questions: [
          { q: '根据短文，团队最常见的问题是什么？', qPinyin: 'Gēn jù duǎn wén, tuán duì zuì cháng jiàn de wèn tí shì shén me?',
            qEn: 'According to the text, what is a team\'s most common problem?', qVi: 'Theo bài đọc, vấn đề thường gặp nhất của nhóm là gì?',
            options: [['责任不清楚', 'trách nhiệm không rõ ràng'], ['能力不够', 'năng lực không đủ'], ['开会太少', 'họp quá ít']], correct: 0,
            explEn: 'The first sentence: 最常见的问题往往不是能力不够，而是责任不清楚.', explVi: 'Câu đầu: 最常见的问题往往不是能力不够，而是责任不清楚.' },
          { q: '短文建议短会上说清楚几件事？', qPinyin: 'Duǎn wén jiàn yì duǎn huì shang shuō qīng chu jǐ jiàn shì?',
            qEn: 'How many things does the text say a short meeting should cover?', qVi: 'Bài đọc khuyên trong cuộc họp ngắn cần nói rõ mấy điều?',
            options: [['三件', 'ba điều'], ['所有细节', 'mọi chi tiết'], ['两件', 'hai điều']], correct: 0,
            explEn: '只要说清楚三件事 — finished, problems, and who is needed next.', explVi: '只要说清楚三件事 – đã xong gì, vấn đề gì, cần ai phối hợp.' },
          { q: '为什么要让每个人写下自己的任务和时间？', qPinyin: 'Wèi shén me yào ràng měi gè rén xiě xià zì jǐ de rèn wu hé shí jiān?',
            qEn: 'Why should each person write down their task and deadline?', qVi: 'Vì sao nên để mỗi người viết ra nhiệm vụ và thời hạn của mình?',
            options: [['有人临时有事时别人能接着做', 'khi ai đó bận đột xuất thì người khác tiếp tục được'], ['为了让经理满意', 'để làm hài lòng quản lý'], ['为了减少开会的时间', 'để giảm thời gian họp']], correct: 0,
            explEn: 'The text ties the written plan to 无论谁临时有事，别人都能很快接着做下去.', explVi: 'Bài đọc gắn việc ghi ra kế hoạch với 无论谁临时有事，别人都能很快接着做下去.' }
        ]
      },
      {
        titleZh: '不同意见怎么谈',
        titleEn: 'How to handle disagreement',
        titleVi: 'Bàn về bất đồng ý kiến thế nào',
        zh: '团队里出现不同意见并不是问题。相反，如果每次讨论大家都很快同意，往往说明有人没有说出真实的想法。问题在于怎么谈。有经验的人会把意见和人分开：反对一个办法，不等于反对提出这个办法的人。谈的时候先说清楚自己的理由，最好带上具体的例子或者数字，而不是只说"我觉得不行"。听的一方也要给对方把话说完的机会。如果两种意见都有道理，可以先小范围试一试，用结果来判断。这样做的好处是，最后的决定不看谁的声音大，只看哪个办法真正有效。',
        en: 'Disagreement inside a team is not a bad thing. On the contrary, if everyone agrees quickly every time, it often means someone is not saying what they really think. The question is how to discuss it. Experienced people separate the opinion from the person: objecting to an approach is not objecting to whoever proposed it. When you speak, state your reasons clearly and ideally bring concrete examples or figures, rather than just saying "I don\'t think it will work". The listener, in turn, should let the other side finish. If both views have merit, try one on a small scale first and let the result decide. The advantage is that the decision no longer depends on whose voice is loudest, but on which approach actually works.',
        vi: 'Có ý kiến khác nhau trong nhóm không phải là điều xấu. Ngược lại, nếu lần thảo luận nào mọi người cũng đồng ý rất nhanh thì thường là có ai đó chưa nói ra suy nghĩ thật. Vấn đề nằm ở cách bàn bạc. Người có kinh nghiệm sẽ tách ý kiến khỏi con người: phản đối một cách làm không đồng nghĩa với phản đối người đưa ra cách làm đó. Khi nói thì trước hết hãy nêu rõ lý do của mình, tốt nhất là kèm ví dụ hoặc con số cụ thể, chứ đừng chỉ nói "mình thấy không được". Bên nghe cũng phải cho đối phương nói hết. Nếu cả hai ý kiến đều có lý, có thể thử ở phạm vi nhỏ trước rồi lấy kết quả để phán đoán. Cái lợi của cách này là quyết định không còn phụ thuộc vào ai nói to hơn, mà phụ thuộc vào cách làm nào thực sự hiệu quả.',
        questions: [
          { q: '大家每次都很快同意，短文认为可能说明什么？', qPinyin: 'Dà jiā měi cì dōu hěn kuài tóng yì, duǎn wén rèn wéi kě néng shuō míng shén me?',
            qEn: 'What does the text suggest quick agreement every time may indicate?', qVi: 'Việc lần nào cũng đồng ý rất nhanh, theo bài đọc, có thể cho thấy điều gì?',
            options: [['有人没说出真实的想法', 'có người chưa nói ra suy nghĩ thật'], ['团队的能力很强', 'năng lực của nhóm rất mạnh'], ['讨论的时间太长', 'thời gian thảo luận quá dài']], correct: 0,
            explEn: '往往说明有人没有说出真实的想法.', explVi: '往往说明有人没有说出真实的想法.' },
          { q: '"把意见和人分开"是什么意思？', qPinyin: '"Bǎ yì jiàn hé rén fēn kāi" shì shén me yì si?',
            qEn: 'What does "separating the opinion from the person" mean?', qVi: '"Tách ý kiến khỏi con người" nghĩa là gì?',
            options: [['反对办法不等于反对提出的人', 'phản đối cách làm không phải phản đối người đề xuất'], ['开会时不要说话', 'khi họp thì đừng nói'], ['只听经理的意见', 'chỉ nghe ý kiến của quản lý']], correct: 0,
            explEn: '反对一个办法，不等于反对提出这个办法的人.', explVi: '反对一个办法，不等于反对提出这个办法的人.' },
          { q: '两种意见都有道理时，短文建议怎么办？', qPinyin: 'Liǎng zhǒng yì jiàn dōu yǒu dào li shí, duǎn wén jiàn yì zěn me bàn?',
            qEn: 'What does the text advise when both views have merit?', qVi: 'Khi cả hai ý kiến đều có lý, bài đọc khuyên làm gì?',
            options: [['小范围试一试，用结果判断', 'thử ở phạm vi nhỏ rồi lấy kết quả để phán đoán'], ['听声音大的那个人的', 'nghe theo người nói to hơn'], ['等经理来决定', 'chờ quản lý quyết định']], correct: 0,
            explEn: '可以先小范围试一试，用结果来判断.', explVi: '可以先小范围试一试，用结果来判断.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '这部分___小李来负责。', pinyin: 'Zhè bù fen ___ Xiǎo Lǐ lái fù zé.',
        options: [['由', 'do (ai đó)'], ['被', 'bị'], ['把', 'đem'], ['给', 'cho']], correct: 0,
        explEn: '由……来 names the person who carries out the action; 被 would make 小李 the one acted upon.', explVi: '由……来 nêu người thực hiện; 被 sẽ biến 小李 thành đối tượng bị tác động.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '___谁临时有事，工作都不会停下来。', pinyin: '___ shéi lín shí yǒu shì, gōng zuò dōu bú huì tíng xià lái.',
        options: [['无论', 'bất kể'], ['因为', 'bởi vì'], ['虽然', 'tuy rằng'], ['为了', 'để mà']], correct: 0,
        explEn: '无论 pairs with 都 and is followed by the question word 谁.', explVi: '无论 đi với 都 và theo sau là từ để hỏi 谁.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：万一有人临时有事，任务怎么安排？ B：___', pinyin: 'A: Wàn yī yǒu rén lín shí yǒu shì, rèn wu zěn me ān pái? B: ___',
        options: [['每个任务都让另一个人也了解一下。', 'Mỗi nhiệm vụ đều cho một người nữa nắm sơ qua.'], ['开会的时间比较长。', 'Thời gian họp khá dài.'], ['我不同意他的看法。', 'Mình không đồng ý với ý kiến của anh ấy.'], ['这个项目下个月开始。', 'Dự án này tháng sau bắt đầu.']], correct: 0,
        explEn: 'The question asks how to cover an absence, so the answer must describe the backup arrangement.', explVi: 'Câu hỏi hỏi cách xử lý khi vắng người, nên câu trả lời phải mô tả phương án dự phòng.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '"按时完成并不难"中的"并"表示什么？', pinyin: '"Àn shí wán chéng bìng bù nán" zhōng de "bìng" biǎo shì shén me?',
        options: [['加强否定，说明和想的不一样', 'nhấn mạnh phủ định, trái với điều người ta tưởng'], ['表示同时发生', 'diễn tả xảy ra đồng thời'], ['表示原因', 'nêu nguyên nhân'], ['表示举例', 'nêu ví dụ']], correct: 0,
        explEn: '并 before a negative strengthens the denial of what the listener assumed.', explVi: '并 đứng trước từ phủ định để nhấn mạnh việc bác bỏ điều người nghe tưởng.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: '根据短文，反对一个办法就是反对提出办法的人。', pinyin: 'Gēn jù duǎn wén, fǎn duì yí gè bàn fǎ jiù shì fǎn duì tí chū bàn fǎ de rén.',
        isTrue: false, passage: 2,
        explEn: 'The text says the opposite: 反对一个办法，不等于反对提出这个办法的人.', explVi: 'Bài đọc nói ngược lại: 反对一个办法，不等于反对提出这个办法的人.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '无论 / 多忙 / 他 / 都 / 参加每周的短会', pinyin: 'wú lùn / duō máng / tā / dōu / cān jiā měi zhōu de duǎn huì',
        answer: '无论多忙，他都参加每周的短会。', answerVi: 'Dù bận đến đâu, anh ấy cũng dự cuộc họp ngắn hằng tuần.',
        options: [['无论', 'bất kể'], ['多忙', 'bận đến đâu'], ['他', 'anh ấy'], ['都', 'đều'], ['参加每周的短会', 'dự cuộc họp ngắn hằng tuần']],
        explEn: '无论 opens the clause and 都 must stand right before the verb phrase in the main clause.', explVi: '无论 mở đầu vế điều kiện, 都 phải đứng ngay trước cụm động từ ở vế chính.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据短文，责任清楚以后会怎么样？', pinyin: 'Gēn jù duǎn wén, zé rèn qīng chu yǐ hòu huì zěn me yàng?',
        passage: 1, options: [['效率自然会提高', 'hiệu suất tự nhiên sẽ tăng'], ['开会时间会变长', 'thời gian họp sẽ dài ra'], ['任务会变少', 'nhiệm vụ sẽ ít đi'], ['大家不用讨论了', 'mọi người khỏi cần thảo luận']], correct: 0,
        explEn: 'The closing line: 责任清楚以后，效率自然会提高.', explVi: 'Câu kết: 责任清楚以后，效率自然会提高.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，最后的决定应该看什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, zuì hòu de jué dìng yīng gāi kàn shén me?',
        passage: 2, options: [['哪个办法真正有效', 'cách làm nào thực sự hiệu quả'], ['谁的声音最大', 'ai nói to nhất'], ['谁的经验最多', 'ai nhiều kinh nghiệm nhất'], ['讨论的时间最长', 'thảo luận lâu nhất']], correct: 0,
        explEn: '最后的决定不看谁的声音大，只看哪个办法真正有效.', explVi: '最后的决定不看谁的声音大，只看哪个办法真正有效.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B认为开会的时候应该怎么做？', pinyin: 'B rèn wéi kāi huì de shí hou yīng gāi zěn me zuò?',
        line: 8, options: [['让每个人都有机会发言', 'để mọi người đều có cơ hội phát biểu'], ['只听声音最大的人', 'chỉ nghe người nói to nhất'], ['尽量不要开会', 'cố gắng đừng họp'], ['先做决定再讨论', 'quyết định trước rồi mới bàn']], correct: 0,
        explEn: 'B says: 要让每个人都有机会发言，不能只听声音最大的.', explVi: 'B nói: 要让每个人都有机会发言，不能只听声音最大的.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'A为什么说有人不愿意说出真实的想法？', pinyin: 'A wèi shén me shuō yǒu rén bú yuàn yì shuō chū zhēn shí de xiǎng fǎ?',
        line: 7, options: [['怕影响关系', 'sợ ảnh hưởng đến quan hệ'], ['没有时间', 'không có thời gian'], ['不知道怎么说', 'không biết nói thế nào'], ['觉得没有用', 'thấy vô ích']], correct: 0,
        explEn: 'A gives the reason directly: 怕影响关系.', explVi: 'A nêu lý do trực tiếp: 怕影响关系.' }
    ]
  },

  'hsk4-l02-standard-time-management': {
    titleZh: '时间管理',
    titleEn: 'Time management',
    titleVi: 'Quản lý thời gian',
    summaryEn: 'A colleague who is always busy but never finished learns to sort tasks by importance, write down three things the night before, and judge new work by urgency.',
    summaryVi: 'Một người luôn bận mà không xong việc học cách sắp xếp theo mức quan trọng, tối hôm trước ghi ra ba việc, và xét việc mới theo mức khẩn cấp.',
    lines: [
      ['A', '我常常一边工作一边看手机，很难专心。', 'Wǒ cháng cháng yì biān gōng zuò yì biān kàn shǒu jī, hěn nán zhuān xīn.',
        'I often work and look at my phone at the same time, so it is hard to concentrate.',
        'Mình hay vừa làm việc vừa xem điện thoại nên rất khó tập trung.'],
      ['B', '那就把手机放远一点儿，工作的时候先关提醒。', 'Nà jiù bǎ shǒu jī fàng yuǎn yì diǎnr, gōng zuò de shí hou xiān guān tí xǐng.',
        'Then put the phone further away and turn notifications off before you work.',
        'Vậy thì để điện thoại xa ra một chút, lúc làm việc thì tắt thông báo trước.'],
      ['A', '每天要做的事太多，我总是记不住。', 'Měi tiān yào zuò de shì tài duō, wǒ zǒng shì jì bu zhù.',
        'There is too much to do every day and I can never remember it all.',
        'Mỗi ngày quá nhiều việc, mình toàn không nhớ hết.'],
      ['B', '前一天晚上写下第二天最重要的三件事，早上照着做就行。', 'Qián yì tiān wǎn shang xiě xià dì èr tiān zuì zhòng yào de sān jiàn shì, zǎo shang zhào zhe zuò jiù xíng.',
        'The night before, write down the three most important things for the next day and just follow the list in the morning.',
        'Tối hôm trước hãy ghi ra ba việc quan trọng nhất của hôm sau, sáng cứ theo đó mà làm.'],
      ['A', '要是临时又来了新任务呢？', 'Yào shi lín shí yòu lái le xīn rèn wu ne?',
        'What if a new task suddenly comes in?',
        'Nếu đột xuất lại có nhiệm vụ mới thì sao?'],
      ['B', '先判断急不急，不急的可以推迟到第二天。', 'Xiān pàn duàn jí bu jí, bù jí de kě yǐ tuī chí dào dì èr tiān.',
        'First judge whether it is urgent; what is not urgent can wait until the next day.',
        'Trước hết hãy xét xem có gấp không, việc không gấp có thể dời sang hôm sau.'],
      ['A', '这样安排会不会让人更紧张？', 'Zhè yàng ān pái huì bu huì ràng rén gèng jǐn zhāng?',
        'Would planning like this make a person even more tense?',
        'Sắp xếp như vậy có làm người ta căng thẳng hơn không?'],
      ['B', '不会，安排清楚以后反而更放松，因为你知道什么时候做什么。', 'Bú huì, ān pái qīng chu yǐ hòu fǎn ér gèng fàng sōng, yīn wèi nǐ zhī dao shén me shí hou zuò shén me.',
        'No — once things are clearly planned you actually relax more, because you know what to do when.',
        'Không đâu, sắp xếp rõ ràng rồi thì ngược lại còn thoải mái hơn, vì bạn biết khi nào làm gì.']
    ],
    vocab: [['管理', 'guǎn lǐ'], ['安排', 'ān pái'], ['重要', 'zhòng yào'], ['紧急', 'jǐn jí'], ['任务', 'rèn wu'],
      ['效率', 'xiào lǜ'], ['专心', 'zhuān xīn'], ['打扰', 'dǎ rǎo'], ['精力', 'jīng lì'], ['推迟', 'tuī chí'],
      ['提前', 'tí qián'], ['判断', 'pàn duàn'], ['浪费', 'làng fèi'], ['坚持', 'jiān chí'], ['动力', 'dòng lì'],
      ['调整', 'tiáo zhěng'], ['习惯', 'xí guàn']],
    grammar: [
      {
        pattern: '把 + 宾语 + 动词 + 补语',
        explEn: 'Moves the object in front of the verb to say what happened to it. The verb cannot stand bare — it needs a result, a direction or a place after it.',
        explVi: 'Đưa tân ngữ ra trước động từ để nói điều gì đã xảy ra với nó. Động từ không thể đứng trơ mà phải có bổ ngữ chỉ kết quả, hướng hoặc nơi chốn.',
        examples: [
          ['把手机放远一点儿。', 'Bǎ shǒu jī fàng yuǎn yì diǎnr.', 'Put the phone a bit further away.', 'Để điện thoại xa ra một chút.'],
          ['把最重要的三件事写下来。', 'Bǎ zuì zhòng yào de sān jiàn shì xiě xià lái.', 'Write down the three most important things.', 'Hãy ghi ra ba việc quan trọng nhất.'],
          ['他把这个任务推迟到了下周。', 'Tā bǎ zhè ge rèn wu tuī chí dào le xià zhōu.', 'He pushed this task back to next week.', 'Anh ấy đã dời nhiệm vụ này sang tuần sau.']
        ]
      },
      {
        pattern: '反而',
        explEn: 'Introduces a result opposite to what the listener expects. It stands before the verb, and the expectation is usually stated just before it.',
        explVi: 'Dẫn ra kết quả ngược với điều người nghe chờ đợi. Đứng trước động từ, và điều được chờ đợi thường nêu ngay trước đó.',
        examples: [
          ['安排清楚以后反而更放松。', 'Ān pái qīng chu yǐ hòu fǎn ér gèng fàng sōng.', 'Once things are clearly planned you actually relax more.', 'Sắp xếp rõ ràng rồi thì ngược lại còn thoải mái hơn.'],
          ['他每天加班，工作反而没做完。', 'Tā měi tiān jiā bān, gōng zuò fǎn ér méi zuò wán.', 'He works overtime every day, yet the work still is not done.', 'Anh ấy ngày nào cũng tăng ca mà công việc lại không xong.'],
          ['东西越多，选择反而越难。', 'Dōng xi yuè duō, xuǎn zé fǎn ér yuè nán.', 'The more things there are, the harder choosing actually becomes.', 'Đồ càng nhiều thì việc chọn lại càng khó.']
        ]
      },
      {
        pattern: '动词 + 不住 / 得住',
        explEn: 'A potential complement: whether the action can hold. 记不住 = cannot keep it in mind; 记得住 = can. The negative form is far more common.',
        explVi: 'Bổ ngữ khả năng: hành động có "giữ" được hay không. 记不住 = không nhớ nổi; 记得住 = nhớ được. Dạng phủ định thông dụng hơn nhiều.',
        examples: [
          ['事情太多，我总是记不住。', 'Shì qing tài duō, wǒ zǒng shì jì bu zhù.', 'There is so much that I can never keep it in mind.', 'Việc quá nhiều nên mình toàn không nhớ nổi.'],
          ['写下来就记得住了。', 'Xiě xià lái jiù jì de zhù le.', 'Once you write it down you can remember it.', 'Ghi ra là nhớ được ngay.'],
          ['这么多生词，一天记不住。', 'Zhè me duō shēng cí, yì tiān jì bu zhù.', 'That many new words cannot be memorised in one day.', 'Nhiều từ mới thế này, một ngày không nhớ nổi.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '重要和紧急',
        titleEn: 'Important versus urgent',
        titleVi: 'Quan trọng và khẩn cấp',
        zh: '很多人每天都很忙，可是到了晚上却说不出自己完成了什么。原因常常是把紧急的事和重要的事弄混了。紧急的事会发出声音：电话响了，同事在门口等你，消息一条接着一条。重要的事却很安静，它不会来找你，可是它决定几个月以后的结果。如果一个人整天只处理紧急的事，他会觉得自己很努力，实际上一直没有前进。比较好的做法是每天先留出一段不被打扰的时间，用最好的精力做那件最重要的事，再去回复消息、处理小事。一开始会不习惯，因为放着响的电话不接需要一点儿勇气，但是坚持两三周以后，你会发现真正推动工作的正是这段安静的时间。',
        en: 'Many people are busy all day yet by evening cannot say what they actually finished. The reason is often that urgent things and important things have been confused. Urgent things make noise: the phone rings, a colleague waits at the door, messages arrive one after another. Important things are quiet — they do not chase you, but they decide the outcome months later. Someone who spends all day only on urgent matters will feel hard-working while in fact standing still. A better approach is to set aside an undisturbed block each day, spend your best energy on the single most important task, and only then reply to messages and deal with small matters. It feels wrong at first, because letting a ringing phone go takes a little courage, but after two or three weeks you will find that this quiet block is exactly what moves the work forward.',
        vi: 'Nhiều người ngày nào cũng rất bận, nhưng đến tối lại không nói được mình đã hoàn thành gì. Nguyên nhân thường là lẫn lộn việc khẩn cấp với việc quan trọng. Việc khẩn cấp thì phát ra tiếng động: điện thoại reo, đồng nghiệp đứng đợi ở cửa, tin nhắn đến liên tiếp. Việc quan trọng lại rất im lặng, nó không giục bạn, nhưng nó quyết định kết quả vài tháng sau. Nếu một người cả ngày chỉ xử lý việc khẩn cấp, họ sẽ thấy mình rất cố gắng trong khi thực tế vẫn giậm chân tại chỗ. Cách làm tốt hơn là mỗi ngày dành riêng một khoảng thời gian không bị làm phiền, dùng lúc sung sức nhất để làm việc quan trọng nhất, rồi mới trả lời tin nhắn và xử lý việc vặt. Ban đầu sẽ thấy không quen, vì để mặc điện thoại reo cũng cần một chút dũng khí, nhưng kiên trì hai ba tuần bạn sẽ thấy chính khoảng thời gian yên tĩnh đó mới thật sự đẩy công việc đi lên.',
        questions: [
          { q: '短文说紧急的事有什么特点？', qPinyin: 'Duǎn wén shuō jǐn jí de shì yǒu shén me tè diǎn?',
            qEn: 'What does the text say is typical of urgent matters?', qVi: 'Bài đọc nói việc khẩn cấp có đặc điểm gì?',
            options: [['会发出声音，一直打扰你', 'phát ra tiếng động, luôn làm phiền bạn'], ['很安静，不会来找你', 'rất im lặng, không tìm đến bạn'], ['决定几个月后的结果', 'quyết định kết quả vài tháng sau']], correct: 0,
            explEn: '紧急的事会发出声音 — the quiet ones are the important ones.', explVi: '紧急的事会发出声音 – việc im lặng mới là việc quan trọng.' },
          { q: '只处理紧急的事，结果会怎么样？', qPinyin: 'Zhǐ chǔ lǐ jǐn jí de shì, jié guǒ huì zěn me yàng?',
            qEn: 'What happens if you only handle urgent matters?', qVi: 'Nếu chỉ xử lý việc khẩn cấp thì kết quả ra sao?',
            options: [['觉得很努力，实际上一直没有前进', 'thấy mình rất cố gắng nhưng thực tế không tiến lên'], ['工作很快就完成了', 'công việc rất nhanh xong'], ['精力会越来越好', 'sức lực ngày càng tốt lên']], correct: 0,
            explEn: '他会觉得自己很努力，实际上一直没有前进.', explVi: '他会觉得自己很努力，实际上一直没有前进.' },
          { q: '短文建议一天中最好的精力用来做什么？', qPinyin: 'Duǎn wén jiàn yì yì tiān zhōng zuì hǎo de jīng lì yòng lái zuò shén me?',
            qEn: 'What does the text say your best energy should go to?', qVi: 'Bài đọc khuyên dùng lúc sung sức nhất để làm gì?',
            options: [['最重要的那件事', 'việc quan trọng nhất'], ['回复消息', 'trả lời tin nhắn'], ['处理小事', 'xử lý việc vặt']], correct: 0,
            explEn: '用最好的精力做那件最重要的事，再去回复消息.', explVi: '用最好的精力做那件最重要的事，再去回复消息.' }
        ]
      },
      {
        titleZh: '为什么计划总是失败',
        titleEn: 'Why plans keep failing',
        titleVi: 'Vì sao kế hoạch cứ thất bại',
        zh: '定计划的时候，人总是对自己特别有信心：明天六点起床，晚上读五十页书，周末把房间收拾干净。可是第二天一到，计划就一条一条地推迟。这并不是因为我们懒，而是因为计划的做法有问题。第一，计划太满，没有给意外留时间；只要有一件事出错，后面全乱了。第二，目标太大，大到不知道从哪里开始。第三，只写了要做什么，没写什么时候做，结果一天过去了也没开始。改的办法很简单：一天只定三件必须完成的事，每件事写清楚时间；再留出一段没有安排的时间，专门用来处理临时出现的问题。计划留了这样的时间，才有可能完成。',
        en: 'When we make plans we are always especially confident: up at six tomorrow, fifty pages tonight, the room cleaned at the weekend. Yet the next day arrives and the plan slips item by item. This is not because we are lazy but because the plan itself is flawed. First, it is packed too full, leaving no room for the unexpected; one thing goes wrong and everything after it collapses. Second, the goals are so big that you do not know where to start. Third, it records what to do but not when, so the day passes without a start being made. The fix is simple: set only three things that must be done, write a time next to each, and leave one empty block specifically for problems that come up. Only a plan with slack in it can actually be finished.',
        vi: 'Khi lập kế hoạch, người ta luôn rất tự tin vào bản thân: mai sáu giờ dậy, tối đọc năm mươi trang sách, cuối tuần dọn phòng cho sạch. Nhưng hôm sau vừa đến thì kế hoạch bị dời từng mục một. Điều này không phải vì chúng ta lười, mà vì bản thân kế hoạch có vấn đề. Thứ nhất, kế hoạch quá kín, không chừa thời gian cho việc bất ngờ; chỉ cần một việc trục trặc là phía sau rối hết. Thứ hai, mục tiêu quá lớn, lớn đến mức không biết bắt đầu từ đâu. Thứ ba, chỉ ghi phải làm gì mà không ghi làm lúc nào, kết quả là hết ngày vẫn chưa bắt đầu. Cách sửa rất đơn giản: mỗi ngày chỉ đặt ba việc bắt buộc phải xong, mỗi việc ghi rõ thời gian; rồi chừa một khoảng trống chuyên để xử lý vấn đề phát sinh. Kế hoạch có chừa chỗ trống thì mới có khả năng hoàn thành.',
        questions: [
          { q: '短文认为计划失败的原因是什么？', qPinyin: 'Duǎn wén rèn wéi jì huà shī bài de yuán yīn shì shén me?',
            qEn: 'What does the text give as the reason plans fail?', qVi: 'Bài đọc cho rằng nguyên nhân kế hoạch thất bại là gì?',
            options: [['计划的做法有问题', 'cách lập kế hoạch có vấn đề'], ['我们太懒', 'chúng ta quá lười'], ['时间实在不够', 'thời gian thật sự không đủ']], correct: 0,
            explEn: '这并不是因为我们懒，而是因为计划的做法有问题.', explVi: '这并不是因为我们懒，而是因为计划的做法有问题.' },
          { q: '短文提到计划的第三个问题是什么？', qPinyin: 'Duǎn wén tí dào jì huà de dì sān gè wèn tí shì shén me?',
            qEn: 'What is the third flaw the text names?', qVi: 'Vấn đề thứ ba mà bài đọc nêu là gì?',
            options: [['只写做什么，没写什么时候做', 'chỉ ghi làm gì mà không ghi làm lúc nào'], ['目标太大', 'mục tiêu quá lớn'], ['计划太满', 'kế hoạch quá kín']], correct: 0,
            explEn: '第三，只写了要做什么，没写什么时候做.', explVi: '第三，只写了要做什么，没写什么时候做.' },
          { q: '为什么要留出一段没有安排的时间？', qPinyin: 'Wèi shén me yào liú chū yí duàn méi yǒu ān pái de shí jiān?',
            qEn: 'Why should you leave an unscheduled block of time?', qVi: 'Vì sao phải chừa một khoảng thời gian trống?',
            options: [['专门用来处理临时出现的问题', 'chuyên dùng để xử lý vấn đề phát sinh'], ['为了多休息一会儿', 'để nghỉ ngơi thêm một lát'], ['为了写更多的计划', 'để viết thêm nhiều kế hoạch']], correct: 0,
            explEn: '再留出一段没有安排的时间，专门用来处理临时出现的问题.', explVi: '再留出一段没有安排的时间，专门用来处理临时出现的问题.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '请___手机放远一点儿。', pinyin: 'Qǐng ___ shǒu jī fàng yuǎn yì diǎnr.',
        options: [['把', 'đem (giới từ 把)'], ['被', 'bị'], ['对', 'đối với'], ['从', 'từ']], correct: 0,
        explEn: '把 moves the object before the verb, and 放远 supplies the required complement.', explVi: '把 đưa tân ngữ ra trước động từ, và 放远 là bổ ngữ bắt buộc.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '安排清楚以后___更放松了。', pinyin: 'Ān pái qīng chu yǐ hòu ___ gèng fàng sōng le.',
        options: [['反而', 'ngược lại'], ['因此', 'do đó'], ['并且', 'hơn nữa'], ['本来', 'vốn dĩ']], correct: 0,
        explEn: '反而 marks a result opposite to the expectation that planning makes you tense.', explVi: '反而 đánh dấu kết quả ngược với kỳ vọng rằng lên kế hoạch khiến ta căng thẳng.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：要是临时又来了新任务呢？ B：___', pinyin: 'A: Yào shi lín shí yòu lái le xīn rèn wu ne? B: ___',
        options: [['先判断急不急，不急的可以推迟。', 'Trước hết xét gấp hay không, việc không gấp có thể dời lại.'], ['我每天都很忙。', 'Ngày nào mình cũng bận.'], ['手机放在桌子上。', 'Điện thoại để trên bàn.'], ['这本书很有意思。', 'Cuốn sách này rất thú vị.']], correct: 0,
        explEn: 'The question asks what to do with a new task, so the answer must give a rule for handling it.', explVi: 'Câu hỏi hỏi xử lý nhiệm vụ mới, nên câu trả lời phải nêu nguyên tắc xử lý.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据短文，"重要的事很安静"是什么意思？', pinyin: 'Gēn jù duǎn wén, "zhòng yào de shì hěn ān jìng" shì shén me yì si?',
        passage: 1, options: [['它不会催你，可是决定以后的结果', 'nó không giục bạn nhưng quyết định kết quả về sau'], ['做的时候不能说话', 'khi làm thì không được nói chuyện'], ['它不值得马上做', 'nó không đáng làm ngay'], ['它比紧急的事简单', 'nó đơn giản hơn việc khẩn cấp']], correct: 0,
        explEn: '重要的事却很安静，它不会来找你，可是它决定几个月以后的结果.', explVi: '重要的事却很安静，它不会来找你，可是它决定几个月以后的结果.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: '短文认为计划失败主要是因为人太懒。', pinyin: 'Duǎn wén rèn wéi jì huà shī bài zhǔ yào shì yīn wèi rén tài lǎn.',
        isTrue: false, passage: 2,
        explEn: '这并不是因为我们懒，而是因为计划的做法有问题.', explVi: '这并不是因为我们懒，而是因为计划的做法有问题.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '把 / 最重要的 / 三件事 / 写 / 下来', pinyin: 'bǎ / zuì zhòng yào de / sān jiàn shì / xiě / xià lái',
        answer: '把最重要的三件事写下来。', answerVi: 'Hãy ghi ra ba việc quan trọng nhất.',
        options: [['把', 'đem'], ['最重要的', 'quan trọng nhất'], ['三件事', 'ba việc'], ['写', 'viết'], ['下来', 'xuống']],
        explEn: 'In a 把 sentence the object comes before the verb and the verb takes the complement 下来.', explVi: 'Trong câu 把, tân ngữ đứng trước động từ và động từ mang bổ ngữ 下来.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，为什么放着响的电话不接需要勇气？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me fàng zhe xiǎng de diàn huà bù jiē xū yào yǒng qì?',
        passage: 1, options: [['因为紧急的事一直在催你', 'vì việc khẩn cấp luôn giục bạn'], ['因为电话费很贵', 'vì cước điện thoại rất đắt'], ['因为同事会生气', 'vì đồng nghiệp sẽ giận'], ['因为重要的事更容易做', 'vì việc quan trọng dễ làm hơn']], correct: 0,
        explEn: 'The passage contrasts noisy urgent matters with quiet important ones; resisting the noise is the hard part.', explVi: 'Bài đọc đối lập việc khẩn cấp ồn ào với việc quan trọng im lặng; chống lại tiếng ồn mới là phần khó.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，一天应该定几件必须完成的事？', pinyin: 'Gēn jù dì èr piān duǎn wén, yì tiān yīng gāi dìng jǐ jiàn bì xū wán chéng de shì?',
        passage: 2, options: [['三件', 'ba việc'], ['五件', 'năm việc'], ['十件', 'mười việc'], ['越多越好', 'càng nhiều càng tốt']], correct: 0,
        explEn: '一天只定三件必须完成的事.', explVi: '一天只定三件必须完成的事.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议什么时候写第二天的计划？', pinyin: 'B jiàn yì shén me shí hou xiě dì èr tiān de jì huà?',
        line: 10, options: [['前一天晚上', 'tối hôm trước'], ['第二天早上', 'sáng hôm sau'], ['中午休息的时候', 'lúc nghỉ trưa'], ['每周末', 'mỗi cuối tuần']], correct: 0,
        explEn: 'B says: 前一天晚上写下第二天最重要的三件事.', explVi: 'B nói: 前一天晚上写下第二天最重要的三件事.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'A觉得自己为什么很难专心？', pinyin: 'A jué de zì jǐ wèi shén me hěn nán zhuān xīn?',
        line: 7, options: [['一边工作一边看手机', 'vừa làm việc vừa xem điện thoại'], ['房间太吵', 'phòng quá ồn'], ['睡得太少', 'ngủ quá ít'], ['任务太简单', 'nhiệm vụ quá dễ']], correct: 0,
        explEn: 'A says: 我常常一边工作一边看手机，很难专心.', explVi: 'A nói: 我常常一边工作一边看手机，很难专心.' }
    ]
  }
};
