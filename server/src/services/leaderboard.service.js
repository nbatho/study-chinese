import { query } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';

const allowedTimeframes = new Set(['weekly', 'all-time']);

const normalizeTimeframe = (timeframe = 'weekly') => {
  const normalized = String(timeframe || 'weekly').trim().toLowerCase();

  if (!allowedTimeframes.has(normalized)) {
    throw badRequest('timeframe must be weekly or all-time.');
  }

  return normalized;
};

const mapLeaderboardEntry = (row, currentUserId) => ({
  rank: Number(row.rank),
  user: {
    id: row.user_id,
    name: row.name,
    avatar: row.avatar,
    startLevel: row.start_level,
    streak: {
      current: Number(row.current_streak || 0),
      best: Number(row.best_streak || 0)
    }
  },
  totalXp: Number(row.total_xp || 0),
  isCurrentUser: row.user_id === currentUserId
});

const timeframeWhereSql = (timeframe) =>
  timeframe === 'weekly' ? "WHERE ds.date_key >= (CURRENT_DATE - INTERVAL '6 days')" : '';

export const getLeaderboard = async (userId, { timeframe } = {}) => {
  const normalizedTimeframe = normalizeTimeframe(timeframe);
  const result = await query(
    `
      WITH totals AS (
        SELECT ds.user_id, COALESCE(SUM(ds.xp), 0)::int AS total_xp
        FROM daily_stats ds
        ${timeframeWhereSql(normalizedTimeframe)}
        GROUP BY ds.user_id
      ),
      ranked AS (
        SELECT
          u.id AS user_id,
          u.name,
          u.avatar,
          u.start_level,
          u.current_streak,
          u.best_streak,
          totals.total_xp,
          ROW_NUMBER() OVER (ORDER BY totals.total_xp DESC, u.current_streak DESC, u.name ASC) AS rank
        FROM totals
        JOIN users u ON u.id = totals.user_id
        WHERE u.is_active = true
      )
      SELECT *
      FROM ranked
      ORDER BY rank
      LIMIT 50
    `
  );

  return {
    timeframe: normalizedTimeframe,
    scope: 'global',
    entries: result.rows.map((row) => mapLeaderboardEntry(row, userId))
  };
};

export const getFriendsLeaderboard = async (userId, { timeframe } = {}) => {
  const normalizedTimeframe = normalizeTimeframe(timeframe);
  const result = await query(
    `
      WITH friend_users AS (
        SELECT $1::uuid AS user_id
        UNION
        SELECT CASE
          WHEN requester_id = $1 THEN addressee_id
          ELSE requester_id
        END AS user_id
        FROM friendships
        WHERE status = 'accepted'
          AND (requester_id = $1 OR addressee_id = $1)
      ),
      totals AS (
        SELECT fu.user_id, COALESCE(SUM(ds.xp), 0)::int AS total_xp
        FROM friend_users fu
        LEFT JOIN daily_stats ds
          ON ds.user_id = fu.user_id
          ${normalizedTimeframe === 'weekly' ? "AND ds.date_key >= (CURRENT_DATE - INTERVAL '6 days')" : ''}
        GROUP BY fu.user_id
      ),
      ranked AS (
        SELECT
          u.id AS user_id,
          u.name,
          u.avatar,
          u.start_level,
          u.current_streak,
          u.best_streak,
          totals.total_xp,
          ROW_NUMBER() OVER (ORDER BY totals.total_xp DESC, u.current_streak DESC, u.name ASC) AS rank
        FROM totals
        JOIN users u ON u.id = totals.user_id
        WHERE u.is_active = true
      )
      SELECT *
      FROM ranked
      ORDER BY rank
      LIMIT 50
    `,
    [userId]
  );

  return {
    timeframe: normalizedTimeframe,
    scope: 'friends',
    entries: result.rows.map((row) => mapLeaderboardEntry(row, userId))
  };
};

export const __private__ = {
  mapLeaderboardEntry,
  normalizeTimeframe
};
