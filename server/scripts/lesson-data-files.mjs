import { access, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from '../src/config/content-paths.js';

export const NON_LESSON_JSON_FILES = new Set([
  'manifest.json',
  'validation-report.json',
  'language-audit-report.json',
  'grammar-sync-report.json',
  'agent-review-report.json',
  'ai-review-report.json',
  'cefr-regeneration-report.json',
  'cefr-validation-report.json',
  'cefr-compliance-report.json',
  'exercises.json'
]);

export const isLessonJson = (file) => {
  const filename = path.basename(file);
  return filename.endsWith('.json') &&
    filename !== 'lesson.json' &&
    !filename.endsWith('.validation.json') &&
    !filename.endsWith('.review.json') &&
    !filename.endsWith('.release.json') &&
    !filename.startsWith('cefr-regeneration-report.') &&
    !filename.startsWith('cefr-local-regeneration-report.') &&
    !filename.startsWith('cefr-validation-report.') &&
    !NON_LESSON_JSON_FILES.has(filename);
};

export const toLessonParts = (lesson) => {
  const practice = lesson.practice && typeof lesson.practice === 'object' ? { ...lesson.practice } : {};
  const exercises = Array.isArray(practice.exercises) ? practice.exercises : [];
  delete practice.exercises;

  return {
    lesson: {
      ...lesson,
      practice
    },
    exercises: {
      lesson_id: lesson.lesson_id,
      exercises
    }
  };
};

export const mergeLessonParts = (lesson, exercisesPayload = null) => {
  const exercises = Array.isArray(exercisesPayload)
    ? exercisesPayload
    : Array.isArray(exercisesPayload?.exercises)
      ? exercisesPayload.exercises
      : Array.isArray(lesson.practice?.exercises)
        ? lesson.practice.exercises
        : [];

  return {
    ...lesson,
    practice: {
      ...(lesson.practice || {}),
      exercises
    }
  };
};

export const targetPartsForLesson = (lesson) => {
  const lessonId = String(lesson.lesson_id || '').trim();
  const hsk = Number(lesson.metadata?.hsk_level || lessonId.match(/hsk(\d+)/i)?.[1] || 0);
  const levelDir = hsk > 0 ? `hsk${hsk}` : 'hsk-unknown';
  const match = lessonId.match(/^hsk\d+-l(\d+)-(.+)$/i);

  if (match) {
    return {
      levelDir,
      lessonDir: `l${match[1].padStart(2, '0')}-${match[2].toLowerCase()}`
    };
  }

  return {
    levelDir,
    lessonDir: lessonId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'lesson'
  };
};

export const targetDirForLesson = (rootDir, lesson) => {
  const { levelDir, lessonDir } = targetPartsForLesson(lesson);
  return path.join(rootDir, levelDir, lessonDir);
};

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const walkJsonFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
};

export const readLessonEntry = async (lessonPath, rootDir = path.dirname(lessonPath)) => {
  const rawLesson = JSON.parse(await readFile(lessonPath, 'utf8'));
  const exercisePath = path.join(path.dirname(lessonPath), 'exercises.json');
  const exercisesPayload = await exists(exercisePath)
    ? JSON.parse(await readFile(exercisePath, 'utf8'))
    : null;
  const lesson = mergeLessonParts(rawLesson, exercisesPayload);

  return {
    file: path.relative(rootDir, lessonPath),
    fullPath: lessonPath,
    exercisePath: await exists(exercisePath) ? exercisePath : null,
    lesson
  };
};

export const loadLessonEntries = async (sourceDir, {
  lessonFilterArg = null,
  levelFilterArg = null,
  limitArg = null
} = {}) => {
  const files = (await walkJsonFiles(sourceDir)).sort((a, b) => a.localeCompare(b));
  const lessonFiles = files.filter((file) => path.basename(file) === 'lesson.json' || isLessonJson(file));
  const lessonFilters = lessonFilterArg
    ? lessonFilterArg
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((value) => {
        const escaped = String(value)
          .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${escaped}$`, 'i');
      })
    : [];
  const selected = [];

  for (const lessonPath of lessonFiles) {
    const entry = await readLessonEntry(lessonPath, sourceDir);
    const lessonId = entry.lesson.lesson_id || path.basename(entry.file, '.json');
    const hskLevel = Number(entry.lesson.metadata?.hsk_level || String(lessonId).match(/hsk(\d+)/i)?.[1] || 0);

    if (lessonFilters.length > 0 && !lessonFilters.some((filter) => filter.test(lessonId) || filter.test(entry.file))) {
      continue;
    }

    if (levelFilterArg && hskLevel !== Number(levelFilterArg)) {
      continue;
    }

    selected.push(entry);
  }

  selected.sort((a, b) => String(a.lesson.lesson_id).localeCompare(String(b.lesson.lesson_id)));
  return limitArg ? selected.slice(0, Number(limitArg)) : selected;
};

export const writeLessonEntry = async ({ targetDir, lesson }) => {
  const lessonDir = targetDirForLesson(targetDir, lesson);
  const parts = toLessonParts(lesson);
  await mkdir(lessonDir, { recursive: true });
  await writeFile(path.join(lessonDir, 'lesson.json'), `${JSON.stringify(parts.lesson, null, 2)}\n`, 'utf8');
  await writeFile(path.join(lessonDir, 'exercises.json'), `${JSON.stringify(parts.exercises, null, 2)}\n`, 'utf8');
  return {
    lessonPath: path.join(lessonDir, 'lesson.json'),
    exercisesPath: path.join(lessonDir, 'exercises.json')
  };
};

export const rewriteLessonEntry = async ({ entry, lesson }) => {
  if (path.basename(entry.fullPath) === 'lesson.json') {
    return writeLessonEntry({ targetDir: path.resolve(entry.fullPath, '..', '..', '..'), lesson });
  }

  return writeLessonEntry({ targetDir: path.dirname(entry.fullPath), lesson });
};

export const migrateFlatLessonFile = async ({ sourceDir, filePath, removeSource = true }) => {
  const lesson = JSON.parse(await readFile(filePath, 'utf8'));
  const written = await writeLessonEntry({ targetDir: sourceDir, lesson });
  if (removeSource && path.resolve(filePath) !== path.resolve(written.lessonPath)) {
    await unlink(filePath);
  }
  return {
    lesson_id: lesson.lesson_id,
    from: path.relative(repoRoot, filePath),
    to: path.relative(repoRoot, written.lessonPath)
  };
};
