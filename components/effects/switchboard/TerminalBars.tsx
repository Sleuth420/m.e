'use client';

import { CIRCUITS, barLayout, earthBarScrew, neutralBarScrew } from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { TerminalWell } from './parts/TerminalWell';

type Props = {
  materials: SwitchboardMaterials;
};

type BarProps = {
  materials: SwitchboardMaterials;
  cx: number;
  y: number;
  z: number;
  half: number;
  screwAt: (i: number) => [number, number, number];
  endCap: 'neutral' | 'earth';
};

function TerminalBar({ materials, cx, y, z, half, screwAt, endCap }: BarProps) {
  const screws = CIRCUITS.length + 2;
  const endX = endCap === 'neutral' ? -half / 2 - 0.035 : half / 2 + 0.035;

  return (
    <group position={[cx, y, z]}>
      <mesh castShadow material={materials.brass}>
        <boxGeometry args={[half, 0.042, 0.068]} />
      </mesh>
      <mesh position={[0, 0.024, 0]} material={materials.brassChannel}>
        <boxGeometry args={[half - 0.04, 0.006, 0.05]} />
      </mesh>
      {Array.from({ length: screws }, (_, i) => {
        const pos = screwAt(i);
        return (
          <group key={`${endCap}-${i}`} position={[pos[0] - cx, 0.012, 0.004]}>
            <TerminalWell materials={materials} />
          </group>
        );
      })}
      {endCap === 'neutral' ? (
        <mesh position={[endX, 0, 0]} material={materials.plasticDark}>
          <boxGeometry args={[0.048, 0.038, 0.048]} />
        </mesh>
      ) : (
        <mesh position={[endX, 0, 0]}>
          <boxGeometry args={[0.048, 0.038, 0.048]} />
          <meshStandardMaterial color="#65a30d" roughness={0.5} />
        </mesh>
      )}
    </group>
  );
}

/** Neutral LEFT + earth RIGHT — both on the back wall. */
export function TerminalBars({ materials }: Props) {
  const { neutHalf, earthHalf, earthCx, neutCx, y, z } = barLayout();

  return (
    <group>
      <TerminalBar
        materials={materials}
        cx={neutCx}
        y={y}
        z={z}
        half={neutHalf}
        screwAt={neutralBarScrew}
        endCap="neutral"
      />
      <TerminalBar
        materials={materials}
        cx={earthCx}
        y={y}
        z={z}
        half={earthHalf}
        screwAt={earthBarScrew}
        endCap="earth"
      />
    </group>
  );
}
