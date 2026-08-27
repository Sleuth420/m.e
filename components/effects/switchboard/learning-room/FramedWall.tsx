'use client';

import { POLYHAVEN } from './room-assets';
import { BOARD_OPENING, HEIGHTS, ROOM, boardWallStudZs, fridgeWallStudXs } from './room-layout';
import { useSizedPbr, type PbrMaps } from './room-textures';

/** H2 MGP radiata — straw construction timber, not furniture stain. */
const PINE = '#eee4b4';
const SARKING = '#585860';
const NOGGIN_YS = ROOM.nogginYs;

function skipRaycast() {}

function Timber({
  position,
  args,
  maps,
}: {
  position: [number, number, number];
  args: [number, number, number];
  maps: PbrMaps;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        color={PINE}
        roughness={0.92}
        metalness={0}
        envMapIntensity={0.45}
        normalScale={[0.85, 0.85]}
      />
    </mesh>
  );
}

const PLASTER_T = 0.012;

function GhostPlasterMat() {
  return (
    <meshStandardMaterial
      color="#fff8ee"
      roughness={0.86}
      metalness={0}
      transparent
      opacity={ROOM.plasterOpacity}
      depthWrite={false}
      envMapIntensity={0.55}
    />
  );
}

/** 10 mm plasterboard sheet — see-through, but thick enough to read as lining. */
function GhostPlaster({
  position,
  size,
  wall,
}: {
  position: [number, number, number];
  size: [number, number];
  wall: 'board' | 'kitchen';
}) {
  const args: [number, number, number] =
    wall === 'board' ? [PLASTER_T, size[1], size[0]] : [size[0], size[1], PLASTER_T];
  return (
    <mesh position={position} renderOrder={1} raycast={skipRaycast}>
      <boxGeometry args={args} />
      <GhostPlasterMat />
    </mesh>
  );
}

function openingHitsZ(z: number, pad = 0.02) {
  return z > BOARD_OPENING.z0 - pad && z < BOARD_OPENING.z1 + pad;
}

function openingHitsY(y: number, pad = 0.04) {
  return y > BOARD_OPENING.y0 - pad && y < BOARD_OPENING.y1 + pad;
}

/** MGP10 pine frame: plates, studs at 450, noggins at 900 / 1800, switchboard bay trimmed out. */
export function FramedWalls() {
  const vMaps = useSizedPbr(POLYHAVEN.treatedPine, [0.09, 2.6], 0.45, 0);
  const hMaps = useSizedPbr(POLYHAVEN.treatedPine, [2.6, 0.09], 0.45, Math.PI / 2);
  const plyMaps = useSizedPbr(POLYHAVEN.plywood, [0.55, 0.7], 0.55, 0);
  const boardZs = boardWallStudZs();
  const fridgeXs = fridgeWallStudXs();
  const s = ROOM.studSize;
  const doubleTop = ROOM.plate * 2;
  const studH = ROOM.height - ROOM.plate - doubleTop;
  const studY = ROOM.plate + studH / 2;
  const cx = HEIGHTS.cavityX;
  const cz = HEIGHTS.cavityZ;
  const openW = BOARD_OPENING.z1 - BOARD_OPENING.z0;
  const openH = BOARD_OPENING.y1 - BOARD_OPENING.y0;
  const openZ = (BOARD_OPENING.z0 + BOARD_OPENING.z1) / 2;
  const openY = (BOARD_OPENING.y0 + BOARD_OPENING.y1) / 2;
  const lintelT = s * 0.9;
  const sillY = BOARD_OPENING.y0;
  const headY = BOARD_OPENING.y1;
  const crippleBelowH = Math.max(0.08, sillY - lintelT / 2 - ROOM.plate);
  const crippleBelowY = ROOM.plate + crippleBelowH / 2;
  const topOfFrame = ROOM.height - doubleTop;
  const crippleAboveH = Math.max(0.08, topOfFrame - (headY + lintelT / 2));
  const crippleAboveY = headY + lintelT / 2 + crippleAboveH / 2;
  const jackH = headY - lintelT / 2 - ROOM.plate;
  const jackY = ROOM.plate + jackH / 2;
  const crippleZs = [openZ - openW * 0.28, openZ + openW * 0.28];

  return (
    <group>
      <mesh position={[-s - 0.012, ROOM.height / 2, ROOM.depth / 2]} receiveShadow>
        <boxGeometry args={[0.02, ROOM.height, ROOM.depth + 0.2]} />
        <meshStandardMaterial color={SARKING} roughness={0.95} />
      </mesh>
      <mesh position={[ROOM.width / 2, ROOM.height / 2, -s - 0.012]} receiveShadow>
        <boxGeometry args={[ROOM.width + 0.2, ROOM.height, 0.02]} />
        <meshStandardMaterial color={SARKING} roughness={0.95} />
      </mesh>

      <GhostPlaster
        position={[PLASTER_T / 2, ROOM.height / 2, BOARD_OPENING.z0 / 2]}
        size={[Math.max(0.05, BOARD_OPENING.z0), ROOM.height]}
        wall="board"
      />
      <GhostPlaster
        position={[PLASTER_T / 2, ROOM.height / 2, (BOARD_OPENING.z1 + ROOM.depth) / 2]}
        size={[Math.max(0.05, ROOM.depth - BOARD_OPENING.z1), ROOM.height]}
        wall="board"
      />
      <GhostPlaster
        position={[PLASTER_T / 2, BOARD_OPENING.y0 / 2, openZ]}
        size={[openW, Math.max(0.05, BOARD_OPENING.y0)]}
        wall="board"
      />
      <GhostPlaster
        position={[PLASTER_T / 2, (BOARD_OPENING.y1 + ROOM.height) / 2, openZ]}
        size={[openW, Math.max(0.05, ROOM.height - BOARD_OPENING.y1)]}
        wall="board"
      />

      <Timber maps={hMaps} position={[cx, ROOM.plate / 2, ROOM.depth / 2]} args={[s, ROOM.plate, ROOM.depth + s]} />
      <Timber
        maps={hMaps}
        position={[cx, ROOM.height - ROOM.plate / 2, ROOM.depth / 2]}
        args={[s, ROOM.plate, ROOM.depth + s]}
      />
      <Timber
        maps={hMaps}
        position={[cx, ROOM.height - ROOM.plate - ROOM.plate / 2, ROOM.depth / 2]}
        args={[s, ROOM.plate, ROOM.depth + s]}
      />

      {boardZs.map((z) =>
        openingHitsZ(z) ? null : (
          <Timber key={`bz-${z}`} maps={vMaps} position={[cx, studY, z]} args={[s, studH, s]} />
        ),
      )}

      {NOGGIN_YS.map((y) =>
        boardZs.slice(0, -1).map((z) => {
          const mid = z + ROOM.studSpacing / 2;
          if (openingHitsZ(mid) && openingHitsY(y)) return null;
          return (
            <Timber
              key={`bn-${y}-${z}`}
              maps={hMaps}
              position={[cx, y, mid]}
              args={[s, s * 0.82, ROOM.studSpacing - s]}
            />
          );
        }),
      )}

      <Timber maps={vMaps} position={[cx, jackY, BOARD_OPENING.z0]} args={[s, jackH, s]} />
      <Timber maps={vMaps} position={[cx, jackY, BOARD_OPENING.z1]} args={[s, jackH, s]} />
      <Timber maps={hMaps} position={[cx, sillY, openZ]} args={[s, lintelT, openW - s]} />
      <Timber maps={hMaps} position={[cx, headY, openZ]} args={[s, lintelT, openW - s]} />
      {crippleZs.map((z) => (
        <group key={`cr-${z}`}>
          <Timber maps={vMaps} position={[cx, crippleBelowY, z]} args={[s, crippleBelowH, s]} />
          <Timber maps={vMaps} position={[cx, crippleAboveY, z]} args={[s, crippleAboveH, s]} />
        </group>
      ))}

      <mesh position={[0.02, openY, openZ]} receiveShadow>
        <boxGeometry args={[0.012, openH - 0.02, openW - 0.02]} />
        <meshStandardMaterial
          map={plyMaps.map}
          normalMap={plyMaps.normalMap}
          roughnessMap={plyMaps.roughnessMap}
          color="#d7c49a"
          roughness={1}
          metalness={0.04}
          envMapIntensity={0.55}
          normalScale={[0.4, 0.4]}
        />
      </mesh>

      <GhostPlaster
        position={[ROOM.width / 2, ROOM.height / 2, PLASTER_T / 2]}
        size={[ROOM.width, ROOM.height]}
        wall="kitchen"
      />

      <Timber maps={hMaps} position={[ROOM.width / 2, ROOM.plate / 2, cz]} args={[ROOM.width + s, ROOM.plate, s]} />
      <Timber
        maps={hMaps}
        position={[ROOM.width / 2, ROOM.height - ROOM.plate / 2, cz]}
        args={[ROOM.width + s, ROOM.plate, s]}
      />
      <Timber
        maps={hMaps}
        position={[ROOM.width / 2, ROOM.height - ROOM.plate - ROOM.plate / 2, cz]}
        args={[ROOM.width + s, ROOM.plate, s]}
      />

      {fridgeXs.map((x) => (
        <Timber key={`fx-${x}`} maps={vMaps} position={[x, studY, cz]} args={[s, studH, s]} />
      ))}

      {NOGGIN_YS.map((y) =>
        fridgeXs.slice(0, -1).map((x) => (
          <Timber
            key={`fn-${y}-${x}`}
            maps={hMaps}
            position={[x + ROOM.studSpacing / 2, y, cz]}
            args={[ROOM.studSpacing - s, s * 0.82, s]}
          />
        )),
      )}
    </group>
  );
}
