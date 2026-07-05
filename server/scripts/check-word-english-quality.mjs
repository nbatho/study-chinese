import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });
const { closeDB, query } = await import('../src/config/db.config.js');

const sql = `
  SELECT id, simplified, pinyin, english, length(english) AS len
  FROM words
  WHERE is_active = true
    AND (
      length(english) > 100
      OR english LIKE '%;%'
      OR english LIKE '%(used %'
      OR english ILIKE '%particle%'
    )
  ORDER BY length(english) DESC
  LIMIT 50
`;

try {
  const result = await query(sql);
  console.log(`Found ${result.rowCount} suspicious word definitions.`);
  console.table(
    result.rows.map((row) => ({
      id: row.id,
      simplified: row.simplified,
      pinyin: row.pinyin,
      len: row.len,
      english:
        row.english.length > 100
          ? `${row.english.slice(0, 100)}...`
          : row.english,
    })),
  );
} finally {
  await closeDB();
}
