'use client';

import { useEffect, useRef } from 'react';
import { useCoarsePointer } from '@/lib/hooks';
import { analogFromDelta } from './player-motion';
import { useGameInput } from './GameInputContext';

type Props = {
  visible: boolean;
};

export function MobileControls({ visible }: Props) {
  const { coarse } = useCoarsePointer();
  const { mobileKeys } = useGameInput();
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!visible) {
      Object.assign(mobileKeys.current, {
        forward: false,
        back: false,
        left: false,
        right: false,
        turnLeft: false,
        turnRight: false,
        inspect: false,
        stickX: 0,
        stickY: 0,
      });
    }
  }, [visible, mobileKeys]);

  if (!visible || !coarse) return null;

  const resetKnob = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)';
    }
    Object.assign(mobileKeys.current, {
      forward: false,
      back: false,
      left: false,
      right: false,
      stickX: 0,
      stickY: 0,
    });
  };

  const applyStick = (clientX: number, clientY: number) => {
    const max = 56;
    const analog = analogFromDelta(clientX - origin.current.x, clientY - origin.current.y, max);
    mobileKeys.current.stickX = analog.x;
    mobileKeys.current.stickY = analog.y;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${analog.x * max}px), calc(-50% + ${analog.y * max}px))`;
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== null) return;
    e.preventDefault();
    e.stopPropagation();
    pointerId.current = e.pointerId;
    const rect = e.currentTarget.getBoundingClientRect();
    origin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* capture is optional */
    }
    applyStick(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;
    e.preventDefault();
    applyStick(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetKnob();
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <div
        ref={stickRef}
        className="pointer-events-auto absolute bottom-[max(1.35rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-[max(0.75rem,env(safe-area-inset-left))] h-[7.5rem] w-[7.5rem] touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute inset-0 rounded-full border border-white/20 bg-black/35 backdrop-blur-sm" />
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/25 shadow-md"
        />
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-wider text-white/80">
          Move
        </span>
      </div>
      <p className="pointer-events-none absolute bottom-[max(1.35rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(0.75rem,env(safe-area-inset-right))] max-w-[7.5rem] text-right text-[9px] font-medium leading-snug tracking-wider text-white/75">
        Drag to look
      </p>
    </div>
  );
}
