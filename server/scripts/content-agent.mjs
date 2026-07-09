import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { ContentReviewer } from '../src/services/content-reviewer.js';
import { ContentValidator } from '../src/services/content-validator.js';
import {
  auditLessonLanguage,
  buildGrammarLibraryEntries,
  localizeLesson
} from '../src/services/content-language.service.js';
import { repoRoot, resolveContentPath, resolveExistingPath } from '../src/config/content-paths.js';
import { loadLessonEntries, writeLessonEntry } from './lesson-data-files.mjs';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const readArg = (name, fallback) => {
  const equalsArg = args.find((arg) => arg.startsWith(`--${name}=`));
  if (equalsArg) {
    return equalsArg.split('=').slice(1).join('=');
  }

  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1] && !args[index + 1].startsWith('--')) {
    return args[index + 1];
  }

  return fallback;
};

const dryRun = hasFlag('dry-run');
const aiReviewEnabled = hasFlag('ai-review');
const dbChecks = hasFlag('db-checks');

const loadLessons = async (sourceDir) => {
  return loadLessonEntries(sourceDir);
};

const staticReview = (lesson, validation) => ({
  ok: validation.ok,
  modelName: 'static-content-agent',
  provider: 'local',
  review: {
    overall_score: validation.ok ? 4 : 0,
    criteria: {
      naturalness: validation.ok ? 4 : 0,
      level_fit: validation.ok ? 4 : 0,
      culture: 4,
      pedagogy: validation.ok ? 4 : 0,
      translation: auditLessonLanguage(lesson).warnings.some((issue) => issue.code === 'missing_vietnamese') ? 2 : 4
    },
    blocking_issues: validation.errors.map((issue) => `${issue.code}: ${issue.message}`),
    suggested_revisions: validation.warnings.map((issue) => `${issue.code}: ${issue.message}`)
  },
  lowCriteria: []
});

const run = async () => {
  const sourceDir = await resolveExistingPath(readArg('source', 'data/lessons/normalized'), ['lessons', 'normalized']);
  const outputDir = resolveContentPath(readArg('output', readArg('output-dir', 'data/lessons/normalized')));
  const loaded = await loadLessons(sourceDir);
  const validator = new ContentValidator({
    skipDatabaseChecks: !dbChecks,
    requireDatabaseChecks: dbChecks
  });
  const reviewer = aiReviewEnabled ? new ContentReviewer() : null;
  const normalizedLessons = [];
  const reviewResults = [];

  for (const item of loaded) {
    const lesson = localizeLesson(item.lesson);
    const validation = await validator.validateLesson(lesson, Number(lesson.metadata?.hsk_level || 1));
    const aiReview = reviewer
      ? await reviewer.reviewLesson(lesson, {
          validation,
          targetLevel: lesson.metadata?.hsk_level,
          topic: lesson.metadata?.topic,
          skill: lesson.metadata?.primary_skill
        })
      : staticReview(lesson, validation);

    normalizedLessons.push({ ...item, lesson, validation, aiReview });
    reviewResults.push({
      lesson_id: lesson.lesson_id,
      file: path.relative(repoRoot, item.fullPath),
      ok: validation.ok && aiReview.ok,
      validation_summary: validation.summary,
      review_summary: {
        provider: aiReview.provider,
        model_name: aiReview.modelName,
        overall_score: aiReview.review?.overall_score,
        blocking_issues: aiReview.review?.blocking_issues || []
      }
    });
  }

  const grammarEntries = buildGrammarLibraryEntries(normalizedLessons.map((item) => item.lesson));
  const languageAuditReport = {
    audited_at: new Date().toISOString(),
    source: path.relative(repoRoot, sourceDir),
    count: normalizedLessons.length,
    ok: normalizedLessons.every((item) => auditLessonLanguage(item.lesson).ok),
    results: normalizedLessons.map((item) => {
      const audit = auditLessonLanguage(item.lesson);
      return {
        lesson_id: item.lesson.lesson_id,
        file: path.relative(repoRoot, item.fullPath),
        ok: audit.ok,
        errors: audit.errors,
        warnings: audit.warnings
      };
    })
  };
  const grammarReport = {
    generated_at: new Date().toISOString(),
    count: grammarEntries.length,
    entries: grammarEntries.map((entry) => ({
      id: entry.id,
      pattern: entry.pattern,
      hsk_level: entry.hsk_level,
      cefr_level: entry.cefr_level,
      source_lesson_ids: entry.source_lesson_ids
    }))
  };
  const reviewReport = {
    reviewed_at: new Date().toISOString(),
    ai_review_enabled: aiReviewEnabled,
    ok: reviewResults.every((item) => item.ok),
    results: reviewResults
  };
  const summary = {
    dryRun,
    source: path.relative(repoRoot, sourceDir),
    output: path.relative(repoRoot, outputDir),
    lessons: normalizedLessons.length,
    grammarEntries: grammarEntries.length,
    ok: languageAuditReport.ok && reviewReport.ok
  };

  if (!dryRun) {
    await mkdir(outputDir, { recursive: true });

    for (const item of normalizedLessons) {
      await writeLessonEntry({ targetDir: outputDir, lesson: item.lesson });
    }

    await writeFile(path.join(outputDir, 'language-audit-report.json'), `${JSON.stringify(languageAuditReport, null, 2)}\n`, 'utf8');
    await writeFile(path.join(outputDir, 'grammar-sync-report.json'), `${JSON.stringify(grammarReport, null, 2)}\n`, 'utf8');
    await writeFile(path.join(outputDir, 'agent-review-report.json'), `${JSON.stringify(reviewReport, null, 2)}\n`, 'utf8');
  }

  console.log(JSON.stringify({
    ...summary,
    languageAuditReport,
    grammarReport,
    reviewReport
  }, null, 2));

  if (!summary.ok) {
    process.exitCode = 1;
  }
};

await run();
