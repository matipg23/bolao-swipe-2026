import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  generateRoundOf16Matches,
  generateQuarterfinalMatches,
  generateSemifinalMatches,
  generateFinalMatch,
} from '@/lib/knockout';

export async function POST() {
  try {
    // Generate Round of 16 matches
    const roundOf16MatchIds = await generateRoundOf16Matches();
    console.log(`Generated ${roundOf16MatchIds.length} Round of 16 matches`);

    // Note: Quarterfinals, Semifinals, and Final will be generated
    // after Round of 16 results are entered
    // For now, we'll create a placeholder structure

    return NextResponse.json({
      message: 'Knockout matches generated successfully',
      roundOf16Matches: roundOf16MatchIds.length,
      note: 'Quarterfinals, Semifinals, and Final will be generated after previous round results are entered',
    });
  } catch (error) {
    console.error('Knockout generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper endpoint to generate next round after results are entered
export async function PUT() {
  try {
    // Check which round needs to be generated next
    const roundOf16Matches = await prisma.match.findMany({
      where: { stage: 'round_of_16', status: 'completed' },
    });

    const quarterfinalMatches = await prisma.match.findMany({
      where: { stage: 'quarter_final' },
    });

    const semifinalMatches = await prisma.match.findMany({
      where: { stage: 'semi_final' },
    });

    if (roundOf16Matches.length > 0 && quarterfinalMatches.length === 0) {
      const roundOf16Ids = roundOf16Matches.map((m) => m.id);
      const quarterfinalIds = await generateQuarterfinalMatches(roundOf16Ids);
      return NextResponse.json({
        message: 'Quarterfinal matches generated',
        matches: quarterfinalIds.length,
      });
    }

    if (quarterfinalMatches.length > 0 && semifinalMatches.length === 0) {
      const quarterfinalIds = quarterfinalMatches.map((m) => m.id);
      const semifinalIds = await generateSemifinalMatches(quarterfinalIds);
      return NextResponse.json({
        message: 'Semifinal matches generated',
        matches: semifinalIds.length,
      });
    }

    const finalMatch = await prisma.match.findFirst({
      where: { stage: 'final' },
    });

    if (semifinalMatches.length > 0 && !finalMatch) {
      const semifinalIds = semifinalMatches.map((m) => m.id);
      const finalId = await generateFinalMatch(semifinalIds);
      return NextResponse.json({
        message: 'Final match generated',
        matchId: finalId,
      });
    }

    return NextResponse.json({
      message: 'No new matches to generate',
    });
  } catch (error) {
    console.error('Knockout generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
