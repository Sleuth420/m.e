'use client';

import { BOARD, CIRCUITS } from './circuit-data';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

/** Slim top-hat DIN rail — length matches the pole row, not empty enclosure */
export function DinRail({ materials }: Props) {
  const length = (CIRCUITS.length + 1) * BOARD.rcboWidth + 0.14;
  const y = BOARD.railY;
  const z = BOARD.railZ;

  return (
    <group position={[0, y, z]}>
      {/* Back web — slightly thicker for brushed metal read */}
      <mesh castShadow material={materials.dinRail} position={[0, 0, -0.035]}>
        <boxGeometry args={[length, 0.016, 0.048]} />
      </mesh>
      {/* Top flange */}
      <mesh position={[0, 0.032, 0.012]} castShadow material={materials.dinRail}>
        <boxGeometry args={[length, 0.03, 0.03]} />
      </mesh>
      {/* Bottom flange */}
      <mesh position={[0, -0.032, 0.012]} castShadow material={materials.dinRail}>
        <boxGeometry args={[length, 0.03, 0.03]} />
      </mesh>
      {/* Return lips */}
      <mesh position={[0, 0.042, 0]} material={materials.dinRail}>
        <boxGeometry args={[length, 0.01, 0.014]} />
      </mesh>
      <mesh position={[0, -0.042, 0]} material={materials.dinRail}>
        <boxGeometry args={[length, 0.01, 0.014]} />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * (length / 2 - 0.05), 0.015, 0.03]}>
          <mesh castShadow material={materials.plasticGrey}>
            <boxGeometry args={[0.06, 0.15, 0.08]} />
          </mesh>
          <mesh position={[0, 0.05, 0.015]} material={materials.plasticDark}>
            <boxGeometry args={[0.042, 0.028, 0.05]} />
          </mesh>
        </group>
      ))}

      {([-0.55, 0, 0.55] as const).map((x) => (
        <mesh key={x} position={[x, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]} material={materials.screw}>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 10]} />
        </mesh>
      ))}
    </group>
  );
}
