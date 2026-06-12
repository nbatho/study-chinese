import { query, withTransaction } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { getAiTutorReply } from './ai-provider.service.js';

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

  const userText = text.trim();
  const context = await withTransaction(async (client) => {
    const sessionResult = await client.query(
      `
        SELECT
          s.id,
          cs.id AS scenario_id,
          cs.title AS scenario_title,
          cs.description AS scenario_description
        FROM chat_sessions s
        LEFT JOIN chat_scenarios cs ON cs.id = s.scenario_id
        WHERE s.id = $1 AND s.user_id = $2
        FOR UPDATE OF s
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
      [sessionId, userText]
    );

    const historyResult = await client.query(
      `
        SELECT *
        FROM (
          SELECT *
          FROM chat_messages
          WHERE session_id = $1
          ORDER BY created_at DESC
          LIMIT 10
        ) recent_messages
        ORDER BY created_at ASC
      `,
      [sessionId]
    );

    return {
      userMessage: mapMessage(userMessageResult.rows[0]),
      scenario: sessionResult.rows[0].scenario_id
        ? {
            id: sessionResult.rows[0].scenario_id,
            title: sessionResult.rows[0].scenario_title,
            description: sessionResult.rows[0].scenario_description
          }
        : null,
      messages: historyResult.rows
    };
  });

  const reply = await getAiTutorReply({
    scenario: context.scenario,
    messages: context.messages,
    userText
  });

  return withTransaction(async (client) => {
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
          model_name,
          token_usage
        )
        VALUES ($1, 'tutor', $2, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        sessionId,
        reply.rawText,
        reply.pinyin,
        reply.english,
        reply.correction ? JSON.stringify(reply.correction) : null,
        reply.modelName,
        reply.tokenUsage ? JSON.stringify(reply.tokenUsage) : null
      ]
    );

    await client.query('UPDATE chat_sessions SET updated_at = now() WHERE id = $1', [sessionId]);

    const activity = await recordActivity(client, userId, {
      xp: 10
    });

    return {
      userMessage: context.userMessage,
      tutorMessage: mapMessage(tutorMessageResult.rows[0]),
      xpEarned: 10,
      todayStats: {
        xp: activity.todayStats.xp,
        minutesStudied: activity.todayStats.minutesStudied
      }
    };
  });
};
