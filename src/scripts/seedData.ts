import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { apiFootballService } from '../services/apiFootball';
import type { PlayerStatistics } from '../services/apiFootball';

const client = generateClient<Schema>();

// Position mapping from API-Football to our schema
const positionMapping: { [key: string]: 'GK' | 'DEF' | 'MID' | 'FWD' } = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Attacker: 'FWD',
};

// Calculate fantasy price based on player statistics
function calculatePrice(stats: PlayerStatistics): number {
  const basePrice = 4.0;
  const goalsWeight = 0.5;
  const assistsWeight = 0.3;
  const appearancesWeight = 0.1;
  const ratingWeight = 0.8;

  const goals = stats.goals.total || 0;
  const assists = stats.goals.assists || 0;
  const appearances = stats.games.appearences || 0;
  const rating = parseFloat(stats.games.rating || '0') || 0;

  const price =
    basePrice +
    goals * goalsWeight +
    assists * assistsWeight +
    appearances * appearancesWeight +
    rating * ratingWeight;

  return Math.min(Math.max(price, 4.0), 15.0); // Cap between 4.0 and 15.0
}

// Calculate fantasy points based on player statistics
function calculatePoints(stats: PlayerStatistics): number {
  const goals = (stats.goals.total || 0) * 4;
  const assists = (stats.goals.assists || 0) * 3;
  const cleanSheets = stats.goals.conceded === 0 && stats.games.minutes > 60 ? 4 : 0;
  const appearances = stats.games.appearences * 2;
  const yellowCards = (stats.cards.yellow || 0) * -1;
  const redCards = (stats.cards.red || 0) * -3;

  return Math.max(goals + assists + cleanSheets + appearances + yellowCards + redCards, 0);
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding with API-Football data...');

    // Fetch Premier League teams from API-Football
    console.log('Fetching Premier League teams from API-Football...');
    const apiTeams = await apiFootballService.getPremierLeagueTeams(2024);

    // Create teams in database
    console.log('Creating teams...');
    const createdTeams = [];
    const teamLookup: { [key: number]: string } = {}; // API ID to DB ID mapping

    for (const apiTeam of apiTeams.slice(0, 8)) {
      // Limit to 8 teams for demo
      const { data: team } = await client.models.FootballTeam.create({
        name: apiTeam.name,
        shortName: apiTeam.code,
        code: apiTeam.code,
        league: 'Premier League',
        logoUrl: apiTeam.logo,
      });

      if (team) {
        createdTeams.push(team);
        teamLookup[apiTeam.id] = team.id;
        console.log(`✅ Created team: ${team.name}`);
      }
    }

    // Fetch and create players for each team
    console.log('Fetching and creating players...');
    let totalPlayersCreated = 0;

    for (const apiTeam of apiTeams.slice(0, 8)) {
      if (!teamLookup[apiTeam.id]) {
        continue;
      }

      try {
        console.log(`Fetching players for ${apiTeam.name}...`);
        const apiPlayers = await apiFootballService.getPlayers(apiTeam.id, 2024, 1);

        // Create up to 15 players per team
        for (const playerData of apiPlayers.slice(0, 15)) {
          const { player, statistics } = playerData;

          if (!statistics || statistics.length === 0) {
            continue;
          }

          const mainStats = statistics[0]; // Use first season statistics
          const position = positionMapping[mainStats.games.position] || 'MID';
          const price = calculatePrice(mainStats);
          const totalPoints = calculatePoints(mainStats);
          const form = parseFloat(mainStats.games.rating || '6.0') || 6.0;

          const { data: createdPlayer } = await client.models.Player.create({
            name: player.name,
            position,
            teamId: teamLookup[apiTeam.id],
            price,
            totalPoints,
            form,
            availability: player.injured ? 'INJURED' : 'AVAILABLE',
            photoUrl: player.photo,
          });

          if (createdPlayer) {
            totalPlayersCreated++;
            console.log(
              `✅ Created player: ${createdPlayer.name} (${apiTeam.name}) - ${position} - £${price.toFixed(1)}m`
            );
          }
        }

        // Small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`⚠️  Failed to fetch players for ${apiTeam.name}:`, error);
        continue;
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdTeams.length} teams and ${totalPlayersCreated} players`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this script is executed directly
if (typeof window === 'undefined') {
  seedDatabase().catch(console.error);
}
