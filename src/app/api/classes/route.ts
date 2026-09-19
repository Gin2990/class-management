import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ScheduleSlotInput {
  dayOfWeek: number; // 0: Chủ Nhật, 1: Thứ 2, ..., 6: Thứ 7
  startTime: string; // '19:00'
  endTime: string;   // '20:30'
}

async function generateSchedulesForClass({
  classGroupId,
  classTitle,
  startDateStr,
  scheduleSlots,
  repeatWeeks,
}: {
  classGroupId: string;
  classTitle: string;
  startDateStr: string;
  scheduleSlots: ScheduleSlotInput[];
  repeatWeeks: number;
}) {
  let createdCount = 0;
  if (!startDateStr || !scheduleSlots || scheduleSlots.length === 0) {
    return 0;
  }

  const baseDate = new Date(`${startDateStr}T00:00:00`);
  const numWeeks = Math.max(1, Math.min(52, parseInt(repeatWeeks as any) || 8));
  const totalDays = numWeeks * 7;

  for (let offset = 0; offset < totalDays; offset++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + offset);
    const dOfWeek = curDate.getDay();

    const matchingSlots = scheduleSlots.filter((slot) => Number(slot.dayOfWeek) === dOfWeek);
    for (const slot of matchingSlots) {
      const year = curDate.getFullYear();
      const month = String(curDate.getMonth() + 1).padStart(2, '0');
      const day = String(curDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const sStart = new Date(`${dateString}T${slot.startTime}:00`);
      const sEnd = new Date(`${dateString}T${slot.endTime}:00`);

      await prisma.schedule.create({
        data: {
          classGroupId,
          title: classTitle,
          startTime: sStart,
          endTime: sEnd,
          status: 'SCHEDULED',
        },
      });
      createdCount++;
    }
  }

  return createdCount;
}

export async function GET() {
  try {
    const classes = await prisma.classGroup.findMany({
      include: {
        course: true,
        members: {
          include: {
            student: true,
          },
        },
        schedules: {
          where: {
            status: 'SCHEDULED',
          },
          orderBy: {
            startTime: 'asc',
          },
          take: 14,
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
          },
        },
        _count: {
          select: {
            schedules: true,
            lessonRecords: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: classes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      courseId,
      locationOrLink,
      studentIds = [],
      startDate,
      startTime,
      endTime,
      repeatWeeks = 4,
      color,
      scheduleSlots = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tên lớp học không được để trống!' },
        { status: 400 }
      );
    }

    const colors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
      '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'
    ];
    const assignedColor = color || colors[Math.floor(Math.random() * colors.length)];

    // 1. Tạo Lớp học
    const newClass = await prisma.classGroup.create({
      data: {
        name: name.trim(),
        courseId: courseId || null,
        locationOrLink: locationOrLink || 'Google Meet',
        color: assignedColor,
        category: 'TUTORING',
      },
    });

    // 2. Gán học viên vào lớp (ClassMember)
    if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
      await prisma.classMember.createMany({
        data: studentIds.map((sId: string) => ({
          classGroupId: newClass.id,
          studentId: sId,
        })),
      });
    }

    // 3. Tự động sinh ca học cho thời khóa biểu (hỗ trợ nhiều buổi/tuần)
    let createdSchedulesCount = 0;
    const finalSlots: ScheduleSlotInput[] =
      scheduleSlots && Array.isArray(scheduleSlots) && scheduleSlots.length > 0
        ? scheduleSlots
        : startDate && startTime && endTime
        ? [{ dayOfWeek: new Date(`${startDate}T00:00:00`).getDay(), startTime, endTime }]
        : [];

    if (startDate && finalSlots.length > 0) {
      createdSchedulesCount = await generateSchedulesForClass({
        classGroupId: newClass.id,
        classTitle: newClass.name,
        startDateStr: startDate,
        scheduleSlots: finalSlots,
        repeatWeeks,
      });
    }

    return NextResponse.json({
      success: true,
      data: newClass,
      schedulesCount: createdSchedulesCount,
      message: `Đã tạo lớp "${newClass.name}" và tự động tạo ${createdSchedulesCount} ca học trên thời khóa biểu!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu class ID' }, { status: 400 });
    }

    // Xóa schedules liên quan
    await prisma.schedule.deleteMany({
      where: { classGroupId: id },
    });

    // Xóa class members
    await prisma.classMember.deleteMany({
      where: { classGroupId: id },
    });

    // Xóa class group
    await prisma.classGroup.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa lớp học và các ca lịch liên quan thành công!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      courseId,
      locationOrLink,
      studentIds,
      color,
      changeSchedule = false,
      effectiveDate,
      startTime,
      endTime,
      repeatWeeks = 8,
      scheduleSlots = [],
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID lớp học!' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name.trim();
    if (courseId !== undefined) dataToUpdate.courseId = courseId || null;
    if (locationOrLink !== undefined) dataToUpdate.locationOrLink = locationOrLink.trim();
    if (color !== undefined) dataToUpdate.color = color;

    // 1. Cập nhật thông tin cơ bản lớp học
    const updatedClass = await prisma.classGroup.update({
      where: { id },
      data: dataToUpdate,
    });

    // 2. Đồng bộ hóa học viên của lớp nếu studentIds được cung cấp
    if (studentIds && Array.isArray(studentIds)) {
      // Xóa liên kết thành viên cũ
      await prisma.classMember.deleteMany({
        where: { classGroupId: id },
      });

      // Tạo lại liên kết các thành viên mới
      if (studentIds.length > 0) {
        await prisma.classMember.createMany({
          data: studentIds.map((sId: string) => ({
            classGroupId: id,
            studentId: sId,
          })),
        });
      }
    }

    // 3. Nếu đổi tên lớp, cập nhật lại tiêu đề các ca học tương lai chưa diễn ra
    if (name && name.trim()) {
      await prisma.schedule.updateMany({
        where: {
          classGroupId: id,
          status: 'SCHEDULED',
        },
        data: {
          title: name.trim(),
        },
      });
    }

    // 4. Nếu có yêu cầu thay đổi thời khóa biểu (changeSchedule = true)
    let newSchedulesCount = 0;
    if (changeSchedule && effectiveDate) {
      const effectiveStart = new Date(`${effectiveDate}T00:00:00`);

      // Xóa các ca học chưa diễn ra từ mốc thời gian hiệu lực trở đi
      await prisma.schedule.deleteMany({
        where: {
          classGroupId: id,
          startTime: {
            gte: effectiveStart,
          },
          status: 'SCHEDULED',
        },
      });

      // Xác định danh sách các ca trong tuần (hỗ trợ nhiều buổi/tuần)
      const finalEditSlots: ScheduleSlotInput[] =
        scheduleSlots && Array.isArray(scheduleSlots) && scheduleSlots.length > 0
          ? scheduleSlots
          : startTime && endTime
          ? [{ dayOfWeek: new Date(`${effectiveDate}T00:00:00`).getDay(), startTime, endTime }]
          : [];

      if (finalEditSlots.length > 0) {
        newSchedulesCount = await generateSchedulesForClass({
          classGroupId: id,
          classTitle: updatedClass.name,
          startDateStr: effectiveDate,
          scheduleSlots: finalEditSlots,
          repeatWeeks,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedClass,
      newSchedulesCount,
      message: changeSchedule
        ? `Đã cập nhật lớp "${updatedClass.name}" và đổi lịch học từ ngày ${new Date(effectiveDate).toLocaleDateString('vi-VN')} (${newSchedulesCount} ca mới)!`
        : `Đã cập nhật thông tin lớp "${updatedClass.name}" thành công!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
