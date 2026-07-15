-- Localized glosses, one row per (entry, locale). `english` on the base tables
-- stays the source text these are translated from; adding a UI language means
-- inserting rows here rather than adding an `english_<lang>` column.
--
-- Mirrors the definitions in schema.sql. Apply with:
--   npm --prefix server run db:migrate migrations/20260715_gloss_locales.sql

CREATE TABLE IF NOT EXISTS word_glosses (
  word_id VARCHAR(50) NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  gloss TEXT NOT NULL,
  source VARCHAR(20) NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (word_id, locale)
);

CREATE TABLE IF NOT EXISTS dictionary_entry_glosses (
  entry_id UUID NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  gloss TEXT NOT NULL,
  source VARCHAR(20) NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (entry_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_word_glosses_locale ON word_glosses (locale);
CREATE INDEX IF NOT EXISTS idx_dictionary_entry_glosses_locale ON dictionary_entry_glosses (locale);

-- Backfill the Vietnamese glosses that predate these tables. `english_vi` is the
-- legacy home for them and is still written by mock-data.sql, so this only fills
-- gaps and never overwrites a newer AI-generated gloss.
--
-- `english_vi` is guarded rather than assumed: it reached the two tables at
-- different times, so a database can legitimately have it on one and not the
-- other. Referencing a missing column would abort the whole migration, and
-- there is nothing to copy when it is absent.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'english_vi'
  ) THEN
    INSERT INTO word_glosses (word_id, locale, gloss, source)
    SELECT id, 'vi', english_vi, 'legacy'
    FROM words
    WHERE english_vi IS NOT NULL AND english_vi <> ''
    ON CONFLICT (word_id, locale) DO NOTHING;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dictionary_entries' AND column_name = 'english_vi'
  ) THEN
    INSERT INTO dictionary_entry_glosses (entry_id, locale, gloss, source)
    SELECT id, 'vi', english_vi, 'legacy'
    FROM dictionary_entries
    WHERE english_vi IS NOT NULL AND english_vi <> ''
    ON CONFLICT (entry_id, locale) DO NOTHING;
  END IF;
END $$;
