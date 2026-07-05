import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { synthesizeSpeech } from '../src/services/audio.service.js';
import { resolveContentPath } from '../src/config/content-paths.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limit = Number(args.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || 20);
const outputDir = resolveContentPath(
  args.find((arg) => arg.startsWith('--output='))?.split('=').slice(1).join('='),
  ['audio']
);

const normalizeFilename = (value) => String(value).replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '');

const loadItems = async () => {
  const db = await import('../src/config/db.config.js');

  try {
    const result = await db.query(
      `
        SELECT 'dialogue' AS type, id, lines AS payload
        FROM dialogues
        WHERE is_active = true
          AND audio_full_ref IS NULL
        ORDER BY created_at
        LIMIT $1
      `,
      [limit]
    );

    if (result.rowCount > 0) {
      return result.rows;
    }

    return (await db.query(
      `
        SELECT 'passage' AS type, id, jsonb_build_object('content_zh', content_zh) AS payload
        FROM reading_passages
        WHERE is_active = true
        ORDER BY created_at
        LIMIT $1
      `,
      [limit]
    )).rows;
  } finally {
    await db.closeDB();
  }
};

const textFromPayload = (item) => {
  if (item.type === 'dialogue' && Array.isArray(item.payload)) {
    return item.payload
      .map((line) => line.text_zh || line.zh || line.simplified || '')
      .filter(Boolean)
      .join(' ');
  }

  return item.payload?.content_zh || '';
};

const run = async () => {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
    throw new Error('--limit must be an integer from 1 to 500.');
  }

  const items = await loadItems();
  const planned = [];

  if (!DRY_RUN) {
    await mkdir(outputDir, { recursive: true });
  }

  for (const item of items) {
    const text = textFromPayload(item).trim();

    if (!text) {
      continue;
    }

    const filename = `${item.type}-${normalizeFilename(item.id)}.mp3`;
    const filePath = path.join(outputDir, filename);
    planned.push({ id: item.id, type: item.type, filePath, textLength: text.length });

    if (!DRY_RUN) {
      const audio = await synthesizeSpeech({ text });
      await writeFile(filePath, audio.audio);
    }
  }

  console.log(JSON.stringify({
    dryRun: DRY_RUN,
    outputDir,
    count: planned.length,
    items: planned
  }, null, 2));
};

await run();
