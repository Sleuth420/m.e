'use client';

import { BOARD, CIRCUITS, ROOM_CIRCUIT_IDS, rcboX } from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { KnockoutRing } from './parts/KnockoutRing';

type Props = {
  materials: SwitchboardMaterials;
};

export function Enclosure({ materials }: Props) {
  const { width: w, height: h, depth: d, innerDepth } = BOARD;
  const wall = 0.09;
  const lip = 0.07;

  const mainsKnockout = BOARD.mainsKnockout;
  const topLeftKnockouts = [0, 1, 2].map((i) => ({
    key: `tl-${i}`,
    // First gland is the mains TPS entry; others are sealed spare knockouts
    position:
      i === 0
        ? ([...mainsKnockout] as [number, number, number])
        : ([-BOARD.width / 2 + 0.32 + i * 0.26, BOARD.height / 2 - 0.02, -BOARD.depth / 2 + 0.45] as [
            number,
            number,
            number,
          ]),
  }));
  const topRightKnockouts = [0, 1].map((i) => ({
    key: `tr-${i}`,
    position: [w / 2 - 0.28 - i * 0.22, h / 2 - 0.02, -d / 2 + 0.45] as [number, number, number],
  }));
  // Floor gland plate — one hole per circuit, one neat row under the poles
  const plateZ = BOARD.glandPlateZ;
  const plateY = -h / 2 + 0.045;
  const firstX = rcboX(0);
  const lastX = rcboX(CIRCUITS.length - 1);
  const plateW = lastX - firstX + 0.28;
  const plateCx = (firstX + lastX) / 2;
  const exitKnockouts = CIRCUITS.map((c) => ({
    key: `exit-${c.id}`,
    position: [rcboX(c.index), plateY + 0.02, plateZ] as [number, number, number],
  }));

  return (
    <group>
      <mesh position={[0, 0, -d / 2 + 0.02]} castShadow receiveShadow material={materials.enclosure}>
        <boxGeometry args={[w, h, 0.06]} />
      </mesh>

      <mesh position={[0, -h / 2 + wall / 2, -d / 2 + innerDepth / 2]} castShadow receiveShadow material={materials.enclosureInner}>
        <boxGeometry args={[w - wall * 2, wall, innerDepth]} />
      </mesh>
      <mesh position={[0, h / 2 - wall / 2, -d / 2 + innerDepth / 2]} castShadow receiveShadow material={materials.enclosureInner}>
        <boxGeometry args={[w - wall * 2, wall, innerDepth]} />
      </mesh>
      <mesh position={[-w / 2 + wall / 2, 0, -d / 2 + innerDepth / 2]} castShadow receiveShadow material={materials.enclosure}>
        <boxGeometry args={[wall, h, innerDepth]} />
      </mesh>
      <mesh position={[w / 2 - wall / 2, 0, -d / 2 + innerDepth / 2]} castShadow receiveShadow material={materials.enclosure}>
        <boxGeometry args={[wall, h, innerDepth]} />
      </mesh>

      <mesh position={[0, h / 2 - lip / 2, -d / 2 + innerDepth + 0.01]} material={materials.enclosure}>
        <boxGeometry args={[w, lip, 0.04]} />
      </mesh>
      <mesh position={[0, -h / 2 + lip / 2, -d / 2 + innerDepth + 0.01]} material={materials.enclosure}>
        <boxGeometry args={[w, lip, 0.04]} />
      </mesh>
      <mesh position={[-w / 2 + lip / 2, 0, -d / 2 + innerDepth + 0.01]} material={materials.enclosure}>
        <boxGeometry args={[lip, h - lip * 2, 0.04]} />
      </mesh>
      <mesh position={[w / 2 + lip / 2 - lip, 0, -d / 2 + innerDepth + 0.01]} material={materials.enclosure}>
        <boxGeometry args={[lip, h - lip * 2, 0.04]} />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (w / 2 + 0.05), h / 2 - 0.25, -d / 2]} material={materials.plasticGrey}>
          <boxGeometry args={[0.1, 0.16, 0.04]} />
        </mesh>
      ))}

      {topLeftKnockouts.map(({ key, position }, i) => (
        <KnockoutRing
          key={key}
          materials={materials}
          position={position}
          radius={i === 0 ? 0.11 : 0.07}
          tube={i === 0 ? 0.014 : 0.01}
        />
      ))}
      {topRightKnockouts.map(({ key, position }) => (
        <KnockoutRing key={key} materials={materials} position={position} />
      ))}

      {[0.75, 0, -0.75].map((y) => (
        <mesh
          key={y}
          position={[w / 2 - 0.02, y, -d / 2 + innerDepth + 0.04]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.screw}
        >
          <cylinderGeometry args={[0.028, 0.028, 0.1, 12]} />
        </mesh>
      ))}

      <mesh position={[0, BOARD.railY - 0.02, -d / 2 + 0.12]} receiveShadow>
        <boxGeometry args={[Math.min(w - 0.2, lastX - firstX + 0.45), 0.32, 0.035]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Gland plate — one knockout per circuit in a single aligned row */}
      <mesh position={[plateCx, plateY, plateZ]} material={materials.plasticGrey} receiveShadow>
        <boxGeometry args={[plateW, 0.055, 0.3]} />
      </mesh>
      {exitKnockouts.map(({ key, position }, i) => {
        const used = ROOM_CIRCUIT_IDS.has(CIRCUITS[i]!.id);
        return (
          <group key={key} position={position}>
            {used ? (
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
                <cylinderGeometry args={[0.048, 0.048, 0.08, 16]} />
                <meshStandardMaterial color="#101012" roughness={0.92} metalness={0.04} />
              </mesh>
            ) : (
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
                <cylinderGeometry args={[0.05, 0.046, 0.03, 16]} />
                <meshStandardMaterial color="#c5c5c8" roughness={0.42} metalness={0.08} />
              </mesh>
            )}
            <KnockoutRing materials={materials} position={[0, 0.03, 0]} radius={0.058} tube={0.012} />
          </group>
        );
      })}
    </group>
  );
}
