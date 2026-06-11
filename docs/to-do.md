# To-do hien tai cua du an Study Chinese

Cap nhat: 2026-06-11

## Ket qua kiem tra hien tai

- `client`: `npm.cmd run lint` chay thanh cong.
- `client`: `npm.cmd run build` chay thanh cong.
- `server`: `npm.cmd run lint` chay thanh cong, dang kiem tra syntax cho 49 file JS.
- `server`: `npm.cmd test` chay thanh cong voi 10 tests.
- `server`: `npm.cmd run test:integration` chay thanh cong voi route import smoke test.
- `swagger.json`: parse JSON thanh cong.
- CI/CD: tam hoan theo yeu cau hien tai, chua can lam.

## Da hoan tat trong dot cap nhat nay

- [x] Sua loi lint frontend:
  - [x] `client/src/pages/Learn.tsx`: bo `useMemo` khong can thiet cho `finalAccuracy`.
  - [x] `client/src/pages/Practice.tsx`: bo `setState` dong bo trong effect cua `MinimalPairsTool`.
  - [x] `client/src/pages/Profile.tsx`: bo state sync tu profile trong effect, them memo cho `stats`.
  - [x] `client/src/routes/index.tsx`: cau hinh lint rieng cho route config.
  - [x] `client/src/store/store.ts`: xoa dead localStorage store 520 dong.
  - [x] `client/src/utils/errorUtils.ts`: thay `any` bang `unknown`.
- [x] Giam trung lap state:
  - [x] Bo pattern React Query -> Redux sync trong query hooks chinh.
  - [x] Chuyen theme/onboarding state con dung sang Redux `appSlice`.
  - [x] `Onboarding` chi ghi server/cache, khong ghi song song local store.
  - [x] `Navigation` lay SRS due count tu server query.
- [x] Harden auth/API muc co ban:
  - [x] Them rate limit cho login/register/refresh.
  - [x] Them rate limit cho AI/OCR endpoints.
  - [x] Canh bao/fail-fast neu `JWT_SECRET` yeu trong production.
  - [x] Them security headers va request id.
  - [x] Them graceful shutdown.
- [x] Bo sung validation schema co ban:
  - [x] Auth register/login validate email, password, name.
  - [x] Giu `requireFields` cho cac route chua chuyen schema.
- [x] Bo sung test server nen tang:
  - [x] Unit test cho password hash/verify.
  - [x] Unit test cho JWT sign/verify va tampered token.
  - [x] Unit test cho validation middleware.
  - [x] Unit test cho security headers/request id/rate limiter.
  - [x] Integration smoke test import route modules.
- [x] Them script server:
  - [x] `lint`
  - [x] `test`
  - [x] `test:integration`
  - [x] `db:init`
- [x] Hoan thien seed workflow muc co ban:
  - [x] Them `server/scripts/init-db.js` de chay `server/prod.sql`.
  - [x] Them root script `npm run db:init`.
- [x] Dong bo OpenAPI/Swagger voi route thuc te:
  - [x] Them `/auth/refresh`.
  - [x] Them `/practice`.
  - [x] Them `/practice/minimal-pairs`.
  - [x] Them `/practice/shadowing-prompts`.
  - [x] Them `/practice/shadowing/score`.
  - [x] Them `/practice/hanzi-strokes`.
  - [x] Them `/ocr/samples`.
- [x] Cap nhat README:
  - [x] Sua mojibake trong README.
  - [x] Cap nhat endpoint chinh `/api/v1`.
  - [x] Them cach khoi tao PostgreSQL/import `prod.sql`.
  - [x] Ghi ro PowerShell dung `npm.cmd` khi bi chan `npm.ps1`.
  - [x] Them danh sach root scripts.
  - [x] Them ghi chu rotate secrets.
- [x] Them dev workflow:
  - [x] Root-level `package.json` voi scripts client/server/build/lint/test/db.
  - [x] `client/.env.example`.
  - [x] `docker-compose.yml`.
  - [x] Dockerfile cho client/server.
  - [x] `.dockerignore`.

## Tam hoan theo yeu cau

- [ ] CI/CD pipeline: tam thoi chua lam.
  - Khi can lam sau: them GitHub Actions hoac pipeline tuong duong de chay lint/build/test tren pull request.

## Uu tien cao con lai

- [ ] Sua encoding/mojibake trong source UI copy, docs con lai va SQL seed.
  - [x] README da duoc viet lai UTF-8.
  - [ ] `docs/api.md`, `docs/be.md`, `docs/db.md` can kiem tra lai tung file.
  - [ ] UI copy trong pages va seed SQL con nhieu chu bi loi nhu `Â·`, `ðŸ...`, `å­¦`.
- [ ] Mo rong test:
  - [x] Backend unit test nen tang cho auth/security/validation.
  - [ ] Unit test backend cho SRS, lesson completion, activity/streak.
  - [ ] Integration test API Express voi database test that.
  - [ ] Frontend test cho auth guard, onboarding, lesson flow, SRS review.
  - [ ] E2E test cho luong dang ky -> onboarding -> hoc bai -> review.
- [ ] Hoan thien migration workflow:
  - [x] Co seed/init runner cho `prod.sql`.
  - [ ] Chia migration theo version.
  - [ ] Them rollback strategy.
  - [ ] Them database test fixture.

## Backend/API

- [x] Them script `lint`, `test`, `test:integration` cho `server/package.json`.
- [ ] Harden auth nang cao:
  - [ ] Dung JWT library da kiem chung hoac mo rong test bao phu custom JWT hien tai.
  - [ ] Them rotate/revoke refresh token.
  - [ ] Luu session/refresh token hash neu can logout that su theo thiet bi.
- [ ] Bo sung validation schema ro rang cho tat ca request body/query/path.
  - [x] Auth da co schema co ban.
  - [ ] Lessons/SRS/lists/practice/OCR can schema rieng.
- [x] Dong bo OpenAPI/Swagger voi route thuc te muc hien tai.
- [ ] Thay mock provider:
  - [ ] `AI_PROVIDER=mock`: tich hop provider that cho AI tutor, co timeout, retry, logging token/cost.
  - [ ] `OCR_PROVIDER=mock`: tich hop OCR that hoac service rieng, tra ve bounding box/do tin cay.
  - [ ] `TTS_PROVIDER=mock`: tich hop provider am thanh mau, cache file audio va tra `audioUrl` cho client.
  - [ ] Shadowing/pronunciation hien cham diem deterministic, can speech recognition/scoring that hoac ghi ro la demo trong UI/API.
- [ ] Trien khai backend audio sample theo thiet ke trong `docs/be.md`:
  - [ ] Them bang `audio_assets`, cache key, metadata provider/voice/speed/duration.
  - [ ] Them endpoint `GET /api/v1/audio` de lay hoac tao audio theo text.
  - [ ] Them endpoint admin `POST /api/v1/audio/batch` de pre-generate audio cho content seed.
  - [ ] Them object storage/CDN hoac thu muc static co kiem soat de luu file mp3/ogg.
  - [ ] Them logging cache hit/miss, fallback khi TTS provider loi.
- [x] Bo sung observability muc co ban: request id.
- [ ] Bo sung observability nang cao: structured logs, error tracking, health check co trang thai DB chi tiet.
- [ ] Ra soat bao mat upload OCR:
  - [ ] Gioi han dung luong/loai file ro rang.
  - [ ] Sanitize base64.
  - [ ] Dam bao khong log anh nhay cam.

## Frontend/UX

- [ ] Thong nhat ngon ngu giao dien. Hien copy dang tron Anh/Viet va mot so chu Trung bi loi encoding.
- [ ] Thay `alert()` bang toast/modal co style chung, dac biet trong `Profile`, `Practice`, `CameraTranslator`.
- [ ] Bo sung trang/luong quan ly tu vung:
  - [ ] Tim kiem tu vung day du.
  - [ ] Favorite words UI.
  - [ ] Custom lists UI: tao/sua/xoa list, them/xoa tu.
- [ ] Cai thien error/loading/empty states cho tat ca page dung React Query, nhat la khi server/DB khong san sang.
- [x] Giam trung lap state giua Redux auth, React Query va local store.
- [ ] Them accessibility co ban:
  - [ ] label/aria cho icon button.
  - [ ] focus state.
  - [ ] keyboard navigation cho card/action.
  - [ ] thong bao loi form.
- [ ] Kiem tra responsive thuc te tren mobile cho lesson player, practice suite, camera overlay va auth layout.
- [ ] Can nhac i18n framework neu app can ho tro Viet/Anh/Trung lau dai.

## Du lieu hoc tap

- [ ] Mo rong noi dung HSK va curriculum. Hien UI moi expose HSK 1-3, can xac dinh scope chinh.
- [ ] Bo sung pipeline quan ly content release: version, publish/unpublish, seed idempotent, khong pha progress cu.
- [ ] Kiem tra chat luong pinyin, tone array, simplified/traditional, nghia tieng Anh va vi du ngu phap sau khi sua encoding.
- [x] Viet giai phap am thanh mau vao `docs/be.md`.
- [ ] Gan `audioUrl` vao response `vocab`, `lessons`, `ai-tutor messages`, `practice/shadowing-prompts`.
- [ ] Cap nhat frontend de uu tien phat `audioUrl`, fallback ve browser `speechSynthesis` khi khong co audio.

## DevOps va tai lieu

- [x] Cap nhat README.
- [x] Them root-level scripts de chay nhanh client/server.
- [x] Them Docker Compose cho app + PostgreSQL.
- [x] Them `.env.example` cho client.
- [ ] Them huong dan deploy production: build client, run server, reverse proxy, HTTPS, CORS, cookie settings.
- [ ] Xem lai `.gitignore`/repo hygiene:
  - [x] `.env`, `dist`, `node_modules` da co trong `.gitignore`.
  - [ ] Kiem tra git history/remote neu tung commit secrets.

## Co the lam sau

- [ ] Offline mode/PWA va cache bai hoc.
- [ ] Export/backup learning progress.
- [ ] Admin/content editor cho lessons, vocab, grammar, daily phrase.
- [ ] Analytics hoc tap nang cao: retention, weak tones, weak words, lesson recommendations.
