'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const HeroSceneCanvas = dynamic(() => import('./hero-scene-canvas'), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

function HeroSceneFallback() {
  return (
    <div
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#3f3f46_0%,#18181b_70%)]"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30 retro-grid" />
      <div className="absolute left-1/2 top-1/2 h-[42%] w-[55%] -translate-x-1/2 -translate-y-[40%] rounded-sm border border-zinc-500/40 bg-zinc-300/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

interface HeroSceneProps {
  className?: string;
  observeId?: string;
  controlsEnabled?: boolean;
}

export function HeroScene({
  className,
  observeId = 'immersive-hero',
  controlsEnabled = false,
}: HeroSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = document.getElementById(observeId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeId]);

  if (reducedMotion) {
    return <HeroSceneFallback />;
  }

  return (
    <div
      className={cn('absolute inset-0 max-w-full overflow-hidden touch-pan-y', className)}
      aria-hidden={!controlsEnabled}
      style={{ pointerEvents: controlsEnabled ? 'auto' : 'none' }}
    >
      <Suspense fallback={<HeroSceneFallback />}>
        <HeroSceneCanvas active={visible} controlsEnabled={controlsEnabled} />
      </Suspense>
    </div>
  );
}
