export const INITIAL_BUDGET = 1000;
export const MAX_PLAYERS_PER_TEAM = 3;

export interface Player {
  id: string;
  name: string;
  position: string;
  price: number;
  teamId: string;
}

export interface TeamBudget {
  totalBudget: number;
  spent: number;
  remaining: number;
}

export function calculateTeamBudget(players: Player[]): TeamBudget {
  const spent = players.reduce((total, player) => total + player.price, 0);

  return {
    totalBudget: INITIAL_BUDGET,
    spent,
    remaining: INITIAL_BUDGET - spent,
  };
}

export function canAddPlayer(
  player: Player,
  currentPlayers: Player[],
  budget: TeamBudget
): { canAdd: boolean; reason?: string } {
  // Check budget
  if (player.price > budget.remaining) {
    return {
      canAdd: false,
      reason: `Insufficient budget. Need £${player.price}m, have £${budget.remaining}m`,
    };
  }

  // Check if player already in team
  if (currentPlayers.some(p => p.id === player.id)) {
    return {
      canAdd: false,
      reason: 'Player already in your team',
    };
  }

  // Check max players per team
  const teamMatesCount = currentPlayers.filter(p => p.teamId === player.teamId).length;
  if (teamMatesCount >= MAX_PLAYERS_PER_TEAM) {
    return {
      canAdd: false,
      reason: `Maximum ${MAX_PLAYERS_PER_TEAM} players per team allowed`,
    };
  }

  // Check if team is full (15 players)
  if (currentPlayers.length >= 15) {
    return {
      canAdd: false,
      reason: 'Team is full (15 players maximum)',
    };
  }

  return { canAdd: true };
}

export function calculateTransferCost(
  playersOut: Player[],
  playersIn: Player[],
  freeTransfers: number = 1
): number {
  const transferCount = Math.max(playersOut.length, playersIn.length);
  const extraTransfers = Math.max(0, transferCount - freeTransfers);

  return extraTransfers * 4; // 4 points deducted per extra transfer
}

export function getPlayerValueChange(
  currentPrice: number,
  originalPrice: number
): { change: number; percentage: number } {
  const change = currentPrice - originalPrice;
  const percentage = Math.round((change / originalPrice) * 100 * 10) / 10;

  return { change, percentage };
}
