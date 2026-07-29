'use client';

import { ContactShadows, Sparkles } from '@react-three/drei';

/** Post-set polish: contact shadow + subtle workshop dust (game feel, not candy). */
export function SceneEffects() {
  return (
    <>
      <ContactShadows
        position={[0.05, -2.05, 0.15]}
        opacity={0.5}
        scale={12}
        blur={2.6}
        far={6}
        color="#0c0a09"
      />
      <Sparkles
        count={18}
        scale={[5.0, 3.2, 2.8]}
        size={1.4}
        speed={0.18}
        opacity={0.16}
        color="#d6c4a8"
        position={[0.1, -0.1, 0.55]}
      />
      <Sparkles
        count={10}
        scale={[3.6, 2.2, 2.0]}
        size={1.1}
        speed={0.1}
        opacity={0.1}
        color="#c4b8a4"
        position={[0.35, 0.15, 0.75]}
      />
    </>
  );
}
