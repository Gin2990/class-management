import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function dumpData() {
  console.log('🔄 Đang trích xuất toàn bộ dữ liệu từ SQLite (prisma/dev.db)...');

  const teacherProfiles = await prisma.teacherProfile.findMany();
  const courses = await prisma.course.findMany();
  const students = await prisma.student.findMany();
  const classGroups = await prisma.classGroup.findMany();
  const classMembers = await prisma.classMember.findMany();
  const enrollments = await prisma.enrollment.findMany();
  const schedules = await prisma.schedule.findMany();
  const lessonRecords = await prisma.lessonRecord.findMany();
  const tuitionInstallments = await prisma.tuitionInstallment.findMany();

  const data = {
    dumpDate: new Date().toISOString(),
    stats: {
      teacherProfiles: teacherProfiles.length,
      courses: courses.length,
      students: students.length,
      classGroups: classGroups.length,
      classMembers: classMembers.length,
      enrollments: enrollments.length,
      schedules: schedules.length,
      lessonRecords: lessonRecords.length,
      tuitionInstallments: tuitionInstallments.length,
    },
    teacherProfiles,
    courses,
    students,
    classGroups,
    classMembers,
    enrollments,
    schedules,
    lessonRecords,
    tuitionInstallments,
  };

  const dumpPath = path.join(process.cwd(), 'prisma', 'data_dump.json');
  fs.writeFileSync(dumpPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('✅ Đã xuất thành công toàn bộ dữ liệu ra file:', dumpPath);
  console.log('📊 Thống kê dữ liệu:');
  console.log(JSON.stringify(data.stats, null, 2));
}

dumpData()
  .catch((e) => {
    console.error('❌ Lỗi khi xuất dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
