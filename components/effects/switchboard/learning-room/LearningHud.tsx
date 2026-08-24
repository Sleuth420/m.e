'use client';

import { useEffect, useState } from 'react';
import { Keyboard, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwitchboard } from '../SwitchboardContext';
import { ROOM_LOADS } from './room-layout';

type Props = {
  visible: boolean;
};

export function LearningHud({ visible }: Props) {
  const { mainOn, liveById, coverOpen, tripReason, shockActive } = useSwitchboard();
  const [keysOpen, setKeysOpen] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!visible) {
      setKeysOpen(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyH' || e.repeat) return;
      e.preventDefault();
      setKeysOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible) return null;

  const circuits = [
    { label: 'Main', on: mainOn },
    { label: 'Lights', on: !!liveById[ROOM_LOADS.lighting] },
    { label: 'Power', on: !!liveById[ROOM_LOADS.power] },
    { label: 'Hob', on: !!liveById[ROOM_LOADS.induction] },
    { label: 'Oven', on: !!liveById[ROOM_LOADS.oven] },
    { label: 'Fridge', on: !!liveById[ROOM_LOADS.fridge] },
  ];

  const circuitList = (
    <ul className="chrome-border flex max-w-[min(100%,22rem)] flex-wrap justify-center gap-x-2 gap-y-1 rounded-xl border border-border/60 bg-background/88 px-2.5 py-2 shadow-sm backdrop-blur-md sm:max-w-none sm:justify-end">
      {circuits.map((c) => (
        <li key={c.label} className="flex items-center gap-1 text-[10px] sm:text-[11px]">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              c.on ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.55)]' : 'bg-zinc-400'
            )}
          />
          <span className={c.on ? 'font-medium text-foreground' : 'text-muted-foreground'}>
            {c.label}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-12 z-20 flex flex-col items-center gap-2 px-3 sm:top-14">
        <div
          className={cn(
            'chrome-border max-w-md rounded-xl border px-3 py-2 text-center shadow-md backdrop-blur-md',
            shockActive
              ? 'border-red-400/50 bg-red-950/80 text-red-100'
              : !coverOpen
                ? 'border-amber-400/40 bg-amber-950/75 text-amber-50'
                : 'border-border/60 bg-background/88 text-foreground'
          )}
        >
          {shockActive ? (
            <p className="text-xs font-semibold sm:text-sm">RCD tripped — you got shocked</p>
          ) : !coverOpen ? (
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium sm:text-sm">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              Board locked — tap the cover (licensed only)
            </p>
          ) : tripReason === 'test' ? (
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300">RCD test trip</p>
          ) : (
            <p className="text-xs font-medium sm:text-sm">
              Cover open — avoid live red conductors
            </p>
          )}
        </div>
        {coarse && circuitList}
      </div>

      {!coarse && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="pointer-events-auto">
              {keysOpen ? (
                <div className="chrome-border w-[13.5rem] rounded-xl border border-border/60 bg-background/92 p-2.5 shadow-lg backdrop-blur-md">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                      <Keyboard className="h-3 w-3" />
                      Controls
                    </p>
                    <button
                      type="button"
                      className="rounded px-1 text-[10px] text-muted-foreground hover:text-foreground"
                      onClick={() => setKeysOpen(false)}
                    >
                      H
                    </button>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                    <li>
                      <Kbd>WASD</Kbd> move · <Kbd>QE</Kbd> turn
                    </li>
                    <li>
                      <Kbd>F</Kbd> use · <Kbd>Shift</Kbd> inspect
                    </li>
                    <li>
                      <Kbd>Esc</Kbd> exit
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  type="button"
                  className="chrome-border min-h-9 rounded-lg border border-border/60 bg-background/88 px-2.5 py-1.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-md"
                  onClick={() => setKeysOpen(true)}
                >
                  Keys · H
                </button>
              )}
            </div>
            {circuitList}
          </div>
        </div>
      )}
    </>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <span className="rounded border border-border/70 bg-muted/70 px-1 py-px font-mono text-[10px] font-semibold text-foreground">
      {children}
    </span>
  );
}
