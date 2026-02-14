import { prisma } from './db';
import { getQualifiedTeams } from './qualification';

// Note: User specified Round of 16, but 12 groups × 2 = 24 teams
// This implementation calculates top 2 per group (24 teams total)
// The bracket structure will pair these 24 teams into 12 matches for Round of 16
// Then 6 matches for Quarterfinals, 3 matches for Semifinals, and 1 Final
// (Note: This doesn't match standard World Cup format, but follows user specification)

export async function generateRoundOf16Matches(): Promise<string[]> {
  const qualified = await getQualifiedTeams();
  const matchIds: string[] = [];

  // Get all qualified team IDs
  const qualifiedTeams: string[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  for (const groupName of groups) {
    if (qualified[groupName]) {
      qualifiedTeams.push(qualified[groupName].first);
      qualifiedTeams.push(qualified[groupName].second);
    }
  }

  // Create matches: pair teams in order
  // Format: Group A 1st vs Group B 2nd, Group B 1st vs Group A 2nd, etc.
  for (let i = 0; i < qualifiedTeams.length; i += 2) {
    if (i + 1 < qualifiedTeams.length) {
      const match = await prisma.match.create({
        data: {
          stage: 'round_of_16',
          team1Id: qualifiedTeams[i],
          team2Id: qualifiedTeams[i + 1],
          status: 'scheduled',
        },
      });
      matchIds.push(match.id);
    }
  }

  return matchIds;
}

export async function generateQuarterfinalMatches(
  roundOf16MatchIds: string[]
): Promise<string[]> {
  const matchIds: string[] = [];

  // Get winners from Round of 16 (for now, we'll create placeholder matches)
  // In a real scenario, you'd determine winners from match results
  // For now, we create matches with placeholder teams
  for (let i = 0; i < roundOf16MatchIds.length; i += 2) {
    if (i + 1 < roundOf16MatchIds.length) {
      // Get the matches to determine winners
      const match1 = await prisma.match.findUnique({
        where: { id: roundOf16MatchIds[i] },
      });
      const match2 = await prisma.match.findUnique({
        where: { id: roundOf16MatchIds[i + 1] },
      });

      if (match1 && match2) {
        // Determine winners (team with higher goals, or team1 if draw)
        const winner1 =
          match1.resultTeam1! > match1.resultTeam2!
            ? match1.team1Id
            : match1.resultTeam2! > match1.resultTeam1!
            ? match1.team2Id
            : match1.team1Id; // Draw: use team1

        const winner2 =
          match2.resultTeam1! > match2.resultTeam2!
            ? match2.team1Id
            : match2.resultTeam2! > match2.resultTeam1!
            ? match2.team2Id
            : match2.team1Id; // Draw: use team1

        const match = await prisma.match.create({
          data: {
            stage: 'quarter_final',
            team1Id: winner1,
            team2Id: winner2,
            status: 'scheduled',
          },
        });
        matchIds.push(match.id);
      }
    }
  }

  return matchIds;
}

export async function generateSemifinalMatches(
  quarterfinalMatchIds: string[]
): Promise<string[]> {
  const matchIds: string[] = [];

  for (let i = 0; i < quarterfinalMatchIds.length; i += 2) {
    if (i + 1 < quarterfinalMatchIds.length) {
      const match1 = await prisma.match.findUnique({
        where: { id: quarterfinalMatchIds[i] },
      });
      const match2 = await prisma.match.findUnique({
        where: { id: quarterfinalMatchIds[i + 1] },
      });

      if (match1 && match2) {
        const winner1 =
          match1.resultTeam1! > match1.resultTeam2!
            ? match1.team1Id
            : match1.resultTeam2! > match1.resultTeam1!
            ? match1.team2Id
            : match1.team1Id;

        const winner2 =
          match2.resultTeam1! > match2.resultTeam2!
            ? match2.team1Id
            : match2.resultTeam2! > match2.resultTeam1!
            ? match2.team2Id
            : match2.team1Id;

        const match = await prisma.match.create({
          data: {
            stage: 'semi_final',
            team1Id: winner1,
            team2Id: winner2,
            status: 'scheduled',
          },
        });
        matchIds.push(match.id);
      }
    }
  }

  return matchIds;
}

export async function generateFinalMatch(
  semifinalMatchIds: string[]
): Promise<string | null> {
  if (semifinalMatchIds.length < 2) {
    return null;
  }

  const match1 = await prisma.match.findUnique({
    where: { id: semifinalMatchIds[0] },
  });
  const match2 = await prisma.match.findUnique({
    where: { id: semifinalMatchIds[1] },
  });

  if (!match1 || !match2) {
    return null;
  }

  const winner1 =
    match1.resultTeam1! > match1.resultTeam2!
      ? match1.team1Id
      : match1.resultTeam2! > match1.resultTeam1!
      ? match1.team2Id
      : match1.team1Id;

  const winner2 =
    match2.resultTeam1! > match2.resultTeam2!
      ? match2.team1Id
      : match2.resultTeam2! > match2.resultTeam1!
      ? match2.team2Id
      : match2.team1Id;

  const match = await prisma.match.create({
    data: {
      stage: 'final',
      team1Id: winner1,
      team2Id: winner2,
      status: 'scheduled',
    },
  });

  return match.id;
}
