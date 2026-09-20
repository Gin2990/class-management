-- ==========================================================================
-- SUPABASE POSTGRESQL MIGRATION SCRIPT - QUAN LY LOP HOC WEBAPP
-- Auto-generated on: 2026-09-20T17:33:29.919Z
-- ==========================================================================

-- 1. CREATE TABLES IF NOT EXISTS
CREATE TABLE IF NOT EXISTS "TeacherProfile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'Giáo viên',
    "email" TEXT,
    "phone" TEXT,
    "bankName" TEXT NOT NULL DEFAULT 'MBBANK',
    "bankAccount" TEXT NOT NULL DEFAULT '0987654321',
    "bankAccountName" TEXT NOT NULL DEFAULT 'NGUYEN DINH LINH',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "level" TEXT NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "parentName" TEXT,
    "parentEmail" TEXT,
    "parentPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClassGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'TUTORING',
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "locationOrLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClassGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClassMember" (
    "id" TEXT NOT NULL,
    "classGroupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classGroupId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Khóa học',
    "totalSessions" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "pricePerSession" DOUBLE PRECISION NOT NULL DEFAULT 250000,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 5000000,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Schedule" (
    "id" TEXT NOT NULL,
    "classGroupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "googleEventId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "LessonRecord" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT,
    "classGroupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sessionNumber" INTEGER NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendance" TEXT NOT NULL DEFAULT 'PRESENT',
    "topic" TEXT,
    "skillsCovered" TEXT,
    "teacherNotes" TEXT,
    "homework" TEXT,
    "performanceScore" DOUBLE PRECISION,
    "durationHours" DOUBLE PRECISION DEFAULT 1.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LessonRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TuitionInstallment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "paidDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TuitionInstallment_pkey" PRIMARY KEY ("id")
);

-- UNIQUE INDEXES & FOREIGN KEYS
CREATE UNIQUE INDEX IF NOT EXISTS "ClassMember_classGroupId_studentId_key" ON "ClassMember"("classGroupId", "studentId");

-- 2. DATA INSERTIONS (UPSERT)

-- TeacherProfile
INSERT INTO "TeacherProfile" ("id", "fullName", "email", "phone", "bankName", "bankAccount", "bankAccountName", "updatedAt")
VALUES ('cmu8904vw00009xaaf722m8ud', 'Nguyễn Đức Linh Rin', 'nguyenduclinhrin@gmail.com', '0901234567', 'MBBANK', '0901234567', 'NGUYEN DINH LINH', '2026-09-20T16:37:39.078Z')
ON CONFLICT ("id") DO UPDATE SET "fullName" = EXCLUDED."fullName", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "bankName" = EXCLUDED."bankName", "bankAccount" = EXCLUDED."bankAccount", "bankAccountName" = EXCLUDED."bankAccountName", "updatedAt" = EXCLUDED."updatedAt";

-- Course
INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")
VALUES ('cmu8904wc00019xaaohhvuccg', 'IELTS Intensive', 'IELTS-INT', 'Luyện thi chứng chỉ IELTS 6.5 - 7.5+', 'IELTS', '2026-09-19T10:32:12.493Z', '2026-09-19T10:32:12.493Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")
VALUES ('cmu8904wr00029xaaf6h83l7r', 'Pre-IELTS Foundation', 'PRE-IELTS', 'Xây dựng nền tảng từ vựng và ngữ pháp học thuật', 'IELTS', '2026-09-19T10:32:12.507Z', '2026-09-19T10:32:12.507Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")
VALUES ('cmu8904x400039xaaw6fp7abl', 'Cambridge C1 Advanced (CAE)', 'CAM-C1', 'Khóa học tiếng Anh cao cấp trình độ C1', 'C1', '2026-09-19T10:32:12.521Z', '2026-09-19T10:32:12.521Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")
VALUES ('cmu8904y800049xaavhj1gly3', 'Cambridge B2 First (FCE)', 'CAM-B2', 'Luyện thi chứng chỉ quốc tế Cambridge B2', 'B2', '2026-09-19T10:32:12.561Z', '2026-09-19T10:32:12.561Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")
VALUES ('cmu8904yo00059xaaoxer6dup', 'Cambridge B1 Preliminary (PET)', 'CAM-B1', 'Khóa học củng cố nền tảng giao tiếp và thi B1', 'B1', '2026-09-19T10:32:12.576Z', '2026-09-19T10:32:12.576Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";

-- Student
INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89050200089xaarv7b9vlb', 'Yến Ngọc', 'yenngoc@gmail.com', '0981112233', 'Chị Mai', 'maiparent.yn@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.626Z', '2026-09-19T10:32:12.626Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89050h00099xaaetkv05gp', 'Mạnh', 'manh.ielts@gmail.com', '0982223344', 'Anh Dũng', 'dungparent.m@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.641Z', '2026-09-19T10:32:12.641Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89050t000a9xaa6ugv4eqo', 'Nghi', 'nghi.ielts@gmail.com', '0983334455', 'Chị Lan', 'lanparent.n@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.654Z', '2026-09-19T10:32:12.654Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890513000b9xaah88pbvvp', 'Minh Hiền', 'minhhien@gmail.com', '0984445566', 'Chị Hương', 'huongparent.mh@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.663Z', '2026-09-19T10:32:12.663Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89051c000c9xaak79y6eeb', 'Dương', 'duong.ielts@gmail.com', '0985556677', 'Anh Hùng', 'hungparent.d@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.672Z', '2026-09-19T10:32:12.672Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89051v000d9xaa8k3uqfjc', 'Burin', 'burin@gmail.com', '0986667788', 'Chị Thảo', 'thaoparent.b@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.691Z', '2026-09-19T10:32:12.691Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890524000e9xaan008kxor', 'Fa', 'fa.pre@gmail.com', '0987778899', 'Anh Nam', 'namparent.fa@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.700Z', '2026-09-19T10:32:12.700Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89052f000f9xaav4sxpy5e', 'Sarah', 'sarah.c1@gmail.com', '0988889900', 'Chị Ngọc', 'ngocparent.s@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.711Z', '2026-09-19T10:32:12.711Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89052o000g9xaaextjvgv0', 'Andy', 'andy.c1@gmail.com', '0989990011', 'Anh Tuấn', 'tuanparent.a@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.720Z', '2026-09-20T16:26:17.031Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89052x000h9xaaspigooip', 'Tony', 'tony.c1@gmail.com', '0971112233', 'Chị Thủy', 'thuyparent.t@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.729Z', '2026-09-19T10:32:12.729Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890537000i9xaajofb39sk', 'Chi', 'chi.c1@gmail.com', '0972223344', 'Anh Bình', 'binhparent.c@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.739Z', '2026-09-19T10:32:12.739Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89053k000j9xaajq2fuit0', 'Ane', 'ane.b2@gmail.com', '0973334455', 'Chị Vy', 'vyparent.ane@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.753Z', '2026-09-19T10:32:12.753Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89053x000k9xaasl4sn4re', 'Sunday', 'sunday.b2@gmail.com', '0974445566', 'Anh Phúc', 'phucparent.sun@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.765Z', '2026-09-19T10:32:12.765Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890546000l9xaaqs1ynobj', 'Lyna', 'lyna.b2@gmail.com', '0975556677', 'Chị Trâm', 'tramparent.ly@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.775Z', '2026-09-19T10:32:12.775Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89054g000m9xaahgqnpq1x', 'Linh', 'linh.b2@gmail.com', '0976667788', 'Anh Khoa', 'khoaparent.l@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.785Z', '2026-09-19T10:32:12.785Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89054t000n9xaaa2rsiqkd', 'My', 'my.b2@gmail.com', '0977778899', 'Chị Hồng', 'hongparent.m@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.797Z', '2026-09-19T10:32:12.797Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890553000o9xaamjzrmxkx', 'Khoa', 'khoa.b2@gmail.com', '0978889900', 'Anh Đạt', 'datparent.k@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.807Z', '2026-09-19T10:32:12.807Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89055g000p9xaaet9us3ky', 'David', 'david.b1@gmail.com', '0979990011', 'Chị Phương', 'phuongparent.d@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.820Z', '2026-09-19T10:32:12.820Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu89055r000q9xaa59wwqmqc', 'Linda', 'linda.b1@gmail.com', '0961112233', 'Anh Minh', 'minhparent.l@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.832Z', '2026-09-19T10:32:12.832Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")
VALUES ('cmu890565000r9xaahnlibsla', 'Fin', 'fin.english@gmail.com', '0962223344', 'Chị Oanh', 'oanhparent.fin@gmail.com', NULL, 'ACTIVE', NULL, '2026-09-19T10:32:12.846Z', '2026-09-19T10:32:12.846Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

-- ClassGroup
INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu89056t000v9xaanonik1mk', 'IELTS 6.5 - Yến Ngọc', 'cmu8904wc00019xaaohhvuccg', 'TUTORING', '#3b82f6', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:12.869Z', '2026-09-19T10:32:12.869Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh & Nghi', 'cmu8904wc00019xaaohhvuccg', 'TUTORING', '#0284c7', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:12.941Z', '2026-09-19T10:32:12.941Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu89059t00159xaabo5ibj5r', 'IELTS - Minh Hiền', 'cmu8904wc00019xaaohhvuccg', 'TUTORING', '#0ea5e9', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:12.978Z', '2026-09-19T10:32:12.978Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905as00199xaat96l2n33', 'IELTS - Dương', 'cmu8904wc00019xaaohhvuccg', 'TUTORING', '#38bdf8', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.013Z', '2026-09-19T10:32:13.013Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905bh001d9xaa46n4vtv6', 'Pre-IELTS - Burin & Fa', 'cmu8904wr00029xaaf6h83l7r', 'TUTORING', '#6366f1', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.037Z', '2026-09-19T10:32:13.037Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905cs001j9xaah8cmkcvv', 'C1 - Sarah + Andy', 'cmu8904x400039xaaw6fp7abl', 'TUTORING', '#8b5cf6', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.084Z', '2026-09-19T10:32:13.084Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905e1001p9xaar51j7h8e', 'C1 - Tony + Chi', 'cmu8904x400039xaaw6fp7abl', 'TUTORING', '#a855f7', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.129Z', '2026-09-19T10:32:13.129Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905fb001v9xaa6pwjdc1t', 'B2 - Ane & Sunday', 'cmu8904y800049xaavhj1gly3', 'TUTORING', '#10b981', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.176Z', '2026-09-19T10:32:13.176Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', 'cmu8904y800049xaavhj1gly3', 'TUTORING', '#059669', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.232Z', '2026-09-19T10:32:13.232Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905if00279xaatkdztavr', 'B2 - My + Khoa', 'cmu8904y800049xaavhj1gly3', 'TUTORING', '#14b8a6', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.287Z', '2026-09-19T10:32:13.287Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu8905jm002d9xaaq73ftg46', 'B1 - David + Linda + Fin', 'cmu8904yo00059xaaoxer6dup', 'TUTORING', '#f59e0b', 'Google Meet', 'ACTIVE', '2026-09-19T10:32:13.330Z', '2026-09-19T14:29:07.758Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")
VALUES ('cmu89jjsp0006a3cwtizqlxzl', 'IELTS 7.0 - Tuấn Anh', NULL, 'TUTORING', '#3b82f6', 'Google Meet', 'ACTIVE', '2026-09-19T10:47:18.265Z', '2026-09-19T10:47:18.265Z')
ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";

-- ClassMember
INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu89057o000x9xaaohbrmxq4', 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', '2026-09-19T10:32:12.901Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu89059600119xaafxmkgc5f', 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', '2026-09-19T10:32:12.954Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu89059j00139xaadd993avg', 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', '2026-09-19T10:32:12.967Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905ad00179xaalva2bfr5', 'cmu89059t00159xaabo5ibj5r', 'cmu890513000b9xaah88pbvvp', '2026-09-19T10:32:12.998Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905b4001b9xaas8p840md', 'cmu8905as00199xaat96l2n33', 'cmu89051c000c9xaak79y6eeb', '2026-09-19T10:32:13.025Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905bt001f9xaan5gf56fp', 'cmu8905bh001d9xaa46n4vtv6', 'cmu89051v000d9xaa8k3uqfjc', '2026-09-19T10:32:13.050Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905cf001h9xaaup8fhra5', 'cmu8905bh001d9xaa46n4vtv6', 'cmu890524000e9xaan008kxor', '2026-09-19T10:32:13.071Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905d6001l9xaacks3gueu', 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', '2026-09-19T10:32:13.098Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905en001r9xaaf4wsopo3', 'cmu8905e1001p9xaar51j7h8e', 'cmu89052x000h9xaaspigooip', '2026-09-19T10:32:13.152Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905f0001t9xaaahuycr8f', 'cmu8905e1001p9xaar51j7h8e', 'cmu890537000i9xaajofb39sk', '2026-09-19T10:32:13.164Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905fo001x9xaafo7i4e4a', 'cmu8905fb001v9xaa6pwjdc1t', 'cmu89053k000j9xaajq2fuit0', '2026-09-19T10:32:13.189Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905g1001z9xaaghdau327', 'cmu8905fb001v9xaa6pwjdc1t', 'cmu89053x000k9xaasl4sn4re', '2026-09-19T10:32:13.201Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905hf00239xaauos922rs', 'cmu8905gw00219xaa55c4q92m', 'cmu890546000l9xaaqs1ynobj', '2026-09-19T10:32:13.251Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905hu00259xaafloqu2tn', 'cmu8905gw00219xaa55c4q92m', 'cmu89054g000m9xaahgqnpq1x', '2026-09-19T10:32:13.266Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905it00299xaa82vy1vnl', 'cmu8905if00279xaatkdztavr', 'cmu89054t000n9xaaa2rsiqkd', '2026-09-19T10:32:13.301Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8905j9002b9xaa98tl43e2', 'cmu8905if00279xaatkdztavr', 'cmu890553000o9xaamjzrmxkx', '2026-09-19T10:32:13.317Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8hgti50000121xnf1sby3q', 'cmu8905jm002d9xaaq73ftg46', 'cmu89055g000p9xaaet9us3ky', '2026-09-19T14:29:07.805Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmu8hgti70001121xn3a32iek', 'cmu8905jm002d9xaaq73ftg46', 'cmu89055r000q9xaa59wwqmqc', '2026-09-19T14:29:07.805Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")
VALUES ('cmua13bzm0001z6f1do1lhy1i', 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052o000g9xaaextjvgv0', '2026-09-20T16:26:17.074Z')
ON CONFLICT ("id") DO NOTHING;

-- Enrollment
INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8905nw002v9xaazq6gxuf7', 'cmu89050200089xaarv7b9vlb', 'cmu89056t000v9xaanonik1mk', 'Gói IELTS 6.5 Mục tiêu (Đợt 1)', 24, 300000, 7200000, 7200000, 'PAID', '2026-09-19T10:32:13.484Z', NULL, 'Đã hoàn thành 22 buổi. Cần gia hạn đợt 2!', '2026-09-19T10:32:13.484Z', '2026-09-19T10:32:13.484Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8905w300459xaar6ek7w71', 'cmu89052f000f9xaav4sxpy5e', 'cmu8905cs001j9xaah8cmkcvv', 'Khóa Cambridge C1 Advanced', 20, 350000, 7000000, 7000000, 'PAID', '2026-09-19T10:32:13.779Z', NULL, 'Sắp hoàn tất khóa, còn 1 buổi.', '2026-09-19T10:32:13.779Z', '2026-09-19T10:32:13.779Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu89069400599xaae29d8ezt', 'cmu89050h00099xaaetkv05gp', 'cmu89058s000z9xaahog3plh5', 'IELTS Nhóm 6.5 Foundation', 30, 250000, 7500000, 7500000, 'PAID', '2026-09-19T10:32:14.248Z', NULL, NULL, '2026-09-19T10:32:14.248Z', '2026-09-19T10:32:14.248Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906ef005z9xaa6qpz5jyc', 'cmu89050t000a9xaa6ugv4eqo', 'cmu89058s000z9xaahog3plh5', 'IELTS Nhóm 6.5 Foundation', 30, 250000, 7500000, 7500000, 'PAID', '2026-09-19T10:32:14.440Z', NULL, NULL, '2026-09-19T10:32:14.440Z', '2026-09-19T10:32:14.440Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906kb006p9xaav2zxvec6', 'cmu89052x000h9xaaspigooip', 'cmu8905e1001p9xaar51j7h8e', 'C1 Master Class', 20, 350000, 7000000, 7000000, 'PAID', '2026-09-19T10:32:14.652Z', NULL, NULL, '2026-09-19T10:32:14.652Z', '2026-09-19T10:32:14.652Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906l3006r9xaaens15hrg', 'cmu890537000i9xaajofb39sk', 'cmu8905e1001p9xaar51j7h8e', 'C1 Master Class', 20, 350000, 7000000, 7000000, 'PAID', '2026-09-19T10:32:14.679Z', NULL, NULL, '2026-09-19T10:32:14.679Z', '2026-09-19T10:32:14.679Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906lw006t9xaad36kuz2r', 'cmu89055g000p9xaaet9us3ky', 'cmu8905jm002d9xaaq73ftg46', 'B1 Preliminary Starter', 20, 250000, 5000000, 5000000, 'PAID', '2026-09-19T10:32:14.708Z', NULL, NULL, '2026-09-19T10:32:14.708Z', '2026-09-19T10:32:14.708Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906m8006v9xaaiqvj756b', 'cmu89055r000q9xaa59wwqmqc', 'cmu8905jm002d9xaaq73ftg46', 'B1 Preliminary Starter', 20, 250000, 5000000, 5000000, 'PAID', '2026-09-19T10:32:14.720Z', NULL, NULL, '2026-09-19T10:32:14.720Z', '2026-09-19T10:32:14.720Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")
VALUES ('cmu8bfwqg0003w8k3bbjjdovt', 'cmu89052o000g9xaaextjvgv0', 'cmu8905cs001j9xaah8cmkcvv', 'Gói 20 giờ', 20, 300000, 6000000, 6000000, 'PAID', '2026-09-19T11:40:27.641Z', NULL, NULL, '2026-09-19T11:40:27.641Z', '2026-09-20T16:26:17.094Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

-- Schedule
INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906or00779xaalf5o08np', 'cmu89056t000v9xaanonik1mk', 'IELTS 6.5 - Yến Ngọc (Ca Sáng)', '2026-09-14T00:00:00.000Z', '2026-09-14T01:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.811Z', '2026-09-19T10:32:14.811Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906ph00799xaapzpuovh8', 'cmu89056t000v9xaanonik1mk', 'IELTS 6.5 - Yến Ngọc (Ca Tối)', '2026-09-14T14:00:00.000Z', '2026-09-14T15:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.838Z', '2026-09-19T13:37:42.932Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906pv007b9xaaznvclryh', 'cmu8905fb001v9xaa6pwjdc1t', 'B2 - Ane & Sunday', '2026-09-14T10:30:00.000Z', '2026-09-14T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.852Z', '2026-09-19T10:32:14.852Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906q7007d9xaausa88hn5', 'cmu8905fb001v9xaa6pwjdc1t', 'B2 - Ane & Sunday', '2026-09-17T10:30:00.000Z', '2026-09-17T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.864Z', '2026-09-19T10:32:14.864Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906ql007f9xaajeighhj8', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-14T12:00:00.000Z', '2026-09-14T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.878Z', '2026-09-19T10:32:14.878Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906qz007h9xaabzq98twd', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-16T12:00:00.000Z', '2026-09-16T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.891Z', '2026-09-19T10:32:14.891Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906rq007j9xaab0cxq2ae', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-18T12:00:00.000Z', '2026-09-18T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.918Z', '2026-09-19T14:29:27.598Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906s2007l9xaa683iwjok', 'cmu8905jm002d9xaaq73ftg46', 'B1 - David + Linda + Fin', '2026-09-15T10:30:00.000Z', '2026-09-15T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.930Z', '2026-09-19T14:29:07.822Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906sh007n9xaasbf8235h', 'cmu8905jm002d9xaaq73ftg46', 'B1 - David + Linda + Fin', '2026-09-17T12:00:00.000Z', '2026-09-17T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.945Z', '2026-09-19T14:29:51.173Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906sx007p9xaa9gx74lq0', 'cmu8905e1001p9xaar51j7h8e', 'C1 - Tony + Chi', '2026-09-15T12:00:00.000Z', '2026-09-15T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.961Z', '2026-09-19T10:32:14.961Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906ta007r9xaa59t3f4na', 'cmu89059t00159xaabo5ibj5r', 'IELTS - Minh Hiền', '2026-09-16T00:00:00.000Z', '2026-09-16T01:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.974Z', '2026-09-19T10:32:14.974Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906tp007t9xaax4fkusfp', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-16T10:30:00.000Z', '2026-09-16T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:14.989Z', '2026-09-19T10:32:14.989Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906u4007v9xaai8f9qpw5', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-18T10:30:00.000Z', '2026-09-18T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.005Z', '2026-09-20T16:37:13.539Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906ui007x9xaaw6g5ha75', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-20T03:30:00.000Z', '2026-09-20T05:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.019Z', '2026-09-19T10:32:15.019Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906uw007z9xaalh8kolfz', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-17T07:30:00.000Z', '2026-09-17T09:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.032Z', '2026-09-19T10:32:15.032Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906w200819xaaiqr38lik', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-19T07:30:00.000Z', '2026-09-19T08:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.075Z', '2026-09-19T10:32:15.075Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906wp00839xaaekwkhddy', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-20T06:00:00.000Z', '2026-09-20T07:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.097Z', '2026-09-19T10:32:15.097Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906x300859xaa59o9jroo', 'cmu8905if00279xaatkdztavr', 'B2 - My + Khoa', '2026-09-18T13:30:00.000Z', '2026-09-18T15:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.112Z', '2026-09-19T10:32:15.112Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906xi00879xaa6vjc72fb', 'cmu8905if00279xaatkdztavr', 'B2 - My + Khoa', '2026-09-19T08:30:00.000Z', '2026-09-19T10:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.127Z', '2026-09-19T10:32:15.127Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906xw00899xaavhx1ar1j', 'cmu8905cs001j9xaah8cmkcvv', 'C1 - Sarah + Andy', '2026-09-19T00:00:00.000Z', '2026-09-19T01:30:00.000Z', 'COMPLETED', NULL, NULL, '2026-09-19T10:32:15.141Z', '2026-09-19T13:40:10.766Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8906yc008b9xaax2krdk3d', 'cmu8905bh001d9xaa46n4vtv6', 'Pre-IELTS - Burin & Fa', '2026-09-19T06:00:00.000Z', '2026-09-19T07:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.156Z', '2026-09-19T10:32:15.156Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89073x008z9xaair2dn2oy', 'cmu89056t000v9xaanonik1mk', 'IELTS 6.5 - Yến Ngọc (Ca Sáng)', '2026-09-21T00:00:00.000Z', '2026-09-21T01:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.358Z', '2026-09-19T10:32:15.358Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89074c00919xaazqiwmny6', 'cmu89056t000v9xaanonik1mk', 'IELTS 6.5 - Yến Ngọc (Ca Tối)', '2026-09-21T14:00:00.000Z', '2026-09-21T15:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.372Z', '2026-09-19T10:32:15.372Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89074o00939xaa3tpnjt8e', 'cmu8905fb001v9xaa6pwjdc1t', 'B2 - Ane & Sunday', '2026-09-21T10:30:00.000Z', '2026-09-21T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.384Z', '2026-09-19T10:32:15.384Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89075000959xaaotcau2t6', 'cmu8905fb001v9xaa6pwjdc1t', 'B2 - Ane & Sunday', '2026-09-24T10:30:00.000Z', '2026-09-24T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.397Z', '2026-09-19T10:32:15.397Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89075w00979xaatdh5ervm', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-21T12:00:00.000Z', '2026-09-21T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.428Z', '2026-09-19T10:32:15.428Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89076a00999xaaf2flm7se', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-23T12:00:00.000Z', '2026-09-23T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.443Z', '2026-09-19T10:32:15.443Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89076n009b9xaap3soj7bk', 'cmu8905gw00219xaa55c4q92m', 'B2 - Lyna + Linh', '2026-09-25T12:00:00.000Z', '2026-09-25T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.455Z', '2026-09-19T10:32:15.455Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu890770009d9xaaonr29s9y', 'cmu8905jm002d9xaaq73ftg46', 'B1 - David + Linda + Fin', '2026-09-22T10:30:00.000Z', '2026-09-22T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.469Z', '2026-09-19T14:29:07.822Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89077c009f9xaafobnb9hp', 'cmu8905jm002d9xaaq73ftg46', 'B1 - David + Linda + Fin', '2026-09-24T12:30:00.000Z', '2026-09-24T14:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.481Z', '2026-09-19T14:29:07.822Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu890788009h9xaauol65ev8', 'cmu8905e1001p9xaar51j7h8e', 'C1 - Tony + Chi', '2026-09-22T12:00:00.000Z', '2026-09-22T13:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.512Z', '2026-09-19T10:32:15.512Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89078l009j9xaawjtl926j', 'cmu89059t00159xaabo5ibj5r', 'IELTS - Minh Hiền', '2026-09-23T00:00:00.000Z', '2026-09-23T01:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.526Z', '2026-09-19T10:32:15.526Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu890791009l9xaaj64e6zzf', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-23T10:30:00.000Z', '2026-09-23T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.541Z', '2026-09-19T10:32:15.541Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89079e009n9xaa9zeaw4cs', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-25T10:30:00.000Z', '2026-09-25T12:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.555Z', '2026-09-19T10:32:15.555Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu89079p009p9xaavi1a52s7', 'cmu89058s000z9xaahog3plh5', 'IELTS 6.5 - Mạnh + Nghi', '2026-09-27T03:30:00.000Z', '2026-09-27T05:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.566Z', '2026-09-19T10:32:15.566Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907al009r9xaafqt07xbw', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-24T07:30:00.000Z', '2026-09-24T09:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.597Z', '2026-09-19T10:32:15.597Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907az009t9xaawc5x7z8q', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-26T07:30:00.000Z', '2026-09-26T08:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.611Z', '2026-09-19T10:32:15.611Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907bc009v9xaafm25k3m2', 'cmu8905as00199xaat96l2n33', 'IELTS - Dương', '2026-09-27T06:00:00.000Z', '2026-09-27T07:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.625Z', '2026-09-19T10:32:15.625Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907bq009x9xaa7sdsczvk', 'cmu8905if00279xaatkdztavr', 'B2 - My + Khoa', '2026-09-25T13:30:00.000Z', '2026-09-25T15:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.638Z', '2026-09-19T10:32:15.638Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907c0009z9xaakq5pczrj', 'cmu8905if00279xaatkdztavr', 'B2 - My + Khoa', '2026-09-26T08:30:00.000Z', '2026-09-26T10:00:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.648Z', '2026-09-19T10:32:15.648Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907cu00a19xaabp7hl8re', 'cmu8905cs001j9xaah8cmkcvv', 'C1 - Sarah + Andy', '2026-09-26T00:00:00.000Z', '2026-09-26T01:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.679Z', '2026-09-19T10:32:15.679Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")
VALUES ('cmu8907d900a39xaariqlgd84', 'cmu8905bh001d9xaa46n4vtv6', 'Pre-IELTS - Burin & Fa', '2026-09-26T06:00:00.000Z', '2026-09-26T07:30:00.000Z', 'SCHEDULED', NULL, NULL, '2026-09-19T10:32:15.693Z', '2026-09-19T10:32:15.693Z')
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";

-- LessonRecord
INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905oc002x9xaage9xw7mz', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 1, '2026-07-15T10:32:13.495Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 1', 'Speaking, Fluency', 'Buổi 1: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 1', 7.5, 1.5, '2026-09-19T10:32:13.500Z', '2026-09-19T10:32:13.500Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905oq002z9xaat9unjgu0', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 2, '2026-07-18T10:32:13.512Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 2', 'Writing, Vocabulary', 'Buổi 2: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 2', 8, 1.5, '2026-09-19T10:32:13.514Z', '2026-09-19T10:32:13.514Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905p400319xaags4mbqhv', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 3, '2026-07-21T10:32:13.527Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 3', 'Speaking, Fluency', 'Buổi 3: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 3', 7, 1.5, '2026-09-19T10:32:13.528Z', '2026-09-19T10:32:13.528Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905pg00339xaa3b50h6bq', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 4, '2026-07-24T10:32:13.539Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 4', 'Writing, Vocabulary', 'Buổi 4: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 4', 7.5, 1.5, '2026-09-19T10:32:13.540Z', '2026-09-19T10:32:13.540Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905ps00359xaanojd4k4p', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 5, '2026-07-27T10:32:13.551Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 5', 'Speaking, Fluency', 'Buổi 5: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 5', 8, 1.5, '2026-09-19T10:32:13.552Z', '2026-09-19T10:32:13.552Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905q500379xaa891uirql', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 6, '2026-07-30T10:32:13.564Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 6', 'Writing, Vocabulary', 'Buổi 6: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 6', 7, 1.5, '2026-09-19T10:32:13.565Z', '2026-09-19T10:32:13.565Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905qj00399xaartpaumed', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 7, '2026-08-02T10:32:13.577Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 7', 'Speaking, Fluency', 'Buổi 7: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 7', 7.5, 1.5, '2026-09-19T10:32:13.579Z', '2026-09-19T10:32:13.579Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905qv003b9xaa46dqmofy', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 8, '2026-08-05T10:32:13.590Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 8', 'Writing, Vocabulary', 'Buổi 8: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 8', 8, 1.5, '2026-09-19T10:32:13.591Z', '2026-09-19T10:32:13.591Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905ra003d9xaaa5x6n4st', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 9, '2026-08-08T10:32:13.605Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 9', 'Speaking, Fluency', 'Buổi 9: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 9', 7, 1.5, '2026-09-19T10:32:13.606Z', '2026-09-19T10:32:13.606Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905rm003f9xaawx1nqu9k', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 10, '2026-08-11T10:32:13.617Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 10', 'Writing, Vocabulary', 'Buổi 10: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 10', 7.5, 1.5, '2026-09-19T10:32:13.618Z', '2026-09-19T10:32:13.618Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905ry003h9xaakgow1vww', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 11, '2026-08-14T10:32:13.629Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 11', 'Speaking, Fluency', 'Buổi 11: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 11', 8, 1.5, '2026-09-19T10:32:13.630Z', '2026-09-19T10:32:13.630Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905s9003j9xaa4dtzwoto', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 12, '2026-08-17T10:32:13.640Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 12', 'Writing, Vocabulary', 'Buổi 12: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 12', 7, 1.5, '2026-09-19T10:32:13.641Z', '2026-09-19T10:32:13.641Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905sk003l9xaato8fcg1t', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 13, '2026-08-20T10:32:13.652Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 13', 'Speaking, Fluency', 'Buổi 13: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 13', 7.5, 1.5, '2026-09-19T10:32:13.653Z', '2026-09-19T10:32:13.653Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905sw003n9xaaamlohl0a', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 14, '2026-08-23T10:32:13.663Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 14', 'Writing, Vocabulary', 'Buổi 14: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 14', 8, 1.5, '2026-09-19T10:32:13.664Z', '2026-09-19T10:32:13.664Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905th003p9xaalagli879', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 15, '2026-08-26T10:32:13.684Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 15', 'Speaking, Fluency', 'Buổi 15: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 15', 7, 1.5, '2026-09-19T10:32:13.686Z', '2026-09-19T10:32:13.686Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905ts003r9xaav57z0eh0', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 16, '2026-08-29T10:32:13.695Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 16', 'Writing, Vocabulary', 'Buổi 16: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 16', 7.5, 1.5, '2026-09-19T10:32:13.696Z', '2026-09-19T10:32:13.696Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905u3003t9xaaa2iaidkh', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 17, '2026-09-01T10:32:13.706Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 17', 'Speaking, Fluency', 'Buổi 17: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 17', 8, 1.5, '2026-09-19T10:32:13.708Z', '2026-09-19T10:32:13.708Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905uc003v9xaa8a0gl94p', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 18, '2026-09-04T10:32:13.716Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 18', 'Writing, Vocabulary', 'Buổi 18: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 18', 7, 1.5, '2026-09-19T10:32:13.717Z', '2026-09-19T10:32:13.717Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905uo003x9xaa9udc6v8w', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 19, '2026-09-07T10:32:13.727Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 19', 'Speaking, Fluency', 'Buổi 19: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 19', 7.5, 1.5, '2026-09-19T10:32:13.728Z', '2026-09-19T10:32:13.728Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905v5003z9xaa43krskqa', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 20, '2026-09-10T10:32:13.744Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 20', 'Writing, Vocabulary', 'Buổi 20: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 20', 8, 1.5, '2026-09-19T10:32:13.746Z', '2026-09-19T10:32:13.746Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905vg00419xaahwkvxdy5', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 21, '2026-09-13T10:32:13.755Z', 'PRESENT', 'IELTS Task Speaking Part 2 - Topic 21', 'Speaking, Fluency', 'Buổi 21: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 21', 7, 1.5, '2026-09-19T10:32:13.757Z', '2026-09-19T10:32:13.757Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905vs00439xaaggqkvmjz', NULL, 'cmu89056t000v9xaanonik1mk', 'cmu89050200089xaarv7b9vlb', 22, '2026-09-16T10:32:13.768Z', 'PRESENT', 'IELTS Task Writing 2 - Topic 22', 'Writing, Vocabulary', 'Buổi 22: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.', 'Hoàn thành bài tập Unit 22', 7.5, 1.5, '2026-09-19T10:32:13.769Z', '2026-09-19T10:32:13.769Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905wf00479xaa0k0jwfd1', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 1, '2026-07-05T10:32:13.791Z', 'PRESENT', 'C1 Advanced Paper 2', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.792Z', '2026-09-19T10:32:13.792Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905x000499xaaj85fswlw', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 2, '2026-07-09T10:32:13.811Z', 'PRESENT', 'C1 Advanced Paper 3', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.812Z', '2026-09-19T10:32:13.812Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905xc004b9xaa62ml27zr', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 3, '2026-07-13T10:32:13.823Z', 'PRESENT', 'C1 Advanced Paper 4', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.825Z', '2026-09-19T10:32:13.825Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905xp004d9xaazlfnooew', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 4, '2026-07-17T10:32:13.836Z', 'PRESENT', 'C1 Advanced Paper 1', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.838Z', '2026-09-19T10:32:13.838Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905y0004f9xaa18cl7mv5', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 5, '2026-07-21T10:32:13.847Z', 'PRESENT', 'C1 Advanced Paper 2', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.849Z', '2026-09-19T10:32:13.849Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905yd004h9xaamr58073i', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 6, '2026-07-25T10:32:13.860Z', 'PRESENT', 'C1 Advanced Paper 3', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.861Z', '2026-09-19T10:32:13.861Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8905yz004j9xaamcztfe4f', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 7, '2026-07-29T10:32:13.882Z', 'PRESENT', 'C1 Advanced Paper 4', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.884Z', '2026-09-19T10:32:13.884Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89060s004l9xaa92lzoggv', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 8, '2026-08-02T10:32:13.947Z', 'PRESENT', 'C1 Advanced Paper 1', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:13.948Z', '2026-09-19T10:32:13.948Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89064d004n9xaar0x1k5wv', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 9, '2026-08-06T10:32:14.077Z', 'PRESENT', 'C1 Advanced Paper 2', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.078Z', '2026-09-19T10:32:14.078Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89065j004p9xaa5qobp3og', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 10, '2026-08-10T10:32:14.118Z', 'PRESENT', 'C1 Advanced Paper 3', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.119Z', '2026-09-19T10:32:14.119Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89065v004r9xaarzzxyhbc', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 11, '2026-08-14T10:32:14.130Z', 'PRESENT', 'C1 Advanced Paper 4', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.132Z', '2026-09-19T10:32:14.132Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu890669004t9xaaql0c03we', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 12, '2026-08-18T10:32:14.144Z', 'PRESENT', 'C1 Advanced Paper 1', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.146Z', '2026-09-19T10:32:14.146Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89066l004v9xaay8913p1z', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 13, '2026-08-22T10:32:14.156Z', 'PRESENT', 'C1 Advanced Paper 2', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.158Z', '2026-09-19T10:32:14.158Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89066v004x9xaa88kj60rt', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 14, '2026-08-26T10:32:14.166Z', 'PRESENT', 'C1 Advanced Paper 3', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.168Z', '2026-09-19T10:32:14.168Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu890678004z9xaa81m2h108', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 15, '2026-08-30T10:32:14.179Z', 'PRESENT', 'C1 Advanced Paper 4', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.180Z', '2026-09-19T10:32:14.180Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89067m00519xaanuv0d8ls', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 16, '2026-09-03T10:32:14.193Z', 'PRESENT', 'C1 Advanced Paper 1', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.194Z', '2026-09-19T10:32:14.194Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89067z00539xaapy0voy81', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 17, '2026-09-07T10:32:14.206Z', 'PRESENT', 'C1 Advanced Paper 2', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.208Z', '2026-09-19T10:32:14.208Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89068d00559xaanlax80ji', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 18, '2026-09-11T10:32:14.220Z', 'PRESENT', 'C1 Advanced Paper 3', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.222Z', '2026-09-19T10:32:14.222Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89068q00579xaamv3v0d3j', NULL, 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 19, '2026-09-15T10:32:14.233Z', 'PRESENT', 'C1 Advanced Paper 4', 'Reading & Use of English, Listening', 'Làm bài chắc chắn, từ vựng C1 phong phú.', NULL, 8.5, 1.5, '2026-09-19T10:32:14.235Z', '2026-09-19T10:32:14.235Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89069h005b9xaaoz3fn4y8', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 1, '2026-08-14T10:32:14.260Z', 'PRESENT', 'IELTS Listening & Reading Practice 1', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.261Z', '2026-09-19T10:32:14.261Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu89069y005d9xaafm3wntey', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 2, '2026-08-17T10:32:14.277Z', 'PRESENT', 'IELTS Listening & Reading Practice 2', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.278Z', '2026-09-19T10:32:14.278Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906ac005f9xaaygcp5cqf', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 3, '2026-08-20T10:32:14.291Z', 'PRESENT', 'IELTS Listening & Reading Practice 3', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.293Z', '2026-09-19T10:32:14.293Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906aq005h9xaaofolen33', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 4, '2026-08-23T10:32:14.305Z', 'PRESENT', 'IELTS Listening & Reading Practice 4', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.306Z', '2026-09-19T10:32:14.306Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906b0005j9xaab8fixxlr', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 5, '2026-08-26T10:32:14.316Z', 'PRESENT', 'IELTS Listening & Reading Practice 5', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.317Z', '2026-09-19T10:32:14.317Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906bd005l9xaa8y1rlhb2', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 6, '2026-08-29T10:32:14.328Z', 'PRESENT', 'IELTS Listening & Reading Practice 6', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.330Z', '2026-09-19T10:32:14.330Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906bu005n9xaab8iovcq6', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 7, '2026-09-01T10:32:14.345Z', 'PRESENT', 'IELTS Listening & Reading Practice 7', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.346Z', '2026-09-19T10:32:14.346Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906c9005p9xaamfdmg639', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 8, '2026-09-04T10:32:14.360Z', 'PRESENT', 'IELTS Listening & Reading Practice 8', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.361Z', '2026-09-19T10:32:14.361Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906cn005r9xaafkizhzgt', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 9, '2026-09-07T10:32:14.374Z', 'PRESENT', 'IELTS Listening & Reading Practice 9', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.375Z', '2026-09-19T10:32:14.375Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906d0005t9xaa01g4g8cd', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 10, '2026-09-10T10:32:14.387Z', 'PRESENT', 'IELTS Listening & Reading Practice 10', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.388Z', '2026-09-19T10:32:14.388Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906dc005v9xaaa04taffr', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 11, '2026-09-13T10:32:14.399Z', 'PRESENT', 'IELTS Listening & Reading Practice 11', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.400Z', '2026-09-19T10:32:14.400Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906e2005x9xaanfqm37hh', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050h00099xaaetkv05gp', 12, '2026-09-16T10:32:14.425Z', 'PRESENT', 'IELTS Listening & Reading Practice 12', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.427Z', '2026-09-19T10:32:14.427Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906et00619xaah7puggx8', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 1, '2026-08-14T10:32:14.452Z', 'PRESENT', 'IELTS Listening & Reading Practice 1', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.453Z', '2026-09-19T10:32:14.453Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906f300639xaavrktjcz2', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 2, '2026-08-17T10:32:14.462Z', 'PRESENT', 'IELTS Listening & Reading Practice 2', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.464Z', '2026-09-19T10:32:14.464Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906ff00659xaaajgfwu3g', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 3, '2026-08-20T10:32:14.474Z', 'PRESENT', 'IELTS Listening & Reading Practice 3', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.475Z', '2026-09-19T10:32:14.475Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906g500679xaak4q60dgr', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 4, '2026-08-23T10:32:14.500Z', 'PRESENT', 'IELTS Listening & Reading Practice 4', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.501Z', '2026-09-19T10:32:14.501Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906gg00699xaajvruw2cg', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 5, '2026-08-26T10:32:14.511Z', 'PRESENT', 'IELTS Listening & Reading Practice 5', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.513Z', '2026-09-19T10:32:14.513Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906gu006b9xaat3d3szp2', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 6, '2026-08-29T10:32:14.525Z', 'PRESENT', 'IELTS Listening & Reading Practice 6', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.527Z', '2026-09-19T10:32:14.527Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906h8006d9xaa3kx7zmjy', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 7, '2026-09-01T10:32:14.539Z', 'PRESENT', 'IELTS Listening & Reading Practice 7', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.541Z', '2026-09-19T10:32:14.541Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906hl006f9xaa9h8s8yx9', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 8, '2026-09-04T10:32:14.552Z', 'PRESENT', 'IELTS Listening & Reading Practice 8', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.554Z', '2026-09-19T10:32:14.554Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906iq006h9xaad0o5l1y9', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 9, '2026-09-07T10:32:14.594Z', 'PRESENT', 'IELTS Listening & Reading Practice 9', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.595Z', '2026-09-19T10:32:14.595Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906ja006j9xaax68d8ydf', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 10, '2026-09-10T10:32:14.613Z', 'PRESENT', 'IELTS Listening & Reading Practice 10', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.614Z', '2026-09-19T10:32:14.614Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906jn006l9xaa3g3g4wxf', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 11, '2026-09-13T10:32:14.626Z', 'PRESENT', 'IELTS Listening & Reading Practice 11', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.628Z', '2026-09-19T10:32:14.628Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8906k0006n9xaa2em6fu5b', NULL, 'cmu89058s000z9xaahog3plh5', 'cmu89050t000a9xaa6ugv4eqo', 12, '2026-09-16T10:32:14.639Z', 'PRESENT', 'IELTS Listening & Reading Practice 12', 'Listening, Reading', 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.', NULL, 7, 1.5, '2026-09-19T10:32:14.641Z', '2026-09-19T10:32:14.641Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8fpv8v0001btysp01f1n3i', 'cmu8906xw00899xaavhx1ar1j', 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052f000f9xaav4sxpy5e', 20, '2026-09-19T00:00:00.000Z', 'PRESENT', 'C1 - Sarah + Andy', NULL, NULL, NULL, NULL, 1.5, '2026-09-19T13:40:10.735Z', '2026-09-19T13:40:10.735Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")
VALUES ('cmu8fpv9i0003btysvm6jarex', 'cmu8906xw00899xaavhx1ar1j', 'cmu8905cs001j9xaah8cmkcvv', 'cmu89052o000g9xaaextjvgv0', 1, '2026-09-19T00:00:00.000Z', 'PRESENT', 'C1 - Sarah + Andy', NULL, NULL, NULL, NULL, 1.5, '2026-09-19T13:40:10.759Z', '2026-09-19T13:40:10.759Z')
ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";

-- TuitionInstallment
INSERT INTO "TuitionInstallment" ("id", "studentId", "dueDate", "amount", "status", "note", "paidDate", "createdAt", "updatedAt")
VALUES ('cmua13c100002z6f12c8vdaid', 'cmu89052o000g9xaaextjvgv0', '2026-10-21T00:00:00.000Z', 6000000, 'PAID', 'Đợt 1', NULL, '2026-09-20T16:26:17.124Z', '2026-09-20T16:26:17.124Z')
ON CONFLICT ("id") DO UPDATE SET "dueDate" = EXCLUDED."dueDate", "amount" = EXCLUDED."amount", "status" = EXCLUDED."status", "note" = EXCLUDED."note", "paidDate" = EXCLUDED."paidDate", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "TuitionInstallment" ("id", "studentId", "dueDate", "amount", "status", "note", "paidDate", "createdAt", "updatedAt")
VALUES ('cmua13c100003z6f1i6766gb5', 'cmu89052o000g9xaaextjvgv0', '2026-11-21T00:00:00.000Z', 6000000, 'PENDING', 'Đợt 2', NULL, '2026-09-20T16:26:17.124Z', '2026-09-20T16:26:17.124Z')
ON CONFLICT ("id") DO UPDATE SET "dueDate" = EXCLUDED."dueDate", "amount" = EXCLUDED."amount", "status" = EXCLUDED."status", "note" = EXCLUDED."note", "paidDate" = EXCLUDED."paidDate", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "TuitionInstallment" ("id", "studentId", "dueDate", "amount", "status", "note", "paidDate", "createdAt", "updatedAt")
VALUES ('cmua13c100004z6f1dvdgmllx', 'cmu89052o000g9xaaextjvgv0', '2026-12-21T00:00:00.000Z', 6000000, 'PENDING', 'Đợt 3', NULL, '2026-09-20T16:26:17.124Z', '2026-09-20T16:26:17.124Z')
ON CONFLICT ("id") DO UPDATE SET "dueDate" = EXCLUDED."dueDate", "amount" = EXCLUDED."amount", "status" = EXCLUDED."status", "note" = EXCLUDED."note", "paidDate" = EXCLUDED."paidDate", "updatedAt" = EXCLUDED."updatedAt";

-- 3. ADD FOREIGN KEYS (SAFELY)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ClassGroup_courseId_fkey') THEN
        ALTER TABLE "ClassGroup" ADD CONSTRAINT "ClassGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ClassMember_classGroupId_fkey') THEN
        ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ClassMember_studentId_fkey') THEN
        ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Enrollment_studentId_fkey') THEN
        ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Enrollment_classGroupId_fkey') THEN
        ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Schedule_classGroupId_fkey') THEN
        ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LessonRecord_scheduleId_fkey') THEN
        ALTER TABLE "LessonRecord" ADD CONSTRAINT "LessonRecord_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LessonRecord_classGroupId_fkey') THEN
        ALTER TABLE "LessonRecord" ADD CONSTRAINT "LessonRecord_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LessonRecord_studentId_fkey') THEN
        ALTER TABLE "LessonRecord" ADD CONSTRAINT "LessonRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TuitionInstallment_studentId_fkey') THEN
        ALTER TABLE "TuitionInstallment" ADD CONSTRAINT "TuitionInstallment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

