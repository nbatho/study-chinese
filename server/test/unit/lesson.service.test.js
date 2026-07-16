import assert from 'node:assert/strict';
import test from 'node:test';
import { mapStimulus } from '../../src/services/lesson.service.js';

test('mapStimulus returns empty object/original when stimulus is empty or not an object', () => {
  assert.deepEqual(mapStimulus(null), {});
  assert.deepEqual(mapStimulus(undefined), {});
  assert.deepEqual(mapStimulus({}), {});
  assert.deepEqual(mapStimulus('not an object'), 'not an object');
});

test('mapStimulus localizes readingComprehension stimulus with vietnamese key', () => {
  const stimulus = {
    type: 'reading',
    title: '家人',
    text: '李月，你家有几口人？',
    pinyin: 'Lǐ Yuè, nǐ jiā yǒu jǐ kǒu rén?',
    english: 'Li Yue talks about the three people in her family...',
    vietnamese: 'Lý Nguyệt kể về gia đình ba người...'
  };

  const mappedEn = mapStimulus(stimulus, 'en');
  assert.equal(mappedEn.english, 'Li Yue talks about the three people in her family...');
  assert.equal(mappedEn.en, 'Li Yue talks about the three people in her family...');
  assert.equal(mappedEn.vi, 'Lý Nguyệt kể về gia đình ba người...');

  const mappedVi = mapStimulus(stimulus, 'vi');
  assert.equal(mappedVi.english, 'Lý Nguyệt kể về gia đình ba người...');
  assert.equal(mappedVi.en, 'Li Yue talks about the three people in her family...');
  assert.equal(mappedVi.vi, 'Lý Nguyệt kể về gia đình ba người...');
});

test('mapStimulus localizes listeningComprehension stimulus lines with vi key', () => {
  const stimulus = {
    type: 'listening',
    title: '数字',
    text: '...',
    pinyin: '...',
    english: "I'm twenty this year. And you? I'm nineteen.",
    audioText: '我今年二十岁。你呢？我十九岁。',
    lines: [
      {
        speaker: 'B',
        simplified: '我今年二十岁。你呢？',
        pinyin: 'Wǒ jīn nián èr shí suì. Nǐ ne?',
        english: "I'm twenty this year. And you?",
        vi: 'Năm nay mình hai mươi tuổi. Còn bạn?'
      }
    ]
  };

  const mappedEn = mapStimulus(stimulus, 'en');
  assert.equal(mappedEn.lines[0].english, "I'm twenty this year. And you?");
  assert.equal(mappedEn.lines[0].en, "I'm twenty this year. And you?");
  assert.equal(mappedEn.lines[0].vi, 'Năm nay mình hai mươi tuổi. Còn bạn?');

  const mappedVi = mapStimulus(stimulus, 'vi');
  assert.equal(mappedVi.lines[0].english, 'Năm nay mình hai mươi tuổi. Còn bạn?');
  assert.equal(mappedVi.lines[0].en, "I'm twenty this year. And you?");
  assert.equal(mappedVi.lines[0].vi, 'Năm nay mình hai mươi tuổi. Còn bạn?');
});

test('mapStimulus falls back to english if vi/vietnamese translations are missing', () => {
  const stimulus = {
    type: 'reading',
    title: '家人',
    text: '李月，你家有几口人？',
    english: 'Li Yue talks about the three people in her family...'
  };

  const mappedVi = mapStimulus(stimulus, 'vi');
  assert.equal(mappedVi.english, 'Li Yue talks about the three people in her family...');
  assert.equal(mappedVi.vi, null);
});
