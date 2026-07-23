'use client';

import { BOARD } from './circuit-data';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

export function Enclosure({ materials }: Props) {
  const { width: w, height: h, depth: d, innerDepth } = BOARD;
  const wall = 0.08;
  const lip = 0.06;

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

      {/* Front lip */}
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

      {/* Mounting lugs */}
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (w / 2 + 0.05), h / 2 - 0.25, -d / 2]} material={materials.plasticGrey}>
          <boxGeometry args={[0.1, 0.16, 0.04]} />
        </mesh>
      ))}

      {/* Knockout rings only — no solid black bar */}
      {[0, 1, 2].map((i) => (
        <group key={`tl-${i}`} position={[-w / 2 + 0.32 + i * 0.26, h / 2 - 0.02, -d / 2 + 0.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.plasticGrey}>
            <torusGeometry args={[0.085, 0.01, 8, 20]} />
          </mesh>
        </group>
      ))}
      {[0, 1].map((i) => (
        <group key={`tr-${i}`} position={[w / 2 - 0.35 - i * 0.26, h / 2 - 0.02, -d / 2 + 0.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.plasticGrey}>
            <torusGeometry args={[0.085, 0.01, 8, 20]} />
          </mesh>
        </group>
      ))}

      {/* Hinges */}
      {[0.75, 0, -0.75].map((y) => (
        <mesh key={y} position={[w / 2 - 0.02, y, -d / 2 + innerDepth + 0.04]} rotation={[0, 0, Math.PI / 2]} material={materials.screw}>
          <cylinderGeometry args={[0.028, 0.028, 0.1, 12]} />
        </mesh>
      ))}

      {/* DIN channel recess */}
      <mesh position={[0, BOARD.railY - 0.02, -d / 2 + 0.12]} receiveShadow>
        <boxGeometry args={[w - 0.45, 0.32, 0.035]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Bottom exit — grommet rings only, no black tray slab */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`exit-${i}`}
          position={[-0.2 + i * 0.28, -h / 2 + 0.06, -d / 2 + 0.4]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.plasticGrey}
        >
          <torusGeometry args={[0.05, 0.009, 8, 18]} />
        </mesh>
      ))}
    </group>
  );
}
