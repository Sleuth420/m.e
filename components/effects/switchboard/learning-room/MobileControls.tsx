'use client';

import { useEffect, useRef, useState } from 'react';
import { Hand, RotateCcw, RotateCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const { mobileKeys, pulseInteract } = useGameInput();
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
    const max = 42;
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

  const hold = (key: 'turnLeft' | 'turnRight' | 'inspect', down: boolean) => {
    mobileKeys.current[key] = down;
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <div
        ref={stickRef}
        className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-3 h-24 w-24 touch-none sm:left-4"
        onTouchStart={onStickStart}
        onTouchMove={onStickMove}
        onTouchEnd={onStickEnd}
        onTouchCancel={onStickEnd}
      >
        <div className="absolute inset-0 rounded-full border border-white/20 bg-black/35 backdrop-blur-sm" />
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/25 shadow-md"
        />
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-medium uppercase tracking-wider text-white/80">
          Move
        </span>
      </div>

      <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 flex flex-col items-end gap-2 sm:right-4">
        <div className="flex gap-2">
          <TouchBtn
            label="Turn L"
            icon={<RotateCcw className="h-4 w-4" />}
            onDown={() => hold('turnLeft', true)}
            onUp={() => hold('turnLeft', false)}
          />
          <TouchBtn
            label="Turn R"
            icon={<RotateCw className="h-4 w-4" />}
            onDown={() => hold('turnRight', true)}
            onUp={() => hold('turnRight', false)}
          />
        </div>
        <div className="flex gap-2">
          <TouchBtn
            label="Use"
            icon={<Hand className="h-4 w-4" />}
            onTap={pulseInteract}
            large
          />
          <TouchBtn
            label="Look"
            icon={<Search className="h-4 w-4" />}
            onDown={() => hold('inspect', true)}
            onUp={() => hold('inspect', false)}
          />
        </div>
      </div>
    </div>
  );
}

function TouchBtn({
  label,
  icon,
  onDown,
  onUp,
  onTap,
  large,
}: {
  label: string;
  icon: React.ReactNode;
  onDown?: () => void;
  onUp?: () => void;
  onTap?: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'chrome-border flex flex-col items-center justify-center gap-0.5 rounded-xl border border-white/25 bg-black/40 text-white backdrop-blur-md active:scale-95',
        large ? 'h-14 w-14' : 'h-12 w-12'
      )}
      onTouchStart={(e) => {
        e.preventDefault();
        onDown?.();
        onTap?.();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onUp?.();
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        onUp?.();
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') return;
        onDown?.();
        onTap?.();
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'touch') return;
        onUp?.();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'touch') return;
        onUp?.();
      }}
      onMouseDown={() => {
        onDown?.();
        onTap?.();
      }}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      {icon}
      <span className="text-[8px] font-semibold uppercase tracking-wide opacity-90">{label}</span>
    </button>
  );
}
