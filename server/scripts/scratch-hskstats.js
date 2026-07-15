import dotenv from 'dotenv';
dotenv.config();
import { query, closeDB } from '../src/config/db.config.js';

// Curriculum structure from client
const HSK_CURRICULUM = [
  { hskLevel: 1, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'A1' },
  { hskLevel: 2, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'A2' },
  { hskLevel: 3, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'B1' },
  { hskLevel: 4, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'B2' },
  { hskLevel: 5, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'C1' },
  { hskLevel: 6, topics: [1, 2, 3, 4], lessonsPerTopic: 4, cefrLevel: 'C2' },
];

const getCurriculumLessonCount = () => 17;
const getCurriculumLessons = (level) => {
  const arr = [];
  for (let o = 1; o <= 17; o++) {
    arr.push({ order: o });
  }
  return arr;
};

async function run() {
  try {
    const res = await query(`
      SELECT
        l.*,
        ulp.completed_at
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $1
      WHERE l.is_active = true
      ORDER BY l.hsk_level, l.order_num
    `, ['41e1c272-4225-432a-bced-60fa2455a2d0']);

    const lessons = res.rows.map(row => ({
      id: row.id,
      hskLevel: Number(row.hsk_level),
      order: Number(row.order_num),
      completedAt: row.completed_at,
    }));

    console.log('All active lessons in DB:', lessons.length);

    const hskStats = HSK_CURRICULUM.map((curriculumLevel) => {
      const level = curriculumLevel.hskLevel;
      const hskLessons = lessons.filter((lesson) => lesson.hskLevel === level);
      const curriculumLessons = getCurriculumLessons(curriculumLevel);
      const curriculumOrders = new Set(curriculumLessons.map((lesson) => lesson.order));
      const completedCount = hskLessons.filter((lesson) => curriculumOrders.has(lesson.order) && lesson.completedAt).length;
      const lessonCount = getCurriculumLessonCount(curriculumLevel);
      const percent = Math.round(lessonCount ? (completedCount / lessonCount) * 100 : 0);

      return {
        level,
        completedCount,
        lessonCount,
        percent,
      };
    });

    console.log('hskStats:', JSON.stringify(hskStats, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
}

run();
