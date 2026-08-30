'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, MathUtils, PerspectiveCamera } from 'three';
import { useCoarsePointer } from '@/lib/hooks';
import { IDLE_CAMERA, PLAYER_SPAWN, nearBoard, nearestRoomInteract, type RoomInteractId } from './room-layout';
import { useGameInput } from './GameInputContext';
import { isLookDragActive } from '../interaction';
import { useSwitchboard } from '../SwitchboardContext';
import { PliersCharacter } from './PliersCharacter';
import {
  mergeMoveKeys,
  playingCameraAnchor,
  shockShakeOffset,
  stepPlayerPose,
  type PlayerPose,
} from './player-motion';
import { tryRoomInteract } from './room-interact';
import { roomActionPrompt } from './room-prompt';
import type { RoomPlayState } from './room-play';
import { emptyKeys, usePlayerInput, type Zoom } from './use-player-input';

type Props = {
  enabled: boolean;
  onExit: () => void;
  onInteract: (id: RoomInteractId) => void;
  play: RoomPlayState;
  powerLive: boolean;
  hobLive: boolean;
  loungePowerLive: boolean;
  loungeLightLive: boolean;
};

const FOV_DEFAULT = 46;
const FOV_ZOOM = 28;

export function Player({
  enabled,
  onExit,
  onInteract,
  play,
  powerLive,
  hobLive,
  loungePowerLive,
  loungeLightLive,
}: Props) {
  const { gl } = useThree();
  const { coverOpen, requestCoverOpen } = useSwitchboard();
  const { mobileKeys, consumeInteract, isStunned, setStunned, setActionPrompt } = useGameInput();
  const { coarseRef } = useCoarsePointer();
  const keysRef = useRef(emptyKeys());
  const zoomRef = useRef<Zoom>({ hold: false, amount: 0 });
  const pose = useRef<PlayerPose>({
    x: PLAYER_SPAWN.x,
    z: PLAYER_SPAWN.z,
    yaw: PLAYER_SPAWN.yaw,
    pitch: 0,
    moving: false,
  });
  const dummyRef = useRef(new Group());
  const look = useRef({
    x: IDLE_CAMERA.target[0],
    y: IDLE_CAMERA.target[1],
    z: IDLE_CAMERA.target[2],
  });
  const [prompt, setPrompt] = useState<string | null>(null);
  const promptRef = useRef<string | null>(null);
  const shake = useRef(0);

  useEffect(() => {
    if (!enabled) setActionPrompt(null);
  }, [enabled, setActionPrompt]);

  useEffect(() => {
    const onShock = () => setStunned(1800);
    window.addEventListener('switchboard-shock', onShock);
    return () => window.removeEventListener('switchboard-shock', onShock);
  }, [setStunned]);

  usePlayerInput({
    enabled,
    gl,
    pose,
    keysRef,
    zoomRef,
    coarseRef,
    coverOpen,
    onExit,
    onInteract,
    requestCoverOpen,
  });

  useFrame(({ camera, clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const dummy = dummyRef.current;
    const persp = camera as PerspectiveCamera;
    const stunned = isStunned();
    const m = mobileKeys.current;
    const p = pose.current;

    if (enabled) {
      const next = stepPlayerPose(
        p,
        mergeMoveKeys(keysRef.current, m),
        dt,
        stunned,
        { dishwasher: !!play.openById.dishwasher, fridge: play.fridgeOpen }
      );
      pose.current = next;
      if (stunned) shake.current = Math.max(shake.current, 0.35);

      const inspecting = zoomRef.current.hold || zoomRef.current.amount > 0.25 || m.inspect;
      if (consumeInteract()) {
        tryRoomInteract(next.x, next.z, inspecting, coverOpen, onInteract, requestCoverOpen, next.yaw);
      }

      const hit = nearestRoomInteract(next.x, next.z, [], inspecting, next.yaw);
      const nextPrompt = roomActionPrompt(hit, nearBoard(next.x, next.z), play, {
        powerLive,
        hobLive,
        loungePowerLive,
        loungeLightLive,
        coverOpen,
        coarse: coarseRef.current,
      });
      if (nextPrompt !== promptRef.current) {
        promptRef.current = nextPrompt;
        setPrompt(nextPrompt);
        setActionPrompt(nextPrompt);
      }
    }

    const zoomT = enabled
      ? Math.max(zoomRef.current.hold || m.inspect ? 1 : 0, zoomRef.current.amount)
      : 0;
    const targetFov = MathUtils.lerp(FOV_DEFAULT, FOV_ZOOM, zoomT);
    if (Math.abs(persp.fov - targetFov) > 0.05) {
      persp.fov = MathUtils.damp(persp.fov, targetFov, 10, dt);
      persp.updateProjectionMatrix();
    }

    if (!enabled) {
      dummy.position.set(IDLE_CAMERA.position[0], IDLE_CAMERA.position[1], IDLE_CAMERA.position[2]);
      camera.position.lerp(dummy.position, 1 - Math.pow(0.04, dt));
      look.current.x = MathUtils.lerp(look.current.x, IDLE_CAMERA.target[0], 0.08);
      look.current.y = MathUtils.lerp(look.current.y, IDLE_CAMERA.target[1], 0.08);
      look.current.z = MathUtils.lerp(look.current.z, IDLE_CAMERA.target[2], 0.08);
      camera.lookAt(look.current.x, look.current.y, look.current.z);
      return;
    }

    const anchor = playingCameraAnchor(pose.current, zoomT);
    dummy.position.set(anchor.posX, anchor.posY, anchor.posZ);

    if (shake.current > 0.01) {
      shake.current = MathUtils.damp(shake.current, 0, 4, dt);
      const off = shockShakeOffset(clock.elapsedTime, shake.current);
      dummy.position.x += off.x;
      dummy.position.y += off.y;
    }

    camera.position.lerp(dummy.position, 1 - Math.pow(0.004, dt));
    if (isLookDragActive()) {
      look.current.x = anchor.lookX;
      look.current.y = anchor.lookY;
      look.current.z = anchor.lookZ;
    } else {
      look.current.x = MathUtils.damp(look.current.x, anchor.lookX, 16, dt);
      look.current.y = MathUtils.damp(look.current.y, anchor.lookY, 16, dt);
      look.current.z = MathUtils.damp(look.current.z, anchor.lookZ, 16, dt);
    }
    camera.lookAt(look.current.x, look.current.y, look.current.z);
  });

  return enabled ? <PliersCharacter pose={pose} prompt={prompt} hidePrompt /> : null;
}
