'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { RoomHit } from './RoomHit';
import type { RoomInteractId } from './room-layout';

/** Australian double switched Type I outlet. Left outlet supplies the appliance. */
export function SwitchedPowerPoint({
  on,
  onToggle,
  hitId,
}: {
  on: boolean;
  onToggle: () => void;
  hitId: RoomInteractId;
}) {
  const rockerRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (rockerRef.current)
      rockerRef.current.rotation.x = MathUtils.damp(
        rockerRef.current.rotation.x,
        on ? -0.2 : 0.2,
        18,
        delta
      );
  });
  return (
    <group>
      <RoundedBox
        args={[0.116, 0.076, 0.014]}
        radius={0.004}
        smoothness={3}
        position={[0, 0, 0.009]}
        castShadow
      >
        <meshStandardMaterial color="#f3f0e8" roughness={0.38} />
      </RoundedBox>
      {[-0.029, 0.029].map((x, i) => (
        <group key={x} position={[x, 0, 0.018]}>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.018, 0.014, 0.002]} />
            <meshStandardMaterial color="#5a5852" />
          </mesh>
          <group
            ref={i === 0 ? rockerRef : undefined}
            position={[0, 0.02, 0.001]}
            rotation={i === 1 ? [-0.2, 0, 0] : undefined}
          >
            <RoundedBox args={[0.015, 0.012, 0.005]} radius={0.001} smoothness={2}>
              <meshStandardMaterial color="#eeebe3" roughness={0.32} />
            </RoundedBox>
            <mesh position={[0, 0.004, 0.003]}>
              <boxGeometry args={[0.007, 0.0015, 0.001]} />
              <meshStandardMaterial color={i === 1 || on ? '#b64737' : '#eeebe3'} />
            </mesh>
          </group>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.009, -0.004, 0]}
              rotation={[0, 0, (side * -Math.PI) / 6]}
            >
              <boxGeometry args={[0.002, 0.009, 0.002]} />
              <meshStandardMaterial color="#363530" roughness={1} />
            </mesh>
          ))}
          <mesh position={[0, -0.018, 0]}>
            <boxGeometry args={[0.002, 0.009, 0.002]} />
            <meshStandardMaterial color="#363530" roughness={1} />
          </mesh>
        </group>
      ))}
      {/* Plug body covers the connected socket, flex exits downwards. */}
      <RoundedBox
        args={[0.033, 0.028, 0.026]}
        radius={0.005}
        smoothness={3}
        position={[-0.029, -0.01, 0.03]}
        castShadow
      >
        <meshStandardMaterial color="#e3e0d8" roughness={0.4} />
      </RoundedBox>
      <RoomHit
        onToggle={onToggle}
        hitId={hitId}
        position={[-0.029, 0.02, 0.035]}
        size={[0.054, 0.048, 0.04]}
      />
    </group>
  );
}
