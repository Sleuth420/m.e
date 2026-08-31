import { describe, expect, it, vi } from 'vitest';
import { isLookDragActive, markInteract, onInteractiveClick, setLookDragActive, wasRecentInteract } from './interaction';

describe('look-drag flag', () => {
  it('tracks whether a look drag is active', () => {
    setLookDragActive(true);
    expect(isLookDragActive()).toBe(true);
    setLookDragActive(false);
    expect(isLookDragActive()).toBe(false);
  });
});

describe('interact debounce', () => {
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
});
