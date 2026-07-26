'use client';

import { Environment } from '@react-three/drei';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
};

/**
 * Workshop set with layered depth — wall → shelf → backboard → board → floor.
 */
export function SceneEnvironment({ materials }: Props) {
  return (
    <group>
      <color attach="background" args={['#141210']} />
      <fog attach="fog" args={['#141210', 7.5, 22]} />

      <ambientLight intensity={0.32} />
      <hemisphereLight args={['#44505c', '#1c1917', 0.45]} />

      {/* Key — warm workshop lamp from upper right */}
      <directionalLight
        position={[4.2, 6.2, 5.2]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.00025}
        color="#fff7ed"
      />
      {/* Fill — cooler bounce from left */}
      <directionalLight position={[-3.8, 2.4, 2.8]} intensity={0.38} color="#cbd5e1" />
      {/* Rim — separates board from wall */}
      <directionalLight position={[-1.2, 1.8, -3.5]} intensity={0.55} color="#fb923c" />
      <pointLight position={[0.15, 2.4, 3.2]} intensity={0.7} color="#f97316" distance={14} decay={2} />
      <pointLight position={[-2.4, 0.4, 1.6]} intensity={0.28} color="#94a3b8" distance={8} decay={2} />

      <Environment preset="warehouse" environmentIntensity={0.32} />

      {/* Far utility wall */}
      <mesh position={[0, 0.15, -3.4]} receiveShadow material={materials.wall}>
        <planeGeometry args={[18, 12]} />
      </mesh>
      {[-5, -2.5, 0, 2.5, 5].map((x) => (
        <mesh key={x} position={[x, 0.15, -3.38]}>
          <planeGeometry args={[0.04, 12]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.95} />
        </mesh>
      ))}

      {/* Mid-depth shelf / conduit layer */}
      <mesh position={[-2.6, 1.55, -2.35]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 0.55]} />
        <meshStandardMaterial color="#44403c" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[2.5, 1.35, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.07, 0.45]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Conduit runs */}
      <mesh position={[-1.8, 2.05, -2.55]} rotation={[0, 0, -0.08]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 3.2, 12]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.35} metalness={0.75} />
      </mesh>
      <mesh position={[1.6, 2.15, -2.4]} rotation={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.038, 0.038, 2.6, 12]} />
        <meshStandardMaterial color="#78716c" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Ply backboard — clearly BEHIND enclosure */}
      <mesh position={[0, -0.08, -1.35]} castShadow receiveShadow material={materials.backboard}>
        <boxGeometry args={[5.8, 4.5, 0.12]} />
      </mesh>
      <mesh position={[0, -0.08, -1.26]}>
        <boxGeometry args={[5.5, 4.25, 0.02]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      {/* Mounting battens for depth between backboard and wall */}
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, -0.08, -1.55]} castShadow>
          <boxGeometry args={[0.12, 4.3, 0.28]} />
          <meshStandardMaterial color="#44403c" roughness={0.85} />
        </mesh>
      ))}

      {/* Side return walls — frame the board in 3D space */}
      <mesh position={[-5.2, 0.1, -0.6]} rotation={[0, Math.PI / 2.4, 0]} receiveShadow>
        <planeGeometry args={[6.5, 11]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} />
      </mesh>
      <mesh position={[5.4, 0.1, -0.4]} rotation={[0, -Math.PI / 2.6, 0]} receiveShadow>
        <planeGeometry args={[6.5, 11]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} />
      </mesh>

      {/* Floor with slight forward rake into camera space */}
      <mesh position={[0, -2.15, 0.6]} receiveShadow rotation={[-0.02, 0, 0]}>
        <boxGeometry args={[14, 0.12, 8]} />
        <meshStandardMaterial color="#1c1917" roughness={0.88} metalness={0.05} />
      </mesh>
      {/* Floor edge strip */}
      <mesh position={[0, -2.08, 4.4]}>
        <boxGeometry args={[14, 0.04, 0.2]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
    </group>
  );
}
