import { BOARD, CIRCUITS } from '../circuit-data';
import { circuitExitGland } from '../wiring/wire-paths';
import type { Vec3 } from '../circuit-data';

/** Corner at origin. Board wall = x=0 (faces +X). Kitchen wall = z=0 (faces +Z). */
export const ROOM = {
  width: 8.4,
  depth: 7.0,
  height: 2.7,
  studSpacing: 0.45,
  studSize: 0.09,
  plate: 0.09,
  /** 1.14 is the switch / splash-GPO noggin so fittings clip to timber. */
  nogginYs: [0.9, 1.14, 1.8] as const,
} as const;

export const ROOM_LOADS = {
  lighting: 'light-1',
  power: 'power-1',
  fridge: 'fridge',
  oven: 'wall-oven',
  induction: 'hot-plates',
} as const;

const BOARD_SCALE = 0.155;

export const BOARD_MOUNT = {
  scale: BOARD_SCALE,
  rotY: Math.PI / 2,
  x: 0.04 + (BOARD.depth / 2) * BOARD_SCALE,
  y: 1.22 + (BOARD.height / 2) * BOARD_SCALE,
  z: 5.35,
} as const;

const BOARD_WORLD_W = BOARD.width * BOARD_MOUNT.scale;
const BOARD_WORLD_H = BOARD.height * BOARD_MOUNT.scale;
/** Framed opening in the board wall — trimmers sit just outside this. */
export const BOARD_OPENING = {
  z0: BOARD_MOUNT.z - BOARD_WORLD_W / 2 - 0.14,
  z1: BOARD_MOUNT.z + BOARD_WORLD_W / 2 + 0.14,
  y0: BOARD_MOUNT.y - BOARD_WORLD_H / 2 - 0.1,
  y1: BOARD_MOUNT.y + BOARD_WORLD_H / 2 + 0.1,
} as const;

/** Greyscale carcass sizes. Appliances are fitted to these bays. */
export const KITCHEN = {
  startX: 0.28,
  benchH: 0.9,
  benchDepth: 0.6,
  kickH: 0.12,
  splashGpoY: 1.12,
  upperY: 1.46,
  upperH: 0.68,
  upperDepth: 0.33,
  endX: 5.68,
} as const;

export const HEIGHTS = {
  gpo: 0.34,
  splashGpoY: KITCHEN.splashGpoY,
  /** Fridge TPS sits above kitchen power so the two runs don't share a line. */
  fridgeY: 1.34,
  /** Induction TPS sits a stud above kitchen power so the two runs don't occupy the same line. */
  inductionY: 1.22,
  ovenY: 0.46,
  switch: 1.16,
  light: 2.18,
  portrait: 1.58,
  topPlate: ROOM.height - ROOM.plate / 2,
  cavityX: -ROOM.studSize / 2,
  cavityZ: -ROOM.studSize / 2,
} as const;

export const IDLE_CAMERA = {
  position: [6.15, 1.62, 4.35] as Vec3,
  target: [2.55, 0.92, 0.42] as Vec3,
};

/**
 * Kitchen elevation along +X.
 * One 900 mm two-door cabinet each side of the dishwasher — not four 450 mm splits.
 * Isolator sits mid-cupboard, ~350 mm past the hob edge — not jammed against
 * the cooktop. Splash GPOs sit on opposite sides of the dishwasher.
 */
export const KITCHEN_BAYS = {
  sink: { x: 0.28, w: 0.8 },
  cabA: { x: 1.08, w: 0.45 },
  cook: { x: 1.53, w: 0.6 },
  cabL: { x: 2.13, w: 0.9 },
  dw: { x: 3.03, w: 0.6 },
  cabR: { x: 3.63, w: 0.9 },
  fridge: { x: 4.53, w: 1.15 },
} as const;

export const FIXTURES = {
  lightSwitch: { x: 0.006, y: HEIGHTS.switch, z: 0.52 },
  wallLight1: { x: 0.022, y: HEIGHTS.light, z: 3.25 },
  wallLight2: { x: 0.022, y: HEIGHTS.light, z: 3.95 },
  portrait1: { x: 0.07, y: HEIGHTS.portrait, z: 3.25 },
  portrait2: { x: 0.07, y: HEIGHTS.portrait, z: 3.95 },
  sink: { x: 0.68, y: KITCHEN.benchH, z: 0.32 },
  cooktop: { x: 1.83, y: KITCHEN.benchH, z: 0.3 },
  oven: { x: 1.83, y: 0, z: 0.3 },
  rangehood: { x: 1.83, y: KITCHEN.upperY, z: 0.2 },
  cookIsolator: { x: 2.48, y: KITCHEN.splashGpoY, z: 0.02 },
  dishwasher: { x: 3.33, y: 0, z: 0.3 },
  dwGpo: { x: 3.33, y: HEIGHTS.gpo, z: 0.02 },
  toaster: { x: 4.08, y: KITCHEN.benchH, z: 0.34 },
  gpoDouble: { x: 2.88, y: KITCHEN.splashGpoY, z: 0.02 },
  gpoSingle: { x: 4.48, y: KITCHEN.splashGpoY, z: 0.02 },
  fridge: { x: 5.1, y: 0, z: 0.38 },
  fridgeGpo: { x: 4.95, y: KITCHEN.splashGpoY, z: 0.02 },
} as const;

export type KitchenInteractId =
  | 'switch'
  | 'toaster'
  | 'gpoDouble'
  | 'fridge'
  | 'oven'
  | 'dishwasher'
  | 'cookIsolator'
  | 'cooktop'
  | 'sink'
  | 'sink-base'
  | 'cabA-base'
  | 'cabL-base'
  | 'cabR-base'
  | 'sink-upper'
  | 'cabA-upper'
  | 'cabL-upper'
  | 'dw-upper'
  | 'cabR-upper';

export const KITCHEN_INTERACTS: {
  id: KitchenInteractId;
  x: number;
  y: number;
  z: number;
  r: number;
  priority: number;
  promptOpen: string;
  promptClose: string;
}[] = [
  { id: 'switch', x: FIXTURES.lightSwitch.x, y: FIXTURES.lightSwitch.y, z: FIXTURES.lightSwitch.z, r: 1.2, priority: 2, promptOpen: 'F · Light switch', promptClose: 'F · Light switch' },
  { id: 'sink', x: FIXTURES.sink.x, y: FIXTURES.sink.y + 0.2, z: 0.55, r: 0.95, priority: 2, promptOpen: 'F · Run the tap', promptClose: 'F · Stop tap' },
  { id: 'gpoDouble', x: FIXTURES.gpoDouble.x, y: FIXTURES.gpoDouble.y, z: 0.55, r: 0.9, priority: 2, promptOpen: 'F · Plug / toast', promptClose: 'F · Pop toaster' },
  { id: 'toaster', x: FIXTURES.toaster.x, y: FIXTURES.toaster.y, z: FIXTURES.toaster.z, r: 0.9, priority: 2, promptOpen: 'F · Toast', promptClose: 'F · Pop toaster' },
  { id: 'cookIsolator', x: FIXTURES.cookIsolator.x, y: FIXTURES.cookIsolator.y, z: 0.55, r: 1.0, priority: 2, promptOpen: 'F · Cooktop isolator', promptClose: 'F · Cooktop isolator' },
  { id: 'cooktop', x: FIXTURES.cooktop.x, y: FIXTURES.cooktop.y, z: 0.55, r: 0.75, priority: 2, promptOpen: 'F · Boil the pot', promptClose: 'F · Take pot off' },
  { id: 'oven', x: FIXTURES.oven.x, y: 0.48, z: 0.58, r: 0.85, priority: 2, promptOpen: 'F · Open oven', promptClose: 'F · Close oven' },
  { id: 'dishwasher', x: FIXTURES.dishwasher.x, y: 0.42, z: 0.58, r: 0.75, priority: 2, promptOpen: 'F · Open dishwasher', promptClose: 'F · Close dishwasher' },
  { id: 'fridge', x: FIXTURES.fridge.x, y: 0.95, z: FIXTURES.fridge.z, r: 1.3, priority: 1, promptOpen: 'F · Open fridge', promptClose: 'F · Close fridge' },
  { id: 'sink-base', x: 0.68, y: 0.48, z: 0.58, r: 0.85, priority: 0, promptOpen: 'F · Open cupboard', promptClose: 'F · Close cupboard' },
  { id: 'cabA-base', x: 1.3, y: 0.48, z: 0.58, r: 0.55, priority: 1, promptOpen: 'F · Open drawers', promptClose: 'F · Close drawers' },
  { id: 'cabL-base', x: 2.58, y: 0.48, z: 0.58, r: 1.05, priority: 0, promptOpen: 'F · Open cupboard', promptClose: 'F · Close cupboard' },
  { id: 'cabR-base', x: 4.08, y: 0.48, z: 0.58, r: 1.05, priority: 0, promptOpen: 'F · Open cupboard', promptClose: 'F · Close cupboard' },
  { id: 'sink-upper', x: 0.68, y: 1.78, z: 0.4, r: 0.85, priority: 0, promptOpen: 'F · Open overhead', promptClose: 'F · Close overhead' },
  { id: 'cabA-upper', x: 1.3, y: 1.78, z: 0.4, r: 0.8, priority: 0, promptOpen: 'F · Open overhead', promptClose: 'F · Close overhead' },
  { id: 'cabL-upper', x: 2.58, y: 1.78, z: 0.4, r: 1.05, priority: 0, promptOpen: 'F · Open overhead', promptClose: 'F · Close overhead' },
  { id: 'dw-upper', x: 3.33, y: 1.78, z: 0.4, r: 0.75, priority: 0, promptOpen: 'F · Open overhead', promptClose: 'F · Close overhead' },
  { id: 'cabR-upper', x: 4.08, y: 1.78, z: 0.4, r: 1.05, priority: 0, promptOpen: 'F · Open overhead', promptClose: 'F · Close overhead' },
];

export function nearestKitchenInteract(
  px: number,
  pz: number,
  except: KitchenInteractId[] = [],
  preferHigh = false
): (typeof KITCHEN_INTERACTS)[number] | null {
  const inRange: (typeof KITCHEN_INTERACTS)[number][] = [];
  let best: (typeof KITCHEN_INTERACTS)[number] | null = null;
  let bestD = Infinity;
  for (const item of KITCHEN_INTERACTS) {
    if (except.includes(item.id)) continue;
    const d = dist2(px, pz, item.x, item.z);
    if (d < item.r * item.r) {
      inRange.push(item);
      if (d < bestD) {
        best = item;
        bestD = d;
      }
    }
  }
  if (inRange.length === 0) return best;
  if (preferHigh) {
    return inRange.reduce((a, b) => (b.y > a.y ? b : a));
  }
  // Stand in a bay → use that bay. Priority only breaks near-ties.
  return inRange.reduce((a, b) => {
    const dax = Math.abs(px - a.x);
    const dbx = Math.abs(px - b.x);
    if (Math.abs(dax - dbx) > 0.12) return dax < dbx ? a : b;
    const da = dist2(px, pz, a.x, a.z);
    const db = dist2(px, pz, b.x, b.z);
    if (Math.abs(da - db) > 0.05) return da < db ? a : b;
    return a.priority >= b.priority ? a : b;
  });
}

export const PLAYER_SPAWN = {
  x: 3.4,
  y: 0,
  z: 2.6,
  /** Face the kitchen wall (z=0). */
  yaw: Math.PI,
} as const;

export const PLAYER = {
  radius: 0.24,
  height: 1.62,
  speed: 2.4,
  turnSpeed: 2.2,
} as const;

export function boardWallStudZs(): number[] {
  const zs: number[] = [];
  for (let z = 0; z <= ROOM.depth + 0.001; z += ROOM.studSpacing) zs.push(Number(z.toFixed(3)));
  return zs;
}

export function fridgeWallStudXs(): number[] {
  const xs: number[] = [];
  for (let x = 0; x <= ROOM.width + 0.001; x += ROOM.studSpacing) xs.push(Number(x.toFixed(3)));
  return xs;
}

export function circuitIndex(id: string): number {
  const found = CIRCUITS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown circuit ${id}`);
  return found.index;
}

/** Board local → world, including wall-mount Ry(90). */
export function boardLocalToWorld(local: Vec3): Vec3 {
  const s = BOARD_MOUNT.scale;
  const lx = local[0] * s;
  const ly = local[1] * s;
  const lz = local[2] * s;
  return [BOARD_MOUNT.x + lz, BOARD_MOUNT.y + ly, BOARD_MOUNT.z - lx];
}

export function worldGland(circuitId: string): Vec3 {
  return boardLocalToWorld(circuitExitGland(circuitIndex(circuitId)));
}

export function dist2(ax: number, az: number, bx: number, bz: number): number {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
}

export function resolvePlayerPosition(x: number, z: number): { x: number; z: number } {
  const pad = PLAYER.radius;
  let nx = Math.min(ROOM.width - pad - 0.1, Math.max(pad + 0.22, x));
  let nz = Math.min(ROOM.depth - pad - 0.1, Math.max(pad + 0.22, z));

  const boardHalfW = (BOARD.width / 2) * BOARD_MOUNT.scale + pad;
  const boardFront = BOARD_MOUNT.x + (BOARD.depth / 2) * BOARD_MOUNT.scale + pad * 0.25;
  if (Math.abs(nz - BOARD_MOUNT.z) < boardHalfW && nx < boardFront) {
    nx = boardFront;
  }

  const benchFront = KITCHEN.benchDepth + pad * 0.35;
  if (nx > KITCHEN.startX - pad && nx < KITCHEN.endX + pad && nz < benchFront) {
    nz = benchFront;
  }

  const fridge = FIXTURES.fridge;
  const fw = 0.48 + pad;
  const fd = 0.4 + pad;
  if (Math.abs(nx - fridge.x) < fw && nz < fridge.z + fd) {
    nz = fridge.z + fd;
  }

  return { x: nx, z: nz };
}

export function nearPoint(px: number, pz: number, x: number, z: number, radius = 1.4): boolean {
  return dist2(px, pz, x, z) < radius * radius;
}

export function nearBoard(px: number, pz: number): boolean {
  return nearPoint(px, pz, BOARD_MOUNT.x + 0.45, BOARD_MOUNT.z, 1.7);
}
