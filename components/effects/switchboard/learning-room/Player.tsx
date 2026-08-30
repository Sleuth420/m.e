'use client';

import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject, Suspense } from 'react';
import { Group, MathUtils, PerspectiveCamera, Box3, Vector3, type Mesh, type MeshStandardMaterial } from 'three';
import { setLookDragActive, markInteract, wasRecentInteract } from '../interaction';
import {
  BOARD_MOUNT,
  IDLE_CAMERA,
  PLAYER,
  PLAYER_SPAWN,
  ROOM,
  atBoard,
  nearBoard,
  nearestRoomInteract,
  type RoomInteractId,
  resolvePlayerPosition,
  resolveOpenDoors,
} from './room-layout';
import { useGameInput } from './GameInputContext';
import { useSwitchboard } from '../SwitchboardContext';
import { FittedGltf } from './FittedGltf';
import { useKeptGltf, loadKeptGltf } from './useKeptGltf';
import { ROOM_GLB } from './room-assets';

type Keys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
};

export type PlayerPose = {
  x: number;
  z: number;
  yaw: number;
  moving: boolean;
};

type Props = {
  enabled: boolean;
  onExit: () => void;
  onInteract: (id: RoomInteractId) => void;
  openById: Partial<Record<RoomInteractId, boolean>>;
  fridgeOpen: boolean;
  toasterPop: boolean;
  lightSwitchOn: boolean;
  powerLive: boolean;
  isolatorOn: boolean;
  sinkOn: boolean;
  boiling: boolean;
  hobLive: boolean;
  loungePowerLive: boolean;
  loungeLightLive: boolean;
  loungeDimmer: number;
  tvOn: boolean;
};

type Zoom = {
  hold: boolean;
  amount: number;
};

const FOV_DEFAULT = 46;
const FOV_ZOOM = 28;

function emptyKeys(): Keys {
  return {
    forward: false,
    back: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
  };
}

export function Player({
  enabled,
  onExit,
  onInteract,
  openById,
  fridgeOpen,
  toasterPop,
  lightSwitchOn,
  powerLive,
  isolatorOn,
  sinkOn,
  boiling,
  hobLive,
  loungePowerLive,
  loungeLightLive,
  loungeDimmer,
  tvOn,
}: Props) {
  const { gl } = useThree();
  const { coverOpen, requestCoverOpen } = useSwitchboard();
  const { mobileKeys, consumeInteract, isStunned, setStunned, setActionPrompt } = useGameInput();
  const keys = useRef<Keys>(emptyKeys());
  const zoom = useRef<Zoom>({ hold: false, amount: 0 });
  const pose = useRef<PlayerPose>({
    x: PLAYER_SPAWN.x,
    z: PLAYER_SPAWN.z,
    yaw: PLAYER_SPAWN.yaw,
    moving: false,
  });
  const dummy = useMemo(() => new Group(), []);
  const look = useRef({
    x: IDLE_CAMERA.target[0],
    y: IDLE_CAMERA.target[1],
    z: IDLE_CAMERA.target[2],
  });
  const [prompt, setPrompt] = useState<string | null>(null);
  const promptRef = useRef<string | null>(null);
  const shake = useRef(0);
  const coarseRef = useRef(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const update = () => {
      coarseRef.current = mq.matches;
      setCoarse(mq.matches);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) setActionPrompt(null);
  }, [enabled, setActionPrompt]);

  useEffect(() => {
    const onShock = () => setStunned(1800);
    window.addEventListener('switchboard-shock', onShock);
    return () => window.removeEventListener('switchboard-shock', onShock);
  }, [setStunned]);

  useEffect(() => {
    if (!enabled) {
      keys.current = emptyKeys();
      zoom.current = { hold: false, amount: 0 };
      return;
    }

    const setKey = (code: string, down: boolean) => {
      const k = keys.current;
      if (code === 'KeyW' || code === 'ArrowUp') k.forward = down;
      if (code === 'KeyS' || code === 'ArrowDown') k.back = down;
      if (code === 'KeyA') k.left = down;
      if (code === 'KeyD') k.right = down;
      if (code === 'ArrowLeft' || code === 'KeyQ') k.turnLeft = down;
      if (code === 'ArrowRight' || code === 'KeyE') k.turnRight = down;
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyZ') zoom.current.hold = down;
    };

    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'Space' ||
        e.code === 'KeyZ' ||
        e.code.startsWith('Shift')
      ) {
        e.preventDefault();
      }
      if (e.repeat && (e.code === 'KeyF' || e.code === 'Enter' || e.code === 'Escape')) return;
      setKey(e.code, true);
      if (e.repeat) return;
      if (e.code === 'KeyF' || e.code === 'Enter') {
        const { x, z } = pose.current;
        const hit = nearestRoomInteract(x, z, [], zoom.current.hold || zoom.current.amount > 0.25);
        if (hit) {
          onInteract(hit.id);
          return;
        }
        if (nearBoard(x, z) && !coverOpen) {
          requestCoverOpen();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => setKey(e.code, false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom.current.amount = MathUtils.clamp(zoom.current.amount + (e.deltaY > 0 ? -0.08 : 0.08), 0, 1);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        zoom.current.hold = true;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) zoom.current.hold = false;
    };
    const onContext = (e: MouseEvent) => e.preventDefault();

    const canvas = gl.domElement;
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onContext);

    const look = { id: -1, x: 0, y: 0, dragging: false, canLook: false };
    const TAP_PX = 14;
    const LOOK_SENS = 0.0048;
    const useNearest = () => {
      if (wasRecentInteract()) return;
      const { x, z } = pose.current;
      const hit = nearestRoomInteract(x, z, [], false);
      if (hit) {
        markInteract();
        onInteract(hit.id);
      } else if (nearBoard(x, z) && !coverOpen) {
        markInteract();
        requestCoverOpen();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!coarseRef.current) return;
      look.id = e.pointerId;
      look.x = e.clientX;
      look.y = e.clientY;
      look.dragging = false;
      look.canLook = e.pointerType !== 'mouse';
      setLookDragActive(false);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (look.id !== e.pointerId || !look.canLook) return;
      const dx = e.clientX - look.x;
      const dy = e.clientY - look.y;
      if (!look.dragging && dx * dx + dy * dy < TAP_PX * TAP_PX) return;
      look.dragging = true;
      setLookDragActive(true);
      pose.current.yaw -= dx * LOOK_SENS;
      look.x = e.clientX;
      look.y = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (look.id !== e.pointerId) return;
      const dragged = look.dragging;
      look.id = -1;
      look.dragging = false;
      if (dragged) {
        e.stopImmediatePropagation();
        window.setTimeout(() => setLookDragActive(false), 0);
        return;
      }
      // Let R3F Hits claim the tap first; empty canvas uses the nearest fitting.
      if (coarseRef.current) window.setTimeout(useNearest, 0);
      window.setTimeout(() => setLookDragActive(false), 0);
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp, true);
    canvas.addEventListener('pointercancel', onPointerUp, true);

    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('contextmenu', onContext);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp, true);
      canvas.removeEventListener('pointercancel', onPointerUp, true);
      setLookDragActive(false);
    };
  }, [enabled, gl, onExit, onInteract, coverOpen, requestCoverOpen]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = pose.current;
    const persp = camera as PerspectiveCamera;
    const stunned = isStunned();
    const m = mobileKeys.current;
    if (enabled) {
      const k = keys.current;
      const moveForward = k.forward || m.forward;
      const moveBack = k.back || m.back;
      const moveLeft = k.left || m.left;
      const moveRight = k.right || m.right;
      const turnL = k.turnLeft || m.turnLeft;
      const turnR = k.turnRight || m.turnRight;

      if (!stunned) {
        if (turnL) p.yaw += PLAYER.turnSpeed * dt;
        if (turnR) p.yaw -= PLAYER.turnSpeed * dt;

        const sin = Math.sin(p.yaw);
        const cos = Math.cos(p.yaw);
        let vx = 0;
        let vz = 0;
        if (moveForward) {
          vx += sin;
          vz += cos;
        }
        if (moveBack) {
          vx -= sin;
          vz -= cos;
        }
        if (moveLeft) {
          vx += cos;
          vz -= sin;
        }
        if (moveRight) {
          vx -= cos;
          vz += sin;
        }
        const len = Math.hypot(vx, vz);
        p.moving = len > 0;
        if (len > 0) {
          const next = resolvePlayerPosition(
            p.x + (vx / len) * PLAYER.speed * dt,
            p.z + (vz / len) * PLAYER.speed * dt
          );
          p.x = next.x;
          p.z = next.z;
        }
      } else {
        p.moving = false;
        shake.current = Math.max(shake.current, 0.35);
      }

      const doors = resolveOpenDoors(p.x, p.z, {
        dishwasher: !!openById.dishwasher,
        fridge: fridgeOpen,
      });
      p.x = doors.x;
      p.z = doors.z;

      if (consumeInteract()) {
        const { x, z } = pose.current;
        const hit = nearestRoomInteract(
          x,
          z,
          [],
          zoom.current.hold || zoom.current.amount > 0.25 || m.inspect
        );
        if (hit) {
          onInteract(hit.id);
        } else if (nearBoard(x, z) && !coverOpen) {
          requestCoverOpen();
        }
      }

      let nextPrompt: string | null = null;
      const hit = nearestRoomInteract(
        p.x,
        p.z,
        [],
        zoom.current.hold || zoom.current.amount > 0.25 || m.inspect
      );
      if (hit) {
        if (hit.id === 'toaster' || hit.id === 'gpoDouble') {
          nextPrompt = !powerLive
            ? 'Kitchen power is off'
            : toasterPop
              ? hit.promptClose
              : hit.promptOpen;
        } else if (hit.id === 'cookIsolator') {
          nextPrompt = isolatorOn ? 'F · Isolator off' : 'F · Isolator on';
        } else if (hit.id === 'cooktop') {
          nextPrompt = !hobLive ? 'Turn the isolator on' : boiling ? hit.promptClose : hit.promptOpen;
        } else if (hit.id === 'sink') {
          nextPrompt = sinkOn ? hit.promptClose : hit.promptOpen;
        } else if (hit.id === 'loungeDimmerA' || hit.id === 'loungeDimmerB') {
          nextPrompt = !loungeLightLive
            ? 'Lounge lighting is off'
            : loungeDimmer < 0.12
              ? 'F · Dim lounge lights'
              : loungeDimmer < 0.52
                ? 'F · Dim 70%'
                : loungeDimmer < 0.88
                  ? 'F · Dim 100%'
                  : 'F · Lounge lights off';
        } else if (hit.id === 'tv' || hit.id === 'tvGpo') {
          nextPrompt = !loungePowerLive ? 'Lounge power is off' : tvOn ? hit.promptClose : hit.promptOpen;
        } else {
          const isOpen =
            hit.id === 'fridge'
              ? fridgeOpen
              : hit.id === 'switch'
                ? lightSwitchOn
                : !!openById[hit.id];
          nextPrompt = isOpen ? hit.promptClose : hit.promptOpen;
        }
      } else if (nearBoard(p.x, p.z)) {
        nextPrompt = coverOpen
          ? 'Tap a breaker rocker · TEST trips the RCD'
          : coarseRef.current
            ? 'Tap the cover · licensed only'
            : 'Tap the cover or F · licensed only';
      } else {
        nextPrompt = 'Walk to the board, kitchen, or lounge';
      }
      if (coarseRef.current && nextPrompt) nextPrompt = nextPrompt.replaceAll('F · ', 'Tap · ');
      if (nextPrompt !== promptRef.current) {
        promptRef.current = nextPrompt;
        setPrompt(nextPrompt);
        setActionPrompt(nextPrompt);
      }
    }

    const zoomT = enabled
      ? Math.max(
          zoom.current.hold || m.inspect ? 1 : 0,
          zoom.current.amount,
          atBoard(p.x, p.z) && coarseRef.current ? 0.82 : 0
        )
      : 0;
    const targetFov = MathUtils.lerp(FOV_DEFAULT, FOV_ZOOM, zoomT);
    if (Math.abs(persp.fov - targetFov) > 0.05) {
      persp.fov = MathUtils.damp(persp.fov, targetFov, 10, dt);
      persp.updateProjectionMatrix();
    }

    if (!enabled) {
      dummy.position.set(IDLE_CAMERA.position[0], IDLE_CAMERA.position[1], IDLE_CAMERA.position[2]);
      camera.position.lerp(dummy.position, 1 - Math.pow(0.04, dt));
      look.current.x = MathUtils.lerp(look.current.x, IDLE_CAMERA.target[0], 0.08);
      look.current.y = MathUtils.lerp(look.current.y, IDLE_CAMERA.target[1], 0.08);
      look.current.z = MathUtils.lerp(look.current.z, IDLE_CAMERA.target[2], 0.08);
      camera.lookAt(look.current.x, look.current.y, look.current.z);
      return;
    }

    const close = nearBoard(p.x, p.z);
    const leaning = atBoard(p.x, p.z);
    const inspectHit = nearestRoomInteract(p.x, p.z, [], zoomT > 0.25);
    const inspecting = zoomT > 0.2;

    const dist = MathUtils.lerp(leaning ? 1.12 : close ? 1.35 : 2.35, leaning || inspecting ? 0.68 : 1.55, zoomT);
    const height = MathUtils.lerp(leaning ? 1.48 : close ? 1.5 : 1.72, inspecting ? 1.42 : 1.58, zoomT);

    let lookX = p.x + Math.sin(p.yaw) * 1.55;
    let lookY = 1.28;
    let lookZ = p.z + Math.cos(p.yaw) * 1.55;
    if (leaning || close) {
      lookX = BOARD_MOUNT.x + 0.12;
      lookY = BOARD_MOUNT.y - 0.04;
      lookZ = BOARD_MOUNT.z;
    } else if (inspecting && inspectHit) {
      lookX = inspectHit.x;
      lookY = inspectHit.y;
      lookZ = inspectHit.z;
    }

    if (leaning) {
      dummy.position.set(BOARD_MOUNT.x + dist, height, BOARD_MOUNT.z);
    } else {
      dummy.position.set(p.x - Math.sin(p.yaw) * dist, height, p.z - Math.cos(p.yaw) * dist);
    }
    dummy.position.x = MathUtils.clamp(dummy.position.x, 0.28, ROOM.width - 0.2);
    dummy.position.z = MathUtils.clamp(dummy.position.z, 0.28, ROOM.depth - 0.2);
    dummy.position.y = MathUtils.clamp(dummy.position.y, 0.85, ROOM.height - 0.2);

    if (shake.current > 0.01) {
      shake.current = MathUtils.damp(shake.current, 0, 4, dt);
      dummy.position.x += (Math.random() - 0.5) * shake.current * 0.12;
      dummy.position.y += (Math.random() - 0.5) * shake.current * 0.08;
    }

    camera.position.lerp(dummy.position, 1 - Math.pow(0.001, dt));
    look.current.x = MathUtils.lerp(look.current.x, lookX, 0.12);
    look.current.y = MathUtils.lerp(look.current.y, lookY, 0.12);
    look.current.z = MathUtils.lerp(look.current.z, lookZ, 0.12);
    camera.lookAt(look.current.x, look.current.y, look.current.z);
  });

  return enabled ? <PliersCharacter pose={pose} prompt={prompt} hidePrompt /> : null;
}

/** Poly Haven pliers as the player avatar — https://polyhaven.com/a/pliers */
function PliersAvatar() {
  const { scene } = useKeptGltf(ROOM_GLB.pliers);
  const root = useMemo(() => {
    const g = scene.clone(true);
    g.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.raycast = () => undefined;
      const srcs = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = srcs.map((mat) => {
        const src = mat as MeshStandardMaterial;
        if (!src) return mat;
        const m = src.clone();
        const n = `${mesh.name || ''} ${obj.name || ''} ${m.name || ''}`.toLowerCase();
        const gripA = n.includes('pliers_a') || n.includes('handle_01');
        const gripB = n.includes('pliers_b') || n.includes('handle_02');
        if (!m.map) {
          if (gripA) m.color.set('#e8b923');
          else if (gripB) m.color.set('#c45c2a');
          else m.color.set('#c5c9cf');
        }
        m.metalness = gripA || gripB ? 0.18 : 0.82;
        m.roughness = gripA || gripB ? 0.42 : 0.28;
        m.needsUpdate = true;
        return m;
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
    });
    // Asset is already upright along +Y (~18 cm). Scale to character height; do not lay it on its side.
    const box = new Box3().setFromObject(g);
    const size = box.getSize(new Vector3());
    const s = 1.15 / Math.max(size.y, 0.01);
    g.scale.setScalar(s);
    g.rotation.set(0, 0, 0);
    g.updateMatrixWorld(true);
    const after = new Box3().setFromObject(g);
    const center = after.getCenter(new Vector3());
    g.position.set(-center.x, -after.min.y, -center.z);
    return g;
  }, [scene]);
  return <primitive object={root} />;
}

function PliersCharacter({
  pose,
  prompt,
  hidePrompt,
}: {
  pose: RefObject<PlayerPose>;
  prompt: string | null;
  hidePrompt: boolean;
}) {
  const group = useRef<Group>(null);
  const bob = useRef(0);

  useFrame((_, delta) => {
    const g = group.current;
    const p = pose.current;
    if (!g || !p) return;
    bob.current += p.moving ? delta * 10 : 0;
    const lift = p.moving ? Math.abs(Math.sin(bob.current)) * 0.05 : 0;
    g.position.set(p.x, lift, p.z);
    g.rotation.y = p.yaw;
  });

  return (
    <group ref={group} position={[PLAYER_SPAWN.x, 0, PLAYER_SPAWN.z]} rotation={[0, PLAYER_SPAWN.yaw, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow raycast={() => null}>
        <circleGeometry args={[0.42, 24]} />
        <meshStandardMaterial color="#111113" transparent opacity={0.5} />
      </mesh>
      <Suspense
        fallback={
          <group position={[0, 0.55, 0]}>
            <mesh castShadow position={[0, 0.05, 0]} rotation={[0, 0, 0.15]}>
              <capsuleGeometry args={[0.07, 0.85, 6, 12]} />
              <meshStandardMaterial color="#c45c2a" roughness={0.45} metalness={0.15} />
            </mesh>
            <mesh castShadow position={[0, 0.05, 0]} rotation={[0, 0, -0.15]}>
              <capsuleGeometry args={[0.07, 0.85, 6, 12]} />
              <meshStandardMaterial color="#e8b923" roughness={0.45} metalness={0.15} />
            </mesh>
            <mesh castShadow position={[0, 0.72, 0]}>
              <boxGeometry args={[0.12, 0.35, 0.06]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        }
      >
        <PliersAvatar />
      </Suspense>
      {prompt && !hidePrompt && (
        <Html center position={[0, 1.42, 0]} style={{ pointerEvents: 'none', whiteSpace: 'normal', maxWidth: '16rem' }}>
          <div className="rounded-md bg-black/75 px-2 py-1 text-center text-[11px] font-medium tracking-wide text-white shadow-md">
            {prompt}
          </div>
        </Html>
      )}
    </group>
  );
}

loadKeptGltf(ROOM_GLB.pliers);
