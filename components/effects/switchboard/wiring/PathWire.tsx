'use client';

import { useMemo } from 'react';
import { CatmullRomCurve3, ExtrudeGeometry, MeshStandardMaterial, Shape, TubeGeometry, Vector3 } from 'three';
import type { Vec3 } from '../circuit-data';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { sanitize, withSag, withSoftMids } from './path-utils';

type Props = {
  points: Vec3[];
  radius: number;
  material: MeshStandardMaterial;
  segments?: number;
  live?: boolean;
  /** Soft corner mids — off for straight TPS columns through glands */
  soft?: boolean;
  /** Sag long horizontal spans like real TPS between studs. */
  sag?: boolean;
  /** 1 = round tube. ~0.55 = flattened TPS oval. */
  oval?: number;
  /** When set and live, clicking the conductor triggers shock */
  circuitId?: string;
  shockable?: boolean;
  onShock?: (circuitId: string) => void;
};

function makeGeometry(
  points: Vec3[],
  radius: number,
  segments: number,
  soft: boolean,
  sag: boolean,
  oval: number
) {
  let src = points;
  if (sag) src = withSag(src);
  const cleaned = sanitize(soft ? withSoftMids(src) : src);
  if (cleaned.length < 2) return null;
  while (cleaned.length < 4) {
    const last = cleaned[cleaned.length - 1]!;
    cleaned.push(last.clone().add(new Vector3(0, -0.01, 0)));
  }
  const tension = sag ? 0.18 : soft ? 0.5 : 0.01;
  const curve = new CatmullRomCurve3(cleaned, false, 'catmullrom', tension);
  const tubular = Math.max(segments, cleaned.length * 6);
  if (oval < 0.97) {
    const shape = new Shape();
    shape.absellipse(0, 0, radius, Math.max(0.002, radius * oval), 0, Math.PI * 2, false, 0);
    return new ExtrudeGeometry(shape, {
      steps: tubular,
      bevelEnabled: false,
      extrudePath: curve,
      curveSegments: 7,
    });
  }
  return new TubeGeometry(curve, tubular, radius, 8, false);
}

/** Tube / oval TPS along a path. */
export function PathWire({
  points,
  radius,
  material,
  segments = 64,
  live = true,
  soft = true,
  sag = false,
  oval = 1,
  circuitId,
  shockable = false,
  onShock,
}: Props) {
  const geometry = useMemo(() => {
    try {
      return makeGeometry(points, radius, segments, soft, sag, oval);
    } catch {
      return null;
    }
  }, [points, radius, segments, soft, sag, oval]);

  const mat = useMemo(() => {
    const m = material.clone();
    m.emissiveIntensity = 0;
    m.opacity = live ? 1 : 0.42;
    m.transparent = !live;
    if (live && shockable) {
      m.emissive.set('#ef4444');
      m.emissiveIntensity = 0.08;
    }
    m.needsUpdate = true;
    return m;
  }, [material, live, shockable]);

  const canShock = shockable && live && circuitId && onShock;

  if (!geometry) return null;

  return (
    <mesh
      geometry={geometry}
      castShadow
      material={mat}
      onClick={
        canShock
          ? (e) =>
              onInteractiveClick(e, () => {
                onShock!(circuitId);
              })
          : undefined
      }
      onPointerOver={
        canShock
          ? (e) => {
              onInteractiveEnter(e);
            }
          : undefined
      }
      onPointerOut={canShock ? () => onInteractiveLeave() : undefined}
    />
  );
}
