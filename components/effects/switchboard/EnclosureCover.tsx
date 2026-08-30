'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from 'three';
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
          onPointerUp={(e) => {
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
            onPointerUp={(e) => onInteractiveClick(e, onRequestOpen)}
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

        {!open && <DangerSticker x={panelW / 2} />}

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

      </group>
    </group>
  );
}

/** Printed AS-style sticker on the door — not a click tooltip. */
function DangerSticker({ x }: { x: number }) {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 492, 236);
    ctx.fillStyle = '#18181b';
    ctx.textAlign = 'center';
    ctx.font = '800 52px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('DANGER', 256, 88);
    ctx.font = '700 36px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('LIVE PARTS', 256, 140);
    ctx.font = '600 22px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Authorised persons only', 256, 198);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh position={[x, 0.42, 0.038]} receiveShadow>
      <boxGeometry args={[0.72, 0.28, 0.006]} />
      <meshStandardMaterial map={map} roughness={0.48} metalness={0.04} />
    </mesh>
  );
}
