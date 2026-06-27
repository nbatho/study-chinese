BEGIN;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

DROP TRIGGER IF EXISTS trg_practice_minimal_pairs_updated_at ON practice_minimal_pairs;
CREATE TRIGGER trg_practice_minimal_pairs_updated_at BEFORE UPDATE ON practice_minimal_pairs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_practice_hanzi_strokes_updated_at ON practice_hanzi_strokes;
CREATE TRIGGER trg_practice_hanzi_strokes_updated_at BEFORE UPDATE ON practice_hanzi_strokes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_practice_minimal_pairs_order
ON practice_minimal_pairs (order_num, id)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_practice_hanzi_strokes_order
ON practice_hanzi_strokes (order_num, id)
WHERE is_active = true;

INSERT INTO chat_scenarios (
  id, title, emoji, description, init_msg_simplified, init_msg_pinyin, init_msg_english
)
VALUES
('personal-weak', 'Luyen diem yeu', U&'\+01F3AF', 'Hoi thoai dung cac tu va ky nang ban hay sai.', '我们来练习你的难点吧。', 'Wǒmen lái liànxí nǐ de nándiǎn ba.', 'Let us practice your weak spots.'),
('personal-list', 'Luyen tu trong list', U&'\+01F4CB', 'AI Tutor uu tien tu vung trong danh sach ban luu gan day.', '请用你保存的词说一句话。', 'Qǐng yòng nǐ bǎocún de cí shuō yí jù huà.', 'Please make a sentence with a word you saved.'),
('personal-lesson', 'On bai vua hoc', U&'\+01F9E0', 'Luyen hoi thoai xoay quanh bai hoc gan nhat.', '我们复习你刚学的内容。', 'Wǒmen fùxí nǐ gāng xué de nèiróng.', 'Let us review what you just learned.')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              emoji = EXCLUDED.emoji,
              description = EXCLUDED.description,
              init_msg_simplified = EXCLUDED.init_msg_simplified,
              init_msg_pinyin = EXCLUDED.init_msg_pinyin,
              init_msg_english = EXCLUDED.init_msg_english,
              is_active = true;

INSERT INTO practice_minimal_pairs (
  id, word_a, word_b, char_a, char_b, tone_a, tone_b, label, order_num
)
VALUES
('ma-1-3', 'mā', 'mǎ', '妈', '马', 1, 3, 'mother vs horse', 10),
('ma-1-2', 'mā', 'má', '妈', '麻', 1, 2, 'mother vs hemp', 20),
('ma-1-4', 'mā', 'mà', '妈', '骂', 1, 4, 'mother vs scold', 30),
('shu-1-3', 'shū', 'shǔ', '书', '鼠', 1, 3, 'book vs mouse', 40),
('cha-2-4', 'chá', 'chà', '茶', '差', 2, 4, 'tea vs poor', 50),
('mai-3-4', 'mǎi', 'mài', '买', '卖', 3, 4, 'buy vs sell', 60)
ON CONFLICT (id)
DO UPDATE SET word_a = EXCLUDED.word_a,
              word_b = EXCLUDED.word_b,
              char_a = EXCLUDED.char_a,
              char_b = EXCLUDED.char_b,
              tone_a = EXCLUDED.tone_a,
              tone_b = EXCLUDED.tone_b,
              label = EXCLUDED.label,
              order_num = EXCLUDED.order_num,
              is_active = true;

INSERT INTO practice_hanzi_strokes (id, character, strokes, order_num)
VALUES
('ren', '人', ARRAY['M50,20 L20,80', 'M50,20 L80,80'], 10),
('da', '大', ARRAY['M15,35 L85,35', 'M50,20 L25,80', 'M50,35 L80,80'], 20),
('zhong', '中', ARRAY['M25,20 L25,70', 'M75,20 L75,70', 'M25,20 L75,20', 'M50,10 L50,90'], 30),
('guo', '国', ARRAY['M15,10 L15,90', 'M85,10 L85,90', 'M15,10 L85,10', 'M15,90 L85,90', 'M35,30 L65,30', 'M35,50 L65,50', 'M35,70 L65,70', 'M50,25 L50,75'], 40),
('hao', '好', ARRAY['M30,20 L20,60', 'M20,60 L40,65', 'M20,45 L40,45', 'M60,20 L60,70', 'M55,35 L75,35', 'M55,55 L75,55'], 50),
('shui', '水', ARRAY['M50,15 L50,85', 'M30,35 L20,75', 'M25,55 L35,65', 'M50,55 L75,35', 'M50,55 L80,80'], 60),
('huo', '火', ARRAY['M30,25 L20,50', 'M70,25 L80,50', 'M50,15 L30,85', 'M50,15 L70,85'], 70),
('shan', '山', ARRAY['M15,85 L15,50', 'M50,85 L50,25', 'M85,85 L85,50', 'M15,85 L85,85'], 80),
('kou', '口', ARRAY['M25,20 L25,80', 'M75,20 L75,80', 'M25,20 L75,20', 'M25,80 L75,80'], 90)
ON CONFLICT (id)
DO UPDATE SET character = EXCLUDED.character,
              strokes = EXCLUDED.strokes,
              order_num = EXCLUDED.order_num,
              is_active = true;

COMMIT;
