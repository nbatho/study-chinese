import { env } from '../config/env.config.js';

const now = () => Date.now();

const MIME_TO_EXT = {
  'audio/webm': 'webm',
  'audio/webm;codecs=opus': 'webm',
  'audio/mp4': 'mp4',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/flac': 'flac',
  'audio/x-m4a': 'm4a'
};

const getExtension = (mimeType) => {
  const base = String(mimeType || '').split(';')[0].trim().toLowerCase();
  return MIME_TO_EXT[base] || MIME_TO_EXT[mimeType] || 'webm';
};

const getSttApiKey = () => env.GROQ_API_KEY || env.AI_API_KEY;

const requireSttApiKey = () => {
  const key = getSttApiKey();

  if (!key) {
    throw new Error(
      'Missing API key for STT_PROVIDER=groq. Set GROQ_API_KEY or AI_API_KEY.'
    );
  }

  return key;
};

const asFiniteNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const getNoSpeechProbability = (segments) => {
  if (!Array.isArray(segments) || segments.length === 0) {
    return undefined;
  }

  const probabilities = segments
    .map((segment) => asFiniteNumber(segment.no_speech_prob))
    .filter((value) => value !== undefined);

  if (probabilities.length === 0) {
    return undefined;
  }

  return probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length;
};

/**
 * Mock transcription keeps the contract usable in tests without pretending
 * the learner said the expected answer.
 */
export const createMockTranscription = () => ({
  text: '',
  language: 'zh',
  duration: 0,
  provider: 'mock',
  model: 'mock',
  latencyMs: 0
});

/**
 * Call Groq Whisper API for speech-to-text transcription.
 *
 * Groq endpoint: POST https://api.groq.com/openai/v1/audio/transcriptions
 * Requires multipart/form-data with:
 *   - file: audio file blob
 *   - model: whisper model name
 *   - language: target language code
 *   - response_format: json
 */
const callGroqWhisper = async ({ audioBuffer, mimeType, language }) => {
  const apiKey = requireSttApiKey();
  const model = env.STT_MODEL || 'whisper-large-v3-turbo';
  const ext = getExtension(mimeType);
  const startedAt = now();

  const blob = new Blob([audioBuffer], {
    type: String(mimeType || 'audio/webm').split(';')[0]
  });
  const formData = new FormData();
  formData.append('file', blob, `recording.${ext}`);
  formData.append('model', model);
  formData.append('language', language || 'zh');
  formData.append('response_format', 'verbose_json');
  formData.append('temperature', '0');
  formData.append(
    'prompt',
    'Mandarin Chinese pronunciation practice. Transcribe only clear speech; leave the transcript empty when no clear speech is present.'
  );

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    env.STT_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        body: formData,
        signal: controller.signal
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      const error = new Error(
        `Groq STT request failed with ${response.status}`
      );
      error.status = response.status;
      error.responseText = responseText.slice(0, 500);
      throw error;
    }

    const data = JSON.parse(responseText);
    const latencyMs = now() - startedAt;

    return {
      text: (data.text || '').trim(),
      language: data.language || language || 'zh',
      duration: data.duration || 0,
      noSpeechProbability: getNoSpeechProbability(data.segments),
      provider: 'groq',
      model: data.model || model,
      latencyMs
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const logSttUsage = (result, { fallback = false } = {}) => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  console.info(
    JSON.stringify({
      event: 'stt_provider_usage',
      provider: result.provider,
      model: result.model,
      latencyMs: result.latencyMs,
      textLength: (result.text || '').length,
      duration: result.duration,
      noSpeechProbability: result.noSpeechProbability,
      fallback
    })
  );
};

/**
 * Main entry point: transcribe audio to text.
 *
 * @param {Object} options
 * @param {Buffer} options.audioBuffer - Raw audio bytes
 * @param {string} options.mimeType - Audio MIME type (e.g. 'audio/webm')
 * @param {string} [options.language='zh'] - Target language
 * @returns {Promise<{ text: string, language: string, duration: number, provider: string, model: string, latencyMs: number }>}
 */
export const transcribeAudio = async ({
  audioBuffer,
  mimeType,
  language = 'zh'
}) => {
  const provider = String(env.STT_PROVIDER || 'groq').toLowerCase();

  if (provider === 'mock') {
    const result = createMockTranscription();
    logSttUsage(result);
    return result;
  }

  const result = await callGroqWhisper({ audioBuffer, mimeType, language });
  logSttUsage(result);
  return result;
};
