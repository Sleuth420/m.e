'use client';

import { useState } from 'react';
import { Hand, MousePointer2 } from 'lucide-react';
import { HeroScene } from '@/components/effects/hero-scene';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Full-bleed switchboard. Orbit is OFF by default so the page scrolls;
 * turn on Explore to drag / zoom / click rockers.
 */
export default function SwitchboardShowcase() {
  const [explore, setExplore] = useState(false);

  return (
    <section
      id="switchboard-showcase"
      className="relative isolate min-h-[min(92vh,920px)] w-full overflow-hidden border-y border-border/40 bg-background"
      aria-label="Interactive switchboard"
    >
      <div className="absolute inset-0" aria-hidden={!explore}>
        <HeroScene
          observeId="switchboard-showcase"
          controlsEnabled={explore}
          className="!relative h-full min-h-[min(92vh,920px)]"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-background via-background/80 to-transparent pb-14 pt-8 sm:pb-16 sm:pt-10">
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Switchboard demo</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Same board language I install on site
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Scroll past freely — or turn on explore to orbit and work the board. Main isolates supply. Rockers switch
            circuits (green lamp + outgoing active). TEST trips an RCBO; flip the rocker back to reset.
          </p>

          <div className="pointer-events-auto mt-5 flex justify-center">
            <Button
              type="button"
              size="lg"
              variant={explore ? 'default' : 'outline'}
              className={cn(
                'min-h-11 gap-2',
                explore ? 'gradient-bg text-primary-foreground shadow-glow' : 'chrome-border bg-background/90 backdrop-blur-sm'
              )}
              aria-pressed={explore}
              onClick={() => setExplore((v) => !v)}
            >
              {explore ? (
                <>
                  <Hand className="h-4 w-4" />
                  Exploring — click to release scroll
                </>
              ) : (
                <>
                  <MousePointer2 className="h-4 w-4" />
                  Explore the board
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/55 to-transparent pt-16 pb-5">
        <p className="text-center text-xs text-muted-foreground">
          {explore
            ? 'Drag to orbit · scroll to zoom · Main / rocker / TEST'
            : 'Page scroll unlocked · tap Explore to interact'}
        </p>
      </div>
    </section>
  );
}
