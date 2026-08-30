import type { ThreeEvent } from '@react-three/fiber';

/** Look-drag on mobile: ignore the click that fires when the finger lifts. */
let lookDragActive = false;

export function setLookDragActive(active: boolean) {
  lookDragActive = active;
}

/** Stop propagation and set pointer cursor — shared by all interactive board parts. */
export function onInteractiveEnter(
  e: ThreeEvent<PointerEvent>,
  onHover?: () => void
): void {
  e.stopPropagation();
  document.body.style.cursor = 'pointer';
  onHover?.();
}

export function onInteractiveLeave(onHoverEnd?: () => void): void {
  document.body.style.cursor = 'auto';
  onHoverEnd?.();
}

export function onInteractiveClick(
  e: ThreeEvent<MouseEvent>,
  action: () => void
): void {
  if (lookDragActive) {
    e.stopPropagation();
    return;
  }
  e.stopPropagation();
  action();
}
