'use client';

import { CIRCUITS, rcboX } from './circuit-data';
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
import { Wiring } from './Wiring';

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
      </group>

      <EnclosureCover materials={materials} open={coverOpen} onRequestOpen={requestCoverOpen} />
    </group>
  );
}
