import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deadlineSetting = await prisma.appSetting.findUnique({
      where: { key: 'deadline_editable_until' },
    });

    const deadline = deadlineSetting?.value || '2026-06-06T00:00:00Z';

    return NextResponse.json({
      deadline_editable_until: deadline,
    });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
