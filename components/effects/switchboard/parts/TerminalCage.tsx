'use client';

import type { SwitchboardMaterials } from '../materials';

type Props = {
  materials: SwitchboardMaterials;
  /** +1 = top cage (mouth up), -1 = bottom cage (mouth down) */
  side: 1 | -1;
  position: [number, number, number];
  withScrew?: boolean;
  width?: number;
  height?: number;
  depth?: number;
};

/** Dark terminal tunnel mouth used on module tops/bottoms and bar wells. */
export function TerminalCage({
  materials,
  side,
  position,
  withScrew = false,
  width = 0.08,
  height = 0.05,
  depth = 0.085,
}: Props) {
  const mouthY = side * 0.028;
  const screwY = side * 0.008;

  return (
    <group position={position}>
      <mesh material={materials.plasticDark}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      <mesh position={[0, mouthY, 0]}>
        <boxGeometry args={[width * 0.6, 0.016, depth * 0.56]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      {withScrew && (
        <mesh position={[0, screwY, 0.018]} material={materials.screw}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 10]} />
        </mesh>
      )}
    </group>
  );
}
