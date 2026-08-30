'use client';

import { AdaptiveDpr, ContactShadows, Environment } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useReducer } from 'react';
import { Switchboard } from '../Switchboard';
import { useSwitchboard } from '../SwitchboardContext';
import { AboutPortraits } from './AboutPortraits';
import { Fixtures } from './Fixtures';
import { KitchenRun } from './KitchenRun';
import { LearningRoom } from './LearningRoom';
import { LoungeRun } from './LoungeRun';
import { Player } from './Player';
import { RoomWiring } from './RoomWiring';
import { BOARD_MOUNT, BOARD_OPENING, ROOM, ROOM_LOADS, type RoomInteractId } from './room-layout';
import { POLYHAVEN } from './room-assets';
import { INITIAL_ROOM_PLAY, roomPlayReducer, type RoomLive } from './room-play';

type Props = {
  controlsEnabled: boolean;
  onExit: () => void;
};

function LedBatten({ position }: { position: [number, number, number] }) {
  const len = BOARD_OPENING.z1 - BOARD_OPENING.z0 - 0.1;
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.042, 0.024, len]} />
        <meshStandardMaterial color="#b8bcc2" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0.012, -0.004, 0]}>
        <boxGeometry args={[0.02, 0.014, len - 0.03]} />
        <meshStandardMaterial
          color="#fff6e0"
          emissive="#fff1c2"
          emissiveIntensity={1.15}
          roughness={0.32}
          metalness={0.02}
        />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[0, 0, side * (len / 2 - 0.008)]} castShadow>
          <boxGeometry args={[0.044, 0.026, 0.016]} />
          <meshStandardMaterial color="#9aa0a6" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
      <pointLight position={[0.22, -0.02, 0]} intensity={1.25} distance={2.6} decay={2} color="#fff1d4" />
      <pointLight position={[0.08, -0.01, 0]} intensity={0.4} distance={1.2} decay={2} color="#f7f0e4" />
    </group>
  );
}

function GalleryLighting({ playing }: { playing: boolean }) {
  const shadowMap = playing ? 512 : 1024;
  return (
    <>
      <color attach="background" args={['#c5c2bb']} />
      <fog attach="fog" args={['#c5c2bb', 18, 42]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#f5f0e8', '#6b6560', 0.42]} />
      <directionalLight
        position={[6.2, 8.4, 6.4]}
        intensity={1.05}
        castShadow
        shadow-mapSize={[shadowMap, shadowMap]}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0002}
        color="#fff6ea"
      />
      <directionalLight position={[2.4, 3.4, 9]} intensity={0.28} color="#e8eef5" />
      <Suspense fallback={null}>
        <Environment files={POLYHAVEN.hdri} environmentIntensity={0.9} />
      </Suspense>
    </>
  );
}

function LearningSceneInner({ controlsEnabled, onExit }: Props) {
  const { liveById } = useSwitchboard();
  const [play, dispatch] = useReducer(roomPlayReducer, INITIAL_ROOM_PLAY);

  const lightingLive = liveById[ROOM_LOADS.lighting] ?? false;
  const powerLive = liveById[ROOM_LOADS.power] ?? false;
  const fridgeLive = liveById[ROOM_LOADS.fridge] ?? false;
  const ovenLive = liveById[ROOM_LOADS.oven] ?? false;
  const inductionLive = liveById[ROOM_LOADS.induction] ?? false;
  const loungePowerLive = liveById[ROOM_LOADS.loungePower] ?? false;
  const loungeLightLive = liveById[ROOM_LOADS.loungeLight] ?? false;
  const hobLive = inductionLive && play.isolatorOn;
  const lightsOn = lightingLive && play.lightSwitchOn;
  const live = useMemo<RoomLive>(
    () => ({ powerLive, hobLive, loungePowerLive }),
    [powerLive, hobLive, loungePowerLive]
  );

  useEffect(() => {
    if (!powerLive) dispatch({ type: 'power-cut' });
  }, [powerLive]);

  useEffect(() => {
    if (!hobLive) dispatch({ type: 'hob-cut' });
  }, [hobLive]);

  useEffect(() => {
    if (!loungePowerLive) dispatch({ type: 'lounge-power-cut' });
  }, [loungePowerLive]);

  const onInteract = useCallback(
    (id: RoomInteractId) => {
      dispatch({ type: 'interact', id, live });
    },
    [live]
  );

  const toggleOpen = (id: RoomInteractId) => onInteract(id);

  return (
    <>
      {controlsEnabled && <AdaptiveDpr />}
      <GalleryLighting playing={controlsEnabled} />
      <LearningRoom />
      <group
        position={[BOARD_MOUNT.x, BOARD_MOUNT.y, BOARD_MOUNT.z]}
        rotation={[0, BOARD_MOUNT.rotY, 0]}
        scale={BOARD_MOUNT.scale}
      >
        <Suspense fallback={null}>
          <Switchboard />
        </Suspense>
      </group>
      {/* LED batten over the board — always-on so the enclosure stays readable. */}
      <LedBatten position={[BOARD_MOUNT.x + 0.06, BOARD_OPENING.y1 + 0.048, BOARD_MOUNT.z]} />
      <RoomWiring liveById={liveById} isolatorOn={play.isolatorOn} />
      <Suspense fallback={null}>
        <Fixtures
          lightsOn={lightsOn}
          lightSwitchOn={play.lightSwitchOn}
          onToggleSwitch={() => onInteract('switch')}
        />
      </Suspense>
      <Suspense fallback={null}>
        <KitchenRun
          powerLive={powerLive}
          fridgeLive={fridgeLive}
          ovenLive={ovenLive}
          hobLive={hobLive}
          isolatorOn={play.isolatorOn}
          fridgeOpen={play.fridgeOpen}
          toasterPop={play.toasterPop}
          sinkOn={play.sinkOn}
          boiling={play.boiling}
          openById={play.openById}
          onToggle={toggleOpen}
          onToggleFridge={() => onInteract('fridge')}
          onToggleToaster={() => onInteract('toaster')}
          onToggleIsolator={() => onInteract('cookIsolator')}
          onToggleSink={() => onInteract('sink')}
          onToggleBoil={() => onInteract('cooktop')}
        />
      </Suspense>
      <Suspense fallback={null}>
        <LoungeRun
          powerLive={loungePowerLive}
          lightLive={loungeLightLive}
          dimmer={play.loungeDimmer}
          tvOn={play.tvOn}
          onCycleDimmer={() => onInteract('loungeDimmerA')}
          onToggleTv={() => onInteract('tv')}
        />
      </Suspense>
      <AboutPortraits lightsOn={lightsOn} />
      <Player
        enabled={controlsEnabled}
        onExit={onExit}
        onInteract={onInteract}
        play={play}
        powerLive={powerLive}
        hobLive={hobLive}
        loungePowerLive={loungePowerLive}
        loungeLightLive={loungeLightLive}
      />
      {!controlsEnabled && (
        <ContactShadows
          position={[ROOM.width / 2, 0.015, ROOM.depth / 2]}
          opacity={0.48}
          scale={16}
          blur={2.4}
          far={6}
          color="#3f3f46"
        />
      )}
    </>
  );
}

export function LearningScene({ controlsEnabled, onExit }: Props) {
  return <LearningSceneInner controlsEnabled={controlsEnabled} onExit={onExit} />;
}
