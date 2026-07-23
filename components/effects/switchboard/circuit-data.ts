export type Vec3 = [number, number, number];

export type CircuitPole = {
  id: string;
  label: string;
  rating: string;
  index: number;
};

/**
 * Layout: modules on DIN (body in front of rail).
 * Neutral LEFT + earth RIGHT at same Y.
 * Comb feeds LINE + N at the TOP of RCBOs.
 */
export const BOARD = {
  width: 4.6,
  height: 3.35,
  depth: 0.92,
  innerDepth: 0.7,
  railY: 0,
  railZ: 0.02,
  mainWidth: 0.17,
  rcboWidth: 0.17,
  moduleGap: 0.005,
  moduleDepth: 0.36,
  moduleHeight: 0.86,
  firstModuleX: -1.72,
  barY: 1.26,
  barZ: 0.06,
  /** Separate entry points for incoming TPS / earth */
  knockoutActive: [-1.95, 1.4, -0.22] as Vec3,
  /** Kept left of the main so N never reads as a black fan into the red */
  knockoutNeutral: [-1.78, 1.55, -0.3] as Vec3,
  knockoutEarth: [1.55, 1.42, -0.24] as Vec3,
  loomGather: [0.95, -1.0, -0.06] as Vec3,
  outgoingExit: [1.15, -1.32, -0.38] as Vec3,
};

export const CIRCUITS: CircuitPole[] = [
  { id: 'hot-plates', label: 'PROTECTED HOT PLATES', rating: 'C40', index: 0 },
  { id: 'wall-oven', label: 'PROTECTED WALL OVEN', rating: 'C20', index: 1 },
  { id: 'heat-bank', label: 'PROTECTED HEAT BANK', rating: 'C20', index: 2 },
  { id: 'power-1', label: 'PROTECTED POWER', rating: 'C20', index: 3 },
  { id: 'power-2', label: 'PROTECTED POWER', rating: 'C20', index: 4 },
  { id: 'power-3', label: 'PROTECTED POWER', rating: 'C16', index: 5 },
  { id: 'power-4', label: 'PROTECTED POWER', rating: 'C16', index: 6 },
  { id: 'light-1', label: 'PROTECTED LIGHT', rating: 'C10', index: 7 },
  { id: 'light-2', label: 'PROTECTED LIGHT', rating: 'C10', index: 8 },
  { id: 'light-3', label: 'PROTECTED LIGHT', rating: 'C10', index: 9 },
  { id: 'garage', label: 'PROTECTED GARAGE', rating: 'C20', index: 10 },
  { id: 'ac', label: 'PROTECTED AIR CON', rating: 'C20', index: 11 },
];

export function modulePitch(): number {
  return BOARD.rcboWidth + BOARD.moduleGap;
}

export function mainSwitchX(): number {
  return BOARD.firstModuleX;
}

export function rcboX(index: number): number {
  return BOARD.firstModuleX + modulePitch() + index * modulePitch();
}

export function moduleBodyZ(): number {
  return BOARD.railZ + BOARD.moduleDepth / 2 + 0.14;
}

export function moduleTopTerminal(x: number): Vec3 {
  return [
    x,
    BOARD.railY + BOARD.moduleHeight / 2 + 0.01,
    moduleBodyZ() - BOARD.moduleDepth * 0.28,
  ];
}

export function moduleBottomTerminal(x: number): Vec3 {
  return [
    x,
    BOARD.railY - BOARD.moduleHeight / 2 - 0.01,
    moduleBodyZ() - BOARD.moduleDepth * 0.28,
  ];
}

export function moduleNeutralTerminal(x: number): Vec3 {
  return [
    x + BOARD.rcboWidth * 0.22,
    BOARD.railY + BOARD.moduleHeight / 2 + 0.01,
    moduleBodyZ() - BOARD.moduleDepth * 0.2,
  ];
}

export function poleSpan(): number {
  return rcboX(CIRCUITS.length - 1) - mainSwitchX();
}

export function poleCenterX(): number {
  return (mainSwitchX() + rcboX(CIRCUITS.length - 1)) / 2;
}

/** Neutral LEFT, earth RIGHT — span the module row */
export function barLayout() {
  const half = poleSpan() * 0.42;
  const cx = poleCenterX();
  const gap = 0.22;
  const neutCx = cx - half / 2 - gap / 2;
  const earthCx = cx + half / 2 + gap / 2;
  return { half, earthCx, neutCx, y: BOARD.barY, z: BOARD.barZ };
}

/** 0 = supply in, 1 = bond/spare, 2+ = circuit tails */
export function earthBarScrew(i: number): Vec3 {
  const { half, earthCx, y, z } = barLayout();
  const total = CIRCUITS.length + 2;
  const left = earthCx - half / 2 + 0.05;
  const span = half - 0.1;
  const x = left + (i / Math.max(total - 1, 1)) * span;
  return [x, y, z];
}

export function neutralBarScrew(i: number): Vec3 {
  const { half, neutCx, y, z } = barLayout();
  const total = CIRCUITS.length + 2;
  const left = neutCx - half / 2 + 0.05;
  const span = half - 0.1;
  const x = left + (i / Math.max(total - 1, 1)) * span;
  return [x, y, z];
}

export function loomLateral(i: number, count: number, spacing = 0.036): number {
  return (i - (count - 1) / 2) * spacing;
}
