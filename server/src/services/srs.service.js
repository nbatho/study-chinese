import { query, withTransaction } from '../config/db.config.js';
import { addDays } from '../utils/date.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';
import { recordMistake } from './mistake.service.js';
import { ensureVocabularyWord, getWordOrThrow } from './vocab.service.js';
import { normalizeLocale } from '../utils/locale.js';

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
  gloss: row.gloss || row.english,
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

export const getDueCards = async (userId, limit = 20, locale) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const result = await query(
    `
      SELECT sc.*, w.simplified, w.pinyin, w.english, wg.gloss AS gloss
      FROM srs_cards sc
      JOIN words w ON w.id = sc.word_id
      LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $3
      WHERE sc.user_id = $1
        AND sc.due_date <= now()
        AND w.is_active = true
      ORDER BY sc.due_date ASC
      LIMIT $2
    `,
    [userId, normalizedLimit, normalizeLocale(locale)]
  );

  return {
    cards: result.rows.map(mapDueCard)
  };
};

export const getAllCards = async (userId, locale) => {
  const result = await query(
    `
      SELECT sc.*, w.simplified, w.pinyin, w.english, wg.gloss AS gloss,
             (sc.due_date <= now()) AS is_due
      FROM srs_cards sc
      JOIN words w ON w.id = sc.word_id
      LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $2
      WHERE sc.user_id = $1
        AND w.is_active = true
      ORDER BY sc.due_date ASC
    `,
    [userId, normalizeLocale(locale)]
  );

  return {
    cards: result.rows.map((row) => ({
      ...mapDueCard(row),
      isDue: Boolean(row.is_due)
    }))
  };
};

export const enrollWord = async (userId, input) => {
  const word = await ensureVocabularyWord(input);

  const result = await query(
    `
      INSERT INTO srs_cards (user_id, word_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING word_id
    `,
    [userId, word.id]
  );

  return {
    enrolled: result.rowCount > 0,
    word
  };
};

export const reviewCard = async (userId, payload) => {
  const { wordId, quality } = payload;

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
    const unlockedAchievements = await evaluateAchievements(client, userId, {
      event: 'srs_review',
      wordId,
      quality,
      xpEarned: nextCard.xpEarned,
      masteryLevel: nextCard.masteryLevel,
      correctStreak: nextCard.correctStreak
    });
    const mistake =
      (quality === 'again' || quality === 'hard') && payload.mistake
        ? await recordMistake(client, userId, payload.mistake)
        : null;

    return {
      card: mapCard(updatedResult.rows[0]),
      xpEarned: nextCard.xpEarned,
      todayWordsReviewed: activity.todayStats.wordsReviewed,
      mistake,
      unlockedAchievements
    };
  });
};

export const unenrollWord = async (userId, wordId) => {
  const result = await query(
    `
      DELETE FROM srs_cards
      WHERE user_id = $1 AND word_id = $2
    `,
    [userId, wordId]
  );

  return {
    removed: result.rowCount > 0
  };
};

export const __private__ = {
  calculateReview,
  masteryFromInterval
};
