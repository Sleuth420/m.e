'use client';

import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { SRGBColorSpace } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';

type PlateProps = {
  map: string;
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  interactive?: boolean;
  onToggle?: () => void;
};

/** Photograph of a real fitting on a thin plate — not invented CAD. */
export function PhotoPlate({
  map,
  width,
  height,
  position,
  rotation = [0, 0, 0],
  interactive,
  onToggle,
}: PlateProps) {
  const source = useTexture(map);
  const tex = useMemo(() => {
    const texture = source.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [source]);
  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={interactive ? (e) => onInteractiveEnter(e) : undefined}
      onPointerOut={interactive ? () => onInteractiveLeave() : undefined}
      onPointerUp={interactive && onToggle ? (e) => onInteractiveClick(e, onToggle) : undefined}
    >
      <mesh castShadow receiveShadow position={[0, 0, 0.004]}>
        <boxGeometry args={[width, height, 0.008]} />
        <meshStandardMaterial map={tex} roughness={0.38} metalness={0.02} />
      </mesh>
      {interactive && (
        <mesh position={[0, 0, 0.03]} visible={false}>
          <boxGeometry args={[width + 0.04, height + 0.06, 0.06]} />
        </mesh>
      )}
    </group>
  );
}
