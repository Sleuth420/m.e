'use client';

import { useMemo } from 'react';
import { CatmullRomCurve3, MeshStandardMaterial, TubeGeometry, Vector3 } from 'three';
import type { Vec3 } from '../circuit-data';
import { sanitize, withSoftMids } from './path-utils';

type Props = {
  points: Vec3[];
  radius: number;
  material: MeshStandardMaterial;
  segments?: number;
  live?: boolean;
  /** Soft corner mids — off for straight TPS columns through glands */
  soft?: boolean;
};

/** Tube geometry along a soft CatmullRom path. */
export function PathWire({
  points,
  radius,
  material,
  segments = 64,
  live = true,
  soft = true,
}: Props) {
  const geometry = useMemo(() => {
    try {
      const cleaned = sanitize(soft ? withSoftMids(points) : points);
      if (cleaned.length < 2) return null;
      while (cleaned.length < 4) {
        const last = cleaned[cleaned.length - 1]!;
        cleaned.push(last.clone().add(new Vector3(0, -0.01, 0)));
      }
      const curve = new CatmullRomCurve3(cleaned, false, 'catmullrom', soft ? 0.5 : 0.01);
      return new TubeGeometry(curve, Math.max(segments, cleaned.length * 5), radius, 8, false);
    } catch {
      return null;
    }
  }, [points, radius, segments, soft]);

  const mat = useMemo(() => {
    const m = material.clone();
    // Colour coding only — no gamey emissive glow on live conductors
    m.emissiveIntensity = 0;
    m.opacity = live ? 1 : 0.42;
    m.transparent = !live;
    m.needsUpdate = true;
    return m;
  }, [material, live]);

  if (!geometry) return null;
  return <mesh geometry={geometry} castShadow material={mat} />;
}
