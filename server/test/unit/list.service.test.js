import assert from 'node:assert/strict';
import test from 'node:test';
import { __private__ } from '../../src/services/list.service.js';

const baseList = {
  id: 'list-1',
  name: 'Menu words',
  emoji: 'OCR',
  wordIds: []
};

test('custom list detail mapper supports an empty list', () => {
  assert.deepEqual(__private__.mapCustomListDetails(baseList, []), {
    list: {
      ...baseList,
      words: []
    }
  });
});

test('custom list detail mapper includes full word fields', () => {
  const result = __private__.mapCustomListDetails(
    { ...baseList, wordIds: ['tea'] },
    [
      {
        id: 'tea',
        simplified: '茶',
        traditional: '茶',
        pinyin: 'cha2',
        tones: [2],
        english: 'tea',
        part_of_speech: 'noun',
        hsk_level: '1',
        category: 'food'
      }
    ]
  );

  assert.deepEqual(result.list.words, [
    {
      id: 'tea',
      simplified: '茶',
      traditional: '茶',
      pinyin: 'cha2',
      tones: [2],
      english: 'tea',
      partOfSpeech: 'noun',
      hskLevel: 1,
      category: 'food'
    }
  ]);
});
