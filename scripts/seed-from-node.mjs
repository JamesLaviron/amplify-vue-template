#!/usr/bin/env node

/**
 * Node.js script to seed Premier League data directly
 * Run with: node scripts/seed-from-node.mjs
 */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load Amplify configuration
const amplifyOutputs = JSON.parse(readFileSync(join(projectRoot, 'amplify_outputs.json'), 'utf8'));
Amplify.configure(amplifyOutputs);

// Generate client (you'll need to provide auth credentials)
const client = generateClient({
  authMode: 'apiKey', // Using API key for simplicity, or use 'userPool' with credentials
});

// API-Football service
class ApiFootballService {
  constructor() {
    this.baseUrl = 'https://v3.football.api-sports.io';
    this.headers = {
      'X-RapidAPI-Key': process.env.API_FOOTBALL_KEY || '',
      'X-RapidAPI-Host': 'v3.football.api-sports.io',
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log(`🌐 Making API request: ${endpoint} with params:`, params);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  async getPremierLeagueTeams(season = 2023) {
    const response = await this.request('/teams', { league: 39, season });
    return response.map(item => ({
      id: item.team.id,
      name: item.team.name,
      code: item.team.code,
      country: item.team.country,
      founded: item.team.founded,
      logo: item.team.logo,
    }));
  }

  async getPlayers(teamId, season = 2023, page = 1) {
    return this.request('/players', { team: teamId, season, page });
  }
}

// Position mapping
const positionMapping = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Attacker: 'FWD',
};

// Utility functions
function calculatePrice(stats) {
  const basePrice = 4.0;
  const goalsWeight = 0.5;
  const assistsWeight = 0.3;
  const appearancesWeight = 0.05;
  const ratingWeight = 1.0;

  const goals = stats.goals?.total || 0;
  const assists = stats.goals?.assists || 0;
  const appearances = Math.min(stats.games?.appearences || 0, 38);
  const rating = parseFloat(stats.games?.rating || '0') || 6.0;

  const price =
    basePrice +
    goals * goalsWeight +
    assists * assistsWeight +
    appearances * appearancesWeight +
    (rating - 6.0) * ratingWeight;

  return Math.round(Math.min(Math.max(price, 4.0), 15.0) * 2) / 2;
}

function calculatePoints(stats) {
  const goals = (stats.goals?.total || 0) * 4;
  const assists = (stats.goals?.assists || 0) * 3;
  const appearances = Math.min(stats.games?.appearences || 0, 38) * 2;
  const yellowCards = (stats.cards?.yellow || 0) * -1;
  const redCards = (stats.cards?.red || 0) * -3;

  const cleanSheetBonus =
    stats.games?.position === 'Goalkeeper' || stats.games?.position === 'Defender'
      ? Math.max(0, (stats.games?.appearences || 0) - (stats.goals?.conceded || 0)) * 2
      : 0;

  return Math.max(goals + assists + appearances + yellowCards + redCards + cleanSheetBonus, 0);
}

async function seedPremierLeagueData() {
  console.log('🌱 Starting Premier League data seeding from Node.js...');

  const apiService = new ApiFootballService();
  let teamsCreated = 0;
  let playersCreated = 0;
  const teamLookup = {};

  try {
    // Test connection first
    console.log('🔍 Testing Amplify client connection...');
    try {
      const testQuery = await client.models.FootballTeam.list();
      console.log(`✅ Connected to Amplify - found ${testQuery.data.length} existing teams`);
    } catch (error) {
      console.error('❌ Amplify connection failed:', error.message);
      console.log('💡 Trying with userPool auth mode...');
      // If API key fails, you might need to authenticate first
      throw new Error(
        'Authentication required. Please run this from the browser with user authentication.'
      );
    }

    // Get Premier League teams
    console.log('🏆 Fetching Premier League teams...');
    const apiTeams = await apiService.getPremierLeagueTeams(2023);
    console.log(`📊 Found ${apiTeams.length} Premier League teams`);

    // Create teams
    console.log('🏗️  Creating teams in database...');
    for (const apiTeam of apiTeams) {
      try {
        console.log(`Creating team: ${apiTeam.name}`);
        const result = await client.models.FootballTeam.create({
          name: apiTeam.name,
          shortName: apiTeam.code,
          code: apiTeam.code,
          league: 'Premier League',
          logoUrl: apiTeam.logo,
        });

        if (result.data) {
          teamLookup[apiTeam.id] = result.data.id;
          teamsCreated++;
          console.log(`✅ Created: ${result.data.name}`);
        } else {
          console.error(`❌ Failed to create ${apiTeam.name}:`, result.errors);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Error creating team ${apiTeam.name}:`, error.message);
      }
    }

    // Create players
    console.log('⚽ Starting player data collection...');
    for (const apiTeam of apiTeams) {
      if (!teamLookup[apiTeam.id]) continue;

      try {
        console.log(`\n📝 Fetching players for ${apiTeam.name}...`);

        // Get 2 pages of players per team
        for (let page = 1; page <= 2; page++) {
          try {
            const playersData = await apiService.getPlayers(apiTeam.id, 2023, page);

            if (!playersData || playersData.length === 0) {
              console.log(`No more players on page ${page}`);
              break;
            }

            for (const playerData of playersData) {
              const { player, statistics } = playerData;

              if (!statistics || statistics.length === 0) continue;

              const mainStats = statistics[0];
              const position = positionMapping[mainStats.games?.position] || 'MID';
              const price = calculatePrice(mainStats);
              const totalPoints = calculatePoints(mainStats);
              const form = parseFloat(mainStats.games?.rating || '6.0') || 6.0;

              try {
                const result = await client.models.Player.create({
                  name: player.name,
                  position,
                  teamId: teamLookup[apiTeam.id],
                  price,
                  totalPoints,
                  form,
                  availability: player.injured ? 'INJURED' : 'AVAILABLE',
                  photoUrl: player.photo,
                });

                if (result.data) {
                  playersCreated++;
                  console.log(
                    `  ✅ ${player.name} (${position}) - £${price}m - ${totalPoints} pts`
                  );
                } else {
                  console.error(`  ❌ Failed to create ${player.name}:`, result.errors);
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
              } catch (playerError) {
                console.error(`  ❌ Error creating ${player.name}:`, playerError.message);
              }
            }

            // Delay between pages
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (pageError) {
            console.warn(`Error on page ${page} for ${apiTeam.name}:`, pageError.message);
            break;
          }
        }

        // Delay between teams
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (teamError) {
        console.warn(`Error fetching players for ${apiTeam.name}:`, teamError.message);
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`📊 Teams created: ${teamsCreated}`);
    console.log(`⚽ Players created: ${playersCreated}`);

    return { success: true, teamsCreated, playersCreated };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPremierLeagueData()
    .then(result => {
      if (result.success) {
        console.log('✅ Seeding completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Seeding failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}
