import { readFile } from 'node:fs/promises';
import { query } from '../config/db.config.js';
import { contentPath } from '../config/content-paths.js';
import { env } from '../config/env.config.js';
import { badRequest } from '../utils/http-error.js';
import { normalizeLocale } from '../utils/locale.js';
import { transcribeAudio } from './stt-provider.service.js';

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));
const NO_SPEECH_PROBABILITY_THRESHOLD = 0.6;

const mapMinimalPair = (row) => ({
  id: row.id,
  wordA: row.word_a,
  wordB: row.word_b,
  charA: row.char_a,
  charB: row.char_b,
  toneA: Number(row.tone_a),
  toneB: Number(row.tone_b),
  label: row.label
});

const mapHanziStroke = (row) => ({
  id: row.id,
  character: row.character,
  strokes: row.strokes || []
});

const mapContentHanziStroke = (item, index) => ({
  id: item.id || `content-hanzi-${index + 1}`,
  character: item.character,
  strokes: Array.isArray(item.strokes) ? item.strokes : []
});

const getContentHanziStrokes = async () => {
  try {
    const raw = await readFile(contentPath('practice', 'hanzi-characters.json'), 'utf8');
    const data = JSON.parse(raw);
    const characters = Array.isArray(data?.characters) ? data.characters : [];
    const activeCharacters = characters
      .filter((item) => typeof item?.character === 'string' && item.character.trim())
      .sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))
      .map(mapContentHanziStroke);

    return activeCharacters.length > 0 ? { characters: activeCharacters } : null;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Unable to load content Hanzi practice data:', error.message);
    }

    return null;
  }
};

const decodeAudioBytes = (audio) => {
  if (!audio || typeof audio !== 'string') {
    throw badRequest('Can gui audio de cham shadowing.');
  }

  const commaIndex = audio.indexOf(',');
  const encoded = commaIndex >= 0 ? audio.slice(commaIndex + 1) : audio;

  if (!/^[A-Za-z0-9+/=_-]+$/.test(encoded)) {
    throw badRequest('Audio không hợp lệ.');
  }

  const normalizedEncoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const estimatedBytes = Math.floor((normalizedEncoded.length * 3) / 4);

  if (estimatedBytes > env.STT_MAX_AUDIO_BYTES) {
    throw badRequest('Audio qua lon.', {
      field: 'audio',
      maxBytes: env.STT_MAX_AUDIO_BYTES
    });
  }

  let buffer;

  try {
    buffer = Buffer.from(normalizedEncoded, 'base64');
  } catch {
    throw badRequest('Audio không hợp lệ.');
  }

  if (buffer.length > env.STT_MAX_AUDIO_BYTES) {
    throw badRequest('Audio qua lon.', {
      field: 'audio',
      maxBytes: env.STT_MAX_AUDIO_BYTES
    });
  }

  return buffer;
};

const normalizeChinese = (text) =>
  (text || '')
    .replace(/[\s\u3000]/g, '')
    .replace(/[。，！？、；：""''（）《》【】…—·\u00b7.,!?;:'"()[\]{}]/g, '');

const buildCharDiff = (expected, got) => {
  const expectedChars = [...normalizeChinese(expected)];
  const gotChars = [...normalizeChinese(got)];
  const diff = [];
  const maxLen = Math.max(expectedChars.length, gotChars.length);

  for (let i = 0; i < maxLen; i += 1) {
    const expectedChar = expectedChars[i];
    const gotChar = gotChars[i];

    if (expectedChar && gotChar) {
      diff.push({
        char: expectedChar,
        got: gotChar,
        status: expectedChar === gotChar ? 'correct' : 'wrong'
      });
    } else if (expectedChar && !gotChar) {
      diff.push({ char: expectedChar, got: '', status: 'missing' });
    } else if (!expectedChar && gotChar) {
      diff.push({ char: gotChar, got: gotChar, status: 'extra' });
    }
  }

  return diff;
};

const scoreFromTranscription = (expectedText, transcribedText, audioDuration = 0) => {
  const expectedNorm = normalizeChinese(expectedText);
  const gotNorm = normalizeChinese(transcribedText);
  const charDiff = buildCharDiff(expectedText, transcribedText);

  if (gotNorm.length === 0) {
    return {
      accuracy: 0,
      tones: 0,
      fluency: 0,
      overall: 0,
      tip: 'No speech was detected. Please speak clearly and closer to the microphone.',
      transcribedText: '',
      details: {
        expected: expectedText,
        got: '',
        charDiff
      }
    };
  }

  const expectedLen = [...expectedNorm].length;
  const correctCount = charDiff.filter((entry) => entry.status === 'correct').length;
  const extraCount = charDiff.filter((entry) => entry.status === 'extra').length;
  const rawAccuracy = expectedLen > 0 ? (correctCount / expectedLen) * 100 : 0;
  const accuracy = clampScore(rawAccuracy - Math.min(extraCount * 5, 15));
  const tones = clampScore(rawAccuracy * 0.9 + (audioDuration > 0.5 ? 10 : 0));
  const expectedDuration = expectedLen * 0.4;
  const durationRatio =
    audioDuration > 0 && expectedDuration > 0
      ? Math.min(audioDuration / expectedDuration, 1.5)
      : 0;
  const completeness = expectedLen > 0 ? Math.min(correctCount / expectedLen, 1) : 0;
  const fluency = clampScore(completeness * 70 + durationRatio * 20 + 10);
  const overall = Math.round((accuracy + tones + fluency) / 3);

  let tip;
  if (overall >= 90) {
    tip = 'Excellent pronunciation! Your tones and articulation are very clear.';
  } else if (overall >= 75) {
    tip = 'Good job! Pay attention to the highlighted characters and practice those sounds.';
  } else if (overall >= 50) {
    tip = 'Keep practicing. Try listening to the sample again and repeat slowly.';
  } else {
    tip = 'Try again. Listen to the sample carefully and match each syllable.';
  }

  return {
    accuracy,
    tones,
    fluency,
    overall,
    tip,
    transcribedText,
    details: {
      expected: expectedText,
      got: transcribedText,
      charDiff
    }
  };
};

const getRequiredExpectedText = (expectedText) => {
  if (!expectedText || typeof expectedText !== 'string' || !expectedText.trim()) {
    throw badRequest('expectedText is required.');
  }

  return expectedText.trim();
};

const transcribeForScoring = async ({ audio, audioMimeType }) => {
  const audioBuffer = decodeAudioBytes(audio);

  try {
    return await transcribeAudio({
      audioBuffer,
      mimeType: audioMimeType,
      language: 'zh'
    });
  } catch {
    throw badRequest('Không thể nhận diện giọng nói. Vui lòng thử lại hoặc cấu hình STT provider thật.');
  }
};

const scoreFromSttResult = (expectedText, sttResult) => {
  const noSpeechProbability = Number(sttResult?.noSpeechProbability);
  const providerFlaggedNoSpeech =
    Number.isFinite(noSpeechProbability) &&
    noSpeechProbability >= NO_SPEECH_PROBABILITY_THRESHOLD;
  const transcribedText = providerFlaggedNoSpeech ? '' : sttResult?.text;

  return scoreFromTranscription(expectedText, transcribedText, sttResult?.duration);
};

export const getMinimalPairs = async () => {
  const result = await query(
    `
      SELECT *
      FROM practice_minimal_pairs
      WHERE is_active = true
      ORDER BY order_num, id
    `
  );

  return { pairs: result.rows.map(mapMinimalPair) };
};

export const getHanziStrokes = async () => {
  const contentData = await getContentHanziStrokes();

  if (contentData) {
    return contentData;
  }

  const result = await query(
    `
      SELECT *
      FROM practice_hanzi_strokes
      WHERE is_active = true
      ORDER BY order_num, id
    `
  );

  return { characters: result.rows.map(mapHanziStroke) };
};

export const getPracticeCatalog = async (locale) => {
  const [{ pairs }, { prompts }, { characters }] = await Promise.all([
    getMinimalPairs(),
    getShadowingPrompts(locale),
    getHanziStrokes()
  ]);

  return {
    minimalPairs: pairs,
    shadowingPrompts: prompts,
    hanziStrokes: characters
  };
};

export const getShadowingPrompts = async (locale) => {
  const glossLocale = normalizeLocale(locale);
  const [phrasesResult, wordsResult] = await Promise.all([
    query(
      `
        SELECT
          'dp-' || dp.id AS id,
          dp.simplified AS hanzi,
          dp.pinyin,
          dp.english,
          dpg.gloss AS gloss
        FROM daily_phrases dp
        LEFT JOIN daily_phrase_glosses dpg ON dpg.phrase_id = dp.id AND dpg.locale = $1
        WHERE dp.is_active = true
        ORDER BY random()
        LIMIT 10
      `,
      [glossLocale]
    ),
    query(
      `
        SELECT
          w.id,
          w.simplified AS hanzi,
          w.pinyin,
          w.english,
          wg.gloss AS gloss
        FROM words w
        LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $1
        WHERE w.is_active = true
          AND w.part_of_speech = 'phrase'
          AND length(w.simplified) >= 2
        ORDER BY random()
        LIMIT 10
      `,
      [glossLocale]
    )
  ]);

  // `gloss` is the definition in the caller's language; an untranslated prompt
  // falls back to its English source text.
  const prompts = [...phrasesResult.rows, ...wordsResult.rows].map((row) => ({
    ...row,
    gloss: row.gloss || row.english
  }));

  for (let index = prompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [prompts[index], prompts[swapIndex]] = [prompts[swapIndex], prompts[index]];
  }

  return { prompts: prompts.slice(0, 20) };
};

export const scoreShadowing = async ({ expectedText, audio, audioMimeType }) => {
  const expected = getRequiredExpectedText(expectedText);
  const sttResult = await transcribeForScoring({ audio, audioMimeType });
  const score = scoreFromSttResult(expected, sttResult);

  return { score };
};

export const checkPronunciation = async ({ audio, audioMimeType, expectedText }) => {
  const expected = getRequiredExpectedText(expectedText);
  const sttResult = await transcribeForScoring({ audio, audioMimeType });
  const score = scoreFromSttResult(expected, sttResult);

  return { transcribedText: score.transcribedText, score };
};

export const __private__ = {
  buildCharDiff,
  decodeAudioBytes,
  normalizeChinese,
  scoreFromSttResult,
  scoreFromTranscription
};
