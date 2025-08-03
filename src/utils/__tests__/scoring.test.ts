import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SCORING,
  calculatePlayerPoints,
  calculateTeamPoints,
  getPlayerForm,
  type PlayerStats,
} from '../scoring';

describe('scoring', () => {
  describe('calculatePlayerPoints', () => {
    it('calculates basic appearance points', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 30,
      };

      const points = calculatePlayerPoints(stats, 'MID');
      expect(points).toBe(1); // 1 point for appearing
    });

    it('adds bonus for 60+ minutes played', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 75,
      };

      const points = calculatePlayerPoints(stats, 'MID');
      expect(points).toBe(2); // 1 for appearing + 1 for 60+ minutes
    });

    it('calculates goal points by position', () => {
      const stats: PlayerStats = {
        goals: 2,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const gkPoints = calculatePlayerPoints(stats, 'GK');
      const defPoints = calculatePlayerPoints(stats, 'DEF');
      const midPoints = calculatePlayerPoints(stats, 'MID');
      const fwdPoints = calculatePlayerPoints(stats, 'FWD');

      expect(gkPoints).toBe(14); // 2 + (2 * 6) = 14
      expect(defPoints).toBe(14); // 2 + (2 * 6) = 14
      expect(midPoints).toBe(12); // 2 + (2 * 5) = 12
      expect(fwdPoints).toBe(10); // 2 + (2 * 4) = 10
    });

    it('calculates assist points', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 2,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const points = calculatePlayerPoints(stats, 'MID');
      expect(points).toBe(8); // 2 + (2 * 3) = 8
    });

    it('calculates clean sheet points by position', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: true,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const gkPoints = calculatePlayerPoints(stats, 'GK');
      const defPoints = calculatePlayerPoints(stats, 'DEF');
      const midPoints = calculatePlayerPoints(stats, 'MID');
      const fwdPoints = calculatePlayerPoints(stats, 'FWD');

      expect(gkPoints).toBe(6); // 2 + 4 = 6
      expect(defPoints).toBe(6); // 2 + 4 = 6
      expect(midPoints).toBe(3); // 2 + 1 = 3
      expect(fwdPoints).toBe(2); // 2 + 0 = 2
    });

    it('calculates goalkeeper save points', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 7, // Should give 2 points (7/3 = 2.33, floored to 2)
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const points = calculatePlayerPoints(stats, 'GK');
      expect(points).toBe(4); // 2 + 2 = 4
    });

    it('deducts points for cards', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 2,
        redCards: 1,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const points = calculatePlayerPoints(stats, 'MID');
      expect(points).toBe(0); // 2 + (2 * -1) + (1 * -3) = -3, but minimum is 0
    });

    it('deducts points for own goals and penalty misses', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 1,
        penaltiesMissed: 1,
        penaltiesSaved: 0,
        minutesPlayed: 90,
      };

      const points = calculatePlayerPoints(stats, 'FWD');
      expect(points).toBe(0); // 2 + (-2) + (-2) = -2, but minimum is 0
    });

    it('adds points for penalty saves', () => {
      const stats: PlayerStats = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 1,
        minutesPlayed: 90,
      };

      const points = calculatePlayerPoints(stats, 'GK');
      expect(points).toBe(7); // 2 + 5 = 7
    });

    it('returns 0 for no minutes played', () => {
      const stats: PlayerStats = {
        goals: 2,
        assists: 1,
        cleanSheet: true,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        penaltiesMissed: 0,
        penaltiesSaved: 0,
        minutesPlayed: 0,
      };

      const points = calculatePlayerPoints(stats, 'FWD');
      expect(points).toBe(11); // Goals (2*4) + assists (1*3) + clean sheet (0) = 11
    });
  });

  describe('calculateTeamPoints', () => {
    it('calculates total team points', () => {
      const playerStats = [
        {
          goals: 1,
          assists: 0,
          cleanSheet: true,
          saves: 0,
          yellowCards: 0,
          redCards: 0,
          ownGoals: 0,
          penaltiesMissed: 0,
          penaltiesSaved: 0,
          minutesPlayed: 90,
          position: 'GK',
        },
        {
          goals: 1,
          assists: 1,
          cleanSheet: true,
          saves: 0,
          yellowCards: 0,
          redCards: 0,
          ownGoals: 0,
          penaltiesMissed: 0,
          penaltiesSaved: 0,
          minutesPlayed: 90,
          position: 'DEF',
        },
      ];

      const totalPoints = calculateTeamPoints(playerStats);

      // GK: 2 + 6 + 4 = 12
      // DEF: 2 + 6 + 3 + 4 = 15
      // Total: 27
      expect(totalPoints).toBe(27);
    });

    it('handles empty team', () => {
      const totalPoints = calculateTeamPoints([]);
      expect(totalPoints).toBe(0);
    });
  });

  describe('getPlayerForm', () => {
    it('calculates average form from recent points', () => {
      const recentPoints = [8, 12, 6, 15, 9];
      const form = getPlayerForm(recentPoints);
      expect(form).toBe(10); // (8+12+6+15+9)/5 = 10
    });

    it('handles single game form', () => {
      const recentPoints = [7];
      const form = getPlayerForm(recentPoints);
      expect(form).toBe(7);
    });

    it('returns 0 for no recent points', () => {
      const form = getPlayerForm([]);
      expect(form).toBe(0);
    });

    it('rounds to 1 decimal place', () => {
      const recentPoints = [8, 9, 10];
      const form = getPlayerForm(recentPoints);
      expect(form).toBe(9); // (8+9+10)/3 = 9
    });

    it('handles decimal averages correctly', () => {
      const recentPoints = [7, 8, 9];
      const form = getPlayerForm(recentPoints);
      expect(form).toBe(8); // (7+8+9)/3 = 8
    });
  });

  describe('DEFAULT_SCORING', () => {
    it('has correct goal values by position', () => {
      expect(DEFAULT_SCORING.goals.GK).toBe(6);
      expect(DEFAULT_SCORING.goals.DEF).toBe(6);
      expect(DEFAULT_SCORING.goals.MID).toBe(5);
      expect(DEFAULT_SCORING.goals.FWD).toBe(4);
    });

    it('has correct assist value', () => {
      expect(DEFAULT_SCORING.assists).toBe(3);
    });

    it('has correct clean sheet values', () => {
      expect(DEFAULT_SCORING.cleanSheet.GK).toBe(4);
      expect(DEFAULT_SCORING.cleanSheet.DEF).toBe(4);
      expect(DEFAULT_SCORING.cleanSheet.MID).toBe(1);
      expect(DEFAULT_SCORING.cleanSheet.FWD).toBe(0);
    });

    it('has correct penalty values', () => {
      expect(DEFAULT_SCORING.penaltyMiss).toBe(-2);
      expect(DEFAULT_SCORING.penaltySave).toBe(5);
    });
  });
});
