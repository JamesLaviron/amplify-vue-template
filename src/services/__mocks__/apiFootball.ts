/**
 * Mock implementation of ApiFootballService for testing
 * Provides realistic fake data without making actual API calls
 */

import type { League, Team, Player, PlayerStatistics, Fixture } from '../apiFootball';

// Mock data
const mockLeagues: League[] = [
  {
    id: 39,
    name: 'Premier League',
    country: 'England',
    logo: 'https://media.api-sports.io/football/leagues/39.png',
    flag: 'https://media.api-sports.io/flags/gb.svg',
    season: 2024,
  },
  {
    id: 140,
    name: 'La Liga',
    country: 'Spain',
    logo: 'https://media.api-sports.io/football/leagues/140.png',
    flag: 'https://media.api-sports.io/flags/es.svg',
    season: 2024,
  },
];

const mockTeams: Team[] = [
  {
    id: 33,
    name: 'Manchester United',
    code: 'MAN',
    country: 'England',
    founded: 1878,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/33.png',
  },
  {
    id: 40,
    name: 'Liverpool',
    code: 'LIV',
    country: 'England',
    founded: 1892,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/40.png',
  },
  {
    id: 50,
    name: 'Manchester City',
    code: 'MCI',
    country: 'England',
    founded: 1880,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/50.png',
  },
  {
    id: 42,
    name: 'Arsenal',
    code: 'ARS',
    country: 'England',
    founded: 1886,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/42.png',
  },
];

const mockPlayers: { player: Player; statistics: PlayerStatistics[] }[] = [
  {
    player: {
      id: 874,
      name: 'Cristiano Ronaldo',
      firstname: 'Cristiano',
      lastname: 'Ronaldo dos Santos Aveiro',
      age: 39,
      birth: {
        date: '1985-02-05',
        place: 'Funchal',
        country: 'Portugal',
      },
      nationality: 'Portugal',
      height: '187 cm',
      weight: '83 kg',
      injured: false,
      photo: 'https://media.api-sports.io/football/players/874.png',
    },
    statistics: [
      {
        team: mockTeams[0],
        league: mockLeagues[0],
        games: {
          appearences: 38,
          lineups: 38,
          minutes: 3420,
          number: 7,
          position: 'Attacker',
          rating: '7.5',
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 12,
          bench: 0,
        },
        shots: {
          total: 145,
          on: 67,
        },
        goals: {
          total: 24,
          conceded: 0,
          assists: 3,
          saves: null,
        },
        passes: {
          total: 1247,
          key: 45,
          accuracy: 82,
        },
        tackles: {
          total: 23,
          blocks: 2,
          interceptions: 8,
        },
        duels: {
          total: 456,
          won: 234,
        },
        dribbles: {
          attempts: 123,
          success: 67,
          past: null,
        },
        fouls: {
          drawn: 34,
          committed: 23,
        },
        cards: {
          yellow: 4,
          yellowred: 0,
          red: 0,
        },
        penalty: {
          won: 3,
          commited: 0,
          scored: 8,
          missed: 1,
          saved: null,
        },
      },
    ],
  },
  {
    player: {
      id: 306,
      name: 'Mohamed Salah',
      firstname: 'Mohamed',
      lastname: 'Salah Hamed Mahrous Ghaly',
      age: 32,
      birth: {
        date: '1992-06-15',
        place: 'Nagrig',
        country: 'Egypt',
      },
      nationality: 'Egypt',
      height: '175 cm',
      weight: '71 kg',
      injured: false,
      photo: 'https://media.api-sports.io/football/players/306.png',
    },
    statistics: [
      {
        team: mockTeams[1],
        league: mockLeagues[0],
        games: {
          appearences: 44,
          lineups: 43,
          minutes: 3842,
          number: 11,
          position: 'Attacker',
          rating: '8.2',
          captain: false,
        },
        substitutes: {
          in: 1,
          out: 15,
          bench: 1,
        },
        shots: {
          total: 167,
          on: 89,
        },
        goals: {
          total: 32,
          conceded: 0,
          assists: 16,
          saves: null,
        },
        passes: {
          total: 1654,
          key: 78,
          accuracy: 86,
        },
        tackles: {
          total: 34,
          blocks: 3,
          interceptions: 12,
        },
        duels: {
          total: 567,
          won: 298,
        },
        dribbles: {
          attempts: 145,
          success: 87,
          past: null,
        },
        fouls: {
          drawn: 45,
          committed: 18,
        },
        cards: {
          yellow: 2,
          yellowred: 0,
          red: 0,
        },
        penalty: {
          won: 5,
          commited: 0,
          scored: 6,
          missed: 0,
          saved: null,
        },
      },
    ],
  },
];

const mockFixtures: Fixture[] = [
  {
    id: 592870,
    referee: 'M. Oliver',
    timezone: 'UTC',
    date: '2024-08-16T19:30:00+00:00',
    timestamp: 1723834200,
    periods: {
      first: 1723834200,
      second: 1723837800,
    },
    venue: {
      id: 556,
      name: 'Old Trafford',
      city: 'Manchester',
    },
    status: {
      long: 'Match Finished',
      short: 'FT',
      elapsed: 90,
    },
    league: mockLeagues[0],
    teams: {
      home: mockTeams[0],
      away: mockTeams[1],
    },
    goals: {
      home: 2,
      away: 1,
    },
    score: {
      halftime: {
        home: 1,
        away: 0,
      },
      fulltime: {
        home: 2,
        away: 1,
      },
      extratime: {
        home: null,
        away: null,
      },
      penalty: {
        home: null,
        away: null,
      },
    },
  },
];

// Mock class implementation
class MockApiFootballService {
  async getLeagues(country?: string, season?: number): Promise<League[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let result = [...mockLeagues];

    if (country) {
      result = result.filter(league =>
        league.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (season) {
      result = result.map(league => ({ ...league, season }));
    }

    return result;
  }

  async getTeams(_league?: number, _season?: number): Promise<Team[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return all mock teams for any league (simplified for testing)
    return [...mockTeams];
  }

  async getPlayers(
    team: number,
    _season: number,
    _page: number = 1
  ): Promise<{ player: Player; statistics: PlayerStatistics[] }[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock players filtered by team if needed
    return mockPlayers.filter(playerData =>
      playerData.statistics.some(stat => stat.team.id === team)
    );
  }

  async getPlayerStatistics(playerId: number): Promise<PlayerStatistics[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const playerData = mockPlayers.find(p => p.player.id === playerId);
    return playerData?.statistics || [];
  }

  async getFixtures(league: number): Promise<Fixture[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockFixtures.filter(fixture => fixture.league.id === league);
  }

  async getLiveFixtures(): Promise<Fixture[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return fixtures with 'live' status
    return mockFixtures.map(fixture => ({
      ...fixture,
      status: {
        long: 'Second Half',
        short: '2H',
        elapsed: 67,
      },
    }));
  }

  async getFixture(fixtureId: number): Promise<Fixture[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const fixture = mockFixtures.find(f => f.id === fixtureId);
    return fixture ? [fixture] : [];
  }

  async getPremierLeagueTeams(_season: number = 2024): Promise<Team[]> {
    return this.getTeams(39, _season);
  }

  async getPremierLeagueFixtures(_season: number = 2024): Promise<Fixture[]> {
    return this.getFixtures(39);
  }
}

// Export mocked instance
export const apiFootballService = new MockApiFootballService();
export default apiFootballService;

// Export mock data for use in tests
export { mockLeagues, mockTeams, mockPlayers, mockFixtures };
