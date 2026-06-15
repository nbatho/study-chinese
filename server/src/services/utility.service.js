import { query, withTransaction } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { AppError } from '../utils/http-error.js';
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

const supportedOcrProviders = new Set(['mock', 'paddle']);

const getOcrProvider = () => String(env.OCR_PROVIDER || 'mock').toLowerCase();

const asText = (value) => String(value || '').trim();

const compactForLookup = (value) => asText(value).replace(/\s+/g, '');

const entryMatchesText = (text, entry) => {
  const compactText = compactForLookup(text);

  return compactText.includes(entry.simplified) || compactText.includes(entry.traditional);
};

const getSampleDetectedText = (payload) => {
  const sample = ocrSamples.find((item) => item.id === payload?.sampleId);
  return sample?.detectedText || '';
};

const getFallbackDetectedText = (payload) =>
  asText(payload?.text || payload?.detectedText || getSampleDetectedText(payload) || '中国站');

const callPaddleOcr = async (image) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.OCR_TIMEOUT_MS);

  try {
    const response = await fetch(`${env.OCR_BASE_URL.replace(/\/$/, '')}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image }),
      signal: controller.signal
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new AppError(502, 'OCR_PROVIDER_ERROR', 'OCR local service returned an error.', {
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

    throw new AppError(502, 'OCR_PROVIDER_ERROR', 'Could not connect to OCR local service.', {
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

const segmentDictionaryEntries = (text, entries) => {
  const normalizedText = compactForLookup(text);
  const segments = [];
  let cursor = 0;

  while (cursor < normalizedText.length) {
    const remaining = normalizedText.slice(cursor);
    const match = entries.find(
      (entry) => remaining.startsWith(entry.simplified) || remaining.startsWith(entry.traditional)
    );

    if (!match) {
      cursor += 1;
      continue;
    }

    segments.push(match);
    cursor += Math.max(match.simplified.length, match.traditional.length, 1);
  }

  return segments;
};

const getDictionaryEntriesForText = async (detectedText) => {
  const text = asText(detectedText);
  const compactText = compactForLookup(detectedText);

  if (!text) {
    return [];
  }

  try {
    const result = await query(
      `
        SELECT *
        FROM dictionary_entries
        WHERE position(simplified in $1) > 0
           OR position(traditional in $1) > 0
           OR position(simplified in $2) > 0
           OR position(traditional in $2) > 0
        ORDER BY char_length(simplified) DESC, simplified
        LIMIT 100
      `,
      [text, compactText]
    );

    return result.rows;
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
  const { detectedText, regions, mode } = await getDetectedText(payload);
  const compactDetectedText = compactForLookup(detectedText);

  const result = await query(
    `
      SELECT *
      FROM words
      WHERE is_active = true
        AND (
          position(simplified in $1) > 0
          OR position(traditional in $1) > 0
          OR position(simplified in $2) > 0
          OR position(traditional in $2) > 0
        )
      ORDER BY char_length(simplified) DESC, simplified
      LIMIT 10
    `,
    [detectedText, compactDetectedText]
  );

  const matchedBoxes = result.rows.map((word, index) => ({
    id: `box_${index + 1}`,
    wordId: word.id,
    text: word.simplified,
    pinyin: word.pinyin,
    english: word.english,
    ...buildBox(word, index, regions),
    matched: true
  }));

  const rawRegionBoxes = getOcrRegionBoxes(regions, detectedText);
  const dictionaryEntries = await getDictionaryEntriesForText(detectedText);
  const dictionaryBoxes = filterDictionaryBoxes(buildDictionaryBoxes(rawRegionBoxes, dictionaryEntries), matchedBoxes);
  const translatedBoxes = [...matchedBoxes, ...dictionaryBoxes];
  const unmatchedRegionBoxes = rawRegionBoxes.filter(
    (region) => !translatedBoxes.some((box) => boxOverlapsRegion(box, region))
  );
  const boxes = [...translatedBoxes, ...unmatchedRegionBoxes];

  await query(
    `
      INSERT INTO ocr_scan_events (user_id, provider, detected_text, matched_word_ids, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      userId,
      env.OCR_PROVIDER,
      detectedText,
      JSON.stringify(matchedBoxes.map((box) => box.wordId)),
      JSON.stringify({
        mode,
        regionCount: regions.length,
        matchedCount: matchedBoxes.length,
        dictionaryMatchCount: dictionaryBoxes.length,
        baseUrl: mode === 'paddle_ocr' ? env.OCR_BASE_URL : undefined
      })
    ]
  );

  return {
    boxes,
    regions: rawRegionBoxes,
    segments: boxes.map(toSegment),
    detectedText,
    provider: getOcrProvider()
  };
};
