import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const st = await prisma.student.findUnique({
      where: { id },
      include: {
        classMembers: {
          include: {
            classGroup: {
              include: {
                course: true,
                schedules: {
                  where: {
                    status: 'SCHEDULED',
                  },
                  orderBy: {
                    startTime: 'asc',
                  },
                },
              },
            },
          },
        },
        enrollments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        lessonRecords: {
          include: {
            schedule: true,
          },
          orderBy: {
            sessionNumber: 'desc',
          },
        },
        tuitionInstallments: {
          orderBy: {
            dueDate: 'asc',
          },
        },
      },
    });

    if (!st) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy học viên' }, { status: 404 });
    }

    const totalHours = st.enrollments.reduce((sum, en) => sum + (en.totalSessions || 0), 0);
    const completedHours = st.lessonRecords
      .filter((rec) => rec.attendance === 'PRESENT')
      .reduce((sum, rec) => {
        let h = rec.durationHours;
        if (!h && rec.schedule?.startTime && rec.schedule?.endTime) {
          const diffMs = new Date(rec.schedule.endTime).getTime() - new Date(rec.schedule.startTime).getTime();
          if (diffMs > 0) {
            h = Math.round((diffMs / 3600000) * 10) / 10;
          }
        }
        return sum + (h ?? 1.5);
      }, 0);

    const roundedTotalHours = Math.round(totalHours * 10) / 10;
    const roundedCompletedHours = Math.round(completedHours * 10) / 10;
    const remainingHours = Math.max(0, Math.round((roundedTotalHours - roundedCompletedHours) * 10) / 10);
    const isUrgent = roundedTotalHours > 0 && remainingHours <= 3;
    const activeEnrollment = st.enrollments[0] || null;
    const nextCycleFee = activeEnrollment
      ? Math.round((activeEnrollment.totalSessions || 20) * activeEnrollment.pricePerSession)
      : 6000000;

    const nextInstallment = st.tuitionInstallments.find((inst) => inst.status !== 'PAID') 
      || st.tuitionInstallments[0] 
      || null;

    return NextResponse.json({
      success: true,
      data: {
        ...st,
        totalHours: roundedTotalHours,
        completedHours: roundedCompletedHours,
        remainingHours,
        totalSessions: roundedTotalHours,
        completedSessions: roundedCompletedHours,
        remainingSessions: remainingHours,
        isUrgent,
        activeEnrollment,
        nextCycleFee,
        nextInstallment,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      name,
      email,
      phone,
      parentName,
      parentEmail,
      parentPhone,
      classGroupId,
      totalSessions,
      pricePerSession,
      totalHours,
      pricePerHour,
      installments,
    } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name.trim();
    if (email !== undefined) dataToUpdate.email = email.trim() || null;
    if (phone !== undefined) dataToUpdate.phone = phone.trim() || null;
    if (parentName !== undefined) dataToUpdate.parentName = parentName.trim() || null;
    if (parentEmail !== undefined) dataToUpdate.parentEmail = parentEmail.trim() || null;
    if (parentPhone !== undefined) dataToUpdate.parentPhone = parentPhone.trim() || null;

    // 1. Cập nhật thông tin cơ bản học viên
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: dataToUpdate,
    });

    // Lưu ý: Việc xếp lớp (classMember) được quản lý tập trung tại Quản Lý Lớp Học (/classes).
    // Không ghi đè hoặc xóa classMember khi cập nhật thông tin học viên.

    // 3. Cập nhật gói giờ học (enrollment)
    const rawHours = totalHours !== undefined ? totalHours : totalSessions;
    const rawPrice = pricePerHour !== undefined ? pricePerHour : pricePerSession;

    if (rawHours !== undefined && rawPrice !== undefined) {
      const activeEnrollment = await prisma.enrollment.findFirst({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
      });

      const totalH = parseFloat(rawHours) || 20;
      const pricePerH = parseFloat(rawPrice) || 250000;
      const totalAmt = Math.round(totalH * pricePerH);

      if (activeEnrollment) {
        await prisma.enrollment.update({
          where: { id: activeEnrollment.id },
          data: {
            title: `Gói ${totalH} giờ`,
            totalSessions: totalH,
            pricePerSession: pricePerH,
            totalAmount: totalAmt,
            paidAmount: totalAmt,
            classGroupId: classGroupId || activeEnrollment.classGroupId,
          },
        });
      } else {
        await prisma.enrollment.create({
          data: {
            studentId: id,
            classGroupId: classGroupId || null,
            title: `Gói ${totalH} giờ`,
            totalSessions: totalH,
            pricePerSession: pricePerH,
            totalAmount: totalAmt,
            paidAmount: totalAmt,
            paymentStatus: 'PAID',
          },
        });
      }
    }

    // 4. Đồng bộ các đợt đóng học phí
    if (installments !== undefined && Array.isArray(installments)) {
      await prisma.tuitionInstallment.deleteMany({
        where: { studentId: id },
      });

      const validInstallments = installments.filter(
        (inst: any) => inst.dueDate && inst.amount
      );

      if (validInstallments.length > 0) {
        await prisma.tuitionInstallment.createMany({
          data: validInstallments.map((inst: any) => ({
            studentId: id,
            dueDate: new Date(inst.dueDate),
            amount: parseFloat(inst.amount) || 0,
            status: inst.status || 'PENDING',
            note: inst.note || null,
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: `Đã cập nhật thông tin học viên "${updatedStudent.name}" thành công!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.student.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Đã xóa học viên thành công!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
