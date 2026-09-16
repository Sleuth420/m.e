import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isLookDragActive,
  markInteract,
  onInteractiveClick,
  setLookDragActive,
  wasRecentInteract,
} from './interaction';

describe('look-drag flag', () => {
  it('tracks whether a look drag is active', () => {
    setLookDragActive(true);
    expect(isLookDragActive()).toBe(true);
    setLookDragActive(false);
    expect(isLookDragActive()).toBe(false);
  });
});

describe('interact debounce', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setLookDragActive(false);
  });
  it('treats a just-fired action as recent', () => {
    vi.spyOn(performance, 'now').mockReturnValue(1_000);
    markInteract();
    expect(wasRecentInteract(280)).toBe(true);
    vi.spyOn(performance, 'now').mockReturnValue(1_400);
    expect(wasRecentInteract(280)).toBe(false);
  });

  it('runs the action once and stops propagation', () => {
    vi.spyOn(performance, 'now').mockReturnValue(10_000);
    const stop = vi.fn();
    const action = vi.fn();
    const event = { stopPropagation: stop } as unknown as Parameters<typeof onInteractiveClick>[0];
    onInteractiveClick(event, action);
    onInteractiveClick(event, action);
    expect(stop).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it.each([
    { button: 2, delta: 0, distance: 1 },
    { button: 1, delta: 0, distance: 1 },
    { button: 0, delta: 18, distance: 1 },
    { button: 0, delta: 0, distance: 4 },
  ])('does not operate fittings during zooms, drags or distant clicks: %j', (input) => {
    vi.spyOn(performance, 'now').mockReturnValue(20_000);
    const action = vi.fn();
    const event = { ...input, stopPropagation: vi.fn() } as unknown as Parameters<
      typeof onInteractiveClick
    >[0];
    onInteractiveClick(event, action);
    expect(action).not.toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('suppresses an active look drag even before a click delta is available', () => {
    vi.spyOn(performance, 'now').mockReturnValue(30_000);
    setLookDragActive(true);
    const action = vi.fn();
    onInteractiveClick(
      { button: 0, delta: 0, distance: 1, stopPropagation: vi.fn() } as unknown as Parameters<
        typeof onInteractiveClick
      >[0],
      action
    );
    expect(action).not.toHaveBeenCalled();
  });
});
