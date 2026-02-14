import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Team data based on FIFA 2026 World Cup groups
const groups = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Playoff Winner D'],
  B: ['Canada', 'Switzerland', 'Qatar', 'Playoff Winner A'],
  C: ['Brazil', 'Morocco', 'Scotland', 'Haiti'],
  D: ['United States', 'Australia', 'Paraguay', 'Playoff Winner C'],
  E: ['Germany', 'Ecuador', 'Ivory Coast', 'Curaçao'],
  F: ['Netherlands', 'Japan', 'Tunisia', 'Playoff Winner B'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'],
  I: ['France', 'Senegal', 'Norway', 'Playoff Winner 2'],
  J: ['Argentina', 'Austria', 'Algeria', 'Jordan'],
  K: ['Portugal', 'Colombia', 'Uzbekistan', 'Playoff Winner 1'],
  L: ['England', 'Croatia', 'Panama', 'Ghana'],
};

// Flag emojis for teams (approximate)
const flagEmojis: Record<string, string> = {
  'Mexico': '🇲🇽',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'Canada': '🇨🇦',
  'Switzerland': '🇨🇭',
  'Qatar': '🇶🇦',
  'Brazil': '🇧🇷',
  'Morocco': '🇲🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Haiti': '🇭🇹',
  'United States': '🇺🇸',
  'Australia': '🇦🇺',
  'Paraguay': '🇵🇾',
  'Germany': '🇩🇪',
  'Ecuador': '🇪🇨',
  'Ivory Coast': '🇨🇮',
  'Curaçao': '🇨🇼',
  'Netherlands': '🇳🇱',
  'Japan': '🇯🇵',
  'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪',
  'Egypt': '🇪🇬',
  'Iran': '🇮🇷',
  'New Zealand': '🇳🇿',
  'Spain': '🇪🇸',
  'Uruguay': '🇺🇾',
  'Saudi Arabia': '🇸🇦',
  'Cape Verde': '🇨🇻',
  'France': '🇫🇷',
  'Senegal': '🇸🇳',
  'Norway': '🇳🇴',
  'Argentina': '🇦🇷',
  'Austria': '🇦🇹',
  'Algeria': '🇩🇿',
  'Jordan': '🇯🇴',
  'Portugal': '🇵🇹',
  'Colombia': '🇨🇴',
  'Uzbekistan': '🇺🇿',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Croatia': '🇭🇷',
  'Panama': '🇵🇦',
  'Ghana': '🇬🇭',
};

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.appSetting.deleteMany();

  // Create teams
  const teamMap: Record<string, string> = {};
  
  for (const [groupName, teamNames] of Object.entries(groups)) {
    for (const teamName of teamNames) {
      const team = await prisma.team.create({
        data: {
          name: teamName,
          groupName: groupName,
          flagEmoji: flagEmojis[teamName] || '🏳️',
        },
      });
      teamMap[`${groupName}-${teamName}`] = team.id;
    }
  }

  console.log(`Created ${Object.keys(teamMap).length} teams`);

  // Create group stage matches (6 matches per group = 72 total)
  // Each group has 4 teams, so we need: 1v2, 1v3, 1v4, 2v3, 2v4, 3v4
  const matchCounts = [0, 1, 2, 3]; // indices for round-robin
  let matchCount = 0;

  for (const [groupName, teamNames] of Object.entries(groups)) {
    for (let i = 0; i < teamNames.length; i++) {
      for (let j = i + 1; j < teamNames.length; j++) {
        const team1Name = teamNames[i];
        const team2Name = teamNames[j];
        
        const team1Id = teamMap[`${groupName}-${team1Name}`];
        const team2Id = teamMap[`${groupName}-${team2Name}`];

        await prisma.match.create({
          data: {
            stage: 'group',
            groupName: groupName,
            team1Id: team1Id,
            team2Id: team2Id,
            status: 'scheduled',
          },
        });
        matchCount++;
      }
    }
  }

  console.log(`Created ${matchCount} group stage matches`);

  // Create app settings
  await prisma.appSetting.create({
    data: {
      key: 'deadline_editable_until',
      value: '2026-06-06T00:00:00Z',
    },
  });

  console.log('Created app settings');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
