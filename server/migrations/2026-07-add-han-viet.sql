-- Adds the Sino-Vietnamese (âm Hán-Việt) reading column to the words table.
-- Populate it afterwards with: npm run content:hanviet:seed
ALTER TABLE words ADD COLUMN IF NOT EXISTS han_viet VARCHAR(150);
