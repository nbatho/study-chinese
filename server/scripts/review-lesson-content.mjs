import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { ContentReviewer } from '../src/services/content-reviewer.js';
import { ContentValidator } from '../src/services/content-validator.js';
import { repoRoot, resolveContentPath } from '../src/config/content-paths.js';
import { localizeLesson } from '../src/services/content-language.service.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
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

const inputFile = readArg('file');
const inputDir = resolveContentPath(readArg('input-dir'), ['lessons', 'real']);
const outputDir = resolveContentPath(readArg('output-dir'), ['lessons', 'real', 'reviews']);

const isLessonJson = (filename) =>
  filename.endsWith('.json') &&
  !filename.endsWith('.validation.json') &&
  !filename.endsWith('.review.json') &&
  !filename.endsWith('.release.json') &&
  filename !== 'manifest.json' &&
  filename !== 'validation-report.json' &&
  filename !== 'ai-review-report.json';

const loadLessonFiles = async () => {
  if (inputFile) {
    return [resolveContentPath(inputFile)];
  }

  const filenames = await readdir(inputDir);
  return filenames
    .filter(isLessonJson)
    .map((filename) => path.join(inputDir, filename));
};

const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const run = async () => {
  const lessonFiles = await loadLessonFiles();
  const validator = new ContentValidator({ requireDatabaseChecks: true });
  const reviewer = new ContentReviewer();
  const results = [];

  await mkdir(outputDir, { recursive: true });

  for (const lessonPath of lessonFiles) {
    const lesson = localizeLesson(JSON.parse(await readFile(lessonPath, 'utf8')));
    const targetLevel = Number(lesson?.metadata?.hsk_level || 1);
    const validation = await validator.validateLesson(lesson, targetLevel);
    const aiReview = validation.ok
      ? await reviewer.reviewLesson(lesson, {
          validation,
          targetLevel,
          topic: lesson?.metadata?.topic,
          skill: lesson?.metadata?.primary_skill
        })
      : null;
    const ok = Boolean(validation.ok && aiReview?.ok);
    const basename = path.basename(lessonPath, '.json');

    await writeJson(path.join(outputDir, `${basename}.validation.json`), validation);

    if (aiReview) {
      await writeJson(path.join(outputDir, `${basename}.review.json`), aiReview);
    }

    results.push({
      lesson_id: lesson.lesson_id || basename,
      file: path.relative(repoRoot, lessonPath),
      ok,
      validation_summary: validation.summary,
      review_summary: aiReview
        ? {
            overall_score: aiReview.review.overall_score,
            criteria: aiReview.review.criteria,
            blocking_issues: aiReview.review.blocking_issues,
            low_criteria: aiReview.lowCriteria,
            model_name: aiReview.modelName
          }
        : null
    });
  }

  const report = {
    reviewed_at: new Date().toISOString(),
    count: results.length,
    ok: results.every((item) => item.ok),
    results
  };

  await writeJson(path.join(outputDir, 'ai-review-report.json'), report);
  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exitCode = 1;
  }
};

await run();
