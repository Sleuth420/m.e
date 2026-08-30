import { describe, expect, it, vi } from 'vitest';
import { FIXTURES, PLAYER_SPAWN } from './room-layout';
import { tryRoomInteract } from './room-interact';

describe('tryRoomInteract', () => {
  it('fires the fitting in range', () => {
    const onInteract = vi.fn();
    const requestCoverOpen = vi.fn();
    expect(
      tryRoomInteract(FIXTURES.dishwasher.x, 0.7, false, false, onInteract, requestCoverOpen)
    ).toBe(true);
    expect(onInteract).toHaveBeenCalledWith('dishwasher');
    expect(requestCoverOpen).not.toHaveBeenCalled();
  });

  it('opens the cover when standing at the board with nothing else in range', () => {
    const onInteract = vi.fn();
    const requestCoverOpen = vi.fn();
    expect(tryRoomInteract(0.5, 5.35, false, false, onInteract, requestCoverOpen)).toBe(true);
    expect(requestCoverOpen).toHaveBeenCalledOnce();
  });

  it('does nothing at spawn', () => {
    const onInteract = vi.fn();
    const requestCoverOpen = vi.fn();
    expect(
      tryRoomInteract(PLAYER_SPAWN.x, PLAYER_SPAWN.z, false, false, onInteract, requestCoverOpen)
    ).toBe(false);
    expect(onInteract).not.toHaveBeenCalled();
    expect(requestCoverOpen).not.toHaveBeenCalled();
  });
});
