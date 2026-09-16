'use client';

import { useMemo } from 'react';
import {
  BOARD,
  CIRCUITS,
  circuitLabelLines,
  circuitNumber,
  mainSwitchX,
  rcboX,
} from './circuit-data';
import { CombBus } from './CombBus';
import { DinRail } from './DinRail';
import { Enclosure } from './Enclosure';
import { EnclosureCover } from './EnclosureCover';
import { MainSwitch } from './MainSwitch';
import { useSwitchboardMaterials } from './materials';
import { TripFlash } from './parts/TripFlash';
import { Rcbo } from './Rcbo';
import { TerminalBars } from './TerminalBars';
import { useSwitchboard } from './SwitchboardContext';
import {
  type LabelStripCell,
  useLabelStripTexture,
  useMainSwitchPlateTexture,
  useRcdNoticeTexture,
} from './textures';
import { Wiring } from './Wiring';
import { useGameInput } from './learning-room/GameInputContext';

const STRIP_H = 0.36;

/**
 * Circuit designation strip — one engraved label per pole, directly under the
 * rockers (AS/NZS 3000 2.9.3: every protective device identified by circuit).
 */
function LabelStrip() {
  const cells = useMemo<LabelStripCell[]>(
    () => [
      { id: 'MAIN', lines: ['MAIN', 'SWITCH'], tone: 'main' },
      ...CIRCUITS.map((c) => ({ id: circuitNumber(c), lines: circuitLabelLines(c.label) })),
    ],
    []
  );
  const map = useLabelStripTexture(cells);
  const x0 = mainSwitchX() - BOARD.mainWidth / 2;
  const x1 = rcboX(CIRCUITS.length - 1) + BOARD.rcboWidth / 2;
  // Main pole is wider than an RCBO; stretch the first cell by shifting the strip origin.
  const width = x1 - x0;
  return (
    <mesh
      position={[(x0 + x1) / 2, BOARD.railY - BOARD.moduleHeight / 2 - STRIP_H / 2 - 0.05, 0.69]}
      rotation={[-0.08, 0, 0]}
      receiveShadow
    >
      <boxGeometry args={[width, STRIP_H, 0.012]} />
      <meshStandardMaterial map={map} roughness={0.5} metalness={0.02} />
    </mesh>
  );
}

function MainSwitchPlate() {
  const map = useMainSwitchPlateTexture();
  return (
    <mesh position={[mainSwitchX(), BOARD.railY + BOARD.moduleHeight / 2 + 0.07, 0.69]}>
      <boxGeometry args={[BOARD.mainWidth + 0.06, 0.09, 0.008]} />
      <meshStandardMaterial map={map} roughness={0.5} metalness={0.02} />
    </mesh>
  );
}

function RcdNotice() {
  const map = useRcdNoticeTexture();
  return (
    <mesh position={[0, 0.94, 0.678]}>
      <boxGeometry args={[0.88, 0.22, 0.006]} />
      <meshStandardMaterial map={map} roughness={0.6} metalness={0.01} />
    </mesh>
  );
}

/** Composes board assemblies. State lives in SwitchboardProvider. */
export function Switchboard() {
  const { wiringView } = useGameInput();
  const materials = useSwitchboardMaterials();
  const {
    mainOn,
    rcboOn,
    setHovered,
    tripFlashId,
    toggleMain,
    toggleRcbo,
    tripRcbo,
    liveById,
    flashCircuit,
    hovered,
    coverOpen,
    requestCoverOpen,
    closeCover,
    shockOnWire,
    shockOnMains,
  } = useSwitchboard();

  const boardUnlocked = coverOpen;

  return (
    <group>
      <Enclosure materials={materials} />
      <group visible={boardUnlocked}>
        <group visible={wiringView}>
          <DinRail materials={materials} />
          <TerminalBars materials={materials} />
          <CombBus materials={materials} />
          <Wiring
            materials={materials}
            liveById={liveById}
            mainLive={mainOn}
            coverOpen={false}
            onShockWire={shockOnWire}
            onShockMains={shockOnMains}
          />
        </group>

        {/* Fixed escutcheon: ordinary operation never exposes terminals. */}
        {!wiringView && (
          <group>
            {[
              [-0.935, 1.33],
              [0.96, 1.28],
            ].map(([y, height]) => (
              <mesh
                key={y}
                position={[0, y, 0.655]}
                castShadow
                receiveShadow
                onClick={(e) => e.stopPropagation()}
              >
                <boxGeometry args={[BOARD.width - 0.12, height, 0.025]} />
                <meshStandardMaterial color="#e8e6df" roughness={0.5} metalness={0.1} />
              </mesh>
            ))}
          </group>
        )}

        {flashCircuit && (
          <TripFlash x={rcboX(flashCircuit.index)} active={tripFlashId === flashCircuit.id} />
        )}

        <MainSwitch
          materials={materials}
          on={mainOn}
          highlighted={hovered === 'main'}
          onToggle={toggleMain}
          onHover={setHovered}
          disabled={!boardUnlocked}
        />

        {CIRCUITS.map((circuit) => (
          <Rcbo
            key={circuit.id}
            circuit={circuit}
            materials={materials}
            on={rcboOn[circuit.id] ?? true}
            live={liveById[circuit.id] ?? false}
            highlighted={hovered === circuit.id}
            onToggle={() => toggleRcbo(circuit.id)}
            onTest={() => tripRcbo(circuit.id)}
            onHover={setHovered}
            disabled={!boardUnlocked}
          />
        ))}
        <LabelStrip />
        <MainSwitchPlate />
        <RcdNotice />
      </group>

      <EnclosureCover
        materials={materials}
        open={coverOpen}
        onRequestOpen={requestCoverOpen}
        onClose={closeCover}
      />
    </group>
  );
}
