// Hand-authored HSK1 lesson content (17 lessons).
// Compact schema consumed by generate-standard-hsk-lessons.mjs:
// vocab: [simplified, pinyin(numbered), pos, en, vi, isNew=true]
// dialogue: [speaker, zh, pinyin(numbered), en, vi]
// grammar examples: [zh, pinyin, en, vi]
// exercises (7 per lesson), tuples by kind:
//   ['fill_blank'|'multiple_choice', bloom, promptZh, promptPy, opts, correctIdx, optsVi, explZh, explVi]
//   ['word_order', bloom, tokens, tokensPy, tokensVi, correctZh, correctVi, explZh, explVi]
//   ['true_false', bloom, statementZh, statementPy, correctBool, explZh, explVi]
//   ['reading_comprehension', bloom, qZh, qPy, opts, correctIdx, optsVi, explZh, explVi]
//   ['listening_comprehension', bloom, lineIdxs, qZh, qPy, opts, correctIdx, optsVi, explZh, explVi]

export default [
  {
    slug: 'greetings',
    titleZh: '问候',
    titleEn: 'Greetings',
    titleVi: 'Chào hỏi',
    summaryEn: 'Wang Xiaoming and Li Yue meet for the first time, greet each other and find out who is a student and who is a teacher.',
    summaryVi: 'Vương Tiểu Minh và Lý Nguyệt gặp nhau lần đầu, chào hỏi và tìm hiểu ai là học sinh, ai là giáo viên.',
    vocab: [
      ['你好', 'ni3 hao3', 'interjection', 'hello', 'xin chào'],
      ['叫', 'jiao4', 'verb', 'to be called (name)', 'tên là, gọi là'],
      ['什么', 'shen2 me5', 'pronoun', 'what', 'gì, cái gì'],
      ['是', 'shi4', 'verb', 'to be', 'là'],
      ['学生', 'xue2 sheng5', 'noun', 'student', 'học sinh'],
      ['老师', 'lao3 shi1', 'noun', 'teacher', 'giáo viên'],
      ['也', 'ye3', 'adverb', 'also, too', 'cũng'],
      ['不', 'bu4', 'adverb', 'not, no', 'không'],
      ['吗', 'ma5', 'particle', 'question particle', 'trợ từ nghi vấn (…không?)'],
      ['再见', 'zai4 jian4', 'interjection', 'goodbye', 'tạm biệt']
    ],
    grammar: [
      {
        pattern: '主语 + 是 + 名词',
        explanation: '用“是”介绍自己或别人；否定说“不是”。',
        explanation_vi: 'Dùng 是 (là) để giới thiệu bản thân hoặc người khác; phủ định dùng 不是 (không phải là).',
        examples: [
          ['我是学生。', 'Wo3 shi4 xue2 sheng5.', 'I am a student.', 'Tôi là học sinh.'],
          ['你是老师。', 'Ni3 shi4 lao3 shi1.', 'You are a teacher.', 'Bạn là giáo viên.'],
          ['我不是老师。', 'Wo3 bu2 shi4 lao3 shi1.', 'I am not a teacher.', 'Tôi không phải là giáo viên.']
        ]
      },
      {
        pattern: '……吗？',
        explanation: '在句子后面加“吗”，就是问题。',
        explanation_vi: 'Thêm 吗 vào cuối câu trần thuật để tạo câu hỏi có/không.',
        examples: [
          ['你是学生吗？', 'Ni3 shi4 xue2 sheng5 ma5?', 'Are you a student?', 'Bạn là học sinh phải không?'],
          ['你是老师吗？', 'Ni3 shi4 lao3 shi1 ma5?', 'Are you a teacher?', 'Bạn là giáo viên phải không?'],
          ['你叫小明吗？', 'Ni3 jiao4 Xiao3 Ming2 ma5?', 'Is your name Xiaoming?', 'Bạn tên là Tiểu Minh phải không?']
        ]
      }
    ],
    warmup: {
      items: ['跟老师说：你好！', '听一听：你好 / 再见。', '你的老师叫什么？'],
      itemsVi: [
        'Chào người bên cạnh bằng tiếng Trung: 你好!',
        'Nghe và phân biệt hai câu: 你好 (xin chào) và 再见 (tạm biệt).',
        'Thầy/cô của bạn tên là gì? Thử nói bằng tiếng Việt trước.'
      ]
    },
    dialogue: [
      ['A', '你好！我叫王小明。你叫什么？', 'Ni3 hao3! Wo3 jiao4 Wang2 Xiao3 Ming2. Ni3 jiao4 shen2 me5?', "Hello! My name is Wang Xiaoming. What's your name?", 'Xin chào! Mình tên là Vương Tiểu Minh. Bạn tên là gì?'],
      ['B', '你好！我叫李月。', 'Ni3 hao3! Wo3 jiao4 Li3 Yue4.', 'Hello! My name is Li Yue.', 'Xin chào! Mình tên là Lý Nguyệt.'],
      ['A', '你是学生吗？', 'Ni3 shi4 xue2 sheng5 ma5?', 'Are you a student?', 'Bạn là học sinh phải không?'],
      ['B', '是，我是学生。你也是学生吗？', 'Shi4, wo3 shi4 xue2 sheng5. Ni3 ye3 shi4 xue2 sheng5 ma5?', "Yes, I'm a student. Are you a student too?", 'Vâng, mình là học sinh. Bạn cũng là học sinh à?'],
      ['A', '我不是学生，我是老师。', 'Wo3 bu2 shi4 xue2 sheng5, wo3 shi4 lao3 shi1.', "I'm not a student. I'm a teacher.", 'Mình không phải là học sinh, mình là giáo viên.'],
      ['B', '王老师，您好！', 'Wang2 lao3 shi1, nin2 hao3!', 'Hello, Teacher Wang!', 'Em chào thầy Vương ạ!'],
      ['A', '李月，再见！', 'Li3 Yue4, zai4 jian4!', 'Goodbye, Li Yue!', 'Tạm biệt Lý Nguyệt nhé!'],
      ['B', '老师再见！', 'Lao3 shi1 zai4 jian4!', 'Goodbye, teacher!', 'Em chào thầy ạ, tạm biệt thầy!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你好！我___王小明。', 'Ni3 hao3! Wo3 ___ Wang2 Xiao3 Ming2.', ['叫', '是', '再见'], 0, ['tên là', 'là', 'tạm biệt'], '介绍名字的时候用“叫”：我叫王小明。', 'Giới thiệu tên dùng động từ 叫: 我叫王小明 = Mình tên là Vương Tiểu Minh.'],
      ['fill_blank', 'remember', '我不是学生，我是___。', 'Wo3 bu2 shi4 xue2 sheng5, wo3 shi4 ___.', ['老师', '学生', '你好'], 0, ['giáo viên', 'học sinh', 'xin chào'], '课文里王小明说：“我不是学生，我是老师。”', 'Trong bài, Vương Tiểu Minh nói: 我不是学生，我是老师 (Mình không phải học sinh, mình là giáo viên).'],
      ['multiple_choice', 'understand', 'A：你是学生吗？ B：___', 'A: Ni3 shi4 xue2 sheng5 ma5? B: ___', ['是，我是学生。', '我叫小明。', '再见！'], 0, ['Vâng, mình là học sinh.', 'Mình tên là Tiểu Minh.', 'Tạm biệt!'], '问“你是学生吗”，回答用“是”或“不是”。', 'Câu hỏi có 吗 trả lời bằng 是 (đúng vậy) hoặc 不是 (không phải), không trả lời bằng tên.'],
      ['word_order', 'understand', ['你', '也', '是', '学生', '吗'], 'ni3 / ye3 / shi4 / xue2 sheng5 / ma5', ['bạn', 'cũng', 'là', 'học sinh', 'không'], '你也是学生吗？', 'Bạn cũng là học sinh phải không?', '课文里说：“你也是学生吗？”“也”在“是”前面。', 'Trật tự đúng: chủ ngữ 你 + 也 (cũng) + động từ 是 + 学生 + 吗. Phó từ 也 luôn đứng trước động từ.'],
      ['listening_comprehension', 'understand', [4], '说话的人是老师还是学生？', 'Shuo1 hua4 de5 ren2 shi4 lao3 shi1 hai2 shi4 xue2 sheng5?', ['老师', '学生', '王小明的朋友'], 0, ['giáo viên', 'học sinh', 'bạn của Vương Tiểu Minh'], '他说“我不是学生，我是老师”。', 'Người nói nói rõ: 我不是学生，我是老师 → anh ấy là giáo viên.'],
      ['true_false', 'understand', '李月是学生。', 'Li3 Yue4 shi4 xue2 sheng5.', true, '李月说：“是，我是学生。”', 'Đúng. Lý Nguyệt nói: 是，我是学生 (Vâng, mình là học sinh).'],
      ['reading_comprehension', 'understand', '王小明是谁？', 'Wang2 Xiao3 Ming2 shi4 shei2?', ['老师', '学生', '李月'], 0, ['giáo viên', 'học sinh', 'Lý Nguyệt'], '王小明说：“我不是学生，我是老师。”', 'Vương Tiểu Minh tự giới thiệu: 我不是学生，我是老师 → anh ấy là giáo viên.']
    ]
  },
  {
    slug: 'name',
    titleZh: '名字',
    titleEn: 'Names',
    titleVi: 'Tên gọi',
    summaryEn: 'Two classmates ask each other their names and talk about a friend called Wang Fang.',
    summaryVi: 'Hai bạn học hỏi tên nhau và nói về một người bạn tên là Vương Phương.',
    vocab: [
      ['名字', 'ming2 zi5', 'noun', 'name', 'tên'],
      ['呢', 'ne5', 'particle', 'and…? (bounce-back question)', 'trợ từ hỏi lại (còn… thì sao?)'],
      ['她', 'ta1', 'pronoun', 'she, her', 'cô ấy'],
      ['他', 'ta1', 'pronoun', 'he, him', 'anh ấy'],
      ['谁', 'shei2', 'pronoun', 'who', 'ai'],
      ['的', 'de5', 'particle', 'possessive particle', 'trợ từ sở hữu (của)'],
      ['朋友', 'peng2 you5', 'noun', 'friend', 'bạn, bạn bè'],
      ['我们', 'wo3 men5', 'pronoun', 'we, us', 'chúng tôi, chúng ta'],
      ['都', 'dou1', 'adverb', 'all, both', 'đều']
    ],
    grammar: [
      {
        pattern: '……呢？',
        explanation: '问同一个问题的时候，用“呢”问回去：我叫小明，你呢？',
        explanation_vi: 'Dùng 呢 để hỏi ngược lại cùng một câu hỏi: 我叫小明，你呢? = Mình tên Tiểu Minh, còn bạn?',
        examples: [
          ['我叫李月，你呢？', 'Wo3 jiao4 Li3 Yue4, ni3 ne5?', "I'm Li Yue. And you?", 'Mình là Lý Nguyệt, còn bạn?'],
          ['我是学生，你呢？', 'Wo3 shi4 xue2 sheng5, ni3 ne5?', "I'm a student. What about you?", 'Mình là học sinh, còn bạn thì sao?'],
          ['我很好，你呢？', 'Wo3 hen3 hao3, ni3 ne5?', "I'm fine. And you?", 'Mình khỏe, còn bạn?']
        ]
      },
      {
        pattern: '名词/代词 + 的 + 名词',
        explanation: '“的”表示“谁的东西”：我的朋友、老师的名字。',
        explanation_vi: '的 biểu thị sở hữu: 我的朋友 = bạn của tôi; 老师的名字 = tên của giáo viên.',
        examples: [
          ['她是我的朋友。', 'Ta1 shi4 wo3 de5 peng2 you5.', 'She is my friend.', 'Cô ấy là bạn của mình.'],
          ['他是我们的老师。', 'Ta1 shi4 wo3 men5 de5 lao3 shi1.', 'He is our teacher.', 'Thầy ấy là giáo viên của chúng mình.'],
          ['你的名字是什么？', 'Ni3 de5 ming2 zi5 shi4 shen2 me5?', 'What is your name?', 'Tên của bạn là gì?']
        ]
      }
    ],
    warmup: {
      items: ['说一说你的名字。', '问朋友：你叫什么名字？', '她是谁？他是谁？'],
      itemsVi: [
        'Nói tên của bạn bằng tiếng Trung nếu có, hoặc tiếng Việt.',
        'Hỏi một người bạn: 你叫什么名字? (Bạn tên là gì?)',
        'Chỉ vào ảnh và hỏi: 她是谁? (Cô ấy là ai?) 他是谁? (Anh ấy là ai?)'
      ]
    },
    dialogue: [
      ['A', '你好！你叫什么名字？', 'Ni3 hao3! Ni3 jiao4 shen2 me5 ming2 zi5?', 'Hi! What is your name?', 'Chào bạn! Bạn tên là gì?'],
      ['B', '我叫李月。你呢？', 'Wo3 jiao4 Li3 Yue4. Ni3 ne5?', "My name is Li Yue. And you?", 'Mình tên là Lý Nguyệt. Còn bạn?'],
      ['A', '我叫王小明。她是谁？', 'Wo3 jiao4 Wang2 Xiao3 Ming2. Ta1 shi4 shei2?', "I'm Wang Xiaoming. Who is she?", 'Mình là Vương Tiểu Minh. Cô ấy là ai vậy?'],
      ['B', '她是我的朋友。', 'Ta1 shi4 wo3 de5 peng2 you5.', 'She is my friend.', 'Cô ấy là bạn của mình.'],
      ['A', '她叫什么名字？', 'Ta1 jiao4 shen2 me5 ming2 zi5?', 'What is her name?', 'Bạn ấy tên là gì?'],
      ['B', '她叫王方。', 'Ta1 jiao4 Wang2 Fang1.', 'Her name is Wang Fang.', 'Bạn ấy tên là Vương Phương.'],
      ['A', '你的朋友也是学生吗？', 'Ni3 de5 peng2 you5 ye3 shi4 xue2 sheng5 ma5?', 'Is your friend a student too?', 'Bạn của bạn cũng là học sinh à?'],
      ['B', '是，我们都是学生。', 'Shi4, wo3 men5 dou1 shi4 xue2 sheng5.', 'Yes, we are all students.', 'Ừ, bọn mình đều là học sinh.']
    ],
    exercises: [
      ['fill_blank', 'remember', '你叫什么___？', 'Ni3 jiao4 shen2 me5 ___?', ['名字', '朋友', '老师'], 0, ['tên', 'bạn bè', 'giáo viên'], '问名字说：“你叫什么名字？”', 'Hỏi tên người khác: 你叫什么名字? (Bạn tên là gì?).'],
      ['fill_blank', 'remember', '她是我___朋友。', 'Ta1 shi4 wo3 ___ peng2 you5.', ['的', '吗', '呢'], 0, ['của (trợ từ 的)', 'trợ từ hỏi 吗', 'trợ từ hỏi 呢'], '“我的朋友”用“的”表示“谁的”。', 'Sở hữu dùng 的: 我的朋友 = bạn của tôi.'],
      ['multiple_choice', 'understand', 'A：我叫李月。你呢？ B：___', 'A: Wo3 jiao4 Li3 Yue4. Ni3 ne5? B: ___', ['我叫王小明。', '她是我的朋友。', '我们都是学生。'], 0, ['Mình tên là Vương Tiểu Minh.', 'Cô ấy là bạn của mình.', 'Bọn mình đều là học sinh.'], '“你呢”问的是名字，所以回答自己的名字。', '你呢 hỏi ngược lại về tên, nên phải trả lời tên của mình.'],
      ['word_order', 'understand', ['她', '是', '我', '的', '朋友'], 'ta1 / shi4 / wo3 / de5 / peng2 you5', ['cô ấy', 'là', 'tôi', 'của', 'bạn'], '她是我的朋友。', 'Cô ấy là bạn của tôi.', '课文里说：“她是我的朋友。”', 'Trật tự đúng: 她 + 是 + 我的 + 朋友. Cụm sở hữu 我的 đứng trước danh từ 朋友.'],
      ['listening_comprehension', 'understand', [7], '他们是老师还是学生？', 'Ta1 men5 shi4 lao3 shi1 hai2 shi4 xue2 sheng5?', ['都是学生', '都是老师', '一个老师，一个学生'], 0, ['đều là học sinh', 'đều là giáo viên', 'một giáo viên, một học sinh'], '她说“我们都是学生”。', 'Người nói khẳng định: 我们都是学生 (Chúng mình đều là học sinh).'],
      ['true_false', 'understand', '李月的朋友叫王方。', 'Li3 Yue4 de5 peng2 you5 jiao4 Wang2 Fang1.', true, '李月说她的朋友叫王方。', 'Đúng. Lý Nguyệt nói bạn của mình tên là 王方 (Vương Phương).'],
      ['reading_comprehension', 'understand', '王方是谁的朋友？', 'Wang2 Fang1 shi4 shei2 de5 peng2 you5?', ['李月的朋友', '王小明的朋友', '老师的朋友'], 0, ['bạn của Lý Nguyệt', 'bạn của Vương Tiểu Minh', 'bạn của giáo viên'], '李月说：“她是我的朋友。她叫王方。”', 'Lý Nguyệt giới thiệu: 她是我的朋友，她叫王方 → Vương Phương là bạn của Lý Nguyệt.']
    ]
  },
  {
    slug: 'family',
    titleZh: '家人',
    titleEn: 'Family',
    titleVi: 'Gia đình',
    summaryEn: 'Li Yue talks about the three people in her family, her parents\' jobs, and the pet dog at home.',
    summaryVi: 'Lý Nguyệt kể về gia đình ba người, nghề nghiệp của bố mẹ và chú chó nuôi trong nhà.',
    vocab: [
      ['家', 'jia1', 'noun', 'family, home', 'nhà, gia đình'],
      ['有', 'you3', 'verb', 'to have, there is', 'có'],
      ['没有', 'mei2 you3', 'verb', 'to not have', 'không có'],
      ['几', 'ji3', 'pronoun', 'how many (small numbers)', 'mấy, bao nhiêu (số nhỏ)'],
      ['口', 'kou3', 'measure word', 'measure word for family members', 'lượng từ đếm người trong nhà (khẩu)'],
      ['人', 'ren2', 'noun', 'person, people', 'người'],
      ['爸爸', 'ba4 ba5', 'noun', 'dad, father', 'bố'],
      ['妈妈', 'ma1 ma5', 'noun', 'mom, mother', 'mẹ'],
      ['和', 'he2', 'conjunction', 'and', 'và'],
      ['医生', 'yi1 sheng1', 'noun', 'doctor', 'bác sĩ'],
      ['猫', 'mao1', 'noun', 'cat', 'mèo'],
      ['狗', 'gou3', 'noun', 'dog', 'chó']
    ],
    grammar: [
      {
        pattern: '有 / 没有',
        explanation: '“有”表示“家里有什么、有谁”；否定用“没有”，不用“不”。',
        explanation_vi: '有 nghĩa là "có"; phủ định của 有 là 没有 (không dùng 不有).',
        examples: [
          ['我家有三口人。', 'Wo3 jia1 you3 san1 kou3 ren2.', 'There are three people in my family.', 'Nhà mình có ba người.'],
          ['我家有狗。', 'Wo3 jia1 you3 gou3.', 'My family has a dog.', 'Nhà mình có nuôi chó.'],
          ['我家没有猫。', 'Wo3 jia1 mei2 you3 mao1.', "My family doesn't have a cat.", 'Nhà mình không nuôi mèo.']
        ]
      },
      {
        pattern: '几 + 量词 + 名词',
        explanation: '问数量用“几”，后面要有量词：几口人？',
        explanation_vi: 'Hỏi số lượng nhỏ dùng 几 + lượng từ: 几口人? = mấy người? Lưu ý phải có lượng từ sau 几.',
        examples: [
          ['你家有几口人？', 'Ni3 jia1 you3 ji3 kou3 ren2?', 'How many people are in your family?', 'Nhà bạn có mấy người?'],
          ['我家有四口人。', 'Wo3 jia1 you3 si4 kou3 ren2.', 'There are four people in my family.', 'Nhà mình có bốn người.'],
          ['你有几个朋友？', 'Ni3 you3 ji3 ge5 peng2 you5?', 'How many friends do you have?', 'Bạn có mấy người bạn?']
        ]
      }
    ],
    warmup: {
      items: ['你家有几口人？', '看图说词：爸爸 / 妈妈。', '你家有猫吗？有狗吗？'],
      itemsVi: [
        'Nhà bạn có mấy người? Thử đếm bằng tiếng Trung.',
        'Nhìn tranh và gọi tên: 爸爸 (bố) / 妈妈 (mẹ).',
        'Nhà bạn có nuôi mèo hay chó không?'
      ]
    },
    dialogue: [
      ['A', '李月，你家有几口人？', 'Li3 Yue4, ni3 jia1 you3 ji3 kou3 ren2?', 'Li Yue, how many people are there in your family?', 'Lý Nguyệt ơi, nhà bạn có mấy người?'],
      ['B', '我家有三口人：爸爸、妈妈和我。', 'Wo3 jia1 you3 san1 kou3 ren2: ba4 ba5, ma1 ma5 he2 wo3.', 'There are three people in my family: my dad, my mom, and me.', 'Nhà mình có ba người: bố, mẹ và mình.'],
      ['A', '你爸爸是老师吗？', 'Ni3 ba4 ba5 shi4 lao3 shi1 ma5?', 'Is your dad a teacher?', 'Bố bạn là giáo viên à?'],
      ['B', '不是，我爸爸是医生，我妈妈是老师。', 'Bu2 shi4, wo3 ba4 ba5 shi4 yi1 sheng1, wo3 ma1 ma5 shi4 lao3 shi1.', 'No, my dad is a doctor and my mom is a teacher.', 'Không phải, bố mình là bác sĩ, còn mẹ mình là giáo viên.'],
      ['A', '你家有猫吗？', 'Ni3 jia1 you3 mao1 ma5?', 'Does your family have a cat?', 'Nhà bạn có nuôi mèo không?'],
      ['B', '没有，我家有狗。', 'Mei2 you3, wo3 jia1 you3 gou3.', "No, we have a dog.", 'Không có, nhà mình nuôi chó.'],
      ['A', '我家也有狗！', 'Wo3 jia1 ye3 you3 gou3!', 'My family has a dog too!', 'Nhà mình cũng nuôi chó đấy!'],
      ['B', '狗是我们的好朋友。', 'Gou3 shi4 wo3 men5 de5 hao3 peng2 you5.', 'Dogs are our good friends.', 'Chó là người bạn tốt của chúng ta mà.']
    ],
    exercises: [
      ['fill_blank', 'remember', '你家有几___人？', 'Ni3 jia1 you3 ji3 ___ ren2?', ['口', '个', '家'], 0, ['khẩu (lượng từ người trong nhà)', 'cái (lượng từ chung)', 'nhà'], '说家里的人，用量词“口”：几口人。', 'Đếm người trong gia đình dùng lượng từ 口: 几口人 = mấy người.'],
      ['fill_blank', 'remember', '我家___猫，有狗。', 'Wo3 jia1 ___ mao1, you3 gou3.', ['没有', '不', '不是'], 0, ['không có', 'không', 'không phải là'], '“有”的否定是“没有”，不说“不有”。', 'Phủ định của 有 là 没有, không nói 不有.'],
      ['multiple_choice', 'understand', 'A：你家有几口人？ B：___', 'A: Ni3 jia1 you3 ji3 kou3 ren2? B: ___', ['我家有三口人。', '我家有猫。', '我爸爸是医生。'], 0, ['Nhà mình có ba người.', 'Nhà mình có mèo.', 'Bố mình là bác sĩ.'], '“几口人”问的是家里有多少人。', 'Câu hỏi 几口人 hỏi về số người trong nhà, nên phải trả lời số người.'],
      ['word_order', 'understand', ['我家', '有', '三', '口', '人'], 'wo3 jia1 / you3 / san1 / kou3 / ren2', ['nhà tôi', 'có', 'ba', 'khẩu', 'người'], '我家有三口人。', 'Nhà tôi có ba người.', '课文里说：“我家有三口人。”', 'Trật tự đúng: 我家 + 有 + số từ 三 + lượng từ 口 + danh từ 人.'],
      ['listening_comprehension', 'understand', [3], '李月的爸爸做什么？', 'Li3 Yue4 de5 ba4 ba5 zuo4 shen2 me5?', ['他是医生', '他是老师', '他是学生'], 0, ['Ông ấy là bác sĩ', 'Ông ấy là giáo viên', 'Ông ấy là học sinh'], '她说“我爸爸是医生，我妈妈是老师”。', 'Trong câu nghe được: 我爸爸是医生 → bố bạn ấy là bác sĩ.'],
      ['true_false', 'understand', '李月家有四口人。', 'Li3 Yue4 jia1 you3 si4 kou3 ren2.', false, '李月说：“我家有三口人。”', 'Sai. Lý Nguyệt nói nhà mình có ba người (三口人), không phải bốn.'],
      ['reading_comprehension', 'understand', '李月家有什么？', 'Li3 Yue4 jia1 you3 shen2 me5?', ['狗', '猫', '猫和狗'], 0, ['chó', 'mèo', 'cả mèo và chó'], '李月说：“没有（猫），我家有狗。”', 'Bạn ấy trả lời: 没有，我家有狗 → nhà chỉ nuôi chó, không nuôi mèo.']
    ]
  },
  {
    slug: 'numbers',
    titleZh: '数字',
    titleEn: 'Numbers',
    titleVi: 'Con số',
    summaryEn: 'Two friends exchange phone numbers and ask about each other\'s age using Chinese numbers.',
    summaryVi: 'Hai người bạn trao đổi số điện thoại và hỏi tuổi của nhau bằng các con số tiếng Trung.',
    vocab: [
      ['一', 'yi1', 'numeral', 'one', 'một'],
      ['五', 'wu3', 'numeral', 'five', 'năm'],
      ['八', 'ba1', 'numeral', 'eight', 'tám'],
      ['十', 'shi2', 'numeral', 'ten', 'mười'],
      ['零', 'ling2', 'numeral', 'zero', 'số không'],
      ['个', 'ge4', 'measure word', 'general measure word', 'lượng từ chung (cái, chiếc, người…)'],
      ['多少', 'duo1 shao5', 'pronoun', 'how many, how much', 'bao nhiêu'],
      ['岁', 'sui4', 'measure word', 'years old', 'tuổi'],
      ['今年', 'jin1 nian2', 'time word', 'this year', 'năm nay'],
      ['电话', 'dian4 hua4', 'noun', 'telephone', 'điện thoại'],
      ['号码', 'hao4 ma3', 'noun', 'number (phone number)', 'số (số điện thoại)'],
      ['谢谢', 'xie4 xie5', 'verb', 'thanks, thank you', 'cảm ơn']
    ],
    grammar: [
      {
        pattern: '……多少？ / 几……？',
        explanation: '大数字用“多少”，小数字用“几”：电话号码是多少？你家有几口人？',
        explanation_vi: 'Hỏi số lớn dùng 多少, số nhỏ (dưới 10) dùng 几: 电话号码是多少? (SĐT là bao nhiêu?), 几口人? (mấy người?).',
        examples: [
          ['你的电话号码是多少？', 'Ni3 de5 dian4 hua4 hao4 ma3 shi4 duo1 shao5?', 'What is your phone number?', 'Số điện thoại của bạn là bao nhiêu?'],
          ['你们学校有多少学生？', 'Ni3 men5 xue2 xiao4 you3 duo1 shao5 xue2 sheng5?', 'How many students does your school have?', 'Trường bạn có bao nhiêu học sinh?'],
          ['你有几个好朋友？', 'Ni3 you3 ji3 ge4 hao3 peng2 you5?', 'How many good friends do you have?', 'Bạn có mấy người bạn thân?']
        ]
      },
      {
        pattern: '主语 + 今年 + 数字 + 岁',
        explanation: '说年龄用“岁”：我今年二十岁。',
        explanation_vi: 'Nói tuổi dùng 岁: 我今年二十岁 = Năm nay tôi 20 tuổi. Không cần động từ 是.',
        examples: [
          ['我今年二十岁。', 'Wo3 jin1 nian2 er4 shi2 sui4.', 'I am twenty years old this year.', 'Năm nay mình hai mươi tuổi.'],
          ['你今年多大？', 'Ni3 jin1 nian2 duo1 da4?', 'How old are you this year?', 'Năm nay bạn bao nhiêu tuổi?'],
          ['我的狗两岁。', 'Wo3 de5 gou3 liang3 sui4.', 'My dog is two years old.', 'Con chó của mình hai tuổi.']
        ]
      }
    ],
    warmup: {
      items: ['从一数到十。', '说一说：你的电话号码。', '你今年多大？'],
      itemsVi: [
        'Đếm từ 1 đến 10 bằng tiếng Trung: 一、二、三…',
        'Đọc số điện thoại của bạn từng chữ số một.',
        'Năm nay bạn bao nhiêu tuổi? (你今年多大?)'
      ]
    },
    dialogue: [
      ['A', '小明，你的电话号码是多少？', 'Xiao3 Ming2, ni3 de5 dian4 hua4 hao4 ma3 shi4 duo1 shao5?', 'Xiaoming, what is your phone number?', 'Tiểu Minh ơi, số điện thoại của bạn là bao nhiêu?'],
      ['B', '我的电话号码是一三八零五六七九。', 'Wo3 de5 dian4 hua4 hao4 ma3 shi4 yi1 san1 ba1 ling2 wu3 liu4 qi1 jiu3.', 'My phone number is 1380-5679.', 'Số điện thoại của mình là 1380-5679.'],
      ['A', '谢谢！你今年多大？', 'Xie4 xie5! Ni3 jin1 nian2 duo1 da4?', 'Thanks! How old are you this year?', 'Cảm ơn nhé! Năm nay bạn bao nhiêu tuổi?'],
      ['B', '我今年二十岁。你呢？', 'Wo3 jin1 nian2 er4 shi2 sui4. Ni3 ne5?', "I'm twenty this year. And you?", 'Năm nay mình hai mươi tuổi. Còn bạn?'],
      ['A', '我十九岁。', 'Wo3 shi2 jiu3 sui4.', "I'm nineteen.", 'Mình mười chín tuổi.'],
      ['B', '你家有几个人？', 'Ni3 jia1 you3 ji3 ge4 ren2?', 'How many people are in your family?', 'Nhà bạn có mấy người?'],
      ['A', '我家有五个人。', 'Wo3 jia1 you3 wu3 ge4 ren2.', 'There are five people in my family.', 'Nhà mình có năm người.'],
      ['B', '好，我给你打电话！', 'Hao3, wo3 gei3 ni3 da3 dian4 hua4!', "OK, I'll call you!", 'Được rồi, mình sẽ gọi điện cho bạn nhé!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你的电话号码是___？', 'Ni3 de5 dian4 hua4 hao4 ma3 shi4 ___?', ['多少', '几', '谁'], 0, ['bao nhiêu', 'mấy', 'ai'], '电话号码是大数字，用“多少”问。', 'Số điện thoại là số dài nên hỏi bằng 多少, không dùng 几.'],
      ['fill_blank', 'remember', '我今年二十___。', 'Wo3 jin1 nian2 er4 shi2 ___.', ['岁', '个', '口'], 0, ['tuổi', 'cái', 'khẩu'], '说年龄用“岁”：二十岁。', 'Nói tuổi dùng 岁: 二十岁 = 20 tuổi.'],
      ['multiple_choice', 'understand', '“一三八零五六七九”，这是什么？', '"Yi1 san1 ba1 ling2 wu3 liu4 qi1 jiu3", zhe4 shi4 shen2 me5?', ['电话号码', '几口人', '多大'], 0, ['số điện thoại', 'số người trong nhà', 'tuổi'], '这是小明的电话号码。', 'Dãy số dài đọc từng chữ số là số điện thoại (电话号码).'],
      ['word_order', 'understand', ['你', '今年', '多大'], 'ni3 / jin1 nian2 / duo1 da4', ['bạn', 'năm nay', 'bao nhiêu tuổi'], '你今年多大？', 'Năm nay bạn bao nhiêu tuổi?', '问年龄说：“你今年多大？”', 'Trật tự đúng: 你 + 今年 + 多大. Từ chỉ thời gian 今年 đứng trước cụm hỏi 多大.'],
      ['listening_comprehension', 'understand', [3, 4], '小明今年多大？', 'Xiao3 Ming2 jin1 nian2 duo1 da4?', ['二十岁', '十九岁', '十五岁'], 0, ['hai mươi tuổi', 'mười chín tuổi', 'mười lăm tuổi'], '小明说“我今年二十岁”。', 'Tiểu Minh nói: 我今年二十岁 → 20 tuổi; còn người kia 19 tuổi.'],
      ['true_false', 'understand', '小明家有五个人。', 'Xiao3 Ming2 jia1 you3 wu3 ge4 ren2.', false, '说“我家有五个人”的是问号码的人，不是小明。', 'Sai. Người nói 我家有五个人 là người hỏi (A), không phải Tiểu Minh.'],
      ['reading_comprehension', 'understand', '谁十九岁？', 'Shei2 shi2 jiu3 sui4?', ['问电话号码的人', '小明', '小明的爸爸'], 0, ['người hỏi số điện thoại', 'Tiểu Minh', 'bố của Tiểu Minh'], '对话里A说“我十九岁”，小明二十岁。', 'Trong hội thoại, người A (người xin số điện thoại) nói 我十九岁; Tiểu Minh thì 20 tuổi.']
    ]
  },
  {
    slug: 'date',
    titleZh: '日期',
    titleEn: 'Dates',
    titleVi: 'Ngày tháng',
    summaryEn: 'Two friends talk about today\'s date and discover that tomorrow is a birthday.',
    summaryVi: 'Hai người bạn nói về ngày hôm nay và phát hiện ngày mai là sinh nhật một người.',
    vocab: [
      ['今天', 'jin1 tian1', 'time word', 'today', 'hôm nay'],
      ['明天', 'ming2 tian1', 'time word', 'tomorrow', 'ngày mai'],
      ['昨天', 'zuo2 tian1', 'time word', 'yesterday', 'hôm qua'],
      ['月', 'yue4', 'noun', 'month', 'tháng'],
      ['号', 'hao4', 'measure word', 'day of the month', 'ngày (trong tháng)'],
      ['星期', 'xing1 qi1', 'noun', 'week', 'tuần, thứ'],
      ['生日', 'sheng1 ri4', 'noun', 'birthday', 'sinh nhật'],
      ['对', 'dui4', 'adjective', 'right, correct', 'đúng, phải'],
      ['生日快乐', 'sheng1 ri4 kuai4 le4', 'phrase', 'happy birthday', 'chúc mừng sinh nhật']
    ],
    grammar: [
      {
        pattern: '……月……号',
        explanation: '日期先说月，再说号：五月八号。',
        explanation_vi: 'Ngày tháng nói tháng trước, ngày sau: 五月八号 = ngày 8 tháng 5 (ngược với tiếng Việt).',
        examples: [
          ['今天是五月八号。', 'Jin1 tian1 shi4 wu3 yue4 ba1 hao4.', 'Today is May 8th.', 'Hôm nay là ngày 8 tháng 5.'],
          ['明天是几月几号？', 'Ming2 tian1 shi4 ji3 yue4 ji3 hao4?', 'What is the date tomorrow?', 'Ngày mai là ngày mấy tháng mấy?'],
          ['我的生日是十月一号。', 'Wo3 de5 sheng1 ri4 shi4 shi2 yue4 yi1 hao4.', 'My birthday is October 1st.', 'Sinh nhật mình là ngày 1 tháng 10.']
        ]
      },
      {
        pattern: '星期 + 数字',
        explanation: '星期一到星期六用数字，星期天不用数字。',
        explanation_vi: 'Thứ trong tuần = 星期 + số: 星期一 (thứ Hai) … 星期六 (thứ Bảy); riêng Chủ nhật là 星期天.',
        examples: [
          ['今天是星期五。', 'Jin1 tian1 shi4 xing1 qi1 wu3.', 'Today is Friday.', 'Hôm nay là thứ Sáu.'],
          ['明天是星期六。', 'Ming2 tian1 shi4 xing1 qi1 liu4.', 'Tomorrow is Saturday.', 'Ngày mai là thứ Bảy.'],
          ['星期天你做什么？', 'Xing1 qi1 tian1 ni3 zuo4 shen2 me5?', 'What do you do on Sunday?', 'Chủ nhật bạn làm gì?']
        ]
      }
    ],
    warmup: {
      items: ['今天是几月几号？', '今天星期几？', '你的生日是几月几号？'],
      itemsVi: [
        'Hôm nay là ngày mấy tháng mấy? Nói theo thứ tự tháng trước, ngày sau.',
        'Hôm nay là thứ mấy? (今天星期几?)',
        'Sinh nhật của bạn là ngày mấy tháng mấy?'
      ]
    },
    dialogue: [
      ['A', '李月，今天是几月几号？', 'Li3 Yue4, jin1 tian1 shi4 ji3 yue4 ji3 hao4?', 'Li Yue, what is the date today?', 'Lý Nguyệt ơi, hôm nay là ngày mấy tháng mấy?'],
      ['B', '今天是五月八号，星期五。', 'Jin1 tian1 shi4 wu3 yue4 ba1 hao4, xing1 qi1 wu3.', "It's May 8th, Friday.", 'Hôm nay là ngày 8 tháng 5, thứ Sáu.'],
      ['A', '明天是我的生日！', 'Ming2 tian1 shi4 wo3 de5 sheng1 ri4!', 'Tomorrow is my birthday!', 'Ngày mai là sinh nhật của mình đấy!'],
      ['B', '是吗？你的生日是五月九号？', 'Shi4 ma5? Ni3 de5 sheng1 ri4 shi4 wu3 yue4 jiu3 hao4?', 'Really? Your birthday is May 9th?', 'Thật à? Sinh nhật bạn là ngày 9 tháng 5 hả?'],
      ['A', '对，星期六。', 'Dui4, xing1 qi1 liu4.', 'Right, on Saturday.', 'Đúng rồi, vào thứ Bảy.'],
      ['B', '生日快乐！明天我去你家。', 'Sheng1 ri4 kuai4 le4! Ming2 tian1 wo3 qu4 ni3 jia1.', "Happy birthday! I'll come to your place tomorrow.", 'Chúc mừng sinh nhật! Mai mình sẽ đến nhà bạn.'],
      ['A', '太好了！谢谢你！', 'Tai4 hao3 le5! Xie4 xie5 ni3!', 'Great! Thank you!', 'Tuyệt quá! Cảm ơn bạn nhé!'],
      ['B', '明天见！', 'Ming2 tian1 jian4!', 'See you tomorrow!', 'Hẹn mai gặp nhé!']
    ],
    exercises: [
      ['fill_blank', 'remember', '今天是五月八___。', 'Jin1 tian1 shi4 wu3 yue4 ba1 ___.', ['号', '岁', '个'], 0, ['ngày (hào)', 'tuổi', 'cái'], '日期说“……月……号”。', 'Ngày trong tháng dùng 号: 五月八号 = ngày 8 tháng 5.'],
      ['fill_blank', 'remember', '明天是我的___。', 'Ming2 tian1 shi4 wo3 de5 ___.', ['生日', '星期', '号码'], 0, ['sinh nhật', 'tuần/thứ', 'số (điện thoại)'], '课文里说：“明天是我的生日！”', 'Trong bài: 明天是我的生日 (Mai là sinh nhật của mình).'],
      ['multiple_choice', 'understand', '朋友的生日到了，你说什么？', 'Peng2 you5 de5 sheng1 ri4 dao4 le5, ni3 shuo1 shen2 me5?', ['生日快乐！', '再见！', '你好吗？'], 0, ['Chúc mừng sinh nhật!', 'Tạm biệt!', 'Bạn khỏe không?'], '生日的时候说“生日快乐”。', 'Đến sinh nhật bạn bè thì chúc: 生日快乐 (Chúc mừng sinh nhật).'],
      ['word_order', 'understand', ['今天', '是', '五月', '八号'], 'jin1 tian1 / shi4 / wu3 yue4 / ba1 hao4', ['hôm nay', 'là', 'tháng 5', 'ngày 8'], '今天是五月八号。', 'Hôm nay là ngày 8 tháng 5.', '日期先说月，再说号：五月八号。', 'Tiếng Trung nói tháng trước, ngày sau: 五月八号 = ngày 8/5.'],
      ['listening_comprehension', 'understand', [1], '今天是星期几？', 'Jin1 tian1 shi4 xing1 qi1 ji3?', ['星期五', '星期六', '星期天'], 0, ['thứ Sáu', 'thứ Bảy', 'Chủ nhật'], '她说“今天是五月八号，星期五”。', 'Câu nghe được: 今天是五月八号，星期五 → hôm nay thứ Sáu.'],
      ['true_false', 'understand', '他的生日是五月九号，星期六。', 'Ta1 de5 sheng1 ri4 shi4 wu3 yue4 jiu3 hao4, xing1 qi1 liu4.', true, '他说“对，星期六”，生日是五月九号。', 'Đúng. Sinh nhật là ngày 9/5 và người ấy xác nhận: 对，星期六 (vào thứ Bảy).'],
      ['reading_comprehension', 'understand', '明天李月做什么？', 'Ming2 tian1 Li3 Yue4 zuo4 shen2 me5?', ['去朋友家', '去学校', '打电话'], 0, ['đến nhà bạn', 'đến trường', 'gọi điện thoại'], '李月说：“明天我去你家。”', 'Lý Nguyệt nói: 明天我去你家 → mai bạn ấy đến nhà bạn mình mừng sinh nhật.']
    ]
  },
  {
    slug: 'time',
    titleZh: '时间',
    titleEn: 'Time',
    titleVi: 'Thời gian',
    summaryEn: 'Two friends check the time, go to lunch together and talk about their afternoon and evening plans.',
    summaryVi: 'Hai người bạn xem giờ, rủ nhau đi ăn trưa và nói về kế hoạch buổi chiều, buổi tối.',
    vocab: [
      ['现在', 'xian4 zai4', 'time word', 'now', 'bây giờ'],
      ['点', 'dian3', 'measure word', "o'clock", 'giờ'],
      ['分', 'fen1', 'measure word', 'minute', 'phút'],
      ['上午', 'shang4 wu3', 'time word', 'morning', 'buổi sáng'],
      ['中午', 'zhong1 wu3', 'time word', 'noon', 'buổi trưa'],
      ['下午', 'xia4 wu3', 'time word', 'afternoon', 'buổi chiều'],
      ['晚上', 'wan3 shang5', 'time word', 'evening, night', 'buổi tối'],
      ['去', 'qu4', 'verb', 'to go', 'đi, đến'],
      ['吃饭', 'chi1 fan4', 'verb phrase', 'to eat, to have a meal', 'ăn cơm'],
      ['睡觉', 'shui4 jiao4', 'verb phrase', 'to sleep', 'ngủ'],
      ['做', 'zuo4', 'verb', 'to do', 'làm']
    ],
    grammar: [
      {
        pattern: '几点 / ……点……分',
        explanation: '问时间说“几点”；说时间用“点”和“分”：十一点五十分。',
        explanation_vi: 'Hỏi giờ dùng 几点; nói giờ dùng 点 (giờ) và 分 (phút): 十一点五十分 = 11 giờ 50 phút.',
        examples: [
          ['现在几点？', 'Xian4 zai4 ji3 dian3?', 'What time is it now?', 'Bây giờ là mấy giờ?'],
          ['现在十一点五十分。', 'Xian4 zai4 shi2 yi1 dian3 wu3 shi2 fen1.', "It's 11:50 now.", 'Bây giờ là 11 giờ 50 phút.'],
          ['我们十二点吃饭。', 'Wo3 men5 shi2 er4 dian3 chi1 fan4.', 'We eat at twelve.', 'Chúng ta ăn cơm lúc 12 giờ.']
        ]
      },
      {
        pattern: '时间词 + 动词',
        explanation: '时间词在动词前面：我下午看书，晚上十一点睡觉。',
        explanation_vi: 'Từ chỉ thời gian đứng trước động từ: 我下午看书 = buổi chiều tôi đọc sách (khác tiếng Việt có thể đặt sau).',
        examples: [
          ['我上午学中文。', 'Wo3 shang4 wu3 xue2 Zhong1 wen2.', 'I study Chinese in the morning.', 'Buổi sáng mình học tiếng Trung.'],
          ['我们中午去吃饭。', 'Wo3 men5 zhong1 wu3 qu4 chi1 fan4.', 'We go to eat at noon.', 'Buổi trưa chúng mình đi ăn cơm.'],
          ['我晚上十一点睡觉。', 'Wo3 wan3 shang5 shi2 yi1 dian3 shui4 jiao4.', 'I go to bed at 11 p.m.', 'Buổi tối mình đi ngủ lúc 11 giờ.']
        ]
      }
    ],
    warmup: {
      items: ['现在几点？', '你几点吃饭？', '你晚上几点睡觉？'],
      itemsVi: [
        'Bây giờ là mấy giờ? Nói theo mẫu …点…分.',
        'Bạn thường ăn cơm lúc mấy giờ?',
        'Buổi tối bạn đi ngủ lúc mấy giờ?'
      ]
    },
    dialogue: [
      ['A', '小明，现在几点？', 'Xiao3 Ming2, xian4 zai4 ji3 dian3?', 'Xiaoming, what time is it now?', 'Tiểu Minh ơi, bây giờ mấy giờ rồi?'],
      ['B', '现在十一点五十分。', 'Xian4 zai4 shi2 yi1 dian3 wu3 shi2 fen1.', "It's 11:50.", 'Bây giờ là 11 giờ 50.'],
      ['A', '中午了！我们去吃饭。', 'Zhong1 wu3 le5! Wo3 men5 qu4 chi1 fan4.', "It's noon! Let's go eat.", 'Trưa rồi! Chúng mình đi ăn cơm thôi.'],
      ['B', '好。你下午做什么？', 'Hao3. Ni3 xia4 wu3 zuo4 shen2 me5?', 'OK. What are you doing this afternoon?', 'Ừ. Chiều nay bạn làm gì?'],
      ['A', '下午我学中文。你呢？', 'Xia4 wu3 wo3 xue2 Zhong1 wen2. Ni3 ne5?', "I'm studying Chinese in the afternoon. You?", 'Chiều mình học tiếng Trung. Còn bạn?'],
      ['B', '我下午三点去朋友家。', 'Wo3 xia4 wu3 san1 dian3 qu4 peng2 you5 jia1.', "I'm going to a friend's place at three.", 'Ba giờ chiều mình đến nhà bạn mình chơi.'],
      ['A', '你晚上几点睡觉？', 'Ni3 wan3 shang5 ji3 dian3 shui4 jiao4?', 'What time do you go to bed at night?', 'Buổi tối bạn ngủ lúc mấy giờ?'],
      ['B', '我晚上十一点睡觉。', 'Wo3 wan3 shang5 shi2 yi1 dian3 shui4 jiao4.', 'I go to bed at eleven.', 'Mình ngủ lúc 11 giờ đêm.']
    ],
    exercises: [
      ['fill_blank', 'remember', '现在___点？', 'Xian4 zai4 ___ dian3?', ['几', '多少', '什么'], 0, ['mấy', 'bao nhiêu', 'gì'], '问时间说“几点”。', 'Hỏi giờ dùng 几点 (mấy giờ), không dùng 多少点.'],
      ['fill_blank', 'remember', '我晚上十一点___。', 'Wo3 wan3 shang5 shi2 yi1 dian3 ___.', ['睡觉', '吃饭', '去'], 0, ['ngủ', 'ăn cơm', 'đi'], '课文里说：“我晚上十一点睡觉。”', 'Trong bài: 我晚上十一点睡觉 (Tôi ngủ lúc 11 giờ đêm).'],
      ['multiple_choice', 'understand', '“十一点五十分”是什么时间？', '"Shi2 yi1 dian3 wu3 shi2 fen1" shi4 shen2 me5 shi2 jian1?', ['11:50', '11:15', '10:50'], 0, ['11 giờ 50', '11 giờ 15', '10 giờ 50'], '十一点是11点，五十分是50分。', '十一点 = 11 giờ, 五十分 = 50 phút → 11:50.'],
      ['word_order', 'understand', ['我', '下午', '学', '中文'], 'wo3 / xia4 wu3 / xue2 / Zhong1 wen2', ['tôi', 'buổi chiều', 'học', 'tiếng Trung'], '我下午学中文。', 'Buổi chiều tôi học tiếng Trung.', '时间词“下午”在动词“学”前面。', 'Từ chỉ thời gian 下午 phải đứng trước động từ 学: 我下午学中文.'],
      ['listening_comprehension', 'understand', [5], '他下午三点去哪儿？', 'Ta1 xia4 wu3 san1 dian3 qu4 na3r5?', ['朋友家', '学校', '饭馆'], 0, ['nhà bạn', 'trường học', 'quán ăn'], '他说“我下午三点去朋友家”。', 'Câu nghe được: 我下午三点去朋友家 → 3 giờ chiều đến nhà bạn.'],
      ['true_false', 'understand', '他们中午去吃饭。', 'Ta1 men5 zhong1 wu3 qu4 chi1 fan4.', true, '对话里说：“中午了！我们去吃饭。”', 'Đúng. Trong bài: 中午了！我们去吃饭 (Trưa rồi, chúng mình đi ăn thôi).'],
      ['reading_comprehension', 'understand', '小明晚上几点睡觉？', 'Xiao3 Ming2 wan3 shang5 ji3 dian3 shui4 jiao4?', ['十一点', '十点', '五点'], 0, ['11 giờ', '10 giờ', '5 giờ'], '小明说：“我晚上十一点睡觉。”', 'Tiểu Minh trả lời: 我晚上十一点睡觉 → 11 giờ đêm mới ngủ.']
    ]
  },
  {
    slug: 'food',
    titleZh: '吃饭',
    titleEn: 'Food',
    titleVi: 'Ăn uống',
    summaryEn: 'Two friends decide what to eat: rice and vegetables, plus some fruit for after the meal.',
    summaryVi: 'Hai người bạn bàn xem ăn gì: cơm với rau, và thêm hoa quả tráng miệng.',
    vocab: [
      ['想', 'xiang3', 'modal verb', 'to want, would like', 'muốn'],
      ['要', 'yao4', 'modal verb', 'to want (stronger)', 'muốn, cần'],
      ['吃', 'chi1', 'verb', 'to eat', 'ăn'],
      ['米饭', 'mi3 fan4', 'noun', 'cooked rice', 'cơm'],
      ['菜', 'cai4', 'noun', 'dish, vegetables', 'món ăn, rau'],
      ['水果', 'shui3 guo3', 'noun', 'fruit', 'hoa quả, trái cây'],
      ['苹果', 'ping2 guo3', 'noun', 'apple', 'quả táo'],
      ['好吃', 'hao3 chi1', 'adjective', 'delicious', 'ngon (đồ ăn)'],
      ['太', 'tai4', 'adverb', 'too, so (太…了)', 'quá (太…了: … quá!)']
    ],
    grammar: [
      {
        pattern: '想 + 动词',
        explanation: '“想”在动词前面，表示“想做什么”。',
        explanation_vi: '想 đứng trước động từ, diễn tả mong muốn: 我想吃米饭 = Tôi muốn ăn cơm.',
        examples: [
          ['我想吃米饭。', 'Wo3 xiang3 chi1 mi3 fan4.', 'I want to eat rice.', 'Mình muốn ăn cơm.'],
          ['你想吃什么？', 'Ni3 xiang3 chi1 shen2 me5?', 'What do you want to eat?', 'Bạn muốn ăn gì?'],
          ['我想去朋友家。', 'Wo3 xiang3 qu4 peng2 you5 jia1.', "I want to go to my friend's place.", 'Mình muốn đến nhà bạn mình chơi.']
        ]
      },
      {
        pattern: '太 + 形容词 + 了',
        explanation: '“太……了”表示程度很高：太好了！',
        explanation_vi: '太…了 diễn tả mức độ cao: 太好了! = Tuyệt quá!, 太好吃了! = Ngon quá!',
        examples: [
          ['太好了！', 'Tai4 hao3 le5!', 'Great!', 'Tuyệt quá!'],
          ['苹果太好吃了！', 'Ping2 guo3 tai4 hao3 chi1 le5!', 'The apples are so delicious!', 'Táo ngon quá đi mất!'],
          ['我太想吃水果了。', 'Wo3 tai4 xiang3 chi1 shui3 guo3 le5.', 'I really want to eat fruit.', 'Mình thèm ăn hoa quả quá.']
        ]
      }
    ],
    warmup: {
      items: ['你想吃什么？', '看图说词：米饭 / 菜 / 苹果。', '什么水果好吃？'],
      itemsVi: [
        'Bạn muốn ăn gì? Trả lời với 我想吃…',
        'Nhìn tranh và gọi tên: 米饭 (cơm) / 菜 (món ăn) / 苹果 (táo).',
        'Với bạn, hoa quả nào ngon nhất?'
      ]
    },
    dialogue: [
      ['A', '小明，中午你想吃什么？', 'Xiao3 Ming2, zhong1 wu3 ni3 xiang3 chi1 shen2 me5?', 'Xiaoming, what do you want to eat for lunch?', 'Tiểu Minh ơi, trưa nay bạn muốn ăn gì?'],
      ['B', '我想吃米饭和菜。你呢？', 'Wo3 xiang3 chi1 mi3 fan4 he2 cai4. Ni3 ne5?', 'I want rice and some dishes. And you?', 'Mình muốn ăn cơm với thức ăn. Còn bạn?'],
      ['A', '我要吃苹果。', 'Wo3 yao4 chi1 ping2 guo3.', 'I want to eat apples.', 'Mình muốn ăn táo cơ.'],
      ['B', '苹果不是饭！', 'Ping2 guo3 bu2 shi4 fan4!', 'Apples are not a meal!', 'Táo đâu phải là cơm!'],
      ['A', '苹果好吃，水果都好吃！', 'Ping2 guo3 hao3 chi1, shui3 guo3 dou1 hao3 chi1!', 'Apples are tasty — all fruit is tasty!', 'Táo ngon mà, hoa quả đều ngon hết!'],
      ['B', '好，我们吃米饭，也吃水果。', 'Hao3, wo3 men5 chi1 mi3 fan4, ye3 chi1 shui3 guo3.', "OK, let's have rice and fruit too.", 'Được rồi, chúng mình ăn cơm, rồi ăn cả hoa quả nữa.'],
      ['A', '太好了！我们去吃饭！', 'Tai4 hao3 le5! Wo3 men5 qu4 chi1 fan4!', "Great! Let's go eat!", 'Tuyệt quá! Đi ăn thôi!'],
      ['B', '好，走！', 'Hao3, zou3!', "OK, let's go!", 'Ừ, đi nào!']
    ],
    exercises: [
      ['fill_blank', 'remember', '中午你___吃什么？', 'Zhong1 wu3 ni3 ___ chi1 shen2 me5?', ['想', '是', '叫'], 0, ['muốn', 'là', 'tên là'], '问别人想吃什么，“想”在“吃”前面。', 'Hỏi mong muốn dùng 想 trước động từ: 你想吃什么? = Bạn muốn ăn gì?'],
      ['fill_blank', 'remember', '苹果不是___！', 'Ping2 guo3 bu2 shi4 ___!', ['饭', '水果', '菜'], 0, ['cơm/bữa ăn', 'hoa quả', 'món ăn'], '课文里说：“苹果不是饭！”', 'Trong bài: 苹果不是饭 (Táo đâu phải là cơm/bữa chính).'],
      ['multiple_choice', 'understand', '“太好了！”是什么意思？', '"Tai4 hao3 le5!" shi4 shen2 me5 yi4 si5?', ['很高兴', '不好', '再见'], 0, ['rất vui / tuyệt vời', 'không tốt', 'tạm biệt'], '“太……了”表示程度很高，“太好了”就是非常好。', '太…了 chỉ mức độ cao; 太好了 = tuyệt quá, thể hiện sự vui mừng.'],
      ['word_order', 'understand', ['我', '想', '吃', '米饭', '和', '菜'], 'wo3 / xiang3 / chi1 / mi3 fan4 / he2 / cai4', ['tôi', 'muốn', 'ăn', 'cơm', 'và', 'món ăn'], '我想吃米饭和菜。', 'Tôi muốn ăn cơm và thức ăn.', '“想”在动词“吃”前面：我想吃……', 'Trật tự: 我 + 想 + 吃 + tân ngữ. 想 luôn đứng trước động từ chính.'],
      ['listening_comprehension', 'understand', [4], '说话的人觉得什么好吃？', 'Shuo1 hua4 de5 ren2 jue2 de5 shen2 me5 hao3 chi1?', ['水果', '米饭', '菜'], 0, ['hoa quả', 'cơm', 'món ăn'], '他说“苹果好吃，水果都好吃”。', 'Người nói khen: 苹果好吃，水果都好吃 → thấy hoa quả ngon.'],
      ['true_false', 'understand', '他们中午只吃苹果。', 'Ta1 men5 zhong1 wu3 zhi3 chi1 ping2 guo3.', false, '他们说好吃米饭，也吃水果。', 'Sai. Hai người thống nhất ăn cơm và ăn thêm hoa quả, không phải chỉ ăn táo.'],
      ['reading_comprehension', 'understand', '小明中午想吃什么？', 'Xiao3 Ming2 zhong1 wu3 xiang3 chi1 shen2 me5?', ['米饭和菜', '苹果', '水果'], 0, ['cơm và thức ăn', 'táo', 'hoa quả'], '小明说：“我想吃米饭和菜。”', 'Tiểu Minh nói: 我想吃米饭和菜 → muốn ăn cơm với thức ăn.']
    ]
  },
  {
    slug: 'drink',
    titleZh: '喝水',
    titleEn: 'Drinks',
    titleVi: 'Đồ uống',
    summaryEn: 'A host invites a guest to sit down and offers tea and water; the guest finds the tea delicious.',
    summaryVi: 'Chủ nhà mời khách ngồi, mời trà và nước; vị khách khen trà rất ngon.',
    vocab: [
      ['请', 'qing3', 'verb', 'please; to invite', 'mời, xin mời'],
      ['坐', 'zuo4', 'verb', 'to sit', 'ngồi'],
      ['喝', 'he1', 'verb', 'to drink', 'uống'],
      ['水', 'shui3', 'noun', 'water', 'nước'],
      ['茶', 'cha2', 'noun', 'tea', 'trà'],
      ['杯', 'bei1', 'measure word', 'cup, glass (measure word)', 'cốc, ly (lượng từ)'],
      ['很', 'hen3', 'adverb', 'very', 'rất'],
      ['热', 're4', 'adjective', 'hot', 'nóng'],
      ['冷', 'leng3', 'adjective', 'cold', 'lạnh'],
      ['好喝', 'hao3 he1', 'adjective', 'tasty (drinks)', 'ngon (đồ uống)']
    ],
    grammar: [
      {
        pattern: '请 + 动词',
        explanation: '“请”放在前面，说话很客气：请坐、请喝茶。',
        explanation_vi: 'Đặt 请 (mời) trước động từ để nói lịch sự: 请坐 = mời ngồi, 请喝茶 = mời uống trà.',
        examples: [
          ['请坐！', 'Qing3 zuo4!', 'Please have a seat!', 'Mời bạn ngồi!'],
          ['请喝茶。', 'Qing3 he1 cha2.', 'Please have some tea.', 'Mời bạn uống trà.'],
          ['请说你的名字。', 'Qing3 shuo1 ni3 de5 ming2 zi5.', 'Please say your name.', 'Xin hãy nói tên của bạn.']
        ]
      },
      {
        pattern: '主语 + 很 + 形容词',
        explanation: '形容词前面常用“很”，不用“是”：茶很好喝。',
        explanation_vi: 'Câu tính từ dùng 很 trước tính từ, KHÔNG dùng 是: 茶很好喝 = Trà (rất) ngon.',
        examples: [
          ['茶很好喝。', 'Cha2 hen3 hao3 he1.', 'The tea is delicious.', 'Trà rất ngon.'],
          ['水很热。', 'Shui3 hen3 re4.', 'The water is hot.', 'Nước rất nóng.'],
          ['今天很冷。', 'Jin1 tian1 hen3 leng3.', 'It is cold today.', 'Hôm nay trời rất lạnh.']
        ]
      }
    ],
    warmup: {
      items: ['你想喝什么？', '说一说：热茶 / 冷水。', '客人来了，你说什么？'],
      itemsVi: [
        'Bạn muốn uống gì? Trả lời với 我想喝…',
        'Nói thử: 热茶 (trà nóng) / 冷水 (nước lạnh).',
        'Khách đến nhà, bạn sẽ mời thế nào? (Gợi ý: 请坐!)'
      ]
    },
    dialogue: [
      ['A', '李月，你好！请坐！', 'Li3 Yue4, ni3 hao3! Qing3 zuo4!', 'Hi, Li Yue! Please have a seat!', 'Chào Lý Nguyệt! Mời bạn ngồi!'],
      ['B', '谢谢！', 'Xie4 xie5!', 'Thanks!', 'Cảm ơn bạn!'],
      ['A', '你喝什么？茶还是水？', 'Ni3 he1 shen2 me5? Cha2 hai2 shi5 shui3?', 'What would you like to drink? Tea or water?', 'Bạn uống gì? Trà hay là nước?'],
      ['B', '我喝茶，谢谢。', 'Wo3 he1 cha2, xie4 xie5.', "I'll have tea, thanks.", 'Mình uống trà, cảm ơn bạn.'],
      ['A', '请喝茶。茶很热。', 'Qing3 he1 cha2. Cha2 hen3 re4.', 'Here is your tea. It is very hot.', 'Mời bạn uống trà. Trà nóng lắm đấy.'],
      ['B', '谢谢！你的茶很好喝。', 'Xie4 xie5! Ni3 de5 cha2 hen3 hao3 he1.', 'Thank you! Your tea is delicious.', 'Cảm ơn! Trà của bạn ngon thật.'],
      ['A', '你要水吗？', 'Ni3 yao4 shui3 ma5?', 'Do you want some water?', 'Bạn có muốn uống nước không?'],
      ['B', '好，我要一杯冷水，谢谢你！', 'Hao3, wo3 yao4 yi4 bei1 leng3 shui3, xie4 xie5 ni3!', 'Yes, a glass of cold water please. Thank you!', 'Ừ, cho mình một cốc nước lạnh nhé, cảm ơn bạn!'],
      ['A', '不客气，请喝水！', 'Bu2 ke4 qi5, qing3 he1 shui3!', "You're welcome — here is your water!", 'Không có gì, mời bạn uống nước!']
    ],
    exercises: [
      ['fill_blank', 'remember', '客人来了：“请___！”', 'Ke4 ren5 lai2 le5: "Qing3 ___!"', ['坐', '去', '睡觉'], 0, ['ngồi', 'đi', 'ngủ'], '客人来了，先说“请坐”。', 'Khách đến nhà, câu lịch sự đầu tiên là 请坐 (mời ngồi).'],
      ['fill_blank', 'remember', '我要一___冷水。', 'Wo3 yao4 yi4 ___ leng3 shui3.', ['杯', '口', '号'], 0, ['cốc (lượng từ)', 'khẩu', 'ngày/số'], '喝的东西用量词“杯”：一杯水、一杯茶。', 'Đồ uống dùng lượng từ 杯: 一杯水 = một cốc nước.'],
      ['multiple_choice', 'understand', '茶很好喝。“好喝”说的是什么？', 'Cha2 hen3 hao3 he1. "Hao3 he1" shuo1 de5 shi4 shen2 me5?', ['喝的东西', '吃的东西', '人'], 0, ['đồ uống', 'đồ ăn', 'con người'], '“好喝”说喝的东西，“好吃”说吃的东西。', '好喝 dùng cho đồ uống, còn 好吃 dùng cho đồ ăn.'],
      ['word_order', 'understand', ['你的', '茶', '很', '好喝'], 'ni3 de5 / cha2 / hen3 / hao3 he1', ['của bạn', 'trà', 'rất', 'ngon'], '你的茶很好喝。', 'Trà của bạn rất ngon.', '形容词前面用“很”，不用“是”。', 'Câu tính từ: 你的茶 + 很 + 好喝. Không dùng 是 trước tính từ.'],
      ['listening_comprehension', 'understand', [7], '她要喝什么？', 'Ta1 yao4 he1 shen2 me5?', ['一杯冷水', '一杯热茶', '一杯热水'], 0, ['một cốc nước lạnh', 'một cốc trà nóng', 'một cốc nước nóng'], '她说“我要一杯冷水”。', 'Câu nghe được: 我要一杯冷水 → một cốc nước lạnh.'],
      ['true_false', 'understand', '李月觉得茶不好喝。', 'Li3 Yue4 jue2 de5 cha2 bu4 hao3 he1.', false, '李月说：“你的茶很好喝。”', 'Sai. Lý Nguyệt khen: 你的茶很好喝 (Trà của bạn rất ngon).'],
      ['reading_comprehension', 'understand', '李月先喝了什么？', 'Li3 Yue4 xian1 he1 le5 shen2 me5?', ['茶', '冷水', '热水'], 0, ['trà', 'nước lạnh', 'nước nóng'], '她先说“我喝茶”，后来才要一杯冷水。', 'Đầu tiên bạn ấy chọn uống trà (我喝茶), sau đó mới xin thêm cốc nước lạnh.']
    ]
  },
  {
    slug: 'school',
    titleZh: '学校',
    titleEn: 'School',
    titleVi: 'Trường học',
    summaryEn: 'Li Yue is on her way to school; she describes her big, beautiful school and her small home.',
    summaryVi: 'Lý Nguyệt đang trên đường đến trường; bạn ấy kể về ngôi trường to đẹp và ngôi nhà nhỏ của mình.',
    vocab: [
      ['学校', 'xue2 xiao4', 'noun', 'school', 'trường học'],
      ['在', 'zai4', 'verb/preposition', 'to be at, in, on', 'ở, tại'],
      ['哪儿', 'na3r5', 'pronoun', 'where', 'ở đâu'],
      ['里', 'li3', 'noun', 'inside', 'trong, bên trong'],
      ['大', 'da4', 'adjective', 'big', 'to, lớn'],
      ['小', 'xiao3', 'adjective', 'small', 'nhỏ, bé'],
      ['漂亮', 'piao4 liang5', 'adjective', 'beautiful, pretty', 'đẹp'],
      ['多', 'duo1', 'adjective', 'many, much', 'nhiều'],
      ['北京', 'Bei3 jing1', 'proper noun', 'Beijing', 'Bắc Kinh']
    ],
    grammar: [
      {
        pattern: '主语 + 在 + 地方',
        explanation: '“在”说人或东西在什么地方：我的学校在北京。',
        explanation_vi: '在 chỉ vị trí: 我的学校在北京 = Trường tôi ở Bắc Kinh. Hỏi nơi chốn dùng 在哪儿?',
        examples: [
          ['你的学校在哪儿？', 'Ni3 de5 xue2 xiao4 zai4 na3r5?', 'Where is your school?', 'Trường của bạn ở đâu?'],
          ['我的学校在北京。', 'Wo3 de5 xue2 xiao4 zai4 Bei3 jing1.', 'My school is in Beijing.', 'Trường mình ở Bắc Kinh.'],
          ['我的朋友在家里。', 'Wo3 de5 peng2 you5 zai4 jia1 li3.', 'My friend is at home.', 'Bạn mình đang ở nhà.']
        ]
      },
      {
        pattern: '形容词谓语句：大 / 小 / 漂亮',
        explanation: '问“大吗？”，答“很大”或“不大”。',
        explanation_vi: 'Hỏi 大吗? (to không?), trả lời 很大 (rất to) hoặc 不大 (không to). Tính từ làm vị ngữ không cần 是.',
        examples: [
          ['你的学校大吗？', 'Ni3 de5 xue2 xiao4 da4 ma5?', 'Is your school big?', 'Trường bạn có to không?'],
          ['我的学校很大，也很漂亮。', 'Wo3 de5 xue2 xiao4 hen3 da4, ye3 hen3 piao4 liang5.', 'My school is big and beautiful.', 'Trường mình rất to và cũng rất đẹp.'],
          ['我的家不大，很小。', 'Wo3 de5 jia1 bu2 da4, hen3 xiao3.', 'My home is not big; it is small.', 'Nhà mình không to, nhỏ thôi.']
        ]
      }
    ],
    warmup: {
      items: ['你的学校在哪儿？', '你的学校大吗？', '学校里有什么？'],
      itemsVi: [
        'Trường của bạn ở đâu? Trả lời với …在…',
        'Trường bạn to hay nhỏ? (大 hay 小?)',
        'Trong trường có những gì? Kể thử vài thứ.'
      ]
    },
    dialogue: [
      ['A', '李月，你去哪儿？', 'Li3 Yue4, ni3 qu4 na3r5?', 'Li Yue, where are you going?', 'Lý Nguyệt, bạn đi đâu đấy?'],
      ['B', '我去学校。', 'Wo3 qu4 xue2 xiao4.', "I'm going to school.", 'Mình đến trường.'],
      ['A', '你的学校在哪儿？', 'Ni3 de5 xue2 xiao4 zai4 na3r5?', 'Where is your school?', 'Trường bạn ở đâu?'],
      ['B', '我的学校在北京。', 'Wo3 de5 xue2 xiao4 zai4 Bei3 jing1.', 'My school is in Beijing.', 'Trường mình ở Bắc Kinh.'],
      ['A', '你的学校大吗？', 'Ni3 de5 xue2 xiao4 da4 ma5?', 'Is your school big?', 'Trường bạn có to không?'],
      ['B', '很大，也很漂亮，学校里学生很多。', 'Hen3 da4, ye3 hen3 piao4 liang5, xue2 xiao4 li3 xue2 sheng5 hen3 duo1.', "It's big and beautiful, and there are a lot of students.", 'To lắm, lại đẹp nữa, trong trường có rất nhiều học sinh.'],
      ['A', '你的家大吗？', 'Ni3 de5 jia1 da4 ma5?', 'Is your home big?', 'Thế nhà bạn có to không?'],
      ['B', '我的家很小，我也很喜欢。', 'Wo3 de5 jia1 hen3 xiao3, wo3 ye3 hen3 xi3 huan5.', 'My home is small, but I love it anyway.', 'Nhà mình nhỏ thôi, nhưng mình vẫn rất thích.']
    ],
    exercises: [
      ['fill_blank', 'remember', '你的学校___哪儿？', 'Ni3 de5 xue2 xiao4 ___ na3r5?', ['在', '是', '有'], 0, ['ở/tại', 'là', 'có'], '问地方用“在哪儿”。', 'Hỏi vị trí dùng 在哪儿: 学校在哪儿? = Trường ở đâu?'],
      ['fill_blank', 'remember', '学校里学生很___。', 'Xue2 xiao4 li3 xue2 sheng5 hen3 ___.', ['多', '大', '小'], 0, ['nhiều', 'to', 'nhỏ'], '课文里说：“学校里学生很多。”', 'Trong bài: 学校里学生很多 (Trong trường có rất nhiều học sinh).'],
      ['multiple_choice', 'understand', 'A：你的学校大吗？ B：___', 'A: Ni3 de5 xue2 xiao4 da4 ma5? B: ___', ['很大，也很漂亮。', '在北京。', '我去学校。'], 0, ['Rất to, cũng rất đẹp.', 'Ở Bắc Kinh.', 'Mình đến trường.'], '“大吗”问大小，回答“很大”或“不大”。', 'Câu hỏi 大吗 hỏi về kích thước, nên trả lời 很大/不大, không trả lời địa điểm.'],
      ['word_order', 'understand', ['我的', '学校', '在', '北京'], 'wo3 de5 / xue2 xiao4 / zai4 / Bei3 jing1', ['của tôi', 'trường học', 'ở', 'Bắc Kinh'], '我的学校在北京。', 'Trường của tôi ở Bắc Kinh.', '“在”后面放地方：在北京。', 'Trật tự: chủ ngữ + 在 + địa điểm. 在 đứng trước nơi chốn.'],
      ['listening_comprehension', 'understand', [5], '她的学校怎么样？', 'Ta1 de5 xue2 xiao4 zen3 me5 yang4?', ['很大很漂亮', '很小', '不漂亮'], 0, ['rất to và đẹp', 'rất nhỏ', 'không đẹp'], '她说学校“很大，也很漂亮”。', 'Câu nghe được: 很大，也很漂亮 → trường vừa to vừa đẹp.'],
      ['true_false', 'understand', '李月的家很大。', 'Li3 Yue4 de5 jia1 hen3 da4.', false, '李月说：“我的家很小。”', 'Sai. Lý Nguyệt nói nhà mình rất nhỏ (我的家很小).'],
      ['reading_comprehension', 'understand', '李月去哪儿？', 'Li3 Yue4 qu4 na3r5?', ['学校', '北京朋友家', '商店'], 0, ['trường học', 'nhà bạn ở Bắc Kinh', 'cửa hàng'], '对话开始李月说：“我去学校。”', 'Mở đầu hội thoại, Lý Nguyệt nói: 我去学校 (Mình đến trường).']
    ]
  },
  {
    slug: 'class',
    titleZh: '上课',
    titleEn: 'Class',
    titleVi: 'Giờ học',
    summaryEn: 'Two students talk about their Chinese class: listening, speaking, reading and writing characters.',
    summaryVi: 'Hai học sinh nói về giờ học tiếng Trung: nghe, nói, đọc và viết chữ Hán.',
    vocab: [
      ['上课', 'shang4 ke4', 'verb phrase', 'to attend class', 'vào học, lên lớp'],
      ['课', 'ke4', 'noun', 'class, lesson', 'tiết học, môn học'],
      ['汉语', 'Han4 yu3', 'noun', 'Chinese language', 'tiếng Hán, tiếng Trung'],
      ['会', 'hui4', 'modal verb', 'can, to know how to', 'biết (làm gì đó)'],
      ['说', 'shuo1', 'verb', 'to speak, to say', 'nói'],
      ['听', 'ting1', 'verb', 'to listen', 'nghe'],
      ['读', 'du2', 'verb', 'to read (aloud)', 'đọc'],
      ['写', 'xie3', 'verb', 'to write', 'viết'],
      ['汉字', 'Han4 zi4', 'noun', 'Chinese characters', 'chữ Hán'],
      ['一点儿', 'yi4 dian3r5', 'phrase', 'a little', 'một chút, một ít']
    ],
    grammar: [
      {
        pattern: '会 + 动词',
        explanation: '“会”表示学了以后能做：我会说汉语。',
        explanation_vi: '会 chỉ kỹ năng học được: 我会说汉语 = Tôi biết nói tiếng Trung. Phủ định: 不会.',
        examples: [
          ['我会说汉语。', 'Wo3 hui4 shuo1 Han4 yu3.', 'I can speak Chinese.', 'Mình biết nói tiếng Trung.'],
          ['你会写汉字吗？', 'Ni3 hui4 xie3 Han4 zi4 ma5?', 'Can you write Chinese characters?', 'Bạn biết viết chữ Hán không?'],
          ['我不会做饭。', 'Wo3 bu2 hui4 zuo4 fan4.', "I can't cook.", 'Mình không biết nấu ăn.']
        ]
      },
      {
        pattern: '动词 + 一点儿',
        explanation: '“一点儿”表示不多：我会说一点儿汉语。',
        explanation_vi: '一点儿 = một chút: 我会说一点儿汉语 = Tôi biết nói một chút tiếng Trung.',
        examples: [
          ['我会说一点儿汉语。', 'Wo3 hui4 shuo1 yi4 dian3r5 Han4 yu3.', 'I can speak a little Chinese.', 'Mình nói được một chút tiếng Trung.'],
          ['我想喝一点儿水。', 'Wo3 xiang3 he1 yi4 dian3r5 shui3.', 'I want to drink a little water.', 'Mình muốn uống một chút nước.'],
          ['我们吃一点儿水果。', 'Wo3 men5 chi1 yi4 dian3r5 shui3 guo3.', "Let's eat some fruit.", 'Chúng mình ăn chút hoa quả đi.']
        ]
      }
    ],
    warmup: {
      items: ['你上午有课吗？', '你会说汉语吗？', '说一说：听、说、读、写。'],
      itemsVi: [
        'Sáng nay bạn có tiết học không?',
        'Bạn biết nói tiếng Trung chưa? Trả lời với 会 hoặc 不会.',
        'Đọc to bốn kỹ năng: 听 (nghe), 说 (nói), 读 (đọc), 写 (viết).'
      ]
    },
    dialogue: [
      ['A', '李月，上午你有课吗？', 'Li3 Yue4, shang4 wu3 ni3 you3 ke4 ma5?', 'Li Yue, do you have class this morning?', 'Lý Nguyệt, sáng nay bạn có tiết không?'],
      ['B', '有，我有汉语课。', 'You3, wo3 you3 Han4 yu3 ke4.', 'Yes, I have Chinese class.', 'Có, mình có tiết tiếng Trung.'],
      ['A', '你会说汉语吗？', 'Ni3 hui4 shuo1 Han4 yu3 ma5?', 'Can you speak Chinese?', 'Bạn biết nói tiếng Trung không?'],
      ['B', '我会说一点儿。', 'Wo3 hui4 shuo1 yi4 dian3r5.', 'I can speak a little.', 'Mình nói được một chút.'],
      ['A', '上课的时候，你们做什么？', 'Shang4 ke4 de5 shi2 hou5, ni3 men5 zuo4 shen2 me5?', 'What do you do in class?', 'Trong giờ học các bạn làm những gì?'],
      ['B', '老师请我们听、说、读、写。', 'Lao3 shi1 qing3 wo3 men5 ting1, shuo1, du2, xie3.', 'The teacher has us listen, speak, read and write.', 'Cô giáo cho bọn mình nghe, nói, đọc và viết.'],
      ['A', '你会写汉字吗？', 'Ni3 hui4 xie3 Han4 zi4 ma5?', 'Can you write Chinese characters?', 'Bạn biết viết chữ Hán không?'],
      ['B', '会写一点儿，你看！', 'Hui4 xie3 yi4 dian3r5, ni3 kan4!', 'I can write a little — look!', 'Biết viết một chút, bạn xem này!']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___说一点儿汉语。', 'Wo3 ___ shuo1 yi4 dian3r5 Han4 yu3.', ['会', '在', '很'], 0, ['biết', 'ở', 'rất'], '学了以后能做的事用“会”：会说、会写。', 'Kỹ năng học được dùng 会: 会说 (biết nói), 会写 (biết viết).'],
      ['fill_blank', 'remember', '上午我有汉语___。', 'Shang4 wu3 wo3 you3 Han4 yu3 ___.', ['课', '字', '书'], 0, ['tiết học', 'chữ', 'sách'], '课文里说：“我有汉语课。”', 'Trong bài: 我有汉语课 (Mình có tiết tiếng Trung).'],
      ['multiple_choice', 'understand', '上课的时候，老师请学生做什么？', 'Shang4 ke4 de5 shi2 hou5, lao3 shi1 qing3 xue2 sheng5 zuo4 shen2 me5?', ['听、说、读、写', '吃饭、喝茶', '睡觉'], 0, ['nghe, nói, đọc, viết', 'ăn cơm, uống trà', 'ngủ'], '课文里说老师请他们听、说、读、写。', 'Trong bài: 老师请我们听、说、读、写 → luyện bốn kỹ năng.'],
      ['word_order', 'understand', ['你', '会', '写', '汉字', '吗'], 'ni3 / hui4 / xie3 / Han4 zi4 / ma5', ['bạn', 'biết', 'viết', 'chữ Hán', 'không'], '你会写汉字吗？', 'Bạn biết viết chữ Hán không?', '“会”在动词“写”前面，“吗”在句子最后。', 'Trật tự: 你 + 会 + 写 + 汉字 + 吗. 会 trước động từ, 吗 cuối câu.'],
      ['listening_comprehension', 'understand', [3], '她汉语说得怎么样？', 'Ta1 Han4 yu3 shuo1 de5 zen3 me5 yang4?', ['会说一点儿', '说得很好', '不会说'], 0, ['nói được một chút', 'nói rất giỏi', 'không biết nói'], '她说“我会说一点儿”。', 'Câu nghe được: 我会说一点儿 → mới nói được một chút.'],
      ['true_false', 'understand', '李月上午有汉语课。', 'Li3 Yue4 shang4 wu3 you3 Han4 yu3 ke4.', true, '李月说：“有，我有汉语课。”', 'Đúng. Lý Nguyệt xác nhận sáng có tiết tiếng Trung (我有汉语课).'],
      ['reading_comprehension', 'understand', '李月会写汉字吗？', 'Li3 Yue4 hui4 xie3 Han4 zi4 ma5?', ['会写一点儿', '不会写', '写得很多'], 0, ['biết viết một chút', 'không biết viết', 'viết được rất nhiều'], '她说：“会写一点儿，你看！”', 'Cuối bài, bạn ấy nói: 会写一点儿 (biết viết một chút) rồi khoe chữ mình viết.']
    ]
  },
  {
    slug: 'book',
    titleZh: '看书',
    titleEn: 'Books',
    titleVi: 'Đọc sách',
    summaryEn: 'Li Yue is reading a Chinese book; the friends talk about borrowing books and the bookstore at school.',
    summaryVi: 'Lý Nguyệt đang đọc một cuốn sách tiếng Trung; hai bạn nói về sách và hiệu sách trong trường.',
    vocab: [
      ['看', 'kan4', 'verb', 'to look, to read', 'xem, đọc'],
      ['书', 'shu1', 'noun', 'book', 'sách'],
      ['喜欢', 'xi3 huan5', 'verb', 'to like', 'thích'],
      ['这', 'zhe4', 'pronoun', 'this', 'này, cái này'],
      ['那', 'na4', 'pronoun', 'that', 'kia, cái kia'],
      ['本', 'ben3', 'measure word', 'measure word for books', 'quyển, cuốn (lượng từ)'],
      ['买', 'mai3', 'verb', 'to buy', 'mua'],
      ['书店', 'shu1 dian4', 'noun', 'bookstore', 'hiệu sách'],
      ['中文', 'Zhong1 wen2', 'noun', 'Chinese (language)', 'tiếng Trung, Trung văn']
    ],
    grammar: [
      {
        pattern: '在 + 动词（正在做）',
        explanation: '“在”加动词，表示现在正在做：我在看书。',
        explanation_vi: '在 + động từ diễn tả hành động đang diễn ra: 我在看书 = Tôi đang đọc sách.',
        examples: [
          ['我在看书。', 'Wo3 zai4 kan4 shu1.', 'I am reading.', 'Mình đang đọc sách.'],
          ['妈妈在做饭。', 'Ma1 ma5 zai4 zuo4 fan4.', 'Mom is cooking.', 'Mẹ đang nấu cơm.'],
          ['他在写汉字。', 'Ta1 zai4 xie3 Han4 zi4.', 'He is writing characters.', 'Cậu ấy đang viết chữ Hán.']
        ]
      },
      {
        pattern: '这/那 + 本 + 书',
        explanation: '“这、那”后面用量词：这本书、那本书。',
        explanation_vi: 'Sau 这 (này)/那 (kia) cần lượng từ: 这本书 = cuốn sách này, 那本书 = cuốn sách kia.',
        examples: [
          ['这本书很好。', 'Zhe4 ben3 shu1 hen3 hao3.', 'This book is very good.', 'Cuốn sách này rất hay.'],
          ['那本书是谁的？', 'Na4 ben3 shu1 shi4 shei2 de5?', 'Whose book is that?', 'Cuốn sách kia là của ai?'],
          ['我想买一本中文书。', 'Wo3 xiang3 mai3 yi4 ben3 Zhong1 wen2 shu1.', 'I want to buy a Chinese book.', 'Mình muốn mua một cuốn sách tiếng Trung.']
        ]
      }
    ],
    warmup: {
      items: ['你喜欢看书吗？', '你在看什么书？', '书店在哪儿？'],
      itemsVi: [
        'Bạn có thích đọc sách không? (喜欢 hay 不喜欢?)',
        'Dạo này bạn đang đọc cuốn sách gì?',
        'Hiệu sách gần bạn nằm ở đâu?'
      ]
    },
    dialogue: [
      ['A', '李月，你在做什么？', 'Li3 Yue4, ni3 zai4 zuo4 shen2 me5?', 'Li Yue, what are you doing?', 'Lý Nguyệt, bạn đang làm gì đấy?'],
      ['B', '我在看书。', 'Wo3 zai4 kan4 shu1.', "I'm reading.", 'Mình đang đọc sách.'],
      ['A', '你喜欢看什么书？', 'Ni3 xi3 huan5 kan4 shen2 me5 shu1?', 'What books do you like to read?', 'Bạn thích đọc loại sách gì?'],
      ['B', '我喜欢看中文书。这本书很好。', 'Wo3 xi3 huan5 kan4 Zhong1 wen2 shu1. Zhe4 ben3 shu1 hen3 hao3.', 'I like Chinese books. This one is really good.', 'Mình thích đọc sách tiếng Trung. Cuốn này hay lắm.'],
      ['A', '那本书是谁的？', 'Na4 ben3 shu1 shi4 shei2 de5?', 'Whose book is that one?', 'Thế cuốn kia là của ai?'],
      ['B', '是老师的。', 'Shi4 lao3 shi1 de5.', "It's the teacher's.", 'Của cô giáo đấy.'],
      ['A', '我也想买一本中文书。书店在哪儿？', 'Wo3 ye3 xiang3 mai3 yi4 ben3 Zhong1 wen2 shu1. Shu1 dian4 zai4 na3r5?', "I'd like to buy a Chinese book too. Where is the bookstore?", 'Mình cũng muốn mua một cuốn sách tiếng Trung. Hiệu sách ở đâu nhỉ?'],
      ['B', '在学校里，我们一起去！', 'Zai4 xue2 xiao4 li3, wo3 men5 yi4 qi3 qu4!', "It's inside the school. Let's go together!", 'Ở ngay trong trường, chúng mình cùng đi nào!']
    ],
    exercises: [
      ['fill_blank', 'remember', '我___看书。', 'Wo3 ___ kan4 shu1.', ['在', '会', '要'], 0, ['đang', 'biết', 'muốn/cần'], '“在看书”表示现在正在看书。', '在 + động từ = đang làm gì: 我在看书 = Tôi đang đọc sách.'],
      ['fill_blank', 'remember', '我想买一___中文书。', 'Wo3 xiang3 mai3 yi4 ___ Zhong1 wen2 shu1.', ['本', '杯', '口'], 0, ['quyển (lượng từ sách)', 'cốc', 'khẩu'], '书的量词是“本”：一本书。', 'Sách dùng lượng từ 本: 一本书 = một cuốn sách.'],
      ['multiple_choice', 'understand', '“那本书是谁的？”问的是什么？', '"Na4 ben3 shu1 shi4 shei2 de5?" wen4 de5 shi4 shen2 me5?', ['书是谁的', '书好不好', '书在哪儿'], 0, ['sách của ai', 'sách hay không', 'sách ở đâu'], '“谁的”问东西是谁的。', '谁的 hỏi về chủ sở hữu: cuốn sách kia của ai?'],
      ['word_order', 'understand', ['我', '喜欢', '看', '中文', '书'], 'wo3 / xi3 huan5 / kan4 / Zhong1 wen2 / shu1', ['tôi', 'thích', 'đọc', 'tiếng Trung', 'sách'], '我喜欢看中文书。', 'Tôi thích đọc sách tiếng Trung.', '“喜欢”后面放动词“看”和东西。', 'Trật tự: 我 + 喜欢 + 看 + 中文书. Sau 喜欢 là động từ + tân ngữ.'],
      ['listening_comprehension', 'understand', [3], '她觉得这本书怎么样？', 'Ta1 jue2 de5 zhe4 ben3 shu1 zen3 me5 yang4?', ['很好', '不好', '太小'], 0, ['rất hay', 'không hay', 'quá nhỏ'], '她说“这本书很好”。', 'Câu nghe được: 这本书很好 → cuốn sách này rất hay.'],
      ['true_false', 'understand', '那本书是李月的。', 'Na4 ben3 shu1 shi4 Li3 Yue4 de5.', false, '李月说那本书“是老师的”。', 'Sai. Cuốn sách kia là của cô giáo (是老师的), không phải của Lý Nguyệt.'],
      ['reading_comprehension', 'understand', '书店在哪儿？', 'Shu1 dian4 zai4 na3r5?', ['学校里', '朋友家', '北京'], 0, ['trong trường', 'nhà bạn', 'Bắc Kinh'], '李月说书店“在学校里”。', 'Cuối bài: 书店在学校里 → hiệu sách nằm ngay trong trường.']
    ]
  },
  {
    slug: 'shopping',
    titleZh: '买东西',
    titleEn: 'Shopping',
    titleVi: 'Mua sắm',
    summaryEn: 'Two friends plan an afternoon shopping trip for clothes, apples, tea and a cup.',
    summaryVi: 'Hai người bạn hẹn buổi chiều đi mua quần áo, táo, trà và một chiếc cốc.',
    vocab: [
      ['商店', 'shang1 dian4', 'noun', 'shop, store', 'cửa hàng'],
      ['东西', 'dong1 xi5', 'noun', 'thing, stuff', 'đồ, đồ đạc'],
      ['衣服', 'yi1 fu5', 'noun', 'clothes', 'quần áo'],
      ['件', 'jian4', 'measure word', 'measure word for clothes', 'chiếc, cái (lượng từ quần áo)'],
      ['杯子', 'bei1 zi5', 'noun', 'cup, glass', 'cái cốc, cái ly'],
      ['见', 'jian4', 'verb', 'to see, to meet', 'gặp']
    ],
    grammar: [
      {
        pattern: '去 + 地方 + 做什么',
        explanation: '先说去哪儿，再说做什么：我去商店买东西。',
        explanation_vi: 'Nói đi đâu trước, làm gì sau: 我去商店买东西 = Tôi đến cửa hàng mua đồ.',
        examples: [
          ['我去商店买东西。', 'Wo3 qu4 shang1 dian4 mai3 dong1 xi5.', "I'm going to the store to buy things.", 'Mình đến cửa hàng mua đồ.'],
          ['他去书店买书。', 'Ta1 qu4 shu1 dian4 mai3 shu1.', 'He goes to the bookstore to buy books.', 'Cậu ấy đến hiệu sách mua sách.'],
          ['我们去朋友家吃饭。', 'Wo3 men5 qu4 peng2 you5 jia1 chi1 fan4.', "We're going to a friend's home for dinner.", 'Chúng mình đến nhà bạn ăn cơm.']
        ]
      },
      {
        pattern: '数字 + 量词 + 名词',
        explanation: '买东西要用量词：一件衣服、一个杯子。',
        explanation_vi: 'Mua bán cần lượng từ đúng: 一件衣服 = một chiếc áo, 一个杯子 = một cái cốc.',
        examples: [
          ['我想买一件衣服。', 'Wo3 xiang3 mai3 yi2 jian4 yi1 fu5.', 'I want to buy a piece of clothing.', 'Mình muốn mua một bộ quần áo.'],
          ['我要买一个杯子。', 'Wo3 yao4 mai3 yi2 ge4 bei1 zi5.', 'I want to buy a cup.', 'Mình cần mua một cái cốc.'],
          ['妈妈买了五个苹果。', 'Ma1 ma5 mai3 le5 wu3 ge4 ping2 guo3.', 'Mom bought five apples.', 'Mẹ mua năm quả táo.']
        ]
      }
    ],
    warmup: {
      items: ['你想买什么？', '看图说词：衣服 / 杯子 / 苹果。', '商店里有什么？'],
      itemsVi: [
        'Bạn đang muốn mua gì? Trả lời với 我想买…',
        'Nhìn tranh gọi tên: 衣服 (quần áo) / 杯子 (cốc) / 苹果 (táo).',
        'Trong cửa hàng thường có bán những gì?'
      ]
    },
    dialogue: [
      ['A', '李月，下午我去商店买东西，你去吗？', 'Li3 Yue4, xia4 wu3 wo3 qu4 shang1 dian4 mai3 dong1 xi5, ni3 qu4 ma5?', "Li Yue, I'm going shopping this afternoon. Are you coming?", 'Lý Nguyệt ơi, chiều mình đi cửa hàng mua đồ, bạn đi không?'],
      ['B', '去！我想买一件衣服。', 'Qu4! Wo3 xiang3 mai3 yi2 jian4 yi1 fu5.', "Sure! I'd like to buy some clothes.", 'Đi chứ! Mình muốn mua một bộ quần áo.'],
      ['A', '我要买苹果和茶。', 'Wo3 yao4 mai3 ping2 guo3 he2 cha2.', 'I need to buy apples and tea.', 'Mình cần mua táo và trà.'],
      ['B', '我也想买一个杯子。', 'Wo3 ye3 xiang3 mai3 yi2 ge4 bei1 zi5.', "I'd also like to buy a cup.", 'Mình còn muốn mua thêm một cái cốc nữa.'],
      ['A', '那个商店大吗？', 'Na4 ge5 shang1 dian4 da4 ma5?', 'Is that store big?', 'Cửa hàng đó có to không?'],
      ['B', '很大，东西很多。', 'Hen3 da4, dong1 xi5 hen3 duo1.', "It's big, and they have lots of stuff.", 'To lắm, đồ đạc rất nhiều.'],
      ['A', '好，我们下午三点去。', 'Hao3, wo3 men5 xia4 wu3 san1 dian3 qu4.', "OK, let's go at three this afternoon.", 'Vậy ba giờ chiều chúng mình đi nhé.'],
      ['B', '好的，下午见！', 'Hao3 de5, xia4 wu3 jian4!', 'OK, see you this afternoon!', 'Ừ, hẹn gặp chiều nay!']
    ],
    exercises: [
      ['fill_blank', 'remember', '我去商店买___。', 'Wo3 qu4 shang1 dian4 mai3 ___.', ['东西', '朋友', '学校'], 0, ['đồ đạc', 'bạn bè', 'trường học'], '“买东西”就是去商店买。', 'Cụm 买东西 = mua đồ, mua sắm.'],
      ['fill_blank', 'remember', '我想买一___衣服。', 'Wo3 xiang3 mai3 yi2 ___ yi1 fu5.', ['件', '本', '杯'], 0, ['chiếc (lượng từ quần áo)', 'quyển', 'cốc'], '衣服的量词是“件”：一件衣服。', 'Quần áo dùng lượng từ 件: 一件衣服.'],
      ['multiple_choice', 'understand', '他们什么时候去商店？', 'Ta1 men5 shen2 me5 shi2 hou5 qu4 shang1 dian4?', ['下午三点', '上午三点', '晚上三点'], 0, ['3 giờ chiều', '3 giờ sáng', '3 giờ tối'], '对话里说：“我们下午三点去。”', 'Trong bài: 我们下午三点去 → hẹn 3 giờ chiều.'],
      ['word_order', 'understand', ['我', '去', '商店', '买', '东西'], 'wo3 / qu4 / shang1 dian4 / mai3 / dong1 xi5', ['tôi', 'đi', 'cửa hàng', 'mua', 'đồ'], '我去商店买东西。', 'Tôi đến cửa hàng mua đồ.', '先说“去商店”，再说“买东西”。', 'Trật tự: 去 + nơi chốn + hành động. Đi đâu nói trước, làm gì nói sau.'],
      ['listening_comprehension', 'understand', [1], '她想买什么？', 'Ta1 xiang3 mai3 shen2 me5?', ['一件衣服', '一个杯子', '苹果和茶'], 0, ['một bộ quần áo', 'một cái cốc', 'táo và trà'], '她说“我想买一件衣服”。', 'Câu nghe được: 我想买一件衣服 → muốn mua quần áo.'],
      ['true_false', 'understand', '那个商店很小，东西不多。', 'Na4 ge5 shang1 dian4 hen3 xiao3, dong1 xi5 bu4 duo1.', false, '李月说商店“很大，东西很多”。', 'Sai. Cửa hàng rất to và nhiều đồ (很大，东西很多).'],
      ['reading_comprehension', 'understand', '谁要买苹果和茶？', 'Shei2 yao4 mai3 ping2 guo3 he2 cha2?', ['问“你去吗”的人', '李月', '老师'], 0, ['người rủ đi mua đồ', 'Lý Nguyệt', 'cô giáo'], 'A说：“我要买苹果和茶。”', 'Người rủ đi (A) nói: 我要买苹果和茶; còn Lý Nguyệt mua quần áo và cốc.']
    ]
  },
  {
    slug: 'money',
    titleZh: '钱',
    titleEn: 'Money',
    titleVi: 'Tiền bạc',
    summaryEn: 'A customer bargains for apples at a market stall: from three kuai each down to two and a half.',
    summaryVi: 'Một khách hàng mặc cả mua táo ở chợ: từ ba tệ một quả xuống còn hai tệ rưỡi.',
    vocab: [
      ['钱', 'qian2', 'noun', 'money', 'tiền'],
      ['多少钱', 'duo1 shao5 qian2', 'phrase', 'how much (money)', 'bao nhiêu tiền'],
      ['块', 'kuai4', 'measure word', 'kuai (unit of money)', 'tệ, đồng (đơn vị tiền)'],
      ['两', 'liang3', 'numeral', 'two (before measure words)', 'hai (dùng trước lượng từ)'],
      ['贵', 'gui4', 'adjective', 'expensive', 'đắt'],
      ['给', 'gei3', 'verb', 'to give', 'đưa, cho']
    ],
    grammar: [
      {
        pattern: '……多少钱？',
        explanation: '问价钱说“多少钱”：苹果多少钱一个？',
        explanation_vi: 'Hỏi giá dùng 多少钱: 苹果多少钱一个? = Táo bao nhiêu tiền một quả?',
        examples: [
          ['苹果多少钱一个？', 'Ping2 guo3 duo1 shao5 qian2 yi2 ge4?', 'How much is one apple?', 'Táo bao nhiêu tiền một quả?'],
          ['这件衣服多少钱？', 'Zhe4 jian4 yi1 fu5 duo1 shao5 qian2?', 'How much is this piece of clothing?', 'Bộ quần áo này giá bao nhiêu?'],
          ['一杯茶多少钱？', 'Yi4 bei1 cha2 duo1 shao5 qian2?', 'How much is a cup of tea?', 'Một cốc trà bao nhiêu tiền?']
        ]
      },
      {
        pattern: '太贵了 / 两 + 量词',
        explanation: '觉得贵说“太贵了”；数字2在量词前面说“两”：两块、两个。',
        explanation_vi: 'Chê đắt nói 太贵了 (đắt quá); số 2 đứng trước lượng từ phải dùng 两 (không dùng 二): 两块 = 2 tệ.',
        examples: [
          ['太贵了！', 'Tai4 gui4 le5!', 'Too expensive!', 'Đắt quá!'],
          ['两块，好吗？', 'Liang3 kuai4, hao3 ma5?', 'Two kuai, OK?', 'Hai tệ thôi, được không?'],
          ['我买两个苹果。', 'Wo3 mai3 liang3 ge4 ping2 guo3.', "I'll buy two apples.", 'Tôi mua hai quả táo.']
        ]
      }
    ],
    warmup: {
      items: ['苹果多少钱一个？', '说数字：两块 / 五块 / 十块。', '什么东西很贵？'],
      itemsVi: [
        'Tập hỏi giá: 苹果多少钱一个? (Táo bao nhiêu một quả?)',
        'Đọc to các mức giá: 两块 (2 tệ) / 五块 (5 tệ) / 十块 (10 tệ).',
        'Theo bạn, món đồ nào đắt (贵)?'
      ]
    },
    dialogue: [
      ['A', '你好，苹果多少钱一个？', 'Ni3 hao3, ping2 guo3 duo1 shao5 qian2 yi2 ge4?', 'Hello, how much is one apple?', 'Chào chị, táo bao nhiêu tiền một quả ạ?'],
      ['B', '三块钱一个。', 'San1 kuai4 qian2 yi2 ge4.', 'Three kuai each.', 'Ba tệ một quả.'],
      ['A', '太贵了！两块，好吗？', 'Tai4 gui4 le5! Liang3 kuai4, hao3 ma5?', 'Too expensive! How about two kuai?', 'Đắt quá! Hai tệ được không chị?'],
      ['B', '两块不好，两块五。', 'Liang3 kuai4 bu4 hao3, liang3 kuai4 wu3.', 'Two is too low — two fifty.', 'Hai tệ thì không được, hai tệ rưỡi nhé.'],
      ['A', '好，我买四个。', 'Hao3, wo3 mai3 si4 ge4.', "OK, I'll take four.", 'Được ạ, cháu mua bốn quả.'],
      ['B', '四个十块钱。', 'Si4 ge4 shi2 kuai4 qian2.', 'Four is ten kuai.', 'Bốn quả là mười tệ.'],
      ['A', '好的，给你十块钱。', 'Hao3 de5, gei3 ni3 shi2 kuai4 qian2.', 'All right, here are ten kuai.', 'Vâng, gửi chị mười tệ ạ.'],
      ['B', '谢谢！给你苹果，再见！', 'Xie4 xie5! Gei3 ni3 ping2 guo3, zai4 jian4!', 'Thanks! Here are your apples. Goodbye!', 'Cảm ơn! Táo của cháu đây, hẹn gặp lại!']
    ],
    exercises: [
      ['fill_blank', 'remember', '苹果___钱一个？', 'Ping2 guo3 ___ qian2 yi2 ge4?', ['多少', '几', '谁'], 0, ['bao nhiêu', 'mấy', 'ai'], '问价钱用“多少钱”。', 'Hỏi giá tiền dùng 多少钱, không dùng 几钱.'],
      ['fill_blank', 'remember', '___块，好吗？', '___ kuai4, hao3 ma5?', ['两', '二', '口'], 0, ['hai (两)', 'hai (二)', 'khẩu'], '量词前面用“两”，不用“二”：两块。', 'Trước lượng từ dùng 两: 两块 (2 tệ), không nói 二块.'],
      ['multiple_choice', 'understand', '东西很贵，你可以说什么？', 'Dong1 xi5 hen3 gui4, ni3 ke3 yi3 shuo1 shen2 me5?', ['太贵了！', '太好了！', '再见！'], 0, ['Đắt quá!', 'Tuyệt quá!', 'Tạm biệt!'], '觉得贵的时候说“太贵了”。', 'Muốn mặc cả, chê giá cao thì nói 太贵了 (Đắt quá!).'],
      ['word_order', 'understand', ['苹果', '多少钱', '一个'], 'ping2 guo3 / duo1 shao5 qian2 / yi2 ge4', ['táo', 'bao nhiêu tiền', 'một quả'], '苹果多少钱一个？', 'Táo bao nhiêu tiền một quả?', '先说东西，再问“多少钱一个”。', 'Trật tự hỏi giá: tên hàng + 多少钱 + 一个 (đơn vị).'],
      ['listening_comprehension', 'understand', [1, 2, 3], '苹果最后多少钱一个？', 'Ping2 guo3 zui4 hou4 duo1 shao5 qian2 yi2 ge4?', ['两块五', '三块', '两块'], 0, ['2 tệ rưỡi', '3 tệ', '2 tệ'], '卖苹果的人说“两块不好，两块五”。', 'Sau khi mặc cả, người bán chốt giá 两块五 (2,5 tệ một quả).'],
      ['true_false', 'understand', '他买了四个苹果。', 'Ta1 mai3 le5 si4 ge4 ping2 guo3.', true, '他说：“好，我买四个。”', 'Đúng. Người mua nói: 我买四个 (mua bốn quả), hết mười tệ.'],
      ['reading_comprehension', 'understand', '四个苹果多少钱？', 'Si4 ge4 ping2 guo3 duo1 shao5 qian2?', ['十块', '四块', '十二块'], 0, ['mười tệ', 'bốn tệ', 'mười hai tệ'], '卖苹果的人说：“四个十块钱。”', 'Người bán nói: 四个十块钱 → bốn quả mười tệ (2,5 tệ × 4).']
    ]
  },
  {
    slug: 'weather',
    titleZh: '天气',
    titleEn: 'Weather',
    titleVi: 'Thời tiết',
    summaryEn: 'Two friends talk about today\'s cold rainy weather, tomorrow\'s nicer forecast, and snow in Beijing.',
    summaryVi: 'Hai người bạn nói về trời lạnh và mưa hôm nay, thời tiết đẹp ngày mai, và tuyết rơi ở Bắc Kinh.',
    vocab: [
      ['天气', 'tian1 qi4', 'noun', 'weather', 'thời tiết'],
      ['怎么样', 'zen3 me5 yang4', 'pronoun', 'how, how about', 'thế nào'],
      ['冷', 'leng3', 'adjective', 'cold', 'lạnh'],
      ['下雨', 'xia4 yu3', 'verb phrase', 'to rain', 'mưa, trời mưa'],
      ['下雪', 'xia4 xue3', 'verb phrase', 'to snow', 'tuyết rơi, có tuyết']
    ],
    grammar: [
      {
        pattern: '……怎么样？',
        explanation: '“怎么样”问情况：今天天气怎么样？',
        explanation_vi: '怎么样 hỏi tình hình, đánh giá: 今天天气怎么样? = Thời tiết hôm nay thế nào?',
        examples: [
          ['今天天气怎么样？', 'Jin1 tian1 tian1 qi4 zen3 me5 yang4?', 'How is the weather today?', 'Thời tiết hôm nay thế nào?'],
          ['这本书怎么样？', 'Zhe4 ben3 shu1 zen3 me5 yang4?', 'How is this book?', 'Cuốn sách này thế nào?'],
          ['你的学校怎么样？', 'Ni3 de5 xue2 xiao4 zen3 me5 yang4?', 'How is your school?', 'Trường của bạn thế nào?']
        ]
      },
      {
        pattern: '会 + 动词（可能）',
        explanation: '“会”也表示“可能发生”：下午会下雨。',
        explanation_vi: '会 còn diễn tả khả năng sẽ xảy ra: 下午会下雨 = Chiều nay trời sẽ mưa.',
        examples: [
          ['下午会下雨。', 'Xia4 wu3 hui4 xia4 yu3.', 'It will rain this afternoon.', 'Chiều nay trời sẽ mưa.'],
          ['明天会很冷。', 'Ming2 tian1 hui4 hen3 leng3.', 'It will be cold tomorrow.', 'Ngày mai trời sẽ rất lạnh.'],
          ['北京会下雪吗？', 'Bei3 jing1 hui4 xia4 xue3 ma5?', 'Will it snow in Beijing?', 'Bắc Kinh có tuyết rơi không?']
        ]
      }
    ],
    warmup: {
      items: ['今天天气怎么样？', '说一说：下雨 / 下雪 / 很冷。', '你喜欢冷天气吗？'],
      itemsVi: [
        'Thời tiết hôm nay thế nào? Trả lời với 很…',
        'Nói thử: 下雨 (mưa) / 下雪 (tuyết) / 很冷 (rất lạnh).',
        'Bạn thích trời lạnh hay trời nóng?'
      ]
    },
    dialogue: [
      ['A', '今天天气怎么样？', 'Jin1 tian1 tian1 qi4 zen3 me5 yang4?', 'How is the weather today?', 'Hôm nay thời tiết thế nào nhỉ?'],
      ['B', '今天很冷，下午会下雨。', 'Jin1 tian1 hen3 leng3, xia4 wu3 hui4 xia4 yu3.', "It's cold today, and it will rain this afternoon.", 'Hôm nay lạnh lắm, chiều còn có mưa nữa.'],
      ['A', '是吗？明天呢？', 'Shi4 ma5? Ming2 tian1 ne5?', 'Really? What about tomorrow?', 'Vậy à? Thế còn ngày mai?'],
      ['B', '明天天气很好，不冷不热。', 'Ming2 tian1 tian1 qi4 hen3 hao3, bu4 leng3 bu2 re4.', "Tomorrow will be nice — not cold, not hot.", 'Mai trời đẹp, không lạnh cũng không nóng.'],
      ['A', '你喜欢冷天气吗？', 'Ni3 xi3 huan5 leng3 tian1 qi4 ma5?', 'Do you like cold weather?', 'Bạn có thích trời lạnh không?'],
      ['B', '不喜欢。北京下雪的时候，太冷了！', 'Bu4 xi3 huan5. Bei3 jing1 xia4 xue3 de5 shi2 hou5, tai4 leng3 le5!', "No. When it snows in Beijing, it's way too cold!", 'Không thích. Lúc Bắc Kinh có tuyết, lạnh kinh khủng!'],
      ['A', '明天天气好，我们去书店吧。', 'Ming2 tian1 tian1 qi4 hao3, wo3 men5 qu4 shu1 dian4 ba5.', "Since tomorrow is nice, let's go to the bookstore.", 'Mai trời đẹp, chúng mình đi hiệu sách đi.'],
      ['B', '好，明天见！', 'Hao3, ming2 tian1 jian4!', 'OK, see you tomorrow!', 'Ừ, hẹn mai gặp!']
    ],
    exercises: [
      ['fill_blank', 'remember', '今天天气___？', 'Jin1 tian1 tian1 qi4 ___?', ['怎么样', '多少', '什么'], 0, ['thế nào', 'bao nhiêu', 'gì'], '问天气的情况用“怎么样”。', 'Hỏi tình hình thời tiết dùng 怎么样: 天气怎么样?'],
      ['fill_blank', 'remember', '今天很冷，下午会___。', 'Jin1 tian1 hen3 leng3, xia4 wu3 hui4 ___.', ['下雨', '下雪', '吃饭'], 0, ['mưa', 'tuyết rơi', 'ăn cơm'], '课文里说：“下午会下雨。”', 'Trong bài: 下午会下雨 (chiều trời sẽ mưa).'],
      ['multiple_choice', 'understand', '“不冷不热”是什么意思？', '"Bu4 leng3 bu2 re4" shi4 shen2 me5 yi4 si5?', ['天气很好', '天气很冷', '天气很热'], 0, ['thời tiết dễ chịu', 'trời rất lạnh', 'trời rất nóng'], '不冷也不热，就是天气很好。', '不冷不热 = không lạnh không nóng → thời tiết dễ chịu.'],
      ['word_order', 'understand', ['明天', '天气', '很', '好'], 'ming2 tian1 / tian1 qi4 / hen3 / hao3', ['ngày mai', 'thời tiết', 'rất', 'đẹp/tốt'], '明天天气很好。', 'Ngày mai thời tiết rất đẹp.', '时间词“明天”在最前面，形容词前用“很”。', 'Trật tự: 明天 (thời gian) + 天气 (chủ ngữ) + 很好. Từ thời gian đứng đầu câu.'],
      ['listening_comprehension', 'understand', [1], '今天下午天气怎么样？', 'Jin1 tian1 xia4 wu3 tian1 qi4 zen3 me5 yang4?', ['会下雨', '会下雪', '不冷不热'], 0, ['sẽ mưa', 'sẽ có tuyết', 'không lạnh không nóng'], '他说“今天很冷，下午会下雨”。', 'Câu nghe được: 下午会下雨 → chiều nay trời sẽ mưa.'],
      ['true_false', 'understand', '李月很喜欢冷天气。', 'Li3 Yue4 hen3 xi3 huan5 leng3 tian1 qi4.', false, '她说“不喜欢”，下雪的时候太冷了。', 'Sai. Bạn ấy trả lời 不喜欢 — lúc có tuyết trời quá lạnh.'],
      ['reading_comprehension', 'understand', '明天他们去哪儿？', 'Ming2 tian1 ta1 men5 qu4 na3r5?', ['书店', '学校', '商店'], 0, ['hiệu sách', 'trường học', 'cửa hàng'], '“明天天气好，我们去书店吧。”', 'Vì mai trời đẹp nên hai bạn hẹn nhau đi hiệu sách (书店).']
    ]
  },
  {
    slug: 'place',
    titleZh: '地点',
    titleEn: 'Places',
    titleVi: 'Địa điểm',
    summaryEn: 'Two neighbors discover they both live in Beijing and talk about where their homes, the hospital and a good restaurant are.',
    summaryVi: 'Hai người phát hiện cùng sống ở Bắc Kinh và chỉ cho nhau vị trí nhà, bệnh viện và một quán ăn ngon.',
    vocab: [
      ['住', 'zhu4', 'verb', 'to live (somewhere)', 'sống, ở'],
      ['医院', 'yi1 yuan4', 'noun', 'hospital', 'bệnh viện'],
      ['饭馆', 'fan4 guan3', 'noun', 'restaurant', 'quán ăn, nhà hàng'],
      ['前面', 'qian2 mian4', 'noun', 'front, in front', 'phía trước'],
      ['后面', 'hou4 mian4', 'noun', 'back, behind', 'phía sau']
    ],
    grammar: [
      {
        pattern: '主语 + 住在 + 地方',
        explanation: '说住的地方用“住在”：我住在北京。',
        explanation_vi: 'Nói nơi sinh sống dùng 住在: 我住在北京 = Tôi sống ở Bắc Kinh.',
        examples: [
          ['你住在哪儿？', 'Ni3 zhu4 zai4 na3r5?', 'Where do you live?', 'Bạn sống ở đâu?'],
          ['我住在北京。', 'Wo3 zhu4 zai4 Bei3 jing1.', 'I live in Beijing.', 'Mình sống ở Bắc Kinh.'],
          ['我的朋友住在学校里。', 'Wo3 de5 peng2 you5 zhu4 zai4 xue2 xiao4 li3.', 'My friend lives at the school.', 'Bạn mình sống ngay trong trường.']
        ]
      },
      {
        pattern: '地方 + 前面/后面',
        explanation: '“前面、后面”说位置：我家在书店后面。',
        explanation_vi: '前面 (phía trước)/后面 (phía sau) đặt sau danh từ nơi chốn: 书店后面 = phía sau hiệu sách.',
        examples: [
          ['我家在书店后面。', 'Wo3 jia1 zai4 shu1 dian4 hou4 mian4.', 'My home is behind the bookstore.', 'Nhà mình ở phía sau hiệu sách.'],
          ['医院在学校前面。', 'Yi1 yuan4 zai4 xue2 xiao4 qian2 mian4.', 'The hospital is in front of the school.', 'Bệnh viện ở phía trước trường học.'],
          ['饭馆在商店后面。', 'Fan4 guan3 zai4 shang1 dian4 hou4 mian4.', 'The restaurant is behind the store.', 'Quán ăn nằm sau cửa hàng.']
        ]
      }
    ],
    warmup: {
      items: ['你住在哪儿？', '说一说：前面 / 后面 / 里。', '你家前面有什么？'],
      itemsVi: [
        'Bạn sống ở đâu? Trả lời với 我住在…',
        'Ôn từ chỉ vị trí: 前面 (trước) / 后面 (sau) / 里 (trong).',
        'Phía trước nhà bạn có gì?'
      ]
    },
    dialogue: [
      ['A', '李月，你住在哪儿？', 'Li3 Yue4, ni3 zhu4 zai4 na3r5?', 'Li Yue, where do you live?', 'Lý Nguyệt, bạn sống ở đâu?'],
      ['B', '我住在北京。你呢？', 'Wo3 zhu4 zai4 Bei3 jing1. Ni3 ne5?', 'I live in Beijing. And you?', 'Mình sống ở Bắc Kinh. Còn bạn?'],
      ['A', '我也住在北京！你家在哪儿？', 'Wo3 ye3 zhu4 zai4 Bei3 jing1! Ni3 jia1 zai4 na3r5?', 'I live in Beijing too! Where is your home?', 'Mình cũng ở Bắc Kinh! Nhà bạn chỗ nào?'],
      ['B', '我家在书店后面。', 'Wo3 jia1 zai4 shu1 dian4 hou4 mian4.', 'My home is behind the bookstore.', 'Nhà mình ở phía sau hiệu sách.'],
      ['A', '医院在哪儿？我朋友在医院。', 'Yi1 yuan4 zai4 na3r5? Wo3 peng2 you5 zai4 yi1 yuan4.', 'Where is the hospital? My friend is there.', 'Thế bệnh viện ở đâu? Bạn mình đang ở bệnh viện.'],
      ['B', '医院在学校前面。', 'Yi1 yuan4 zai4 xue2 xiao4 qian2 mian4.', 'The hospital is in front of the school.', 'Bệnh viện ở ngay trước trường học.'],
      ['A', '那个饭馆的菜好吃吗？', 'Na4 ge5 fan4 guan3 de5 cai4 hao3 chi1 ma5?', 'Is the food at that restaurant good?', 'Quán ăn đằng kia đồ ăn có ngon không?'],
      ['B', '很好吃，我们中午去吃饭！', 'Hen3 hao3 chi1, wo3 men5 zhong1 wu3 qu4 chi1 fan4!', "It's great — let's go there for lunch!", 'Ngon lắm, trưa nay chúng mình qua đó ăn đi!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你___在哪儿？', 'Ni3 ___ zai4 na3r5?', ['住', '坐', '写'], 0, ['sống/ở', 'ngồi', 'viết'], '问住的地方说“住在哪儿”。', 'Hỏi nơi sống dùng 住在哪儿: Bạn sống ở đâu?'],
      ['fill_blank', 'remember', '医院在学校___。', 'Yi1 yuan4 zai4 xue2 xiao4 ___.', ['前面', '后面', '里'], 0, ['phía trước', 'phía sau', 'bên trong'], '课文里说：“医院在学校前面。”', 'Trong bài: 医院在学校前面 (bệnh viện trước trường học).'],
      ['multiple_choice', 'understand', '李月的家在哪儿？', 'Li3 Yue4 de5 jia1 zai4 na3r5?', ['书店后面', '学校前面', '医院里'], 0, ['sau hiệu sách', 'trước trường học', 'trong bệnh viện'], '她说：“我家在书店后面。”', 'Lý Nguyệt nói nhà mình ở phía sau hiệu sách (书店后面).'],
      ['word_order', 'understand', ['我家', '在', '书店', '后面'], 'wo3 jia1 / zai4 / shu1 dian4 / hou4 mian4', ['nhà tôi', 'ở', 'hiệu sách', 'phía sau'], '我家在书店后面。', 'Nhà tôi ở phía sau hiệu sách.', '“后面”在地方名词的后面：书店后面。', 'Từ vị trí 后面 đặt SAU danh từ: 书店后面 = phía sau hiệu sách.'],
      ['listening_comprehension', 'understand', [1], '李月住在哪儿？', 'Li3 Yue4 zhu4 zai4 na3r5?', ['北京', '书店里', '医院'], 0, ['Bắc Kinh', 'trong hiệu sách', 'bệnh viện'], '她说“我住在北京”。', 'Câu nghe được: 我住在北京 → sống ở Bắc Kinh.'],
      ['true_false', 'understand', '他们住在两个地方，一个在北京，一个不在。', 'Ta1 men5 zhu4 zai4 liang3 ge4 di4 fang5, yi2 ge4 zai4 Bei3 jing1, yi2 ge4 bu2 zai4.', false, '他们都住在北京。', 'Sai. Cả hai đều sống ở Bắc Kinh (我也住在北京).'],
      ['reading_comprehension', 'understand', '中午他们做什么？', 'Zhong1 wu3 ta1 men5 zuo4 shen2 me5?', ['去饭馆吃饭', '去医院', '去书店买书'], 0, ['đi quán ăn cơm', 'đi bệnh viện', 'đi hiệu sách mua sách'], '“很好吃，我们中午去吃饭！”', 'Cuối bài hai bạn rủ nhau trưa đi quán ăn vì đồ ăn ở đó rất ngon.']
    ]
  },
  {
    slug: 'doctor',
    titleZh: '医生',
    titleEn: 'Seeing a Doctor',
    titleVi: 'Đi khám bệnh',
    summaryEn: 'A patient who did not sleep well sees a doctor and gets advice: drink water, rest and take medicine.',
    summaryVi: 'Một bệnh nhân mất ngủ đi khám; bác sĩ dặn uống nhiều nước, nghỉ ngơi và uống thuốc.',
    vocab: [
      ['身体', 'shen1 ti3', 'noun', 'body, health', 'cơ thể, sức khỏe'],
      ['不舒服', 'bu4 shu1 fu5', 'phrase', 'to feel unwell', 'khó chịu, không khỏe'],
      ['生病', 'sheng1 bing4', 'verb phrase', 'to be sick', 'bị ốm, bị bệnh'],
      ['休息', 'xiu1 xi5', 'verb', 'to rest', 'nghỉ ngơi'],
      ['药', 'yao4', 'noun', 'medicine', 'thuốc'],
      ['不客气', 'bu2 ke4 qi5', 'phrase', "you're welcome", 'không có gì (đáp lại cảm ơn)']
    ],
    grammar: [
      {
        pattern: '哪儿不舒服？',
        explanation: '医生问病人：“你哪儿不舒服？”',
        explanation_vi: 'Bác sĩ hỏi bệnh: 你哪儿不舒服? = Bạn thấy khó chịu ở đâu?',
        examples: [
          ['你哪儿不舒服？', 'Ni3 na3r5 bu4 shu1 fu5?', 'Where does it hurt? / What is wrong?', 'Bạn thấy khó chịu ở đâu?'],
          ['我身体不舒服。', 'Wo3 shen1 ti3 bu4 shu1 fu5.', "I don't feel well.", 'Mình thấy trong người không khỏe.'],
          ['他今天不舒服，不去上课。', 'Ta1 jin1 tian1 bu4 shu1 fu5, bu2 qu4 shang4 ke4.', 'He is unwell today and will not go to class.', 'Hôm nay cậu ấy mệt nên không đi học.']
        ]
      },
      {
        pattern: '多 + 动词',
        explanation: '“多”在动词前面表示“做多一点”：多喝水、多休息。',
        explanation_vi: '多 + động từ = làm nhiều hơn: 多喝水 = uống nhiều nước, 多休息 = nghỉ ngơi nhiều.',
        examples: [
          ['要多喝水。', 'Yao4 duo1 he1 shui3.', 'Drink more water.', 'Phải uống nhiều nước vào.'],
          ['你要多休息。', 'Ni3 yao4 duo1 xiu1 xi5.', 'You should rest more.', 'Bạn cần nghỉ ngơi nhiều hơn.'],
          ['多说汉语，多写汉字。', 'Duo1 shuo1 Han4 yu3, duo1 xie3 Han4 zi4.', 'Speak more Chinese and write more characters.', 'Hãy nói tiếng Trung nhiều hơn và viết chữ Hán nhiều hơn.']
        ]
      }
    ],
    warmup: {
      items: ['你今天身体怎么样？', '说一说：生病 / 休息 / 吃药。', '生病的时候，你做什么？'],
      itemsVi: [
        'Hôm nay bạn thấy trong người thế nào?',
        'Đọc từ mới: 生病 (bị ốm) / 休息 (nghỉ) / 吃药 (uống thuốc).',
        'Khi bị ốm bạn thường làm gì?'
      ]
    },
    dialogue: [
      ['A', '你好，你哪儿不舒服？', 'Ni3 hao3, ni3 na3r5 bu4 shu1 fu5?', 'Hello, what seems to be the problem?', 'Chào cháu, cháu thấy khó chịu ở đâu?'],
      ['B', '医生，我身体不舒服，昨天没睡觉。', 'Yi1 sheng1, wo3 shen1 ti3 bu4 shu1 fu5, zuo2 tian1 mei2 shui4 jiao4.', "Doctor, I don't feel well. I couldn't sleep last night.", 'Bác sĩ ơi, cháu thấy người không khỏe, hôm qua cháu không ngủ được.'],
      ['A', '你生病了。要多喝水，多休息。', 'Ni3 sheng1 bing4 le5. Yao4 duo1 he1 shui3, duo1 xiu1 xi5.', 'You are sick. Drink plenty of water and get lots of rest.', 'Cháu bị ốm rồi. Phải uống nhiều nước và nghỉ ngơi nhiều vào.'],
      ['B', '我要吃药吗？', 'Wo3 yao4 chi1 yao4 ma5?', 'Do I need to take medicine?', 'Cháu có phải uống thuốc không ạ?'],
      ['A', '要。上午吃，晚上也吃。', 'Yao4. Shang4 wu3 chi1, wan3 shang5 ye3 chi1.', 'Yes — take it in the morning and in the evening.', 'Có. Sáng uống một lần, tối uống một lần nữa.'],
      ['B', '好的。医生，我明天能上课吗？', 'Hao3 de5. Yi1 sheng1, wo3 ming2 tian1 neng2 shang4 ke4 ma5?', 'OK. Doctor, can I go to class tomorrow?', 'Vâng ạ. Bác sĩ ơi, mai cháu đi học được không?'],
      ['A', '明天你在家休息，不要去上课。', 'Ming2 tian1 ni3 zai4 jia1 xiu1 xi5, bu2 yao4 qu4 shang4 ke4.', 'Rest at home tomorrow; do not go to class.', 'Mai cháu ở nhà nghỉ, đừng đến lớp.'],
      ['B', '好，谢谢医生！', 'Hao3, xie4 xie5 yi1 sheng1!', 'OK. Thank you, doctor!', 'Vâng, cháu cảm ơn bác sĩ!'],
      ['A', '不客气。', 'Bu2 ke4 qi5.', "You're welcome.", 'Không có gì đâu cháu.']
    ],
    exercises: [
      ['fill_blank', 'remember', '医生：“你哪儿不___？”', 'Yi1 sheng1: "Ni3 na3r5 bu4 ___?"', ['舒服', '休息', '睡觉'], 0, ['dễ chịu/khỏe', 'nghỉ ngơi', 'ngủ'], '医生问病人“哪儿不舒服”。', 'Câu hỏi kinh điển của bác sĩ: 你哪儿不舒服? (Thấy khó chịu ở đâu?).'],
      ['fill_blank', 'remember', '要多喝水，多___。', 'Yao4 duo1 he1 shui3, duo1 ___.', ['休息', '上课', '买东西'], 0, ['nghỉ ngơi', 'lên lớp', 'mua đồ'], '医生说：“要多喝水，多休息。”', 'Lời dặn của bác sĩ: 多喝水，多休息 (uống nhiều nước, nghỉ nhiều).'],
      ['multiple_choice', 'understand', '别人说“谢谢”，你说什么？', 'Bie2 ren5 shuo1 "xie4 xie5", ni3 shuo1 shen2 me5?', ['不客气', '再见', '你好'], 0, ['không có gì', 'tạm biệt', 'xin chào'], '别人谢谢你，你回答“不客气”。', 'Đáp lại lời cảm ơn dùng 不客气 (không có gì).'],
      ['word_order', 'understand', ['我', '身体', '不', '舒服'], 'wo3 / shen1 ti3 / bu4 / shu1 fu5', ['tôi', 'cơ thể', 'không', 'dễ chịu'], '我身体不舒服。', 'Tôi thấy trong người không khỏe.', '课文里说：“我身体不舒服。”', 'Mẫu câu khám bệnh: 我 + 身体 + 不舒服 = trong người tôi không khỏe.'],
      ['listening_comprehension', 'understand', [4], '病人什么时候吃药？', 'Bing4 ren2 shen2 me5 shi2 hou5 chi1 yao4?', ['上午和晚上', '中午', '下午'], 0, ['sáng và tối', 'buổi trưa', 'buổi chiều'], '医生说：“上午吃，晚上也吃。”', 'Câu nghe được: 上午吃，晚上也吃 → uống thuốc sáng và tối.'],
      ['true_false', 'understand', '医生请他明天去上课。', 'Yi1 sheng1 qing3 ta1 ming2 tian1 qu4 shang4 ke4.', false, '医生说：“明天你在家休息，不要去上课。”', 'Sai. Bác sĩ dặn mai ở nhà nghỉ, đừng đến lớp (不要去上课).'],
      ['reading_comprehension', 'understand', '他为什么不舒服？', 'Ta1 wei4 shen2 me5 bu4 shu1 fu5?', ['昨天没睡觉', '吃了太多苹果', '天气太热'], 0, ['hôm qua không ngủ', 'ăn quá nhiều táo', 'trời quá nóng'], '他说：“我身体不舒服，昨天没睡觉。”', 'Bệnh nhân kể: hôm qua không ngủ được nên người không khỏe.']
    ]
  },
  {
    slug: 'review',
    titleZh: '复习',
    titleEn: 'Review',
    titleVi: 'Ôn tập',
    summaryEn: 'A friendly chat that reviews HSK1: introducing yourself, family, school, Chinese class, weather and food.',
    summaryVi: 'Một cuộc trò chuyện ôn lại toàn bộ HSK1: giới thiệu bản thân, gia đình, trường lớp, tiếng Trung, thời tiết và ăn uống.',
    vocab: [
      ['名字', 'ming2 zi5', 'noun', 'name', 'tên', false],
      ['家', 'jia1', 'noun', 'family, home', 'nhà, gia đình', false],
      ['学校', 'xue2 xiao4', 'noun', 'school', 'trường học', false],
      ['汉语', 'Han4 yu3', 'noun', 'Chinese language', 'tiếng Trung', false],
      ['天气', 'tian1 qi4', 'noun', 'weather', 'thời tiết', false],
      ['米饭', 'mi3 fan4', 'noun', 'cooked rice', 'cơm', false],
      ['茶', 'cha2', 'noun', 'tea', 'trà', false],
      ['饭馆', 'fan4 guan3', 'noun', 'restaurant', 'quán ăn', false]
    ],
    grammar: [
      {
        pattern: '问句复习：吗 / 呢 / 几 / 怎么样',
        explanation: '复习问句：你是学生吗？你呢？你家有几口人？天气怎么样？',
        explanation_vi: 'Ôn các kiểu câu hỏi: câu hỏi 吗, hỏi lại bằng 呢, hỏi số lượng bằng 几, hỏi tình hình bằng 怎么样.',
        examples: [
          ['你是学生吗？', 'Ni3 shi4 xue2 sheng5 ma5?', 'Are you a student?', 'Bạn là học sinh phải không?'],
          ['你家有几口人？', 'Ni3 jia1 you3 ji3 kou3 ren2?', 'How many people are in your family?', 'Nhà bạn có mấy người?'],
          ['今天天气怎么样？', 'Jin1 tian1 tian1 qi4 zen3 me5 yang4?', 'How is the weather today?', 'Hôm nay thời tiết thế nào?']
        ]
      },
      {
        pattern: '动词复习：想 / 会 / 喜欢',
        explanation: '复习“想做、会做、喜欢做”。',
        explanation_vi: 'Ôn ba động từ hay dùng trước động từ khác: 想 (muốn), 会 (biết), 喜欢 (thích).',
        examples: [
          ['我想吃米饭。', 'Wo3 xiang3 chi1 mi3 fan4.', 'I want to eat rice.', 'Mình muốn ăn cơm.'],
          ['我会说一点儿汉语。', 'Wo3 hui4 shuo1 yi4 dian3r5 Han4 yu3.', 'I can speak a little Chinese.', 'Mình biết nói một chút tiếng Trung.'],
          ['我喜欢看中文书。', 'Wo3 xi3 huan5 kan4 Zhong1 wen2 shu1.', 'I like reading Chinese books.', 'Mình thích đọc sách tiếng Trung.']
        ]
      }
    ],
    warmup: {
      items: ['说一说你自己：名字、家、学校。', '你会说什么汉语？', '今天天气怎么样？'],
      itemsVi: [
        'Tự giới thiệu: tên, gia đình, trường học — nói được càng nhiều càng tốt.',
        'Bạn đã nói được những câu tiếng Trung nào? Thử liệt kê.',
        'Hôm nay thời tiết thế nào? Trả lời thành câu đầy đủ.'
      ]
    },
    dialogue: [
      ['A', '你好！你叫什么名字？', 'Ni3 hao3! Ni3 jiao4 shen2 me5 ming2 zi5?', 'Hello! What is your name?', 'Xin chào! Bạn tên là gì?'],
      ['B', '我叫李月，是学生。我家有三口人。', 'Wo3 jiao4 Li3 Yue4, shi4 xue2 sheng5. Wo3 jia1 you3 san1 kou3 ren2.', "I'm Li Yue, a student. There are three people in my family.", 'Mình là Lý Nguyệt, là học sinh. Nhà mình có ba người.'],
      ['A', '你的学校怎么样？', 'Ni3 de5 xue2 xiao4 zen3 me5 yang4?', 'How is your school?', 'Trường của bạn thế nào?'],
      ['B', '很大很漂亮。我上午有汉语课，我会说一点儿汉语。', 'Hen3 da4 hen3 piao4 liang5. Wo3 shang4 wu3 you3 Han4 yu3 ke4, wo3 hui4 shuo1 yi4 dian3r5 Han4 yu3.', "Big and beautiful. I have Chinese class in the morning and can speak a little Chinese.", 'Trường to và đẹp lắm. Sáng mình có tiết tiếng Trung, mình nói được một chút rồi.'],
      ['A', '今天天气怎么样？', 'Jin1 tian1 tian1 qi4 zen3 me5 yang4?', 'How is the weather today?', 'Hôm nay thời tiết thế nào nhỉ?'],
      ['B', '很好，不冷不热。', 'Hen3 hao3, bu4 leng3 bu2 re4.', 'Nice — not cold, not hot.', 'Đẹp lắm, không lạnh cũng không nóng.'],
      ['A', '中午你想吃什么？', 'Zhong1 wu3 ni3 xiang3 chi1 shen2 me5?', 'What do you want for lunch?', 'Trưa nay bạn muốn ăn gì?'],
      ['B', '我想吃米饭和菜，喝一杯茶。', 'Wo3 xiang3 chi1 mi3 fan4 he2 cai4, he1 yi4 bei1 cha2.', "I'd like rice with some dishes, and a cup of tea.", 'Mình muốn ăn cơm với thức ăn, uống một cốc trà.'],
      ['A', '好，我们去学校后面的饭馆！', 'Hao3, wo3 men5 qu4 xue2 xiao4 hou4 mian4 de5 fan4 guan3!', "Great, let's go to the restaurant behind the school!", 'Được, chúng mình ra quán ăn phía sau trường đi!'],
      ['B', '好，中午见！', 'Hao3, zhong1 wu3 jian4!', 'OK, see you at noon!', 'Ừ, hẹn gặp trưa nay!']
    ],
    exercises: [
      ['fill_blank', 'remember', '你叫什么___？', 'Ni3 jiao4 shen2 me5 ___?', ['名字', '天气', '学校'], 0, ['tên', 'thời tiết', 'trường học'], '问名字：你叫什么名字？', 'Ôn lại câu hỏi tên: 你叫什么名字?'],
      ['fill_blank', 'remember', '我会说一点儿___。', 'Wo3 hui4 shuo1 yi4 dian3r5 ___.', ['汉语', '米饭', '天气'], 0, ['tiếng Trung', 'cơm', 'thời tiết'], '“说”后面是语言：说汉语。', 'Sau động từ 说 là ngôn ngữ: 说汉语 (nói tiếng Trung).'],
      ['multiple_choice', 'understand', 'A：今天天气怎么样？ B：___', 'A: Jin1 tian1 tian1 qi4 zen3 me5 yang4? B: ___', ['很好，不冷不热。', '我想吃米饭。', '我家有三口人。'], 0, ['Đẹp lắm, không lạnh không nóng.', 'Mình muốn ăn cơm.', 'Nhà mình có ba người.'], '“怎么样”问天气的情况。', 'Câu hỏi 怎么样 về thời tiết phải trả lời về thời tiết.'],
      ['word_order', 'understand', ['我', '上午', '有', '汉语', '课'], 'wo3 / shang4 wu3 / you3 / Han4 yu3 / ke4', ['tôi', 'buổi sáng', 'có', 'tiếng Trung', 'tiết học'], '我上午有汉语课。', 'Buổi sáng tôi có tiết tiếng Trung.', '时间词“上午”在动词“有”前面。', 'Từ thời gian 上午 đứng trước động từ 有: 我上午有汉语课.'],
      ['listening_comprehension', 'understand', [1], '李月家有几口人？', 'Li3 Yue4 jia1 you3 ji3 kou3 ren2?', ['三口人', '四口人', '五口人'], 0, ['ba người', 'bốn người', 'năm người'], '她说“我家有三口人”。', 'Câu nghe được: 我家有三口人 → nhà có ba người.'],
      ['true_false', 'understand', '中午他们去学校前面的饭馆。', 'Zhong1 wu3 ta1 men5 qu4 xue2 xiao4 qian2 mian4 de5 fan4 guan3.', false, '他们去学校后面的饭馆。', 'Sai. Quán ăn ở phía sau trường (学校后面), không phải phía trước.'],
      ['reading_comprehension', 'understand', '李月中午想喝什么？', 'Li3 Yue4 zhong1 wu3 xiang3 he1 shen2 me5?', ['一杯茶', '一杯水', '一杯冷水'], 0, ['một cốc trà', 'một cốc nước', 'một cốc nước lạnh'], '她说：“我想吃米饭和菜，喝一杯茶。”', 'Lý Nguyệt muốn ăn cơm và uống một cốc trà (喝一杯茶).']
    ]
  }
];
