const TONE_MARKS = {
  a: 'āáǎà',
  e: 'ēéěè',
  i: 'īíǐì',
  o: 'ōóǒò',
  u: 'ūúǔù',
  ü: 'ǖǘǚǜ',
  A: 'ĀÁǍÀ',
  E: 'ĒÉĚÈ',
  I: 'ĪÍǏÌ',
  O: 'ŌÓǑÒ',
  U: 'ŪÚǓÙ',
  Ü: 'ǕǗǙǛ'
};

const isVowel = (char) => 'aeiouü'.includes(char.toLowerCase());

export const markSyllable = (syllable, tone) => {
  let value = String(syllable)
    .replace(/u:/g, 'ü')
    .replace(/U:/g, 'Ü')
    .replace(/v/g, 'ü')
    .replace(/V/g, 'Ü');

  if (!tone || tone === 5) {
    return value;
  }

  const lower = value.toLowerCase();
  let index = -1;

  if (lower.includes('a')) {
    index = lower.indexOf('a');
  } else if (lower.includes('e')) {
    index = lower.indexOf('e');
  } else if (lower.includes('ou')) {
    index = lower.indexOf('o');
  } else {
    for (let i = value.length - 1; i >= 0; i -= 1) {
      if (isVowel(value[i])) {
        index = i;
        break;
      }
    }
  }

  if (index === -1) {
    return value;
  }

  const marks = TONE_MARKS[value[index]];
  if (!marks) {
    return value;
  }

  return value.slice(0, index) + marks[tone - 1] + value.slice(index + 1);
};

export const toDiacriticPinyin = (value) =>
  String(value ?? '').replace(/([A-Za-zü:ÜV]+?)([1-5])(?![0-9])/g, (_, syl, tone) => markSyllable(syl, Number(tone)));

const PINYIN_KEY = /(^|_)pinyin(_|$)|^example_pinyin$|^prompt_pinyin$|^content_pinyin$|^title_pinyin$/i;

export const convertPinyinDeep = (value, key = '') => {
  if (typeof value === 'string') {
    return PINYIN_KEY.test(key) ? toDiacriticPinyin(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => convertPinyinDeep(item, key));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [childKey, convertPinyinDeep(childValue, childKey)])
    );
  }

  return value;
};
