'use client';

import { useEffect, useState } from 'react';
import { Cable, House, CircleHelp } from 'lucide-react';
import { useCoarsePointer } from '@/lib/hooks';
import { useGameHud, useGameInput } from './GameInputContext';

/** The room is the interface. Keep only the architectural cutaway switch. */
export function LearningHud({ visible }: { visible: boolean }) {
  const { wiringView, setWiringView, dismissEntryHint } = useGameInput();
  const { entryHint, pointerHint, actionPrompt } = useGameHud();
  const [showHelp, setShowHelp] = useState(false);
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
        aria-label="Wiring view"
        aria-pressed={wiringView}
        onClick={() => setWiringView(!wiringView)}
        className="pointer-events-auto absolute left-4 top-[max(1rem,env(safe-area-inset-top))] flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 text-sm text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {wiringView ? <House size={15} /> : <Cable size={15} />}
        {wiringView ? 'Show walls' : 'Show wiring'}
      </button>
      <button
        type="button"
        aria-label="Room controls"
        aria-expanded={showHelp}
        aria-controls="room-controls-help"
        onClick={() => setShowHelp((value) => !value)}
        className="pointer-events-auto absolute left-44 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-black/75"
      >
        <CircleHelp size={20} />
      </button>
      {showHelp && (
        <p
          id="room-controls-help"
          className="absolute left-4 top-20 max-w-[calc(100%-2rem)] rounded-xl bg-black/85 px-4 py-3 text-sm text-white sm:max-w-sm"
        >
          {coarse
            ? 'Move with the stick. Drag the room to look around. Tap fittings to use them.'
            : 'WASD or arrow keys to walk. Drag to look around. Click a fitting or press F to use it. Escape leaves the room.'}{' '}
          Switch on Wiring view to see inside the walls.
        </p>
      )}
      {!showHelp && (entryHint || pointerHint || (!coarse && actionPrompt)) && (
        <p
          role="status"
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-center text-xs leading-relaxed text-white/90 backdrop-blur-sm max-sm:bottom-32"
        >
          {pointerHint ||
            (!coarse && actionPrompt) ||
            (coarse
              ? 'Move with the stick · drag to look · tap objects to use'
              : 'WASD to move · drag to look · click objects to use')}
        </p>
      )}
    </div>
  );
}
