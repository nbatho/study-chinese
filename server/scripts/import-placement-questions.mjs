import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const questions = [
  {
    id: 'placement_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'A1',
    prompt: '你好 means...',
    promptHanzi: '你好',
    promptPinyin: 'ni hao',
    options: ['hello', 'goodbye', 'teacher', 'airport'],
    correctIndex: 0,
    correctText: 'hello',
    explanation: '你好 is the common greeting for hello.',
    difficulty: 1,
    order: 10
  },
  {
    id: 'placement_vocab_02',
    section: 'vocabulary',
    cefrLevel: 'A1',
    prompt: '谢谢 means...',
    promptHanzi: '谢谢',
    promptPinyin: 'xie xie',
    options: ['thank you', 'sorry', 'water', 'student'],
    correctIndex: 0,
    correctText: 'thank you',
    explanation: '谢谢 is used to say thank you.',
    difficulty: 1,
    order: 20
  },
  {
    id: 'placement_vocab_03',
    section: 'vocabulary',
    cefrLevel: 'A1',
    prompt: '三 means...',
    promptHanzi: '三',
    promptPinyin: 'san',
    options: ['three', 'five', 'ten', 'one'],
    correctIndex: 0,
    correctText: 'three',
    explanation: '三 is the number three.',
    difficulty: 1,
    order: 30
  },
  {
    id: 'placement_vocab_04',
    section: 'vocabulary',
    cefrLevel: 'A2',
    prompt: '地铁 means...',
    promptHanzi: '地铁',
    promptPinyin: 'di tie',
    options: ['subway', 'airport', 'library', 'contract'],
    correctIndex: 0,
    correctText: 'subway',
    explanation: '地铁 means subway or metro.',
    difficulty: 2,
    order: 40
  },
  {
    id: 'placement_vocab_05',
    section: 'vocabulary',
    cefrLevel: 'A2',
    prompt: '机场 means...',
    promptHanzi: '机场',
    promptPinyin: 'ji chang',
    options: ['airport', 'school', 'apple', 'meeting'],
    correctIndex: 0,
    correctText: 'airport',
    explanation: '机场 means airport.',
    difficulty: 2,
    order: 50
  },
  {
    id: 'placement_vocab_06',
    section: 'vocabulary',
    cefrLevel: 'B1',
    prompt: '建议 means...',
    promptHanzi: '建议',
    promptPinyin: 'jian yi',
    options: ['to suggest', 'to forget', 'expensive', 'history'],
    correctIndex: 0,
    correctText: 'to suggest',
    explanation: '建议 means to suggest or suggestion.',
    difficulty: 3,
    order: 60
  },
  {
    id: 'placement_vocab_07',
    section: 'vocabulary',
    cefrLevel: 'B1',
    prompt: '经验 means...',
    promptHanzi: '经验',
    promptPinyin: 'jing yan',
    options: ['experience', 'opportunity', 'homework', 'culture'],
    correctIndex: 0,
    correctText: 'experience',
    explanation: '经验 means experience.',
    difficulty: 3,
    order: 70
  },
  {
    id: 'placement_grammar_01',
    section: 'grammar',
    cefrLevel: 'A1',
    prompt: 'Choose the word: 我___学生。',
    promptHanzi: '我是学生。',
    promptPinyin: 'wo shi xue sheng',
    options: ['是', '了', '比', '吧'],
    correctIndex: 0,
    correctText: '是',
    explanation: '是 links the subject with a noun.',
    difficulty: 1,
    order: 80
  },
  {
    id: 'placement_grammar_02',
    section: 'grammar',
    cefrLevel: 'A1',
    prompt: 'Choose the word: 你叫什么___？',
    promptHanzi: '你叫什么名字？',
    promptPinyin: 'ni jiao shenme mingzi',
    options: ['名字', '学生', '地铁', '合同'],
    correctIndex: 0,
    correctText: '名字',
    explanation: '名字 means name.',
    difficulty: 1,
    order: 90
  },
  {
    id: 'placement_grammar_03',
    section: 'grammar',
    cefrLevel: 'A2',
    prompt: 'Choose the completed-action marker: 我吃___苹果。',
    promptHanzi: '我吃了苹果。',
    promptPinyin: 'wo chi le pingguo',
    options: ['了', '吗', '比', '在'],
    correctIndex: 0,
    correctText: '了',
    explanation: '了 can mark a completed action.',
    difficulty: 2,
    order: 100
  },
  {
    id: 'placement_grammar_04',
    section: 'grammar',
    cefrLevel: 'A2',
    prompt: 'Choose the word: 请问地铁站___走？',
    promptHanzi: '请问地铁站怎么走？',
    promptPinyin: 'qingwen ditie zhan zenme zou',
    options: ['怎么', '多少', '什么', '哪里'],
    correctIndex: 0,
    correctText: '怎么',
    explanation: '怎么 asks how to do something.',
    difficulty: 2,
    order: 110
  },
  {
    id: 'placement_grammar_05',
    section: 'grammar',
    cefrLevel: 'B1',
    prompt: 'Choose the suggestion particle: 我们去图书馆___。',
    promptHanzi: '我们去图书馆吧。',
    promptPinyin: 'women qu tushuguan ba',
    options: ['吧', '了', '比', '是'],
    correctIndex: 0,
    correctText: '吧',
    explanation: '吧 softens a sentence into a suggestion.',
    difficulty: 3,
    order: 120
  },
  {
    id: 'placement_grammar_06',
    section: 'grammar',
    cefrLevel: 'B1',
    prompt: 'Choose the comparison word: 今天___昨天冷。',
    promptHanzi: '今天比昨天冷。',
    promptPinyin: 'jintian bi zuotian leng',
    options: ['比', '吧', '了', '叫'],
    correctIndex: 0,
    correctText: '比',
    explanation: '比 compares two things.',
    difficulty: 3,
    order: 130
  },
  {
    id: 'placement_grammar_07',
    section: 'grammar',
    cefrLevel: 'B1',
    prompt: 'Choose the opinion verb: 我___中文很有意思。',
    promptHanzi: '我觉得中文很有意思。',
    promptPinyin: 'wo juede zhongwen hen you yisi',
    options: ['觉得', '帮助', '决定', '练习'],
    correctIndex: 0,
    correctText: '觉得',
    explanation: '觉得 introduces an opinion or feeling.',
    difficulty: 3,
    order: 140
  },
  {
    id: 'placement_reading_01',
    section: 'reading',
    cefrLevel: 'A1',
    prompt: '我叫安娜。我是学生。 Who is Anna?',
    promptHanzi: '我叫安娜。我是学生。',
    promptPinyin: 'wo jiao Anna. wo shi xue sheng',
    options: ['a student', 'a teacher', 'a doctor', 'a driver'],
    correctIndex: 0,
    correctText: 'a student',
    explanation: 'The passage says 我是学生.',
    difficulty: 1,
    order: 150
  },
  {
    id: 'placement_reading_02',
    section: 'reading',
    cefrLevel: 'A1',
    prompt: '今天早上我喝了茶。 What did the speaker drink?',
    promptHanzi: '今天早上我喝了茶。',
    promptPinyin: 'jintian zaoshang wo he le cha',
    options: ['tea', 'coffee', 'water', 'juice'],
    correctIndex: 0,
    correctText: 'tea',
    explanation: '茶 means tea.',
    difficulty: 1,
    order: 160
  },
  {
    id: 'placement_reading_03',
    section: 'reading',
    cefrLevel: 'A2',
    prompt: '请问，去地铁站怎么走？直走然后左转。 What is the direction?',
    promptHanzi: '请问，去地铁站怎么走？直走然后左转。',
    promptPinyin: 'qingwen, qu ditie zhan zenme zou? zhi zou ranhou zuo zhuan',
    options: ['go straight then turn left', 'turn right immediately', 'take a taxi', 'go to the airport'],
    correctIndex: 0,
    correctText: 'go straight then turn left',
    explanation: '直走然后左转 means go straight, then turn left.',
    difficulty: 2,
    order: 170
  },
  {
    id: 'placement_reading_04',
    section: 'reading',
    cefrLevel: 'A2',
    prompt: '这个苹果三十块，我买两个。 How much is one apple?',
    promptHanzi: '这个苹果三十块，我买两个。',
    promptPinyin: 'zhe ge pingguo sanshi kuai, wo mai liang ge',
    options: ['30 kuai', '2 kuai', '13 kuai', '20 kuai'],
    correctIndex: 0,
    correctText: '30 kuai',
    explanation: '三十块 means 30 kuai.',
    difficulty: 2,
    order: 180
  },
  {
    id: 'placement_reading_05',
    section: 'reading',
    cefrLevel: 'B1',
    prompt: '我觉得中文考试有点难，但是很重要。 How does the speaker feel?',
    promptHanzi: '我觉得中文考试有点难，但是很重要。',
    promptPinyin: 'wo juede zhongwen kaoshi youdian nan, danshi hen zhongyao',
    options: ['difficult but important', 'easy and unimportant', 'fun but short', 'expensive but useful'],
    correctIndex: 0,
    correctText: 'difficult but important',
    explanation: '难 means difficult and 重要 means important.',
    difficulty: 3,
    order: 190
  },
  {
    id: 'placement_reading_06',
    section: 'reading',
    cefrLevel: 'B1',
    prompt: '我们讨论一下合同吧，这是一个好机会。 What do they want to discuss?',
    promptHanzi: '我们讨论一下合同吧，这是一个好机会。',
    promptPinyin: 'women taolun yixia hetong ba, zhe shi yi ge hao jihui',
    options: ['contract', 'homework', 'airport', 'history'],
    correctIndex: 0,
    correctText: 'contract',
    explanation: '合同 means contract.',
    difficulty: 3,
    order: 200
  },
  {
    id: 'placement_builtin_b2_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'B2',
    prompt: 'Which option best matches 采取措施?',
    promptHanzi: '采取措施',
    promptPinyin: 'caiqu cuoshi',
    options: ['take measures', 'change seats', 'lose confidence', 'make a reservation'],
    correctIndex: 0,
    correctText: 'take measures',
    explanation: '采取措施 means to take measures or action.',
    difficulty: 4,
    order: 300
  },
  {
    id: 'placement_builtin_b2_grammar_01',
    section: 'grammar',
    cefrLevel: 'B2',
    prompt: 'Choose the structure that means "not only..., but also...".',
    promptHanzi: '他___会说中文，___了解中国文化。',
    promptPinyin: 'ta ___ hui shuo zhongwen, ___ liaojie zhongguo wenhua',
    options: ['不但...而且...', '因为...所以...', '虽然...但是...', '一边...一边...'],
    correctIndex: 0,
    correctText: '不但...而且...',
    explanation: '不但...而且... links two positive facts with emphasis.',
    difficulty: 4,
    order: 310
  },
  {
    id: 'placement_builtin_b2_reading_01',
    section: 'reading',
    cefrLevel: 'B2',
    prompt: '这项政策短期内会增加成本，但从长远来看有助于提高效率。 What is the main idea?',
    promptHanzi: '这项政策短期内会增加成本，但从长远来看有助于提高效率。',
    promptPinyin: 'zhe xiang zhengce duanqi nei hui zengjia chengben, dan cong changyuan lai kan youzhu yu tigao xiaolü',
    options: ['It costs more now but may improve efficiency later', 'It immediately reduces costs', 'It has no effect on efficiency', 'It should be cancelled today'],
    correctIndex: 0,
    correctText: 'It costs more now but may improve efficiency later',
    explanation: '短期内 contrasts with 从长远来看.',
    difficulty: 4,
    order: 320
  },
  {
    id: 'placement_builtin_c1_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'C1',
    prompt: 'Which word is closest in meaning to 阐述?',
    promptHanzi: '阐述',
    promptPinyin: 'chanshu',
    options: ['elaborate on', 'hide from', 'repeat loudly', 'purchase quickly'],
    correctIndex: 0,
    correctText: 'elaborate on',
    explanation: '阐述 means to explain or elaborate a point in detail.',
    difficulty: 5,
    order: 400
  },
  {
    id: 'placement_builtin_c1_grammar_01',
    section: 'grammar',
    cefrLevel: 'C1',
    prompt: 'Choose the most natural completion: 这份报告___数据充分，___结论仍需进一步验证。',
    promptHanzi: '这份报告___数据充分，___结论仍需进一步验证。',
    promptPinyin: 'zhe fen baogao ___ shuju chongfen, ___ jielun reng xu jinyibu yanzheng',
    options: ['尽管...但...', '只要...就...', '与其...不如...', '不是...就是...'],
    correctIndex: 0,
    correctText: '尽管...但...',
    explanation: '尽管...但... introduces concession and contrast.',
    difficulty: 5,
    order: 410
  },
  {
    id: 'placement_builtin_c1_reading_01',
    section: 'reading',
    cefrLevel: 'C1',
    prompt: '他并非反对改革本身，而是担心执行过程中缺乏透明度。 What is his concern?',
    promptHanzi: '他并非反对改革本身，而是担心执行过程中缺乏透明度。',
    promptPinyin: 'ta bingfei fandui gaige benshen, er shi danxin zhixing guocheng zhong quefa toumingdu',
    options: ['the reform process may lack transparency', 'the reform goal is impossible', 'the reform is already complete', 'the reform is too transparent'],
    correctIndex: 0,
    correctText: 'the reform process may lack transparency',
    explanation: '并非...而是... corrects the focus of the concern.',
    difficulty: 5,
    order: 420
  },
  {
    id: 'placement_builtin_c2_vocab_01',
    section: 'vocabulary',
    cefrLevel: 'C2',
    prompt: 'Which interpretation best fits 微妙?',
    promptHanzi: '微妙',
    promptPinyin: 'weimiao',
    options: ['subtle and delicate', 'obvious and simple', 'illegal and public', 'ancient and broken'],
    correctIndex: 0,
    correctText: 'subtle and delicate',
    explanation: '微妙 describes something subtle, delicate, or hard to handle.',
    difficulty: 6,
    order: 500
  },
  {
    id: 'placement_builtin_c2_grammar_01',
    section: 'grammar',
    cefrLevel: 'C2',
    prompt: 'Choose the idiomatic completion: 他的发言看似平淡，实则___。',
    promptHanzi: '他的发言看似平淡，实则___。',
    promptPinyin: 'ta de fayan kansi pingdan, shize ___',
    options: ['意味深长', '乱七八糟', '半途而废', '马马虎虎'],
    correctIndex: 0,
    correctText: '意味深长',
    explanation: '意味深长 means rich in implication or meaning.',
    difficulty: 6,
    order: 510
  },
  {
    id: 'placement_builtin_c2_reading_01',
    section: 'reading',
    cefrLevel: 'C2',
    prompt: '文章表面上是在讨论技术创新，实际上折射出作者对社会公平的深层关切。 What does the sentence imply?',
    promptHanzi: '文章表面上是在讨论技术创新，实际上折射出作者对社会公平的深层关切。',
    promptPinyin: 'wenzhang biaomian shang shi zai taolun jishu chuangxin, shijishang zheshe chu zuozhe dui shehui gongping de shenceng guanqie',
    options: ['The article uses technology to reveal concern about social fairness', 'The article rejects all technology', 'The author only discusses grammar', 'The author avoids social topics'],
    correctIndex: 0,
    correctText: 'The article uses technology to reveal concern about social fairness',
    explanation: '表面上...实际上... signals a deeper implied focus.',
    difficulty: 6,
    order: 520
  }
];

const run = async () => {
  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const question of questions) {
      await client.query(
        `
          INSERT INTO placement_questions (
            id, section, cefr_level, prompt, prompt_hanzi, prompt_pinyin,
            options, correct_index, correct_text, explanation, difficulty, order_num, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, true)
          ON CONFLICT (id)
          DO UPDATE SET
            section = EXCLUDED.section,
            cefr_level = EXCLUDED.cefr_level,
            prompt = EXCLUDED.prompt,
            prompt_hanzi = EXCLUDED.prompt_hanzi,
            prompt_pinyin = EXCLUDED.prompt_pinyin,
            options = EXCLUDED.options,
            correct_index = EXCLUDED.correct_index,
            correct_text = EXCLUDED.correct_text,
            explanation = EXCLUDED.explanation,
            difficulty = EXCLUDED.difficulty,
            order_num = EXCLUDED.order_num,
            is_active = true,
            updated_at = now()
        `,
        [
          question.id,
          question.section,
          question.cefrLevel,
          question.prompt,
          question.promptHanzi,
          question.promptPinyin,
          JSON.stringify(question.options),
          question.correctIndex,
          question.correctText,
          question.explanation,
          question.difficulty,
          question.order
        ]
      );
    }

    const countResult = await client.query(
      `
        SELECT cefr_level, count(*)::int AS count
        FROM placement_questions
        WHERE is_active = true
        GROUP BY cefr_level
        ORDER BY min(order_num)
      `
    );

    await client.query('COMMIT');

    console.log(JSON.stringify({
      importedQuestions: questions.length,
      activeByLevel: countResult.rows
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closeDB();
  }
};

await run();
