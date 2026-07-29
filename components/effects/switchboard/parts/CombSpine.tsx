'use client';

import type { MeshStandardMaterial } from 'three';
import type { CircuitPole } from '../circuit-data';
import { rcboX } from '../circuit-data';

type ToothTerminal = (x: number) => [number, number, number];

type Props = {
  circuits: CircuitPole[];
  mid: number;
  span: number;
  spineY: number;
  spineZ: number;
  metal: MeshStandardMaterial;
  sleeve: MeshStandardMaterial;
  endCap: MeshStandardMaterial;
  terminalAt: ToothTerminal;
  xOf?: (circuit: CircuitPole) => number;
  sleeveOffsetX?: number;
  /** Flat tooth width (X) / thickness (Z) */
  toothW?: number;
  toothT?: number;
  showFeedBlock?: boolean;
  feedX?: number;
};

/**
 * Insulated comb busbar: thick plastic body, colour end caps, flat copper teeth
 * dropping into TOP-face cable mouths (MAX9-style).
 */
export function CombSpine({
  circuits,
  mid,
  span,
  spineY,
  spineZ,
  metal,
  sleeve,
  endCap,
  terminalAt,
  xOf = (c) => rcboX(c.index),
  sleeveOffsetX = 0,
  toothW = 0.014,
  toothT = 0.006,
  showFeedBlock = false,
  feedX,
}: Props) {
  const bodyW = span + 0.14;
  const cx = mid + sleeveOffsetX;
  const endX = bodyW / 2 - 0.01;

  return (
    <group>
      {/* Copper spine under the insulation */}
      <mesh position={[cx, spineY, spineZ]} material={metal} castShadow={false}>
        <boxGeometry args={[bodyW - 0.04, 0.014, 0.016]} />
      </mesh>
      {/* Insulating body */}
      <mesh position={[cx, spineY + 0.012, spineZ]} material={sleeve} castShadow={false}>
        <boxGeometry args={[bodyW, 0.028, 0.034]} />
      </mesh>
      {/* Top cover lip */}
      <mesh position={[cx, spineY + 0.027, spineZ]} material={sleeve}>
        <boxGeometry args={[bodyW - 0.02, 0.008, 0.038]} />
      </mesh>
      {/* Front face rail — reads as moulded insulation */}
      <mesh position={[cx, spineY + 0.008, spineZ + 0.016]} material={sleeve} castShadow={false}>
        <boxGeometry args={[bodyW - 0.04, 0.018, 0.006]} />
      </mesh>

      {/* End caps */}
      <mesh position={[cx - endX, spineY + 0.01, spineZ]} material={endCap} castShadow={false}>
        <boxGeometry args={[0.032, 0.036, 0.04]} />
      </mesh>
      <mesh position={[cx + endX, spineY + 0.01, spineZ]} material={endCap} castShadow={false}>
        <boxGeometry args={[0.032, 0.036, 0.04]} />
      </mesh>

      {showFeedBlock && feedX !== undefined && (
        <group position={[feedX, spineY - 0.015, spineZ]}>
          <mesh material={endCap} castShadow={false}>
            <boxGeometry args={[0.062, 0.055, 0.044]} />
          </mesh>
          <mesh position={[0, -0.012, 0.014]} material={metal}>
            <boxGeometry args={[0.022, 0.032, 0.018]} />
          </mesh>
          {/* Entry tunnel hint */}
          <mesh position={[0, -0.028, 0]} material={metal}>
            <boxGeometry args={[0.016, 0.012, 0.022]} />
          </mesh>
        </group>
      )}

      {circuits.map((c) => {
        const term = terminalAt(xOf(c));
        const pinH = Math.max(spineY - term[1] - 0.004, 0.03);
        const pinZ = term[2];
        return (
          <group key={c.id}>
            {/* Slot shroud around tooth root */}
            <mesh
              position={[term[0], spineY - 0.006, pinZ]}
              material={sleeve}
              castShadow={false}
            >
              <boxGeometry args={[toothW + 0.01, 0.014, toothT + 0.012]} />
            </mesh>
            {/* Flat copper tooth */}
            <mesh
              position={[term[0], spineY - pinH / 2, pinZ]}
              material={metal}
              castShadow={false}
            >
              <boxGeometry args={[toothW, pinH, toothT]} />
            </mesh>
            {/* Tip into the top cable mouth */}
            <mesh position={[term[0], term[1] - 0.016, pinZ]} material={metal}>
              <boxGeometry args={[toothW * 1.08, 0.028, toothT * 1.15]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
