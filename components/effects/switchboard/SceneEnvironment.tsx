'use client';

import type { SwitchboardMaterials } from './materials';
import { SceneLighting } from './scene/SceneLighting';
import { SceneSetDressing } from './scene/SceneSetDressing';

type Props = {
  materials: SwitchboardMaterials;
};

/** Workshop environment — lighting + set dressing composition. */
export function SceneEnvironment({ materials }: Props) {
  return (
    <group>
      <SceneLighting />
      <SceneSetDressing materials={materials} />
    </group>
  );
}
