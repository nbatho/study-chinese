# Thiết kế Tài liệu API Hệ thống Study Chinese

Tài liệu này định nghĩa hệ thống API RESTful (phiên bản `v1`) mà máy chủ (Server) cần cung cấp để phục vụ cho các chức năng của ứng dụng Study Chinese Client.

*   **Base URL:** `/api/v1`
*   **Định dạng dữ liệu:** `application/json`
*   **Xác thực:** Sử dụng JSON Web Token (JWT) gửi qua Header `Authorization: Bearer <token>`.

---

## 1. Cơ cấu Phản hồi và Mã lỗi Chuẩn (Standard Response & Error Codes)

Hệ thống API trả về phản hồi theo định dạng chuẩn hóa, giúp Client dễ dàng xử lý qua interceptor (đã được cấu hình trong [callApi.ts](file:///home/pe/Project/study-chinese/client/src/api/callApi.ts)).

### Phản hồi Thành công (Success Response)
```json
{
  "status": "success",
  "data": { ... }
}
```

### Phản hồi Thất bại (Failure Response - Lỗi Client 4xx)
```json
{
  "status": "fail",
  "errorCode": "INVALID_INPUT",
  "message": "Dữ liệu đầu vào không hợp lệ.",
  "details": {
    "field": "email",
    "issue": "Định dạng email sai"
  }
}
```

### Phản hồi Lỗi Hệ thống (Error Response - Lỗi Server 5xx)
```json
{
  "status": "error",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "message": "Máy chủ gặp sự cố. Vui lòng thử lại sau."
}
```

---

## 2. Danh sách các API Endpoints

### 2.1. Nhóm Xác thực (Authentication - `/auth`)

#### 1. Đăng ký tài khoản (Register)
Khởi tạo tài khoản mới cùng cấu hình mặc định và chuỗi học tập ban đầu.
*   **Endpoint:** `POST /auth/register`
*   **Xác thực:** Không yêu cầu
*   **Request Body:**
    ```json
    {
      "email": "learner@example.com",
      "password": "SecurePassword123",
      "name": "Nguyễn Văn A"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "accessToken": "eyJhbGciOi...",
        "user": {
          "id": "e5b8d2a6-c87d-411a-8921-69f8892182b8",
          "email": "learner@example.com",
          "name": "Nguyễn Văn A"
        }
      }
    }
    ```

#### 2. Đăng nhập (Login)
*   **Endpoint:** `POST /auth/login`
*   **Xác thực:** Không yêu cầu
*   **Request Body:**
    ```json
    {
      "email": "learner@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "accessToken": "eyJhbGciOi...",
        "user": {
          "id": "e5b8d2a6-c87d-411a-8921-69f8892182b8",
          "email": "learner@example.com",
          "name": "Nguyễn Văn A"
        }
      }
    }
    ```

#### 3. Đăng xuất (Logout)
*   **Endpoint:** `POST /auth/logout`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": null
    }
    ```

---

### 2.2. Nhóm Người dùng & Thống kê (User & Stats - `/users`)

#### 1. Lấy thông tin cấu hình cá nhân (Get User Profile)
Đồng bộ hóa dữ liệu hồ sơ của `globalStore.profile`.
*   **Endpoint:** `GET /users/profile`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "profile": {
          "name": "Nguyễn Văn A",
          "avatar": "🐼",
          "startLevel": "beginner",
          "goalPurpose": "travel",
          "dailyMinutes": 15,
          "showPinyin": true,
          "audioAutoPlay": true,
          "appAppearance": "light",
          "hasCompletedOnboarding": true,
          "joinDate": "2026-06-09T12:00:00Z"
        },
        "streak": {
          "current": 5,
          "best": 12,
          "lastStudyDateKey": "2026-06-09"
        }
      }
    }
    ```

#### 2. Cập nhật hồ sơ & cấu hình cài đặt (Update Profile)
Tương ứng với hàm `globalStore.updateProfile()`.
*   **Endpoint:** `PUT /users/profile`
*   **Xác thực:** Yêu cầu Token
*   **Request Body (Partial Update):**
    ```json
    {
      "name": "Nguyễn Văn A (Đã Sửa)",
      "avatar": "🐯",
      "showPinyin": false,
      "audioAutoPlay": false,
      "appAppearance": "dark"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "profile": {
          "name": "Nguyễn Văn A (Đã Sửa)",
          "avatar": "🐯",
          "startLevel": "beginner",
          "goalPurpose": "travel",
          "dailyMinutes": 15,
          "showPinyin": false,
          "audioAutoPlay": false,
          "appAppearance": "dark",
          "hasCompletedOnboarding": true,
          "joinDate": "2026-06-09T12:00:00Z"
        }
      }
    }
    ```

#### 3. Lấy dữ liệu thống kê hoạt động (Get Statistics)
Tương ứng hàm `globalStore.getRecentStats()`.
*   **Endpoint:** `GET /users/stats`
*   **Xác thực:** Yêu cầu Token
*   **Query Parameters:**
    *   `days`: số ngày thống kê (Mặc định: 7)
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "stats": [
          {
            "dateKey": "2026-06-09",
            "xp": 45,
            "minutesStudied": 15,
            "lessonsCompleted": 1,
            "wordsReviewed": 5,
            "exercisesCorrect": 12,
            "exercisesTotal": 15
          },
          {
            "dateKey": "2026-06-08",
            "xp": 20,
            "minutesStudied": 8,
            "lessonsCompleted": 0,
            "wordsReviewed": 4,
            "exercisesCorrect": 8,
            "exercisesTotal": 10
          }
        ]
      }
    }
    ```

#### 4. Ghi nhận tích lũy kinh nghiệm (Add Activity XP & Minutes)
Khi người dùng hoàn thành bài tập ngoài bài học hoặc tương tác giúp tăng điểm.
*   **Endpoint:** `POST /users/activity`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "xp": 10,
      "minutes": 2,
      "exercisesCorrect": 3,
      "exercisesTotal": 3
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "todayStats": {
          "dateKey": "2026-06-09",
          "xp": 55,
          "minutesStudied": 17,
          "lessonsCompleted": 1,
          "wordsReviewed": 5,
          "exercisesCorrect": 15,
          "exercisesTotal": 18
        },
        "streak": {
          "current": 5,
          "best": 12,
          "lastStudyDateKey": "2026-06-09"
        }
      }
    }
    ```

---

### 2.3. Nhóm Bài học (Lessons - `/lessons`)

#### 1. Lấy danh sách bài học và tiến trình tương ứng (Get Lessons List)
*   **Endpoint:** `GET /lessons`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "lessons": [
          {
            "id": "l1_1",
            "title": "Pinyin Basics",
            "subtitle": "Initials & finals",
            "hskLevel": 1,
            "order": 1,
            "skill": "pinyin",
            "estimatedMinutes": 7,
            "xpReward": 20,
            "completedAt": "2026-06-09T12:30:00Z",
            "bestAccuracy": 93.33,
            "attempts": 2
          },
          {
            "id": "l1_2",
            "title": "The Four Tones",
            "subtitle": "High, rising, dip, falling",
            "hskLevel": 1,
            "order": 2,
            "skill": "tones",
            "estimatedMinutes": 8,
            "xpReward": 25,
            "completedAt": null,
            "bestAccuracy": 0,
            "attempts": 0
          }
        ]
      }
    }
    ```

#### 2. Lấy chi tiết nội dung một bài học (Get Lesson Details)
Trả về cấu trúc đầy đủ của bài học gồm từ mới, ngữ pháp, đoạn hội thoại và danh sách bài tập câu hỏi để làm.
*   **Endpoint:** `GET /lessons/:id`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "lesson": {
          "id": "l1_3",
          "title": "Greetings",
          "subtitle": "Hello & goodbye",
          "hskLevel": 1,
          "order": 3,
          "skill": "vocabulary",
          "estimatedMinutes": 6,
          "xpReward": 20,
          "intro": "Basic greetings let you start conversations politely.",
          "newWords": [
            {
              "id": "wd_hello",
              "simplified": "你好",
              "traditional": "你好",
              "pinyin": "nǐ hǎo",
              "english": "hello",
              "partOfSpeech": "phrase"
            }
          ],
          "grammar": [
            {
              "id": "gp_1_3_1",
              "pattern": "A + B",
              "explanation": "Giải thích ngữ pháp...",
              "tips": ["Mẹo 1", "Mẹo 2"],
              "examples": [
                {
                  "simplified": "你好！",
                  "traditional": "你好！",
                  "pinyin": "Nǐ hǎo!",
                  "english": "Hello!"
                }
              ]
            }
          ],
          "dialogue": {
            "id": "d1_3",
            "title": "Meeting a friend",
            "scenario": "You run into a friend on the street.",
            "lines": [
              {
                "id": "dl1_3_1",
                "speaker": "A",
                "isUser": true,
                "simplified": "你好！",
                "traditional": "你好！",
                "pinyin": "Nǐ hǎo!",
                "english": "Hello!"
              }
            ]
          },
          "exercises": [
            {
              "id": "e1_3_1",
              "kind": "multipleChoice",
              "prompt": "你好 means…",
              "options": ["goodbye", "hello", "sorry", "thank you"],
              "correctIndex": 1,
              "correctText": "hello"
            }
          ]
        }
      }
    }
    ```

#### 3. Nộp kết quả hoàn thành bài học (Submit Lesson Completion)
Tương ứng với hàm `globalStore.completeLesson()`. Hệ thống sẽ tính XP, cập nhật tiến trình bài học, kích hoạt chuỗi Streak và tự động đưa từ vựng mới vào danh sách ôn tập SRS.
*   **Endpoint:** `POST /lessons/:id/complete`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "accuracy": 85.50,
      "minutes": 7
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "xpEarned": 20,
        "newWordsEnrolled": ["wd_hello", "wd_goodbye"],
        "progress": {
          "lessonId": "l1_3",
          "completedAt": "2026-06-09T12:55:00Z",
          "bestAccuracy": 85.50,
          "attempts": 1
        },
        "streak": {
          "current": 6,
          "best": 12,
          "lastStudyDateKey": "2026-06-09"
        }
      }
    }
    ```

---

### 2.4. Nhóm Từ vựng & Ôn tập SRS (Vocab & SRS - `/vocab`, `/srs`)

#### 1. Tra cứu/Tìm kiếm từ điển từ vựng (Search Vocabulary)
*   **Endpoint:** `GET /vocab`
*   **Xác thực:** Yêu cầu Token
*   **Query Parameters:**
    *   `q`: Từ khóa tìm kiếm (chữ Hán, Pinyin hoặc nghĩa tiếng Anh) (Không bắt buộc)
    *   `hsk`: Lọc theo cấp độ HSK (1-3) (Không bắt buộc)
    *   `category`: Lọc theo chủ đề (Không bắt buộc)
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "vocab": [
          {
            "id": "wd_hello",
            "simplified": "你好",
            "traditional": "你好",
            "pinyin": "nǐ hǎo",
            "tones": [3, 3],
            "english": "hello",
            "partOfSpeech": "phrase",
            "hskLevel": 1,
            "category": "Greetings"
          }
        ]
      }
    }
    ```

#### 2. Lấy danh sách thẻ nhớ cần ôn tập hôm nay (Get Due SRS Cards)
Tương ứng với hàm `globalStore.getDueSRSCards()`.
*   **Endpoint:** `GET /srs/due`
*   **Xác thực:** Yêu cầu Token
*   **Query Parameters:**
    *   `limit`: Giới hạn số lượng thẻ ôn tập trả về (Mặc định: 20)
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "cards": [
          {
            "wordId": "wd_hello",
            "simplified": "你好",
            "pinyin": "nǐ hǎo",
            "english": "hello",
            "dueCardDetails": {
              "easeFactor": 2.50,
              "intervalDays": 0.00,
              "repetitions": 0,
              "dueDate": "2026-06-09T12:00:00Z",
              "masteryLevel": "new"
            }
          }
        ]
      }
    }
    ```

#### 3. Báo cáo kết quả đánh giá ôn tập SRS (Review SRS Card)
Tương ứng với hàm `globalStore.reviewSRS()`. Tính toán thời gian hẹn gặp lại tiếp theo dựa vào mức độ đánh giá chất lượng ghi nhớ (SuperMemo-2).
*   **Endpoint:** `POST /srs/review`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "wordId": "wd_hello",
      "quality": "good" // CHECK (in 'again', 'hard', 'good', 'easy')
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "card": {
          "wordId": "wd_hello",
          "easeFactor": 2.50,
          "intervalDays": 1.00,
          "repetitions": 1,
          "dueDate": "2026-06-10T12:55:00Z",
          "masteryLevel": "learning",
          "correctStreak": 1,
          "wrongCount": 0
        },
        "xpEarned": 5,
        "todayWordsReviewed": 6
      }
    }
    ```

#### 4. Đưa một từ mới thủ công vào hệ thống ôn tập (Enroll SRS Word)
Tương ứng với hàm `globalStore.enrollSRS()`.
*   **Endpoint:** `POST /srs/enroll`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "wordId": "wd_water"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "enrolled": true
      }
    }
    ```

---

### 2.5. Nhóm Yêu thích & Danh sách tự chọn (Favorites & Custom Lists - `/favorites`, `/lists`)

#### 1. Chuyển trạng thái yêu thích từ vựng (Toggle Favorite Status)
Tương ứng hàm `globalStore.toggleFavorite()`.
*   **Endpoint:** `POST /favorites/toggle`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "wordId": "wd_hello"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "wordId": "wd_hello",
        "isFavorite": true
      }
    }
    ```

#### 2. Lấy toàn bộ danh sách tự tạo của người dùng (Get Custom Lists)
*   **Endpoint:** `GET /lists`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "lists": [
          {
            "id": "list_1701234567890",
            "name": "Từ vựng Du lịch",
            "emoji": "✈️",
            "wordIds": ["wd_airport", "wd_taxi"]
          }
        ]
      }
    }
    ```

#### 3. Tạo một danh sách tự chọn mới (Create Custom List)
*   **Endpoint:** `POST /lists`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "name": "Từ vựng Đồ ăn",
      "emoji": "🍜"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "list": {
          "id": "list_1701987654321",
          "name": "Từ vựng Đồ ăn",
          "emoji": "🍜",
          "wordIds": []
        }
      }
    }
    ```

#### 4. Xóa một danh sách tự chọn (Delete Custom List)
*   **Endpoint:** `DELETE /lists/:id`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": null
    }
    ```

#### 5. Thêm từ vựng vào danh sách tự chọn (Add Word to List)
*   **Endpoint:** `POST /lists/:id/words`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "wordId": "wd_beef"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "listId": "list_1701987654321",
        "wordIds": ["wd_beef"]
      }
    }
    ```

#### 6. Xóa từ vựng khỏi danh sách tự chọn (Remove Word from List)
*   **Endpoint:** `DELETE /lists/:id/words/:wordId`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "listId": "list_1701987654321",
        "wordIds": []
      }
    }
    ```

---

### 2.6. Nhóm Trợ lý Học tập AI (AI Tutor - `/ai-tutor`)

#### 1. Lấy danh sách các kịch bản hội thoại AI (Get Chat Scenarios)
Lấy danh sách các chủ đề hội thoại để hiển thị cho người dùng lựa chọn (ví dụ: Cửa hàng cafe, Khách sạn, Gọi xe taxi).
*   **Endpoint:** `GET /ai-tutor/scenarios`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "scenarios": [
          {
            "id": "cafe",
            "title": "At the Coffee Shop",
            "emoji": "☕",
            "description": "Practice ordering coffee, tea, and juice in Chinese.",
            "initialMessage": {
              "simplified": "欢迎光临！请问您要喝点什么？",
              "pinyin": "Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme?",
              "english": "Welcome! What would you like to drink?"
            }
          }
        ]
      }
    }
    ```

#### 2. Khởi tạo một phiên trò chuyện mới (Start Chat Session)
*   **Endpoint:** `POST /ai-tutor/sessions`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "scenarioId": "cafe" // Gửi null nếu muốn trò chuyện tự do (Free Talk)
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "session": {
          "id": "b182b8a6-c87d-411a-8921-69f8892182b8",
          "scenarioId": "cafe",
          "createdAt": "2026-06-09T12:55:00Z",
          "messages": [
            {
              "id": "msg_init_1701987650000",
              "role": "tutor",
              "simplified": "欢迎光临！请问您要喝点什么？",
              "pinyin": "Huānyíng guānglín! Qǐngwèn nín yào hē diǎn shénme?",
              "english": "Welcome! What would you like to drink?"
            }
          ]
        }
      }
    }
    ```

#### 3. Gửi tin nhắn trò chuyện và nhận phản hồi từ AI Tutor (Send Message)
Gửi câu nhập của học sinh lên Server, Server điều phối gọi LLM sinh câu trả lời tiếng Trung giản thể, dịch nghĩa, phiên âm pinyin và kiểm tra lỗi ngữ pháp/đánh máy để gợi ý sửa lỗi (Correction).
*   **Endpoint:** `POST /ai-tutor/sessions/:id/messages`
*   **Xác thực:** Yêu cầu Token
*   **Request Body:**
    ```json
    {
      "text": "wo xiang yao ni hao"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "userMessage": {
          "id": "msg_user_1701987660000",
          "role": "user",
          "simplified": "wo xiang yao ni hao"
        },
        "tutorMessage": {
          "id": "msg_tutor_1701987661000",
          "role": "tutor",
          "simplified": "你好！请问你需要点什么？",
          "pinyin": "Nǐ hǎo! Qǐngwèn nǐ xūyào diǎn shénme?",
          "english": "Hello! Excuse me, what do you need?",
          "correction": {
            "original": "wo xiang yao ni hao",
            "improved": "我想说你好 (Wǒ xiǎng shuō nǐ hǎo)",
            "explanation": "Lời khuyên: Sử dụng dấu thanh điệu chuẩn hoặc sửa từ khóa để câu trôi chảy hơn."
          }
        },
        "xpEarned": 10,
        "todayStats": {
          "xp": 65,
          "minutesStudied": 17
        }
      }
    }
    ```

---

### 2.7. Nhận diện hình ảnh OCR và Dịch (Camera Scan OCR - `/ocr`)

#### 1. Nhận diện chữ Hán từ camera/ảnh tải lên (Scan Image)
*   **Endpoint:** `POST /ocr/scan`
*   **Xác thực:** Yêu cầu Token
*   **Request Body (Multipart Form-Data hoặc Base64 JSON):**
    ```json
    {
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
    ```
*   **Response (200 OK):**
    Trả về danh sách các vùng phát hiện chữ Hán (bounding boxes) khớp với từ vựng hiện có trong CSDL của ứng dụng.
    ```json
    {
      "status": "success",
      "data": {
        "boxes": [
          {
            "id": "box_1",
            "wordId": "wd_china",
            "text": "中国",
            "pinyin": "zhōng guó",
            "english": "China",
            "top": 35.5,
            "left": 30.0,
            "width": 20.0,
            "height": 12.0
          },
          {
            "id": "box_2",
            "wordId": "wd_station",
            "text": "站",
            "pinyin": "zhàn",
            "english": "Station / Stop",
            "top": 35.5,
            "left": 52.0,
            "width": 12.0,
            "height": 12.0
          }
        ]
      }
    }
    ```

---

### 2.8. Nhóm Thành tựu & Trang chủ (Achievements & Utilities)

#### 1. Lấy danh sách thành tựu (Get Achievements)
*   **Endpoint:** `GET /achievements`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "achievements": [
          {
            "id": "first_lesson",
            "title": "First Step",
            "description": "Complete your first lesson",
            "emoji": "👣",
            "targetValue": 1,
            "category": "lessons",
            "unlockedAt": "2026-06-09T12:30:00Z"
          },
          {
            "id": "streak_3",
            "title": "Warming Up",
            "description": "3-day streak",
            "emoji": "🔥",
            "targetValue": 3,
            "category": "streak",
            "unlockedAt": null
          }
        ]
      }
    }
    ```

#### 2. Kích hoạt mở khóa thành tựu đặc biệt (Unlock Special Achievement)
*   **Endpoint:** `POST /achievements/:id/unlock`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "unlocked": true,
        "achievement": {
          "id": "perfect_tone",
          "title": "Tone Master",
          "emoji": "🎵"
        }
      }
    }
    ```

#### 3. Tiện ích: Lấy câu khẩu hiệu hàng ngày & thư viện tra nhanh ngữ pháp (Get Daily Content & Grammar Library)
*   **Endpoint:** `GET /dashboard/daily-content`
*   **Xác thực:** Yêu cầu Token
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "phrase": {
          "simplified": "一步一个脚印",
          "pinyin": "Yī bù yī gè jiǎo yìn",
          "english": "One step at a time.",
          "note": "Steady progress is the key to mastery."
        },
        "grammarLibrary": [
          {
            "id": "g_shi",
            "title": "是 (shì) — to be",
            "pattern": "Subject + 是 + Noun",
            "summary": "Used to equate a subject with a noun.",
            "examples": [
              {
                "simplified": "我是学生。",
                "pinyin": "Wǒ shì xuéshēng.",
                "english": "I am a student."
              }
            ]
          }
        ]
      }
    }
    ```
