import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const { closeDB, query } = await import('../src/config/db.config.js');

const runSqlFile = async (filename) => {
  const sqlPath = path.join(serverRoot, filename);
  const sql = await readFile(sqlPath, 'utf8');
  await query(sql);
  console.log(`Applied server/${filename}.`);
};

try {
  await runSqlFile('schema.sql');

  if (process.env.SKIP_MOCK_DATA === 'true') {
    console.log('Skipped data import because SKIP_MOCK_DATA=true.');
  } else {
    // Run the new data importer that loads localized data from the data/ directory
    const { execSync } = await import('node:child_process');
    console.log('Importing full localized data from data/ directory...');
    execSync('node scripts/import_data.cjs', { cwd: serverRoot, stdio: 'inherit' });
  }

  console.log('Database initialized.');
} finally {
  await closeDB();
}
