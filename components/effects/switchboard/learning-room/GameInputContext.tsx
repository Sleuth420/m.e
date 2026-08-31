'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { RoomInteractId } from './room-layout';
import type { PromptTone, RoomActionPrompt } from './room-prompt';

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

const GameInputContext = createContext<GameInputApi | null>(null);

export function GameInputProvider({ children }: { children: ReactNode }) {
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
      mobileKeys,
      pulseInteract,
      consumeInteract,
      stunUntil,
      setStunned,
      isStunned,
      actionPrompt,
      actionTone,
      setActionPrompt,
      highlightedId,
      setHighlightedId,
      entryHint,
      dismissEntryHint,
    }),
    [
      pulseInteract,
      consumeInteract,
      setStunned,
      isStunned,
      actionPrompt,
      actionTone,
      setActionPrompt,
      highlightedId,
      entryHint,
      dismissEntryHint,
    ]
  );

  return <GameInputContext.Provider value={value}>{children}</GameInputContext.Provider>;
}

export function useGameInput() {
  const ctx = useContext(GameInputContext);
  if (!ctx) throw new Error('useGameInput must be used inside GameInputProvider');
  return ctx;
}
