'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwitchboard } from '../SwitchboardContext';

export function ShockOverlay() {
  const { shockActive, shockCircuitId, tripReason } = useSwitchboard();

  if (!shockActive) return null;

  const label =
    shockCircuitId === 'main'
      ? 'Mains shock — main switch tripped'
      : 'RCD tripped — electric shock';

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[90] flex items-center justify-center',
        'animate-pulse bg-red-600/35'
      )}
      aria-live="assertive"
    >
      <div className="mx-4 max-w-sm rounded-2xl border border-red-300/40 bg-black/80 px-5 py-4 text-center shadow-2xl backdrop-blur-md">
        <Zap className="mx-auto h-10 w-10 text-yellow-300" strokeWidth={2.2} />
        <p className="mt-2 font-display text-xl font-bold text-red-100">{label}</p>
        <p className="mt-1 text-sm text-red-200/90">
          {tripReason === 'shock'
            ? 'You touched a live conductor. Circuit broken — RCD saved your life.'
            : 'Fault current detected.'}
        </p>
      </div>
    </div>
  );
}
