'use client';

import { useMemo } from 'react';
import { CatmullRomCurve3, MeshStandardMaterial, TubeGeometry, Vector3 } from 'three';
import {
  BOARD,
  CIRCUITS,
  earthBarScrew,
  loomLateral,
  mainSwitchX,
  moduleBodyZ,
  moduleBottomTerminal,
  moduleTopTerminal,
  neutralBarScrew,
  rcboX,
  type Vec3,
} from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { useEarthStripeTexture } from './textures';

type Props = {
  materials: SwitchboardMaterials;
  liveById: Record<string, boolean>;
  mainLive: boolean;
};

function sanitize(points: Vec3[]): Vector3[] {
  const out: Vector3[] = [];
  for (const p of points) {
    if (!p || p.length !== 3) continue;
    const [x, y, z] = p;
    if (![x, y, z].every((n) => typeof n === 'number' && Number.isFinite(n))) continue;
    const v = new Vector3(x, y, z);
    const prev = out[out.length - 1];
    if (!prev || prev.distanceToSquared(v) > 0.00015) out.push(v);
  }
  return out;
}

function withSoftMids(points: Vec3[]): Vec3[] {
  if (points.length < 2) return points;
  const out: Vec3[] = [points[0]!];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    out.push([a[0] + dx * 0.3, a[1] + dy * 0.22 + Math.sign(dy || -1) * 0.035, a[2] + dz * 0.35]);
    out.push([a[0] + dx * 0.7, a[1] + dy * 0.78 - Math.sign(dy || -1) * 0.025, a[2] + dz * 0.65]);
    out.push(b);
  }
  return out;
}

function PathWire({
  points,
  radius,
  material,
  segments = 64,
  live = true,
}: {
  points: Vec3[];
  radius: number;
  material: MeshStandardMaterial;
  segments?: number;
  live?: boolean;
}) {
  const geometry = useMemo(() => {
    try {
      const cleaned = sanitize(withSoftMids(points));
      if (cleaned.length < 2) return null;
      while (cleaned.length < 4) {
        const last = cleaned[cleaned.length - 1]!;
        cleaned.push(last.clone().add(new Vector3(0.01, -0.008, 0.003)));
      }
      const curve = new CatmullRomCurve3(cleaned, false, 'centripetal', 0.5);
      return new TubeGeometry(curve, Math.max(segments, cleaned.length * 5), radius, 8, false);
    } catch {
      return null;
    }
  }, [points, radius, segments]);

  const mat = useMemo(() => {
    const m = material.clone();
    m.emissive.copy(material.color);
    m.emissiveIntensity = live ? 0.12 : 0;
    m.opacity = live ? 1 : 0.45;
    m.transparent = !live;
    m.needsUpdate = true;
    return m;
  }, [material, live]);

  if (!geometry) return null;
  return <mesh geometry={geometry} castShadow material={mat} />;
}

function behindFace(z: number): number {
  const faceZ = moduleBodyZ() + BOARD.moduleDepth * 0.36;
  return Math.min(z, faceZ - 0.1);
}

/** Grey TPS sheath; cores only fan where we intend (no stray black into the main) */
function TpsSheath({
  path,
  materials,
}: {
  path: Vec3[];
  materials: SwitchboardMaterials;
}) {
  const sheathMat = useMemo(
    () => new MeshStandardMaterial({ color: '#a8a29e', roughness: 0.55, metalness: 0.05 }),
    []
  );
  return <PathWire points={path} radius={0.03} material={sheathMat} />;
}

export function Wiring({ materials, liveById, mainLive }: Props) {
  const earthMap = useEarthStripeTexture();
  const earthMat = useMemo(() => {
    const m = materials.wireEarth.clone();
    m.map = earthMap;
    m.needsUpdate = true;
    return m;
  }, [materials.wireEarth, earthMap]);

  const paths = useMemo(() => {
    const mainX = mainSwitchX();
    const mainTop = moduleTopTerminal(mainX);
    const mainBot = moduleBottomTerminal(mainX);
    const firstTop = moduleTopTerminal(rcboX(0));
    const combFeed: Vec3 = [rcboX(0) - 0.08, firstTop[1] + 0.1, behindFace(firstTop[2])];
    const neutCombFeed: Vec3 = [
      rcboX(1) + BOARD.rcboWidth * 0.22,
      firstTop[1] + 0.08,
      behindFace(firstTop[2]) + 0.02,
    ];
    const exit = BOARD.outgoingExit;
    const n = CIRCUITS.length;
    const gather = BOARD.loomGather;

    // TPS sheath from left knockout — stops short of terminals
    const tpsSheath: Vec3[] = [
      BOARD.knockoutActive,
      [BOARD.knockoutActive[0] + 0.18, BOARD.knockoutActive[1] - 0.12, BOARD.knockoutActive[2] + 0.06],
      [mainX - 0.2, mainTop[1] + 0.28, behindFace(mainTop[2])],
      [mainX - 0.12, mainTop[1] + 0.18, behindFace(mainTop[2])],
    ];
    const tpsTip = tpsSheath[tpsSheath.length - 1]!;

    // Only RED core from TPS tip → main LINE (no black from here)
    const tpsActiveCore: Vec3[] = [
      tpsTip,
      [mainX - 0.04, mainTop[1] + 0.1, behindFace(mainTop[2])],
      [mainTop[0], mainTop[1] + 0.05, mainTop[2]],
      mainTop,
    ];

    // BLACK from its OWN knockout → N bar only (kept clear of the main / TPS tip)
    const neutralIn: Vec3[] = [
      BOARD.knockoutNeutral,
      [BOARD.knockoutNeutral[0] + 0.12, BOARD.knockoutNeutral[1] - 0.08, BOARD.barZ - 0.12],
      [BOARD.knockoutNeutral[0] + 0.35, BOARD.barY + 0.22, BOARD.barZ - 0.1],
      [neutralBarScrew(0)[0] - 0.08, BOARD.barY + 0.1, BOARD.barZ - 0.05],
      neutralBarScrew(0),
    ];

    // Earth supply from right knockout → earth bar
    const earthIn: Vec3[] = [
      BOARD.knockoutEarth,
      [BOARD.knockoutEarth[0] - 0.12, BOARD.knockoutEarth[1] - 0.1, BOARD.barZ - 0.08],
      [earthBarScrew(0)[0], BOARD.barY + 0.12, BOARD.barZ - 0.04],
      earthBarScrew(0),
    ];

    const enclosureBond: Vec3[] = [
      earthBarScrew(1),
      [earthBarScrew(1)[0] + 0.12, BOARD.barY - 0.12, BOARD.barZ - 0.1],
      [2.05, -0.1, -0.2],
      [2.08, -0.7, -0.26],
    ];

    const mainToComb: Vec3[] = [
      mainBot,
      [mainBot[0], mainBot[1] - 0.1, behindFace(mainBot[2])],
      [mainX - 0.12, BOARD.railY, behindFace(0)],
      [mainX - 0.12, firstTop[1] - 0.1, behindFace(0)],
      [rcboX(0) - 0.1, firstTop[1] + 0.05, behindFace(firstTop[2])],
      combFeed,
    ];

    const barToNeutComb: Vec3[] = [
      neutralBarScrew(2),
      [neutralBarScrew(2)[0], BOARD.barY - 0.12, behindFace(BOARD.barZ)],
      [rcboX(2), BOARD.barY - 0.28, behindFace(0)],
      [neutCombFeed[0], neutCombFeed[1] + 0.05, behindFace(neutCombFeed[2])],
      neutCombFeed,
    ];

    // One active per RCBO — bottom → exit
    const outgoingActive = CIRCUITS.map((c, i) => {
      const bot = moduleBottomTerminal(rcboX(c.index));
      const lat = loomLateral(i, n, 0.028);
      return [
        bot,
        [bot[0], bot[1] - 0.1, behindFace(bot[2])],
        [bot[0] + lat * 0.12, bot[1] - 0.22, behindFace(bot[2])],
        [gather[0] + lat * 0.4, gather[1] + 0.18, gather[2]],
        [gather[0] + lat, gather[1], gather[2] - 0.04],
        [exit[0] + lat, exit[1] + 0.05, exit[2]],
        [exit[0] + lat, exit[1], exit[2] - 0.04],
      ] as Vec3[];
    });

    // One neutral per RCBO — bottom → exit
    const outgoingNeutral = CIRCUITS.map((c, i) => {
      const x = rcboX(c.index);
      const bot: Vec3 = [
        x + 0.02,
        BOARD.railY - BOARD.moduleHeight / 2 - 0.01,
        moduleBodyZ() - BOARD.moduleDepth * 0.2,
      ];
      const lat = loomLateral(i, n, 0.028) + 0.01;
      return [
        bot,
        [bot[0], bot[1] - 0.12, behindFace(bot[2])],
        [gather[0] + lat, gather[1] + 0.12, gather[2] - 0.02],
        [gather[0] + lat, gather[1] - 0.02, gather[2] - 0.05],
        [exit[0] + lat, exit[1] + 0.04, exit[2]],
        [exit[0] + lat, exit[1], exit[2] - 0.04],
      ] as Vec3[];
    });

    /**
     * One earth per circuit — same loom dress as actives/neutrals.
     * Short drop from its own earth-bar screw → under that RCBO → gather → exit.
     * Never share screws / merge into trunks.
     */
    const outgoingEarth = CIRCUITS.map((c, i) => {
      const screw = earthBarScrew(i + 2);
      const x = rcboX(c.index);
      const pe: Vec3 = [
        x - 0.025,
        BOARD.railY - BOARD.moduleHeight / 2 - 0.01,
        moduleBodyZ() - BOARD.moduleDepth * 0.22,
      ];
      const lat = loomLateral(i, n, 0.028) + 0.02;
      const [sx, sy, sz] = screw;
      return [
        screw,
        [sx, sy - 0.1, behindFace(sz)],
        [sx * 0.35 + pe[0] * 0.65, pe[1] + 0.18, behindFace(pe[2])],
        pe,
        [pe[0], pe[1] - 0.12, behindFace(pe[2])],
        [gather[0] + lat, gather[1] + 0.12, gather[2] - 0.02],
        [gather[0] + lat, gather[1] - 0.02, gather[2] - 0.05],
        [exit[0] + lat, exit[1] + 0.04, exit[2]],
        [exit[0] + lat, exit[1], exit[2] - 0.04],
      ] as Vec3[];
    });

    return {
      tpsSheath,
      tpsActiveCore,
      neutralIn,
      earthIn,
      enclosureBond,
      mainToComb,
      barToNeutComb,
      outgoingActive,
      outgoingNeutral,
      outgoingEarth,
    };
  }, []);

  return (
    <group>
      <TpsSheath path={paths.tpsSheath} materials={materials} />
      <PathWire points={paths.tpsActiveCore} radius={0.012} material={materials.wireActive} live={mainLive} />

      <PathWire points={paths.neutralIn} radius={0.015} material={materials.wireNeutral} live={mainLive} />
      <PathWire points={paths.earthIn} radius={0.014} material={earthMat} />
      <PathWire points={paths.enclosureBond} radius={0.01} material={earthMat} />

      <PathWire points={paths.mainToComb} radius={0.013} material={materials.wireActive} live={mainLive} />
      <PathWire points={paths.barToNeutComb} radius={0.011} material={materials.wireNeutral} live={mainLive} />

      {paths.outgoingActive.map((pts, i) => (
        <PathWire
          key={`a-${i}`}
          points={pts}
          radius={0.01}
          material={materials.wireActive}
          live={liveById[CIRCUITS[i]!.id] ?? false}
        />
      ))}
      {paths.outgoingNeutral.map((pts, i) => (
        <PathWire
          key={`no-${i}`}
          points={pts}
          radius={0.008}
          material={materials.wireNeutral}
          live={liveById[CIRCUITS[i]!.id] ?? false}
        />
      ))}
      {paths.outgoingEarth.map((pts, i) => (
        <PathWire key={`e-${i}`} points={pts} radius={0.009} material={earthMat} />
      ))}
    </group>
  );
}
