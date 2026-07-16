-- Localized glosses for `daily_phrases`, the third source of shadowing prompts.
--
-- Same shape and rules as word_glosses / dictionary_entry_glosses in
-- 20260715_gloss_locales.sql: `english` on the base table stays the source text,
-- one row per (phrase, locale), and a missing row reads as English.
--
-- Without this the Shadowing tool mixed languages: prompts drawn from `words`
-- could resolve a Vietnamese gloss while prompts drawn from `daily_phrases` had
-- nowhere to store one.
--
-- Apply with:
--   npm --prefix server run db:migrate migrations/20260716_daily_phrase_glosses.sql

CREATE TABLE IF NOT EXISTS daily_phrase_glosses (
  phrase_id INTEGER NOT NULL REFERENCES daily_phrases(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  gloss TEXT NOT NULL,
  source VARCHAR(20) NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (phrase_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_daily_phrase_glosses_locale ON daily_phrase_glosses (locale);
