'use client';

import { Environment } from '@react-three/drei';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

/**
 * Workshop wall BEHIND the enclosure — never overlapping the board interior.
 */
export function SceneEnvironment({ materials }: Props) {
  return (
    <group>
      <color attach="background" args={['#1c1917']} />
      <fog attach="fog" args={['#1c1917', 10, 28]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3.5, 5.5, 4.5]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff7ed"
      />
      <directionalLight position={[-2.5, 2, 3]} intensity={0.5} color="#e2e8f0" />
      <pointLight position={[0.2, 2.2, 2.8]} intensity={0.55} color="#f97316" distance={12} />

      <Environment preset="warehouse" environmentIntensity={0.4} />

      {/* Far utility wall */}
      <mesh position={[0, 0.2, -2.4]} receiveShadow material={materials.wall}>
        <planeGeometry args={[16, 11]} />
      </mesh>
      {[-4, -1.5, 1.5, 4].map((x) => (
        <mesh key={x} position={[x, 0.2, -2.38]}>
          <planeGeometry args={[0.03, 11]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      ))}

      {/* Ply backboard — clearly BEHIND enclosure (enclosure back ≈ -0.46) */}
      <mesh position={[0, -0.1, -1.15]} castShadow receiveShadow material={materials.backboard}>
        <boxGeometry args={[5.6, 4.4, 0.1]} />
      </mesh>
      <mesh position={[0, -0.1, -1.08]}>
        <boxGeometry args={[5.35, 4.15, 0.02]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -2.2, 0.2]} receiveShadow>
        <boxGeometry args={[12, 0.1, 6]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
    </group>
  );
}
