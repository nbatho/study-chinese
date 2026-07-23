// Shared helpers for the content build scripts.
import { readFile, readdir } from 'node:fs/promises';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../data');

/** A word is in scope if ANY official HSK standard places it at or below `level`. */
export const effectiveLevel = (word) => {
  const levels = (word.level_sources || [])
    .map((source) => Number(/-(\d)$/.exec(source)?.[1]))
    .filter(Number.isInteger);
  if (Number.isInteger(word.hsk_level)) levels.push(word.hsk_level);
  return levels.length ? Math.min(...levels) : 0;
};

export const loadWords = async () => {
  const byId = new Map();
  const bySimplified = new Map();
  for (const chunk of await readdir(`${DATA}/words`)) {
    for (const word of JSON.parse(await readFile(`${DATA}/words/${chunk}/en.json`, 'utf8'))) {
      byId.set(word.id, word);
      const list = bySimplified.get(word.simplified) || [];
      list.push(word);
      bySimplified.set(word.simplified, list);
    }
  }
  return { byId, bySimplified };
};

/**
 * Resolves a headword to the best word_id at or below `level`, preferring an entry whose
 * pinyin matches (the dictionary holds homographs such as 长 cháng / zhǎng).
 */
export const resolve = (bySimplified, simplified, level, pinyinHint) => {
  const candidates = (bySimplified.get(simplified) || []).filter((w) => effectiveLevel(w) <= level);
  if (!candidates.length) return null;
  const plain = (value) => String(value || '').toLowerCase().replace(/[\s'’]/g, '');
  if (pinyinHint) {
    const exact = candidates.find((w) => plain(w.pinyin_plain || w.pinyin) === plain(pinyinHint));
    if (exact) return exact;
  }
  // Prefer curated hsk_* / wd_* entries over bulk OCR imports.
  const ranked = [...candidates].sort((a, b) => {
    const score = (w) => (w.id.startsWith('hsk_') ? 0 : w.id.startsWith('wd_') ? 1 : w.id.startsWith('lesson_') ? 2 : 3);
    return score(a) - score(b) || effectiveLevel(a) - effectiveLevel(b);
  });
  return ranked[0];
};

export const countHanzi = (value) => [...String(value || '')].filter((c) => /\p{Script=Han}/u.test(c)).length;
