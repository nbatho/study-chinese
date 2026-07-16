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

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function omit(obj, keys) {
  const newObj = { ...obj };
  keys.forEach(k => delete newObj[k]);
  return newObj;
}

async function exportLessons() {
  console.log('Exporting lessons...');
  const res = await client.query('SELECT * FROM lessons');
  for (let row of res.rows) {
    const dir = path.join(DATA_DIR, 'lessons', row.id);
    ensureDir(dir);

    const baseKeysToOmit = ['title_vi', 'subtitle_vi', 'intro_vi', 'learning_objectives_vi'];
    
    // EN
    const enData = omit(row, baseKeysToOmit);
    writeJson(path.join(dir, 'en.json'), enData);

    // VI
    const viData = omit(row, baseKeysToOmit);
    if (row.title_vi) viData.title = row.title_vi;
    if (row.subtitle_vi) viData.subtitle = row.subtitle_vi;
    if (row.intro_vi) viData.intro = row.intro_vi;
    if (row.learning_objectives_vi) viData.learning_objectives = row.learning_objectives_vi;
    writeJson(path.join(dir, 'vi.json'), viData);
  }
}

async function exportWords() {
  console.log('Exporting words...');
  const res = await client.query(`
    SELECT w.*, g.gloss as vi_gloss
    FROM words w
    LEFT JOIN word_glosses g ON w.id = g.word_id AND g.locale = 'vi'
  `);
  
  const chunks = chunkArray(res.rows, 1000);
  chunks.forEach((chunk, i) => {
    const dir = path.join(DATA_DIR, 'words', `chunk_${i + 1}`);
    ensureDir(dir);

    const enChunk = chunk.map(row => omit(row, ['english_vi', 'vi_gloss']));
    writeJson(path.join(dir, 'en.json'), enChunk);

    const viChunk = chunk.map(row => {
      const newRow = omit(row, ['english_vi', 'vi_gloss']);
      if (row.vi_gloss) {
        newRow.english = row.vi_gloss;
      } else if (row.english_vi) {
        newRow.english = row.english_vi;
      }
      return newRow;
    });
    writeJson(path.join(dir, 'vi.json'), viChunk);
  });
}

async function exportByLessonId(tableName, keysToOmit, viMappings) {
  console.log(`Exporting ${tableName}...`);
  const res = await client.query(`SELECT * FROM ${tableName}`);
  
  // Group by lesson_id
  const groups = {};
  for (let row of res.rows) {
    const lessonId = row.lesson_id || 'unassigned';
    if (!groups[lessonId]) groups[lessonId] = [];
    groups[lessonId].push(row);
  }

  for (let [lessonId, rows] of Object.entries(groups)) {
    const dir = path.join(DATA_DIR, tableName, lessonId);
    ensureDir(dir);

    const enData = rows.map(row => omit(row, keysToOmit));
    writeJson(path.join(dir, 'en.json'), enData);

    const viData = rows.map(row => {
      const newRow = omit(row, keysToOmit);
      for (const [enKey, viKey] of Object.entries(viMappings)) {
        if (row[viKey]) newRow[enKey] = row[viKey];
      }
      return newRow;
    });
    writeJson(path.join(dir, 'vi.json'), viData);
  }
}

async function exportChunked(tableName, keysToOmit = [], viMappings = {}) {
  console.log(`Exporting ${tableName}...`);
  const res = await client.query(`SELECT * FROM ${tableName}`);
  const chunks = chunkArray(res.rows, 1000);
  
  chunks.forEach((chunk, i) => {
    const dir = path.join(DATA_DIR, tableName, `chunk_${i + 1}`);
    ensureDir(dir);

    const enChunk = chunk.map(row => omit(row, keysToOmit));
    writeJson(path.join(dir, 'en.json'), enChunk);

    const viChunk = chunk.map(row => {
      const newRow = omit(row, keysToOmit);
      for (const [enKey, viKey] of Object.entries(viMappings)) {
        if (row[viKey]) newRow[enKey] = row[viKey];
      }
      return newRow;
    });
    writeJson(path.join(dir, 'vi.json'), viChunk);
  });
}

async function exportSingle(tableName, keysToOmit = [], viMappings = {}) {
  console.log(`Exporting ${tableName}...`);
  const res = await client.query(`SELECT * FROM ${tableName}`);
  
  const dir = path.join(DATA_DIR, tableName);
  ensureDir(dir);

  const enData = res.rows.map(row => omit(row, keysToOmit));
  writeJson(path.join(dir, 'en.json'), enData);

  const viData = res.rows.map(row => {
    const newRow = omit(row, keysToOmit);
    for (const [enKey, viKey] of Object.entries(viMappings)) {
      if (row[viKey]) newRow[enKey] = row[viKey];
    }
    return newRow;
  });
  writeJson(path.join(dir, 'vi.json'), viData);
}

async function main() {
  await client.connect();
  
  // Cleanup old data
  if (fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
  ensureDir(DATA_DIR);

  await exportLessons();
  await exportWords();
  
  // Group by lesson_id
  await exportByLessonId('grammar_points', 
    ['explanation_vi', 'tips_vi'], 
    { explanation: 'explanation_vi', tips: 'tips_vi' });
    
  await exportByLessonId('exercises', 
    ['prompt_vi', 'options_vi', 'correct_text_vi', 'answer_explanation_vi'], 
    { prompt: 'prompt_vi', options: 'options_vi', correct_text: 'correct_text_vi', answer_explanation: 'answer_explanation_vi' });
    
  await exportByLessonId('dialogues', 
    ['title_vi'], 
    { title_en: 'title_vi' });
    
  await exportByLessonId('reading_passages', 
    ['title_vi', 'content_vi'], 
    { title_en: 'title_vi', content_en: 'content_vi' });
    
  await exportByLessonId('lesson_modules', [], {});
  await exportByLessonId('lesson_words', [], {});

  // Chunked
  await exportChunked('word_topics', ['name_vi'], { name_en: 'name_vi' });
  await exportChunked('word_topic_map', [], {});
  await exportChunked('grammar_library', 
    ['title_vi', 'summary_vi'], 
    { title: 'title_vi', summary: 'summary_vi' });
  await exportChunked('daily_phrases', [], {}); 

  // Single file
  await exportSingle('content_releases', [], {});
  await exportSingle('placement_questions', [], {});
  await exportSingle('achievements', [], {});
  await exportSingle('shop_items', [], {});
  await exportSingle('chat_scenarios', 
    ['init_msg_vi'], 
    { init_msg_english: 'init_msg_vi' });
  await exportSingle('practice_minimal_pairs', [], {});
  await exportSingle('practice_hanzi_strokes', [], {});

  console.log('Finished exporting data.');
  
  await client.end();
}

main().catch(console.error);
