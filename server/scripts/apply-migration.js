import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const migrationArg = process.argv[2];

if (!migrationArg) {
  console.error('Usage: node scripts/apply-migration.js <migration.sql>');
  process.exitCode = 1;
} else {
  const migrationPath = path.resolve(serverRoot, migrationArg);

  if (!migrationPath.startsWith(serverRoot)) {
    console.error('Migration path must be inside the server directory.');
    process.exitCode = 1;
  } else {
    let closeDB = async () => {};

    try {
      const db = await import('../src/config/db.config.js');
      closeDB = db.closeDB;
      const sql = await readFile(migrationPath, 'utf8');
      await db.query(sql);
      console.log(`Applied migration ${path.relative(serverRoot, migrationPath)}.`);
    } finally {
      await closeDB();
    }
  }
}
