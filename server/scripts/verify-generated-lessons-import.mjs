import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const run = async () => {
  const { closeDB, query } = await import('../src/config/db.config.js');
  const count = async (sql) => Number((await query(sql)).rows[0]?.count || 0);

  try {
    const summary = {
      activeLessons: await count(`
        SELECT COUNT(*)::int AS count
        FROM lessons
        WHERE id LIKE 'hsk%' AND is_active = true
      `),
      exercises: await count(`
        SELECT COUNT(*)::int AS count
        FROM exercises e
        JOIN lessons l ON l.id = e.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `),
      lessonWords: await count(`
        SELECT COUNT(*)::int AS count
        FROM lesson_words lw
        JOIN lessons l ON l.id = lw.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `),
      grammarPoints: await count(`
        SELECT COUNT(*)::int AS count
        FROM grammar_points gp
        JOIN lessons l ON l.id = gp.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `),
      lessonModules: await count(`
        SELECT COUNT(*)::int AS count
        FROM lesson_modules lm
        JOIN lessons l ON l.id = lm.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `),
      readingPassages: await count(`
        SELECT COUNT(*)::int AS count
        FROM reading_passages rp
        JOIN lessons l ON l.id = rp.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `),
      dialogues: await count(`
        SELECT COUNT(*)::int AS count
        FROM dialogues d
        JOIN lessons l ON l.id = d.lesson_id
        WHERE l.id LIKE 'hsk%' AND l.is_active = true
      `)
    };

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await closeDB();
  }
};

await run();
