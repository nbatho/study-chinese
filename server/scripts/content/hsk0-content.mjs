// Authored content for the HSK0 pronunciation track (pre-A1).
// Exercise kinds are limited to listening / multipleChoice / trueFalse: there is no
// vocabulary or sentence structure at this level to build the other kinds on.
//
// L(hanzi, pinyin, en, vi, options, ...)  -> listeningComprehension, answer = options[0]
// MC(prompt, options, correctIndex, explanation)
// TF(statement, isTrue, explanation)

const L = (hanzi, pinyin, en, vi, options, expl) => ({
  kind: 'listeningComprehension', hanzi, pinyin, en, vi, options, correct: 0, expl
});
const MC = (prompt, options, correct, expl) => ({ kind: 'multipleChoice', prompt, options, correct, expl });
const TF = (statement, isTrue, expl) => ({ kind: 'trueFalse', prompt: statement, isTrue, expl });

const LISTEN_PROMPT = {
  en: 'Listen to the audio and choose the pinyin you hear.',
  vi: 'Nghe audio rồi chọn pinyin bạn nghe được.'
};

export const lessons = {
  'hsk0-l01-tones': {
    sounds: [
      ['妈', 'mā', 'Tone 1 – high and flat. Meaning: mother.', 'Thanh 1 – cao và đều. Nghĩa: mẹ.'],
      ['麻', 'má', 'Tone 2 – rises from mid to high, like asking "huh?". Meaning: hemp.', 'Thanh 2 – đi lên từ trung lên cao, như khi hỏi lại "hả?". Nghĩa: cây gai.'],
      ['马', 'mǎ', 'Tone 3 – dips low, then rises back. Meaning: horse.', 'Thanh 3 – hạ xuống thấp rồi kéo lên. Nghĩa: con ngựa.'],
      ['骂', 'mà', 'Tone 4 – falls sharply from high to low. Meaning: to scold.', 'Thanh 4 – rơi dứt khoát từ cao xuống thấp. Nghĩa: mắng.'],
      ['吗', 'ma', 'Neutral tone – short, light, no tone mark. A question particle.', 'Thanh nhẹ – ngắn, nhẹ, không có dấu thanh. Là trợ từ nghi vấn.']
    ],
    exercises: [
      L('妈', 'mā', 'mother', 'mẹ', ['mā', 'má', 'mǎ', 'mà'],
        { en: '妈 mā is the high level tone (tone 1) — hold the pitch steady.', vi: '妈 mā là thanh 1 (âm bình) – giữ cao độ đều.' }),
      L('马', 'mǎ', 'horse', 'con ngựa', ['mǎ', 'mā', 'má', 'mà'],
        { en: '马 mǎ is the dipping tone (tone 3) — it drops low before rising.', vi: '马 mǎ là thanh 3 – hạ thấp rồi mới lên.' }),
      L('骂', 'mà', 'to scold', 'mắng', ['mà', 'mā', 'má', 'mǎ'],
        { en: '骂 mà is the falling tone (tone 4) — sharp and short.', vi: '骂 mà là thanh 4 – rơi nhanh và dứt khoát.' }),
      MC({ en: 'Which tone rises from mid pitch to high, like asking a question?', vi: 'Thanh nào đi lên từ cao độ trung lên cao, giống như đang hỏi?' },
        [{ en: 'Tone 1 – high level', vi: 'Thanh 1 – âm bình' }, { en: 'Tone 2 – rising', vi: 'Thanh 2 – dương bình' },
         { en: 'Tone 3 – dipping', vi: 'Thanh 3 – thượng thanh' }, { en: 'Tone 4 – falling', vi: 'Thanh 4 – khứ thanh' }], 1,
        { en: 'Tone 2 (má) rises from mid to high.', vi: 'Thanh 2 (má) đi lên từ trung lên cao.' }),
      MC({ en: 'Which syllable means "hemp"?', vi: 'Âm tiết nào có nghĩa là "cây gai"?' },
        [{ en: 'mā 妈', vi: 'mā 妈' }, { en: 'má 麻', vi: 'má 麻' }, { en: 'mǎ 马', vi: 'mǎ 马' }, { en: 'mà 骂', vi: 'mà 骂' }], 1,
        { en: '麻 má (hemp) carries tone 2; 妈 mā is mother, 马 mǎ is horse, 骂 mà is to scold.', vi: '麻 má (cây gai) mang thanh 2; 妈 mā là mẹ, 马 mǎ là ngựa, 骂 mà là mắng.' }),
      TF({ en: 'The neutral tone is pronounced short and light, and is written without a tone mark.', vi: 'Thanh nhẹ được đọc ngắn và nhẹ, và viết không có dấu thanh.' }, true,
        { en: 'Right — 吗 ma has no tone mark and is said quickly and unstressed.', vi: 'Đúng – 吗 ma không có dấu thanh, đọc nhanh và không nhấn.' }),
      TF({ en: 'Changing the tone of a syllable does not change its meaning.', vi: 'Đổi thanh điệu của một âm tiết thì nghĩa không đổi.' }, false,
        { en: 'It does change: mā is mother but mǎ is horse — same syllable, different word.', vi: 'Có đổi: mā là mẹ còn mǎ là ngựa – cùng âm tiết nhưng khác từ.' })
    ]
  },

  'hsk0-l02-tone-pairs': {
    sounds: [
      ['中国', 'zhōng guó', 'Tone 1 + tone 2. Meaning: China.', 'Thanh 1 + thanh 2. Nghĩa: Trung Quốc.'],
      ['老师', 'lǎo shī', 'Tone 3 + tone 1. Meaning: teacher.', 'Thanh 3 + thanh 1. Nghĩa: giáo viên.'],
      ['再见', 'zài jiàn', 'Tone 4 + tone 4, both sharp. Meaning: goodbye.', 'Thanh 4 + thanh 4, đều dứt khoát. Nghĩa: tạm biệt.'],
      ['学生', 'xué sheng', 'Tone 2 + neutral tone. Meaning: student.', 'Thanh 2 + thanh nhẹ. Nghĩa: học sinh.'],
      ['你好', 'nǐ hǎo', 'Two tone 3s: the first is said as a tone 2 (ní hǎo). Meaning: hello.', 'Hai thanh 3: tiếng đầu đọc thành thanh 2 (ní hǎo). Nghĩa: xin chào.'],
      ['谢谢', 'xiè xie', 'Tone 4 + neutral tone. Meaning: thank you.', 'Thanh 4 + thanh nhẹ. Nghĩa: cảm ơn.']
    ],
    exercises: [
      L('中国', 'zhōng guó', 'China', 'Trung Quốc', ['zhōng guó', 'zhóng guō', 'zhòng guò', 'zhōng guǒ'],
        { en: '中国 is tone 1 + tone 2: flat, then rising.', vi: '中国 là thanh 1 + thanh 2: đều rồi đi lên.' }),
      L('老师', 'lǎo shī', 'teacher', 'giáo viên', ['lǎo shī', 'lāo shí', 'lào shì', 'lǎo shí'],
        { en: '老师 is tone 3 + tone 1: dip down, then hold high.', vi: '老师 là thanh 3 + thanh 1: hạ xuống rồi giữ cao.' }),
      L('再见', 'zài jiàn', 'goodbye', 'tạm biệt', ['zài jiàn', 'zǎi jiān', 'zāi jiàn', 'zài jiān'],
        { en: '再见 is two tone 4s — both fall sharply.', vi: '再见 gồm hai thanh 4 – cả hai đều rơi dứt khoát.' }),
      L('学生', 'xué sheng', 'student', 'học sinh', ['xué sheng', 'xuē shēng', 'xuè shèng', 'xué shēng'],
        { en: 'The second syllable of 学生 loses its tone, so it is written xué sheng, not xué shēng.', vi: 'Tiếng thứ hai của 学生 mất thanh nên viết xué sheng chứ không phải xué shēng.' }),
      MC({ en: 'Which word is tone 2 + neutral tone?', vi: 'Từ nào là thanh 2 + thanh nhẹ?' },
        [{ en: '学生 xué sheng', vi: '学生 xué sheng' }, { en: '老师 lǎo shī', vi: '老师 lǎo shī' },
         { en: '中国 zhōng guó', vi: '中国 zhōng guó' }, { en: '再见 zài jiàn', vi: '再见 zài jiàn' }], 0,
        { en: 'xué is tone 2 and sheng is neutral.', vi: 'xué là thanh 2 còn sheng là thanh nhẹ.' }),
      MC({ en: 'In 你好 nǐ hǎo, how is the first syllable actually pronounced?', vi: 'Trong 你好 nǐ hǎo, tiếng đầu thực tế được đọc thế nào?' },
        [{ en: 'As a tone 2 (ní)', vi: 'Thành thanh 2 (ní)' }, { en: 'As a tone 1 (nī)', vi: 'Thành thanh 1 (nī)' },
         { en: 'As a tone 4 (nì)', vi: 'Thành thanh 4 (nì)' }, { en: 'Unchanged, still a full tone 3', vi: 'Không đổi, vẫn là thanh 3 đầy đủ' }], 0,
        { en: 'When two tone 3s meet, the first becomes a tone 2 — but the spelling stays nǐ hǎo.', vi: 'Khi hai thanh 3 đứng cạnh nhau, tiếng đầu đọc thành thanh 2 – nhưng vẫn viết là nǐ hǎo.' }),
      TF({ en: '谢谢 xiè xie ends on a neutral tone.', vi: '谢谢 xiè xie kết thúc bằng thanh nhẹ.' }, true,
        { en: 'Yes — the repeated syllable is unstressed, so it is written xie without a mark.', vi: 'Đúng – tiếng lặp lại không nhấn nên viết là xie, không có dấu.' })
    ]
  },

  'hsk0-l03-tone-check': {
    sounds: [
      ['妈', 'mā', 'Tone 1.', 'Thanh 1.'], ['麻', 'má', 'Tone 2.', 'Thanh 2.'],
      ['马', 'mǎ', 'Tone 3.', 'Thanh 3.'], ['骂', 'mà', 'Tone 4.', 'Thanh 4.'],
      ['八', 'bā', 'Tone 1. Meaning: eight.', 'Thanh 1. Nghĩa: tám.'],
      ['爸', 'bà', 'Tone 4. Meaning: dad.', 'Thanh 4. Nghĩa: bố.']
    ],
    exercises: [
      L('妈', 'mā', 'mother', 'mẹ', ['mā', 'má', 'mǎ', 'mà'], { en: 'Flat and high — tone 1.', vi: 'Đều và cao – thanh 1.' }),
      L('麻', 'má', 'hemp', 'cây gai', ['má', 'mā', 'mǎ', 'mà'], { en: 'Rising — tone 2.', vi: 'Đi lên – thanh 2.' }),
      L('马', 'mǎ', 'horse', 'con ngựa', ['mǎ', 'má', 'mā', 'mà'], { en: 'Dips then rises — tone 3.', vi: 'Hạ rồi lên – thanh 3.' }),
      L('骂', 'mà', 'to scold', 'mắng', ['mà', 'mǎ', 'má', 'mā'], { en: 'Falls sharply — tone 4.', vi: 'Rơi dứt khoát – thanh 4.' }),
      L('八', 'bā', 'eight', 'tám', ['bā', 'bá', 'bǎ', 'bà'], { en: '八 bā (eight) is tone 1.', vi: '八 bā (tám) là thanh 1.' }),
      L('爸', 'bà', 'dad', 'bố', ['bà', 'bā', 'bá', 'bǎ'], { en: '爸 bà (dad) is tone 4 — compare with 八 bā (eight).', vi: '爸 bà (bố) là thanh 4 – so sánh với 八 bā (tám).' }),
      MC({ en: 'You hear a syllable that dips low and then rises again. Which tone is it?', vi: 'Bạn nghe một âm tiết hạ xuống thấp rồi lại đi lên. Đó là thanh mấy?' },
        [{ en: 'Tone 3', vi: 'Thanh 3' }, { en: 'Tone 2', vi: 'Thanh 2' }, { en: 'Tone 4', vi: 'Thanh 4' }, { en: 'Tone 1', vi: 'Thanh 1' }], 0,
        { en: 'The dip-then-rise contour is tone 3 (mǎ).', vi: 'Đường nét hạ rồi lên là thanh 3 (mǎ).' }),
      TF({ en: '八 bā and 爸 bà are the same syllable said with different tones.', vi: '八 bā và 爸 bà là cùng một âm tiết đọc với thanh điệu khác nhau.' }, true,
        { en: 'Same initial and final, only the tone differs — and that makes "eight" versus "dad".', vi: 'Cùng thanh mẫu và vận mẫu, chỉ khác thanh điệu – và điều đó tạo ra "tám" so với "bố".' })
    ]
  },

  'hsk0-l04-initials': {
    sounds: [
      ['爸', 'bà', 'b – a soft, unaspirated "p". Meaning: dad.', 'b – như "p" nhẹ, không bật hơi. Nghĩa: bố.'],
      ['妈', 'mā', 'm – an ordinary "m". Meaning: mother.', 'm – như "m" tiếng Việt. Nghĩa: mẹ.'],
      ['大', 'dà', 'd – a soft "t" with no puff of air. Meaning: big.', 'd – như "t" nhẹ, không bật hơi. Nghĩa: to, lớn.'],
      ['他', 'tā', 't – "t" with a strong puff of air. Meaning: he.', 't – như "th" bật hơi mạnh. Nghĩa: anh ấy.'],
      ['哥', 'gē', 'g – a soft "k" with no puff of air. Meaning: older brother.', 'g – như "c/k" nhẹ, không bật hơi. Nghĩa: anh trai.'],
      ['喝', 'hē', 'h – friction in the throat, rougher than English "h". Meaning: to drink.', 'h – ma sát ở cổ họng, mạnh hơn "h" tiếng Việt. Nghĩa: uống.']
    ],
    exercises: [
      L('爸', 'bà', 'dad', 'bố', ['bà', 'pà', 'mà', 'fà'], { en: 'b is unaspirated: no puff of air escapes.', vi: 'b không bật hơi: không có luồng hơi bật ra.' }),
      L('他', 'tā', 'he', 'anh ấy', ['tā', 'dā', 'nā', 'lā'], { en: 't is aspirated — you should feel the air on your hand.', vi: 't có bật hơi – bạn sẽ thấy luồng hơi khi để tay trước miệng.' }),
      L('哥', 'gē', 'older brother', 'anh trai', ['gē', 'kē', 'hē', 'ē'], { en: 'g is the unaspirated partner of k.', vi: 'g là cặp không bật hơi của k.' }),
      L('喝', 'hē', 'to drink', 'uống', ['hē', 'gē', 'kē', 'ē'], { en: 'h is made with friction at the back of the throat.', vi: 'h tạo ra bằng ma sát ở phía sau cổ họng.' }),
      MC({ en: 'Which initial is pronounced with a strong puff of air?', vi: 'Thanh mẫu nào được phát âm kèm luồng hơi bật mạnh?' },
        [{ en: 'p', vi: 'p' }, { en: 'b', vi: 'b' }, { en: 'm', vi: 'm' }, { en: 'n', vi: 'n' }], 0,
        { en: 'p, t, k, q, ch and c are the aspirated initials; b, d, g are not.', vi: 'p, t, k, q, ch, c là nhóm bật hơi; b, d, g thì không.' }),
      MC({ en: 'Which pair of initials differs only by the puff of air?', vi: 'Cặp thanh mẫu nào chỉ khác nhau ở luồng hơi bật?' },
        [{ en: 'd / t', vi: 'd / t' }, { en: 'm / n', vi: 'm / n' }, { en: 'b / m', vi: 'b / m' }, { en: 'l / n', vi: 'l / n' }], 0,
        { en: 'd and t are made in the same place; only t is aspirated.', vi: 'd và t cùng vị trí cấu âm; chỉ t là bật hơi.' }),
      TF({ en: 'The initial b in pinyin is pronounced with a strong puff of air.', vi: 'Thanh mẫu b trong pinyin được phát âm kèm luồng hơi bật mạnh.' }, false,
        { en: 'b is unaspirated — it is p that carries the puff of air.', vi: 'b không bật hơi – chính p mới là âm bật hơi.' })
    ]
  },

  'hsk0-l05-initials-retroflex': {
    sounds: [
      ['中', 'zhōng', 'zh – curl the tongue back, like "j" in "judge". Meaning: middle.', 'zh – uốn lưỡi ra sau, như "tr". Nghĩa: ở giữa.'],
      ['吃', 'chī', 'ch – like zh but with a strong puff of air. Meaning: to eat.', 'ch – như zh nhưng bật hơi mạnh. Nghĩa: ăn.'],
      ['是', 'shì', 'sh – tongue curled back, a heavy "sh". Meaning: to be.', 'sh – uốn lưỡi, như "s" nặng. Nghĩa: là.'],
      ['热', 'rè', 'r – tongue curled back, between English "r" and the "s" in "vision". Meaning: hot.', 'r – uốn lưỡi, ở giữa "r" và "j" tiếng Anh. Nghĩa: nóng.'],
      ['四', 'sì', 's – flat tongue behind the lower teeth. Meaning: four.', 's – lưỡi phẳng, sát răng dưới. Nghĩa: bốn.'],
      ['三', 'sān', 's – the flat-tongue partner of sh. Meaning: three.', 's – cặp lưỡi phẳng của sh. Nghĩa: ba.']
    ],
    exercises: [
      L('中', 'zhōng', 'middle', 'ở giữa', ['zhōng', 'zōng', 'chōng', 'cōng'], { en: 'zh is retroflex; z is the flat-tongue version of the same sound.', vi: 'zh là âm uốn lưỡi; z là phiên bản lưỡi phẳng của cùng âm đó.' }),
      L('吃', 'chī', 'to eat', 'ăn', ['chī', 'cī', 'shī', 'sī'], { en: 'ch is retroflex and aspirated at the same time.', vi: 'ch vừa uốn lưỡi vừa bật hơi.' }),
      L('是', 'shì', 'to be', 'là', ['shì', 'sì', 'zhì', 'zì'], { en: 'sh is retroflex; 四 sì (four) uses the flat-tongue s.', vi: 'sh là âm uốn lưỡi; 四 sì (bốn) dùng s lưỡi phẳng.' }),
      L('热', 'rè', 'hot', 'nóng', ['rè', 'lè', 'zè', 'sè'], { en: 'Chinese r is retroflex — it is not the Vietnamese r.', vi: 'r tiếng Trung là âm uốn lưỡi – không giống r tiếng Việt.' }),
      MC({ en: 'Where is your tongue when you say zh, ch, sh and r?', vi: 'Lưỡi đặt ở đâu khi phát âm zh, ch, sh và r?' },
        [{ en: 'Curled back toward the roof of the mouth', vi: 'Uốn cong ra sau, hướng lên vòm miệng' },
         { en: 'Flat, behind the lower teeth', vi: 'Phẳng, sát sau răng dưới' },
         { en: 'Pushed between the teeth', vi: 'Đẩy ra giữa hai hàm răng' },
         { en: 'Pressed against the lips', vi: 'Ép vào môi' }], 0,
        { en: 'These four are the retroflex group — the tongue tip curls back.', vi: 'Bốn âm này là nhóm uốn lưỡi – đầu lưỡi cong ra sau.' }),
      MC({ en: 'Which syllable uses a flat-tongue (non-retroflex) initial?', vi: 'Âm tiết nào dùng thanh mẫu lưỡi phẳng (không uốn lưỡi)?' },
        [{ en: 'sì 四', vi: 'sì 四' }, { en: 'shì 是', vi: 'shì 是' }, { en: 'chī 吃', vi: 'chī 吃' }, { en: 'zhōng 中', vi: 'zhōng 中' }], 0,
        { en: 'z, c, s are flat-tongue; zh, ch, sh, r are retroflex.', vi: 'z, c, s là nhóm lưỡi phẳng; zh, ch, sh, r là nhóm uốn lưỡi.' }),
      TF({ en: 'z, c and s are pronounced with the tongue curled back, just like zh, ch and sh.', vi: 'z, c, s được phát âm với lưỡi uốn cong ra sau, giống hệt zh, ch, sh.' }, false,
        { en: 'They are the opposite pair: z, c, s keep the tongue flat behind the lower teeth.', vi: 'Chúng là cặp đối lập: z, c, s giữ lưỡi phẳng sát răng dưới.' })
    ]
  },

  'hsk0-l06-initials-jqx': {
    sounds: [
      ['几', 'jǐ', 'j – a light "j", tongue tip behind the lower teeth. Meaning: how many.', 'j – như "ch" nhẹ, đầu lưỡi sát răng dưới. Nghĩa: mấy.'],
      ['七', 'qī', 'q – like "ch" with a strong puff of air. Meaning: seven.', 'q – như "ch" nhưng bật hơi mạnh. Nghĩa: bảy.'],
      ['小', 'xiǎo', 'x – a light, thin "sh" sound. Meaning: small.', 'x – như "x" tiếng Việt nhưng nhẹ và mảnh. Nghĩa: nhỏ.'],
      ['去', 'qù', 'q + ü — the u here is really ü. Meaning: to go.', 'q + ü – chữ u ở đây thực chất là ü. Nghĩa: đi.'],
      ['谢', 'xiè', 'x before i. Meaning: to thank.', 'x đứng trước i. Nghĩa: cảm ơn.']
    ],
    exercises: [
      L('几', 'jǐ', 'how many', 'mấy', ['jǐ', 'qǐ', 'xǐ', 'zhǐ'], { en: 'j is unaspirated; q is its aspirated partner.', vi: 'j không bật hơi; q là cặp bật hơi của nó.' }),
      L('七', 'qī', 'seven', 'bảy', ['qī', 'jī', 'xī', 'chī'], { en: 'q carries a strong puff of air, unlike j.', vi: 'q có luồng hơi bật mạnh, khác với j.' }),
      L('小', 'xiǎo', 'small', 'nhỏ', ['xiǎo', 'jiǎo', 'qiǎo', 'shǎo'], { en: 'x is a thin, light hissing sound — not the heavy retroflex sh.', vi: 'x là âm xát mảnh và nhẹ – không phải sh uốn lưỡi nặng.' }),
      L('去', 'qù', 'to go', 'đi', ['qù', 'chù', 'jù', 'xù'], { en: 'After j, q and x the letter u always stands for ü, so qu is read qü.', vi: 'Sau j, q, x thì chữ u luôn đại diện cho ü, nên qu đọc là qü.' }),
      MC({ en: 'Which vowels can follow the initials j, q and x?', vi: 'Những nguyên âm nào có thể đứng sau thanh mẫu j, q, x?' },
        [{ en: 'Only i and ü', vi: 'Chỉ i và ü' }, { en: 'Only a and o', vi: 'Chỉ a và o' },
         { en: 'Only u and e', vi: 'Chỉ u và e' }, { en: 'Any vowel', vi: 'Bất kỳ nguyên âm nào' }], 0,
        { en: 'j, q and x only combine with i and ü (and finals starting with them).', vi: 'j, q, x chỉ kết hợp với i và ü (và các vận mẫu bắt đầu bằng chúng).' }),
      MC({ en: 'In 去 qù, the letter u is actually pronounced as…', vi: 'Trong 去 qù, chữ u thực chất được đọc là…' },
        [{ en: 'ü', vi: 'ü' }, { en: 'u', vi: 'u' }, { en: 'ou', vi: 'ou' }, { en: 'iu', vi: 'iu' }], 0,
        { en: 'The two dots are dropped in writing because j, q, x never take a plain u.', vi: 'Hai dấu chấm bị lược khi viết vì j, q, x không bao giờ đi với u thường.' }),
      TF({ en: 'j, q and x are pronounced with the tongue curled back.', vi: 'j, q, x được phát âm với lưỡi uốn cong ra sau.' }, false,
        { en: 'The tongue tip stays low behind the lower teeth; only zh, ch, sh, r curl back.', vi: 'Đầu lưỡi hạ thấp sát răng dưới; chỉ zh, ch, sh, r mới uốn ra sau.' })
    ]
  },

  'hsk0-l07-finals': {
    sounds: [
      ['阿', 'ā', 'a – open the mouth wide.', 'a – mở rộng miệng.'],
      ['哦', 'ò', 'o – round the lips.', 'o – tròn môi.'],
      ['饿', 'è', 'e – a low "uh" in the throat. Meaning: hungry.', 'e – như "ơ" hơi trầm trong cổ họng. Nghĩa: đói.'],
      ['一', 'yī', 'i – like "ee". Written yi when it stands alone. Meaning: one.', 'i – như "i". Viết là yi khi đứng một mình. Nghĩa: một.'],
      ['五', 'wǔ', 'u – round lips, like "oo". Written wu when alone. Meaning: five.', 'u – tròn môi như "u". Viết là wu khi đứng một mình. Nghĩa: năm.'],
      ['绿', 'lǜ', 'ü – say "ee" while rounding your lips. Meaning: green.', 'ü – chúm môi như "u" nhưng lưỡi ở vị trí "i". Nghĩa: xanh lá.']
    ],
    exercises: [
      L('阿', 'ā', 'ah', 'a', ['ā', 'ō', 'ē', 'ī'], { en: 'a is the most open vowel — drop the jaw.', vi: 'a là nguyên âm mở nhất – hạ hàm xuống.' }),
      L('五', 'wǔ', 'five', 'năm', ['wǔ', 'wū', 'wù', 'wú'], { en: 'The final u is written wu when no initial precedes it.', vi: 'Vận mẫu u viết thành wu khi không có thanh mẫu đứng trước.' }),
      L('绿', 'lǜ', 'green', 'xanh lá', ['lǜ', 'lù', 'lǚ', 'lóu'], { en: 'lü and lu are different words — the two dots matter after l and n.', vi: 'lü và lu là hai từ khác nhau – hai dấu chấm rất quan trọng sau l và n.' }),
      L('一', 'yī', 'one', 'một', ['yī', 'yí', 'yǐ', 'yì'], { en: 'On its own, 一 is read yī with tone 1.', vi: 'Đứng riêng, 一 đọc là yī với thanh 1.' }),
      MC({ en: 'How do you make the ü sound?', vi: 'Phát âm ü như thế nào?' },
        [{ en: 'Say "ee" while rounding your lips', vi: 'Nói "i" trong khi chúm tròn môi' },
         { en: 'Say "oo" with flat, spread lips', vi: 'Nói "u" với môi dẹt, kéo ngang' },
         { en: 'Say "ah" with rounded lips', vi: 'Nói "a" với môi tròn' },
         { en: 'Say "uh" through the nose', vi: 'Nói "ơ" qua mũi' }], 0,
        { en: 'The tongue sits where it does for i, while the lips round as for u.', vi: 'Lưỡi ở vị trí của i, còn môi chúm tròn như khi phát âm u.' }),
      MC({ en: 'Which final is written "yi" when it forms a syllable on its own?', vi: 'Vận mẫu nào được viết là "yi" khi tự nó tạo thành một âm tiết?' },
        [{ en: 'i', vi: 'i' }, { en: 'u', vi: 'u' }, { en: 'ü', vi: 'ü' }, { en: 'e', vi: 'e' }], 0,
        { en: 'i becomes yi, u becomes wu, and ü becomes yu when they stand alone.', vi: 'Khi đứng một mình, i thành yi, u thành wu và ü thành yu.' }),
      TF({ en: 'The final e in 饿 è sounds close to the Vietnamese "ơ".', vi: 'Vận mẫu e trong 饿 è nghe gần giống "ơ" tiếng Việt.' }, true,
        { en: 'Yes — it is a low, unrounded back vowel, not the "e" of Vietnamese "e".', vi: 'Đúng – đây là nguyên âm sau, không tròn môi, không phải "e" tiếng Việt.' })
    ]
  },

  'hsk0-l08-finals-compound': {
    sounds: [
      ['爱', 'ài', 'ai – glide from a into i, like "eye". Meaning: to love.', 'ai – lướt từ a sang i, như "ai". Nghĩa: yêu.'],
      ['给', 'gěi', 'ei – glide from e into i. Meaning: to give.', 'ei – lướt từ e sang i, như "êi". Nghĩa: cho.'],
      ['要', 'yào', 'ao – glide from a into o, like "ow". Meaning: to want.', 'ao – lướt từ a sang o, như "ao". Nghĩa: muốn.'],
      ['有', 'yǒu', 'ou – glide from o into u. Meaning: to have.', 'ou – lướt từ o sang u, như "âu". Nghĩa: có.']
    ],
    exercises: [
      L('爱', 'ài', 'to love', 'yêu', ['ài', 'èi', 'ào', 'òu'], { en: 'ai starts on a full a and glides up to i.', vi: 'ai bắt đầu bằng a rõ rồi lướt lên i.' }),
      L('要', 'yào', 'to want', 'muốn', ['yào', 'yòu', 'yèi', 'yài'], { en: 'ao glides from a down toward o — it is one syllable, not two.', vi: 'ao lướt từ a xuống o – là một âm tiết chứ không phải hai.' }),
      L('有', 'yǒu', 'to have', 'có', ['yǒu', 'yǎo', 'yěi', 'yǎi'], { en: 'ou starts from o and closes toward u.', vi: 'ou bắt đầu từ o rồi khép lại về u.' }),
      L('给', 'gěi', 'to give', 'cho', ['gěi', 'gǎi', 'gǒu', 'gǎo'], { en: 'ei is higher and shorter than ai — compare gěi with gǎi.', vi: 'ei cao hơn và ngắn hơn ai – so sánh gěi với gǎi.' }),
      MC({ en: 'A compound final such as ao is…', vi: 'Vận mẫu kép như ao là…' },
        [{ en: 'One smooth glide from the first vowel into the second', vi: 'Một chuyển động lướt liền từ nguyên âm đầu sang nguyên âm sau' },
         { en: 'Two separate syllables', vi: 'Hai âm tiết tách rời' },
         { en: 'A vowel plus a nasal ending', vi: 'Một nguyên âm cộng đuôi mũi' },
         { en: 'A vowel that carries no tone', vi: 'Một nguyên âm không mang thanh điệu' }], 0,
        { en: 'The two vowels share one beat and one tone mark.', vi: 'Hai nguyên âm chung một nhịp và một dấu thanh.' }),
      MC({ en: 'Which word contains the final ou?', vi: 'Từ nào chứa vận mẫu ou?' },
        [{ en: '有 yǒu', vi: '有 yǒu' }, { en: '爱 ài', vi: '爱 ài' }, { en: '要 yào', vi: '要 yào' }, { en: '给 gěi', vi: '给 gěi' }], 0,
        { en: '有 yǒu uses ou; 要 yào uses ao, which is easy to confuse with it.', vi: '有 yǒu dùng ou; 要 yào dùng ao, rất dễ nhầm với nhau.' }),
      TF({ en: 'ai and ei are pronounced the same way.', vi: 'ai và ei được phát âm giống nhau.' }, false,
        { en: 'ai opens on a low a, ei on a mid e — 爱 ài and 给 gěi are different words.', vi: 'ai mở đầu bằng a thấp, ei bằng e trung – 爱 ài và 给 gěi là hai từ khác nhau.' })
    ]
  },

  'hsk0-l09-finals-nasal': {
    sounds: [
      ['安', 'ān', 'an – "ah" closed with the tongue at the gums. Meaning: peaceful.', 'an – "a" đóng lại bằng lưỡi chạm lợi. Nghĩa: yên, an.'],
      ['很', 'hěn', 'en – like a light "ân". Meaning: very.', 'en – như "ân" nhẹ. Nghĩa: rất.'],
      ['冷', 'lěng', 'eng – ends in a nasal "ng" at the back. Meaning: cold.', 'eng – kết thúc bằng "ng" vang ở phía sau. Nghĩa: lạnh.'],
      ['中', 'zhōng', 'ong – rounded lips plus a back "ng". Meaning: middle.', 'ong – môi tròn cộng đuôi "ng" phía sau. Nghĩa: ở giữa.']
    ],
    exercises: [
      L('安', 'ān', 'peaceful', 'yên, an', ['ān', 'āng', 'ēn', 'ēng'], { en: '-n closes with the tongue tip at the gums.', vi: '-n đóng lại bằng đầu lưỡi chạm lợi.' }),
      L('很', 'hěn', 'very', 'rất', ['hěn', 'hěng', 'hǎn', 'hàng'], { en: 'en is a front nasal — the tongue tip touches the gums.', vi: 'en là vận mũi trước – đầu lưỡi chạm lợi.' }),
      L('冷', 'lěng', 'cold', 'lạnh', ['lěng', 'lěn', 'lǎng', 'lán'], { en: 'eng is a back nasal — the sound resonates behind the mouth.', vi: 'eng là vận mũi sau – âm vang ở phía sau khoang miệng.' }),
      L('中', 'zhōng', 'middle', 'ở giữa', ['zhōng', 'zhēn', 'zhèn', 'zhāng'], { en: 'ong rounds the lips before the -ng ending.', vi: 'ong tròn môi trước khi đóng bằng đuôi -ng.' }),
      MC({ en: 'What is the difference between -n and -ng at the end of a final?', vi: 'Khác biệt giữa đuôi -n và -ng của vận mẫu là gì?' },
        [{ en: '-n closes with the tongue at the gums; -ng resonates at the back of the mouth', vi: '-n đóng bằng lưỡi chạm lợi; -ng vang ở phía sau khoang miệng' },
         { en: 'They are the same sound', vi: 'Chúng là cùng một âm' },
         { en: '-n is simply longer than -ng', vi: '-n chỉ đơn giản là dài hơn -ng' },
         { en: '-ng is only used in questions', vi: '-ng chỉ dùng trong câu hỏi' }], 0,
        { en: 'The closing position is the whole difference, and it changes the word.', vi: 'Vị trí đóng âm chính là toàn bộ khác biệt, và nó làm đổi nghĩa từ.' }),
      MC({ en: 'Which syllable ends in -ng?', vi: 'Âm tiết nào kết thúc bằng -ng?' },
        [{ en: 'lěng 冷', vi: 'lěng 冷' }, { en: 'hěn 很', vi: 'hěn 很' }, { en: 'ān 安', vi: 'ān 安' }, { en: 'mén 门', vi: 'mén 门' }], 0,
        { en: 'Only 冷 lěng has the back nasal ending.', vi: 'Chỉ 冷 lěng có đuôi mũi sau.' }),
      TF({ en: 'an and ang are the same sound, so the difference never changes meaning.', vi: 'an và ang là cùng một âm nên khác biệt đó không bao giờ làm đổi nghĩa.' }, false,
        { en: 'They are different finals: 安 ān and 昂 áng are different words.', vi: 'Đó là hai vận mẫu khác nhau: 安 ān và 昂 áng là hai từ khác nhau.' })
    ]
  },

  'hsk0-l10-syllables': {
    sounds: [
      ['你好', 'nǐ hǎo', 'n + i + tone 3, twice. Meaning: hello.', 'n + i + thanh 3, hai lần. Nghĩa: xin chào.'],
      ['谢谢', 'xiè xie', 'x + ie + tone 4, then a neutral tone. Meaning: thank you.', 'x + ie + thanh 4, rồi một thanh nhẹ. Nghĩa: cảm ơn.'],
      ['老师', 'lǎo shī', 'l + ao + tone 3, sh + i + tone 1. Meaning: teacher.', 'l + ao + thanh 3, sh + i + thanh 1. Nghĩa: giáo viên.'],
      ['中国', 'zhōng guó', 'zh + ong + tone 1, g + uo + tone 2. Meaning: China.', 'zh + ong + thanh 1, g + uo + thanh 2. Nghĩa: Trung Quốc.'],
      ['学生', 'xué sheng', 'x + üe + tone 2, then a neutral tone. Meaning: student.', 'x + üe + thanh 2, rồi một thanh nhẹ. Nghĩa: học sinh.'],
      ['再见', 'zài jiàn', 'z + ai + tone 4, j + ian + tone 4. Meaning: goodbye.', 'z + ai + thanh 4, j + ian + thanh 4. Nghĩa: tạm biệt.']
    ],
    exercises: [
      L('你好', 'nǐ hǎo', 'hello', 'xin chào', ['nǐ hǎo', 'nī hāo', 'nì hào', 'ní háo'], { en: 'Both syllables are written with tone 3, even though the first is said as a tone 2.', vi: 'Cả hai tiếng đều viết thanh 3, dù tiếng đầu đọc thành thanh 2.' }),
      L('谢谢', 'xiè xie', 'thank you', 'cảm ơn', ['xiè xie', 'xié xié', 'xiè xiè', 'qiè qie'], { en: 'Tone 4 followed by a neutral tone.', vi: 'Thanh 4 rồi đến thanh nhẹ.' }),
      L('老师', 'lǎo shī', 'teacher', 'giáo viên', ['lǎo shī', 'lāo shí', 'lǎo sī', 'lào shì'], { en: 'sh is retroflex, so it is shī and not sī.', vi: 'sh là âm uốn lưỡi nên đọc shī chứ không phải sī.' }),
      L('中国', 'zhōng guó', 'China', 'Trung Quốc', ['zhōng guó', 'zōng guó', 'zhōng kuó', 'zhòng guǒ'], { en: 'zh is retroflex and g is unaspirated.', vi: 'zh là âm uốn lưỡi còn g thì không bật hơi.' }),
      L('再见', 'zài jiàn', 'goodbye', 'tạm biệt', ['zài jiàn', 'zǎi jiān', 'cài jiàn', 'zài qiàn'], { en: 'z is unaspirated (not c) and j is unaspirated (not q).', vi: 'z không bật hơi (khác c) và j cũng không bật hơi (khác q).' }),
      MC({ en: 'A Chinese syllable is normally made of…', vi: 'Một âm tiết tiếng Trung thường gồm…' },
        [{ en: 'An initial + a final + a tone', vi: 'Thanh mẫu + vận mẫu + thanh điệu' },
         { en: 'Only a vowel and a tone', vi: 'Chỉ một nguyên âm và một thanh điệu' },
         { en: 'Two consonants and a vowel', vi: 'Hai phụ âm và một nguyên âm' },
         { en: 'An initial and a tone only', vi: 'Chỉ thanh mẫu và thanh điệu' }], 0,
        { en: 'Initial + final + tone is the standard structure.', vi: 'Thanh mẫu + vận mẫu + thanh điệu là cấu trúc chuẩn.' }),
      TF({ en: 'Every Chinese syllable must begin with an initial consonant.', vi: 'Mọi âm tiết tiếng Trung đều phải bắt đầu bằng một phụ âm đầu.' }, false,
        { en: 'Syllables like 爱 ài and 五 wǔ have no initial at all.', vi: 'Những âm tiết như 爱 ài và 五 wǔ hoàn toàn không có thanh mẫu.' })
    ]
  },

  'hsk0-l11-neutral-tone': {
    sounds: [
      ['谢谢', 'xiè xie', 'The repeated syllable drops its tone. Meaning: thank you.', 'Tiếng lặp lại mất thanh điệu. Nghĩa: cảm ơn.'],
      ['学生', 'xué sheng', 'sheng is unstressed and short. Meaning: student.', 'sheng đọc nhẹ và ngắn. Nghĩa: học sinh.'],
      ['妈妈', 'mā ma', 'The second 妈 is neutral. Meaning: mum.', '妈 thứ hai đọc thanh nhẹ. Nghĩa: mẹ.'],
      ['朋友', 'péng you', 'you is unstressed. Meaning: friend.', 'you đọc nhẹ, không nhấn. Nghĩa: bạn bè.'],
      ['吗', 'ma', 'A question particle, always neutral.', 'Trợ từ nghi vấn, luôn đọc thanh nhẹ.']
    ],
    exercises: [
      L('谢谢', 'xiè xie', 'thank you', 'cảm ơn', ['xiè xie', 'xiè xiè', 'xié xie', 'xie xie'], { en: 'Only the first syllable keeps its tone.', vi: 'Chỉ tiếng đầu giữ thanh điệu.' }),
      L('学生', 'xué sheng', 'student', 'học sinh', ['xué sheng', 'xué shēng', 'xuē sheng', 'xuè shèng'], { en: 'This project writes the neutral syllable without a mark: xué sheng.', vi: 'Dự án này viết tiếng thanh nhẹ không dấu: xué sheng.' }),
      L('妈妈', 'mā ma', 'mum', 'mẹ', ['mā ma', 'mā mā', 'má ma', 'mǎ ma'], { en: 'Doubled kinship words take a neutral tone on the second syllable.', vi: 'Từ chỉ người thân dạng lặp thì tiếng thứ hai đọc thanh nhẹ.' }),
      L('朋友', 'péng you', 'friend', 'bạn bè', ['péng you', 'péng yǒu', 'pēng yōu', 'pèng yòu'], { en: '友 keeps its tone 3 in the dictionary but is neutral inside 朋友.', vi: '友 vốn là thanh 3 trong từ điển nhưng trong 朋友 thì đọc thanh nhẹ.' }),
      MC({ en: 'How is a neutral-tone syllable pronounced?', vi: 'Âm tiết thanh nhẹ được phát âm thế nào?' },
        [{ en: 'Short, light and unstressed', vi: 'Ngắn, nhẹ và không nhấn' },
         { en: 'Long and heavily stressed', vi: 'Dài và nhấn mạnh' },
         { en: 'Always with a falling contour', vi: 'Luôn có đường nét đi xuống' },
         { en: 'Always with a rising contour', vi: 'Luôn có đường nét đi lên' }], 0,
        { en: 'Its actual pitch depends on the tone before it, but it is always short and weak.', vi: 'Cao độ thực tế phụ thuộc thanh đứng trước, nhưng luôn ngắn và yếu.' }),
      MC({ en: 'Which of these is always read in the neutral tone?', vi: 'Từ nào sau đây luôn được đọc bằng thanh nhẹ?' },
        [{ en: '吗 ma (question particle)', vi: '吗 ma (trợ từ nghi vấn)' }, { en: '好 hǎo (good)', vi: '好 hǎo (tốt)' },
         { en: '我 wǒ (I)', vi: '我 wǒ (tôi)' }, { en: '学 xué (to study)', vi: '学 xué (học)' }], 0,
        { en: 'Grammatical particles such as 吗, 的 and 了 never carry a tone of their own.', vi: 'Các trợ từ ngữ pháp như 吗, 的, 了 không bao giờ mang thanh điệu riêng.' }),
      TF({ en: 'A neutral-tone syllable is written with a tone mark in pinyin.', vi: 'Âm tiết thanh nhẹ được viết kèm dấu thanh trong pinyin.' }, false,
        { en: 'It is written bare — that missing mark is exactly how you spot it.', vi: 'Nó được viết trần – chính việc thiếu dấu là dấu hiệu nhận ra.' })
    ]
  },

  'hsk0-l12-tone-sandhi': {
    sounds: [
      ['你好', 'nǐ hǎo', 'Two tone 3s: said as ní hǎo, written nǐ hǎo. Meaning: hello.', 'Hai thanh 3: đọc là ní hǎo, viết là nǐ hǎo. Nghĩa: xin chào.'],
      ['不是', 'bú shì', '不 before a tone 4 becomes bú. Meaning: is not.', '不 trước thanh 4 đổi thành bú. Nghĩa: không phải.'],
      ['不好', 'bù hǎo', '不 before a tone 3 stays bù. Meaning: not good.', '不 trước thanh 3 vẫn là bù. Nghĩa: không tốt.'],
      ['一个', 'yí gè', '一 before a tone 4 becomes yí. Meaning: one (item).', '一 trước thanh 4 đổi thành yí. Nghĩa: một (cái).'],
      ['一天', 'yì tiān', '一 before a tone 1 becomes yì. Meaning: one day.', '一 trước thanh 1 đổi thành yì. Nghĩa: một ngày.']
    ],
    exercises: [
      MC({ en: 'When two third tones follow each other, how is the first one read?', vi: 'Khi hai thanh 3 đứng liền nhau, tiếng đầu được đọc thế nào?' },
        [{ en: 'As a second tone', vi: 'Thành thanh 2' }, { en: 'As a first tone', vi: 'Thành thanh 1' },
         { en: 'As a fourth tone', vi: 'Thành thanh 4' }, { en: 'Unchanged', vi: 'Giữ nguyên' }], 0,
        { en: 'nǐ hǎo is pronounced ní hǎo, though the spelling does not change.', vi: 'nǐ hǎo được đọc là ní hǎo, dù cách viết không đổi.' }),
      L('不是', 'bú shì', 'is not', 'không phải', ['bú shì', 'bù shì', 'bǔ shì', 'bù shí'],
        { en: '是 shì is a tone 4, so 不 shifts to bú.', vi: '是 shì là thanh 4 nên 不 chuyển thành bú.' }),
      L('一个', 'yí gè', 'one (item)', 'một (cái)', ['yí gè', 'yī gè', 'yì gè', 'yǐ gè'],
        { en: '个 gè is a tone 4, so 一 shifts to yí.', vi: '个 gè là thanh 4 nên 一 chuyển thành yí.' }),
      MC({ en: '一 in front of a first, second or third tone — as in 一天 — is read…', vi: '一 đứng trước thanh 1, 2 hoặc 3 – như trong 一天 – được đọc là…' },
        [{ en: 'yì', vi: 'yì' }, { en: 'yí', vi: 'yí' }, { en: 'yī', vi: 'yī' }, { en: 'yǐ', vi: 'yǐ' }], 0,
        { en: 'It takes tone 4 (yì) before tones 1, 2 and 3, and tone 2 (yí) before tone 4.', vi: 'Nó mang thanh 4 (yì) trước thanh 1, 2, 3 và mang thanh 2 (yí) trước thanh 4.' }),
      MC({ en: '不 in front of a fourth tone — as in 不是 — is read…', vi: '不 đứng trước thanh 4 – như trong 不是 – được đọc là…' },
        [{ en: 'bú', vi: 'bú' }, { en: 'bù', vi: 'bù' }, { en: 'bǔ', vi: 'bǔ' }, { en: 'bu', vi: 'bu' }], 0,
        { en: 'Only before a tone 4 does 不 rise to bú; elsewhere it stays bù.', vi: 'Chỉ trước thanh 4 thì 不 mới đi lên thành bú; các trường hợp khác vẫn là bù.' }),
      TF({ en: '不 keeps its original bù reading when the next syllable is a first, second or third tone.', vi: '不 giữ nguyên cách đọc bù khi tiếng sau là thanh 1, 2 hoặc 3.' }, true,
        { en: 'Correct: 不好 bù hǎo, 不来 bù lái — only tone 4 triggers the change.', vi: 'Đúng: 不好 bù hǎo, 不来 bù lái – chỉ thanh 4 mới gây biến đổi.' }),
      TF({ en: 'Tone sandhi changes the pinyin spelling of 你好.', vi: 'Biến điệu làm thay đổi cách viết pinyin của 你好.' }, false,
        { en: 'The sound changes but the spelling stays nǐ hǎo — sandhi is a rule of speech.', vi: 'Âm đọc thay đổi nhưng cách viết vẫn là nǐ hǎo – biến điệu là quy tắc khi nói.' })
    ]
  },

  'hsk0-l13-review': {
    sounds: [
      ['你好', 'nǐ hǎo', 'Third-tone sandhi. Meaning: hello.', 'Biến điệu thanh 3. Nghĩa: xin chào.'],
      ['谢谢', 'xiè xie', 'Tone 4 + neutral tone. Meaning: thank you.', 'Thanh 4 + thanh nhẹ. Nghĩa: cảm ơn.'],
      ['中国', 'zhōng guó', 'Retroflex zh. Meaning: China.', 'Âm uốn lưỡi zh. Nghĩa: Trung Quốc.'],
      ['再见', 'zài jiàn', 'Unaspirated z and j. Meaning: goodbye.', 'z và j không bật hơi. Nghĩa: tạm biệt.'],
      ['不客气', 'bú kè qi', '不 sandhi plus a neutral tone. Meaning: you are welcome.', 'Biến điệu của 不 cộng một thanh nhẹ. Nghĩa: không có gì.']
    ],
    exercises: [
      L('你好', 'nǐ hǎo', 'hello', 'xin chào', ['nǐ hǎo', 'nì hào', 'ní háo', 'nī hāo'], { en: 'Written with two tone 3 marks, spoken as ní hǎo.', vi: 'Viết bằng hai dấu thanh 3, đọc thành ní hǎo.' }),
      L('谢谢', 'xiè xie', 'thank you', 'cảm ơn', ['xiè xie', 'xié xié', 'xǐ xǐ', 'qiè qie'], { en: 'x is a thin hiss, and the second syllable is neutral.', vi: 'x là âm xát mảnh, còn tiếng thứ hai là thanh nhẹ.' }),
      L('中国', 'zhōng guó', 'China', 'Trung Quốc', ['zhōng guó', 'chōng kuó', 'zhòng guǒ', 'zhōng kuò'], { en: 'zh is unaspirated and retroflex; g is unaspirated.', vi: 'zh là âm uốn lưỡi không bật hơi; g cũng không bật hơi.' }),
      L('再见', 'zài jiàn', 'goodbye', 'tạm biệt', ['zài jiàn', 'zǎi jiān', 'cài jiàn', 'zài qiàn'], { en: 'Two sharp tone 4s in a row.', vi: 'Hai thanh 4 dứt khoát liền nhau.' }),
      L('不客气', 'bú kè qi', 'you are welcome', 'không có gì', ['bú kè qi', 'bù kè qi', 'bú kè qì', 'bù kē qi'], { en: '客 kè is a tone 4, so 不 becomes bú; 气 is neutral here.', vi: '客 kè là thanh 4 nên 不 thành bú; 气 ở đây đọc thanh nhẹ.' }),
      MC({ en: 'Which group of initials is retroflex — pronounced with the tongue curled back?', vi: 'Nhóm thanh mẫu nào là nhóm uốn lưỡi – phát âm với lưỡi cong ra sau?' },
        [{ en: 'zh ch sh r', vi: 'zh ch sh r' }, { en: 'z c s', vi: 'z c s' }, { en: 'j q x', vi: 'j q x' }, { en: 'b p m f', vi: 'b p m f' }], 0,
        { en: 'z c s are their flat-tongue counterparts; j q x keep the tongue tip low.', vi: 'z c s là nhóm lưỡi phẳng tương ứng; j q x giữ đầu lưỡi thấp.' }),
      TF({ en: 'A neutral tone is written without a tone mark.', vi: 'Thanh nhẹ được viết không có dấu thanh.' }, true,
        { en: 'That is how xie in 谢谢 and sheng in 学生 are written.', vi: 'Đó là cách viết xie trong 谢谢 và sheng trong 学生.' })
    ]
  }
};

export { LISTEN_PROMPT };
