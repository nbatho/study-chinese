import { query, withTransaction } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';

const mapScenario = (row) => ({
  id: row.id,
  title: row.title,
  emoji: row.emoji,
  description: row.description,
  initialMessage: {
    simplified: row.init_msg_simplified,
    pinyin: row.init_msg_pinyin,
    english: row.init_msg_english
  }
});

const mapMessage = (row) => ({
  id: row.id,
  role: row.role,
  simplified: row.normalized_simplified || row.raw_text,
  pinyin: row.pinyin,
  english: row.english,
  correction: row.correction
});

const createTutorReply = (text) => {
  const hasLatinOnly = /[a-z]/i.test(text) && !/[\u3400-\u9fff]/.test(text);
  const wantsTea = /茶|cha|tea/i.test(text);

  return {
    rawText: wantsTea ? '好的，您想喝热茶还是冰茶？' : '很好！请再用一句中文回答我。',
    pinyin: wantsTea
      ? 'Hǎo de, nín xiǎng hē rè chá háishì bīng chá?'
      : 'Hěn hǎo! Qǐng zài yòng yī jù Zhōngwén huídá wǒ.',
    english: wantsTea
      ? 'Sure, would you like hot tea or iced tea?'
      : 'Good! Please answer me with one more Chinese sentence.',
    correction: hasLatinOnly
      ? {
          original: text,
          improved: 'Hãy thử viết bằng Hán tự hoặc pinyin có dấu.',
          explanation:
            'Tin nhắn đang dùng pinyin/Latin không dấu. Khi luyện giao tiếp, hãy thêm dấu thanh hoặc thử viết bằng chữ Hán để AI sửa chính xác hơn.'
        }
      : null
  };
};

export const getChatScenarios = async () => {
  const result = await query(
    `
      SELECT *
      FROM chat_scenarios
      WHERE is_active = true
      ORDER BY id
    `
  );

  return {
    scenarios: result.rows.map(mapScenario)
  };
};

export const startChatSession = async (userId, { scenarioId }) =>
  withTransaction(async (client) => {
    const resolvedScenarioId = scenarioId || 'general';
    const scenarioResult = await client.query(
      `
        SELECT *
        FROM chat_scenarios
        WHERE id = $1 AND is_active = true
      `,
      [resolvedScenarioId]
    );

    if (scenarioResult.rowCount === 0 && scenarioId) {
      throw notFound('Không tìm thấy kịch bản trò chuyện.');
    }

    const scenario = scenarioResult.rows[0] || null;
    const sessionResult = await client.query(
      `
        INSERT INTO chat_sessions (user_id, scenario_id, title)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [userId, scenarioId || null, scenario?.title || 'Free Talk']
    );

    const messages = [];

    if (scenario) {
      const messageResult = await client.query(
        `
          INSERT INTO chat_messages (
            session_id,
            role,
            raw_text,
            normalized_simplified,
            pinyin,
            english
          )
          VALUES ($1, 'tutor', $2, $2, $3, $4)
          RETURNING *
        `,
        [sessionResult.rows[0].id, scenario.init_msg_simplified, scenario.init_msg_pinyin, scenario.init_msg_english]
      );
      messages.push(mapMessage(messageResult.rows[0]));
    }

    return {
      session: {
        id: sessionResult.rows[0].id,
        scenarioId: sessionResult.rows[0].scenario_id,
        createdAt: sessionResult.rows[0].created_at,
        messages
      }
    };
  });

export const sendChatMessage = async (userId, sessionId, { text }) => {
  if (!text || !String(text).trim()) {
    throw badRequest('text không được để trống.');
  }

  return withTransaction(async (client) => {
    const sessionResult = await client.query(
      `
        SELECT id
        FROM chat_sessions
        WHERE id = $1 AND user_id = $2
        FOR UPDATE
      `,
      [sessionId, userId]
    );

    if (sessionResult.rowCount === 0) {
      throw notFound('Không tìm thấy phiên trò chuyện.');
    }

    const userMessageResult = await client.query(
      `
        INSERT INTO chat_messages (session_id, role, raw_text, normalized_simplified)
        VALUES ($1, 'user', $2, $2)
        RETURNING *
      `,
      [sessionId, text.trim()]
    );

    const reply = createTutorReply(text.trim());
    const tutorMessageResult = await client.query(
      `
        INSERT INTO chat_messages (
          session_id,
          role,
          raw_text,
          normalized_simplified,
          pinyin,
          english,
          correction,
          model_name
        )
        VALUES ($1, 'tutor', $2, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        sessionId,
        reply.rawText,
        reply.pinyin,
        reply.english,
        reply.correction ? JSON.stringify(reply.correction) : null,
        env.AI_PROVIDER
      ]
    );

    await client.query('UPDATE chat_sessions SET updated_at = now() WHERE id = $1', [sessionId]);

    const activity = await recordActivity(client, userId, {
      xp: 10
    });

    return {
      userMessage: mapMessage(userMessageResult.rows[0]),
      tutorMessage: mapMessage(tutorMessageResult.rows[0]),
      xpEarned: 10,
      todayStats: {
        xp: activity.todayStats.xp,
        minutesStudied: activity.todayStats.minutesStudied
      }
    };
  });
};
