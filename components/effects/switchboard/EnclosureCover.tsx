'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MathUtils, type Group } from 'three';
import { BOARD } from './circuit-data';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from './interaction';
import type { SwitchboardMaterials } from './materials';

type Props = {
  materials: SwitchboardMaterials;
  open: boolean;
  onRequestOpen: () => void;
};

/** Hinged switchboard door — click to request license before opening. */
export function EnclosureCover({ materials, open, onRequestOpen }: Props) {
  const hingeRef = useRef<Group>(null);
  const angle = useRef(open ? -1.62 : 0);

  const { width: w, height: h } = BOARD;
  const coverZ = 0.62;
  const panelW = w - 0.14;
  const panelH = h - 0.18;

  useFrame((_, delta) => {
    const target = open ? -1.62 : 0;
    angle.current = MathUtils.damp(angle.current, target, 6, delta);
    if (hingeRef.current) hingeRef.current.rotation.y = angle.current;
  });

  return (
    <group position={[-w / 2 + 0.07, 0, coverZ]}>
      <group ref={hingeRef}>
        <mesh
          position={[panelW / 2, 0, 0.018]}
          castShadow
          receiveShadow
          onClick={(e) => {
            if (open) return;
            onInteractiveClick(e, onRequestOpen);
          }}
          onPointerOver={(e) => {
            if (open) return;
            onInteractiveEnter(e);
          }}
          onPointerOut={() => onInteractiveLeave()}
        >
          <boxGeometry args={[panelW, panelH, 0.034]} />
          <meshStandardMaterial
            color="#eceae4"
            roughness={0.48}
            metalness={0.12}
            transparent={open}
            opacity={open ? 0.08 : 1}
          />
        </mesh>

        {/* Generous tap target for mobile */}
        {!open && (
          <mesh
            position={[panelW / 2, 0, 0.06]}
            onClick={(e) => onInteractiveClick(e, onRequestOpen)}
            onPointerOver={(e) => onInteractiveEnter(e)}
            onPointerOut={() => onInteractiveLeave()}
          >
            <boxGeometry args={[panelW + 0.08, panelH + 0.08, 0.12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}

        {/* Inner smoke panel — hides live parts when closed */}
        {!open && (
          <mesh position={[panelW / 2, 0, -0.004]}>
            <boxGeometry args={[panelW - 0.04, panelH - 0.04, 0.008]} />
            <meshStandardMaterial color="#2a2a30" roughness={0.82} metalness={0.04} />
          </mesh>
        )}

        {/* Warning label */}
        {!open && (
          <mesh position={[panelW / 2, 0.35, 0.022]} rotation={[0, 0, 0]}>
            <boxGeometry args={[panelW * 0.72, 0.14, 0.004]} />
            <meshStandardMaterial color="#eab308" roughness={0.55} metalness={0.05} />
          </mesh>
        )}

        {/* Handle */}
        <mesh position={[panelW - 0.12, 0, 0.042]} material={materials.plasticDark}>
          <boxGeometry args={[0.05, 0.22, 0.028]} />
        </mesh>

        {/* Corner screws */}
        {(
          [
            [0.14, panelH / 2 - 0.12],
            [0.14, -panelH / 2 + 0.12],
            [panelW - 0.14, panelH / 2 - 0.12],
            [panelW - 0.14, -panelH / 2 + 0.12],
          ] as [number, number][]
        ).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.024]} rotation={[0, 0, Math.PI / 2]} material={materials.screw}>
            <cylinderGeometry args={[0.022, 0.022, 0.008, 10]} />
          </mesh>
        ))}

        {!open && (
          <Html
            transform
            occlude
            distanceFactor={1.35}
            position={[panelW / 2, -0.05, 0.05]}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <div className="w-[9.5rem] select-none text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-900">
                Danger — live parts
              </p>
              <p className="mt-0.5 text-[8px] font-medium text-zinc-800/90">Tap cover to open</p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
