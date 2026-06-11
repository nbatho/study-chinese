# To-do hien tai cua du an Study Chinese

Cap nhat: 2026-06-11

## Ket qua kiem tra nhanh

- `client`: `npm.cmd run build` chay thanh cong.
- `client`: `npm.cmd run lint` dang fail voi 21 errors va 1 warning.
- `server`: chua co script test/lint trong `package.json`.
- `to-do.md` truoc do chua ton tai, file nay duoc tao moi tu viec ra soat cau truc client/server/docs.

## Uu tien cao

- [ ] Sua loi lint o frontend:
  - `client/src/pages/Learn.tsx`: loi `react-hooks/preserve-manual-memoization` tai `finalAccuracy`.
  - `client/src/pages/Practice.tsx`: loi `react-hooks/set-state-in-effect` trong `MinimalPairsTool`.
  - `client/src/pages/Profile.tsx`: loi `set-state-in-effect` va warning dependency cua `stats`.
  - `client/src/routes/index.tsx`: loi `react-refresh/only-export-components` do file route vua export route config/router vua chua lazy components.
  - `client/src/store/store.ts` va `client/src/utils/errorUtils.ts`: con nhieu `any`.
- [ ] Sua loi encoding/mojibake trong README, docs, source UI copy va SQL seed. Hien nhieu chu Viet/Trung/emoji dang hien kieu `Há»c`, `å­¦`, `ðŸ...`, co nguy co hien sai tren UI va tai lieu.
- [ ] Bo sung test:
  - Unit test cho service backend: auth, SRS, lesson completion, activity/streak.
  - Integration test cho API Express voi database test.
  - Frontend test cho auth guard, onboarding, lesson flow, SRS review.
  - E2E test cho luong dang ky -> onboarding -> hoc bai -> review.
- [ ] Bo sung CI de chay `lint`, `build`, test backend/frontend tren pull request.
- [ ] Hoan thien migration/seed workflow. Hien co `server/prod.sql` lon nhung chua co migration tool, seed runner, rollback, database test fixture.

## Backend/API

- [ ] Them script `lint`, `test`, `test:integration` cho `server/package.json`.
- [ ] Harden auth:
  - Dung JWT library da kiem chung hoac viet them test bao phu custom JWT hien tai.
  - Them rotate/revoke refresh token, luu session/refresh token hash neu can logout that su theo thiet bi.
  - Them rate limit cho login/register/refresh.
  - Canh bao khi `JWT_SECRET` con la gia tri mac dinh trong production.
- [ ] Bo sung validation schema ro rang cho request body/query/path thay vi chi `requireFields`.
- [ ] Dong bo OpenAPI/Swagger voi route thuc te:
  - Them `/auth/refresh`.
  - Them cac route `/practice/*`.
  - Them route OCR samples neu van dung tren client.
  - Kiem tra lai cac path utility/dashboard/achievements so voi `api.routes.js`.
- [ ] Thay mock provider:
  - `AI_PROVIDER=mock`: tich hop provider that cho AI tutor, co timeout, retry, logging token/cost.
  - `OCR_PROVIDER=mock`: tich hop OCR that hoac service rieng, tra ve bounding box/co do tin cay.
  - `TTS_PROVIDER=mock`: tich hop provider am thanh mau, cache file audio va tra `audioUrl` cho client.
  - Shadowing/pronunciation hien cham diem deterministic, can speech recognition/scoring that hoac ghi ro la demo.
- [ ] Trien khai backend audio sample theo thiet ke trong `docs/be.md`:
  - Them bang `audio_assets`, cache key, metadata provider/voice/speed/duration.
  - Them endpoint `GET /api/v1/audio` de lay hoac tao audio theo text.
  - Them endpoint admin `POST /api/v1/audio/batch` de pre-generate audio cho content seed.
  - Them object storage/CDN hoac thu muc static co kiem soat de luu file mp3/ogg.
  - Them rate limit, logging cache hit/miss, fallback khi TTS provider loi.
- [ ] Bo sung observability: structured logs, request id, error tracking, health check co trang thai DB chi tiet.
- [ ] Ra soat bao mat upload OCR: gioi han dung luong, loai file, sanitize base64, khong log anh nhay cam.

## Frontend/UX

- [ ] Thong nhat ngon ngu giao dien. Hien copy dang tron Anh/Viet va mot so chu Trung bi loi encoding.
- [ ] Thay `alert()` bang toast/modal co style chung, dac biet trong `Profile`, `Practice`, `CameraTranslator`.
- [ ] Bo sung trang/luong quan ly tu vung:
  - Tim kiem tu vung day du.
  - Favorite words UI.
  - Custom lists UI: tao/sua/xoa list, them/xoa tu.
- [ ] Cai thien error/loading/empty states cho tat ca page dung React Query, nhat la khi server/DB khong san sang.
- [ ] Giam trung lap state giua Redux auth, React Query va `useStore` local. Profile/onboarding hien van co nguy co lech giua local store va server.
- [ ] Them accessibility co ban: label/aria cho icon button, focus state, keyboard navigation cho card/action, thong bao loi form.
- [ ] Kiem tra responsive thuc te tren mobile cho lesson player, practice suite, camera overlay va auth layout.
- [ ] Can nhac i18n framework neu app can ho tro Viet/Anh/Trung lau dai.

## Du lieu hoc tap

- [ ] Mo rong noi dung HSK va curriculum. Hien UI moi expose HSK 1-3, can xac dinh muc tieu HSK nao la scope chinh.
- [ ] Bo sung pipeline quan ly content release: version, publish/unpublish, seed idempotent, khong pha progress cu.
- [ ] Kiem tra chat luong pinyin, tone array, simplified/traditional, nghia tieng Anh va vi du ngu phap sau khi sua encoding.
- [x] Viet giai phap am thanh mau vao `docs/be.md`.
- [ ] Gan `audioUrl` vao response `vocab`, `lessons`, `ai-tutor messages`, `practice/shadowing-prompts`.
- [ ] Cap nhat frontend de uu tien phat `audioUrl`, fallback ve browser `speechSynthesis` khi khong co audio.

## DevOps va tai lieu

- [ ] Cap nhat README:
  - Endpoint chinh hien la `/api/v1`, README van noi nhieu endpoint cu `/api/words`, `/api/profile`.
  - Them cach khoi tao PostgreSQL, import `prod.sql`, seed data, va bien moi truong can thiet.
  - Ghi ro PowerShell can dung `npm.cmd` neu bi chan `npm.ps1`.
- [ ] Them root-level scripts de chay nhanh client/server, vi hien phai `cd client` va `cd server` rieng.
- [ ] Them Docker Compose cho app + PostgreSQL de dev moi chay du an nhanh hon.
- [ ] Them `.env.example` cho client neu can `VITE_API_GATEWAY_URL`.
- [ ] Them huong dan deploy production: build client, run server, reverse proxy, HTTPS, CORS, cookie settings.
- [ ] Xem lai `.gitignore`/repo hygiene: khong nen commit `node_modules`, `dist`, `.env` neu dang nam trong git.

## Co the lam sau

- [ ] Offline mode/PWA va cache bai hoc.
- [ ] Export/backup learning progress.
- [ ] Admin/content editor cho lessons, vocab, grammar, daily phrase.
- [ ] Analytics hoc tap nang cao: retention, weak tones, weak words, lesson recommendations.
