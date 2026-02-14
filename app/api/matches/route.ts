import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage');
    const groupName = searchParams.get('group');

    const where: any = {};
    if (stage) {
      where.stage = stage;
    }
    if (groupName) {
      where.groupName = groupName;
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        team1: true,
        team2: true,
      },
      orderBy: [
        { stage: 'asc' },
        { groupName: 'asc' },
        { scheduledAt: 'asc' },
      ],
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stage, groupName, team1Id, team2Id, scheduledAt } = body;

    if (!stage || !team1Id || !team2Id) {
      return NextResponse.json(
        { error: 'Missing required fields: stage, team1Id, team2Id' },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        stage,
        groupName: groupName || null,
        team1Id,
        team2Id,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'scheduled',
      },
      include: {
        team1: true,
        team2: true,
      },
    });

    return NextResponse.json(
      { message: 'Match created successfully', match },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create match error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
