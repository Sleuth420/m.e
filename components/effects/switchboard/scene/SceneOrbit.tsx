'use client';

import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { TOUCH } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

type Props = {
  enabled: boolean;
};

type SbViewApi = {
  set: (pos: [number, number, number], target?: [number, number, number]) => void;
  get: () => { pos: number[]; target: number[] | null };
};

declare global {
  interface Window {
    __sbView?: SbViewApi;
  }
}

/** Orbit inspection — mounted only while explore mode is on. */
export function SceneOrbit({ enabled }: Props) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    if (!enabled) {
      delete window.__sbView;
      return;
    }
    window.__sbView = {
      set(pos, target = [0.05, -0.1, 0.15]) {
        const c = controlsRef.current;
        if (!c) return;
        c.object.position.set(pos[0], pos[1], pos[2]);
        c.target.set(target[0], target[1], target[2]);
        c.update();
      },
      get() {
        const c = controlsRef.current;
        return {
          pos: c?.object.position.toArray() ?? [],
          target: c?.target.toArray() ?? null,
        };
      },
    };
    return () => {
      delete window.__sbView;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      enableZoom
      enableRotate
      zoomToCursor={false}
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
      minDistance={2.6}
      maxDistance={6.5}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.64}
      minAzimuthAngle={-Math.PI * 0.5}
      maxAzimuthAngle={Math.PI * 0.42}
      target={[0.05, -0.05, 0.1]}
    />
  );
}
