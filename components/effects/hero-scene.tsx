'use client';

import { Component, Suspense, useEffect, useState, type ReactNode } from 'react';
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

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        className="absolute inset-0 grid place-content-center bg-zinc-200 p-6 text-center text-zinc-800"
        role="status"
      >
        <p>The room could not load.</p>
        <button type="button" className="mt-3 underline" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
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
  const [visible, setVisible] = useState(false);
  const [requested, setRequested] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    const el = document.getElementById(observeId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { threshold: 0.05 }
    );
    observer.observe(el);
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRequested(true);
          preload.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    preload.observe(el);
    return () => {
      observer.disconnect();
      preload.disconnect();
    };
  }, [observeId]);

  return (
    <div
      className={cn('absolute inset-0 max-w-full overflow-hidden touch-pan-y', className)}
      aria-hidden={!controlsEnabled}
      style={{ pointerEvents: controlsEnabled ? 'auto' : 'none' }}
    >
      <SceneErrorBoundary>
        <Suspense fallback={<HeroSceneFallback />}>
          {requested || controlsEnabled ? (
            <HeroSceneCanvas
              active={pageVisible && (controlsEnabled || visible)}
              controlsEnabled={controlsEnabled}
              onExit={onExit}
            />
          ) : (
            <HeroSceneFallback />
          )}
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}
