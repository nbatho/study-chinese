import dotenv from 'dotenv';
dotenv.config();
import { getLessons } from '../src/services/lesson.service.js';
import { closeDB } from '../src/config/db.config.js';

async function run() {
  try {
    const res = await getLessons('770e36f6-cd56-4c14-a4f3-19094d8131b5', { hsk: 1 });
    console.log('Returned lessons count:', res.lessons.length);
    console.log('Returned lessons:');
    res.lessons.forEach(l => {
      console.log(`id: ${l.id}, title: ${l.title}, order: ${l.order}, completedAt: ${l.completedAt}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
}

run();
