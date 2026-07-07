import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const apply = args.includes('--apply');

const countState = async (client) => {
  const progress = await client.query(`
      SELECT
        COUNT(*)::int AS rows,
        COUNT(DISTINCT user_id)::int AS users,
        COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::int AS completed
      FROM user_lesson_progress
    `);
  const stats = await client.query(`
      SELECT
        COUNT(*)::int AS rows,
        COUNT(DISTINCT user_id)::int AS users,
        COALESCE(SUM(lessons_completed), 0)::int AS lessons_completed
      FROM daily_stats
      WHERE lessons_completed > 0
    `);
  const achievements = await client.query(`
      SELECT
        COUNT(*)::int AS rows,
        COUNT(DISTINCT ua.user_id)::int AS users
      FROM user_achievements ua
      JOIN achievements a ON a.id = ua.achievement_id
      WHERE a.category IN ('lessons', 'hsk')
    `);

  return {
    userLessonProgress: progress.rows[0],
    dailyStatsLessonsCompleted: stats.rows[0],
    lessonAchievements: achievements.rows[0]
  };
};

const run = async () => {
  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const before = await countState(client);

    if (!apply) {
      await client.query('ROLLBACK');
      console.log(JSON.stringify({
        apply,
        dryRun: true,
        before,
        message: 'Pass --apply to delete user_lesson_progress, zero daily_stats.lessons_completed, and remove lessons/hsk achievements.'
      }, null, 2));
      return;
    }

    const progressDeleted = await client.query('DELETE FROM user_lesson_progress');
    const statsUpdated = await client.query(`
      UPDATE daily_stats
      SET lessons_completed = 0,
          updated_at = now()
      WHERE lessons_completed > 0
    `);
    const achievementsDeleted = await client.query(`
      DELETE FROM user_achievements ua
      USING achievements a
      WHERE a.id = ua.achievement_id
        AND a.category IN ('lessons', 'hsk')
    `);
    const after = await countState(client);

    await client.query('COMMIT');
    console.log(JSON.stringify({
      apply,
      dryRun: false,
      before,
      changed: {
        userLessonProgressDeleted: progressDeleted.rowCount,
        dailyStatsRowsUpdated: statsUpdated.rowCount,
        lessonAchievementsDeleted: achievementsDeleted.rowCount
      },
      after
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await closeDB();
  }
};

await run();
