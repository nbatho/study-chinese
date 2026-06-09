# Thiết kế Kiến trúc Backend & Giải pháp AI (Backend & AI Design)

Tài liệu này mô tả chi tiết phương án triển khai phần Backend xử lý các tính năng thông minh liên quan đến Trí tuệ nhân tạo (AI) trong ứng dụng Study Chinese bao gồm: **Trợ lý ảo AI Tutor (Chat & Sửa lỗi)** và **Nhận diện chữ Hán qua ảnh chụp (Camera Scan OCR)**.

---

## 1. Trợ lý ảo AI Tutor & Chấm lỗi Ngữ pháp (AI Tutor & Grammar Correction)

### 1.1. Luồng hoạt động (Data Flow)

```mermaid
sequenceDiagram
    participant Client as Client (React/Vite)
    participant BE as Backend Server (Node.js/Go/Python)
    participant LLM as Gemini API (Google AI / Vertex AI)
    participant DB as Database (PostgreSQL)

    Client->>BE: POST /api/v1/ai-tutor/sessions/:id/messages { text: "user message" }
    BE->>DB: Lấy lịch sử chat (5-10 tin nhắn gần nhất) + Cài đặt của User
    BE->>LLM: Gửi Prompt hệ thống + Lịch sử hội thoại + Câu chat mới (Yêu cầu JSON Output)
    LLM-->>BE: Phản hồi JSON (Câu trả lời + Phiên âm + Dịch + Gợi ý sửa lỗi ngữ pháp)
    alt Có lỗi ngữ pháp (correction != null)
        BE->>DB: Lưu tin nhắn & Bảng sửa lỗi chat_message_corrections
    else Không có lỗi ngữ pháp
        BE->>DB: Chỉ lưu tin nhắn thông thường
    end
    BE->>DB: Cộng +10 XP cho DailyStats của User
    BE-->>Client: Trả về kết quả JSON (tutorMessage + correction + xpEarned)
```

### 1.2. Giải pháp Mô hình đề xuất
*   **Mô hình đề xuất:** **Gemini 1.5 Flash** (hoặc **Gemini 2.0 Flash**).
*   **Lý do lựa chọn:**
    *   Tốc độ phản hồi cực kỳ nhanh (thời gian trễ dưới 1.5 giây), rất thích hợp cho trải nghiệm chat thời gian thực.
    *   Hỗ trợ xuất dữ liệu theo cấu trúc định sẵn (**Structured Outputs / JSON Schema**) cực kỳ mạnh mẽ.
    *   Chi phí API cực kỳ rẻ (hoặc miễn phí với gói giới hạn của Google AI Studio).
    *   Khả năng hiểu và xử lý đa ngôn ngữ (tiếng Trung, Anh, Việt) rất tốt.

### 1.3. Cấu hình Prompt & Định dạng đầu ra (JSON Schema)
Để LLM vừa đóng vai trò gia sư trò chuyện, vừa tự động phát hiện lỗi và sửa lỗi ngữ pháp trong cùng một lượt gọi API, chúng ta cấu hình **System Instruction (System Prompt)** và yêu cầu định dạng đầu ra như sau:

#### System Prompt:
```text
Bạn là Xiao Hong (小红), một gia sư dạy tiếng Trung giao tiếp thân thiện và chu đáo.
Nhiệm vụ của bạn là:
1. Đọc tin nhắn tiếng Trung của học viên.
2. Trả lời lại bằng tiếng Trung giản thể phù hợp với ngữ cảnh kịch bản [Scenario]. Câu trả lời ngắn gọn, tự nhiên, phù hợp với trình độ người mới bắt đầu (HSK 1-3).
3. Đọc kỹ tin nhắn của học viên để phát hiện lỗi:
   - Lỗi ngữ pháp tiếng Trung.
   - Lỗi viết phiên âm Pinyin không dấu (ví dụ: viết "ni hao" thay vì "nǐ hǎo").
   - Lỗi dùng sai từ vựng.
4. Nếu phát hiện lỗi, hãy điền thông tin vào trường "correction". Giải thích lỗi ngắn gọn bằng tiếng Việt. Nếu học viên viết đúng hoàn toàn, hãy để trường "correction" là null.

Hãy trả về phản hồi theo định dạng JSON duy nhất.
```

#### JSON Schema yêu cầu (Structured Output):
```json
{
  "type": "object",
  "properties": {
    "reply_simplified": {
      "type": "string",
      "description": "Câu trả lời của giáo viên bằng chữ Hán giản thể."
    },
    "reply_pinyin": {
      "type": "string",
      "description": "Phiên âm Pinyin đầy đủ có dấu của câu trả lời giáo viên."
    },
    "reply_english": {
      "type": "string",
      "description": "Bản dịch nghĩa tiếng Anh của câu trả lời giáo viên."
    },
    "has_error": {
      "type": "boolean",
      "description": "True nếu tin nhắn học viên có lỗi ngữ pháp/phát âm/viết sai, ngược lại là False."
    },
    "correction": {
      "type": "object",
      "nullable": true,
      "properties": {
        "original": { "type": "string", "description": "Câu gốc có lỗi của học viên." },
        "improved": { "type": "string", "description": "Câu đề xuất đã sửa đúng ngữ pháp và phiên âm có dấu." },
        "explanation": { "type": "string", "description": "Lời giải thích lỗi sai bằng tiếng Việt ngắn gọn, dễ hiểu." }
      },
      "required": ["original", "improved", "explanation"]
    }
  },
  "required": ["reply_simplified", "reply_pinyin", "reply_english", "has_error", "correction"]
}
```

---

## 2. Nhận diện hình ảnh và dịch chữ Hán (Camera Scan OCR & Word Mapping)

Tính năng này cho phép người dùng chụp ảnh các biển báo, menu món ăn, sách báo... và nhấp chọn trực tiếp vào các từ vựng chữ Hán để học và đưa vào hệ thống thẻ nhớ ôn tập SRS.

### 2.1. Luồng hoạt động (Data Flow)

```mermaid
graph TD
    A[Client: Chụp ảnh/Upload ảnh] -->|Gửi Base64/File| B(Backend: API /ocr/scan)
    B -->|Gọi API OCR đám mây hoặc Local| C[Bộ máy OCR: Nhận diện chữ Hán + Bounding Box]
    C -->|Trả về tọa độ và Text| B
    B -->|Tìm kiếm từ khớp trong DB| D[(Bảng words)]
    B -->|Ánh xạ Text thành wordId| E[Lọc Bounding Box khớp với từ điển]
    E -->|Trả về JSON| F[Client: Vẽ các Box màu xanh lá đè lên ảnh]
```

### 2.2. Phương án và Mô hình OCR đề xuất

#### Phương án A: Sử dụng Cloud API (Khuyên dùng cho production)
*   **Mô hình:** **Google Cloud Vision API (Text Detection)**.
*   **Ưu điểm:**
    *   Khả năng nhận diện chữ Hán (Hanzi) chính xác nhất hiện nay, kể cả chữ viết tay, chữ nghệ thuật trên biển hiệu, chữ bị nghiêng/mờ.
    *   Trả về tọa độ chi tiết của từng từ (Bounding box dạng tỷ lệ % hoặc pixel) để Client vẽ trực quan.
*   **Nhược điểm:** Tốn chi phí API sau khi vượt quá hạn mức miễn phí (1000 lượt yêu cầu/tháng).

#### Phương án B: Sử dụng thư viện chạy ở Backend (Tự host - Miễn phí)
*   **Mô hình:** **PaddleOCR** (dựa trên PaddlePaddle của Baidu) hoặc **EasyOCR**.
*   **Lý do đề xuất:** PaddleOCR là mô hình mã nguồn mở tốt nhất thế giới hiện nay cho việc nhận diện ký tự tiếng Trung (độ chính xác vượt trội hơn hẳn Tesseract OCR).
*   **Triển khai:** Viết một dịch vụ nhỏ bằng Python (sử dụng FastAPI), gọi thư viện `paddleocr` để nhận diện và trả về tọa độ chữ cho Backend chính.

### 2.3. Thuật toán khớp từ vựng của Backend (Word Mapping Algorithm)

Khi OCR trả về danh sách các từ phát hiện được cùng tọa độ của chúng (ví dụ: phát hiện được từ `"中国"` tại tọa độ `[x: 120, y: 150]`), Backend cần ánh xạ chúng vào bảng cơ sở dữ liệu `words` để lấy thông tin từ vựng đầy đủ:

1.  **Truy vấn chính xác (Exact Match):**
    *   Tìm kiếm trong bảng `words` các bản ghi có `simplified = detected_text` hoặc `traditional = detected_text`.
    *   Nếu tìm thấy, lấy `word_id` và đính kèm vào thông tin bounding box.
2.  **Truy vấn cắt từ (Sub-string Tokenization):**
    *   Đôi khi OCR trả về một câu dài như `"我想喝茶"`.
    *   Backend sẽ chạy qua một bộ phân tách từ tiếng Trung (Chinese Segmenter) như thư viện **Jieba** (Python/Node.js) để tách câu thành mảng từ tố: `["我", "想", "喝", "茶"]`.
    *   Duyệt qua từng từ tố để truy vấn cơ sở dữ liệu. Nếu từ tố nào khớp với bảng `words` (ví dụ: `"喝"`, `"茶"`), ta sẽ tạo một bounding box nhỏ tương ứng cho từ vựng đó dựa trên tỷ lệ độ dài ký tự trong ô chữ nhật lớn của câu.
3.  **Dữ liệu trả về Client:**
    *   Trả về danh sách đối tượng chứa tọa độ `top, left, width, height` (dưới dạng phần trăm để tránh lỗi lệch khi đổi kích thước màn hình điện thoại) cùng với ID từ vựng `wordId` để Client gọi được tính năng `+ Study Word (SRS)`.
