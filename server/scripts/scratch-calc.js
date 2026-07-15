import dotenv from 'dotenv';
dotenv.config();
import { query, closeDB } from '../src/config/db.config.js';

async function run() {
  try {
    const res = await query(`
      SELECT
        l.*,
        ulp.completed_at
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id AND ulp.user_id = $2
      WHERE l.is_active = true AND l.hsk_level = $1
      ORDER BY l.hsk_level, l.order_num
    `, [1, '41e1c272-4225-432a-bced-60fa2455a2d0']);

    const lessons = res.rows.map(row => ({
      id: row.id,
      hskLevel: Number(row.hsk_level),
      order: Number(row.order_num),
      completedAt: row.completed_at,
    }));

    const selectedHSK = 1;
    const selectedCurriculumOrders = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    const selectedLessonCount = 17;

    // Learn.tsx calculations
    const levelLessons = lessons.filter((lesson) => lesson.hskLevel === selectedHSK).sort((a, b) => a.order - b.order);
    const selectedCompletedCount = levelLessons.filter((lesson) => selectedCurriculumOrders.has(lesson.order) && lesson.completedAt).length;
    const selectedProgressPercent = Math.round(selectedLessonCount ? (selectedCompletedCount / selectedLessonCount) * 100 : 0);

    console.log('Learn.tsx stats:');
    console.log('levelLessons count:', levelLessons.length);
    console.log('selectedLessonCount:', selectedLessonCount);
    console.log('selectedCompletedCount:', selectedCompletedCount);
    console.log('selectedProgressPercent:', selectedProgressPercent);

    // LessonPath.tsx calculations
    const lessonsByOrder = new Map(levelLessons.map((lesson) => [lesson.order, lesson]));
    
    // Simulate flatEntries
    const flatEntries = [];
    for (let o = 1; o <= 17; o++) {
      flatEntries.push({
        curriculumLesson: { order: o },
        serverLesson: lessonsByOrder.get(o),
      });
    }

    const completedCount = flatEntries.filter((entry) => entry.serverLesson?.completedAt).length;
    const availableCount = flatEntries.filter((entry) => entry.serverLesson).length;
    const progressPercent = Math.round(flatEntries.length ? (completedCount / flatEntries.length) * 100 : 0);

    console.log('\nLessonPath.tsx stats:');
    console.log('flatEntries count:', flatEntries.length);
    console.log('completedCount:', completedCount);
    console.log('availableCount:', availableCount);
    console.log('progressPercent:', progressPercent);

  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
}

run();
