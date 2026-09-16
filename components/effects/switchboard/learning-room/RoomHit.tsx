'use client';

import { useEffect, useState } from 'react';
import {
  INTERACTION_REACH,
  onInteractiveClick,
  onInteractiveEnter,
  onInteractiveLeave,
} from '../interaction';
import { useSwitchboard } from '../SwitchboardContext';
import { useGameInput } from './GameInputContext';
import { ROOM_INTERACTS, ROOM_LOADS, type RoomInteractId } from './room-layout';
import { roomActionPrompt } from './room-prompt';

type Props = {
  onToggle: () => void;
  size: [number, number, number];
  position?: [number, number, number];
  enabled?: boolean;
  hitId?: RoomInteractId;
};

/** Invisible tap/click volume in front of a fitting. Models themselves do not pick. */
export function RoomHit({ onToggle, size, position = [0, 0, 0], enabled = true, hitId }: Props) {
  const { play, setPointerHint } = useGameInput();
  const { liveById } = useSwitchboard();
  const [hover, setHover] = useState(false);
  const [inReach, setInReach] = useState(false);
  const spot = ROOM_INTERACTS.find((item) => item.id === hitId) ?? null;
  const prompt = roomActionPrompt(spot, false, play, {
    powerLive: !!liveById[ROOM_LOADS.power],
    hobLive: !!liveById[ROOM_LOADS.induction] && play.isolatorOn,
    loungePowerLive: !!liveById[ROOM_LOADS.loungePower],
    loungeLightLive: !!liveById[ROOM_LOADS.loungeLight],
    coverOpen: false,
    coarse: false,
  }).text.replace(/^F · /, '');
  useEffect(() => {
    if (!hover || !spot) return;
    setPointerHint(inReach ? prompt : `Walk closer · ${prompt}`);
    return () => setPointerHint(null);
  }, [hover, inReach, prompt, spot, setPointerHint]);
  if (!enabled) return null;
  const fire = (e: Parameters<typeof onInteractiveClick>[0]) => onInteractiveClick(e, onToggle);
  const lit = hover && inReach;

  return (
    <mesh
      name={hitId ? `interact:${hitId}` : 'interact:fitting'}
      position={position}
      onPointerOver={(e) => {
        setHover(true);
        setInReach(e.distance <= INTERACTION_REACH);
        onInteractiveEnter(e);
      }}
      onPointerMove={(e) => {
        setInReach(e.distance <= INTERACTION_REACH);
        onInteractiveEnter(e);
      }}
      onPointerOut={() => {
        setHover(false);
        onInteractiveLeave();
      }}
      onClick={fire}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial color="#fff5dc" transparent opacity={lit ? 0.025 : 0} depthWrite={false} />
    </mesh>
  );
}
