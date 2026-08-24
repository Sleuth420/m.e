'use client';

import { HEIGHTS, ROOM, boardWallStudZs, fridgeWallStudXs } from './room-layout';

const timber = '#7a756c';
const timberDark = '#5c5852';
const sarking = '#3f3f46';

function Stud({ position, args }: { position: [number, number, number]; args: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={timber} roughness={0.86} metalness={0.02} />
    </mesh>
  );
}

/** Ghost plaster + timber frame on the two teaching walls (corner at origin). */
export function FramedWalls() {
  const boardZs = boardWallStudZs();
  const fridgeXs = fridgeWallStudXs();
  const studH = ROOM.height - ROOM.plate * 2;
  const studY = ROOM.plate + studH / 2;
  const s = ROOM.studSize;

  return (
    <group>
      {/* Sarking behind board wall */}
      <mesh position={[-s - 0.01, ROOM.height / 2, ROOM.depth / 2]} receiveShadow>
        <boxGeometry args={[0.02, ROOM.height, ROOM.depth + 0.2]} />
        <meshStandardMaterial color={sarking} roughness={0.95} />
      </mesh>
      {/* Sarking behind fridge wall */}
      <mesh position={[ROOM.width / 2, ROOM.height / 2, -s - 0.01]} receiveShadow>
        <boxGeometry args={[ROOM.width + 0.2, ROOM.height, 0.02]} />
        <meshStandardMaterial color={sarking} roughness={0.95} />
      </mesh>

      {/* Board wall plaster — faces +X */}
      <mesh position={[0.012, ROOM.height / 2, ROOM.depth / 2]} rotation={[0, Math.PI / 2, 0]} renderOrder={1}>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <meshStandardMaterial
          color="#f1f0ec"
          roughness={0.94}
          transparent
          opacity={ROOM.plasterOpacity}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[HEIGHTS.cavityX, ROOM.plate / 2, ROOM.depth / 2]} receiveShadow>
        <boxGeometry args={[s, ROOM.plate, ROOM.depth + s]} />
        <meshStandardMaterial color={timberDark} roughness={0.9} />
      </mesh>
      <mesh position={[HEIGHTS.cavityX, ROOM.height - ROOM.plate / 2, ROOM.depth / 2]} receiveShadow>
        <boxGeometry args={[s, ROOM.plate, ROOM.depth + s]} />
        <meshStandardMaterial color={timberDark} roughness={0.9} />
      </mesh>

      {boardZs.map((z) => (
        <Stud key={`bz-${z}`} position={[HEIGHTS.cavityX, studY, z]} args={[s, studH, s]} />
      ))}

      {boardZs.slice(0, -1).map((z) => (
        <mesh
          key={`bn-${z}`}
          position={[HEIGHTS.cavityX, ROOM.nogginY, z + ROOM.studSpacing / 2]}
          receiveShadow
        >
          <boxGeometry args={[s, s * 0.8, ROOM.studSpacing - s]} />
          <meshStandardMaterial color={timber} roughness={0.86} />
        </mesh>
      ))}

      {/* Fridge wall plaster — faces +Z */}
      <mesh position={[ROOM.width / 2, ROOM.height / 2, 0.012]} renderOrder={1}>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
        <meshStandardMaterial
          color="#f1f0ec"
          roughness={0.94}
          transparent
          opacity={ROOM.plasterOpacity}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[ROOM.width / 2, ROOM.plate / 2, HEIGHTS.cavityZ]} receiveShadow>
        <boxGeometry args={[ROOM.width + s, ROOM.plate, s]} />
        <meshStandardMaterial color={timberDark} roughness={0.9} />
      </mesh>
      <mesh position={[ROOM.width / 2, ROOM.height - ROOM.plate / 2, HEIGHTS.cavityZ]} receiveShadow>
        <boxGeometry args={[ROOM.width + s, ROOM.plate, s]} />
        <meshStandardMaterial color={timberDark} roughness={0.9} />
      </mesh>

      {fridgeXs.map((x) => (
        <Stud key={`fx-${x}`} position={[x, studY, HEIGHTS.cavityZ]} args={[s, studH, s]} />
      ))}

      {fridgeXs.slice(0, -1).map((x) => (
        <mesh
          key={`fn-${x}`}
          position={[x + ROOM.studSpacing / 2, ROOM.nogginY, HEIGHTS.cavityZ]}
          receiveShadow
        >
          <boxGeometry args={[ROOM.studSpacing - s, s * 0.8, s]} />
          <meshStandardMaterial color={timber} roughness={0.86} />
        </mesh>
      ))}
    </group>
  );
}
