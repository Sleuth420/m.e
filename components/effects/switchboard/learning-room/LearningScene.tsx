'use client';

import { ContactShadows, Environment } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { Switchboard } from '../Switchboard';
import { useSwitchboard } from '../SwitchboardContext';
import { AboutPortraits } from './AboutPortraits';
import { Fixtures } from './Fixtures';
import { KitchenRun } from './KitchenRun';
import { LearningRoom } from './LearningRoom';
import { Player } from './Player';
import { RoomWiring } from './RoomWiring';
import { BOARD_MOUNT, ROOM, ROOM_LOADS, type KitchenInteractId } from './room-layout';

type Props = {
  controlsEnabled: boolean;
  onExit: () => void;
};

function GalleryLighting() {
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
        shadow-mapSize={[1024, 1024]}
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
        <Environment preset="apartment" environmentIntensity={0.85} />
      </Suspense>
    </>
  );
}

function LearningSceneInner({ controlsEnabled, onExit }: Props) {
  const { liveById } = useSwitchboard();
  const [lightSwitchOn, setLightSwitchOn] = useState(true);
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [toasterPop, setToasterPop] = useState(false);
  const [isolatorOn, setIsolatorOn] = useState(true);
  const [sinkOn, setSinkOn] = useState(false);
  const [boiling, setBoiling] = useState(false);
  const [openById, setOpenById] = useState<Partial<Record<KitchenInteractId, boolean>>>({});

  const lightingLive = liveById[ROOM_LOADS.lighting] ?? false;
  const powerLive = liveById[ROOM_LOADS.power] ?? false;
  const fridgeLive = liveById[ROOM_LOADS.fridge] ?? false;
  const ovenLive = liveById[ROOM_LOADS.oven] ?? false;
  const inductionLive = liveById[ROOM_LOADS.induction] ?? false;
  const hobLive = inductionLive && isolatorOn;
  const lightsOn = lightingLive && lightSwitchOn;

  useEffect(() => {
    if (!powerLive) setToasterPop(false);
  }, [powerLive]);

  useEffect(() => {
    if (!hobLive) setBoiling(false);
  }, [hobLive]);

  const toggleOpen = (id: KitchenInteractId) => {
    setOpenById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onInteract = (id: KitchenInteractId) => {
    if (id === 'switch') setLightSwitchOn((v) => !v);
    else if (id === 'toaster' || id === 'gpoDouble') {
      if (powerLive) setToasterPop((v) => !v);
    } else if (id === 'fridge') setFridgeOpen((v) => !v);
    else if (id === 'cookIsolator') setIsolatorOn((v) => !v);
    else if (id === 'cooktop') {
      if (hobLive) setBoiling((v) => !v);
    } else if (id === 'sink') setSinkOn((v) => !v);
    else toggleOpen(id);
  };

  return (
    <>
      <GalleryLighting />
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
      <RoomWiring liveById={liveById} isolatorOn={isolatorOn} />
      <Suspense fallback={null}>
        <Fixtures
          lightsOn={lightsOn}
          lightSwitchOn={lightSwitchOn}
          onToggleSwitch={() => setLightSwitchOn((v) => !v)}
        />
      </Suspense>
      <Suspense fallback={null}>
        <KitchenRun
          powerLive={powerLive}
          fridgeLive={fridgeLive}
          ovenLive={ovenLive}
          hobLive={hobLive}
          isolatorOn={isolatorOn}
          fridgeOpen={fridgeOpen}
          toasterPop={toasterPop}
          sinkOn={sinkOn}
          boiling={boiling}
          openById={openById}
          onToggle={toggleOpen}
          onToggleFridge={() => setFridgeOpen((v) => !v)}
          onToggleToaster={() => {
            if (powerLive) setToasterPop((v) => !v);
          }}
          onToggleIsolator={() => setIsolatorOn((v) => !v)}
          onToggleSink={() => setSinkOn((v) => !v)}
          onToggleBoil={() => {
            if (hobLive) setBoiling((v) => !v);
          }}
        />
      </Suspense>
      <AboutPortraits lightsOn={lightsOn} />
      <Player
        enabled={controlsEnabled}
        onExit={onExit}
        onInteract={onInteract}
        openById={openById}
        fridgeOpen={fridgeOpen}
        toasterPop={toasterPop}
        lightSwitchOn={lightSwitchOn}
        powerLive={powerLive}
        isolatorOn={isolatorOn}
        sinkOn={sinkOn}
        boiling={boiling}
        hobLive={hobLive}
      />
      <ContactShadows
        position={[ROOM.width / 2, 0.015, ROOM.depth / 2]}
        opacity={0.38}
        scale={16}
        blur={2}
        far={5}
        color="#3f3f46"
      />
    </>
  );
}

export function LearningScene({ controlsEnabled, onExit }: Props) {
  return <LearningSceneInner controlsEnabled={controlsEnabled} onExit={onExit} />;
}
