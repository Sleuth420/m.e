'use client';

import {
  CIRCUITS,
  mainSwitchX,
  moduleBottomTerminal,
  moduleNeutralTerminal,
  moduleTopTerminal,
  rcboX,
} from './circuit-data';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

/**
 * Modern RCBO comb: ACTIVE (yellow) + NEUTRAL (blue) spines at the TOP.
 * Teeth drop into LINE and N tunnels — bottoms stay free for load tails.
 */
export function CombBus({ materials }: Props) {
  const first = rcboX(0);
  const last = rcboX(CIRCUITS.length - 1);
  const topA = moduleTopTerminal(first);
  const topN = moduleNeutralTerminal(first);
  const mid = (first + last) / 2;
  const span = last - first;
  const mainBot = moduleBottomTerminal(mainSwitchX());

  const activeY = topA[1] + 0.085;
  const activeZ = topA[2] - 0.035;
  const neutY = topN[1] + 0.07;
  const neutZ = topN[2] - 0.02;

  return (
    <group>
      {/* ——— ACTIVE comb (yellow) ——— */}
      <mesh position={[mid, activeY, activeZ]}>
        <boxGeometry args={[span + 0.1, 0.018, 0.022]} />
        <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.22} />
      </mesh>
      <mesh position={[mid, activeY + 0.01, activeZ]} material={materials.plasticYellow}>
        <boxGeometry args={[span + 0.08, 0.012, 0.03]} />
      </mesh>

      {CIRCUITS.map((c) => {
        const x = rcboX(c.index);
        const term = moduleTopTerminal(x);
        const pinH = activeY - term[1];
        return (
          <group key={`a-${c.id}`}>
            <mesh position={[x, term[1] + pinH / 2, activeZ]}>
              <boxGeometry args={[0.012, pinH, 0.01]} />
              <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.22} />
            </mesh>
            <mesh position={[x, term[1] + 0.008, term[2]]}>
              <boxGeometry args={[0.014, 0.012, 0.016]} />
              <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.22} />
            </mesh>
          </group>
        );
      })}

      {/* Main LOAD → active comb riser */}
      <mesh position={[first - 0.08, (activeY + mainBot[1]) * 0.5 + 0.18, activeZ - 0.02]}>
        <boxGeometry args={[0.014, 0.16, 0.012]} />
        <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.22} />
      </mesh>

      {/* ——— NEUTRAL comb (blue sleeve) ——— */}
      <mesh position={[mid + 0.02, neutY, neutZ]}>
        <boxGeometry args={[span + 0.06, 0.014, 0.018]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[mid + 0.02, neutY + 0.008, neutZ]} material={materials.plasticBlue}>
        <boxGeometry args={[span + 0.04, 0.01, 0.024]} />
      </mesh>

      {CIRCUITS.map((c) => {
        const x = rcboX(c.index);
        const term = moduleNeutralTerminal(x);
        const pinH = Math.max(neutY - term[1], 0.04);
        return (
          <group key={`n-${c.id}`}>
            <mesh position={[term[0], term[1] + pinH / 2, neutZ]}>
              <boxGeometry args={[0.01, pinH, 0.008]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[term[0], term[1] + 0.006, term[2]]}>
              <boxGeometry args={[0.012, 0.01, 0.014]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
