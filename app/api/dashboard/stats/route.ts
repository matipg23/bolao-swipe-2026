import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get total registered users
    const totalUsers = await prisma.user.count();

    // Get count of users who have completed all 72 group stage matches
    const groupStageMatches = await prisma.match.count({
      where: { stage: 'group' },
    });

    // Get users who have predictions for all group matches
    const usersWithPredictions = await prisma.prediction.groupBy({
      by: ['userId'],
      where: {
        match: {
          stage: 'group',
        },
      },
      _count: {
        id: true,
      },
    });

    // Count users who have predicted all group matches
    const completedPredictionsCount = usersWithPredictions.filter(
      (user) => user._count.id === groupStageMatches
    ).length;

    return NextResponse.json({
      total_users: totalUsers,
      completed_predictions_count: completedPredictionsCount,
      total_group_matches: groupStageMatches,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
