import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, resolveContentPath, resolveExistingPath } from '../src/config/content-paths.js';
import { loadLessonEntries } from './lesson-data-files.mjs';

const HAN_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/u;

const args = process.argv.slice(2);

const readArg = (name, fallback) => {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback;
};

const walkStrings = (value, visit) => {
  if (Array.isArray(value)) {
    value.forEach((item) => walkStrings(item, visit));
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => walkStrings(item, visit));
    return;
  }

  if (typeof value === 'string') {
    visit(value);
  }
};

const makeCharacterId = (character) => `lesson-hanzi-${character.codePointAt(0).toString(16)}`;

const sourceDir = await resolveExistingPath(readArg('source', 'data/lessons/normalized'), [
  'lessons',
  'normalized'
]);
const outputPath = resolveContentPath(readArg('output', 'data/practice/hanzi-characters.json'));

const entries = await loadLessonEntries(sourceDir);
const characters = new Map();

for (const { file, lesson } of entries) {
  const lessonId = lesson.lesson_id || path.basename(file, '.json');
  const hskLevel = lesson.metadata?.hsk_level ?? null;

  walkStrings(lesson, (text) => {
    for (const character of text) {
      if (!HAN_REGEX.test(character)) {
        continue;
      }

      const current = characters.get(character);

      if (current) {
        current.source_lesson_ids.add(lessonId);
        return;
      }

      characters.set(character, {
        id: makeCharacterId(character),
        character,
        strokes: [],
        first_lesson_id: lessonId,
        first_hsk_level: hskLevel,
        source_lesson_ids: new Set([lessonId])
      });
    }
  });
}

const output = {
  source: path.relative(repoRoot, sourceDir).replaceAll('\\', '/'),
  extraction: 'unique_han_characters_from_all_lesson_strings',
  count: characters.size,
  characters: [...characters.values()].map((item, index) => ({
    ...item,
    order_num: (index + 1) * 10,
    source_lesson_ids: [...item.source_lesson_ids]
  }))
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(`Generated ${output.count} Hanzi practice characters at ${outputPath}.`);
