'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, MathUtils, PerspectiveCamera } from 'three';
import { useCoarsePointer, useMediaQuery } from '@/lib/hooks';
import {
  IDLE_CAMERA,
  PLAYER_SPAWN,
  boardLookHint,
  nearBoard,
  nearestRoomHint,
  nearestRoomInteract,
  type RoomInteractId,
} from './room-layout';
import { useGameInput } from './GameInputContext';
import { isLookDragActive } from '../interaction';
import { useSwitchboard } from '../SwitchboardContext';
import { PliersCharacter } from './PliersCharacter';
import {
  mergeMoveKeys,
  playingCameraAnchor,
  shockShakeOffset,
  stepPlayerPoseBudget,
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
  const { coverOpen, coverPromptOpen, requestCoverOpen, denyCoverOpen, closeCover } = useSwitchboard();
  const {
    mobileKeys,
    consumeInteract,
    isStunned,
    setStunned,
    setActionPrompt,
    setHighlightedId,
    dismissEntryHint,
  } = useGameInput();
  const { coarseRef } = useCoarsePointer();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
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
  const highlightRef = useRef<RoomInteractId | null>(null);
  const shake = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setActionPrompt(null);
      setHighlightedId(null);
      promptRef.current = null;
      highlightRef.current = null;
    }
  }, [enabled, setActionPrompt, setHighlightedId]);

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
    coverPromptOpen,
    onExit,
    onInteract,
    requestCoverOpen,
    denyCoverOpen,
    closeCover,
    dismissEntryHint,
  });

  useFrame(({ camera, clock }, delta) => {
    const dummy = dummyRef.current;
    const persp = camera as PerspectiveCamera;
    const stunned = isStunned();
    const m = mobileKeys.current;
    const p = pose.current;
    const inspecting = zoomRef.current.hold || m.inspect;

    if (enabled) {
      const blocked = stunned || coverPromptOpen;
      const next = stepPlayerPoseBudget(
        p,
        coverPromptOpen
          ? { ...emptyKeys(), stickX: 0, stickY: 0 }
          : mergeMoveKeys(keysRef.current, m),
        Math.min(delta, 0.25),
        blocked,
        { dishwasher: !!play.openById.dishwasher, fridge: play.fridgeOpen }
      );
      pose.current = next;
      if (next.moving || isLookDragActive()) dismissEntryHint();
      if (stunned && !reducedMotion) shake.current = Math.max(shake.current, 0.35);

      if (!coverPromptOpen && consumeInteract()) {
        tryRoomInteract(
          next.x,
          next.z,
          inspecting,
          coverOpen,
          onInteract,
          requestCoverOpen,
          next.yaw,
          closeCover
        );
      }

      const hit = nearestRoomInteract(next.x, next.z, [], inspecting, next.yaw);
      const hint = hit ? null : nearestRoomHint(next.x, next.z, next.yaw);
      const nextPrompt = roomActionPrompt(
        hit,
        nearBoard(next.x, next.z),
        play,
        {
          powerLive,
          hobLive,
          loungePowerLive,
          loungeLightLive,
          coverOpen,
          coarse: coarseRef.current,
        },
        hint,
        boardLookHint(next.x, next.z, next.yaw)
      );
      if (nextPrompt.text !== promptRef.current) {
        promptRef.current = nextPrompt.text;
        setPrompt(nextPrompt.text);
        setActionPrompt(nextPrompt);
      }
      const nextHighlight = hit?.id ?? null;
      if (nextHighlight !== highlightRef.current) {
        highlightRef.current = nextHighlight;
        setHighlightedId(nextHighlight);
      }
    }

    if (zoomRef.current.amount > 0 && !zoomRef.current.hold) {
      zoomRef.current.amount = MathUtils.damp(zoomRef.current.amount, 0, 5.5, delta);
      if (zoomRef.current.amount < 0.02) zoomRef.current.amount = 0;
    }

    const zoomT = enabled ? Math.max(inspecting ? 1 : 0, zoomRef.current.amount) : 0;
    const targetFov = MathUtils.lerp(FOV_DEFAULT, FOV_ZOOM, zoomT);
    if (Math.abs(persp.fov - targetFov) > 0.05) {
      persp.fov = MathUtils.damp(persp.fov, targetFov, 10, delta);
      persp.updateProjectionMatrix();
    }

    if (!enabled) {
      dummy.position.set(IDLE_CAMERA.position[0], IDLE_CAMERA.position[1], IDLE_CAMERA.position[2]);
      camera.position.lerp(dummy.position, 1 - Math.pow(0.04, delta));
      look.current.x = MathUtils.lerp(look.current.x, IDLE_CAMERA.target[0], 0.08);
      look.current.y = MathUtils.lerp(look.current.y, IDLE_CAMERA.target[1], 0.08);
      look.current.z = MathUtils.lerp(look.current.z, IDLE_CAMERA.target[2], 0.08);
      camera.lookAt(look.current.x, look.current.y, look.current.z);
      return;
    }

    const anchor = playingCameraAnchor(pose.current, zoomT);
    dummy.position.set(anchor.posX, anchor.posY, anchor.posZ);

    if (!reducedMotion && shake.current > 0.01) {
      shake.current = MathUtils.damp(shake.current, 0, 4, delta);
      const off = shockShakeOffset(clock.elapsedTime, shake.current);
      dummy.position.x += off.x;
      dummy.position.y += off.y;
    } else {
      shake.current = 0;
    }

    const turning =
      keysRef.current.turnLeft || keysRef.current.turnRight || m.turnLeft || m.turnRight;
    if (isLookDragActive()) {
      camera.position.copy(dummy.position);
      look.current.x = anchor.lookX;
      look.current.y = anchor.lookY;
      look.current.z = anchor.lookZ;
    } else {
      const camLambda = turning ? 14 : 9;
      camera.position.x = MathUtils.damp(camera.position.x, dummy.position.x, camLambda, delta);
      camera.position.y = MathUtils.damp(camera.position.y, dummy.position.y, camLambda, delta);
      camera.position.z = MathUtils.damp(camera.position.z, dummy.position.z, camLambda, delta);
      const lookLambda = turning ? 22 : 16;
      look.current.x = MathUtils.damp(look.current.x, anchor.lookX, lookLambda, delta);
      look.current.y = MathUtils.damp(look.current.y, anchor.lookY, lookLambda, delta);
      look.current.z = MathUtils.damp(look.current.z, anchor.lookZ, lookLambda, delta);
    }
    camera.lookAt(look.current.x, look.current.y, look.current.z);
  });

  return enabled ? <PliersCharacter pose={pose} prompt={prompt} hidePrompt /> : null;
}
