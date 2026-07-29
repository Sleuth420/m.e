'use client';

import { useState } from 'react';
import { Hand, MousePointer2 } from 'lucide-react';
import { HeroScene } from '@/components/effects/hero-scene';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Full-bleed switchboard. Copy lives above the canvas so it doesn't fight the 3D.
 * Orbit is OFF by default; Explore enables drag / zoom / rockers.
 */
export default function SwitchboardShowcase() {
  const [explore, setExplore] = useState(false);

  return (
    <section
      id="switchboard-showcase"
      className="w-full max-w-[100vw] border-y border-border/40 bg-background"
      aria-label="Interactive switchboard"
    >
      <div className="container max-w-3xl px-4 py-8 text-center sm:py-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Interactive demo</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Work a real switchboard layout
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Hit Explore to orbit the board, flip the main switch, toggle circuits, and press TEST to trip an RCBO.
        </p>
      </div>

      <div className="relative isolate min-h-[min(78vh,820px)] w-full overflow-x-clip overflow-y-hidden touch-pan-y">
        <div
          className={`absolute inset-0 overflow-hidden ${explore ? '' : 'pointer-events-none'}`}
          aria-hidden={!explore}
        >
          <HeroScene
            observeId="switchboard-showcase"
            controlsEnabled={explore}
            className="!relative h-full min-h-[min(78vh,820px)] max-w-full"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent px-4 pb-5 pt-20">
          <div className="pointer-events-auto">
            <Button
              type="button"
              size="lg"
              variant={explore ? 'default' : 'outline'}
              className={cn(
                'min-h-11 gap-2',
                explore
                  ? 'gradient-bg text-primary-foreground shadow-glow'
                  : 'chrome-border bg-background/90 backdrop-blur-sm'
              )}
              aria-pressed={explore}
              onClick={() => setExplore((v) => !v)}
            >
              {explore ? (
                <>
                  <Hand className="h-4 w-4" />
                  Exit explore
                </>
              ) : (
                <>
                  <MousePointer2 className="h-4 w-4" />
                  Explore the board
                </>
              )}
            </Button>
          </div>
          {explore ? (
            <p className="text-center text-xs text-muted-foreground">
              Drag to orbit, scroll to zoom, click Main / rockers / TEST
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
