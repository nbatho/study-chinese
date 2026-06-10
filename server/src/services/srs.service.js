import { query, withTransaction } from '../config/db.config.js';
import { addDays } from '../utils/date.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { getWordOrThrow } from './vocab.service.js';

const qualityMap = {
  again: { easeDelta: -0.2, xp: 0 },
  hard: { easeDelta: -0.15, xp: 2 },
  good: { easeDelta: 0, xp: 5 },
  easy: { easeDelta: 0.15, xp: 8 }
};

const masteryFromInterval = (intervalDays) => {
  if (intervalDays >= 30) return 'mastered';
  if (intervalDays >= 14) return 'mature';
  if (intervalDays >= 3) return 'young';
  if (intervalDays > 0) return 'learning';
  return 'new';
};

const mapDueCard = (row) => ({
  wordId: row.word_id,
  simplified: row.simplified,
  pinyin: row.pinyin,
  english: row.english,
  dueCardDetails: {
    easeFactor: Number(row.ease_factor),
    intervalDays: Number(row.interval_days),
    repetitions: Number(row.repetitions),
    dueDate: row.due_date,
    masteryLevel: row.mastery_level
  }
});

const mapCard = (row) => ({
  wordId: row.word_id,
  easeFactor: Number(row.ease_factor),
  intervalDays: Number(row.interval_days),
  repetitions: Number(row.repetitions),
  dueDate: row.due_date,
  masteryLevel: row.mastery_level,
  correctStreak: Number(row.correct_streak),
  wrongCount: Number(row.wrong_count)
});

const calculateReview = (card, quality) => {
  const currentEase = Number(card.ease_factor);
  const currentInterval = Number(card.interval_days);
  const currentRepetitions = Number(card.repetitions);
  const config = qualityMap[quality];

  let easeFactor = Math.min(Math.max(currentEase + config.easeDelta, 1.3), 3.0);
  let intervalDays = 0;
  let repetitions = currentRepetitions;
  let correctStreak = Number(card.correct_streak);
  let wrongCount = Number(card.wrong_count);

  if (quality === 'again') {
    repetitions = 0;
    correctStreak = 0;
    wrongCount += 1;
    intervalDays = 0.01;
  } else {
    repetitions += 1;
    correctStreak += 1;

    if (quality === 'hard') {
      intervalDays = Math.max(1, currentInterval * 1.2);
    } else if (quality === 'good') {
      intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : currentInterval * easeFactor;
    } else {
      intervalDays = repetitions === 1 ? 3 : Math.max(4, currentInterval * easeFactor * 1.3);
    }
  }

  intervalDays = Number(intervalDays.toFixed(2));

  return {
    easeFactor: Number(easeFactor.toFixed(2)),
    intervalDays,
    repetitions,
    correctStreak,
    wrongCount,
    dueDate: addDays(new Date(), intervalDays),
    masteryLevel: masteryFromInterval(intervalDays),
    xpEarned: config.xp
  };
};

export const getDueCards = async (userId, limit = 20) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const result = await query(
    `
      SELECT sc.*, w.simplified, w.pinyin, w.english
      FROM srs_cards sc
      JOIN words w ON w.id = sc.word_id
      WHERE sc.user_id = $1
        AND sc.due_date <= now()
        AND w.is_active = true
      ORDER BY sc.due_date ASC
      LIMIT $2
    `,
    [userId, normalizedLimit]
  );

  return {
    cards: result.rows.map(mapDueCard)
  };
};

export const enrollWord = async (userId, wordId) => {
  await getWordOrThrow(wordId);

  const result = await query(
    `
      INSERT INTO srs_cards (user_id, word_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING word_id
    `,
    [userId, wordId]
  );

  return {
    enrolled: result.rowCount > 0
  };
};

export const reviewCard = async (userId, { wordId, quality }) => {
  if (!qualityMap[quality]) {
    throw badRequest("quality phải là 'again', 'hard', 'good' hoặc 'easy'.");
  }

  return withTransaction(async (client) => {
    await getWordOrThrow(wordId, client);

    await client.query(
      `
        INSERT INTO srs_cards (user_id, word_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, word_id) DO NOTHING
      `,
      [userId, wordId]
    );

    const cardResult = await client.query(
      `
        SELECT *
        FROM srs_cards
        WHERE user_id = $1 AND word_id = $2
        FOR UPDATE
      `,
      [userId, wordId]
    );

    if (cardResult.rowCount === 0) {
      throw notFound('Không tìm thấy thẻ SRS.');
    }

    const nextCard = calculateReview(cardResult.rows[0], quality);

    const updatedResult = await client.query(
      `
        UPDATE srs_cards
        SET ease_factor = $3,
            interval_days = $4,
            repetitions = $5,
            due_date = $6,
            last_reviewed_at = now(),
            correct_streak = $7,
            wrong_count = $8,
            mastery_level = $9,
            updated_at = now()
        WHERE user_id = $1 AND word_id = $2
        RETURNING *
      `,
      [
        userId,
        wordId,
        nextCard.easeFactor,
        nextCard.intervalDays,
        nextCard.repetitions,
        nextCard.dueDate,
        nextCard.correctStreak,
        nextCard.wrongCount,
        nextCard.masteryLevel
      ]
    );

    const activity = await recordActivity(client, userId, {
      xp: nextCard.xpEarned,
      wordsReviewed: 1
    });

    return {
      card: mapCard(updatedResult.rows[0]),
      xpEarned: nextCard.xpEarned,
      todayWordsReviewed: activity.todayStats.wordsReviewed
    };
  });
};
