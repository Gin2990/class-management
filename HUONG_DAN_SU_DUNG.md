# HƯỚNG DẪN CÀI ĐẶT & SỬ DỤNG HỆ THỐNG QUẢN LÝ LỚP HỌC (WEBAPP)

Tài liệu này hướng dẫn chi tiết cách chạy ứng dụng trên máy tính hiện tại cũng như chuyển sang sử dụng trên **máy tính khác** một cách nhanh chóng và an toàn.

---

## 🚀 1. HƯỚNG DẪN NHANH TRÊN MÁY TÍNH MỚI (CHỈ 2 BƯỚC)

Thư mục dự án này nằm trong **OneDrive** (`OneDrive/RINNDL/Quan ly lop hoc (webapp)`). Do đó khi bạn đăng nhập OneDrive trên máy tính khác, toàn bộ mã nguồn và dữ liệu sẽ tự động đồng bộ sang.

Khi mở thư mục trên máy tính mới:

### Yêu cầu tiên quyết:
* Máy tính đã cài đặt **Node.js** (Khuyên dùng phiên bản 18, 20 hoặc 22 LTS). Tải tại: [https://nodejs.org/](https://nodejs.org/)

### Bước 1: Cài đặt thư viện lần đầu trên máy mới
* Nhấp đúp chuột vào file: **`cai_dat_thu_vien.bat`**
* *(Hoặc mở CMD/PowerShell tại thư mục này và gõ: `npm install && npx prisma generate`)*

### Bước 2: Khởi động hệ thống
* Nhấp đúp chuột vào file: **`khoi_dong_app.bat`**
* Trình duyệt sẽ tự động mở địa chỉ: **[http://localhost:3000](http://localhost:3000)**
* *(Hoặc mở terminal gõ: `npm run dev`)*

---

## 🗄️ 2. DỮ LIỆU & CƠ SỞ DỮ LIỆU (DATABASE)

* **Cơ sở dữ liệu chính:** `prisma/dev.db` (Dạng SQLite cục bộ, không phụ thuộc vào Internet hay máy chủ ngoài).
* **Bản sao lưu an toàn (Backup):** `database_backup/dev_backup.db`
* Mọi dữ liệu về học viên, điểm danh, thời khóa biểu, lớp học đều được lưu trữ trực tiếp trong file này. Bạn chỉ cần giữ nguyên thư mục là toàn bộ dữ liệu không bao giờ bị mất.

---

## 🌟 3. TỔNG HỢP CÁC TÍNH NĂNG ĐÃ TRIỂN KHAI HOÀN CHỈNH

### 1. Quản Lý Học Viên Theo Giờ Học (Thay Thế Quản Lý Theo Buổi)
* **Gói giờ & Đơn giá:** Thiết lập số giờ gói (VD: 20 giờ, 30 giờ) và đơn giá/giờ (VD: 250.000đ/giờ). Hệ thống tự nhân học phí dự kiến.
* **Tiến độ học thực tế:** Cột **Tiến độ học** hiển thị rõ ràng số giờ đã học / tổng giờ gói (VD: `1.5 / 20 giờ`) kèm thanh % trực quan.
* **Cột Số giờ còn lại:** Hiển thị số giờ còn lại (VD: `Còn 18.5 giờ`), tự động đổi màu cảnh báo cam/đỏ khi học viên sắp hết giờ học.
* **Tự động khấu trừ:** Khi điểm danh buổi học (VD: từ 19:00 đến 20:30 = 1.5 giờ), hệ thống tự động trừ 1.5 giờ vào quỹ giờ của học viên.

### 2. Quản Lý Lớp Học & Lịch Học Linh Hoạt (2 Buổi / Tuần)
* **Tạo lớp nhiều buổi/tuần:** Hỗ trợ chọn nhanh các ngày trong tuần (T2, T3, T4, T5, T6, T7, CN), tự động sinh đầy đủ ca học trên Thời khóa biểu cho 4, 8, 12, 16... tuần.
* **Đổi lịch có ngày hiệu lực:** Cho phép đổi sang lịch học mới từ một ngày chỉ định (bảo lưu 100% lịch sử các buổi học trước đó, chỉ cập nhật các buổi tương lai).
* **Thêm khóa học mới:** Bấm nút `+ Thêm Khóa Học` trên giao diện web để thêm bất kỳ khóa học nào mà không cần chạm vào CSDL.

### 3. Thời Khóa Biểu Thông Minh
* **Kéo thả co giãn giờ học (Drag-to-Resize):** Di chuột vào cạnh trên hoặc cạnh dưới của khối ca học trên lịch tuần/ngày để kéo dài hoặc thu ngắn giờ học (bước nhảy chuẩn 15 phút).
* **Điều chỉnh giờ chi tiết trong Modal:** Nhấp vào ca học để chỉnh lại Ngày học, Giờ bắt đầu, Giờ kết thúc với thời lượng xem trước thời gian thực.
* **Đồng bộ tự động:** Khi co giãn hoặc đổi giờ ca học, hệ thống tự đồng bộ lại thời lượng của bản ghi điểm danh tương ứng.
* **Xóa buổi học:** Hỗ trợ xóa từng buổi học riêng lẻ hoặc chế độ chọn nhiều để xóa hàng loạt ca học.

### 4. Điểm Danh & Giờ Học Thực Tế
* Bổ sung mục **Thời Gian Học Thực Tế** (Bắt đầu học & Kết thúc học).
* Linh hoạt điều chỉnh khi ca học bắt đầu muộn hơn hoặc kéo dài hơn dự kiến.
* Tự động tính thời lượng và cập nhật vào tiến độ học tập của từng học viên.

### 5. Cài Đặt Thông Tin Giáo Viên
* Trang **Cài đặt** tinh gọn, lưu Họ tên, Email, Số điện thoại/Zalo của giáo viên.
* Đã lược bỏ phần mã QR VietQR không cần thiết, tối ưu hóa giao diện đơn giản, hiện đại và tập trung.

---

## 🛠️ 4. CÁC LỆNH HỮU ÍCH KHI SỬ DỤNG TERMINAL

| Lệnh | Công dụng |
| :--- | :--- |
| `npm run dev` | Khởi động server môi trường phát triển (tự động cập nhật code khi sửa) |
| `npm run build` | Biên dịch toàn bộ dự án để chạy môi trường Production siêu mượt |
| `npm start` | Chạy ứng dụng đã build ở chế độ Production |
| `npx prisma studio` | Mở giao diện trực quan xem & chỉnh sửa toàn bộ dữ liệu database qua web |
| `npx prisma generate` | Đồng bộ cấu trúc dữ liệu schema với TypeScript |

---

*Hệ thống được phát triển hoàn thiện, ổn định và sẵn sàng sử dụng lâu dài.*
