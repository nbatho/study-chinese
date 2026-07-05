import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { contentPath, resolveContentPath } from '../src/config/content-paths.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const DEFAULT_INPUT = contentPath('complete.json');
const DEFAULT_REPORT = contentPath('missing-hsk-vocab.report.json');
const DEFAULT_SOURCE_URL =
  process.env.HSK30_SOURCE_URL ||
  'https://raw.githubusercontent.com/ivankra/hsk30/main/data/hsk30.csv';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const WRITE = args.includes('--write');
const sourceArg = args.find((arg) => arg.startsWith('--source='))?.split('=').slice(1).join('=');
const inputArg = args.find((arg) => arg.startsWith('--input='))?.split('=').slice(1).join('=');
const outputArg = args.find((arg) => arg.startsWith('--output='))?.split('=').slice(1).join('=');
const reportArg = args.find((arg) => arg.startsWith('--report='))?.split('=').slice(1).join('=');

const normalizePath = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  return path.isAbsolute(value) ? value : resolveContentPath(value);
};

const splitCsvLine = (line) => {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
};

const parseCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitCsvLine);
  const header = rows.shift()?.map((cell) => cell.toLowerCase().replace(/[^a-z0-9]+/g, '_')) || [];

  return rows.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] || ''])));
};

const readSource = async (source) => {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${source}: ${response.status}`);
    }

    return response.text();
  }

  return readFile(normalizePath(source, source), 'utf8');
};

const getField = (row, names) => {
  for (const name of names) {
    if (row[name]) {
      return row[name];
    }
  }

  return '';
};

const normalizeSourceRows = (rows) =>
  rows
    .map((row) => {
      const simplified = getField(row, ['simplified', 'simplified_chinese', 'hanzi', 'word', 'chinese']).trim();
      const traditional = getField(row, ['traditional', 'traditional_chinese']).trim() || simplified;
      const pinyin = getField(row, ['pinyin', 'pinyin_diacritic', 'pinyin_marks']).trim();
      const english = getField(row, ['english', 'definition', 'meaning', 'translation']).trim();
      const levelValue = getField(row, ['level', 'hsk', 'hsk_level', 'band']).match(/\d+/)?.[0];
      const level = Number(levelValue);

      return { simplified, traditional, pinyin, english, level };
    })
    .filter((row) => row.simplified && Number.isInteger(row.level) && row.level >= 1);

const existingKey = (entry) => `${entry.simplified}\u0000${entry.level || []}`;

const loadDictionaryDefinitions = async (missingRows) => {
  if (DRY_RUN || missingRows.length === 0) {
    return new Map();
  }

  try {
    const db = await import('../src/config/db.config.js');
    const result = await db.query(
      `
        SELECT DISTINCT ON (simplified) simplified, traditional, pinyin, english
        FROM dictionary_entries
        WHERE simplified = ANY($1::text[])
        ORDER BY simplified, length(english)
      `,
      [[...new Set(missingRows.map((row) => row.simplified))]]
    );
    await db.closeDB();
    return new Map(result.rows.map((row) => [row.simplified, row]));
  } catch (error) {
    console.warn(`Dictionary lookup skipped: ${error.message}`);
    return new Map();
  }
};

const createCompleteEntry = (row, dictionaryRow) => ({
  simplified: row.simplified,
  radical: '',
  level: [`newest-${row.level}`],
  frequency: 1000000,
  pos: [],
  forms: [
    {
      traditional: dictionaryRow?.traditional || row.traditional || row.simplified,
      transcriptions: {
        pinyin: row.pinyin || dictionaryRow?.pinyin || row.simplified,
        numeric: ''
      },
      meanings: [
        row.english || dictionaryRow?.english || 'Definition pending CC-CEDICT review'
      ],
      classifiers: []
    }
  ]
});

const run = async () => {
  const inputPath = normalizePath(inputArg, DEFAULT_INPUT);
  const outputPath = normalizePath(outputArg, WRITE ? inputPath : contentPath('complete.patched.json'));
  const reportPath = normalizePath(reportArg, DEFAULT_REPORT);
  const source = sourceArg || DEFAULT_SOURCE_URL;
  const complete = JSON.parse(await readFile(inputPath, 'utf8'));
  const sourceRows = normalizeSourceRows(parseCsv(await readSource(source)));
  const existing = new Set(complete.flatMap((entry) => (entry.level || []).map((level) => existingKey({
    simplified: entry.simplified,
    level
  }))));
  const missing = sourceRows.filter((row) => !existing.has(`${row.simplified}\u0000newest-${row.level}`));
  const dictionary = await loadDictionaryDefinitions(missing);
  const additions = missing.map((row) => createCompleteEntry(row, dictionary.get(row.simplified)));
  const patched = [...complete, ...additions];
  const countsByLevel = missing.reduce((acc, row) => {
    acc[row.level] = (acc[row.level] || 0) + 1;
    return acc;
  }, {});
  const report = {
    source,
    input: inputPath,
    output: DRY_RUN ? null : outputPath,
    sourceRows: sourceRows.length,
    existingRows: complete.length,
    missingRows: missing.length,
    countsByLevel,
    dryRun: DRY_RUN,
    wrotePatchedFile: !DRY_RUN
  };

  if (!DRY_RUN) {
    await writeFile(outputPath, `${JSON.stringify(patched, null, 2)}\n`);
  }

  await writeFile(reportPath, `${JSON.stringify({ ...report, missing }, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
};

await run();
