import { query, withTransaction } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { AppError } from '../utils/http-error.js';
import { badRequest, notFound } from '../utils/http-error.js';
import { toLikePattern } from '../utils/sql.js';
import { normalizeLocale } from '../utils/locale.js';
import {
  getAchievements as getAchievementsForUser,
  unlockAchievement as unlockEarnedAchievement
} from './achievement.service.js';
import { translateChineseText } from './ai-provider.service.js';

// `english`/`note` stay the English source text; `gloss`/`localizedNote` carry
// the caller's language and fall back to that source when untranslated.
const mapPhrase = (row) => ({
  simplified: row.simplified,
  pinyin: row.pinyin,
  english: row.english,
  gloss: row.gloss || row.english,
  note: row.localized_note || row.note
});

const supportedOcrProviders = new Set(['mock', 'paddle']);

const getOcrProvider = () => String(env.OCR_PROVIDER || 'mock').toLowerCase();

const asText = (value) => String(value || '').trim();

const compactForLookup = (value) => asText(value).replace(/\s+/g, '');

const TEXT_LOOKUP_PARTICLES = new Set(['\u7684']);

const TEXT_LOOKUP_GLOSS_OVERRIDES = new Map([
  ['\u6240\u8c13', 'so-called'],
  ['\u771f\u6b63', 'true']
]);

const TEXT_LOOKUP_NOUN_GLOSS_OVERRIDES = new Map([
  ['\u7a33\u5b9a', 'stability']
]);

const entryMatchesText = (text, entry) => {
  const compactText = compactForLookup(text);

  return compactText.includes(entry.simplified) || compactText.includes(entry.traditional);
};

const getFallbackDetectedText = (payload) =>
  asText(payload?.text || payload?.detectedText);

const assertImageWithinLimit = (image) => {
  if (!image) {
    return;
  }

  const encoded = String(image).split(',').pop() || '';
  const estimatedBytes = Math.floor((encoded.length * 3) / 4);

  if (estimatedBytes > env.OCR_MAX_IMAGE_BYTES) {
    throw new AppError(413, 'OCR_IMAGE_TOO_LARGE', 'Image is too large for OCR.', {
      maxBytes: env.OCR_MAX_IMAGE_BYTES
    });
  }
};

const getOcrBaseUrl = () => {
  const baseUrl = asText(env.OCR_BASE_URL);

  if (!baseUrl) {
    throw new AppError(500, 'OCR_PROVIDER_MISCONFIGURED', 'OCR_BASE_URL is required when OCR_PROVIDER=paddle.', {
      provider: 'paddle'
    });
  }

  return baseUrl.replace(/\/$/, '');
};

const callPaddleOcr = async (image) => {
  assertImageWithinLimit(image);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.OCR_TIMEOUT_MS);
  const headers = {
    'Content-Type': 'application/json'
  };

  if (env.OCR_API_KEY) {
    headers['x-ocr-api-key'] = env.OCR_API_KEY;
  }

  try {
    const response = await fetch(`${getOcrBaseUrl()}/scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ image }),
      signal: controller.signal
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new AppError(502, 'OCR_PROVIDER_ERROR', 'OCR provider returned an error.', {
        provider: 'paddle',
        statusCode: response.status,
        details: body
      });
    }

    return {
      detectedText: asText(body.text),
      regions: Array.isArray(body.regions) ? body.regions : []
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AppError(504, 'OCR_PROVIDER_TIMEOUT', 'OCR local service timed out.', {
        provider: 'paddle',
        timeoutMs: env.OCR_TIMEOUT_MS
      });
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(502, 'OCR_PROVIDER_ERROR', 'Could not connect to OCR provider.', {
      provider: 'paddle',
      baseUrl: env.OCR_BASE_URL
    });
  } finally {
    clearTimeout(timeout);
  }
};

const getDetectedText = async (payload = {}) => {
  const provider = getOcrProvider();

  if (!supportedOcrProviders.has(provider)) {
    throw new AppError(500, 'OCR_PROVIDER_UNSUPPORTED', `Unsupported OCR_PROVIDER=${provider}.`);
  }

  if (provider === 'paddle' && payload.image) {
    const paddleResult = await callPaddleOcr(payload.image);
    return {
      detectedText: paddleResult.detectedText || getFallbackDetectedText(payload),
      regions: paddleResult.regions,
      mode: 'paddle_ocr'
    };
  }

  return {
    detectedText: getFallbackDetectedText(payload),
    regions: [],
    mode: provider === 'paddle' ? 'paddle_fallback_text_match' : 'mock_text_match'
  };
};

const countChars = (value) => [...String(value || '')].length;

// CC-CEDICT stores pinyin with trailing tone numbers ("he1 cha2") and "u:" for
// ü. Convert to proper tone-marked pinyin ("hē chá") for display.
const PINYIN_TONE_MARKS = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  'ü': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
};

const convertPinyinSyllable = (syllable) => {
  const match = syllable.match(/^([a-zA-Zü:]+?)([1-5])$/);

  if (!match) {
    return syllable.replace(/u:/g, 'ü').replace(/U:/g, 'Ü');
  }

  const tone = Number(match[2]);
  const letters = match[1].replace(/u:/g, 'ü').replace(/U:/g, 'Ü');

  if (tone === 5) {
    return letters;
  }

  const lower = letters.toLowerCase();
  let target = -1;

  if (lower.includes('a')) {
    target = lower.indexOf('a');
  } else if (lower.includes('e')) {
    target = lower.indexOf('e');
  } else if (lower.includes('ou')) {
    target = lower.indexOf('o');
  } else {
    for (let index = letters.length - 1; index >= 0; index -= 1) {
      if ('aeiouü'.includes(lower[index])) {
        target = index;
        break;
      }
    }
  }

  const marks = target >= 0 ? PINYIN_TONE_MARKS[lower[target]] : null;

  if (!marks) {
    return letters;
  }

  const isUpper = letters[target] !== lower[target];
  const marked = isUpper ? marks[tone].toUpperCase() : marks[tone];

  return letters.slice(0, target) + marked + letters.slice(target + 1);
};

const numberedPinyinToToneMarks = (pinyin) => {
  const value = String(pinyin || '').trim();

  if (!value || !/[1-5]/.test(value)) {
    return value;
  }

  return value
    .split(/(\s+)/)
    .map((token) => (/^\s+$/.test(token) ? token : convertPinyinSyllable(token)))
    .join('');
};

const countPrefixChars = (value, target) => {
  const index = String(value || '').indexOf(target);
  return index < 0 ? -1 : countChars(String(value).slice(0, index));
};

const getRegionForWord = (word, regions) =>
  regions.find((region) => {
    return entryMatchesText(region.text, word);
  });

const buildBox = (word, index, regions) => {
  const region = getRegionForWord(word, regions);

  if (region?.box) {
    const regionText = compactForLookup(region.text);
    const target = regionText.includes(word.simplified) ? word.simplified : word.traditional;
    const prefixChars = countPrefixChars(regionText, target);
    const totalChars = Math.max(1, countChars(regionText));
    const targetChars = Math.max(1, countChars(target));
    const regionBox = region.box;

    const estimatedLeft =
      prefixChars >= 0
        ? Number(regionBox.left) + (Number(regionBox.width) * prefixChars) / totalChars
        : Number(regionBox.left);
    const estimatedWidth =
      prefixChars >= 0
        ? Math.max(4, (Number(regionBox.width) * targetChars) / totalChars)
        : Math.max(4, Number(regionBox.width));

    return {
      top: Number(regionBox.top),
      left: estimatedLeft,
      width: estimatedWidth,
      height: Math.max(4, Number(regionBox.height))
    };
  }

  return {
    top: 35.5,
    left: 30 + index * 12,
    width: Math.max(8, countChars(word.simplified) * 8),
    height: 12
  };
};

const toOcrRegionBox = (region, index) => {
  const box = region?.box || {};

  return {
    id: `region_${index + 1}`,
    text: asText(region?.text),
    top: Number(box.top) || 0,
    left: Number(box.left) || 0,
    width: Math.max(4, Number(box.width) || 8),
    height: Math.max(4, Number(box.height) || 8),
    confidence: typeof region?.confidence === 'number' ? region.confidence : null,
    matched: false
  };
};

const boxOverlapsRegion = (box, region) => {
  const boxRight = box.left + box.width;
  const boxBottom = box.top + box.height;
  const regionRight = region.left + region.width;
  const regionBottom = region.top + region.height;

  return !(
    boxRight <= region.left ||
    regionRight <= box.left ||
    boxBottom <= region.top ||
    regionBottom <= box.top
  );
};

const boxOverlapRatio = (first, second) => {
  const left = Math.max(first.left, second.left);
  const right = Math.min(first.left + first.width, second.left + second.width);
  const top = Math.max(first.top, second.top);
  const bottom = Math.min(first.top + first.height, second.top + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const firstArea = Math.max(1, first.width * first.height);
  const secondArea = Math.max(1, second.width * second.height);

  return intersection / Math.min(firstArea, secondArea);
};

const getEntryLength = (entry) =>
  Math.max(countChars(entry?.simplified), countChars(entry?.traditional), 1);

const normalizeLookupEntries = (entries) => {
  const seen = new Set();

  return entries
    .filter((entry) => entry?.simplified && entry?.traditional && entry?.english)
    .filter((entry) => {
      const key = `${entry.traditional}\u0000${entry.simplified}\u0000${entry.pinyin || ''}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((first, second) => getEntryLength(second) - getEntryLength(first));
};

const matchesAt = (entry, remaining) =>
  remaining.startsWith(entry.simplified) || remaining.startsWith(entry.traditional);

const segmentDictionaryText = (text, entries) => {
  const normalizedText = compactForLookup(text);
  const lookupEntries = normalizeLookupEntries(entries);
  // `words` is the curated HSK vocabulary; the dictionary is raw CC-CEDICT and
  // carries rare readings that beat the everyday one on length alone (我去 is
  // slang for "oh my god!", swallowing 我 + 去). A curated entry therefore wins
  // its position outright; the dictionary only fills positions none covers.
  // Both lists are length-sorted, so the first hit is the longest.
  const curatedEntries = lookupEntries.filter((entry) => entry.wordId);
  const segments = [];
  let cursor = 0;

  while (cursor < normalizedText.length) {
    const remaining = normalizedText.slice(cursor);
    const match =
      curatedEntries.find((entry) => matchesAt(entry, remaining)) ||
      lookupEntries.find((entry) => matchesAt(entry, remaining));

    if (!match) {
      cursor += 1;
      continue;
    }

    const target = remaining.startsWith(match.simplified) ? match.simplified : match.traditional;
    segments.push({
      entry: match,
      start: cursor,
      target
    });
    cursor += Math.max(target.length, 1);
  }

  return segments;
};

const segmentDictionaryEntries = (text, entries) =>
  segmentDictionaryText(text, entries).map((segment) => segment.entry);

const shouldSkipTextLookupSegment = (segment, text) =>
  countChars(compactForLookup(text)) > 1 && TEXT_LOOKUP_PARTICLES.has(segment.entry.simplified);

const cleanGlossOption = (value) =>
  String(value || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getGlossOptions = (entry) =>
  String(entry?.english || '')
    .split(/[;/]/)
    .map(cleanGlossOption)
    .filter(Boolean);

const getPrimaryGloss = (segment, index, segments) => {
  const simplified = segment.entry?.simplified;

  if (!simplified || TEXT_LOOKUP_PARTICLES.has(simplified)) {
    return '';
  }

  if (TEXT_LOOKUP_GLOSS_OVERRIDES.has(simplified)) {
    return TEXT_LOOKUP_GLOSS_OVERRIDES.get(simplified);
  }

  const previous = segments[index - 1]?.entry?.simplified;

  if (previous === '\u7684' && TEXT_LOOKUP_NOUN_GLOSS_OVERRIDES.has(simplified)) {
    return TEXT_LOOKUP_NOUN_GLOSS_OVERRIDES.get(simplified);
  }

  return getGlossOptions(segment.entry)[0] || '';
};

const buildOverallMeaning = (segments) =>
  segments
    .map((segment, index) => getPrimaryGloss(segment, index, segments))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();

const buildGlossaryFallbackMeaning = (glossary) =>
  glossary
    .map((item) => getGlossOptions(item)[0])
    .filter(Boolean)
    .join('; ');

const buildTextLookupBoxes = (text, entries) => {
  const normalizedText = compactForLookup(text);
  const totalChars = Math.max(1, countChars(normalizedText));

  return segmentDictionaryText(text, entries)
    .filter((segment) => !shouldSkipTextLookupSegment(segment, text))
    .map((segment, index) => {
      const entry = segment.entry;
      const targetChars = Math.max(1, countChars(segment.target));

      return {
        id: `text_${index + 1}`,
        wordId: entry.wordId,
        text: entry.simplified,
        pinyin: entry.pinyin,
        english: entry.english,
        top: 35.5,
        left: 30 + (60 * segment.start) / totalChars,
        width: Math.max(4, (60 * targetChars) / totalChars),
        height: 12,
        confidence: null,
        matched: true,
        source: entry.wordId ? 'words' : 'cc-cedict'
      };
    });
};

const getDictionaryEntriesForText = async (detectedText, targetLang = 'vi') => {
  const text = asText(detectedText);
  const compactText = compactForLookup(detectedText);

  if (!text) {
    return [];
  }

  try {
    const result = await query(
      `
        SELECT d.*, dg.gloss AS gloss
        FROM dictionary_entries d
        LEFT JOIN dictionary_entry_glosses dg ON dg.entry_id = d.id AND dg.locale = $3
        WHERE position(d.simplified in $1) > 0
           OR position(d.traditional in $1) > 0
           OR position(d.simplified in $2) > 0
           OR position(d.traditional in $2) > 0
        ORDER BY char_length(d.simplified) DESC, d.simplified
        LIMIT 100
      `,
      [text, compactText, normalizeLocale(targetLang)]
    );

    return result.rows.map((row) => ({
      ...row,
      pinyin: numberedPinyinToToneMarks(row.pinyin),
      // Mirrors the words lookup: prefer the gloss in the target language so a
      // sentence does not come back with some segments glossed in the target
      // language and the rest in English.
      english: row.gloss || row.english
    }));
  } catch (error) {
    if (error.code === '42P01') {
      return [];
    }

    throw error;
  }
};

const buildDictionaryBoxes = (regions, dictionaryEntries) =>
  regions.flatMap((region, regionIndex) => {
    const segments = segmentDictionaryEntries(region.text, dictionaryEntries);
    const regionText = compactForLookup(region.text);
    const totalChars = Math.max(1, countChars(regionText));
    let cursor = 0;

    return segments.map((entry, segmentIndex) => {
      const target = regionText.includes(entry.simplified) ? entry.simplified : entry.traditional;
      const prefixChars = countPrefixChars(regionText.slice(cursor), target);
      const safePrefixChars = prefixChars >= 0 ? cursor + prefixChars : cursor;
      cursor = safePrefixChars + countChars(target);

      return {
        id: `dict_${regionIndex + 1}_${segmentIndex + 1}`,
        text: entry.simplified,
        pinyin: entry.pinyin,
        english: entry.english,
        top: region.top,
        left: region.left + (region.width * safePrefixChars) / totalChars,
        width: Math.max(4, (region.width * Math.max(1, countChars(target))) / totalChars),
        height: region.height,
        confidence: region.confidence,
        matched: true,
        source: 'cc-cedict'
      };
    });
  });

const filterDictionaryBoxes = (dictionaryBoxes, matchedBoxes) =>
  dictionaryBoxes.filter((box) => !matchedBoxes.some((matchedBox) => boxOverlapRatio(box, matchedBox) > 0.5));

const getOcrRegionBoxes = (regions, detectedText) => {
  const rawRegionBoxes = regions.map(toOcrRegionBox).filter((region) => region.text);

  if (rawRegionBoxes.length > 0 || !asText(detectedText)) {
    return rawRegionBoxes;
  }

  return [
    {
      id: 'region_fallback',
      text: asText(detectedText),
      top: 35.5,
      left: 30,
      width: Math.min(60, Math.max(12, countChars(compactForLookup(detectedText)) * 8)),
      height: 12,
      confidence: null,
      matched: false
    }
  ];
};

const toSegment = (box, index) => ({
  id: `segment_${index + 1}_${box.id}`,
  text: box.text,
  pinyin: box.pinyin,
  english: box.english,
  source: box.source || (box.wordId ? 'words' : 'ocr'),
  wordId: box.wordId,
  confidence: box.confidence,
  matched: Boolean(box.english || box.pinyin || box.wordId)
});

const mapOcrHistoryEvent = (row) => ({
  id: row.id,
  provider: row.provider,
  title: row.title,
  note: row.note,
  isFavorite: Boolean(row.is_favorite),
  detectedText: row.detected_text,
  matchedWordIds: row.matched_word_ids || [],
  metadata: row.metadata || {},
  createdAt: row.created_at
});

const normalizeOcrHistoryFilters = ({ limit = 20, keyword, date, from, to, favorite } = {}) => ({
  limit: Math.min(Math.max(Number(limit) || 20, 1), 100),
  keyword: asText(keyword),
  date: asText(date),
  from: asText(from),
  to: asText(to),
  favorite: favorite === true || favorite === 'true' || favorite === '1'
});

const normalizeNotebookPayload = (payload = {}) => ({
  title: Object.prototype.hasOwnProperty.call(payload, 'title') ? asText(payload.title).slice(0, 150) || null : undefined,
  note: Object.prototype.hasOwnProperty.call(payload, 'note') ? asText(payload.note) || null : undefined,
  isFavorite: Object.prototype.hasOwnProperty.call(payload, 'isFavorite') ? Boolean(payload.isFavorite) : undefined
});

export const getAchievements = async (userId) => {
  const client = { query };
  return getAchievementsForUser(client, userId);
};

export const unlockAchievement = async (userId, achievementId) =>
  withTransaction(async (client) => {
    return unlockEarnedAchievement(client, userId, achievementId);
  });

export const getDailyContent = async (locale) => {
  const glossLocale = normalizeLocale(locale);
  const phraseResult = await query(
    `
      WITH active_phrases AS (
        SELECT *,
               row_number() OVER (ORDER BY id) AS rn,
               count(*) OVER () AS total
        FROM daily_phrases
        WHERE is_active = true
      )
      SELECT ap.*,
             dpg.gloss AS gloss,
             dpg.note AS localized_note
      FROM active_phrases ap
      LEFT JOIN daily_phrase_glosses dpg
        ON dpg.phrase_id = ap.id AND dpg.locale = $1
      WHERE ap.rn = ((extract(doy FROM now())::int - 1) % ap.total) + 1
      LIMIT 1
    `,
    [glossLocale]
  );

  return {
    phrase: phraseResult.rows[0] ? mapPhrase(phraseResult.rows[0]) : null
  };
};

export const getOcrSamples = async () => ({
  samples: []
});

const normalizeTargetLang = (value) => normalizeLocale(value, 'vi');

const computeTranslationResult = async (payload) => {
  const targetLang = normalizeTargetLang(payload?.targetLang);
  const { detectedText, regions, mode } = await getDetectedText(payload);
  const compactDetectedText = compactForLookup(detectedText);

  // Both lookups depend only on the detected text, so they can run together.
  const [result, dictionaryEntries] = await Promise.all([
    query(
      `
        SELECT w.*, wg.gloss AS gloss
        FROM words w
        LEFT JOIN word_glosses wg ON wg.word_id = w.id AND wg.locale = $3
        WHERE w.is_active = true
          AND (
            position(w.simplified in $1) > 0
            OR position(w.traditional in $1) > 0
            OR position(w.simplified in $2) > 0
            OR position(w.traditional in $2) > 0
          )
        -- Every candidate feeds segmentation, so a low limit silently drops the
        -- shortest words and sends them to the dictionary fallback, which is
        -- English-only for most entries. Matches the dictionary lookup's limit.
        ORDER BY char_length(w.simplified) DESC, w.simplified
        LIMIT 100
      `,
      [detectedText, compactDetectedText, normalizeLocale(targetLang)]
    ),
    getDictionaryEntriesForText(detectedText, targetLang)
  ]);

  const wordRows = result.rows.map((word) => ({
    ...word,
    pinyin: numberedPinyinToToneMarks(word.pinyin),
    // Glosses exist for part of the vocabulary; prefer the one in the target
    // language and keep the English gloss otherwise.
    english: word.gloss || word.english
  }));

  const matchedBoxes = wordRows.map((word, index) => ({
    id: `box_${index + 1}`,
    wordId: word.id,
    text: word.simplified,
    pinyin: word.pinyin,
    english: word.english,
    ...buildBox(word, index, regions),
    matched: true
  }));

  const rawRegionBoxes = getOcrRegionBoxes(regions, detectedText);
  const textLookupEntries = [
    ...wordRows.map((word) => ({
      ...word,
      wordId: word.id
    })),
    ...dictionaryEntries
  ];
  const textLookupSegments = !payload?.image ? segmentDictionaryText(detectedText, textLookupEntries) : [];
  const textLookupBoxes = textLookupSegments.length > 0 ? buildTextLookupBoxes(detectedText, textLookupEntries) : [];
  const dictionaryBoxes = textLookupBoxes.length > 0
    ? []
    : filterDictionaryBoxes(buildDictionaryBoxes(rawRegionBoxes, dictionaryEntries), matchedBoxes);
  const translatedBoxes = textLookupBoxes.length > 0 ? textLookupBoxes : [...matchedBoxes, ...dictionaryBoxes];
  const unmatchedRegionBoxes = rawRegionBoxes.filter(
    (region) => !translatedBoxes.some((box) => boxOverlapsRegion(box, region))
  );
  const boxes = [...translatedBoxes, ...unmatchedRegionBoxes];
  const matchedWordIds = boxes.map((box) => box.wordId).filter(Boolean);
  const dictionaryFallbackMeaning =
    buildOverallMeaning(textLookupSegments) || buildGlossaryFallbackMeaning(translatedBoxes);
  const contextualTranslation = await translateChineseText({
    text: detectedText,
    glossary: translatedBoxes,
    fallbackTranslation: dictionaryFallbackMeaning,
    targetLang
  });
  const combinedMeaning = contextualTranslation.translation || dictionaryFallbackMeaning;

  return {
    mode,
    targetLang,
    regions,
    matchedWordIds,
    dictionaryBoxes,
    textLookupBoxes,
    contextualTranslation,
    result: {
      boxes,
      regions: rawRegionBoxes,
      segments: boxes.map(toSegment),
      combinedMeaning,
      detectedText,
      targetLang,
      provider: getOcrProvider(),
      translationProvider: contextualTranslation.provider,
      translationModel: contextualTranslation.modelName
    }
  };
};

export const scanOcr = async (userId, payload) => {
  assertImageWithinLimit(payload?.image);

  const {
    mode,
    targetLang,
    regions,
    matchedWordIds,
    dictionaryBoxes,
    textLookupBoxes,
    contextualTranslation,
    result
  } = await computeTranslationResult(payload);

  await query(
    `
      INSERT INTO ocr_scan_events (user_id, provider, detected_text, matched_word_ids, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      userId,
      env.OCR_PROVIDER,
      result.detectedText,
      JSON.stringify(matchedWordIds),
      JSON.stringify({
        mode,
        targetLang,
        regionCount: regions.length,
        matchedCount: matchedWordIds.length,
        dictionaryMatchCount: dictionaryBoxes.length,
        textLookupMatchCount: textLookupBoxes.length,
        translationProvider: contextualTranslation.provider,
        translationModel: contextualTranslation.modelName,
        baseUrl: mode === 'paddle_ocr' ? env.OCR_BASE_URL : undefined
      })
    ]
  );

  return result;
};

// Public text-only translation: no image OCR and no history persistence, so it
// can be used without an account. Images are rejected — those still require the
// authenticated /ocr/scan endpoint.
export const translatePublicText = async (payload = {}) => {
  const text = asText(payload.text);

  if (!text) {
    throw badRequest('Vui lòng nhập nội dung tiếng Trung cần dịch.');
  }

  const { result } = await computeTranslationResult({ text, targetLang: payload.targetLang });
  return result;
};

export const getOcrHistory = async (userId, options = {}) => {
  const filters = normalizeOcrHistoryFilters(options);
  const values = [userId];
  const where = ['user_id = $1'];

  if (filters.keyword) {
    values.push(toLikePattern(filters.keyword));
    where.push(`(detected_text ILIKE $${values.length} OR title ILIKE $${values.length} OR note ILIKE $${values.length})`);
  }

  if (filters.date) {
    values.push(filters.date);
    where.push(`created_at::date = $${values.length}::date`);
  } else {
    if (filters.from) {
      values.push(filters.from);
      where.push(`created_at::date >= $${values.length}::date`);
    }

    if (filters.to) {
      values.push(filters.to);
      where.push(`created_at::date <= $${values.length}::date`);
    }
  }

  if (filters.favorite) {
    where.push('is_favorite = true');
  }

  values.push(filters.limit);
  const result = await query(
    `
      SELECT *
      FROM ocr_scan_events
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${values.length}
    `,
    values
  );

  return {
    events: result.rows.map(mapOcrHistoryEvent)
  };
};

export const getOcrScanDetail = async (userId, scanId) => {
  const result = await query(
    `
      SELECT *
      FROM ocr_scan_events
      WHERE user_id = $1 AND id = $2
      LIMIT 1
    `,
    [userId, scanId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay lich su OCR.');
  }

  return {
    event: mapOcrHistoryEvent(result.rows[0])
  };
};

export const updateOcrScanNotebook = async (userId, scanId, payload) => {
  const notebook = normalizeNotebookPayload(payload);
  const updates = [];
  const values = [userId, scanId];

  if (notebook.title !== undefined) {
    values.push(notebook.title);
    updates.push(`title = $${values.length}`);
  }

  if (notebook.note !== undefined) {
    values.push(notebook.note);
    updates.push(`note = $${values.length}`);
  }

  if (notebook.isFavorite !== undefined) {
    values.push(notebook.isFavorite);
    updates.push(`is_favorite = $${values.length}`);
  }

  if (updates.length === 0) {
    return getOcrScanDetail(userId, scanId);
  }

  const result = await query(
    `
      UPDATE ocr_scan_events
      SET ${updates.join(', ')}
      WHERE user_id = $1 AND id = $2
      RETURNING *
    `,
    values
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay lich su OCR.');
  }

  return {
    event: mapOcrHistoryEvent(result.rows[0])
  };
};

export const deleteOcrScan = async (userId, scanId) => {
  const result = await query(
    `
      DELETE FROM ocr_scan_events
      WHERE user_id = $1 AND id = $2
      RETURNING id
    `,
    [userId, scanId]
  );

  if (result.rowCount === 0) {
    throw notFound('Khong tim thay lich su OCR.');
  }

  return {
    deletedId: result.rows[0].id
  };
};

export const clearOcrHistory = async (userId) => {
  const result = await query(
    `
      DELETE FROM ocr_scan_events
      WHERE user_id = $1
    `,
    [userId]
  );

  return {
    deletedCount: result.rowCount
  };
};

export const __private__ = {
  buildOverallMeaning,
  buildGlossaryFallbackMeaning,
  buildTextLookupBoxes,
  mapOcrHistoryEvent,
  normalizeNotebookPayload,
  normalizeOcrHistoryFilters,
  segmentDictionaryEntries
};
