import { describe, expect, it } from 'vitest';
import { PLAYER_SPAWN } from './room-layout';
import { playingCameraAnchor, shockShakeOffset, stepPlayerPose, type PlayerPose } from './player-motion';

const still = {
  forward: false,
  back: false,
  left: false,
  right: false,
  turnLeft: false,
  turnRight: false,
};

function spawn(): PlayerPose {
  return { x: PLAYER_SPAWN.x, z: PLAYER_SPAWN.z, yaw: PLAYER_SPAWN.yaw, moving: false };
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
});

describe('playingCameraAnchor', () => {
  it('sits behind the player looking along yaw', () => {
    const pose = spawn();
    const cam = playingCameraAnchor(pose, 0, null);
    expect(cam.posZ).toBeGreaterThan(pose.z);
    expect(cam.lookZ).toBeLessThan(pose.z);
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
