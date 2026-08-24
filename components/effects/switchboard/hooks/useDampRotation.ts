'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

/**
 * AU RCBO / isolator dolly: I is up.
 * Positive X tilts the top of the paddle toward the camera (ON proud at the I end).
 */
export const ROCKER_ON = 0.34;
export const ROCKER_OFF = -0.3;

/** Smoothly damp a group's rotation.x toward a target angle each frame. */
export function useDampRotation(targetAngle: number, lambda = 14) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x = MathUtils.damp(ref.current.rotation.x, targetAngle, lambda, delta);
  });

  return ref;
}
