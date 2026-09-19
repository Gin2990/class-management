import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json({ success: true, data: courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, level = 'GENERAL', description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tên khóa học không được để trống!' },
        { status: 400 }
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        name: name.trim(),
        code: code?.trim() || null,
        level: (level || 'GENERAL').trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newCourse,
      message: `Đã tạo khóa học "${newCourse.name}" thành công!`,
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
      return NextResponse.json({ success: false, error: 'Thiếu Course ID!' }, { status: 400 });
    }

    // Kiểm tra xem khóa học có lớp nào đang sử dụng không
    const classesCount = await prisma.classGroup.count({
      where: { courseId: id },
    });

    if (classesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Không thể xóa vì đang có ${classesCount} lớp học thuộc khóa học này!`,
        },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa khóa học thành công!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
