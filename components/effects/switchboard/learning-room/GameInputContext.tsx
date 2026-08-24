'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

export type MobileKeys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  inspect: boolean;
};

export type GameInputApi = {
  mobileKeys: React.RefObject<MobileKeys>;
  pulseInteract: () => void;
  consumeInteract: () => boolean;
  stunUntil: React.RefObject<number>;
  setStunned: (ms: number) => void;
  isStunned: () => boolean;
};

const defaultKeys = (): MobileKeys => ({
  forward: false,
  back: false,
  left: false,
  right: false,
  turnLeft: false,
  turnRight: false,
  inspect: false,
});

const GameInputContext = createContext<GameInputApi | null>(null);

export function GameInputProvider({ children }: { children: ReactNode }) {
  const mobileKeys = useRef<MobileKeys>(defaultKeys());
  const interactQueued = useRef(false);
  const stunUntil = useRef(0);

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

  const value = useMemo(
    () => ({
      mobileKeys,
      pulseInteract,
      consumeInteract,
      stunUntil,
      setStunned,
      isStunned,
    }),
    [pulseInteract, consumeInteract, setStunned, isStunned]
  );

  return <GameInputContext.Provider value={value}>{children}</GameInputContext.Provider>;
}

export function useGameInput() {
  const ctx = useContext(GameInputContext);
  if (!ctx) throw new Error('useGameInput must be used inside GameInputProvider');
  return ctx;
}
