# Kiem soat chat luong bai giang generated

Tai lieu nay tom tat cach kiem soat chat luong khi sinh bai giang tu `data/prompts/` theo schema trong `data/schemas/`.

## Van de can giai quyet

LLM co the tao bai hoc dung format nhung chua chac:

- Dung cap HSK muc tieu
- Khong dung tu vuot level
- Pinyin khop voi Han tu
- Ngu phap phu hop cap do
- Do dai bai doc/hoi thoai hop ly
- Bai tap co dap an dung va giai thich ro
- Noi dung tu nhien, khong sao chep tai lieu co ban quyen

Vi vay khong nen tin output cua LLM truc tiep. LLM chi nen la nguoi viet nhap; pipeline phai co cac lop kiem dinh truoc khi publish.

## Cac lop kiem soat hien co

### 1. Schema gate

File:

```text
data/schemas/lesson-template.schema.json
```

Schema bat buoc moi bai hoc phai co:

- `lesson_id`
- `metadata`
- `learning_objectives`
- `vocabulary_focus`
- `grammar_focus`
- `warm_up`
- `core_modules`
- `practice`
- `review`

Neu bai generated thieu field hoac sai enum nhu `primary_skill`, `hsk_level`, `cefr_level`, bai se bi reject o tang schema.

### 2. Content validator

File:

```text
server/src/services/content-validator.js
```

Validator hien co cac check:

- `schemaValidate()` kiem tra cau truc bai hoc
- `vocabCheck()` kiem tra tu vung Trung co trong bang `words` va khong vuot HSK target
- `pinyinVerify()` kiem tra pinyin khop voi du lieu trong DB
- `lengthCheck()` kiem tra do dai noi dung theo level
- `duplicateDetect()` phat hien bai co tieu de gan giong bai da co
- `grammarCheck()` kiem tra grammar focus co vi du

Voi generated sample hien tai, script dang dung che do `skipDatabaseChecks` de validate structure-only khi chua can DB.

### 3. Generated sample report

Files:

```text
data/lessons/generated/manifest.json
data/lessons/generated/validation-report.json
```

`validation-report.json` hien xac nhan bo 10 bai mau HSK 1-3:

- `0 errors`
- `0 warnings`
- Dung cau truc lesson template

Luu y: day la validation cau truc. De ket luan dat HSK that su, can chay validator voi DB vocab da import.

## Quy trinh de dam bao dat chuan HSK

### Buoc 1. Import vocab HSK vao DB

Can chay migration va import `complete.json` vao bang `words`.

```bash
npm --prefix server run db:migrate -- migrations/001-lesson-framework.sql
node server/scripts/import-complete-json.mjs --dry-run
node server/scripts/import-complete-json.mjs
```

### Buoc 2. Generate bai hoc

Generate bo bai mau local, chi dung de test schema/demo:

```bash
npm --prefix server run lessons:generate:sample
```

Generate mot bai that qua production pipeline:

```bash
npm --prefix server run lessons:generate:one -- --level=2 --topic=food --skill=reading
```

Production pipeline se:

- Goi model sinh lesson JSON
- Validate schema + vocab/pinyin/duplicate bang DB
- Goi model reviewer doc lai bai
- Retry neu auto validator hoac reviewer fail
- Luu lesson/report vao `data/lessons/real/`
- Luu log vao `content_generation_logs` neu DB san sang

Co the chi dinh them target vocab/grammar:

```bash
npm --prefix server run lessons:generate:one -- --level=2 --lesson-no=1 --topic=food --skill=reading --target-words=<hanzi-word-1>,<hanzi-word-2> --grammar="<grammar-pattern>"
```

Neu chi muon ghi file, khong ghi DB log:

```bash
npm --prefix server run lessons:generate:one -- --level=2 --topic=food --skill=reading --no-db-log
```

### Buoc 3. Chay validator voi DB checks

Khi DB da co vocab, khong dung `skipDatabaseChecks`. Luc nay validator co the phat hien:

- Tu khong co trong bang `words`
- Tu vuot HSK level muc tieu
- Pinyin sai voi du lieu vocab
- Bai trung voi noi dung da co

### Buoc 4. AI review

Dung prompt:

```text
data/prompts/review-content.txt
```

AI reviewer cham theo 5 tieu chi:

- Naturalness
- Level fit
- Culture
- Pedagogy
- Translation

Chi cho qua neu diem tong va tung tieu chi dat nguong.

Script review lai bai da sinh:

```bash
npm --prefix server run lessons:review -- --input-dir=data/lessons/real
```

Cau hinh model:

```text
AI_PROVIDER=openai|groq
AI_MODEL=...
AI_API_KEY=...

# Tuy chon model reviewer rieng
AI_REVIEW_PROVIDER=openai|groq
AI_REVIEW_MODEL=...
AI_REVIEW_API_KEY=...
AI_REVIEW_MIN_OVERALL=4
AI_REVIEW_MIN_CRITERION=3
```

Neu khong cau hinh `AI_REVIEW_*`, reviewer se fallback ve cau hinh `AI_*`.

### Buoc 5. Human QA

Truoc khi publish, bai nen qua native speaker hoac nguoi review noi dung. Trang thai de xuat:

```text
draft -> auto_validated -> ai_reviewed -> human_approved -> active
```

## Nhung diem can nang cap tiep

### 1. Tokenizer cho tieng Trung

`vocabCheck()` hien moi extract chuoi Han tu bang regex. De check HSK chinh xac hon, can them segmenter/tokenizer dua tren bang `words`.

Muc tieu:

- Tach cau Trung thanh tu/cum tu dung
- Uu tien match longest phrase
- Bao cao tu vuot level theo token that, khong theo cum ngau nhien

### 2. Grammar level check

Can mo rong `grammar_library` de moi grammar pattern co:

- `hsk_level`
- `cefr_level`
- examples
- allowed structures

Sau do validator kiem tra `grammar_focus` khong vuot level bai hoc.

### 3. Scoring rubric

Nen tinh diem auto validation, vi du:

```text
schema: 20 diem
vocab level: 30 diem
pinyin: 15 diem
length: 10 diem
grammar: 15 diem
duplicate/copyright risk: 10 diem
```

Chi cho publish neu score >= 90 va khong co error nghiem trong.

### 4. Content release

Nen luu bai generated vao DB voi status, reviewer va validation result trong `content_generation_logs`, roi chi active bai da approve.

## Ket luan

Pipeline hien tai da co nen tang kiem soat chat luong:

- Co schema
- Co validator
- Co generated sample data
- Co validation report
- Co prompt reviewer

Nhung de khang dinh bai hoc dat chuan HSK that su, can chay validator voi DB vocab HSK da import, them tokenizer tieng Trung va grammar-level check.
