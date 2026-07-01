BEGIN;

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'users'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%start_level%'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE users
  ADD CONSTRAINT users_start_level_check
  CHECK (start_level IN ('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'mastery'));

ALTER TABLE users ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE users ADD COLUMN IF NOT EXISTS placement_test_completed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS placement_test_score INT;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_cefr_level_check;
ALTER TABLE users
  ADD CONSTRAINT users_cefr_level_check
  CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_cefr_level_check;
ALTER TABLE lessons
  ADD CONSTRAINT lessons_cefr_level_check
  CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));

ALTER TABLE words ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE words DROP CONSTRAINT IF EXISTS words_cefr_level_check;
ALTER TABLE words
  ADD CONSTRAINT words_cefr_level_check
  CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));

CREATE TABLE IF NOT EXISTS placement_questions (
  id VARCHAR(50) PRIMARY KEY,
  section VARCHAR(30) NOT NULL CHECK (section IN ('vocabulary', 'grammar', 'reading')),
  cefr_level VARCHAR(5) NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  prompt TEXT NOT NULL,
  prompt_hanzi TEXT,
  prompt_pinyin TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INT NOT NULL,
  correct_text TEXT NOT NULL,
  explanation TEXT,
  difficulty INT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 6),
  order_num INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_placement_questions_updated_at ON placement_questions;
CREATE TRIGGER trg_placement_questions_updated_at BEFORE UPDATE ON placement_questions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_lessons_cefr_order ON lessons (cefr_level, hsk_level, order_num) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_placement_questions_order ON placement_questions (section, difficulty, order_num) WHERE is_active = true;

COMMIT;
