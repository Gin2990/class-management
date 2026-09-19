import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        classMembers: {
          include: {
            classGroup: true,
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
      orderBy: {
        name: 'asc',
      },
    });

    const studentsWithStats = students.map((st) => {
      // Tính tổng giờ đăng ký
      const totalHours = st.enrollments.reduce((sum, en) => sum + (en.totalSessions || 0), 0);
      
      // Số giờ đã hoàn thành (học viên có mặt)
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
      
      // Cảnh báo học phí: khi số giờ còn lại <= 3 giờ
      const isUrgent = roundedTotalHours > 0 && remainingHours <= 3;

      // Lấy gói học phí gần nhất
      const activeEnrollment = st.enrollments[0] || null;

      // Tính học phí chu kỳ tiếp theo (theo tổng giờ)
      const nextCycleFee = activeEnrollment
        ? Math.round((activeEnrollment.totalSessions || 20) * activeEnrollment.pricePerSession)
        : 6000000;

      // Tìm đợt đóng học phí tiếp theo (đợt chưa đóng gần nhất)
      const nextInstallment = st.tuitionInstallments.find((inst) => inst.status !== 'PAID') 
        || st.tuitionInstallments[0] 
        || null;

      return {
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
      };
    });

    return NextResponse.json({ success: true, data: studentsWithStats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
      installments = [],
    } = body;

    const student = await prisma.student.create({
      data: {
        name,
        email,
        phone,
        parentName,
        parentEmail,
        parentPhone,
      },
    });

    if (classGroupId) {
      await prisma.classMember.create({
        data: {
          studentId: student.id,
          classGroupId,
        },
      });
    }

    const rawHours = totalHours !== undefined ? totalHours : totalSessions;
    const rawPrice = pricePerHour !== undefined ? pricePerHour : pricePerSession;

    if (rawHours && rawPrice) {
      const parsedHours = parseFloat(rawHours);
      const parsedPrice = parseFloat(rawPrice);
      const totalAmt = Math.round(parsedHours * parsedPrice);

      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classGroupId,
          title: `Gói ${parsedHours} giờ`,
          totalSessions: parsedHours,
          pricePerSession: parsedPrice,
          totalAmount: totalAmt,
          paidAmount: totalAmt,
          paymentStatus: 'PAID',
        },
      });
    }

    // Lưu các đợt đóng học phí nếu có
    if (installments && Array.isArray(installments) && installments.length > 0) {
      const validInstallments = installments.filter(
        (inst: any) => inst.dueDate && inst.amount
      );

      if (validInstallments.length > 0) {
        await prisma.tuitionInstallment.createMany({
          data: validInstallments.map((inst: any) => ({
            studentId: student.id,
            dueDate: new Date(inst.dueDate),
            amount: parseFloat(inst.amount) || 0,
            status: inst.status || 'PENDING',
            note: inst.note || null,
          })),
        });
      }
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
