# Content authoring tools

Used to build the HSK0 pronunciation bundles (Đợt 0), the HSK3 rewrite (Đợt 2) and the
HSK4–6 rewrite (Đợt 3–5, now complete). Run them from the repo root:

```bash
node server/scripts/content/build-lessons.mjs   server/scripts/content/hsk3-a.mjs  # HSK1-3 spec
node server/scripts/content/build-lessons46.mjs server/scripts/content/hsk4-a.mjs  # HSK4-6 spec
node server/scripts/content/check-scope.mjs [--dialogue-only] [lessonId...]        # above-level words
node server/scripts/content/lookup.mjs 4 项目 分工 效率                             # vet headwords first
node server/scripts/content/build-hsk0.mjs                                         # rebuild HSK0
cd server && npm run content:validate                                              # full validation
```

| File | Role |
|------|------|
| `lib.mjs` | `effectiveLevel()` / `resolve()`, shared with `validate-content.mjs` |
| `build-lessons.mjs` | HSK1–3: one spec across all six bundle folders + `lessons/` |
| `build-lessons46.mjs` | HSK4–6: two independent passages, dialogue continues the frozen opening |
| `base-dialogues-46.mjs` | Frozen snapshot of the 39 original HSK4–6 dialogue openings |
| `snapshot-dialogues-46.mjs` | One-off generator for the file above; do not re-run |
| `pinyinize.mjs` | Derives passage pinyin from the project dictionary (一/不 sandhi, neutral tone) |
| `lookup.mjs` | Checks candidate headwords against `words/` before they enter a spec |
| `check-scope.mjs` | Longest-match segmentation over dialogue, passages, grammar and exercises |
| `hsk0-content.mjs` + `build-hsk0.mjs` | The HSK0 pronunciation exercises and modules |
| `hsk3-a/b/c.mjs` | Authored source for the 13 HSK3 lessons |
| `hsk4-a…g.mjs` | Authored source for the 13 HSK4 lessons |
| `hsk5-a…h.mjs` | Authored source for the 13 HSK5 lessons (`a/b/c` = 01–03, `d…h` = 04–13, two per file) |
| `hsk6-a…g.mjs` | Authored source for the 13 HSK6 lessons (two per file, `g` holds l13 alone) |

## Writing a HSK4–6 spec

`spec.lines` holds **only the continuation** — `build-lessons46.mjs` prepends the six
original lines from `base-dialogues-46.mjs`, so re-running the builder is idempotent.
`spec.passages` is a two-element array of independent texts, each with its own questions;
`passage: 1|2` on an exercise attaches that text as the stimulus, `line: n` attaches a
dialogue line instead. Passage `pinyin` is generated unless the spec supplies it.

Vet every headword with `lookup.mjs` *before* writing, then run `check-scope.mjs` after
building: it flags above-level words in everything authored, though segmentation noise
(`有没有`, `把手` from 把手机) and words inherited from the frozen opening are expected.

**`data/` is not in git.** Back it up before any bulk edit.
