'use client';

import { CIRCUITS, rcboX } from './circuit-data';
import { CombBus } from './CombBus';
import { DinRail } from './DinRail';
import { Enclosure } from './Enclosure';
import { MainSwitch } from './MainSwitch';
import { useSwitchboardMaterials } from './materials';
import { TripFlash } from './parts/TripFlash';
import { Rcbo } from './Rcbo';
import { TerminalBars } from './TerminalBars';
import { useSwitchboardState } from './useSwitchboardState';
import { Wiring } from './Wiring';

/** Composes board assemblies; state lives in useSwitchboardState. */
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
  } = useSwitchboardState();

  return (
    <group position={[0, -0.1, 0.08]} rotation={[0.04, -0.12, 0]} scale={1.55}>
      <Enclosure materials={materials} />
      <DinRail materials={materials} />
      <TerminalBars materials={materials} />
      <CombBus materials={materials} />
      <Wiring materials={materials} liveById={liveById} mainLive={mainOn} />

      {flashCircuit && (
        <TripFlash x={rcboX(flashCircuit.index)} active={tripFlashId === flashCircuit.id} />
      )}

      <MainSwitch
        materials={materials}
        on={mainOn}
        highlighted={hovered === 'main'}
        onToggle={toggleMain}
        onHover={setHovered}
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
        />
      ))}
    </group>
  );
}
