// HSK4 (B2) lessons 07-10. See hsk4-a.mjs for the spec shape and the pinyin conventions.

export default {
  'hsk4-l07-standard-community': {
    titleZh: '社区生活',
    titleEn: 'Community life',
    titleVi: 'Đời sống khu dân cư',
    summaryEn: 'A new resident learns how to get to know the neighbourhood: join activities, volunteer, handle noise complaints by talking first, and start with a simple greeting.',
    summaryVi: 'Người mới chuyển đến học cách làm quen khu dân cư: tham gia hoạt động, làm tình nguyện, xử lý chuyện ồn ào bằng cách nói chuyện trước, và bắt đầu từ một lời chào.',
    lines: [
      ['A', '楼上晚上很吵，我该直接去说吗？', 'Lóu shàng wǎn shang hěn chǎo, wǒ gāi zhí jiē qù shuō ma?',
        'The flat upstairs is noisy at night — should I go and say something directly?',
        'Tầng trên buổi tối rất ồn, mình có nên lên nói thẳng không?'],
      ['B', '可以，但别在生气的时候去，第二天白天说效果更好。', 'Kě yǐ, dàn bié zài shēng qì de shí hou qù, dì èr tiān bái tiān shuō xiào guǒ gèng hǎo.',
        'You can, but not while you are angry — saying it the next day works better.',
        'Được, nhưng đừng đi lúc đang bực, hôm sau nói ban ngày thì hiệu quả hơn.'],
      ['A', '万一他不听呢？', 'Wàn yī tā bù tīng ne?',
        'And if they do not listen?',
        'Lỡ họ không nghe thì sao?'],
      ['B', '那再请社区帮忙，一般说两次就会好一些。', 'Nà zài qǐng shè qū bāng máng, yì bān shuō liǎng cì jiù huì hǎo yì xiē.',
        'Then ask the community office for help; usually after two conversations things improve.',
        'Vậy thì nhờ ban quản lý khu dân cư giúp, thường nói hai lần là đỡ hơn.'],
      ['A', '平时怎么才能认识更多邻居？', 'Píng shí zěn me cái néng rèn shi gèng duō lín jū?',
        'How can I get to know more neighbours in general?',
        'Bình thường làm sao để quen thêm nhiều hàng xóm?'],
      ['B', '在电梯里打个招呼就够了，见几次面自然就熟悉了。', 'Zài diàn tī lǐ dǎ gè zhāo hu jiù gòu le, jiàn jǐ cì miàn zì rán jiù shú xī le.',
        'A greeting in the lift is enough — after a few meetings you become familiar naturally.',
        'Chào một tiếng trong thang máy là đủ, gặp vài lần là tự nhiên quen thôi.'],
      ['A', '听起来比参加活动容易多了。', 'Tīng qǐ lái bǐ cān jiā huó dòng róng yì duō le.',
        'That sounds much easier than joining activities.',
        'Nghe dễ hơn nhiều so với đi tham gia hoạt động.'],
      ['B', '其实两个一起做最好，认识的人多了，很多小事就不是问题了。', 'Qí shí liǎng gè yì qǐ zuò zuì hǎo, rèn shi de rén duō le, hěn duō xiǎo shì jiù bú shì wèn tí le.',
        'Actually doing both is best — once you know more people, many small problems stop being problems.',
        'Thật ra làm cả hai là tốt nhất, quen nhiều người rồi thì nhiều chuyện nhỏ không còn là vấn đề.']
    ],
    allowAbove: ['社区'],
    vocab: [['社区', 'shè qū'], ['邻居', 'lín jū'], ['活动', 'huó dòng'], ['志愿者', 'zhì yuàn zhě'], ['组织', 'zǔ zhī'],
      ['打扫', 'dǎ sǎo'], ['照顾', 'zhào gu'], ['老人', 'lǎo rén'], ['处理', 'chǔ lǐ'], ['理解', 'lǐ jiě'],
      ['熟悉', 'shú xī'], ['打招呼', 'dǎ zhāo hu'], ['垃圾', 'lā jī'], ['电梯', 'diàn tī'], ['关心', 'guān xīn'],
      ['互相', 'hù xiāng'], ['安全', 'ān quán']],
    grammar: [
      {
        pattern: '别在……的时候 + 动词',
        explEn: 'Warns against acting at a particular moment. 别 negates the action, and 在……的时候 sets the time to avoid.',
        explVi: 'Khuyên đừng hành động vào một thời điểm nào đó. 别 phủ định hành động, 在……的时候 nêu thời điểm cần tránh.',
        examples: [
          ['别在生气的时候去说。', 'Bié zài shēng qì de shí hou qù shuō.', 'Do not go and say it while you are angry.', 'Đừng đi nói lúc đang tức giận.'],
          ['别在吃饭的时候看手机。', 'Bié zài chī fàn de shí hou kàn shǒu jī.', 'Do not look at your phone while eating.', 'Đừng xem điện thoại lúc đang ăn cơm.'],
          ['别在很晚的时候打扫房间。', 'Bié zài hěn wǎn de shí hou dǎ sǎo fáng jiān.', 'Do not clean the flat late at night.', 'Đừng dọn phòng vào lúc quá khuya.']
        ]
      },
      {
        pattern: '连……也 / 都……',
        explEn: 'Points to an extreme case to prove a general point: "even X". What follows 连 is the surprising item, and 也 or 都 must come before the verb.',
        explVi: 'Nêu trường hợp cực đoan để chứng minh ý chung: "ngay cả X". Phần sau 连 là điều bất ngờ, và bắt buộc có 也 hoặc 都 trước động từ.',
        examples: [
          ['住了三年，我连对门姓什么都不知道。', 'Zhù le sān nián, wǒ lián duì mén xìng shén me dōu bù zhī dao.', 'After three years I do not even know the surname of the family opposite.', 'Ở ba năm rồi mà đến họ của nhà đối diện mình cũng không biết.'],
          ['他连周末也去帮老人买菜。', 'Tā lián zhōu mò yě qù bāng lǎo rén mǎi cài.', 'He even shops for the elderly at weekends.', 'Anh ấy đến cuối tuần cũng đi chợ giúp người già.'],
          ['这件事连孩子都能做。', 'Zhè jiàn shì lián hái zi dōu néng zuò.', 'Even a child can do this.', 'Việc này ngay cả trẻ con cũng làm được.']
        ]
      },
      {
        pattern: '形容词 + 多了',
        explEn: 'Marks a large difference after a comparison. 多了 follows the adjective directly, with no 很 or 非常 before it.',
        explVi: 'Diễn tả mức chênh lệch lớn sau khi so sánh. 多了 đứng ngay sau tính từ, phía trước không dùng 很 hay 非常.',
        examples: [
          ['这比参加活动容易多了。', 'Zhè bǐ cān jiā huó dòng róng yì duō le.', 'This is far easier than joining activities.', 'Việc này dễ hơn nhiều so với tham gia hoạt động.'],
          ['搬来以后，上班的路近多了。', 'Bān lái yǐ hòu, shàng bān de lù jìn duō le.', 'Since moving here the commute is much shorter.', 'Từ khi chuyển đến, đường đi làm gần hơn nhiều.'],
          ['有电梯以后，老人出门方便多了。', 'Yǒu diàn tī yǐ hòu, lǎo rén chū mén fāng biàn duō le.', 'With a lift, going out is much easier for elderly people.', 'Có thang máy rồi, người già ra ngoài tiện hơn nhiều.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '住得近，不一定认识',
        titleEn: 'Living close, but not acquainted',
        titleVi: 'Ở gần chưa chắc đã quen',
        zh: '在很多新建的楼里，住了三年也不知道对门姓什么，这已经很常见。过去大家在一个院子里做饭、晒衣服，见面见得多，关系自然就近；现在每家都有自己的门，电梯里站上二十秒就各走各的。可是真正需要帮忙的时候，最快到的还是邻居：家里没人时收一下快递，老人突然不舒服时帮着叫车。要让这种关系存在，靠的不是大的活动，而是每天的小事：进电梯先说一句"您好"，看见门口的垃圾就帮忙带下去，看见新搬来的人问一句需不需要帮忙。这些事都很小，可是做过三五次以后，你和邻居之间就从"住得近"变成了"认识"。',
        en: 'In many newly built blocks it is now common to live somewhere for three years without knowing the surname of the family opposite. In the past people cooked and hung out laundry in a shared courtyard, met often, and grew close naturally; today every family has its own door, and twenty seconds in a lift is the whole encounter. Yet when help is really needed the fastest to arrive is still a neighbour: taking in a parcel when nobody is home, calling a taxi when an elderly person suddenly feels ill. What keeps such a relationship alive is not big events but small contact: saying "hello" as you step into the lift, carrying down the rubbish left by the door, asking someone who has just moved in whether they need a hand. Each is tiny, but after three or five of them you and your neighbour have moved from "living close" to "acquainted".',
        vi: 'Ở nhiều tòa nhà mới xây, sống ba năm mà không biết nhà đối diện họ gì đã là chuyện thường. Ngày trước mọi người nấu ăn, phơi quần áo trong cùng một sân, gặp nhau nhiều nên quan hệ tự nhiên thân; bây giờ nhà nào cũng có cửa riêng, đứng trong thang máy hai mươi giây rồi ai đi đường nấy. Nhưng khi thật sự cần giúp đỡ, người đến nhanh nhất vẫn là hàng xóm: nhận hộ gói hàng lúc nhà không có ai, gọi xe giúp khi người già đột nhiên khó ở. Muốn giữ được mối quan hệ ấy thì không dựa vào những hoạt động lớn, mà dựa vào những việc nhỏ hằng ngày: bước vào thang máy nói một câu "chào anh/chị", thấy túi rác để ở cửa thì mang giúp xuống dưới, thấy người mới chuyển đến thì hỏi một câu có cần giúp gì không. Toàn là việc rất nhỏ, nhưng làm vài lần rồi thì giữa bạn và hàng xóm đã chuyển từ "ở gần" thành "quen biết".',
        questions: [
          { q: '短文说过去邻居关系为什么比较近？', qPinyin: 'Duǎn wén shuō guò qù lín jū guān xi wèi shén me bǐ jiào jìn?',
            qEn: 'Why were neighbours closer in the past, according to the text?', qVi: 'Theo bài đọc, vì sao ngày trước quan hệ hàng xóm gần gũi hơn?',
            options: [['在一个院子里生活，见面见得多', 'sống chung một sân, gặp nhau nhiều'], ['房子比较便宜', 'nhà cửa rẻ hơn'], ['大家都参加活动', 'ai cũng tham gia hoạt động']], correct: 0,
            explEn: '过去大家在一个院子里做饭、晒衣服，见面见得多，关系自然就近.', explVi: '过去大家在一个院子里做饭、晒衣服，见面见得多，关系自然就近.' },
          { q: '短文认为靠什么让邻居关系存在？', qPinyin: 'Duǎn wén rèn wéi kào shén me ràng lín jū guān xi cún zài?',
            qEn: 'What does the text say keeps neighbourly ties alive?', qVi: 'Bài đọc cho rằng dựa vào gì để giữ quan hệ hàng xóm?',
            options: [['每天的小事', 'những việc nhỏ hằng ngày'], ['大的活动', 'những hoạt động lớn'], ['社区的通知', 'thông báo của khu dân cư']], correct: 0,
            explEn: '靠的不是大的活动，而是每天的小事.', explVi: '靠的不是大的活动，而是每天的小事.' },
          { q: '短文举了哪个"需要帮忙"的例子？', qPinyin: 'Duǎn wén jǔ le nǎ ge "xū yào bāng máng" de lì zi?',
            qEn: 'Which example of needing help does the text give?', qVi: 'Bài đọc nêu ví dụ nào về "cần giúp đỡ"?',
            options: [['家里没人时收快递', 'nhận hộ gói hàng khi nhà không có ai'], ['帮忙做饭', 'giúp nấu cơm'], ['一起去旅行', 'cùng đi du lịch']], correct: 0,
            explEn: '家里没人时收一下快递，老人突然不舒服时帮着叫车.', explVi: '家里没人时收一下快递，老人突然不舒服时帮着叫车.' }
        ]
      },
      {
        titleZh: '当志愿者的人在想什么',
        titleEn: 'What volunteers are thinking',
        titleVi: 'Người làm tình nguyện nghĩ gì',
        zh: '问一个每周六去社区帮老人买菜的人为什么这样做，他大多不会说"为了帮助别人"，而会说"反正路过"或者"聊聊天挺好的"。这不是客气。研究发现，能坚持下来的志愿者，几乎都从这件事里得到了一些自己也需要的东西：认识新朋友、有一个必须出门的理由、看见自己被人需要。相反，只靠热情开始的人，做两三个月就停了。所以组织活动的人常常会做两件事：一是把任务分得很小，一次一个小时，不让人觉得负担重；二是让参加的人互相认识，下次来的时候是"来见朋友"，而不是"来完成任务"。愿意长期做下去的力量，往往就藏在这些看起来不太"高尚"的原因里。',
        en: 'Ask someone who shops for elderly neighbours every Saturday why they do it and they will rarely say "to help people"; they will say "it is on my way anyway" or "the chat is quite nice". That is not modesty. Research finds that volunteers who keep going almost all get something they themselves need out of it: new friends, a reason they must leave the house, the sight of being needed. Those who start on enthusiasm alone, by contrast, stop after two or three months. So organisers tend to do two things: cut the task small — one hour at a time, so it never feels heavy — and let participants get to know one another, so that next time they are "coming to see friends" rather than "coming to complete a task". The force behind long-term commitment is often hidden in these rather un-noble reasons.',
        vi: 'Hỏi một người mỗi thứ Bảy đi chợ giúp người già trong khu vì sao làm vậy, phần lớn họ sẽ không nói "để giúp người khác", mà nói "dù sao cũng tiện đường" hoặc "trò chuyện một chút cũng vui". Đó không phải là khách sáo. Nghiên cứu cho thấy những tình nguyện viên trụ lại được hầu như đều nhận từ việc đó vài thứ mà chính họ cũng cần: quen bạn mới, có một lý do buộc phải ra khỏi nhà, thấy mình được người khác cần đến. Ngược lại, người chỉ khởi đầu bằng nhiệt tình thì hai ba tháng là dừng. Vì vậy người tổ chức hoạt động thường làm hai việc: một là chia nhiệm vụ thật nhỏ, mỗi lần một tiếng, để không ai thấy nặng nề; hai là để những người tham gia quen nhau, lần sau đến là "đến gặp bạn" chứ không phải "đến hoàn thành nhiệm vụ". Sức mạnh giúp người ta làm lâu dài thường nằm ngay trong những lý do nghe có vẻ chẳng "cao cả" ấy.',
        questions: [
          { q: '坚持下来的志愿者有什么共同点？', qPinyin: 'Jiān chí xià lái de zhì yuàn zhě yǒu shén me gòng tóng diǎn?',
            qEn: 'What do volunteers who keep going have in common?', qVi: 'Những tình nguyện viên trụ lại được có điểm chung gì?',
            options: [['从这件事里得到自己也需要的东西', 'nhận được từ việc đó thứ chính họ cũng cần'], ['时间特别多', 'rất nhiều thời gian rảnh'], ['都住得很近', 'đều ở rất gần']], correct: 0,
            explEn: '几乎都从这件事里得到了一些自己也需要的东西.', explVi: '几乎都从这件事里得到了一些自己也需要的东西.' },
          { q: '组织者为什么把任务分得很小？', qPinyin: 'Zǔ zhī zhě wèi shén me bǎ rèn wu fēn de hěn xiǎo?',
            qEn: 'Why do organisers cut tasks small?', qVi: 'Vì sao người tổ chức chia nhiệm vụ thật nhỏ?',
            options: [['不让人觉得负担重', 'để không ai thấy nặng nề'], ['为了多找一些人', 'để tìm được nhiều người hơn'], ['因为时间不够', 'vì không đủ thời gian']], correct: 0,
            explEn: '一次一个小时，不让人觉得负担重.', explVi: '一次一个小时，不让人觉得负担重.' },
          { q: '只靠热情开始的人后来怎么样？', qPinyin: 'Zhǐ kào rè qíng kāi shǐ de rén hòu lái zěn me yàng?',
            qEn: 'What happens to those who start on enthusiasm alone?', qVi: 'Người chỉ bắt đầu bằng nhiệt tình về sau ra sao?',
            options: [['做两三个月就停了', 'làm hai ba tháng là dừng'], ['成了组织者', 'trở thành người tổ chức'], ['带来更多朋友', 'rủ thêm nhiều bạn']], correct: 0,
            explEn: '只靠热情开始的人，做两三个月就停了.', explVi: '只靠热情开始的人，做两三个月就停了.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___在生气的时候去说。', pinyin: '___ zài shēng qì de shí hou qù shuō.',
        options: [['别', 'đừng'], ['不', 'không'], ['没', 'chưa'], ['很', 'rất']], correct: 0,
        explEn: '别 forms a negative command; 不 and 没 only negate statements.', explVi: '别 tạo câu mệnh lệnh phủ định; 不 và 没 chỉ phủ định câu trần thuật.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '这比参加活动容易___。', pinyin: 'Zhè bǐ cān jiā huó dòng róng yì ___.',
        options: [['多了', 'nhiều'], ['很多', 'rất nhiều'], ['非常', 'vô cùng'], ['最', 'nhất']], correct: 0,
        explEn: '多了 follows the adjective in a 比 sentence; 非常 and 最 cannot appear there.', explVi: '多了 đứng sau tính từ trong câu 比; 非常 và 最 không dùng được ở đó.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：楼上晚上很吵，我该直接去说吗？ B：___', pinyin: 'A: Lóu shàng wǎn shang hěn chǎo, wǒ gāi zhí jiē qù shuō ma? B: ___',
        options: [['可以，但别在生气的时候去。', 'Được, nhưng đừng đi lúc đang bực.'], ['我住在三楼。', 'Mình ở tầng ba.'], ['社区很大。', 'Khu dân cư rất rộng.'], ['电梯坏了。', 'Thang máy hỏng rồi.']], correct: 0,
        explEn: 'The question asks whether to speak up, so the answer must advise on how and when.', explVi: 'Câu hỏi hỏi có nên nói không, nên câu trả lời phải khuyên nói thế nào và khi nào.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，志愿者说"反正路过"说明什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, zhì yuàn zhě shuō "fǎn zhèng lù guò" shuō míng shén me?',
        passage: 2, options: [['他也从这件事里得到了什么', 'anh ấy cũng nhận được điều gì đó từ việc này'], ['他其实不想做', 'anh ấy thật ra không muốn làm'], ['他住得很远', 'anh ấy ở rất xa'], ['他只是客气', 'anh ấy chỉ khách sáo']], correct: 0,
        explEn: 'The text says this is 不是客气 and links lasting volunteering to personal gains.', explVi: 'Bài đọc nói đó 不是客气 và gắn việc làm lâu dài với lợi ích cá nhân.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: '根据第一篇短文，让邻居关系变好主要靠大的活动。', pinyin: 'Gēn jù dì yī piān duǎn wén, ràng lín jū guān xi biàn hǎo zhǔ yào kào dà de huó dòng.',
        isTrue: false, passage: 1,
        explEn: '靠的不是大的活动，而是每天的小事.', explVi: '靠的不是大的活动，而是每天的小事.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '别 / 在 / 很晚的时候 / 打扫 / 房间', pinyin: 'bié / zài / hěn wǎn de shí hou / dǎ sǎo / fáng jiān',
        answer: '别在很晚的时候打扫房间。', answerVi: 'Đừng dọn phòng vào lúc quá khuya.',
        options: [['别', 'đừng'], ['在', 'vào'], ['很晚的时候', 'lúc quá khuya'], ['打扫', 'dọn dẹp'], ['房间', 'phòng']],
        explEn: 'The time phrase 在……的时候 comes before the verb, and 别 opens the command.', explVi: 'Cụm thời gian 在……的时候 đứng trước động từ, 别 mở đầu câu mệnh lệnh.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，"住得近"怎么才能变成"认识"？', pinyin: 'Gēn jù dì yī piān duǎn wén, "zhù de jìn" zěn me cái néng biàn chéng "rèn shi"?',
        passage: 1, options: [['做几次小事，比如打招呼、帮忙带垃圾', 'làm vài việc nhỏ như chào hỏi, mang rác giúp'], ['搬到一个楼层', 'chuyển về cùng một tầng'], ['参加社区的大活动', 'dự hoạt động lớn của khu'], ['等社区来介绍', 'chờ khu dân cư giới thiệu']], correct: 0,
        explEn: '这些事都很小，可是做过三五次以后…就从"住得近"变成了"认识".', explVi: '这些事都很小，可是做过三五次以后…就从"住得近"变成了"认识".' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么让参加的人互相认识很重要？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me ràng cān jiā de rén hù xiāng rèn shi hěn zhòng yào?',
        passage: 2, options: [['下次来是"来见朋友"，更容易坚持', 'lần sau đến là "đến gặp bạn", dễ duy trì hơn'], ['可以少做一些任务', 'có thể làm ít nhiệm vụ hơn'], ['组织者会更轻松', 'người tổ chức sẽ nhàn hơn'], ['活动会更热闹', 'hoạt động sẽ đông vui hơn']], correct: 0,
        explEn: '下次来的时候是"来见朋友"，而不是"来完成任务".', explVi: '下次来的时候是"来见朋友"，而不是"来完成任务".' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议怎么认识更多邻居？', pinyin: 'B jiàn yì zěn me rèn shi gèng duō lín jū?',
        line: 12, options: [['在电梯里打个招呼', 'chào một tiếng trong thang máy'], ['请他们来家里吃饭', 'mời họ đến nhà ăn cơm'], ['每天在门口等', 'ngày nào cũng đợi ở cửa'], ['给他们写信', 'viết thư cho họ']], correct: 0,
        explEn: 'B says: 在电梯里打个招呼就够了，见几次面自然就熟悉了.', explVi: 'B nói: 在电梯里打个招呼就够了，见几次面自然就熟悉了.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么建议第二天白天再去说？', pinyin: 'B wèi shén me jiàn yì dì èr tiān bái tiān zài qù shuō?',
        line: 8, options: [['不在生气的时候说，效果更好', 'không nói lúc đang bực thì hiệu quả hơn'], ['白天邻居一定在家', 'ban ngày hàng xóm chắc chắn ở nhà'], ['晚上电梯不能用', 'buổi tối thang máy không dùng được'], ['社区白天才上班', 'ban ngày khu dân cư mới làm việc']], correct: 0,
        explEn: 'B says: 别在生气的时候去，第二天白天说效果更好.', explVi: 'B nói: 别在生气的时候去，第二天白天说效果更好.' }
    ]
  },

  'hsk4-l08-standard-culture': {
    titleZh: '文化差别',
    titleEn: 'Cultural differences',
    titleVi: 'Khác biệt văn hóa',
    summaryEn: 'Two friends discuss customs abroad: observe before you copy, ask when unsure, and treat an unfamiliar habit as a difference rather than a mistake.',
    summaryVi: 'Hai người bạn bàn về phong tục ở nước ngoài: quan sát trước khi làm theo, không rõ thì hỏi, và coi thói quen lạ là khác biệt chứ không phải cái sai.',
    lines: [
      ['A', '第一次去别人家做客，带什么礼物比较好？', 'Dì yī cì qù bié rén jiā zuò kè, dài shén me lǐ wù bǐ jiào hǎo?',
        'Visiting someone\'s home for the first time, what gift is best to bring?',
        'Lần đầu đến nhà người ta chơi thì mang quà gì là hợp?',],
      ['B', '带水果或者花都很安全，太贵的反而让主人不好意思。', 'Dài shuǐ guǒ huò zhě huā dōu hěn ān quán, tài guì de fǎn ér ràng zhǔ rén bù hǎo yì si.',
        'Fruit or flowers are always safe; something too expensive actually embarrasses the host.',
        'Mang trái cây hoặc hoa đều an toàn, quà quá đắt lại khiến chủ nhà ngại.'],
      ['A', '吃饭的时候有什么要注意的吗？', 'Chī fàn de shí hou yǒu shén me yào zhù yì de ma?',
        'Is there anything to watch out for at the table?',
        'Lúc ăn cơm có gì cần lưu ý không?'],
      ['B', '每个地方都不一样，看主人怎么做，跟着做就不会错。', 'Měi gè dì fang dōu bù yí yàng, kàn zhǔ rén zěn me zuò, gēn zhe zuò jiù bú huì cuò.',
        'It differs from place to place — watch what the host does and follow, and you will not go wrong.',
        'Mỗi nơi mỗi khác, cứ nhìn chủ nhà làm rồi làm theo là không sai.'],
      ['A', '要是我做错了，别人会不会觉得我没礼貌？', 'Yào shi wǒ zuò cuò le, bié rén huì bu huì jué de wǒ méi lǐ mào?',
        'If I get it wrong, will people think I am impolite?',
        'Nếu mình làm sai thì người ta có nghĩ mình bất lịch sự không?'],
      ['B', '大多数人知道你是客人，说一句"我不太清楚"就够了。', 'Dà duō shù rén zhī dao nǐ shì kè rén, shuō yí jù "wǒ bú tài qīng chu" jiù gòu le.',
        'Most people know you are a guest — saying "I am not quite sure" is enough.',
        'Đa số người ta biết bạn là khách, nói một câu "mình chưa rõ lắm" là đủ.'],
      ['A', '这么说，态度比做得对更重要？', 'Zhè me shuō, tài du bǐ zuò de duì gèng zhòng yào?',
        'So attitude matters more than getting it right?',
        'Vậy nghĩa là thái độ quan trọng hơn việc làm đúng?'],
      ['B', '对，愿意了解和尊重，别人一看就感觉得到。', 'Duì, yuàn yì liǎo jiě hé zūn zhòng, bié rén yí kàn jiù gǎn jué de dào.',
        'Yes — willingness to understand and respect shows at a glance.',
        'Đúng, sẵn lòng tìm hiểu và tôn trọng thì người ta nhìn là cảm nhận được.']
    ],
    vocab: [['文化', 'wén huà'], ['传统', 'chuán tǒng'], ['节日', 'jié rì'], ['误会', 'wù huì'], ['减少', 'jiǎn shǎo'],
      ['适应', 'shì yìng'], ['观察', 'guān chá'], ['请教', 'qǐng jiào'], ['当地', 'dāng dì'], ['基本', 'jī běn'],
      ['尊重', 'zūn zhòng'], ['交流', 'jiāo liú'], ['接受', 'jiē shòu'], ['变化', 'biàn huà'], ['礼貌', 'lǐ mào'],
      ['礼物', 'lǐ wù'], ['主人', 'zhǔ rén']],
    grammar: [
      {
        pattern: '跟着 + 动词',
        explEn: 'Do the same thing as someone else, following their lead. 跟着 comes before the verb and the person may be left out when obvious.',
        explVi: 'Làm theo hành động của người khác. 跟着 đứng trước động từ, có thể lược người khi đã rõ.',
        examples: [
          ['看主人怎么做，跟着做就不会错。', 'Kàn zhǔ rén zěn me zuò, gēn zhe zuò jiù bú huì cuò.', 'Watch what the host does and follow — you will not go wrong.', 'Nhìn chủ nhà làm rồi làm theo là không sai.'],
          ['我跟着他学了两句当地话。', 'Wǒ gēn zhe tā xué le liǎng jù dāng dì huà.', 'I learned a couple of local phrases from him.', 'Mình học theo anh ấy được hai câu tiếng địa phương.'],
          ['大家跟着音乐一起唱。', 'Dà jiā gēn zhe yīn yuè yì qǐ chàng.', 'Everyone sang along with the music.', 'Mọi người hát theo nhạc.']
        ]
      },
      {
        pattern: '动词 + 得到 / 不到',
        explEn: 'Whether the action succeeds in reaching its object: 感觉得到 = can sense it, 买不到 = cannot manage to buy it.',
        explVi: 'Chỉ việc hành động có đạt tới đối tượng hay không: 感觉得到 = cảm nhận được, 买不到 = không mua được.',
        examples: [
          ['愿意尊重，别人一看就感觉得到。', 'Yuàn yì zūn zhòng, bié rén yí kàn jiù gǎn jué de dào.', 'Willingness to respect can be sensed at a glance.', 'Sẵn lòng tôn trọng thì người ta nhìn là cảm nhận được.'],
          ['这种水果在别的城市买不到。', 'Zhè zhǒng shuǐ guǒ zài bié de chéng shì mǎi bu dào.', 'You cannot buy this kind of fruit in other cities.', 'Loại trái cây này ở thành phố khác không mua được.'],
          ['他的意思我听得到，可是不太懂。', 'Tā de yì si wǒ tīng de dào, kě shì bú tài dǒng.', 'I can hear what he means but do not quite understand.', 'Ý anh ấy mình nghe được nhưng chưa hiểu lắm.']
        ]
      },
      {
        pattern: '大多数 + 名词',
        explEn: 'States what most of a group does. 大多数 modifies a noun directly; 大部分 works the same way for things.',
        explVi: 'Nêu điều mà phần lớn một nhóm làm. 大多数 bổ nghĩa trực tiếp cho danh từ; 大部分 dùng tương tự cho sự vật.',
        examples: [
          ['大多数人知道你是客人。', 'Dà duō shù rén zhī dao nǐ shì kè rén.', 'Most people know you are a guest.', 'Đa số người ta biết bạn là khách.'],
          ['大多数节日都和吃有关系。', 'Dà duō shù jié rì dōu hé chī yǒu guān xi.', 'Most festivals have something to do with food.', 'Đa số lễ tết đều liên quan đến ăn uống.'],
          ['大多数误会是因为不了解。', 'Dà duō shù wù huì shì yīn wèi bù liǎo jiě.', 'Most misunderstandings come from not knowing.', 'Đa số hiểu lầm là do không hiểu rõ.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '不同，不等于不对',
        titleEn: 'Different does not mean wrong',
        titleVi: 'Khác không có nghĩa là sai',
        zh: '一个外国朋友第一次在中国吃饭，看见主人一直往他碗里放菜，心里有点儿紧张：盘子一直是满的，怎么才能说吃饱了？在他的家里，客人自己拿多少就吃多少，主人一般不管。两种做法背后其实是一样的意思——让客人舒服，只是表达的方式不一样。很多被说成"没礼貌"的事，都是这样产生的：我们以为自己习惯的做法才是正确的，看见别人不这样做，第一反应就是判断，而不是了解。比较好的态度是先问一句"你们平时怎么做"。这个问题几乎不会让人生气，因为它承认了对方的做法也有道理。等你知道原因以后，常常会发现那个让你觉得奇怪的习惯，其实很合理。',
        en: 'A foreign friend eating in China for the first time watched the host keep putting food on his plate and grew a little tense: the plate stayed full, so how could he ever say he was full? At home, guests take what they want and the host does not interfere. Behind both customs lies the same intention — to make the guest comfortable — only expressed differently. Much of what gets called "rude" arises exactly this way: we treat our own habit as the only correct one, and when someone does otherwise our first reaction is to judge rather than to learn. A better attitude is to ask, "how do you usually do this?" That question almost never offends, because it grants that the other way has its reasons too. Once you know the reason, the habit that struck you as strange usually turns out to make good sense.',
        vi: 'Một người bạn nước ngoài lần đầu ăn cơm ở Trung Quốc, thấy chủ nhà liên tục gắp thức ăn cho mình thì hơi căng thẳng: đĩa lúc nào cũng đầy, vậy làm sao nói được là đã no? Ở nhà anh ấy, khách tự lấy bao nhiêu thì ăn bấy nhiêu, chủ nhà thường không can thiệp. Đằng sau hai cách làm ấy thật ra là cùng một ý – làm cho khách thấy thoải mái – chỉ là cách thể hiện khác nhau. Rất nhiều cái gọi là "bất lịch sự" sinh ra đúng theo kiểu đó: ta coi thói quen của mình là cách đúng duy nhất, thấy người khác không làm vậy thì phản ứng đầu tiên là phán xét chứ không phải tìm hiểu. Thái độ tốt hơn là hỏi trước một câu "bình thường bên bạn làm thế nào". Câu hỏi này gần như không làm ai phật lòng, vì nó thừa nhận cách làm của đối phương cũng có lý. Đến khi biết được nguyên do, bạn thường sẽ thấy cái thói quen từng khiến mình thấy lạ hóa ra rất hợp lý.',
        questions: [
          { q: '外国朋友为什么觉得紧张？', qPinyin: 'Wài guó péng you wèi shén me jué de jǐn zhāng?',
            qEn: 'Why did the foreign friend feel tense?', qVi: 'Vì sao người bạn nước ngoài thấy căng thẳng?',
            options: [['盘子一直是满的，不知道怎么说吃饱了', 'đĩa luôn đầy, không biết nói thế nào là đã no'], ['菜太辣了', 'món ăn quá cay'], ['主人不给他夹菜', 'chủ nhà không gắp thức ăn cho anh ấy']], correct: 0,
            explEn: '盘子一直是满的，怎么才能说吃饱了？', explVi: '盘子一直是满的，怎么才能说吃饱了？' },
          { q: '短文说两种做法背后是什么？', qPinyin: 'Duǎn wén shuō liǎng zhǒng zuò fǎ bèi hòu shì shén me?',
            qEn: 'What lies behind both customs, according to the text?', qVi: 'Bài đọc nói đằng sau hai cách làm là gì?',
            options: [['一样的意思：让客人舒服', 'cùng một ý: làm khách thấy thoải mái'], ['完全不同的想法', 'những suy nghĩ hoàn toàn khác nhau'], ['对礼貌的不同要求', 'yêu cầu khác nhau về lễ nghi']], correct: 0,
            explEn: '两种做法背后其实是一样的意思——让客人舒服.', explVi: '两种做法背后其实是一样的意思——让客人舒服.' },
          { q: '短文建议用哪句话了解对方的习惯？', qPinyin: 'Duǎn wén jiàn yì yòng nǎ jù huà liǎo jiě duì fāng de xí guàn?',
            qEn: 'Which question does the text recommend?', qVi: 'Bài đọc khuyên dùng câu nào để tìm hiểu thói quen của đối phương?',
            options: [['你们平时怎么做', 'bình thường bên bạn làm thế nào'], ['为什么这样不对', 'vì sao làm vậy là sai'], ['我可以不这样做吗', 'mình không làm vậy được không']], correct: 0,
            explEn: '比较好的态度是先问一句"你们平时怎么做".', explVi: '比较好的态度是先问一句"你们平时怎么做".' }
        ]
      },
      {
        titleZh: '传统为什么会变',
        titleEn: 'Why traditions change',
        titleVi: 'Vì sao truyền thống thay đổi',
        zh: '有人担心传统正在消失：过节的人少了，方式也简单了。可是如果看得久一点儿，就会发现传统从来都在变。过去过节要提前几天准备食物，因为平时吃不到；现在什么时候都买得到，节日的意思自然从"吃"转到了"见面"。真正让一个节日活下来的，不是形式，而是它满足的需要——一年里有几天，让走远的人回来，让很忙的人停一停。只要这个需要还在，形式变了也没关系：以前写信，现在发消息；以前全家做一天菜，现在一起去饭馆。相反，如果只保留形式，人们照着做却不知道为什么，这样的传统才真的在消失。',
        en: 'Some worry that tradition is disappearing: fewer people mark the festivals, and the rituals have grown simple. Yet look over a longer span and you find tradition has always been changing. Festivals once required days of food preparation because such food was unavailable the rest of the year; now it can be bought any day, so the meaning of a festival has naturally shifted from eating to meeting. What keeps a festival alive is not its form but the need it meets — a few days a year when those who went far away come back and the busy ones pause. As long as that need remains, changed forms do not matter: letters became messages, a whole day of family cooking became a meal out. Conversely, when only the form is kept and people follow it without knowing why, that is when a tradition really is dying.',
        vi: 'Có người lo truyền thống đang mất đi: người ăn tết ít hơn, nghi thức cũng giản lược. Nhưng nếu nhìn dài hơn một chút sẽ thấy truyền thống xưa nay vẫn luôn thay đổi. Ngày trước ăn tết phải chuẩn bị đồ ăn trước mấy hôm vì ngày thường không có; giờ lúc nào cũng mua được, nên ý nghĩa của ngày lễ tự nhiên chuyển từ "ăn" sang "gặp mặt". Thứ thật sự giữ cho một ngày lễ sống được không phải hình thức, mà là nhu cầu mà nó đáp ứng – một năm có vài ngày để người đi xa trở về, để người bận rộn dừng lại. Chỉ cần nhu cầu đó còn thì hình thức đổi cũng không sao: ngày xưa viết thư, nay nhắn tin; ngày xưa cả nhà nấu cả ngày, nay cùng nhau ra quán. Ngược lại, nếu chỉ giữ lại hình thức, người ta làm theo mà không biết vì sao, thì truyền thống ấy mới thật sự đang mất đi.',
        questions: [
          { q: '为什么节日的意思从"吃"转到了"见面"？', qPinyin: 'Wèi shén me jié rì de yì si cóng "chī" zhuǎn dào le "jiàn miàn"?',
            qEn: 'Why has the meaning of festivals shifted from eating to meeting?', qVi: 'Vì sao ý nghĩa ngày lễ chuyển từ "ăn" sang "gặp mặt"?',
            options: [['现在什么时候都买得到食物', 'giờ lúc nào cũng mua được thức ăn'], ['因为大家都不喜欢吃了', 'vì mọi người không thích ăn nữa'], ['因为节日变短了', 'vì ngày lễ ngắn lại']], correct: 0,
            explEn: '现在什么时候都买得到，节日的意思自然从"吃"转到了"见面".', explVi: '现在什么时候都买得到，节日的意思自然从"吃"转到了"见面".' },
          { q: '短文认为什么让一个节日活下来？', qPinyin: 'Duǎn wén rèn wéi shén me ràng yí gè jié rì huó xià lái?',
            qEn: 'What keeps a festival alive, according to the text?', qVi: 'Bài đọc cho rằng điều gì giữ cho ngày lễ sống được?',
            options: [['它满足的需要', 'nhu cầu mà nó đáp ứng'], ['它的形式', 'hình thức của nó'], ['参加的人数', 'số người tham gia']], correct: 0,
            explEn: '真正让一个节日活下来的，不是形式，而是它满足的需要.', explVi: '真正让一个节日活下来的，不是形式，而是它满足的需要.' },
          { q: '什么情况下传统才真的在消失？', qPinyin: 'Shén me qíng kuàng xià chuán tǒng cái zhēn de zài xiāo shī?',
            qEn: 'When is a tradition really disappearing?', qVi: 'Trong trường hợp nào truyền thống mới thật sự mất đi?',
            options: [['只保留形式，不知道为什么这样做', 'chỉ giữ hình thức mà không biết vì sao làm vậy'], ['形式发生了变化', 'hình thức có thay đổi'], ['年轻人过节的方式不同', 'người trẻ ăn tết theo cách khác']], correct: 0,
            explEn: '如果只保留形式，人们照着做却不知道为什么，这样的传统才真的在消失.', explVi: '如果只保留形式，人们照着做却不知道为什么，这样的传统才真的在消失.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '看主人怎么做，___做就不会错。', pinyin: 'Kàn zhǔ rén zěn me zuò, ___ zuò jiù bú huì cuò.',
        options: [['跟着', 'làm theo'], ['为了', 'để mà'], ['按照', 'theo như'], ['关于', 'về việc']], correct: 0,
        explEn: '跟着 + verb means copying someone else\'s action as it happens.', explVi: '跟着 + động từ nghĩa là làm theo hành động của người khác.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '这种水果在别的城市买___。', pinyin: 'Zhè zhǒng shuǐ guǒ zài bié de chéng shì mǎi ___.',
        options: [['不到', 'không được'], ['不了', 'không nổi'], ['不下', 'không chứa hết'], ['不起', 'không nổi (tiền)']], correct: 0,
        explEn: '买不到 says the purchase cannot be completed because the item is unavailable.', explVi: '买不到 nghĩa là không mua được vì không có hàng.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：第一次去别人家做客，带什么礼物比较好？ B：___', pinyin: 'A: Dì yī cì qù bié rén jiā zuò kè, dài shén me lǐ wù bǐ jiào hǎo? B: ___',
        options: [['带水果或者花都很安全。', 'Mang trái cây hoặc hoa đều an toàn.'], ['他家离这儿很近。', 'Nhà anh ấy gần đây lắm.'], ['我下午有事。', 'Chiều mình bận.'], ['这个节日很重要。', 'Ngày lễ này rất quan trọng.']], correct: 0,
        explEn: 'The question asks what to bring, so the answer must name a gift.', explVi: 'Câu hỏi hỏi mang gì, nên câu trả lời phải nêu món quà.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第一篇短文，"没礼貌"的误会常常怎么产生？', pinyin: 'Gēn jù dì yī piān duǎn wén, "méi lǐ mào" de wù huì cháng cháng zěn me chǎn shēng?',
        passage: 1, options: [['以为自己的习惯才是正确的做法', 'cho rằng thói quen của mình mới là cách đúng'], ['因为语言不同', 'vì ngôn ngữ khác nhau'], ['因为客人不带礼物', 'vì khách không mang quà'], ['因为主人太热情', 'vì chủ nhà quá nhiệt tình']], correct: 0,
        explEn: '我们以为自己习惯的做法才是正确的…第一反应就是判断.', explVi: '我们以为自己习惯的做法才是正确的…第一反应就是判断.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第二篇短文，传统的形式变了就说明传统在消失。', pinyin: 'Gēn jù dì èr piān duǎn wén, chuán tǒng de xíng shì biàn le jiù shuō míng chuán tǒng zài xiāo shī.',
        isTrue: false, passage: 2,
        explEn: '只要这个需要还在，形式变了也没关系.', explVi: '只要这个需要还在，形式变了也没关系.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '大多数 / 误会 / 是 / 因为 / 不了解', pinyin: 'dà duō shù / wù huì / shì / yīn wèi / bù liǎo jiě',
        answer: '大多数误会是因为不了解。', answerVi: 'Đa số hiểu lầm là do không hiểu rõ.',
        options: [['大多数', 'đa số'], ['误会', 'hiểu lầm'], ['是', 'là'], ['因为', 'bởi vì'], ['不了解', 'không hiểu rõ']],
        explEn: '大多数 modifies the noun directly, and 因为 opens the reason after 是.', explVi: '大多数 bổ nghĩa trực tiếp cho danh từ, 因为 mở đầu lý do sau 是.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，为什么"你们平时怎么做"这句话不会让人生气？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me "nǐ men píng shí zěn me zuò" zhè jù huà bú huì ràng rén shēng qì?',
        passage: 1, options: [['它承认对方的做法也有道理', 'nó thừa nhận cách làm của đối phương cũng có lý'], ['它说得很短', 'nó rất ngắn gọn'], ['它是一个玩笑', 'nó là một câu đùa'], ['它不需要回答', 'nó không cần trả lời']], correct: 0,
        explEn: '因为它承认了对方的做法也有道理.', explVi: '因为它承认了对方的做法也有道理.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，节日满足的需要是什么？', pinyin: 'Gēn jù dì èr piān duǎn wén, jié rì mǎn zú de xū yào shì shén me?',
        passage: 2, options: [['让走远的人回来，让很忙的人停一停', 'để người đi xa trở về, để người bận rộn dừng lại'], ['让大家吃得更好', 'để mọi người ăn ngon hơn'], ['让商店多卖东西', 'để cửa hàng bán được nhiều'], ['让孩子放假', 'để trẻ con được nghỉ']], correct: 0,
        explEn: '一年里有几天，让走远的人回来，让很忙的人停一停.', explVi: '一年里有几天，让走远的人回来，让很忙的人停一停.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B为什么说太贵的礼物不好？', pinyin: 'B wèi shén me shuō tài guì de lǐ wù bù hǎo?',
        line: 8, options: [['反而让主人不好意思', 'ngược lại khiến chủ nhà ngại'], ['主人不会喜欢', 'chủ nhà sẽ không thích'], ['太重不好拿', 'quá nặng khó mang'], ['商店里买不到', 'cửa hàng không có bán']], correct: 0,
        explEn: 'B says: 太贵的反而让主人不好意思.', explVi: 'B nói: 太贵的反而让主人不好意思.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为做客时最重要的是什么？', pinyin: 'B rèn wéi zuò kè shí zuì zhòng yào de shì shén me?',
        line: 14, options: [['愿意了解和尊重的态度', 'thái độ sẵn lòng tìm hiểu và tôn trọng'], ['每个动作都做对', 'làm đúng từng động tác'], ['带最贵的礼物', 'mang món quà đắt nhất'], ['少说话', 'nói ít lại']], correct: 0,
        explEn: 'B says: 愿意了解和尊重，别人一看就感觉得到.', explVi: 'B nói: 愿意了解和尊重，别人一看就感觉得到.' }
    ]
  }
};
