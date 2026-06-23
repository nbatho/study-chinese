BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS user_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mistake_key VARCHAR(120) NOT NULL,
  word_id VARCHAR(50) REFERENCES words(id) ON DELETE SET NULL,
  skill VARCHAR(50) NOT NULL,
  prompt TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  simplified VARCHAR(100),
  pinyin VARCHAR(150),
  english TEXT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  mistake_count INT NOT NULL DEFAULT 1 CHECK (mistake_count >= 0),
  resolved_count INT NOT NULL DEFAULT 0 CHECK (resolved_count >= 0),
  last_mistake_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, mistake_key, skill),
  CONSTRAINT chk_user_mistakes_resolved CHECK (resolved_count <= mistake_count)
);

DROP TRIGGER IF EXISTS trg_user_mistakes_updated_at ON user_mistakes;
CREATE TRIGGER trg_user_mistakes_updated_at BEFORE UPDATE ON user_mistakes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_user_mistakes_user_last
ON user_mistakes (user_id, last_mistake_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_mistakes_word
ON user_mistakes (word_id);

COMMIT;
