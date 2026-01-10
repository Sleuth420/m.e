'use client';

import { useEffect } from 'react';

/**
 * Client component to trigger Konami mode programmatically
 * Exposes a global function that can be called from anywhere
 */
export function KonamiTrigger() {
  useEffect(() => {
    // Create a global function to trigger Konami mode
    (window as any).triggerKonami = () => {
      // Simulate the Konami code sequence
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

      // Dispatch keyboard events to trigger the Konami code
      konamiCode.forEach((key, index) => {
        setTimeout(() => {
          const event = new KeyboardEvent('keydown', {
            code: key,
            key: key.replace('Arrow', '').replace('Key', ''),
            bubbles: true,
            cancelable: true,
          });
          window.dispatchEvent(event);
        }, index * 50); // Small delay between each key
      });
    };

    return () => {
      delete (window as any).triggerKonami;
    };
  }, []);

  return null;
}
