const minimalPairs = [
  { id: 'ma-1-3', wordA: 'mā', wordB: 'mǎ', charA: '妈', charB: '马', toneA: 1, toneB: 3, label: 'mother vs horse' },
  { id: 'ma-1-2', wordA: 'mā', wordB: 'má', charA: '妈', charB: '麻', toneA: 1, toneB: 2, label: 'mother vs hemp' },
  { id: 'ma-1-4', wordA: 'mā', wordB: 'mà', charA: '妈', charB: '骂', toneA: 1, toneB: 4, label: 'mother vs scold' },
  { id: 'shu-1-3', wordA: 'shū', wordB: 'shǔ', charA: '书', charB: '鼠', toneA: 1, toneB: 3, label: 'book vs mouse' },
  { id: 'cha-2-4', wordA: 'chá', wordB: 'chà', charA: '茶', charB: '差', toneA: 2, toneB: 4, label: 'tea vs poor' },
  { id: 'mai-3-4', wordA: 'mǎi', wordB: 'mài', charA: '买', charB: '卖', toneA: 3, toneB: 4, label: 'buy vs sell' }
];

const shadowingPrompts = [
  { id: 'hello', hanzi: '你好！', pinyin: 'nǐ hǎo', english: 'Hello!' },
  { id: 'recently', hanzi: '最近好吗？', pinyin: 'zuìjìn hǎo ma', english: 'How are you lately?' },
  { id: 'student', hanzi: '我是学生。', pinyin: 'wǒ shì xuéshēng', english: 'I am a student.' },
  { id: 'price', hanzi: '这个多少钱？', pinyin: 'zhège duōshǎo qián', english: 'How much is this?' },
  { id: 'meet', hanzi: '很高兴认识你！', pinyin: 'hěn gāoxìng rènshi nǐ', english: 'Nice to meet you!' }
];

const hanziStrokes = [
  { id: 'ren', character: '人', strokes: ['M50,20 L20,80', 'M50,20 L80,80'] },
  { id: 'da', character: '大', strokes: ['M15,35 L85,35', 'M50,20 L25,80', 'M50,35 L80,80'] },
  { id: 'zhong', character: '中', strokes: ['M25,20 L25,70', 'M75,20 L75,70', 'M25,20 L75,20', 'M50,10 L50,90'] },
  { id: 'guo', character: '国', strokes: ['M15,10 L15,90', 'M85,10 L85,90', 'M15,10 L85,10', 'M15,90 L85,90', 'M35,30 L65,30', 'M35,50 L65,50', 'M35,70 L65,70', 'M50,25 L50,75'] },
  { id: 'hao', character: '好', strokes: ['M30,20 L20,60', 'M20,60 L40,65', 'M20,45 L40,45', 'M60,20 L60,70', 'M55,35 L75,35', 'M55,55 L75,55'] },
  { id: 'shui', character: '水', strokes: ['M50,15 L50,85', 'M30,35 L20,75', 'M25,55 L35,65', 'M50,55 L75,35', 'M50,55 L80,80'] },
  { id: 'huo', character: '火', strokes: ['M30,25 L20,50', 'M70,25 L80,50', 'M50,15 L30,85', 'M50,15 L70,85'] },
  { id: 'shan', character: '山', strokes: ['M15,85 L15,50', 'M50,85 L50,25', 'M85,85 L85,50', 'M15,85 L85,85'] },
  { id: 'kou', character: '口', strokes: ['M25,20 L25,80', 'M75,20 L75,80', 'M25,20 L75,20', 'M25,80 L75,80'] }
];

export const getPracticeCatalog = async () => ({
  minimalPairs,
  shadowingPrompts,
  hanziStrokes
});

export const getMinimalPairs = async () => ({ pairs: minimalPairs });

export const getShadowingPrompts = async () => ({ prompts: shadowingPrompts });

export const getHanziStrokes = async () => ({ characters: hanziStrokes });

export const scoreShadowing = async ({ promptId }) => {
  const prompt = shadowingPrompts.find((item) => item.id === promptId) || shadowingPrompts[0];
  const base = prompt.id.length;
  const accuracy = 78 + (base % 17);
  const tones = 76 + ((base * 3) % 18);
  const fluency = 80 + ((base * 5) % 16);
  const overall = Math.round((accuracy + tones + fluency) / 3);

  return {
    score: {
      accuracy,
      tones,
      fluency,
      overall,
      tip:
        overall >= 90
          ? 'Excellent pronunciation. Keep your tone contour steady.'
          : 'Good work. Slow down slightly and make the tone ending clearer.'
    }
  };
};
