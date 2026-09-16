'use client';

import { POLYHAVEN } from './room-assets';
import { ROOM } from './room-layout';
import { useRepeatingPbr } from './room-textures';
import { FramedWalls } from './FramedWall';
import { FinishedInterior } from './FinishedInterior';
import { useGameInput } from './GameInputContext';

function GalleryFloor() {
  const maps = useRepeatingPbr(POLYHAVEN.laminate, [ROOM.width / 2.5, ROOM.depth / 2.5]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[ROOM.width / 2, 0, ROOM.depth / 2]}
      receiveShadow
    >
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
  const { wiringView } = useGameInput();
  return (
    <group>
      <GalleryFloor />

      <mesh
        position={[ROOM.width / 2, ROOM.height, ROOM.depth / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM.width + 4, ROOM.depth + 4]} />
        <meshStandardMaterial
          color="#f3efe6"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.3}
        />
      </mesh>

      <group visible={wiringView}>
        <FramedWalls />
      </group>
      <FinishedInterior />
    </group>
  );
}
