-- Adds the localized usage note to `daily_phrase_glosses`.
--
-- `daily_phrases.note` is an English usage tip ("A common encouragement phrase
-- in Chinese."), not a translation -- but the Phrase of the Day card read it as
-- the Vietnamese one, so a `vi` reader got English prose under a Vietnamese
-- heading and an `en` reader got the English meaning printed twice.
--
-- `gloss` translates `daily_phrases.english`; `note` translates
-- `daily_phrases.note` and stays nullable because not every phrase carries one.
-- A missing row (or a NULL note) reads as English, same as its siblings.
--
-- Apply with:
--   npm --prefix server run db:migrate migrations/20260716_daily_phrase_gloss_notes.sql

ALTER TABLE daily_phrase_glosses ADD COLUMN IF NOT EXISTS note TEXT;
