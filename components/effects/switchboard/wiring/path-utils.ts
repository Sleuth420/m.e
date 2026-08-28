import { Vector3 } from 'three';
import type { Vec3 } from '../circuit-data';

export function sanitize(points: Vec3[]): Vector3[] {
  const out: Vector3[] = [];
  for (const p of points) {
    if (!p || p.length !== 3) continue;
    const [x, y, z] = p;
    if (![x, y, z].every((n) => typeof n === 'number' && Number.isFinite(n))) continue;
    const v = new Vector3(x, y, z);
    const prev = out[out.length - 1];
    if (!prev || prev.distanceToSquared(v) > 0.00015) out.push(v);
  }
  return out;
}

/** Insert soft mid-points so CatmullRom tubes don't kink at corners. */
export function withSoftMids(points: Vec3[]): Vec3[] {
  if (points.length < 2) return points;
  const out: Vec3[] = [points[0]!];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    out.push([a[0] + dx * 0.3, a[1] + dy * 0.22 + Math.sign(dy || -1) * 0.035, a[2] + dz * 0.35]);
    out.push([a[0] + dx * 0.7, a[1] + dy * 0.78 - Math.sign(dy || -1) * 0.025, a[2] + dz * 0.65]);
    out.push(b);
  }
  return out;
}

/** Insert mid-points so long horizontal TPS sags between studs. */
export function withSag(points: Vec3[], sag = 0.02): Vec3[] {
  if (points.length < 2) return points;
  const out: Vec3[] = [points[0]!];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    const horiz = Math.hypot(dx, dz);
    if (horiz > 0.28 && Math.abs(dy) < 0.08) {
      const n = Math.max(1, Math.round(horiz / 0.38));
      for (let k = 1; k <= n; k++) {
        const t = k / (n + 1);
        const drop = sag * Math.sin(t * Math.PI) * Math.min(1, horiz / 0.75);
        const wobble = 0.005 * Math.sin(t * Math.PI * 2 + a[0] * 9.1 + a[2] * 4.7);
        out.push([a[0] + dx * t, a[1] + dy * t - drop + wobble, a[2] + dz * t]);
      }
    }
    out.push(b);
  }
  return out;
}
