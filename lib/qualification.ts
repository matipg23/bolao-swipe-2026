import { prisma } from './db';

export interface TeamStanding {
  teamId: string;
  teamName: string;
  groupName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface HeadToHead {
  team1Id: string;
  team2Id: string;
  team1Goals: number;
  team2Goals: number;
}

export async function calculateGroupStandings(
  groupName: string
): Promise<TeamStanding[]> {
  // Get all teams in the group
  const teams = await prisma.team.findMany({
    where: { groupName },
  });

  // Get all completed matches in the group
  const matches = await prisma.match.findMany({
    where: {
      groupName,
      stage: 'group',
      status: 'completed',
      resultTeam1: { not: null },
      resultTeam2: { not: null },
    },
    include: {
      team1: true,
      team2: true,
    },
  });

  // Initialize standings for each team
  const standingsMap: Map<string, TeamStanding> = new Map();

  for (const team of teams) {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      groupName: groupName,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  // Calculate standings from match results
  for (const match of matches) {
    if (match.resultTeam1 === null || match.resultTeam2 === null) continue;

    const team1Standing = standingsMap.get(match.team1Id);
    const team2Standing = standingsMap.get(match.team2Id);

    if (!team1Standing || !team2Standing) continue;

    const team1Goals = match.resultTeam1;
    const team2Goals = match.resultTeam2;

    // Update team1 stats
    team1Standing.played++;
    team1Standing.goalsFor += team1Goals;
    team1Standing.goalsAgainst += team2Goals;

    // Update team2 stats
    team2Standing.played++;
    team2Standing.goalsFor += team2Goals;
    team2Standing.goalsAgainst += team1Goals;

    // Determine result
    if (team1Goals > team2Goals) {
      team1Standing.wins++;
      team1Standing.points += 3;
      team2Standing.losses++;
    } else if (team1Goals < team2Goals) {
      team2Standing.wins++;
      team2Standing.points += 3;
      team1Standing.losses++;
    } else {
      team1Standing.draws++;
      team2Standing.draws++;
      team1Standing.points += 1;
      team2Standing.points += 1;
    }
  }

  // Calculate goal difference
  for (const standing of standingsMap.values()) {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  }

  return Array.from(standingsMap.values());
}

export function rankTeams(standings: TeamStanding[]): TeamStanding[] {
  return standings.sort((a, b) => {
    // 1. Points (descending)
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // 2. Goal difference (descending)
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    // 3. Goals scored (descending)
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }

    // 4. Head-to-head (if applicable)
    // For simplicity, we'll use alphabetical order as tiebreaker
    // In a real implementation, you'd need to calculate head-to-head results
    return a.teamName.localeCompare(b.teamName);
  });
}

export async function getQualifiedTeams(): Promise<{
  [groupName: string]: { first: string; second: string };
}> {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const qualified: {
    [groupName: string]: { first: string; second: string };
  } = {};

  for (const groupName of groups) {
    const standings = await calculateGroupStandings(groupName);
    const ranked = rankTeams(standings);

    if (ranked.length >= 2) {
      qualified[groupName] = {
        first: ranked[0].teamId,
        second: ranked[1].teamId,
      };
    }
  }

  return qualified;
}
