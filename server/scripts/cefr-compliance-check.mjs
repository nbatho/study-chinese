import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, resolveContentPath, resolveExistingPath } from '../src/config/content-paths.js';
import { loadLessonEntries } from './lesson-data-files.mjs';
import { loadRules, readArg } from './validate-exercises.mjs';

const args = process.argv.slice(2);
const inputDirArg = readArg(args, 'input-dir', 'data/lessons/normalized');
const rulesArg = readArg(args, 'rules', 'data/lessons/cefr-exercise-rules.json');
const reportArg = readArg(args, 'report', 'data/lessons/normalized/cefr-compliance-report.json');

const hanziCount = (value) => [...String(value || '')].filter((char) => /\p{Script=Han}/u.test(char)).length;

const stimulusText = (exercise) => {
  if (exercise.kind === 'reading_comprehension') {
    return exercise.stimulus?.text || '';
  }

  if (exercise.kind === 'listening_comprehension') {
    return exercise.stimulus?.audioText || exercise.stimulus?.text || '';
  }

  return '';
};

const expectedSkill = (lesson, exercise) => {
  const primarySkill = lesson.metadata?.primary_skill || 'mixed';
  return primarySkill === 'mixed' ? 'mixed' : primarySkill === exercise.skill;
};

const run = async () => {
  const sourceDir = await resolveExistingPath(inputDirArg, ['lessons', 'normalized']);
  const { rules } = await loadRules(rulesArg);
  const entries = await loadLessonEntries(sourceDir);
  const errors = [];
  const warnings = [];
  const byLevel = {};
  const promptUsage = new Map();

  for (const { file, lesson } of entries) {
    const hsk = Number(lesson.metadata?.hsk_level || 0);
    const cefr = lesson.metadata?.cefr_level;
    const expectedCefr = rules.hsk_to_cefr?.[String(hsk)];
    const levelRules = rules.levels?.[cefr];
    const lessonKey = lesson.lesson_id || file;

    byLevel[hsk] = (byLevel[hsk] || 0) + 1;

    if (expectedCefr !== cefr) {
      errors.push(`${lessonKey}: expected CEFR ${expectedCefr} for HSK${hsk}, got ${cefr}.`);
    }

    if (!levelRules) {
      errors.push(`${lessonKey}: missing rules for CEFR ${cefr}.`);
      continue;
    }

    const exercises = lesson.practice?.exercises || [];
    const expectedBloom = levelRules.bloom_distribution || [];
    const allowedKinds = new Set(levelRules.allowed_kinds || []);

    exercises.forEach((exercise, index) => {
      const exerciseKey = exercise.id || `${lessonKey}-ex${index + 1}`;
      const expectedId = `${lesson.lesson_id}-ex${index + 1}`;
      const topicKey = `${hsk}|${lesson.metadata?.topic || ''}|${exercise.prompt || ''}`;

      if (exercise.id !== expectedId) {
        errors.push(`${exerciseKey}: expected id ${expectedId}.`);
      }

      if (!allowedKinds.has(exercise.kind)) {
        errors.push(`${exerciseKey}: ${exercise.kind} is not allowed for ${cefr}.`);
      }

      if (expectedBloom[index] && exercise.bloom_level !== expectedBloom[index]) {
        errors.push(`${exerciseKey}: expected Bloom ${expectedBloom[index]}, got ${exercise.bloom_level}.`);
      }

      if (!expectedSkill(lesson, exercise)) {
        errors.push(`${exerciseKey}: skill ${exercise.skill} does not match lesson primary skill ${lesson.metadata?.primary_skill}.`);
      }

      if (promptUsage.has(topicKey)) {
        errors.push(`${exerciseKey}: duplicate prompt in same HSK/topic also used by ${promptUsage.get(topicKey)}.`);
      } else {
        promptUsage.set(topicKey, exerciseKey);
      }

      if (['reading_comprehension', 'listening_comprehension'].includes(exercise.kind)) {
        const stimulusKind = exercise.kind === 'reading_comprehension' ? 'reading' : 'listening';
        const [minHanzi, maxHanzi] = levelRules.text_complexity?.[stimulusKind]?.hanzi || [0, Infinity];
        const count = hanziCount(stimulusText(exercise));

        if (count < minHanzi || count > maxHanzi) {
          errors.push(`${exerciseKey}: ${stimulusKind} stimulus has ${count} Hanzi, expected ${minHanzi}-${maxHanzi} for ${cefr}.`);
        }

        const pinyinAllowed = Boolean(levelRules.text_complexity?.[stimulusKind]?.pinyin);
        if (!pinyinAllowed && exercise.stimulus?.pinyin) {
          errors.push(`${exerciseKey}: ${cefr} stimulus pinyin must be empty.`);
        }

        if (pinyinAllowed && !exercise.stimulus?.pinyin) {
          errors.push(`${exerciseKey}: ${cefr} stimulus pinyin is required.`);
        }
      }
    });
  }

  for (const [hsk, expectedCefr] of Object.entries(rules.hsk_to_cefr || {})) {
    if ((byLevel[hsk] || 0) !== 17) {
      warnings.push(`HSK${hsk}/${expectedCefr}: expected 17 lessons, found ${byLevel[hsk] || 0}.`);
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    source: path.relative(repoRoot, sourceDir),
    lesson_count: entries.length,
    by_level: byLevel,
    ok: errors.length === 0,
    error_count: errors.length,
    warning_count: warnings.length,
    errors,
    warnings
  };

  const reportPath = resolveContentPath(reportArg);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) {
    process.exitCode = 1;
  }
};

await run();
