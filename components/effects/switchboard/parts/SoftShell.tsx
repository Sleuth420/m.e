'use client';

import type { RefObject } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { Mesh } from 'three';

type Props = {
  w: number;
  h: number;
  d: number;
  color: string;
  emissive?: string;
  bodyRef: RefObject<Mesh | null>;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
};

/** Soften a box silhouette with edge fillets along vertical corners. */
export function SoftShell({
  w,
  h,
  d,
  color,
  emissive = '#22d3ee',
  bodyRef,
  onPointerOver,
  onPointerOut,
}: Props) {
  const r = 0.012;
  return (
    <group>
      <mesh ref={bodyRef} castShadow onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <boxGeometry args={[w - r * 2, h, d]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.06}
          emissive={emissive}
          emissiveIntensity={0}
        />
      </mesh>
      <mesh position={[-(w / 2 - r / 2), 0, 0]} castShadow>
        <boxGeometry args={[r, h - r * 2, d - r * 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
      </mesh>
      <mesh position={[w / 2 - r / 2, 0, 0]} castShadow>
        <boxGeometry args={[r, h - r * 2, d - r * 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
      </mesh>
      {([-1, 1] as const).flatMap((sx) =>
        ([-1, 1] as const).map((sz) => (
          <mesh key={`${sx}-${sz}`} position={[sx * (w / 2 - r), 0, sz * (d / 2 - r)]} castShadow>
            <cylinderGeometry args={[r, r, h - r * 2, 10]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
          </mesh>
        ))
      )}
    </group>
  );
}
