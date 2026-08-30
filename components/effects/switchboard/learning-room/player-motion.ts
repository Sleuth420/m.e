import { MathUtils } from 'three';
import { BOARD_MOUNT, PLAYER, ROOM, resolveOpenDoors, resolvePlayerPosition } from './room-layout';

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
      const next = resolvePlayerPosition(
        x + (vx / len) * PLAYER.speed * scale * dt,
        z + (vz / len) * PLAYER.speed * scale * dt
      );
      x = next.x;
      z = next.z;
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
  return MathUtils.smoothstep(2.15, 0.7, dist);
}

/**
 * Third-person follow that never steals aim.
 * Near the board the boom shortens so rockers are readable, but look stays on yaw/pitch.
 */
export function playingCameraAnchor(
  pose: PlayerPose,
  zoomT: number,
  inspectHit: { x: number; y: number; z: number } | null
): CameraAnchor {
  const pitch = MathUtils.clamp(pose.pitch, PLAYER.pitchMin, PLAYER.pitchMax);
  const closeT = boardApproach(pose.x, pose.z);
  const inspecting = zoomT > 0.2;
  const walkDist = MathUtils.lerp(2.18, 0.84, closeT);
  const dist = MathUtils.lerp(walkDist, inspecting ? 0.64 : walkDist, zoomT);
  const height = MathUtils.lerp(MathUtils.lerp(1.7, 1.5, closeT), inspecting ? 1.44 : 1.52, zoomT);

  const ahead = 1.55;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  let lookX = pose.x + Math.sin(pose.yaw) * cp * ahead;
  let lookY = height - 0.2 + sp * ahead;
  let lookZ = pose.z + Math.cos(pose.yaw) * cp * ahead;
  if (inspecting && inspectHit) {
    lookX = inspectHit.x;
    lookY = inspectHit.y;
    lookZ = inspectHit.z;
  }

  return {
    posX: MathUtils.clamp(pose.x - Math.sin(pose.yaw) * dist, 0.28, ROOM.width - 0.2),
    posY: MathUtils.clamp(height, 0.85, ROOM.height - 0.2),
    posZ: MathUtils.clamp(pose.z - Math.cos(pose.yaw) * dist, 0.28, ROOM.depth - 0.2),
    lookX,
    lookY,
    lookZ,
  };
}

/** Deterministic shock offset — avoids per-frame Math.random. */
export function shockShakeOffset(elapsed: number, amount: number): { x: number; y: number } {
  return {
    x: Math.sin(elapsed * 53.1) * amount * 0.12,
    y: Math.cos(elapsed * 41.7) * amount * 0.08,
  };
}
