# BẢNG BÀN GIAO TIẾN TRÌNH CÔNG VIỆC & NHẬT KÝ NÂNG CẤP DỰ ÁN
> **Dành cho AI / Lập trình viên tiếp tục phát triển trên máy tính khác**  
> *Thời gian cập nhật:* 19/09/2026  
> *Vị trí dự án:* `D:\OneDrive RINNDL\OneDrive\RINNDL\Quan ly lop hoc (webapp)`  
> *Công nghệ:* Next.js 14 (App Router), Tailwind CSS, Lucide React, FullCalendar, Prisma ORM, SQLite (`prisma/dev.db`).

---

## ⚠️ QUY TẮC CỐT LÕI CẦN ĐỌC TRƯỚC KHI LÀM TIẾP (TRÁNH LÀM NHẦM)
1. **Tuyệt đối KHÔNG chạy `npx prisma migrate reset`:** Lệnh này sẽ xóa sạch dữ liệu thực tế trong `prisma/dev.db`.
2. **Cơ sở dữ liệu:** Toàn bộ dữ liệu nằm ở file cục bộ `prisma/dev.db`. Đã có bản sao lưu an toàn tại `database_backup/dev_backup.db`.
3. **Đơn vị quản lý học viên là GIỜ (không phải buổi):**
   - Quỹ giờ của học viên tính bằng **Tổng số giờ gói** (hỗ trợ số lẻ thập phân 0.5h).
   - Đơn giá tính theo **Đơn giá / 1 Giờ** (không phải đơn giá/buổi).
   - Tiến độ học và số giờ còn lại được hiển thị và khấu trừ theo **giờ thực tế** (dựa trên `durationHours` của `LessonRecord`).
4. **Không dùng VietQR / Mã chuyển tiền ngân hàng:** Người dùng đã yêu cầu bỏ toàn bộ phần mã QR và ngân hàng; trang Cài đặt chỉ lưu: **Tên, Email, SĐT giáo viên**.
5. **Cách khởi động app trên máy tính mới:**
   - Lần đầu: Chạy `cai_dat_thu_vien.bat` (hoặc `npm install && npx prisma generate`).
   - Mở app: Chạy `khoi_dong_app.bat` (hoặc `npm run dev`).

---

## 📌 DANH SÁCH CHI TIẾT CÁC CÔNG VIỆC ĐÃ HOÀN THÀNH

### 1. Quản Lý Học Viên Theo Giờ Học (Thay Thế Quản Lý Theo Buổi)
* **Yêu cầu từ người dùng:** "chỗ này sửa lại là tổng số giờ, và đơn giá/ giờ cho từng học viên, trong bảng tổng hợp học viên thì sửa lại cột số giờ còn lại, tiến độ học là giờ luôn nhé"
* **Đã thực hiện:**
  - **Schema Prisma (`prisma/schema.prisma`):**
    - `Student`: `totalHours` (mặc định 20.0), `pricePerHour` (đơn giá/giờ), `completedHours` (giờ đã học), `remainingHours` (giờ còn lại).
    - `LessonRecord`: `durationHours` (thời lượng buổi học tính bằng giờ thực tế, ví dụ 1.5h).
  - **Trang Danh sách Học viên (`src/app/students/page.tsx`):**
    - Form thêm/sửa học viên: Nhập **Tổng số giờ** (step 0.5) và **Đơn giá / giờ (VNĐ)**. Tự động tính học phí dự kiến: `totalHours * pricePerHour`.
    - Cột **Tiến Độ Học**: Hiển thị dạng `{completedHours} / {totalHours} giờ` (ví dụ: `1.5 / 20 giờ`) kèm thanh % màu sắc.
    - Cột **Số Giờ Còn Lại**: Hiển thị badge nổi bật (ví dụ: `Còn 18.5 giờ`), tự động đổi màu cảnh báo cam/đỏ khi sắp hết giờ.
  - **Trang Chi tiết Học viên (`src/app/students/[id]/page.tsx`):**
    - Đồng bộ thống kê theo giờ: Tổng số giờ, Đã hoàn thành (giờ), Còn lại (giờ).
    - Nhật ký từng buổi học hiển thị rõ thời lượng và khung giờ thực tế.
  - **Trang Học phí (`src/app/tuition/page.tsx`):**
    - Cập nhật số giờ còn lại và tổng tiền dựa trên đơn giá/giờ.

---

### 2. Tinh Gọn Cài Đặt Giáo Viên & Bỏ Phần Mã Chuyển Tiền VietQR
* **Yêu cầu từ người dùng:** "phần cài đặt và mã QR đang lỗi, ngoài ra bỏ phần mã chuyển tiền đi không cần thiết, chỉ cần cài đặt thông tin giáo viên là được rồi, bao gồm tên, email, sđt"
* **Đã thực hiện:**
  - **Khắc phục lỗi:** Route API `src/app/api/profile/route.ts` được thêm `export const dynamic = 'force-dynamic'` để tránh bị Next.js cache tĩnh trả về mã HTML gây lỗi `Unexpected token '<'`.
  - **Trang Cài Đặt (`src/app/settings/page.tsx`):**
    - Lược bỏ hoàn toàn: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản, mã QR VietQR.
    - Giữ lại 3 trường: **Họ và Tên Giáo Viên**, **Email**, **Số Điện Thoại / Zalo**.
    - Đổi tên mục Sidebar thành **"Cài đặt"** (gỡ chữ VietQR).
  - **Loại bỏ hiển thị mã QR trên toàn bộ hệ thống:**
    - Gỡ nút xem QR trên danh sách học viên (`/students`).
    - Thay thế khung QR trong trang chi tiết học viên (`/students/[id]`) và trang học phí (`/tuition`) bằng thẻ thông tin giáo viên phụ trách tinh gọn.

---

### 3. Lớp Học Nhiều Buổi Trong Tuần (2 Buổi/Tuần, 3 Buổi/Tuần) & Đổi Lịch Có Hiệu Lực
* **Yêu cầu từ người dùng:** "Vậy nếu 1 tuần học 2 buổi thì sao"
* **Đã thực hiện:**
  - **Trang Quản lý Lớp học (`src/app/classes/page.tsx`):**
    - Hỗ trợ chọn nhiều ngày học trong tuần: `[T2] [T3] [T4] [T5] [T6] [T7] [CN]`.
    - Thiết lập khung giờ riêng cho từng ngày (hoặc bấm nút "⚡ Áp dụng giờ buổi đầu cho tất cả").
    - Tự động nhân số ca học: ví dụ 2 buổi/tuần x 8 tuần = **16 ca học** tự động sinh lên lịch.
    - Thẻ lớp học hiển thị tóm tắt: `📅 Lịch: T2, T5 (19:00 - 20:30) • 16 ca trên lịch`.
  - **Tính năng Đổi Lịch Học An Toàn:**
    - Có trường **Ngày bắt đầu hiệu lực** (`effectiveDate`).
    - Bảo toàn 100% các ca học trong quá khứ trước ngày hiệu lực (bảo lưu lịch sử điểm danh).
    - Chỉ hủy và tạo lại các ca học từ ngày hiệu lực trở đi theo lịch mới.

---

### 4. Thêm Khóa Học Trực Tiếp Trên Web UI & Bỏ Học Phí Mặc Định
* **Yêu cầu từ người dùng:** 
  - "muốn thêm 1 khóa học nào đó, tên gọi khác thì tôi thêm vào database kiểu gì"
  - "database bỏ phần học phí mặc định nhé"
* **Đã thực hiện:**
  - Bỏ trường học phí mặc định của khóa học (vì học phí được quản lý linh hoạt theo đơn giá/giờ của từng học viên).
  - Thêm nút **"+ Thêm Khóa Học"** trên header trang `/classes` và nút tiện ích **"+ Khóa học mới"** bên trong modal Tạo Lớp & Sửa Lớp.
  - Cho phép nhập Tên khóa học, Phân loại/Cấp độ (tag nhanh IELTS, TOEIC, B1, B2, Lớp 10, 11, 12...), Mô tả.
  - Tự động lưu vào SQLite và cập nhật danh sách chọn khóa học tức thì.
  - API endpoint: `src/app/api/courses/route.ts`.

---

### 5. Thời Khóa Biểu: Kéo Ra / Thu Vào Thời Gian Học (Drag-to-Resize & Sửa Giờ)
* **Yêu cầu từ người dùng:** "Phần thay đổi thời gian trong thời khóa biểu, có thể chọn kéo ra hoặc thu vào thời gian học được không, hiện tại đang fix thời gian theo khóa học đã đưa ra ban đầu, tuy nhiên thực tế có thể thay đổi"
* **Đã thực hiện:**
  - **Cấu hình FullCalendar (`src/app/calendar/page.tsx`):**
    - Bật `eventResizableFromStart={true}` và `eventDurationEditable={true}`: Cho phép kéo co giãn cả mép trên (giờ bắt đầu) và mép dưới (giờ kết thúc).
    - Bật `snapDuration="00:15:00"`: Bắt dính từng 15 phút mượt mà, không bị lệch phút lẻ.
    - Xử lý sự kiện `eventResize`: Gửi `PATCH /api/schedules` với `startTime` và `endTime` mới.
  - **Tùy biến giao diện Resizer (`src/app/globals.css`):**
    - Thêm CSS hiển thị tay nắm kéo co giãn `.fc-event-resizer` trực quan, chuột chuyển thành `ns-resize` (`↕`).
  - **Hộp công cụ chỉnh giờ trong Modal Chi Tiết Ca Học:**
    - Khối "Điều Chỉnh Giờ Học Ca Này": Cho phép sửa Ngày học, Giờ bắt đầu, Giờ kết thúc.
    - Hiển thị thời lượng xem trước tức thì (ví dụ: `1h 45p (1.8 giờ)`).
    - Nút "Lưu Thay Đổi Giờ Học" cập nhật trực tiếp vào database.
  - **Đồng bộ tự động sang Nhật ký học viên (`src/app/api/schedules/route.ts`):**
    - Khi cập nhật `startTime` hoặc `endTime` của một `Schedule`, API tự động tính toán lại `diffHours` và cập nhật trường `durationHours` trên `LessonRecord` tương ứng (nếu buổi đó đã được điểm danh).
  - **Tính năng Xóa ca học:**
    - Xóa từng ca học hoặc bật chế độ chọn nhiều để xóa hàng loạt buổi học trên lịch hoặc bảng danh sách.

---

### 6. Điểm Danh & Bổ Sung Giờ Học Thực Tế
* **Yêu cầu từ người dùng:**
  - "phần điểm danh tạm thời bỏ các mục này ra" (bỏ bài tập về nhà, chấm điểm, kỹ năng rườm rà)
  - "Mục điểm danh, bổ sung 2 trường thông tin là thời gian bắt đầu học và thời gian kết thúc học, vì có thể lịch đưa ra ban đầu cố định, nhưng có thể thời gian học muộn hơn, hoặc học nhiều hơn so với dự kiến"
* **Đã thực hiện:**
  - **Component `src/components/LessonModal.tsx`:**
    - Bổ sung trường `Thời Gian Học Thực Tế`: Ngày học, Giờ bắt đầu học, Giờ kết thúc học.
    - Tự động nạp giờ dự kiến của ca học, giáo viên có thể chỉnh sửa nếu học muộn hơn hoặc kéo dài hơn.
    - Tính thời lượng thực tế tự động (ví dụ: `1h 45p (105 phút)`).
    - Bỏ các trường chấm điểm, kỹ năng, bài tập; giữ lại: Thời gian học, Danh sách tick có mặt/vắng, Tên bài học (Topic), Ghi chú buổi học.
  - **API `src/app/api/lessons/route.ts`:**
    - Tính `durationHours = (actualEndTime - actualStartTime) / 3600000`.
    - Trừ trực tiếp số giờ này vào `remainingHours` của từng học viên có mặt.

---

## 📂 BẢN ĐỒ CÁC FILE QUAN TRỌNG TRONG DỰ ÁN

| Đường dẫn file | Nhiệm vụ chính |
| :--- | :--- |
| `src/app/calendar/page.tsx` | Thời khóa biểu, FullCalendar, kéo giãn ca học, modal đổi giờ, xóa ca |
| `src/app/classes/page.tsx` | Quản lý lớp học, tạo lớp 2 buổi/tuần, đổi lịch có ngày hiệu lực |
| `src/app/students/page.tsx` | Danh sách học viên theo giờ, tiến độ giờ học, cảnh báo sắp hết giờ |
| `src/app/students/[id]/page.tsx` | Hồ sơ chi tiết học viên, nhật ký các buổi học, giờ đã học/còn lại |
| `src/app/settings/page.tsx` | Cài đặt thông tin giáo viên (Tên, Email, SĐT), không dùng QR |
| `src/components/LessonModal.tsx` | Modal điểm danh tinh gọn, nhập giờ bắt đầu & kết thúc thực tế |
| `src/app/api/schedules/route.ts` | API lịch học (GET, POST nhiều buổi, PATCH đổi giờ/kéo dãn, DELETE đơn/hàng loạt) |
| `src/app/api/lessons/route.ts` | API lưu điểm danh & tính toán trừ giờ học viên |
| `src/app/api/students/route.ts` | API học viên (quản lý totalHours, pricePerHour, completedHours) |
| `src/app/api/profile/route.ts` | API lưu thông tin giáo viên (dynamic route) |
| `prisma/schema.prisma` | Cấu trúc dữ liệu đầy đủ của hệ thống |
| `prisma/dev.db` | File CSDL SQLite thực tế chứa dữ liệu |
| `database_backup/dev_backup.db`| Bản sao lưu SQLite |
| `cai_dat_thu_vien.bat` | Script 1-click cài đặt môi trường trên máy tính mới |
| `khoi_dong_app.bat` | Script 1-click mở ứng dụng tại `localhost:3000` |

---

## 💡 GỢI Ý CHO PHIÊN LÀM VIỆC TIẾP THEO (NẾU CẦN NÂNG CẤP THÊM)
1. **Xuất báo cáo PDF / Excel:** Xuất bảng điểm danh hoặc bảng tổng hợp giờ học của học viên gửi phụ huynh.
2. **Bộ lọc lịch học:** Lọc thời khóa biểu theo từng học viên hoặc từng lớp học cụ thể khi số lượng lớp tăng nhiều.
3. **Thông báo nhắc lịch:** Tích hợp chuông báo hoặc gửi tin nhắn Zalo/Email nhắc buổi học.
