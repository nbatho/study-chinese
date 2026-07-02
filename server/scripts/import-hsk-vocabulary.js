import { access, readFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const levelArg = args.find((arg) => arg.startsWith('--level='));
const ONLY_LEVEL = levelArg ? Number(levelArg.split('=')[1]) : null;
const batchSizeArg = args.find((arg) => arg.startsWith('--batch-size='));
const BATCH_SIZE = Number(batchSizeArg?.split('=')[1] || process.env.HSK_IMPORT_BATCH_SIZE || 500);
const DEFAULT_PATH = path.join(serverRoot, 'data', 'complete.json');
const inputArg = args.find((arg) => !arg.startsWith('--'));

const resolveExistingPath = async (value) => {
  if (!value) {
    return DEFAULT_PATH;
  }

  if (path.isAbsolute(value)) {
    return value;
  }

  const candidates = [
    path.resolve(process.cwd(), value),
    path.resolve(serverRoot, value),
    path.resolve(serverRoot, '..', value)
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next likely base directory.
    }
  }

  return candidates[0];
};

const POS_MAP = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  pr: 'pronoun',
  pron: 'pronoun',
  num: 'numeral',
  m: 'measure',
  mw: 'measure',
  conj: 'conjunction',
  prep: 'preposition',
  part: 'particle',
  interj: 'interjection',
  prefix: 'prefix',
  suffix: 'suffix',
  idiom: 'idiom',
  expr: 'idiom'
};

const TOPIC_RULES = [
  ['greetings', /\b(hello|goodbye|thank|sorry|welcome|greet|please|excuse)\b/i],
  ['numbers', /\b(number|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|first|second)\b/i],
  ['food', /\b(eat|drink|food|meal|fruit|meat|rice|noodle|tea|coffee|water|wine|restaurant|taste|sweet|spicy|salt|soup|vegetable)\b/i],
  ['family', /\b(father|mother|brother|sister|family|parent|child|son|daughter|wife|husband|grandfather|grandmother|relative)\b/i],
  ['body', /\b(body|head|hand|foot|eye|ear|mouth|heart|health|doctor|hospital|sick|medicine|pain)\b/i],
  ['time', /\b(time|today|tomorrow|yesterday|day|week|month|year|hour|minute|morning|evening|date|clock)\b/i],
  ['weather', /\b(weather|rain|snow|wind|cloud|sun|hot|cold|warm|cool|temperature)\b/i],
  ['colors', /\b(red|blue|green|yellow|black|white|color|colour|purple|pink|gray|grey)\b/i],
  ['animals', /\b(animal|dog|cat|bird|fish|horse|cow|pig|chicken|duck|tiger|bear)\b/i],
  ['clothing', /\b(clothes|shirt|pants|shoe|hat|dress|wear|coat|skirt|socks)\b/i],
  ['transportation', /\b(car|bus|train|subway|metro|taxi|plane|airport|station|traffic|road|drive|ride)\b/i],
  ['shopping', /\b(buy|sell|shop|store|money|price|expensive|cheap|pay|market|discount)\b/i],
  ['education', /\b(study|learn|school|teacher|student|class|lesson|book|exam|homework|library|read|write)\b/i],
  ['work', /\b(work|job|office|career|company|manager|employee|salary|meeting|business trip)\b/i],
  ['travel', /\b(travel|hotel|ticket|passport|tour|trip|luggage|map|visit|vacation|journey)\b/i],
  ['nature', /\b(nature|tree|flower|mountain|river|sea|lake|forest|grass|earth|sky)\b/i],
  ['technology', /\b(computer|phone|internet|online|software|technology|app|website|message|email)\b/i],
  ['sports', /\b(sport|run|swim|ball|football|basketball|exercise|game|match|race)\b/i],
  ['emotions', /\b(happy|sad|angry|love|like|hate|afraid|worry|feel|emotion|mood)\b/i],
  ['home', /\b(home|house|room|kitchen|bed|door|window|live|apartment|furniture)\b/i],
  ['geography', /\b(country|city|province|north|south|east|west|place|area|world|geography)\b/i],
  ['culture', /\b(culture|history|festival|music|art|movie|language|poem|tradition|custom)\b/i],
  ['business', /\b(business|contract|customer|product|trade|bank|economy|market|profit|agreement)\b/i]
];

const TOPIC_CATEGORY = {
  greetings: 'Greetings',
  numbers: 'Numbers',
  food: 'Food',
  family: 'Family',
  body: 'Health',
  time: 'Time',
  weather: 'Weather',
  colors: 'Colors',
  animals: 'Animals',
  clothing: 'Clothing',
  transportation: 'Transportation',
  shopping: 'Shopping',
  education: 'School',
  work: 'Work',
  travel: 'Travel',
  nature: 'Nature',
  technology: 'Technology',
  sports: 'Sports',
  emotions: 'Emotions',
  home: 'Home',
  geography: 'Geography',
  culture: 'Culture',
  business: 'Business',
  general: 'General'
};

const hashId = (level, simplified) => {
  const hash = crypto.createHash('sha1').update(simplified).digest('hex').slice(0, 16);
  return `hsk_${level}_${hash}`;
};

const toPlainPinyin = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[1-5]/g, '')
    .replace(/u:/gi, 'v')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const parseTones = (numeric) =>
  String(numeric || '')
    .split(/\s+/)
    .map((part) => Number(part.match(/[1-5]$/)?.[0] || 5))
    .filter((tone) => tone >= 1 && tone <= 5);

const getHskLevel = (levels = []) => {
  const newLevels = levels
    .map((level) => String(level).match(/^new-(\d+)/)?.[1])
    .filter(Boolean)
    .map(Number);
  const oldLevels = levels
    .map((level) => String(level).match(/^old-(\d+)/)?.[1])
    .filter(Boolean)
    .map(Number);
  const values = newLevels.length > 0 ? newLevels : oldLevels;
  return values.length > 0 ? Math.min(...values) : 0;
};

const cefrFromHsk = (level) => {
  if (level <= 1) return 'A1';
  if (level <= 3) return 'A2';
  if (level === 4) return 'B1';
  if (level === 5) return 'B2';
  if (level === 6) return 'C1';
  return 'C2';
};

const mapPartOfSpeech = (pos = []) => {
  const codes = Array.isArray(pos) ? pos : [pos];
  for (const code of codes) {
    const mapped = POS_MAP[String(code).toLowerCase()];
    if (mapped) {
      return mapped;
    }
  }
  return 'other';
};

const assignTopic = (meanings) => {
  const text = meanings.join('; ');
  const match = TOPIC_RULES.find(([, pattern]) => pattern.test(text));
  return match?.[0] || 'general';
};

const parseEntry = (entry) => {
  const firstForm = Array.isArray(entry.forms) ? entry.forms[0] : null;
  const meanings = (firstForm?.meanings || []).map(String).filter(Boolean);
  const hskLevel = getHskLevel(entry.level);

  if (!entry.simplified || !firstForm || meanings.length === 0 || hskLevel === 0) {
    return null;
  }

  if (ONLY_LEVEL && hskLevel !== ONLY_LEVEL) {
    return null;
  }

  const pinyin = firstForm.transcriptions?.pinyin || firstForm.transcriptions?.numeric || entry.simplified;
  const numeric = firstForm.transcriptions?.numeric || '';
  const topicId = assignTopic(meanings);
  const english = meanings.join('; ');
  const pinyinPlain = toPlainPinyin(numeric || pinyin);
  const traditional = firstForm.traditional || entry.simplified;
  const category = TOPIC_CATEGORY[topicId] || 'General';

  return {
    id: hashId(hskLevel, entry.simplified),
    simplified: entry.simplified,
    traditional,
    pinyin,
    pinyinPlain,
    tones: parseTones(numeric),
    english,
    partOfSpeech: mapPartOfSpeech(entry.pos),
    hskLevel,
    cefrLevel: cefrFromHsk(hskLevel),
    category,
    radical: entry.radical || null,
    frequency: Number.isFinite(Number(entry.frequency)) ? Number(entry.frequency) : null,
    topicId,
    searchText: [
      entry.simplified,
      traditional,
      pinyin,
      pinyinPlain,
      english,
      category,
      topicId,
      entry.radical
    ].filter(Boolean).join(' ')
  };
};

const insertBatch = async (query, entries) => {
  if (entries.length === 0) {
    return { imported: 0, skipped: 0 };
  }

  const existing = await query(
    'SELECT simplified FROM words WHERE simplified = ANY($1::text[])',
    [entries.map((entry) => entry.simplified)]
  );
  const existingSimplified = new Set(existing.rows.map((row) => row.simplified));
  const seenSimplified = new Set(existingSimplified);
  const freshEntries = entries.filter((entry) => {
    if (seenSimplified.has(entry.simplified)) {
      return false;
    }

    seenSimplified.add(entry.simplified);
    return true;
  });

  if (freshEntries.length === 0) {
    return { imported: 0, skipped: entries.length };
  }

  const values = [];
  const placeholders = freshEntries.map((entry, index) => {
    const offset = index * 15;
    values.push(
      entry.id,
      entry.simplified,
      entry.traditional,
      entry.pinyin,
      entry.pinyinPlain,
      entry.tones,
      entry.english,
      entry.partOfSpeech,
      entry.hskLevel,
      entry.cefrLevel,
      entry.category,
      entry.radical,
      entry.frequency,
      entry.searchText,
      entry.topicId
    );
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}::smallint[], $${offset + 7}, $${offset + 8}, $${offset + 9}::int, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}::int, $${offset + 14}, $${offset + 15})`;
  });

  const inserted = await query(
    `
      WITH payload (
        id, simplified, traditional, pinyin, pinyin_plain, tones, english,
        part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text, topic_id
      ) AS (
        VALUES ${placeholders.join(', ')}
      ),
      inserted_words AS (
        INSERT INTO words (
          id, simplified, traditional, pinyin, pinyin_plain, tones, english,
          part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text
        )
        SELECT
          id, simplified, traditional, pinyin, pinyin_plain, tones, english,
          part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text
        FROM payload
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      )
      INSERT INTO word_topic_map (word_id, topic_id)
      SELECT inserted_words.id, payload.topic_id
      FROM inserted_words
      JOIN payload ON payload.id = inserted_words.id
      ON CONFLICT DO NOTHING
      RETURNING word_id
    `,
    values
  );

  return {
    imported: inserted.rowCount,
    skipped: entries.length - inserted.rowCount
  };
};

const run = async () => {
  if (ONLY_LEVEL && (!Number.isInteger(ONLY_LEVEL) || ONLY_LEVEL < 1)) {
    throw new Error('--level must be a positive integer.');
  }

  if (!Number.isInteger(BATCH_SIZE) || BATCH_SIZE < 1) {
    throw new Error('--batch-size must be a positive integer.');
  }

  const inputPath = await resolveExistingPath(inputArg);
  const data = JSON.parse(await readFile(inputPath, 'utf8'));
  const sourceEntries = Array.isArray(data) ? data : Object.values(data);
  let closeDB = async () => {};
  let query = null;

  if (!DRY_RUN) {
    const db = await import('../src/config/db.config.js');
    query = db.query;
    closeDB = db.closeDB;
  }

  let total = 0;
  let parsed = 0;
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let batch = [];

  const flushBatch = async () => {
    if (batch.length === 0) {
      return;
    }

    const currentBatch = batch;
    batch = [];

    try {
      const result = DRY_RUN
        ? { imported: currentBatch.length, skipped: 0 }
        : await insertBatch(query, currentBatch);
      imported += result.imported;
      skipped += result.skipped;
    } catch (error) {
      errors += currentBatch.length;
      console.error(`\nBatch failed after parsing ${parsed} entries: ${error.message}`);
    }
  };

  try {
    for (const sourceEntry of sourceEntries) {
      total += 1;

      try {
        const entry = parseEntry(sourceEntry);
        if (!entry) {
          skipped += 1;
          continue;
        }

        parsed += 1;
        batch.push(entry);

        if (batch.length >= BATCH_SIZE) {
          await flushBatch();
          process.stdout.write(`\rProcessed ${parsed} HSK entries...`);
        }
      } catch {
        errors += 1;
      }
    }

    if (batch.length > 0) {
      await flushBatch();
    }

    process.stdout.write('\n');
    console.log(JSON.stringify({
      file: inputPath,
      total,
      parsed,
      imported,
      skipped,
      errors,
      dryRun: DRY_RUN,
      level: ONLY_LEVEL
    }));
  } finally {
    await closeDB();
  }
};

await run();
