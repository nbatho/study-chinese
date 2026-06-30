BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS gem_balance INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_tutor_skin VARCHAR(50) NOT NULL DEFAULT 'classic';

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

DROP TRIGGER IF EXISTS trg_shop_items_updated_at ON shop_items;
CREATE TRIGGER trg_shop_items_updated_at BEFORE UPDATE ON shop_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_gem_transactions_user_time ON gem_transactions (user_id, created_at DESC);

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

COMMIT;
