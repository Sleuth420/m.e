import { describe, expect, it } from 'vitest';
import { BOARD_MOUNT, PLAYER_SPAWN } from './room-layout';
import { playingCameraAnchor, shockShakeOffset, stepPlayerPose, type PlayerPose } from './player-motion';

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
});

describe('playingCameraAnchor', () => {
  it('sits behind the player looking along yaw', () => {
    const pose = spawn();
    const cam = playingCameraAnchor(pose, 0, null);
    expect(cam.posZ).toBeGreaterThan(pose.z);
    expect(cam.lookZ).toBeLessThan(pose.z);
  });

  it('does not lock look or boom to the board when standing in front of it', () => {
    const pose: PlayerPose = { x: 0.7, z: 5.35, yaw: 0, pitch: 0, moving: false };
    const cam = playingCameraAnchor(pose, 0, null);
    expect(cam.lookZ).toBeGreaterThan(pose.z);
    expect(cam.lookX).toBeCloseTo(pose.x, 1);
    expect(cam.posZ).toBeLessThan(pose.z);
    expect(Math.abs(cam.lookX - (BOARD_MOUNT.x + 0.12))).toBeGreaterThan(0.2);
    expect(Math.abs(cam.posZ - BOARD_MOUNT.z)).toBeGreaterThan(0.15);
  });

  it('aims lower when the player pitches down', () => {
    const level = playingCameraAnchor(spawn(), 0, null);
    const down = playingCameraAnchor({ ...spawn(), pitch: -0.45 }, 0, null);
    expect(down.lookY).toBeLessThan(level.lookY);
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
