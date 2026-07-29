import type { ThreeEvent } from '@react-three/fiber';

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
  e.stopPropagation();
  action();
}
