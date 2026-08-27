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

function FinishedPlaster({
  position,
  rotation,
  size,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#e7e4dc" roughness={0.92} metalness={0} envMapIntensity={0.4} />
    </mesh>
  );
}

/** Solid gallery shell plus ghost teaching frames on the origin corner. */
export function LearningRoom() {
  const midY = ROOM.height / 2;
  const skirting = 0.068;
  const skirtT = 0.014;

  return (
    <group>
      <GalleryFloor />

      <FinishedPlaster
        position={[ROOM.width, midY, ROOM.depth / 2]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[ROOM.depth, ROOM.height]}
      />
      <FinishedPlaster
        position={[ROOM.width / 2, midY, ROOM.depth]}
        rotation={[0, Math.PI, 0]}
        size={[ROOM.width, ROOM.height]}
      />

      <mesh position={[ROOM.width / 2, ROOM.height, ROOM.depth / 2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width + 4, ROOM.depth + 4]} />
        <meshStandardMaterial color="#d9d6cf" roughness={0.9} metalness={0} envMapIntensity={0.3} />
      </mesh>

      <mesh position={[ROOM.width / 2, skirting / 2, ROOM.depth - skirtT / 2]} receiveShadow>
        <boxGeometry args={[ROOM.width, skirting, skirtT]} />
        <meshStandardMaterial color="#efece6" roughness={0.78} metalness={0.02} />
      </mesh>
      <mesh position={[ROOM.width - skirtT / 2, skirting / 2, ROOM.depth / 2]} receiveShadow>
        <boxGeometry args={[skirtT, skirting, ROOM.depth]} />
        <meshStandardMaterial color="#efece6" roughness={0.78} metalness={0.02} />
      </mesh>

      <FramedWalls />
    </group>
  );
}
