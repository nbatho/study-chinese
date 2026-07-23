// Reports words above a lesson's HSK level under every official standard, across all the
// authored Chinese: dialogue, reading passages, grammar examples and exercises.
// Longest-match segmentation, so 有时间 is not read as 有时 + 间.
// Usage: node check-scope.mjs <lessonId...>   (default: every hsk{N} lesson)
//        node check-scope.mjs --dialogue-only <lessonId...>
import { readFile, readdir } from 'node:fs/promises';
import { DATA, loadWords, effectiveLevel } from './lib.mjs';

const { bySimplified } = await loadWords();
const known = new Map();
for (const [simplified, entries] of bySimplified) {
  known.set(simplified, Math.min(...entries.map(effectiveLevel)));
}
const MAX_LEN = Math.max(...[...known.keys()].map((w) => w.length));

const segment = (text) => {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    let matched = null;
    for (let len = Math.min(MAX_LEN, text.length - i); len >= 1; len -= 1) {
      const slice = text.slice(i, i + len);
      if (known.has(slice)) { matched = slice; break; }
    }
    if (matched) { tokens.push(matched); i += matched.length; } else { i += 1; }
  }
  return tokens;
};

const args = process.argv.slice(2);
const dialogueOnly = args.includes('--dialogue-only');
const named = args.filter((arg) => !arg.startsWith('--'));
const ids = named.length
  ? named
  : (await readdir(`${DATA}/lessons`)).filter((d) => /^hsk[1-6]-/.test(d)).sort();

const readJson = async (dir, lessonId) => {
  try {
    return JSON.parse(await readFile(`${DATA}/${dir}/${lessonId}/en.json`, 'utf8'));
  } catch {
    return null;
  }
};

let flagged = 0;
for (const lessonId of ids) {
  const level = Number(/^hsk(\d)-/.exec(lessonId)[1]);
  const lesson = JSON.parse(await readFile(`${DATA}/lessons/${lessonId}/en.json`, 'utf8'));
  const texts = (lesson.dialogue?.lines || []).map((line) => line.simplified);

  if (!dialogueOnly) {
    for (const passage of (await readJson('reading_passages', lessonId)) || []) {
      texts.push(passage.content_zh || '');
      for (const question of passage.questions || []) {
        texts.push(question.question || '', ...(question.options || []));
      }
    }
    for (const point of (await readJson('grammar_points', lessonId)) || []) {
      for (const example of point.examples || []) texts.push(example.zh || '');
    }
    for (const exercise of (await readJson('exercises', lessonId)) || []) {
      texts.push(exercise.prompt || '', ...(exercise.options || []));
    }
  }

  const over = new Map();
  for (const text of texts) {
    for (const token of segment(text)) {
      if (token.length >= 2 && known.get(token) > level) over.set(token, known.get(token));
    }
  }
  if (over.size) {
    flagged += over.size;
    console.log(`${lessonId}: ${[...over].map(([w, l]) => `${w}(HSK${l})`).join(' ')}`);
  }
}
console.log(`\n${flagged} above-level words across ${ids.length} lessons.`);
