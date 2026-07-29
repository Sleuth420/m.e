'use client';

import { BOARD } from '../circuit-data';
import type { SwitchboardMaterials } from '../materials';

type Props = {
  materials: SwitchboardMaterials;
  w: number;
};

/** DIN hat-rail clip on the rear of a module body. */
export function DinClip({ materials, w }: Props) {
  return (
    <group position={[0, 0, -BOARD.moduleDepth / 2 - 0.04]}>
      <mesh material={materials.plasticDark} castShadow position={[0, 0, -0.01]}>
        <boxGeometry args={[w - 0.06, 0.1, 0.022]} />
      </mesh>
      <mesh position={[0, 0.042, -0.03]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.016, 0.03]} />
      </mesh>
      <mesh position={[0, 0.032, -0.042]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.014, 0.01]} />
      </mesh>
      <mesh position={[0, -0.042, -0.028]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.014, 0.024]} />
      </mesh>
    </group>
  );
}
