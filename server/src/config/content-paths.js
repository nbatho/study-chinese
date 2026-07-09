import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));

export const serverRoot = path.resolve(configDir, '..', '..');
export const repoRoot = path.resolve(serverRoot, '..');
export const contentRoot = process.env.CONTENT_ROOT
  ? path.resolve(process.env.CONTENT_ROOT)
  : path.join(repoRoot, 'data');

export const contentPath = (...segments) => path.join(contentRoot, ...segments);

export const resolveContentPath = (value, fallbackSegments = []) => {
  if (!value) {
    return contentPath(...fallbackSegments);
  }

  if (path.isAbsolute(value)) {
    return value;
  }

  const normalized = value.replaceAll('\\', '/');
  if (normalized === 'data' || normalized.startsWith('data/')) {
    return path.resolve(repoRoot, value);
  }

  return path.resolve(contentRoot, value);
};

export const resolveExistingPath = async (value, fallbackSegments = []) => {
  if (!value) {
    return contentPath(...fallbackSegments);
  }

  if (path.isAbsolute(value)) {
    return value;
  }

  const candidates = [
    path.resolve(process.cwd(), value),
    path.resolve(repoRoot, value),
    path.resolve(serverRoot, value),
    path.resolve(contentRoot, value)
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next likely base directory.
    }
  }

  return candidates[0];
};

export const findLessonFiles = async (dir, condition = () => true) => {
  const { readdir, stat } = await import('node:fs/promises');
  let results = [];
  try {
    const list = await readdir(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const statObj = await stat(fullPath);
      if (statObj.isDirectory()) {
        const subFiles = await findLessonFiles(fullPath, condition);
        results = results.concat(subFiles);
      } else {
        if (condition(file)) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  return results;
};
