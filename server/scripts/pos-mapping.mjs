const POS_MAP = new Map([
  ['n', 'noun'],
  ['nr', 'noun'],
  ['ns', 'noun'],
  ['nz', 'noun'],
  ['nt', 'noun'],
  ['v', 'verb'],
  ['vn', 'verb'],
  ['a', 'adjective'],
  ['an', 'adjective'],
  ['ad', 'adjective'],
  ['d', 'adverb'],
  ['r', 'pronoun'],
  ['rg', 'pronoun'],
  ['m', 'numeral'],
  ['mg', 'numeral'],
  ['q', 'measure'],
  ['qv', 'measure'],
  ['qt', 'measure'],
  ['mq', 'measure'],
  ['c', 'conjunction'],
  ['cc', 'conjunction'],
  ['p', 'preposition'],
  ['u', 'particle'],
  ['y', 'particle'],
  ['e', 'interjection'],
  ['o', 'interjection'],
  ['h', 'prefix'],
  ['k', 'suffix'],
  ['l', 'idiom'],
  ['i', 'idiom'],
  ['b', 'other'],
  ['g', 'other'],
  ['tg', 'other'],
  ['z', 'other'],
  ['s', 'other'],
  ['t', 'other'],
  ['f', 'other']
]);

export const DB_PARTS_OF_SPEECH = Object.freeze([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'numeral',
  'measure',
  'phrase',
  'conjunction',
  'preposition',
  'particle',
  'interjection',
  'prefix',
  'suffix',
  'idiom',
  'other'
]);

export const mapPOS = (rawTags = []) => {
  const tags = Array.isArray(rawTags) ? rawTags : [rawTags];

  if (tags.length === 0 || tags.every((tag) => !String(tag || '').trim())) {
    return 'phrase';
  }

  for (const tag of tags) {
    const mapped = POS_MAP.get(String(tag || '').trim().toLowerCase());

    if (mapped) {
      return mapped;
    }
  }

  return 'other';
};

export const getPOSMapping = () => Object.fromEntries(POS_MAP.entries());
