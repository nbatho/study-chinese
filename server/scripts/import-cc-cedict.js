import { createReadStream } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

const { closeDB, query } = await import('../src/config/db.config.js');

const DEFAULT_PATH = path.join(serverRoot, 'data', 'cedict_ts.u8');
const BATCH_SIZE = Number(process.env.CEDICT_BATCH_SIZE || 1000);
const SOURCE = process.env.CEDICT_SOURCE || 'cc-cedict';
const CONTENT_VERSION = process.env.CEDICT_VERSION || null;
const DRY_RUN = process.argv.includes('--dry-run') || process.env.CEDICT_DRY_RUN === 'true';

const resolveInputPath = (value) => {
  if (!value) {
    return DEFAULT_PATH;
  }

  return path.isAbsolute(value) ? value : path.join(serverRoot, value);
};

const inputArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const inputPath = resolveInputPath(inputArg || process.env.CEDICT_PATH);
const schemaPath = path.join(serverRoot, 'scripts', 'dictionary-schema.sql');

const stripToneNumbers = (value) =>
  String(value || '')
    .replace(/u:/gi, 'v')
    .replace(/[1-5]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const parseLine = (line) => {
  const text = line.trim();

  if (!text || text.startsWith('#')) {
    return null;
  }

  const match = text.match(/^(\S+)\s+(\S+)\s+\[{1,2}(.+?)\]{1,2}\s+\/(.+)\/$/);
  if (!match) {
    return null;
  }

  const [, traditional, simplified, pinyin, definition] = match;
  const english = definition
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('; ');

  if (!traditional || !simplified || !pinyin || !english) {
    return null;
  }

  const pinyinPlain = stripToneNumbers(pinyin);

  return {
    traditional,
    simplified,
    pinyin: pinyin.trim(),
    pinyinPlain,
    english,
    searchText: `${simplified} ${traditional} ${pinyinPlain} ${english}`
  };
};

const ensureSchema = async () => {
  const sql = await readFile(schemaPath, 'utf8');
  await query(sql);
};

const insertBatch = async (entries) => {
  if (entries.length === 0) {
    return 0;
  }

  const values = [];
  const placeholders = entries.map((entry, index) => {
    const offset = index * 8;
    values.push(
      SOURCE,
      entry.traditional,
      entry.simplified,
      entry.pinyin,
      entry.pinyinPlain,
      entry.english,
      entry.searchText,
      CONTENT_VERSION
    );

    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`;
  });

  await query(
    `
      INSERT INTO dictionary_entries (
        source, traditional, simplified, pinyin, pinyin_plain, english, search_text, content_version
      )
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (source, traditional, simplified, pinyin)
      DO UPDATE SET
        pinyin_plain = EXCLUDED.pinyin_plain,
        english = EXCLUDED.english,
        search_text = EXCLUDED.search_text,
        content_version = EXCLUDED.content_version,
        updated_at = now()
    `,
    values
  );

  return entries.length;
};

const importDictionary = async () => {
  await access(inputPath);
  if (!DRY_RUN) {
    await ensureSchema();
  }

  let parsed = 0;
  let skipped = 0;
  let imported = 0;
  let batch = [];

  const stream = createReadStream(inputPath, { encoding: 'utf8' });
  const lines = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    const entry = parseLine(line);

    if (!entry) {
      skipped += 1;
      continue;
    }

    parsed += 1;
    batch.push(entry);

    if (batch.length >= BATCH_SIZE) {
      imported += DRY_RUN ? batch.length : await insertBatch(batch);
      batch = [];
      process.stdout.write(`\rImported ${imported} entries...`);
    }
  }

  imported += DRY_RUN ? batch.length : await insertBatch(batch);
  process.stdout.write('\n');

  console.log(
    JSON.stringify({
      source: SOURCE,
      contentVersion: CONTENT_VERSION,
      file: inputPath,
      parsed,
      imported,
      skipped,
      dryRun: DRY_RUN
    })
  );
};

try {
  await importDictionary();
} finally {
  await closeDB();
}
