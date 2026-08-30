import { Color, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';

export function findNamed(root: Object3D, match: RegExp): Object3D | null {
  let found: Object3D | null = null;
  root.traverse((obj) => {
    if (found || !obj.name) return;
    if (match.test(obj.name)) found = obj;
  });
  return found;
}

export function hideNamed(root: Object3D, match: RegExp) {
  root.traverse((obj) => {
    if (obj.name && match.test(obj.name)) obj.visible = false;
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat?.name && match.test(mat.name)) {
        mesh.visible = false;
        break;
      }
    }
  });
}

export function cloneGltfScene(
  source: Object3D,
  opts: { shadows?: boolean; skipRaycast?: boolean } = {}
): Group {
  const shadows = opts.shadows ?? true;
  const g = source.clone(true) as Group;
  g.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = shadows;
    mesh.receiveShadow = shadows;
    if (opts.skipRaycast) mesh.raycast = () => undefined;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => m.clone());
    } else if (mesh.material) {
      mesh.material = (mesh.material as MeshStandardMaterial).clone();
    }
  });
  return g;
}

export function setNamedEmissive(
  root: Object3D,
  name: string,
  on: boolean,
  opts: { color?: string; intensity?: number } = {}
) {
  const color = opts.color ?? '#fde68a';
  const intensity = opts.intensity ?? 1.4;
  root.traverse((obj) => {
    if (obj.name !== name) return;
    const mesh = obj as Mesh;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.emissive) continue;
      m.emissive = new Color(on ? color : '#000000');
      m.emissiveIntensity = on ? intensity : 0;
    }
  });
}
