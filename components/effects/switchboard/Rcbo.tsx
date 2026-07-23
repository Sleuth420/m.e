'use client';

import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type Mesh } from 'three';
import { BOARD, moduleBodyZ, rcboX, type CircuitPole } from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { useRcboFaceTexture } from './textures';

type Props = {
  circuit: CircuitPole;
  materials: SwitchboardMaterials;
  on: boolean;
  /** Circuit is energised (main on + rocker on) */
  live: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onTest: () => void;
  onHover: (id: string | null) => void;
};

function DinClip({ materials, w }: { materials: SwitchboardMaterials; w: number }) {
  return (
    <group position={[0, 0, -BOARD.moduleDepth / 2 - 0.04]}>
      <mesh material={materials.plasticDark} castShadow position={[0, 0, -0.01]}>
        <boxGeometry args={[w - 0.06, 0.1, 0.022]} />
      </mesh>
      <mesh position={[0, 0.042, -0.03]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.016, 0.03]} />
      </mesh>
      <mesh position={[0, 0.032, -0.042]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.014, 0.01]} />
      </mesh>
      <mesh position={[0, -0.042, -0.028]} material={materials.plasticDark}>
        <boxGeometry args={[w - 0.07, 0.014, 0.024]} />
      </mesh>
    </group>
  );
}

/** Soften a box silhouette with edge fillets (small cylinders along vertical corners) */
function SoftShell({
  w,
  h,
  d,
  color,
  bodyRef,
  onPointerOver,
  onPointerOut,
}: {
  w: number;
  h: number;
  d: number;
  color: string;
  bodyRef: RefObject<Mesh | null>;
  onPointerOver: (e: { stopPropagation: () => void }) => void;
  onPointerOut: () => void;
}) {
  const r = 0.012;
  return (
    <group>
      <mesh
        ref={bodyRef}
        castShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[w - r * 2, h, d]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} emissive="#22d3ee" emissiveIntensity={0} />
      </mesh>
      {/* Left / right face panels to fake radius */}
      <mesh position={[-(w / 2 - r / 2), 0, 0]} castShadow>
        <boxGeometry args={[r, h - r * 2, d - r * 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
      </mesh>
      <mesh position={[w / 2 - r / 2, 0, 0]} castShadow>
        <boxGeometry args={[r, h - r * 2, d - r * 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
      </mesh>
      {/* Vertical corner rods */}
      {([-1, 1] as const).flatMap((sx) =>
        ([-1, 1] as const).map((sz) => (
          <mesh
            key={`${sx}-${sz}`}
            position={[sx * (w / 2 - r), 0, sz * (d / 2 - r)]}
            castShadow
          >
            <cylinderGeometry args={[r, r, h - r * 2, 10]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.06} />
          </mesh>
        ))
      )}
    </group>
  );
}

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
  const leverRef = useRef<Group>(null);
  const testRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const ledRef = useRef<Mesh>(null);
  const testPress = useRef(0);
  const targetAngle = on ? -0.18 : 0.2;

  useFrame((_, delta) => {
    if (leverRef.current) {
      leverRef.current.rotation.x = MathUtils.damp(
        leverRef.current.rotation.x,
        targetAngle,
        14,
        delta
      );
    }
    if (testRef.current) {
      testPress.current = MathUtils.damp(testPress.current, 0, 10, delta);
      testRef.current.position.z = -testPress.current * 0.008;
    }
    if (bodyRef.current) {
      const mat = bodyRef.current.material;
      if (!Array.isArray(mat) && 'emissiveIntensity' in mat) {
        const current = typeof mat.emissiveIntensity === 'number' ? mat.emissiveIntensity : 0;
        mat.emissiveIntensity = MathUtils.damp(current, highlighted ? 0.22 : 0, 10, delta);
      }
    }
    if (ledRef.current) {
      const mat = ledRef.current.material;
      if (!Array.isArray(mat) && 'emissiveIntensity' in mat) {
        const current = typeof mat.emissiveIntensity === 'number' ? mat.emissiveIntensity : 0;
        mat.emissiveIntensity = MathUtils.damp(current, live ? 0.85 : 0.02, 12, delta);
      }
    }
  });

  const w = BOARD.rcboWidth - 0.018;
  const h = BOARD.moduleHeight;
  const d = BOARD.moduleDepth * 0.7;
  const bodyZ = moduleBodyZ();

  return (
    <group position={[x, BOARD.railY, bodyZ]}>
      <SoftShell
        w={w}
        h={h}
        d={d}
        color="#d6d6da"
        bodyRef={bodyRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(circuit.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      />

      {/* Rear shoulders with mid notch for DIN */}
      <mesh position={[0, h * 0.3, -d * 0.42]} castShadow>
        <boxGeometry args={[w - 0.03, h * 0.26, d * 0.22]} />
        <meshStandardMaterial color="#c2c2c6" roughness={0.48} />
      </mesh>
      <mesh position={[0, -h * 0.3, -d * 0.42]} castShadow>
        <boxGeometry args={[w - 0.03, h * 0.26, d * 0.22]} />
        <meshStandardMaterial color="#c2c2c6" roughness={0.48} />
      </mesh>

      <DinClip materials={materials} w={w} />

      {/* Inset face */}
      <mesh position={[0, 0.06, d / 2 + 0.002]}>
        <boxGeometry args={[w - 0.04, h * 0.62, 0.006]} />
        <meshStandardMaterial color="#c8c8cc" roughness={0.45} />
      </mesh>

      <mesh position={[0, 0.24, d / 2 + 0.006]}>
        <planeGeometry args={[w - 0.05, h * 0.28]} />
        <meshStandardMaterial map={face} roughness={0.55} metalness={0.04} />
      </mesh>

      <mesh position={[0, 0.09, d / 2 + 0.006]} material={materials.plasticBlue}>
        <boxGeometry args={[w - 0.048, 0.028, 0.004]} />
      </mesh>

      {/* Live indicator — glows when circuit is energised */}
      <mesh ref={ledRef} position={[w * 0.28, 0.09, d / 2 + 0.01]}>
        <boxGeometry args={[0.028, 0.014, 0.006]} />
        <meshStandardMaterial
          color={live ? '#4ade80' : '#3f3f46'}
          emissive="#4ade80"
          emissiveIntensity={live ? 0.85 : 0.02}
          roughness={0.35}
        />
      </mesh>

      {/* Top LINE + N tunnels */}
      <group position={[0, h / 2 - 0.008, -d * 0.08]}>
        <mesh material={materials.plasticDark}>
          <boxGeometry args={[0.072, 0.045, 0.078]} />
        </mesh>
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[0.042, 0.014, 0.042]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
      </group>
      <group position={[w * 0.28, h / 2 - 0.008, 0]}>
        <mesh material={materials.plasticDark}>
          <boxGeometry args={[0.042, 0.038, 0.055]} />
        </mesh>
        <mesh position={[0, 0.022, 0]}>
          <boxGeometry args={[0.028, 0.01, 0.032]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
      </group>

      <group position={[0, -h / 2 + 0.008, -d * 0.08]}>
        <mesh material={materials.plasticDark}>
          <boxGeometry args={[0.072, 0.045, 0.078]} />
        </mesh>
        <mesh position={[0, -0.026, 0]}>
          <boxGeometry args={[0.042, 0.014, 0.042]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
      </group>

      {/* Flush rectangular TEST */}
      <group position={[0, -0.02, d / 2 + 0.004]}>
        <mesh>
          <boxGeometry args={[0.062, 0.032, 0.003]} />
          <meshStandardMaterial color="#71717a" roughness={0.55} />
        </mesh>
        <mesh
          ref={testRef}
          position={[0, 0, 0.001]}
          onClick={(e) => {
            e.stopPropagation();
            testPress.current = 1;
            onTest();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[0.05, 0.024, 0.003]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.38} metalness={0.12} />
        </mesh>
      </group>

      {/* Slim rocker */}
      <group position={[0, -0.3, d / 2 + 0.003]}>
        <mesh position={[0, 0, -0.004]}>
          <boxGeometry args={[w - 0.055, 0.1, 0.01]} />
          <meshStandardMaterial color="#9a9aa0" roughness={0.55} />
        </mesh>
        <group
          ref={leverRef}
          position={[0, 0, 0.001]}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <mesh castShadow material={materials.plasticDark}>
            <boxGeometry args={[0.055, 0.065, 0.012]} />
          </mesh>
          <mesh position={[0, 0.012, 0.007]}>
            <boxGeometry args={[0.042, 0.007, 0.003]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
