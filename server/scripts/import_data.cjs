const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

const DATA_DIR = path.join(__dirname, '../../data');

const JSONB_COLUMNS = new Set([
  'dialogue', 'learning_objectives', 'warm_up', 'review_summary', 'learning_objectives_vi',
  'content_counts',
  'level_sources', 'all_forms', 'examples', 'stimulus', 'options', 'acceptable_variants', 'options_vi',
  'phases', 'lines', 'new_word_ids', 'grammar_point_ids', 'questions',
  'raw_output', 'validation_result', 'ai_review_result', 'trigger_context',
  'metadata', 'correction', 'token_usage', 'source_lesson_ids', 'matched_word_ids', 'context'
]);

function readJson(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

function prepareRow(row) {
  for (let key of Object.keys(row)) {
    if (JSONB_COLUMNS.has(key) && row[key] !== null && typeof row[key] === 'object') {
      row[key] = JSON.stringify(row[key]);
    }
  }
  return row;
}

async function upsert(tableName, data, conflictKeys = ['id']) {
  if (!data || data.length === 0) return;
  
  const columns = Object.keys(data[0]);
  const values = [];
  const placeholders = [];
  
  let paramIndex = 1;
  for (let row of data) {
    const rowPlaceholders = [];
    for (let col of columns) {
      values.push(row[col]);
      rowPlaceholders.push(`$${paramIndex++}`);
    }
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
  }

  const updateSet = columns
    .filter(col => !conflictKeys.includes(col))
    .map(col => `"${col}" = EXCLUDED."${col}"`)
    .join(', ');

  const query = `
    INSERT INTO ${tableName} (${columns.map(c => `"${c}"`).join(', ')})
    VALUES ${placeholders.join(', ')}
    ON CONFLICT (${conflictKeys.map(k => `"${k}"`).join(', ')})
    ${updateSet ? `DO UPDATE SET ${updateSet}` : 'DO NOTHING'}
  `;

  await client.query(query, values);
}

async function importLessons() {
  console.log('Importing lessons...');
  const lessonsDir = path.join(DATA_DIR, 'lessons');
  if (!fs.existsSync(lessonsDir)) return;

  const dirs = fs.readdirSync(lessonsDir);
  const data = [];
  for (let id of dirs) {
    const dir = path.join(lessonsDir, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    
    const en = readJson(path.join(dir, 'en.json'));
    const vi = readJson(path.join(dir, 'vi.json'));
    if (!en) continue;

    const row = { ...en };
    if (vi) {
      if (vi.title !== undefined) row.title_vi = vi.title;
      if (vi.subtitle !== undefined) row.subtitle_vi = vi.subtitle;
      if (vi.intro !== undefined) row.intro_vi = vi.intro;
      if (vi.learning_objectives !== undefined) row.learning_objectives_vi = vi.learning_objectives;
    }
    data.push(prepareRow(row));
  }
  
  if (data.length > 0) {
    await upsert('lessons', data);
  }
}

async function importWords() {
  console.log('Importing words...');
  const wordsDir = path.join(DATA_DIR, 'words');
  if (!fs.existsSync(wordsDir)) return;

  const chunks = fs.readdirSync(wordsDir);
  const words = [];
  const glosses = [];

  for (let chunk of chunks) {
    const dir = path.join(wordsDir, chunk);
    if (!fs.statSync(dir).isDirectory()) continue;

    const enList = readJson(path.join(dir, 'en.json')) || [];
    const viList = readJson(path.join(dir, 'vi.json')) || [];
    
    const viMap = {};
    for (let row of viList) viMap[row.id] = row;

    for (let en of enList) {
      const wordRow = prepareRow({ ...en });
      
      const vi = viMap[en.id];
      if (vi && vi.english) {
        glosses.push({
          word_id: en.id,
          locale: 'vi',
          gloss: vi.english,
          source: 'manual',
          updated_at: new Date().toISOString()
        });
      }
      words.push(wordRow);
    }
  }

  for (let i = 0; i < words.length; i += 1000) {
    await upsert('words', words.slice(i, i + 1000));
  }

  for (let i = 0; i < glosses.length; i += 1000) {
    await upsert('word_glosses', glosses.slice(i, i + 1000), ['word_id', 'locale']);
  }
}

// Mirror of exportDailyPhrases: Vietnamese lives in daily_phrase_glosses, not _vi columns.
async function importDailyPhrases() {
  console.log('Importing daily_phrases...');
  const tableDir = path.join(DATA_DIR, 'daily_phrases');
  if (!fs.existsSync(tableDir)) return;

  const phrases = [];
  const glosses = [];

  for (let chunk of fs.readdirSync(tableDir)) {
    const dir = path.join(tableDir, chunk);
    if (!fs.statSync(dir).isDirectory()) continue;

    const enList = readJson(path.join(dir, 'en.json')) || [];
    const viList = readJson(path.join(dir, 'vi.json')) || [];

    const viMap = {};
    for (let row of viList) viMap[row.id] = row;

    for (let en of enList) {
      phrases.push(prepareRow({ ...en }));

      const vi = viMap[en.id];
      if (vi && vi.english) {
        glosses.push({
          phrase_id: en.id,
          locale: 'vi',
          gloss: vi.english,
          note: vi.note ?? null,
          source: 'human',
          updated_at: new Date().toISOString()
        });
      }
    }
  }

  for (let i = 0; i < phrases.length; i += 1000) {
    await upsert('daily_phrases', phrases.slice(i, i + 1000));
  }

  for (let i = 0; i < glosses.length; i += 1000) {
    await upsert('daily_phrase_glosses', glosses.slice(i, i + 1000), ['phrase_id', 'locale']);
  }
}

async function importByLessonId(tableName, viMappings, conflictKeys = ['id']) {
  console.log(`Importing ${tableName}...`);
  const tableDir = path.join(DATA_DIR, tableName);
  if (!fs.existsSync(tableDir)) return;

  const dirs = fs.readdirSync(tableDir);
  const data = [];
  
  for (let lessonId of dirs) {
    const dir = path.join(tableDir, lessonId);
    if (!fs.statSync(dir).isDirectory()) continue;

    const enList = readJson(path.join(dir, 'en.json')) || [];
    const viList = readJson(path.join(dir, 'vi.json')) || [];
    
    const viMap = {};
    for (let row of viList) viMap[row.id] = row;

    for (let en of enList) {
      const row = { ...en };
      // Some tables like lesson_words might not have row.id, so viMap won't work by id.
      // But let's assume they don't have vi translations anyway, so viMap is empty.
      const idKey = row.id ? row.id : (row.lesson_id + '_' + row.word_id);
      let vi = viMap[idKey];
      if (!vi && !row.id) {
         // fallback match
         vi = viList.find(v => v.lesson_id === row.lesson_id && v.word_id === row.word_id);
      }
      if (vi) {
        for (const [enKey, viKey] of Object.entries(viMappings)) {
          if (vi[enKey] !== undefined) row[viKey] = vi[enKey];
        }
      }
      data.push(prepareRow(row));
    }
  }

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1000) {
      await upsert(tableName, data.slice(i, i + 1000), conflictKeys);
    }
  }
}

async function importChunked(tableName, viMappings, conflictKeys = ['id']) {
  console.log(`Importing ${tableName}...`);
  const tableDir = path.join(DATA_DIR, tableName);
  if (!fs.existsSync(tableDir)) return;

  const chunks = fs.readdirSync(tableDir);
  const data = [];
  
  for (let chunk of chunks) {
    const dir = path.join(tableDir, chunk);
    if (!fs.statSync(dir).isDirectory()) continue;

    const enList = readJson(path.join(dir, 'en.json')) || [];
    const viList = readJson(path.join(dir, 'vi.json')) || [];
    
    for (let en of enList) {
      const row = { ...en };
      let vi;
      if (row.id) {
         vi = viList.find(v => v.id === row.id);
      } else {
         vi = viList.find(v => v.word_id === row.word_id && v.topic_id === row.topic_id);
      }
      if (vi) {
        for (const [enKey, viKey] of Object.entries(viMappings)) {
          if (vi[enKey] !== undefined) row[viKey] = vi[enKey];
        }
      }
      data.push(prepareRow(row));
    }
  }

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1000) {
      await upsert(tableName, data.slice(i, i + 1000), conflictKeys);
    }
  }
}

async function importSingle(tableName, viMappings) {
  console.log(`Importing ${tableName}...`);
  const tableDir = path.join(DATA_DIR, tableName);
  if (!fs.existsSync(tableDir)) return;

  const enList = readJson(path.join(tableDir, 'en.json')) || [];
  const viList = readJson(path.join(tableDir, 'vi.json')) || [];
  
  const viMap = {};
  for (let row of viList) viMap[row.id] = row;

  const data = [];
  for (let en of enList) {
    const row = { ...en };
    const vi = viMap[en.id];
    if (vi) {
      for (const [enKey, viKey] of Object.entries(viMappings)) {
        if (vi[enKey] !== undefined) row[viKey] = vi[enKey];
      }
    }
    data.push(prepareRow(row));
  }

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1000) {
      await upsert(tableName, data.slice(i, i + 1000));
    }
  }
}

async function main() {
  await client.connect();

  // content_releases first: lessons.release_id has an FK into it. Order only matters
  // on a from-empty import (see scripts/reset-data.cjs); an upsert onto a populated
  // database happened to work either way.
  await importSingle('content_releases', {});

  await importLessons();
  await importWords();

  await importByLessonId('grammar_points', { explanation: 'explanation_vi', tips: 'tips_vi' });
  await importByLessonId('exercises', { prompt: 'prompt_vi', options: 'options_vi', correct_text: 'correct_text_vi', answer_explanation: 'answer_explanation_vi' });
  await importByLessonId('dialogues', { title_en: 'title_vi' });
  await importByLessonId('reading_passages', { title_en: 'title_vi', content_en: 'content_vi' });
  
  await importByLessonId('lesson_modules', {});
  await importByLessonId('lesson_words', {}, ['lesson_id', 'word_id']);

  await importChunked('word_topics', { name_en: 'name_vi' });
  await importChunked('word_topic_map', {}, ['word_id', 'topic_id']);
  await importChunked('grammar_library', { title: 'title_vi', summary: 'summary_vi' });
  await importDailyPhrases(); 

  await importSingle('placement_questions', {
    prompt: 'prompt_vi', options: 'options_vi', correct_text: 'correct_text_vi', explanation: 'explanation_vi'
  });
  await importSingle('achievements', { title: 'title_vi', description: 'description_vi' });
  await importSingle('shop_items', { name: 'name_vi', description: 'description_vi' });
  await importSingle('chat_scenarios', {
    init_msg_english: 'init_msg_vi', title: 'title_vi', description: 'description_vi'
  });
  await importSingle('practice_minimal_pairs', { label: 'label_vi' });
  await importSingle('practice_hanzi_strokes', {});

  console.log('Finished importing data.');
  await client.end();
}

// Exit non-zero on failure: without this the open pg client keeps the event loop
// alive and a failed import looks like a hang instead of an error.
main().catch(err => {
  console.error(err);
  client.end().finally(() => process.exit(1));
});
