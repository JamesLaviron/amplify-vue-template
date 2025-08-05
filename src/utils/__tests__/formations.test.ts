import { describe, it, expect } from 'vitest';
import { FORMATIONS, getFormation, validateTeamFormation } from '../formations';

describe('formations', () => {
  describe('FORMATIONS constant', () => {
    it('contains standard formations', () => {
      expect(FORMATIONS).toHaveLength(4);

      const formationIds = FORMATIONS.map(f => f.id);
      expect(formationIds).toContain('4-4-2');
      expect(formationIds).toContain('4-3-3');
      expect(formationIds).toContain('3-5-2');
      expect(formationIds).toContain('5-3-2');
    });

    it('has correct player counts for each formation', () => {
      FORMATIONS.forEach(formation => {
        const totalPlayers =
          formation.positions.gk +
          formation.positions.def +
          formation.positions.mid +
          formation.positions.fwd;
        expect(totalPlayers).toBe(11);
        expect(formation.positions.gk).toBe(1); // Always 1 goalkeeper
      });
    });

    it('has valid layout arrays', () => {
      FORMATIONS.forEach(formation => {
        expect(formation.layout).toBeInstanceOf(Array);
        expect(formation.layout.length).toBeGreaterThan(0);

        // Count positions in layout
        const layoutPositions = formation.layout.flat();
        const gkCount = layoutPositions.filter(p => p === 'GK').length;
        const defCount = layoutPositions.filter(p => p === 'DEF').length;
        const midCount = layoutPositions.filter(p => p === 'MID').length;
        const fwdCount = layoutPositions.filter(p => p === 'FWD').length;

        expect(gkCount).toBe(formation.positions.gk);
        expect(defCount).toBe(formation.positions.def);
        expect(midCount).toBe(formation.positions.mid);
        expect(fwdCount).toBe(formation.positions.fwd);
      });
    });
  });

  describe('getFormation', () => {
    it('returns correct formation for valid ID', () => {
      const formation = getFormation('4-4-2');
      expect(formation).toBeDefined();
      expect(formation?.id).toBe('4-4-2');
      expect(formation?.name).toBe('4-4-2');
      expect(formation?.positions).toEqual({ gk: 1, def: 4, mid: 4, fwd: 2 });
    });

    it('returns undefined for invalid ID', () => {
      const formation = getFormation('invalid-formation');
      expect(formation).toBeUndefined();
    });
  });

  describe('validateTeamFormation', () => {
    const formation442 = getFormation('4-4-2')!;

    it('validates correct team formation', () => {
      const selections = [
        { position: 'GK' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'FWD' },
        { position: 'FWD' },
      ];

      const result = validateTeamFormation(formation442, selections);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects too few goalkeepers', () => {
      const selections = [
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'FWD' },
        { position: 'FWD' },
        { position: 'FWD' },
      ];

      const result = validateTeamFormation(formation442, selections);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Need exactly 1 goalkeeper(s), have 0');
    });

    it('detects too many defenders', () => {
      const selections = [
        { position: 'GK' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' }, // 5 defenders instead of 4
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'FWD' },
        { position: 'FWD' },
      ];

      const result = validateTeamFormation(formation442, selections);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Need exactly 4 defender(s), have 5');
    });

    it('detects too few midfielders', () => {
      const selections = [
        { position: 'GK' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'MID' },
        { position: 'MID' }, // Only 2 midfielders instead of 4
        { position: 'FWD' },
        { position: 'FWD' },
        { position: 'FWD' },
        { position: 'FWD' },
      ];

      const result = validateTeamFormation(formation442, selections);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Need exactly 4 midfielder(s), have 2');
      expect(result.errors).toContain('Need exactly 2 forward(s), have 4');
    });

    it('handles empty selections', () => {
      const result = validateTeamFormation(formation442, []);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(4); // All positions missing
    });

    it('validates 4-3-3 formation correctly', () => {
      const formation433 = getFormation('4-3-3')!;
      const selections = [
        { position: 'GK' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'DEF' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'MID' },
        { position: 'FWD' },
        { position: 'FWD' },
        { position: 'FWD' },
      ];

      const result = validateTeamFormation(formation433, selections);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
