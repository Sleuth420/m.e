'use client';

import { useEffect, type MutableRefObject, type RefObject } from 'react';
import { MathUtils, type WebGLRenderer } from 'three';
import { markInteract, setLookDragActive, wasRecentInteract } from '../interaction';
import { PLAYER, type RoomInteractId } from './room-layout';
import type { PlayerPose } from './player-motion';
import { tryRoomInteract } from './room-interact';

export type Keys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
};

export type Zoom = {
  hold: boolean;
  amount: number;
};

export function emptyKeys(): Keys {
  return {
    forward: false,
    back: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
  };
}

type Args = {
  enabled: boolean;
  gl: WebGLRenderer;
  pose: RefObject<PlayerPose>;
  keysRef: MutableRefObject<Keys>;
  zoomRef: MutableRefObject<Zoom>;
  coarseRef: MutableRefObject<boolean>;
  coverOpen: boolean;
  onExit: () => void;
  onInteract: (id: RoomInteractId) => void;
  requestCoverOpen: () => void;
};

function applyKey(keys: Keys, zoom: Zoom, code: string, down: boolean) {
  if (code === 'KeyW' || code === 'ArrowUp') keys.forward = down;
  if (code === 'KeyS' || code === 'ArrowDown') keys.back = down;
  if (code === 'KeyA') keys.left = down;
  if (code === 'KeyD') keys.right = down;
  if (code === 'ArrowLeft' || code === 'KeyQ') keys.turnLeft = down;
  if (code === 'ArrowRight' || code === 'KeyE') keys.turnRight = down;
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyZ') zoom.hold = down;
}

/** Keyboard, wheel zoom, look-drag (touch + mouse), and mobile tap-nearest. */
export function usePlayerInput({
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
}: Args) {
  useEffect(() => {
    if (!enabled) {
      keysRef.current = emptyKeys();
      zoomRef.current = { hold: false, amount: 0 };
      return;
    }

    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'Space' ||
        e.code === 'KeyZ' ||
        e.code.startsWith('Shift')
      ) {
        e.preventDefault();
      }
      if (e.repeat && (e.code === 'KeyF' || e.code === 'Enter' || e.code === 'Escape')) return;
      applyKey(keysRef.current, zoomRef.current, e.code, true);
      if (e.repeat) return;
      if (e.code === 'KeyF' || e.code === 'Enter') {
        tryRoomInteract(
          pose.current.x,
          pose.current.z,
          zoomRef.current.hold || zoomRef.current.amount > 0.25,
          coverOpen,
          onInteract,
          requestCoverOpen,
          pose.current.yaw
        );
      }
    };
    const onUp = (e: KeyboardEvent) => applyKey(keysRef.current, zoomRef.current, e.code, false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current.amount = MathUtils.clamp(zoomRef.current.amount + (e.deltaY > 0 ? -0.08 : 0.08), 0, 1);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        zoomRef.current.hold = true;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) zoomRef.current.hold = false;
    };
    const onContext = (e: MouseEvent) => e.preventDefault();

    const canvas = gl.domElement;
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onContext);

    const look = { id: -1, x: 0, y: 0, dragging: false, canLook: false };
    const TAP_PX = 18;
    let nearestTimer = 0;
    const releaseLook = (pointerId: number) => {
      look.id = -1;
      look.dragging = false;
      look.canLook = false;
      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    };
    const useNearest = () => {
      if (wasRecentInteract()) return;
      if (
        tryRoomInteract(
          pose.current.x,
          pose.current.z,
          false,
          coverOpen,
          onInteract,
          requestCoverOpen,
          pose.current.yaw
        )
      ) {
        markInteract();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      look.id = e.pointerId;
      look.x = e.clientX;
      look.y = e.clientY;
      look.dragging = false;
      look.canLook = true;
      setLookDragActive(false);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (look.id !== e.pointerId || !look.canLook) return;
      const dx = e.clientX - look.x;
      const dy = e.clientY - look.y;
      if (!look.dragging && dx * dx + dy * dy < TAP_PX * TAP_PX) return;
      if (!look.dragging) {
        look.dragging = true;
        setLookDragActive(true);
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* capture is optional */
        }
      }
      const sens = e.pointerType === 'touch' ? 0.0056 : 0.0042;
      pose.current.yaw -= dx * sens;
      pose.current.pitch = MathUtils.clamp(
        pose.current.pitch - dy * sens,
        PLAYER.pitchMin,
        PLAYER.pitchMax
      );
      look.x = e.clientX;
      look.y = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (look.id !== e.pointerId) return;
      const dragged = look.dragging;
      releaseLook(e.pointerId);
      if (dragged) {
        e.stopImmediatePropagation();
        window.setTimeout(() => setLookDragActive(false), 0);
        return;
      }
      if (coarseRef.current) {
        window.clearTimeout(nearestTimer);
        nearestTimer = window.setTimeout(useNearest, 48);
      }
      window.setTimeout(() => setLookDragActive(false), 0);
    };
    const onBlur = () => {
      keysRef.current = emptyKeys();
      zoomRef.current.hold = false;
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp, true);
    canvas.addEventListener('pointercancel', onPointerUp, true);
    window.addEventListener('blur', onBlur);

    return () => {
      window.clearTimeout(nearestTimer);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('contextmenu', onContext);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp, true);
      canvas.removeEventListener('pointercancel', onPointerUp, true);
      setLookDragActive(false);
    };
  }, [enabled, gl, onExit, onInteract, coverOpen, requestCoverOpen, pose, keysRef, zoomRef, coarseRef]);
}
