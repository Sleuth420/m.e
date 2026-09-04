import { describe, expect, it } from 'vitest';
import { BOARD_MOUNT, PLAYER_SPAWN } from './room-layout';
import {
  analogFromDelta,
  boardInspectCameraAnchor,
  boardInspectDistance,
  moveIntent,
  playingCameraAnchor,
  shockShakeOffset,
  stepPlayerPose,
  stepPlayerPoseBudget,
  type PlayerPose,
} from './player-motion';

const still = {
  forward: false,
  back: false,
  left: false,
  right: false,
  turnLeft: false,
  turnRight: false,
  stickX: 0,
  stickY: 0,
};

function spawn(): PlayerPose {
  return { x: PLAYER_SPAWN.x, z: PLAYER_SPAWN.z, yaw: PLAYER_SPAWN.yaw, pitch: 0, moving: false };
}

describe('stepPlayerPose', () => {
  it('walks toward the kitchen on forward (yaw π)', () => {
    const next = stepPlayerPose(spawn(), { ...still, forward: true }, 0.25, false, {});
    expect(next.moving).toBe(true);
    expect(next.z).toBeLessThan(PLAYER_SPAWN.z);
    expect(next.x).toBeCloseTo(PLAYER_SPAWN.x, 4);
  });

  it('does not move while stunned', () => {
    const next = stepPlayerPose(spawn(), { ...still, forward: true }, 0.25, true, {});
    expect(next.moving).toBe(false);
    expect(next.z).toBe(PLAYER_SPAWN.z);
  });

  it('turns in place without translating', () => {
    const next = stepPlayerPose(spawn(), { ...still, turnLeft: true }, 0.5, false, {});
    expect(next.yaw).toBeGreaterThan(PLAYER_SPAWN.yaw);
    expect(next.x).toBe(PLAYER_SPAWN.x);
    expect(next.z).toBe(PLAYER_SPAWN.z);
  });

  it('scales walk speed from analog stick magnitude', () => {
    const full = stepPlayerPose(spawn(), { ...still, stickY: -1 }, 0.25, false, {});
    const half = stepPlayerPose(spawn(), { ...still, stickY: -0.4 }, 0.25, false, {});
    expect(full.z).toBeLessThan(PLAYER_SPAWN.z);
    expect(half.z).toBeLessThan(PLAYER_SPAWN.z);
    expect(half.z).toBeGreaterThan(full.z);
  });

  it('walks diagonally on analog without exceeding full speed', () => {
    const forward = stepPlayerPose(spawn(), { ...still, stickY: -1 }, 0.25, false, {});
    const diag = stepPlayerPose(spawn(), { ...still, stickX: 0.8, stickY: -0.8 }, 0.25, false, {});
    const fwdDist = Math.hypot(forward.x - PLAYER_SPAWN.x, forward.z - PLAYER_SPAWN.z);
    const diagDist = Math.hypot(diag.x - PLAYER_SPAWN.x, diag.z - PLAYER_SPAWN.z);
    expect(diagDist).toBeLessThanOrEqual(fwdDist + 1e-6);
    expect(diag.x).not.toBeCloseTo(PLAYER_SPAWN.x, 2);
  });

  it('slides along the kitchen bench instead of sticking', () => {
    const start: PlayerPose = { x: 2.2, z: 0.9, yaw: Math.PI, pitch: 0, moving: false };
    const next = stepPlayerPose(start, { ...still, forward: true, right: true }, 0.35, false, {});
    expect(next.x).toBeGreaterThan(start.x);
    expect(next.z).toBeGreaterThanOrEqual(0.65);
  });

  it('substeps long frames so wall-clock speed matches two shorter frames', () => {
    const two = stepPlayerPoseBudget(
      stepPlayerPoseBudget(spawn(), { ...still, forward: true }, 0.08, false, {}),
      { ...still, forward: true },
      0.08,
      false,
      {}
    );
    const once = stepPlayerPoseBudget(spawn(), { ...still, forward: true }, 0.16, false, {});
    expect(once.x).toBeCloseTo(two.x, 6);
    expect(once.z).toBeCloseTo(two.z, 6);
    const capped = stepPlayerPose(spawn(), { ...still, forward: true }, 0.05, false, {});
    const onceDist = Math.hypot(once.x - PLAYER_SPAWN.x, once.z - PLAYER_SPAWN.z);
    const cappedDist = Math.hypot(capped.x - PLAYER_SPAWN.x, capped.z - PLAYER_SPAWN.z);
    expect(onceDist).toBeGreaterThan(cappedDist + 0.15);
  });
});

describe('playingCameraAnchor', () => {
  it('sits behind the player looking along yaw', () => {
    const pose = spawn();
    const cam = playingCameraAnchor(pose, 0);
    expect(cam.posZ).toBeGreaterThan(pose.z);
    expect(cam.lookZ).toBeLessThan(pose.z);
  });

  it('does not lock look or boom to the board when standing in front of it', () => {
    const pose: PlayerPose = { x: 0.7, z: 5.35, yaw: 0, pitch: 0, moving: false };
    const cam = playingCameraAnchor(pose, 0);
    expect(cam.lookZ).toBeGreaterThan(pose.z);
    expect(cam.lookX).toBeCloseTo(pose.x, 1);
    expect(cam.posZ).toBeLessThan(pose.z);
    expect(Math.abs(cam.lookX - (BOARD_MOUNT.x + 0.12))).toBeGreaterThan(0.2);
    expect(Math.abs(cam.posZ - BOARD_MOUNT.z)).toBeGreaterThan(0.15);
  });

  it('keeps a long boom when at the board but looking away', () => {
    const pose: PlayerPose = { x: 0.7, z: 5.35, yaw: 0, pitch: 0, moving: false };
    const cam = playingCameraAnchor(pose, 0);
    expect(pose.z - cam.posZ).toBeGreaterThan(1.6);
  });

  it('shortens the boom only when looking at the board', () => {
    const away: PlayerPose = { x: 0.7, z: 5.35, yaw: 0, pitch: 0, moving: false };
    const at: PlayerPose = { x: 0.7, z: 5.35, yaw: -Math.PI / 2, pitch: 0, moving: false };
    const camAway = playingCameraAnchor(away, 0);
    const camAt = playingCameraAnchor(at, 0);
    const boomAway = Math.hypot(camAway.posX - away.x, camAway.posZ - away.z);
    const boomAt = Math.hypot(camAt.posX - at.x, camAt.posZ - at.z);
    expect(boomAt).toBeLessThan(boomAway - 0.4);
  });

  it('aims lower when the player pitches down', () => {
    const level = playingCameraAnchor(spawn(), 0);
    const down = playingCameraAnchor({ ...spawn(), pitch: -0.45 }, 0);
    expect(down.lookY).toBeLessThan(level.lookY);
  });

  it('keeps the boom out of the board enclosure when the player faces into the room', () => {
    const pose: PlayerPose = { x: 0.7, z: 5.35, yaw: Math.PI / 2, pitch: 0, moving: false };
    const cam = playingCameraAnchor(pose, 0);
    expect(cam.posX).toBeGreaterThan(0.42);
    expect(Math.abs(cam.posX - 0.28)).toBeGreaterThan(0.12);
  });
});

describe('boardInspectCameraAnchor', () => {
  it('frames the enclosure from the room, looking at the board face', () => {
    const cam = boardInspectCameraAnchor(16 / 9);
    expect(cam.posX).toBeCloseTo(BOARD_MOUNT.x + boardInspectDistance(16 / 9), 5);
    expect(cam.posZ).toBeCloseTo(BOARD_MOUNT.z, 5);
    expect(cam.lookX).toBeLessThan(cam.posX);
    expect(Math.abs(cam.lookZ - BOARD_MOUNT.z)).toBeLessThan(0.02);
    expect(Math.abs(cam.lookY - BOARD_MOUNT.y)).toBeLessThan(0.12);
  });

  it('stands farther back in portrait so the pole row still fits', () => {
    expect(boardInspectDistance(9 / 16)).toBeGreaterThan(boardInspectDistance(16 / 9) + 0.2);
  });
});

describe('moveIntent', () => {
  it('is false while idle and true on stick throw', () => {
    expect(moveIntent(still)).toBe(false);
    expect(moveIntent({ ...still, stickY: -0.4 })).toBe(true);
    expect(moveIntent({ ...still, forward: true })).toBe(true);
  });
});

describe('analogFromDelta', () => {
  it('clamps to a circle so diagonals stay at full throw', () => {
    const corner = analogFromDelta(56, 56, 56);
    expect(Math.hypot(corner.x, corner.y)).toBeCloseTo(1, 6);
    expect(corner.x).toBeCloseTo(Math.SQRT1_2, 5);
    expect(corner.y).toBeCloseTo(Math.SQRT1_2, 5);
  });

  it('scales inside the throw radius', () => {
    const half = analogFromDelta(0, -28, 56);
    expect(half.x).toBeCloseTo(0, 6);
    expect(half.y).toBeCloseTo(-0.5, 6);
  });
});

describe('shockShakeOffset', () => {
  it('is deterministic', () => {
    expect(shockShakeOffset(1.25, 0.4)).toEqual(shockShakeOffset(1.25, 0.4));
    const rest = shockShakeOffset(1.25, 0);
    expect(rest.x).toBeCloseTo(0);
    expect(rest.y).toBeCloseTo(0);
  });
});
