import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { mapPOS } from './pos-mapping.mjs';
import { resolveExistingPath } from '../src/config/content-paths.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const levelArg = args.find((arg) => arg.startsWith('--level='));
const ONLY_LEVEL = levelArg ? Number(levelArg.split('=')[1]) : null;
const batchSizeArg = args.find((arg) => arg.startsWith('--batch-size='));
const BATCH_SIZE = Number(batchSizeArg?.split('=')[1] || process.env.HSK_IMPORT_BATCH_SIZE || 500);
const inputArg = args.find((arg) => !arg.startsWith('--'));

const LEVEL_PRIORITY = ['newest', 'new', 'old'];
const CEFR_BY_HSK = new Map([
  [1, 'A1'],
  [2, 'A1'],
  [3, 'A2'],
  [4, 'B1'],
  [5, 'B2'],
  [6, 'B2'],
  [7, 'C1'],
  [8, 'C1'],
  [9, 'C2']
]);

const TOPIC_RULES = [
  ['greetings', /\b(hello|goodbye|thank|sorry|welcome|greet|please|excuse)\b/i],
  ['numbers', /\b(number|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|first|second)\b/i],
  ['food', /\b(eat|drink|food|meal|fruit|meat|rice|noodle|tea|coffee|water|wine|restaurant|taste|sweet|spicy|soup|vegetable)\b/i],
  ['family', /\b(father|mother|brother|sister|family|parent|child|son|daughter|wife|husband|relative)\b/i],
  ['body', /\b(body|head|hand|foot|eye|ear|mouth|heart|health|doctor|hospital|sick|medicine|pain)\b/i],
  ['time', /\b(time|today|tomorrow|yesterday|day|week|month|year|hour|minute|morning|evening|date)\b/i],
  ['weather', /\b(weather|rain|snow|wind|cloud|sun|hot|cold|warm|cool|temperature)\b/i],
  ['colors', /\b(red|blue|green|yellow|black|white|color|colour|purple|pink|gray|grey)\b/i],
  ['clothing', /\b(clothes|shirt|pants|shoe|hat|dress|wear|coat|skirt|socks)\b/i],
  ['transportation', /\b(car|bus|train|subway|taxi|plane|airport|station|traffic|road|drive|ride)\b/i],
  ['shopping', /\b(buy|sell|shop|store|money|price|expensive|cheap|pay|market|discount)\b/i],
  ['education', /\b(study|learn|school|teacher|student|class|lesson|book|exam|homework|library|read|write)\b/i],
  ['work', /\b(work|job|office|career|company|manager|employee|salary|meeting|business trip)\b/i],
  ['travel', /\b(travel|hotel|ticket|passport|tour|trip|luggage|map|visit|vacation|journey)\b/i],
  ['nature', /\b(nature|tree|flower|mountain|river|sea|lake|forest|grass|earth|sky)\b/i],
  ['technology', /\b(computer|phone|internet|online|software|technology|app|website|message|email)\b/i],
  ['sports', /\b(sport|run|swim|ball|football|basketball|exercise|game|match|race)\b/i],
  ['emotions', /\b(happy|sad|angry|love|like|hate|afraid|worry|feel|emotion|mood)\b/i],
  ['home', /\b(home|house|room|kitchen|bed|door|window|live|apartment|furniture)\b/i],
  ['geography', /\b(country|city|province|north|south|east|west|place|area|world)\b/i],
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

const hashId = ({ hskLevel, simplified, pinyinPlain }) => {
  const hash = crypto
    .createHash('sha1')
    .update(`${simplified}|${pinyinPlain}`)
    .digest('hex')
    .slice(0, 12);
  const slug = pinyinPlain.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'word';

  return `hsk${hskLevel}-${slug}-${hash}`;
};

const toPlainPinyin = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[1-5]/g, '')
    .replace(/u:/gi, 'v')
    .replace(/ü/gi, 'v')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const toneFromAccentedVowel = (syllable) => {
  if (/[āēīōūǖ]/i.test(syllable)) return 1;
  if (/[áéíóúǘ]/i.test(syllable)) return 2;
  if (/[ǎěǐǒǔǚ]/i.test(syllable)) return 3;
  if (/[àèìòùǜ]/i.test(syllable)) return 4;
  return 5;
};

const parseTones = ({ numeric, pinyin }) => {
  const numericTones = String(numeric || '')
    .split(/\s+/)
    .map((part) => Number(part.match(/[1-5]$/)?.[0]))
    .filter((tone) => Number.isInteger(tone) && tone >= 1 && tone <= 5);

  if (numericTones.length > 0) {
    return numericTones;
  }

  return String(pinyin || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(toneFromAccentedVowel);
};

const chooseLevel = (levels = []) => {
  const values = Array.isArray(levels) ? levels.map(String) : [String(levels || '')];

  for (const source of LEVEL_PRIORITY) {
    const matches = values
      .map((level) => level.match(new RegExp(`^${source}-(\\d+)`))?.[1])
      .filter(Boolean)
      .map(Number)
      .filter((level) => Number.isInteger(level) && level > 0);

    if (matches.length > 0) {
      return {
        hskLevel: Math.min(...matches),
        source,
        levelSources: values
      };
    }
  }

  return null;
};

const assignTopic = (meanings) => {
  const text = meanings.join('; ');
  const match = TOPIC_RULES.find(([, pattern]) => pattern.test(text));
  return match?.[0] || 'general';
};

const isVariantMeaning = (meanings) =>
  meanings.length > 0 && meanings.every((meaning) => /^variant of\b/i.test(String(meaning).trim()));

const parseEntry = (entry) => {
  const firstForm = Array.isArray(entry.forms) ? entry.forms[0] : null;
  const meanings = (firstForm?.meanings || []).map(String).filter(Boolean);
  const levelInfo = chooseLevel(entry.level);

  if (!entry.simplified || !firstForm || meanings.length === 0 || !levelInfo) {
    return null;
  }

  if (ONLY_LEVEL && levelInfo.hskLevel !== ONLY_LEVEL) {
    return null;
  }

  const pinyin = firstForm.transcriptions?.pinyin || firstForm.transcriptions?.numeric || entry.simplified;
  const numeric = firstForm.transcriptions?.numeric || '';
  const pinyinPlain = toPlainPinyin(numeric || pinyin);
  const english = meanings.join('; ');
  const traditional = firstForm.traditional || entry.simplified;
  const topicId = assignTopic(meanings);
  const frequency = Number(entry.frequency);
  const frequencyValue = Number.isFinite(frequency) && frequency !== 1000000 ? frequency : null;
  const classifiers = [...new Set((entry.forms || []).flatMap((form) => form.classifiers || []).filter(Boolean))];
  const parsed = {
    id: hashId({ hskLevel: levelInfo.hskLevel, simplified: entry.simplified, pinyinPlain }),
    simplified: entry.simplified,
    traditional,
    pinyin,
    pinyinPlain,
    tones: parseTones({ numeric, pinyin }),
    english,
    partOfSpeech: mapPOS(entry.pos),
    hskLevel: levelInfo.hskLevel,
    cefrLevel: CEFR_BY_HSK.get(levelInfo.hskLevel) || 'C2',
    category: TOPIC_CATEGORY[topicId] || 'General',
    radical: entry.radical || null,
    frequency: frequencyValue,
    searchText: [
      entry.simplified,
      traditional,
      pinyin,
      pinyinPlain,
      english,
      topicId,
      entry.radical
    ].filter(Boolean).join(' '),
    topicId,
    isVariant: isVariantMeaning(meanings),
    levelSources: levelInfo.levelSources,
    allForms: entry.forms || [],
    classifiers
  };

  return parsed;
};

const applyExistingIds = async (query, entries) => {
  if (entries.length === 0) {
    return entries;
  }

  const simplifiedValues = [...new Set(entries.map((entry) => entry.simplified))];
  const existing = await query(
    `
      SELECT id, simplified, pinyin_plain
      FROM words
      WHERE simplified = ANY($1::text[])
      ORDER BY hsk_level, id
    `,
    [simplifiedValues]
  );
  const byKey = new Map();

  for (const row of existing.rows) {
    const key = `${row.simplified}\u0000${row.pinyin_plain}`;
    if (!byKey.has(key)) {
      byKey.set(key, row.id);
    }
  }

  return entries.map((entry) => ({
    ...entry,
    id: byKey.get(`${entry.simplified}\u0000${entry.pinyinPlain}`) || entry.id
  }));
};

const upsertBatch = async (query, entries) => {
  if (entries.length === 0) {
    return { imported: 0, updated: 0 };
  }

  const resolvedEntries = await applyExistingIds(query, entries);
  const existing = await query('SELECT id FROM words WHERE id = ANY($1::text[])', [
    resolvedEntries.map((entry) => entry.id)
  ]);
  const existingIds = new Set(existing.rows.map((row) => row.id));
  const values = [];
  const placeholders = resolvedEntries.map((entry, index) => {
    const offset = index * 19;
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
      entry.isVariant,
      JSON.stringify(entry.levelSources),
      JSON.stringify(entry.allForms),
      entry.classifiers,
      entry.topicId
    );

    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}::smallint[], $${offset + 7}, $${offset + 8}, $${offset + 9}::int, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}::int, $${offset + 14}, $${offset + 15}::boolean, $${offset + 16}::jsonb, $${offset + 17}::jsonb, $${offset + 18}::text[], $${offset + 19})`;
  });

  await query(
    `
      WITH payload (
        id, simplified, traditional, pinyin, pinyin_plain, tones, english,
        part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text,
        is_variant, level_sources, all_forms, classifiers, topic_id
      ) AS (
        VALUES ${placeholders.join(', ')}
      ),
      upserted_words AS (
        INSERT INTO words (
          id, simplified, traditional, pinyin, pinyin_plain, tones, english,
          part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text,
          is_variant, level_sources, all_forms, classifiers
        )
        SELECT
          id, simplified, traditional, pinyin, pinyin_plain, tones, english,
          part_of_speech, hsk_level, cefr_level, category, radical, frequency, search_text,
          is_variant, level_sources, all_forms, classifiers
        FROM payload
        ON CONFLICT (id)
        DO UPDATE SET
          simplified = EXCLUDED.simplified,
          traditional = EXCLUDED.traditional,
          pinyin = EXCLUDED.pinyin,
          pinyin_plain = EXCLUDED.pinyin_plain,
          tones = EXCLUDED.tones,
          english = EXCLUDED.english,
          part_of_speech = EXCLUDED.part_of_speech,
          hsk_level = EXCLUDED.hsk_level,
          cefr_level = EXCLUDED.cefr_level,
          category = EXCLUDED.category,
          radical = EXCLUDED.radical,
          frequency = EXCLUDED.frequency,
          search_text = EXCLUDED.search_text,
          is_variant = EXCLUDED.is_variant,
          level_sources = EXCLUDED.level_sources,
          all_forms = EXCLUDED.all_forms,
          classifiers = EXCLUDED.classifiers,
          updated_at = now()
        RETURNING id
      )
      INSERT INTO word_topic_map (word_id, topic_id)
      SELECT upserted_words.id, payload.topic_id
      FROM upserted_words
      JOIN payload ON payload.id = upserted_words.id
      ON CONFLICT DO NOTHING
    `,
    values
  );

  return {
    imported: resolvedEntries.filter((entry) => !existingIds.has(entry.id)).length,
    updated: resolvedEntries.filter((entry) => existingIds.has(entry.id)).length
  };
};

const run = async () => {
  if (ONLY_LEVEL && (!Number.isInteger(ONLY_LEVEL) || ONLY_LEVEL < 1 || ONLY_LEVEL > 9)) {
    throw new Error('--level must be an integer from 1 to 9.');
  }

  if (!Number.isInteger(BATCH_SIZE) || BATCH_SIZE < 1) {
    throw new Error('--batch-size must be a positive integer.');
  }

  const inputPath = await resolveExistingPath(inputArg, ['complete.json']);
  const data = JSON.parse(await readFile(inputPath, 'utf8'));
  const sourceEntries = Array.isArray(data) ? data : Object.values(data);
  let closeDB = async () => {};
  let query = null;

  if (!DRY_RUN) {
    const db = await import('../src/config/db.config.js');
    query = db.query;
    closeDB = db.closeDB;
  }

  const countsByLevel = new Map();
  let total = 0;
  let parsed = 0;
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let variants = 0;
  let frequencyNulls = 0;
  let batch = [];

  const flushBatch = async () => {
    if (batch.length === 0) {
      return;
    }

    const currentBatch = batch;
    batch = [];

    try {
      const result = DRY_RUN
        ? { imported: currentBatch.length, updated: 0 }
        : await upsertBatch(query, currentBatch);
      imported += result.imported;
      updated += result.updated;
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
        variants += entry.isVariant ? 1 : 0;
        frequencyNulls += entry.frequency === null ? 1 : 0;
        countsByLevel.set(entry.hskLevel, (countsByLevel.get(entry.hskLevel) || 0) + 1);
        batch.push(entry);

        if (batch.length >= BATCH_SIZE) {
          await flushBatch();
          process.stdout.write(`\rProcessed ${parsed} complete.json entries...`);
        }
      } catch {
        errors += 1;
      }
    }

    await flushBatch();
    process.stdout.write('\n');
    console.log(JSON.stringify({
      file: inputPath,
      total,
      parsed,
      imported,
      updated,
      skipped,
      errors,
      variants,
      frequencyNulls,
      countsByLevel: Object.fromEntries([...countsByLevel.entries()].sort((a, b) => a[0] - b[0])),
      dryRun: DRY_RUN,
      level: ONLY_LEVEL
    }, null, 2));
  } finally {
    await closeDB();
  }
};

await run();
