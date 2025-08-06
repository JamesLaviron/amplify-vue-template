import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// Mock Premier League data for seeding
const mockTeams = [
  {
    id: 33,
    name: 'Manchester United',
    code: 'MUN',
    logo: 'https://media.api-sports.io/football/teams/33.png',
  },
  {
    id: 40,
    name: 'Liverpool',
    code: 'LIV',
    logo: 'https://media.api-sports.io/football/teams/40.png',
  },
  {
    id: 50,
    name: 'Manchester City',
    code: 'MCI',
    logo: 'https://media.api-sports.io/football/teams/50.png',
  },
  {
    id: 42,
    name: 'Arsenal',
    code: 'ARS',
    logo: 'https://media.api-sports.io/football/teams/42.png',
  },
  {
    id: 49,
    name: 'Chelsea',
    code: 'CHE',
    logo: 'https://media.api-sports.io/football/teams/49.png',
  },
  {
    id: 47,
    name: 'Tottenham',
    code: 'TOT',
    logo: 'https://media.api-sports.io/football/teams/47.png',
  },
];

const mockPlayers = [
  // Manchester United
  {
    name: 'André Onana',
    position: 'GK',
    team: 'MUN',
    price: 5.0,
    totalPoints: 145,
    form: 7.2,
    photoUrl: 'https://media.api-sports.io/football/players/1649.png',
  },
  {
    name: 'Harry Maguire',
    position: 'DEF',
    team: 'MUN',
    price: 5.5,
    totalPoints: 98,
    form: 6.8,
    photoUrl: 'https://media.api-sports.io/football/players/1496.png',
  },
  {
    name: 'Luke Shaw',
    position: 'DEF',
    team: 'MUN',
    price: 5.5,
    totalPoints: 87,
    form: 6.5,
    photoUrl: 'https://media.api-sports.io/football/players/1499.png',
  },
  {
    name: 'Bruno Fernandes',
    position: 'MID',
    team: 'MUN',
    price: 8.5,
    totalPoints: 195,
    form: 8.1,
    photoUrl: 'https://media.api-sports.io/football/players/881.png',
  },
  {
    name: 'Marcus Rashford',
    position: 'FWD',
    team: 'MUN',
    price: 9.0,
    totalPoints: 158,
    form: 7.3,
    photoUrl: 'https://media.api-sports.io/football/players/1479.png',
  },

  // Liverpool
  {
    name: 'Alisson',
    position: 'GK',
    team: 'LIV',
    price: 5.5,
    totalPoints: 158,
    form: 7.5,
    photoUrl: 'https://media.api-sports.io/football/players/635.png',
  },
  {
    name: 'Virgil van Dijk',
    position: 'DEF',
    team: 'LIV',
    price: 6.5,
    totalPoints: 142,
    form: 7.8,
    photoUrl: 'https://media.api-sports.io/football/players/835.png',
  },
  {
    name: 'Andy Robertson',
    position: 'DEF',
    team: 'LIV',
    price: 6.0,
    totalPoints: 128,
    form: 7.2,
    photoUrl: 'https://media.api-sports.io/football/players/837.png',
  },
  {
    name: 'Mohamed Salah',
    position: 'FWD',
    team: 'LIV',
    price: 13.0,
    totalPoints: 245,
    form: 8.7,
    photoUrl: 'https://media.api-sports.io/football/players/306.png',
  },
  {
    name: 'Sadio Mané',
    position: 'MID',
    team: 'LIV',
    price: 10.5,
    totalPoints: 198,
    form: 7.9,
    photoUrl: 'https://media.api-sports.io/football/players/889.png',
  },

  // Manchester City
  {
    name: 'Ederson',
    position: 'GK',
    team: 'MCI',
    price: 5.5,
    totalPoints: 165,
    form: 7.8,
    photoUrl: 'https://media.api-sports.io/football/players/617.png',
  },
  {
    name: 'Rúben Dias',
    position: 'DEF',
    team: 'MCI',
    price: 6.0,
    totalPoints: 145,
    form: 7.6,
    photoUrl: 'https://media.api-sports.io/football/players/597.png',
  },
  {
    name: 'Kyle Walker',
    position: 'DEF',
    team: 'MCI',
    price: 5.5,
    totalPoints: 125,
    form: 7.1,
    photoUrl: 'https://media.api-sports.io/football/players/594.png',
  },
  {
    name: 'Kevin De Bruyne',
    position: 'MID',
    team: 'MCI',
    price: 12.0,
    totalPoints: 225,
    form: 8.9,
    photoUrl: 'https://media.api-sports.io/football/players/629.png',
  },
  {
    name: 'Erling Haaland',
    position: 'FWD',
    team: 'MCI',
    price: 14.0,
    totalPoints: 268,
    form: 9.2,
    photoUrl: 'https://media.api-sports.io/football/players/1100.png',
  },

  // Arsenal
  {
    name: 'Aaron Ramsdale',
    position: 'GK',
    team: 'ARS',
    price: 5.0,
    totalPoints: 138,
    form: 7.1,
    photoUrl: 'https://media.api-sports.io/football/players/2935.png',
  },
  {
    name: 'William Saliba',
    position: 'DEF',
    team: 'ARS',
    price: 5.5,
    totalPoints: 155,
    form: 7.4,
    photoUrl: 'https://media.api-sports.io/football/players/1317.png',
  },
  {
    name: 'Gabriel Martinelli',
    position: 'MID',
    team: 'ARS',
    price: 7.0,
    totalPoints: 148,
    form: 7.6,
    photoUrl: 'https://media.api-sports.io/football/players/1478.png',
  },
  {
    name: 'Martin Ødegaard',
    position: 'MID',
    team: 'ARS',
    price: 8.0,
    totalPoints: 178,
    form: 8.0,
    photoUrl: 'https://media.api-sports.io/football/players/1459.png',
  },
  {
    name: 'Bukayo Saka',
    position: 'FWD',
    team: 'ARS',
    price: 9.5,
    totalPoints: 198,
    form: 8.3,
    photoUrl: 'https://media.api-sports.io/football/players/1400.png',
  },

  // Chelsea
  {
    name: 'Thiago Silva',
    position: 'DEF',
    team: 'CHE',
    price: 5.5,
    totalPoints: 125,
    form: 7.2,
    photoUrl: 'https://media.api-sports.io/football/players/515.png',
  },
  {
    name: 'Reece James',
    position: 'DEF',
    team: 'CHE',
    price: 6.0,
    totalPoints: 118,
    form: 7.0,
    photoUrl: 'https://media.api-sports.io/football/players/1135.png',
  },
  {
    name: 'Enzo Fernández',
    position: 'MID',
    team: 'CHE',
    price: 7.5,
    totalPoints: 142,
    form: 7.6,
    photoUrl: 'https://media.api-sports.io/football/players/1466.png',
  },
  {
    name: 'Raheem Sterling',
    position: 'FWD',
    team: 'CHE',
    price: 10.0,
    totalPoints: 165,
    form: 7.8,
    photoUrl: 'https://media.api-sports.io/football/players/635.png',
  },

  // Tottenham
  {
    name: 'Hugo Lloris',
    position: 'GK',
    team: 'TOT',
    price: 5.0,
    totalPoints: 128,
    form: 6.9,
    photoUrl: 'https://media.api-sports.io/football/players/809.png',
  },
  {
    name: 'Cristian Romero',
    position: 'DEF',
    team: 'TOT',
    price: 5.5,
    totalPoints: 115,
    form: 7.1,
    photoUrl: 'https://media.api-sports.io/football/players/1128.png',
  },
  {
    name: 'Son Heung-min',
    position: 'MID',
    team: 'TOT',
    price: 10.0,
    totalPoints: 185,
    form: 8.2,
    photoUrl: 'https://media.api-sports.io/football/players/832.png',
  },
  {
    name: 'Harry Kane',
    position: 'FWD',
    team: 'TOT',
    price: 12.5,
    totalPoints: 215,
    form: 8.5,
    photoUrl: 'https://media.api-sports.io/football/players/184.png',
  },
];

export async function seedPremierLeaguePlayers() {
  try {
    console.log('🌱 Starting Premier League player seeding...');

    // Create teams first
    console.log('Creating teams...');
    const createdTeams = [];
    const teamLookup: { [key: string]: string } = {};

    for (const teamData of mockTeams) {
      const { data: team } = await client.models.FootballTeam.create({
        name: teamData.name,
        shortName: teamData.code,
        code: teamData.code,
        league: 'Premier League',
        logoUrl: teamData.logo,
      });

      if (team) {
        createdTeams.push(team);
        teamLookup[teamData.code] = team.id;
        console.log(`✅ Created team: ${team.name}`);
      }
    }

    // Create players
    console.log('Creating players...');
    let totalPlayersCreated = 0;

    for (const playerData of mockPlayers) {
      const teamId = teamLookup[playerData.team];
      if (teamId) {
        const { data: player } = await client.models.Player.create({
          name: playerData.name,
          position: playerData.position as any,
          teamId,
          price: playerData.price,
          totalPoints: playerData.totalPoints,
          form: playerData.form,
          availability: 'AVAILABLE',
          photoUrl: playerData.photoUrl,
        });

        if (player) {
          totalPlayersCreated++;
          console.log(
            `✅ Created player: ${player.name} (${playerData.team}) - ${playerData.position} - £${playerData.price}m - ${playerData.totalPoints} pts`
          );
        }
      }
    }

    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Created ${createdTeams.length} teams and ${totalPlayersCreated} players`);

    return {
      teamsCreated: createdTeams.length,
      playersCreated: totalPlayersCreated,
    };
  } catch (error) {
    console.error('❌ Error seeding players:', error);
    throw error;
  }
}

// Make it available globally for browser console use
if (typeof window !== 'undefined') {
  (window as any).seedPremierLeaguePlayers = seedPremierLeaguePlayers;
}
