import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let profile = await prisma.teacherProfile.findFirst();
    if (!profile) {
      profile = await prisma.teacherProfile.create({
        data: {
          fullName: 'Nguyễn Đình Linh',
          email: 'linh.nguyen@example.com',
          phone: '0901234567',
          bankName: '',
          bankAccount: '',
          bankAccountName: '',
        },
      });
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function saveProfile(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone } = body;

    let profile = await prisma.teacherProfile.findFirst();
    if (profile) {
      profile = await prisma.teacherProfile.update({
        where: { id: profile.id },
        data: {
          fullName: fullName?.trim() || 'Giáo viên',
          email: email?.trim() || null,
          phone: phone?.trim() || null,
        },
      });
    } else {
      profile = await prisma.teacherProfile.create({
        data: {
          fullName: fullName?.trim() || 'Giáo viên',
          email: email?.trim() || null,
          phone: phone?.trim() || null,
          bankName: '',
          bankAccount: '',
          bankAccountName: '',
        },
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return saveProfile(req);
}

export async function PUT(req: NextRequest) {
  return saveProfile(req);
}

