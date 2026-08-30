import { MathUtils } from 'three';
import {
  BOARD_MOUNT,
  PLAYER,
  ROOM,
  atBoard,
  nearBoard,
  resolveOpenDoors,
  resolvePlayerPosition,
} from './room-layout';

export type PlayerPose = {
  x: number;
  z: number;
  yaw: number;
  moving: boolean;
};

export type MoveKeys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
};

export function mergeMoveKeys(a: MoveKeys, b: MoveKeys): MoveKeys {
  return {
    forward: a.forward || b.forward,
    back: a.back || b.back,
    left: a.left || b.left,
    right: a.right || b.right,
    turnLeft: a.turnLeft || b.turnLeft,
    turnRight: a.turnRight || b.turnRight,
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
  let moving = false;
  if (!stunned) {
    if (keys.turnLeft) yaw += PLAYER.turnSpeed * dt;
    if (keys.turnRight) yaw -= PLAYER.turnSpeed * dt;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    let vx = 0;
    let vz = 0;
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
    const len = Math.hypot(vx, vz);
    moving = len > 0;
    if (len > 0) {
      const next = resolvePlayerPosition(x + (vx / len) * PLAYER.speed * dt, z + (vz / len) * PLAYER.speed * dt);
      x = next.x;
      z = next.z;
    }
  }
  const after = resolveOpenDoors(x, z, doors);
  return { x: after.x, z: after.z, yaw, moving };
}

export type CameraAnchor = {
  posX: number;
  posY: number;
  posZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
};

export function playingCameraAnchor(
  pose: PlayerPose,
  zoomT: number,
  inspectHit: { x: number; y: number; z: number } | null
): CameraAnchor {
  const close = nearBoard(pose.x, pose.z);
  const leaning = atBoard(pose.x, pose.z);
  const inspecting = zoomT > 0.2;
  const dist = MathUtils.lerp(leaning ? 1.12 : close ? 1.35 : 2.35, leaning || inspecting ? 0.68 : 1.55, zoomT);
  const height = MathUtils.lerp(leaning ? 1.48 : close ? 1.5 : 1.72, inspecting ? 1.42 : 1.58, zoomT);

  let lookX = pose.x + Math.sin(pose.yaw) * 1.55;
  let lookY = 1.28;
  let lookZ = pose.z + Math.cos(pose.yaw) * 1.55;
  if (leaning || close) {
    lookX = BOARD_MOUNT.x + 0.12;
    lookY = BOARD_MOUNT.y - 0.04;
    lookZ = BOARD_MOUNT.z;
  } else if (inspecting && inspectHit) {
    lookX = inspectHit.x;
    lookY = inspectHit.y;
    lookZ = inspectHit.z;
  }

  let posX: number;
  let posZ: number;
  if (leaning) {
    posX = BOARD_MOUNT.x + dist;
    posZ = BOARD_MOUNT.z;
  } else {
    posX = pose.x - Math.sin(pose.yaw) * dist;
    posZ = pose.z - Math.cos(pose.yaw) * dist;
  }

  return {
    posX: MathUtils.clamp(posX, 0.28, ROOM.width - 0.2),
    posY: MathUtils.clamp(height, 0.85, ROOM.height - 0.2),
    posZ: MathUtils.clamp(posZ, 0.28, ROOM.depth - 0.2),
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
