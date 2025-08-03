export interface Formation {
  id: string;
  name: string;
  positions: {
    gk: number;
    def: number;
    mid: number;
    fwd: number;
  };
  layout: Array<Array<string>>;
}

export const FORMATIONS: Formation[] = [
  {
    id: '4-4-2',
    name: '4-4-2',
    positions: { gk: 1, def: 4, mid: 4, fwd: 2 },
    layout: [['GK'], ['DEF', 'DEF', 'DEF', 'DEF'], ['MID', 'MID', 'MID', 'MID'], ['FWD', 'FWD']],
  },
  {
    id: '4-3-3',
    name: '4-3-3',
    positions: { gk: 1, def: 4, mid: 3, fwd: 3 },
    layout: [['GK'], ['DEF', 'DEF', 'DEF', 'DEF'], ['MID', 'MID', 'MID'], ['FWD', 'FWD', 'FWD']],
  },
  {
    id: '3-5-2',
    name: '3-5-2',
    positions: { gk: 1, def: 3, mid: 5, fwd: 2 },
    layout: [['GK'], ['DEF', 'DEF', 'DEF'], ['MID', 'MID', 'MID', 'MID', 'MID'], ['FWD', 'FWD']],
  },
  {
    id: '5-3-2',
    name: '5-3-2',
    positions: { gk: 1, def: 5, mid: 3, fwd: 2 },
    layout: [['GK'], ['DEF', 'DEF', 'DEF', 'DEF', 'DEF'], ['MID', 'MID', 'MID'], ['FWD', 'FWD']],
  },
];

export function getFormation(formationId: string): Formation | undefined {
  return FORMATIONS.find(f => f.id === formationId);
}

export function validateTeamFormation(
  formation: Formation,
  selections: Array<{ position: string }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const positionCounts = {
    GK: selections.filter(s => s.position === 'GK').length,
    DEF: selections.filter(s => s.position === 'DEF').length,
    MID: selections.filter(s => s.position === 'MID').length,
    FWD: selections.filter(s => s.position === 'FWD').length,
  };

  if (positionCounts.GK !== formation.positions.gk) {
    errors.push(`Need exactly ${formation.positions.gk} goalkeeper(s), have ${positionCounts.GK}`);
  }

  if (positionCounts.DEF !== formation.positions.def) {
    errors.push(`Need exactly ${formation.positions.def} defender(s), have ${positionCounts.DEF}`);
  }

  if (positionCounts.MID !== formation.positions.mid) {
    errors.push(
      `Need exactly ${formation.positions.mid} midfielder(s), have ${positionCounts.MID}`
    );
  }

  if (positionCounts.FWD !== formation.positions.fwd) {
    errors.push(`Need exactly ${formation.positions.fwd} forward(s), have ${positionCounts.FWD}`);
  }

  return { valid: errors.length === 0, errors };
}
