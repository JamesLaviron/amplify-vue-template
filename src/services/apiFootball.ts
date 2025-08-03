/**
 * API-Football Service
 * Integrates with RapidAPI's API-Football for real football data
 * Documentation: https://rapidapi.com/api-sports/api/api-football
 */

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface Player {
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

export interface PlayerStatistics {
  team: Team;
  league: League;
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    number: number | null;
    position: string;
    rating: string | null;
    captain: boolean;
  };
  substitutes: {
    in: number;
    out: number;
    bench: number;
  };
  shots: {
    total: number | null;
    on: number | null;
  };
  goals: {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
  };
  passes: {
    total: number | null;
    key: number | null;
    accuracy: number | null;
  };
  tackles: {
    total: number | null;
    blocks: number | null;
    interceptions: number | null;
  };
  duels: {
    total: number | null;
    won: number | null;
  };
  dribbles: {
    attempts: number | null;
    success: number | null;
    past: number | null;
  };
  fouls: {
    drawn: number | null;
    committed: number | null;
  };
  cards: {
    yellow: number | null;
    yellowred: number | null;
    red: number | null;
  };
  penalty: {
    won: number | null;
    commited: number | null;
    scored: number | null;
    missed: number | null;
    saved: number | null;
  };
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number | null;
    second: number | null;
  };
  venue: {
    id: number | null;
    name: string | null;
    city: string | null;
  };
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

class ApiFootballService {
  private readonly baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  private readonly headers = {
    'X-RapidAPI-Key': process.env.API_FOOTBALL_KEY || '',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'Content-Type': 'application/json',
  };

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

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

  /**
   * Get leagues by country
   */
  async getLeagues(country?: string, season?: number): Promise<League[]> {
    return this.request<League[]>('/leagues', { country, season });
  }

  /**
   * Get teams by league
   */
  async getTeams(league: number, season: number): Promise<Team[]> {
    return this.request<Team[]>('/teams', { league, season });
  }

  /**
   * Get players by team
   */
  async getPlayers(
    team: number,
    season: number,
    page: number = 1
  ): Promise<{ player: Player; statistics: PlayerStatistics[] }[]> {
    return this.request<{ player: Player; statistics: PlayerStatistics[] }[]>('/players', {
      team,
      season,
      page,
    });
  }

  /**
   * Get player statistics
   */
  async getPlayerStatistics(playerId: number, season: number): Promise<PlayerStatistics[]> {
    return this.request<PlayerStatistics[]>('/players', {
      id: playerId,
      season,
    });
  }

  /**
   * Get fixtures by league and season
   */
  async getFixtures(
    league: number,
    season: number,
    from?: string,
    to?: string
  ): Promise<Fixture[]> {
    return this.request<Fixture[]>('/fixtures', {
      league,
      season,
      from,
      to,
    });
  }

  /**
   * Get live fixtures
   */
  async getLiveFixtures(): Promise<Fixture[]> {
    return this.request<Fixture[]>('/fixtures', { live: 'all' });
  }

  /**
   * Get fixture details by ID
   */
  async getFixture(fixtureId: number): Promise<Fixture[]> {
    return this.request<Fixture[]>('/fixtures', { id: fixtureId });
  }

  /**
   * Get Premier League data (convenience method)
   */
  async getPremierLeagueTeams(season: number = 2024): Promise<Team[]> {
    return this.getTeams(39, season); // Premier League ID is 39
  }

  /**
   * Get Premier League fixtures (convenience method)
   */
  async getPremierLeagueFixtures(season: number = 2024): Promise<Fixture[]> {
    return this.getFixtures(39, season);
  }
}

// Export singleton instance
export const apiFootballService = new ApiFootballService();
export default apiFootballService;
