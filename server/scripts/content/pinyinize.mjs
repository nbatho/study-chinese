// Derives passage pinyin from the project's own dictionary.
//
// The HSK4-6 reading passages shipped with `content_pinyin: null`, and hand-writing ~200
// syllables per passage across 78 passages would be both slow and error-prone. Multi-syllable
// words are segmented longest-match first so their dictionary reading wins, which resolves
// most polyphones (重要 zhòng yào vs 重复 chóng fù); the map below pins the single characters
// whose bare dictionary entry is not the reading used in running text.
//
// The result still follows the project convention of *written* 一/不 sandhi.
import { loadWords, effectiveLevel } from './lib.mjs';

// Single characters whose most common running-text reading differs from the first
// dictionary entry, or that the dictionary lists under several readings.
const SINGLE = {
  的: 'de', 得: 'de', 地: 'de', 了: 'le', 着: 'zhe', 过: 'guo',
  不: 'bù', 一: 'yī', 是: 'shì', 在: 'zài', 有: 'yǒu', 和: 'hé', 也: 'yě',
  还: 'hái', 长: 'cháng', 只: 'zhǐ', 为: 'wèi', 会: 'huì', 要: 'yào',
  差: 'chā', 重: 'zhòng', 相: 'xiāng', 数: 'shù', 教: 'jiāo', 都: 'dōu',
  更: 'gèng', 便: 'biàn', 少: 'shǎo', 好: 'hǎo', 中: 'zhōng', 大: 'dà',
  给: 'gěi', 行: 'xíng', 干: 'gàn', 应: 'yīng', 当: 'dāng', 种: 'zhǒng'
};

// The project writes frequent unstressed syllables toneless (xué sheng, not xué shēng);
// the dictionary stores the citation form, so these are corrected on the way out.
const NEUTRAL = {
  学生: 'xué sheng', 时候: 'shí hou', 东西: 'dōng xi', 朋友: 'péng you', 喜欢: 'xǐ huan',
  知道: 'zhī dao', 衣服: 'yī fu', 漂亮: 'piào liang', 明白: 'míng bai', 休息: 'xiū xi',
  舒服: 'shū fu', 清楚: 'qīng chu', 谢谢: 'xiè xie', 先生: 'xiān sheng', 儿子: 'ér zi',
  孩子: 'hái zi', 名字: 'míng zi', 房子: 'fáng zi', 桌子: 'zhuō zi', 椅子: 'yǐ zi',
  事情: 'shì qing', 关系: 'guān xi', 意思: 'yì si', 打算: 'dǎ suan', 便宜: 'pián yi',
  暖和: 'nuǎn huo', 认识: 'rèn shi', 告诉: 'gào su', 觉得: 'jué de', 记得: 'jì de',
  安静: 'ān jìng', 麻烦: 'má fan', 客气: 'kè qi', 咱们: 'zán men', 我们: 'wǒ men',
  你们: 'nǐ men', 他们: 'tā men', 她们: 'tā men', 什么: 'shén me', 怎么: 'zěn me',
  这么: 'zhè me', 那么: 'nà me', 多少: 'duō shao', 早上: 'zǎo shang', 晚上: 'wǎn shang',
  上面: 'shàng mian', 里面: 'lǐ mian', 外面: 'wài mian', 后面: 'hòu mian',
  地方: 'dì fang', 服务: 'fú wù', 讲究: 'jiǎng jiu', 热闹: 'rè nao', 商量: 'shāng liang',
  照顾: 'zhào gu', 收拾: 'shōu shi', 认真: 'rèn zhēn', 精神: 'jīng shen'
};

const TONE_OF = (syllable) => {
  const marks = [
    [/[āēīōūǖ]/, 1], [/[áéíóúǘ]/, 2], [/[ǎěǐǒǔǚ]/, 3], [/[àèìòùǜ]/, 4]
  ];
  for (const [re, tone] of marks) if (re.test(syllable)) return tone;
  return 0;
};

export const buildPinyinizer = async () => {
  const { bySimplified } = await loadWords();
  const readings = new Map();
  for (const [simplified, entries] of bySimplified) {
    const best = [...entries].sort((a, b) => effectiveLevel(a) - effectiveLevel(b))[0];
    // ~170 dictionary entries are capitalised, and most are ordinary words rather than
    // proper nouns (大学, 网络, 现代). Readings are lower-cased here; a passage that really
    // does name a place or a brand should carry an explicit `pinyin` in its spec.
    const pinyin = String(best.pinyin || '').trim().toLowerCase();
    if (pinyin) readings.set(simplified, pinyin);
  }
  for (const [word, reading] of Object.entries(NEUTRAL)) readings.set(word, reading);
  for (const [char, reading] of Object.entries(SINGLE)) readings.set(char, reading);
  const maxLen = Math.max(...[...readings.keys()].map((w) => w.length));

  return (text) => {
    const out = [];
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      if (/[，。；：、？！“”（）《》]/.test(char)) {
        // Punctuation rides along with the previous syllable group.
        const punct = /[。？！]/.test(char) ? `${char} ` : `${char} `;
        out.push({ punct });
        i += 1;
        continue;
      }
      if (!/\p{Script=Han}/u.test(char)) { i += 1; continue; }
      let matched = null;
      for (let len = Math.min(maxLen, text.length - i); len >= 1; len -= 1) {
        const slice = text.slice(i, i + len);
        if (readings.has(slice)) { matched = slice; break; }
      }
      if (!matched) { out.push({ syllables: ['?'] }); i += 1; continue; }
      // 一 keeps its first tone when it is a counted number rather than the adverbial 一
      // (第十一课 dì shí yī kè, 一月 yī yuè), so sandhi is suppressed in those contexts.
      const ordinal = matched === '一'
        && (/[第十百千两零二三四五六七八九]/.test(text[i - 1] || '') || /[月号日点]/.test(text[i + 1] || ''));
      out.push({ syllables: readings.get(matched).split(/\s+/), word: ordinal ? '数一' : matched });
      i += matched.length;
    }

    // 一/不 sandhi, written out as the project's pinyin convention requires. Only the
    // standalone characters shift — the `bù` inside 进步 (jìn bù) must be left alone.
    const flat = [];
    for (const token of out) {
      if (token.punct) { flat.push(token); continue; }
      token.syllables.forEach((syllable, index) => {
        // 不 sandhi is exceptionless, so it applies wherever 不 opens a word (不够 -> bú gòu,
        // which several dictionary entries store unshifted). 一 is left to the dictionary
        // inside longer words, where ordinals and dates (一月 yī yuè) do not shift.
        const sandhi = index === 0 && (token.word === '一' || token.word?.startsWith('不'))
          ? token.word[0]
          : null;
        flat.push({ syllable, sandhi });
      });
    }
    for (let n = 0; n < flat.length; n += 1) {
      const cur = flat[n];
      if (!cur.sandhi) continue;
      const next = flat.slice(n + 1).find((t) => t.syllable);
      if (!next) continue;
      const nextTone = TONE_OF(next.syllable);
      if (cur.sandhi === '不') cur.syllable = nextTone === 4 ? 'bú' : 'bù';
      if (cur.sandhi === '一') cur.syllable = nextTone === 4 ? 'yí' : nextTone ? 'yì' : 'yī';
    }

    let result = '';
    for (const token of flat) {
      if (token.punct) { result = `${result.trimEnd()}${token.punct}`; continue; }
      result += `${token.syllable} `;
    }
    return result.replace(/\s+/g, ' ').trim();
  };
};
