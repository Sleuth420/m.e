import { useEffect, useState } from 'react';

export function useKonamiCode() {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

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
          if (isKonami && !konamiActivated) {
            setKonamiActivated(true);
            console.log('🎮 Konami Code Activated! 🎮');

            // Fun effect - add a class to body for CSS animations
            document.body.classList.add('konami-mode');

            // Remove after 10 seconds
            setTimeout(() => {
              document.body.classList.remove('konami-mode');
              setKonamiActivated(false);
            }, 10000);
          }
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiActivated]);

  return { konamiActivated };
}
