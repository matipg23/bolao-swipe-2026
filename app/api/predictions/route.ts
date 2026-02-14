import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromHeader } from '@/lib/get-user';
import { isAfterDeadline } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromHeader();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get deadline
    const deadlineSetting = await prisma.appSetting.findUnique({
      where: { key: 'deadline_editable_until' },
    });
    const deadline = deadlineSetting?.value || '2026-06-06T00:00:00Z';
    const afterDeadline = isAfterDeadline(deadline);

    // If after deadline, return all users' predictions
    // If before deadline, return only current user's predictions
    if (afterDeadline) {
      const predictions = await prisma.prediction.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          match: {
            include: {
              team1: true,
              team2: true,
            },
          },
        },
        orderBy: [
          { match: { groupName: 'asc' } },
          { match: { scheduledAt: 'asc' } },
        ],
      });

      return NextResponse.json({ predictions });
    } else {
      // Before deadline - only own predictions
      const predictions = await prisma.prediction.findMany({
        where: { userId },
        include: {
          match: {
            include: {
              team1: true,
              team2: true,
            },
          },
        },
        orderBy: [
          { match: { groupName: 'asc' } },
          { match: { scheduledAt: 'asc' } },
        ],
      });

      return NextResponse.json({ predictions });
    }
  } catch (error) {
    console.error('Get predictions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    if (isAfterDeadline(deadline)) {
      return NextResponse.json(
        { error: 'Prediction deadline has passed. Editing is no longer allowed.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { matchId, goalsTeam1, goalsTeam2 } = body;

    if (!matchId || goalsTeam1 === undefined || goalsTeam2 === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: matchId, goalsTeam1, goalsTeam2' },
        { status: 400 }
      );
    }

    if (goalsTeam1 < 0 || goalsTeam2 < 0) {
      return NextResponse.json(
        { error: 'Goals must be non-negative integers' },
        { status: 400 }
      );
    }

    // Verify match exists and is group stage
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    if (match.stage !== 'group') {
      return NextResponse.json(
        { error: 'Only group stage predictions can be submitted at this time' },
        { status: 400 }
      );
    }

    // Create or update prediction
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
    console.error('Create prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    
    if (isAfterDeadline(deadline)) {
      return NextResponse.json(
        { error: 'Prediction deadline has passed. Editing is no longer allowed.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { predictionId, goalsTeam1, goalsTeam2 } = body;

    if (!predictionId || goalsTeam1 === undefined || goalsTeam2 === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: predictionId, goalsTeam1, goalsTeam2' },
        { status: 400 }
      );
    }

    if (goalsTeam1 < 0 || goalsTeam2 < 0) {
      return NextResponse.json(
        { error: 'Goals must be non-negative integers' },
        { status: 400 }
      );
    }

    // Verify prediction belongs to user
    const existingPrediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
    });

    if (!existingPrediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    if (existingPrediction.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this prediction' },
        { status: 403 }
      );
    }

    // Update prediction
    const prediction = await prisma.prediction.update({
      where: { id: predictionId },
      data: {
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
      { message: 'Prediction updated successfully', prediction },
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
