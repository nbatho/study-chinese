import dotenv from 'dotenv';
dotenv.config();
import { query, closeDB } from '../src/config/db.config.js';

async function run() {
  try {
    const res = await query(`
      SELECT
        l.id, l.title, l.order_num, l.is_active,
        ulp.completed_at
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $2
      WHERE l.is_active = true AND l.hsk_level = $1
      ORDER BY l.hsk_level, l.order_num
    `, [1, '41e1c272-4225-432a-bced-60fa2455a2d0']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
}

run();
