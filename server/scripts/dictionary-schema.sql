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
  search_text TEXT NOT NULL,
  content_version VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, traditional, simplified, pinyin)
);

CREATE INDEX IF NOT EXISTS idx_dictionary_entries_simplified ON dictionary_entries (simplified);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_traditional ON dictionary_entries (traditional);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_pinyin_plain ON dictionary_entries (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_search_trgm ON dictionary_entries USING gin (search_text gin_trgm_ops);
