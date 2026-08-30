'use client';

import { Clone } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { Box3, Euler, Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import { keepNamed, pruneHidden } from './kitchen-cupboard';
import { hideNamed } from './scene-graph';
import { useKeptGltf } from './useKeptGltf';

export { findNamed, hideNamed } from './scene-graph';

export type FitMode = 'contain' | 'width' | 'height' | 'stretch';

const filteredScenes = new Map<string, Object3D>();

function filterScene(
  scene: Object3D,
  keep?: RegExp,
  hide?: RegExp,
  prepare?: (root: Object3D) => void
) {
  if (!keep && !hide && !prepare) return scene;
  const key = `v2|${scene.uuid}|k:${keep?.source ?? ''}|h:${hide?.source ?? ''}|p:${prepare?.name ?? ''}`;
  const cached = filteredScenes.get(key);
  if (cached) return cached;
  const clone = scene.clone(true);
  if (keep) keepNamed(clone, keep);
  if (hide) hideNamed(clone, hide);
  if (keep || hide) pruneHidden(clone);
  prepare?.(clone);
  filteredScenes.set(key, clone);
  return clone;
}

function rotatedAabb(
  min: Vector3,
  max: Vector3,
  scale: [number, number, number],
  localOffset: [number, number, number],
  euler: Euler
) {
  const box = new Box3();
  const v = new Vector3();
  for (const x of [min.x, max.x]) {
    for (const y of [min.y, max.y]) {
      for (const z of [min.z, max.z]) {
        v.set(x * scale[0] + localOffset[0], y * scale[1] + localOffset[1], z * scale[2] + localOffset[2]).applyEuler(
          euler
        );
        box.expandByPoint(v);
      }
    }
  }
  return box;
}

export type AlignMode = 'bottom' | 'center' | 'top';

function measureVisible(
  source: Object3D,
  maxSize: [number, number, number],
  align: AlignMode,
  pin: 'center' | 'min' | 'front' | 'back',
  fit: FitMode,
  preScale: number,
  rotation: [number, number, number],
  pinPad: number
) {
  const parent = source.parent;
  const prevPos = source.position.clone();
  const prevRot = source.rotation.clone();
  const prevScale = source.scale.clone();
  if (parent) parent.remove(source);
  source.position.set(0, 0, 0);
  source.rotation.set(0, 0, 0);
  source.scale.set(1, 1, 1);
  source.updateWorldMatrix(true, true);

  const box = new Box3();
  source.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh || !mesh.visible) return;
    let ancestor: Object3D | null = mesh;
    while (ancestor) {
      if (!ancestor.visible) return;
      ancestor = ancestor.parent;
    }
    box.expandByObject(mesh);
  });

  source.position.copy(prevPos);
  source.rotation.copy(prevRot);
  source.scale.copy(prevScale);
  if (parent) parent.add(source);

  const size = box.getSize(new Vector3());
  const minDim = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(minDim) || minDim < 1e-6) {
    return {
      localOffset: [0, 0, 0] as [number, number, number],
      worldShift: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
    };
  }

  const euler = new Euler(rotation[0], rotation[1], rotation[2], 'XYZ');
  const center = box.getCenter(new Vector3());
  const pre: [number, number, number] = [preScale, preScale, preScale];
  const preOff: [number, number, number] = [-center.x * preScale, -center.y * preScale, -center.z * preScale];
  const world0 = rotatedAabb(box.min, box.max, pre, preOff, euler).getSize(new Vector3());

  const sx = maxSize[0] / Math.max(world0.x, 1e-6);
  const sy = maxSize[1] / Math.max(world0.y, 1e-6);
  const sz = maxSize[2] / Math.max(world0.z, 1e-6);
  const s = fit === 'width' ? sx : fit === 'height' ? sy : Math.min(sx, sy, sz);
  const scale: [number, number, number] =
    fit === 'stretch' ? [sx * preScale, sy * preScale, sz * preScale] : [s * preScale, s * preScale, s * preScale];

  const localOffset: [number, number, number] = [-center.x * scale[0], -center.y * scale[1], -center.z * scale[2]];
  const aabb = rotatedAabb(box.min, box.max, scale, localOffset, euler);
  return {
    scale,
    localOffset,
    worldShift: [
      pin === 'min' ? -aabb.min.x : -(aabb.min.x + aabb.max.x) / 2,
      align === 'bottom' ? -aabb.min.y : align === 'top' ? -aabb.max.y : -(aabb.min.y + aabb.max.y) / 2,
      pin === 'min' || pin === 'back'
        ? -aabb.min.z
        : pin === 'front'
          ? -(aabb.max.z - pinPad)
          : -(aabb.min.z + aabb.max.z) / 2,
    ] as [number, number, number],
  };
}

type FittedGltfProps = {
  url: string;
  maxSize: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  align?: AlignMode;
  /** min pins the AABB corner; back pins min.z only so a wall hood stays centered. */
  pin?: 'center' | 'min' | 'front' | 'back';
  /** When pin=front, sit this far behind the AABB front so handles can project past the joinery. */
  pinPad?: number;
  hide?: RegExp;
  /** Keep matching nodes (and their ancestors/descendants); hide the rest. */
  keep?: RegExp;
  /** Mutate a filtered clone once (split doors, recolor) before measuring. */
  prepare?: (root: Object3D) => void;
  share?: boolean;
  /** contain = keep proportions. width = bay width. height = bay height. */
  fit?: FitMode;
  /** Convert mm (0.001) or cm (0.01) or inches (0.0254) to metres before fitting. */
  preScale?: number;
  envIntensity?: number;
  /** Recolor product metal to black stainless. Glass stays dark glass. */
  finish?: 'black-steel';
  /** Small fittings skip shadows — they don't read at room scale and they cost. */
  shadows?: boolean;
  onReady?: (root: Object3D) => void;
  children?: ReactNode;
};

export function FittedGltf({
  url,
  maxSize,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  align = 'bottom',
  pin = 'center',
  pinPad = 0,
  hide,
  keep,
  prepare,
  share: _share = false,
  fit = 'contain',
  preScale = 1,
  envIntensity = 1,
  finish,
  shadows = true,
  onReady,
  children,
}: FittedGltfProps) {
  const { scene } = useKeptGltf(url);
  const wrap = useRef<Group>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const source = useMemo(
    () => filterScene(scene, keep, hide, prepare),
    [scene, keep, hide, prepare]
  );

  const fitResult = useMemo(() => {
    return measureVisible(source, maxSize, align, pin, fit, preScale, rotation, pinPad);
  }, [source, maxSize[0], maxSize[1], maxSize[2], align, pin, pinPad, fit, preScale, rotation[0], rotation[1], rotation[2]]);

  useLayoutEffect(() => {
    const g = wrap.current;
    if (!g) return;
    g.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = shadows;
      mesh.receiveShadow = shadows;
      // Hits in front of fittings own pointer events — GLBs must not steal taps.
      mesh.raycast = () => undefined;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = mats.map((mat) => {
        const src = mat as MeshStandardMaterial;
        if (!src) return mat;
        const m = finish ? src.clone() : src;
        if ('envMapIntensity' in m) m.envMapIntensity = envIntensity;
        if (finish === 'black-steel') {
          const n = `${m.name ?? ''} ${mesh.name ?? ''}`.toLowerCase();
          const glass = /glass|translucent/.test(n);
          m.map = null;
          m.emissiveMap = null;
          if (glass) {
            m.color.set('#141416');
            m.metalness = 0.15;
            m.roughness = 0.08;
            m.transparent = true;
            m.opacity = 0.92;
          } else {
            m.color.set('#1c1d20');
            m.metalness = 0.72;
            m.roughness = 0.32;
            m.transparent = false;
            m.opacity = 1;
          }
          m.needsUpdate = true;
        }
        return m;
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
    });
    g.updateWorldMatrix(true, true);
    onReadyRef.current?.(g);
  }, [source, fitResult, envIntensity, finish, shadows]);

  return (
    <group position={position}>
      <group position={fitResult.worldShift}>
        <group rotation={rotation}>
          <group ref={wrap} position={fitResult.localOffset} scale={fitResult.scale}>
            <Clone object={source} castShadow={shadows} receiveShadow={shadows} />
            {/* Children share the fitted model frame (scale + pin + rotation). */}
            {children}
          </group>
        </group>
      </group>
    </group>
  );
}
