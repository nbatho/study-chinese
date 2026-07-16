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

async function main() {
  await client.connect();
  const tables = [
    'content_releases',
    'words',
    'word_glosses',
    'dictionary_entries',
    'dictionary_entry_glosses',
    'lessons',
    'word_topics',
    'word_topic_map',
    'lesson_words',
    'grammar_points',
    'exercises',
    'lesson_modules',
    'dialogues',
    'reading_passages',
    'placement_questions',
    'achievements',
    'shop_items',
    'chat_scenarios',
    'daily_phrases',
    'daily_phrase_glosses',
    'grammar_library',
    'practice_minimal_pairs',
    'practice_hanzi_strokes'
  ];
  
  const counts = {};
  for (let table of tables) {
    try {
      const res = await client.query(`SELECT count(*) FROM ${table}`);
      counts[table] = res.rows[0].count;
    } catch (e) {
      counts[table] = 'Error: ' + e.message;
    }
  }
  console.log(counts);
  await client.end();
}

main().catch(console.error);
