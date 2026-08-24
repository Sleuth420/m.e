'use client';



import { useEffect, useRef, useState } from 'react';

import { DoorOpen, Gamepad2, Play, ShieldAlert } from 'lucide-react';

import { HeroScene } from '@/components/effects/hero-scene';

import { Button } from '@/components/ui/button';



/**

 * Full-bleed learning room. Copy lives above the canvas so it doesn't fight the 3D.

 * Play is OFF by default so the page can still scroll.

 */

export default function SwitchboardShowcase() {

  const [explore, setExplore] = useState(false);

  const [coarse, setCoarse] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');

    const update = () => setCoarse(mq.matches);

    update();

    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);

  }, []);



  useEffect(() => {

    if (!explore) return;

    stageRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });

    const html = document.documentElement;

    const prev = html.style.overflow;

    html.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {

      if (e.code === 'Escape') setExplore(false);

    };

    window.addEventListener('keydown', onKey);

    return () => {

      html.style.overflow = prev;

      window.removeEventListener('keydown', onKey);

    };

  }, [explore]);



  return (

    <section

      id="switchboard-showcase"

      className="w-full max-w-[100vw] border-y border-border/40 bg-gradient-to-b from-background via-background to-muted/20"

      aria-label="Interactive switchboard learning room"

    >

      <div className="container max-w-3xl px-4 py-8 text-center sm:py-12">

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Playable Electrical Installation</p>

        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">

          Walk a real circuit from the board to the load and discover the world of electricity

        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">

          Some circuits leave this switchboard: lighting, kitchen power, induction, oven, and fridge.

          Open the switchboard cover if you dare, trip RCBOs, and trace TPS through the

          walls. Dont touch a live wire!

        </p>
      </div>



      <div

        ref={stageRef}

        data-room-stage

        className="relative isolate min-h-[min(82vh,920px)] w-full overflow-x-clip overflow-y-hidden touch-pan-y sm:min-h-[min(78vh,840px)]"

      >

        <div

          className={`absolute inset-0 overflow-hidden ${explore ? '' : 'pointer-events-none'}`}

          aria-hidden={!explore}

        >

          <HeroScene

            observeId="switchboard-showcase"

            controlsEnabled={explore}

            onExit={() => setExplore(false)}

            className="!relative h-full min-h-[min(82vh,920px)] max-w-full sm:min-h-[min(78vh,840px)]"

          />

        </div>



        {explore ? (

          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end p-3 sm:p-4">

            <Button

              type="button"

              size="sm"

              variant="outline"

              className="pointer-events-auto chrome-border min-h-11 gap-2 bg-background/92 backdrop-blur-md"

              aria-pressed

              onClick={() => setExplore(false)}

            >

              <DoorOpen className="h-4 w-4" />

              Exit

            </Button>

          </div>

        ) : (

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 pb-8">

            <div className="pointer-events-auto">

              <Button

                type="button"

                size="lg"

                variant="default"

                className="chrome-border min-h-12 gap-2 px-6 shadow-xl"

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

                  Touch · joystick to walk

                </>

              ) : (

                <>

                  Keyboard · WASD to walk · click to interact

                </>

              )}

            </p>

          </div>

        )}

      </div>

    </section>

  );

}

