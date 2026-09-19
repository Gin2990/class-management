import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const whereClause: any = {};
    if (start && end) {
      whereClause.startTime = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        classGroup: {
          include: {
            members: {
              include: {
                student: true,
              },
            },
            course: true,
          },
        },
        lessonRecords: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      classGroupId,
      customClassName,
      title,
      startTime,
      endTime,
      notes,
      repeatType = 'NONE', // 'NONE' | 'WEEKLY' | 'MONTHLY'
      repeatCount = 1,
    } = body;

    let targetClassId = classGroupId;

    // Nếu người dùng nhập tên lớp bằng text mới
    if (customClassName && customClassName.trim()) {
      const trimmedName = customClassName.trim();
      let existingClass = await prisma.classGroup.findFirst({
        where: {
          name: {
            equals: trimmedName,
          },
        },
      });

      if (!existingClass) {
        // Bảng màu đẹp ngẫu nhiên cho lớp mới
        const colors = [
          '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
          '#ec4899', '#06b6d4', '#f97316', '#6366f1',
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        existingClass = await prisma.classGroup.create({
          data: {
            name: trimmedName,
            color: randomColor,
            category: 'TUTORING',
            locationOrLink: 'Google Meet',
          },
        });
      }
      targetClassId = existingClass.id;
    }

    if (!targetClassId) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn hoặc nhập tên lớp học!' },
        { status: 400 }
      );
    }

    // Tính toán tạo các ca học (hỗ trợ lặp lại tuần, tháng)
    const baseStart = new Date(startTime);
    const baseEnd = new Date(endTime);
    const durationMs = baseEnd.getTime() - baseStart.getTime();

    let count = 1;
    if (repeatType === 'WEEKLY' || repeatType === 'MONTHLY') {
      count = Math.max(1, Math.min(52, parseInt(repeatCount) || 1));
    }

    const createdSchedules = [];

    for (let i = 0; i < count; i++) {
      const curStart = new Date(baseStart);
      if (repeatType === 'WEEKLY') {
        curStart.setDate(curStart.getDate() + (i * 7));
      } else if (repeatType === 'MONTHLY') {
        curStart.setMonth(curStart.getMonth() + i);
      }
      const curEnd = new Date(curStart.getTime() + durationMs);

      const sc = await prisma.schedule.create({
        data: {
          classGroupId: targetClassId,
          title: title || 'Ca học',
          startTime: curStart,
          endTime: curEnd,
          notes,
          status: 'SCHEDULED',
        },
        include: {
          classGroup: true,
        },
      });
      createdSchedules.push(sc);
    }

    return NextResponse.json({
      success: true,
      data: createdSchedules[0],
      count: createdSchedules.length,
      message: `Đã tạo thành công ${createdSchedules.length} ca học!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, startTime, endTime, status, title, notes } = body;

    const dataToUpdate: any = {};
    let diffHours: number | null = null;

    if (startTime) dataToUpdate.startTime = new Date(startTime);
    if (endTime) dataToUpdate.endTime = new Date(endTime);
    if (status) dataToUpdate.status = status;
    if (title) dataToUpdate.title = title;
    if (notes !== undefined) dataToUpdate.notes = notes;

    if (dataToUpdate.startTime && dataToUpdate.endTime) {
      const diffMs = dataToUpdate.endTime.getTime() - dataToUpdate.startTime.getTime();
      if (diffMs > 0) {
        diffHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
      }
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: dataToUpdate,
      include: {
        classGroup: true,
      },
    });

    // Nếu ca này đã có bản ghi buổi học, đồng bộ luôn durationHours
    if (diffHours !== null && diffHours > 0) {
      await prisma.lessonRecord.updateMany({
        where: { scheduleId: id },
        data: {
          durationHours: diffHours,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    const idsParam = searchParams.get('ids');

    let idsToDelete: string[] = [];

    if (idParam) {
      idsToDelete.push(idParam);
    } else if (idsParam) {
      idsToDelete = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      // Try to parse body if present
      try {
        const body = await req.json();
        if (body.ids && Array.isArray(body.ids)) {
          idsToDelete = body.ids;
        } else if (body.id) {
          idsToDelete = [body.id];
        }
      } catch (_) {}
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Thiếu schedule ID hoặc danh sách IDs cần xóa' },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.schedule.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công ${deleteResult.count} buổi học`,
      deletedCount: deleteResult.count,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
