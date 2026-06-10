import { query, withTransaction } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { notFound } from '../utils/http-error.js';

const mapAchievement = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  emoji: row.emoji,
  targetValue: Number(row.target_value),
  category: row.category,
  unlockedAt: row.unlocked_at
});

const mapPhrase = (row) => ({
  simplified: row.simplified,
  pinyin: row.pinyin,
  english: row.english,
  note: row.note
});

const mapGrammarLibrary = (row) => ({
  id: row.id,
  title: row.title,
  pattern: row.pattern,
  summary: row.summary,
  examples: row.examples || []
});

export const getAchievements = async (userId) => {
  const result = await query(
    `
      SELECT a.*, ua.unlocked_at
      FROM achievements a
      LEFT JOIN user_achievements ua
        ON ua.achievement_id = a.id AND ua.user_id = $1
      WHERE a.is_active = true
      ORDER BY a.category, a.target_value, a.id
    `,
    [userId]
  );

  return {
    achievements: result.rows.map(mapAchievement)
  };
};

export const unlockAchievement = async (userId, achievementId) =>
  withTransaction(async (client) => {
    const achievementResult = await client.query(
      `
        SELECT *
        FROM achievements
        WHERE id = $1 AND is_active = true
      `,
      [achievementId]
    );

    if (achievementResult.rowCount === 0) {
      throw notFound('Không tìm thấy thành tựu.');
    }

    await client.query(
      `
        INSERT INTO user_achievements (user_id, achievement_id, trigger_context)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, achievement_id) DO NOTHING
      `,
      [userId, achievementId, JSON.stringify({ source: 'manual_api' })]
    );

    const achievement = achievementResult.rows[0];

    return {
      unlocked: true,
      achievement: {
        id: achievement.id,
        title: achievement.title,
        emoji: achievement.emoji
      }
    };
  });

export const getDailyContent = async () => {
  const [phraseResult, grammarResult] = await Promise.all([
    query(
      `
        WITH active_phrases AS (
          SELECT *,
                 row_number() OVER (ORDER BY id) AS rn,
                 count(*) OVER () AS total
          FROM daily_phrases
          WHERE is_active = true
        )
        SELECT *
        FROM active_phrases
        WHERE rn = ((extract(doy FROM now())::int - 1) % total) + 1
        LIMIT 1
      `
    ),
    query(
      `
        SELECT *
        FROM grammar_library
        WHERE is_active = true
        ORDER BY title
      `
    )
  ]);

  return {
    phrase: phraseResult.rows[0] ? mapPhrase(phraseResult.rows[0]) : null,
    grammarLibrary: grammarResult.rows.map(mapGrammarLibrary)
  };
};

export const scanOcr = async (userId, payload) => {
  const detectedText = String(payload.text || payload.detectedText || '中国站');

  const result = await query(
    `
      SELECT *
      FROM words
      WHERE is_active = true
        AND (
          position(simplified in $1) > 0
          OR position(traditional in $1) > 0
        )
      ORDER BY char_length(simplified) DESC, simplified
      LIMIT 10
    `,
    [detectedText]
  );

  const boxes = result.rows.map((word, index) => ({
    id: `box_${index + 1}`,
    wordId: word.id,
    text: word.simplified,
    pinyin: word.pinyin,
    english: word.english,
    top: 35.5,
    left: 30 + index * 12,
    width: Math.max(8, word.simplified.length * 8),
    height: 12
  }));

  await query(
    `
      INSERT INTO ocr_scan_events (user_id, provider, detected_text, matched_word_ids, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      userId,
      env.OCR_PROVIDER,
      detectedText,
      JSON.stringify(boxes.map((box) => box.wordId)),
      JSON.stringify({ mode: 'mock_text_match' })
    ]
  );

  return {
    boxes
  };
};
