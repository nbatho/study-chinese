// Checks candidate headwords against words/ before they go into a lesson spec.
// Usage: node server/scripts/content/lookup.mjs <level> 词1 词2 ...
import { loadWords, effectiveLevel } from './lib.mjs';

const [level, ...terms] = process.argv.slice(2);
const { bySimplified } = await loadWords();
const ok = [];
const bad = [];
for (const term of terms) {
  const entries = bySimplified.get(term) || [];
  if (!entries.length) {
    bad.push(`${term}: NOT IN DICTIONARY`);
    continue;
  }
  const best = Math.min(...entries.map(effectiveLevel));
  if (best <= Number(level)) ok.push(`${term}(${best})`);
  else bad.push(`${term}: HSK${best} > ${level}`);
}
console.log('OK   ', ok.join(' '));
if (bad.length) console.log('ABOVE', bad.join(' | '));
