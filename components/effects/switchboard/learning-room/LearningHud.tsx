'use client';

import { useEffect } from 'react';
import { Cable, House } from 'lucide-react';
import { useCoarsePointer } from '@/lib/hooks';
import { useGameInput } from './GameInputContext';

/** The room is the interface. Keep only the architectural cutaway switch. */
export function LearningHud({ visible }: { visible: boolean }) {
  const { wiringView, setWiringView, entryHint, dismissEntryHint, pointerHint } = useGameInput();
  const { coarse } = useCoarsePointer();
  useEffect(() => {
    if (!visible || !entryHint) return;
    const timer = window.setTimeout(dismissEntryHint, 7000);
    return () => window.clearTimeout(timer);
  }, [visible, entryHint, dismissEntryHint]);

  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 font-sans">
      <button
        type="button"
        aria-label="Show wiring"
        aria-pressed={wiringView}
        onClick={() => setWiringView(!wiringView)}
        className="pointer-events-auto absolute left-4 top-[max(1rem,env(safe-area-inset-top))] flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 text-xs text-white/90 backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {wiringView ? <House size={15} /> : <Cable size={15} />}
        {wiringView ? 'Show walls' : 'Show wiring'}
      </button>
      {(entryHint || pointerHint) && (
        <p
          role="status"
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-center text-xs leading-relaxed text-white/90 backdrop-blur-sm max-sm:bottom-32"
        >
          {pointerHint ||
            (coarse
              ? 'Move with the stick · drag to look · tap objects to use'
              : 'WASD to move · drag to look · click objects to use')}
        </p>
      )}
    </div>
  );
}
