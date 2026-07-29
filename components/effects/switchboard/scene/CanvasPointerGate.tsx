'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

type Props = {
  controlsEnabled: boolean;
};

/**
 * Parent pointer-events:none does NOT block the raw <canvas>.
 * Keep the DOM element in sync so page scroll works on mobile.
 */
export function CanvasPointerGate({ controlsEnabled }: Props) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    el.style.pointerEvents = controlsEnabled ? 'auto' : 'none';
    el.style.touchAction = controlsEnabled ? 'none' : 'pan-y';
    return () => {
      el.style.pointerEvents = 'none';
      el.style.touchAction = 'pan-y';
    };
  }, [gl, controlsEnabled]);

  return null;
}
