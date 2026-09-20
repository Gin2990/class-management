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

### 7. Tách Biệt Việc Xếp Lớp Sang Quản Lý Lớp Học & Bảo Toàn Cột "Lớp Đang Học"
* **Yêu cầu từ người dùng:** "cái phần chỉnh sửa học viên bỏ phần xếp lớp học này đi, phần xếp lớp đã đưa vào phần quản lý lớp học rồi, tuy nhiên trong phần tổng quan học viên thì vẫn có cột lớp đang học, dữ liệu thì lấy từ bên quản lý lớp học đưa về"
* **Đã thực hiện:**
  - **Form Thêm / Sửa Học Viên (`src/app/students/page.tsx`):**
    - Bỏ hoàn toàn phần chọn lớp `2. XẾP LỚP HỌC` (dropdown chọn lớp) khỏi cả 2 modal: Thêm mới và Chỉnh sửa học viên.
    - Đánh số thứ tự lại các mục: `1. Thông tin cá nhân`, `2. Gói giờ học & Đơn giá`, `Các Đợt Đóng Học Phí`.
    - `handleUpdateStudent` không gửi trường `classGroupId` để tránh xóa đè các lớp học của học viên.
  - **API Cập Nhật Học Viên (`src/app/api/students/[id]/route.ts`):**
    - Gỡ bỏ logic tự động xóa/ghi đè `classMember` khi cập nhật học viên. Toàn bộ quan hệ thành viên lớp (`classMember`) được bảo toàn 100% và quản lý tập trung ở `/classes`.
  - **Bảng Tổng Quan Học Viên (`src/app/students/page.tsx`):**
    - Cột **"LỚP ĐANG HỌC"** vẫn được duy trì nguyên vẹn ở vị trí thứ 2.
    - Dữ liệu được nạp trực tiếp từ quan hệ `ClassMember -> ClassGroup` của mô-đun Quản lý lớp học, hiển thị badge tên lớp kèm icon `GraduationCap` đẹp mắt. Nếu chưa xếp lớp sẽ hiển thị `Chưa xếp lớp`.

---

### 8. Bảng Điểm Danh & Nhật Ký Khóa Học Tinh Gọn, Hiện Đại Trong Hồ Sơ Học Viên
* **Yêu cầu từ người dùng:** "làm tương tự thôi, chứ k phải bắt chước hoàn toàn, như cái dấu tick đâu cần thiết, điểm danh bên thời khóa biểu là nó tự nhảy rồi, làm sao cho nó dễ nhìn lại"
* **Đã thực hiện:**
  - **Trang Hồ Sơ Chi Tiết Học Viên (`src/app/students/[id]/page.tsx`):**
    - Thiết kế lại với phong cách UI hiện đại, thanh thoát, thoáng đãng, dễ nhìn:
      - **Bỏ hoàn toàn cột dấu tick `Done` không cần thiết:** Vì buổi học đã được điểm danh từ thời khóa biểu là tự động ghi nhận vào đây.
      - **Các cột hiển thị rõ ràng, khoa học:**
        1. **`Buổi`**: Huy hiệu số thứ tự buổi học (`#1, #2, #3...`), hỗ trợ nút đảo chiều thứ tự (`Buổi 1 ➔ N` hoặc `Mới nhất trước`).
        2. **`Ngày Học`**: Định dạng ngày thứ tiếng Việt chuẩn (`Thứ Năm, 16/07/2026`).
        3. **`Khung Giờ`**: Giờ học thực tế (`18:00 - 19:30`).
        4. **`Thời Lượng`**: Huy hiệu màu xanh ngọc nổi bật (`1.5 giờ`, `1.0 giờ`).
        5. **`Nội Dung Bài Học`**: Tên bài học / Topic rõ nét.
        6. **`Ghi Chú / Nhận Xét`**: Nhận xét của giáo viên, bài tập về nhà.
        7. **`Thao Tác`**: Nút sửa/xóa nhanh trên từng dòng khi rê chuột.
      - **Khối Tổng Kết Khóa Học Dưới Bảng (Rất dễ nhìn, chia 3 cột gọn gàng):**
        - **Cột 1 (Quỹ giờ học):** Tổng số giờ gói, Số giờ đã học kèm thanh tiến độ %, Số giờ còn lại kèm cảnh báo màu.
        - **Cột 2 (Học phí khóa học):** Đơn giá / 1 giờ, Số giờ đăng ký, Tổng học phí dự kiến.
        - **Cột 3 (Lịch đóng học phí):** Danh sách các đợt đóng với số tiền, hạn đóng và huy hiệu *Đã đóng / Chưa đóng*.
      - **Công cụ tiện ích:**
        - Nút **"🖨️ In Bảng"**: Hỗ trợ in trang sạch đẹp (ẩn thanh điều hướng).
        - Nút **"📋 Copy Báo Cáo"**: Tự động chuyển toàn bộ bảng thành văn bản gửi nhanh qua Zalo/Email cho phụ huynh.
        - Nút **"+ Ghi Nhận Buổi Học"**: Mở modal điểm danh buổi mới trực tiếp tại trang cá nhân.
  - **API Buổi Học (`src/app/api/lessons/route.ts`):**
    - Bổ sung `PATCH` và `DELETE` để chỉnh sửa hoặc xóa nhanh bản ghi buổi học trực tiếp từ bảng điểm danh.

---

### 9. Tùy Biến Tiêu Đề Bảng Hồ Sơ Học Viên Theo Cú Pháp & Màu Sắc Chuẩn Form Mẫu
* **Yêu cầu từ người dùng:** "thay đổi tiêu đề của từng học viên như hình mẫu, cú pháp sẽ là [tên khóa học] COURSE FOR [tên học viên] ([tổng số giờ])" (kèm 2 ảnh chụp mẫu so sánh).
* **Đã thực hiện:**
  - **Trang Chi Tiết Học Viên (`src/app/students/[id]/page.tsx`):**
    - Thiết lập hàm nhận diện tên khóa học tự động và thông minh `getCourseDisplayName`:
      - Tách tiền tố trước dấu gạch ngang từ tên lớp (VD: `C1 - Sarah + Andy` ➔ `C1`, `IELTS 6.5 - Yến Ngọc` ➔ `IELTS 6.5`, `B1 - Linda` ➔ `B1`).
      - Nhận diện `level` chuẩn từ bảng Course (`B1`, `B2`, `C1`, `IELTS`, `G6`...).
      - Tự động chuẩn hóa chữ in hoa (UPPERCASE).
    - Cập nhật tiêu đề bảng theo đúng 100% cú pháp và màu sắc trong ảnh mẫu:
      - `[tên khóa học] COURSE FOR `: In hoa, chữ đậm màu đỏ đậm (`#990000`).
      - `[tên học viên]`: In hoa, chữ đậm màu xanh dương (`#0000ff`).
      - `([tổng số giờ] hours)`: Chữ đậm màu đen chuẩn (`text-slate-900 font-black`).
      - Ví dụ thực tế hiển thị: **`C1 COURSE FOR ANDY (20 hours)`**, **`B1 COURSE FOR LINDA (120 hours)`**.
    - Dòng phụ bên dưới hiển thị ngắn gọn thông tin lớp và tiến độ: `Lớp: C1 - Sarah + Andy • Đã học: 1.5 giờ (8%) • Còn lại: 18.5 giờ`.
    - Đồng bộ hóa định dạng này vào cả tính năng **"Copy Báo Cáo"** và **"Copy Tin Báo Cáo Phụ Huynh"** để khi gửi Zalo / SMS cho phụ huynh luôn đồng nhất phong cách.

---

### 10. Chuẩn Bị Đẩy Database Lên Supabase & Sẵn Sàng Deploy Vercel Qua GitHub
* **Yêu cầu từ người dùng:** "OK, bây giờ đẩy toàn bộ database lên supabase, và commit cái này lên github để deploy qua vercel giúp mình"
* **Đã thực hiện:**
  - **Trích xuất toàn bộ dữ liệu SQLite hiện tại:**
    - Tạo script tự động `scripts/dump-sqlite.ts` (lệnh `npm run db:dump`).
    - Đã xuất thành công 100% dữ liệu ra `prisma/data_dump.json`:
      - 1 TeacherProfile (Thông tin giáo viên)
      - 5 Courses (Các khóa học C1, B1, B2, IELTS, G6)
      - 20 Students (Đầy đủ hồ sơ học viên, số giờ gói, đơn giá, số giờ còn lại)
      - 12 ClassGroups (Các lớp học kèm cấu hình màu và liên kết)
      - 19 ClassMembers (Danh sách phân lớp của học viên)
      - 9 Enrollments (Hợp đồng đăng ký khóa học)
      - 42 Schedules (Các ca học trên thời khóa biểu)
      - 67 LessonRecords (Nhật ký các buổi học kèm điểm danh, số giờ học thực tế, ghi chú giáo viên)
      - 3 TuitionInstallments (Các đợt đóng học phí)
  - **Xây dựng Script Nạp Dữ Liệu Tự Động Sang Supabase PostgreSQL:**
    - Tạo script `scripts/restore-to-supabase.ts` (lệnh `npm run db:restore`).
    - Tự động `upsert` toàn bộ 9 bảng theo đúng phân cấp khóa ngoại (foreign key hierarchy) và giữ nguyên toàn bộ ID gốc, đảm bảo không mất mát hay lệch bất kỳ dữ liệu nào.
  - **Cấu hình môi trường Production cho Vercel:**
    - Bổ sung lệnh `"postinstall": "prisma generate"` vào `package.json` để Vercel tự động build Prisma Client khi triển khai.
    - Cập nhật `.env.example` với hướng dẫn định dạng chuẩn của Supabase (`DATABASE_URL` và `DIRECT_URL`).
  - **Tài liệu hướng dẫn trực quan:**
  - **Đã Kết Nối & Đẩy Mã Nguồn Lên GitHub Thành Công:**
    - Remote: `https://github.com/Gin2990/class-management.git`
    - Nhánh chính: `main` (theo dõi `origin/main`)
    - Đã push toàn bộ lịch sử commit, tài liệu hướng dẫn và mã nguồn lên GitHub.

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
