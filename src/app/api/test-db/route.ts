import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const regions = [
    'ap-southeast-1', // Singapore
    'ap-northeast-1', // Tokyo
    'ap-northeast-2', // Seoul
    'ap-south-1',     // Mumbai
    'us-east-1',      // N. Virginia
    'eu-central-1',   // Frankfurt
  ];

  const results: any[] = [];
  const pass = 'NhatMinh%401104';
  const ref = 'cunbdjlksssyvgpuqehh';

  for (const r of regions) {
    // 1. Test Session mode (port 5432)
    const url5432 = `postgresql://postgres.${ref}:${pass}@aws-0-${r}.pooler.supabase.com:5432/postgres`;
    try {
      const p = new PrismaClient({ datasources: { db: { url: url5432 } } });
      const q: any = await p.$queryRaw`SELECT count(*) as total FROM "Student";`;
      await p.$disconnect();
      return NextResponse.json({
        success: true,
        workingRegion: r,
        workingPort: 5432,
        workingUrl: url5432,
        studentCount: q[0]?.total,
      });
    } catch (e: any) {
      results.push({ region: r, port: 5432, error: e.message?.slice(0, 100) });
    }

    // 2. Test Transaction mode (port 6543)
    const url6543 = `postgresql://postgres.${ref}:${pass}@aws-0-${r}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    try {
      const p = new PrismaClient({ datasources: { db: { url: url6543 } } });
      const q: any = await p.$queryRaw`SELECT count(*) as total FROM "Student";`;
      await p.$disconnect();
      return NextResponse.json({
        success: true,
        workingRegion: r,
        workingPort: 6543,
        workingUrl: url6543,
        studentCount: q[0]?.total,
      });
    } catch (e: any) {
      results.push({ region: r, port: 6543, error: e.message?.slice(0, 100) });
    }
  }

  return NextResponse.json({
    success: false,
    results,
  });
}
