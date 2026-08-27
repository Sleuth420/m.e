'use client';

import { useMemo } from 'react';
import { BOARD, CIRCUITS } from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { useEarthStripeTexture } from './textures';
import { PathWire } from './wiring/PathWire';
import { buildWirePaths } from './wiring/wire-paths';

type Props = {
  materials: SwitchboardMaterials;
  liveById: Record<string, boolean>;
  mainLive: boolean;
  coverOpen: boolean;
  onShockWire: (circuitId: string) => void;
  onShockMains: () => void;
};

/** Renders board wiring from pure path data. */
export function Wiring({
  materials,
  liveById,
  mainLive,
  coverOpen,
  onShockWire,
  onShockMains,
}: Props) {
  const earthMap = useEarthStripeTexture();
  const earthMat = useMemo(() => {
    const m = materials.wireEarth.clone();
    m.map = earthMap;
    m.needsUpdate = true;
    return m;
  }, [materials.wireEarth, earthMap]);

  const paths = buildWirePaths();
  const shockable = coverOpen;

  return (
    <group>
      {/* Incoming mains TPS — one thick sheath, then peeled cores */}
      <PathWire points={paths.tpsSheath} radius={0.05} material={materials.sheathGrey} segments={48} />
      <mesh
        position={[
          BOARD.mainsKnockout[0] + 0.52,
          BOARD.mainsKnockout[1] - 0.5,
          BOARD.mainsKnockout[2] + 0.52,
        ]}
        material={materials.sheathGrey}
        castShadow={false}
      >
        <cylinderGeometry args={[0.052, 0.048, 0.06, 12]} />
      </mesh>
      <PathWire
        points={paths.tpsActiveCore}
        radius={0.014}
        material={materials.wireActive}
        live={mainLive}
        segments={56}
        circuitId="main"
        shockable={shockable}
        onShock={onShockMains}
      />
      <PathWire
        points={paths.neutralIn}
        radius={0.013}
        material={materials.wireNeutral}
        live={mainLive}
        segments={56}
      />
      <PathWire points={paths.earthIn} radius={0.012} material={earthMat} segments={64} />

      <PathWire points={paths.enclosureBond} radius={0.01} material={earthMat} />
      <PathWire
        points={paths.mainToComb}
        radius={0.013}
        material={materials.wireActive}
        live={mainLive}
        circuitId="main"
        shockable={shockable}
        onShock={onShockMains}
      />
      <PathWire points={paths.barToNeutComb} radius={0.011} material={materials.wireNeutral} live={mainLive} />

      {/* Per-circuit cores: short runs into each TPS join */}
      {paths.outgoingActive.map((pts, i) => (
        <PathWire
          key={`a-${i}`}
          points={pts}
          radius={0.011}
          material={materials.wireActive}
          live={liveById[CIRCUITS[i]!.id] ?? false}
          segments={40}
          circuitId={CIRCUITS[i]!.id}
          shockable={shockable}
          onShock={onShockWire}
        />
      ))}
      {paths.outgoingNeutral.map((pts, i) => (
        <PathWire
          key={`no-${i}`}
          points={pts}
          radius={0.01}
          material={materials.wireNeutral}
          live={liveById[CIRCUITS[i]!.id] ?? false}
          segments={40}
        />
      ))}
      {paths.outgoingEarth.map((pts, i) => (
        <PathWire key={`e-${i}`} points={pts} radius={0.01} material={earthMat} segments={48} />
      ))}

      {/* One TPS per circuit — straight down through its gland-plate hole */}
      {paths.outgoingTps.map((pts, i) =>
        pts.length < 2 ? null : (
          <group key={`tps-${i}`}>
            <mesh position={pts[0]} material={materials.sheathGrey} castShadow={false}>
              <sphereGeometry args={[0.024, 10, 10]} />
            </mesh>
            <PathWire points={pts} radius={0.022} material={materials.sheathGrey} segments={24} soft={false} />
          </group>
        ),
      )}
    </group>
  );
}
