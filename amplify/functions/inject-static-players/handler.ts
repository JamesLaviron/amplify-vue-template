import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import fetch from 'node-fetch';

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-3',
});

// Premier League teams with their API IDs
const premierLeagueTeams = [
  { apiId: '33', name: 'Manchester United' },
  { apiId: '34', name: 'Newcastle' },
  { apiId: '35', name: 'Bournemouth' },
  { apiId: '36', name: 'Fulham' },
  { apiId: '39', name: 'Wolves' },
  { apiId: '40', name: 'Liverpool' },
  { apiId: '42', name: 'Arsenal' },
  { apiId: '44', name: 'Burnley' },
  { apiId: '45', name: 'Everton' },
  { apiId: '47', name: 'Tottenham' },
  { apiId: '48', name: 'West Ham' },
  { apiId: '49', name: 'Chelsea' },
  { apiId: '50', name: 'Manchester City' },
  { apiId: '51', name: 'Brighton' },
  { apiId: '52', name: 'Crystal Palace' },
  { apiId: '55', name: 'Brentford' },
  { apiId: '62', name: 'Sheffield Utd' },
  { apiId: '65', name: 'Nottingham Forest' },
  { apiId: '66', name: 'Aston Villa' },
  { apiId: '1359', name: 'Luton' },
];

interface PlayerData {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
    };
    league: {
      id: number;
      name: string;
    };
    games: {
      appearances: number;
      position: string;
      number: number;
      minutes: number;
    };
    goals: {
      total: number;
      assists: number;
    };
    cards: {
      yellow: number;
      red: number;
    };
    rating: string;
  }>;
}

async function fetchPlayersForTeam(teamId: string, teamName: string): Promise<PlayerData[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error('API_FOOTBALL_KEY environment variable is not set');
  }

  const url = `https://v3.football.api-sports.io/players?team=${teamId}&season=2023&league=39`;

  console.log(`Fetching players for ${teamName} (ID: ${teamId})...`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { response?: PlayerData[]; errors?: unknown[] };

    if (data.errors && data.errors.length > 0) {
      throw new Error(`API returned errors: ${JSON.stringify(data.errors)}`);
    }

    console.log(`Found ${data.response?.length || 0} players for ${teamName}`);
    return data.response || [];
  } catch (error) {
    console.error(`Error fetching players for ${teamName}:`, error);
    return [];
  }
}

function mapPositionToFantasy(position: string): string {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper')) {
    return 'Goalkeeper';
  }
  if (pos.includes('defender')) {
    return 'Defender';
  }
  if (pos.includes('midfielder')) {
    return 'Midfielder';
  }
  if (pos.includes('attacker') || pos.includes('forward')) {
    return 'Attacker';
  }
  return 'Midfielder'; // Default
}

function calculateFantasyPrice(stats: PlayerData['statistics'][0]): number {
  const appearances = stats?.games?.appearances || 0;
  const goals = stats?.goals?.total || 0;
  const assists = stats?.goals?.assists || 0;
  const rating = parseFloat(stats?.rating || '6.0');

  // Base price calculation
  let price = 4.0; // Minimum price

  // Add value based on performances
  price += appearances * 0.05; // 0.05M per appearance
  price += goals * 0.3; // 0.3M per goal
  price += assists * 0.2; // 0.2M per assist
  price += (rating - 6.0) * 2; // Rating bonus

  // Cap between 4.0 and 15.0
  return Math.max(4.0, Math.min(15.0, Math.round(price * 10) / 10));
}

async function savePlayerToDynamoDB(playerData: PlayerData, teamName: string): Promise<boolean> {
  const tableName = process.env.STATIC_PLAYERS_TABLE_NAME;
  if (!tableName) {
    console.error('STATIC_PLAYERS_TABLE_NAME environment variable not set');
    return false;
  }

  const player = playerData.player;
  const stats = playerData.statistics[0]; // Use Premier League stats

  if (!stats) {
    console.log(`No Premier League stats found for ${player.name}`);
    return false;
  }

  try {
    const item = {
      id: { S: player.id.toString() },
      apiId: { S: player.id.toString() },
      name: { S: player.name || '' },
      firstname: { S: player.firstname || '' },
      lastname: { S: player.lastname || '' },
      age: { N: (player.age || 0).toString() },
      birthDate: { S: player.birth?.date || '' },
      birthPlace: { S: player.birth?.place || '' },
      birthCountry: { S: player.birth?.country || '' },
      nationality: { S: player.nationality || '' },
      height: { S: player.height || '' },
      weight: { S: player.weight || '' },
      photo: { S: player.photo || '' },
      teamApiId: { S: stats.team.id.toString() },
      teamName: { S: teamName },
      position: { S: mapPositionToFantasy(stats.games?.position || '') },
      number: { N: (stats.games?.number || 0).toString() },
      appearances: { N: (stats.games?.appearances || 0).toString() },
      goals: { N: (stats.goals?.total || 0).toString() },
      assists: { N: (stats.goals?.assists || 0).toString() },
      yellowCards: { N: (stats.cards?.yellow || 0).toString() },
      redCards: { N: (stats.cards?.red || 0).toString() },
      minutes: { N: (stats.games?.minutes || 0).toString() },
      rating: { S: stats.rating || '6.0' },
      fantasyPrice: { N: calculateFantasyPrice(stats).toString() },
      fantasyPoints: { N: '0' },
      isInjured: { BOOL: false },
      injuryDetails: { S: '' },
    };

    await dynamoClient.send(
      new PutItemCommand({
        TableName: tableName,
        Item: item,
      })
    );

    return true;
  } catch (error) {
    console.error(`Error saving player ${player.name}:`, error);
    return false;
  }
}

export const handler = async () => {
  console.log('🚀 Starting Premier League players injection...');

  let totalPlayers = 0;
  let successfulPlayers = 0;
  const results = [];

  for (const team of premierLeagueTeams) {
    try {
      console.log(`\n📊 Processing ${team.name}...`);

      // Fetch players for this team
      const playersData = await fetchPlayersForTeam(team.apiId, team.name);

      let teamSuccessCount = 0;
      totalPlayers += playersData.length;

      // Save each player to DynamoDB
      for (const playerData of playersData) {
        const success = await savePlayerToDynamoDB(playerData, team.name);
        if (success) {
          teamSuccessCount++;
          successfulPlayers++;
        }

        // Small delay to avoid overwhelming DynamoDB
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      results.push({
        team: team.name,
        total: playersData.length,
        successful: teamSuccessCount,
        failed: playersData.length - teamSuccessCount,
      });

      console.log(`✅ ${team.name}: ${teamSuccessCount}/${playersData.length} players saved`);

      // Rate limiting - wait between teams
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error processing ${team.name}:`, error);
      results.push({
        team: team.name,
        total: 0,
        successful: 0,
        failed: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  console.log('\n🎉 Injection completed!');
  console.log(`📊 Total players processed: ${totalPlayers}`);
  console.log(`✅ Successfully saved: ${successfulPlayers}`);
  console.log(`❌ Failed: ${totalPlayers - successfulPlayers}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Premier League players injection completed',
      totalPlayers,
      successfulPlayers,
      failedPlayers: totalPlayers - successfulPlayers,
      results,
    }),
  };
};
