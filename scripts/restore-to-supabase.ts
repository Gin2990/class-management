import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreData() {
  const dumpPath = path.join(process.cwd(), 'prisma', 'data_dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error('❌ Không tìm thấy file dữ liệu sao lưu:', dumpPath);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dumpPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log('🚀 Bắt đầu khôi phục và đẩy toàn bộ dữ liệu vào Supabase PostgreSQL...');
  console.log('📊 Số lượng bản ghi sẽ chuyển giao:', data.stats);

  // 1. TeacherProfile
  console.log('⏳ Đang chuyển TeacherProfile...');
  for (const item of data.teacherProfiles) {
    const { createdAt, updatedAt, ...rest } = item;
    await prisma.teacherProfile.upsert({
      where: { id: rest.id },
      update: rest,
      create: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 2. Course
  console.log('⏳ Đang chuyển Course...');
  for (const item of data.courses) {
    const { createdAt, updatedAt, ...rest } = item;
    await prisma.course.upsert({
      where: { id: rest.id },
      update: rest,
      create: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 3. Student
  console.log('⏳ Đang chuyển Student...');
  for (const item of data.students) {
    const { createdAt, updatedAt, ...rest } = item;
    await prisma.student.upsert({
      where: { id: rest.id },
      update: rest,
      create: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 4. ClassGroup
  console.log('⏳ Đang chuyển ClassGroup...');
  for (const item of data.classGroups) {
    const { createdAt, updatedAt, ...rest } = item;
    await prisma.classGroup.upsert({
      where: { id: rest.id },
      update: rest,
      create: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 5. ClassMember
  console.log('⏳ Đang chuyển ClassMember...');
  for (const item of data.classMembers) {
    const { createdAt, ...rest } = item;
    await prisma.classMember.upsert({
      where: { id: rest.id },
      update: rest,
      create: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
      },
    });
  }

  // 6. Enrollment
  console.log('⏳ Đang chuyển Enrollment...');
  for (const item of data.enrollments) {
    const { createdAt, updatedAt, startDate, endDate, ...rest } = item;
    await prisma.enrollment.upsert({
      where: { id: rest.id },
      update: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      create: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 7. Schedule
  console.log('⏳ Đang chuyển Schedule...');
  for (const item of data.schedules) {
    const { createdAt, updatedAt, startTime, endTime, ...rest } = item;
    await prisma.schedule.upsert({
      where: { id: rest.id },
      update: {
        ...rest,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      create: {
        ...rest,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 8. LessonRecord
  console.log('⏳ Đang chuyển LessonRecord...');
  for (const item of data.lessonRecords) {
    const { createdAt, updatedAt, date, ...rest } = item;
    await prisma.lessonRecord.upsert({
      where: { id: rest.id },
      update: {
        ...rest,
        date: date ? new Date(date) : undefined,
      },
      create: {
        ...rest,
        date: date ? new Date(date) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  // 9. TuitionInstallment
  console.log('⏳ Đang chuyển TuitionInstallment...');
  for (const item of data.tuitionInstallments) {
    const { createdAt, updatedAt, dueDate, paidDate, ...rest } = item;
    await prisma.tuitionInstallment.upsert({
      where: { id: rest.id },
      update: {
        ...rest,
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : undefined,
      },
      create: {
        ...rest,
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
  }

  console.log('🎉 Hoàn tất 100%! Toàn bộ dữ liệu đã được nạp thành công vào Supabase PostgreSQL!');
}

restoreData()
  .catch((e) => {
    console.error('❌ Lỗi khi nạp dữ liệu vào Supabase:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
