import assert from 'node:assert/strict';
import test from 'node:test';
import { ContentValidator } from '../../src/services/content-validator.js';
import {
  buildGrammarLibraryEntries,
  localizeLesson,
  repairMojibakeString
} from '../../src/services/content-language.service.js';

const baseLesson = () => ({
  lesson_id: 'hsk1-l01-listening-greetings',
  metadata: {
    title_zh: '你好',
    title_en: 'Hello!',
    title_vi: 'Xin chào!',
    hsk_level: 1,
    cefr_level: 'A1',
    primary_skill: 'listening',
    topic: 'greetings',
    estimated_minutes: 8,
    xp_reward: 25
  },
  learning_objectives: ['Recognize simple greetings.'],
  learning_objectives_vi: ['Nhận biết các câu chào hỏi đơn giản.'],
  vocabulary_focus: [{ simplified: '你好', pinyin: 'nǐ hǎo', english: 'hello' }],
  grammar_focus: [{
    pattern: '我叫...',
    explanation: 'Use this pattern to say your name.',
    explanation_vi: 'Dùng mẫu câu này để nói tên của bạn.',
    hsk_level: 1,
    cefr_level: 'A1',
    examples: [{ zh: '我叫小明。', pinyin: 'Wǒ jiào Xiǎo Míng.', en: 'My name is Xiao Ming.', vi: 'Tên tôi là Tiểu Minh.' }]
  }],
  warm_up: { type: 'vocabulary_review', items: ['你好'] },
  core_modules: [{
    module_type: 'listening',
    phases: [{ type: 'dialogue_listen', dialogue: [{ speaker: 'A', zh: '你好！', pinyin: 'Nǐ hǎo!', en: 'Hello!', vi: 'Xin chào!' }] }]
  }],
  practice: {
    exercises: [{
      kind: 'multiple_choice',
      skill: 'listening',
      bloom_level: 'understand',
      prompt: 'What does 你好 mean?',
      prompt_vi: '你好 có nghĩa là gì?',
      options: ['hello', 'thank you'],
      options_vi: ['xin chào', 'cảm ơn'],
      correct_answer: 'hello',
      correct_answer_vi: 'xin chào',
      explanation: '你好 is the basic greeting hello.',
      explanation_vi: '你好 là lời chào cơ bản.'
    }]
  },
  review: {
    key_takeaways: ['你好 means hello.'],
    key_takeaways_vi: ['你好 có nghĩa là xin chào.'],
    srs_inject_word_ids: []
  }
});

test('repairMojibakeString repairs UTF-8 text decoded as Windows-1252', () => {
  assert.equal(repairMojibakeString('ä½ å¥½'), '你好');
  assert.equal(repairMojibakeString('Ngá»¯ phÃ¡p'), 'Ngữ pháp');
  assert.equal(repairMojibakeString('你好'), '你好');
});

test('localizeLesson repairs mojibake and fills Vietnamese lesson fields', () => {
  const lesson = localizeLesson({
    ...baseLesson(),
    metadata: {
      ...baseLesson().metadata,
      title_zh: 'ä½ å¥½',
      title_vi: undefined
    },
    learning_objectives_vi: undefined,
    grammar_focus: [{
      pattern: 'æˆ‘å«...',
      explanation: 'Use this pattern to say your name.',
      examples: [{ zh: 'æˆ‘å«å°æ˜Žã€‚', pinyin: 'WÇ’ jiÃ o XiÇŽo MÃ­ng.', en: 'My name is Xiao Ming.' }]
    }]
  });

  assert.equal(lesson.metadata.title_zh, '你好');
  assert.equal(lesson.metadata.title_vi, 'Xin chào!');
  assert.equal(lesson.grammar_focus[0].pattern, '我叫...');
  assert.equal(lesson.grammar_focus[0].hsk_level, 1);
  assert.equal(lesson.grammar_focus[0].examples[0].vi, 'Tên tôi là Tiểu Minh.');
});

test('ContentValidator reports localization and grammar-level issues', async () => {
  const lesson = baseLesson();
  delete lesson.metadata.title_vi;
  delete lesson.grammar_focus[0].hsk_level;
  lesson.practice.exercises[0].prompt = 'What does ä½ å¥½ mean?';

  const validator = new ContentValidator({ skipDatabaseChecks: true });
  const result = await validator.validateLesson(lesson, 1);

  assert.equal(result.ok, false);
  assert(result.errors.some((issue) => issue.code === 'grammar_level_missing'));
  assert(result.errors.some((issue) => issue.code === 'mojibake_detected'));
  assert(result.warnings.some((issue) => issue.code === 'missing_vietnamese'));
});

test('buildGrammarLibraryEntries dedupes patterns and keeps the lowest HSK level', () => {
  const lessonA = baseLesson();
  const lessonB = {
    ...baseLesson(),
    lesson_id: 'hsk2-l04-reading-shopping',
    metadata: { ...baseLesson().metadata, hsk_level: 2, cefr_level: 'A2' },
    grammar_focus: [{ ...baseLesson().grammar_focus[0], hsk_level: 2, cefr_level: 'A2' }]
  };

  const entries = buildGrammarLibraryEntries([lessonB, lessonA]);

  assert.equal(entries.length, 1);
  assert.equal(entries[0].hsk_level, 1);
  assert.deepEqual(entries[0].source_lesson_ids.sort(), [
    'hsk1-l01-listening-greetings',
    'hsk2-l04-reading-shopping'
  ]);
});
