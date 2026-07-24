#!/usr/bin/env node
/**
 * Validates data/ against the content spec in data/plan.md:
 *   - bundle completeness (7 folders x en/vi per lesson)
 *   - HSK -> CEFR mapping, order_num / id consistency
 *   - content_counts matching the real record counts
 *   - per-level quantity targets (plan.md 2.5C)
 *   - exercise integrity (kind coverage, options/correct_index, bloom band)
 *   - vocabulary scope (no words above the lesson's HSK level)
 *   - referential integrity of word ids
 *   - en/vi sync: parallel records, and hanzi/pinyin preserved verbatim
 *
 * Usage: npm run content:validate [-- --json]
 *
 * Note: `prompt`/`options`/`correct_text` legitimately differ between en.json and
 * vi.json — the client reads the hanzi from `promptZh`/`optionsZh` (always the en
 * record) and shows the vi record as the translated instruction line. Only fields
 * that must stay byte-identical are compared here.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(HERE, '../../data');

const HSK_TO_CEFR = { 0: 'pre-A1', 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2' };
const BUNDLES = ['lesson_modules', 'lesson_words', 'exercises', 'grammar_points', 'reading_passages', 'dialogues'];
// HSK0 is the pronunciation track (pre-A1): no vocabulary/grammar/reading in the usual
// sense, so only the two folders that carry the actual pronunciation drills are required.
const HSK0_BUNDLES = new Set(['lesson_modules', 'exercises']);
const KINDS = ['fillBlank', 'multipleChoice', 'trueFalse', 'arrangeSentence', 'readingComprehension', 'listeningComprehension'];
const CHOICE_KINDS = new Set(['multipleChoice', 'trueFalse', 'fillBlank', 'readingComprehension', 'listeningComprehension']);
// plan.md 2.5C gives HSK0 6-8 exercises and nothing else; the pronunciation drills only
// make sense as listening/choice items, so the 6-kind coverage rule is scoped down too.
const HSK0_EXERCISE_MIN = 6;
const HSK0_KINDS = ['listeningComprehension', 'multipleChoice', 'trueFalse'];
// plan.md 2.5C: [vocabMin, vocabMax, gramMin, gramMax, dlgMin, dlgMax, readMin, readMax, exMin]
const QUOTA = {
  1: [8, 12, 2, 3, 8, 12, 1, 1, 8],
  2: [10, 14, 2, 3, 10, 14, 1, 1, 8],
  3: [12, 16, 3, 3, 10, 14, 1, 2, 9],
  4: [14, 18, 3, 3, 12, 16, 2, 2, 9],
  5: [16, 20, 3, 4, 12, 16, 2, 2, 10],
  6: [18, 22, 3, 4, 14, 18, 2, 2, 10]
};
// Fields that carry Chinese and must be identical across en.json / vi.json.
const LOCKED_FIELDS = ['simplified', 'traditional', 'pinyin', 'content_zh', 'content_pinyin', 'pattern', 'title_zh'];
const HAN = /\p{Script=Han}/u;

// A word counts as in-scope if ANY official HSK standard places it at or below the
// lesson's level. `words/` carries three of them in `level_sources` (`newest-N` = HSK 3.0,
// `new-N` and `old-N` = HSK 2.0) while `hsk_level` only tracks `newest-N`, so comparing
// `hsk_level` alone flags words that are perfectly standard under HSK 2.0.
const effectiveLevel = (word) => {
  const levels = (word.level_sources || [])
    .map((source) => Number(/-(\d)$/.exec(source)?.[1]))
    .filter(Number.isInteger);
  if (Number.isInteger(word.hsk_level)) levels.push(word.hsk_level);
  return levels.length ? Math.min(...levels) : 0;
};

// Words above their lesson's level under *every* standard, kept deliberately: each one is
// the topic word of its lesson (药 <-> the doctor lesson, 下雪 <-> the weather lesson) and
// already sits in the dialogue, so swapping it means rewriting the lesson around it.
const SCOPE_EXCEPTIONS = new Set([
  'hsk1-l04-standard-numbers:号码',
  'hsk1-l10-standard-weather:下雪',
  'hsk1-l12-standard-doctor:药',
  'hsk1-l12-standard-doctor:不舒服',
  'hsk3-l03-standard-job-interview:面试',
  // Added in Đợt 3: each is the word the HSK4 lesson is named after and built around.
  'hsk4-l01-standard-teamwork:团队',
  'hsk4-l05-standard-workplace-feedback:反馈',
  'hsk4-l07-standard-community:社区'
]);

const findings = [];
const add = (code, message) => findings.push({ code, message });

const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    add('JSON', `${path.relative(DATA, file)}: ${error.message}`);
    return null;
  }
};

const countHanzi = (value) => [...String(value || '')].filter((char) => HAN.test(char)).length;

const run = async () => {
  const words = new Map();
  for (const chunk of await readdir(path.join(DATA, 'words'))) {
    const rows = await readJson(path.join(DATA, 'words', chunk, 'en.json'));
    for (const word of rows || []) words.set(word.id, word);
  }

  const lessonIds = (await readdir(path.join(DATA, 'lessons'))).sort();
  const byLevel = new Map();

  for (const lessonId of lessonIds) {
    const match = /^hsk(\d)-l(\d\d)-/.exec(lessonId);
    if (!match) {
      add('ID', `${lessonId}: id does not match hsk{L}-l{NN}-{slug}`);
      continue;
    }
    const level = Number(match[1]);
    const order = Number(match[2]);
    byLevel.set(level, [...(byLevel.get(level) || []), lessonId]);

    const lesson = await readJson(path.join(DATA, 'lessons', lessonId, 'en.json'));
    if (!lesson) {
      add('MISSING', `${lessonId}: lessons/en.json missing`);
      continue;
    }

    const required = level === 0 ? HSK0_BUNDLES : new Set(BUNDLES);
    const bundle = {};
    for (const dir of BUNDLES) {
      bundle[dir] = await readJson(path.join(DATA, dir, lessonId, 'en.json'));
      if (bundle[dir] === null && required.has(dir)) add('MISSING', `${lessonId}: ${dir}/ has no records`);
      if (bundle[dir] !== null && !existsSync(path.join(DATA, dir, lessonId, 'vi.json'))) {
        add('MISSING', `${lessonId}: ${dir}/vi.json missing`);
      }
    }

    const dialogueLines = lesson.dialogue?.lines || [];
    const actual = {
      vocab: (bundle.lesson_words || []).length,
      grammar: (bundle.grammar_points || []).length,
      dialogue_lines: dialogueLines.length,
      reading_passages: (bundle.reading_passages || []).length,
      exercises: (bundle.exercises || []).length
    };

    if (lesson.id !== lessonId) add('ID', `${lessonId}: lessons.id is ${lesson.id}`);
    if (lesson.hsk_level !== level) add('CEFR', `${lessonId}: hsk_level ${lesson.hsk_level} != ${level}`);
    if (lesson.order_num !== order) add('CEFR', `${lessonId}: order_num ${lesson.order_num} != ${order}`);
    if (lesson.cefr_level !== HSK_TO_CEFR[level]) {
      add('CEFR', `${lessonId}: cefr_level ${lesson.cefr_level} should be ${HSK_TO_CEFR[level]}`);
    }

    const counts = lesson.content_counts;
    if (!counts) add('COUNTS', `${lessonId}: content_counts missing`);
    else {
      for (const [key, value] of Object.entries(actual)) {
        if (counts[key] !== value) add('COUNTS', `${lessonId}: content_counts.${key} ${counts[key]} != actual ${value}`);
      }
    }

    const quota = QUOTA[level];
    if (quota) {
      const checks = [
        ['vocab', quota[0], quota[1]],
        ['grammar', quota[2], quota[3]],
        ['dialogue_lines', quota[4], quota[5]],
        ['reading_passages', quota[6], quota[7]]
      ];
      for (const [key, min, max] of checks) {
        if (actual[key] < min || actual[key] > max) {
          add('QUOTA', `${lessonId}: ${key}=${actual[key]} (expected ${min}-${max})`);
        }
      }
      if (actual.exercises < quota[8]) {
        add('QUOTA', `${lessonId}: exercises=${actual.exercises} (expected >= ${quota[8]})`);
      }
    } else if (level === 0 && actual.exercises < HSK0_EXERCISE_MIN) {
      add('QUOTA', `${lessonId}: exercises=${actual.exercises} (expected >= ${HSK0_EXERCISE_MIN})`);
    }

    const seenKinds = new Set();
    for (const exercise of bundle.exercises || []) {
      seenKinds.add(exercise.kind);
      if (!KINDS.includes(exercise.kind)) add('EXERCISE', `${exercise.id}: unknown kind ${exercise.kind}`);
      if (exercise.lesson_id !== lessonId) add('ID', `${exercise.id}: lesson_id ${exercise.lesson_id}`);
      if (!exercise.answer_explanation) add('EXERCISE', `${exercise.id}: answer_explanation missing`);
      if (level <= 2 && ['evaluate', 'create'].includes(exercise.bloom_level)) {
        add('BLOOM', `${exercise.id}: bloom ${exercise.bloom_level} too high for ${HSK_TO_CEFR[level]}`);
      }
      if (level >= 5 && exercise.bloom_level === 'remember') {
        add('BLOOM', `${exercise.id}: bloom remember too low for ${HSK_TO_CEFR[level]}`);
      }
      const options = exercise.options || [];
      if (CHOICE_KINDS.has(exercise.kind) && options.length) {
        const index = exercise.correct_index;
        if (!Number.isInteger(index) || index < 0 || index >= options.length) {
          add('EXERCISE', `${exercise.id}: correct_index ${index} out of range (${options.length} options)`);
        } else if (exercise.correct_text != null && exercise.correct_text !== options[index]) {
          add('EXERCISE', `${exercise.id}: correct_text does not match options[${index}]`);
        }
        if (new Set(options.map(String)).size !== options.length) {
          add('EXERCISE', `${exercise.id}: duplicate options`);
        }
      }
      if (exercise.kind === 'fillBlank' && !String(exercise.prompt || '').includes('___')) {
        add('EXERCISE', `${exercise.id}: fillBlank prompt has no ___ slot`);
      }
    }
    if ((bundle.exercises || []).length) {
      const missing = (level === 0 ? HSK0_KINDS : KINDS).filter((kind) => !seenKinds.has(kind));
      if (missing.length) add('KIND-COVERAGE', `${lessonId}: missing kinds ${missing.join(', ')}`);
    }

    const seenWordIds = new Set();
    for (const row of bundle.lesson_words || []) {
      const word = words.get(row.word_id);
      if (!word) add('REF', `${lessonId}: lesson_words -> unknown word_id ${row.word_id}`);
      else if (effectiveLevel(word) > level && !SCOPE_EXCEPTIONS.has(`${lessonId}:${word.simplified}`)) {
        add('SCOPE', `${lessonId}: ${word.simplified} is HSK${effectiveLevel(word)} > HSK${level}`);
      }
      if (seenWordIds.has(row.word_id)) add('REF', `${lessonId}: duplicate word_id ${row.word_id}`);
      seenWordIds.add(row.word_id);
    }
    for (const wordId of lesson.review_summary?.srs_inject_word_ids || []) {
      if (!words.has(wordId)) add('REF', `${lessonId}: srs_inject_word_ids -> unknown ${wordId}`);
    }

    for (const passage of bundle.reading_passages || []) {
      for (const wordId of passage.new_word_ids || []) {
        if (!words.has(wordId)) add('REF', `${passage.id}: new_word_ids -> unknown ${wordId}`);
      }
      const real = countHanzi(passage.content_zh);
      if (Number.isInteger(passage.word_count) && Math.abs(passage.word_count - real) > Math.max(3, real * 0.15)) {
        add('READING', `${passage.id}: word_count ${passage.word_count} != ${real} hanzi`);
      }
      if (!(passage.questions || []).length) add('READING', `${passage.id}: no comprehension questions`);
    }

    for (let i = 0; i < dialogueLines.length; i += 1) {
      for (const field of ['simplified', 'pinyin', 'english', 'vi', 'speaker']) {
        if (!dialogueLines[i][field]) add('DIALOGUE', `${lessonId}: dialogue line ${i + 1} missing ${field}`);
      }
    }

    for (const dir of ['lessons', ...BUNDLES]) {
      const en = await readJson(path.join(DATA, dir, lessonId, 'en.json'));
      const vi = await readJson(path.join(DATA, dir, lessonId, 'vi.json'));
      if (!en || !vi) continue;
      let pairs;
      if (Array.isArray(en)) {
        if (!Array.isArray(vi) || en.length !== vi.length) {
          add('SYNC', `${lessonId}/${dir}: en has ${en.length} records, vi has ${vi?.length}`);
        }
        const viById = new Map((Array.isArray(vi) ? vi : []).map((row) => [row?.id, row]));
        pairs = en.map((row) => [row, viById.get(row?.id)]);
      } else {
        pairs = [[en, vi]];
      }
      for (const [a, b] of pairs) {
        if (!a || !b) {
          if (a?.id) add('SYNC', `${lessonId}/${dir}: vi is missing id ${a.id}`);
          continue;
        }
        for (const field of LOCKED_FIELDS) {
          if (typeof a[field] === 'string' && typeof b[field] === 'string' && a[field] !== b[field]) {
            add('SYNC', `${lessonId}/${dir} [${a.id}]: ${field} differs between en and vi (must stay identical)`);
          }
        }
      }
    }
  }

  // HSK0 stays at the 13-lesson pronunciation track; HSK1-6 were extended with the
  // restored topics at orders 14-17 (see data/plan.md deviation note), so they carry 17.
  for (const [level, ids] of [...byLevel.entries()].sort((a, b) => a[0] - b[0])) {
    const expected = level === 0 ? 13 : 17;
    if (ids.length !== expected) add('STRUCTURE', `HSK${level}: ${ids.length} lessons (expected ${expected})`);
    if (!ids.some((id) => id.endsWith('review'))) add('STRUCTURE', `HSK${level}: no review lesson`);
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    const grouped = new Map();
    for (const finding of findings) {
      grouped.set(finding.code, [...(grouped.get(finding.code) || []), finding.message]);
    }
    for (const [code, messages] of [...grouped.entries()].sort()) {
      console.log(`\n${code} (${messages.length})`);
      for (const message of messages.slice(0, 15)) console.log(`  - ${message}`);
      if (messages.length > 15) console.log(`  ... ${messages.length - 15} more`);
    }
    console.log(`\nTotal: ${findings.length} findings across ${lessonIds.length} lessons.`);
  }

  process.exitCode = findings.length ? 1 : 0;
};

await run();
