'use client';

import type { SwitchboardMaterials } from '../materials';

type Props = {
  materials: SwitchboardMaterials;
};

/** Recessed bar screw well — same language as module terminal mouths. */
export function TerminalWell({ materials }: Props) {
  return (
    <group>
      <mesh material={materials.plasticDark}>
        <boxGeometry args={[0.055, 0.04, 0.06]} />
      </mesh>
      <mesh position={[0, 0.022, 0]}>
        <boxGeometry args={[0.032, 0.012, 0.032]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      <mesh position={[0, 0.01, 0.012]} material={materials.screw}>
        <cylinderGeometry args={[0.011, 0.011, 0.018, 10]} />
      </mesh>
      <mesh position={[0, 0.018, 0.012]}>
        <boxGeometry args={[0.014, 0.003, 0.003]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
    </group>
  );
}
