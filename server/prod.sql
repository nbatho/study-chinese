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

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_daily_stats_updated_at ON daily_stats;
CREATE TRIGGER trg_daily_stats_updated_at BEFORE UPDATE ON daily_stats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_words_updated_at ON words;
CREATE TRIGGER trg_words_updated_at BEFORE UPDATE ON words
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
CREATE INDEX IF NOT EXISTS idx_srs_cards_due ON srs_cards (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user ON custom_lists (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_time ON chat_messages (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ocr_scan_events_user_time ON ocr_scan_events (user_id, created_at DESC);

INSERT INTO content_releases (id, version, description, is_active, published_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '2026.06.1',
  'Initial production seed for Study Chinese',
  true,
  now()
)
ON CONFLICT (version)
DO UPDATE SET is_active = EXCLUDED.is_active,
              description = EXCLUDED.description,
              published_at = EXCLUDED.published_at;

INSERT INTO words (
  id, release_id, simplified, traditional, pinyin, pinyin_plain, tones,
  english, part_of_speech, hsk_level, category, search_text
)
VALUES
('wd_hello', '00000000-0000-0000-0000-000000000001', '你好', '你好', 'nǐ hǎo', 'ni hao', ARRAY[3,3]::smallint[], 'hello', 'phrase', 1, 'Greetings', '你好 你好 ni hao hello Greetings'),
('wd_goodbye', '00000000-0000-0000-0000-000000000001', '再见', '再見', 'zài jiàn', 'zai jian', ARRAY[4,4]::smallint[], 'goodbye', 'phrase', 1, 'Greetings', '再见 再見 zai jian goodbye Greetings'),
('wd_thankyou', '00000000-0000-0000-0000-000000000001', '谢谢', '謝謝', 'xiè xiè', 'xie xie', ARRAY[4,4]::smallint[], 'thank you', 'phrase', 1, 'Greetings', '谢谢 謝謝 xie xie thank you Greetings'),
('wd_youre_welcome', '00000000-0000-0000-0000-000000000001', '不客气', '不客氣', 'bú kè qì', 'bu ke qi', ARRAY[2,4,4]::smallint[], 'you''re welcome', 'phrase', 1, 'Greetings', '不客气 不客氣 bu ke qi youre welcome Greetings'),
('wd_sorry', '00000000-0000-0000-0000-000000000001', '对不起', '對不起', 'duì bù qǐ', 'dui bu qi', ARRAY[4,4,3]::smallint[], 'sorry', 'phrase', 1, 'Greetings', '对不起 對不起 dui bu qi sorry Greetings'),
('wd_no_problem', '00000000-0000-0000-0000-000000000001', '没关系', '沒關係', 'méi guān xì', 'mei guan xi', ARRAY[2,1,5]::smallint[], 'it is ok / no problem', 'phrase', 1, 'Greetings', '没关系 沒關係 mei guan xi no problem Greetings'),
('wd_i', '00000000-0000-0000-0000-000000000001', '我', '我', 'wǒ', 'wo', ARRAY[3]::smallint[], 'I / me', 'pronoun', 1, 'General', '我 我 wo I me General'),
('wd_you', '00000000-0000-0000-0000-000000000001', '你', '你', 'nǐ', 'ni', ARRAY[3]::smallint[], 'you', 'pronoun', 1, 'General', '你 你 ni you General'),
('wd_one', '00000000-0000-0000-0000-000000000001', '一', '一', 'yī', 'yi', ARRAY[1]::smallint[], 'one', 'numeral', 1, 'Numbers', '一 一 yi one Numbers'),
('wd_two', '00000000-0000-0000-0000-000000000001', '二', '二', 'èr', 'er', ARRAY[4]::smallint[], 'two', 'numeral', 1, 'Numbers', '二 二 er two Numbers'),
('wd_three', '00000000-0000-0000-0000-000000000001', '三', '三', 'sān', 'san', ARRAY[1]::smallint[], 'three', 'numeral', 1, 'Numbers', '三 三 san three Numbers'),
('wd_four', '00000000-0000-0000-0000-000000000001', '四', '四', 'sì', 'si', ARRAY[4]::smallint[], 'four', 'numeral', 1, 'Numbers', '四 四 si four Numbers'),
('wd_water', '00000000-0000-0000-0000-000000000001', '水', '水', 'shuǐ', 'shui', ARRAY[3]::smallint[], 'water', 'noun', 1, 'Food', '水 水 shui water Food'),
('wd_tea', '00000000-0000-0000-0000-000000000001', '茶', '茶', 'chá', 'cha', ARRAY[2]::smallint[], 'tea', 'noun', 1, 'Food', '茶 茶 cha tea Food'),
('wd_coffee', '00000000-0000-0000-0000-000000000001', '咖啡', '咖啡', 'kā fēi', 'ka fei', ARRAY[1,1]::smallint[], 'coffee', 'noun', 1, 'Food', '咖啡 咖啡 ka fei coffee Food'),
('wd_drink', '00000000-0000-0000-0000-000000000001', '喝', '喝', 'hē', 'he', ARRAY[1]::smallint[], 'to drink', 'verb', 1, 'Food', '喝 喝 he drink Food'),
('wd_eat', '00000000-0000-0000-0000-000000000001', '吃', '吃', 'chī', 'chi', ARRAY[1]::smallint[], 'to eat', 'verb', 1, 'Food', '吃 吃 chi eat Food'),
('wd_china', '00000000-0000-0000-0000-000000000001', '中国', '中國', 'zhōng guó', 'zhong guo', ARRAY[1,2]::smallint[], 'China', 'noun', 1, 'General', '中国 中國 zhong guo China General'),
('wd_station', '00000000-0000-0000-0000-000000000001', '站', '站', 'zhàn', 'zhan', ARRAY[4]::smallint[], 'station / stop', 'noun', 2, 'Transportation', '站 站 zhan station stop Transportation'),
('wd_name', '00000000-0000-0000-0000-000000000001', '名字', '名字', 'míng zi', 'ming zi', ARRAY[2,5]::smallint[], 'name', 'noun', 1, 'General', '名字 名字 ming zi name General'),
('wd_called', '00000000-0000-0000-0000-000000000001', '叫', '叫', 'jiào', 'jiao', ARRAY[4]::smallint[], 'to be called', 'verb', 1, 'General', '叫 叫 jiao called General')
ON CONFLICT (id)
DO UPDATE SET release_id = EXCLUDED.release_id,
              simplified = EXCLUDED.simplified,
              traditional = EXCLUDED.traditional,
              pinyin = EXCLUDED.pinyin,
              pinyin_plain = EXCLUDED.pinyin_plain,
              tones = EXCLUDED.tones,
              english = EXCLUDED.english,
              part_of_speech = EXCLUDED.part_of_speech,
              hsk_level = EXCLUDED.hsk_level,
              category = EXCLUDED.category,
              search_text = EXCLUDED.search_text,
              is_active = true;

INSERT INTO lessons (
  id, release_id, title, subtitle, hsk_level, order_num, skill,
  estimated_minutes, xp_reward, intro, dialogue
)
VALUES
('l1_1', '00000000-0000-0000-0000-000000000001', 'Pinyin Basics', 'Initials & finals', 1, 1, 'pinyin', 7, 20, 'Pinyin uses Roman letters to spell the sounds of Mandarin. Start with common initials and single finals.', NULL),
('l1_2', '00000000-0000-0000-0000-000000000001', 'The Four Tones', 'High, rising, dip, falling', 1, 2, 'tones', 8, 25, 'Mandarin has four tones plus a neutral tone. Tones change word meaning.', NULL),
('l1_3', '00000000-0000-0000-0000-000000000001', 'Greetings', 'Hello & goodbye', 1, 3, 'vocabulary', 6, 20, 'Basic greetings let you start conversations politely.', $${
  "id": "d1_3",
  "title": "Meeting a friend",
  "scenario": "You run into a friend on the street.",
  "lines": [
    {
      "id": "dl1_3_1",
      "speaker": "A",
      "isUser": true,
      "simplified": "你好！",
      "traditional": "你好！",
      "pinyin": "Nǐ hǎo!",
      "english": "Hello!"
    },
    {
      "id": "dl1_3_2",
      "speaker": "B",
      "isUser": false,
      "simplified": "你好！",
      "traditional": "你好！",
      "pinyin": "Nǐ hǎo!",
      "english": "Hello!"
    },
    {
      "id": "dl1_3_3",
      "speaker": "A",
      "isUser": true,
      "simplified": "再见！",
      "traditional": "再見！",
      "pinyin": "Zàijiàn!",
      "english": "Goodbye!"
    }
  ]
}$$::jsonb)
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              subtitle = EXCLUDED.subtitle,
              hsk_level = EXCLUDED.hsk_level,
              order_num = EXCLUDED.order_num,
              skill = EXCLUDED.skill,
              estimated_minutes = EXCLUDED.estimated_minutes,
              xp_reward = EXCLUDED.xp_reward,
              intro = EXCLUDED.intro,
              dialogue = EXCLUDED.dialogue,
              is_active = true;

INSERT INTO lesson_words (lesson_id, word_id, order_num)
VALUES
('l1_1', 'wd_hello', 1),
('l1_1', 'wd_goodbye', 2),
('l1_1', 'wd_i', 3),
('l1_1', 'wd_you', 4),
('l1_2', 'wd_one', 1),
('l1_2', 'wd_two', 2),
('l1_2', 'wd_three', 3),
('l1_2', 'wd_four', 4),
('l1_3', 'wd_hello', 1),
('l1_3', 'wd_goodbye', 2),
('l1_3', 'wd_thankyou', 3),
('l1_3', 'wd_youre_welcome', 4),
('l1_3', 'wd_sorry', 5),
('l1_3', 'wd_no_problem', 6)
ON CONFLICT (lesson_id, word_id)
DO UPDATE SET order_num = EXCLUDED.order_num;

INSERT INTO grammar_points (id, lesson_id, pattern, explanation, tips, examples, order_num)
VALUES
('gp_1_1_1', 'l1_1', 'Initial + Final + Tone', 'Every pinyin syllable combines an optional initial consonant, a final vowel, and a tone mark.', ARRAY['Practice each initial slowly before combining syllables.'], $$[
  {"simplified":"妈","traditional":"媽","pinyin":"mā","english":"mother (1st tone)"},
  {"simplified":"马","traditional":"馬","pinyin":"mǎ","english":"horse (3rd tone)"}
]$$::jsonb, 1),
('gp_1_2_1', 'l1_2', 'Tone contour', '1st tone is high level, 2nd rising, 3rd low dipping, 4th falling, neutral short and light.', ARRAY['Over-emphasize tones while starting out.'], '[]'::jsonb, 1)
ON CONFLICT (id)
DO UPDATE SET lesson_id = EXCLUDED.lesson_id,
              pattern = EXCLUDED.pattern,
              explanation = EXCLUDED.explanation,
              tips = EXCLUDED.tips,
              examples = EXCLUDED.examples,
              order_num = EXCLUDED.order_num;

INSERT INTO exercises (
  id, lesson_id, kind, prompt, prompt_hanzi, options, correct_index,
  correct_text, audio_word_id, tone, order_num
)
VALUES
('e1_1_1', 'l1_1', 'matchPinyin', 'Match 你好 to its pinyin', '你好', '["nǐ hǎo", "nǐ hào", "nǐ háo", "nì hǎo"]'::jsonb, 0, 'nǐ hǎo', 'wd_hello', NULL, 1),
('e1_1_2', 'l1_1', 'multipleChoice', 'Which means hello?', NULL, '["再见", "你好", "谢谢", "对不起"]'::jsonb, 1, '你好', 'wd_hello', NULL, 2),
('e1_2_1', 'l1_2', 'tonePicker', 'Which tone is nǐ?', NULL, '["1st", "2nd", "3rd", "4th"]'::jsonb, 2, '3rd', NULL, 3, 1),
('e1_3_1', 'l1_3', 'multipleChoice', '你好 means...', '你好', '["goodbye", "hello", "sorry", "thank you"]'::jsonb, 1, 'hello', 'wd_hello', NULL, 1),
('e1_3_2', 'l1_3', 'multipleChoice', '再见 means...', '再见', '["hello", "thank you", "goodbye", "please"]'::jsonb, 2, 'goodbye', 'wd_goodbye', NULL, 2)
ON CONFLICT (id)
DO UPDATE SET lesson_id = EXCLUDED.lesson_id,
              kind = EXCLUDED.kind,
              prompt = EXCLUDED.prompt,
              prompt_hanzi = EXCLUDED.prompt_hanzi,
              options = EXCLUDED.options,
              correct_index = EXCLUDED.correct_index,
              correct_text = EXCLUDED.correct_text,
              audio_word_id = EXCLUDED.audio_word_id,
              tone = EXCLUDED.tone,
              order_num = EXCLUDED.order_num;

INSERT INTO achievements (id, title, description, emoji, target_value, category)
VALUES
('first_lesson', 'First Step', 'Complete your first lesson', '👣', 1, 'lessons'),
('streak_3', 'Warming Up', 'Build a 3-day study streak', '🔥', 3, 'streak'),
('tone_master', 'Tone Master', 'Finish a tone lesson with high accuracy', '🎵', 1, 'skill')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              description = EXCLUDED.description,
              emoji = EXCLUDED.emoji,
              target_value = EXCLUDED.target_value,
              category = EXCLUDED.category,
              is_active = true;

INSERT INTO chat_scenarios (
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english
)
VALUES
('general', 'Free Talk', '💬', 'Practice conversational Chinese on any topic with Xiao Hong.', '你好！很高兴认识你。我们今天聊点什么？', 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Wǒmen jīntiān liáo diǎn shénme?', 'Hello! Nice to meet you. What shall we talk about today?'),
('cafe', 'At the Coffee Shop', '☕', 'Practice ordering coffee, tea, and juice in Chinese.', '欢迎光临！请问您要喝点什么？我们有咖啡、茶和果汁。', 'Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme? Wǒmen yǒu kāfēi, chá hé guǒzhī.', 'Welcome! What would you like to drink? We have coffee, tea and juice.'),
('directions', 'Asking Directions', '🧭', 'Practice finding your way around town to the station or airport.', '你好！请问地铁站怎么走？', 'Nǐ hǎo! Qǐngwèn dìtiězhàn zěnme zǒu?', 'Hello! Excuse me, how do I get to the subway station?')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              is_active = true;

INSERT INTO daily_phrases (simplified, pinyin, english, note)
VALUES
('一步一个脚印', 'Yī bù yī gè jiǎo yìn', 'One step at a time.', 'Steady progress is the key to mastery.'),
('加油！', 'Jiā yóu!', 'Keep it up!', 'A common encouragement phrase in Chinese.'),
('熟能生巧', 'Shú néng shēng qiǎo', 'Practice makes perfect.', 'Skill grows from repeated practice.')
ON CONFLICT (simplified)
DO UPDATE SET pinyin = EXCLUDED.pinyin,
              english = EXCLUDED.english,
              note = EXCLUDED.note,
              is_active = true;

INSERT INTO grammar_library (id, title, pattern, summary, examples, search_text)
VALUES
('g_shi', '是 (shì) - to be', 'Subject + 是 + Noun', 'Used to equate a subject with a noun.', '[{"simplified":"我是学生。","pinyin":"Wǒ shì xuéshēng.","english":"I am a student."}]'::jsonb, '是 shi to be Subject Noun'),
('g_ma', '吗 (ma) - yes/no question', 'Statement + 吗?', 'Turns a statement into a yes/no question.', '[{"simplified":"你是学生吗？","pinyin":"Nǐ shì xuéshēng ma?","english":"Are you a student?"}]'::jsonb, '吗 ma yes no question'),
('g_ne', '呢 (ne) - follow-up question', 'Topic + 呢?', 'Asks and you or what about.', '[{"simplified":"我很好，你呢？","pinyin":"Wǒ hěn hǎo, nǐ ne?","english":"I am good, and you?"}]'::jsonb, '呢 ne follow up question')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              pattern = EXCLUDED.pattern,
              summary = EXCLUDED.summary,
              examples = EXCLUDED.examples,
              search_text = EXCLUDED.search_text,
              is_active = true;

COMMIT;
