import { useEffect, useState } from 'react';

export function useKonamiCode() {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [touchSequence, setTouchSequence] = useState<{ x: number; y: number; timestamp: number }[]>([]);

  const konamiCode = [
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
  ];

  // Mobile Konami Code: Tap pattern (up-up-down-down-left-right-left-right-center-center)
  const checkMobileKonami = (touches: { x: number; y: number; timestamp: number }[]) => {
    if (touches.length < 10) return false;
    
    const recentTouches = touches.slice(-10);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Define touch zones
    const topZone = screenHeight * 0.3;
    const bottomZone = screenHeight * 0.7;
    const leftZone = screenWidth * 0.3;
    const rightZone = screenWidth * 0.7;
    const centerZone = {
      x: screenWidth * 0.4,
      y: screenHeight * 0.4,
      width: screenWidth * 0.2,
      height: screenHeight * 0.2
    };

    const expectedPattern = [
      { zone: 'top' }, { zone: 'top' },
      { zone: 'bottom' }, { zone: 'bottom' },
      { zone: 'left' }, { zone: 'right' },
      { zone: 'left' }, { zone: 'right' },
      { zone: 'center' }, { zone: 'center' }
    ];

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
          return touch.x > centerZone.x && touch.x < centerZone.x + centerZone.width &&
                 touch.y > centerZone.y && touch.y < centerZone.y + centerZone.height;
        default:
          return false;
      }
    });
  };

  const activateKonami = () => {
    if (konamiActivated) return;
    
    setKonamiActivated(true);
    console.log('🎮 Konami Code Activated! 🎮');
    
    // Fun effect - add a class to body for CSS animations
    document.body.classList.add('konami-mode');
    
    // Add some extra fun effects
    document.body.style.setProperty('--konami-pulse', '1');
    
    // Create some floating emojis
    createFloatingEmojis();
    
    // Remove after 10 seconds
    setTimeout(() => {
      document.body.classList.remove('konami-mode');
      document.body.style.removeProperty('--konami-pulse');
      setKonamiActivated(false);
    }, 10000);
  };

  const createFloatingEmojis = () => {
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
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;

      setSequence((prev) => {
        const newSequence = [...prev, key];

        // Keep only the last 10 keys
        if (newSequence.length > 10) {
          newSequence.shift();
        }

        // Check if Konami code is entered
        if (newSequence.length === 10) {
          const isKonami = newSequence.every((k, i) => k === konamiCode[i]);
          if (isKonami) {
            activateKonami();
          }
        }

        return newSequence;
      });
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const newTouch = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      };
      
      setTouchSequence(prev => {
        const newSequence = [...prev, newTouch];
        
        // Keep only touches from last 5 seconds
        const fiveSecondsAgo = Date.now() - 5000;
        const recentTouches = newSequence.filter(t => t.timestamp > fiveSecondsAgo);
        
        // Check for mobile Konami pattern
        if (checkMobileKonami(recentTouches)) {
          activateKonami();
        }
        
        return recentTouches;
      });
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [konamiActivated]);

  return { konamiActivated };
}
