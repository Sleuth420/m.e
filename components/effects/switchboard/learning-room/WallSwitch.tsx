'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';

type Props = {
  position: [number, number, number];
  /** Board wall faces +X (Ry 90). Kitchen splash faces +Z. */
  wall: 'board' | 'kitchen';
  on: boolean;
  onToggle: () => void;
  /** Cooktop isolator uses a red rocker. */
  isolator?: boolean;
};

/** Readable AU plate + rocker. Sketchfab switch.glb is two tiny plates and vanishes in-scene. */
export function WallSwitch({ position, wall, on, onToggle, isolator = false }: Props) {
  const rocker = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!rocker.current) return;
    rocker.current.rotation.x = MathUtils.damp(rocker.current.rotation.x, on ? -0.32 : 0.32, 14, delta);
  });

  return (
    <group
      position={position}
      rotation={wall === 'board' ? [0, Math.PI / 2, 0] : [0, 0, 0]}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onClick={(e) => onInteractiveClick(e, onToggle)}
    >
      <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.16, 0.016]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.28} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0, 0.02]} receiveShadow>
        <boxGeometry args={[0.062, 0.108, 0.008]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.45} />
      </mesh>
      <mesh ref={rocker} position={[0, 0, 0.032]} castShadow>
        <boxGeometry args={[0.04, 0.068, 0.02]} />
        <meshStandardMaterial
          color={isolator ? '#dc2626' : '#e4e4e7'}
          roughness={0.26}
          metalness={isolator ? 0.12 : 0.05}
        />
      </mesh>
      <mesh position={[0, 0.012, 0.043]}>
        <boxGeometry args={[0.028, 0.008, 0.004]} />
        <meshStandardMaterial color="#71717a" roughness={0.4} />
      </mesh>
      <mesh position={[0, on ? 0.024 : -0.024, 0.044]}>
        <boxGeometry args={[0.022, 0.012, 0.005]} />
        <meshStandardMaterial
          color={on ? '#4ade80' : '#a1a1aa'}
          emissive={on ? '#22c55e' : '#000'}
          emissiveIntensity={on ? 0.7 : 0}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.16, 0.22, 0.12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
