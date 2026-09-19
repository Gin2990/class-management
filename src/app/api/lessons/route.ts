import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const classGroupId = searchParams.get('classGroupId');

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (classGroupId) where.classGroupId = classGroupId;

    const lessons = await prisma.lessonRecord.findMany({
      where,
      include: {
        student: true,
        classGroup: true,
        schedule: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scheduleId,
      classGroupId,
      studentId,
      attendances, // Array of { studentId: string, attendance: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' }
      attendance = 'PRESENT',
      topic,
      skillsCovered,
      teacherNotes,
      homework,
      performanceScore,
      actualStartTime,
      actualEndTime,
    } = body;

    // Chuẩn hóa danh sách học viên điểm danh
    let targetAttendances: Array<{ studentId: string; attendance: string }> = [];

    if (attendances && Array.isArray(attendances) && attendances.length > 0) {
      targetAttendances = attendances;
    } else if (studentId) {
      targetAttendances = [{ studentId, attendance }];
    }

    if (targetAttendances.length === 0 || !classGroupId) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn học viên và lớp học!' },
        { status: 400 }
      );
    }

    // Tính thời lượng giờ học thực tế
    let durationHours = 1.5;
    if (actualStartTime && actualEndTime) {
      const diffMs = new Date(actualEndTime).getTime() - new Date(actualStartTime).getTime();
      if (diffMs > 0) {
        durationHours = Math.round((diffMs / 3600000) * 10) / 10;
      }
    } else if (scheduleId) {
      const sch = await prisma.schedule.findUnique({ where: { id: scheduleId } });
      if (sch && sch.startTime && sch.endTime) {
        const diffMs = new Date(sch.endTime).getTime() - new Date(sch.startTime).getTime();
        if (diffMs > 0) {
          durationHours = Math.round((diffMs / 3600000) * 10) / 10;
        }
      }
    }

    const createdRecords = [];

    // Ghi nhận nhật ký cho từng học viên
    for (const item of targetAttendances) {
      // Tìm số buổi trước đó của học viên để tăng sessionNumber
      const previousRecordCount = await prisma.lessonRecord.count({
        where: {
          studentId: item.studentId,
          attendance: 'PRESENT',
        },
      });

      const sessionNumber = previousRecordCount + (item.attendance === 'PRESENT' ? 1 : 0);

      const record = await prisma.lessonRecord.create({
        data: {
          scheduleId: scheduleId || null,
          classGroupId,
          studentId: item.studentId,
          sessionNumber: Math.max(1, sessionNumber),
          attendance: item.attendance || 'PRESENT',
          topic: topic || 'Buổi học',
          skillsCovered: skillsCovered || null,
          teacherNotes: teacherNotes || null,
          homework: homework || null,
          performanceScore: performanceScore ? parseFloat(performanceScore) : null,
          durationHours: item.attendance === 'PRESENT' ? durationHours : 0,
          date: actualStartTime ? new Date(actualStartTime) : new Date(),
        },
        include: {
          student: true,
          classGroup: true,
        },
      });
      createdRecords.push(record);
    }

    // Nếu có scheduleId, cập nhật trạng thái schedule sang COMPLETED và đồng bộ thời gian học thực tế
    if (scheduleId) {
      const scheduleUpdateData: any = { status: 'COMPLETED' };
      if (actualStartTime) scheduleUpdateData.startTime = new Date(actualStartTime);
      if (actualEndTime) scheduleUpdateData.endTime = new Date(actualEndTime);

      await prisma.schedule.update({
        where: { id: scheduleId },
        data: scheduleUpdateData,
      });
    }

    return NextResponse.json({
      success: true,
      data: createdRecords,
      message: `Đã điểm danh thành công ${createdRecords.length} học viên!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
