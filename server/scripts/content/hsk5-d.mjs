// HSK5 (C1) lessons 04-05. See hsk4-a.mjs for the spec shape and hsk5-a.mjs for the
// bloom distribution used at this level.

export default {
  'hsk5-l04-standard-social-change': {
    titleZh: '社会变迁',
    titleEn: 'Social change',
    titleVi: 'Biến đổi xã hội',
    summaryEn: 'Telling change from progress: which gaps to watch, why the fastest-moving things are not the ones that matter most, and what an individual can reasonably do about it.',
    summaryVi: 'Phân biệt thay đổi với tiến bộ: nên nhìn vào khoảng cách nào, vì sao thứ đổi nhanh nhất chưa chắc quan trọng nhất, và một cá nhân có thể làm gì.',
    lines: [
      ['A', '那怎么看出一个变化是不是真的进步？', 'Nà zěn me kàn chū yí gè biàn huà shì bu shì zhēn de jìn bù?',
        'So how do you tell whether a change is really progress?',
        'Vậy làm sao nhận ra một thay đổi có thật sự là tiến bộ không?'],
      ['B', '看差距有没有变小，也看最普通的那部分人过得怎么样。', 'Kàn chā jù yǒu méi yǒu biàn xiǎo, yě kàn zuì pǔ tōng de nà bù fen rén guò de zěn me yàng.',
        'Look at whether the gaps have narrowed, and at how the most ordinary people are doing.',
        'Xem khoảng cách có thu hẹp lại không, và xem những người bình thường nhất sống ra sao.'],
      ['A', '城市和农村的差距，这几年是变大了还是变小了？', 'Chéng shì hé nóng cūn de chā jù, zhè jǐ nián shì biàn dà le hái shi biàn xiǎo le?',
        'Has the gap between city and countryside widened or narrowed these past few years?',
        'Khoảng cách giữa thành thị và nông thôn mấy năm nay rộng ra hay hẹp lại?'],
      ['B', '要分开看：收入的差距在变小，可是机会的差距不一定。', 'Yào fēn kāi kàn: shōu rù de chā jù zài biàn xiǎo, kě shì jī huì de chā jù bù yí dìng.',
        'You have to separate them: the income gap is narrowing, but the gap in opportunity is not necessarily.',
        'Phải tách ra mà xem: khoảng cách thu nhập đang hẹp lại, nhưng khoảng cách cơ hội thì chưa chắc.'],
      ['A', '传统的东西是不是一定会慢慢消失？', 'Chuán tǒng de dōng xi shì bu shì yí dìng huì màn man xiāo shī?',
        'Will traditional things inevitably fade away?',
        'Những thứ truyền thống có nhất định sẽ dần biến mất không?'],
      ['B', '不一定，越是变化快的时候，人们越想保留一点儿熟悉的东西。', 'Bù yí dìng, yuè shì biàn huà kuài de shí hou, rén men yuè xiǎng bǎo liú yì diǎnr shú xī de dōng xi.',
        'Not necessarily — the faster things change, the more people want to keep something familiar.',
        'Chưa chắc, càng lúc thay đổi nhanh, người ta càng muốn giữ lại chút gì quen thuộc.'],
      ['A', '那我们个人能做的是什么？', 'Nà wǒ men gè rén néng zuò de shì shén me?',
        'Then what can we do as individuals?',
        'Vậy cá nhân chúng ta có thể làm gì?'],
      ['B', '一边适应新的方式，一边想清楚哪些老办法值得带着走。', 'Yì biān shì yìng xīn de fāng shì, yì biān xiǎng qīng chu nǎ xiē lǎo bàn fǎ zhí de dài zhe zǒu.',
        'Adapt to the new ways while working out which old ones are worth carrying with you.',
        'Vừa thích nghi với cách làm mới, vừa nghĩ cho rõ cách cũ nào đáng mang theo.']
    ],
    vocab: [['变化', 'biàn huà'], ['观念', 'guān niàn'], ['群体', 'qún tǐ'], ['进步', 'jìn bù'], ['趋势', 'qū shì'],
      ['传统', 'chuán tǒng'], ['现代', 'xiàn dài'], ['适应', 'shì yìng'], ['差距', 'chā jù'], ['农村', 'nóng cūn'],
      ['城市', 'chéng shì'], ['人口', 'rén kǒu'], ['结构', 'jié gòu'], ['逐渐', 'zhú jiàn'], ['速度', 'sù dù'],
      ['改革', 'gǎi gé'], ['消失', 'xiāo shī'], ['保留', 'bǎo liú']],
    grammar: [
      {
        pattern: '越……越……',
        explEn: 'Links two things that rise together. Each 越 stands directly before the word it scales; 越是 marks the condition when the first clause is a situation rather than an action.',
        explVi: 'Nối hai điều cùng tăng theo nhau. Mỗi 越 đứng ngay trước từ mà nó làm tăng; 越是 dùng khi vế đầu là một tình huống chứ không phải hành động.',
        examples: [
          ['越是变化快的时候，人们越想保留熟悉的东西。', 'Yuè shì biàn huà kuài de shí hou, rén men yuè xiǎng bǎo liú shú xī de dōng xi.', 'The faster things change, the more people want to keep what is familiar.', 'Càng lúc thay đổi nhanh, người ta càng muốn giữ thứ quen thuộc.'],
          ['城市人口越多，住的问题越明显。', 'Chéng shì rén kǒu yuè duō, zhù de wèn tí yuè míng xiǎn.', 'The larger a city\'s population, the more obvious its housing problem.', 'Dân số thành phố càng đông, vấn đề chỗ ở càng rõ.'],
          ['观念改得越慢，差距就越难缩小。', 'Guān niàn gǎi de yuè màn, chā jù jiù yuè nán suō xiǎo.', 'The slower attitudes change, the harder the gap is to close.', 'Quan niệm đổi càng chậm, khoảng cách càng khó thu hẹp.']
        ]
      },
      {
        pattern: '（要）看……有没有……',
        explEn: 'States the criterion a judgement rests on. 看 introduces what to examine, and the A-not-A form after it makes the test a factual yes-or-no rather than an opinion.',
        explVi: 'Nêu tiêu chí mà một phán đoán dựa vào. 看 dẫn ra điều cần xem xét, dạng A-không-A phía sau biến phép thử thành có/không dựa trên sự thật, không phải ý kiến.',
        examples: [
          ['要看它有没有让大多数人的生活变得更好。', 'Yào kàn tā yǒu méi yǒu ràng dà duō shù rén de shēng huó biàn de gèng hǎo.', 'It depends on whether it has made most people\'s lives better.', 'Phải xem nó có làm cuộc sống của đa số người tốt hơn không.'],
          ['看差距有没有变小，别只看速度。', 'Kàn chā jù yǒu méi yǒu biàn xiǎo, bié zhǐ kàn sù dù.', 'Look at whether the gap narrowed, not only at the speed.', 'Xem khoảng cách có hẹp lại không, đừng chỉ nhìn tốc độ.'],
          ['一项改革好不好，要看农村有没有得到好处。', 'Yí xiàng gǎi gé hǎo bu hǎo, yào kàn nóng cūn yǒu méi yǒu shòu yì.', 'Whether a reform is good depends on whether the countryside gained from it.', 'Một cuộc cải cách tốt hay không, phải xem nông thôn có được lợi không.']
        ]
      },
      {
        pattern: '值得 + 动词',
        explEn: 'Says something merits the action named. The verb follows directly with no 被 and no object repeated — the subject is what would be acted on.',
        explVi: 'Nói rằng điều gì đó xứng đáng với hành động được nêu. Động từ theo ngay sau, không dùng 被 và không lặp lại tân ngữ — chủ ngữ chính là đối tượng chịu tác động.',
        examples: [
          ['想清楚哪些老办法值得带着走。', 'Xiǎng qīng chu nǎ xiē lǎo bàn fǎ zhí de dài zhe zǒu.', 'Work out which old methods are worth carrying with you.', 'Nghĩ cho rõ cách cũ nào đáng mang theo.'],
          ['这个趋势值得注意。', 'Zhè ge qū shì zhí de zhù yì.', 'This trend is worth noting.', 'Xu hướng này đáng chú ý.'],
          ['不是所有传统都值得保留。', 'Bú shì suǒ yǒu chuán tǒng dōu zhí de bǎo liú.', 'Not every tradition is worth keeping.', 'Không phải truyền thống nào cũng đáng giữ lại.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '快的部分和慢的部分',
        titleEn: 'The fast part and the slow part',
        titleVi: 'Phần nhanh và phần chậm',
        zh: '社会变化不是一块整体，它有快的部分，也有慢的部分。技术换得最快，几年就是一代；工作的方式跟在后面；而观念和习惯改得最慢，常常要等一代人长大才看得出来。麻烦就出在这里：技术已经跑到前面，规则和观念还留在后面，中间隔开的那一段就是各种问题产生的地方。所以只看技术的速度去判断一个社会的变化，容易得出太乐观的结论。真正值得观察的，是慢的那部分有没有跟上来。人口结构的变化也是这样，一年一年看不出什么，二十年一起看却能改变整个城市的样子。',
        en: 'Social change is not one solid block; it has fast parts and slow parts. Technology turns over fastest — a few years make a generation; ways of working follow behind; and attitudes and habits change slowest of all, often visible only once a new generation has grown up. That is exactly where the trouble lies: technology has run ahead while rules and attitudes stay behind, and the stretch that opens up between them is where problems are produced. Judging a society\'s change by the speed of its technology alone therefore tends to yield conclusions that are too optimistic. What is really worth watching is whether the slow part has caught up. Changes in population structure work the same way: year by year they show nothing, yet taken over twenty years they can reshape an entire city.',
        vi: 'Biến đổi xã hội không phải một khối liền, nó có phần nhanh và có phần chậm. Công nghệ thay nhanh nhất, vài năm đã là một thế hệ; cách làm việc theo sau; còn quan niệm và thói quen đổi chậm nhất, thường phải đợi một thế hệ lớn lên mới thấy được. Rắc rối nằm chính ở đó: công nghệ đã chạy lên trước, còn quy tắc và quan niệm vẫn ở lại phía sau, khoảng cách hở ra ở giữa chính là nơi sinh ra đủ thứ vấn đề. Vì vậy chỉ nhìn tốc độ công nghệ để đánh giá sự thay đổi của một xã hội thì dễ rút ra kết luận quá lạc quan. Điều thật sự đáng quan sát là phần chậm có theo kịp hay không. Biến đổi cơ cấu dân số cũng vậy, từng năm một thì chẳng thấy gì, nhưng gộp hai mươi năm lại có thể làm đổi cả diện mạo một thành phố.',
        questions: [
          { q: '短文说社会变化中哪一部分最慢？', qPinyin: 'Duǎn wén shuō shè huì biàn huà zhōng nǎ yí bù fen zuì màn?',
            qEn: 'Which part of social change is slowest?', qVi: 'Bài đọc nói phần nào của biến đổi xã hội là chậm nhất?',
            options: [['观念和习惯', 'quan niệm và thói quen'], ['技术', 'công nghệ'], ['工作的方式', 'cách làm việc']], correct: 0,
            explEn: '观念和习惯改得最慢，常常要等一代人长大才看得出来.', explVi: '观念和习惯改得最慢，常常要等一代人长大才看得出来.' },
          { q: '按短文的说法，问题产生在什么地方？', qPinyin: 'Àn duǎn wén de shuō fǎ, wèn tí chǎn shēng zài shén me dì fang?',
            qEn: 'Where does the text say problems are produced?', qVi: 'Theo bài đọc, vấn đề nảy sinh ở đâu?',
            options: [['khoảng cách giữa công nghệ đi trước và quan niệm còn ở phía sau', 'khoảng trống giữa công nghệ đi trước và quan niệm đứng yên'], ['农村和城市之间', 'giữa nông thôn và thành thị'], ['人口的数量', 'số lượng dân số']], correct: 0,
            explEn: '中间那段空白就是各种问题产生的地方.', explVi: '中间那段空白就是各种问题产生的地方.' },
          { q: '为什么只看技术速度会太乐观？', qPinyin: 'Wèi shén me zhǐ kàn jì shù sù dù huì tài lè guān?',
            qEn: 'Why is judging by technology alone too optimistic?', qVi: 'Vì sao chỉ nhìn tốc độ công nghệ thì quá lạc quan?',
            options: [['因为没看慢的那部分有没有跟上来', 'vì chưa xem phần chậm có theo kịp không'], ['因为技术其实变得很慢', 'vì công nghệ thật ra đổi rất chậm'], ['因为城市比农村快', 'vì thành thị nhanh hơn nông thôn']], correct: 0,
            explEn: '真正值得观察的，是慢的那部分有没有跟上来.', explVi: '真正值得观察的，是慢的那部分有没有跟上来.' }
        ]
      },
      {
        titleZh: '平均数看不见的人',
        titleEn: 'The people an average hides',
        titleVi: 'Những người con số trung bình không thấy',
        zh: '判断社会有没有进步的时候，人们习惯用平均数：平均收入、平均寿命、平均受教育年数。平均数方便，可是它有一个毛病——它把差距藏了起来。同样的平均收入，可能是大家都过得不错，也可能是少数人很高、多数人很低。所以除了平均数，还要看两头：最好的那部分和最差的那部分之间隔多远，这几年是拉大了还是缩小了。更细一点的做法是分群体去看：城市和农村分开，不同年龄分开，男女分开。分得越细，越容易发现哪一个群体被留在了后面。一项改革如果只提高了平均数，却让某个群体的生活更难，那它是变化，还不是进步。',
        en: 'In judging whether society has progressed, people habitually reach for averages: average income, average life expectancy, average years of schooling. Averages are convenient, but they have one flaw — they hide disparity. The same average income may mean everyone is doing reasonably well, or that a few are very high and most are very low. So besides the average one must look at both ends: how far apart the best-off and worst-off are, and whether that distance has widened or narrowed in recent years. A finer approach is to look by group: city and countryside separately, age bands separately, men and women separately. The finer the division, the easier it is to see which group has been left behind. A reform that raises only the average while making some group\'s life harder is change, but not yet progress.',
        vi: 'Khi đánh giá xã hội có tiến bộ hay không, người ta quen dùng số trung bình: thu nhập trung bình, tuổi thọ trung bình, số năm đi học trung bình. Số trung bình tiện lợi, nhưng nó có một tật — nó giấu đi khoảng cách. Cùng một mức thu nhập trung bình, có thể là mọi người đều sống khá, cũng có thể là số ít rất cao còn đa số rất thấp. Vì vậy ngoài số trung bình còn phải nhìn hai đầu: nhóm khá nhất và nhóm kém nhất cách nhau bao xa, mấy năm nay khoảng cách ấy giãn ra hay hẹp lại. Cách làm kỹ hơn là xem theo từng nhóm: thành thị và nông thôn tách riêng, các độ tuổi tách riêng, nam nữ tách riêng. Chia càng nhỏ càng dễ phát hiện nhóm nào đã bị bỏ lại phía sau. Một cuộc cải cách nếu chỉ nâng được số trung bình mà khiến đời sống của một nhóm nào đó khó khăn hơn thì đó là thay đổi, chứ chưa phải tiến bộ.',
        questions: [
          { q: '短文认为平均数的毛病是什么？', qPinyin: 'Duǎn wén rèn wéi píng jūn shù de máo bìng shì shén me?',
            qEn: 'What flaw does the text find in averages?', qVi: 'Bài đọc cho rằng số trung bình có tật gì?',
            options: [['它把差距藏了起来', 'nó giấu đi khoảng cách'], ['它算起来太麻烦', 'nó tính toán quá phiền'], ['它只能用在城市', 'nó chỉ dùng được ở thành thị']], correct: 0,
            explEn: '它有一个毛病——它把差距藏了起来.', explVi: '它有一个毛病——它把差距藏了起来.' },
          { q: '短文建议用什么办法发现被留在后面的群体？', qPinyin: 'Duǎn wén jiàn yì yòng shén me bàn fǎ fā xiàn bèi liú zài hòu miàn de qún tǐ?',
            qEn: 'How does the text suggest finding the group left behind?', qVi: 'Bài đọc khuyên dùng cách nào để phát hiện nhóm bị bỏ lại?',
            options: [['分群体去看，分得越细越容易发现', 'xem theo từng nhóm, chia càng nhỏ càng dễ phát hiện'], ['多算几次平均数', 'tính số trung bình thêm vài lần'], ['只看最好的那部分', 'chỉ nhìn nhóm khá nhất']], correct: 0,
            explEn: '更细一点的做法是分群体去看……分得越细，越容易发现哪一个群体被留在了后面.', explVi: '更细一点的做法是分群体去看……分得越细，越容易发现哪一个群体被留在了后面.' },
          { q: '什么样的改革在短文里只算"变化"？', qPinyin: 'Shén me yàng de gǎi gé zài duǎn wén lǐ zhǐ suàn "biàn huà"?',
            qEn: 'What kind of reform counts only as change?', qVi: 'Cải cách kiểu nào trong bài chỉ được coi là "thay đổi"?',
            options: [['只提高平均数却让某个群体更难', 'chỉ nâng số trung bình mà khiến một nhóm khó khăn hơn'], ['速度太慢的改革', 'cải cách quá chậm'], ['农村先做的改革', 'cải cách làm ở nông thôn trước']], correct: 0,
            explEn: '一项改革如果只提高了平均数，却让某个群体的生活更难，那它是变化，还不是进步.', explVi: '一项改革如果只提高了平均数，却让某个群体的生活更难，那它是变化，还不是进步.' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '___是变化快的时候，人们___想保留熟悉的东西。', pinyin: '___ shì biàn huà kuài de shí hou, rén men ___ xiǎng bǎo liú shú xī de dōng xi.',
        options: [['越……越', 'càng… càng'], ['虽然……但是', 'tuy… nhưng'], ['因为……所以', 'vì… nên'], ['不但……而且', 'không những… mà còn']], correct: 0,
        explEn: 'Two things rise together, so each half takes 越 before the word it scales.', explVi: 'Hai vế cùng tăng theo nhau nên mỗi vế dùng 越 đứng trước từ mà nó làm tăng.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '不是所有传统都___保留。', pinyin: 'Bú shì suǒ yǒu chuán tǒng dōu ___ bǎo liú.',
        options: [['值得', 'đáng'], ['应该', 'nên'], ['一定', 'nhất định'], ['为了', 'để']], correct: 0,
        explEn: '值得 takes the verb directly and marks that the subject merits the action.', explVi: '值得 đi thẳng với động từ, chỉ ra chủ ngữ xứng đáng với hành động đó.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：那怎么看出一个变化是不是真的进步？ B：___', pinyin: 'A: Nà zěn me kàn chū yí gè biàn huà shì bu shì zhēn de jìn bù? B: ___',
        options: [['看差距有没有变小，也看最普通的那部分人过得怎么样。', 'Xem khoảng cách có hẹp lại không, và xem những người bình thường nhất sống ra sao.'], ['变化的速度越来越快了。', 'Tốc độ thay đổi ngày càng nhanh.'], ['我住在城市里。', 'Mình sống ở thành phố.'], ['农村的空气比较好。', 'Không khí nông thôn khá tốt.']], correct: 0,
        explEn: 'The question asks for a test, so the answer must name what to examine.', explVi: 'Câu hỏi hỏi về tiêu chí, nên câu trả lời phải nêu điều cần xem xét.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，为什么同样的平均收入可能代表完全不同的情况？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèi shén me tóng yàng de píng jūn shōu rù kě néng dài biǎo wán quán bù tóng de qíng kuàng?',
        passage: 2, options: [['可能是大家都不错，也可能少数人很高、多数人很低', 'có thể mọi người đều khá, cũng có thể số ít rất cao còn đa số rất thấp'], ['因为收入每年都在变', 'vì thu nhập năm nào cũng đổi'], ['因为城市不算在里面', 'vì thành thị không được tính vào'], ['因为平均数算错了', 'vì số trung bình tính sai']], correct: 0,
        explEn: '同样的平均收入，可能是大家都过得不错，也可能是少数人很高、多数人很低.', explVi: '同样的平均收入，可能是大家都过得不错，也可能是少数人很高、多数人很低.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，技术变得快就说明整个社会进步得快。', pinyin: 'Gēn jù dì yī piān duǎn wén, jì shù biàn de kuài jiù shuō míng zhěng gè shè huì jìn bù de kuài.',
        isTrue: false, passage: 1,
        explEn: '只看技术的速度去判断一个社会的变化，容易得出太乐观的结论.', explVi: '只看技术的速度去判断一个社会的变化，容易得出太乐观的结论.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '这个 / 趋势 / 值得 / 注意', pinyin: 'zhè ge / qū shì / zhí de / zhù yì',
        answer: '这个趋势值得注意。', answerVi: 'Xu hướng này đáng chú ý.',
        options: [['这个', 'này'], ['趋势', 'xu hướng'], ['值得', 'đáng'], ['注意', 'chú ý']],
        explEn: '值得 sits between the subject and the verb it licenses.', explVi: '值得 nằm giữa chủ ngữ và động từ mà nó dẫn ra.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，人口结构的变化为什么不容易看出来？', pinyin: 'Gēn jù dì yī piān duǎn wén, rén kǒu jié gòu de biàn huà wèi shén me bù róng yì kàn chū lai?',
        passage: 1, options: [['一年一年看不出什么，二十年一起看才明显', 'từng năm thì chẳng thấy gì, gộp hai mươi năm mới rõ'], ['因为没有人统计', 'vì không ai thống kê'], ['因为它只发生在农村', 'vì nó chỉ xảy ra ở nông thôn'], ['因为它比技术还快', 'vì nó còn nhanh hơn công nghệ']], correct: 0,
        explEn: '它一年一年看不出什么，二十年一起看却能改变整个城市的样子.', explVi: '它一年一年看不出什么，二十年一起看却能改变整个城市的样子.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，除了平均数还应该看什么才算判断得全面？', pinyin: 'Gēn jù dì èr piān duǎn wén, chú le píng jūn shù hái yīng gāi kàn shén me cái suàn pàn duàn de quán miàn?',
        passage: 2, options: [['两头之间隔多远，以及这几年拉大还是缩小', 'hai đầu cách nhau bao xa, và mấy năm nay giãn ra hay hẹp lại'], ['平均数算了几次', 'số trung bình được tính mấy lần'], ['最好的那部分有多好', 'nhóm khá nhất khá đến đâu'], ['改革花了多少钱', 'cải cách tốn bao nhiêu tiền']], correct: 0,
        explEn: '还要看两头：最好的那部分和最差的那部分之间隔多远，这几年是拉大了还是缩小了.', explVi: '还要看两头：最好的那部分和最差的那部分之间隔多远，这几年是拉大了还是缩小了.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说城市和农村的差距应该怎么看？', pinyin: 'B shuō chéng shì hé nóng cūn de chā jù yīng gāi zěn me kàn?',
        line: 10, options: [['分开看：收入差距在变小，机会差距不一定', 'tách ra mà xem: khoảng cách thu nhập hẹp lại, khoảng cách cơ hội chưa chắc'], ['两个差距都在变小', 'cả hai khoảng cách đều hẹp lại'], ['两个差距都在变大', 'cả hai khoảng cách đều rộng ra'], ['差距已经没有了', 'khoảng cách đã không còn']], correct: 0,
        explEn: 'B says: 要分开看：收入的差距在变小，可是机会的差距不一定.', explVi: 'B nói: 要分开看：收入的差距在变小，可是机会的差距不一定.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为个人面对变化应该怎么做？', pinyin: 'B rèn wéi gè rén miàn duì biàn huà yīng gāi zěn me zuò?',
        line: 14, options: [['一边适应新方式，一边想清楚哪些老办法值得带着走', 'vừa thích nghi cách mới, vừa nghĩ rõ cách cũ nào đáng mang theo'], ['把所有老办法都丢掉', 'vứt bỏ hết mọi cách cũ'], ['完全不用改变', 'hoàn toàn không cần thay đổi'], ['等社会先稳定下来', 'chờ xã hội ổn định trước đã']], correct: 0,
        explEn: 'B says: 一边适应新的方式，一边想清楚哪些老办法值得带着走.', explVi: 'B nói: 一边适应新的方式，一边想清楚哪些老办法值得带着走.' }
    ]
  },

  'hsk5-l05-standard-innovation': {
    titleZh: '创新的条件',
    titleEn: 'What innovation needs',
    titleVi: 'Điều kiện của đổi mới',
    summaryEn: 'Why blame kills innovation, how lowering the cost of an attempt changes what a team dares to try, and where copying stops and a real breakthrough starts.',
    summaryVi: 'Vì sao truy trách nhiệm giết chết đổi mới, hạ chi phí một lần thử làm thay đổi điều nhóm dám làm ra sao, và mô phỏng dừng ở đâu để thành đột phá thật sự.',
    lines: [
      ['A', '可是公司里出了错，常常先找是谁的责任。', 'Kě shì gōng sī lǐ chū le cuò, cháng cháng xiān zhǎo shì shéi de zé rèn.',
        'But when something goes wrong at a company, the first move is usually to find whose fault it is.',
        'Nhưng trong công ty hễ có sai sót là thường đi tìm trách nhiệm của ai trước.'],
      ['B', '那大家就只会做安全的事，创新自然就没有了。', 'Nà dà jiā jiù zhǐ huì zuò ān quán de shì, chuàng xīn zì rán jiù méi yǒu le.',
        'Then everyone only does the safe thing, and innovation naturally disappears.',
        'Vậy thì ai cũng chỉ làm việc an toàn, đổi mới tự nhiên biến mất.'],
      ['A', '那怎么让失败变得没那么可怕？', 'Nà zěn me ràng shī bài biàn de méi nà me kě pà?',
        'So how do you make failure less frightening?',
        'Vậy làm sao để thất bại bớt đáng sợ đi?'],
      ['B', '把尝试的成本降下来：先做小的，快点儿知道行不行。', 'Bǎ cháng shì de chéng běn jiàng xià lai: xiān zuò xiǎo de, kuài diǎnr zhī dào xíng bu xíng.',
        'Bring the cost of an attempt down: start small and find out quickly whether it works.',
        'Hạ chi phí của một lần thử xuống: làm cái nhỏ trước, biết sớm là được hay không.'],
      ['A', '模仿别人算不算创新？', 'Mó fǎng bié ren suàn bu suàn chuàng xīn?',
        'Does copying others count as innovation?',
        'Mô phỏng người khác có tính là đổi mới không?'],
      ['B', '先模仿再改进很常见，只是不能一直停在模仿上。', 'Xiān mó fǎng zài gǎi jìn hěn cháng jiàn, zhǐ shì bù néng yì zhí tíng zài mó fǎng shàng.',
        'Copying first and improving after is common; you just cannot stay at the copying stage forever.',
        'Mô phỏng trước rồi cải tiến là rất thường thấy, chỉ là không thể mãi dừng ở mức mô phỏng.'],
      ['A', '那什么时候才算真正的突破？', 'Nà shén me shí hou cái suàn zhēn zhèng de tū pò?',
        'Then when does it count as a real breakthrough?',
        'Vậy khi nào mới được coi là đột phá thật sự?'],
      ['B', '当你解决的不是别人提过的问题，而是别人没看见的问题。', 'Dāng nǐ jiě jué de bú shì bié ren tí guo de wèn tí, ér shì bié ren méi kàn jiàn de wèn tí.',
        'When what you solve is not a problem others have raised, but one others have not seen.',
        'Khi thứ bạn giải quyết không phải vấn đề người khác đã nêu, mà là vấn đề người khác chưa nhìn ra.']
    ],
    vocab: [['创新', 'chuàng xīn'], ['发明', 'fā míng'], ['尝试', 'cháng shì'], ['失败', 'shī bài'], ['经验', 'jīng yàn'],
      ['总结', 'zǒng jié'], ['改进', 'gǎi jìn'], ['效率', 'xiào lǜ'], ['技术', 'jì shù'], ['产品', 'chǎn pǐn'],
      ['资源', 'zī yuán'], ['风险', 'fēng xiǎn'], ['实现', 'shí xiàn'], ['应用', 'yìng yòng'], ['突破', 'tū pò'],
      ['模仿', 'mó fǎng'], ['竞争', 'jìng zhēng'], ['成本', 'chéng běn']],
    grammar: [
      {
        pattern: '不是……，而是……',
        explEn: 'Corrects rather than contrasts: it rejects one description and supplies the right one. Both halves must be the same kind of phrase.',
        explVi: 'Dùng để đính chính chứ không phải đối lập: bác bỏ một cách nói và đưa ra cách đúng. Hai vế phải cùng loại ngữ.',
        examples: [
          ['你解决的不是别人提过的问题，而是别人没看见的问题。', 'Nǐ jiě jué de bú shì bié ren tí guo de wèn tí, ér shì bié ren méi kàn jiàn de wèn tí.', 'What you solve is not a problem others raised but one others did not see.', 'Thứ bạn giải quyết không phải vấn đề người khác đã nêu, mà là vấn đề người khác chưa nhìn ra.'],
          ['创新不是运气，而是习惯。', 'Chuàng xīn bú shì yùn qi, ér shì xí guàn.', 'Innovation is not luck but habit.', 'Đổi mới không phải may mắn mà là thói quen.'],
          ['他要的不是新技术，而是能用的产品。', 'Tā yào de bú shì xīn jì shù, ér shì néng yòng de chǎn pǐn.', 'What he wants is not new technology but a usable product.', 'Thứ anh ấy cần không phải công nghệ mới, mà là sản phẩm dùng được.']
        ]
      },
      {
        pattern: '把 + 宾语 + 动词 + 下来',
        explEn: 'A 把 sentence whose result complement 下来 marks a value coming down or a thing being fixed in place. The object moves before the verb.',
        explVi: 'Câu 把 với bổ ngữ kết quả 下来 chỉ một giá trị giảm xuống hoặc một vật được giữ lại cố định. Tân ngữ chuyển ra trước động từ.',
        examples: [
          ['把尝试的成本降下来。', 'Bǎ cháng shì de chéng běn jiàng xià lai.', 'Bring the cost of an attempt down.', 'Hạ chi phí của một lần thử xuống.'],
          ['先把失败的原因记下来。', 'Xiān bǎ shī bài de yuán yīn jì xià lai.', 'First write down the reasons for the failure.', 'Trước hết ghi lại nguyên nhân thất bại.'],
          ['他们把风险控制下来以后才继续。', 'Tā men bǎ fēng xiǎn kòng zhì xià lai yǐ hòu cái jì xù.', 'They only continued after bringing the risk down.', 'Họ khống chế được rủi ro rồi mới tiếp tục.']
        ]
      },
      {
        pattern: '……才算……',
        explEn: 'Sets the threshold a thing must reach before the label applies. 才 marks "only then", and 算 supplies the label being withheld until then.',
        explVi: 'Đặt ngưỡng mà sự việc phải đạt tới thì nhãn mới được gán. 才 chỉ "mới", còn 算 nêu nhãn bị giữ lại cho đến lúc đó.',
        examples: [
          ['什么时候才算真正的突破？', 'Shén me shí hou cái suàn zhēn zhèng de tū pò?', 'When does it count as a real breakthrough?', 'Khi nào mới được coi là đột phá thật sự?'],
          ['用得上的技术才算好技术。', 'Yòng de shàng de jì shù cái suàn hǎo jì shù.', 'Only technology you can actually use counts as good technology.', 'Công nghệ dùng được mới là công nghệ tốt.'],
          ['总结出经验，这次失败才算没白费。', 'Zǒng jié chū jīng yàn, zhè cì shī bài cái suàn méi bái fèi.', 'Only if lessons are drawn does this failure count as not wasted.', 'Rút được kinh nghiệm thì lần thất bại này mới coi là không uổng.']
        ]
      }
    ],
    passages: [
      {
        titleZh: '先找问题，再找办法',
        titleEn: 'Find the problem before the method',
        titleVi: 'Tìm vấn đề trước, tìm cách sau',
        zh: '很多团队一开始就讨论"我们要做个什么新产品"，结果做出来的东西很新，却没有人需要。更可靠的顺序正好相反：先去看真实的情况，找出一个具体的、有人天天遇到的问题，再想用什么技术去解决它。技术在这里是工具，不是目的。判断问题找得对不对，有一个简单的办法：把它说给做这件事的人听，如果对方马上说"对，就是这个"，那就找对了；如果对方要想半天才明白你在说什么，那很可能是你自己想出来的问题。真正值得投入资源的创新，几乎都是从别人的抱怨开始的，而不是从会议室里开始的。',
        en: 'Many teams start by discussing "what new product should we make", and end up with something novel that nobody needs. A more reliable order is exactly the opposite: go and look at the real situation, identify one concrete problem that somebody runs into every day, and only then ask what technology could solve it. Technology here is a tool, not the goal. There is a simple test of whether the problem has been identified correctly: describe it to the people who actually do the work. If they immediately say "yes, exactly that", you have it right; if they have to think for a long while before grasping what you mean, the problem is very likely one you invented yourself. Innovation worth putting resources into almost always starts from somebody\'s complaint, not from a meeting room.',
        vi: 'Nhiều nhóm vừa bắt đầu đã bàn "chúng ta làm sản phẩm mới gì đây", kết quả làm ra thứ rất mới mà chẳng ai cần. Trình tự đáng tin hơn thì đúng ngược lại: trước hết đi xem tình hình thực tế, tìm ra một vấn đề cụ thể mà có người gặp phải hằng ngày, rồi mới nghĩ dùng công nghệ nào để giải quyết. Ở đây công nghệ là công cụ, không phải mục đích. Muốn biết vấn đề có được xác định đúng không, có một cách đơn giản: kể nó cho những người trực tiếp làm việc đó nghe. Nếu họ lập tức nói "đúng, chính là cái này" thì bạn đã tìm đúng; còn nếu họ phải nghĩ hồi lâu mới hiểu bạn đang nói gì thì rất có thể đó là vấn đề do chính bạn tưởng tượng ra. Những đổi mới đáng đầu tư nguồn lực gần như đều bắt đầu từ lời phàn nàn của người khác, chứ không phải từ phòng họp.',
        questions: [
          { q: '短文认为正确的顺序是什么？', qPinyin: 'Duǎn wén rèn wéi zhèng què de shùn xù shì shén me?',
            qEn: 'What order does the text recommend?', qVi: 'Bài đọc cho rằng trình tự đúng là gì?',
            options: [['先找具体问题，再想用什么技术解决', 'tìm vấn đề cụ thể trước, rồi nghĩ dùng công nghệ nào'], ['先想做什么新产品', 'nghĩ làm sản phẩm mới gì trước'], ['先买最新的技术', 'mua công nghệ mới nhất trước']], correct: 0,
            explEn: '先去看真实的场景，找出一个具体的……问题，再想用什么技术去解决它.', explVi: '先去看真实的场景，找出一个具体的……问题，再想用什么技术去解决它.' },
          { q: '怎么检验问题找得对不对？', qPinyin: 'Zěn me jiǎn yàn wèn tí zhǎo de duì bu duì?',
            qEn: 'How can you test whether the problem is right?', qVi: 'Kiểm tra vấn đề tìm có đúng không bằng cách nào?',
            options: [['说给做这件事的人听，看他是不是马上说"就是这个"', 'kể cho người trực tiếp làm nghe, xem họ có lập tức nói "chính là cái này" không'], ['问公司的领导', 'hỏi lãnh đạo công ty'], ['看竞争对手做了没有', 'xem đối thủ đã làm chưa']], correct: 0,
            explEn: '把它说给做这件事的人听，如果对方马上说"对，就是这个"，那就找对了.', explVi: '把它说给做这件事的人听，如果对方马上说"对，就是这个"，那就找对了.' },
          { q: '短文说值得投入资源的创新从哪里开始？', qPinyin: 'Duǎn wén shuō zhí de tóu rù zī yuán de chuàng xīn cóng nǎ lǐ kāi shǐ?',
            qEn: 'Where does worthwhile innovation start?', qVi: 'Bài đọc nói đổi mới đáng đầu tư bắt đầu từ đâu?',
            options: [['从别人的抱怨开始', 'từ lời phàn nàn của người khác'], ['从会议室开始', 'từ phòng họp'], ['从新技术开始', 'từ công nghệ mới']], correct: 0,
            explEn: '几乎都是从别人的抱怨开始的，而不是从会议室里开始的.', explVi: '几乎都是从别人的抱怨开始的，而不是从会议室里开始的.' }
        ]
      },
      {
        titleZh: '让失败便宜一点',
        titleEn: 'Making failure cheap',
        titleVi: 'Làm cho thất bại rẻ đi',
        zh: '一个团队敢不敢尝试，往往不在于成员有多大胆量，而在于一次失败要付多大代价。如果每个想法都要做半年、花掉很多钱才知道结果，那谁都不愿意第一个提。所以聪明的做法是把每次尝试切小：一周能做完的小东西，先给十个用户用；不行就停，行就再往前走一步。成本降下来以后，失败就不是事故，而是一次便宜的实验。还有一点同样重要：失败之后要总结的是过程，不是人。会议上该问的是"我们哪一步的判断错了"，而不是"这件事该谁负责"。前一个问题让经验留在团队里，后一个问题只让大家不敢再举手。',
        en: 'Whether a team dares to experiment usually lies not in how bold its members are but in the price of a single failure. If every idea takes half a year and a lot of money before the result is known, nobody wants to be the first to propose it. The smart move is therefore to cut each attempt small: something small that can be built in a week, put in front of ten users; if it fails, stop, and if it works, take one more step. Once the cost has come down, failure is not an accident but a cheap experiment. One more thing matters as much: what gets reviewed after a failure should be the process, not the person. The question to ask in the meeting is "which step did our judgement go wrong at", not "who is responsible for this". The first question keeps the lesson inside the team; the second only leaves everyone afraid to raise a hand again.',
        vi: 'Một nhóm có dám thử hay không thường không nằm ở chỗ thành viên gan dạ đến đâu, mà ở cái giá phải trả cho một lần thất bại. Nếu mỗi ý tưởng đều phải làm nửa năm, tiêu rất nhiều tiền mới biết kết quả thì chẳng ai muốn là người đề xuất đầu tiên. Vì vậy cách làm khôn ngoan là cắt nhỏ từng lần thử: một thứ nhỏ làm xong trong một tuần, đưa cho mười người dùng trước; không được thì dừng, được thì đi tiếp một bước. Khi chi phí đã hạ xuống, thất bại không phải là sự cố mà là một thí nghiệm rẻ tiền. Còn một điểm cũng quan trọng như vậy: sau thất bại, thứ cần tổng kết là quy trình chứ không phải con người. Trong cuộc họp nên hỏi "chúng ta phán đoán sai ở bước nào", chứ không phải "việc này ai phải chịu trách nhiệm". Câu hỏi trước giữ kinh nghiệm lại trong nhóm, câu hỏi sau chỉ khiến mọi người không dám giơ tay nữa.',
        questions: [
          { q: '短文说敢不敢尝试主要在于什么？', qPinyin: 'Duǎn wén shuō gǎn bu gǎn cháng shì zhǔ yào zài yú shén me?',
            qEn: 'What decides whether a team dares to experiment?', qVi: 'Bài đọc nói dám thử hay không chủ yếu phụ thuộc vào gì?',
            options: [['一次失败要付多大代价', 'cái giá phải trả cho một lần thất bại'], ['成员有多大胆量', 'thành viên gan dạ đến đâu'], ['公司有多少人', 'công ty có bao nhiêu người']], correct: 0,
            explEn: '往往不在于成员有多大胆量，而在于一次失败要付多大代价.', explVi: '往往不在于成员有多大胆量，而在于一次失败要付多大代价.' },
          { q: '"把尝试切小"具体指什么做法？', qPinyin: '"Bǎ cháng shì qiē xiǎo" jù tǐ zhǐ shén me zuò fǎ?',
            qEn: 'What does cutting an attempt small mean concretely?', qVi: '"Cắt nhỏ lần thử" cụ thể là làm gì?',
            options: [['一周能做完的小东西，先给十个用户用', 'thứ nhỏ làm xong trong một tuần, đưa cho mười người dùng trước'], ['把团队分成几个小组', 'chia nhóm thành mấy tổ nhỏ'], ['把钱分成两半', 'chia tiền làm đôi']], correct: 0,
            explEn: '一周能做完的小东西，先给十个用户用；不行就停，行就再往前走一步.', explVi: '一周能做完的小东西，先给十个用户用；不行就停，行就再往前走一步.' },
          { q: '失败以后该问哪个问题？', qPinyin: 'Shī bài yǐ hòu gāi wèn nǎ ge wèn tí?',
            qEn: 'Which question should follow a failure?', qVi: 'Sau thất bại nên hỏi câu nào?',
            options: [['我们哪一步的判断错了', 'chúng ta phán đoán sai ở bước nào'], ['这件事该谁负责', 'việc này ai phải chịu trách nhiệm'], ['下次能不能不做', 'lần sau có thể không làm không']], correct: 0,
            explEn: '会议上该问的是"我们哪一步的判断错了"，而不是"这件事该谁负责".', explVi: '会议上该问的是"我们哪一步的判断错了"，而不是"这件事该谁负责".' }
        ]
      }
    ],
    exercises: [
      { kind: 'fillBlank', bloom: 'apply', prompt: '创新不是运气，___习惯。', pinyin: 'Chuàng xīn bú shì yùn qi, ___ xí guàn.',
        options: [['而是', 'mà là'], ['可是', 'nhưng'], ['还是', 'hay là'], ['就是', 'chính là']], correct: 0,
        explEn: '不是……而是…… replaces a wrong description with the right one.', explVi: '不是……而是…… thay một cách nói sai bằng cách nói đúng.' },
      { kind: 'fillBlank', bloom: 'apply', prompt: '把尝试的成本___。', pinyin: 'Bǎ cháng shì de chéng běn ___.',
        options: [['降下来', 'hạ xuống'], ['降着', 'đang hạ'], ['降过没有', 'từng hạ chưa'], ['很低', 'rất thấp']], correct: 0,
        explEn: 'A 把 sentence needs a result after the verb; 下来 marks the value coming down.', explVi: 'Câu 把 cần bổ ngữ kết quả sau động từ; 下来 chỉ giá trị hạ xuống.' },
      { kind: 'multipleChoice', bloom: 'understand', prompt: 'A：模仿别人算不算创新？ B：___', pinyin: 'A: Mó fǎng bié ren suàn bu suàn chuàng xīn? B: ___',
        options: [['先模仿再改进很常见，只是不能一直停在模仿上。', 'Mô phỏng trước rồi cải tiến rất thường thấy, chỉ là không thể mãi dừng ở mô phỏng.'], ['我们公司很大。', 'Công ty chúng tôi rất lớn.'], ['成本一直在涨。', 'Chi phí cứ tăng mãi.'], ['明天再说吧。', 'Mai hãy nói.']], correct: 0,
        explEn: 'The question asks whether copying qualifies, so the answer must place it on that scale.', explVi: 'Câu hỏi hỏi mô phỏng có tính không, nên câu trả lời phải xếp nó vào thang đó.' },
      { kind: 'multipleChoice', bloom: 'analyze', prompt: '根据第二篇短文，问"这件事该谁负责"会带来什么结果？', pinyin: 'Gēn jù dì èr piān duǎn wén, wèn "zhè jiàn shì gāi shéi fù zé" huì dài lái shén me jié guǒ?',
        passage: 2, options: [['让大家不敢再举手', 'khiến mọi người không dám giơ tay nữa'], ['让经验留在团队里', 'giữ kinh nghiệm lại trong nhóm'], ['让成本降下来', 'làm chi phí hạ xuống'], ['让产品更快做出来', 'làm sản phẩm ra nhanh hơn']], correct: 0,
        explEn: '后一个问题只让大家不敢再举手.', explVi: '后一个问题只让大家不敢再举手.' },
      { kind: 'trueFalse', bloom: 'evaluate', prompt: '根据第一篇短文，创新应该从"我们要做个什么新产品"这个问题开始。', pinyin: 'Gēn jù dì yī piān duǎn wén, chuàng xīn yīng gāi cóng "wǒ men yào zuò ge shén me xīn chǎn pǐn" zhè ge wèn tí kāi shǐ.',
        isTrue: false, passage: 1,
        explEn: '结果做出来的东西很新，却没有人需要……更可靠的顺序是反过来的.', explVi: '结果做出来的东西很新，却没有人需要……更可靠的顺序是反过来的.' },
      { kind: 'arrangeSentence', bloom: 'create', prompt: '用得上的 / 技术 / 才 / 算 / 好技术', pinyin: 'yòng de shàng de / jì shù / cái / suàn / hǎo jì shù',
        answer: '用得上的技术才算好技术。', answerVi: 'Công nghệ dùng được mới là công nghệ tốt.',
        options: [['用得上的', 'dùng được'], ['技术', 'công nghệ'], ['才', 'mới'], ['算', 'được coi là'], ['好技术', 'công nghệ tốt']],
        explEn: '才 stands before 算, and the condition that must be met comes first.', explVi: '才 đứng trước 算, điều kiện phải đạt được nêu ở đầu câu.' },
      { kind: 'readingComprehension', bloom: 'analyze', prompt: '根据第一篇短文，为什么说技术是工具不是目的？', pinyin: 'Gēn jù dì yī piān duǎn wén, wèi shén me shuō jì shù shì gōng jù bú shì mù dì?',
        passage: 1, options: [['因为要先有具体的问题，技术才有用武之地', 'vì phải có vấn đề cụ thể trước thì công nghệ mới có đất dùng'], ['因为技术很便宜', 'vì công nghệ rất rẻ'], ['因为技术变化太快', 'vì công nghệ đổi quá nhanh'], ['因为用户不懂技术', 'vì người dùng không hiểu công nghệ']], correct: 0,
        explEn: '找出……问题，再想用什么技术去解决它。技术在这里是工具，不是目的.', explVi: '找出……问题，再想用什么技术去解决它。技术在这里是工具，不是目的.' },
      { kind: 'readingComprehension', bloom: 'evaluate', prompt: '根据第二篇短文，成本降下来以后失败的意义有什么变化？', pinyin: 'Gēn jù dì èr piān duǎn wén, chéng běn jiàng xià lai yǐ hòu shī bài de yì yì yǒu shén me biàn huà?',
        passage: 2, options: [['不是事故，而是一次便宜的实验', 'không phải sự cố mà là một thí nghiệm rẻ tiền'], ['失败会完全消失', 'thất bại sẽ biến mất hoàn toàn'], ['失败变得更严重', 'thất bại trở nên nghiêm trọng hơn'], ['没有人再需要总结', 'không ai cần tổng kết nữa']], correct: 0,
        explEn: '成本降下来以后，失败就不是事故，而是一次便宜的实验.', explVi: '成本降下来以后，失败就不是事故，而是一次便宜的实验.' },
      { kind: 'listeningComprehension', bloom: 'analyze', prompt: 'B说先找责任会造成什么后果？', pinyin: 'B shuō xiān zhǎo zé rèn huì zào chéng shén me hòu guǒ?',
        line: 8, options: [['大家只会做安全的事，创新就没有了', 'ai cũng chỉ làm việc an toàn, đổi mới không còn'], ['大家更愿意尝试', 'mọi người càng muốn thử'], ['成本会降下来', 'chi phí sẽ hạ xuống'], ['产品会更快', 'sản phẩm sẽ nhanh hơn']], correct: 0,
        explEn: 'B says: 那大家就只会做安全的事，创新自然就没有了.', explVi: 'B nói: 那大家就只会做安全的事，创新自然就没有了.' },
      { kind: 'listeningComprehension', bloom: 'evaluate', prompt: 'B认为什么时候才算真正的突破？', pinyin: 'B rèn wéi shén me shí hou cái suàn zhēn zhèng de tū pò?',
        line: 14, options: [['解决的是别人没看见的问题', 'giải quyết vấn đề người khác chưa nhìn ra'], ['解决的是别人提过的问题', 'giải quyết vấn đề người khác đã nêu'], ['产品卖得最好的时候', 'khi sản phẩm bán chạy nhất'], ['成本最低的时候', 'khi chi phí thấp nhất']], correct: 0,
        explEn: 'B says: 当你解决的不是别人提过的问题，而是别人没看见的问题.', explVi: 'B nói: 当你解决的不是别人提过的问题，而是别人没看见的问题.' }
    ]
  }
};
