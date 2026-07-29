import { BOARD } from '../circuit-data';

export const MODULE_GLB = {
  rcbo: '/models/switchboard/rcbo.glb?v=16',
  mainSwitch: '/models/switchboard/main-switch.glb?v=16',
} as const;

export type ModuleKind = keyof typeof MODULE_GLB;

/** Slight over-width closes rounded-corner visual gaps between poles. */
export const MODULE_TARGET = {
  rcbo: {
    width: BOARD.rcboWidth + 0.012,
    height: BOARD.moduleHeight,
    depth: BOARD.moduleDepth * 0.95,
  },
  mainSwitch: {
    width: BOARD.mainWidth + 0.012,
    height: BOARD.moduleHeight,
    depth: BOARD.moduleDepth * 0.98,
  },
} as const;

/**
 * Cable / comb mouths on the TOP and BOTTOM faces (not front screws).
 * Calibrated from generated rcbo.glb cage terminals:
 *   x ±0.04, y ±0.43 (end faces), z ≈ -0.025 (mid back body).
 * Front screw access sits separately at y±0.34, z≈0.06.
 */
export function moduleTerminalLocal(kind: ModuleKind = 'rcbo') {
  const t = MODULE_TARGET[kind];
  const xOff = t.width * 0.22;
  const yEnd = t.height / 2 - 0.001;
  const zCable = -0.025;
  return {
    lineTop: { x: xOff, y: yEnd, z: zCable },
    neutralTop: { x: -xOff, y: yEnd, z: zCable },
    lineBottom: { x: xOff, y: -yEnd, z: zCable },
    neutralBottom: { x: -xOff, y: -yEnd, z: zCable },
  } as const;
}

export const MODULE_WELLS = {
  rcbo: {
    face: { y: 0.14, zPad: 0.002, widthFactor: 0.78, heightFactor: 0.2 },
    test: { y: -0.12, zPad: 0.018 },
    rocker: { y: 0, zPad: 0.006 },
  },
  mainSwitch: {
    face: { y: 0.14, zPad: 0.002, widthFactor: 0.78, heightFactor: 0.2 },
    rocker: { y: 0, zPad: 0.006 },
  },
} as const;

export function preloadModulePaths(): string[] {
  return Object.values(MODULE_GLB);
}
