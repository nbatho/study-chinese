-- Fills the Vietnamese gaps found by the 2026-07-16 data-language audit:
--
--   1. The 40 lesson-used words that had no `vi` gloss — the only words a
--      Vietnamese learner meets inside a lesson that still showed English.
--   2. grammar_library g_ma / g_ne / g_shi, the only rows missing both
--      title_vi and summary_vi (g_ne's English summary was also broken:
--      "Asks and you or what about.").
--   3. word_topics gains a `name_vi` column: `name_en` is served straight to
--      the Dictionary topic filter, so topics were English-only in a
--      Vietnamese UI. Requires the matching vocab.service.js + client change
--      to actually read it.
--
-- All translations hand-written; glosses carry source='human' so the AI
-- backfill scripts never overwrite them.
--
-- Apply with:
--   npm --prefix server run db:migrate migrations/20260716_fill_missing_vi_translations.sql

INSERT INTO word_glosses (word_id, locale, gloss, source) VALUES
  ('hsk_2_ba7c12029b48e1e8', 'vi', 'quan điểm; góc nhìn', 'human'),
  ('hsk_2_fbb4e755bb238694', 'vi', 'công bằng; vô tư', 'human'),
  ('hsk_3_378c692ab4ec2c14', 'vi', 'tập thể; chung; theo nhóm', 'human'),
  ('hsk_3_68d4cdfc0935cf95', 'vi', 'bằng chứng; chứng cứ', 'human'),
  ('hsk_3_71d6df4130ec6501', 'vi', 'tiêu dùng; tiêu xài; chi tiêu', 'human'),
  ('hsk_3_8fea5da34b043c21', 'vi', 'phía sau; đằng sau; sau lưng (ai đó)', 'human'),
  ('hsk_3_96a9697379e2a6bd', 'vi', 'rủi ro; nguy cơ', 'human'),
  ('hsk_3_9c2d9bebf76b1a71', 'vi', 'bề mặt; bề ngoài; vẻ ngoài', 'human'),
  ('hsk_3_cac9ff2d3489426a', 'vi', 'đổi mới; sáng tạo; cách tân', 'human'),
  ('hsk_3_ec60df3d336ce77c', 'vi', 'lãnh đạo; dẫn dắt; người lãnh đạo', 'human'),
  ('hsk_3_fe33307a19b5af8d', 'vi', 'truyền thông; phương tiện truyền thông', 'human'),
  ('hsk_4_0d0b95894332fb0e', 'vi', 'thân phận; danh tính; tư cách; địa vị', 'human'),
  ('hsk_4_104d11e42e4646bd', 'vi', 'hàm ý; ý nghĩa ẩn chứa; ngụ ý', 'human'),
  ('hsk_4_6e89c8251e18113b', 'vi', 'thuyết phục', 'human'),
  ('hsk_4_8672661af6200949', 'vi', 'không gian; chỗ trống; dư địa', 'human'),
  ('hsk_4_a1bcc375447bedb1', 'vi', 'tổng hợp; toàn diện; kết hợp', 'human'),
  ('hsk_4_e9f3eb994b3c7e83', 'vi', 'ám chỉ; gợi ý ngầm; sự ám thị', 'human'),
  ('hsk_4_ee724d77fcbe1101', 'vi', 'hiệu suất; hiệu quả', 'human'),
  ('hsk_5_367c1ec5d7e90ec6', 'vi', 'cộng đồng; khu dân cư', 'human'),
  ('hsk_5_9777016351e5e92e', 'vi', 'lập trường; quan điểm', 'human'),
  ('hsk_5_cb368d14765f589e', 'vi', 'cái giá phải trả; chi phí', 'human'),
  ('hsk_6_05f6ae94fc35ebbf', 'vi', 'thương lượng; bàn bạc; hiệp thương', 'human'),
  ('hsk_6_21d7042ff017691d', 'vi', 'đội; nhóm; ê-kíp', 'human'),
  ('hsk_6_4334e71fe84634ce', 'vi', 'quyền riêng tư; chuyện riêng tư; bí mật cá nhân', 'human'),
  ('hsk_6_535d0a00e0fce4ab', 'vi', 'khuynh hướng; xu hướng; thiên về', 'human'),
  ('hsk_6_974d16b4bdd2dd4f', 'vi', 'cân nhắc; đắn đo', 'human'),
  ('hsk_6_aaa58ce7adb9fbbd', 'vi', 'sự khác biệt; chênh lệch', 'human'),
  ('hsk_6_c24701bf5f79b609', 'vi', 'chính sách', 'human'),
  ('hsk_6_d86368eac0fcb873', 'vi', 'cân bằng; thăng bằng', 'human'),
  ('hsk_6_e4b9d694867e8c5e', 'vi', 'nền tảng; bệ; sân thượng', 'human'),
  ('hsk_7_08208349b76cf22a', 'vi', 'giọng điệu; ngữ khí; khẩu khí', 'human'),
  ('hsk_7_2e8c5d1db69a9672', 'vi', 'luân lý; đạo đức', 'human'),
  ('hsk_7_300d5a83113eca6a', 'vi', 'luận chứng; chứng minh bằng lập luận', 'human'),
  ('hsk_7_42a36e949784e953', 'vi', 'phản hồi; hồi đáp', 'human'),
  ('hsk_7_5eda466f6200648c', 'vi', 'tùy thuộc vào; do ... quyết định', 'human'),
  ('hsk_7_b50638d9682c94f1', 'vi', 'vừa vặn; đúng mức; vừa khéo', 'human'),
  ('hsk_7_c523853f84ddf8b6', 'vi', 'khung; khuôn khổ; bộ khung', 'human'),
  ('hsk_7_cc5eeb0350a1962b', 'vi', 'lời nói; ngôn từ; diễn ngôn', 'human'),
  ('hsk_7_f0d94106ba8f60d4', 'vi', 'suy đoán; phỏng đoán; ước đoán', 'human'),
  ('hsk_7_f35763a95de91354', 'vi', 'thẩm mỹ; thưởng thức cái đẹp; gu thẩm mỹ', 'human')
ON CONFLICT (word_id, locale) DO NOTHING;

UPDATE grammar_library SET
  title_vi = '吗 (ma) - câu hỏi có/không',
  summary_vi = 'Biến câu trần thuật thành câu hỏi có/không.'
WHERE id = 'g_ma';

UPDATE grammar_library SET
  summary = 'Asks "and you?" or "what about ...?" as a follow-up on the current topic.',
  title_vi = '呢 (ne) - câu hỏi tiếp nối',
  summary_vi = 'Hỏi lại "còn bạn?" hoặc "còn ... thì sao?" về chủ đề đang nói.'
WHERE id = 'g_ne';

UPDATE grammar_library SET
  title_vi = '是 (shì) - là',
  summary_vi = 'Dùng để nối chủ ngữ với danh từ (A là B).'
WHERE id = 'g_shi';

ALTER TABLE word_topics ADD COLUMN IF NOT EXISTS name_vi VARCHAR(100);

UPDATE word_topics SET name_vi = v.name_vi
FROM (VALUES
  ('greetings', 'Chào hỏi'),
  ('numbers', 'Con số'),
  ('food', 'Ăn uống'),
  ('family', 'Gia đình'),
  ('body', 'Cơ thể & Sức khỏe'),
  ('time', 'Thời gian & Ngày tháng'),
  ('weather', 'Thời tiết'),
  ('colors', 'Màu sắc'),
  ('animals', 'Động vật'),
  ('clothing', 'Trang phục'),
  ('transportation', 'Giao thông'),
  ('shopping', 'Mua sắm'),
  ('education', 'Giáo dục'),
  ('work', 'Công việc & Sự nghiệp'),
  ('travel', 'Du lịch'),
  ('nature', 'Thiên nhiên'),
  ('technology', 'Công nghệ'),
  ('sports', 'Thể thao'),
  ('emotions', 'Cảm xúc'),
  ('home', 'Nhà cửa & Đời sống'),
  ('geography', 'Địa lý'),
  ('culture', 'Văn hóa'),
  ('business', 'Kinh doanh'),
  ('general', 'Tổng hợp')
) AS v(id, name_vi)
WHERE word_topics.id = v.id;
