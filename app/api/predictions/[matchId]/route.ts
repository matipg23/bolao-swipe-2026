import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromHeader } from '@/lib/get-user';

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const userId = await getUserIdFromHeader();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { matchId } = params;

    const prediction = await prisma.prediction.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
          },
        },
      },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Get prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const userId = await getUserIdFromHeader();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check deadline
    const deadlineSetting = await prisma.appSetting.findUnique({
      where: { key: 'deadline_editable_until' },
    });
    const deadline = deadlineSetting?.value || '2026-06-06T00:00:00Z';
    
    const { isAfterDeadline } = await import('@/lib/validation');
    if (isAfterDeadline(deadline)) {
      return NextResponse.json(
        { error: 'Prediction deadline has passed. Editing is no longer allowed.' },
        { status: 403 }
      );
    }

    const { matchId } = params;
    const body = await request.json();
    const { goalsTeam1, goalsTeam2 } = body;

    if (goalsTeam1 === undefined || goalsTeam2 === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: goalsTeam1, goalsTeam2' },
        { status: 400 }
      );
    }

    if (goalsTeam1 < 0 || goalsTeam2 < 0) {
      return NextResponse.json(
        { error: 'Goals must be non-negative integers' },
        { status: 400 }
      );
    }

    // Update or create prediction
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      update: {
        goalsTeam1,
        goalsTeam2,
      },
      create: {
        userId,
        matchId,
        goalsTeam1,
        goalsTeam2,
      },
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Prediction saved successfully', prediction },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
