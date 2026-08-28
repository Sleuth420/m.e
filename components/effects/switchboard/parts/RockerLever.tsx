'use client';

import type { RefObject } from 'react';
import type { Material, Group } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';

type Props = {
  leverRef: RefObject<Group | null>;
  material: Material;
  onToggle: () => void;
  accentColor: string;
  width?: number;
  height?: number;
  depth?: number;
  showStatusWindow?: boolean;
  statusLive?: boolean;
  disabled?: boolean;
};

/**
 * Flush rocker: light body collar + paddle that fills the opening.
 * Avoids the dark recessed “black square” around the switch.
 */
export function RockerLever({
  leverRef,
  material,
  onToggle,
  accentColor,
  width = 0.12,
  height = 0.105,
  depth = 0.02,
  showStatusWindow = false,
  statusLive = true,
  disabled = false,
}: Props) {
  return (
    <group>
      {/* Body-coloured collar — kills any dark rim around the paddle */}
      <mesh position={[0, 0, -0.001]} castShadow={false}>
        <boxGeometry args={[width + 0.028, height + 0.028, 0.008]} />
        <meshStandardMaterial color="#e8e8ea" roughness={0.62} metalness={0.04} />
      </mesh>

      {/* I (on) at the top of the collar */}
      <mesh position={[0, height * 0.7, 0.006]} castShadow={false}>
        <boxGeometry args={[0.006, 0.014, 0.003]} />
        <meshStandardMaterial color="#18181b" roughness={0.5} />
      </mesh>
      {/* O (off) at the bottom */}
      <mesh position={[0, -height * 0.7, 0.006]} castShadow={false}>
        <torusGeometry args={[0.006, 0.0018, 6, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.5} />
      </mesh>

      {showStatusWindow && (
        <mesh position={[0, height * 0.42, 0.004]} castShadow={false}>
          <boxGeometry args={[width * 0.7, 0.009, 0.003]} />
          <meshStandardMaterial
            color={statusLive ? '#1e4a8c' : '#a1a1aa'}
            emissive={statusLive ? '#1e4a8c' : '#000000'}
            emissiveIntensity={statusLive ? 0.12 : 0}
            roughness={0.4}
            metalness={0.08}
          />
        </mesh>
      )}

      <group
        ref={leverRef}
        position={[0, 0, 0.004]}
        onClick={disabled ? undefined : (e) => onInteractiveClick(e, onToggle)}
        onPointerOver={disabled ? undefined : (e) => onInteractiveEnter(e)}
        onPointerOut={disabled ? undefined : () => onInteractiveLeave()}
      >
        {/* Finger-sized tap target — visible paddle is ~18 mm at board scale. */}
        <mesh position={[0, 0, depth * 0.9]} renderOrder={8}>
          <boxGeometry args={[width * 1.9, height * 1.85, Math.max(depth * 5, 0.09)]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh castShadow={false} material={material} position={[0, 0, depth * 0.15]}>
          <boxGeometry args={[width * 0.98, height * 0.72, depth * 0.7]} />
        </mesh>
        <mesh castShadow={false} material={material} position={[0, 0.006, depth * 0.45]}>
          <boxGeometry args={[width * 0.9, height * 0.5, depth * 0.35]} />
        </mesh>
        {/* Accent on the I (top) end — proud toward camera when ON */}
        <mesh position={[0, height * 0.28, depth * 0.4]} castShadow={false}>
          <boxGeometry args={[width * 0.96, height * 0.2, depth * 0.4]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} metalness={0.08} />
        </mesh>
      </group>
    </group>
  );
}
