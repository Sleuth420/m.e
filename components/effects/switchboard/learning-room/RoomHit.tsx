'use client';

import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';

type Props = {
  onToggle: () => void;
  size: [number, number, number];
  position?: [number, number, number];
  enabled?: boolean;
};

/** Invisible tap/click volume in front of a fitting. Models themselves do not pick. */
export function RoomHit({ onToggle, size, position = [0, 0, 0], enabled = true }: Props) {
  if (!enabled) return null;
  const fire = (e: Parameters<typeof onInteractiveClick>[0]) => onInteractiveClick(e, onToggle);

  return (
    <mesh
      position={position}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onPointerUp={fire}
      onClick={fire}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
