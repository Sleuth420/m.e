'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject, Suspense } from 'react';
import { Box3, Group, Vector3, type Mesh, type MeshStandardMaterial } from 'three';
import type { PlayerPose } from './player-motion';
import { PLAYER_SPAWN } from './room-layout';
import { ROOM_GLB } from './room-assets';
import { useKeptGltf } from './useKeptGltf';

/** Poly Haven pliers as the player avatar — https://polyhaven.com/a/pliers */
function PliersAvatar() {
  const { scene } = useKeptGltf(ROOM_GLB.pliers);
  const root = useMemo(() => {
    const g = scene.clone(true);
    g.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.raycast = () => undefined;
      const srcs = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = srcs.map((mat) => {
        const src = mat as MeshStandardMaterial;
        if (!src) return mat;
        const m = src.clone();
        const n = `${mesh.name || ''} ${obj.name || ''} ${m.name || ''}`.toLowerCase();
        const gripA = n.includes('pliers_a') || n.includes('handle_01');
        const gripB = n.includes('pliers_b') || n.includes('handle_02');
        if (!m.map) {
          if (gripA) m.color.set('#e8b923');
          else if (gripB) m.color.set('#c45c2a');
          else m.color.set('#c5c9cf');
        }
        m.metalness = gripA || gripB ? 0.18 : 0.82;
        m.roughness = gripA || gripB ? 0.42 : 0.28;
        m.needsUpdate = true;
        return m;
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
    });
    const box = new Box3().setFromObject(g);
    const size = box.getSize(new Vector3());
    const s = 1.15 / Math.max(size.y, 0.01);
    g.scale.setScalar(s);
    g.rotation.set(0, 0, 0);
    g.updateMatrixWorld(true);
    const after = new Box3().setFromObject(g);
    const center = after.getCenter(new Vector3());
    g.position.set(-center.x, -after.min.y, -center.z);
    return g;
  }, [scene]);
  return <primitive object={root} />;
}

export function PliersCharacter({
  pose,
  prompt,
  hidePrompt,
}: {
  pose: RefObject<PlayerPose>;
  prompt: string | null;
  hidePrompt: boolean;
}) {
  const group = useRef<Group>(null);
  const bob = useRef(0);

  useFrame(({ camera }, delta) => {
    const g = group.current;
    const p = pose.current;
    if (!g || !p) return;
    bob.current += p.moving ? delta * 10 : 0;
    const lift = p.moving ? Math.abs(Math.sin(bob.current)) * 0.05 : 0;
    g.position.set(p.x, lift, p.z);
    g.rotation.y = p.yaw;
    const camDist = Math.hypot(camera.position.x - p.x, camera.position.z - p.z);
    g.visible = camDist > 0.9;
  });

  return (
    <group ref={group} position={[PLAYER_SPAWN.x, 0, PLAYER_SPAWN.z]} rotation={[0, PLAYER_SPAWN.yaw, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow raycast={() => null}>
        <circleGeometry args={[0.42, 24]} />
        <meshStandardMaterial color="#111113" transparent opacity={0.5} />
      </mesh>
      <Suspense
        fallback={
          <group position={[0, 0.55, 0]}>
            <mesh castShadow position={[0, 0.05, 0]} rotation={[0, 0, 0.15]}>
              <capsuleGeometry args={[0.07, 0.85, 6, 12]} />
              <meshStandardMaterial color="#c45c2a" roughness={0.45} metalness={0.15} />
            </mesh>
            <mesh castShadow position={[0, 0.05, 0]} rotation={[0, 0, -0.15]}>
              <capsuleGeometry args={[0.07, 0.85, 6, 12]} />
              <meshStandardMaterial color="#e8b923" roughness={0.45} metalness={0.15} />
            </mesh>
            <mesh castShadow position={[0, 0.72, 0]}>
              <boxGeometry args={[0.12, 0.35, 0.06]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        }
      >
        <PliersAvatar />
      </Suspense>
      {prompt && !hidePrompt && (
        <Html center position={[0, 1.42, 0]} style={{ pointerEvents: 'none', whiteSpace: 'normal', maxWidth: '16rem' }}>
          <div className="rounded-md bg-black/75 px-2 py-1 text-center text-[11px] font-medium tracking-wide text-white shadow-md">
            {prompt}
          </div>
        </Html>
      )}
    </group>
  );
}
