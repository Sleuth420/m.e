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

/** AU 76×116 plate + single rocker — sits on the plaster, not a toy stack of boxes. */
export function WallSwitch({ position, wall, on, onToggle, isolator = false }: Props) {
  const rocker = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!rocker.current) return;
    rocker.current.rotation.x = MathUtils.damp(rocker.current.rotation.x, on ? -0.28 : 0.28, 14, delta);
  });

  return (
    <group
      position={position}
      rotation={wall === 'board' ? [0, Math.PI / 2, 0] : [0, 0, 0]}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onClick={(e) => onInteractiveClick(e, onToggle)}
    >
      <mesh position={[0, 0, 0.006]} castShadow receiveShadow>
        <boxGeometry args={[0.076, 0.116, 0.01]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.22} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0, 0.012]} receiveShadow>
        <boxGeometry args={[0.052, 0.086, 0.004]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.38} />
      </mesh>
      <mesh ref={rocker} position={[0, 0, 0.022]} castShadow>
        <boxGeometry args={[0.021, 0.04, 0.012]} />
        <meshStandardMaterial
          color={isolator ? '#b91c1c' : '#fafafa'}
          roughness={0.22}
          metalness={isolator ? 0.1 : 0.04}
        />
      </mesh>
      <mesh position={[0, 0.008, 0.029]}>
        <boxGeometry args={[0.014, 0.005, 0.002]} />
        <meshStandardMaterial color="#52525b" roughness={0.4} />
      </mesh>
      <mesh position={[0, on ? 0.014 : -0.014, 0.03]}>
        <boxGeometry args={[0.01, 0.007, 0.002]} />
        <meshStandardMaterial
          color={on ? '#4ade80' : '#a1a1aa'}
          emissive={on ? '#22c55e' : '#000'}
          emissiveIntensity={on ? 0.55 : 0}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.14, 0.18, 0.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
