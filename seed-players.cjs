#!/usr/bin/env node

// Simple script to seed Premier League players
const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/data');

// Configure Amplify
const outputs = require('./amplify_outputs.json');
Amplify.configure(outputs);

// Check if API key is provided
if (!process.env.API_FOOTBALL_KEY) {
  console.error('❌ API_FOOTBALL_KEY environment variable is required');
  console.log('💡 Set it with: export API_FOOTBALL_KEY=your_api_key_here');
  process.exit(1);
}

const client = generateClient();

// Position mapping from API-Football to our schema
const positionMapping = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Attacker: 'FWD',
};

// Calculate fantasy price based on player statistics
function calculatePrice(stats) {
  const basePrice = 4.0;
  const goalsWeight = 0.5;
  const assistsWeight = 0.3;
  const appearancesWeight = 0.1;
  const ratingWeight = 0.8;

  const goals = stats.goals?.total || 0;
  const assists = stats.goals?.assists || 0;
  const appearances = stats.games?.appearences || 0;
  const rating = parseFloat(stats.games?.rating || '0') || 0;

  const price =
    basePrice +
    goals * goalsWeight +
    assists * assistsWeight +
    appearances * appearancesWeight +
    rating * ratingWeight;

  return Math.min(Math.max(price, 4.0), 15.0); // Cap between 4.0 and 15.0
}

// Calculate fantasy points based on player statistics
function calculatePoints(stats) {
  const goals = (stats.goals?.total || 0) * 4;
  const assists = (stats.goals?.assists || 0) * 3;
  const cleanSheets = stats.goals?.conceded === 0 && stats.games?.minutes > 60 ? 4 : 0;
  const appearances = (stats.games?.appearences || 0) * 2;
  const yellowCards = (stats.cards?.yellow || 0) * -1;
  const redCards = (stats.cards?.red || 0) * -3;

  return Math.max(goals + assists + cleanSheets + appearances + yellowCards + redCards, 0);
}

// Mock API service for seeding (since we don't have access to real API in Node.js context)
const mockApiFootballService = {
  async getPremierLeagueTeams() {
    return [
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
  },

  async getPlayers(teamId) {
    const mockPlayers = {
      33: [
        // Manchester United
        {
          player: {
            id: 1,
            name: 'André Onana',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/1.png',
          },
          statistics: [
            {
              games: { position: 'Goalkeeper', appearences: 38, minutes: 3420, rating: '7.2' },
              goals: { total: 0, assists: 0, conceded: 45 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 2,
            name: 'Harry Maguire',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/2.png',
          },
          statistics: [
            {
              games: { position: 'Defender', appearences: 35, minutes: 3150, rating: '6.8' },
              goals: { total: 3, assists: 2, conceded: 0 },
              cards: { yellow: 5, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 3,
            name: 'Bruno Fernandes',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/3.png',
          },
          statistics: [
            {
              games: { position: 'Midfielder', appearences: 37, minutes: 3330, rating: '8.1' },
              goals: { total: 14, assists: 8, conceded: 0 },
              cards: { yellow: 6, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 4,
            name: 'Marcus Rashford',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/4.png',
          },
          statistics: [
            {
              games: { position: 'Attacker', appearences: 33, minutes: 2970, rating: '7.3' },
              goals: { total: 17, assists: 5, conceded: 0 },
              cards: { yellow: 3, red: 0 },
            },
          ],
        },
      ],
      40: [
        // Liverpool
        {
          player: {
            id: 5,
            name: 'Alisson',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/5.png',
          },
          statistics: [
            {
              games: { position: 'Goalkeeper', appearences: 34, minutes: 3060, rating: '7.5' },
              goals: { total: 0, assists: 0, conceded: 32 },
              cards: { yellow: 1, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 6,
            name: 'Virgil van Dijk',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/6.png',
          },
          statistics: [
            {
              games: { position: 'Defender', appearences: 36, minutes: 3240, rating: '7.8' },
              goals: { total: 5, assists: 3, conceded: 0 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 7,
            name: 'Mohamed Salah',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/7.png',
          },
          statistics: [
            {
              games: { position: 'Attacker', appearences: 38, minutes: 3420, rating: '8.7' },
              goals: { total: 24, assists: 13, conceded: 0 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 8,
            name: 'Sadio Mané',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/8.png',
          },
          statistics: [
            {
              games: { position: 'Midfielder', appearences: 35, minutes: 3150, rating: '7.9' },
              goals: { total: 16, assists: 7, conceded: 0 },
              cards: { yellow: 4, red: 0 },
            },
          ],
        },
      ],
      50: [
        // Manchester City
        {
          player: {
            id: 9,
            name: 'Ederson',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/9.png',
          },
          statistics: [
            {
              games: { position: 'Goalkeeper', appearences: 37, minutes: 3330, rating: '7.8' },
              goals: { total: 0, assists: 1, conceded: 28 },
              cards: { yellow: 1, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 10,
            name: 'Rúben Dias',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/10.png',
          },
          statistics: [
            {
              games: { position: 'Defender', appearences: 35, minutes: 3150, rating: '7.6' },
              goals: { total: 2, assists: 1, conceded: 0 },
              cards: { yellow: 3, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 11,
            name: 'Kevin De Bruyne',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/11.png',
          },
          statistics: [
            {
              games: { position: 'Midfielder', appearences: 32, minutes: 2880, rating: '8.9' },
              goals: { total: 12, assists: 18, conceded: 0 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 12,
            name: 'Erling Haaland',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/12.png',
          },
          statistics: [
            {
              games: { position: 'Attacker', appearences: 35, minutes: 3150, rating: '9.2' },
              goals: { total: 27, assists: 5, conceded: 0 },
              cards: { yellow: 1, red: 0 },
            },
          ],
        },
      ],
      42: [
        // Arsenal
        {
          player: {
            id: 13,
            name: 'Aaron Ramsdale',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/13.png',
          },
          statistics: [
            {
              games: { position: 'Goalkeeper', appearences: 32, minutes: 2880, rating: '7.1' },
              goals: { total: 0, assists: 0, conceded: 35 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 14,
            name: 'William Saliba',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/14.png',
          },
          statistics: [
            {
              games: { position: 'Defender', appearences: 36, minutes: 3240, rating: '7.4' },
              goals: { total: 2, assists: 1, conceded: 0 },
              cards: { yellow: 4, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 15,
            name: 'Martin Ødegaard',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/15.png',
          },
          statistics: [
            {
              games: { position: 'Midfielder', appearences: 34, minutes: 3060, rating: '8.0' },
              goals: { total: 11, assists: 10, conceded: 0 },
              cards: { yellow: 3, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 16,
            name: 'Bukayo Saka',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/16.png',
          },
          statistics: [
            {
              games: { position: 'Attacker', appearences: 36, minutes: 3240, rating: '8.3' },
              goals: { total: 16, assists: 11, conceded: 0 },
              cards: { yellow: 2, red: 0 },
            },
          ],
        },
      ],
      49: [
        // Chelsea
        {
          player: {
            id: 17,
            name: 'Thiago Silva',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/17.png',
          },
          statistics: [
            {
              games: { position: 'Defender', appearences: 33, minutes: 2970, rating: '7.2' },
              goals: { total: 1, assists: 2, conceded: 0 },
              cards: { yellow: 5, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 18,
            name: 'Enzo Fernández',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/18.png',
          },
          statistics: [
            {
              games: { position: 'Midfielder', appearences: 31, minutes: 2790, rating: '7.6' },
              goals: { total: 6, assists: 4, conceded: 0 },
              cards: { yellow: 6, red: 0 },
            },
          ],
        },
      ],
      47: [
        // Tottenham
        {
          player: {
            id: 19,
            name: 'Hugo Lloris',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/19.png',
          },
          statistics: [
            {
              games: { position: 'Goalkeeper', appearences: 30, minutes: 2700, rating: '6.9' },
              goals: { total: 0, assists: 0, conceded: 40 },
              cards: { yellow: 1, red: 0 },
            },
          ],
        },
        {
          player: {
            id: 20,
            name: 'Harry Kane',
            injured: false,
            photo: 'https://media.api-sports.io/football/players/20.png',
          },
          statistics: [
            {
              games: { position: 'Attacker', appearences: 35, minutes: 3150, rating: '8.5' },
              goals: { total: 22, assists: 6, conceded: 0 },
              cards: { yellow: 3, red: 0 },
            },
          ],
        },
      ],
    };

    return mockPlayers[teamId] || [];
  },
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding with Premier League players...');

    // Fetch Premier League teams
    console.log('Fetching Premier League teams...');
    const apiTeams = await mockApiFootballService.getPremierLeagueTeams();

    // Create teams in database
    console.log('Creating teams...');
    const createdTeams = [];
    const teamLookup = {}; // API ID to DB ID mapping

    for (const apiTeam of apiTeams) {
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

    for (const apiTeam of apiTeams) {
      if (!teamLookup[apiTeam.id]) continue;

      try {
        console.log(`Creating players for ${apiTeam.name}...`);
        const apiPlayers = await mockApiFootballService.getPlayers(apiTeam.id);

        for (const playerData of apiPlayers) {
          const { player, statistics } = playerData;

          if (!statistics || statistics.length === 0) continue;

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
              `✅ Created player: ${createdPlayer.name} (${apiTeam.name}) - ${position} - £${price.toFixed(1)}m - ${totalPoints} pts`
            );
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to create players for ${apiTeam.name}:`, error);
        continue;
      }
    }

    console.log(`🎉 Database seeding completed successfully!`);
    console.log(`📊 Created ${createdTeams.length} teams and ${totalPlayersCreated} players`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✨ Seeding complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
