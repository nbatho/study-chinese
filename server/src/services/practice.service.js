import { query } from '../config/db.config.js';
import { badRequest } from '../utils/http-error.js';
import { transcribeAudio } from './stt-provider.service.js';

const minimalPairs = [
  { id: 'ma-1-3', wordA: 'mā', wordB: 'mǎ', charA: '妈', charB: '马', toneA: 1, toneB: 3, label: 'mother vs horse' },
  { id: 'ma-1-2', wordA: 'mā', wordB: 'má', charA: '妈', charB: '麻', toneA: 1, toneB: 2, label: 'mother vs hemp' },
  { id: 'ma-1-4', wordA: 'mā', wordB: 'mà', charA: '妈', charB: '骂', toneA: 1, toneB: 4, label: 'mother vs scold' },
  { id: 'shu-1-3', wordA: 'shū', wordB: 'shǔ', charA: '书', charB: '鼠', toneA: 1, toneB: 3, label: 'book vs mouse' },
  { id: 'cha-2-4', wordA: 'chá', wordB: 'chà', charA: '茶', charB: '差', toneA: 2, toneB: 4, label: 'tea vs poor' },
  { id: 'mai-3-4', wordA: 'mǎi', wordB: 'mài', charA: '买', charB: '卖', toneA: 3, toneB: 4, label: 'buy vs sell' }
];

const hanziStrokes = [
  { id: 'ren', character: '人', strokes: ['M50,20 L20,80', 'M50,20 L80,80'] },
  { id: 'da', character: '大', strokes: ['M15,35 L85,35', 'M50,20 L25,80', 'M50,35 L80,80'] },
  { id: 'zhong', character: '中', strokes: ['M25,20 L25,70', 'M75,20 L75,70', 'M25,20 L75,20', 'M50,10 L50,90'] },
  { id: 'guo', character: '国', strokes: ['M15,10 L15,90', 'M85,10 L85,90', 'M15,10 L85,10', 'M15,90 L85,90', 'M35,30 L65,30', 'M35,50 L65,50', 'M35,70 L65,70', 'M50,25 L50,75'] },
  { id: 'hao', character: '好', strokes: ['M30,20 L20,60', 'M20,60 L40,65', 'M20,45 L40,45', 'M60,20 L60,70', 'M55,35 L75,35', 'M55,55 L75,55'] },
  { id: 'shui', character: '水', strokes: ['M50,15 L50,85', 'M30,35 L20,75', 'M25,55 L35,65', 'M50,55 L75,35', 'M50,55 L80,80'] },
  { id: 'huo', character: '火', strokes: ['M30,25 L20,50', 'M70,25 L80,50', 'M50,15 L30,85', 'M50,15 L70,85'] },
  { id: 'shan', character: '山', strokes: ['M15,85 L15,50', 'M50,85 L50,25', 'M85,85 L85,50', 'M15,85 L85,85'] },
  { id: 'kou', character: '口', strokes: ['M25,20 L25,80', 'M75,20 L75,80', 'M25,20 L75,20', 'M25,80 L75,80'] }
];

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const decodeAudioBytes = (audio) => {
  if (!audio || typeof audio !== 'string') {
    throw badRequest('Can gui audio de cham shadowing.');
  }

  const commaIndex = audio.indexOf(',');
  const encoded = commaIndex >= 0 ? audio.slice(commaIndex + 1) : audio;

  try {
    return Buffer.from(encoded, 'base64');
  } catch {
    throw badRequest('Audio khong hop le.');
  }
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
  const expectedLen = [...expectedNorm].length;
  const correctCount = charDiff.filter((entry) => entry.status === 'correct').length;
  const extraCount = charDiff.filter((entry) => entry.status === 'extra').length;
  const rawAccuracy = expectedLen > 0 ? (correctCount / expectedLen) * 100 : 0;
  const accuracy = clampScore(rawAccuracy - Math.min(extraCount * 5, 15));
  const tones = clampScore(rawAccuracy * 0.9 + (audioDuration > 0.5 ? 10 : 0));
  const expectedDuration = expectedLen * 0.4;
  const durationRatio = audioDuration > 0 && expectedDuration > 0
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
  } else if (gotNorm.length === 0) {
    tip = 'No speech was detected. Please speak clearly and closer to the microphone.';
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
    throw badRequest('Khong the nhan dien giong noi. Vui long thu lai hoac cau hinh STT provider that.');
  }
};

export const getPracticeCatalog = async () => ({
  minimalPairs,
  hanziStrokes
});

export const getMinimalPairs = async () => ({ pairs: minimalPairs });

export const getShadowingPrompts = async () => {
  const [phrasesResult, wordsResult] = await Promise.all([
    query(
      `
        SELECT
          'dp-' || id AS id,
          simplified AS hanzi,
          pinyin,
          english
        FROM daily_phrases
        WHERE is_active = true
        ORDER BY random()
        LIMIT 10
      `
    ),
    query(
      `
        SELECT
          id,
          simplified AS hanzi,
          pinyin,
          english
        FROM words
        WHERE is_active = true
          AND part_of_speech = 'phrase'
          AND length(simplified) >= 2
        ORDER BY random()
        LIMIT 10
      `
    )
  ]);

  const prompts = [...phrasesResult.rows, ...wordsResult.rows];

  for (let index = prompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [prompts[index], prompts[swapIndex]] = [prompts[swapIndex], prompts[index]];
  }

  return { prompts: prompts.slice(0, 20) };
};

export const getHanziStrokes = async () => ({ characters: hanziStrokes });

export const scoreShadowing = async ({ expectedText, audio, audioMimeType }) => {
  const expected = getRequiredExpectedText(expectedText);
  const sttResult = await transcribeForScoring({ audio, audioMimeType });
  const score = scoreFromTranscription(expected, sttResult.text, sttResult.duration);

  return { score };
};

export const checkPronunciation = async ({ audio, audioMimeType, expectedText }) => {
  const expected = getRequiredExpectedText(expectedText);
  const sttResult = await transcribeForScoring({ audio, audioMimeType });
  const score = scoreFromTranscription(expected, sttResult.text, sttResult.duration);

  return { transcribedText: sttResult.text, score };
};

export const __private__ = {
  buildCharDiff,
  normalizeChinese,
  scoreFromTranscription
};
