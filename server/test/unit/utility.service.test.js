import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/utility.service.js';
import { __private__ as aiProviderPrivate } from '../../src/services/ai-provider.service.js';

test('OCR history mapper exposes notebook fields safely', () => {
  const event = __private__.mapOcrHistoryEvent({
    id: 'scan-1',
    provider: 'mock',
    title: 'Lunch menu',
    note: 'Practice these words later.',
    is_favorite: true,
    detected_text: '茶',
    matched_word_ids: ['tea'],
    metadata: { matchedCount: 1 },
    created_at: '2026-06-26T00:00:00.000Z'
  });

  assert.equal(event.title, 'Lunch menu');
  assert.equal(event.note, 'Practice these words later.');
  assert.equal(event.isFavorite, true);
  assert.deepEqual(event.matchedWordIds, ['tea']);
});

test('OCR history filters normalize limits and favorite flags', () => {
  assert.deepEqual(__private__.normalizeOcrHistoryFilters({
    limit: '500',
    keyword: ' tea ',
    date: '2026-06-26',
    favorite: 'true'
  }), {
    limit: 100,
    keyword: 'tea',
    date: '2026-06-26',
    from: '',
    to: '',
    favorite: true
  });
});

test('OCR notebook payload keeps explicit null-like edits separate from omitted fields', () => {
  assert.deepEqual(__private__.normalizeNotebookPayload({ title: '  ', note: 'Read again', isFavorite: true }), {
    title: null,
    note: 'Read again',
    isFavorite: true
  });
  assert.deepEqual(__private__.normalizeNotebookPayload({}), {
    title: undefined,
    note: undefined,
    isFavorite: undefined
  });
});

test('text lookup segments Chinese phrases by longest dictionary match', () => {
  const entries = [
    { simplified: '\u6240', traditional: '\u6240', pinyin: 'suo3', english: 'place; particle' },
    { simplified: '\u8c13', traditional: '\u8b02', pinyin: 'wei4', english: 'to say' },
    { simplified: '\u6240\u8c13', traditional: '\u6240\u8b02', pinyin: 'suo3 wei4', english: 'so-called; what is referred to as' },
    { simplified: '\u771f', traditional: '\u771f', pinyin: 'zhen1', english: 'real' },
    { simplified: '\u6b63', traditional: '\u6b63', pinyin: 'zheng4', english: 'actually; first month' },
    { simplified: '\u771f\u6b63', traditional: '\u771f\u6b63', pinyin: 'zhen1 zheng4', english: 'genuine; real; true' },
    { simplified: '\u7684', traditional: '\u7684', pinyin: 'de', english: 'of; particle' },
    { simplified: '\u7a33', traditional: '\u7a69', pinyin: 'wen3', english: 'settled; steady' },
    { simplified: '\u5b9a', traditional: '\u5b9a', pinyin: 'ding4', english: 'to fix; to decide' },
    { simplified: '\u7a33\u5b9a', traditional: '\u7a69\u5b9a', pinyin: 'wen3 ding4', english: 'steady; stable; stability' }
  ];

  assert.deepEqual(
    __private__.segmentDictionaryEntries('\u6240\u8c13\u771f\u6b63\u7684\u7a33\u5b9a', entries).map((entry) => entry.simplified),
    ['\u6240\u8c13', '\u771f\u6b63', '\u7684', '\u7a33\u5b9a']
  );
});

test('text lookup boxes omit low-signal particles from combined text translation', () => {
  const boxes = __private__.buildTextLookupBoxes('\u6240\u8c13\u771f\u6b63\u7684\u7a33\u5b9a', [
    { simplified: '\u6240', traditional: '\u6240', pinyin: 'suo3', english: 'place; particle' },
    { simplified: '\u6240\u8c13', traditional: '\u6240\u8b02', pinyin: 'suo3 wei4', english: 'so-called; what is referred to as' },
    { simplified: '\u771f\u6b63', traditional: '\u771f\u6b63', pinyin: 'zhen1 zheng4', english: 'genuine; real; true' },
    { simplified: '\u7684', traditional: '\u7684', pinyin: 'de', english: 'of; particle' },
    { simplified: '\u7a33\u5b9a', traditional: '\u7a69\u5b9a', pinyin: 'wen3 ding4', english: 'steady; stable; stability' },
    { simplified: '\u5b9a', traditional: '\u5b9a', pinyin: 'ding4', english: 'to fix; to decide' }
  ]);

  assert.deepEqual(boxes.map((box) => box.text), ['\u6240\u8c13', '\u771f\u6b63', '\u7a33\u5b9a']);
  assert.equal(
    boxes.map((box) => box.english).join('; '),
    'so-called; what is referred to as; genuine; real; true; steady; stable; stability'
  );
});

test('text lookup builds one overall meaning for a phrase', () => {
  const entries = [
    { simplified: '\u6240\u8c13', traditional: '\u6240\u8b02', pinyin: 'suo3 wei4', english: 'what is referred to as; so-called' },
    { simplified: '\u771f\u6b63', traditional: '\u771f\u6b63', pinyin: 'zhen1 zheng4', english: 'genuine; real; true' },
    { simplified: '\u7684', traditional: '\u7684', pinyin: 'de', english: 'of; particle' },
    { simplified: '\u7a33\u5b9a', traditional: '\u7a69\u5b9a', pinyin: 'wen3 ding4', english: 'steady; stable; stability' }
  ];
  const segments = __private__
    .segmentDictionaryEntries('\u6240\u8c13\u771f\u6b63\u7684\u7a33\u5b9a', entries)
    .map((entry) => ({ entry }));

  assert.equal(__private__.buildOverallMeaning(segments), 'so-called true stability');
});

test('OCR glossary fallback uses dictionary hints when AI is unavailable', () => {
  assert.equal(
    __private__.buildGlossaryFallbackMeaning([
      { text: '\u6211', english: 'I; me' },
      { text: '\u559d\u8336', english: 'to drink tea; have tea' }
    ]),
    'I; to drink tea'
  );
});

test('AI translation prompt treats OCR word glosses as context hints', () => {
  const messages = aiProviderPrivate.toTranslationProviderMessages({
    text: '\u6211\u60f3\u559d\u8336',
    glossary: [
      { text: '\u6211', pinyin: 'wo3', english: 'I; me' },
      { text: '\u60f3', pinyin: 'xiang3', english: 'to want; to think' },
      { text: '\u559d\u8336', pinyin: 'he1 cha2', english: 'to drink tea' }
    ],
    fallbackTranslation: 'I want to drink tea'
  });

  assert.match(messages.system, /Prefer contextual sentence\/phrase meaning over word-by-word glosses/);
  assert.match(messages.history[0].content, /Dictionary hints/);
  assert.match(messages.history[0].content, /Current word-by-word fallback/);
});

test('AI translation normalizer prefers model translation and falls back safely', () => {
  assert.equal(
    aiProviderPrivate.normalizeTranslationReply(
      { translation: '  Toi muon uong tra.  ', pinyin: 'wo xiang he cha' },
      {
        provider: 'mock-provider',
        modelName: 'mock-model',
        tokenUsage: null,
        latencyMs: 5,
        fallbackTranslation: 'I want to drink tea'
      }
    ).translation,
    'Toi muon uong tra.'
  );

  assert.equal(
    aiProviderPrivate.normalizeTranslationReply(
      { translation: '   ', pinyin: '' },
      {
        provider: 'mock-provider',
        modelName: 'mock-model',
        tokenUsage: null,
        latencyMs: 5,
        fallbackTranslation: 'I want to drink tea'
      }
    ).translation,
    'I want to drink tea'
  );
});
