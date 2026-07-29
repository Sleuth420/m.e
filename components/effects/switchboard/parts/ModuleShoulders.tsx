'use client';

type Props = {
  w: number;
  h: number;
  d: number;
  /** How far back the shoulders sit relative to body depth */
  zFactor?: number;
};

/** Rear upper/lower shoulders that leave a mid notch for the DIN rail. */
export function ModuleShoulders({ w, h, d, zFactor = 0.42 }: Props) {
  return (
    <>
      <mesh position={[0, h * 0.3, -d * zFactor]} castShadow>
        <boxGeometry args={[w - 0.03, h * 0.26, d * 0.22]} />
        <meshStandardMaterial color="#c2c2c6" roughness={0.48} />
      </mesh>
      <mesh position={[0, -h * 0.3, -d * zFactor]} castShadow>
        <boxGeometry args={[w - 0.03, h * 0.26, d * 0.22]} />
        <meshStandardMaterial color="#c2c2c6" roughness={0.48} />
      </mesh>
    </>
  );
}
