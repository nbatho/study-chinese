# Study Chinese

Ứng dụng học tiếng Trung gồm React client và Express API server. Backend dùng PostgreSQL, JWT auth, SRS, lesson progress, AI tutor provider, OCR local PaddleOCR và practice endpoints.

## Cấu Trúc

- `client/`: React 19, TypeScript, Vite, React Query, Redux Toolkit.
- `server/`: Node.js, Express, PostgreSQL `pg`, ES Modules.
- `data/`: shared content data, lesson prompts, schemas, generated lesson bundles, and dictionary source files.
- `ocr-service/`: FastAPI + PaddleOCR local service cho OCR tieng Trung.
- `docs/`: tài liệu API, backend, database và backlog.

## Yêu Cầu

- Node.js 22 hoặc mới hơn.
- PostgreSQL 16 nếu chạy ngoài Docker.
- Windows PowerShell có thể chặn `npm.ps1`; dùng `npm.cmd ...` nếu gặp lỗi execution policy.

## Cài Đặt

```bash
npm install --prefix client
npm install --prefix server
```

Tạo file môi trường:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Trên macOS/Linux:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

## Database

Mặc định `server/.env.example` trỏ tới PostgreSQL local:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/study_chinese
```

Khởi tạo schema từ `server/schema.sql` và dữ liệu mẫu từ `server/mock-data.sql`:

```bash
npm run db:init
```

Hoặc chạy trực tiếp:

```bash
npm --prefix server run db:init
```

Nếu chỉ muốn tạo schema trống, đặt `SKIP_MOCK_DATA=true` khi chạy lệnh trên.

## Chạy Development

Chạy server:

```bash
npm run server:dev
```

Chạy client:

```bash
npm run client:dev
```

URL mặc định:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`
- API: `http://localhost:5000/api/v1`
- OpenAPI JSON: `http://localhost:5000/api/v1/docs/swagger.json`

## Docker Compose

Docker Compose chỉ dựng server và client. Server đọc cấu hình DB, AI, OCR, STT từ `server/.env`, nên DB và OCR có thể trỏ tới dịch vụ đang deploy bên ngoài như Supabase hoặc Hugging Face Spaces. Client được build static và serve bằng nginx ở `http://localhost:5173`; nginx proxy `/api/*` sang server trong mạng Docker.

```bash
docker compose up --build
```

URL mặc định khi chạy Docker:

- Client: `http://localhost:5173`
- API qua client nginx proxy: `http://localhost:5173/api/v1`

## Scripts

Root scripts:

- `npm run client:dev`
- `npm run server:dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run db:init`

Client scripts:

- `npm --prefix client run dev`
- `npm --prefix client run build`
- `npm --prefix client run lint`

Server scripts:

- `npm --prefix server run dev`
- `npm --prefix server run lint`
- `npm --prefix server test`
- `npm --prefix server run test:integration`
- `npm --prefix server run db:init`
- `npm --prefix server run db:migrate -- <file>.sql` (áp dụng một file SQL lẻ khi cần; schema hiện tại đã gộp đủ trong `server/schema.sql`, thư mục `server/migrations/` trống)

## API Chính

Tất cả endpoint chính nằm dưới `/api/v1`.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Kiểm tra trạng thái server/database |
| `POST` | `/api/v1/auth/register` | Đăng ký |
| `POST` | `/api/v1/auth/login` | Đăng nhập |
| `POST` | `/api/v1/auth/refresh` | Refresh access token bằng httpOnly cookie |
| `GET/PUT` | `/api/v1/users/profile` | Hồ sơ và cài đặt người học |
| `GET` | `/api/v1/lessons` | Danh sách bài học |
| `GET` | `/api/v1/vocab` | Tìm kiếm từ vựng |
| `GET/POST` | `/api/v1/srs/*` | Ôn tập SRS |
| `GET/POST` | `/api/v1/practice/*` | Bộ công cụ luyện tập |
| `GET` | `/api/v1/audio` | Tạo audio đọc tiếng Trung bằng Edge TTS |
| `POST` | `/api/v1/ocr/scan` | OCR qua provider PaddleOCR hoặc text mapping |
| `GET/POST` | `/api/v1/ai-tutor/*` | AI tutor qua mock/dev hoặc provider thật |

Các alias cũ `/api/health`, `/api/words`, `/api/profile`, `/api-docs` vẫn còn redirect để tương thích local cũ.

## AI Tutor Provider

Mặc định server dùng `AI_PROVIDER=mock`. Để dùng provider thật, cập nhật `server/.env`:

```text
AI_PROVIDER=groq
GROQ_API_KEY=...
AI_MODEL=openai/gpt-oss-20b
AI_INPUT_COST_PER_1M_TOKENS=0.075
AI_OUTPUT_COST_PER_1M_TOKENS=0.30
```

Groq default model in code is `openai/gpt-oss-20b` when `AI_MODEL` is not set.

Các provider hỗ trợ: `gemini`, `openai`, `groq`, `openai-compatible`. Có thể dùng `AI_BASE_URL` cho endpoint OpenAI-compatible riêng. Server có timeout/retry, log token/cost và lưu `token_usage` vào `chat_messages`.

## OCR Provider

```text
OCR_PROVIDER=paddle
OCR_BASE_URL=https://your-ocr-service.example
OCR_TIMEOUT_MS=30000
```

Docker Compose không còn chạy `ocr-service` local. Khi dùng `OCR_PROVIDER=paddle`, backend cần `OCR_BASE_URL` trỏ tới OCR service đang deploy bên ngoài.

### Deploy OCR to Hugging Face Spaces

The `ocr-service/` folder is ready to be used as a Hugging Face Docker Space. Create a new Space with SDK `Docker`, then push the contents of `ocr-service/` as the Space repository root.

Set these Space runtime variables:

```text
OCR_LANG=ch
OCR_DET_MODEL=PP-OCRv6_small_det
OCR_REC_MODEL=PP-OCRv6_small_rec
OCR_DEVICE=cpu
OCR_ENGINE=paddle_dynamic
OCR_ENABLE_MKLDNN=false
OCR_API_KEY=replace-with-a-random-secret
```

Then point the backend to the public Space URL:

```text
OCR_PROVIDER=paddle
OCR_BASE_URL=https://your-username-your-space.hf.space
OCR_API_KEY=the-same-random-secret
OCR_TIMEOUT_MS=60000
```

`OCR_API_KEY` is optional, but recommended for a public Space. The backend sends it to the OCR service as `x-ocr-api-key`.

OCR service dùng PP-OCR Series với:

```text
OCR_LANG=ch
OCR_DET_MODEL=PP-OCRv6_small_det
OCR_REC_MODEL=PP-OCRv6_small_rec
```

Lần đầu build OCR service trên host deploy sẽ tải PaddleOCR/PaddlePaddle và model PP-OCRv6 small nên có thể chậm.

## CC-CEDICT Dictionary

OCR ưu tiên match bảng `words` của bài học. Nếu chưa match, server có thể fallback sang bảng `dictionary_entries` import từ CC-CEDICT.

Attribution: Dictionary fallback data can be imported from CC-CEDICT, maintained by the CC-CEDICT editor team and distributed under the Creative Commons Attribution-ShareAlike 3.0 License. Project: `https://cc-cedict.org/`; license: `https://creativecommons.org/licenses/by-sa/3.0/`.

Tải CC-CEDICT từ MDBG rồi lưu file vào:

```text
data/cedict_ts.u8
```

Import vào DB đang cấu hình trong `server/.env`:

```bash
npm --prefix server run dict:import -- data/cedict_ts.u8
```

Kiểm tra parser trước, không ghi DB:

```bash
npm --prefix server run dict:import -- data/cedict_ts.u8 --dry-run
```

Nếu đang chạy bằng Docker và muốn import từ trong server container:

```bash
docker compose cp data/cedict_ts.u8 server:/app/data/cedict_ts.u8
docker compose exec server npm run dict:import -- data/cedict_ts.u8
```

Script sẽ tự tạo bảng `dictionary_entries` nếu chưa có và upsert dữ liệu theo `source + traditional + simplified + pinyin`.

## Audio / Edge TTS

Frontend ưu tiên gọi `GET /api/v1/audio?text=你好&language=zh-CN` để phát MP3 từ Edge TTS, sau đó fallback về browser `speechSynthesis` nếu backend/provider lỗi. Voice mặc định là `zh-CN-XiaoxiaoNeural`; có thể đổi bằng `TTS_EDGE_VOICE` trong `server/.env`.

## Bảo Mật Và Secrets

- Không commit `.env`.
- `JWT_SECRET` production phải dài ít nhất 32 ký tự và không dùng giá trị mặc định.
- Nếu secret từng bị lộ trong report hoặc commit cũ, hãy rotate DB password/JWT secret trên provider.
