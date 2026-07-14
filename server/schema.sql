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
  role VARCHAR(20) NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  name VARCHAR(100) NOT NULL DEFAULT 'Learner',
  avatar VARCHAR(255) DEFAULT '🐼',
  start_level VARCHAR(20) DEFAULT 'beginner'
    CHECK (start_level IN ('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'mastery')),
  cefr_level VARCHAR(5) DEFAULT 'A1'
    CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  placement_test_completed_at TIMESTAMPTZ,
  placement_test_score INT,
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
  gem_balance INT NOT NULL DEFAULT 0 CHECK (gem_balance >= 0),
  streak_freezes INT NOT NULL DEFAULT 0 CHECK (streak_freezes >= 0),
  premium_expires_at TIMESTAMPTZ,
  ai_tutor_skin VARCHAR(50) NOT NULL DEFAULT 'classic',
  join_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS gem_balance INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_tutor_skin VARCHAR(50) NOT NULL DEFAULT 'classic';
ALTER TABLE users ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE users ADD COLUMN IF NOT EXISTS placement_test_completed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS placement_test_score INT;

CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
  token_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by_token_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
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

CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_low_id UUID GENERATED ALWAYS AS (LEAST(requester_id, addressee_id)) STORED,
  user_high_id UUID GENERATED ALWAYS AS (GREATEST(requester_id, addressee_id)) STORED,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_friendships_distinct_users CHECK (requester_id <> addressee_id),
  CONSTRAINT uq_friendships_user_pair UNIQUE (user_low_id, user_high_id)
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
    CHECK (part_of_speech IN (
      'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'numeral', 'measure', 'phrase',
      'conjunction', 'preposition', 'particle', 'interjection', 'prefix', 'suffix', 'idiom', 'other'
    )),
  hsk_level INT NOT NULL DEFAULT 1,
  cefr_level VARCHAR(5) DEFAULT 'A1'
    CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  category VARCHAR(50) NOT NULL,
  radical VARCHAR(10),
  frequency INT,
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
  cefr_level VARCHAR(5) DEFAULT 'A1'
    CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
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

ALTER TABLE words ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE words ADD COLUMN IF NOT EXISTS radical VARCHAR(10);
ALTER TABLE words ADD COLUMN IF NOT EXISTS frequency INT;
ALTER TABLE words ADD COLUMN IF NOT EXISTS is_variant BOOLEAN DEFAULT false;
ALTER TABLE words ADD COLUMN IF NOT EXISTS level_sources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE words ADD COLUMN IF NOT EXISTS all_forms JSONB DEFAULT '[]'::jsonb;
ALTER TABLE words ADD COLUMN IF NOT EXISTS classifiers TEXT[] DEFAULT '{}';
ALTER TABLE words ADD COLUMN IF NOT EXISTS english_vi TEXT;
ALTER TABLE words DROP CONSTRAINT IF EXISTS words_part_of_speech_check;
ALTER TABLE words ADD CONSTRAINT words_part_of_speech_check
  CHECK (part_of_speech IN (
    'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'numeral', 'measure', 'phrase',
    'conjunction', 'preposition', 'particle', 'interjection', 'prefix', 'suffix', 'idiom', 'other'
  ));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5) DEFAULT 'A1';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS primary_skill VARCHAR(20)
  CHECK (primary_skill IN ('listening', 'speaking', 'reading', 'writing', 'mixed'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS secondary_skills VARCHAR(20)[] DEFAULT '{}';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS topic VARCHAR(50);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS warm_up JSONB;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS review_summary JSONB;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS difficulty_score DECIMAL(3,1) DEFAULT 1.0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_vi VARCHAR(150);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS subtitle_vi VARCHAR(150);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS intro_vi TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS learning_objectives_vi JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS word_topics (
  id VARCHAR(50) PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100),
  emoji VARCHAR(10),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS word_topic_map (
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  topic_id VARCHAR(50) NOT NULL REFERENCES word_topics(id) ON DELETE CASCADE,
  PRIMARY KEY (word_id, topic_id)
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

ALTER TABLE grammar_points ADD COLUMN IF NOT EXISTS hsk_level INT;
ALTER TABLE grammar_points ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5)
  CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
ALTER TABLE grammar_points ADD COLUMN IF NOT EXISTS explanation_vi TEXT;
ALTER TABLE grammar_points ADD COLUMN IF NOT EXISTS tips_vi TEXT[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS exercises (
  id VARCHAR(50) PRIMARY KEY,
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  kind VARCHAR(30) NOT NULL,
  prompt TEXT NOT NULL,
  prompt_hanzi TEXT,
  prompt_pinyin TEXT,
  prompt_english TEXT,
  stimulus JSONB NOT NULL DEFAULT '{}'::jsonb,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INT,
  correct_text TEXT NOT NULL,
  answer_explanation TEXT,
  audio_word_id VARCHAR(50) REFERENCES words(id) ON DELETE SET NULL,
  tone INT,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE exercises ADD COLUMN IF NOT EXISTS skill VARCHAR(20)
  CHECK (skill IN ('listening', 'speaking', 'reading', 'writing', 'mixed'));
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS bloom_level VARCHAR(20)
  CHECK (bloom_level IN ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'));
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS ai_grading_enabled BOOLEAN DEFAULT false;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS acceptable_variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS prompt_vi TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS options_vi JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS correct_text_vi TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS answer_explanation_vi TEXT;

CREATE TABLE IF NOT EXISTS lesson_modules (
  id VARCHAR(80) PRIMARY KEY,
  lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  module_type VARCHAR(20) NOT NULL
    CHECK (module_type IN ('listening', 'speaking', 'reading', 'writing')),
  order_num INT NOT NULL DEFAULT 0,
  phases JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dialogues (
  id VARCHAR(80) PRIMARY KEY,
  lesson_id VARCHAR(50) REFERENCES lessons(id) ON DELETE SET NULL,
  title_zh VARCHAR(200),
  title_en VARCHAR(200),
  hsk_level INT NOT NULL DEFAULT 1,
  topic VARCHAR(50),
  lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  audio_full_ref VARCHAR(255),
  word_count INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE dialogues ADD COLUMN IF NOT EXISTS title_vi VARCHAR(200);

CREATE TABLE IF NOT EXISTS reading_passages (
  id VARCHAR(80) PRIMARY KEY,
  lesson_id VARCHAR(50) REFERENCES lessons(id) ON DELETE SET NULL,
  title_zh VARCHAR(200),
  title_en VARCHAR(200),
  hsk_level INT NOT NULL DEFAULT 1,
  topic VARCHAR(50),
  content_zh TEXT NOT NULL,
  content_pinyin TEXT,
  content_en TEXT,
  word_count INT NOT NULL,
  new_word_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  grammar_point_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reading_passages ADD COLUMN IF NOT EXISTS title_vi VARCHAR(200);
ALTER TABLE reading_passages ADD COLUMN IF NOT EXISTS content_vi TEXT;

CREATE TABLE IF NOT EXISTS content_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(30) NOT NULL
    CHECK (content_type IN ('dialogue', 'passage', 'exercise', 'grammar_explanation', 'lesson')),
  target_lesson_id VARCHAR(50) REFERENCES lessons(id) ON DELETE SET NULL,
  hsk_level INT NOT NULL,
  topic VARCHAR(50),
  skill VARCHAR(20),
  prompt_used TEXT NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  raw_output JSONB NOT NULL,
  validation_result JSONB,
  ai_review_result JSONB,
  human_reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'auto_validated', 'ai_reviewed', 'human_approved', 'rejected')),
  revision_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS gem_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL CHECK (amount <> 0),
  reason VARCHAR(50) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  emoji VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('streak', 'avatar', 'ai_tutor', 'premium')),
  price_gems INT NOT NULL CHECK (price_gems >= 0),
  grant_type VARCHAR(30) NOT NULL CHECK (grant_type IN ('streak_freeze', 'avatar', 'ai_tutor_skin', 'premium_days')),
  grant_quantity INT NOT NULL DEFAULT 1 CHECK (grant_quantity > 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_shop_items (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  equipped_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, item_id)
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

ALTER TABLE chat_scenarios ADD COLUMN IF NOT EXISTS init_msg_vi TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS vietnamese TEXT;

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

ALTER TABLE grammar_library ADD COLUMN IF NOT EXISTS hsk_level INT;
ALTER TABLE grammar_library ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(5)
  CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
ALTER TABLE grammar_library ADD COLUMN IF NOT EXISTS title_vi VARCHAR(150);
ALTER TABLE grammar_library ADD COLUMN IF NOT EXISTS summary_vi TEXT;
ALTER TABLE grammar_library ADD COLUMN IF NOT EXISTS source_lesson_ids JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS practice_minimal_pairs (
  id VARCHAR(50) PRIMARY KEY,
  word_a VARCHAR(100) NOT NULL,
  word_b VARCHAR(100) NOT NULL,
  char_a VARCHAR(20) NOT NULL,
  char_b VARCHAR(20) NOT NULL,
  tone_a INT NOT NULL CHECK (tone_a BETWEEN 1 AND 5),
  tone_b INT NOT NULL CHECK (tone_b BETWEEN 1 AND 5),
  label VARCHAR(150) NOT NULL,
  order_num INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS practice_hanzi_strokes (
  id VARCHAR(50) PRIMARY KEY,
  character VARCHAR(20) NOT NULL,
  strokes TEXT[] NOT NULL DEFAULT '{}',
  order_num INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ocr_scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider VARCHAR(50) NOT NULL,
  title VARCHAR(150),
  note TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  detected_text TEXT,
  matched_word_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ocr_scan_events ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE ocr_scan_events ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE ocr_scan_events ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;

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

CREATE TABLE IF NOT EXISTS course_issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lesson_id VARCHAR(50) REFERENCES lessons(id) ON DELETE SET NULL,
  word_id VARCHAR(50) REFERENCES words(id) ON DELETE SET NULL,
  exercise_id VARCHAR(50),
  category VARCHAR(30) NOT NULL DEFAULT 'content'
    CHECK (category IN ('content', 'translation', 'audio', 'exercise', 'technical', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  message TEXT NOT NULL,
  admin_note TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_daily_stats_updated_at ON daily_stats;
CREATE TRIGGER trg_daily_stats_updated_at BEFORE UPDATE ON daily_stats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_friendships_updated_at ON friendships;
CREATE TRIGGER trg_friendships_updated_at BEFORE UPDATE ON friendships
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

DROP TRIGGER IF EXISTS trg_lesson_modules_updated_at ON lesson_modules;
CREATE TRIGGER trg_lesson_modules_updated_at BEFORE UPDATE ON lesson_modules
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_dialogues_updated_at ON dialogues;
CREATE TRIGGER trg_dialogues_updated_at BEFORE UPDATE ON dialogues
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reading_passages_updated_at ON reading_passages;
CREATE TRIGGER trg_reading_passages_updated_at BEFORE UPDATE ON reading_passages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_content_generation_logs_updated_at ON content_generation_logs;
CREATE TRIGGER trg_content_generation_logs_updated_at BEFORE UPDATE ON content_generation_logs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_placement_questions_updated_at ON placement_questions;
CREATE TRIGGER trg_placement_questions_updated_at BEFORE UPDATE ON placement_questions
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

DROP TRIGGER IF EXISTS trg_shop_items_updated_at ON shop_items;
CREATE TRIGGER trg_shop_items_updated_at BEFORE UPDATE ON shop_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_gem_transactions_user_time ON gem_transactions (user_id, created_at DESC);

INSERT INTO word_topics (id, name_en, name_zh, emoji, display_order, is_active)
VALUES
  ('greetings', 'Greetings', NULL, U&'\+01F44B', 10, true),
  ('numbers', 'Numbers', NULL, U&'\+01F522', 20, true),
  ('food', 'Food & Drink', NULL, U&'\+01F35C', 30, true),
  ('family', 'Family', NULL, U&'\+01F46A', 40, true),
  ('body', 'Body & Health', NULL, U&'\+01F3E5', 50, true),
  ('time', 'Time & Date', NULL, U&'\23F0', 60, true),
  ('weather', 'Weather', NULL, U&'\2601', 70, true),
  ('colors', 'Colors', NULL, U&'\+01F3A8', 80, true),
  ('animals', 'Animals', NULL, U&'\+01F43C', 90, true),
  ('clothing', 'Clothing', NULL, U&'\+01F454', 100, true),
  ('transportation', 'Transportation', NULL, U&'\+01F687', 110, true),
  ('shopping', 'Shopping', NULL, U&'\+01F6D2', 120, true),
  ('education', 'Education', NULL, U&'\+01F4DA', 130, true),
  ('work', 'Work & Career', NULL, U&'\+01F4BC', 140, true),
  ('travel', 'Travel', NULL, U&'\2708', 150, true),
  ('nature', 'Nature', NULL, U&'\+01F33F', 160, true),
  ('technology', 'Technology', NULL, U&'\+01F4BB', 170, true),
  ('sports', 'Sports', NULL, U&'\26BD', 180, true),
  ('emotions', 'Emotions', NULL, U&'\+01F496', 190, true),
  ('home', 'Home & Living', NULL, U&'\+01F3E0', 200, true),
  ('geography', 'Geography', NULL, U&'\+01F30D', 210, true),
  ('culture', 'Culture', NULL, U&'\+01F3EE', 220, true),
  ('business', 'Business', NULL, U&'\+01F4CA', 230, true),
  ('general', 'General', NULL, U&'\+01F4DD', 240, true)
ON CONFLICT (id)
DO UPDATE SET
  name_en = EXCLUDED.name_en,
  emoji = EXCLUDED.emoji,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

INSERT INTO shop_items (id, name, description, emoji, category, price_gems, grant_type, grant_quantity, metadata)
VALUES
  ('streak_freeze_1', 'Streak Freeze', 'Bao ve chuoi ngay hoc neu ban bo lo 1 ngay.', '🧊', 'streak', 60, 'streak_freeze', 1, '{"label":"1 freeze"}'::jsonb),
  ('premium_30_days', 'Premium 30 ngay', 'Mo gioi han AI Tutor trong 30 ngay. Hien mua bang Gems, chua ket noi thanh toan.', '👑', 'premium', 500, 'premium_days', 30, '{"aiDailyLimit":null}'::jsonb),
  ('avatar_panda', 'Avatar Panda', 'Doi avatar thanh panda hoc tieng Trung.', '🐼', 'avatar', 120, 'avatar', 1, '{"avatar":"🐼"}'::jsonb),
  ('avatar_dragon', 'Avatar Rong', 'Doi avatar thanh rong do may man.', '🐉', 'avatar', 180, 'avatar', 1, '{"avatar":"🐉"}'::jsonb),
  ('ai_skin_scholar', 'AI Tutor Scholar', 'Trang bi phong cach hoc gia cho AI Tutor.', '🎓', 'ai_tutor', 220, 'ai_tutor_skin', 1, '{"skin":"scholar","label":"Scholar"}'::jsonb),
  ('ai_skin_chef', 'AI Tutor Chef', 'Trang bi phong cach nha hang de luyen hoi thoai an uong.', '🥟', 'ai_tutor', 220, 'ai_tutor_skin', 1, '{"skin":"chef","label":"Chef"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  emoji = EXCLUDED.emoji,
  category = EXCLUDED.category,
  price_gems = EXCLUDED.price_gems,
  grant_type = EXCLUDED.grant_type,
  grant_quantity = EXCLUDED.grant_quantity,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = now();

DROP TRIGGER IF EXISTS trg_grammar_library_updated_at ON grammar_library;
CREATE TRIGGER trg_grammar_library_updated_at BEFORE UPDATE ON grammar_library
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_practice_minimal_pairs_updated_at ON practice_minimal_pairs;
CREATE TRIGGER trg_practice_minimal_pairs_updated_at BEFORE UPDATE ON practice_minimal_pairs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_practice_hanzi_strokes_updated_at ON practice_hanzi_strokes;
CREATE TRIGGER trg_practice_hanzi_strokes_updated_at BEFORE UPDATE ON practice_hanzi_strokes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_mistakes_updated_at ON user_mistakes;
CREATE TRIGGER trg_user_mistakes_updated_at BEFORE UPDATE ON user_mistakes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_course_issue_reports_updated_at ON course_issue_reports;
CREATE TRIGGER trg_course_issue_reports_updated_at BEFORE UPDATE ON course_issue_reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
CREATE INDEX IF NOT EXISTS idx_auth_refresh_tokens_user ON auth_refresh_tokens (user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_refresh_tokens_active ON auth_refresh_tokens (token_id, token_hash) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats (user_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_xp ON daily_stats (user_id) INCLUDE (xp, date_key);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date_user_xp ON daily_stats (date_key DESC, user_id) INCLUDE (xp);
CREATE INDEX IF NOT EXISTS idx_friendships_requester_status ON friendships (requester_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee_status ON friendships (addressee_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_pair_status ON friendships (user_low_id, user_high_id, status);
CREATE INDEX IF NOT EXISTS idx_lessons_hsk_order ON lessons (hsk_level, order_num) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_lessons_cefr_order ON lessons (cefr_level, hsk_level, order_num) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_lessons_skill_topic ON lessons (primary_skill, topic, hsk_level) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_placement_questions_order ON placement_questions (section, difficulty, order_num) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_lesson_words_word ON lesson_words (word_id);
CREATE INDEX IF NOT EXISTS idx_grammar_points_lesson_order ON grammar_points (lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_grammar_points_level ON grammar_points (hsk_level, cefr_level, lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_order ON exercises (lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_lesson_modules_lesson ON lesson_modules (lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_dialogues_lesson ON dialogues (lesson_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_dialogues_hsk_topic ON dialogues (hsk_level, topic) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_reading_passages_lesson ON reading_passages (lesson_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_reading_passages_hsk_topic ON reading_passages (hsk_level, topic) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_content_generation_logs_target ON content_generation_logs (target_lesson_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_generation_logs_status ON content_generation_logs (status, hsk_level, skill);
CREATE INDEX IF NOT EXISTS idx_words_simplified ON words (simplified);
CREATE INDEX IF NOT EXISTS idx_words_traditional ON words (traditional);
CREATE INDEX IF NOT EXISTS idx_words_pinyin_plain ON words (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_words_hsk_category ON words (hsk_level, category);
CREATE INDEX IF NOT EXISTS idx_words_cefr ON words (cefr_level) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_words_radical ON words (radical) WHERE is_active = true AND radical IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_words_frequency ON words (frequency) WHERE is_active = true AND frequency IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_words_variant ON words (is_variant) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_words_search_trgm ON words USING gin (search_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_word_topic_map_topic ON word_topic_map (topic_id, word_id);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_simplified ON dictionary_entries (simplified);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_traditional ON dictionary_entries (traditional);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_pinyin_plain ON dictionary_entries (pinyin_plain);
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_search_trgm ON dictionary_entries USING gin (search_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_srs_cards_due ON srs_cards (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user ON custom_lists (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_time ON chat_messages (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ocr_scan_events_user_time ON ocr_scan_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ocr_scan_events_user_favorite ON ocr_scan_events (user_id, is_favorite, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_user_last ON user_mistakes (user_id, last_mistake_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_word ON user_mistakes (word_id);
CREATE INDEX IF NOT EXISTS idx_course_issue_reports_status_created ON course_issue_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_issue_reports_lesson ON course_issue_reports (lesson_id);
CREATE INDEX IF NOT EXISTS idx_practice_minimal_pairs_order ON practice_minimal_pairs (order_num, id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_practice_hanzi_strokes_order ON practice_hanzi_strokes (order_num, id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_grammar_library_level ON grammar_library (hsk_level, cefr_level) WHERE is_active = true;

COMMIT;
