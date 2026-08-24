import { moduleTerminalLocal } from './assets/module-assets';

export type Vec3 = [number, number, number];

export type CircuitPole = {
  id: string;
  label: string;
  rating: string;
  index: number;
};

/**
 * Layout: modules on DIN (body in front of rail).
 * Neutral + earth bars on the BACK WALL (not side panels).
 * Comb feeds LINE + N at the TOP of RCBOs.
 * Outgoing TPS gathers into ONE floor gland (not scattered exits).
 */
/** Main + circuit poles (kept in sync with CIRCUITS.length + 1). */
const POLE_COUNT = 13; // 1 main + 12 RCBOs
const RCBO_WIDTH = 0.17;
const MODULE_PITCH = RCBO_WIDTH;
/** Tight box: small equal side margins so poles fill the enclosure */
const SIDE_MARGIN = 0.16;
const POLE_SPAN = (POLE_COUNT - 1) * MODULE_PITCH;
const BOARD_HEIGHT = 3.35;
const BOARD_WIDTH = POLE_SPAN + RCBO_WIDTH + SIDE_MARGIN * 2;

export const BOARD = {
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
  depth: 1.7,
  innerDepth: 1.45,
  railY: 0,
  railZ: 0.08,
  mainWidth: RCBO_WIDTH,
  // Exact pole pitch — modules abut
  rcboWidth: RCBO_WIDTH,
  moduleGap: 0,
  moduleDepth: 0.55,
  moduleHeight: 0.86,
  /** Centered pole row — enclosure hugs the modules */
  firstModuleX: -POLE_SPAN / 2,
  /** Terminal bars flush on the back wall above the DIN */
  barY: 1.05,
  barZ: -0.62,
  /**
   * Single mains TPS gland (matches Enclosure top-left knockout 0).
   * Active + neutral + earth peel from this one cable inside the board.
   */
  mainsKnockout: [-BOARD_WIDTH / 2 + 0.22, 1.555, -0.35] as Vec3,
  /**
   * Floor gland plate under the load side — one aligned hole per circuit (neat row).
   */
  glandPlateZ: 0.32,
};

export const CIRCUITS: CircuitPole[] = [
  { id: 'hot-plates', label: 'PROTECTED INDUCTION', rating: 'C32', index: 0 },
  { id: 'wall-oven', label: 'PROTECTED OVEN', rating: 'C16', index: 1 },
  { id: 'heat-bank', label: 'PROTECTED HEAT BANK', rating: 'C20', index: 2 },
  { id: 'power-1', label: 'PROTECTED KITCHEN POWER', rating: 'C20', index: 3 },
  { id: 'power-2', label: 'PROTECTED POWER', rating: 'C20', index: 4 },
  { id: 'power-3', label: 'PROTECTED POWER', rating: 'C16', index: 5 },
  { id: 'power-4', label: 'PROTECTED POWER', rating: 'C16', index: 6 },
  { id: 'light-1', label: 'PROTECTED LIGHT', rating: 'C10', index: 7 },
  { id: 'light-2', label: 'PROTECTED LIGHT', rating: 'C10', index: 8 },
  { id: 'light-3', label: 'PROTECTED LIGHT', rating: 'C10', index: 9 },
  { id: 'fridge', label: 'PROTECTED FRIDGE', rating: 'C16', index: 10 },
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
  return BOARD.railZ + BOARD.moduleDepth / 2 + 0.02;
}

/** LINE (active) top cable mouth — TOP face, right side. */
export function moduleTopTerminal(x: number): Vec3 {
  const t = moduleTerminalLocal('rcbo').lineTop;
  return [x + t.x, BOARD.railY + t.y, moduleBodyZ() + t.z];
}

/** Load active bottom cable mouth — BOTTOM face, right side. */
export function moduleBottomTerminal(x: number): Vec3 {
  const t = moduleTerminalLocal('rcbo').lineBottom;
  return [x + t.x, BOARD.railY + t.y, moduleBodyZ() + t.z];
}

/** Neutral top cable mouth — TOP face, left (N). */
export function moduleNeutralTerminal(x: number): Vec3 {
  const t = moduleTerminalLocal('rcbo').neutralTop;
  return [x + t.x, BOARD.railY + t.y, moduleBodyZ() + t.z];
}

/** Neutral load bottom cable mouth — BOTTOM face, left (N). */
export function moduleBottomNeutralTerminal(x: number): Vec3 {
  const t = moduleTerminalLocal('rcbo').neutralBottom;
  return [x + t.x, BOARD.railY + t.y, moduleBodyZ() + t.z];
}

export function poleSpan(): number {
  return rcboX(CIRCUITS.length - 1) - mainSwitchX();
}

export function poleCenterX(): number {
  return (mainSwitchX() + rcboX(CIRCUITS.length - 1)) / 2;
}

/**
 * Neutral + earth bars on the BACK WALL spanning the pole row
 * (not on left/right side panels).
 */
export function barLayout() {
  const first = mainSwitchX();
  const last = rcboX(CIRCUITS.length - 1);
  const mid = (first + last) / 2;
  // Fit bars to the pole span — side-by-side on the back wall
  const neutHalf = POLE_SPAN * 0.46;
  const earthHalf = POLE_SPAN * 0.46;
  const neutCx = mid - earthHalf / 2 - 0.06;
  const earthCx = mid + neutHalf / 2 + 0.06;
  return {
    neutHalf,
    earthHalf,
    earthCx,
    neutCx,
    y: BOARD.barY,
    z: BOARD.barZ,
  };
}

/** 0 = supply in, 1 = bond/spare, 2+ = circuit tails */
export function earthBarScrew(i: number): Vec3 {
  const { earthHalf, earthCx, y, z } = barLayout();
  const total = CIRCUITS.length + 2;
  const left = earthCx - earthHalf / 2 + 0.05;
  const span = earthHalf - 0.1;
  const x = left + (i / Math.max(total - 1, 1)) * span;
  return [x, y, z];
}

export function neutralBarScrew(i: number): Vec3 {
  const { neutHalf, neutCx, y, z } = barLayout();
  const total = CIRCUITS.length + 2;
  const left = neutCx - neutHalf / 2 + 0.05;
  const span = neutHalf - 0.1;
  const x = left + (i / Math.max(total - 1, 1)) * span;
  return [x, y, z];
}

export function loomLateral(i: number, count: number, spacing = 0.036): number {
  return (i - (count - 1) / 2) * spacing;
}
