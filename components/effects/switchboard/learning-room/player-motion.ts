import { MathUtils } from 'three';
import {
  BOARD_MOUNT,
  PLAYER,
  ROOM,
  facingDot,
  resolveOpenDoors,
  resolvePlayerPosition,
} from './room-layout';

export type PlayerPose = {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  moving: boolean;
};

export type MoveKeys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  stickX?: number;
  stickY?: number;
};

const STICK_DEADZONE = 0.1;

/** Map a pointer delta to a circular analog stick in [-1, 1]. */
export function analogFromDelta(dx: number, dy: number, max: number): { x: number; y: number } {
  if (!(max > 0) || !Number.isFinite(dx) || !Number.isFinite(dy)) return { x: 0, y: 0 };
  const mag = Math.hypot(dx, dy);
  if (mag < 1e-6) return { x: 0, y: 0 };
  const scale = Math.min(1, mag / max);
  return { x: (dx / mag) * scale, y: (dy / mag) * scale };
}

export function mergeMoveKeys(a: MoveKeys, b: MoveKeys): MoveKeys {
  return {
    forward: a.forward || b.forward,
    back: a.back || b.back,
    left: a.left || b.left,
    right: a.right || b.right,
    turnLeft: a.turnLeft || b.turnLeft,
    turnRight: a.turnRight || b.turnRight,
    stickX: MathUtils.clamp((a.stickX ?? 0) + (b.stickX ?? 0), -1, 1),
    stickY: MathUtils.clamp((a.stickY ?? 0) + (b.stickY ?? 0), -1, 1),
  };
}

export function stepPlayerPose(
  pose: PlayerPose,
  keys: MoveKeys,
  dt: number,
  stunned: boolean,
  doors: { dishwasher?: boolean; fridge?: boolean }
): PlayerPose {
  let { x, z, yaw } = pose;
  const pitch = MathUtils.clamp(pose.pitch, PLAYER.pitchMin, PLAYER.pitchMax);
  let moving = false;
  if (!stunned) {
    if (keys.turnLeft) yaw += PLAYER.turnSpeed * dt;
    if (keys.turnRight) yaw -= PLAYER.turnSpeed * dt;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    let vx = 0;
    let vz = 0;
    let analogMag = 0;
    const sx = keys.stickX ?? 0;
    const sy = keys.stickY ?? 0;
    const analog = Math.hypot(sx, sy);
    if (analog > STICK_DEADZONE) {
      analogMag = Math.min(1, analog);
      const fwd = (-sy / analog) * analogMag;
      const right = (sx / analog) * analogMag;
      vx = fwd * sin - right * cos;
      vz = fwd * cos + right * sin;
    } else {
      if (keys.forward) {
        vx += sin;
        vz += cos;
      }
      if (keys.back) {
        vx -= sin;
        vz -= cos;
      }
      if (keys.left) {
        vx += cos;
        vz -= sin;
      }
      if (keys.right) {
        vx -= cos;
        vz += sin;
      }
    }
    const len = Math.hypot(vx, vz);
    moving = len > 1e-4;
    if (moving) {
      const scale = analogMag > 0 ? analogMag : 1;
      const step = (PLAYER.speed * scale * dt) / len;
      // Separate axes so a blocked heading still slides along furniture.
      const alongX = resolvePlayerPosition(x + vx * step, z);
      const alongZ = resolvePlayerPosition(alongX.x, z + vz * step);
      x = alongZ.x;
      z = alongZ.z;
    }
  }
  const after = resolveOpenDoors(x, z, doors);
  return { x: after.x, z: after.z, yaw, pitch, moving };
}

export type CameraAnchor = {
  posX: number;
  posY: number;
  posZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
};

/** 0 far from the board, 1 standing in front of it. */
export function boardApproach(x: number, z: number): number {
  const dist = Math.hypot(x - (BOARD_MOUNT.x + 0.45), z - BOARD_MOUNT.z);
  return 1 - MathUtils.smoothstep(dist, 0.7, 2.15);
}

/**
 * Third-person follow that never steals aim.
 * Boom only shortens when you are close AND looking at the board.
 */
export function playingCameraAnchor(pose: PlayerPose, zoomT: number): CameraAnchor {
  const pitch = MathUtils.clamp(pose.pitch, PLAYER.pitchMin, PLAYER.pitchMax);
  const approach = boardApproach(pose.x, pose.z);
  const facingBoard = facingDot(pose.x, pose.z, pose.yaw, BOARD_MOUNT.x + 0.45, BOARD_MOUNT.z);
  const closeT = approach * MathUtils.smoothstep(facingBoard, 0.12, 0.7);
  const walkDist = MathUtils.lerp(2.12, 0.9, closeT);
  const dist = MathUtils.lerp(walkDist, 0.72, zoomT);
  const height = MathUtils.lerp(MathUtils.lerp(1.68, 1.5, closeT), 1.46, zoomT);

  const ahead = 1.55;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  return {
    posX: MathUtils.clamp(pose.x - Math.sin(pose.yaw) * dist, 0.28, ROOM.width - 0.2),
    posY: MathUtils.clamp(height, 0.85, ROOM.height - 0.2),
    posZ: MathUtils.clamp(pose.z - Math.cos(pose.yaw) * dist, 0.28, ROOM.depth - 0.2),
    lookX: pose.x + Math.sin(pose.yaw) * cp * ahead,
    lookY: height - 0.2 + sp * ahead,
    lookZ: pose.z + Math.cos(pose.yaw) * cp * ahead,
  };
}

/** Deterministic shock offset — avoids per-frame Math.random. */
export function shockShakeOffset(elapsed: number, amount: number): { x: number; y: number } {
  return {
    x: Math.sin(elapsed * 53.1) * amount * 0.12,
    y: Math.cos(elapsed * 41.7) * amount * 0.08,
  };
}
