// HSK5 (C1) lessons 12-13. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l12-standard-art-review': {
    titleZh: '谈一件作品',
    titleEn: 'Talking about a work',
    titleVi: 'Bàn về một tác phẩm',
    summaryEn: 'What makes a view "reasoned", why a review that only praises stops being believed, and how to name a weakness without attacking the person who made it.',
    summaryVi: 'Thế nào là một cách nhìn "có lý lẽ", vì sao bài bình chỉ khen thì hết được tin, và cách chỉ ra điểm yếu mà không công kích người làm ra nó.',
    lines: [
      ['A', '那"有理由"是什么样的？', 'Nà "yǒu lǐ yóu" shì shén me yàng de?',
        'So what does "reasoned" look like?',
        'Vậy "có lý lẽ" là như thế nào?'],
      ['B', '说出你在作品里看到的具体东西，再说它让你想到什么。', 'Shuō chū nǐ zài zuò pǐn lǐ kàn dào de jù tǐ dōng xi, zài shuō tā ràng nǐ xiǎng dào shén me.',
        'Name the concrete things you see in the work, then say what they make you think of.',
        'Nói ra những thứ cụ thể bạn thấy trong tác phẩm, rồi nói nó khiến bạn nghĩ đến gì.'],
      ['A', '如果我看到的和作者想说的不一样呢？', 'Rú guǒ wǒ kàn dào de hé zuò zhě xiǎng shuō de bù yí yàng ne?',
        'What if what I see differs from what the artist meant?',
        'Nếu điều mình thấy khác với điều tác giả muốn nói thì sao?'],
      ['B', '那也是有效的，只要你能指出画面上支持你的部分。', 'Nà yě shì yǒu xiào de, zhǐ yào nǐ néng zhǐ chū huà miàn shàng zhī chí nǐ de bù fen.',
        'That still counts, as long as you can point to the part of the image that supports you.',
        'Vẫn có giá trị, miễn là bạn chỉ ra được phần trong bức tranh ủng hộ cách nhìn của bạn.'],
      ['A', '评论一定要说缺点吗？', 'Píng lùn yí dìng yào shuō quē diǎn ma?',
        'Does a review have to mention flaws?',
        'Bình luận nhất định phải nói khuyết điểm à?'],
      ['B', '不一定，但只夸不说问题的评论，读者很快就不信了。', 'Bù yí dìng, dàn zhǐ kuā bù shuō wèn tí de píng lùn, dú zhě hěn kuài jiù bú xìn le.',
        'Not necessarily, but a review that only praises soon stops being believed.',
        'Không nhất thiết, nhưng bài bình chỉ khen mà không nói vấn đề thì độc giả nhanh chóng không tin nữa.'],
      ['A', '那怎么说缺点才不伤人？', 'Nà zěn me shuō quē diǎn cái bù shāng rén?',
        'Then how do you name a flaw without wounding?',
        'Vậy nói khuyết điểm thế nào mới không làm tổn thương người ta?'],
      ['B', '说作品哪里没做到它自己想做的，而不是说作者水平不够。', 'Shuō zuò pǐn nǎ lǐ méi zuò dào tā zì jǐ xiǎng zuò de, ér bú shì shuō zuò zhě shuǐ píng bú gòu.',
        'Say where the work falls short of what it set out to do, not that the artist lacks skill.',
        'Nói tác phẩm chưa làm được điều chính nó muốn làm ở chỗ nào, chứ không nói tác giả trình độ kém.']
    ],
    vocab: [['艺术', 'yì shù'], ['作品', 'zuò pǐn'], ['主题', 'zhǔ tí'], ['技巧', 'jì qiǎo'], ['感受', 'gǎn shòu'],
      ['欣赏', 'xīn shǎng'], ['评论', 'píng lùn'], ['风格', 'fēng gé'], ['色彩', 'sè cǎi'], ['想象', 'xiǎng xiàng'],
      ['表现', 'biǎo xiàn'], ['观众', 'guān zhòng'], ['创作', 'chuàng zuò'], ['细节', 'xì jié'], ['情感', 'qíng gǎn'],
      ['角度', 'jiǎo dù'], ['独特', 'dú tè'], ['描写', 'miáo xiě']],
    grammar: [
      {
        pattern: '只要……（就）……',
        explEn: 'States the one condition that suffices. 只要 marks it, and 就 opens the result; unlike 只有……才, it says the condition is enough, not that it is the only one.',
        explVi: 'Nêu điều kiện duy nhất là đủ. 只要 đánh dấu điều kiện, 就 mở ra kết quả; khác với 只有……才, nó nói điều kiện là đủ chứ không phải là duy nhất.',
        examples: [
          ['那也是有效的，只要你能指出画面上支持你的部分。', 'Nà yě shì yǒu xiào de, zhǐ yào nǐ néng zhǐ chū huà miàn shàng zhī chí nǐ de bù fen.', 'That counts, as long as you can point to the supporting part of the image.', 'Vẫn có giá trị, miễn là bạn chỉ ra được phần ủng hộ mình trong bức tranh.'],
          ['只要说出具体的细节，看法就站得住。', 'Zhǐ yào shuō chū jù tǐ de xì jié, kàn fǎ jiù zhàn de zhù.', 'As long as you name concrete details, the view holds up.', 'Miễn là nêu được chi tiết cụ thể thì cách nhìn sẽ đứng vững.'],
          ['只要多看几次，感受就会变。', 'Zhǐ yào duō kàn jǐ cì, gǎn shòu jiù huì biàn.', 'Look a few more times and the feeling changes.', 'Chỉ cần xem thêm vài lần thì cảm nhận sẽ đổi.']
        ]
      },
      {
        pattern: '只A不B',
        explEn: 'Two verbs set against each other to say one side is done and the other left out. Both take the same subject and the pair usually carries criticism.',
        explVi: 'Hai động từ đặt đối nhau để nói chỉ làm một bên và bỏ qua bên kia. Cả hai cùng chủ ngữ và cặp này thường mang ý phê phán.',
        examples: [
          ['只夸不说问题的评论，读者很快就不信了。', 'Zhǐ kuā bù shuō wèn tí de píng lùn, dú zhě hěn kuài jiù bú xìn le.', 'A review that only praises soon stops being believed.', 'Bài bình chỉ khen mà không nói vấn đề thì độc giả nhanh chóng hết tin.'],
          ['他只看技巧不看情感。', 'Tā zhǐ kàn jì qiǎo bú kàn qíng gǎn.', 'He looks only at technique, not at feeling.', 'Anh ấy chỉ nhìn kỹ thuật mà không nhìn cảm xúc.'],
          ['只说风格不说主题，评论就空了。', 'Zhǐ shuō fēng gé bù shuō zhǔ tí, píng lùn jiù kōng le.', 'Discuss style without theme and the review is empty.', 'Chỉ nói phong cách mà không nói chủ đề thì bài bình rỗng.']
        ]
      },
      {
        pattern: '动词 + 出',
        explEn: 'A result complement marking something brought into view from where it was hidden — a thought said out, a detail picked out. It often takes 来 after the object.',
        explVi: 'Bổ ngữ kết quả đánh dấu điều gì đó được đưa ra khỏi chỗ khuất — một ý được nói ra, một chi tiết được chỉ ra. Thường thêm 来 sau tân ngữ.',
        examples: [
          ['说出你在作品里看到的具体东西。', 'Shuō chū nǐ zài zuò pǐn lǐ kàn dào de jù tǐ dōng xi.', 'Name the concrete things you see in the work.', 'Nói ra những thứ cụ thể bạn thấy trong tác phẩm.'],
          ['他一眼就看出了这幅画的问题。', 'Tā yì yǎn jiù kàn chū le zhè fú huà de wèn tí.', 'He spotted the painting\'s problem at a glance.', 'Anh ấy nhìn một cái đã thấy ra vấn đề của bức tranh.'],
          ['你能指出是哪个细节让你不舒服吗？', 'Nǐ néng zhǐ chū shì nǎ ge xì jié ràng nǐ bù shū fu ma?', 'Can you point out which detail makes you uncomfortable?', 'Bạn chỉ ra được chi tiết nào khiến bạn khó chịu không?']
        ]
      }
    ],
    passages: [
      {
        titleZh: '一篇评论的三层',
        titleEn: 'The three layers of a review',
        titleVi: 'Ba tầng của một bài bình',
        zh: '写一篇评论，可以分三层来走。第一层是描写：画面上到底有什么。左边是一间空房间，光从右上角进来，人物背对着我们。这一层不需要判断，只需要准确，可是很多人跳过它，评论因此变成了自己的感想，别人没办法检查。第二层是分析：这些安排产生了什么效果。人物背对观众，我们看不到表情，只能从他的姿势去猜，画面因此有了距离感。第三层才是判断：这样做值不值得，做到了没有。三层的顺序不能反过来，因为判断必须站在前两层上面。读者可能不同意你的判断，但只要前两层写得准确，他至少知道你为什么这么想——这就是一篇评论和一句"我喜欢"的区别。',
        en: 'A review can be walked through in three layers. The first is description: what is actually there. On the left an empty room, light entering from the top right, the figure turned away from us. This layer calls for no judgement, only accuracy — yet many people skip it, and the review becomes a personal impression nobody can check against anything. The second layer is analysis: what those arrangements produce. With the figure turned away we cannot see the face and must guess from the posture, so the image acquires a sense of distance. Only the third layer judges: was it worth doing, and was it achieved? The order cannot be reversed, because judgement has to stand on the first two layers. A reader may disagree with your verdict, but if the first two layers are accurate they at least know why you think as you do — and that is the difference between a review and the words "I like it".',
        vi: 'Viết một bài bình có thể đi qua ba tầng. Tầng thứ nhất là mô tả: trên bức tranh rốt cuộc có gì. Bên trái là một căn phòng trống, ánh sáng vào từ góc trên bên phải, nhân vật quay lưng về phía chúng ta. Tầng này không cần phán xét, chỉ cần chính xác, nhưng nhiều người bỏ qua nó, và bài bình vì thế biến thành cảm tưởng riêng mà người khác không kiểm chứng được. Tầng thứ hai là phân tích: những sắp đặt ấy tạo ra hiệu quả gì. Nhân vật quay lưng về phía người xem, ta không thấy nét mặt, chỉ có thể đoán qua dáng đứng, bức tranh vì thế có được cảm giác khoảng cách. Tầng thứ ba mới là phán xét: làm như vậy có đáng không, đã làm được chưa. Thứ tự ba tầng không thể đảo ngược, vì phán xét phải đứng trên hai tầng trước. Người đọc có thể không đồng ý với phán xét của bạn, nhưng chỉ cần hai tầng đầu viết chính xác thì ít nhất họ biết vì sao bạn nghĩ thế — đó chính là khác biệt giữa một bài bình và câu "tôi thích".',
        questions: [
          { q: '第一层要求的是什么？', qPinyin: 'Dì yī céng yāo qiú de shì shén me?',
            qEn: 'What does the first layer require?', qVi: 'Tầng thứ nhất đòi hỏi điều gì?',
            options: [['不需要判断，只需要准确', 'không cần phán xét, chỉ cần chính xác'], ['需要说出喜欢还是不喜欢', 'cần nói thích hay không thích'], ['需要分析效果', 'cần phân tích hiệu quả']], correct: 0,
            explEn: '这一层不需要判断，只需要准确.', explVi: '这一层不需要判断，只需要准确.' },
          { q: '跳过第一层会有什么后果？', qPinyin: 'Tiào guò dì yī céng huì yǒu shén me hòu guǒ?',
            qEn: 'What happens if the first layer is skipped?', qVi: 'Bỏ qua tầng thứ nhất thì hậu quả là gì?',
            options: [['评论变成自己的感想，别人没办法检查', 'bài bình thành cảm tưởng riêng, người khác không kiểm chứng được'], ['评论会太长', 'bài bình sẽ quá dài'], ['作者会不高兴', 'tác giả sẽ không vui']], correct: 0,
            explEn: '可是很多人跳过它，评论因此变成了自己的感想，别人没办法检查.', explVi: '可是很多人跳过它，评论因此变成了自己的感想，别人没办法检查.' },
          { q: '三层的顺序为什么不能反过来？', qPinyin: 'Sān céng de shùn xù wèi shén me bù néng fǎn guò lái?',
            qEn: 'Why can the order not be reversed?', qVi: 'Vì sao thứ tự ba tầng không thể đảo ngược?',
            options: [['因为判断必须站在前两层上面', 'vì phán xét phải đứng trên hai tầng trước'], ['因为描写最难写', 'vì mô tả khó viết nhất'], ['因为读者只看开头', 'vì độc giả chỉ đọc mở đầu']], correct: 0,
            explEn: '三层的顺序不能反过来，因为判断必须站在前两层上面.', explVi: '三层的顺序不能反过来，因为判断必须站在前两层上面.' }
        ]
      },
      {
        titleZh: '看不懂的时候',
        titleEn: 'When a work does not land',
        titleVi: 'Khi không hiểu nổi tác phẩm',
        zh: '站在一件作品面前没有感觉，这件事本身不说明什么。可能是作品在跟另一个时代的人说话，那个时代的人一看就懂的东西，今天需要一点背景才能进入；也可能它用的语言你还不熟悉，就像第一次听一种没听过的音乐。所以"看不懂"更准确的说法是"我现在还没有找到进去的门"。有几个办法可以试：先只看一个细节，看足两分钟；再问自己这个细节如果换成别的样子，画面会有什么不同；最后去了解它是在什么情况下创作的。走完这三步还是没有感觉，那就可以放心地说不喜欢——这时候的"不喜欢"是有内容的判断，而不是没看进去的借口。欣赏的能力不是生下来就有的，它更像是看得够多以后长出来的一种耐心。',
        en: 'Standing before a work and feeling nothing says, in itself, very little. The work may be speaking to people of another age, so that what they grasped instantly now needs some background to enter; or it may use a language you are not yet familiar with, like hearing an unfamiliar kind of music for the first time. A more accurate phrasing of "I don\'t get it" is therefore "I have not yet found the door in". Several things are worth trying: look at one detail only, for a full two minutes; then ask what would change in the image if that detail were different; finally, find out under what circumstances it was made. If after all three steps you still feel nothing, you can say with a clear conscience that you dislike it — a dislike with content behind it, rather than an excuse for not having looked. The ability to appreciate is not something you are born with; it is more like a patience that grows once you have seen enough.',
        vi: 'Đứng trước một tác phẩm mà không có cảm giác gì, bản thân chuyện đó chẳng nói lên điều gì mấy. Có thể tác phẩm đang nói chuyện với người của một thời đại khác, thứ mà người thời ấy nhìn là hiểu ngay thì hôm nay cần một chút bối cảnh mới bước vào được; cũng có thể nó dùng thứ ngôn ngữ bạn còn chưa quen, như lần đầu nghe một loại nhạc chưa từng nghe. Vì vậy cách nói chính xác hơn của "không hiểu nổi" là "mình hiện chưa tìm ra cửa để vào". Có mấy cách đáng thử: trước hết chỉ nhìn một chi tiết, nhìn đủ hai phút; rồi tự hỏi nếu chi tiết ấy đổi thành kiểu khác thì bức tranh sẽ khác thế nào; cuối cùng tìm hiểu nó được sáng tác trong hoàn cảnh nào. Đi hết ba bước mà vẫn không có cảm giác thì có thể yên tâm nói là không thích — lúc này "không thích" là một phán đoán có nội dung, chứ không phải cái cớ cho việc chưa nhìn vào. Năng lực thưởng thức không phải sinh ra đã có, nó giống một sự kiên nhẫn mọc ra sau khi đã xem đủ nhiều.',
        questions: [
          { q: '短文认为"看不懂"更准确的说法是什么？', qPinyin: 'Duǎn wén rèn wéi "kàn bù dǒng" gèng zhǔn què de shuō fǎ shì shén me?',
            qEn: 'How should "I don\'t get it" be rephrased?', qVi: 'Bài đọc cho rằng cách nói chính xác hơn của "không hiểu nổi" là gì?',
            options: [['我现在还没有找到进去的门', 'mình hiện chưa tìm ra cửa để vào'], ['这件作品不好', 'tác phẩm này không hay'], ['我没有艺术细胞', 'mình không có năng khiếu nghệ thuật']], correct: 0,
            explEn: '所以"看不懂"更准确的说法是"我现在还没有找到进去的门".', explVi: '所以"看不懂"更准确的说法是"我现在还没有找到进去的门".' },
          { q: '短文建议的第二步是什么？', qPinyin: 'Duǎn wén jiàn yì de dì èr bù shì shén me?',
            qEn: 'What is the second step suggested?', qVi: 'Bước thứ hai bài đọc gợi ý là gì?',
            options: [['问这个细节换成别的样子画面会怎么变', 'hỏi nếu chi tiết ấy đổi kiểu khác thì bức tranh đổi ra sao'], ['去读作者的经历', 'đi đọc trải nghiệm của tác giả'], ['问问旁边的人', 'hỏi người bên cạnh']], correct: 0,
            explEn: '再问自己这个细节如果换成别的样子，画面会有什么不同.', explVi: '再问自己这个细节如果换成别的样子，画面会有什么不同.' },
          { q: '短文怎么看欣赏的能力？', qPinyin: 'Duǎn wén zěn me kàn xīn shǎng de néng lì?',
            qEn: 'How does the text view the ability to appreciate?', qVi: 'Bài đọc nhìn nhận năng lực thưởng thức thế nào?',
            options: [['不是生下来就有的，是看得够多以后长出来的耐心', 'không phải sinh ra đã có, là sự kiên nhẫn mọc ra sau khi xem đủ nhiều'], ['是生下来就有的', 'sinh ra đã có'], ['只有专家才有', 'chỉ chuyên gia mới có']], correct: 0,
            explEn: '欣赏的能力不是生下来就有的，它更像是看得够多以后长出来的一种耐心.', explVi: '欣赏的能力不是生下来就有的，它更像是看得够多以后长出来的一种耐心.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '那也是有效的，___你能指出画面上支持你的部分。', pinyin: 'Nà yě shì yǒu xiào de, ___ nǐ néng zhǐ chū huà miàn shàng zhī chí nǐ de bù fen.',
        options: [['只要', 'miễn là'], ['除非', 'trừ phi'], ['即使', 'cho dù'], ['宁可', 'thà']], correct: 0,
        explEn: '只要 marks the single condition that is enough for the result to hold.', explVi: '只要 đánh dấu điều kiện duy nhất đủ để kết quả thành lập.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '说___你在作品里看到的具体东西。', pinyin: 'Shuō ___ nǐ zài zuò pǐn lǐ kàn dào de jù tǐ dōng xi.',
        options: [['出', 'ra'], ['起', 'lên'], ['成', 'thành'], ['过', 'từng']], correct: 0,
        explEn: '出 marks something brought into view — a thought said out loud.', explVi: '出 đánh dấu điều gì đó được đưa ra chỗ sáng — một ý được nói ra.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那怎么说缺点才不伤人？ B：___', pinyin: 'A: Nà zěn me shuō quē diǎn cái bù shāng rén? B: ___',
        options: [['说作品哪里没做到它自己想做的，而不是说作者水平不够。', 'Nói tác phẩm chưa làm được điều chính nó muốn ở chỗ nào, chứ không nói tác giả kém.'], ['那就别说缺点。', 'Vậy thì đừng nói khuyết điểm.'], ['这幅画很大。', 'Bức tranh này rất lớn.'], ['我明天去看展览。', 'Mai mình đi xem triển lãm.']], correct: 0,
        explEn: 'The question asks how to phrase a criticism, so the answer must give the phrasing.', explVi: 'Câu hỏi hỏi cách diễn đạt lời chê, nên câu trả lời phải đưa ra cách diễn đạt.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，走完三步还是没有感觉，这时的"不喜欢"为什么不一样？', pinyin: 'Gēn jù dì èr piān duǎn wén, zǒu wán sān bù hái shi méi yǒu gǎn jué, zhè shí de "bù xǐ huan" wèi shén me bù yí yàng?',
        passage: 2, options: [['它是有内容的判断，不是没看进去的借口', 'đó là phán đoán có nội dung, không phải cái cớ cho việc chưa nhìn vào'], ['因为花的时间最长', 'vì tốn nhiều thời gian nhất'], ['因为别人也不喜欢', 'vì người khác cũng không thích'], ['因为作品确实不好', 'vì tác phẩm quả thật không hay']], correct: 0,
        explEn: '这时候的"不喜欢"是有内容的判断，而不是没看进去的借口.', explVi: '这时候的"不喜欢"是有内容的判断，而不是没看进去的借口.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，一篇评论可以先下判断，再去描写画面。', pinyin: 'Gēn jù dì yī piān duǎn wén, yì piān píng lùn kě yǐ xiān xià pàn duàn, zài qù miáo xiě huà miàn.',
        isTrue: false, passage: 1,
        explEn: '三层的顺序不能反过来，因为判断必须站在前两层上面.', explVi: '三层的顺序不能反过来，因为判断必须站在前两层上面.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '只说风格 / 不说主题 / 评论 / 就空了', pinyin: 'zhǐ shuō fēng gé / bù shuō zhǔ tí / píng lùn / jiù kōng le',
        answer: '只说风格不说主题，评论就空了。', answerVi: 'Chỉ nói phong cách mà không nói chủ đề thì bài bình rỗng.',
        options: [['只说风格', 'chỉ nói phong cách'], ['不说主题', 'không nói chủ đề'], ['评论', 'bài bình'], ['就空了', 'thành rỗng']],
        explEn: 'The 只A不B pair comes first and the consequence follows with 就.', explVi: 'Cặp 只A不B đứng trước, hệ quả theo sau với 就.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，第二层用了什么例子说明分析？', pinyin: 'Gēn jù dì yī piān duǎn wén, dì èr céng yòng le shén me lì zi shuō míng fēn xī?',
        passage: 1, options: [['人物背对观众，我们只能从姿势去猜，画面因此有距离感', 'nhân vật quay lưng, ta chỉ đoán qua dáng đứng, tranh vì thế có cảm giác khoảng cách'], ['左边有一间空房间', 'bên trái có một căn phòng trống'], ['这幅画值不值得画', 'bức tranh này có đáng vẽ không'], ['读者同不同意', 'độc giả có đồng ý không']], correct: 0,
        explEn: '人物背对观众，我们看不到表情，只能从他的姿势去猜，画面因此有了距离感.', explVi: '人物背对观众，我们看不到表情，只能从他的姿势去猜，画面因此有了距离感.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么没感觉不一定说明你缺少艺术能力？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me méi gǎn jué bù yí dìng shuō míng nǐ quē shǎo yì shù néng lì?',
        passage: 2, options: [['可能它在跟另一个时代的人说话，或者用你还不熟悉的语言', 'có thể nó đang nói với người thời khác, hoặc dùng thứ ngôn ngữ bạn chưa quen'], ['因为艺术都很难懂', 'vì nghệ thuật đều rất khó hiểu'], ['因为感觉不重要', 'vì cảm giác không quan trọng'], ['因为观众总是对的', 'vì người xem luôn đúng']], correct: 0,
        explEn: '可能是作品在跟另一个时代的人说话……也可能它用的语言你还不熟悉.', explVi: '可能是作品在跟另一个时代的人说话……也可能它用的语言你还不熟悉.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说看法和作者想法不同时还成不成立？', pinyin: 'B shuō kàn fǎ hé zuò zhě xiǎng fǎ bù tóng shí hái chéng bu chéng lì?',
        line: 10, options: [['成立，只要能指出画面上支持你的部分', 'thành lập, miễn là chỉ ra được phần trong tranh ủng hộ bạn'], ['不成立，要按作者的意思', 'không thành lập, phải theo ý tác giả'], ['要看观众多不多', 'phải xem người xem có đông không'], ['要问专家', 'phải hỏi chuyên gia']], correct: 0,
        explEn: 'B says: 那也是有效的，只要你能指出画面上支持你的部分.', explVi: 'B nói: 那也是有效的，只要你能指出画面上支持你的部分.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么说只夸的评论没有用？', pinyin: 'B wèi shén me shuō zhǐ kuā de píng lùn méi yǒu yòng?',
        line: 12, options: [['读者很快就不信了', 'độc giả nhanh chóng hết tin'], ['因为作者会骄傲', 'vì tác giả sẽ kiêu'], ['因为写起来太容易', 'vì viết quá dễ'], ['因为字数不够', 'vì không đủ số chữ']], correct: 0,
        explEn: 'B says: 但只夸不说问题的评论，读者很快就不信了.', explVi: 'B nói: 但只夸不说问题的评论，读者很快就不信了.' }
    ]
  },

  'hsk5-l13-standard-review': {
    titleZh: '这一阶段的整理',
    titleEn: 'Consolidating the stage',
    titleVi: 'Ôn tập giai đoạn',
    summaryEn: 'Why "I understood it" is usually an illusion, how comparing two concepts turns isolated points into a network, and why review intervals should grow instead of tightening.',
    summaryVi: 'Vì sao "mình hiểu rồi" thường là ảo tưởng, so sánh hai khái niệm biến các điểm rời rạc thành mạng lưới ra sao, và vì sao khoảng cách ôn tập nên giãn ra chứ không co lại.',
    lines: [
      ['A', '可是我复述完还是觉得记不住。', 'Kě shì wǒ fù shù wán hái shi jué de jì bu zhù.',
        'But even after retelling it I still feel it will not stick.',
        'Nhưng kể lại xong mình vẫn thấy không nhớ nổi.'],
      ['B', '记不住往往是因为知识之间没有联系，单独的点最容易掉。', 'Jì bu zhù wǎng wǎng shì yīn wèi zhī shi zhī jiān méi yǒu lián xì, dān dú de diǎn zuì róng yì diào.',
        'Things fail to stick usually because the knowledge is unconnected — a point on its own falls away most easily.',
        'Không nhớ nổi thường là vì kiến thức không nối với nhau, điểm đứng lẻ dễ rơi rụng nhất.'],
      ['A', '怎么把它们联系起来？', 'Zěn me bǎ tā men lián xì qǐ lái?',
        'How do I connect them?',
        'Làm sao nối chúng lại với nhau?'],
      ['B', '拿两个概念问自己：它们哪里像，哪里不一样。', 'Ná liǎng gè gài niàn wèn zì jǐ: tā men nǎ lǐ xiàng, nǎ lǐ bù yí yàng.',
        'Take two concepts and ask yourself where they are alike and where they differ.',
        'Lấy hai khái niệm ra tự hỏi: chúng giống nhau ở đâu, khác nhau ở đâu.'],
      ['A', '复习应该多久一次？', 'Fù xí yīng gāi duō jiǔ yí cì?',
        'How often should I review?',
        'Bao lâu nên ôn một lần?'],
      ['B', '隔的时间要一次比一次长，太密反而浪费。', 'Gé de shí jiān yào yí cì bǐ yí cì cháng, tài mì fǎn ér làng fèi.',
        'The gaps should grow each time; too tight and you are wasting effort.',
        'Khoảng cách phải lần sau dài hơn lần trước, quá dày lại thành lãng phí.'],
      ['A', '最后一步呢？', 'Zuì hòu yí bù ne?',
        'And the last step?',
        'Còn bước cuối thì sao?'],
      ['B', '找一个真实的问题，用这一阶段学的东西去解决它。', 'Zhǎo yí gè zhēn shí de wèn tí, yòng zhè yí jiē duàn xué de dōng xi qù jiě jué tā.',
        'Find a real problem and use what this stage taught you to solve it.',
        'Tìm một vấn đề có thật, dùng những gì học được ở giai đoạn này để giải quyết nó.']
    ],
    vocab: [['抽象', 'chōu xiàng'], ['概念', 'gài niàn'], ['例子', 'lì zi'], ['系统', 'xì tǒng'], ['观点', 'guān diǎn'],
      ['证据', 'zhèng jù'], ['结论', 'jié lùn'], ['整理', 'zhěng lǐ'], ['掌握', 'zhǎng wò'], ['记忆', 'jì yì'],
      ['联系', 'lián xì'], ['理解', 'lǐ jiě'], ['应用', 'yìng yòng'], ['深入', 'shēn rù'], ['熟练', 'shú liàn'],
      ['补充', 'bǔ chōng'], ['逻辑', 'luó ji'], ['概括', 'gài kuò']],
    grammar: [
      {
        pattern: '一次比一次 + 形容词',
        explEn: 'Describes a change that continues in the same direction across repetitions. The phrase sits before the adjective and needs no 更.',
        explVi: 'Mô tả một thay đổi tiếp diễn cùng chiều qua mỗi lần lặp lại. Cụm này đứng trước tính từ và không cần 更.',
        examples: [
          ['隔的时间要一次比一次长。', 'Gé de shí jiān yào yí cì bǐ yí cì cháng.', 'The gaps should grow longer each time.', 'Khoảng cách phải lần sau dài hơn lần trước.'],
          ['他的概括一次比一次准确。', 'Tā de gài kuò yí cì bǐ yí cì zhǔn què.', 'His summaries get more accurate each time.', 'Phần khái quát của anh ấy mỗi lần một chính xác hơn.'],
          ['这些题一道比一道难。', 'Zhè xiē tí yí dào bǐ yí dào nán.', 'These questions get harder one after another.', 'Những câu này càng về sau càng khó.']
        ]
      },
      {
        pattern: '拿 + 宾语 + 动词',
        explEn: 'Fronts what you are going to work on, like 把 but lighter: 拿 presents the material and the verb says what you do with it.',
        explVi: 'Đưa lên trước cái bạn sắp thao tác, giống 把 nhưng nhẹ hơn: 拿 trình ra chất liệu, còn động từ nói bạn làm gì với nó.',
        examples: [
          ['拿两个概念问自己：它们哪里像，哪里不一样。', 'Ná liǎng gè gài niàn wèn zì jǐ: tā men nǎ lǐ xiàng, nǎ lǐ bù yí yàng.', 'Take two concepts and ask where they are alike and where they differ.', 'Lấy hai khái niệm ra tự hỏi chúng giống và khác ở đâu.'],
          ['拿这个例子说明抽象的概念最方便。', 'Ná zhè ge lì zi shuō míng chōu xiàng de gài niàn zuì fāng biàn.', 'This example is the handiest for explaining the abstract concept.', 'Lấy ví dụ này giải thích khái niệm trừu tượng là tiện nhất.'],
          ['拿上个月的笔记跟这个月的比一比。', 'Ná shàng gè yuè de bǐ jì gēn zhè ge yuè de bǐ yi bǐ.', 'Compare last month\'s notes with this month\'s.', 'Lấy ghi chép tháng trước so với tháng này.']
        ]
      },
      {
        pattern: '……的地方就是……',
        explEn: 'Turns a description into a noun with 的地方, then identifies it. It is the standard way to point at the spot where something goes wrong.',
        explVi: 'Biến một mô tả thành danh ngữ bằng 的地方, rồi xác định nó là gì. Đây là cách chuẩn để chỉ đúng chỗ có vấn đề.',
        examples: [
          ['说不顺的地方就是没真懂。', 'Shuō bú shùn de dì fang jiù shì méi zhēn dǒng.', 'Where you stumble is where you do not truly understand.', 'Chỗ nói không trôi chính là chỗ chưa thật hiểu.'],
          ['举不出例子的地方就是还很抽象。', 'Jǔ bu chū lì zi de dì fang jiù shì hái hěn chōu xiàng.', 'Where you cannot supply an example is where it is still abstract.', 'Chỗ không nêu được ví dụ chính là chỗ còn trừu tượng.'],
          ['最需要补充的地方就是你跳过去的那几页。', 'Zuì xū yào bǔ chōng de dì fang jiù shì nǐ tiào guò qù de nà jǐ yè.', 'What most needs filling in is the pages you skipped.', 'Chỗ cần bổ sung nhất chính là mấy trang bạn đã bỏ qua.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '"都懂了"是怎么来的',
        titleEn: 'Where "I understood it" comes from',
        titleVi: '"Hiểu hết rồi" từ đâu mà ra',
        zh: '复习的时候把书再读一遍，每一句都眼熟，于是觉得都掌握了。这种感觉几乎总是假的：认出来和想起来是两回事。读书时你在做的是认，材料就摆在眼前，大脑只要点头；考试或者用的时候你要做的是想，眼前什么都没有，全靠自己把内容拉出来。两种动作用的力气差得很远，所以只靠重复阅读复习的人，常常在真正要用的时候才发现自己不会。有效的做法是把书合上再说一遍：能说出来的才算你的，说不顺的地方就是没真懂。这个过程比读书难受得多，因为它不断让你看见自己缺的那些地方——可是那些地方本来就缺着，早一点看见，只是让你还来得及补。',
        en: 'Reading the book through again during revision, every sentence looks familiar, and so it feels as though everything has been mastered. That feeling is almost always false: recognising and recalling are two different things. Reading, you are recognising — the material is right there and the brain need only nod. In an exam, or in use, you have to recall: nothing is in front of you and you must pull the content out yourself. The two acts cost very different amounts of effort, which is why people who revise only by rereading discover at the moment of use that they cannot do it. The effective method is to close the book and say it again: only what you can say is yours, and where you stumble is where you do not truly understand. This process is far more uncomfortable than reading, because it keeps showing you what you are missing — but those gaps were there anyway, and seeing them earlier only means there is still time to fill them.',
        vi: 'Khi ôn, đọc lại quyển sách một lượt, câu nào cũng thấy quen mắt, thế là tưởng đã nắm hết. Cảm giác ấy gần như luôn là giả: nhận ra và nhớ ra là hai chuyện khác nhau. Lúc đọc, việc bạn làm là nhận ra, tài liệu bày ngay trước mắt, não chỉ cần gật đầu; lúc thi hoặc lúc dùng, việc bạn phải làm là nhớ ra, trước mắt chẳng có gì, hoàn toàn phải tự kéo nội dung ra. Hai động tác này tốn sức khác nhau rất xa, nên người chỉ ôn bằng cách đọc đi đọc lại thường đến lúc thật sự cần dùng mới phát hiện mình không làm được. Cách hiệu quả là gấp sách lại rồi nói lại một lần: nói ra được mới là của bạn, chỗ nói không trôi chính là chỗ chưa thật hiểu. Quá trình này khó chịu hơn đọc sách nhiều, vì nó liên tục cho bạn thấy những chỗ mình còn thiếu — nhưng những chỗ ấy vốn đã thiếu sẵn, thấy sớm một chút chỉ là để bạn còn kịp bù vào.',
        questions: [
          { q: '短文说读书时做的是什么动作？', qPinyin: 'Duǎn wén shuō dú shū shí zuò de shì shén me dòng zuò?',
            qEn: 'What act does reading involve?', qVi: 'Bài đọc nói khi đọc sách ta làm động tác gì?',
            options: [['认，材料就在眼前，大脑只要点头', 'nhận ra, tài liệu ngay trước mắt, não chỉ cần gật đầu'], ['想，全靠自己拉出来', 'nhớ ra, hoàn toàn tự kéo nội dung ra'], ['写，把内容抄一遍', 'viết, chép lại nội dung một lượt']], correct: 0,
            explEn: '读书时你在做的是认，材料就摆在眼前，大脑只要点头.', explVi: '读书时你在做的是认，材料就摆在眼前，大脑只要点头.' },
          { q: '只靠重复阅读复习会有什么后果？', qPinyin: 'Zhǐ kào chóng fù yuè dú fù xí huì yǒu shén me hòu guǒ?',
            qEn: 'What happens if you revise only by rereading?', qVi: 'Chỉ ôn bằng đọc lại thì hậu quả là gì?',
            options: [['真正要用的时候才发现自己不会', 'đến lúc thật sự cần dùng mới phát hiện mình không làm được'], ['记得比别人牢', 'nhớ chắc hơn người khác'], ['花的时间最少', 'tốn ít thời gian nhất']], correct: 0,
            explEn: '常常在真正要用的时候才发现自己不会.', explVi: '常常在真正要用的时候才发现自己不会.' },
          { q: '短文怎么看这个过程让人难受？', qPinyin: 'Duǎn wén zěn me kàn zhè ge guò chéng ràng rén nán shòu?',
            qEn: 'How does the text view the discomfort?', qVi: 'Bài đọc nhìn nhận sự khó chịu của quá trình này thế nào?',
            options: [['那些地方本来就缺着，早点看见才来得及补', 'những chỗ ấy vốn đã thiếu, thấy sớm mới kịp bù'], ['说明这个方法不好', 'cho thấy phương pháp này không tốt'], ['说明书写得太难', 'cho thấy sách viết quá khó']], correct: 0,
            explEn: '可是那些地方本来就缺着，早一点看见，只是让你还来得及补.', explVi: '可是那些地方本来就缺着，早一点看见，只是让你还来得及补.' }
        ]
      },
      {
        titleZh: '把点连成网',
        titleEn: 'Turning points into a net',
        titleVi: 'Nối các điểm thành một mạng lưới',
        zh: '一个记不住的知识点，问题常常不在它本身，而在它周围什么都没有。单独的一个点没有别的东西扶着，忘了是自然的；连成网以后，你忘了一处，还能从旁边几处推回来。最省力的连接办法是比较：拿这一阶段的两个概念放在一起，问它们像在哪儿、差在哪儿、什么时候该用这个而不是那个。这三问一答完，两个概念就互相帮着记住对方。第二个办法是给每个抽象的说法配一个自己经历过的例子，越具体越好，因为记忆抓得住场面，抓不住干巴巴的说法。最后把这些关系画成一张图：中间写这一阶段的核心问题，周围放观点，观点下面挂证据。图上最空的那一块，就是你下一步该补的地方。',
        en: 'When a point of knowledge will not stick, the problem is usually not the point itself but the emptiness around it. A point standing alone has nothing holding it up, and forgetting it is natural; once it is woven into a net, forgetting one place still lets you work back from the places beside it. The least effortful way to connect is comparison: put two concepts from this stage side by side and ask where they are alike, where they differ, and when you should use one rather than the other. Answer those three and each concept helps you hold on to the other. The second way is to attach to every abstract statement an example you have lived through, the more concrete the better, because memory grips scenes and lets go of dry statements. Finally, draw the relations as a diagram: the stage\'s central question in the middle, claims around it, evidence hanging under each claim. Wherever the diagram is emptiest is what you should fill in next.',
        vi: 'Một điểm kiến thức không nhớ nổi, vấn đề thường không nằm ở bản thân nó mà ở chỗ xung quanh nó chẳng có gì. Một điểm đứng lẻ không có gì đỡ, quên là chuyện tự nhiên; nối thành mạng rồi thì quên một chỗ vẫn có thể lần từ mấy chỗ bên cạnh mà suy ngược lại. Cách nối tốn ít sức nhất là so sánh: lấy hai khái niệm của giai đoạn này đặt cạnh nhau, hỏi chúng giống ở đâu, khác ở đâu, khi nào nên dùng cái này chứ không phải cái kia. Trả lời xong ba câu ấy thì hai khái niệm giúp nhau ghi nhớ. Cách thứ hai là gắn cho mỗi phát biểu trừu tượng một ví dụ chính mình từng trải, càng cụ thể càng tốt, vì trí nhớ bám được vào cảnh tượng chứ không bám được vào những phát biểu khô khan. Cuối cùng vẽ những quan hệ ấy thành một sơ đồ: giữa ghi câu hỏi cốt lõi của giai đoạn, xung quanh đặt các luận điểm, dưới mỗi luận điểm treo bằng chứng. Mảng trống nhất trên sơ đồ chính là chỗ bạn cần bù tiếp.',
        questions: [
          { q: '短文说记不住的问题常常出在哪儿？', qPinyin: 'Duǎn wén shuō jì bu zhù de wèn tí cháng cháng chū zài nǎr?',
            qEn: 'Where does the problem usually lie?', qVi: 'Bài đọc nói vấn đề không nhớ nổi thường nằm ở đâu?',
            options: [['它周围什么都没有', 'xung quanh nó chẳng có gì'], ['它本身太难', 'bản thân nó quá khó'], ['复习的时间太短', 'thời gian ôn quá ngắn']], correct: 0,
            explEn: '问题常常不在它本身，而在它周围什么都没有.', explVi: '问题常常不在它本身，而在它周围什么都没有.' },
          { q: '比较两个概念要问哪三个问题？', qPinyin: 'Bǐ jiào liǎng gè gài niàn yào wèn nǎ sān gè wèn tí?',
            qEn: 'Which three questions does comparison ask?', qVi: 'So sánh hai khái niệm phải hỏi ba câu nào?',
            options: [['像在哪儿、差在哪儿、什么时候用这个而不是那个', 'giống ở đâu, khác ở đâu, khi nào dùng cái này chứ không phải cái kia'], ['谁提出的、什么时候提出的、在哪儿提出的', 'ai nêu ra, nêu khi nào, nêu ở đâu'], ['难不难、长不长、考不考', 'khó không, dài không, có thi không']], correct: 0,
            explEn: '问它们像在哪儿、差在哪儿、什么时候该用这个而不是那个.', explVi: '问它们像在哪儿、差在哪儿、什么时候该用这个而不是那个.' },
          { q: '为什么要给抽象的说法配一个经历过的例子？', qPinyin: 'Wèi shén me yào gěi chōu xiàng de shuō fǎ pèi yí gè jīng lì guo de lì zi?',
            qEn: 'Why attach a lived example to an abstract statement?', qVi: 'Vì sao phải gắn ví dụ từng trải cho phát biểu trừu tượng?',
            options: [['因为记忆抓得住场面，抓不住干巴巴的说法', 'vì trí nhớ bám được vào cảnh tượng, không bám được vào định nghĩa'], ['因为例子更短', 'vì ví dụ ngắn hơn'], ['因为说法容易写错', 'vì cách phát biểu dễ viết sai']], correct: 0,
            explEn: '越具体越好，因为记忆抓得住场面，抓不住干巴巴的说法.', explVi: '越具体越好，因为记忆抓得住场面，抓不住干巴巴的说法.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '隔的时间要___长。', pinyin: 'Gé de shí jiān yào ___ cháng.',
        options: [['一次比一次', 'lần sau hơn lần trước'], ['一次又一次', 'hết lần này đến lần khác'], ['一边一边', 'vừa… vừa'], ['一会儿一会儿', 'lúc thì… lúc thì']], correct: 0,
        explEn: '一次比一次 describes a change continuing in the same direction across repetitions.', explVi: '一次比一次 mô tả thay đổi tiếp diễn cùng chiều qua mỗi lần lặp.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '___两个概念问自己：它们哪里像，哪里不一样。', pinyin: '___ liǎng gè gài niàn wèn zì jǐ: tā men nǎ lǐ xiàng, nǎ lǐ bù yí yàng.',
        options: [['拿', 'lấy'], ['被', 'bị'], ['给', 'cho'], ['离', 'cách']], correct: 0,
        explEn: '拿 presents the material you are about to work on, and the verb says what you do with it.', explVi: '拿 trình ra chất liệu bạn sắp thao tác, động từ nói bạn làm gì với nó.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：怎么把它们联系起来？ B：___', pinyin: 'A: Zěn me bǎ tā men lián xì qǐ lái? B: ___',
        options: [['拿两个概念问自己：它们哪里像，哪里不一样。', 'Lấy hai khái niệm tự hỏi: chúng giống ở đâu, khác ở đâu.'], ['多读几遍就好了。', 'Đọc thêm vài lượt là được.'], ['这个阶段很长。', 'Giai đoạn này rất dài.'], ['我笔记本丢了。', 'Mình mất sổ ghi chép rồi.']], correct: 0,
        explEn: 'The question asks for a method of connecting, so the answer must give the operation.', explVi: 'Câu hỏi hỏi cách nối, nên câu trả lời phải đưa ra thao tác cụ thể.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，图上最空的那一块意味着什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, tú shàng zuì kōng de nà yí kuài yì wèi zhe shén me?',
        passage: 2, options: [['那是你下一步该补的地方', 'đó là chỗ bạn cần bù tiếp'], ['那部分不重要', 'phần đó không quan trọng'], ['那部分你最熟', 'phần đó bạn thạo nhất'], ['图画错了', 'sơ đồ vẽ sai']], correct: 0,
        explEn: '图上最空的那一块，就是你下一步该补的地方.', explVi: '图上最空的那一块，就是你下一步该补的地方.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，读书时觉得每句都眼熟就说明已经掌握了。', pinyin: 'Gēn jù dì yī piān duǎn wén, dú shū shí jué de měi jù dōu yǎn shú jiù shuō míng yǐ jīng zhǎng wò le.',
        isTrue: false, passage: 1,
        explEn: '这种感觉几乎总是假的：认出来和想起来是两回事.', explVi: '这种感觉几乎总是假的：认出来和想起来是两回事.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '举不出例子 / 的地方 / 就是 / 还很抽象', pinyin: 'jǔ bu chū lì zi / de dì fang / jiù shì / hái hěn chōu xiàng',
        answer: '举不出例子的地方就是还很抽象。', answerVi: 'Chỗ không nêu được ví dụ chính là chỗ còn trừu tượng.',
        options: [['举不出例子', 'không nêu được ví dụ'], ['的地方', 'chỗ mà'], ['就是', 'chính là'], ['还很抽象', 'còn rất trừu tượng']],
        explEn: '的地方 turns the description into a noun, and 就是 identifies it.', explVi: '的地方 biến mô tả thành danh ngữ, 就是 xác định nó là gì.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，"认"和"想"的区别在哪儿？', pinyin: 'Gēn jù dì yī piān duǎn wén, "rèn" hé "xiǎng" de qū bié zài nǎr?',
        passage: 1, options: [['认时材料在眼前，想时全靠自己把内容拉出来', 'lúc nhận ra thì tài liệu trước mắt, lúc nhớ ra thì phải tự kéo nội dung ra'], ['认比想更难', 'nhận ra khó hơn nhớ ra'], ['两者其实一样', 'hai cái thật ra như nhau'], ['想只在考试时才用', 'nhớ ra chỉ dùng khi thi']], correct: 0,
        explEn: '读书时你在做的是认……你要做的是想，眼前什么都没有，全靠自己把内容拉出来.', explVi: '读书时你在做的是认……你要做的是想，眼前什么都没有，全靠自己把内容拉出来.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么连成网以后忘了一处还有办法？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me lián chéng wǎng yǐ hòu wàng le yí chù hái yǒu bàn fǎ?',
        passage: 2, options: [['还能从旁边几处推回来', 'vẫn lần từ mấy chỗ bên cạnh mà suy ngược lại'], ['因为网不会忘', 'vì mạng lưới không quên'], ['因为点变多了', 'vì số điểm nhiều lên'], ['因为图画得好看', 'vì sơ đồ vẽ đẹp']], correct: 0,
        explEn: '连成网以后，你忘了一处，还能从旁边几处推回来.', explVi: '连成网以后，你忘了一处，还能从旁边几处推回来.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说记不住的原因是什么？', pinyin: 'B shuō jì bu zhù de yuán yīn shì shén me?',
        line: 8, options: [['知识之间没有联系，单独的点最容易掉', 'kiến thức không nối với nhau, điểm đứng lẻ dễ rơi nhất'], ['复习得不够多', 'ôn chưa đủ nhiều'], ['内容本身太多', 'bản thân nội dung quá nhiều'], ['睡得太少', 'ngủ quá ít']], correct: 0,
        explEn: 'B says: 记不住往往是因为知识之间没有联系，单独的点最容易掉.', explVi: 'B nói: 记不住往往是因为知识之间没有联系，单独的点最容易掉.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为整理的最后一步是什么？', pinyin: 'B rèn wéi zhěng lǐ de zuì hòu yí bù shì shén me?',
        line: 14, options: [['找一个真实的问题，用学过的东西去解决', 'tìm một vấn đề có thật, dùng thứ đã học để giải quyết'], ['再读一遍书', 'đọc lại sách một lượt'], ['把笔记抄干净', 'chép lại ghi chép cho sạch'], ['多做几套题', 'làm thêm vài bộ đề']], correct: 0,
        explEn: 'B says: 找一个真实的问题，用这一阶段学的东西去解决它.', explVi: 'B nói: 找一个真实的问题，用这一阶段学的东西去解决它.' }
    ]
  }
};
