'use client';

import { CIRCUITS, barLayout, earthBarScrew, neutralBarScrew } from './circuit-data';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

/**
 * Terminal well: dark tunnel mouth + brass screw — same language as module bottoms.
 */
function TerminalWell({ materials }: { materials: SwitchboardMaterials }) {
  return (
    <group>
      {/* Recessed housing */}
      <mesh material={materials.plasticDark}>
        <boxGeometry args={[0.055, 0.04, 0.06]} />
      </mesh>
      {/* Hole facing up */}
      <mesh position={[0, 0.022, 0]}>
        <boxGeometry args={[0.032, 0.012, 0.032]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      {/* Screw head in the well */}
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

/**
 * Neutral LEFT + earth RIGHT.
 * Screws are tunnel wells (not floating cubes). End markers are slim ID caps only.
 */
export function TerminalBars({ materials }: Props) {
  const { half, earthCx, neutCx, y, z } = barLayout();
  const screws = CIRCUITS.length + 2;

  return (
    <group>
      {/* NEUTRAL — left */}
      <group position={[neutCx, y, z]}>
        <mesh castShadow material={materials.brass}>
          <boxGeometry args={[half, 0.042, 0.068]} />
        </mesh>
        <mesh position={[0, 0.024, 0]}>
          <boxGeometry args={[half - 0.04, 0.006, 0.05]} />
          <meshStandardMaterial color="#92400e" metalness={0.92} roughness={0.28} />
        </mesh>
        {Array.from({ length: screws }, (_, i) => {
          const pos = neutralBarScrew(i);
          return (
            <group key={`n-${i}`} position={[pos[0] - neutCx, 0.012, 0.004]}>
              <TerminalWell materials={materials} />
            </group>
          );
        })}
        {/* Slim N ID cap — not a random cube */}
        <mesh position={[-half / 2 - 0.035, 0, 0]} material={materials.plasticDark}>
          <boxGeometry args={[0.048, 0.038, 0.048]} />
        </mesh>
      </group>

      {/* EARTH — right */}
      <group position={[earthCx, y, z]}>
        <mesh castShadow material={materials.brass}>
          <boxGeometry args={[half, 0.042, 0.068]} />
        </mesh>
        <mesh position={[0, 0.024, 0]}>
          <boxGeometry args={[half - 0.04, 0.006, 0.05]} />
          <meshStandardMaterial color="#92400e" metalness={0.92} roughness={0.28} />
        </mesh>
        {Array.from({ length: screws }, (_, i) => {
          const pos = earthBarScrew(i);
          return (
            <group key={`e-${i}`} position={[pos[0] - earthCx, 0.012, 0.004]}>
              <TerminalWell materials={materials} />
            </group>
          );
        })}
        <mesh position={[half / 2 + 0.035, 0, 0]}>
          <boxGeometry args={[0.048, 0.038, 0.048]} />
          <meshStandardMaterial color="#65a30d" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
