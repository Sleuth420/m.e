'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type Mesh } from 'three';
import { BOARD, mainSwitchX, moduleBodyZ } from './circuit-data';
import type { SwitchboardMaterials } from './materials';
import { useMainSwitchFaceTexture } from './textures';

type Props = {
  materials: SwitchboardMaterials;
  on: boolean;
  highlighted: boolean;
  onToggle: () => void;
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

export function MainSwitch({ materials, on, highlighted, onToggle, onHover }: Props) {
  const x = mainSwitchX();
  const face = useMainSwitchFaceTexture();
  const leverRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
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
    if (bodyRef.current) {
      const mat = bodyRef.current.material;
      if (!Array.isArray(mat) && 'emissiveIntensity' in mat) {
        const current = typeof mat.emissiveIntensity === 'number' ? mat.emissiveIntensity : 0;
        mat.emissiveIntensity = MathUtils.damp(current, highlighted ? 0.2 : 0, 10, delta);
      }
    }
  });

  const w = BOARD.mainWidth - 0.012;
  const h = BOARD.moduleHeight;
  const d = BOARD.moduleDepth;
  const bodyZ = moduleBodyZ();

  return (
    <group position={[x, BOARD.railY, bodyZ]}>
      <mesh
        ref={bodyRef}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover('main');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[w, h, d * 0.72]} />
        <meshStandardMaterial
          color="#d4d4d8"
          roughness={0.42}
          metalness={0.08}
          emissive="#f97316"
          emissiveIntensity={0}
        />
      </mesh>

      <mesh position={[0, h * 0.28, -d * 0.28]} castShadow>
        <boxGeometry args={[w - 0.02, h * 0.28, d * 0.18]} />
        <meshStandardMaterial color="#c4c4c8" roughness={0.5} />
      </mesh>
      <mesh position={[0, -h * 0.28, -d * 0.28]} castShadow>
        <boxGeometry args={[w - 0.02, h * 0.28, d * 0.18]} />
        <meshStandardMaterial color="#c4c4c8" roughness={0.5} />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (w / 2 - 0.006), 0, -d * 0.1]}>
          <boxGeometry args={[0.01, h * 0.7, d * 0.5]} />
          <meshStandardMaterial color="#b8b8bc" roughness={0.55} />
        </mesh>
      ))}

      <mesh position={[0, 0.05, d * 0.36]}>
        <boxGeometry args={[w - 0.022, h * 0.7, 0.008]} />
        <meshStandardMaterial color="#cacace" roughness={0.48} />
      </mesh>

      <DinClip materials={materials} w={w} />

      <mesh position={[0, 0.22, d * 0.37]}>
        <planeGeometry args={[w - 0.038, h * 0.28]} />
        <meshStandardMaterial map={face} roughness={0.55} metalness={0.04} />
      </mesh>

      <mesh position={[0, 0.07, d * 0.37]} material={materials.plasticRed}>
        <boxGeometry args={[w - 0.036, 0.024, 0.005]} />
      </mesh>

      <group position={[0, h / 2 - 0.01, -d * 0.05]}>
        <mesh material={materials.plasticDark}>
          <boxGeometry args={[0.08, 0.05, 0.085]} />
        </mesh>
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[0.048, 0.016, 0.048]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, 0.008, 0.018]} material={materials.screw}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 10]} />
        </mesh>
      </group>

      <group position={[0, -h / 2 + 0.01, -d * 0.05]}>
        <mesh material={materials.plasticDark}>
          <boxGeometry args={[0.08, 0.05, 0.085]} />
        </mesh>
        <mesh position={[0, -0.028, 0]}>
          <boxGeometry args={[0.048, 0.016, 0.048]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, -0.008, 0.018]} material={materials.screw}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 10]} />
        </mesh>
      </group>

      <group position={[0, -0.3, d * 0.36]}>
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[w - 0.05, 0.11, 0.012]} />
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
          <mesh castShadow material={materials.plasticRed}>
            <boxGeometry args={[0.06, 0.072, 0.014]} />
          </mesh>
          <mesh position={[0, 0.014, 0.008]}>
            <boxGeometry args={[0.048, 0.008, 0.003]} />
            <meshStandardMaterial color="#991b1b" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
