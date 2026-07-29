'use client';

import { MODULE_TARGET, MODULE_WELLS } from './assets/module-assets';
import { BOARD, mainSwitchX, moduleBodyZ } from './circuit-data';
import { useDampRotation } from './hooks/useDampRotation';
import { onInteractiveEnter, onInteractiveLeave } from './interaction';
import type { SwitchboardMaterials } from './materials';
import { ModuleShell } from './parts/ModuleShell';
import { RockerLever } from './parts/RockerLever';
import { useMainSwitchFaceTexture } from './textures';

type Props = {
  materials: SwitchboardMaterials;
  on: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
};

export function MainSwitch({ materials, on, highlighted, onToggle, onHover }: Props) {
  const x = mainSwitchX();
  const face = useMainSwitchFaceTexture();
  const leverRef = useDampRotation(on ? -0.32 : 0.28);

  const size = MODULE_TARGET.mainSwitch;
  const wells = MODULE_WELLS.mainSwitch;
  const faceZ = size.depth / 2;
  const bodyZ = moduleBodyZ();

  return (
    <group position={[x, BOARD.railY, bodyZ]}>
      <ModuleShell
        kind="mainSwitch"
        highlighted={highlighted}
        onPointerOver={(e) => onInteractiveEnter(e, () => onHover('main'))}
        onPointerOut={() => onInteractiveLeave(() => onHover(null))}
      />

      <mesh position={[0, wells.face.y, faceZ + wells.face.zPad]}>
        <boxGeometry
          args={[
            size.width * wells.face.widthFactor,
            size.height * wells.face.heightFactor,
            0.004,
          ]}
        />
        <meshStandardMaterial map={face} roughness={0.72} metalness={0.02} />
      </mesh>

      <group position={[0, wells.rocker.y, faceZ + wells.rocker.zPad]}>
        <RockerLever
          leverRef={leverRef}
          material={materials.plasticRed}
          onToggle={onToggle}
          accentColor="#9b1c1c"
          width={size.width - 0.055}
          height={0.1}
          depth={0.028}
          showStatusWindow
          statusLive={on}
        />
      </group>
    </group>
  );
}
