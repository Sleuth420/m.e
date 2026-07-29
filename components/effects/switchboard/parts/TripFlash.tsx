'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { BOARD } from '../circuit-data';

type Props = {
  x: number;
  active: boolean;
};

/** Brief orange flash when an RCBO is TEST-tripped. */
export function TripFlash({ x, active }: Props) {
  const lightRef = useRef<{ intensity: number }>(null);
  const intensity = useRef(0);

  useFrame((_, delta) => {
    intensity.current = MathUtils.damp(intensity.current, active ? 2.8 : 0, 8, delta);
    if (lightRef.current) lightRef.current.intensity = intensity.current;
  });

  return (
    <pointLight
      ref={lightRef as never}
      position={[x, BOARD.railY + 0.1, 0.55]}
      color="#d4a574"
      distance={2.0}
      decay={2}
      intensity={0}
    />
  );
}
