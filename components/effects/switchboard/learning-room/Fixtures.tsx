'use client';

import { useLayoutEffect, useMemo } from 'react';
import { FIXTURES } from './room-layout';
import { ROOM_GLB } from './room-assets';
import { WallSwitch } from './WallSwitch';
import { cloneGltfScene, setNamedEmissive } from './scene-graph';
import { useKeptGltf } from './useKeptGltf';

type FixtureProps = {
  lightsOn: boolean;
  lightSwitchOn: boolean;
  onToggleSwitch: () => void;
};

/** Board-wall fittings only. Kitchen appliances live in KitchenRun. */
export function Fixtures({ lightsOn, lightSwitchOn, onToggleSwitch }: FixtureProps) {
  const { scene } = useKeptGltf(ROOM_GLB.sconce);
  const sconce1 = useMemo(() => cloneGltfScene(scene), [scene]);
  const sconce2 = useMemo(() => cloneGltfScene(scene), [scene]);

  useLayoutEffect(() => {
    setNamedEmissive(sconce1, 'Shade', lightsOn);
    setNamedEmissive(sconce2, 'Shade', lightsOn);
  }, [sconce1, sconce2, lightsOn]);

  const sw = FIXTURES.lightSwitch;
  const l1 = FIXTURES.wallLight1;
  const l2 = FIXTURES.wallLight2;

  return (
    <group>
      <WallSwitch
        position={[sw.x, sw.y, sw.z]}
        wall="board"
        on={lightSwitchOn}
        onToggle={onToggleSwitch}
      />

      <primitive object={sconce1} position={[l1.x, l1.y, l1.z]} rotation={[0, Math.PI / 2, 0]} scale={1.18} />
      <primitive object={sconce2} position={[l2.x, l2.y, l2.z]} rotation={[0, Math.PI / 2, 0]} scale={1.18} />
      {lightsOn && (
        <>
          <pointLight position={[l1.x + 0.28, l1.y, l1.z]} intensity={1.4} distance={5.2} color="#fff4d6" />
          <pointLight position={[l2.x + 0.28, l2.y, l2.z]} intensity={1.4} distance={5.2} color="#fff4d6" />
        </>
      )}
    </group>
  );
}
