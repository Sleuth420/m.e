'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type { RoomInteractId } from './room-layout';
import type { PromptTone, RoomActionPrompt } from './room-prompt';
import {
  INITIAL_ROOM_PLAY,
  roomPlayReducer,
  type RoomPlayState,
  type RoomPlayAction,
} from './room-play';

export type MobileKeys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  inspect: boolean;
  stickX: number;
  stickY: number;
};

export type GameInputApi = {
  lowDetail: boolean;
  setLowDetail: (value: boolean) => void;
  pointerHint: string | null;
  setPointerHint: (value: string | null) => void;
  play: RoomPlayState;
  dispatchRoom: React.Dispatch<RoomPlayAction>;
  wiringView: boolean;
  setWiringView: (value: boolean) => void;
  mobileKeys: React.RefObject<MobileKeys>;
  pulseInteract: () => void;
  consumeInteract: () => boolean;
  stunUntil: React.RefObject<number>;
  setStunned: (ms: number) => void;
  isStunned: () => boolean;
  actionPrompt: string | null;
  actionTone: PromptTone;
  setActionPrompt: (prompt: RoomActionPrompt | null) => void;
  highlightedId: RoomInteractId | null;
  setHighlightedId: (id: RoomInteractId | null) => void;
  entryHint: boolean;
  dismissEntryHint: () => void;
};

const defaultKeys = (): MobileKeys => ({
  forward: false,
  back: false,
  left: false,
  right: false,
  turnLeft: false,
  turnRight: false,
  inspect: false,
  stickX: 0,
  stickY: 0,
});

type HudState = Pick<
  GameInputApi,
  'pointerHint' | 'actionPrompt' | 'actionTone' | 'highlightedId' | 'entryHint'
>;
type SceneInput = Omit<GameInputApi, keyof HudState>;
const GameInputContext = createContext<SceneInput | null>(null);
const GameHudContext = createContext<HudState | null>(null);

export function GameInputProvider({ children }: { children: ReactNode }) {
  const [lowDetail, setLowDetail] = useState(false);
  const [pointerHint, setPointerHint] = useState<string | null>(null);
  const [play, dispatchRoom] = useReducer(roomPlayReducer, INITIAL_ROOM_PLAY);
  const [wiringView, setWiringView] = useState(false);
  const mobileKeys = useRef<MobileKeys>(defaultKeys());
  const interactQueued = useRef(false);
  const stunUntil = useRef(0);
  const [actionPrompt, setActionPromptText] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<PromptTone>('default');
  const [highlightedId, setHighlightedId] = useState<RoomInteractId | null>(null);
  const [entryHint, setEntryHint] = useState(true);

  const pulseInteract = useCallback(() => {
    interactQueued.current = true;
  }, []);

  const consumeInteract = useCallback(() => {
    if (!interactQueued.current) return false;
    interactQueued.current = false;
    return true;
  }, []);

  const setStunned = useCallback((ms: number) => {
    stunUntil.current = performance.now() + ms;
  }, []);

  const isStunned = useCallback(() => performance.now() < stunUntil.current, []);

  const setActionPrompt = useCallback((prompt: RoomActionPrompt | null) => {
    setActionPromptText(prompt?.text ?? null);
    setActionTone(prompt?.tone ?? 'default');
  }, []);

  const dismissEntryHint = useCallback(() => {
    setEntryHint(false);
  }, []);

  const value = useMemo(
    () => ({
      lowDetail,
      setLowDetail,
      setPointerHint,
      wiringView,
      setWiringView,
      play,
      dispatchRoom,
      mobileKeys,
      pulseInteract,
      consumeInteract,
      stunUntil,
      setStunned,
      isStunned,
      setActionPrompt,
      setHighlightedId,
      dismissEntryHint,
    }),
    [
      lowDetail,
      wiringView,
      play,
      pulseInteract,
      consumeInteract,
      setStunned,
      isStunned,
      setActionPrompt,
      dismissEntryHint,
    ]
  );

  const hud = useMemo(
    () => ({ pointerHint, actionPrompt, actionTone, highlightedId, entryHint }),
    [pointerHint, actionPrompt, actionTone, highlightedId, entryHint]
  );
  return (
    <GameInputContext.Provider value={value}>
      <GameHudContext.Provider value={hud}>{children}</GameHudContext.Provider>
    </GameInputContext.Provider>
  );
}

export function useGameInput() {
  const ctx = useContext(GameInputContext);
  if (!ctx) throw new Error('useGameInput must be used inside GameInputProvider');
  return ctx;
}

/** Only the DOM HUD subscribes to transient hints; meshes keep their scene state. */
export function useGameHud() {
  const ctx = useContext(GameHudContext);
  if (!ctx) throw new Error('useGameHud must be used inside GameInputProvider');
  return ctx;
}
