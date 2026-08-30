'use client';

import { POLYHAVEN } from './room-assets';
import { ROOM } from './room-layout';
import { useRepeatingPbr } from './room-textures';
import { FramedWalls } from './FramedWall';

function GalleryFloor() {
  const maps = useRepeatingPbr(POLYHAVEN.laminate, [ROOM.width / 0.6, ROOM.depth / 0.6]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM.width / 2, 0, ROOM.depth / 2]} receiveShadow>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        roughness={1}
        metalness={0.04}
      />
    </mesh>
  );
}

/** Open timber teaching frames on all four walls. */
export function LearningRoom() {
  return (
    <group>
      <GalleryFloor />

      <mesh position={[ROOM.width / 2, ROOM.height, ROOM.depth / 2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width + 4, ROOM.depth + 4]} />
        <meshStandardMaterial color="#d9d6cf" roughness={0.9} metalness={0} envMapIntensity={0.3} />
      </mesh>

      <FramedWalls />
    </group>
  );
}
