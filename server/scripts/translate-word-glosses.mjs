// Backfills `words.english_vi` with a natural Vietnamese gloss for each word,
// translated from the CC-CEDICT English definition via the configured AI
// provider (AI_PROVIDER / AI_MODEL / *_API_KEY in server/.env).
//
// The SRS (Review) and Dictionary screens show `english_vi` when the UI
// language is Vietnamese, falling back to the English gloss when it is null.
//
// Usage:
//   node server/scripts/translate-word-glosses.mjs [--dry-run] [--force] [--limit=N] [--batch=N]
//
//   --dry-run  Print translations without writing to the database.
//   --force    Re-translate rows that already have english_vi.
//   --limit=N  Only process the first N eligible rows.
//   --batch=N  Words per AI request (default 25).

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const argValue = (name, fallback) => {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : fallback;
};

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const LIMIT = Number(argValue('limit', '0')) || 0;
const BATCH_SIZE = Math.min(Math.max(Number(argValue('batch', '25')) || 25, 1), 50);

const PROVIDER = String(process.env.AI_PROVIDER || 'mock').toLowerCase();
const MODEL =
  process.env.AI_MODEL ||
  (PROVIDER === 'gemini' ? 'gemini-2.5-flash' : PROVIDER === 'groq' ? 'openai/gpt-oss-20b' : 'gpt-4o-mini');
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 12000;

const providerKey = () => {
  if (PROVIDER === 'gemini') return process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (PROVIDER === 'groq') return process.env.GROQ_API_KEY || process.env.AI_API_KEY;
  return process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
};

const SYSTEM_PROMPT = `Bạn là chuyên gia dịch từ điển Trung - Việt cho một ứng dụng học tiếng Trung.
Nhiệm vụ: dịch NGHĨA tiếng Anh của từng từ tiếng Trung sang tiếng Việt tự nhiên, ngắn gọn.
- Giữ nguyên số lượng nghĩa; nếu nghĩa Anh có nhiều nét nghĩa ngăn bằng ";", giữ cách ngăn tương tự bằng ";".
- Không thêm giải thích, không thêm pinyin, không thêm chữ Hán.
- Trả về DUY NHẤT một JSON object map từ id -> nghĩa tiếng Việt, không kèm markdown.`;

const buildUserPrompt = (batch) => {
  const lines = batch
    .map((word) => `- ${word.id} | ${word.simplified} (${word.pinyin}): ${word.english}`)
    .join('\n');
  return `Dịch nghĩa các từ sau sang tiếng Việt. Trả JSON {"<id>": "<nghĩa tiếng Việt>"}.\n\n${lines}`;
};

const extractJson = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return {};
  return JSON.parse(candidate.slice(first, last + 1));
};

const callProvider = async (userPrompt) => {
  const apiKey = providerKey();
  if (!apiKey) {
    throw new Error(`Missing API key for AI_PROVIDER=${PROVIDER}. Set AI_API_KEY or the provider key.`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    if (PROVIDER === 'gemini') {
      const url =
        process.env.AI_BASE_URL ||
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 2048 }
        })
      });
      if (!response.ok) throw new Error(`gemini request failed: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    }

    const url =
      process.env.AI_BASE_URL ||
      (PROVIDER === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      })
    });
    if (!response.ok) throw new Error(`${PROVIDER} request failed: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeout);
  }
};

const run = async () => {
  if (PROVIDER === 'mock') {
    console.error('AI_PROVIDER is "mock" — set a real provider (gemini/openai/groq) to translate glosses.');
    process.exitCode = 1;
    return;
  }

  const { getPool, closeDB } = await import('../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    const { rows: words } = await client.query(
      `
        SELECT id, simplified, pinyin, english
        FROM words
        WHERE is_active = true
          AND english IS NOT NULL AND english <> ''
          ${FORCE ? '' : 'AND (english_vi IS NULL OR english_vi = \'\')'}
        ORDER BY hsk_level, frequency NULLS LAST, id
        ${LIMIT ? `LIMIT ${LIMIT}` : ''}
      `
    );

    console.log(`Found ${words.length} words to translate (provider=${PROVIDER}, model=${MODEL}, batch=${BATCH_SIZE}).`);
    let updated = 0;
    let failedBatches = 0;

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
      const batch = words.slice(i, i + BATCH_SIZE);
      let map;

      try {
        const text = await callProvider(buildUserPrompt(batch));
        map = extractJson(text);
      } catch (error) {
        failedBatches += 1;
        console.warn(`Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
        continue;
      }

      for (const word of batch) {
        const vi = typeof map[word.id] === 'string' ? map[word.id].trim() : '';
        if (!vi) continue;

        if (DRY_RUN) {
          console.log(`${word.simplified}: "${word.english}" -> "${vi}"`);
        } else {
          await client.query('UPDATE words SET english_vi = $2, updated_at = now() WHERE id = $1', [word.id, vi]);
        }
        updated += 1;
      }

      console.log(`  processed ${Math.min(i + BATCH_SIZE, words.length)}/${words.length}`);
    }

    console.log(JSON.stringify({ ok: failedBatches === 0, dryRun: DRY_RUN, translated: updated, failedBatches }, null, 2));
  } catch (error) {
    console.error('translate-word-glosses failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await closeDB?.().catch(() => {});
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  }
};

await run();
