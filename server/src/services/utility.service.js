import { query, withTransaction } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import {
  getAchievements as getAchievementsForUser,
  unlockAchievement as unlockEarnedAchievement
} from './achievement.service.js';

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

const ocrSamples = [
  {
    id: 'sign',
    label: 'Street Sign',
    marker: 'S',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
    detectedText: '中国站'
  },
  {
    id: 'menu',
    label: 'Restaurant Menu',
    marker: 'M',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    detectedText: '牛肉 茶'
  },
  {
    id: 'book',
    label: 'Library Book',
    marker: 'B',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
    detectedText: '书 学习'
  }
];

export const getAchievements = async (userId) => {
  const client = { query };
  return getAchievementsForUser(client, userId);
};

export const unlockAchievement = async (userId, achievementId) =>
  withTransaction(async (client) => {
    return unlockEarnedAchievement(client, userId, achievementId);
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

export const getOcrSamples = async () => ({
  samples: ocrSamples.map(({ detectedText, ...sample }) => sample)
});

export const scanOcr = async (userId, payload) => {
  const sample = ocrSamples.find((item) => item.id === payload.sampleId);
  const detectedText = String(payload.text || payload.detectedText || sample?.detectedText || '中国站');

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
