import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// API-Football interfaces - based on actual API response structure
interface ApiTeamResponse {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

interface ApiTeam {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
}

interface ApiPlayer {
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
  injured: boolean;
  photo: string;
}

interface ApiPlayerStatistics {
  team: ApiTeam;
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    number: number | null;
    position: string;
    rating: string | null;
    captain: boolean;
  };
  goals: {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
  };
  cards: {
    yellow: number | null;
    red: number | null;
  };
}

// Position mapping
const positionMapping: { [key: string]: 'GK' | 'DEF' | 'MID' | 'FWD' } = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Attacker: 'FWD',
};

// Utility functions
function calculatePrice(stats: ApiPlayerStatistics): number {
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

  return Math.round(Math.min(Math.max(price, 4.0), 15.0) * 2) / 2; // Round to nearest 0.5
}

function calculatePoints(stats: ApiPlayerStatistics): number {
  const goals = (stats.goals?.total || 0) * 4;
  const assists = (stats.goals?.assists || 0) * 3;
  const appearances = Math.min(stats.games?.appearences || 0, 38) * 2;
  const yellowCards = (stats.cards?.yellow || 0) * -1;
  const redCards = (stats.cards?.red || 0) * -3;

  // Clean sheet bonus for defenders and goalkeepers
  const cleanSheetBonus =
    stats.games?.position === 'Goalkeeper' || stats.games?.position === 'Defender'
      ? Math.max(0, (stats.games?.appearences || 0) - (stats.goals?.conceded || 0)) * 2
      : 0;

  return Math.max(goals + assists + appearances + yellowCards + redCards + cleanSheetBonus, 0);
}

// API-Football service
class ApiFootballService {
  private readonly baseUrl = 'https://v3.football.api-sports.io';
  public headers: {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
    'Content-Type': string;
  };

  constructor(apiKey?: string) {
    this.headers = {
      'X-RapidAPI-Key':
        apiKey ||
        (typeof window !== 'undefined'
          ? (window as any).API_FOOTBALL_KEY
          : process.env.API_FOOTBALL_KEY) ||
        '',
      'X-RapidAPI-Host': 'v3.football.api-sports.io',
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log(`Making API request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API-Football request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  async getPremierLeagueTeams(season: number = 2023): Promise<ApiTeam[]> {
    const response = await this.request<ApiTeamResponse[]>('/teams', {
      league: 39,
      season,
    }); // Premier League ID is 39

    // Extract team data from the response structure
    return response.map(item => ({
      id: item.team.id,
      name: item.team.name,
      code: item.team.code,
      country: item.team.country,
      founded: item.team.founded,
      logo: item.team.logo,
    }));
  }

  async getPlayers(
    teamId: number,
    season: number = 2023,
    page: number = 1
  ): Promise<{ player: ApiPlayer; statistics: ApiPlayerStatistics[] }[]> {
    return this.request<{ player: ApiPlayer; statistics: ApiPlayerStatistics[] }[]>('/players', {
      team: teamId,
      season,
      page,
    });
  }
}

// Create default instance (will be overridden when called with API key)
let apiService = new ApiFootballService();

// Progress tracking interface
export interface SeedingProgress {
  stage: string;
  current: number;
  total: number;
  message: string;
}

export interface SeedingResult {
  success: boolean;
  teamsCreated: number;
  playersCreated: number;
  error?: string;
}

// Main seeding function
export async function seedPremierLeagueData(
  onProgress?: (progress: SeedingProgress) => void,
  apiKey?: string
): Promise<SeedingResult> {
  // Use provided API key or prompt for it in browser
  if (apiKey || (typeof window !== 'undefined' && !apiService.headers['X-RapidAPI-Key'])) {
    apiService = new ApiFootballService(apiKey);
  }
  const updateProgress = (stage: string, current: number, total: number, message: string) => {
    if (onProgress) {
      onProgress({ stage, current, total, message });
    }
    console.log(`[${stage}] ${message} (${current}/${total})`);
  };

  try {
    updateProgress('init', 0, 100, 'Starting Premier League data seeding...');

    // Get Premier League teams
    updateProgress('teams', 10, 100, 'Fetching Premier League teams...');
    const apiTeams = await apiService.getPremierLeagueTeams(2023);

    updateProgress('teams', 20, 100, `Found ${apiTeams.length} Premier League teams`);

    let teamsCreated = 0;
    let playersCreated = 0;
    const teamLookup: { [key: number]: string } = {};

    // Create teams
    updateProgress('teams', 30, 100, 'Creating teams in database...');

    for (let i = 0; i < apiTeams.length; i++) {
      const apiTeam = apiTeams[i];

      try {
        console.log(`Creating team: ${apiTeam.name}`);
        const result = await client.models.FootballTeam.create({
          name: apiTeam.name,
          shortName: apiTeam.code,
          code: apiTeam.code,
          league: 'Premier League',
          logoUrl: apiTeam.logo,
        });

        console.log('Team creation result:', result);

        if (result.data) {
          teamLookup[apiTeam.id] = result.data.id;
          teamsCreated++;
          updateProgress(
            'teams',
            30 + (i / apiTeams.length) * 20,
            100,
            `Created team: ${result.data.name}`
          );
        } else if (result.errors) {
          console.error('Team creation errors:', result.errors);
        }

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to create team ${apiTeam.name}:`, error);
        updateProgress(
          'teams',
          30 + (i / apiTeams.length) * 20,
          100,
          `Failed to create team: ${apiTeam.name} - ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Get players for each team
    updateProgress('players', 50, 100, 'Starting player data collection...');

    for (let teamIndex = 0; teamIndex < apiTeams.length; teamIndex++) {
      const apiTeam = apiTeams[teamIndex];

      if (!teamLookup[apiTeam.id]) {
        continue;
      }

      try {
        updateProgress(
          'players',
          50 + (teamIndex / apiTeams.length) * 40,
          100,
          `Fetching players for ${apiTeam.name}...`
        );

        // Get multiple pages of players for each team
        for (let page = 1; page <= 2; page++) {
          try {
            const playersData = await apiService.getPlayers(apiTeam.id, 2023, page);

            if (!playersData || playersData.length === 0) {
              break;
            }

            for (const playerData of playersData) {
              const { player, statistics } = playerData;

              if (!statistics || statistics.length === 0) {
                continue;
              }

              const mainStats = statistics[0];
              const position = positionMapping[mainStats.games?.position] || 'MID';
              const price = calculatePrice(mainStats);
              const totalPoints = calculatePoints(mainStats);
              const form = parseFloat(mainStats.games?.rating || '6.0') || 6.0;

              try {
                console.log(`Creating player: ${player.name} for team ${apiTeam.name}`);
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

                console.log('Player creation result:', result);

                if (result.data) {
                  playersCreated++;
                  if (playersCreated % 10 === 0) {
                    updateProgress(
                      'players',
                      50 + (teamIndex / apiTeams.length) * 40,
                      100,
                      `Created ${playersCreated} players...`
                    );
                  }
                } else if (result.errors) {
                  console.error('Player creation errors:', result.errors);
                }
              } catch (playerError) {
                console.error(`Failed to create player ${player.name}:`, playerError);
              }
            }

            // Rate limiting between pages
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (pageError) {
            console.warn(`Error fetching page ${page} for ${apiTeam.name}:`, pageError);
            break;
          }
        }

        // Rate limiting between teams
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (teamError) {
        console.warn(`Error fetching players for ${apiTeam.name}:`, teamError);
        continue;
      }
    }

    updateProgress(
      'complete',
      100,
      100,
      `Seeding completed! Created ${teamsCreated} teams and ${playersCreated} players`
    );

    return {
      success: true,
      teamsCreated,
      playersCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    updateProgress('error', 0, 100, `Seeding failed: ${errorMessage}`);

    return {
      success: false,
      teamsCreated: 0,
      playersCreated: 0,
      error: errorMessage,
    };
  }
}

// This module is now used server-side only via Lambda functions
// Browser-based seeding has been removed for security reasons
// Use the seedingService.ts for programmatic seeding during league creation
