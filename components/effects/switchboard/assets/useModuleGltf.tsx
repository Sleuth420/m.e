'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Object3D, Vector3 } from 'three';
import { MODULE_GLB, MODULE_TARGET, type ModuleKind } from './module-assets';

type TargetSize = {
  width: number;
  height: number;
  depth: number;
};

/**
 * Fit width/height with uniform XY scale, then stretch Z to the target depth.
 * Re-center after scaling so overlays at ±depth/2 land on the shell faces.
 */
function normalizeToTarget(source: Object3D, target: TargetSize): Object3D {
  const root = new Object3D();
  const model = source.clone(true);
  root.add(model);
  root.updateMatrixWorld(true);

  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  box.getSize(size);
  const center = new Vector3();
  box.getCenter(center);

  // Independent axes so poles always fill BOARD pitch (DIN clip/extras
  // must not shrink width and leave gaps between RCBOs).
  const sx = size.x > 1e-6 ? target.width / size.x : 1;
  const sy = size.y > 1e-6 ? target.height / size.y : 1;
  const sz = size.z > 1e-6 ? target.depth / size.z : 1;

  model.position.sub(center);
  root.scale.set(sx, sy, sz);
  root.updateMatrixWorld(true);

  // Final recenter in case non-uniform scale shifted the visual bounds
  const box2 = new Box3().setFromObject(root);
  const center2 = new Vector3();
  box2.getCenter(center2);
  root.position.sub(center2);

  root.traverse((obj) => {
    // No cast shadows on shells — self-shadow rings the switch cavity black
    obj.castShadow = false;
    obj.receiveShadow = true;
  });

  return root;
}

/** Load + normalize a module GLB once; callers should clone for instances. */
export function useModuleGltf(kind: ModuleKind) {
  const path = MODULE_GLB[kind];
  const gltf = useGLTF(path);
  const target = MODULE_TARGET[kind];

  const template = useMemo(
    () => normalizeToTarget(gltf.scene, target),
    [gltf.scene, target]
  );

  return template;
}

useGLTF.preload(MODULE_GLB.rcbo);
useGLTF.preload(MODULE_GLB.mainSwitch);
