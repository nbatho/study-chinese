-- Normalizes the rows where English and Vietnamese were mixed inside the same
-- base column, found by the 2026-07-16 data-language audit.
--
-- Convention everywhere else in the schema: base text columns hold English;
-- Vietnamese lives in `_vi` columns or per-locale gloss tables, and the client
-- localizes `shop_items` / `chat_scenarios` through i18n keys keyed by row id
-- (GetItemText.tsx, chatScenarios.ts), so the DB text is only the fallback.
-- Three chat scenarios and six shop items predated that convention and carried
-- Vietnamese (some of it without diacritics) in the base columns. The English
-- below mirrors the client's `en` translations so fallback and i18n agree.
--
-- Apply with:
--   npm --prefix server run db:migrate migrations/20260716_normalize_mixed_en_vi_text.sql

UPDATE shop_items SET name = 'Streak Freeze',    description = 'Protect your study streak if you miss one day.' WHERE id = 'streak_freeze_1';
UPDATE shop_items SET name = 'Premium 30 days',  description = 'Remove the AI Tutor daily message limit for 30 days. Purchased with Gems for now.' WHERE id = 'premium_30_days';
UPDATE shop_items SET name = 'Panda Avatar',     description = 'Change your avatar to a Chinese-learning panda.' WHERE id = 'avatar_panda';
UPDATE shop_items SET name = 'Dragon Avatar',    description = 'Change your avatar to a lucky red dragon.' WHERE id = 'avatar_dragon';
UPDATE shop_items SET name = 'AI Tutor Scholar', description = 'Give your AI Tutor a scholar style.' WHERE id = 'ai_skin_scholar';
UPDATE shop_items SET name = 'AI Tutor Chef',    description = 'Give your AI Tutor a restaurant-practice style.' WHERE id = 'ai_skin_chef';

UPDATE chat_scenarios SET title = 'Review Your Last Lesson',   description = 'Practice a conversation built around your most recent lesson.' WHERE id = 'personal-lesson';
UPDATE chat_scenarios SET title = 'Practice Your Saved Words', description = 'The AI Tutor favours vocabulary from the lists you saved recently.' WHERE id = 'personal-list';
UPDATE chat_scenarios SET title = 'Practice Your Weak Spots',  description = 'A conversation using the words and skills you often get wrong.' WHERE id = 'personal-weak';

-- 嘿 (hēi): the vi gloss was the English word "hey" verbatim. The other three
-- English-identical glosses (taxi, video, sushi) are genuine Vietnamese
-- loanwords; mark them human so the AI backfill scripts never rewrite them.
UPDATE word_glosses SET gloss = 'này; ê (thán từ gọi chú ý)', source = 'human'
WHERE word_id = 'hsk_7_82113efcf58ada7e' AND locale = 'vi';

UPDATE word_glosses SET source = 'human'
WHERE locale = 'vi' AND word_id IN ('wd_taxi', 'hsk_5_fa4e33b698532341', 'hsk_5_134f0f0ba835a404');
