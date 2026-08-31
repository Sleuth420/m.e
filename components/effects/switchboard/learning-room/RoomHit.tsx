'use client';

import { useState } from 'react';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { useGameInput } from './GameInputContext';
import type { RoomInteractId } from './room-layout';

type Props = {
  onToggle: () => void;
  size: [number, number, number];
  position?: [number, number, number];
  enabled?: boolean;
  hitId?: RoomInteractId;
};

/** Invisible tap/click volume in front of a fitting. Models themselves do not pick. */
export function RoomHit({
  onToggle,
  size,
  position = [0, 0, 0],
  enabled = true,
  hitId,
}: Props) {
  const { highlightedId } = useGameInput();
  const [hover, setHover] = useState(false);
  if (!enabled) return null;
  const fire = (e: Parameters<typeof onInteractiveClick>[0]) => onInteractiveClick(e, onToggle);
  const lit = hover || Boolean(hitId && highlightedId === hitId);

  return (
    <mesh
      position={position}
      onPointerOver={(e) => {
        setHover(true);
        onInteractiveEnter(e);
      }}
      onPointerOut={() => {
        setHover(false);
        onInteractiveLeave();
      }}
      onPointerUp={fire}
      onClick={fire}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial
        color="#7ec8ff"
        transparent
        opacity={lit ? 0.16 : 0}
        depthWrite={false}
      />
    </mesh>
  );
}
