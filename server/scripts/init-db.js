import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { closeDB, query } from '../src/config/db.config.js';

const schemaPath = path.join(process.cwd(), 'prod.sql');
const sql = await readFile(schemaPath, 'utf8');

try {
  await query(sql);
  console.log('Database initialized from server/prod.sql.');
} finally {
  await closeDB();
}
