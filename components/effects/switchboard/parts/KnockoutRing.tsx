'use client';

import type { SwitchboardMaterials } from '../materials';

type Props = {
  materials: SwitchboardMaterials;
  position: [number, number, number];
  radius?: number;
  tube?: number;
};

/** Cable-entry torus used on enclosure knockouts / exits. */
export function KnockoutRing({
  materials,
  position,
  radius = 0.085,
  tube = 0.01,
}: Props) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} material={materials.plasticGrey}>
      <torusGeometry args={[radius, tube, 8, 20]} />
    </mesh>
  );
}
