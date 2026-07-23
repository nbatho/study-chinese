// HSK4 (B2) lessons 09-11. See hsk4-a.mjs for the spec shape and the pinyin conventions.

export default {
  'hsk4-l09-standard-technology': {
    titleZh: '技术与生活',
    titleEn: 'Technology and daily life',
    titleVi: 'Công nghệ và đời sống',
    summaryEn: 'Two friends weigh what phones have done to daily life: convenience against dependence, screen-time limits, keeping older relatives online, and choosing what to learn.',
    summaryVi: 'Hai người bạn cân nhắc điện thoại đã làm gì với đời sống: tiện lợi và lệ thuộc, giới hạn thời gian dùng, giúp người lớn tuổi theo kịp, và chọn thứ đáng học.',
    lines: [
      ['A', '我妈妈连买菜都要用手机，她学得会吗？', 'Wǒ mā ma lián mǎi cài dōu yào yòng shǒu jī, tā xué de huì ma?',
        'My mother even has to use a phone to buy vegetables — can she manage to learn it?',
        'Mẹ mình đến đi chợ cũng phải dùng điện thoại, mẹ học nổi không?'],
      ['B', '能，别一次教太多，一个星期教一件事就行。', 'Néng, bié yí cì jiāo tài duō, yí gè xīng qī jiāo yí jiàn shì jiù xíng.',
        'She can — just do not teach too much at once; one thing a week is enough.',
        'Được chứ, đừng dạy quá nhiều một lúc, mỗi tuần dạy một việc là được.'],
      ['A', '她最担心的是把钱付错了。', 'Tā zuì dān xīn de shì bǎ qián fù cuò le.',
        'What worries her most is paying the wrong amount.',
        'Điều mẹ lo nhất là trả tiền nhầm.'],
      ['B', '可以先设一个小一点儿的限额，出错了也不会有大问题。', 'Kě yǐ xiān shè yí gè xiǎo yì diǎnr de xiàn é, chū cuò le yě bú huì yǒu dà wèn tí.',
        'Set a small spending limit first, so a mistake will not cause real trouble.',
        'Có thể đặt hạn mức nhỏ trước, có nhầm cũng không thành vấn đề lớn.'],
      ['A', '还有那些想骗钱的短信，她可能分不出来。', 'Hái yǒu nà xiē xiǎng piàn qián de duǎn xìn, tā kě néng fēn bu chū lái.',
        'And those texts out to steal money — she may not be able to tell them apart.',
        'Còn mấy tin nhắn lừa đảo nữa, mẹ mình chắc không phân biệt được.'],
      ['B', '教她一条规则就够了：要密码的，一律先打电话问家里人。', 'Jiāo tā yì tiáo guī zé jiù gòu le: yào mì mǎ de, yí lǜ xiān dǎ diàn huà wèn jiā lǐ rén.',
        'One rule is enough: anything asking for a password, call a family member first.',
        'Dạy mẹ một quy tắc là đủ: cái nào đòi mật khẩu thì nhất loạt gọi điện hỏi người nhà trước.'],
      ['A', '这个办法简单，她应该记得住。', 'Zhè ge bàn fǎ jiǎn dān, tā yīng gāi jì de zhù.',
        'That is simple — she should be able to remember it.',
        'Cách này đơn giản, chắc mẹ nhớ được.'],
      ['B', '技术再方便，也要留一条最笨但最安全的路。', 'Jì shù zài fāng biàn, yě yào liú yì tiáo zuì bèn dàn zuì ān quán de lù.',
        'However convenient technology gets, keep one clumsy but safe route open.',
        'Công nghệ có tiện đến đâu cũng phải chừa một lối tuy vụng nhưng an toàn nhất.']
    ],
    vocab: [['技术', 'jì shù'], ['网络', 'wǎng luò'], ['密码', 'mì mǎ'], ['信息', 'xìn xī'], ['保护', 'bǎo hù'],
      ['危险', 'wēi xiǎn'], ['短信', 'duǎn xìn'], ['骗', 'piàn'], ['支付', 'zhī fù'], ['使用', 'shǐ yòng'],
      ['方便', 'fāng biàn'], ['提醒', 'tí xǐng'], ['普通', 'pǔ tōng'], ['规则', 'guī zé'], ['安全', 'ān quán'],
      ['电子', 'diàn zǐ'], ['邮件', 'yóu jiàn']],
    grammar: [
      {
        pattern: '再……也……',
        explEn: 'Concedes any degree and still holds the result: "however X, still Y". 再 goes before the adjective, 也 before the verb.',
        explVi: 'Nhượng bộ ở mọi mức độ mà kết quả vẫn giữ nguyên: "dù X đến đâu vẫn Y". 再 đứng trước tính từ, 也 trước động từ.',
        examples: [
          ['技术再方便，也要留一条安全的路。', 'Jì shù zài fāng biàn, yě yào liú yì tiáo ān quán de lù.', 'However convenient technology is, keep a safe route open.', 'Công nghệ tiện đến đâu cũng phải chừa một lối an toàn.'],
          ['再忙也要休息。', 'Zài máng yě yào xiū xi.', 'However busy you are, you must rest.', 'Bận đến mấy cũng phải nghỉ.'],
          ['密码再长，写在手机里也不安全。', 'Mì mǎ zài cháng, xiě zài shǒu jī lǐ yě bù ān quán.', 'However long a password is, storing it in the phone is unsafe.', 'Mật khẩu dài đến đâu, lưu trong điện thoại vẫn không an toàn.']
        ]
      },
      {
        pattern: '动词 + 得会 / 不会',
        explEn: 'Asks whether learning can succeed. 学得会 = able to master it; 学不会 = unable to, no matter the effort.',
        explVi: 'Hỏi việc học có thành hay không. 学得会 = học nổi; 学不会 = học mãi không nổi.',
        examples: [
          ['她学得会吗？', 'Tā xué de huì ma?', 'Can she manage to learn it?', 'Mẹ học nổi không?'],
          ['这个功能我怎么也学不会。', 'Zhè ge gōng néng wǒ zěn me yě xué bu huì.', 'I simply cannot learn this feature.', 'Chức năng này mình học kiểu gì cũng không nổi.'],
          ['只要多用几次，谁都学得会。', 'Zhǐ yào duō yòng jǐ cì, shéi dōu xué de huì.', 'Use it a few more times and anyone can learn it.', 'Chỉ cần dùng thêm vài lần thì ai cũng học được.']
        ]
      },
      {
        pattern: '一律 + 动词',
        explEn: 'Applies one rule to every case without exception. It is more formal than 都 and often appears in instructions.',
        explVi: 'Áp dụng một quy tắc cho mọi trường hợp, không ngoại lệ. Trang trọng hơn 都 và hay gặp trong hướng dẫn.',
        examples: [
          ['要密码的，一律先打电话问家里人。', 'Yào mì mǎ de, yí lǜ xiān dǎ diàn huà wèn jiā lǐ rén.', 'Anything asking for a password: call family first, without exception.', 'Cái nào đòi mật khẩu thì nhất loạt gọi hỏi người nhà trước.'],
          ['不认识的邮件一律不打开。', 'Bú rèn shi de yóu jiàn yí lǜ bù dǎ kāi.', 'Never open an email from an unknown sender.', 'Thư của người lạ thì nhất loạt không mở.'],
          ['这些信息一律不要发给别人。', 'Zhè xiē xìn xī yí lǜ bú yào fā gěi bié rén.', 'Never send this information to anyone.', 'Những thông tin này nhất loạt không gửi cho ai.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '手机让我们少了什么',
        titleEn: 'What the phone took away',
        titleVi: 'Điện thoại đã lấy đi điều gì',
        zh: '手机给了我们很多东西：地图、字典、随时能联系上的人。可是它也慢慢让我们少了一样东西——等待。过去等车的十分钟，人会看看天，想想今天要做的事；现在这十分钟被填满了，头脑一直在接受新的内容，却很少有时间整理。研究发现，能想出新办法的时刻，常常出现在走路、洗澡这些"什么也没做"的时间里。所以有人开始给自己留一点空的时间：走路时不听东西，吃饭时把手机放在另一个房间。这不是反对技术，而是承认头脑也需要休息。会用工具的人，知道什么时候放下它。',
        en: 'The phone has given us a great deal: maps, dictionaries, people reachable at any moment. But it has also quietly taken one thing away — waiting. The ten minutes once spent waiting for a bus were spent glancing at the sky and thinking over the day; now those ten minutes are filled, the mind constantly receiving new material and rarely getting time to sort it. Research finds that the moments when new ideas arrive tend to come while walking or showering — in the time when "nothing is being done". So some people have begun keeping a little empty time: no audio while walking, the phone in another room during meals. This is not opposition to technology but an admission that the mind needs rest too. Someone who is good with a tool knows when to put it down.',
        vi: 'Điện thoại đã cho chúng ta rất nhiều thứ: bản đồ, từ điển, những người có thể liên lạc bất cứ lúc nào. Nhưng nó cũng lặng lẽ lấy đi một thứ – sự chờ đợi. Mười phút đợi xe ngày trước, người ta ngước nhìn trời, nghĩ về những việc phải làm hôm nay; giờ mười phút ấy bị lấp đầy, đầu óc liên tục tiếp nhận nội dung mới mà hiếm khi có thời gian sắp xếp. Nghiên cứu cho thấy những khoảnh khắc nghĩ ra cách làm mới thường xuất hiện lúc đi bộ, lúc tắm – tức là trong khoảng thời gian "chẳng làm gì cả". Vì thế có người bắt đầu chừa cho mình một chút thời gian trống: đi bộ thì không nghe gì, ăn cơm thì để điện thoại ở phòng khác. Đây không phải là phản đối công nghệ, mà là thừa nhận rằng đầu óc cũng cần nghỉ. Người biết dùng công cụ là người biết lúc nào nên đặt nó xuống.',
        questions: [
          { q: '短文说手机让我们少了什么？', qPinyin: 'Duǎn wén shuō shǒu jī ràng wǒ men shǎo le shén me?',
            qEn: 'What does the text say the phone quietly took away?', qVi: 'Bài đọc nói điện thoại lặng lẽ lấy đi điều gì?',
            options: [['等待的时间', 'thời gian chờ đợi'], ['地图和字典', 'bản đồ và từ điển'], ['和别人的联系', 'sự liên lạc với người khác']], correct: 0,
            explEn: '它也慢慢让我们少了一样东西——等待.', explVi: '它也慢慢让我们少了一样东西——等待.' },
          { q: '研究发现新办法常常出现在什么时候？', qPinyin: 'Yán jiū fā xiàn xīn bàn fǎ cháng cháng chū xiàn zài shén me shí hou?',
            qEn: 'When do new ideas tend to arrive, according to the research cited?', qVi: 'Nghiên cứu cho thấy cách làm mới thường xuất hiện lúc nào?',
            options: [['走路、洗澡这些"什么也没做"的时间', 'lúc đi bộ, lúc tắm – khi "chẳng làm gì cả"'], ['开会的时候', 'lúc họp'], ['看新内容的时候', 'lúc xem nội dung mới']], correct: 0,
            explEn: '常常出现在走路、洗澡这些"什么也没做"的时间里.', explVi: '常常出现在走路、洗澡这些"什么也没做"的时间里.' },
          { q: '短文对技术的态度是什么？', qPinyin: 'Duǎn wén duì jì shù de tài du shì shén me?',
            qEn: 'What is the text\'s attitude to technology?', qVi: 'Thái độ của bài đọc với công nghệ là gì?',
            options: [['不反对，但认为头脑需要休息', 'không phản đối, nhưng cho rằng đầu óc cần nghỉ'], ['完全反对使用手机', 'phản đối hoàn toàn việc dùng điện thoại'], ['认为手机没有任何问题', 'cho rằng điện thoại không có vấn đề gì']], correct: 0,
            explEn: '这不是反对技术，而是承认头脑也需要休息.', explVi: '这不是反对技术，而是承认头脑也需要休息.' }
        ]
      },
      {
        titleZh: '一条短信为什么能骗到人',
        titleEn: 'Why one text message can fool people',
        titleVi: 'Vì sao một tin nhắn có thể lừa được người',
        zh: '想骗钱的短信几乎都有一样的特点：让你着急。"您的银行卡有问题，请在两小时内处理"，这句话里最有用的不是"银行卡"，而是"两小时"。人一着急就不再检查，直接照着做。第二个特点是它看起来来自你认识的地方：银行、快递、学校。字看着熟悉，人就容易放松。防住这两点其实不难：第一，只要是让你马上做决定的消息，就先等十分钟，真正重要的事不会因为十分钟就出问题；第二，不点消息里的地址，自己打开平时用的那个应用，或者打官方电话去查。最后还有一条：任何时候都不要把密码告诉别人，包括说自己是工作人员的人。技术会一直变，可是这几条一直有用。',
        en: 'Scam messages almost all share one feature: they make you anxious. "There is a problem with your account, please handle it within two hours" — the useful part of that sentence is not "account" but "two hours". Once anxious, people stop checking and simply comply. The second feature is that they appear to come from somewhere familiar: a bank, a courier, a school. Familiar words make people relax. Guarding against the two is not hard. First, for any message pushing an immediate decision, wait ten minutes; nothing genuinely important breaks because of ten minutes. Second, do not tap links inside the message — open the app you normally use yourself, or ring the official number. And one more: never give your password to anyone, including someone claiming to be staff. Technology keeps changing, but these few rules keep working.',
        vi: 'Tin nhắn lừa đảo gần như đều có một đặc điểm chung: khiến bạn cuống. "Tài khoản của quý khách có vấn đề, vui lòng xử lý trong hai giờ" – phần lợi hại nhất trong câu ấy không phải "tài khoản" mà là "hai giờ". Người ta hễ cuống là thôi kiểm tra, cứ thế làm theo. Đặc điểm thứ hai là nó trông như đến từ nơi bạn quen: ngân hàng, đơn vị chuyển phát, nhà trường. Chữ nghĩa quen mắt thì người ta dễ lơi lỏng. Phòng được hai điểm đó thật ra không khó: thứ nhất, hễ tin nhắn nào bắt bạn quyết ngay thì hãy đợi mười phút, việc thật sự quan trọng không vì mười phút mà hỏng; thứ hai, đừng bấm vào đường dẫn trong tin nhắn, hãy tự mở ứng dụng vẫn dùng hoặc gọi số chính thức để kiểm tra. Cuối cùng còn một điều: bất cứ lúc nào cũng không đưa mật khẩu cho người khác, kể cả người tự xưng là nhân viên. Công nghệ sẽ đổi liên tục, nhưng mấy điều này thì luôn dùng được.',
        questions: [
          { q: '短文说这种短信最有用的部分是什么？', qPinyin: 'Duǎn wén shuō zhè zhǒng duǎn xìn zuì yǒu yòng de bù fen shì shén me?',
            qEn: 'What part of a scam text does the article call the most effective?', qVi: 'Bài đọc nói phần lợi hại nhất của tin nhắn lừa đảo là gì?',
            options: [['让人着急的时间限制', 'giới hạn thời gian khiến người ta cuống'], ['"银行卡"这个词', 'từ "thẻ ngân hàng"'], ['很长的内容', 'nội dung rất dài']], correct: 0,
            explEn: '最有用的不是"银行卡"，而是"两小时" — the deadline is what works.', explVi: '最有用的不是"账号"，而是"两小时" – chính hạn chót mới có tác dụng.' },
          { q: '短文建议收到这种消息时先做什么？', qPinyin: 'Duǎn wén jiàn yì shōu dào zhè zhǒng xiāo xi shí xiān zuò shén me?',
            qEn: 'What does the text advise doing first?', qVi: 'Bài đọc khuyên khi nhận tin như vậy thì làm gì trước?',
            options: [['先等十分钟', 'đợi mười phút trước đã'], ['马上按消息里说的做', 'làm ngay theo tin nhắn'], ['把消息发给朋友', 'gửi tin đó cho bạn bè']], correct: 0,
            explEn: '只要是让你马上做决定的消息，就先等十分钟.', explVi: '只要是让你马上做决定的消息，就先等十分钟.' },
          { q: '关于密码，短文的建议是什么？', qPinyin: 'Guān yú mì mǎ, duǎn wén de jiàn yì shì shén me?',
            qEn: 'What is the text\'s advice about passwords?', qVi: 'Về mật khẩu, bài đọc khuyên gì?',
            options: [['任何时候都不告诉别人', 'bất cứ lúc nào cũng không nói cho ai'], ['只告诉工作人员', 'chỉ nói cho nhân viên'], ['写下来放在手机里', 'ghi ra rồi lưu trong điện thoại']], correct: 0,
            explEn: '任何时候都不要把密码告诉别人，包括说自己是工作人员的人.', explVi: '任何时候都不要把密码告诉别人，包括说自己是工作人员的人.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '技术___方便，也要留一条安全的路。', pinyin: 'Jì shù ___ fāng biàn, yě yào liú yì tiáo ān quán de lù.',
        options: [['再', 'dù đến đâu'], ['更', 'càng'], ['太', 'quá'], ['最', 'nhất']], correct: 0,
        explEn: '再……也…… concedes any degree; 更 and 最 cannot pair with 也 this way.', explVi: '再……也…… nhượng bộ mọi mức độ; 更 và 最 không kết hợp với 也 kiểu này.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '不认识的邮件___不打开。', pinyin: 'Bú rèn shi de yóu jiàn ___ bù dǎ kāi.',
        options: [['一律', 'nhất loạt'], ['一起', 'cùng nhau'], ['一直', 'liên tục'], ['一定', 'nhất định']], correct: 0,
        explEn: '一律 applies the rule to every case; 一直 would describe duration instead.', explVi: '一律 áp dụng quy tắc cho mọi trường hợp; 一直 lại chỉ sự liên tục.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：她最担心的是把钱付错了。 B：___', pinyin: 'A: Tā zuì dān xīn de shì bǎ qián fù cuò le. B: ___',
        options: [['可以先设一个小一点儿的限额。', 'Có thể đặt hạn mức nhỏ trước.'], ['她的手机很新。', 'Điện thoại của bác ấy rất mới.'], ['买菜比较便宜。', 'Đi chợ khá rẻ.'], ['我也不太会用。', 'Mình cũng không rành dùng.']], correct: 0,
        explEn: 'The worry is about paying wrongly, so the answer must reduce that risk.', explVi: 'Nỗi lo là trả tiền nhầm, nên câu trả lời phải làm giảm rủi ro đó.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，想骗钱的短信为什么强调"两小时内"？', pinyin: 'Gēn jù dì èr piān duǎn wén, xiǎng piàn qián de duǎn xìn wèi shén me qiáng diào "liǎng xiǎo shí nèi"?',
        passage: 2, options: [['让人着急，不再检查', 'khiến người ta cuống, thôi kiểm tra'], ['因为处理需要两小时', 'vì xử lý mất hai giờ'], ['为了显得正式', 'để trông có vẻ chính thức'], ['因为银行这样规定', 'vì ngân hàng quy định vậy']], correct: 0,
        explEn: '人一着急就不再检查，直接照着做.', explVi: '人一着急就不再检查，直接照着做.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，作者认为应该完全不用手机。', pinyin: 'Gēn jù dì yī piān duǎn wén, zuò zhě rèn wéi yīng gāi wán quán bú yòng shǒu jī.',
        isTrue: false, passage: 1,
        explEn: '这不是反对技术，而是承认头脑也需要休息.', explVi: '这不是反对技术，而是承认头脑也需要休息.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '再 / 忙 / 也 / 要 / 休息', pinyin: 'zài / máng / yě / yào / xiū xi',
        answer: '再忙也要休息。', answerVi: 'Bận đến mấy cũng phải nghỉ.',
        options: [['再', 'dù đến đâu'], ['忙', 'bận'], ['也', 'cũng'], ['要', 'phải'], ['休息', 'nghỉ ngơi']],
        explEn: '再 goes before the adjective and 也 before the verb phrase.', explVi: '再 đứng trước tính từ, 也 đứng trước cụm động từ.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么现在很少有时间整理想法？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me xiàn zài hěn shǎo yǒu shí jiān zhěng lǐ xiǎng fǎ?',
        passage: 1, options: [['空的时间被新内容填满了', 'thời gian trống bị nội dung mới lấp đầy'], ['大家走路走得太快', 'mọi người đi bộ quá nhanh'], ['工作比过去多', 'công việc nhiều hơn trước'], ['没有地方可以坐', 'không có chỗ để ngồi']], correct: 0,
        explEn: '现在这十分钟被填满了，头脑一直在接受新的内容，却很少有时间整理.', explVi: '现在这十分钟被填满了，头脑一直在接受新的内容，却很少有时间整理.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，为什么这几条规则一直有用？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me zhè jǐ tiáo guī zé yì zhí yǒu yòng?',
        passage: 2, options: [['它们针对的是人的反应，不是某种技术', 'chúng nhắm vào phản ứng của con người, không phải một công nghệ cụ thể'], ['因为银行要求这样做', 'vì ngân hàng yêu cầu vậy'], ['因为短信不会改变', 'vì tin nhắn không thay đổi'], ['因为它们写得很短', 'vì chúng được viết rất ngắn']], correct: 0,
        explEn: 'The rules target the anxiety and familiarity that scams exploit, so 技术会一直变，可是这几条一直有用.', explVi: 'Các quy tắc nhắm vào sự cuống và cảm giác quen thuộc mà lừa đảo lợi dụng, nên 技术会一直变，可是这几条一直有用.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B教A的妈妈的规则是什么？', pinyin: 'B jiāo A de mā ma de guī zé shì shén me?',
        line: 12, options: [['要密码的先打电话问家里人', 'cái nào đòi mật khẩu thì gọi hỏi người nhà trước'], ['所有短信都不看', 'mọi tin nhắn đều không xem'], ['只用现金买菜', 'chỉ dùng tiền mặt đi chợ'], ['每天换一次密码', 'mỗi ngày đổi mật khẩu một lần']], correct: 0,
        explEn: 'B says: 要密码的，一律先打电话问家里人.', explVi: 'B nói: 要密码的，一律先打电话问家里人.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B为什么建议一个星期只教一件事？', pinyin: 'B wèi shén me jiàn yì yí gè xīng qī zhǐ jiāo yí jiàn shì?',
        line: 8, options: [['一次教太多学不会', 'dạy quá nhiều một lúc thì không học nổi'], ['因为他很忙', 'vì anh ấy rất bận'], ['因为手机功能太少', 'vì điện thoại ít chức năng'], ['因为一个星期才见一次面', 'vì một tuần mới gặp một lần']], correct: 0,
        explEn: 'B says: 别一次教太多，一个星期教一件事就行.', explVi: 'B nói: 别一次教太多，一个星期教一件事就行.' }
    ]
  },

  'hsk4-l10-standard-health-choice': {
    titleZh: '健康的选择',
    titleEn: 'Choosing a healthier routine',
    titleVi: 'Lựa chọn cho sức khỏe',
    summaryEn: 'Someone always tired works out a realistic plan: fix sleep first, start with walking, do not aim too high, and let small habits carry the rest.',
    summaryVi: 'Một người luôn mệt mỏi lập kế hoạch khả thi: chỉnh giấc ngủ trước, bắt đầu bằng đi bộ, đừng đặt mục tiêu quá cao, và để thói quen nhỏ lo phần còn lại.',
    lines: [
      ['A', '每天走路要走多久才有用？', 'Měi tiān zǒu lù yào zǒu duō jiǔ cái yǒu yòng?',
        'How long do I need to walk each day for it to help?',
        'Mỗi ngày phải đi bộ bao lâu thì mới có tác dụng?'],
      ['B', '二十分钟就有用，重要的是天天走，而不是走得多。', 'Èr shí fēn zhōng jiù yǒu yòng, zhòng yào de shì tiān tiān zǒu, ér bú shì zǒu de duō.',
        'Twenty minutes already helps — what matters is walking every day, not walking far.',
        'Hai mươi phút đã có tác dụng, quan trọng là ngày nào cũng đi chứ không phải đi nhiều.'],
      ['A', '晚上不想睡怎么办？我一躺下就想看手机。', 'Wǎn shang bù xiǎng shuì zěn me bàn? Wǒ yí tǎng xià jiù xiǎng kàn shǒu jī.',
        'What if I do not feel like sleeping? The moment I lie down I want to look at my phone.',
        'Tối không muốn ngủ thì sao? Mình cứ nằm xuống là muốn xem điện thoại.'],
      ['B', '把手机放在客厅充电，这一个改变就能提前半小时睡着。', 'Bǎ shǒu jī fàng zài kè tīng chōng diàn, zhè yí gè gǎi biàn jiù néng tí qián bàn xiǎo shí shuì zháo.',
        'Charge the phone in the living room; that one change alone can get you asleep half an hour earlier.',
        'Để điện thoại sạc ở phòng khách, chỉ một thay đổi đó đã giúp ngủ sớm hơn nửa tiếng.'],
      ['A', '吃的方面呢？我不太会做饭。', 'Chī de fāng miàn ne? Wǒ bú tài huì zuò fàn.',
        'What about food? I am not very good at cooking.',
        'Còn chuyện ăn uống? Mình không biết nấu ăn lắm.'],
      ['B', '不用会做饭，先用水代替甜的饮料，改变就已经很大了。', 'Bú yòng huì zuò fàn, xiān yòng shuǐ dài tì tián de yǐn liào, gǎi biàn jiù yǐ jīng hěn dà le.',
        'You do not need to cook — just use water in place of sweet drinks and the change is already big.',
        'Không cần biết nấu, cứ dùng nước lọc thay cho đồ uống ngọt là thay đổi đã rất lớn.'],
      ['A', '这些听起来都不难。', 'Zhè xiē tīng qǐ lái dōu bù nán.',
        'None of this sounds hard.',
        'Mấy việc này nghe đều không khó.'],
      ['B', '难的不是做一天，是做一年，所以才要从小事开始。', 'Nán de bú shì zuò yì tiān, shì zuò yì nián, suǒ yǐ cái yào cóng xiǎo shì kāi shǐ.',
        'The hard part is not one day but one year — which is exactly why you start small.',
        'Cái khó không phải làm một ngày mà là làm một năm, nên mới phải bắt đầu từ việc nhỏ.']
    ],
    vocab: [['健康', 'jiàn kāng'], ['运动', 'yùn dòng'], ['锻炼', 'duàn liàn'], ['压力', 'yā lì'], ['放松', 'fàng sōng'],
      ['检查', 'jiǎn chá'], ['身体', 'shēn tǐ'], ['习惯', 'xí guàn'], ['坚持', 'jiān chí'], ['目标', 'mù biāo'],
      ['放弃', 'fàng qì'], ['体重', 'tǐ zhòng'], ['减肥', 'jiǎn féi'], ['楼梯', 'lóu tī'], ['改变', 'gǎi biàn'],
      ['影响', 'yǐng xiǎng'], ['提前', 'tí qián']],
    grammar: [
      {
        pattern: '一……就……',
        explEn: 'Two events where the second follows immediately. Both 一 and 就 sit directly before their verbs, and the subject is usually stated once.',
        explVi: 'Hai sự việc, việc sau xảy ra ngay sau việc trước. 一 và 就 đều đứng ngay trước động từ của mình, chủ ngữ thường chỉ nêu một lần.',
        examples: [
          ['我一躺下就想看手机。', 'Wǒ yì tǎng xià jiù xiǎng kàn shǒu jī.', 'The moment I lie down I want to look at my phone.', 'Mình cứ nằm xuống là muốn xem điện thoại.'],
          ['他一累就想吃甜的。', 'Tā yí lèi jiù xiǎng chī tián de.', 'As soon as he gets tired he wants something sweet.', 'Hễ mệt là anh ấy muốn ăn đồ ngọt.'],
          ['一停下来就很难重新开始。', 'Yì tíng xià lái jiù hěn nán chóng xīn kāi shǐ.', 'Once you stop it is hard to start again.', 'Hễ dừng lại là rất khó bắt đầu lại.']
        ]
      },
      {
        pattern: '用 A 代替 B',
        explEn: 'Replaces one thing with another. 代替 takes the new thing after 用 and the old one as its object.',
        explVi: 'Thay cái này bằng cái khác. 代替 nhận cái mới sau 用 và cái cũ làm tân ngữ.',
        examples: [
          ['先用水代替甜的饮料。', 'Xiān yòng shuǐ dài tì tián de yǐn liào.', 'Start by using water in place of sweet drinks.', 'Trước hết dùng nước lọc thay cho đồ uống ngọt.'],
          ['用楼梯代替电梯，一天就多走十分钟。', 'Yòng lóu tī dài tì diàn tī, yì tiān jiù duō zǒu shí fēn zhōng.', 'Use the stairs instead of the lift and you walk ten more minutes a day.', 'Dùng cầu thang bộ thay thang máy là mỗi ngày đi thêm mười phút.'],
          ['他用茶代替了晚上的咖啡。', 'Tā yòng chá dài tì le wǎn shang de kā fēi.', 'He replaced his evening coffee with tea.', 'Anh ấy đã dùng trà thay cho cà phê buổi tối.']
        ]
      },
      {
        pattern: '重要的是……，而不是……',
        explEn: 'Puts the real point first and rules out the wrong one. 而不是 must introduce a phrase of the same kind as the first.',
        explVi: 'Nêu điều cốt lõi trước rồi loại bỏ điều sai. Sau 而不是 phải là thành phần cùng loại với vế đầu.',
        examples: [
          ['重要的是天天走，而不是走得多。', 'Zhòng yào de shì tiān tiān zǒu, ér bú shì zǒu de duō.', 'What matters is walking daily, not walking far.', 'Quan trọng là ngày nào cũng đi, chứ không phải đi nhiều.'],
          ['重要的是坚持，而不是速度。', 'Zhòng yào de shì jiān chí, ér bú shì sù dù.', 'What matters is persistence, not speed.', 'Quan trọng là kiên trì chứ không phải tốc độ.'],
          ['重要的是睡够，而不是几点上床。', 'Zhòng yào de shì shuì gòu, ér bú shì jǐ diǎn shàng chuáng.', 'What matters is sleeping enough, not the hour you go to bed.', 'Quan trọng là ngủ đủ chứ không phải mấy giờ lên giường.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '为什么运动计划总是失败',
        titleEn: 'Why exercise plans fail',
        titleVi: 'Vì sao kế hoạch tập luyện hay thất bại',
        zh: '几乎每个人都有过这样的经历：决心改变以后，第一周每天跑五公里，第二周开始找理由，第三周就停了。问题不在决心，而在开始的时候要求太高。身体需要时间适应，太重的安排会让人又累又疼，而累和疼正是放弃最常见的原因。更好的做法是把第一个目标定得低到"不可能失败"：每天走二十分钟，或者做五个动作。这样的目标不会让人有成就感，可是它有一个大好处——不需要很大的决心也能完成。等到两三个星期以后，身体开始想动了，再慢慢加量。真正决定结果的不是最努力的那一周，而是能不能在没有热情的日子里也做下去。',
        en: 'Almost everyone has had this experience: after resolving to change you run five kilometres a day in week one, start finding excuses in week two, and stop in week three. The problem is not resolve but a starting point set too high. The body needs time to adapt, and too heavy a schedule leaves you tired and sore — and tiredness and soreness are the commonest reasons for quitting. A better approach is to set the first target so low it cannot fail: twenty minutes of walking a day, or five movements. Such a target brings no sense of achievement, but it has one great advantage — it can be completed without willpower. Two or three weeks later, when the body starts wanting to move, you can add gradually. What decides the outcome is not the hardest week but whether you can keep going on the days when the enthusiasm is gone.',
        vi: 'Hầu như ai cũng từng trải qua chuyện này: sau khi quyết tâm, tuần đầu ngày nào cũng chạy năm cây số, tuần thứ hai bắt đầu tìm lý do, tuần thứ ba thì dừng. Vấn đề không nằm ở quyết tâm mà ở điểm xuất phát quá cao. Cơ thể cần thời gian thích nghi, lịch tập quá nặng khiến người ta vừa mệt vừa đau, mà mệt và đau chính là nguyên nhân bỏ cuộc phổ biến nhất. Cách tốt hơn là đặt mục tiêu đầu tiên thấp đến mức "không thể thất bại": mỗi ngày đi bộ hai mươi phút, hoặc làm năm động tác. Mục tiêu như vậy chẳng đem lại cảm giác thành tựu, nhưng nó có một cái lợi lớn – hoàn thành được mà không cần đến ý chí. Đợi hai ba tuần sau, khi cơ thể bắt đầu muốn vận động, hãy từ từ tăng lượng. Thứ thật sự quyết định kết quả không phải là tuần cố gắng nhất, mà là bạn có làm tiếp được vào những ngày chẳng còn hứng thú hay không.',
        questions: [
          { q: '短文认为运动计划失败的原因是什么？', qPinyin: 'Duǎn wén rèn wéi yùn dòng jì huà shī bài de yuán yīn shì shén me?',
            qEn: 'What does the text give as the reason exercise plans fail?', qVi: 'Bài đọc cho rằng nguyên nhân kế hoạch tập luyện thất bại là gì?',
            options: [['开始的时候要求太高', 'lúc bắt đầu đặt yêu cầu quá cao'], ['决心不够', 'quyết tâm chưa đủ'], ['没有时间', 'không có thời gian']], correct: 0,
            explEn: '问题不在决心，而在开始的时候要求太高.', explVi: '问题不在决心，而在开始的时候要求太高.' },
          { q: '把目标定得很低有什么好处？', qPinyin: 'Bǎ mù biāo dìng de hěn dī yǒu shén me hǎo chù?',
            qEn: 'What is the advantage of a very low target?', qVi: 'Đặt mục tiêu rất thấp có lợi gì?',
            options: [['不需要很大的决心也能完成', 'không cần quyết tâm lớn cũng hoàn thành được'], ['让人很有成就感', 'khiến người ta rất có cảm giác thành tựu'], ['能很快看到效果', 'thấy hiệu quả rất nhanh']], correct: 0,
            explEn: '它有一个大好处——不需要很大的决心也能完成.', explVi: '它有一个大好处——不需要很大的决心也能完成.' },
          { q: '短文认为什么真正决定结果？', qPinyin: 'Duǎn wén rèn wéi shén me zhēn zhèng jué dìng jié guǒ?',
            qEn: 'What really decides the outcome, according to the text?', qVi: 'Bài đọc cho rằng điều gì thật sự quyết định kết quả?',
            options: [['没有热情的日子里也做下去', 'vẫn làm tiếp vào những ngày không còn hứng thú'], ['最努力的那一周', 'tuần cố gắng nhất'], ['第一天跑了多远', 'ngày đầu chạy được bao xa']], correct: 0,
            explEn: '真正决定结果的…而是能不能在没有热情的日子里也做下去.', explVi: '真正决定结果的…而是能不能在没有热情的日子里也做下去.' }
        ]
      },
      {
        titleZh: '睡不好的那些小原因',
        titleEn: 'The small reasons for poor sleep',
        titleVi: 'Những nguyên nhân nhỏ khiến ngủ không ngon',
        zh: '很多人觉得自己睡不好是因为压力大，其实常常是一些更小的原因。第一是光：睡前一小时看着亮的手机，身体会以为还是白天。第二是时间不固定：周末比平时晚睡三个小时，星期一早上就像坐了一趟长途车。第三是床用来做的事太多——在床上工作、吃东西、看电视，身体就不再把床和睡觉联系起来。改起来并不复杂：睡前一小时把手机放到别的房间；每天大概在一样的时间上床，包括周末；床只用来睡觉。还有一点常被忘记：下午三点以后不喝咖啡和茶。这些做法都很小，可是坚持两个星期，很多人就不需要再问"怎么才能睡好"了。',
        en: 'Many people believe they sleep badly because of stress, when the reasons are usually smaller. The first is light: an hour of bright screen before bed and the body assumes it is still daytime. The second is an irregular schedule: going to bed three hours later at the weekend makes Monday morning feel like the end of a long coach journey. The third is that the bed does too many jobs — work, food, television — until the body no longer associates it with sleep. The fixes are not complicated: put the phone in another room an hour before bed; go to bed at roughly the same time daily, weekends included; use the bed only for sleeping. One more is often forgotten: no coffee or tea after three in the afternoon. Each is a small measure, but keep them for a fortnight and many people stop needing to ask how to sleep well.',
        vi: 'Nhiều người cho rằng mình ngủ không ngon vì áp lực lớn, thật ra thường là do những nguyên nhân nhỏ hơn. Thứ nhất là ánh sáng: trước khi ngủ một tiếng còn nhìn màn hình sáng thì cơ thể sẽ tưởng vẫn là ban ngày. Thứ hai là giờ giấc không cố định: cuối tuần ngủ muộn hơn ngày thường ba tiếng thì sáng thứ Hai chẳng khác gì vừa đi một chuyến xe đường dài. Thứ ba là cái giường bị dùng vào quá nhiều việc – làm việc, ăn uống, xem tivi trên giường thì cơ thể không còn gắn giường với việc ngủ nữa. Sửa lại cũng không phức tạp: trước khi ngủ một tiếng thì để điện thoại sang phòng khác; mỗi ngày lên giường vào khoảng cùng một giờ, kể cả cuối tuần; giường chỉ dùng để ngủ. Còn một điểm hay bị quên: sau ba giờ chiều thì không uống cà phê và trà. Toàn là những cách rất nhỏ, nhưng kiên trì hai tuần thì nhiều người không cần hỏi "làm sao để ngủ ngon" nữa.',
        questions: [
          { q: '短文说睡前看亮的手机有什么影响？', qPinyin: 'Duǎn wén shuō shuì qián kàn liàng de shǒu jī yǒu shén me yǐng xiǎng?',
            qEn: 'What effect does a bright screen before bed have?', qVi: 'Bài đọc nói nhìn màn hình sáng trước khi ngủ có ảnh hưởng gì?',
            options: [['身体会以为还是白天', 'cơ thể sẽ tưởng vẫn là ban ngày'], ['眼睛会更累，所以睡得更快', 'mắt mỏi hơn nên ngủ nhanh hơn'], ['没有什么影响', 'không ảnh hưởng gì']], correct: 0,
            explEn: '睡前一小时看着亮的手机，身体会以为还是白天.', explVi: '睡前一小时看着亮的手机，身体会以为还是白天.' },
          { q: '为什么不应该在床上工作和吃东西？', qPinyin: 'Wèi shén me bù yīng gāi zài chuáng shang gōng zuò hé chī dōng xi?',
            qEn: 'Why should you not work or eat in bed?', qVi: 'Vì sao không nên làm việc và ăn uống trên giường?',
            options: [['身体不再把床和睡觉联系起来', 'cơ thể không còn gắn giường với việc ngủ'], ['床会变脏', 'giường sẽ bẩn'], ['工作效率会更高', 'hiệu suất làm việc sẽ cao hơn']], correct: 0,
            explEn: '床用来做的事太多…身体就不再把床和睡觉联系起来.', explVi: '床用来做的事太多…身体就不再把床和睡觉联系起来.' },
          { q: '短文说哪一点常被忘记？', qPinyin: 'Duǎn wén shuō nǎ yì diǎn cháng bèi wàng jì?',
            qEn: 'Which point does the text say is often forgotten?', qVi: 'Bài đọc nói điểm nào hay bị quên?',
            options: [['下午三点以后不喝咖啡和茶', 'sau ba giờ chiều không uống cà phê và trà'], ['睡前要运动', 'trước khi ngủ phải vận động'], ['周末应该多睡', 'cuối tuần nên ngủ nhiều hơn']], correct: 0,
            explEn: '还有一点常被忘记：下午三点以后不喝咖啡和茶.', explVi: '还有一点常被忘记：下午三点以后不喝咖啡和茶.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '我___躺下就想看手机。', pinyin: 'Wǒ ___ tǎng xià jiù xiǎng kàn shǒu jī.',
        options: [['一', 'hễ'], ['在', 'đang'], ['把', 'đem'], ['被', 'bị']], correct: 0,
        explEn: '一……就…… links two events where the second follows immediately.', explVi: '一……就…… nối hai sự việc, việc sau xảy ra ngay lập tức.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '先用水___甜的饮料。', pinyin: 'Xiān yòng shuǐ ___ tián de yǐn liào.',
        options: [['代替', 'thay cho'], ['变得', 'trở nên'], ['变成', 'trở thành'], ['放到', 'để vào']], correct: 0,
        explEn: '用 A 代替 B is the frame for replacing one thing with another.', explVi: '用 A 代替 B là khung dùng để thay cái này bằng cái khác.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：每天走路要走多久才有用？ B：___', pinyin: 'A: Měi tiān zǒu lù yào zǒu duō jiǔ cái yǒu yòng? B: ___',
        options: [['二十分钟就有用，重要的是天天走。', 'Hai mươi phút đã có tác dụng, quan trọng là ngày nào cũng đi.'], ['走路很健康。', 'Đi bộ rất tốt cho sức khỏe.'], ['我不喜欢运动。', 'Mình không thích vận động.'], ['公园离这儿很远。', 'Công viên xa đây lắm.']], correct: 0,
        explEn: 'The question asks how long, so the answer must give a duration and qualify it.', explVi: 'Câu hỏi hỏi bao lâu, nên câu trả lời phải nêu thời lượng kèm điều kiện.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第一篇短文，为什么第一个目标要定得很低？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me dì yī gè mù biāo yào dìng de hěn dī?',
        passage: 1, options: [['低到不可能失败，不需要很大的决心', 'thấp đến mức không thể thất bại, không cần quyết tâm lớn'], ['为了省时间', 'để tiết kiệm thời gian'], ['因为医生这样要求', 'vì bác sĩ yêu cầu vậy'], ['因为运动没有用', 'vì vận động vô ích']], correct: 0,
        explEn: '把第一个目标定得低到"不可能失败"…不需要很大的决心也能完成.', explVi: '把第一个目标定得低到"不可能失败"…不需要很大的决心也能完成.' },
      { kind: 'trueFalse', bloom: 'understand', prompt: '根据第二篇短文，睡不好的原因主要是压力大。', pinyin: 'Gēn jù dì èr piān duǎn wén, shuì bu hǎo de yuán yīn zhǔ yào shì yā lì dà.',
        isTrue: false, passage: 2,
        explEn: '很多人觉得…其实常常是一些更小的原因.', explVi: '很多人觉得…其实常常是一些更小的原因.' },
      { kind: 'arrangeSentence', bloom: 'apply', prompt: '重要的是 / 天天走 / 而不是 / 走得多', pinyin: 'zhòng yào de shì / tiān tiān zǒu / ér bú shì / zǒu de duō',
        answer: '重要的是天天走，而不是走得多。', answerVi: 'Quan trọng là ngày nào cũng đi, chứ không phải đi nhiều.',
        options: [['重要的是', 'quan trọng là'], ['天天走', 'ngày nào cũng đi'], ['而不是', 'chứ không phải'], ['走得多', 'đi nhiều']],
        explEn: 'The real point comes first and 而不是 rules out the wrong one.', explVi: 'Điều cốt lõi nêu trước, 而不是 loại bỏ điều sai.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第一篇短文，累和疼为什么值得注意？', pinyin: 'Gēn jù dì yī piān duǎn wén, lèi hé téng wèi shén me zhí de zhù yì?',
        passage: 1, options: [['它们是放弃最常见的原因', 'chúng là nguyên nhân bỏ cuộc phổ biến nhất'], ['它们说明运动有效果', 'chúng cho thấy vận động có hiệu quả'], ['它们会影响睡觉', 'chúng ảnh hưởng đến giấc ngủ'], ['它们过两天就好了', 'vài hôm là hết']], correct: 0,
        explEn: '而累和疼正是放弃最常见的原因.', explVi: '而累和疼正是放弃最常见的原因.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第二篇短文，周末晚睡三个小时会怎么样？', pinyin: 'Gēn jù dì èr piān duǎn wén, zhōu mò wǎn shuì sān gè xiǎo shí huì zěn me yàng?',
        passage: 2, options: [['星期一早上像坐了一趟长途车', 'sáng thứ Hai như vừa đi một chuyến xe đường dài'], ['星期一会更有精神', 'thứ Hai sẽ tỉnh táo hơn'], ['对身体没有影响', 'không ảnh hưởng đến cơ thể'], ['可以补回平时的觉', 'bù lại được giấc ngủ ngày thường']], correct: 0,
        explEn: '周末比平时晚睡三个小时，星期一早上就像坐了一趟长途车.', explVi: '周末比平时晚睡三个小时，星期一早上就像坐了一趟长途车.' },
      { kind: 'listeningComprehension', bloom: 'understand', prompt: 'B建议怎么解决睡前看手机的问题？', pinyin: 'B jiàn yì zěn me jiě jué shuì qián kàn shǒu jī de wèn tí?',
        line: 10, options: [['把手机放在客厅充电', 'để điện thoại sạc ở phòng khách'], ['睡前多看一会儿', 'trước khi ngủ xem thêm một lát'], ['买一个新的手机', 'mua điện thoại mới'], ['晚上不回消息', 'buổi tối không trả lời tin nhắn']], correct: 0,
        explEn: 'B says: 把手机放在客厅充电，这一个改变就能提前半小时睡着.', explVi: 'B nói: 把手机放在客厅充电，这一个改变就能提前半小时睡着.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B为什么说要从小事开始？', pinyin: 'B wèi shén me shuō yào cóng xiǎo shì kāi shǐ?',
        line: 14, options: [['难的不是做一天，而是做一年', 'cái khó không phải làm một ngày mà là làm một năm'], ['因为小事更有效果', 'vì việc nhỏ hiệu quả hơn'], ['因为他没有时间', 'vì anh ấy không có thời gian'], ['因为别的办法要花钱', 'vì cách khác tốn tiền']], correct: 0,
        explEn: 'B says: 难的不是做一天，是做一年，所以才要从小事开始.', explVi: 'B nói: 难的不是做一天，是做一年，所以才要从小事开始.' }
    ]
  }
};
