import { query, withTransaction } from '../config/db.config.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { recordActivity } from './activity.service.js';
import { evaluateAchievements } from './achievement.service.js';
import { getAiTutorReply } from './ai-provider.service.js';
import { recordMistake } from './mistake.service.js';

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

const personalScenarios = [
  {
    id: 'personal-weak',
    title: 'Luyen diem yeu',
    emoji: '🎯',
    description: 'Hoi thoai dung cac tu va ky nang ban hay sai.',
    initialMessage: {
      simplified: '我们来练习你的难点吧。',
      pinyin: 'Wǒmen lái liànxí nǐ de nándiǎn ba.',
      english: 'Let us practice your weak spots.'
    }
  },
  {
    id: 'personal-list',
    title: 'Luyen tu trong list',
    emoji: '📋',
    description: 'AI Tutor uu tien tu vung trong danh sach ban luu gan day.',
    initialMessage: {
      simplified: '请用你保存的词说一句话。',
      pinyin: 'Qǐng yòng nǐ bǎocún de cí shuō yí jù huà.',
      english: 'Please make a sentence with a word you saved.'
    }
  },
  {
    id: 'personal-lesson',
    title: 'On bai vua hoc',
    emoji: '🧠',
    description: 'Luyen hoi thoai xoay quanh bai hoc gan nhat.',
    initialMessage: {
      simplified: '我们复习你刚学的内容。',
      pinyin: 'Wǒmen fùxí nǐ gāng xué de nèiróng.',
      english: 'Let us review what you just learned.'
    }
  }
];

const getPersonalScenario = (scenarioId) =>
  personalScenarios.find((scenario) => scenario.id === scenarioId) || null;

const getLearningContext = async (client, userId) => {
  const [mistakesResult, listWordsResult, lessonResult] = await Promise.all([
    client.query(
      `
        SELECT
          um.skill,
          um.prompt,
          um.correct_answer AS "correctAnswer",
          COALESCE(w.simplified, um.simplified) AS simplified,
          COALESCE(w.pinyin, um.pinyin) AS pinyin,
          COALESCE(w.english, um.english) AS english
        FROM user_mistakes um
        LEFT JOIN words w ON w.id = um.word_id
        WHERE um.user_id = $1 AND GREATEST(um.mistake_count - um.resolved_count, 0) > 0
        ORDER BY GREATEST(um.mistake_count - um.resolved_count, 0) DESC, um.last_mistake_at DESC
        LIMIT 5
      `,
      [userId]
    ),
    client.query(
      `
        SELECT w.simplified, w.pinyin, w.english
        FROM custom_lists cl
        JOIN custom_list_words clw ON clw.list_id = cl.id
        JOIN words w ON w.id = clw.word_id
        WHERE cl.user_id = $1
        ORDER BY cl.updated_at DESC, clw.order_num
        LIMIT 8
      `,
      [userId]
    ),
    client.query(
      `
        SELECT l.title, l.skill
        FROM user_lesson_progress ulp
        JOIN lessons l ON l.id = ulp.lesson_id
        WHERE ulp.user_id = $1
        ORDER BY ulp.completed_at DESC NULLS LAST, ulp.updated_at DESC
        LIMIT 1
      `,
      [userId]
    )
  ]);

  return {
    mistakes: mistakesResult.rows,
    listWords: listWordsResult.rows,
    recentLesson: lessonResult.rows[0] || null
  };
};

const buildCorrectionMistakePayload = ({ correction, userText, sessionId, scenario }) => {
  if (!correction?.improved || !correction?.original) {
    return null;
  }

  return {
    skill: 'ai-tutor',
    prompt: correction.original || userText,
    userAnswer: userText,
    correctAnswer: correction.improved,
    simplified: correction.improved,
    english: correction.explanation,
    context: {
      source: 'ai-tutor',
      sessionId,
      scenarioId: scenario?.id || null,
      explanation: correction.explanation || null
    }
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
    scenarios: [...personalScenarios, ...result.rows.map(mapScenario)]
  };
};

export const startChatSession = async (userId, { scenarioId }) =>
  withTransaction(async (client) => {
    const personalScenario = getPersonalScenario(scenarioId);
    const resolvedScenarioId = personalScenario ? null : scenarioId || 'general';
    const scenarioResult = personalScenario ? { rowCount: 0, rows: [] } : await client.query(
      `
        SELECT *
        FROM chat_scenarios
        WHERE id = $1 AND is_active = true
      `,
      [resolvedScenarioId]
    );

    if (scenarioResult.rowCount === 0 && scenarioId && !personalScenario) {
      throw notFound('Không tìm thấy kịch bản trò chuyện.');
    }

    const scenario = personalScenario || scenarioResult.rows[0] || null;
    const sessionResult = await client.query(
      `
        INSERT INTO chat_sessions (user_id, scenario_id, title)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [userId, personalScenario ? null : scenarioId || null, scenario?.title || 'Free Talk']
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
        [
          sessionResult.rows[0].id,
          scenario.init_msg_simplified || scenario.initialMessage?.simplified,
          scenario.init_msg_pinyin || scenario.initialMessage?.pinyin,
          scenario.init_msg_english || scenario.initialMessage?.english
        ]
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
          s.title AS session_title,
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
        : {
            id: 'personal',
            title: sessionResult.rows[0].session_title || 'Personal Practice',
            description: 'Personalized Chinese practice using current learning data.'
          },
      messages: historyResult.rows,
      learningContext: await getLearningContext(client, userId)
    };
  });

  const reply = await getAiTutorReply({
    scenario: context.scenario,
    messages: context.messages,
    userText,
    learningContext: context.learningContext
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
    const correctionMistakePayload = buildCorrectionMistakePayload({
      correction: reply.correction,
      userText,
      sessionId,
      scenario: context.scenario
    });

    if (correctionMistakePayload) {
      await recordMistake(client, userId, correctionMistakePayload);
    }

    const activity = await recordActivity(client, userId, {
      xp: 10
    });
    const unlockedAchievements = await evaluateAchievements(client, userId, {
      event: 'ai_message',
      skill: 'speaking',
      xpEarned: 10
    });

    return {
      userMessage: context.userMessage,
      tutorMessage: mapMessage(tutorMessageResult.rows[0]),
      xpEarned: 10,
      todayStats: {
        xp: activity.todayStats.xp,
        minutesStudied: activity.todayStats.minutesStudied
      },
      unlockedAchievements
    };
  });
};

export const __private__ = {
  buildCorrectionMistakePayload,
  getLearningContext
};
