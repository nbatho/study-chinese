BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS content_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Learner',
  avatar VARCHAR(255) DEFAULT '🐼',
  start_level VARCHAR(20) DEFAULT 'beginner'
    CHECK (start_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
  goal_purpose VARCHAR(20) DEFAULT 'casual'
    CHECK (goal_purpose IN ('travel', 'business', 'hskExam', 'culture', 'family', 'casual')),
  daily_minutes INT NOT NULL DEFAULT 15 CHECK (daily_minutes > 0),
  show_pinyin BOOLEAN NOT NULL DEFAULT true,
  audio_auto_play BOOLEAN NOT NULL DEFAULT true,
  app_appearance VARCHAR(15) NOT NULL DEFAULT 'light'
    CHECK (app_appearance IN ('light', 'dark', 'system')),
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  best_streak INT NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  last_study_date DATE,
  join_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_stats (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  xp INT NOT NULL DEFAULT 0,
  minutes_studied INT NOT NULL DEFAULT 0,
  lessons_completed INT NOT NULL DEFAULT 0,
  words_reviewed INT NOT NULL DEFAULT 0,
  exercises_correct INT NOT NULL DEFAULT 0,
  exercises_total INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date_key),
  CONSTRAINT chk_daily_stats_non_negative CHECK (
    xp >= 0
    AND minutes_studied >= 0
    AND lessons_completed >= 0
    AND words_reviewed >= 0
    AND exercises_correct >= 0
    AND exercises_total >= 0
    AND exercises_correct <= exercises_total
  )
);

CREATE TABLE IF NOT EXISTS words (
  id VARCHAR(50) PRIMARY KEY,
  release_id UUID REFERENCES content_releases(id) ON DELETE SET NULL,
  simplified VARCHAR(100) NOT NULL,
  traditional VARCHAR(100) NOT NULL,
  pinyin VARCHAR(150) NOT NULL,
  pinyin_plain VARCHAR(150) NOT NULL,
  tones SMALLINT[] NOT NULL DEFAULT '{}',
  english TEXT NOT NULL,
  part_of_speech VARCHAR(30) NOT NULL
    CHECK (part_of_speech IN ('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'numeral', 'measure', 'phrase')),
  hsk_level INT NOT NULL DEFAULT 1,
  category VARCHAR(50) NOT NULL,
  search_text TEXT NOT NULL,
  content_version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(50) PRIMARY KEY,
  release_id UUID REFERENCES content_releases(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(150) NOT NULL,
  hsk_level INT NOT NULL DEFAULT 1,
  order_num INT NOT NULL,
  skill VARCHAR(50) NOT NULL,
  estimated_minutes INT NOT NULL DEFAULT 5,
  xp_reward INT NOT NULL DEFAULT 20,
  intro TEXT NOT NULL,
  dialogue JSONB,
  content_version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_words (
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (lesson_id, word_id)
);

CREATE TABLE IF NOT EXISTS grammar_points (
  id VARCHAR(50) PRIMARY KEY,
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  pattern VARCHAR(255) NOT NULL,
  explanation TEXT NOT NULL,
  tips TEXT[] NOT NULL DEFAULT '{}',
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercises (
  id VARCHAR(50) PRIMARY KEY,
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  kind VARCHAR(30) NOT NULL,
  prompt TEXT NOT NULL,
  prompt_hanzi TEXT,
  prompt_pinyin TEXT,
  prompt_english TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INT,
  correct_text TEXT NOT NULL,
  audio_word_id VARCHAR(50) REFERENCES words(id) ON DELETE SET NULL,
  tone INT,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  best_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  attempts INT NOT NULL DEFAULT 0,
  content_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS srs_cards (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  ease_factor DECIMAL(4,2) NOT NULL DEFAULT 2.50,
  interval_days DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  repetitions INT NOT NULL DEFAULT 0,
  due_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  correct_streak INT NOT NULL DEFAULT 0,
  wrong_count INT NOT NULL DEFAULT 0,
  mastery_level VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (mastery_level IN ('new', 'learning', 'young', 'mature', 'mastered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, word_id),
  CONSTRAINT chk_srs_values CHECK (
    ease_factor >= 1.30
    AND ease_factor <= 3.00
    AND interval_days >= 0
    AND repetitions >= 0
    AND correct_streak >= 0
    AND wrong_count >= 0
  )
);

CREATE TABLE IF NOT EXISTS user_favorite_words (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, word_id)
);

CREATE TABLE IF NOT EXISTS custom_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(50) DEFAULT '📗',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_list_words (
  list_id UUID NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (list_id, word_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  emoji VARCHAR(50) NOT NULL,
  target_value INT NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('lessons', 'streak', 'vocabulary', 'xp', 'hsk', 'skill')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  trigger_context JSONB,
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS chat_scenarios (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  emoji VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  init_msg_simplified TEXT NOT NULL,
  init_msg_pinyin TEXT NOT NULL,
  init_msg_english TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id VARCHAR(50) REFERENCES chat_scenarios(id) ON DELETE SET NULL,
  title VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'tutor', 'system')),
  raw_text TEXT NOT NULL,
  normalized_simplified TEXT,
  pinyin TEXT,
  english TEXT,
  correction JSONB,
  model_name VARCHAR(100),
  token_usage JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_phrases (
  id SERIAL PRIMARY KEY,
  simplified VARCHAR(255) UNIQUE NOT NULL,
  pinyin VARCHAR(255) NOT NULL,
  english TEXT NOT NULL,
  note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grammar_library (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  pattern VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  search_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ocr_scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider VARCHAR(50) NOT NULL,
  detected_text TEXT,
  matched_word_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_daily_stats_updated_at ON daily_stats;
CREATE TRIGGER trg_daily_stats_updated_at BEFORE UPDATE ON daily_stats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_words_updated_at ON words;
CREATE TRIGGER trg_words_updated_at BEFORE UPDATE ON words
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_dictionary_entries_updated_at ON dictionary_entries;
CREATE TRIGGER trg_dictionary_entries_updated_at BEFORE UPDATE ON dictionary_entries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_grammar_points_updated_at ON grammar_points;
CREATE TRIGGER trg_grammar_points_updated_at BEFORE UPDATE ON grammar_points
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_exercises_updated_at ON exercises;
CREATE TRIGGER trg_exercises_updated_at BEFORE UPDATE ON exercises
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_lesson_progress_updated_at ON user_lesson_progress;
CREATE TRIGGER trg_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_srs_cards_updated_at ON srs_cards;
CREATE TRIGGER trg_srs_cards_updated_at BEFORE UPDATE ON srs_cards
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_custom_lists_updated_at ON custom_lists;
CREATE TRIGGER trg_custom_lists_updated_at BEFORE UPDATE ON custom_lists
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_chat_scenarios_updated_at ON chat_scenarios;
CREATE TRIGGER trg_chat_scenarios_updated_at BEFORE UPDATE ON chat_scenarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER trg_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_grammar_library_updated_at ON grammar_library;
CREATE TRIGGER trg_grammar_library_updated_at BEFORE UPDATE ON grammar_library
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_mistakes_updated_at ON user_mistakes;
CREATE TRIGGER trg_user_mistakes_updated_at BEFORE UPDATE ON user_mistakes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats (user_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_hsk_order ON lessons (hsk_level, order_num) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_lesson_words_word ON lesson_words (word_id);
CREATE INDEX IF NOT EXISTS idx_grammar_points_lesson_order ON grammar_points (lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_order ON exercises (lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_words_simplified ON words (simplified);
CREATE INDEX IF NOT EXISTS idx_words_traditional ON words (traditional);
CREATE INDEX IF NOT EXISTS idx_words_pinyin_plain ON words (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_words_hsk_category ON words (hsk_level, category);
CREATE INDEX IF NOT EXISTS idx_words_search_trgm ON words USING gin (search_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_simplified ON dictionary_entries (simplified);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_traditional ON dictionary_entries (traditional);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_pinyin_plain ON dictionary_entries (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_search_trgm ON dictionary_entries USING gin (search_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_srs_cards_due ON srs_cards (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user ON custom_lists (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_time ON chat_messages (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ocr_scan_events_user_time ON ocr_scan_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_user_last ON user_mistakes (user_id, last_mistake_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_word ON user_mistakes (word_id);

COMMIT;
