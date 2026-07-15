import dotenv from 'dotenv';
dotenv.config();
import { query, closeDB } from '../src/config/db.config.js';

async function run() {
  try {
    const res = await query('SELECT * FROM user_lesson_progress WHERE user_id = $1', ['41e1c272-4225-432a-bced-60fa2455a2d0']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
}

run();
