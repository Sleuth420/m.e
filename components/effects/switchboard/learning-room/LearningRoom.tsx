'use client';

import { ROOM } from './room-layout';
import { FramedWalls } from './FramedWall';

/** Solid gallery shell plus ghost teaching frames on the origin corner. */
export function LearningRoom() {
  const midY = ROOM.height / 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM.width / 2, 0, ROOM.depth / 2]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#e8e8ea" roughness={0.92} />
      </mesh>

      {/* Far solid walls (not teaching cutaways) */}
      <mesh position={[ROOM.width, midY, ROOM.depth / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <meshStandardMaterial color="#d8d8dc" roughness={0.94} />
      </mesh>
      <mesh position={[ROOM.width / 2, midY, ROOM.depth]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.94} />
      </mesh>

      {/* Flat ceiling — oversized so the camera never sees a void above the walls */}
      <mesh position={[ROOM.width / 2, ROOM.height, ROOM.depth / 2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width + 4, ROOM.depth + 4]} />
        <meshStandardMaterial color="#c9c9ce" roughness={0.92} />
      </mesh>

      <FramedWalls />
    </group>
  );
}
