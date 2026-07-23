'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MathUtils } from 'three';
import { CIRCUITS, rcboX, BOARD } from './circuit-data';
import { CombBus } from './CombBus';
import { DinRail } from './DinRail';
import { Enclosure } from './Enclosure';
import { MainSwitch } from './MainSwitch';
import { useSwitchboardMaterials } from './materials';
import { Rcbo } from './Rcbo';
import { TerminalBars } from './TerminalBars';
import { Wiring } from './Wiring';

function TripFlash({ x, active }: { x: number; active: boolean }) {
  const lightRef = useRef<{ intensity: number }>(null);
  const intensity = useRef(0);

  useFrame((_, delta) => {
    intensity.current = MathUtils.damp(intensity.current, active ? 4.5 : 0, 8, delta);
    if (lightRef.current) lightRef.current.intensity = intensity.current;
  });

  return (
    <pointLight
      ref={lightRef as never}
      position={[x, BOARD.railY + 0.1, 0.55]}
      color="#fb923c"
      distance={2.2}
      decay={2}
      intensity={0}
    />
  );
}

export function Switchboard() {
  const materials = useSwitchboardMaterials();
  const [mainOn, setMainOn] = useState(true);
  const [rcboOn, setRcboOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CIRCUITS.map((c) => [c.id, true]))
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [tripFlashId, setTripFlashId] = useState<string | null>(null);

  const toggleRcbo = useCallback((id: string) => {
    setRcboOn((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  const tripRcbo = useCallback((id: string) => {
    setRcboOn((prev) => ({ ...prev, [id]: false }));
    setTripFlashId(id);
  }, []);

  useEffect(() => {
    if (!tripFlashId) return;
    const t = window.setTimeout(() => setTripFlashId(null), 420);
    return () => window.clearTimeout(t);
  }, [tripFlashId]);

  const liveById = useMemo(
    () =>
      Object.fromEntries(
        CIRCUITS.map((c) => [c.id, mainOn && (rcboOn[c.id] ?? false)])
      ) as Record<string, boolean>,
    [mainOn, rcboOn]
  );

  const hoveredCircuit = CIRCUITS.find((c) => c.id === hovered);
  const hoveredLabel =
    hovered === 'main'
      ? mainOn
        ? 'MAIN ON — supply to the board'
        : 'MAIN OFF — whole board isolated'
      : hoveredCircuit
        ? `${hoveredCircuit.label} · ${
            liveById[hoveredCircuit.id] ? 'LIVE' : rcboOn[hoveredCircuit.id] ? 'ON (no supply)' : 'TRIPPED / OFF'
          }`
        : null;

  const flashCircuit = CIRCUITS.find((c) => c.id === tripFlashId);

  return (
    <group position={[0.02, -0.22, 0.05]} rotation={[0.03, -0.18, 0]}>
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
        onToggle={() => setMainOn((v) => !v)}
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

      {hoveredLabel && (
        <Html position={[0, 1.72, 0.55]} center style={{ pointerEvents: 'none' }}>
          <div className="rounded-md border border-primary/40 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm whitespace-nowrap">
            {hoveredLabel}
          </div>
        </Html>
      )}
    </group>
  );
}
