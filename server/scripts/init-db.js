import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDB, query } from '../src/config/db.config.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const runSqlFile = async (filename) => {
  const sqlPath = path.join(serverRoot, filename);
  const sql = await readFile(sqlPath, 'utf8');
  await query(sql);
  console.log(`Applied server/${filename}.`);
};

try {
  await runSqlFile('schema.sql');

  if (process.env.SKIP_MOCK_DATA === 'true') {
    console.log('Skipped server/mock-data.sql because SKIP_MOCK_DATA=true.');
  } else {
    await runSqlFile('mock-data.sql');
  }

  console.log('Database initialized.');
} finally {
  await closeDB();
}
