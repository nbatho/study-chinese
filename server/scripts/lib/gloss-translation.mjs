// Shared machinery for the gloss backfill scripts (translate-word-glosses.mjs
// and translate-dictionary-glosses.mjs). Both walk a table of English
// definitions, translate them in batches via the configured AI provider
// (AI_PROVIDER / AI_MODEL / *_API_KEY in server/.env), and upsert the result
// into a locale-keyed gloss table; only the SQL and the prompt line differ.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GLOSS_LOCALES, LOCALE_NAMES } from '../../src/utils/locale.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(serverRoot, '.env') });

export const argValue = (name, fallback) => {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : fallback;
};

const hasFlag = (name) => process.argv.includes(`--${name}`);

/**
 * The language to generate. Restricted to GLOSS_LOCALES: writing a gloss for a
 * locale the app cannot serve would burn API credits on rows nothing reads.
 */
export const resolveLocale = () => {
  const locale = String(argValue('locale', 'vi')).toLowerCase();

  if (!GLOSS_LOCALES.includes(locale)) {
    console.error(
      `Unsupported --locale=${locale}. Add it to GLOSS_LOCALES in server/src/utils/locale.js first. Available: ${GLOSS_LOCALES.join(', ')}`
    );
    process.exit(1);
  }

  return locale;
};

const providerConfig = () => {
  const provider = String(process.env.AI_PROVIDER || 'mock').toLowerCase();
  const model =
    process.env.AI_MODEL ||
    (provider === 'gemini' ? 'gemini-2.5-flash' : provider === 'groq' ? 'openai/gpt-oss-20b' : 'gpt-4o-mini');
  const apiKey =
    provider === 'gemini'
      ? process.env.GEMINI_API_KEY || process.env.AI_API_KEY
      : provider === 'groq'
        ? process.env.GROQ_API_KEY || process.env.AI_API_KEY
        : process.env.OPENAI_API_KEY || process.env.AI_API_KEY;

  return { provider, model, apiKey, timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 12000 };
};

// Written in English and parameterized by target language so one prompt serves
// every locale.
const buildSystemPrompt = (languageName) => `You are an expert Chinese-${languageName} dictionary translator for a Chinese learning app.
Task: translate the English DEFINITION of each Chinese word into natural, concise ${languageName}.
- Keep the same number of senses; if the English has several senses separated by ";", separate them the same way with ";".
- Do not add explanations, pinyin, or Chinese characters.
- Return ONLY a JSON object mapping the given number to the ${languageName} definition, with no markdown.`;

// Entries are keyed by their position in the batch rather than their UUID:
// across ~125k rows the UUIDs would add a lot of tokens to every request for no
// benefit, since the mapping back to ids is local.
const buildUserPrompt = (batch, formatRow, languageName) => {
  const lines = batch.map((row, index) => `- ${index + 1} | ${formatRow(row)}`).join('\n');
  return `Translate the definitions of the following words into ${languageName}. Return JSON {"<number>": "<${languageName} definition>"}.\n\n${lines}`;
};

const extractJson = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return {};
  return JSON.parse(candidate.slice(first, last + 1));
};

const callProvider = async ({ provider, model, apiKey, timeoutMs }, systemPrompt, userPrompt) => {
  if (!apiKey) {
    throw new Error(`Missing API key for AI_PROVIDER=${provider}. Set AI_API_KEY or the provider key.`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (provider === 'gemini') {
      const url =
        process.env.AI_BASE_URL ||
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
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
      (provider === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      })
    });
    if (!response.ok) throw new Error(`${provider} request failed: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Fetch rows, translate them batch by batch, and upsert each gloss.
 *
 * @param {object}   options
 * @param {string}   options.scriptName  Used in error output.
 * @param {string}   options.locale      Target locale, from resolveLocale().
 * @param {Function} options.fetchRows   (client, { force, limit, locale }) => rows
 * @param {Function} options.formatRow   row => prompt line, e.g. "好 (hao3): good"
 * @param {Function} options.writeGloss  (client, row, gloss, locale) => Promise
 */
export const runGlossBackfill = async ({ scriptName, locale, fetchRows, formatRow, writeGloss }) => {
  const config = providerConfig();

  if (config.provider === 'mock') {
    console.error('AI_PROVIDER is "mock" — set a real provider (gemini/openai/groq) to translate glosses.');
    process.exitCode = 1;
    return;
  }

  const dryRun = hasFlag('dry-run');
  const force = hasFlag('force');
  const limit = Number(argValue('limit', '0')) || 0;
  const batchSize = Math.min(Math.max(Number(argValue('batch', '25')) || 25, 1), 50);
  const languageName = LOCALE_NAMES[locale] || locale;
  const systemPrompt = buildSystemPrompt(languageName);

  const { getPool, closeDB } = await import('../../src/config/db.config.js');
  const pool = getPool();
  const client = await pool.connect();

  try {
    const rows = await fetchRows(client, { force, limit, locale });

    console.log(
      `Found ${rows.length} rows to translate into ${languageName} (locale=${locale}, provider=${config.provider}, model=${config.model}, batch=${batchSize}).`
    );

    let translated = 0;
    let failedBatches = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      let map;

      try {
        const text = await callProvider(config, systemPrompt, buildUserPrompt(batch, formatRow, languageName));
        map = extractJson(text);
      } catch (error) {
        failedBatches += 1;
        console.warn(`Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
        continue;
      }

      for (const [index, row] of batch.entries()) {
        const value = map[String(index + 1)];
        const gloss = typeof value === 'string' ? value.trim() : '';
        if (!gloss) continue;

        if (dryRun) {
          console.log(`${row.simplified}: "${row.english}" -> "${gloss}"`);
        } else {
          await writeGloss(client, row, gloss, locale);
        }
        translated += 1;
      }

      console.log(`  processed ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
    }

    console.log(JSON.stringify({ ok: failedBatches === 0, locale, dryRun, translated, failedBatches }, null, 2));
  } catch (error) {
    console.error(`${scriptName} failed:`, error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await closeDB?.().catch(() => {});
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  }
};
