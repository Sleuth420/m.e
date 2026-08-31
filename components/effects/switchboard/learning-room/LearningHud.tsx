'use client';

import { useEffect, useState } from 'react';
import { Keyboard, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoarsePointer } from '@/lib/hooks';
import { CIRCUITS, circuitDisplayName } from '../circuit-data';
import { useSwitchboard } from '../SwitchboardContext';
import { useGameInput } from './GameInputContext';
import { ROOM_LOADS } from './room-layout';

type Props = {
  visible: boolean;
};

function hoveredCircuitLabel(hovered: string | null) {
  if (!hovered) return null;
  if (hovered === 'main') return 'MAIN isolator';
  const circuit = CIRCUITS.find((c) => c.id === hovered);
  return circuit ? circuitDisplayName(circuit.label) : hovered;
}

export function LearningHud({ visible }: Props) {
  const { mainOn, liveById, coverOpen, tripReason, shockActive, hovered } = useSwitchboard();
  const { actionPrompt, actionTone, entryHint, dismissEntryHint } = useGameInput();
  const [keysOpen, setKeysOpen] = useState(false);
  const [circuitsOpen, setCircuitsOpen] = useState(false);
  const { coarse } = useCoarsePointer();

  useEffect(() => {
    if (!visible) {
      setKeysOpen(false);
      setCircuitsOpen(false);
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

  useEffect(() => {
    if (!visible || !entryHint) return;
    const t = window.setTimeout(dismissEntryHint, 6000);
    return () => window.clearTimeout(t);
  }, [visible, entryHint, dismissEntryHint]);

  if (!visible) return null;

  const circuits = [
    { label: 'Main', on: mainOn },
    { label: 'Lights', on: !!liveById[ROOM_LOADS.lighting] },
    { label: 'Power', on: !!liveById[ROOM_LOADS.power] },
    { label: 'Lounge P', on: !!liveById[ROOM_LOADS.loungePower] },
    { label: 'Lounge L', on: !!liveById[ROOM_LOADS.loungeLight] },
    { label: 'Hob', on: !!liveById[ROOM_LOADS.induction] },
    { label: 'Oven', on: !!liveById[ROOM_LOADS.oven] },
    { label: 'Fridge', on: !!liveById[ROOM_LOADS.fridge] },
  ];
  const liveCount = circuits.filter((c) => c.on).length;

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

  const hoveredName = coverOpen ? hoveredCircuitLabel(hovered) : null;
  const status = shockActive
    ? 'RCD tripped — you got shocked'
    : tripReason === 'test'
      ? 'RCD test trip'
      : hoveredName
        ? `${hoveredName} — tap rocker to isolate · TEST trips the RCD`
        : coverOpen
          ? 'Cover open — tap a breaker · avoid live red conductors'
          : 'Walk the install — fittings, GPOs, and the board all operate';

  const bannerText = shockActive ? status : actionPrompt || status;
  const tone = shockActive ? 'danger' : actionPrompt ? actionTone : coverOpen ? 'caution' : 'default';

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-[max(3.25rem,calc(env(safe-area-inset-top)+2.6rem))] z-20 flex flex-col items-center gap-2 px-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:top-[max(3.75rem,calc(env(safe-area-inset-top)+2.85rem))]">
        <div
          className={cn(
            'chrome-border max-w-md rounded-xl border px-3 py-2 text-center shadow-md backdrop-blur-md',
            tone === 'danger'
              ? 'border-red-400/50 bg-red-950/80 text-red-100'
              : tone === 'caution'
                ? 'border-amber-400/40 bg-amber-950/75 text-amber-50'
                : 'border-border/60 bg-background/88 text-foreground'
          )}
        >
          {shockActive || (!coverOpen && !actionPrompt) ? (
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium sm:text-sm">
              {!shockActive && !actionPrompt && <ShieldAlert className="h-3.5 w-3.5 shrink-0" />}
              {bannerText}
            </p>
          ) : (
            <p className="text-xs font-medium sm:text-sm">{bannerText}</p>
          )}
        </div>
        {entryHint && (
          <p className="chrome-border max-w-sm rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-center text-[11px] font-medium text-foreground/90 shadow-sm backdrop-blur-md">
            {coarse ? 'Stick to move · drag to look · tap fittings' : 'WASD · drag look · F use'}
          </p>
        )}
        {coarse &&
          (circuitsOpen ? (
            <div className="pointer-events-auto flex flex-col items-center gap-1">
              {circuitList}
              <button
                type="button"
                className="rounded px-2 py-0.5 text-[10px] text-muted-foreground"
                onClick={() => setCircuitsOpen(false)}
              >
                Hide circuits
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="pointer-events-auto chrome-border rounded-lg border border-border/60 bg-background/88 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-md"
              onClick={() => setCircuitsOpen(true)}
            >
              {liveCount} live
            </button>
          ))}
      </div>

      {!coarse && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="pointer-events-auto">
              {keysOpen ? (
                <div className="chrome-border w-[13.5rem] rounded-xl border border-border/60 bg-background/92 p-2.5 shadow-lg backdrop-blur-md">
                  <div className="mb-1.5 flex items-center gap-1 justify-between">
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
                      <Kbd>WASD</Kbd> move · drag to look
                    </li>
                    <li>
                      <Kbd>QE</Kbd> turn · <Kbd>F</Kbd> / <Kbd>Space</Kbd> use
                    </li>
                    <li>
                      <Kbd>Shift</Kbd> inspect · <Kbd>Esc</Kbd> exit
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
