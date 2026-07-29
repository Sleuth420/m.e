'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh } from 'three';
import { MODULE_TARGET, MODULE_WELLS } from './assets/module-assets';
import { BOARD, moduleBodyZ, rcboX, type CircuitPole } from './circuit-data';
import { useDampRotation } from './hooks/useDampRotation';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from './interaction';
import type { SwitchboardMaterials } from './materials';
import { ModuleShell } from './parts/ModuleShell';
import { RockerLever } from './parts/RockerLever';
import { useRcboFaceTexture } from './textures';

type Props = {
  circuit: CircuitPole;
  materials: SwitchboardMaterials;
  on: boolean;
  live: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onTest: () => void;
  onHover: (id: string | null) => void;
};

export function Rcbo({
  circuit,
  materials,
  on,
  live,
  highlighted,
  onToggle,
  onTest,
  onHover,
}: Props) {
  const x = rcboX(circuit.index);
  const face = useRcboFaceTexture(circuit.rating);
  const leverRef = useDampRotation(on ? -0.32 : 0.28);
  const testRef = useRef<Mesh>(null);
  const testPress = useRef(0);

  useFrame((_, delta) => {
    if (!testRef.current) return;
    testPress.current = MathUtils.damp(testPress.current, 0, 10, delta);
    testRef.current.position.z = -testPress.current * 0.005;
  });

  const size = MODULE_TARGET.rcbo;
  const wells = MODULE_WELLS.rcbo;
  const faceZ = size.depth / 2;
  const bodyZ = moduleBodyZ();

  return (
    <group position={[x, BOARD.railY, bodyZ]}>
      <ModuleShell
        kind="rcbo"
        highlighted={highlighted}
        onPointerOver={(e) => onInteractiveEnter(e, () => onHover(circuit.id))}
        onPointerOut={() => onInteractiveLeave(() => onHover(null))}
      />

      {/* Thin face plate seated in the molded pocket (box, not a floating plane) */}
      <mesh position={[0, wells.face.y, faceZ + wells.face.zPad]}>
        <boxGeometry
          args={[
            size.width * wells.face.widthFactor,
            size.height * wells.face.heightFactor,
            0.004,
          ]}
        />
        <meshStandardMaterial map={face} roughness={0.72} metalness={0.02} />
      </mesh>

      <group position={[0, wells.rocker.y, faceZ + wells.rocker.zPad]}>
        <RockerLever
          leverRef={leverRef}
          material={materials.plasticBlue}
          onToggle={onToggle}
          accentColor="#153a70"
          width={size.width - 0.048}
          height={0.1}
          depth={0.022}
          showStatusWindow
          statusLive={live}
        />
      </group>

      {/* Proud TEST button — blue pad + white T */}
      <group position={[0, wells.test.y, faceZ + wells.test.zPad]}>
        <mesh
          ref={testRef}
          castShadow={false}
          onClick={(e) =>
            onInteractiveClick(e, () => {
              testPress.current = 1;
              onTest();
            })
          }
          onPointerOver={(e) => onInteractiveEnter(e)}
          onPointerOut={() => onInteractiveLeave()}
        >
          <boxGeometry args={[size.width - 0.04, 0.032, 0.014]} />
          <meshStandardMaterial color="#1e4a8c" roughness={0.38} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.008, 0.009]} castShadow={false}>
          <boxGeometry args={[0.028, 0.005, 0.003]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.002, 0.009]} castShadow={false}>
          <boxGeometry args={[0.005, 0.018, 0.003]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
