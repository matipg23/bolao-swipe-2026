import { NextResponse } from 'next/server';
import { calculateGroupStandings, rankTeams, getQualifiedTeams } from '@/lib/qualification';

export async function POST() {
  try {
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const standings: { [groupName: string]: any[] } = {};

    // Calculate standings for each group
    for (const groupName of groups) {
      const groupStandings = await calculateGroupStandings(groupName);
      const ranked = rankTeams(groupStandings);
      standings[groupName] = ranked;
    }

    // Get qualified teams (top 2 from each group)
    const qualified = await getQualifiedTeams();

    return NextResponse.json({
      standings,
      qualified,
      message: 'Qualification calculated successfully',
    });
  } catch (error) {
    console.error('Qualification calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const standings: { [groupName: string]: any[] } = {};

    // Calculate standings for each group
    for (const groupName of groups) {
      const groupStandings = await calculateGroupStandings(groupName);
      const ranked = rankTeams(groupStandings);
      standings[groupName] = ranked;
    }

    // Get qualified teams
    const qualified = await getQualifiedTeams();

    return NextResponse.json({
      standings,
      qualified,
    });
  } catch (error) {
    console.error('Get qualification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
