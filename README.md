# Study Chinese Application (Học Tiếng Trung)

Dự án học tiếng Trung đa nền tảng, được tổ chức theo cấu trúc song song gồm Client (Giao diện người dùng) và Server (Backend quản lý dữ liệu học tập và API).

---

## 📂 Cấu trúc dự án

Dự án được phân chia rõ ràng thành hai thư mục chính:

*   **[client/](file:///d:/Project/study-chinese/client)**: Giao diện Front-end (React + TypeScript + Vite).
*   **[server/](file:///d:/Project/study-chinese/server)**: Mã nguồn Back-end (Node.js + ExpressJS + ES Modules).

---

## 🚀 Hướng dẫn khởi chạy dự án

### 1. Cài đặt các thư viện cần thiết

Trước khi khởi chạy, bạn cần cài đặt các dependency cho cả Client và Server.

Mở terminal tại thư mục gốc của dự án và chạy các lệnh tương ứng:

**Dành cho Frontend (Client):**
```bash
cd client
npm install
```

**Dành cho Backend (Server):**
```bash
cd server
npm install
```

---

### 2. Thiết lập Biến Môi Trường (Environment Variables)

*   Tại thư mục `/server`, sao chép file `.env.example` thành `.env`:
    ```bash
    cp .env.example .env
    ```
*   Mở file `.env` và tùy chỉnh các tham số kết nối hoặc cổng kết nối nếu cần (mặc định là cổng `5000` và kết nối tới `http://localhost:5173`).

---

### 3. Chạy Dự Án trong Môi trường Development

#### Khởi động Server (Backend)
```bash
cd server
npm run dev
```
> Server sẽ tự động chạy tại [http://localhost:5000](http://localhost:5000). Chế độ chạy qua `nodemon` sẽ giúp server tự động cập nhật khi bạn chỉnh sửa code.

#### Khởi động Client (Frontend)
```bash
cd client
npm run dev
```
> Client sẽ chạy tại [http://localhost:5173](http://localhost:5173).

---

## 🌐 Các Endpoint API Hiện Có (Backend)

Backend cung cấp các API endpoint mặc định dưới tiền tố `/api`:

| Phương thức | Endpoint | Yêu cầu xác thực | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Không | Kiểm tra trạng thái hoạt động của server |
| `GET` | `/api/words` | Không | Lấy danh sách từ vựng tiếng Trung mẫu (Hán tự, Pinyin, dịch nghĩa) |
| `GET` | `/api/profile` | Có (Bearer Token) | Lấy thông tin tài khoản đang đăng nhập (mock auth) |

---

## 🛠️ Công nghệ sử dụng

### Client (Frontend)
*   **React 19**
*   **TypeScript**
*   **Vite** (Công cụ build nhanh chóng)
*   **Lucide React** (Bộ icon hiện đại)

### Server (Backend)
*   **Node.js (ES Modules)**
*   **ExpressJS** (Web Framework)
*   **Cors** (Xử lý chia sẻ tài nguyên nguồn gốc chéo)
*   **Dotenv** (Quản lý biến môi trường)
