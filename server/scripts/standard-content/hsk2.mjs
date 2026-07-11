// Hand-authored HSK2 lesson content (17 lessons). Same compact schema as hsk1.mjs.

export default [
  {
    slug: 'appointment',
    titleZh: '约时间',
    titleEn: 'Making an Appointment',
    titleVi: 'Hẹn giờ',
    summaryEn: 'Two friends find a time to study Chinese together: tomorrow afternoon at three at Li Yue\'s home.',
    summaryVi: 'Hai người bạn hẹn nhau học tiếng Trung: ba giờ chiều mai tại nhà Lý Nguyệt.',
    vocab: [
      ['时间', 'shi2 jian1', 'noun', 'time', 'thời gian'],
      ['忙', 'mang2', 'adjective', 'busy', 'bận'],
      ['事情', 'shi4 qing5', 'noun', 'matter, thing (to do)', 'việc, chuyện'],
      ['一起', 'yi4 qi3', 'adverb', 'together', 'cùng nhau'],
      ['可以', 'ke3 yi3', 'modal verb', 'can, may', 'có thể, được'],
      ['时候', 'shi2 hou5', 'noun', 'time, moment (什么时候: when)', 'lúc, khi (什么时候: khi nào)']
    ],
    grammar: [
      {
        pattern: '可以 + 动词 / ……，可以吗？',
        explanation: '“可以”表示能做、同意：我们一起学，可以吗？',
        explanation_vi: '可以 diễn tả sự cho phép/đồng ý: …，可以吗? = … được không? Trả lời: 可以 (được) / 不可以.',
        examples: [
          ['我们明天一起学汉语，可以吗？', 'Wo3 men5 ming2 tian1 yi4 qi3 xue2 Han4 yu3, ke3 yi3 ma5?', 'Can we study Chinese together tomorrow?', 'Mai chúng mình cùng học tiếng Trung, được không?'],
          ['可以，没问题。', 'Ke3 yi3, mei2 wen4 ti2.', 'Sure, no problem.', 'Được chứ, không vấn đề gì.'],
          ['现在你可以说汉语了。', 'Xian4 zai4 ni3 ke3 yi3 shuo1 Han4 yu3 le5.', 'You can speak Chinese now.', 'Bây giờ bạn có thể nói tiếng Trung rồi.']
        ]
      },
      {
        pattern: '什么时候……？',
        explanation: '问时间用“什么时候”：我们什么时候见？',
        explanation_vi: 'Hỏi thời điểm dùng 什么时候 (khi nào): 我们什么时候见? = Khi nào chúng ta gặp nhau?',
        examples: [
          ['我们什么时候见？', 'Wo3 men5 shen2 me5 shi2 hou5 jian4?', 'When shall we meet?', 'Khi nào chúng mình gặp nhau?'],
          ['你什么时候有时间？', 'Ni3 shen2 me5 shi2 hou5 you3 shi2 jian1?', 'When are you free?', 'Khi nào bạn rảnh?'],
          ['他什么时候来？', 'Ta1 shen2 me5 shi2 hou5 lai2?', 'When is he coming?', 'Khi nào anh ấy đến?']
        ]
      }
    ],
    warmup: {
      items: ['你明天有时间吗？', '你什么时候很忙？', '和朋友约一个时间。'],
      itemsVi: [
        'Ngày mai bạn có rảnh không? (有时间 / 没有时间)',
        'Bạn thường bận vào lúc nào trong ngày?',
        'Thử hẹn giờ với một người bạn: giờ nào, ở đâu?'
      ]
    },
    dialogue: [
      ['A', '李月，你明天有时间吗？', 'Li3 Yue4, ni3 ming2 tian1 you3 shi2 jian1 ma5?', 'Li Yue, do you have time tomorrow?', 'Lý Nguyệt, mai bạn có rảnh không?'],
      ['B', '上午我有事情，很忙。下午有时间。', 'Shang4 wu3 wo3 you3 shi4 qing5, hen3 mang2. Xia4 wu3 you3 shi2 jian1.', "I have things to do in the morning — pretty busy. I'm free in the afternoon.", 'Sáng mình có việc, bận lắm. Chiều thì rảnh.'],
      ['A', '我们下午一起学汉语，可以吗？', 'Wo3 men5 xia4 wu3 yi4 qi3 xue2 Han4 yu3, ke3 yi3 ma5?', 'Can we study Chinese together in the afternoon?', 'Chiều mình học tiếng Trung cùng nhau được không?'],
      ['B', '可以！什么时候？在哪儿？', 'Ke3 yi3! Shen2 me5 shi2 hou5? Zai4 na3r5?', 'Sure! When and where?', 'Được chứ! Mấy giờ? Ở đâu?'],
      ['A', '下午三点，在你家，怎么样？', 'Xia4 wu3 san1 dian3, zai4 ni3 jia1, zen3 me5 yang4?', 'Three in the afternoon, at your place — how about that?', 'Ba giờ chiều, ở nhà bạn, thế nào?'],
      ['B', '好啊，我在家等你。', 'Hao3 a5, wo3 zai4 jia1 deng3 ni3.', "OK, I'll wait for you at home.", 'Được đó, mình sẽ đợi bạn ở nhà.'],
      ['A', '那明天下午三点见！', 'Na4 ming2 tian1 xia4 wu3 san1 dian3 jian4!', 'See you at three tomorrow afternoon then!', 'Vậy hẹn ba giờ chiều mai nhé!'],
      ['B', '好，明天见！', 'Hao3, ming2 tian1 jian4!', 'OK, see you tomorrow!', 'Ừ, mai gặp!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你明天有___吗？', 'Ni3 ming2 tian1 you3 ___ ma5?', ['时间', '时候', '事情'], 0, ['thời gian', 'lúc/khi', 'công việc'], '问别人有没有空说“有时间吗”。', 'Hỏi ai đó có rảnh không: 你有时间吗? (Bạn có thời gian không?).'],
      ['fill_blank', 'remember', '我们一起学汉语，___吗？', 'Wo3 men5 yi4 qi3 xue2 Han4 yu3, ___ ma5?', ['可以', '什么', '一起'], 0, ['được (không)', 'gì', 'cùng nhau'], '问别人同意不同意，用“……，可以吗？”', 'Xin sự đồng ý dùng mẫu …，可以吗? = … được không?'],
      ['multiple_choice', 'understand', '李月什么时候很忙？', 'Li3 Yue4 shen2 me5 shi2 hou5 hen3 mang2?', ['上午', '下午', '晚上'], 0, ['buổi sáng', 'buổi chiều', 'buổi tối'], '她说“上午我有事情，很忙”。', 'Lý Nguyệt nói sáng có việc nên bận (上午很忙), chiều mới rảnh.'],
      ['word_order', 'understand', ['我们', '下午', '一起', '学', '汉语'], 'wo3 men5 / xia4 wu3 / yi4 qi3 / xue2 / Han4 yu3', ['chúng ta', 'buổi chiều', 'cùng nhau', 'học', 'tiếng Trung'], '我们下午一起学汉语。', 'Buổi chiều chúng mình cùng học tiếng Trung.', '时间词在前，“一起”在动词前面。', 'Trật tự: 我们 + 下午 (thời gian) + 一起 + 学汉语. 一起 đứng ngay trước động từ.'],
      ['listening_comprehension', 'understand', [4, 5], '他们在哪儿见？', 'Ta1 men5 zai4 na3r5 jian4?', ['李月家', '学校', '饭馆'], 0, ['nhà Lý Nguyệt', 'trường học', 'quán ăn'], '“在你家，怎么样？”“好啊，我在家等你。”', 'Hai bạn thống nhất gặp ở nhà Lý Nguyệt (在你家), bạn ấy sẽ đợi ở nhà.'],
      ['true_false', 'understand', '他们明天上午一起学汉语。', 'Ta1 men5 ming2 tian1 shang4 wu3 yi4 qi3 xue2 Han4 yu3.', false, '他们下午三点见，因为上午李月很忙。', 'Sai. Buổi sáng Lý Nguyệt bận, nên hẹn ba giờ chiều mới học cùng nhau.'],
      ['reading_comprehension', 'understand', '他们几点见？', 'Ta1 men5 ji3 dian3 jian4?', ['下午三点', '上午三点', '下午五点'], 0, ['3 giờ chiều', '3 giờ sáng', '5 giờ chiều'], '“那明天下午三点见！”', 'Lời hẹn cuối: 明天下午三点见 → gặp lúc 3 giờ chiều mai.']
    ]
  },
  {
    slug: 'transport',
    titleZh: '坐车',
    titleEn: 'Transport',
    titleVi: 'Đi lại',
    summaryEn: 'A traveler asks how to get to the train station: bus is cheap but slow, taxi is fast but expensive.',
    summaryVi: 'Một người hỏi đường ra ga tàu: xe buýt rẻ nhưng chậm, taxi nhanh nhưng đắt.',
    vocab: [
      ['坐', 'zuo4', 'verb', 'to take (transport)', 'đi, ngồi (phương tiện)'],
      ['公共汽车', 'gong1 gong4 qi4 che1', 'noun', 'bus', 'xe buýt'],
      ['出租车', 'chu1 zu1 che1', 'noun', 'taxi', 'taxi'],
      ['火车站', 'huo3 che1 zhan4', 'noun', 'train station', 'ga tàu hỏa'],
      ['怎么', 'zen3 me5', 'pronoun', 'how', 'thế nào, làm sao'],
      ['分钟', 'fen1 zhong1', 'measure word', 'minute (duration)', 'phút (khoảng thời gian)'],
      ['快', 'kuai4', 'adjective', 'fast', 'nhanh'],
      ['但是', 'dan4 shi4', 'conjunction', 'but', 'nhưng']
    ],
    grammar: [
      {
        pattern: '怎么 + 动词',
        explanation: '“怎么”问方法：去火车站怎么走？',
        explanation_vi: '怎么 + động từ hỏi cách thức: 怎么走? = đi thế nào?, 怎么去? = đi bằng gì/đường nào?',
        examples: [
          ['请问，去火车站怎么走？', 'Qing3 wen4, qu4 huo3 che1 zhan4 zen3 me5 zou3?', 'Excuse me, how do I get to the train station?', 'Cho hỏi, đến ga tàu đi thế nào ạ?'],
          ['这个汉字怎么写？', 'Zhe4 ge5 Han4 zi4 zen3 me5 xie3?', 'How do you write this character?', 'Chữ Hán này viết thế nào?'],
          ['你怎么去学校？', 'Ni3 zen3 me5 qu4 xue2 xiao4?', 'How do you get to school?', 'Bạn đến trường bằng cách nào?']
        ]
      },
      {
        pattern: '……，但是……',
        explanation: '“但是”表示转折：出租车很快，但是很贵。',
        explanation_vi: '但是 = nhưng, nối hai vế đối lập: 出租车很快，但是很贵 = Taxi nhanh nhưng đắt.',
        examples: [
          ['出租车很快，但是很贵。', 'Chu1 zu1 che1 hen3 kuai4, dan4 shi4 hen3 gui4.', 'Taxis are fast but expensive.', 'Taxi rất nhanh nhưng rất đắt.'],
          ['汉语很难，但是很有意思。', 'Han4 yu3 hen3 nan2, dan4 shi4 hen3 you3 yi4 si5.', 'Chinese is hard but interesting.', 'Tiếng Trung khó nhưng rất thú vị.'],
          ['我很忙，但是我会来。', 'Wo3 hen3 mang2, dan4 shi4 wo3 hui4 lai2.', "I'm busy, but I will come.", 'Mình bận, nhưng mình sẽ đến.']
        ]
      }
    ],
    warmup: {
      items: ['你怎么去学校？', '说一说：公共汽车 / 出租车。', '坐车要多少分钟？'],
      itemsVi: [
        'Bạn đến trường/công ty bằng phương tiện gì?',
        'Đọc từ mới: 公共汽车 (xe buýt) / 出租车 (taxi).',
        'Đi mất bao nhiêu phút? Trả lời với …分钟.'
      ]
    },
    dialogue: [
      ['A', '请问，去火车站怎么走？', 'Qing3 wen4, qu4 huo3 che1 zhan4 zen3 me5 zou3?', 'Excuse me, how do I get to the train station?', 'Cho hỏi, đến ga tàu hỏa đi thế nào ạ?'],
      ['B', '你可以坐公共汽车，也可以坐出租车。', 'Ni3 ke3 yi3 zuo4 gong1 gong4 qi4 che1, ye3 ke3 yi3 zuo4 chu1 zu1 che1.', 'You can take the bus or a taxi.', 'Bạn có thể đi xe buýt, cũng có thể đi taxi.'],
      ['A', '坐公共汽车要多少分钟？', 'Zuo4 gong1 gong4 qi4 che1 yao4 duo1 shao5 fen1 zhong1?', 'How many minutes does the bus take?', 'Đi xe buýt mất bao nhiêu phút?'],
      ['B', '要三十分钟。', 'Yao4 san1 shi2 fen1 zhong1.', 'About thirty minutes.', 'Mất khoảng ba mươi phút.'],
      ['A', '出租车快吗？', 'Chu1 zu1 che1 kuai4 ma5?', 'Is a taxi faster?', 'Thế taxi có nhanh không?'],
      ['B', '出租车很快，十五分钟，但是很贵。', 'Chu1 zu1 che1 hen3 kuai4, shi2 wu3 fen1 zhong1, dan4 shi4 hen3 gui4.', 'A taxi is fast — fifteen minutes — but expensive.', 'Taxi nhanh lắm, mười lăm phút thôi, nhưng mà đắt.'],
      ['A', '好，我坐公共汽车。谢谢你！', 'Hao3, wo3 zuo4 gong1 gong4 qi4 che1. Xie4 xie5 ni3!', "OK, I'll take the bus. Thank you!", 'Vậy mình đi xe buýt. Cảm ơn bạn nhé!'],
      ['B', '不客气！', 'Bu2 ke4 qi5!', "You're welcome!", 'Không có gì!']
    ],
    exercises: [
      ['fill_blank', 'remember', '请问，去火车站___走？', 'Qing3 wen4, qu4 huo3 che1 zhan4 ___ zou3?', ['怎么', '什么', '几'], 0, ['thế nào', 'gì', 'mấy'], '问方法用“怎么”：怎么走？', 'Hỏi cách đi dùng 怎么走 (đi thế nào).'],
      ['fill_blank', 'remember', '出租车很快，___很贵。', 'Chu1 zu1 che1 hen3 kuai4, ___ hen3 gui4.', ['但是', '因为', '也'], 0, ['nhưng', 'bởi vì', 'cũng'], '前后意思转折，用“但是”。', 'Hai vế trái ngược (nhanh >< đắt) nối bằng 但是 (nhưng).'],
      ['multiple_choice', 'understand', '坐公共汽车要多少分钟？', 'Zuo4 gong1 gong4 qi4 che1 yao4 duo1 shao5 fen1 zhong1?', ['三十分钟', '十五分钟', '五十分钟'], 0, ['30 phút', '15 phút', '50 phút'], '“要三十分钟。”', 'Người chỉ đường nói xe buýt mất 三十分钟 (30 phút); taxi mới là 15 phút.'],
      ['word_order', 'understand', ['你', '可以', '坐', '公共汽车', '去'], 'ni3 / ke3 yi3 / zuo4 / gong1 gong4 qi4 che1 / qu4', ['bạn', 'có thể', 'đi (ngồi)', 'xe buýt', 'đi/đến'], '你可以坐公共汽车去。', 'Bạn có thể đi xe buýt đến đó.', '“坐+车”在“去”前面：坐公共汽车去。', 'Mẫu 坐 + phương tiện + 去: nói phương tiện trước, 去 sau.'],
      ['listening_comprehension', 'understand', [5], '出租车怎么样？', 'Chu1 zu1 che1 zen3 me5 yang4?', ['很快但是很贵', '很慢但是便宜', '不快也不贵'], 0, ['nhanh nhưng đắt', 'chậm nhưng rẻ', 'không nhanh không đắt'], '“出租车很快，十五分钟，但是很贵。”', 'Câu nghe được: taxi rất nhanh (15 phút) nhưng rất đắt.'],
      ['true_false', 'understand', '他最后坐出租车去火车站。', 'Ta1 zui4 hou4 zuo4 chu1 zu1 che1 qu4 huo3 che1 zhan4.', false, '他说：“好，我坐公共汽车。”', 'Sai. Cuối cùng anh ấy chọn đi xe buýt (我坐公共汽车) vì taxi đắt.'],
      ['reading_comprehension', 'understand', '去火车站可以怎么去？', 'Qu4 huo3 che1 zhan4 ke3 yi3 zen3 me5 qu4?', ['坐公共汽车或者坐出租车', '只可以坐出租车', '只可以走路'], 0, ['đi xe buýt hoặc taxi', 'chỉ có thể đi taxi', 'chỉ có thể đi bộ'], '“你可以坐公共汽车，也可以坐出租车。”', 'Có hai cách: xe buýt (rẻ, 30 phút) hoặc taxi (nhanh, đắt).']
    ]
  },
  {
    slug: 'weather-plan',
    titleZh: '天气计划',
    titleEn: 'Weather Plans',
    titleVi: 'Kế hoạch theo thời tiết',
    summaryEn: 'Rain is coming in the morning, so two friends move their outing to a sunny afternoon.',
    summaryVi: 'Sáng mai trời mưa nên hai người bạn dời buổi đi chơi sang buổi chiều nắng ráo.',
    vocab: [
      ['出去', 'chu1 qu4', 'verb', 'to go out', 'ra ngoài, đi ra'],
      ['玩儿', 'wan2r5', 'verb', 'to play, to have fun', 'chơi, đi chơi'],
      ['晴天', 'qing2 tian1', 'noun', 'sunny day', 'trời nắng, trời quang'],
      ['阴天', 'yin1 tian1', 'noun', 'cloudy day', 'trời âm u'],
      ['因为', 'yin1 wei4', 'conjunction', 'because', 'bởi vì'],
      ['所以', 'suo3 yi3', 'conjunction', 'so, therefore', 'cho nên, vì vậy']
    ],
    grammar: [
      {
        pattern: '因为……，所以……',
        explanation: '先说原因，再说结果：因为下午天气好，所以我们下午去。',
        explanation_vi: 'Nói nguyên nhân trước (因为), kết quả sau (所以): Vì chiều trời đẹp nên chiều mới đi.',
        examples: [
          ['因为下雨，所以我们不出去。', 'Yin1 wei4 xia4 yu3, suo3 yi3 wo3 men5 bu4 chu1 qu4.', "Because it's raining, we're not going out.", 'Vì trời mưa nên chúng mình không ra ngoài.'],
          ['因为他很忙，所以他晚上才有时间。', 'Yin1 wei4 ta1 hen3 mang2, suo3 yi3 ta1 wan3 shang5 cai2 you3 shi2 jian1.', 'Because he is busy, he is only free in the evening.', 'Vì anh ấy bận nên tối mới rảnh.'],
          ['因为天气好，所以我们去玩儿。', 'Yin1 wei4 tian1 qi4 hao3, suo3 yi3 wo3 men5 qu4 wan2r5.', 'Because the weather is nice, we are going out to have fun.', 'Vì trời đẹp nên chúng mình đi chơi.']
        ]
      },
      {
        pattern: '那……（吧）',
        explanation: '“那”在句子开始，表示“这样的话”：那我们下午去吧。',
        explanation_vi: '那 đầu câu = "vậy thì": 那我们下午去吧 = Vậy thì chiều chúng mình đi nhé.',
        examples: [
          ['那我们下午去吧。', 'Na4 wo3 men5 xia4 wu3 qu4 ba5.', "Then let's go in the afternoon.", 'Vậy thì chiều chúng mình đi nhé.'],
          ['那明天见吧。', 'Na4 ming2 tian1 jian4 ba5.', 'See you tomorrow then.', 'Vậy hẹn mai gặp nhé.'],
          ['那你多休息吧。', 'Na4 ni3 duo1 xiu1 xi5 ba5.', 'Then get some rest.', 'Vậy thì bạn nghỉ ngơi nhiều vào nhé.']
        ]
      }
    ],
    warmup: {
      items: ['明天是晴天还是阴天？', '下雨的时候你做什么？', '天气好的时候你想去哪儿？'],
      itemsVi: [
        'Ngày mai trời nắng (晴天) hay âm u (阴天)?',
        'Khi trời mưa bạn thường làm gì ở nhà?',
        'Khi trời đẹp bạn muốn đi đâu chơi?'
      ]
    },
    dialogue: [
      ['A', '明天我们出去玩儿，好吗？', 'Ming2 tian1 wo3 men5 chu1 qu4 wan2r5, hao3 ma5?', "Let's go out and have fun tomorrow, OK?", 'Mai chúng mình ra ngoài chơi nhé?'],
      ['B', '我看了天气：明天上午是阴天，会下雨。', 'Wo3 kan4 le5 tian1 qi4: ming2 tian1 shang4 wu3 shi4 yin1 tian1, hui4 xia4 yu3.', 'I checked the weather: tomorrow morning will be cloudy with rain.', 'Mình xem thời tiết rồi: sáng mai trời âm u, sẽ có mưa đấy.'],
      ['A', '是吗？那下午呢？', 'Shi4 ma5? Na4 xia4 wu3 ne5?', 'Really? What about the afternoon?', 'Thế à? Vậy buổi chiều thì sao?'],
      ['B', '下午是晴天，不下雨。', 'Xia4 wu3 shi4 qing2 tian1, bu2 xia4 yu3.', 'The afternoon will be sunny, no rain.', 'Chiều trời nắng, không mưa.'],
      ['A', '太好了！因为下午天气好，所以我们下午出去。', 'Tai4 hao3 le5! Yin1 wei4 xia4 wu3 tian1 qi4 hao3, suo3 yi3 wo3 men5 xia4 wu3 chu1 qu4.', "Great! Since the weather is nice in the afternoon, let's go out then.", 'Hay quá! Vì chiều trời đẹp nên chúng mình sẽ đi chơi buổi chiều.'],
      ['B', '好，那我们下午两点出去玩儿吧。', 'Hao3, na4 wo3 men5 xia4 wu3 liang3 dian3 chu1 qu4 wan2r5 ba5.', "OK, then let's head out at two.", 'Ừ, vậy hai giờ chiều mình xuất phát nhé.'],
      ['A', '上午下雨的时候，我在家看书。', 'Shang4 wu3 xia4 yu3 de5 shi2 hou5, wo3 zai4 jia1 kan4 shu1.', "While it rains in the morning, I'll read at home.", 'Sáng lúc trời mưa thì mình ở nhà đọc sách vậy.'],
      ['B', '我也是！下午见！', 'Wo3 ye3 shi4! Xia4 wu3 jian4!', 'Me too! See you in the afternoon!', 'Mình cũng thế! Hẹn chiều gặp nhé!']
    ],
    exercises: [
      ['fill_blank', 'remember', '___下午天气好，所以我们下午出去。', '___ xia4 wu3 tian1 qi4 hao3, suo3 yi3 wo3 men5 xia4 wu3 chu1 qu4.', ['因为', '但是', '所以'], 0, ['bởi vì', 'nhưng', 'cho nên'], '“因为”说原因，“所以”说结果。', 'Cặp 因为…所以…: 因为 đứng trước nguyên nhân.'],
      ['fill_blank', 'remember', '明天上午是___，会下雨。', 'Ming2 tian1 shang4 wu3 shi4 ___, hui4 xia4 yu3.', ['阴天', '晴天', '热天'], 0, ['trời âm u', 'trời nắng', 'trời nóng'], '课文里说上午是阴天，会下雨。', 'Trong bài: sáng mai trời âm u (阴天) và sẽ mưa.'],
      ['multiple_choice', 'understand', '他们为什么下午出去？', 'Ta1 men5 wei4 shen2 me5 xia4 wu3 chu1 qu4?', ['因为下午是晴天', '因为下午下雨', '因为上午天气好'], 0, ['vì chiều trời nắng', 'vì chiều trời mưa', 'vì sáng trời đẹp'], '因为下午是晴天，不下雨，所以下午出去。', 'Lý do: chiều là 晴天 không mưa, nên dời đi chơi sang chiều.'],
      ['word_order', 'understand', ['因为', '下雨', '所以', '我们', '不出去'], 'yin1 wei4 / xia4 yu3 / suo3 yi3 / wo3 men5 / bu4 chu1 qu4', ['bởi vì', 'trời mưa', 'cho nên', 'chúng ta', 'không ra ngoài'], '因为下雨，所以我们不出去。', 'Vì trời mưa nên chúng mình không ra ngoài.', '“因为”在原因前面，“所以”在结果前面。', 'Trật tự: 因为 + nguyên nhân, 所以 + kết quả.'],
      ['listening_comprehension', 'understand', [5], '他们下午几点出去？', 'Ta1 men5 xia4 wu3 ji3 dian3 chu1 qu4?', ['两点', '三点', '五点'], 0, ['2 giờ', '3 giờ', '5 giờ'], '“那我们下午两点出去玩儿吧。”', 'Câu nghe được: 下午两点出去玩儿 → 2 giờ chiều xuất phát.'],
      ['true_false', 'understand', '明天下午会下雨。', 'Ming2 tian1 xia4 wu3 hui4 xia4 yu3.', false, '下午是晴天，不下雨；上午才会下雨。', 'Sai. Chiều mai trời nắng không mưa; mưa là vào buổi sáng.'],
      ['reading_comprehension', 'understand', '上午下雨的时候，A做什么？', 'Shang4 wu3 xia4 yu3 de5 shi2 hou5, A zuo4 shen2 me5?', ['在家看书', '出去玩儿', '去朋友家'], 0, ['ở nhà đọc sách', 'ra ngoài chơi', 'đến nhà bạn'], '“上午下雨的时候，我在家看书。”', 'Sáng mưa nên A ở nhà đọc sách, chiều mới ra ngoài chơi.']
    ]
  },
  {
    slug: 'restaurant',
    titleZh: '饭馆点菜',
    titleEn: 'At a Restaurant',
    titleVi: 'Gọi món ở quán ăn',
    summaryEn: 'A customer orders fish, rice, an egg dish and drinks, then pays thirty-five kuai.',
    summaryVi: 'Thực khách gọi cá, cơm, món trứng và đồ uống, sau đó thanh toán ba mươi lăm tệ.',
    vocab: [
      ['服务员', 'fu2 wu4 yuan2', 'noun', 'waiter, waitress', 'nhân viên phục vụ'],
      ['鱼', 'yu2', 'noun', 'fish', 'cá'],
      ['鸡蛋', 'ji1 dan4', 'noun', 'egg', 'trứng gà'],
      ['再', 'zai4', 'adverb', 'again, more', 'thêm, nữa'],
      ['还', 'hai2', 'adverb', 'still, also', 'còn, vẫn'],
      ['等', 'deng3', 'verb', 'to wait', 'đợi, chờ'],
      ['一下', 'yi2 xia4', 'measure word', 'a moment (softener)', 'một chút, một lát']
    ],
    grammar: [
      {
        pattern: '要 + 名词（点菜）',
        explanation: '点菜的时候说“我要……”：我要鱼和米饭。',
        explanation_vi: 'Gọi món dùng 要: 我要鱼和米饭 = Cho tôi cá và cơm.',
        examples: [
          ['我要鱼和米饭。', 'Wo3 yao4 yu2 he2 mi3 fan4.', "I'll have fish and rice.", 'Cho mình cá và cơm.'],
          ['你们要喝什么？', 'Ni3 men5 yao4 he1 shen2 me5?', 'What would you like to drink?', 'Các bạn muốn uống gì?'],
          ['我要一杯茶。', 'Wo3 yao4 yi4 bei1 cha2.', "I'd like a cup of tea.", 'Cho mình một cốc trà.']
        ]
      },
      {
        pattern: '再 + 动词 / 动词 + 一下',
        explanation: '“再”表示“多要一个”；“等一下”说“等一等”。',
        explanation_vi: '再 = thêm nữa (再给我一杯水 = cho thêm cốc nước); V + 一下 làm câu nhẹ nhàng: 等一下 = đợi một chút.',
        examples: [
          ['请再给我一杯水。', 'Qing3 zai4 gei3 wo3 yi4 bei1 shui3.', 'Please give me another glass of water.', 'Cho mình thêm một cốc nước nữa nhé.'],
          ['请等一下。', 'Qing3 deng3 yi2 xia4.', 'Please wait a moment.', 'Xin đợi một chút.'],
          ['你看一下这本书。', 'Ni3 kan4 yi2 xia4 zhe4 ben3 shu1.', 'Take a look at this book.', 'Bạn xem qua cuốn sách này một chút đi.']
        ]
      }
    ],
    warmup: {
      items: ['在饭馆你想吃什么？', '说一说：鱼 / 鸡蛋 / 米饭。', '你会说“我要……”吗？'],
      itemsVi: [
        'Vào quán ăn bạn hay gọi món gì?',
        'Đọc từ mới: 鱼 (cá) / 鸡蛋 (trứng) / 米饭 (cơm).',
        'Tập gọi món với mẫu 我要… (Cho tôi…).'
      ]
    },
    dialogue: [
      ['A', '你们好！你们要吃什么？', 'Ni3 men5 hao3! Ni3 men5 yao4 chi1 shen2 me5?', 'Hello! What would you like to eat?', 'Chào quý khách! Anh chị muốn dùng gì ạ?'],
      ['B', '我要鱼和米饭。', 'Wo3 yao4 yu2 he2 mi3 fan4.', "I'll have the fish and rice.", 'Cho mình cá và cơm.'],
      ['A', '好。还要鸡蛋吗？今天的鸡蛋很好吃。', 'Hao3. Hai2 yao4 ji1 dan4 ma5? Jin1 tian1 de5 ji1 dan4 hen3 hao3 chi1.', 'Sure. Would you also like eggs? They are very good today.', 'Vâng. Anh chị dùng thêm trứng không? Trứng hôm nay ngon lắm ạ.'],
      ['B', '好，再要一个鸡蛋。', 'Hao3, zai4 yao4 yi2 ge4 ji1 dan4.', 'OK, one egg dish as well.', 'Được, cho thêm một phần trứng.'],
      ['A', '要喝什么？', 'Yao4 he1 shen2 me5?', 'Anything to drink?', 'Anh chị uống gì ạ?'],
      ['B', '一杯茶。请再给我一杯水，谢谢。', 'Yi4 bei1 cha2. Qing3 zai4 gei3 wo3 yi4 bei1 shui3, xie4 xie5.', 'A cup of tea. And a glass of water too, please.', 'Một cốc trà. Cho mình thêm một cốc nước nữa nhé, cảm ơn.'],
      ['A', '好的，请等一下。', 'Hao3 de5, qing3 deng3 yi2 xia4.', 'Sure, one moment please.', 'Vâng, anh chị đợi một lát ạ.'],
      ['B', '服务员，多少钱？', 'Fu2 wu4 yuan2, duo1 shao5 qian2?', 'Waiter, how much is it?', 'Bạn ơi, cho mình thanh toán, hết bao nhiêu?'],
      ['A', '一共三十五块钱。', 'Yi2 gong4 san1 shi2 wu3 kuai4 qian2.', "That's thirty-five kuai in total.", 'Tổng cộng là ba mươi lăm tệ ạ.']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___鱼和米饭。', 'Wo3 ___ yu2 he2 mi3 fan4.', ['要', '会', '在'], 0, ['muốn/cho tôi', 'biết', 'đang'], '点菜说“我要……”。', 'Gọi món dùng 要: 我要… = Cho tôi món…'],
      ['fill_blank', 'remember', '请___给我一杯水。', 'Qing3 ___ gei3 wo3 yi4 bei1 shui3.', ['再', '还', '很'], 0, ['thêm (nữa)', 'còn', 'rất'], '“再”表示多要一个：再给我一杯水。', 'Xin thêm đồ dùng 再: 再给我一杯水 = cho thêm một cốc nước.'],
      ['multiple_choice', 'understand', '服务员请客人做什么？', 'Fu2 wu4 yuan2 qing3 ke4 ren5 zuo4 shen2 me5?', ['等一下', '再来一次', '去别的饭馆'], 0, ['đợi một chút', 'quay lại lần sau', 'sang quán khác'], '服务员说：“好的，请等一下。”', 'Nhân viên nói: 请等一下 (xin đợi một lát) sau khi nhận order.'],
      ['word_order', 'understand', ['请', '再', '给', '我', '一杯水'], 'qing3 / zai4 / gei3 / wo3 / yi4 bei1 shui3', ['xin/mời', 'thêm', 'đưa/cho', 'tôi', 'một cốc nước'], '请再给我一杯水。', 'Cho tôi thêm một cốc nước nữa.', '“再”在动词“给”前面。', 'Trật tự: 请 + 再 + 给 + 我 + đồ vật. 再 đứng trước động từ 给.'],
      ['listening_comprehension', 'understand', [8], '一共多少钱？', 'Yi2 gong4 duo1 shao5 qian2?', ['三十五块', '三十块', '四十五块'], 0, ['35 tệ', '30 tệ', '45 tệ'], '服务员说：“一共三十五块钱。”', 'Câu nghe được: 一共三十五块钱 → tổng 35 tệ.'],
      ['true_false', 'understand', '客人没有要鸡蛋。', 'Ke4 ren5 mei2 you3 yao4 ji1 dan4.', false, '客人说：“好，再要一个鸡蛋。”', 'Sai. Khách đồng ý lấy thêm một phần trứng (再要一个鸡蛋).'],
      ['reading_comprehension', 'understand', '客人要喝什么？', 'Ke4 ren5 yao4 he1 shen2 me5?', ['一杯茶和一杯水', '两杯茶', '一杯冷水'], 0, ['một cốc trà và một cốc nước', 'hai cốc trà', 'một cốc nước lạnh'], '“一杯茶。请再给我一杯水。”', 'Khách gọi một cốc trà, rồi xin thêm một cốc nước.']
    ]
  },
  {
    slug: 'shopping-clothes',
    titleZh: '买衣服',
    titleEn: 'Buying Clothes',
    titleVi: 'Mua quần áo',
    summaryEn: 'A shopper compares a red top and a cheaper white one, and buys the white one for 120 kuai.',
    summaryVi: 'Khách chọn giữa chiếc áo đỏ và chiếc áo trắng rẻ hơn, cuối cùng mua áo trắng giá 120 tệ.',
    vocab: [
      ['颜色', 'yan2 se4', 'noun', 'color', 'màu sắc'],
      ['红色', 'hong2 se4', 'noun', 'red', 'màu đỏ'],
      ['白色', 'bai2 se4', 'noun', 'white', 'màu trắng'],
      ['便宜', 'pian2 yi5', 'adjective', 'cheap', 'rẻ'],
      ['比', 'bi3', 'preposition', 'than (comparison)', 'hơn (so sánh)'],
      ['百', 'bai3', 'numeral', 'hundred', 'trăm']
    ],
    grammar: [
      {
        pattern: 'A + 比 + B + 形容词',
        explanation: '“比”做比较：这件比那件便宜。',
        explanation_vi: 'So sánh dùng 比: A 比 B + tính từ = A ... hơn B. VD: 这件比那件便宜 = cái này rẻ hơn cái kia.',
        examples: [
          ['这件白色的比那件便宜。', 'Zhe4 jian4 bai2 se4 de5 bi3 na4 jian4 pian2 yi5.', 'This white one is cheaper than that one.', 'Chiếc màu trắng này rẻ hơn chiếc kia.'],
          ['出租车比公共汽车快。', 'Chu1 zu1 che1 bi3 gong1 gong4 qi4 che1 kuai4.', 'Taxis are faster than buses.', 'Taxi nhanh hơn xe buýt.'],
          ['今天比昨天冷。', 'Jin1 tian1 bi3 zuo2 tian1 leng3.', 'Today is colder than yesterday.', 'Hôm nay lạnh hơn hôm qua.']
        ]
      },
      {
        pattern: '形容词/名词 + 的（……的东西）',
        explanation: '“红色的、便宜一点儿的”，“的”后面可以不说“衣服”。',
        explanation_vi: 'Sau 的 có thể lược danh từ: 红色的 = cái màu đỏ; 便宜一点儿的 = cái rẻ hơn chút.',
        examples: [
          ['我喜欢红色的。', 'Wo3 xi3 huan5 hong2 se4 de5.', 'I like the red one.', 'Mình thích cái màu đỏ.'],
          ['有便宜一点儿的吗？', 'You3 pian2 yi5 yi4 dian3r5 de5 ma5?', 'Do you have a cheaper one?', 'Có cái nào rẻ hơn chút không?'],
          ['我买白色的。', 'Wo3 mai3 bai2 se4 de5.', "I'll buy the white one.", 'Mình lấy cái màu trắng.']
        ]
      }
    ],
    warmup: {
      items: ['你喜欢什么颜色？', '说一说：红色 / 白色。', '这件衣服贵吗？'],
      itemsVi: [
        'Bạn thích màu gì? Trả lời với 我喜欢…色.',
        'Đọc từ mới: 红色 (đỏ) / 白色 (trắng).',
        'Bộ đồ bạn đang mặc đắt hay rẻ? (贵 hay 便宜?)'
      ]
    },
    dialogue: [
      ['A', '你好，我想买一件衣服。', 'Ni3 hao3, wo3 xiang3 mai3 yi2 jian4 yi1 fu5.', "Hi, I'd like to buy a piece of clothing.", 'Chào chị, em muốn mua một chiếc áo.'],
      ['B', '你喜欢什么颜色？', 'Ni3 xi3 huan5 shen2 me5 yan2 se4?', 'What color do you like?', 'Em thích màu gì?'],
      ['A', '我喜欢红色和白色。', 'Wo3 xi3 huan5 hong2 se4 he2 bai2 se4.', 'I like red and white.', 'Em thích màu đỏ và màu trắng.'],
      ['B', '你看，这件红色的很漂亮。', 'Ni3 kan4, zhe4 jian4 hong2 se4 de5 hen3 piao4 liang5.', 'Look, this red one is very pretty.', 'Em xem này, chiếc màu đỏ này đẹp lắm.'],
      ['A', '多少钱？', 'Duo1 shao5 qian2?', 'How much is it?', 'Bao nhiêu tiền ạ?'],
      ['B', '一百八十块。', 'Yi4 bai3 ba1 shi2 kuai4.', 'One hundred and eighty kuai.', 'Một trăm tám mươi tệ.'],
      ['A', '太贵了！有便宜一点儿的吗？', 'Tai4 gui4 le5! You3 pian2 yi5 yi4 dian3r5 de5 ma5?', 'Too expensive! Do you have something cheaper?', 'Đắt quá! Có chiếc nào rẻ hơn chút không chị?'],
      ['B', '这件白色的比那件便宜，一百二十块。', 'Zhe4 jian4 bai2 se4 de5 bi3 na4 jian4 pian2 yi5, yi4 bai3 er4 shi2 kuai4.', 'This white one is cheaper — one hundred and twenty.', 'Chiếc trắng này rẻ hơn chiếc kia, một trăm hai mươi tệ thôi.'],
      ['A', '好，我买白色的。', 'Hao3, wo3 mai3 bai2 se4 de5.', "OK, I'll take the white one.", 'Vâng, em lấy chiếc màu trắng.']
    ],
    exercises: [
      ['fill_blank', 'remember', '你喜欢什么___？', 'Ni3 xi3 huan5 shen2 me5 ___?', ['颜色', '时间', '东西'], 0, ['màu sắc', 'thời gian', 'đồ đạc'], '卖衣服的人问：“你喜欢什么颜色？”', 'Người bán hỏi màu yêu thích: 你喜欢什么颜色?'],
      ['fill_blank', 'remember', '这件白色的___那件便宜。', 'Zhe4 jian4 bai2 se4 de5 ___ na4 jian4 pian2 yi5.', ['比', '和', '给'], 0, ['hơn (so với)', 'và', 'cho/đưa'], '比较用“比”：A比B便宜。', 'So sánh dùng 比: A 比 B 便宜 = A rẻ hơn B.'],
      ['multiple_choice', 'understand', '红色的衣服多少钱？', 'Hong2 se4 de5 yi1 fu5 duo1 shao5 qian2?', ['一百八十块', '一百二十块', '八十块'], 0, ['180 tệ', '120 tệ', '80 tệ'], '红色的一百八十块，白色的一百二十块。', 'Áo đỏ giá 180 tệ (一百八十块); áo trắng mới là 120 tệ.'],
      ['word_order', 'understand', ['这件', '比', '那件', '便宜'], 'zhe4 jian4 / bi3 / na4 jian4 / pian2 yi5', ['chiếc này', 'hơn', 'chiếc kia', 'rẻ'], '这件比那件便宜。', 'Chiếc này rẻ hơn chiếc kia.', '“比”在中间：A比B+形容词。', 'Cấu trúc so sánh: A + 比 + B + tính từ. Tính từ đứng cuối.'],
      ['listening_comprehension', 'understand', [7, 8], '她最后买了哪件衣服？', 'Ta1 zui4 hou4 mai3 le5 na3 jian4 yi1 fu5?', ['白色的', '红色的', '两件都买了'], 0, ['chiếc trắng', 'chiếc đỏ', 'mua cả hai'], '她说：“好，我买白色的。”', 'Câu nghe được: 我买白色的 → chọn chiếc màu trắng rẻ hơn.'],
      ['true_false', 'understand', '白色的衣服比红色的贵。', 'Bai2 se4 de5 yi1 fu5 bi3 hong2 se4 de5 gui4.', false, '白色的一百二十块，比红色的（一百八十块）便宜。', 'Sai. Áo trắng 120 tệ rẻ hơn áo đỏ 180 tệ.'],
      ['reading_comprehension', 'understand', '她为什么不买红色的？', 'Ta1 wei4 shen2 me5 bu4 mai3 hong2 se4 de5?', ['太贵了', '不漂亮', '没有红色的'], 0, ['đắt quá', 'không đẹp', 'hết màu đỏ'], '她说：“太贵了！有便宜一点儿的吗？”', 'Khách chê áo đỏ 太贵了 (đắt quá) nên chọn chiếc trắng rẻ hơn.']
    ]
  },
  {
    slug: 'phone',
    titleZh: '打电话',
    titleEn: 'Phone Calls',
    titleVi: 'Gọi điện thoại',
    summaryEn: 'Li Yue calls Xiaoming\'s home; he is sleeping, so she leaves a message about tomorrow\'s meeting.',
    summaryVi: 'Lý Nguyệt gọi đến nhà Tiểu Minh; cậu ấy đang ngủ nên bạn nhắn lại lời hẹn ngày mai.',
    vocab: [
      ['喂', 'wei2', 'interjection', 'hello (on the phone)', 'a lô'],
      ['打电话', 'da3 dian4 hua4', 'verb phrase', 'to make a phone call', 'gọi điện thoại'],
      ['正在', 'zheng4 zai4', 'adverb', 'in the middle of (doing)', 'đang (làm gì đó)'],
      ['告诉', 'gao4 su5', 'verb', 'to tell', 'nói cho biết, bảo'],
      ['知道', 'zhi1 dao4', 'verb', 'to know', 'biết']
    ],
    grammar: [
      {
        pattern: '正在 + 动词',
        explanation: '“正在”表示动作现在进行：他正在睡觉。',
        explanation_vi: '正在 + động từ = đang làm gì (nhấn mạnh hơn 在): 他正在睡觉 = Cậu ấy đang ngủ.',
        examples: [
          ['他正在睡觉。', 'Ta1 zheng4 zai4 shui4 jiao4.', 'He is sleeping right now.', 'Cậu ấy đang ngủ.'],
          ['我正在看书。', 'Wo3 zheng4 zai4 kan4 shu1.', 'I am reading right now.', 'Mình đang đọc sách.'],
          ['妈妈正在打电话。', 'Ma1 ma5 zheng4 zai4 da3 dian4 hua4.', 'Mom is on the phone.', 'Mẹ đang nghe điện thoại.']
        ]
      },
      {
        pattern: '给 + 人 + 打电话 / 告诉 + 人 + 事情',
        explanation: '“给他打电话”“告诉他一件事”。',
        explanation_vi: '给 + người + 打电话 = gọi điện cho ai; 告诉 + người + việc = nói cho ai biết việc gì.',
        examples: [
          ['他晚上给你打电话。', 'Ta1 wan3 shang5 gei3 ni3 da3 dian4 hua4.', 'He will call you tonight.', 'Tối nay cậu ấy sẽ gọi lại cho bạn.'],
          ['请告诉他，明天三点见。', 'Qing3 gao4 su5 ta1, ming2 tian1 san1 dian3 jian4.', "Please tell him we're meeting at three tomorrow.", 'Nhờ bạn nhắn cậu ấy: mai ba giờ gặp nhau.'],
          ['我想给妈妈打电话。', 'Wo3 xiang3 gei3 ma1 ma5 da3 dian4 hua4.', 'I want to call my mom.', 'Mình muốn gọi điện cho mẹ.']
        ]
      }
    ],
    warmup: {
      items: ['你常给谁打电话？', '打电话的时候，先说什么？', '说一说：喂，你好！'],
      itemsVi: [
        'Bạn hay gọi điện cho ai nhất?',
        'Khi nhấc máy, câu đầu tiên người Trung Quốc nói là gì?',
        'Tập nói: 喂，你好! (A lô, xin chào!)'
      ]
    },
    dialogue: [
      ['A', '喂，你好！小明在家吗？', 'Wei2, ni3 hao3! Xiao3 Ming2 zai4 jia1 ma5?', 'Hello! Is Xiaoming home?', 'A lô, xin chào! Tiểu Minh có nhà không ạ?'],
      ['B', '他在家，但是他正在睡觉。你是谁？', 'Ta1 zai4 jia1, dan4 shi4 ta1 zheng4 zai4 shui4 jiao4. Ni3 shi4 shei2?', "He's home, but he's sleeping. Who is this?", 'Cậu ấy có nhà, nhưng đang ngủ. Ai gọi đấy ạ?'],
      ['A', '我是李月，小明的朋友。', 'Wo3 shi4 Li3 Yue4, Xiao3 Ming2 de5 peng2 you5.', "I'm Li Yue, Xiaoming's friend.", 'Em là Lý Nguyệt, bạn của Tiểu Minh ạ.'],
      ['B', '你好！你有什么事情？', 'Ni3 hao3! Ni3 you3 shen2 me5 shi4 qing5?', 'Hi! What can I do for you?', 'Chào cháu! Cháu có việc gì không?'],
      ['A', '请告诉他，明天下午三点我们在学校见。', 'Qing3 gao4 su5 ta1, ming2 tian1 xia4 wu3 san1 dian3 wo3 men5 zai4 xue2 xiao4 jian4.', 'Please tell him we are meeting at school at three tomorrow afternoon.', 'Bác nhắn giúp cậu ấy: ba giờ chiều mai bọn cháu gặp nhau ở trường ạ.'],
      ['B', '好，我告诉他。', 'Hao3, wo3 gao4 su5 ta1.', "OK, I'll tell him.", 'Được, bác sẽ nhắn lại.'],
      ['A', '谢谢您！', 'Xie4 xie5 nin2!', 'Thank you!', 'Cháu cảm ơn bác ạ!'],
      ['B', '不客气。他知道了，晚上会给你打电话。', 'Bu2 ke4 qi5. Ta1 zhi1 dao4 le5, wan3 shang5 hui4 gei3 ni3 da3 dian4 hua4.', "You're welcome. Once he knows, he'll call you back tonight.", 'Không có gì. Biết tin xong, tối nay cậu ấy sẽ gọi lại cho cháu.']
    ],
    exercises: [
      ['fill_blank', 'remember', '___，你好！小明在家吗？', '___, ni3 hao3! Xiao3 Ming2 zai4 jia1 ma5?', ['喂', '请', '再见'], 0, ['a lô', 'xin mời', 'tạm biệt'], '打电话的时候先说“喂”。', 'Nhấc máy điện thoại nói 喂 (a lô) trước tiên.'],
      ['fill_blank', 'remember', '他___睡觉，请晚一点儿打。', 'Ta1 ___ shui4 jiao4, qing3 wan3 yi4 dian3r5 da3.', ['正在', '已经', '还是'], 0, ['đang', 'đã', 'hay là'], '“正在睡觉”表示现在睡觉。', '正在 + động từ = đang làm: 正在睡觉 = đang ngủ.'],
      ['multiple_choice', 'understand', '小明为什么不接电话？', 'Xiao3 Ming2 wei4 shen2 me5 bu4 jie1 dian4 hua4?', ['他正在睡觉', '他不在家', '他在学校'], 0, ['cậu ấy đang ngủ', 'cậu ấy không có nhà', 'cậu ấy ở trường'], '“他在家，但是他正在睡觉。”', 'Tiểu Minh có nhà nhưng đang ngủ (正在睡觉) nên không nghe máy.'],
      ['word_order', 'understand', ['他', '晚上', '给', '你', '打电话'], 'ta1 / wan3 shang5 / gei3 / ni3 / da3 dian4 hua4', ['anh ấy', 'buổi tối', 'cho', 'bạn', 'gọi điện'], '他晚上给你打电话。', 'Tối nay cậu ấy sẽ gọi điện cho bạn.', '“给+人”在“打电话”前面。', 'Trật tự: 给 + người + 打电话. Người nhận cuộc gọi đứng sau 给.'],
      ['listening_comprehension', 'understand', [4], '李月请家里人告诉小明什么？', 'Li3 Yue4 qing3 jia1 li3 ren2 gao4 su5 Xiao3 Ming2 shen2 me5?', ['明天下午三点在学校见', '明天上午在家见', '晚上一起吃饭'], 0, ['3h chiều mai gặp ở trường', 'sáng mai gặp ở nhà', 'tối nay ăn cơm cùng'], '“请告诉他，明天下午三点我们在学校见。”', 'Lời nhắn: mai 3 giờ chiều gặp nhau ở trường (在学校见).'],
      ['true_false', 'understand', '小明晚上会给李月打电话。', 'Xiao3 Ming2 wan3 shang5 hui4 gei3 Li3 Yue4 da3 dian4 hua4.', true, '“他知道了，晚上会给你打电话。”', 'Đúng. Người nhà nói: tối nay Tiểu Minh sẽ gọi lại cho Lý Nguyệt.'],
      ['reading_comprehension', 'understand', '打电话的人是谁？', 'Da3 dian4 hua4 de5 ren2 shi4 shei2?', ['李月', '小明', '小明的妈妈'], 0, ['Lý Nguyệt', 'Tiểu Minh', 'mẹ của Tiểu Minh'], '她说：“我是李月，小明的朋友。”', 'Người gọi tự giới thiệu: 我是李月，小明的朋友.']
    ]
  },
  {
    slug: 'hotel',
    titleZh: '住旅馆',
    titleEn: 'At a Hotel',
    titleVi: 'Ở khách sạn',
    summaryEn: 'A guest books a room for two nights at 240 kuai per night and takes a look at room 201.',
    summaryVi: 'Khách đặt phòng hai đêm, giá 240 tệ một đêm, và lên xem phòng 201.',
    vocab: [
      ['旅馆', 'lv3 guan3', 'noun', 'hotel, inn', 'khách sạn, nhà nghỉ'],
      ['房间', 'fang2 jian1', 'noun', 'room', 'phòng'],
      ['天', 'tian1', 'measure word', 'day (duration)', 'ngày (khoảng thời gian)'],
      ['住', 'zhu4', 'verb', 'to stay (overnight)', 'ở, lưu trú', false],
      ['给', 'gei3', 'verb', 'to give', 'đưa, cho', false]
    ],
    grammar: [
      {
        pattern: '动词 + 几天（时间量）',
        explanation: '住多长时间说“住几天”：我住两天。',
        explanation_vi: 'Khoảng thời gian đặt sau động từ: 住两天 = ở hai ngày; hỏi bằng 住几天?',
        examples: [
          ['你要住几天？', 'Ni3 yao4 zhu4 ji3 tian1?', 'How many nights will you stay?', 'Anh/chị định ở mấy ngày?'],
          ['我住两天。', 'Wo3 zhu4 liang3 tian1.', "I'll stay two nights.", 'Tôi ở hai ngày.'],
          ['他在北京玩儿了五天。', 'Ta1 zai4 Bei3 jing1 wan2r5 le5 wu3 tian1.', 'He spent five days in Beijing.', 'Cậu ấy đi chơi Bắc Kinh năm ngày.']
        ]
      },
      {
        pattern: '动词 + 动词（看看）/ 动词 + 一下',
        explanation: '“看看、看一下”让说话客气一点。',
        explanation_vi: 'Lặp động từ (看看) hoặc thêm 一下 để câu nhẹ nhàng, lịch sự: 我可以看看房间吗?',
        examples: [
          ['我可以看看房间吗？', 'Wo3 ke3 yi3 kan4 kan5 fang2 jian1 ma5?', 'May I take a look at the room?', 'Tôi xem phòng một chút được không?'],
          ['你听听这个。', 'Ni3 ting1 ting5 zhe4 ge5.', 'Have a listen to this.', 'Bạn nghe thử cái này xem.'],
          ['请等一下，我问问。', 'Qing3 deng3 yi2 xia4, wo3 wen4 wen5.', 'One moment — let me ask.', 'Đợi một lát, để tôi hỏi thử.']
        ]
      }
    ],
    warmup: {
      items: ['你住过旅馆吗？', '一个房间多少钱一天？', '说一说：房间 / 旅馆。'],
      itemsVi: [
        'Bạn từng ở khách sạn chưa? Kể ngắn gọn.',
        'Một phòng khách sạn giá khoảng bao nhiêu một đêm?',
        'Đọc từ mới: 房间 (phòng) / 旅馆 (khách sạn).'
      ]
    },
    dialogue: [
      ['A', '你好，你们有房间吗？', 'Ni3 hao3, ni3 men5 you3 fang2 jian1 ma5?', 'Hello, do you have any rooms?', 'Chào anh, khách sạn còn phòng không ạ?'],
      ['B', '有。你要住几天？', 'You3. Ni3 yao4 zhu4 ji3 tian1?', 'Yes. How many nights will you stay?', 'Còn ạ. Chị định ở mấy đêm?'],
      ['A', '住两天。房间多少钱一天？', 'Zhu4 liang3 tian1. Fang2 jian1 duo1 shao5 qian2 yi4 tian1?', 'Two nights. How much is a room per night?', 'Hai đêm. Phòng bao nhiêu tiền một đêm vậy anh?'],
      ['B', '二百四十块一天。', 'Er4 bai3 si4 shi2 kuai4 yi4 tian1.', 'Two hundred forty kuai per night.', 'Hai trăm bốn mươi tệ một đêm ạ.'],
      ['A', '好的。我可以看看房间吗？', 'Hao3 de5. Wo3 ke3 yi3 kan4 kan5 fang2 jian1 ma5?', 'OK. May I see the room first?', 'Được ạ. Tôi xem phòng trước được không?'],
      ['B', '可以，房间是二零一。', 'Ke3 yi3, fang2 jian1 shi4 er4 ling2 yao1.', 'Sure — room 201.', 'Được chứ, phòng 201 ạ.'],
      ['A', '房间很大，我很喜欢。', 'Fang2 jian1 hen3 da4, wo3 hen3 xi3 huan5.', 'The room is spacious. I like it.', 'Phòng rộng thật, tôi ưng lắm.'],
      ['B', '好，请给我您的名字和电话号码。', 'Hao3, qing3 gei3 wo3 nin2 de5 ming2 zi5 he2 dian4 hua4 hao4 ma3.', 'Great — your name and phone number, please.', 'Vâng, chị cho em xin tên và số điện thoại ạ.']
    ],
    exercises: [
      ['fill_blank', 'remember', '你要住几___？', 'Ni3 yao4 zhu4 ji3 ___?', ['天', '点', '岁'], 0, ['ngày', 'giờ', 'tuổi'], '问住多长时间说“住几天”。', 'Hỏi thời gian lưu trú: 住几天? = ở mấy ngày?'],
      ['fill_blank', 'remember', '我可以___房间吗？', 'Wo3 ke3 yi3 ___ fang2 jian1 ma5?', ['看看', '住住', '想想'], 0, ['xem thử', 'ở thử', 'nghĩ thử'], '“看看”比“看”客气一点。', 'Lặp động từ 看看 nghe nhẹ nhàng, lịch sự hơn 看.'],
      ['multiple_choice', 'understand', '房间多少钱一天？', 'Fang2 jian1 duo1 shao5 qian2 yi4 tian1?', ['二百四十块', '二百块', '一百四十块'], 0, ['240 tệ', '200 tệ', '140 tệ'], '“二百四十块一天。”', 'Nhân viên báo giá: 二百四十块一天 = 240 tệ/đêm.'],
      ['word_order', 'understand', ['我', '可以', '看看', '房间', '吗'], 'wo3 / ke3 yi3 / kan4 kan5 / fang2 jian1 / ma5', ['tôi', 'có thể', 'xem thử', 'phòng', 'không'], '我可以看看房间吗？', 'Tôi có thể xem phòng một chút không?', '“可以”在动词前面，“吗”在最后。', 'Trật tự: 我 + 可以 + 看看 + 房间 + 吗. Câu xin phép lịch sự.'],
      ['listening_comprehension', 'understand', [5], '房间是多少号？', 'Fang2 jian1 shi4 duo1 shao5 hao4?', ['二零一', '二一零', '一零二'], 0, ['201', '210', '102'], '“可以，房间是二零一。”', 'Câu nghe được: 房间是二零一 → phòng số 201.'],
      ['true_false', 'understand', '她要住一个星期。', 'Ta1 yao4 zhu4 yi2 ge4 xing1 qi1.', false, '她说：“住两天。”', 'Sai. Khách chỉ ở hai đêm (住两天), không phải một tuần.'],
      ['reading_comprehension', 'understand', '她觉得房间怎么样？', 'Ta1 jue2 de5 fang2 jian1 zen3 me5 yang4?', ['很大，很喜欢', '太小了', '太贵了，不住'], 0, ['rộng, rất ưng', 'nhỏ quá', 'đắt quá nên không ở'], '“房间很大，我很喜欢。”', 'Sau khi xem phòng, khách khen: 房间很大，我很喜欢.']
    ]
  },
  {
    slug: 'health',
    titleZh: '身体不舒服',
    titleEn: 'Not Feeling Well',
    titleVi: 'Trong người khó chịu',
    summaryEn: 'A tired friend with sore eyes slept too little; the other tells her to sleep earlier and rest.',
    summaryVi: 'Một người mệt mỏi, mắt khó chịu vì ngủ quá ít; người bạn khuyên ngủ sớm và nghỉ ngơi.',
    vocab: [
      ['累', 'lei4', 'adjective', 'tired', 'mệt'],
      ['眼睛', 'yan3 jing5', 'noun', 'eye(s)', 'mắt'],
      ['起床', 'qi3 chuang2', 'verb phrase', 'to get up', 'thức dậy, dậy'],
      ['就', 'jiu4', 'adverb', 'as early as, right away', 'đã, ngay (nhấn mạnh sớm)'],
      ['早', 'zao3', 'adjective', 'early', 'sớm']
    ],
    grammar: [
      {
        pattern: '你怎么了？',
        explanation: '看到别人不好，问“你怎么了？”',
        explanation_vi: 'Thấy ai đó có vẻ không ổn, hỏi thăm bằng 你怎么了? = Bạn sao thế?',
        examples: [
          ['你怎么了？', 'Ni3 zen3 me5 le5?', "What's wrong?", 'Bạn sao thế?'],
          ['我很累，眼睛也不舒服。', 'Wo3 hen3 lei4, yan3 jing5 ye3 bu4 shu1 fu5.', "I'm tired and my eyes hurt.", 'Mình mệt lắm, mắt cũng khó chịu.'],
          ['你哪儿不舒服？', 'Ni3 na3r5 bu4 shu1 fu5?', 'Where does it hurt?', 'Bạn thấy khó chịu ở đâu?']
        ]
      },
      {
        pattern: '时间 + 就 + 动词',
        explanation: '“就”表示时间很早：六点就起床了。',
        explanation_vi: '就 sau mốc thời gian nhấn mạnh "sớm thế rồi đã…": 六点就起床了 = mới 6 giờ đã dậy rồi.',
        examples: [
          ['他六点就起床了。', 'Ta1 liu4 dian3 jiu4 qi3 chuang2 le5.', 'He got up as early as six.', 'Mới sáu giờ cậu ấy đã dậy rồi.'],
          ['我今天五点就来了。', 'Wo3 jin1 tian1 wu3 dian3 jiu4 lai2 le5.', 'I arrived as early as five today.', 'Hôm nay mới năm giờ mình đã đến rồi.'],
          ['她昨天九点就睡觉了。', 'Ta1 zuo2 tian1 jiu3 dian3 jiu4 shui4 jiao4 le5.', 'She went to bed as early as nine yesterday.', 'Hôm qua mới chín giờ cô ấy đã đi ngủ.']
        ]
      }
    ],
    warmup: {
      items: ['你今天累不累？', '你几点起床？几点睡觉？', '累的时候你做什么？'],
      itemsVi: [
        'Hôm nay bạn có mệt không? (累不累?)',
        'Bạn dậy lúc mấy giờ, ngủ lúc mấy giờ?',
        'Khi mệt bạn thường làm gì để dễ chịu hơn?'
      ]
    },
    dialogue: [
      ['A', '李月，你怎么了？', 'Li3 Yue4, ni3 zen3 me5 le5?', "Li Yue, what's wrong?", 'Lý Nguyệt, bạn sao thế?'],
      ['B', '我很累，眼睛也不舒服。', 'Wo3 hen3 lei4, yan3 jing5 ye3 bu4 shu1 fu5.', "I'm so tired, and my eyes feel bad too.", 'Mình mệt quá, mắt cũng khó chịu nữa.'],
      ['A', '你昨天几点睡觉？', 'Ni3 zuo2 tian1 ji3 dian3 shui4 jiao4?', 'What time did you go to bed last night?', 'Hôm qua bạn ngủ lúc mấy giờ?'],
      ['B', '晚上十二点睡觉，今天六点就起床了。', 'Wan3 shang5 shi2 er4 dian3 shui4 jiao4, jin1 tian1 liu4 dian3 jiu4 qi3 chuang2 le5.', 'I went to bed at midnight and got up at six this morning.', 'Mười hai giờ đêm mới ngủ, mà sáu giờ sáng nay đã phải dậy rồi.'],
      ['A', '睡觉太晚了！今天晚上你要早一点儿睡觉。', 'Shui4 jiao4 tai4 wan3 le5! Jin1 tian1 wan3 shang5 ni3 yao4 zao3 yi4 dian3r5 shui4 jiao4.', 'That is way too late! Tonight you should sleep earlier.', 'Ngủ muộn quá rồi! Tối nay bạn phải ngủ sớm hơn một chút đi.'],
      ['B', '好。我现在想休息一下。', 'Hao3. Wo3 xian4 zai4 xiang3 xiu1 xi5 yi2 xia4.', "OK. I'd like to rest a bit now.", 'Ừ. Giờ mình muốn nghỉ một lát.'],
      ['A', '你多喝水，好好休息。', 'Ni3 duo1 he1 shui3, hao3 hao3 xiu1 xi5.', 'Drink plenty of water and rest well.', 'Bạn uống nhiều nước vào, nghỉ ngơi cho khỏe nhé.'],
      ['B', '谢谢你！', 'Xie4 xie5 ni3!', 'Thank you!', 'Cảm ơn bạn nhé!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你___了？你看起来很累。', 'Ni3 ___ le5? Ni3 kan4 qi3 lai2 hen3 lei4.', ['怎么', '什么', '哪儿'], 0, ['sao (thế)', 'gì', 'ở đâu'], '问别人的情况：“你怎么了？”', 'Hỏi thăm khi thấy ai không ổn: 你怎么了? (Bạn sao thế?).'],
      ['fill_blank', 'remember', '今天六点___起床了。', 'Jin1 tian1 liu4 dian3 ___ qi3 chuang2 le5.', ['就', '再', '还'], 0, ['đã (sớm thế)', 'thêm nữa', 'vẫn còn'], '“就”表示很早：六点就起床了。', '就 nhấn mạnh sớm: 六点就起床了 = mới 6 giờ đã dậy.'],
      ['multiple_choice', 'understand', '李月为什么很累？', 'Li3 Yue4 wei4 shen2 me5 hen3 lei4?', ['睡觉太晚，起床太早', '工作太多', '生病了'], 0, ['ngủ muộn, dậy sớm', 'việc quá nhiều', 'bị ốm'], '她十二点睡觉，六点就起床，睡得太少。', 'Ngủ lúc 12h đêm, 6h sáng đã dậy → ngủ quá ít nên mệt.'],
      ['word_order', 'understand', ['你', '要', '早', '一点儿', '睡觉'], 'ni3 / yao4 / zao3 / yi4 dian3r5 / shui4 jiao4', ['bạn', 'cần/phải', 'sớm', 'một chút', 'ngủ'], '你要早一点儿睡觉。', 'Bạn phải ngủ sớm hơn một chút.', '“早一点儿”在“睡觉”前面。', 'Trật tự: 要 + 早一点儿 + 睡觉. Cụm "sớm hơn chút" đứng trước động từ.'],
      ['listening_comprehension', 'understand', [3], '李月昨天几点睡觉？', 'Li3 Yue4 zuo2 tian1 ji3 dian3 shui4 jiao4?', ['晚上十二点', '晚上十点', '晚上六点'], 0, ['12 giờ đêm', '10 giờ tối', '6 giờ tối'], '“晚上十二点睡觉，今天六点就起床了。”', 'Câu nghe được: ngủ lúc 12 giờ đêm, 6 giờ sáng đã dậy.'],
      ['true_false', 'understand', '朋友请李月晚上晚一点儿睡觉。', 'Peng2 you5 qing3 Li3 Yue4 wan3 shang5 wan3 yi4 dian3r5 shui4 jiao4.', false, '朋友说“你要早一点儿睡觉”。', 'Sai. Người bạn khuyên ngủ SỚM hơn (早一点儿睡觉), không phải muộn hơn.'],
      ['reading_comprehension', 'understand', '朋友请李月做什么？', 'Peng2 you5 qing3 Li3 Yue4 zuo4 shen2 me5?', ['多喝水，好好休息', '多工作', '晚上十二点睡觉'], 0, ['uống nhiều nước, nghỉ ngơi', 'làm việc nhiều hơn', 'ngủ lúc 12h đêm'], '“你多喝水，好好休息。”', 'Lời khuyên cuối bài: uống nhiều nước và nghỉ ngơi cho khỏe.']
    ]
  },
  {
    slug: 'sports',
    titleZh: '运动',
    titleEn: 'Sports',
    titleVi: 'Thể thao',
    summaryEn: 'Two friends compare sports they love — running, basketball, swimming — and plan a morning run.',
    summaryVi: 'Hai người bạn kể môn thể thao yêu thích — chạy bộ, bóng rổ, bơi — và hẹn sáng mai chạy cùng nhau.',
    vocab: [
      ['运动', 'yun4 dong4', 'noun/verb', 'sports; to exercise', 'thể thao, vận động'],
      ['跑步', 'pao3 bu4', 'verb phrase', 'to run, to jog', 'chạy bộ'],
      ['篮球', 'lan2 qiu2', 'noun', 'basketball', 'bóng rổ'],
      ['游泳', 'you2 yong3', 'verb phrase', 'to swim', 'bơi, bơi lội'],
      ['每', 'mei3', 'pronoun', 'every, each', 'mỗi, hằng'],
      ['吧', 'ba5', 'particle', 'suggestion particle', 'trợ từ đề nghị (…nhé, …đi)']
    ],
    grammar: [
      {
        pattern: '每 + 时间 + 都 + 动词',
        explanation: '“每天、每个星期”常和“都”一起用：我每天都运动。',
        explanation_vi: '每 (mỗi) thường đi với 都: 我每天都运动 = Ngày nào tôi cũng vận động.',
        examples: [
          ['我每天早上都跑步。', 'Wo3 mei3 tian1 zao3 shang5 dou1 pao3 bu4.', 'I run every morning.', 'Sáng nào mình cũng chạy bộ.'],
          ['他每个星期六都打篮球。', 'Ta1 mei3 ge4 xing1 qi1 liu4 dou1 da3 lan2 qiu2.', 'He plays basketball every Saturday.', 'Thứ Bảy nào cậu ấy cũng chơi bóng rổ.'],
          ['我们每天都说汉语。', 'Wo3 men5 mei3 tian1 dou1 shuo1 Han4 yu3.', 'We speak Chinese every day.', 'Ngày nào chúng mình cũng nói tiếng Trung.']
        ]
      },
      {
        pattern: '动词 + 得 + 形容词',
        explanation: '“得”说动作做得怎么样：他跑得很快。',
        explanation_vi: 'Bổ ngữ mức độ với 得: 跑得快 = chạy nhanh, 跑得不快 = chạy không nhanh.',
        examples: [
          ['你跑得快吗？', 'Ni3 pao3 de5 kuai4 ma5?', 'Do you run fast?', 'Bạn chạy có nhanh không?'],
          ['我跑得不快。', 'Wo3 pao3 de5 bu2 kuai4.', "I don't run fast.", 'Mình chạy không nhanh lắm.'],
          ['她游泳游得很好。', 'Ta1 you2 yong3 you2 de5 hen3 hao3.', 'She swims very well.', 'Cô ấy bơi rất giỏi.']
        ]
      }
    ],
    warmup: {
      items: ['你喜欢什么运动？', '说一说：跑步 / 篮球 / 游泳。', '你每天都运动吗？'],
      itemsVi: [
        'Bạn thích môn thể thao nào nhất?',
        'Đọc từ mới: 跑步 (chạy bộ) / 篮球 (bóng rổ) / 游泳 (bơi).',
        'Bạn có vận động mỗi ngày không?'
      ]
    },
    dialogue: [
      ['A', '小明，你喜欢什么运动？', 'Xiao3 Ming2, ni3 xi3 huan5 shen2 me5 yun4 dong4?', 'Xiaoming, what sports do you like?', 'Tiểu Minh, bạn thích môn thể thao nào?'],
      ['B', '我喜欢跑步和打篮球。你呢？', 'Wo3 xi3 huan5 pao3 bu4 he2 da3 lan2 qiu2. Ni3 ne5?', 'I like running and basketball. You?', 'Mình thích chạy bộ và chơi bóng rổ. Còn bạn?'],
      ['A', '我喜欢游泳。你每天都运动吗？', 'Wo3 xi3 huan5 you2 yong3. Ni3 mei3 tian1 dou1 yun4 dong4 ma5?', 'I like swimming. Do you exercise every day?', 'Mình thích bơi. Ngày nào bạn cũng tập à?'],
      ['B', '我每天早上跑步，星期六打篮球。', 'Wo3 mei3 tian1 zao3 shang5 pao3 bu4, xing1 qi1 liu4 da3 lan2 qiu2.', 'I run every morning and play basketball on Saturdays.', 'Sáng nào mình cũng chạy bộ, thứ Bảy thì chơi bóng rổ.'],
      ['A', '你跑得快吗？', 'Ni3 pao3 de5 kuai4 ma5?', 'Are you a fast runner?', 'Bạn chạy có nhanh không?'],
      ['B', '我跑得不快，但是我很喜欢跑。', 'Wo3 pao3 de5 bu2 kuai4, dan4 shi4 wo3 hen3 xi3 huan5 pao3.', "I'm not fast, but I love running.", 'Mình chạy không nhanh, nhưng mình rất thích chạy.'],
      ['A', '明天早上我们一起去跑步吧！', 'Ming2 tian1 zao3 shang5 wo3 men5 yi4 qi3 qu4 pao3 bu4 ba5!', "Let's go running together tomorrow morning!", 'Sáng mai chúng mình cùng chạy bộ nhé!'],
      ['B', '好！六点半见。', 'Hao3! Liu4 dian3 ban4 jian4.', 'OK! See you at six thirty.', 'Ừ! Sáu giờ rưỡi gặp nhé.']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___天早上都跑步。', 'Wo3 ___ tian1 zao3 shang5 dou1 pao3 bu4.', ['每', '几', '什么'], 0, ['mỗi', 'mấy', 'gì'], '“每天”和“都”一起用。', '每天 + 都: sáng nào cũng chạy bộ.'],
      ['fill_blank', 'remember', '我跑___不快。', 'Wo3 pao3 ___ bu2 kuai4.', ['得', '的', '了'], 0, ['得 (bổ ngữ)', '的 (sở hữu)', '了 (hoàn thành)'], '动作做得怎么样，用“得”：跑得快、跑得不快。', 'Nhận xét cách làm dùng 得: 跑得快/跑得不快.'],
      ['multiple_choice', 'understand', '小明星期六做什么运动？', 'Xiao3 Ming2 xing1 qi1 liu4 zuo4 shen2 me5 yun4 dong4?', ['打篮球', '跑步', '游泳'], 0, ['chơi bóng rổ', 'chạy bộ', 'bơi'], '他说“星期六打篮球”。', 'Tiểu Minh nói thứ Bảy chơi bóng rổ; chạy bộ là mỗi sáng.'],
      ['word_order', 'understand', ['我们', '一起', '去', '跑步', '吧'], 'wo3 men5 / yi4 qi3 / qu4 / pao3 bu4 / ba5', ['chúng ta', 'cùng nhau', 'đi', 'chạy bộ', 'nhé'], '我们一起去跑步吧！', 'Chúng mình cùng đi chạy bộ nhé!', '“吧”在句子最后，表示建议。', 'Trợ từ đề nghị 吧 đặt cuối câu: …去跑步吧 = đi chạy bộ nhé.'],
      ['listening_comprehension', 'understand', [5], '小明跑得快吗？', 'Xiao3 Ming2 pao3 de5 kuai4 ma5?', ['不快，但是很喜欢跑', '很快', '不喜欢跑'], 0, ['không nhanh nhưng rất thích', 'rất nhanh', 'không thích chạy'], '“我跑得不快，但是我很喜欢跑。”', 'Câu nghe được: chạy không nhanh nhưng rất thích chạy.'],
      ['true_false', 'understand', '他们明天下午一起去游泳。', 'Ta1 men5 ming2 tian1 xia4 wu3 yi4 qi3 qu4 you2 yong3.', false, '他们明天早上六点半一起去跑步。', 'Sai. Hẹn sáng mai 6 rưỡi đi chạy bộ, không phải chiều đi bơi.'],
      ['reading_comprehension', 'understand', '谁喜欢游泳？', 'Shei2 xi3 huan5 you2 yong3?', ['问问题的人', '小明', '两个人都喜欢'], 0, ['người đặt câu hỏi', 'Tiểu Minh', 'cả hai người'], 'A说：“我喜欢游泳。”', 'Người hỏi (A) nói 我喜欢游泳; Tiểu Minh thích chạy bộ và bóng rổ.']
    ]
  },
  {
    slug: 'birthday',
    titleZh: '生日',
    titleEn: 'Birthday',
    titleVi: 'Sinh nhật',
    summaryEn: 'Xiaoming\'s 21st birthday is next Saturday; friends plan dinner, singing and a birthday treat.',
    summaryVi: 'Thứ Bảy tuần sau là sinh nhật 21 tuổi của Tiểu Minh; các bạn lên kế hoạch ăn tối, hát hò và chiêu đãi.',
    vocab: [
      ['快乐', 'kuai4 le4', 'adjective', 'happy', 'vui vẻ, hạnh phúc'],
      ['过', 'guo4', 'verb', 'to celebrate, to spend (time)', 'đón, tổ chức (sinh nhật, lễ)'],
      ['唱歌', 'chang4 ge1', 'verb phrase', 'to sing', 'hát'],
      ['跳舞', 'tiao4 wu3', 'verb phrase', 'to dance', 'nhảy múa'],
      ['下个', 'xia4 ge5', 'phrase', 'next (week/month)', 'sau, tới (tuần sau, tháng sau)']
    ],
    grammar: [
      {
        pattern: '下个 + 星期/月',
        explanation: '“下个星期六”表示还没到的那个星期六。',
        explanation_vi: '下个 = sắp tới: 下个星期六 = thứ Bảy tuần sau; 下个月 = tháng sau.',
        examples: [
          ['下个星期六是我的生日。', 'Xia4 ge5 xing1 qi1 liu4 shi4 wo3 de5 sheng1 ri4.', 'Next Saturday is my birthday.', 'Thứ Bảy tuần sau là sinh nhật mình.'],
          ['下个月我去北京。', 'Xia4 ge5 yue4 wo3 qu4 Bei3 jing1.', "I'm going to Beijing next month.", 'Tháng sau mình đi Bắc Kinh.'],
          ['下个星期你有时间吗？', 'Xia4 ge5 xing1 qi1 ni3 you3 shi2 jian1 ma5?', 'Are you free next week?', 'Tuần sau bạn có rảnh không?']
        ]
      },
      {
        pattern: '请 + 人 + 动词（请客）',
        explanation: '“我请你吃饭”＝我给钱，请你来吃。',
        explanation_vi: '请 + người + động từ = mời ai làm gì (mình chi trả): 我请你吃饭 = Mình mời bạn đi ăn.',
        examples: [
          ['我请你吃饭。', 'Wo3 qing3 ni3 chi1 fan4.', "I'll treat you to a meal.", 'Mình mời bạn đi ăn.'],
          ['他请我们喝茶。', 'Ta1 qing3 wo3 men5 he1 cha2.', 'He treated us to tea.', 'Cậu ấy mời chúng mình uống trà.'],
          ['妈妈请朋友来家里吃饭。', 'Ma1 ma5 qing3 peng2 you5 lai2 jia1 li3 chi1 fan4.', 'Mom invited friends over for dinner.', 'Mẹ mời bạn bè đến nhà ăn cơm.']
        ]
      }
    ],
    warmup: {
      items: ['你的生日是几月几号？', '过生日的时候你做什么？', '说一说：唱歌 / 跳舞。'],
      itemsVi: [
        'Sinh nhật bạn là ngày mấy tháng mấy?',
        'Ngày sinh nhật bạn thường làm gì?',
        'Đọc từ mới: 唱歌 (hát) / 跳舞 (nhảy múa).'
      ]
    },
    dialogue: [
      ['A', '李月，下个星期六是我的生日。', 'Li3 Yue4, xia4 ge5 xing1 qi1 liu4 shi4 wo3 de5 sheng1 ri4.', 'Li Yue, next Saturday is my birthday.', 'Lý Nguyệt ơi, thứ Bảy tuần sau là sinh nhật mình đấy.'],
      ['B', '生日快乐！你今年多大？', 'Sheng1 ri4 kuai4 le4! Ni3 jin1 nian2 duo1 da4?', 'Happy birthday! How old are you turning?', 'Chúc mừng sinh nhật! Năm nay bạn bao nhiêu tuổi rồi?'],
      ['A', '谢谢！我今年二十一岁。', 'Xie4 xie5! Wo3 jin1 nian2 er4 shi2 yi1 sui4.', "Thanks! I'm turning twenty-one.", 'Cảm ơn! Năm nay mình hai mươi mốt tuổi.'],
      ['B', '你想怎么过生日？', 'Ni3 xiang3 zen3 me5 guo4 sheng1 ri4?', 'How do you want to celebrate?', 'Bạn định đón sinh nhật thế nào?'],
      ['A', '我想和朋友们一起吃饭、唱歌。', 'Wo3 xiang3 he2 peng2 you5 men5 yi4 qi3 chi1 fan4, chang4 ge1.', 'I want to have dinner and sing with my friends.', 'Mình muốn cùng bạn bè ăn cơm rồi đi hát.'],
      ['B', '你会唱歌吗？', 'Ni3 hui4 chang4 ge1 ma5?', 'Can you sing?', 'Bạn biết hát không đấy?'],
      ['A', '我唱得不好，但是我很喜欢唱！', 'Wo3 chang4 de5 bu4 hao3, dan4 shi4 wo3 hen3 xi3 huan5 chang4!', "I'm not a good singer, but I love singing!", 'Mình hát không hay, nhưng mà mình mê hát lắm!'],
      ['B', '哈哈，那天我请你吃饭，好吗？', 'Ha1 ha1, na4 tian1 wo3 qing3 ni3 chi1 fan4, hao3 ma5?', "Haha! Let me treat you to dinner that day, OK?", 'Haha, hôm đó để mình mời bạn đi ăn nhé?'],
      ['A', '太好了！谢谢你！', 'Tai4 hao3 le5! Xie4 xie5 ni3!', 'Awesome! Thank you!', 'Tuyệt quá! Cảm ơn bạn!']
    ],
    exercises: [
      ['fill_blank', 'remember', '___星期六是我的生日。', '___ xing1 qi1 liu4 shi4 wo3 de5 sheng1 ri4.', ['下个', '这个月', '昨天'], 0, ['tuần sau (下个)', 'tháng này', 'hôm qua'], '还没到的星期六说“下个星期六”。', 'Thứ Bảy sắp tới = 下个星期六 (thứ Bảy tuần sau).'],
      ['fill_blank', 'remember', '我___你吃饭，好吗？', 'Wo3 ___ ni3 chi1 fan4, hao3 ma5?', ['请', '给', '要'], 0, ['mời', 'đưa/cho', 'muốn'], '“我请你吃饭”表示我请客。', '请 + người + ăn cơm = mời ai đi ăn (mình trả tiền).'],
      ['multiple_choice', 'understand', '小明今年多大？', 'Xiao3 Ming2 jin1 nian2 duo1 da4?', ['二十一岁', '二十岁', '十二岁'], 0, ['21 tuổi', '20 tuổi', '12 tuổi'], '他说：“我今年二十一岁。”', 'Tiểu Minh nói: 我今年二十一岁 → 21 tuổi.'],
      ['word_order', 'understand', ['我', '想', '和', '朋友们', '一起', '唱歌'], 'wo3 / xiang3 / he2 / peng2 you5 men5 / yi4 qi3 / chang4 ge1', ['tôi', 'muốn', 'với', 'các bạn', 'cùng nhau', 'hát'], '我想和朋友们一起唱歌。', 'Tôi muốn cùng các bạn hát hò.', '“和……一起”在动词前面。', 'Cấu trúc: 和 + người + 一起 + động từ. Cả cụm đứng trước 唱歌.'],
      ['listening_comprehension', 'understand', [6], '小明唱歌唱得怎么样？', 'Xiao3 Ming2 chang4 ge1 chang4 de5 zen3 me5 yang4?', ['唱得不好，但是很喜欢', '唱得很好', '不喜欢唱歌'], 0, ['hát không hay nhưng rất thích', 'hát rất hay', 'không thích hát'], '“我唱得不好，但是我很喜欢唱！”', 'Câu nghe được: hát không hay (唱得不好) nhưng rất thích hát.'],
      ['true_false', 'understand', '生日那天，李月请小明吃饭。', 'Sheng1 ri4 na4 tian1, Li3 Yue4 qing3 Xiao3 Ming2 chi1 fan4.', true, '李月说：“那天我请你吃饭，好吗？”', 'Đúng. Lý Nguyệt đề nghị: hôm đó mình mời bạn đi ăn (我请你吃饭).'],
      ['reading_comprehension', 'understand', '小明想怎么过生日？', 'Xiao3 Ming2 xiang3 zen3 me5 guo4 sheng1 ri4?', ['和朋友们吃饭、唱歌', '在家睡觉', '去北京旅游'], 0, ['ăn cơm, hát cùng bạn bè', 'ở nhà ngủ', 'đi du lịch Bắc Kinh'], '“我想和朋友们一起吃饭、唱歌。”', 'Kế hoạch sinh nhật: cùng bạn bè ăn cơm rồi đi hát.']
    ]
  },
  {
    slug: 'workday',
    titleZh: '工作日',
    titleEn: 'Workdays',
    titleVi: 'Ngày làm việc',
    summaryEn: 'An office worker describes her nine-to-six day at the company and her weekend rest.',
    summaryVi: 'Một nhân viên văn phòng kể về ngày làm việc từ 9h đến 18h ở công ty và ngày nghỉ cuối tuần.',
    vocab: [
      ['工作', 'gong1 zuo4', 'noun/verb', 'work; to work', 'công việc; làm việc'],
      ['公司', 'gong1 si1', 'noun', 'company', 'công ty'],
      ['开始', 'kai1 shi3', 'verb', 'to start, to begin', 'bắt đầu'],
      ['从', 'cong2', 'preposition', 'from', 'từ'],
      ['到', 'dao4', 'preposition/verb', 'to, until; to arrive', 'đến, tới'],
      ['小时', 'xiao3 shi2', 'noun', 'hour', 'tiếng, giờ đồng hồ'],
      ['长', 'chang2', 'adjective', 'long', 'dài'],
      ['已经', 'yi3 jing1', 'adverb', 'already', 'đã, rồi']
    ],
    grammar: [
      {
        pattern: '从……到……',
        explanation: '说开始和结束：从早上九点到下午六点。',
        explanation_vi: '从 A 到 B = từ A đến B (thời gian hoặc nơi chốn): 从九点到六点 = từ 9h đến 18h.',
        examples: [
          ['我从早上九点到下午六点工作。', 'Wo3 cong2 zao3 shang5 jiu3 dian3 dao4 xia4 wu3 liu4 dian3 gong1 zuo4.', 'I work from 9 a.m. to 6 p.m.', 'Mình làm việc từ 9 giờ sáng đến 6 giờ chiều.'],
          ['从星期一到星期五我都上课。', 'Cong2 xing1 qi1 yi1 dao4 xing1 qi1 wu3 wo3 dou1 shang4 ke4.', 'I have class from Monday to Friday.', 'Từ thứ Hai đến thứ Sáu mình đều có tiết.'],
          ['从我家到公司要三十分钟。', 'Cong2 wo3 jia1 dao4 gong1 si1 yao4 san1 shi2 fen1 zhong1.', 'It takes thirty minutes from my home to the company.', 'Từ nhà mình đến công ty mất 30 phút.']
        ]
      },
      {
        pattern: '已经……了',
        explanation: '“已经……了”表示事情完成或时间很长：我已经很累了。',
        explanation_vi: '已经…了 = đã… rồi: 我已经很累了 = Mình mệt lắm rồi.',
        examples: [
          ['我已经很累了。', 'Wo3 yi3 jing1 hen3 lei4 le5.', 'I am already very tired.', 'Mình mệt lắm rồi.'],
          ['他已经工作八个小时了。', 'Ta1 yi3 jing1 gong1 zuo4 ba1 ge4 xiao3 shi2 le5.', 'He has already worked eight hours.', 'Anh ấy đã làm việc tám tiếng rồi.'],
          ['已经十二点了，快睡觉吧。', 'Yi3 jing1 shi2 er4 dian3 le5, kuai4 shui4 jiao4 ba5.', "It's already midnight — go to sleep.", 'Đã 12 giờ đêm rồi, mau đi ngủ đi.']
        ]
      }
    ],
    warmup: {
      items: ['你几点开始工作/上课？', '你每天工作/学习几个小时？', '星期六你休息吗？'],
      itemsVi: [
        'Bạn bắt đầu làm việc/học lúc mấy giờ?',
        'Mỗi ngày bạn làm việc/học mấy tiếng?',
        'Thứ Bảy bạn có được nghỉ không?'
      ]
    },
    dialogue: [
      ['A', '王方，你在哪儿工作？', 'Wang2 Fang1, ni3 zai4 na3r5 gong1 zuo4?', 'Wang Fang, where do you work?', 'Vương Phương, bạn làm việc ở đâu?'],
      ['B', '我在公司工作。', 'Wo3 zai4 gong1 si1 gong1 zuo4.', 'I work at a company.', 'Mình làm ở công ty.'],
      ['A', '你每天几点开始工作？', 'Ni3 mei3 tian1 ji3 dian3 kai1 shi3 gong1 zuo4?', 'What time do you start every day?', 'Hằng ngày mấy giờ bạn bắt đầu làm?'],
      ['B', '从早上九点到下午六点。', 'Cong2 zao3 shang5 jiu3 dian3 dao4 xia4 wu3 liu4 dian3.', 'From nine in the morning to six in the evening.', 'Từ 9 giờ sáng đến 6 giờ chiều.'],
      ['A', '工作时间很长！', 'Gong1 zuo4 shi2 jian1 hen3 chang2!', 'Those are long hours!', 'Thời gian làm việc dài thật đấy!'],
      ['B', '是，我每天工作八个小时，晚上已经很累了。', 'Shi4, wo3 mei3 tian1 gong1 zuo4 ba1 ge4 xiao3 shi2, wan3 shang5 yi3 jing1 hen3 lei4 le5.', 'Yes — eight hours a day. By evening I am exhausted.', 'Ừ, mỗi ngày mình làm tám tiếng, đến tối là mệt lử rồi.'],
      ['A', '你星期六也工作吗？', 'Ni3 xing1 qi1 liu4 ye3 gong1 zuo4 ma5?', 'Do you work on Saturdays too?', 'Thứ Bảy bạn cũng phải làm à?'],
      ['B', '不工作。星期六和星期天我在家休息。', 'Bu4 gong1 zuo4. Xing1 qi1 liu4 he2 xing1 qi1 tian1 wo3 zai4 jia1 xiu1 xi5.', 'No. I rest at home on Saturday and Sunday.', 'Không. Thứ Bảy và Chủ nhật mình nghỉ ở nhà.']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___早上九点___下午六点工作。', 'Wo3 ___ zao3 shang5 jiu3 dian3 ___ xia4 wu3 liu4 dian3 gong1 zuo4.', ['从……到', '在……里', '因为……所以'], 0, ['从…到 (từ…đến)', '在…里 (ở trong)', '因为…所以 (vì…nên)'], '说开始和结束的时间用“从……到……”。', 'Khoảng thời gian dùng 从…到…: từ 9 giờ đến 6 giờ.'],
      ['fill_blank', 'remember', '晚上我___很累了。', 'Wan3 shang5 wo3 ___ hen3 lei4 le5.', ['已经', '正在', '还是'], 0, ['đã (rồi)', 'đang', 'hay là'], '“已经……了”表示到现在很累了。', '已经…了 = đã… rồi: tối là đã mệt lắm rồi.'],
      ['multiple_choice', 'understand', '王方每天工作几个小时？', 'Wang2 Fang1 mei3 tian1 gong1 zuo4 ji3 ge4 xiao3 shi2?', ['八个小时', '九个小时', '六个小时'], 0, ['8 tiếng', '9 tiếng', '6 tiếng'], '她说“我每天工作八个小时”。', 'Bạn ấy nói mỗi ngày làm 八个小时 (8 tiếng).'],
      ['word_order', 'understand', ['你', '每天', '几点', '开始', '工作'], 'ni3 / mei3 tian1 / ji3 dian3 / kai1 shi3 / gong1 zuo4', ['bạn', 'mỗi ngày', 'mấy giờ', 'bắt đầu', 'làm việc'], '你每天几点开始工作？', 'Hằng ngày bạn bắt đầu làm việc lúc mấy giờ?', '时间词的顺序：每天 → 几点 → 动词。', 'Trật tự: 每天 (tần suất) trước 几点 (giờ), rồi mới đến động từ.'],
      ['listening_comprehension', 'understand', [7], '星期六和星期天王方做什么？', 'Xing1 qi1 liu4 he2 xing1 qi1 tian1 Wang2 Fang1 zuo4 shen2 me5?', ['在家休息', '去公司工作', '去朋友家'], 0, ['nghỉ ở nhà', 'đến công ty làm', 'đến nhà bạn'], '“星期六和星期天我在家休息。”', 'Câu nghe được: cuối tuần bạn ấy nghỉ ngơi ở nhà.'],
      ['true_false', 'understand', '王方星期六也去公司工作。', 'Wang2 Fang1 xing1 qi1 liu4 ye3 qu4 gong1 si1 gong1 zuo4.', false, '她说星期六“不工作”，在家休息。', 'Sai. Thứ Bảy bạn ấy không làm việc mà nghỉ ở nhà.'],
      ['reading_comprehension', 'understand', '王方在哪儿工作？', 'Wang2 Fang1 zai4 na3r5 gong1 zuo4?', ['公司', '学校', '医院'], 0, ['công ty', 'trường học', 'bệnh viện'], '她说：“我在公司工作。”', 'Ngay đầu bài: 我在公司工作 → làm ở công ty.']
    ]
  },
  {
    slug: 'weekend',
    titleZh: '周末',
    titleEn: 'Weekends',
    titleVi: 'Cuối tuần',
    summaryEn: 'Weekend plans: laundry on Saturday morning, an interesting Chinese movie in the afternoon, running on Sunday.',
    summaryVi: 'Kế hoạch cuối tuần: sáng thứ Bảy giặt đồ, chiều xem một bộ phim Trung Quốc hay, Chủ nhật chạy bộ.',
    vocab: [
      ['周末', 'zhou1 mo4', 'noun', 'weekend', 'cuối tuần'],
      ['洗', 'xi3', 'verb', 'to wash', 'giặt, rửa'],
      ['电影', 'dian4 ying3', 'noun', 'movie', 'phim, phim điện ảnh'],
      ['有意思', 'you3 yi4 si5', 'phrase', 'interesting, fun', 'thú vị, hay'],
      ['票', 'piao4', 'noun', 'ticket', 'vé']
    ],
    grammar: [
      {
        pattern: '要 + 动词（计划）',
        explanation: '“要”说计划好的事情：星期六上午我要洗衣服。',
        explanation_vi: '要 + động từ chỉ việc dự định phải làm: 我要洗衣服 = Mình phải/định giặt quần áo.',
        examples: [
          ['星期六上午我要洗衣服。', 'Xing1 qi1 liu4 shang4 wu3 wo3 yao4 xi3 yi1 fu5.', "I'm doing laundry on Saturday morning.", 'Sáng thứ Bảy mình phải giặt quần áo.'],
          ['我要去买票。', 'Wo3 yao4 qu4 mai3 piao4.', "I'm going to buy the tickets.", 'Mình sẽ đi mua vé.'],
          ['明天我要早起床。', 'Ming2 tian1 wo3 yao4 zao3 qi3 chuang2.', 'I need to get up early tomorrow.', 'Mai mình phải dậy sớm.']
        ]
      },
      {
        pattern: '还 + 动词',
        explanation: '“还”表示“也、再加上”：星期天我们还可以一起跑步。',
        explanation_vi: '还 = còn, thêm nữa: 我们还可以一起跑步 = Chúng mình còn có thể chạy bộ cùng nhau nữa.',
        examples: [
          ['星期天我们还可以一起跑步。', 'Xing1 qi1 tian1 wo3 men5 hai2 ke3 yi3 yi4 qi3 pao3 bu4.', 'On Sunday we can also go running together.', 'Chủ nhật chúng mình còn có thể cùng chạy bộ nữa.'],
          ['我还想买一本书。', 'Wo3 hai2 xiang3 mai3 yi4 ben3 shu1.', 'I also want to buy a book.', 'Mình còn muốn mua thêm một cuốn sách.'],
          ['你还要什么？', 'Ni3 hai2 yao4 shen2 me5?', 'What else would you like?', 'Bạn còn cần gì nữa không?']
        ]
      }
    ],
    warmup: {
      items: ['周末你想做什么？', '你喜欢看电影吗？', '说一说：洗衣服 / 买票。'],
      itemsVi: [
        'Cuối tuần này bạn định làm gì?',
        'Bạn có thích xem phim không? Thể loại nào?',
        'Đọc từ mới: 洗衣服 (giặt đồ) / 买票 (mua vé).'
      ]
    },
    dialogue: [
      ['A', '李月，周末你想做什么？', 'Li3 Yue4, zhou1 mo4 ni3 xiang3 zuo4 shen2 me5?', 'Li Yue, what do you want to do this weekend?', 'Lý Nguyệt, cuối tuần bạn định làm gì?'],
      ['B', '星期六上午我要洗衣服。', 'Xing1 qi1 liu4 shang4 wu3 wo3 yao4 xi3 yi1 fu5.', "Saturday morning I'm doing laundry.", 'Sáng thứ Bảy mình phải giặt quần áo.'],
      ['A', '下午呢？', 'Xia4 wu3 ne5?', 'And in the afternoon?', 'Thế buổi chiều?'],
      ['B', '下午我想去看电影。你想一起去吗？', 'Xia4 wu3 wo3 xiang3 qu4 kan4 dian4 ying3. Ni3 xiang3 yi4 qi3 qu4 ma5?', "I'd like to see a movie. Want to come along?", 'Chiều mình muốn đi xem phim. Bạn đi cùng không?'],
      ['A', '想！什么电影？', 'Xiang3! Shen2 me5 dian4 ying3?', 'Sure! What movie?', 'Đi chứ! Phim gì thế?'],
      ['B', '一个中国电影，很有意思。', 'Yi2 ge4 Zhong1 guo2 dian4 ying3, hen3 you3 yi4 si5.', 'A Chinese movie — really interesting.', 'Một bộ phim Trung Quốc, hay lắm.'],
      ['A', '太好了，我去买票！', 'Tai4 hao3 le5, wo3 qu4 mai3 piao4!', "Great, I'll buy the tickets!", 'Tuyệt, để mình đi mua vé!'],
      ['B', '星期天我们还可以一起去跑步。', 'Xing1 qi1 tian1 wo3 men5 hai2 ke3 yi3 yi4 qi3 qu4 pao3 bu4.', 'On Sunday we can also go for a run together.', 'Chủ nhật chúng mình còn có thể cùng đi chạy bộ nữa.'],
      ['A', '好，这个周末很快乐！', 'Hao3, zhe4 ge5 zhou1 mo4 hen3 kuai4 le4!', 'Nice — this weekend will be fun!', 'Ừ, cuối tuần này vui phải biết!']
    ],
    exercises: [
      ['fill_blank', 'remember', '星期六上午我要___衣服。', 'Xing1 qi1 liu4 shang4 wu3 wo3 yao4 ___ yi1 fu5.', ['洗', '买', '穿'], 0, ['giặt', 'mua', 'mặc'], '课文里说：“我要洗衣服。”', 'Trong bài: sáng thứ Bảy phải giặt quần áo (洗衣服).'],
      ['fill_blank', 'remember', '这个电影很___。', 'Zhe4 ge5 dian4 ying3 hen3 ___.', ['有意思', '好吃', '贵'], 0, ['thú vị/hay', 'ngon', 'đắt'], '说电影好看，用“有意思”。', 'Khen phim hay dùng 有意思 (thú vị), không dùng 好吃.'],
      ['multiple_choice', 'understand', '他们星期六下午做什么？', 'Ta1 men5 xing1 qi1 liu4 xia4 wu3 zuo4 shen2 me5?', ['看电影', '洗衣服', '跑步'], 0, ['xem phim', 'giặt quần áo', 'chạy bộ'], '下午去看中国电影；洗衣服是上午，跑步是星期天。', 'Chiều thứ Bảy xem phim; giặt đồ buổi sáng, chạy bộ để Chủ nhật.'],
      ['word_order', 'understand', ['下午', '我', '想', '去', '看', '电影'], 'xia4 wu3 / wo3 / xiang3 / qu4 / kan4 / dian4 ying3', ['buổi chiều', 'tôi', 'muốn', 'đi', 'xem', 'phim'], '下午我想去看电影。', 'Buổi chiều tôi muốn đi xem phim.', '“想”后面是“去+看电影”。', 'Chuỗi động từ: 想 + 去 + 看电影 (muốn đi xem phim).'],
      ['listening_comprehension', 'understand', [5], '那是什么电影？', 'Na4 shi4 shen2 me5 dian4 ying3?', ['中国电影', '很没意思的电影', '一个老电影'], 0, ['phim Trung Quốc', 'phim rất chán', 'một bộ phim cũ'], '“一个中国电影，很有意思。”', 'Câu nghe được: đó là một bộ phim Trung Quốc rất hay.'],
      ['true_false', 'understand', '星期天他们想一起去跑步。', 'Xing1 qi1 tian1 ta1 men5 xiang3 yi4 qi3 qu4 pao3 bu4.', true, '“星期天我们还可以一起去跑步。”', 'Đúng. Chủ nhật hai bạn còn rủ nhau đi chạy bộ.'],
      ['reading_comprehension', 'understand', '谁去买电影票？', 'Shei2 qu4 mai3 dian4 ying3 piao4?', ['问“周末做什么”的人', '李月', '李月的妈妈'], 0, ['người hỏi về cuối tuần', 'Lý Nguyệt', 'mẹ của Lý Nguyệt'], 'A说：“太好了，我去买票！”', 'Người rủ chuyện (A) xung phong: 我去买票 (để mình mua vé).']
    ]
  },
  {
    slug: 'city',
    titleZh: '城市',
    titleEn: 'The City',
    titleVi: 'Thành phố',
    summaryEn: 'Li Yue describes her big beautiful city: shops and restaurants near her home, five minutes on foot.',
    summaryVi: 'Lý Nguyệt kể về thành phố to đẹp của mình: cạnh nhà có cửa hàng, quán ăn, đi bộ chỉ năm phút.',
    vocab: [
      ['城市', 'cheng2 shi4', 'noun', 'city', 'thành phố'],
      ['旁边', 'pang2 bian1', 'noun', 'beside, next to', 'bên cạnh'],
      ['离', 'li2', 'preposition', 'from (distance)', 'cách (khoảng cách)'],
      ['远', 'yuan3', 'adjective', 'far', 'xa'],
      ['近', 'jin4', 'adjective', 'near, close', 'gần'],
      ['路', 'lu4', 'noun', 'road, way', 'đường'],
      ['欢迎', 'huan1 ying2', 'verb', 'to welcome', 'hoan nghênh, chào đón']
    ],
    grammar: [
      {
        pattern: 'A + 离 + B + 远/近',
        explanation: '“离”说两个地方远不远：商店离我家很近。',
        explanation_vi: '离 nói khoảng cách giữa hai nơi: A 离 B 很近/很远 = A cách B gần/xa.',
        examples: [
          ['商店离我家很近。', 'Shang1 dian4 li2 wo3 jia1 hen3 jin4.', 'The shop is close to my home.', 'Cửa hàng ở rất gần nhà mình.'],
          ['火车站离这儿远吗？', 'Huo3 che1 zhan4 li2 zhe4r5 yuan3 ma5?', 'Is the train station far from here?', 'Ga tàu có xa chỗ này không?'],
          ['学校离公司不远。', 'Xue2 xiao4 li2 gong1 si1 bu4 yuan3.', 'The school is not far from the company.', 'Trường học cách công ty không xa.']
        ]
      },
      {
        pattern: '地方 + 旁边 + 有……',
        explanation: '“旁边有……”介绍旁边的东西：我家旁边有商店。',
        explanation_vi: 'Câu tồn tại: nơi chốn + 旁边有… = bên cạnh… có…: 我家旁边有商店 = Cạnh nhà mình có cửa hàng.',
        examples: [
          ['我家旁边有商店，也有饭馆。', 'Wo3 jia1 pang2 bian1 you3 shang1 dian4, ye3 you3 fan4 guan3.', 'Next to my home there is a shop and a restaurant.', 'Cạnh nhà mình có cửa hàng và cả quán ăn.'],
          ['学校旁边有一个书店。', 'Xue2 xiao4 pang2 bian1 you3 yi2 ge4 shu1 dian4.', 'There is a bookstore next to the school.', 'Cạnh trường có một hiệu sách.'],
          ['医院旁边有火车站。', 'Yi1 yuan4 pang2 bian1 you3 huo3 che1 zhan4.', 'There is a train station next to the hospital.', 'Cạnh bệnh viện có ga tàu.']
        ]
      }
    ],
    warmup: {
      items: ['你住的城市大吗？', '你家旁边有什么？', '学校离你家远吗？'],
      itemsVi: [
        'Thành phố bạn sống có lớn không?',
        'Cạnh nhà bạn có những gì? (cửa hàng, quán ăn…)',
        'Trường/công ty cách nhà bạn xa hay gần?'
      ]
    },
    dialogue: [
      ['A', '李月，你的城市大吗？', 'Li3 Yue4, ni3 de5 cheng2 shi4 da4 ma5?', 'Li Yue, is your city big?', 'Lý Nguyệt, thành phố của bạn có lớn không?'],
      ['B', '很大，也很漂亮。', 'Hen3 da4, ye3 hen3 piao4 liang5.', "It's big and beautiful.", 'Lớn lắm, mà cũng rất đẹp nữa.'],
      ['A', '你家旁边有什么？', 'Ni3 jia1 pang2 bian1 you3 shen2 me5?', 'What is there near your home?', 'Cạnh nhà bạn có gì?'],
      ['B', '旁边有商店，也有饭馆。', 'Pang2 bian1 you3 shang1 dian4, ye3 you3 fan4 guan3.', 'There is a shop and a restaurant nearby.', 'Bên cạnh có cửa hàng, có cả quán ăn nữa.'],
      ['A', '商店离你家远吗？', 'Shang1 dian4 li2 ni3 jia1 yuan3 ma5?', 'Is the shop far from your home?', 'Cửa hàng có xa nhà bạn không?'],
      ['B', '不远，很近，走路五分钟。', 'Bu4 yuan3, hen3 jin4, zou3 lu4 wu3 fen1 zhong1.', 'Not far at all — five minutes on foot.', 'Không xa, gần lắm, đi bộ năm phút thôi.'],
      ['A', '太好了！我想去你的城市玩儿。', 'Tai4 hao3 le5! Wo3 xiang3 qu4 ni3 de5 cheng2 shi4 wan2r5.', "Nice! I'd love to visit your city.", 'Thích thế! Mình muốn đến thành phố của bạn chơi.'],
      ['B', '好啊，欢迎你来！', 'Hao3 a5, huan1 ying2 ni3 lai2!', 'Sure — you are very welcome!', 'Được chứ, hoan nghênh bạn đến!']
    ],
    exercises: [
      ['fill_blank', 'remember', '商店___我家很近。', 'Shang1 dian4 ___ wo3 jia1 hen3 jin4.', ['离', '从', '在'], 0, ['cách', 'từ', 'ở'], '说远近用“离”：A离B很近。', 'Khoảng cách dùng 离: 商店离我家很近 = cửa hàng gần nhà.'],
      ['fill_blank', 'remember', '我家___有商店，也有饭馆。', 'Wo3 jia1 ___ you3 shang1 dian4, ye3 you3 fan4 guan3.', ['旁边', '后面的路', '中间'], 0, ['bên cạnh', 'con đường phía sau', 'ở giữa'], '课文里说：“旁边有商店，也有饭馆。”', 'Trong bài: 旁边有商店，也有饭馆 (cạnh nhà có cửa hàng và quán ăn).'],
      ['multiple_choice', 'understand', '走路去商店要多长时间？', 'Zou3 lu4 qu4 shang1 dian4 yao4 duo1 chang2 shi2 jian1?', ['五分钟', '十五分钟', '五十分钟'], 0, ['5 phút', '15 phút', '50 phút'], '“不远，很近，走路五分钟。”', 'Đi bộ chỉ mất 五分钟 (5 phút) vì cửa hàng rất gần.'],
      ['word_order', 'understand', ['商店', '离', '我家', '很', '近'], 'shang1 dian4 / li2 / wo3 jia1 / hen3 / jin4', ['cửa hàng', 'cách', 'nhà tôi', 'rất', 'gần'], '商店离我家很近。', 'Cửa hàng rất gần nhà tôi.', '“离”在两个地方中间：A离B很近。', 'Cấu trúc: A + 离 + B + 近/远. 离 đứng giữa hai địa điểm.'],
      ['listening_comprehension', 'understand', [1], '李月的城市怎么样？', 'Li3 Yue4 de5 cheng2 shi4 zen3 me5 yang4?', ['很大也很漂亮', '很小但是漂亮', '很大但是不漂亮'], 0, ['lớn và đẹp', 'nhỏ nhưng đẹp', 'lớn nhưng không đẹp'], '她说：“很大，也很漂亮。”', 'Câu nghe được: thành phố rất lớn và cũng rất đẹp.'],
      ['true_false', 'understand', '商店离李月家很远。', 'Shang1 dian4 li2 Li3 Yue4 jia1 hen3 yuan3.', false, '她说：“不远，很近，走路五分钟。”', 'Sai. Cửa hàng rất gần, đi bộ chỉ năm phút.'],
      ['reading_comprehension', 'understand', '李月对朋友说什么？', 'Li3 Yue4 dui4 peng2 you5 shuo1 shen2 me5?', ['欢迎你来！', '不要来！', '再见！'], 0, ['Hoan nghênh bạn đến!', 'Đừng đến!', 'Tạm biệt!'], '“好啊，欢迎你来！”', 'Khi bạn muốn ghé chơi, Lý Nguyệt đáp: 欢迎你来! (Hoan nghênh bạn đến!).']
    ]
  },
  {
    slug: 'home',
    titleZh: '在家',
    titleEn: 'At Home',
    titleVi: 'Ở nhà',
    summaryEn: 'An evening at home: watching TV, a room with a bed, desk, chairs and computer, and helping mom cook.',
    summaryVi: 'Buổi tối ở nhà: xem tivi, căn phòng có giường, bàn, ghế, máy tính, và phụ mẹ nấu cơm.',
    vocab: [
      ['桌子', 'zhuo1 zi5', 'noun', 'table, desk', 'cái bàn'],
      ['椅子', 'yi3 zi5', 'noun', 'chair', 'cái ghế'],
      ['床', 'chuang2', 'noun', 'bed', 'cái giường'],
      ['电视', 'dian4 shi4', 'noun', 'TV', 'tivi'],
      ['电脑', 'dian4 nao3', 'noun', 'computer', 'máy tính'],
      ['做饭', 'zuo4 fan4', 'verb phrase', 'to cook', 'nấu cơm, nấu ăn'],
      ['帮', 'bang1', 'verb', 'to help', 'giúp'],
      ['真', 'zhen1', 'adverb', 'really, truly', 'thật, thật là']
    ],
    grammar: [
      {
        pattern: '地方 + 有 + 东西（存在句）',
        explanation: '说房间里有什么：房间里有床、桌子和椅子。',
        explanation_vi: 'Câu tồn tại: nơi chốn + 有 + đồ vật: 房间里有床 = Trong phòng có giường.',
        examples: [
          ['房间里有床、桌子和椅子。', 'Fang2 jian1 li3 you3 chuang2, zhuo1 zi5 he2 yi3 zi5.', 'In the room there is a bed, a desk and chairs.', 'Trong phòng có giường, bàn và ghế.'],
          ['桌子上有一个电脑。', 'Zhuo1 zi5 shang4 you3 yi2 ge4 dian4 nao3.', 'There is a computer on the desk.', 'Trên bàn có một chiếc máy tính.'],
          ['家里有很多书。', 'Jia1 li3 you3 hen3 duo1 shu1.', 'There are many books at home.', 'Trong nhà có rất nhiều sách.']
        ]
      },
      {
        pattern: '帮 + 人 + 动词',
        explanation: '“帮”后面先说人，再说做什么：我帮妈妈洗菜。',
        explanation_vi: '帮 + người + việc = giúp ai làm gì: 我帮妈妈洗菜 = Mình giúp mẹ rửa rau.',
        examples: [
          ['我帮妈妈洗菜。', 'Wo3 bang1 ma1 ma5 xi3 cai4.', 'I help mom wash the vegetables.', 'Mình giúp mẹ rửa rau.'],
          ['你可以帮我买票吗？', 'Ni3 ke3 yi3 bang1 wo3 mai3 piao4 ma5?', 'Can you buy the ticket for me?', 'Bạn mua vé giúp mình được không?'],
          ['他帮朋友做饭。', 'Ta1 bang1 peng2 you5 zuo4 fan4.', 'He helps his friend cook.', 'Cậu ấy phụ bạn nấu cơm.']
        ]
      }
    ],
    warmup: {
      items: ['你的房间里有什么？', '在家你帮妈妈做什么？', '说一说：桌子 / 椅子 / 床。'],
      itemsVi: [
        'Trong phòng bạn có những đồ gì?',
        'Ở nhà bạn hay phụ giúp bố mẹ việc gì?',
        'Đọc từ mới: 桌子 (bàn) / 椅子 (ghế) / 床 (giường).'
      ]
    },
    dialogue: [
      ['A', '李月，你在家做什么？', 'Li3 Yue4, ni3 zai4 jia1 zuo4 shen2 me5?', 'Li Yue, what are you doing at home?', 'Lý Nguyệt, ở nhà bạn đang làm gì đấy?'],
      ['B', '我正在看电视。', 'Wo3 zheng4 zai4 kan4 dian4 shi4.', "I'm watching TV.", 'Mình đang xem tivi.'],
      ['A', '你的房间里有什么？', 'Ni3 de5 fang2 jian1 li3 you3 shen2 me5?', 'What do you have in your room?', 'Phòng của bạn có những gì?'],
      ['B', '有床、桌子和两把椅子，桌子上还有一个电脑。', 'You3 chuang2, zhuo1 zi5 he2 liang3 ba3 yi3 zi5, zhuo1 zi5 shang4 hai2 you3 yi2 ge4 dian4 nao3.', 'A bed, a desk and two chairs — and a computer on the desk.', 'Có giường, bàn và hai cái ghế, trên bàn còn có một chiếc máy tính nữa.'],
      ['A', '晚上谁做饭？', 'Wan3 shang5 shei2 zuo4 fan4?', 'Who cooks in the evening?', 'Buổi tối ai nấu cơm thế?'],
      ['B', '妈妈做饭，我帮妈妈洗菜。', 'Ma1 ma5 zuo4 fan4, wo3 bang1 ma1 ma5 xi3 cai4.', 'Mom cooks, and I help her wash the vegetables.', 'Mẹ nấu cơm, mình phụ mẹ rửa rau.'],
      ['A', '你真好！', 'Ni3 zhen1 hao3!', 'How sweet of you!', 'Bạn ngoan thật đấy!'],
      ['B', '晚饭以后，我们一家人一起看电视。', 'Wan3 fan4 yi3 hou4, wo3 men5 yi4 jia1 ren2 yi4 qi3 kan4 dian4 shi4.', 'After dinner the whole family watches TV together.', 'Ăn tối xong, cả nhà mình cùng xem tivi.']
    ],
    exercises: [
      ['fill_blank', 'remember', '房间里___床、桌子和椅子。', 'Fang2 jian1 li3 ___ chuang2, zhuo1 zi5 he2 yi3 zi5.', ['有', '是', '在'], 0, ['có', 'là', 'ở'], '说房间里有什么，用“有”。', 'Câu tồn tại dùng 有: trong phòng CÓ giường, bàn, ghế.'],
      ['fill_blank', 'remember', '我___妈妈洗菜。', 'Wo3 ___ ma1 ma5 xi3 cai4.', ['帮', '给', '请'], 0, ['giúp', 'đưa/cho', 'mời'], '“帮+人+做事”：帮妈妈洗菜。', '帮 + người + việc: 帮妈妈洗菜 = giúp mẹ rửa rau.'],
      ['multiple_choice', 'understand', '桌子上有什么？', 'Zhuo1 zi5 shang4 you3 shen2 me5?', ['一个电脑', '一个电视', '两把椅子'], 0, ['một chiếc máy tính', 'một chiếc tivi', 'hai cái ghế'], '“桌子上还有一个电脑。”', 'Trên bàn còn có một chiếc máy tính (电脑).'],
      ['word_order', 'understand', ['晚上', '妈妈', '做饭', '我', '帮', '她'], 'wan3 shang5 / ma1 ma5 / zuo4 fan4 / wo3 / bang1 / ta1', ['buổi tối', 'mẹ', 'nấu cơm', 'tôi', 'giúp', 'bà ấy'], '晚上妈妈做饭，我帮她。', 'Buổi tối mẹ nấu cơm, tôi giúp mẹ.', '先说妈妈做饭，再说我帮她。', 'Hai vế: mẹ nấu cơm trước, mình giúp mẹ sau. 帮 + người.'],
      ['listening_comprehension', 'understand', [5], '谁做饭？谁洗菜？', 'Shei2 zuo4 fan4? Shei2 xi3 cai4?', ['妈妈做饭，李月洗菜', '李月做饭，妈妈洗菜', '爸爸做饭'], 0, ['mẹ nấu, Lý Nguyệt rửa rau', 'Lý Nguyệt nấu, mẹ rửa rau', 'bố nấu cơm'], '“妈妈做饭，我帮妈妈洗菜。”', 'Câu nghe được: mẹ nấu cơm, Lý Nguyệt phụ rửa rau.'],
      ['true_false', 'understand', '晚饭以后，李月一个人看电视。', 'Wan3 fan4 yi3 hou4, Li3 Yue4 yi2 ge4 ren2 kan4 dian4 shi4.', false, '晚饭以后，一家人一起看电视。', 'Sai. Ăn tối xong cả nhà cùng xem tivi, không phải một mình.'],
      ['reading_comprehension', 'understand', '李月的房间里有几把椅子？', 'Li3 Yue4 de5 fang2 jian1 li3 you3 ji3 ba3 yi3 zi5?', ['两把', '一把', '三把'], 0, ['hai cái', 'một cái', 'ba cái'], '“有床、桌子和两把椅子。”', 'Trong phòng có hai cái ghế (两把椅子).']
    ]
  },
  {
    slug: 'travel',
    titleZh: '旅游',
    titleEn: 'Travel',
    titleVi: 'Du lịch',
    summaryEn: 'A five-day trip to Beijing next month: going by train because it\'s cheaper, tickets already bought, warm clothes packed.',
    summaryVi: 'Chuyến du lịch Bắc Kinh năm ngày vào tháng sau: đi tàu hỏa cho rẻ, vé đã mua xong, chuẩn bị thêm áo ấm.',
    vocab: [
      ['旅游', 'lv3 you2', 'verb/noun', 'to travel; tourism', 'du lịch'],
      ['飞机', 'fei1 ji1', 'noun', 'airplane', 'máy bay'],
      ['火车', 'huo3 che1', 'noun', 'train', 'tàu hỏa'],
      ['准备', 'zhun3 bei4', 'verb', 'to prepare', 'chuẩn bị'],
      ['回来', 'hui2 lai2', 'verb', 'to come back', 'trở về, quay lại']
    ],
    grammar: [
      {
        pattern: '坐 + 交通工具 + 去/来',
        explanation: '说怎么去：坐火车去、坐飞机来。',
        explanation_vi: 'Cách di chuyển: 坐 + phương tiện + 去/来: 坐火车去 = đi bằng tàu hỏa.',
        examples: [
          ['我坐火车去北京。', 'Wo3 zuo4 huo3 che1 qu4 Bei3 jing1.', "I'm taking the train to Beijing.", 'Mình đi Bắc Kinh bằng tàu hỏa.'],
          ['你坐飞机去吗？', 'Ni3 zuo4 fei1 ji1 qu4 ma5?', 'Are you flying there?', 'Bạn đi máy bay à?'],
          ['他坐公共汽车来学校。', 'Ta1 zuo4 gong1 gong4 qi4 che1 lai2 xue2 xiao4.', 'He comes to school by bus.', 'Cậu ấy đến trường bằng xe buýt.']
        ]
      },
      {
        pattern: '已经……了（完成）',
        explanation: '事情做完了：我已经买票了。',
        explanation_vi: '已经 + động từ + 了 = đã làm xong: 我已经买票了 = Mình mua vé xong rồi.',
        examples: [
          ['我已经买票了。', 'Wo3 yi3 jing1 mai3 piao4 le5.', 'I have already bought the tickets.', 'Mình đã mua vé rồi.'],
          ['她已经准备好了。', 'Ta1 yi3 jing1 zhun3 bei4 hao3 le5.', 'She is all set.', 'Cô ấy đã chuẩn bị xong xuôi.'],
          ['我们已经到火车站了。', 'Wo3 men5 yi3 jing1 dao4 huo3 che1 zhan4 le5.', 'We have arrived at the train station.', 'Chúng mình đã đến ga tàu rồi.']
        ]
      }
    ],
    warmup: {
      items: ['你想去哪儿旅游？', '你喜欢坐火车还是坐飞机？', '旅游要准备什么？'],
      itemsVi: [
        'Bạn muốn đi du lịch ở đâu nhất?',
        'Bạn thích đi tàu hỏa hay máy bay hơn? Vì sao?',
        'Trước chuyến du lịch cần chuẩn bị những gì?'
      ]
    },
    dialogue: [
      ['A', '小明，下个月我要去北京旅游！', 'Xiao3 Ming2, xia4 ge5 yue4 wo3 yao4 qu4 Bei3 jing1 lv3 you2!', "Xiaoming, I'm traveling to Beijing next month!", 'Tiểu Minh ơi, tháng sau mình đi du lịch Bắc Kinh đấy!'],
      ['B', '太好了！你坐飞机去吗？', 'Tai4 hao3 le5! Ni3 zuo4 fei1 ji1 qu4 ma5?', 'Nice! Are you flying?', 'Thích thế! Bạn đi máy bay à?'],
      ['A', '不，我坐火车去，火车票比飞机票便宜。', 'Bu4, wo3 zuo4 huo3 che1 qu4, huo3 che1 piao4 bi3 fei1 ji1 piao4 pian2 yi5.', "No, I'm taking the train — train tickets are cheaper than plane tickets.", 'Không, mình đi tàu hỏa, vé tàu rẻ hơn vé máy bay.'],
      ['B', '你要玩儿几天？', 'Ni3 yao4 wan2r5 ji3 tian1?', 'How many days will you stay?', 'Bạn định đi chơi mấy ngày?'],
      ['A', '玩儿五天。我已经买票了。', 'Wan2r5 wu3 tian1. Wo3 yi3 jing1 mai3 piao4 le5.', "Five days. I've already bought my tickets.", 'Năm ngày. Vé mình mua xong xuôi rồi.'],
      ['B', '你要准备什么？', 'Ni3 yao4 zhun3 bei4 shen2 me5?', 'What do you need to prepare?', 'Bạn còn phải chuẩn bị gì nữa?'],
      ['A', '北京很冷，我要准备很多衣服。', 'Bei3 jing1 hen3 leng3, wo3 yao4 zhun3 bei4 hen3 duo1 yi1 fu5.', "Beijing is cold, so I'm packing lots of warm clothes.", 'Bắc Kinh lạnh lắm, mình phải chuẩn bị nhiều quần áo ấm.'],
      ['B', '好，回来给我打电话，说一说北京！', 'Hao3, hui2 lai2 gei3 wo3 da3 dian4 hua4, shuo1 yi5 shuo1 Bei3 jing1!', 'OK — call me when you get back and tell me all about Beijing!', 'Ừ, về nhớ gọi điện kể cho mình nghe về Bắc Kinh nhé!']
    ],
    exercises: [
      ['fill_blank', 'remember', '我坐___去北京，票比飞机票便宜。', 'Wo3 zuo4 ___ qu4 Bei3 jing1, piao4 bi3 fei1 ji1 piao4 pian2 yi5.', ['火车', '出租车', '公共汽车'], 0, ['tàu hỏa', 'taxi', 'xe buýt'], '她坐火车去，因为火车票便宜。', 'Bạn ấy chọn tàu hỏa (火车) vì vé rẻ hơn vé máy bay.'],
      ['fill_blank', 'remember', '我已经买票___。', 'Wo3 yi3 jing1 mai3 piao4 ___.', ['了', '吗', '呢'], 0, ['rồi (了)', 'không (吗)', 'thì sao (呢)'], '“已经……了”表示做完了。', 'Cấu trúc 已经…了 diễn tả việc đã hoàn thành.'],
      ['multiple_choice', 'understand', '她为什么坐火车去？', 'Ta1 wei4 shen2 me5 zuo4 huo3 che1 qu4?', ['火车票便宜', '火车快', '没有飞机'], 0, ['vé tàu rẻ', 'tàu nhanh', 'không có máy bay'], '“火车票比飞机票便宜。”', 'Lý do chọn tàu: vé tàu rẻ hơn vé máy bay (比…便宜).'],
      ['word_order', 'understand', ['我', '坐', '火车', '去', '北京'], 'wo3 / zuo4 / huo3 che1 / qu4 / Bei3 jing1', ['tôi', 'đi (ngồi)', 'tàu hỏa', 'đi/đến', 'Bắc Kinh'], '我坐火车去北京。', 'Tôi đi Bắc Kinh bằng tàu hỏa.', '“坐火车”在“去北京”前面。', 'Trật tự: 坐 + phương tiện trước, 去 + nơi đến sau.'],
      ['listening_comprehension', 'understand', [6], '她为什么要准备很多衣服？', 'Ta1 wei4 shen2 me5 yao4 zhun3 bei4 hen3 duo1 yi1 fu5?', ['北京很冷', '北京很热', '衣服很便宜'], 0, ['Bắc Kinh rất lạnh', 'Bắc Kinh rất nóng', 'quần áo rất rẻ'], '“北京很冷，我要准备很多衣服。”', 'Câu nghe được: Bắc Kinh lạnh nên phải mang nhiều quần áo.'],
      ['true_false', 'understand', '她要在北京玩儿一个星期。', 'Ta1 yao4 zai4 Bei3 jing1 wan2r5 yi2 ge4 xing1 qi1.', false, '她说“玩儿五天”。', 'Sai. Bạn ấy đi chơi năm ngày (五天), chưa đến một tuần.'],
      ['reading_comprehension', 'understand', '回来以后，她要做什么？', 'Hui2 lai2 yi3 hou4, ta1 yao4 zuo4 shen2 me5?', ['给小明打电话', '给小明买衣服', '再去一次北京'], 0, ['gọi điện cho Tiểu Minh', 'mua quần áo cho Tiểu Minh', 'đi Bắc Kinh lần nữa'], '“回来给我打电话，说一说北京！”', 'Tiểu Minh dặn: về thì gọi điện kể chuyện Bắc Kinh cho cậu ấy nghe.']
    ]
  },
  {
    slug: 'gift',
    titleZh: '礼物',
    titleEn: 'Gifts',
    titleVi: 'Quà tặng',
    summaryEn: 'Choosing a birthday gift for mom: since she loves tea, a beautiful cup is the perfect idea.',
    summaryVi: 'Chọn quà sinh nhật cho mẹ: mẹ thích uống trà nên một chiếc cốc đẹp là món quà hợp nhất.',
    vocab: [
      ['礼物', 'li3 wu4', 'noun', 'gift, present', 'quà, quà tặng'],
      ['送', 'song4', 'verb', 'to give (a gift)', 'tặng'],
      ['觉得', 'jue2 de5', 'verb', 'to think, to feel', 'cảm thấy, thấy'],
      ['知道', 'zhi1 dao4', 'verb', 'to know', 'biết', false],
      ['高兴', 'gao1 xing4', 'adjective', 'happy, glad', 'vui, vui mừng']
    ],
    grammar: [
      {
        pattern: '送 + 人 + 东西',
        explanation: '“送”后面先说人，再说东西：送她一个杯子。',
        explanation_vi: '送 + người + vật = tặng ai cái gì: 送她一个杯子 = tặng mẹ một chiếc cốc.',
        examples: [
          ['我想送妈妈一个礼物。', 'Wo3 xiang3 song4 ma1 ma5 yi2 ge4 li3 wu4.', 'I want to give mom a present.', 'Mình muốn tặng mẹ một món quà.'],
          ['你可以送她一个漂亮的杯子。', 'Ni3 ke3 yi3 song4 ta1 yi2 ge4 piao4 liang5 de5 bei1 zi5.', 'You could give her a beautiful cup.', 'Bạn có thể tặng mẹ một chiếc cốc thật đẹp.'],
          ['朋友送我一本书。', 'Peng2 you5 song4 wo3 yi4 ben3 shu1.', 'My friend gave me a book.', 'Bạn mình tặng mình một cuốn sách.']
        ]
      },
      {
        pattern: '你觉得……？',
        explanation: '问别人的想法：你觉得送什么好？',
        explanation_vi: 'Hỏi ý kiến dùng 觉得: 你觉得送什么好? = Bạn thấy tặng gì thì hợp?',
        examples: [
          ['你觉得送什么好？', 'Ni3 jue2 de5 song4 shen2 me5 hao3?', 'What do you think I should give?', 'Bạn thấy nên tặng gì thì hợp?'],
          ['我觉得这个礼物很好。', 'Wo3 jue2 de5 zhe4 ge5 li3 wu4 hen3 hao3.', 'I think this gift is great.', 'Mình thấy món quà này rất được.'],
          ['你觉得这件衣服怎么样？', 'Ni3 jue2 de5 zhe4 jian4 yi1 fu5 zen3 me5 yang4?', 'What do you think of this outfit?', 'Bạn thấy bộ đồ này thế nào?']
        ]
      }
    ],
    warmup: {
      items: ['你想送妈妈什么礼物？', '朋友过生日，你送什么？', '说一说：送礼物。'],
      itemsVi: [
        'Bạn muốn tặng mẹ món quà gì?',
        'Sinh nhật bạn thân, bạn hay tặng gì?',
        'Tập nói mẫu: 送 + người + quà (tặng ai cái gì).'
      ]
    },
    dialogue: [
      ['A', '小明，妈妈的生日快到了，我想送她一个礼物。', 'Xiao3 Ming2, ma1 ma5 de5 sheng1 ri4 kuai4 dao4 le5, wo3 xiang3 song4 ta1 yi2 ge4 li3 wu4.', "Xiaoming, mom's birthday is coming up. I want to get her a gift.", 'Tiểu Minh ơi, sắp đến sinh nhật mẹ rồi, mình muốn tặng mẹ một món quà.'],
      ['B', '你想送什么？', 'Ni3 xiang3 song4 shen2 me5?', 'What do you have in mind?', 'Bạn định tặng gì?'],
      ['A', '我不知道。你觉得送什么好？', 'Wo3 bu4 zhi1 dao4. Ni3 jue2 de5 song4 shen2 me5 hao3?', "I don't know. What do you think would be good?", 'Mình chưa biết. Bạn thấy tặng gì thì hợp?'],
      ['B', '你妈妈喜欢什么？', 'Ni3 ma1 ma5 xi3 huan5 shen2 me5?', 'What does your mom like?', 'Mẹ bạn thích gì?'],
      ['A', '她很喜欢喝茶。', 'Ta1 hen3 xi3 huan5 he1 cha2.', 'She loves drinking tea.', 'Mẹ mình rất thích uống trà.'],
      ['B', '那你可以送她一个漂亮的杯子！', 'Na4 ni3 ke3 yi3 song4 ta1 yi2 ge4 piao4 liang5 de5 bei1 zi5!', 'Then you could give her a beautiful cup!', 'Vậy bạn tặng mẹ một chiếc cốc thật đẹp đi!'],
      ['A', '好想法！妈妈会很高兴的。', 'Hao3 xiang3 fa3! Ma1 ma5 hui4 hen3 gao1 xing4 de5.', 'Great idea! Mom will be so happy.', 'Ý hay đấy! Mẹ mình sẽ vui lắm cho xem.'],
      ['B', '你说得对，我们今天就去买吧！', 'Ni3 shuo1 de5 dui4, wo3 men5 jin1 tian1 jiu4 qu4 mai3 ba5!', "Right — let's go buy it today!", 'Chuẩn luôn, hôm nay chúng mình đi mua luôn đi!']
    ],
    exercises: [
      ['fill_blank', 'remember', '我想___妈妈一个礼物。', 'Wo3 xiang3 ___ ma1 ma5 yi2 ge4 li3 wu4.', ['送', '买', '给'], 0, ['tặng', 'mua', 'đưa'], '送礼物用“送”：送她一个礼物。', 'Tặng quà dùng động từ 送: 送妈妈一个礼物.'],
      ['fill_blank', 'remember', '你___送什么好？', 'Ni3 ___ song4 shen2 me5 hao3?', ['觉得', '知道', '喜欢'], 0, ['thấy/cảm thấy', 'biết', 'thích'], '问想法说“你觉得……好？”', 'Hỏi ý kiến dùng 觉得: 你觉得送什么好?'],
      ['multiple_choice', 'understand', '为什么送杯子好？', 'Wei4 shen2 me5 song4 bei1 zi5 hao3?', ['因为妈妈喜欢喝茶', '因为杯子很便宜', '因为家里没有杯子'], 0, ['vì mẹ thích uống trà', 'vì cốc rất rẻ', 'vì nhà không có cốc'], '妈妈喜欢喝茶，所以送漂亮的杯子很好。', 'Mẹ thích uống trà nên chiếc cốc đẹp là món quà hợp lý.'],
      ['word_order', 'understand', ['你', '可以', '送', '她', '一个', '杯子'], 'ni3 / ke3 yi3 / song4 / ta1 / yi2 ge4 / bei1 zi5', ['bạn', 'có thể', 'tặng', 'bà ấy', 'một cái', 'cốc'], '你可以送她一个杯子。', 'Bạn có thể tặng mẹ một chiếc cốc.', '“送”后面先是人“她”，再是东西“杯子”。', 'Trật tự: 送 + người (她) + vật (一个杯子).'],
      ['listening_comprehension', 'understand', [4, 5], '妈妈喜欢什么？', 'Ma1 ma5 xi3 huan5 shen2 me5?', ['喝茶', '看电影', '跑步'], 0, ['uống trà', 'xem phim', 'chạy bộ'], '“她很喜欢喝茶。”', 'Câu nghe được: mẹ rất thích uống trà → gợi ý tặng cốc.'],
      ['true_false', 'understand', '他们明天去买礼物。', 'Ta1 men5 ming2 tian1 qu4 mai3 li3 wu4.', false, '“我们今天就去买吧！”', 'Sai. Hai bạn quyết định hôm nay đi mua luôn (今天就去买).'],
      ['reading_comprehension', 'understand', '她要送妈妈什么？', 'Ta1 yao4 song4 ma1 ma5 shen2 me5?', ['一个漂亮的杯子', '一件衣服', '一本书'], 0, ['một chiếc cốc đẹp', 'một bộ quần áo', 'một cuốn sách'], '朋友说送“一个漂亮的杯子”，她觉得很好。', 'Theo gợi ý, món quà là một chiếc cốc đẹp cho mẹ thích trà.']
    ]
  },
  {
    slug: 'routine',
    titleZh: '日常',
    titleEn: 'Daily Routine',
    titleVi: 'Sinh hoạt hằng ngày',
    summaryEn: 'A full day reviewed: up at six, morning run, work from nine, coffee at three, family dinner and TV at night.',
    summaryVi: 'Một ngày trọn vẹn: dậy 6 giờ, chạy bộ buổi sáng, 9 giờ làm việc, 3 giờ chiều cà phê, tối ăn cơm cùng gia đình và xem tivi.',
    vocab: [
      ['先', 'xian1', 'adverb', 'first', 'trước, trước tiên'],
      ['咖啡', 'ka1 fei1', 'noun', 'coffee', 'cà phê'],
      ['起床', 'qi3 chuang2', 'verb phrase', 'to get up', 'thức dậy', false],
      ['工作', 'gong1 zuo4', 'noun/verb', 'work; to work', 'công việc; làm việc', false],
      ['每', 'mei3', 'pronoun', 'every, each', 'mỗi, hằng', false],
      ['一起', 'yi4 qi3', 'adverb', 'together', 'cùng nhau', false],
      ['觉得', 'jue2 de5', 'verb', 'to think, to feel', 'cảm thấy', false]
    ],
    grammar: [
      {
        pattern: '先……，再……',
        explanation: '说做事的先后：我先跑步，再吃饭。',
        explanation_vi: '先…再… = trước tiên… rồi mới…: 先跑步，再吃饭 = chạy bộ trước rồi mới ăn sáng.',
        examples: [
          ['我先跑步，再吃饭。', 'Wo3 xian1 pao3 bu4, zai4 chi1 fan4.', 'I run first, then eat.', 'Mình chạy bộ trước rồi mới ăn sáng.'],
          ['我们先买票，再进去。', 'Wo3 men5 xian1 mai3 piao4, zai4 jin4 qu5.', 'We buy tickets first, then go in.', 'Chúng mình mua vé trước rồi mới vào.'],
          ['你先洗菜，再做饭。', 'Ni3 xian1 xi3 cai4, zai4 zuo4 fan4.', 'Wash the vegetables first, then cook.', 'Bạn rửa rau trước rồi hãy nấu.']
        ]
      },
      {
        pattern: '时间 + 地点 + 动词（语序复习）',
        explanation: '复习语序：我中午在公司吃饭。',
        explanation_vi: 'Ôn trật tự câu: thời gian + nơi chốn + động từ: 我中午在公司吃饭 = Buổi trưa tôi ăn ở công ty.',
        examples: [
          ['我中午在公司吃饭。', 'Wo3 zhong1 wu3 zai4 gong1 si1 chi1 fan4.', 'I eat lunch at the company.', 'Buổi trưa mình ăn cơm ở công ty.'],
          ['我晚上在家看电视。', 'Wo3 wan3 shang5 zai4 jia1 kan4 dian4 shi4.', 'In the evening I watch TV at home.', 'Buổi tối mình xem tivi ở nhà.'],
          ['他每天早上在学校跑步。', 'Ta1 mei3 tian1 zao3 shang5 zai4 xue2 xiao4 pao3 bu4.', 'He runs at school every morning.', 'Sáng nào cậu ấy cũng chạy bộ ở trường.']
        ]
      }
    ],
    warmup: {
      items: ['你每天几点起床？', '说一说你的一天。', '你先做什么，再做什么？'],
      itemsVi: [
        'Hằng ngày bạn dậy lúc mấy giờ?',
        'Kể về một ngày của bạn từ sáng đến tối.',
        'Buổi sáng bạn làm gì trước, làm gì sau? Dùng 先…再…'
      ]
    },
    dialogue: [
      ['A', '王方，你每天几点起床？', 'Wang2 Fang1, ni3 mei3 tian1 ji3 dian3 qi3 chuang2?', 'Wang Fang, what time do you get up every day?', 'Vương Phương, hằng ngày bạn dậy lúc mấy giờ?'],
      ['B', '我早上六点起床，先跑步，再吃饭。', 'Wo3 zao3 shang5 liu4 dian3 qi3 chuang2, xian1 pao3 bu4, zai4 chi1 fan4.', 'I get up at six, run first, then have breakfast.', 'Mình dậy sáu giờ sáng, chạy bộ trước rồi mới ăn sáng.'],
      ['A', '上午你做什么？', 'Shang4 wu3 ni3 zuo4 shen2 me5?', 'What do you do in the morning?', 'Buổi sáng bạn làm gì?'],
      ['B', '我九点开始工作，中午在公司吃饭。', 'Wo3 jiu3 dian3 kai1 shi3 gong1 zuo4, zhong1 wu3 zai4 gong1 si1 chi1 fan4.', 'I start work at nine and eat lunch at the company.', 'Chín giờ mình bắt đầu làm việc, trưa ăn cơm luôn ở công ty.'],
      ['A', '下午呢？', 'Xia4 wu3 ne5?', 'And the afternoon?', 'Còn buổi chiều?'],
      ['B', '下午三点我喝一杯咖啡，六点回家。', 'Xia4 wu3 san1 dian3 wo3 he1 yi4 bei1 ka1 fei1, liu4 dian3 hui2 jia1.', 'At three I have a coffee, and at six I head home.', 'Ba giờ chiều mình uống một cốc cà phê, sáu giờ thì về nhà.'],
      ['A', '晚上你做什么？', 'Wan3 shang5 ni3 zuo4 shen2 me5?', 'What about your evenings?', 'Buổi tối bạn làm gì?'],
      ['B', '我和爸爸妈妈一起吃晚饭、看电视，十一点睡觉。', 'Wo3 he2 ba4 ba5 ma1 ma5 yi4 qi3 chi1 wan3 fan4, kan4 dian4 shi4, shi2 yi1 dian3 shui4 jiao4.', 'I have dinner and watch TV with my parents, then sleep at eleven.', 'Mình ăn tối và xem tivi cùng bố mẹ, mười một giờ đi ngủ.'],
      ['A', '你的每一天都很忙，但是很快乐！', 'Ni3 de5 mei3 yi4 tian1 dou1 hen3 mang2, dan4 shi4 hen3 kuai4 le4!', 'Your days are busy but happy!', 'Ngày nào của bạn cũng bận rộn mà vui ghê!'],
      ['B', '对，我觉得这样很好。', 'Dui4, wo3 jue2 de5 zhe4 yang4 hen3 hao3.', 'Yes — I think it is a good life.', 'Ừ, mình thấy sống thế này rất ổn.']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___跑步，再吃饭。', 'Wo3 ___ pao3 bu4, zai4 chi1 fan4.', ['先', '就', '还'], 0, ['trước tiên', 'thì/đã', 'còn'], '“先……再……”说先后顺序。', 'Cặp 先…再…: làm việc này trước rồi mới đến việc kia.'],
      ['fill_blank', 'remember', '下午三点我喝一杯___。', 'Xia4 wu3 san1 dian3 wo3 he1 yi4 bei1 ___.', ['咖啡', '茶', '水'], 0, ['cà phê', 'trà', 'nước'], '课文里说下午三点喝咖啡。', 'Trong bài: 3 giờ chiều uống một cốc cà phê (咖啡).'],
      ['multiple_choice', 'understand', '王方中午在哪儿吃饭？', 'Wang2 Fang1 zhong1 wu3 zai4 na3r5 chi1 fan4?', ['公司', '家里', '饭馆'], 0, ['công ty', 'ở nhà', 'quán ăn'], '“中午在公司吃饭。”', 'Buổi trưa bạn ấy ăn ngay tại công ty (在公司吃饭).'],
      ['word_order', 'understand', ['我', '中午', '在', '公司', '吃饭'], 'wo3 / zhong1 wu3 / zai4 / gong1 si1 / chi1 fan4', ['tôi', 'buổi trưa', 'ở', 'công ty', 'ăn cơm'], '我中午在公司吃饭。', 'Buổi trưa tôi ăn cơm ở công ty.', '语序：时间（中午）→地点（在公司）→动词（吃饭）。', 'Trật tự chuẩn: thời gian → nơi chốn (在+địa điểm) → động từ.'],
      ['listening_comprehension', 'understand', [1], '王方早上先做什么？', 'Wang2 Fang1 zao3 shang5 xian1 zuo4 shen2 me5?', ['跑步', '吃饭', '工作'], 0, ['chạy bộ', 'ăn sáng', 'làm việc'], '“先跑步，再吃饭。”', 'Câu nghe được: dậy 6 giờ, chạy bộ trước rồi mới ăn sáng.'],
      ['true_false', 'understand', '王方晚上一个人吃晚饭。', 'Wang2 Fang1 wan3 shang5 yi2 ge4 ren2 chi1 wan3 fan4.', false, '她和爸爸妈妈一起吃晚饭、看电视。', 'Sai. Buổi tối bạn ấy ăn cơm và xem tivi cùng bố mẹ.'],
      ['reading_comprehension', 'understand', '王方觉得自己的生活怎么样？', 'Wang2 Fang1 jue2 de5 zi4 ji3 de5 sheng1 huo2 zen3 me5 yang4?', ['很忙但是很快乐', '太累了，不好', '不忙也不快乐'], 0, ['bận nhưng vui', 'quá mệt, không ổn', 'không bận cũng không vui'], '朋友说她“很忙，但是很快乐”，她说“我觉得这样很好”。', 'Kết bài: cuộc sống bận rộn nhưng vui, bạn ấy thấy như vậy rất tốt.']
    ]
  }
];
