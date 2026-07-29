'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, type MeshStandardMaterial } from 'three';

function dampEmissive(mesh: Mesh | null, target: number, lambda: number, delta: number) {
  if (!mesh) return;
  const mat = mesh.material;
  if (Array.isArray(mat) || !('emissiveIntensity' in mat)) return;
  const std = mat as MeshStandardMaterial;
  std.emissiveIntensity = MathUtils.damp(std.emissiveIntensity, target, lambda, delta);
}

/** Damp a mesh material's emissiveIntensity toward a target. */
export function useEmissiveIntensity(target: number, lambda = 10) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    dampEmissive(ref.current, target, lambda, delta);
  });

  return ref;
}
