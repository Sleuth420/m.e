'use client';

import { Suspense, useEffect, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const HeroSceneCanvas = dynamic(() => import('./hero-scene-canvas'), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

function HeroSceneFallback() {
  return (
    <div
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#e4e4e7_0%,#d4d4d8_70%)]"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-20 retro-grid" />
    </div>
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

interface HeroSceneProps {
  className?: string;
  observeId?: string;
  controlsEnabled?: boolean;
  onExit?: () => void;
}

export function HeroScene({
  className,
  observeId = 'immersive-hero',
  controlsEnabled = false,
  onExit,
}: HeroSceneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);

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
        <HeroSceneCanvas active={visible} controlsEnabled={controlsEnabled} onExit={onExit} />
      </Suspense>
    </div>
  );
}
