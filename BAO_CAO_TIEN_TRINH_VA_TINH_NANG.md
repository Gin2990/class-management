# Hướng Dẫn & Tổng Kết Tính Năng: Lớp Học Nhiều Buổi/Tuần (2 Buổi/Tuần) & Đổi Lịch Có Hiệu Lực

👉 **Địa chỉ trải nghiệm:** [http://localhost:3000/classes](http://localhost:3000/classes)

---

## 🌟 Giải Pháp Toàn Diện Cho Lớp Học Nhiều Buổi/Tuần

Khi 1 lớp học diễn ra **2 buổi/tuần** (ví dụ: **Thứ 2 & Thứ 5**, hoặc **Thứ 3 & Thứ 7**, **Thứ 7 & Chủ Nhật**), hoặc 3 buổi/tuần, hệ thống đã được nâng cấp đồng bộ từ Giao diện (UI) đến Cơ sở dữ liệu (Database) và Tự động tính toán đẩy sang Thời khóa biểu.

---

### 1. Khi Tạo Lớp Học Mới (`Tạo Lớp Học Mới`)
Trong mục **"4. Thời Gian Học & Lặp Lại Hàng Tuần"**:
* **Bộ chọn ngày trong tuần tiện lợi:**
  - Danh sách các nút chọn nhanh: `[T2] [T3] [T4] [T5] [T6] [T7] [CN]`.
  - Bạn chỉ cần bấm chọn 2 ngày bất kỳ (ví dụ: **T2** và **T5**).
  - Có thể chọn 1 buổi, 2 buổi, 3 buổi hoặc bất kỳ ngày nào trong tuần!
* **Khung giờ linh hoạt từng buổi:**
  - Hiển thị danh sách các ngày đã chọn kèm khung giờ bắt đầu/kết thúc cho từng buổi.
  - Tích hợp nút tiện ích: **"⚡ Áp dụng giờ của buổi đầu tiên cho tất cả buổi"** (chỉ 1 click là đồng bộ giờ học mà không cần gõ lại).
* **Tính toán số ca học tự động:**
  - Ví dụ: Học **2 buổi/tuần** lặp lại trong **8 tuần** $\rightarrow$ Hệ thống tự động tính ra **16 ca học**!
  - Nút bấm trực quan: `Tạo Lớp & Tự Động Sinh 16 Buổi Học`.
  - Khi lưu, 16 ca học chuẩn xác sẽ tự động xuất hiện trên **Thời Khóa Biểu** ([/calendar](http://localhost:3000/calendar)).

---

### 2. Khi Chỉnh Sửa & Thay Đổi Thời Khóa Biểu (`Sửa Lớp`)
Trong mục **"5. Thay Đổi Thời Khóa Biểu"**:
* **Tự động nhận diện lịch học hiện tại:** Khi mở modal, hệ thống tự động đọc lịch các buổi học trong tuần của lớp để hiển thị sẵn cho bạn.
* **Bật công tắc "Đổi lịch":**
  1. **Thời gian bắt đầu hiệu lực (`effectiveDate`):** 
     - Lựa chọn ngày bắt đầu áp dụng lịch mới (ví dụ: `28/09/2026`).
     - **Nguyên tắc bảo toàn lịch sử:**
       - Toàn bộ ca học **trước ngày hiệu lực sẽ được giữ nguyên 100%** (bảo lưu lịch sử điểm danh và ghi chép buổi học đã qua).
       - Toàn bộ ca học chưa diễn ra **từ ngày hiệu lực trở đi** sẽ tự động được gỡ bỏ và thay thế bằng lịch mới.
  2. **Chọn lại các ngày học mới trong tuần:**
     - Cho phép đổi sang 2 buổi mới khác (ví dụ: đổi từ T2-T5 sang T3-T7).
     - Cho phép đổi giờ từng buổi hoặc áp dụng chung.
  3. **Chọn số tuần lặp lại mới:** (4, 8, 12, 16, 24, 36, 52 tuần).
  4. **Nút lưu an toàn & minh bạch:**
     - Nút hiển thị rõ ràng: `Lưu & Đổi Lịch (16 Buổi Mới)`.

---

### 3. Hiển Thị Lịch Học Ngay Trên Thẻ Lớp Học
Mỗi thẻ lớp học trên trang [Quản Lý Lớp Học](http://localhost:3000/classes) hiện đã hiển thị tóm tắt lịch học trực quan:
* **Ví dụ:** `📅 Lịch: T2, T5 (19:00 - 20:30) • 16 ca trên lịch`

---

---

## 📋 Tinh Gọn & Bổ Sung Thời Gian Học Thực Tế Khi Điểm Danh

Cửa sổ **Điểm Danh & Ghi Nhận Buổi Học** đã được tinh gọn và bổ sung trường thời gian thực tế:
1. **Bổ sung mục "1. Thời Gian Học Thực Tế":**
   - **Ngày học:** Mặc định theo ngày của ca học, có thể chọn lại nếu điểm danh bù.
   - **Bắt Đầu Học * & Kết Thúc Học *:** Mặc định nạp giờ dự kiến của ca học (VD: `19:00 - 20:30`).
   - **Tự động tính thời lượng:** Hiển thị tức thì thời lượng thực tế (VD: `1h 45p (105 phút)` khi học từ `19:15` đến `21:00`).
   - **Cơ chế đồng bộ tự động:**
     - Giúp giáo viên linh hoạt điều chỉnh khi lớp **bắt đầu muộn hơn** hoặc **kéo dài hơn dự kiến**.
     - Khi lưu, hệ thống tự động cập nhật lại thời gian của ca học trên **Thời Khóa Biểu** sang đúng khung giờ thực tế này.
     - Trong mục **Nhật ký học viên** (`/students/[id]`), từng buổi học cũng hiển thị rõ khung giờ thực tế: `🕒 19:15 - 21:00`.
2. **Các mục còn lại trong form:**
   - **2. Tick điểm danh học viên có mặt/vắng:** Hỗ trợ tick từng bạn hoặc nút "Tick tất cả có mặt".
   - **3. Nội dung bài học (Topic):** Nhập nhanh tên bài học (hoặc để trống sẽ tự động đặt ngày học).
   - **4. Ghi chú / Nhận xét buổi học (Tùy chọn):** Lưu ý nhanh của giáo viên.
   - **Nút "Lưu Điểm Danh & Giờ Học":** Lưu nhanh và trừ số buổi của học viên chỉ với 1 click!

## 🎓 Tính Năng Thêm Khóa Học Trực Tiếp Trên Web UI

Giờ đây bạn có thể thêm bất kỳ khóa học mới nào với tên gọi và trình độ tùy ý ngay trên giao diện web mà không cần can thiệp vào cơ sở dữ liệu:

1. **Vị trí thao tác thuận tiện:**
   - **Nút "+ Thêm Khóa Học"** nổi bật ngay trên thanh tiêu đề trang [Quản Lý Lớp Học](http://localhost:3000/classes).
   - **Nút tiện ích nhanh "+ Khóa học mới"** đặt ngay cạnh mục chọn khóa học trong cả 2 modal: **Tạo Lớp Mới** và **Chỉnh Sửa Lớp**.
2. **Thông tin khóa học:**
   - **Tên khóa học (\*):** Nhập tên bất kỳ (VD: *IELTS Intensive 6.5+*, *Luyện thi THPT Quốc Gia môn Tiếng Anh*, *Tiếng Anh Giao Tiếp Doanh Nghiệp*, *TOEIC 750+*...).
   - **Cấp độ / Phân loại (Level):** Bấm chọn nhanh các tag phổ biến (`GENERAL`, `IELTS`, `TOEIC`, `B1`, `B2`, `Lớp 10`, `Lớp 11`, `Lớp 12`) hoặc tự gõ mã riêng (VD: `SAT`, `VSTEP`...).
   - **Mô tả khóa học (tùy chọn):** Tùy chọn nhập thêm mục tiêu đầu ra hoặc ghi chú.
3. **Đồng bộ tự động tức thì:**
   - Sau khi bấm **"Thêm Khóa Học"**, khóa học mới sẽ được lưu vĩnh viễn vào CSDL SQLite.
   - Danh sách khóa học được tự động cập nhật lại ngay lập tức và tự động chọn khóa học vừa tạo vào ô chọn lớp học mà không cần reload trang.

---

## ⏱️ Quản Lý Học Viên Theo Giờ Học (Thay Thế Quản Lý Theo Buổi)

Toàn bộ hệ thống quản lý học viên, tính phí, điểm danh và thống kê đã được chuyển đổi trọn vẹn từ đơn vị **"Buổi"** sang đơn vị **"Giờ"**:

👉 **Địa chỉ trải nghiệm:** [http://localhost:3000/students](http://localhost:3000/students)

### 1. Form Thêm Mới & Chỉnh Sửa Học Viên
Trong mục **"3. Gói Giờ Học & Đơn Giá"**:
* **Tổng Số Giờ (Gói):** Cho phép nhập số giờ gói linh hoạt, hỗ trợ cả số thập phân (bước nhảy `0.5` giờ, ví dụ: `20`, `22.5`, `30` giờ).
* **Đơn Giá / Giờ (VNĐ):** Cho phép thiết lập đơn giá trên 1 giờ học (ví dụ: `200,000` đ/giờ, `300,000` đ/giờ).
* **Tự động tính học phí dự kiến:** Hệ thống tự động nhân `Tổng số giờ × Đơn giá/giờ` và hiển thị trực tiếp ngay trên form (ví dụ: `20 giờ × 300,000đ = 6,000,000đ`).

### 2. Bảng Tổng Hợp Danh Sách Học Viên (`/students`)
* Cột **TIẾN ĐỘ HỌC**:
  - Hiển thị chính xác tiến độ thực tế theo giờ: `{Số giờ đã học} / {Tổng số giờ gói} giờ` (ví dụ: `1.5 / 20 giờ`).
  - Thanh tiến trình phần trăm (%) trực quan và đổi màu thông minh.
* Cột **SỐ GIỜ CÒN LẠI**:
  - Hiển thị dạng badge nổi bật: `Còn {Số giờ còn lại} giờ` (ví dụ: `Còn 18.5 giờ`).
  - Tự động đổi màu cảnh báo đỏ khi còn $\le 1.5$ giờ, màu cam khi còn $\le 3$ giờ để nhắc nhở phụ huynh gia hạn kịp thời.
* Định dạng số hiển thị gọn gàng, tự làm tròn đẹp mắt (hiển thị `18.5`, `20` thay vì các số thập phân dài).

### 3. Tích Hợp Thời Lượng Điểm Danh Trực Tiếp Vào Số Giờ Gói
* Khi giáo viên điểm danh và ghi nhận thời gian bắt đầu - kết thúc học (ví dụ: `19:00 - 20:30` = **1.5 giờ**), hệ thống tự động:
  - Lưu trữ thời lượng `1.5 giờ` vào bản ghi buổi học (`LessonRecord.durationHours`).
  - Cộng dồn thời gian thực tế đã học của học viên: `completedHours = 1.5 giờ`.
  - Khấu trừ trực tiếp vào quỹ giờ của học viên: `remainingHours = 20 - 1.5 = 18.5 giờ`.

### 4. Đồng Bộ Trang Hồ Sơ Chi Tiết (`/students/[id]`) & Thu Học Phí (`/tuition`)
* Thẻ thống kê tại trang cá nhân hiển thị rõ ràng:
  - **Tổng số giờ gói:** `20 giờ`
  - **Đã hoàn thành:** `1.5 giờ` (`8% lộ trình`)
  - **Số giờ còn lại:** `18.5 giờ`
* Trang theo dõi học phí tự động hiển thị số giờ còn lại và tiến độ giờ học của từng học viên.

---

## ⚙️ Cài Đặt Thông Tin Giáo Viên & Tối Giản Hệ Thống (Lược Bỏ Mã QR)

👉 **Địa chỉ trải nghiệm:** [http://localhost:3000/settings](http://localhost:3000/settings)

### 1. Khắc Phục Triệt Để Lỗi Lưu Cài Đặt
* **Nguyên nhân trước đây:** Route API `/api/profile` bị Next.js nhận diện là Static route prerendered khi build, dẫn đến yêu cầu `PUT` từ client bị trả về mã lỗi HTML thay vì JSON gây lỗi parse `Unexpected token '<'`.
* **Giải pháp:** Đã chuyển `/api/profile` thành `force-dynamic`, hỗ trợ đồng bộ cả `POST` và `PUT`, xử lý an toàn phản hồi từ server. Khi bấm **"Lưu Cài Đặt"**, thông tin được cập nhật tức thì với thông báo thành công xanh đẹp mắt.

### 2. Tối Giản Cài Đặt Giáo Viên
* Bỏ hoàn toàn phần nhập mã ngân hàng, số tài khoản, tên chủ tài khoản và mã chuyển tiền VietQR.
* Trang [Cài Đặt](http://localhost:3000/settings) chỉ giữ lại 3 thông tin cần thiết nhất:
  - **Họ và Tên Giáo Viên**
  - **Email Giáo Viên**
  - **Số Điện Thoại / Zalo**
* Đổi tên menu Sidebar từ **"Cài đặt & VietQR"** thành **"Cài đặt"**.

### 3. Đồng Bộ Giao Diện Không Dùng Mã Chuyển Tiền
* **Danh Sách Học Viên ([/students](http://localhost:3000/students)):** Gỡ bỏ nút và cửa sổ bật lên mã QR VietQR, bảng danh sách học viên trực quan và tinh gọn.
* **Hồ Sơ Học Viên ([/students/[id]](http://localhost:3000/students/cm70)):** Thay thế khung mã QR bằng thẻ **"Giáo Viên Phụ Trách"**, hiển thị thông tin liên hệ giáo viên và nút copy báo cáo tiến độ học tập gửi phụ huynh.
* **Quản Lý Học Phí ([/tuition](http://localhost:3000/tuition)):** Loại bỏ khung hiển thị QR, chuyển thành thẻ tóm tắt học phí, hạn đóng, thông tin giáo viên và nút copy tin nhắn nhắc học phí chuẩn mực gửi phụ huynh.

---

## 🕒 Linh Hoạt Kéo Ra / Thu Vào & Thay Đổi Giờ Học Trên Thời Khóa Biểu

👉 **Địa chỉ trải nghiệm:** [http://localhost:3000/calendar](http://localhost:3000/calendar)

Không còn bị gò bó cố định thời lượng theo khóa học ban đầu, bạn hiện có thể tự do co giãn, kéo dài hoặc thu ngắn bất kỳ ca học nào trên thời khóa biểu:

### 1. Kéo Thả Trực Quan Ngay Trên Lịch Tuần / Ngày (Drag-to-Resize)
* **Kéo cạnh trên (Top handle) hoặc cạnh dưới (Bottom handle):**
  - Di chuột vào mép trên hoặc mép dưới của bất kỳ khối ca học nào trên lịch tuần / lịch ngày, con trỏ chuột sẽ đổi thành mũi tên 2 chiều `↕` cùng tay nắm tương tác rõ ràng.
  - **Kéo xuống dưới để kéo dài thêm giờ học (VD: từ 1h30 lên 2h hoặc 2h30).**
  - **Kéo thu gọn lại để giảm bớt giờ học (VD: từ 1h30 xuống 1h hoặc 45 phút).**
  - **Kéo mép trên để điều chỉnh giờ bắt đầu sớm hơn hoặc muộn hơn.**
* **Bước nhảy chuẩn xác (Snap duration):**
  - Tự động bắt dính từng **15 phút** (`snapDuration="00:15:00"`), giúp bạn thao tác nhanh và chuẩn xác (VD: 19:00, 19:15, 19:30, 19:45, 20:00,...).
* **Dời nguyên ca học (Drag & Drop):**
  - Kéo thả cả khối ca học để đổi sang khung giờ hoặc ngày khác trong tuần.

### 2. Form Tinh Chỉnh Giờ Chi Tiết Trong Modal Ca Học
Khi bấm vào một ca học trên lịch (hoặc bấm nút **"Đổi giờ"** ở chế độ xem Danh Sách):
* **Hộp công cụ "Điều Chỉnh Giờ Học Ca Này":**
  - **Ngày Học:** Cho phép đổi ngày ca học sang ngày khác.
  - **Bắt Đầu & Kết Thúc:** Nhập chính xác giờ và phút.
  - **Hiển thị thời lượng tự động:** Nhảy số trực quan theo thời gian thực (VD: `1h 45p (1.8 giờ)`, `2 giờ (120 phút)`).
  - Nút **"Lưu Thay Đổi Giờ Học"**: Lưu lại thời gian mới tức thì vào CSDL.

### 3. Tự Động Đồng Bộ Quỹ Giờ Học Viên
* Khi thay đổi thời lượng ca học (qua kéo thả hoặc qua form), hệ thống tự động:
  - Cập nhật thời gian bắt đầu và kết thúc của ca học trong CSDL (`Schedule`).
  - Tự động tính toán lại và đồng bộ trường `durationHours` của buổi học (`LessonRecord`) tương ứng nếu ca này đã có bản ghi điểm danh.
  - Đảm bảo số giờ còn lại của học viên luôn khớp 100% với thời lượng học thực tế.


