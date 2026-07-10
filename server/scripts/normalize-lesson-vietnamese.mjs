import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, resolveContentPath } from '../src/config/content-paths.js';
import { accentVietnameseDeep } from './vietnamese-diacritics.mjs';

const inputDirArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith('--input-dir='))
  ?.split('=')[1];

const walkJsonFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJsonFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
  }));

  return nested.flat();
};

const main = async () => {
  const inputDir = inputDirArg
    ? path.resolve(repoRoot, inputDirArg)
    : await resolveContentPath('lessons/normalized');
  const files = await walkJsonFiles(inputDir);
  let updated = 0;

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const data = JSON.parse(raw);
    const normalized = `${JSON.stringify(accentVietnameseDeep(data), null, 2)}\n`;

    if (normalized !== raw) {
      await writeFile(file, normalized, 'utf8');
      updated += 1;
    }
  }

  console.log(`Checked ${files.length} JSON files; updated ${updated}.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
