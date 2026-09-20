import * as fs from 'fs';
import * as path from 'path';

function escapeSql(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return String(str);
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (str instanceof Date) return `'${str.toISOString()}'`;
  // string with date check
  const escaped = String(str).replace(/'/g, "''");
  return `'${escaped}'`;
}

function escapeDate(d: any): string {
  if (!d) return 'NULL';
  return `'${new Date(d).toISOString()}'`;
}

async function generate() {
  const dumpPath = path.join(process.cwd(), 'prisma', 'data_dump.json');
  const rawData = fs.readFileSync(dumpPath, 'utf-8');
  const data = JSON.parse(rawData);

  let sql = `-- ==========================================================================\n`;
  sql += `-- SUPABASE POSTGRESQL MIGRATION SCRIPT - QUAN LY LOP HOC WEBAPP\n`;
  sql += `-- Auto-generated on: ${new Date().toISOString()}\n`;
  sql += `-- ==========================================================================\n\n`;

  sql += `-- 1. CREATE TABLES IF NOT EXISTS\n`;
  sql += `CREATE TABLE IF NOT EXISTS "TeacherProfile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'Giáo viên',
    "email" TEXT,
    "phone" TEXT,
    "bankName" TEXT NOT NULL DEFAULT 'MBBANK',
    "bankAccount" TEXT NOT NULL DEFAULT '0987654321',
    "bankAccountName" TEXT NOT NULL DEFAULT 'NGUYEN DINH LINH',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "level" TEXT NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "Student" (
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
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "ClassGroup" (
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
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "ClassMember" (
    "id" TEXT NOT NULL,
    "classGroupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("id")
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "Enrollment" (
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
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "Schedule" (
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
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "LessonRecord" (
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
);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS "TuitionInstallment" (
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
);\n\n`;

  sql += `-- UNIQUE INDEXES & FOREIGN KEYS\n`;
  sql += `CREATE UNIQUE INDEX IF NOT EXISTS "ClassMember_classGroupId_studentId_key" ON "ClassMember"("classGroupId", "studentId");\n\n`;

  sql += `-- 2. DATA INSERTIONS (UPSERT)\n\n`;

  // 1. TeacherProfile
  sql += `-- TeacherProfile\n`;
  for (const t of data.teacherProfiles) {
    sql += `INSERT INTO "TeacherProfile" ("id", "fullName", "email", "phone", "bankName", "bankAccount", "bankAccountName", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(t.id)}, ${escapeSql(t.fullName)}, ${escapeSql(t.email)}, ${escapeSql(t.phone)}, ${escapeSql(t.bankName)}, ${escapeSql(t.bankAccount)}, ${escapeSql(t.bankAccountName)}, ${escapeDate(t.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "fullName" = EXCLUDED."fullName", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "bankName" = EXCLUDED."bankName", "bankAccount" = EXCLUDED."bankAccount", "bankAccountName" = EXCLUDED."bankAccountName", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 2. Course
  sql += `-- Course\n`;
  for (const c of data.courses) {
    sql += `INSERT INTO "Course" ("id", "name", "code", "description", "level", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.code)}, ${escapeSql(c.description)}, ${escapeSql(c.level)}, ${escapeDate(c.createdAt)}, ${escapeDate(c.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "code" = EXCLUDED."code", "description" = EXCLUDED."description", "level" = EXCLUDED."level", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 3. Student
  sql += `-- Student\n`;
  for (const s of data.students) {
    sql += `INSERT INTO "Student" ("id", "name", "email", "phone", "parentName", "parentEmail", "parentPhone", "status", "notes", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.email)}, ${escapeSql(s.phone)}, ${escapeSql(s.parentName)}, ${escapeSql(s.parentEmail)}, ${escapeSql(s.parentPhone)}, ${escapeSql(s.status)}, ${escapeSql(s.notes)}, ${escapeDate(s.createdAt)}, ${escapeDate(s.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "parentName" = EXCLUDED."parentName", "parentEmail" = EXCLUDED."parentEmail", "parentPhone" = EXCLUDED."parentPhone", "status" = EXCLUDED."status", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 4. ClassGroup
  sql += `-- ClassGroup\n`;
  for (const cg of data.classGroups) {
    sql += `INSERT INTO "ClassGroup" ("id", "name", "courseId", "category", "color", "locationOrLink", "status", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(cg.id)}, ${escapeSql(cg.name)}, ${escapeSql(cg.courseId)}, ${escapeSql(cg.category)}, ${escapeSql(cg.color)}, ${escapeSql(cg.locationOrLink)}, ${escapeSql(cg.status)}, ${escapeDate(cg.createdAt)}, ${escapeDate(cg.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "courseId" = EXCLUDED."courseId", "category" = EXCLUDED."category", "color" = EXCLUDED."color", "locationOrLink" = EXCLUDED."locationOrLink", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 5. ClassMember
  sql += `-- ClassMember\n`;
  for (const cm of data.classMembers) {
    sql += `INSERT INTO "ClassMember" ("id", "classGroupId", "studentId", "createdAt")\n`;
    sql += `VALUES (${escapeSql(cm.id)}, ${escapeSql(cm.classGroupId)}, ${escapeSql(cm.studentId)}, ${escapeDate(cm.createdAt)})\n`;
    sql += `ON CONFLICT ("id") DO NOTHING;\n\n`;
  }

  // 6. Enrollment
  sql += `-- Enrollment\n`;
  for (const e of data.enrollments) {
    sql += `INSERT INTO "Enrollment" ("id", "studentId", "classGroupId", "title", "totalSessions", "pricePerSession", "totalAmount", "paidAmount", "paymentStatus", "startDate", "endDate", "notes", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(e.id)}, ${escapeSql(e.studentId)}, ${escapeSql(e.classGroupId)}, ${escapeSql(e.title)}, ${e.totalSessions || 20}, ${e.pricePerSession || 250000}, ${e.totalAmount || 5000000}, ${e.paidAmount || 0}, ${escapeSql(e.paymentStatus || 'UNPAID')}, ${escapeDate(e.startDate)}, ${escapeDate(e.endDate)}, ${escapeSql(e.notes)}, ${escapeDate(e.createdAt)}, ${escapeDate(e.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "totalSessions" = EXCLUDED."totalSessions", "pricePerSession" = EXCLUDED."pricePerSession", "totalAmount" = EXCLUDED."totalAmount", "paidAmount" = EXCLUDED."paidAmount", "paymentStatus" = EXCLUDED."paymentStatus", "startDate" = EXCLUDED."startDate", "endDate" = EXCLUDED."endDate", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 7. Schedule
  sql += `-- Schedule\n`;
  for (const sc of data.schedules) {
    sql += `INSERT INTO "Schedule" ("id", "classGroupId", "title", "startTime", "endTime", "status", "googleEventId", "notes", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(sc.id)}, ${escapeSql(sc.classGroupId)}, ${escapeSql(sc.title)}, ${escapeDate(sc.startTime)}, ${escapeDate(sc.endTime)}, ${escapeSql(sc.status || 'SCHEDULED')}, ${escapeSql(sc.googleEventId)}, ${escapeSql(sc.notes)}, ${escapeDate(sc.createdAt)}, ${escapeDate(sc.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "startTime" = EXCLUDED."startTime", "endTime" = EXCLUDED."endTime", "status" = EXCLUDED."status", "googleEventId" = EXCLUDED."googleEventId", "notes" = EXCLUDED."notes", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 8. LessonRecord
  sql += `-- LessonRecord\n`;
  for (const lr of data.lessonRecords) {
    sql += `INSERT INTO "LessonRecord" ("id", "scheduleId", "classGroupId", "studentId", "sessionNumber", "date", "attendance", "topic", "skillsCovered", "teacherNotes", "homework", "performanceScore", "durationHours", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(lr.id)}, ${escapeSql(lr.scheduleId)}, ${escapeSql(lr.classGroupId)}, ${escapeSql(lr.studentId)}, ${lr.sessionNumber || 1}, ${escapeDate(lr.date)}, ${escapeSql(lr.attendance || 'PRESENT')}, ${escapeSql(lr.topic)}, ${escapeSql(lr.skillsCovered)}, ${escapeSql(lr.teacherNotes)}, ${escapeSql(lr.homework)}, ${lr.performanceScore || 'NULL'}, ${lr.durationHours || 1.5}, ${escapeDate(lr.createdAt)}, ${escapeDate(lr.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "scheduleId" = EXCLUDED."scheduleId", "sessionNumber" = EXCLUDED."sessionNumber", "date" = EXCLUDED."date", "attendance" = EXCLUDED."attendance", "topic" = EXCLUDED."topic", "skillsCovered" = EXCLUDED."skillsCovered", "teacherNotes" = EXCLUDED."teacherNotes", "homework" = EXCLUDED."homework", "performanceScore" = EXCLUDED."performanceScore", "durationHours" = EXCLUDED."durationHours", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 9. TuitionInstallment
  sql += `-- TuitionInstallment\n`;
  for (const ti of data.tuitionInstallments) {
    sql += `INSERT INTO "TuitionInstallment" ("id", "studentId", "dueDate", "amount", "status", "note", "paidDate", "createdAt", "updatedAt")\n`;
    sql += `VALUES (${escapeSql(ti.id)}, ${escapeSql(ti.studentId)}, ${escapeDate(ti.dueDate)}, ${ti.amount || 0}, ${escapeSql(ti.status || 'PENDING')}, ${escapeSql(ti.note)}, ${escapeDate(ti.paidDate)}, ${escapeDate(ti.createdAt)}, ${escapeDate(ti.updatedAt)})\n`;
    sql += `ON CONFLICT ("id") DO UPDATE SET "dueDate" = EXCLUDED."dueDate", "amount" = EXCLUDED."amount", "status" = EXCLUDED."status", "note" = EXCLUDED."note", "paidDate" = EXCLUDED."paidDate", "updatedAt" = EXCLUDED."updatedAt";\n\n`;
  }

  // 10. Foreign Keys (safe addition)
  sql += `-- 3. ADD FOREIGN KEYS (SAFELY)\n`;
  sql += `DO $$ BEGIN
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
END $$;\n\n`;

  const outPath = path.join(process.cwd(), 'prisma', 'supabase_migration.sql');
  fs.writeFileSync(outPath, sql, 'utf-8');
  console.log('✅ Generated supabase_migration.sql successfully at:', outPath);
}

generate().catch(console.error);
