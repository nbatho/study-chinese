import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/utility.service.js';

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
