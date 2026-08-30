'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameInput } from './GameInputContext';

type Props = {
  visible: boolean;
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return coarse;
}

export function MobileControls({ visible }: Props) {
  const coarse = useCoarsePointer();
  const { mobileKeys } = useGameInput();
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchId = useRef<number | null>(null);
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
    });
  };

  const applyStick = (dx: number, dy: number) => {
    const max = 48;
    const nx = Math.max(-1, Math.min(1, dx / max));
    const ny = Math.max(-1, Math.min(1, dy / max));
    mobileKeys.current.forward = ny < -0.25;
    mobileKeys.current.back = ny > 0.25;
    mobileKeys.current.left = nx < -0.25;
    mobileKeys.current.right = nx > 0.25;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${nx * max}px), calc(-50% + ${ny * max}px))`;
    }
  };

  const onStickStart = (e: React.TouchEvent) => {
    if (touchId.current !== null) return;
    const t = e.changedTouches[0];
    if (!t || !stickRef.current) return;
    touchId.current = t.identifier;
    const rect = stickRef.current.getBoundingClientRect();
    origin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    applyStick(t.clientX - origin.current.x, t.clientY - origin.current.y);
  };

  const onStickMove = (e: React.TouchEvent) => {
    if (touchId.current === null) return;
    const t = Array.from(e.changedTouches).find((x) => x.identifier === touchId.current);
    if (!t) return;
    applyStick(t.clientX - origin.current.x, t.clientY - origin.current.y);
  };

  const onStickEnd = (e: React.TouchEvent) => {
    const ended = Array.from(e.changedTouches).some((x) => x.identifier === touchId.current);
    if (!ended) return;
    touchId.current = null;
    resetKnob();
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <div
        ref={stickRef}
        className="pointer-events-auto absolute bottom-[max(1.35rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-[max(0.75rem,env(safe-area-inset-left))] h-[7.5rem] w-[7.5rem] touch-none"
        onTouchStart={onStickStart}
        onTouchMove={onStickMove}
        onTouchEnd={onStickEnd}
        onTouchCancel={onStickEnd}
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
    </div>
  );
}
