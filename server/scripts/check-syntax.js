import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();
const includeDirs = ['src', 'test'];

const listJavaScriptFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return listJavaScriptFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
    })
  );

  return files.flat();
};

const checkFile = (filePath) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--check', filePath], {
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Syntax check failed for ${path.relative(rootDir, filePath)}`));
    });
  });

const existingDirs = [];
for (const dir of includeDirs) {
  try {
    await readdir(path.join(rootDir, dir));
    existingDirs.push(path.join(rootDir, dir));
  } catch {
    // Optional folder.
  }
}

const files = (await Promise.all(existingDirs.map(listJavaScriptFiles))).flat();
await Promise.all(files.map(checkFile));
