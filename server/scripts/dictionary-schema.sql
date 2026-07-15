CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS dictionary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL DEFAULT 'cc-cedict',
  traditional VARCHAR(100) NOT NULL,
  simplified VARCHAR(100) NOT NULL,
  pinyin VARCHAR(200) NOT NULL,
  pinyin_plain VARCHAR(200) NOT NULL,
  english TEXT NOT NULL,
  english_vi TEXT,
  search_text TEXT NOT NULL,
  content_version VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, traditional, simplified, pinyin)
);

ALTER TABLE dictionary_entries ADD COLUMN IF NOT EXISTS english_vi TEXT;

-- Localized glosses, one row per (entry, locale). Mirrors the definition in
-- schema.sql; adding a UI language means inserting rows here rather than adding
-- an `english_<lang>` column. Populate with:
--   node server/scripts/translate-dictionary-glosses.mjs --locale=<lang>
CREATE TABLE IF NOT EXISTS dictionary_entry_glosses (
  entry_id UUID NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  gloss TEXT NOT NULL,
  source VARCHAR(20) NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (entry_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_dictionary_entry_glosses_locale ON dictionary_entry_glosses (locale);

INSERT INTO dictionary_entry_glosses (entry_id, locale, gloss, source)
SELECT id, 'vi', english_vi, 'legacy'
FROM dictionary_entries
WHERE english_vi IS NOT NULL AND english_vi <> ''
ON CONFLICT (entry_id, locale) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_dictionary_entries_simplified ON dictionary_entries (simplified);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_traditional ON dictionary_entries (traditional);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_pinyin_plain ON dictionary_entries (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_search_trgm ON dictionary_entries USING gin (search_text gin_trgm_ops);
