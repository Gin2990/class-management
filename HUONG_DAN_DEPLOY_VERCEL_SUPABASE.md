# 🚀 HƯỚNG DẪN ĐẨY DATABASE LÊN SUPABASE & DEPLOY VERCEL QUA GITHUB

Tài liệu này hướng dẫn chi tiết từng bước để đưa toàn bộ ứng dụng Quản Lý Lớp Học từ máy tính cá nhân lên môi trường Online (Supabase + GitHub + Vercel) để truy cập mọi lúc mọi nơi trên điện thoại, máy tính bảng và máy tính ở nhà.

---

## 📌 TỔNG QUAN CÁC BƯỚC

```
[Máy tính hiện tại] ───────────┐
  - SQLite (prisma/dev.db)     │
  - Trích xuất: data_dump.json │
                               ▼
                    [1. SUPABASE (PostgreSQL)]
                    Lưu trữ CSDL online vĩnh viễn,
                    sao lưu tự động, tốc độ cao.
                               ▲
                               │ DATABASE_URL
                               │
[2. GITHUB REPOSITORY] ────────┼─────────► [3. VERCEL HOSTING]
Lưu trữ toàn bộ mã nguồn       │           Tự động build và phát hành
                               │           Link web: https://...vercel.app
```

---

## BƯỚC 1: TẠO DỰ ÁN SUPABASE & LẤY CHUỖI KẾT NỐI

1. Truy cập: [https://supabase.com](https://supabase.com) và đăng nhập (bằng tài khoản GitHub hoặc Google).
2. Bấm nút **"New project"**:
   - **Name**: `quan-ly-lop-hoc`
   - **Database Password**: Đặt mật khẩu an toàn và **hãy ghi nhớ mật khẩu này**.
   - **Region**: Chọn `Singapore (ap-southeast-1)` để đường truyền tại Việt Nam đạt tốc độ tối đa.
   - Bấm **"Create new project"** (chờ khoảng 1-2 phút để Supabase khởi tạo).
3. Sau khi dự án tạo xong:
   - Vào biểu tượng bánh răng **Project Settings** (ở cột menu bên trái, dưới cùng).
   - Chọn mục **Database**.
   - Cuộn xuống phần **Connection string**:
     - Chọn tab **URI**:
       - Chế độ **Transaction** (Port `6543`): Đây là `DATABASE_URL`.
       - Chế độ **Session** (Port `5432`): Đây là `DIRECT_URL`.
     - *Lưu ý: Thay thế phần `[YOUR-PASSWORD]` trong chuỗi bằng mật khẩu bạn đã tạo ở bước 2.*

---

## BƯỚC 2: ĐẨY TOÀN BỘ CSDL LÊN SUPABASE (ĐÃ TỰ ĐỘNG HÓA 100%)

Hệ thống đã chuẩn bị sẵn bộ công cụ trích xuất và chuyển giao dữ liệu:
* File sao lưu toàn bộ dữ liệu hiện tại: `prisma/data_dump.json` (Gồm đầy đủ thông tin giáo viên, 20 học viên, 12 lớp học, 42 lịch học, 67 buổi học, công nợ).
* Script tự động chuyển dữ liệu: `scripts/restore-to-supabase.ts`.

### Cách thực hiện:
1. Mở file `.env` và dán 2 dòng chuỗi kết nối Supabase vào:
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```
2. Đổi cấu hình `prisma/schema.prisma` sang PostgreSQL:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
3. Chạy 2 lệnh sau trên terminal:
   ```bash
   npx prisma db push
   npm run db:restore
   ```
   *(Hoặc bạn chỉ cần gửi chuỗi kết nối cho AI, AI sẽ thay bạn chạy lệnh và kiểm tra toàn bộ 100% dữ liệu đã lên đủ chưa).*

---

## BƯỚC 3: TẠO GITHUB REPO & COMMIT MÃ NGUỒN

1. Đăng nhập vào GitHub: [https://github.com/new](https://github.com/new)
2. Điền thông tin tạo kho lưu trữ mới:
   - **Repository name**: `quan-ly-lop-hoc` (hoặc tên tùy thích).
   - Chọn chế độ: **Private** (khuyên dùng để bảo mật thông tin học viên của bạn).
   - Bỏ tích "Add a README file" (vì dự án đã có sẵn README).
   - Bấm **"Create repository"**.
3. Copy đường link repo vừa tạo (dạng: `https://github.com/Gin2990/quan-ly-lop-hoc.git`).
4. Kết nối và đẩy code lên GitHub bằng lệnh:
   ```bash
   git remote add origin https://github.com/Gin2990/quan-ly-lop-hoc.git
   git branch -M main
   git push -u origin main
   ```

---

## BƯỚC 4: DEPLOY LÊN VERCEL

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub**.
2. Tại trang Dashboard, bấm **"Add New..."** ➔ chọn **"Project"**.
3. Tìm repo `quan-ly-lop-hoc` vừa đẩy lên và bấm **"Import"**.
4. Cấu hình dự án trên Vercel:
   - **Framework Preset**: Next.js (mặc định).
   - **Root Directory**: `./` (mặc định).
   - Mở rộng mục **Environment Variables** và thêm 2 biến:
     - `DATABASE_URL`: Chuỗi kết nối Supabase (Transaction mode).
     - `DIRECT_URL`: Chuỗi kết nối Supabase (Session mode / Port 5432).
5. Bấm nút **"Deploy"**.
6. Chờ Vercel hoàn tất build trong khoảng 1-2 phút ➔ Bạn sẽ nhận được đường link chính thức (Ví dụ: `https://quan-ly-lop-hoc.vercel.app`).
7. Từ bây giờ:
   - Bạn có thể vào web này trên bất kỳ máy tính hay điện thoại nào.
   - Mọi thay đổi điểm danh, sửa giờ học sẽ được lưu tức thì vào Supabase.
