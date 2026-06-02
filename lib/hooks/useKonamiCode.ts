import { useCallback, useEffect, useRef, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
] as const;

type TouchPoint = { x: number; y: number; timestamp: number };

function checkMobileKonami(touches: TouchPoint[]) {
  if (touches.length < 10) return false;

  const recentTouches = touches.slice(-10);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const topZone = screenHeight * 0.3;
  const bottomZone = screenHeight * 0.7;
  const leftZone = screenWidth * 0.3;
  const rightZone = screenWidth * 0.7;
  const centerZone = {
    x: screenWidth * 0.4,
    y: screenHeight * 0.4,
    width: screenWidth * 0.2,
    height: screenHeight * 0.2,
  };

  const expectedPattern = [
    { zone: 'top' },
    { zone: 'top' },
    { zone: 'bottom' },
    { zone: 'bottom' },
    { zone: 'left' },
    { zone: 'right' },
    { zone: 'left' },
    { zone: 'right' },
    { zone: 'center' },
    { zone: 'center' },
  ] as const;

  return recentTouches.every((touch, index) => {
    const expected = expectedPattern[index];

    switch (expected.zone) {
      case 'top':
        return touch.y < topZone;
      case 'bottom':
        return touch.y > bottomZone;
      case 'left':
        return touch.x < leftZone;
      case 'right':
        return touch.x > rightZone;
      case 'center':
        return (
          touch.x > centerZone.x &&
          touch.x < centerZone.x + centerZone.width &&
          touch.y > centerZone.y &&
          touch.y < centerZone.y + centerZone.height
        );
      default:
        return false;
    }
  });
}

function createFloatingEmojis() {
  const emojis = ['🎮', '⚡', '🚀', '💻', '⚡', '🎯', '🔥', '✨'];

  emojis.forEach((emoji, index) => {
    setTimeout(() => {
      const element = document.createElement('div');
      element.textContent = emoji;
      element.style.cssText = `
          position: fixed;
          left: ${Math.random() * window.innerWidth}px;
          top: ${Math.random() * window.innerHeight}px;
          font-size: 2rem;
          pointer-events: none;
          z-index: 9999;
          animation: floatUp 3s ease-out forwards;
        `;
      document.body.appendChild(element);

      setTimeout(() => {
        document.body.removeChild(element);
      }, 3000);
    }, index * 200);
  });
}

export function useKonamiCode() {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const sequenceRef = useRef<string[]>([]);
  const touchSequenceRef = useRef<TouchPoint[]>([]);
  const isActiveRef = useRef(false);

  const activateKonami = useCallback(() => {
    if (isActiveRef.current) return;

    isActiveRef.current = true;
    setKonamiActivated(true);
    console.log('🎮 Konami Code Activated! 🎮');

    document.body.classList.add('konami-mode');
    document.body.style.setProperty('--konami-pulse', '1');
    createFloatingEmojis();

    setTimeout(() => {
      document.body.classList.remove('konami-mode');
      document.body.style.removeProperty('--konami-pulse');
      isActiveRef.current = false;
      setKonamiActivated(false);
    }, 10000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;
      const newSequence = [...sequenceRef.current, key];

      if (newSequence.length > 10) {
        newSequence.shift();
      }

      sequenceRef.current = newSequence;

      if (newSequence.length === 10) {
        const isKonami = newSequence.every((k, i) => k === KONAMI_CODE[i]);
        if (isKonami) {
          activateKonami();
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const newTouch: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      const fiveSecondsAgo = Date.now() - 5000;
      const recentTouches = [...touchSequenceRef.current, newTouch].filter(
        (t) => t.timestamp > fiveSecondsAgo
      );

      touchSequenceRef.current = recentTouches;

      if (checkMobileKonami(recentTouches)) {
        activateKonami();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [activateKonami]);

  return { konamiActivated };
}
