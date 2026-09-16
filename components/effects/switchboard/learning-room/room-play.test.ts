import { describe, expect, it } from 'vitest';
import { INITIAL_ROOM_PLAY, nextDimmer, roomPlayReducer } from './room-play';

const live = { powerLive: true, hobLive: true, loungePowerLive: true };

describe('INITIAL_ROOM_PLAY', () => {
  it('starts with the lights on', () => {
    expect(INITIAL_ROOM_PLAY.lightSwitchOn).toBe(true);
  });
});

describe('nextDimmer', () => {
  it('cycles 0 → 35 → 70 → 100 → off', () => {
    expect(nextDimmer(0)).toBe(0.35);
    expect(nextDimmer(0.35)).toBe(0.7);
    expect(nextDimmer(0.7)).toBe(1);
    expect(nextDimmer(1)).toBe(0);
  });
});

describe('roomPlayReducer', () => {
  it('socket isolation stops the appliance without changing its circuit or restarting the load', () => {
    const running = { ...INITIAL_ROOM_PLAY, toasterPop: true, tvOn: true };
    const kitchenOff = roomPlayReducer(running, { type: 'interact', id: 'gpoDouble', live });
    expect(kitchenOff.toasterPop).toBe(false);
    expect(kitchenOff.tvOn).toBe(true);
    expect(roomPlayReducer(kitchenOff, { type: 'interact', id: 'toaster', live })).toBe(kitchenOff);
    const kitchenOn = roomPlayReducer(kitchenOff, { type: 'interact', id: 'gpoDouble', live });
    expect(kitchenOn.kitchenSocketOn).toBe(true);
    expect(kitchenOn.toasterPop).toBe(false);
    const loungeOff = roomPlayReducer(running, { type: 'interact', id: 'tvGpo', live });
    expect(loungeOff.tvOn).toBe(false);
    expect(loungeOff.toasterPop).toBe(true);
    expect(roomPlayReducer(loungeOff, { type: 'interact', id: 'tv', live })).toBe(loungeOff);
  });

  it('mechanical socket switches can be operated without supply', () => {
    const dead = { powerLive: false, hobLive: false, loungePowerLive: false };
    expect(
      roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'gpoDouble', live: dead })
        .kitchenSocketOn
    ).toBe(false);
    expect(
      roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'tvGpo', live: dead })
        .loungeSocketOn
    ).toBe(false);
  });
  it('toggles the fridge and cupboard independently', () => {
    const fridge = roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'fridge', live });
    expect(fridge.fridgeOpen).toBe(true);
    const cupboard = roomPlayReducer(fridge, { type: 'interact', id: 'cabL-base', live });
    expect(cupboard.fridgeOpen).toBe(true);
    expect(cupboard.openById['cabL-base']).toBe(true);
  });

  it('ignores toaster and TV when their circuits are dead', () => {
    const dead = { powerLive: false, hobLive: false, loungePowerLive: false };
    expect(
      roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'toaster', live: dead })
    ).toBe(INITIAL_ROOM_PLAY);
    expect(roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'tv', live: dead })).toBe(
      INITIAL_ROOM_PLAY
    );
    expect(
      roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'cooktop', live: dead })
    ).toBe(INITIAL_ROOM_PLAY);
  });

  it('pops the toaster when kitchen power is live', () => {
    const next = roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'interact', id: 'toaster', live });
    expect(next.toasterPop).toBe(true);
  });

  it('clears loads when circuits cut', () => {
    const on = {
      ...INITIAL_ROOM_PLAY,
      toasterPop: true,
      boiling: true,
      tvOn: true,
    };
    expect(roomPlayReducer(on, { type: 'power-cut' }).toasterPop).toBe(false);
    expect(roomPlayReducer(on, { type: 'hob-cut' }).boiling).toBe(false);
    expect(roomPlayReducer(on, { type: 'lounge-power-cut' }).tvOn).toBe(false);
  });

  it('returns the same state when a cut action is a no-op', () => {
    expect(roomPlayReducer(INITIAL_ROOM_PLAY, { type: 'power-cut' })).toBe(INITIAL_ROOM_PLAY);
  });
});
