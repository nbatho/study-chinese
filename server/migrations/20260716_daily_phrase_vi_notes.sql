-- Hand-written `vi` glosses and notes for the three active daily phrases.
--
-- Keyed on `simplified` (UNIQUE on daily_phrases) rather than on the serial id,
-- which is not stable across environments.
--
-- Written by hand, not by the gloss AI: at three rows the model round-trip buys
-- nothing, and two of these are idioms where the useful Vietnamese is the
-- matching proverb rather than a literal translation of the English -- 熟能生巧
-- is "Trăm hay không bằng tay quen", not a gloss of "Practice makes perfect".
-- `source = 'human'` keeps translate-phrase-glosses.mjs from overwriting them
-- on a --force run.
--
-- `en` needs no rows here: an absent gloss reads through to daily_phrases.english
-- and daily_phrases.note, which are already the English source text.
--
-- Apply with:
--   npm --prefix server run db:migrate migrations/20260716_daily_phrase_vi_notes.sql

INSERT INTO daily_phrase_glosses (phrase_id, locale, gloss, note, source)
SELECT dp.id, 'vi', v.gloss, v.note, 'human'
FROM daily_phrases dp
JOIN (VALUES
  (
    '一步一个脚印',
    'Đi từng bước một, mỗi bước đều chắc chắn.',
    'Tiến bộ đều đặn là chìa khoá để thành thạo.'
  ),
  (
    '加油！',
    'Cố lên!',
    'Câu động viên rất thông dụng trong tiếng Trung.'
  ),
  (
    '熟能生巧',
    'Trăm hay không bằng tay quen.',
    'Kỹ năng thành thạo đến từ việc luyện tập lặp đi lặp lại.'
  )
) AS v(simplified, gloss, note) ON v.simplified = dp.simplified
ON CONFLICT (phrase_id, locale)
DO UPDATE SET
  gloss = EXCLUDED.gloss,
  note = EXCLUDED.note,
  source = EXCLUDED.source,
  updated_at = now();
