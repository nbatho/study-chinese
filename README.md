# Study Chinese

Ứng dụng học tiếng Trung gồm React client và Express API server. Backend dùng PostgreSQL, JWT auth, SRS, lesson progress, AI/OCR/practice endpoints ở dạng mock/demo để phát triển nhanh.

## Cấu Trúc

- `client/`: React 19, TypeScript, Vite, React Query, Redux Toolkit.
- `server/`: Node.js, Express, PostgreSQL `pg`, ES Modules.
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

Khởi tạo schema và seed từ `server/prod.sql`:

```bash
npm run db:init
```

Hoặc chạy trực tiếp:

```bash
npm --prefix server run db:init
```

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

Docker Compose dựng PostgreSQL, server và client:

```bash
docker compose up --build
```

Sau khi PostgreSQL sẵn sàng, import schema/seed nếu container DB còn trống:

```bash
npm run db:init
```

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
| `POST` | `/api/v1/ocr/scan` | OCR demo/mapping từ |
| `GET/POST` | `/api/v1/ai-tutor/*` | AI tutor mock hoặc provider thật |

Các alias cũ `/api/health`, `/api/words`, `/api/profile`, `/api-docs` vẫn còn redirect để tương thích local cũ.

## AI Tutor Provider

Mặc định server dùng `AI_PROVIDER=mock`. Để dùng provider thật, cập nhật `server/.env`:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=...
AI_MODEL=gemini-2.5-flash
```

Các provider hỗ trợ: `gemini`, `openai`, `groq`, `openai-compatible`. Có thể dùng `AI_BASE_URL` cho endpoint OpenAI-compatible riêng. Server có timeout/retry, log token/cost và lưu `token_usage` vào `chat_messages`.

## Bảo Mật Và Secrets

- Không commit `.env`.
- `JWT_SECRET` production phải dài ít nhất 32 ký tự và không dùng giá trị mặc định.
- Nếu secret từng bị lộ trong report hoặc commit cũ, hãy rotate DB password/JWT secret trên provider.
