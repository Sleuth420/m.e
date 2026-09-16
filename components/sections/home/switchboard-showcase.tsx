'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DoorOpen, Gamepad2, Play } from 'lucide-react';
import { HeroScene } from '@/components/effects/hero-scene';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCoarsePointer } from '@/lib/hooks';

// Fullscreen must escape the page's animated/isolated stacking contexts.
function RoomPortal({ active, children }: { active: boolean; children: ReactNode }) {
  return active ? createPortal(children, document.body) : children;
}

/**
 * Full-bleed learning room. Copy lives above the canvas so it doesn't fight the 3D.
 * Play is OFF by default so the page can still scroll.
 */
export default function SwitchboardShowcase() {
  const [explore, setExplore] = useState(false);
  const { coarse } = useCoarsePointer();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!explore) return;

    stageRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.classList.add('room-playing');

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      if (document.querySelector('[aria-modal="true"]')) return;
      setExplore(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.classList.remove('room-playing');
      window.removeEventListener('keydown', onKey);
    };
  }, [explore]);

  return (
    <section
      id="switchboard-showcase"
      className="w-full max-w-[100vw] border-y border-border/40 bg-gradient-to-b from-background via-background to-muted/20"
      aria-label="Walk the 3D Electrical Installation"
    >
      <div className="container max-w-3xl px-4 py-6 text-center sm:py-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Explore the installation
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          A home, connected.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Step inside. Switch on a light, follow the wiring, and see how the switchboard brings it
          all together.
        </p>
      </div>

      <div
        ref={stageRef}
        data-room-stage
        className="relative isolate min-h-[min(82vh,920px)] w-full overflow-x-clip overflow-y-hidden touch-pan-y sm:min-h-[min(78vh,840px)]"
      >
        <RoomPortal active={explore}>
          <div
            className={cn(
              'overflow-hidden',
              explore
                ? 'fixed inset-0 z-[60] h-dvh w-full overscroll-none touch-none'
                : 'absolute inset-0 pointer-events-none'
            )}
            aria-hidden={!explore}
          >
            <HeroScene
              observeId="switchboard-showcase"
              controlsEnabled={explore}
              onExit={() => setExplore(false)}
              className={cn(
                '!relative h-full max-w-full',
                explore
                  ? 'min-h-0 touch-none'
                  : 'min-h-[min(82vh,920px)] touch-pan-y sm:min-h-[min(78vh,840px)]'
              )}
            />
          </div>

          {explore ? (
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-end px-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))]">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="pointer-events-auto min-h-11 touch-manipulation gap-2 border-white/20 bg-[#202824]/95 text-[#f3f1e9] backdrop-blur-md hover:bg-[#303b34] hover:text-white"
                aria-pressed
                onClick={() => setExplore(false)}
              >
                <DoorOpen className="h-4 w-4" />
                Exit
              </Button>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-black/55 via-transparent to-transparent px-4 pb-10">
              <div className="pointer-events-auto">
                <Button
                  type="button"
                  size="lg"
                  variant="default"
                  className="chrome-border min-h-12 touch-manipulation gap-2 px-6 shadow-xl"
                  aria-pressed={false}
                  onClick={() => setExplore(true)}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Enter the room
                </Button>
              </div>
              <p className="flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
                {coarse ? (
                  <>
                    <Gamepad2 className="h-3.5 w-3.5" />
                    Touch · drag to look · tap fittings
                  </>
                ) : (
                  <>Keyboard · WASD walk · drag to look · F use</>
                )}
              </p>
            </div>
          )}
        </RoomPortal>
      </div>
    </section>
  );
}
