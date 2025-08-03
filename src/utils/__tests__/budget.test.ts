import { describe, it, expect } from 'vitest';
import {
  INITIAL_BUDGET,
  MAX_PLAYERS_PER_TEAM,
  calculateTeamBudget,
  canAddPlayer,
  calculateTransferCost,
  getPlayerValueChange,
  type Player,
} from '../budget';

describe('budget', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Player 1', position: 'GK', price: 50, teamId: 'team1' },
    { id: '2', name: 'Player 2', position: 'DEF', price: 80, teamId: 'team1' },
    { id: '3', name: 'Player 3', position: 'MID', price: 120, teamId: 'team2' },
    { id: '4', name: 'Player 4', position: 'FWD', price: 150, teamId: 'team2' },
  ];

  describe('constants', () => {
    it('has correct initial budget', () => {
      expect(INITIAL_BUDGET).toBe(1000);
    });

    it('has correct max players per team', () => {
      expect(MAX_PLAYERS_PER_TEAM).toBe(3);
    });
  });

  describe('calculateTeamBudget', () => {
    it('calculates budget correctly with players', () => {
      const players = mockPlayers.slice(0, 3); // First 3 players
      const expectedSpent = 50 + 80 + 120; // 250

      const budget = calculateTeamBudget(players);

      expect(budget.totalBudget).toBe(INITIAL_BUDGET);
      expect(budget.spent).toBe(expectedSpent);
      expect(budget.remaining).toBe(INITIAL_BUDGET - expectedSpent);
    });

    it('calculates budget correctly with no players', () => {
      const budget = calculateTeamBudget([]);

      expect(budget.totalBudget).toBe(INITIAL_BUDGET);
      expect(budget.spent).toBe(0);
      expect(budget.remaining).toBe(INITIAL_BUDGET);
    });

    it('calculates budget correctly with all budget spent', () => {
      const expensivePlayers: Player[] = [
        { id: '1', name: 'Expensive', position: 'FWD', price: 1000, teamId: 'team1' },
      ];

      const budget = calculateTeamBudget(expensivePlayers);

      expect(budget.spent).toBe(1000);
      expect(budget.remaining).toBe(0);
    });
  });

  describe('canAddPlayer', () => {
    const currentPlayers = mockPlayers.slice(0, 2); // Players 1 and 2
    const budget = calculateTeamBudget(currentPlayers);

    it('allows adding player within budget', () => {
      const newPlayer: Player = {
        id: '5',
        name: 'New Player',
        position: 'MID',
        price: 100,
        teamId: 'team3',
      };

      const result = canAddPlayer(newPlayer, currentPlayers, budget);

      expect(result.canAdd).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('prevents adding player over budget', () => {
      const expensivePlayer: Player = {
        id: '5',
        name: 'Expensive Player',
        position: 'FWD',
        price: 1000,
        teamId: 'team3',
      };

      const result = canAddPlayer(expensivePlayer, currentPlayers, budget);

      expect(result.canAdd).toBe(false);
      expect(result.reason).toContain('Insufficient budget');
    });

    it('prevents adding duplicate player', () => {
      const duplicatePlayer = mockPlayers[0]; // Player 1 again

      const result = canAddPlayer(duplicatePlayer, currentPlayers, budget);

      expect(result.canAdd).toBe(false);
      expect(result.reason).toBe('Player already in your team');
    });

    it('prevents adding more than max players per team', () => {
      const playersFromSameTeam: Player[] = [
        { id: '1', name: 'Player 1', position: 'GK', price: 50, teamId: 'team1' },
        { id: '2', name: 'Player 2', position: 'DEF', price: 60, teamId: 'team1' },
        { id: '3', name: 'Player 3', position: 'MID', price: 70, teamId: 'team1' },
      ];
      const teamBudget = calculateTeamBudget(playersFromSameTeam);

      const newPlayerSameTeam: Player = {
        id: '4',
        name: 'Player 4',
        position: 'FWD',
        price: 80,
        teamId: 'team1',
      };

      const result = canAddPlayer(newPlayerSameTeam, playersFromSameTeam, teamBudget);

      expect(result.canAdd).toBe(false);
      expect(result.reason).toContain('Maximum 3 players per team');
    });

    it('prevents adding to full team', () => {
      const fullTeam: Player[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Player ${i + 1}`,
        position: 'MID',
        price: 50,
        teamId: `team${Math.floor(i / 3) + 1}`, // Max 3 per team
      }));
      const teamBudget = calculateTeamBudget(fullTeam);

      const newPlayer: Player = {
        id: '16',
        name: 'Extra Player',
        position: 'FWD',
        price: 60,
        teamId: 'team6',
      };

      const result = canAddPlayer(newPlayer, fullTeam, teamBudget);

      expect(result.canAdd).toBe(false);
      expect(result.reason).toBe('Team is full (15 players maximum)');
    });
  });

  describe('calculateTransferCost', () => {
    const playersOut = mockPlayers.slice(0, 2);
    const playersIn = mockPlayers.slice(2, 4);

    it('calculates no cost for free transfers', () => {
      const cost = calculateTransferCost(playersOut.slice(0, 1), playersIn.slice(0, 1), 1);
      expect(cost).toBe(0);
    });

    it('calculates cost for extra transfers', () => {
      const cost = calculateTransferCost(playersOut, playersIn, 1); // 2 transfers, 1 free
      expect(cost).toBe(4); // 1 extra transfer * 4 points
    });

    it('calculates cost for multiple extra transfers', () => {
      const cost = calculateTransferCost(playersOut, playersIn, 0); // 2 transfers, 0 free
      expect(cost).toBe(8); // 2 extra transfers * 4 points
    });

    it('handles uneven player in/out counts', () => {
      const cost = calculateTransferCost(playersOut.slice(0, 1), playersIn, 1); // 1 out, 2 in
      expect(cost).toBe(4); // max(1, 2) = 2 transfers, 1 free = 1 extra
    });

    it('handles more free transfers than needed', () => {
      const cost = calculateTransferCost(playersOut.slice(0, 1), playersIn.slice(0, 1), 5);
      expect(cost).toBe(0); // More free transfers than needed
    });
  });

  describe('getPlayerValueChange', () => {
    it('calculates positive value change', () => {
      const result = getPlayerValueChange(110, 100);

      expect(result.change).toBe(10);
      expect(result.percentage).toBe(10);
    });

    it('calculates negative value change', () => {
      const result = getPlayerValueChange(90, 100);

      expect(result.change).toBe(-10);
      expect(result.percentage).toBe(-10);
    });

    it('handles no change', () => {
      const result = getPlayerValueChange(100, 100);

      expect(result.change).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it('rounds percentage correctly', () => {
      const result = getPlayerValueChange(103.33, 100);

      expect(result.change).toBeCloseTo(3.33, 2);
      expect(result.percentage).toBeCloseTo(3.3, 1); // Rounded to 1 decimal
    });

    it('handles large percentage changes', () => {
      const result = getPlayerValueChange(200, 100);

      expect(result.change).toBe(100);
      expect(result.percentage).toBe(100);
    });

    it('handles fractional prices', () => {
      const result = getPlayerValueChange(105.5, 100.5);

      expect(result.change).toBe(5);
      expect(result.percentage).toBeCloseTo(5.0); // ~4.98, rounded to 5.0
    });
  });
});
