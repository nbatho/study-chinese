# Phân tích Dự án Study Chinese & Các Chức năng Còn thiếu

Dự án hiện tại của bạn đã **rất hoàn thiện về mặt tính năng cốt lõi**, bao gồm: *Hệ thống ôn tập SRS, luyện phát âm có chấm điểm (Shadowing STT), luyện viết chữ Hán (Canvas), AI Tutor thông minh có ngữ cảnh, Dịch thuật bằng Camera (OCR) và hệ thống Gamification cơ bản (Achievements, Streak).*

Tuy nhiên, để ứng dụng trở nên toàn diện và có thể cạnh tranh với các app học ngôn ngữ lớn trên thị trường (như Duolingo, SuperChinese), dưới đây là những chức năng/mảnh ghép mà dự án của bạn hiện **còn đang thiếu**:

## 1. Tính năng Cộng đồng (Social & Community)
*Hầu hết các app giáo dục đều giữ chân người dùng thông qua tương tác xã hội.*
- **Bảng xếp hạng (Leaderboard):** Xếp hạng người dùng theo XP hàng tuần/tháng. (Code hiện tại có lưu XP nhưng chưa có endpoint hay UI xếp hạng).
- **Hệ thống bạn bè (Friends System):** Cho phép người dùng kết bạn, theo dõi tiến trình và chuỗi ngày học (streak) của nhau.
- **Thảo luận / Bình luận:** Cho phép người dùng để lại bình luận hoặc câu hỏi bên dưới mỗi bài học hoặc mỗi từ vựng để thảo luận với người khác.

## 2. Quản trị & Quản lý nội dung (Admin Panel / CMS)
- **Admin Dashboard:** Hiện tại bạn chưa có giao diện Admin để trực tiếp thêm/sửa/xóa Bài học (Lessons), Từ vựng (Words), hay Quản lý người dùng. Nội dung đang phụ thuộc nhiều vào database seed/migration.
- **Quản lý Log AI & Lỗi báo cáo:** Nơi Admin có thể xem lại lịch sử AI chat để tinh chỉnh prompt, hoặc xử lý các báo cáo lỗi từ khóa học.

## 3. Đa dạng hóa Nội dung học (Rich Content & Curriculum)
- **Bài kiểm tra đầu vào (Placement Test):** Giúp đánh giá trình độ người dùng mới để bỏ qua các bài học cơ bản.
- **Bài tập Đọc hiểu (Reading Comprehension):** Các mẩu truyện ngắn hoặc đoạn văn chứa các từ vựng đã học, có câu hỏi trắc nghiệm đi kèm.
- **Bài tập Nghe hiểu (Listening Comprehension):** Câu hỏi trắc nghiệm dựa trên các đoạn hội thoại độc lập (chưa thấy trong mục `Practice`).
- **Phân chia theo chuẩn HSK:** Nhóm các bài học hoặc từ vựng theo lộ trình HSK rõ ràng hơn để người học dễ theo dõi mục tiêu.

## 4. Nâng cấp Gamification & Giữ chân người dùng (Retention)
- **Hệ thống Tiền ảo & Cửa hàng (Virtual Currency & Shop):** Người dùng học xong được thưởng "Gems/Coins". Họ có thể dùng tiền này để mua vật phẩm ảo (ví dụ: đổi avatar, mua trang phục cho AI Tutor, v.v.).
- **Bảo vệ chuỗi ngày học (Streak Freeze):** Cho phép người dùng mua thẻ bảo vệ streak để không bị mất chuỗi nếu lỡ quên học 1 ngày.
- **Thông báo nhắc nhở (Push Notifications):** Gửi email hoặc Web Push Notification nhắc nhở người dùng quay lại học mỗi ngày (tránh mất streak).

## 5. Nền tảng & Thương mại (Platform & Monetization)
- **Hỗ trợ Offline (PWA):** Cấu hình Service Worker cho phép ứng dụng lưu cache các bài học và audio để người dùng có thể ôn tập (Review) ngay cả khi không có mạng.
- **Gói trả phí (Premium/Monetization):** Tích hợp Stripe/PayPal cho gói Premium (ví dụ: giới hạn số tin nhắn AI Tutor mỗi ngày đối với tài khoản miễn phí, và không giới hạn cho Premium).
- **Native Mobile App:** Dù giao diện web có responsive tốt, một ứng dụng ngôn ngữ thường đòi hỏi một phiên bản React Native/Flutter để tận dụng tối đa Micro và Camera gốc của thiết bị.
