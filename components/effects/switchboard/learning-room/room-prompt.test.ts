import { describe, expect, it } from 'vitest';
import { KITCHEN_INTERACTS } from './room-layout';
import { INITIAL_ROOM_PLAY } from './room-play';
import { formatInteractVerb, loungeDimmerPrompt, roomActionPrompt } from './room-prompt';

const fridge = KITCHEN_INTERACTS.find((h) => h.id === 'fridge')!;
const toaster = KITCHEN_INTERACTS.find((h) => h.id === 'toaster')!;

const live = {
  powerLive: true,
  hobLive: true,
  loungePowerLive: true,
  loungeLightLive: true,
  coverOpen: false,
  coarse: false,
};

describe('formatInteractVerb', () => {
  it('rewrites F prompts on coarse pointers', () => {
    expect(formatInteractVerb('F · Open fridge', true)).toBe('Tap · Open fridge');
    expect(formatInteractVerb('F · Open fridge', false)).toBe('F · Open fridge');
  });
});

describe('loungeDimmerPrompt', () => {
  it('explains a dead lounge lighting circuit', () => {
    expect(loungeDimmerPrompt(false, 1)).toBe('Lounge lighting is off');
  });

  it('steps through dimmer copy', () => {
    expect(loungeDimmerPrompt(true, 0)).toBe('F · Dim lounge lights');
    expect(loungeDimmerPrompt(true, 0.35)).toBe('F · Dim 70%');
    expect(loungeDimmerPrompt(true, 0.7)).toBe('F · Dim 100%');
    expect(loungeDimmerPrompt(true, 1)).toBe('F · Lounge lights off');
  });
});

describe('roomActionPrompt', () => {
  it('asks the player to walk when nothing is in range', () => {
    expect(roomActionPrompt(null, false, INITIAL_ROOM_PLAY, live)).toBe(
      'Walk to the board, kitchen, or lounge'
    );
  });

  it('uses fridge open/close copy', () => {
    expect(roomActionPrompt(fridge, false, INITIAL_ROOM_PLAY, live)).toBe('F · Open fridge');
    expect(roomActionPrompt(fridge, false, { ...INITIAL_ROOM_PLAY, fridgeOpen: true }, live)).toBe(
      'F · Close fridge'
    );
  });

  it('blocks the toaster when kitchen power is off', () => {
    expect(
      roomActionPrompt(toaster, false, INITIAL_ROOM_PLAY, { ...live, powerLive: false })
    ).toBe('Kitchen power is off');
  });

  it('uses tap wording on mobile at the board', () => {
    expect(roomActionPrompt(null, true, INITIAL_ROOM_PLAY, { ...live, coarse: true })).toBe(
      'Tap the cover · licensed only'
    );
  });
});
