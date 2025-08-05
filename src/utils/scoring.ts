export interface ScoringRules {
  goals: { [position: string]: number };
  assists: number;
  cleanSheet: { [position: string]: number };
  saves: number;
  yellowCard: number;
  redCard: number;
  ownGoal: number;
  penaltyMiss: number;
  penaltySave: number;
}

export const DEFAULT_SCORING: ScoringRules = {
  goals: {
    GK: 6,
    DEF: 6,
    MID: 5,
    FWD: 4,
  },
  assists: 3,
  cleanSheet: {
    GK: 4,
    DEF: 4,
    MID: 1,
    FWD: 0,
  },
  saves: 0.5,
  yellowCard: -1,
  redCard: -3,
  ownGoal: -2,
  penaltyMiss: -2,
  penaltySave: 5,
};

export interface PlayerStats {
  goals: number;
  assists: number;
  cleanSheet: boolean;
  saves: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  penaltiesMissed: number;
  penaltiesSaved: number;
  minutesPlayed: number;
}

export function calculatePlayerPoints(
  stats: PlayerStats,
  position: string,
  rules: ScoringRules = DEFAULT_SCORING
): number {
  let points = 0;

  // Base points for appearing (playing at least 1 minute)
  if (stats.minutesPlayed > 0) {
    points += 1;
  }

  // Bonus for playing 60+ minutes
  if (stats.minutesPlayed >= 60) {
    points += 1;
  }

  // Goals
  points += stats.goals * (rules.goals[position] || 0);

  // Assists
  points += stats.assists * rules.assists;

  // Clean sheet
  if (stats.cleanSheet) {
    points += rules.cleanSheet[position] || 0;
  }

  // Saves (for goalkeepers)
  if (position === 'GK') {
    points += Math.floor(stats.saves / 3); // 1 point per 3 saves
  }

  // Cards
  points += stats.yellowCards * rules.yellowCard;
  points += stats.redCards * rules.redCard;

  // Own goals
  points += stats.ownGoals * rules.ownGoal;

  // Penalties
  points += stats.penaltiesMissed * rules.penaltyMiss;
  points += stats.penaltiesSaved * rules.penaltySave;

  return Math.max(0, points); // Minimum 0 points
}

export function calculateTeamPoints(
  playerStats: Array<PlayerStats & { position: string }>,
  rules: ScoringRules = DEFAULT_SCORING
): number {
  return playerStats.reduce((total, player) => {
    return total + calculatePlayerPoints(player, player.position, rules);
  }, 0);
}

export function getPlayerForm(recentPoints: number[]): number {
  if (recentPoints.length === 0) {
    return 0;
  }

  const sum = recentPoints.reduce((a, b) => a + b, 0);
  return Math.round((sum / recentPoints.length) * 10) / 10;
}
