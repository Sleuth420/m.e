'use client';

import { BOARD, CIRCUITS, circuitDisplayName, mainSwitchX, moduleBodyZ, rcboX } from './circuit-data';
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
import { useCircuitLabelTexture } from './textures';
import { Wiring } from './Wiring';

function PoleIdLabel({ x, text }: { x: number; text: string }) {
  const map = useCircuitLabelTexture(text);
  return (
    <mesh position={[x, -BOARD.moduleHeight / 2 - 0.26, moduleBodyZ() + 0.3]} rotation={[-0.1, 0, 0]}>
      <boxGeometry args={[BOARD.rcboWidth - 0.006, 0.34, 0.014]} />
      <meshStandardMaterial map={map} roughness={0.46} metalness={0.04} />
    </mesh>
  );
}

/** Composes board assemblies. State lives in SwitchboardProvider. */
export function Switchboard() {
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
    shockOnWire,
    shockOnMains,
  } = useSwitchboard();

  const boardUnlocked = coverOpen;

  return (
    <group>
      <Enclosure materials={materials} />
      <group visible={boardUnlocked}>
        <DinRail materials={materials} />
        <TerminalBars materials={materials} />
        <CombBus materials={materials} />
        <Wiring
          materials={materials}
          liveById={liveById}
          mainLive={mainOn}
          coverOpen={coverOpen}
          onShockWire={shockOnWire}
          onShockMains={shockOnMains}
        />

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
        <PoleIdLabel x={mainSwitchX()} text="MAIN" />
        {CIRCUITS.map((circuit) => (
          <PoleIdLabel key={`id-${circuit.id}`} x={rcboX(circuit.index)} text={circuitDisplayName(circuit.label)} />
        ))}
      </group>

      <EnclosureCover materials={materials} open={coverOpen} onRequestOpen={requestCoverOpen} />
    </group>
  );
}
