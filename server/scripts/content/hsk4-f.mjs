// HSK4 (B2) lessons 11-13. See hsk4-a.mjs for the spec shape and the pinyin conventions.

export default {
  'hsk4-l11-standard-media': {
    titleZh: '看新闻的方法',
    titleEn: 'Reading the news',
    titleVi: 'Cách đọc tin tức',
    summaryEn: 'Two readers work out how to judge online news: check the source, read past the headline, separate fact from opinion, and wait before sharing.',
    summaryVi: 'Hai người bàn cách đánh giá tin trên mạng: xem nguồn, đọc quá cái tiêu đề, tách sự thật khỏi quan điểm, và khoan hãy chia sẻ.',
    lines: [
      ['A', '怎么看出一条新闻里哪些是事实，哪些是观点？', 'Zěn me kàn chū yì tiáo xīn wén lǐ nǎ xiē shì shì shí, nǎ xiē shì guān diǎn?',
        'How do you tell which parts of a news item are facts and which are opinions?',
        'Làm sao nhận ra trong một bản tin đâu là sự thật, đâu là quan điểm?'],
      ['B', '事实能查，观点不能。"三点开始"是事实，"太晚了"是观点。', 'Shì shí néng chá, guān diǎn bù néng. "Sān diǎn kāi shǐ" shì shì shí, "tài wǎn le" shì guān diǎn.',
        'Facts can be checked, opinions cannot. "It starts at three" is a fact; "that is too late" is an opinion.',
        'Sự thật thì tra được, quan điểm thì không. "Bắt đầu lúc ba giờ" là sự thật, "muộn quá" là quan điểm.'],
      ['A', '有的报道只写了一半，这算错吗？', 'Yǒu de bào dào zhǐ xiě le yí bàn, zhè suàn cuò ma?',
        'Some reports tell only half the story — does that count as wrong?',
        'Có bài chỉ viết một nửa, vậy có tính là sai không?'],
      ['B', '不算错，可是也不完整，所以要看看别人怎么写同样的事。', 'Bú suàn cuò, kě shì yě bù wán zhěng, suǒ yǐ yào kàn kan bié rén zěn me xiě tóng yàng de shì.',
        'Not wrong, but not complete either — so look at how others wrote about the same event.',
        'Không tính là sai, nhưng cũng không đầy đủ, nên phải xem người khác viết về cùng sự việc thế nào.'],
      ['A', '看到让我很生气的消息，我常常马上就想发给别人。', 'Kàn dào ràng wǒ hěn shēng qì de xiāo xi, wǒ cháng cháng mǎ shàng jiù xiǎng fā gěi bié rén.',
        'When I see something that makes me angry, I often want to forward it immediately.',
        'Thấy tin làm mình bực là mình hay muốn gửi ngay cho người khác.'],
      ['B', '越想马上发的，越要先放一放，假消息就是靠这个传开的。', 'Yuè xiǎng mǎ shàng fā de, yuè yào xiān fàng yi fàng, jiǎ xiāo xi jiù shì kào zhè ge chuán kāi de.',
        'The more you want to send it at once, the more you should let it sit — that is exactly how false news spreads.',
        'Càng muốn gửi ngay thì càng phải để đó đã, tin giả lan đi chính là nhờ điều này.'],
      ['A', '原来发一条消息也有责任。', 'Yuán lái fā yì tiáo xiāo xi yě yǒu zé rèn.',
        'So even forwarding a message carries responsibility.',
        'Hóa ra gửi một tin nhắn cũng có trách nhiệm.'],
      ['B', '对，你发出去，别人看到的就是你相信的东西。', 'Duì, nǐ fā chū qù, bié rén kàn dào de jiù shì nǐ xiāng xìn de dōng xi.',
        'Yes — once you send it, what others see is what you have vouched for.',
        'Đúng, bạn gửi đi thì thứ người khác thấy chính là điều bạn tin.']
    ],
    vocab: [['新闻', 'xīn wén'], ['消息', 'xiāo xi'], ['来源', 'lái yuán'], ['可靠', 'kě kào'], ['标题', 'biāo tí'],
      ['内容', 'nèi róng'], ['结论', 'jié lùn'], ['判断', 'pàn duàn'], ['事实', 'shì shí'], ['观点', 'guān diǎn'],
      ['报道', 'bào dào'], ['记者', 'jì zhě'], ['调查', 'diào chá'], ['完整', 'wán zhěng'], ['证据', 'zhèng jù'],
      ['相信', 'xiāng xìn'], ['引起', 'yǐn qǐ']],
    grammar: [
      {
        pattern: '越……越……',
        explEn: 'Two things rising together. Each 越 stands directly before its own verb or adjective, and the subject is usually mentioned once.',
        explVi: 'Hai điều cùng tăng theo nhau. Mỗi 越 đứng ngay trước động từ hoặc tính từ của nó, chủ ngữ thường chỉ nêu một lần.',
        examples: [
          ['越想马上发的，越要先放一放。', 'Yuè xiǎng mǎ shàng fā de, yuè yào xiān fàng yi fàng.', 'The more you want to send it at once, the more you should let it sit.', 'Càng muốn gửi ngay thì càng phải để đó đã.'],
          ['标题越可怕，内容越可能不完整。', 'Biāo tí yuè kě pà, nèi róng yuè kě néng bù wán zhěng.', 'The more alarming the headline, the more likely the content is incomplete.', 'Tiêu đề càng giật gân thì nội dung càng dễ thiếu đầy đủ.'],
          ['看的来源越多，判断越可靠。', 'Kàn de lái yuán yuè duō, pàn duàn yuè kě kào.', 'The more sources you read, the more reliable your judgement.', 'Xem càng nhiều nguồn thì phán đoán càng đáng tin.']
        ]
      },
      {
        pattern: '原来……',
        explEn: 'Marks something the speaker has just realised, correcting an earlier assumption. It is different from 本来 ("originally").',
        explVi: 'Đánh dấu điều người nói vừa vỡ lẽ, đính chính giả định trước đó. Khác với 本来 ("vốn dĩ").',
        examples: [
          ['原来发一条消息也有责任。', 'Yuán lái fā yì tiáo xiāo xi yě yǒu zé rèn.', 'So forwarding a message carries responsibility after all.', 'Hóa ra gửi một tin nhắn cũng có trách nhiệm.'],
          ['原来这条新闻是三年前的。', 'Yuán lái zhè tiáo xīn wén shì sān nián qián de.', 'It turns out this news item is three years old.', 'Hóa ra bản tin này là của ba năm trước.'],
          ['我以为他不同意，原来他没看完。', 'Wǒ yǐ wéi tā bù tóng yì, yuán lái tā méi kàn wán.', 'I thought he disagreed; in fact he had not finished reading.', 'Mình tưởng anh ấy không đồng ý, hóa ra anh ấy chưa đọc hết.']
        ]
      },
      {
        pattern: '动词 + 一 + 动词 / 动词 + 了 + 动词',
        explEn: 'Softens an action into "just do it a bit". 放一放 = let it sit a while; 看了看 does the same for something already finished.',
        explVi: 'Làm nhẹ hành động thành "làm một chút". 放一放 = để đó một lát; 看了看 dùng cho việc đã xong.',
        examples: [
          ['越想马上发的，越要先放一放。', 'Yuè xiǎng mǎ shàng fā de, yuè yào xiān fàng yi fàng.', 'What you most want to send, let it sit a while first.', 'Cái càng muốn gửi thì càng nên để đó một lát.'],
          ['你先查一查这条消息的来源。', 'Nǐ xiān chá yi chá zhè tiáo xiāo xi de lái yuán.', 'Check the source of this message first.', 'Bạn hãy tra thử nguồn của tin này trước.'],
          ['他看了看标题就关上了。', 'Tā kàn le kàn biāo tí jiù guān shàng le.', 'He glanced at the headline and closed it.', 'Anh ấy liếc qua tiêu đề rồi đóng lại.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '标题为什么这么写',
        titleEn: 'Why headlines are written that way',
        titleVi: 'Vì sao tiêu đề được viết như vậy',
        zh: '同样一件事，可以写成"三成学生每天运动"，也可以写成"七成学生几乎不运动"。两个标题都没说假话，可是给人的感觉完全不同。写标题的人知道，读者停下来的时间只有一两秒，所以他要在这一两秒里让你产生一种感觉：好奇、生气或者担心。有了这种感觉，人就会点进去。这不一定是骗你，但它确实决定了你先看见什么。所以看新闻的时候可以做一个小练习：读完标题，先问自己"它想让我有什么感觉"，再往下看正文里的数字和时间。很多时候你会发现，正文比标题平静得多，也完整得多。',
        en: 'The same fact can be written as "thirty per cent of students exercise daily" or "seventy per cent of students hardly exercise at all". Neither headline lies, yet they leave completely different impressions. Headline writers know a reader pauses for only a second or two, so within those seconds they must produce an emotion: curiosity, anger or worry. With the emotion comes the click. This is not necessarily deception, but it does decide what you see first. So a small exercise helps when reading news: after the headline, ask yourself "what feeling is this trying to give me?", and only then look at the figures and dates in the body. Very often you will find the body far calmer — and far more complete — than the headline.',
        vi: 'Cùng một sự việc, có thể viết là "ba mươi phần trăm học sinh vận động mỗi ngày", cũng có thể viết là "bảy mươi phần trăm học sinh hầu như không vận động". Cả hai tiêu đề đều không nói dối, nhưng cảm giác đem lại thì hoàn toàn khác. Người viết tiêu đề biết rằng độc giả chỉ dừng lại một hai giây, nên trong một hai giây ấy họ phải làm bạn nảy sinh một cảm xúc: tò mò, tức giận hoặc lo lắng. Có cảm xúc rồi thì người ta sẽ bấm vào. Đây chưa hẳn là lừa bạn, nhưng nó quả thật quyết định việc bạn nhìn thấy gì trước. Vậy nên khi đọc tin có thể làm một bài tập nhỏ: đọc xong tiêu đề, hãy tự hỏi "nó muốn mình cảm thấy thế nào", rồi mới đọc tiếp các con số và mốc thời gian trong phần chính. Rất nhiều khi bạn sẽ thấy phần chính bình thản hơn tiêu đề nhiều, và cũng đầy đủ hơn nhiều.',
        questions: [
          { q: '短文用两个标题的例子说明什么？', qPinyin: 'Duǎn wén yòng liǎng gè biāo tí de lì zi shuō míng shén me?',
            qEn: 'What do the two headlines illustrate?', qVi: 'Bài đọc dùng ví dụ hai tiêu đề để nói lên điều gì?',
            options: [['都是事实，感觉却完全不同', 'đều là sự thật nhưng cảm giác hoàn toàn khác'], ['其中一个在说假话', 'một trong hai đang nói dối'], ['学生都不喜欢运动', 'học sinh đều không thích vận động']], correct: 0,
            explEn: '两个标题都没说假话，可是给人的感觉完全不同.', explVi: '两个标题都没说假话，可是给人的感觉完全不同.' },
          { q: '写标题的人想在一两秒里做到什么？', qPinyin: 'Xiě biāo tí de rén xiǎng zài yì liǎng miǎo lǐ zuò dào shén me?',
            qEn: 'What does a headline writer try to achieve in a second or two?', qVi: 'Người viết tiêu đề muốn làm được gì trong một hai giây?',
            options: [['让读者产生一种感觉', 'khiến độc giả nảy sinh một cảm giác'], ['把事情说完整', 'kể trọn vẹn sự việc'], ['写出所有数字', 'viết ra mọi con số']], correct: 0,
            explEn: '他要在这一两秒里让你产生一种感觉：好奇、生气或者担心.', explVi: '他要在这一两秒里让你产生一种感觉：好奇、生气或者担心.' },
          { q: '短文建议读完标题以后先做什么？', qPinyin: 'Duǎn wén jiàn yì dú wán biāo tí yǐ hòu xiān zuò shén me?',
            qEn: 'What does the text advise doing after the headline?', qVi: 'Bài đọc khuyên đọc xong tiêu đề thì làm gì trước?',
            options: [['问自己它想让我有什么感觉', 'tự hỏi nó muốn mình cảm thấy thế nào'], ['马上发给朋友', 'gửi ngay cho bạn bè'], ['先看别的新闻', 'đọc tin khác trước']], correct: 0,
            explEn: '读完标题，先问自己"它想让我有什么感觉".', explVi: '读完标题，先问自己"它想让我有什么感觉".' }
        ]
      },
      {
        titleZh: '一张照片能说明什么',
        titleEn: 'What a photo can prove',
        titleVi: 'Một tấm ảnh chứng minh được gì',
        zh: '照片看起来最可靠，因为它"就在那里"。可是照片只能说明镜头里发生了什么，说明不了镜头外面的事。一张三个人站在空广场上的照片，可能是活动刚开始的时候拍的，也可能是结束以后拍的；同样一场活动，换一个方向、换一个时间，就是完全不同的照片。更常见的情况是照片是真的，只是被放到了另一件事的旁边。所以看到让人吃惊的照片，可以问三个问题：什么时候拍的？在哪儿拍的？前后还发生了什么？这三个问题一问，很多"证据"就没有用了。这不是让人什么都不信，而是提醒我们：看见不等于知道。',
        en: 'Photographs look the most reliable because the thing is simply "there". Yet a photo can only show what happened inside the frame; it says nothing about what was outside it. A picture of three people in an empty square may have been taken just as an event began, or after it ended; the same event, shot from another angle or at another moment, is a completely different image. More common still is a genuine photo that has been placed beside an unrelated story. So when a photo shocks you, three questions help: when was it taken, where, and what happened before and after? Asked those three questions, a great deal of "evidence" falls apart. This is not an argument for believing nothing; it is a reminder that seeing is not the same as knowing.',
        vi: 'Ảnh trông có vẻ đáng tin nhất, vì nó "ở ngay đó". Nhưng ảnh chỉ chứng minh được điều xảy ra trong khung hình, không nói được gì về những gì ngoài khung. Một tấm ảnh ba người đứng giữa quảng trường trống có thể chụp lúc hoạt động vừa bắt đầu, cũng có thể chụp sau khi đã kết thúc; cùng một sự kiện, đổi hướng chụp, đổi thời điểm là ra một khung hình hoàn toàn khác. Thường gặp hơn nữa là bản thân tấm ảnh có thật, chỉ là bị đặt cạnh một câu chuyện khác. Vậy nên khi thấy tấm ảnh gây sửng sốt, có thể hỏi ba câu: chụp lúc nào? chụp ở đâu? trước và sau đó còn xảy ra gì? Hỏi xong ba câu ấy, rất nhiều "bằng chứng" không còn đứng vững. Đây không phải là bảo người ta đừng tin gì cả, mà là nhắc chúng ta: nhìn thấy không đồng nghĩa với biết.',
        questions: [
          { q: '短文说照片只能说明什么？', qPinyin: 'Duǎn wén shuō zhào piàn zhǐ néng shuō míng shén me?',
            qEn: 'What can a photo show, according to the text?', qVi: 'Bài đọc nói ảnh chỉ chứng minh được gì?',
            options: [['镜头里发生了什么', 'điều xảy ra trong khung hình'], ['整件事的原因', 'nguyên nhân của cả sự việc'], ['拍照的人的想法', 'suy nghĩ của người chụp']], correct: 0,
            explEn: '照片只能说明镜头里发生了什么，说明不了镜头外面的事.', explVi: '照片只能说明镜头里发生了什么，说明不了镜头外面的事.' },
          { q: '短文说更常见的情况是什么？', qPinyin: 'Duǎn wén shuō gèng cháng jiàn de qíng kuàng shì shén me?',
            qEn: 'What situation does the text call even more common?', qVi: 'Bài đọc nói tình huống thường gặp hơn là gì?',
            options: [['真的照片被放到另一件事旁边', 'ảnh thật bị đặt cạnh một chuyện khác'], ['照片是画出来的', 'ảnh được vẽ ra'], ['照片拍得不清楚', 'ảnh chụp không rõ']], correct: 0,
            explEn: '更常见的情况是照片是真的，只是被放到了另一件事的旁边.', explVi: '更常见的情况是照片是真的，只是被放到了另一件事的旁边.' },
          { q: '"看见不等于知道"这句话的意思是什么？', qPinyin: '"Kàn jiàn bù děng yú zhī dao" zhè jù huà de yì si shì shén me?',
            qEn: 'What does "seeing is not knowing" mean here?', qVi: 'Câu "nhìn thấy không đồng nghĩa với biết" nghĩa là gì?',
            options: [['还要问清楚时间、地点和前后的事', 'còn phải hỏi rõ thời gian, địa điểm và chuyện trước sau'], ['照片都是假的', 'ảnh đều là giả'], ['不应该看新闻', 'không nên đọc tin tức']], correct: 0,
            explEn: 'The three questions are what turn seeing into knowing; the text explicitly rejects believing nothing.', explVi: 'Ba câu hỏi mới biến "nhìn thấy" thành "biết"; bài đọc nói rõ không phải là đừng tin gì cả.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '看的来源___多，判断___可靠。', pinyin: 'Kàn de lái yuán ___ duō, pàn duàn ___ kě kào.',
        options: [['越……越', 'càng…càng'], ['又……又', 'vừa…vừa'], ['一……就', 'hễ…là'], ['虽然……但是', 'tuy…nhưng']], correct: 0,
        explEn: '越……越…… links two things that rise together.', explVi: '越……越…… nối hai điều cùng tăng theo nhau.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '我以为他不同意，___他没看完。', pinyin: 'Wǒ yǐ wéi tā bù tóng yì, ___ tā méi kàn wán.',
        options: [['原来', 'hóa ra'], ['本来', 'vốn dĩ'], ['将来', 'tương lai'], ['后来', 'sau đó']], correct: 0,
        explEn: '原来 marks a realisation that corrects the earlier assumption; 本来 would mean "originally".', explVi: '原来 đánh dấu sự vỡ lẽ, đính chính giả định trước; 本来 lại nghĩa là "vốn dĩ".' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：怎么看出哪些是事实，哪些是观点？ B：___', pinyin: 'A: Zěn me kàn chū nǎ xiē shì shì shí, nǎ xiē shì guān diǎn? B: ___',
        options: [['事实能查，观点不能。', 'Sự thật thì tra được, quan điểm thì không.'], ['新闻越来越多了。', 'Tin tức ngày càng nhiều.'], ['我不看新闻。', 'Mình không đọc tin.'], ['这个网站很有名。', 'Trang này rất nổi tiếng.']], correct: 0,
        explEn: 'The question asks for a way to tell them apart, so the answer must give the criterion.', explVi: 'Câu hỏi hỏi cách phân biệt, nên câu trả lời phải nêu tiêu chí.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '"三成学生每天运动"和"七成学生几乎不运动"是什么关系？', pinyin: '"Sān chéng xué sheng měi tiān yùn dòng" hé "qī chéng xué sheng jī hū bú yùn dòng" de guān xi shì shén me?',
        passage: 1, options: [['说的是同样的事，感觉不同', 'nói về cùng một việc nhưng cảm giác khác nhau'], ['一个是事实，一个是假的', 'một cái là sự thật, một cái là giả'], ['两个数字互相不同', 'hai con số khác nhau'], ['两个都是观点', 'cả hai đều là quan điểm']], correct: 0,
        explEn: 'Both describe the same survey; 两个标题都没说假话，可是给人的感觉完全不同.', explVi: 'Cả hai đều mô tả cùng một khảo sát; 两个标题都没说假话，可是给人的感觉完全不同.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第二篇短文，作者认为照片里的东西都不能相信。', pinyin: 'Gēn jù dì èr piān duǎn wén, zuò zhě rèn wéi zhào piàn lǐ de dōng xi dōu bù néng xiāng xìn.',
        isTrue: false, passage: 2,
        explEn: '这不是让人什么都不信，而是提醒我们：看见不等于知道.', explVi: '这不是让人什么都不信，而是提醒我们：看见不等于知道.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '你 / 先 / 查一查 / 这条消息的 / 来源', pinyin: 'nǐ / xiān / chá yi chá / zhè tiáo xiāo xi de / lái yuán',
        answer: '你先查一查这条消息的来源。', answerVi: 'Bạn hãy tra thử nguồn của tin này trước.',
        options: [['你', 'bạn'], ['先', 'trước'], ['查一查', 'tra thử'], ['这条消息的', 'của tin này'], ['来源', 'nguồn']],
        explEn: '查一查 softens the action, and the object follows the reduplicated verb.', explVi: '查一查 làm nhẹ hành động, tân ngữ đứng sau động từ lặp.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么正文常常比标题完整？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me zhèng wén cháng cháng bǐ biāo tí wán zhěng?',
        passage: 1, options: [['标题只有一两秒的时间，要先引起感觉', 'tiêu đề chỉ có một hai giây nên phải gây cảm giác trước'], ['正文是另一个人写的', 'phần chính do người khác viết'], ['标题总是写错', 'tiêu đề luôn viết sai'], ['正文没有观点', 'phần chính không có quan điểm']], correct: 0,
        explEn: 'The headline must create an emotion in a second; the body carries the figures and dates.', explVi: 'Tiêu đề phải tạo cảm xúc trong một giây; phần chính mới chứa con số và mốc thời gian.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，看到吃惊的照片应该先问什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, kàn dào chī jīng de zhào piàn yīng gāi xiān wèn shén me?',
        passage: 2, options: [['什么时候、在哪儿拍的，前后发生了什么', 'chụp lúc nào, ở đâu, trước sau xảy ra gì'], ['是谁拍的照片', 'ai là người chụp'], ['照片清楚不清楚', 'ảnh rõ hay không'], ['有多少人看过', 'bao nhiêu người đã xem']], correct: 0,
        explEn: '可以问三个问题：什么时候拍的？在哪儿拍的？前后还发生了什么？', explVi: '可以问三个问题：什么时候拍的？在哪儿拍的？前后还发生了什么？' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B举了哪个例子说明什么是观点？', pinyin: 'B jǔ le nǎ ge lì zi shuō míng shén me shì guān diǎn?',
        line: 8, options: [['"太晚了"', '"muộn quá"'], ['"三点开始"', '"bắt đầu lúc ba giờ"'], ['"很多人参加"', '"nhiều người tham gia"'], ['"新闻很长"', '"bản tin rất dài"']], correct: 0,
        explEn: 'B says: "三点开始"是事实，"太晚了"是观点.', explVi: 'B nói: "三点开始"是事实，"太晚了"是观点.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么说越想马上发的越要先放一放？', pinyin: 'B wèi shén me shuō yuè xiǎng mǎ shàng fā de yuè yào xiān fàng yi fàng?',
        line: 12, options: [['假消息就是靠这个传开的', 'tin giả lan đi chính nhờ điều đó'], ['因为发消息要花钱', 'vì gửi tin tốn tiền'], ['因为朋友不喜欢看', 'vì bạn bè không thích xem'], ['因为晚上不能发消息', 'vì buổi tối không gửi tin được']], correct: 0,
        explEn: 'B says: 假消息就是靠这个传开的.', explVi: 'B nói: 假消息就是靠这个传开的.' }
    ]
  },

  'hsk4-l12-standard-career': {
    titleZh: '职业发展',
    titleEn: 'Career development',
    titleVi: 'Phát triển nghề nghiệp',
    summaryEn: 'Someone two years into a job thinks about the next step: what to want, how to build experience, testing a change before making it, and what a good decision looks like.',
    summaryVi: 'Người đi làm hai năm nghĩ về bước tiếp theo: muốn gì, tích lũy kinh nghiệm thế nào, thử trước khi đổi, và một quyết định tốt trông ra sao.',
    lines: [
      ['A', '怎么知道现在这份工作还值不值得做下去？', 'Zěn me zhī dao xiàn zài zhè fèn gōng zuò hái zhí bu zhí de zuò xià qù?',
        'How do I know whether this job is still worth staying in?',
        'Làm sao biết công việc hiện tại còn đáng làm tiếp hay không?'],
      ['B', '看两点：这一年学到了什么，明年还能学到什么。', 'Kàn liǎng diǎn: zhè yì nián xué dào le shén me, míng nián hái néng xué dào shén me.',
        'Look at two things: what you learned this year, and what you could still learn next year.',
        'Xem hai điểm: năm nay đã học được gì, sang năm còn học được gì.'],
      ['A', '要是两个答案都不太好呢？', 'Yào shi liǎng gè dá àn dōu bú tài hǎo ne?',
        'What if neither answer is good?',
        'Nếu cả hai câu trả lời đều không ổn thì sao?'],
      ['B', '那就该动了，不过先别离开现在的工作，可以一边工作一边试试别的方向。', 'Nà jiù gāi dòng le, bú guò xiān bié lí kāi xiàn zài de gōng zuò, kě yǐ yì biān gōng zuò yì biān shì shi bié de fāng xiàng.',
        'Then it is time to move — but do not leave your current job first; try another direction while still working.',
        'Vậy thì nên chuyển, nhưng khoan rời công việc hiện tại, có thể vừa làm vừa thử hướng khác.'],
      ['A', '换方向是不是等于重新开始？', 'Huàn fāng xiàng shì bu shì děng yú chóng xīn kāi shǐ?',
        'Does changing direction mean starting from scratch?',
        'Đổi hướng có phải là bắt đầu lại từ đầu không?'],
      ['B', '不一定，很多能力在哪儿都用得上，比如交流、写作和解决问题。', 'Bù yí dìng, hěn duō néng lì zài nǎr dōu yòng de shàng, bǐ rú jiāo liú, xiě zuò hé jiě jué wèn tí.',
        'Not necessarily — many abilities carry over: communicating, writing, solving problems.',
        'Chưa chắc, nhiều năng lực dùng chung được, ví dụ giao tiếp, viết lách và giải quyết vấn đề.'],
      ['A', '这样想，压力小多了。', 'Zhè yàng xiǎng, yā lì xiǎo duō le.',
        'Thinking of it that way, the pressure is much smaller.',
        'Nghĩ vậy thì áp lực nhẹ hơn nhiều.'],
      ['B', '一个决定好不好，不看结果，看你当时有没有认真了解情况。', 'Yí gè jué dìng hǎo bu hǎo, bú kàn jié guǒ, kàn nǐ dāng shí yǒu méi yǒu rèn zhēn liǎo jiě qíng kuàng.',
        'A decision is judged not by its outcome but by whether you looked into the situation seriously at the time.',
        'Quyết định hay dở không nhìn kết quả, mà nhìn lúc đó bạn có nghiêm túc tìm hiểu tình hình không.']
    ],
    vocab: [['职业', 'zhí yè'], ['发展', 'fā zhǎn'], ['经验', 'jīng yàn'], ['积累', 'jī lěi'], ['机会', 'jī huì'],
      ['风险', 'fēng xiǎn'], ['决定', 'jué dìng'], ['能力', 'néng lì'], ['优点', 'yōu diǎn'], ['缺点', 'quē diǎn'],
      ['简历', 'jiǎn lì'], ['面试', 'miàn shì'], ['工资', 'gōng zī'], ['部门', 'bù mén'], ['稳定', 'wěn dìng'],
      ['收入', 'shōu rù'], ['方向', 'fāng xiàng']],
    grammar: [
      {
        pattern: '值不值得 + 动词',
        explEn: 'The A-not-A question form of 值得. The verb phrase follows the whole 值不值得 unit, not just 值得.',
        explVi: 'Dạng nghi vấn A-không-A của 值得. Cụm động từ đứng sau cả khối 值不值得, không tách rời.',
        examples: [
          ['这份工作还值不值得做下去？', 'Zhè fèn gōng zuò hái zhí bu zhí de zuò xià qù?', 'Is this job still worth staying in?', 'Công việc này còn đáng làm tiếp không?'],
          ['这个机会值不值得等？', 'Zhè ge jī huì zhí bu zhí de děng?', 'Is this opportunity worth waiting for?', 'Cơ hội này có đáng chờ không?'],
          ['先想清楚值不值得，再决定。', 'Xiān xiǎng qīng chu zhí bu zhí de, zài jué dìng.', 'Work out whether it is worth it, then decide.', 'Nghĩ rõ có đáng hay không rồi hãy quyết.']
        ]
      },
      {
        pattern: '一边……一边……',
        explEn: 'Two actions carried on together by one subject over a period. Each 一边 stands before its own verb phrase.',
        explVi: 'Hai hành động do cùng một chủ thể tiến hành song song trong một khoảng thời gian. Mỗi 一边 đứng trước cụm động từ của mình.',
        examples: [
          ['可以一边工作一边试试别的方向。', 'Kě yǐ yì biān gōng zuò yì biān shì shi bié de fāng xiàng.', 'You can try another direction while still working.', 'Có thể vừa làm việc vừa thử hướng khác.'],
          ['他一边上班一边准备考试。', 'Tā yì biān shàng bān yì biān zhǔn bèi kǎo shì.', 'He works and prepares for an exam at the same time.', 'Anh ấy vừa đi làm vừa ôn thi.'],
          ['一边积累经验，一边留意机会。', 'Yì biān jī lěi jīng yàn, yì biān liú yì jī huì.', 'Build experience while keeping an eye out for opportunities.', 'Vừa tích lũy kinh nghiệm vừa để ý cơ hội.']
        ]
      },
      {
        pattern: '不看……，看……',
        explEn: 'Rejects one standard and names the right one. Both halves take the same kind of object, and 不看 comes first.',
        explVi: 'Bác bỏ một tiêu chuẩn và nêu tiêu chuẩn đúng. Hai vế nhận cùng loại tân ngữ, 不看 đứng trước.',
        examples: [
          ['一个决定好不好，不看结果，看当时了解了多少情况。', 'Yí gè jué dìng hǎo bu hǎo, bú kàn jié guǒ, kàn dāng shí liǎo jiě le duō shǎo qíng kuàng.', 'A decision is judged not by its outcome but by how much was understood at the time.', 'Một quyết định hay dở không nhìn kết quả mà nhìn lúc đó đã hiểu được bao nhiêu tình hình.'],
          ['选工作不看工资，看能不能学到东西。', 'Xuǎn gōng zuò bú kàn gōng zī, kàn néng bu néng xué dào dōng xi.', 'Choose a job not by the salary but by whether you can learn.', 'Chọn việc không nhìn lương mà nhìn có học được gì không.'],
          ['面试不看你说了什么，看你举了什么例子。', 'Miàn shì bú kàn nǐ shuō le shén me, kàn nǐ jǔ le shén me lì zi.', 'An interview turns not on what you say but on the examples you give.', 'Phỏng vấn không nhìn bạn nói gì mà nhìn bạn nêu ví dụ nào.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '经验是怎么积累的',
        titleEn: 'How experience actually builds',
        titleVi: 'Kinh nghiệm được tích lũy thế nào',
        zh: '很多人以为工作五年就自然有了五年经验，其实常常是把一年的经验重复了五次。真正的积累有两个条件：一是做过不同的事，二是每次做完都停下来想一想。第一个条件靠机会，可以主动争取：帮别的部门做一件小事，或者接一个自己没做过的任务。第二个条件完全靠自己：一件事做完，用十分钟写下三句话——哪里做得好、哪里下次要改、下次遇到同样的情况我会怎么做。写的人和不写的人，一年以后很不一样。面试的时候这一点特别清楚：有人只能说"我做过这个项目"，有人能说出当时的选择和原因。这样的经验，才是可以带走的。',
        en: 'Many people assume five years at work automatically means five years of experience, when it is often one year repeated five times. Real accumulation has two conditions: doing different things, and stopping to reflect after each. The first depends on opportunity and can be pursued: do a small job for another department, or take on a task you have never done. The second depends entirely on you: when something is finished, spend ten minutes writing three sentences — what went well, what to change next time, and what you would do facing the same situation again. A year on, the gap between those who write and those who do not is large. It shows most clearly in interviews: some can only say "I worked on that project", while others can name the choices they made and why. The second kind of experience is the kind you can take with you.',
        vi: 'Nhiều người tưởng làm việc năm năm thì tự nhiên có năm năm kinh nghiệm, thật ra thường là lặp lại kinh nghiệm của một năm tới năm lần. Sự tích lũy thật sự cần hai điều kiện: một là đã làm những việc khác nhau, hai là mỗi lần làm xong đều dừng lại suy nghĩ. Điều kiện thứ nhất dựa vào cơ hội và có thể chủ động giành lấy: giúp bộ phận khác làm một việc nhỏ, hoặc nhận một nhiệm vụ mình chưa từng làm. Điều kiện thứ hai hoàn toàn dựa vào bản thân: làm xong một việc, dành mười phút viết ra ba câu – chỗ nào làm tốt, chỗ nào lần sau phải sửa, lần sau gặp tình huống tương tự mình sẽ làm thế nào. Người có viết và người không viết, một năm sau khác nhau rất nhiều. Khi phỏng vấn điều này đặc biệt rõ: có người chỉ nói được "tôi từng làm dự án này", có người nói ra được lựa chọn lúc đó và lý do. Kinh nghiệm của người sau mới là thứ mang đi được.',
        questions: [
          { q: '短文说"五年经验"常常是什么？', qPinyin: 'Duǎn wén shuō "wǔ nián jīng yàn" cháng cháng shì shén me?',
            qEn: 'What does the text say "five years of experience" often is?', qVi: 'Bài đọc nói "năm năm kinh nghiệm" thường là gì?',
            options: [['把一年的经验重复了五次', 'lặp lại kinh nghiệm một năm tới năm lần'], ['五个不同的工作', 'năm công việc khác nhau'], ['五年的工资', 'lương của năm năm']], correct: 0,
            explEn: '其实常常是把一年的经验重复了五次.', explVi: '其实常常是把一年的经验重复了五次.' },
          { q: '第二个条件要求做什么？', qPinyin: 'Dì èr gè tiáo jiàn yāo qiú zuò shén me?',
            qEn: 'What does the second condition require?', qVi: 'Điều kiện thứ hai yêu cầu làm gì?',
            options: [['做完停下来写三句话', 'làm xong thì dừng lại viết ba câu'], ['每年换一次工作', 'mỗi năm đổi việc một lần'], ['多参加面试', 'đi phỏng vấn nhiều']], correct: 0,
            explEn: '一件事做完，用十分钟写下三句话.', explVi: '一件事做完，用十分钟写下三句话.' },
          { q: '面试时两种人的不同在哪里？', qPinyin: 'Miàn shì shí liǎng zhǒng rén de bù tóng zài nǎ lǐ?',
            qEn: 'What distinguishes the two kinds of candidate in an interview?', qVi: 'Khi phỏng vấn, hai kiểu người khác nhau ở chỗ nào?',
            options: [['能不能说出当时的选择和原因', 'có nói ra được lựa chọn lúc đó và lý do không'], ['工作了几年', 'đã làm việc mấy năm'], ['简历写得长不长', 'hồ sơ viết dài hay ngắn']], correct: 0,
            explEn: '有人只能说"我做过这个项目"，有人能说出当时的选择和原因.', explVi: '有人只能说"我做过这个项目"，有人能说出当时的选择和原因.' }
        ]
      },
      {
        titleZh: '换工作以前可以先做的事',
        titleEn: 'What to do before changing jobs',
        titleVi: 'Những việc nên làm trước khi đổi việc',
        zh: '想换方向的时候，最危险的做法是先离开现在的工作再想。比较稳的办法是用三个月去试一试这个新方向。第一步是找三个已经在做这件事的人聊一聊，问他们最不喜欢这份工作的哪一点——好的部分网上都能看到，难的部分只有人会告诉你。第二步是用业余时间做一件小的、真实的事：写一篇东西、帮朋友做一个小项目。做过以后你会发现，自己喜欢的可能是想象中的样子，也可能是真的喜欢。第三步才是准备简历和面试。这样走一遍，最坏的结果也只是多了一种能力，而不是丢了收入又没找到方向。',
        en: 'When you want to change direction, the riskiest move is to resign first and think later. A steadier approach treats the new direction as a hypothesis to be tested over three months. Step one: talk to three people already doing it and ask what they like least about the work — the good parts are all online, but only a person will tell you the hard parts. Step two: use spare time to do one small, real thing — write a piece, help a friend with a small project. Having done it, you will discover whether what you liked was the imagined version or the thing itself. Only step three is preparing a CV and interviews. Walk through it this way and the worst outcome is one more skill, rather than lost income and no direction found.',
        vi: 'Khi muốn đổi hướng, cách làm nguy hiểm nhất là nghỉ việc trước rồi mới nghĩ. Cách chắc chắn hơn là coi hướng mới như một giả định cần kiểm chứng, dùng ba tháng để thử. Bước một là tìm ba người đang làm việc đó để trò chuyện, hỏi họ ghét nhất điểm nào của công việc này – phần hay thì trên mạng đều xem được, phần khó thì chỉ có người mới nói cho bạn. Bước hai là dùng thời gian rảnh làm một việc nhỏ nhưng có thật: viết một bài, giúp bạn bè làm một dự án nhỏ. Làm rồi bạn sẽ phát hiện thứ mình thích có thể chỉ là hình dung trong tưởng tượng, mà cũng có thể là thích thật. Bước ba mới là chuẩn bị hồ sơ và phỏng vấn. Đi trọn một vòng như vậy thì kết quả tệ nhất cũng chỉ là có thêm một kỹ năng, chứ không phải mất thu nhập mà vẫn chưa tìm ra hướng.',
        questions: [
          { q: '短文认为最危险的做法是什么？', qPinyin: 'Duǎn wén rèn wéi zuì wēi xiǎn de zuò fǎ shì shén me?',
            qEn: 'What does the text call the riskiest move?', qVi: 'Bài đọc cho rằng cách làm nguy hiểm nhất là gì?',
            options: [['先离开现在的工作再想', 'rời công việc hiện tại trước rồi mới nghĩ'], ['一边工作一边试', 'vừa làm vừa thử'], ['先准备简历', 'chuẩn bị hồ sơ trước']], correct: 0,
            explEn: '最危险的做法是先离开现在的工作再想.', explVi: '最危险的做法是先离开现在的工作再想.' },
          { q: '为什么要问别人最不喜欢这份工作的哪一点？', qPinyin: 'Wèi shén me yào wèn bié rén zuì bù xǐ huan zhè fèn gōng zuò de nǎ yì diǎn?',
            qEn: 'Why ask what people like least about the work?', qVi: 'Vì sao phải hỏi người ta ghét nhất điểm nào của công việc?',
            options: [['难的部分只有人会告诉你', 'phần khó thì chỉ có người mới nói cho bạn'], ['因为好的部分不重要', 'vì phần hay không quan trọng'], ['为了让对方帮你介绍工作', 'để họ giới thiệu việc cho bạn']], correct: 0,
            explEn: '好的部分网上都能看到，难的部分只有人会告诉你.', explVi: '好的部分网上都能看到，难的部分只有人会告诉你.' },
          { q: '按短文的办法，最坏的结果是什么？', qPinyin: 'Àn duǎn wén de bàn fǎ, zuì huài de jié guǒ shì shén me?',
            qEn: 'Following the text\'s method, what is the worst outcome?', qVi: 'Theo cách của bài đọc, kết quả tệ nhất là gì?',
            options: [['多了一种能力', 'có thêm một năng lực'], ['丢了收入', 'mất thu nhập'], ['找不到方向', 'không tìm ra hướng đi']], correct: 0,
            explEn: '最坏的结果也只是多了一种能力.', explVi: '最坏的结果也只是多了一种能力.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '这个机会___等？', pinyin: 'Zhè ge jī huì ___ děng?',
        options: [['值不值得', 'có đáng hay không'], ['值得不', 'đáng không'], ['不值得', 'không đáng'], ['值得了', 'đáng rồi']], correct: 0,
        explEn: 'The A-not-A form is 值不值得, with the verb following the whole unit.', explVi: 'Dạng A-không-A là 值不值得, động từ đứng sau cả khối.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '他___上班___准备考试。', pinyin: 'Tā ___ shàng bān ___ zhǔn bèi kǎo shì.',
        options: [['一边……一边', 'vừa…vừa'], ['一……就', 'hễ…là'], ['越……越', 'càng…càng'], ['因为……所以', 'vì…nên']], correct: 0,
        explEn: '一边……一边…… marks two actions carried on together.', explVi: '一边……一边…… diễn tả hai hành động tiến hành song song.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：换方向是不是等于重新开始？ B：___', pinyin: 'A: Huàn fāng xiàng shì bu shì děng yú chóng xīn kāi shǐ? B: ___',
        options: [['不一定，很多能力在哪儿都用得上。', 'Chưa chắc, nhiều năng lực ở đâu cũng dùng được.'], ['我上个月换了工作。', 'Tháng trước mình đổi việc rồi.'], ['工资比较高。', 'Lương khá cao.'], ['面试在星期三。', 'Phỏng vấn vào thứ Tư.']], correct: 0,
        explEn: 'The question is whether a change means starting over, so the answer must address transferable ability.', explVi: 'Câu hỏi là đổi hướng có phải làm lại từ đầu, nên câu trả lời phải nói về năng lực dùng chung.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第一篇短文，为什么有人工作五年却没有五年经验？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me yǒu rén gōng zuò wǔ nián què méi yǒu wǔ nián jīng yàn?',
        passage: 1, options: [['做的事一直一样，也没有停下来想', 'việc làm luôn giống nhau, cũng không dừng lại suy nghĩ'], ['因为公司太小', 'vì công ty quá nhỏ'], ['因为工资太低', 'vì lương quá thấp'], ['因为没有参加面试', 'vì chưa đi phỏng vấn']], correct: 0,
        explEn: 'Real accumulation needs 做过不同的事 and 每次做完都停下来想一想.', explVi: 'Tích lũy thật sự cần 做过不同的事 và 每次做完都停下来想一想.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第二篇短文，想换方向应该先离开现在的工作。', pinyin: 'Gēn jù dì èr piān duǎn wén, xiǎng huàn fāng xiàng yīng gāi xiān lí kāi xiàn zài de gōng zuò.',
        isTrue: false, passage: 2,
        explEn: '最危险的做法是先离开现在的工作再想.', explVi: '最危险的做法是先离开现在的工作再想.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '选工作 / 不看 / 工资 / 看 / 能不能学到东西', pinyin: 'xuǎn gōng zuò / bú kàn / gōng zī / kàn / néng bu néng xué dào dōng xi',
        answer: '选工作不看工资，看能不能学到东西。', answerVi: 'Chọn việc không nhìn lương mà nhìn có học được gì không.',
        options: [['选工作', 'chọn việc'], ['不看', 'không nhìn'], ['工资', 'lương'], ['看', 'nhìn'], ['能不能学到东西', 'có học được gì không']],
        explEn: 'The rejected standard comes after 不看 and the right one after 看.', explVi: 'Tiêu chuẩn bị bác bỏ đứng sau 不看, tiêu chuẩn đúng đứng sau 看.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，什么样的经验"可以带走"？', pinyin: 'Gēn jù dì yī piān duǎn wén, shén me yàng de jīng yàn "kě yǐ dài zǒu"?',
        passage: 1, options: [['能说清当时的选择和原因的', 'loại nói rõ được lựa chọn lúc đó và lý do'], ['在大公司做过的', 'từng làm ở công ty lớn'], ['时间最长的', 'có thời gian dài nhất'], ['工资最高的', 'lương cao nhất']], correct: 0,
        explEn: 'The text contrasts naming a project with explaining the choices; 这样的经验，才是可以带走的.', explVi: 'Bài đọc đối lập việc kể tên dự án với việc giải thích lựa chọn; 这样的经验，才是可以带走的.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，第二步要做什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, dì èr bù yào zuò shén me?',
        passage: 2, options: [['用业余时间做一件小的、真实的事', 'dùng thời gian rảnh làm một việc nhỏ có thật'], ['马上准备简历', 'chuẩn bị hồ sơ ngay'], ['找三个人聊一聊', 'tìm ba người trò chuyện'], ['先去面试', 'đi phỏng vấn trước']], correct: 0,
        explEn: '第二步是用业余时间做一件小的、真实的事.', explVi: '第二步是用业余时间做一件小的、真实的事.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B说判断工作值不值得做要看哪两点？', pinyin: 'B shuō pàn duàn gōng zuò zhí bu zhí de zuò yào kàn nǎ liǎng diǎn?',
        line: 8, options: [['这一年学到了什么，明年还能学到什么', 'năm nay học được gì, sang năm còn học được gì'], ['工资和部门', 'lương và bộ phận'], ['同事和老板', 'đồng nghiệp và sếp'], ['公司大不大', 'công ty lớn hay không']], correct: 0,
        explEn: 'B says: 看两点：这一年学到了什么，明年还能学到什么.', explVi: 'B nói: 看两点：这一年学到了什么，明年还能学到什么.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为怎么判断一个决定好不好？', pinyin: 'B rèn wéi zěn me pàn duàn yí gè jué dìng hǎo bu hǎo?',
        line: 14, options: [['看当时有没有认真了解情况', 'xem lúc đó có nghiêm túc tìm hiểu tình hình không'], ['看最后的结果', 'xem kết quả cuối cùng'], ['看别人怎么说', 'xem người khác nói thế nào'], ['看用了多长时间', 'xem mất bao nhiêu thời gian']], correct: 0,
        explEn: 'B says: 一个决定好不好，不看结果，看你当时有没有认真了解情况.', explVi: 'B nói: 一个决定好不好，不看结果，看你当时有没有认真了解情况.' }
    ]
  }
};
