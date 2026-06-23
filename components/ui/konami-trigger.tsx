'use client';

import { useEffect } from 'react';

/**
 * Client component to trigger Konami mode programmatically
 * Exposes a global function that can be called from anywhere
 */
export function KonamiTrigger() {
  useEffect(() => {
    console.log(
      '%c🎮 Try the Konami Code! (↑↑↓↓←→←→BA)',
      'color: #f97316; font-size: 14px; font-weight: bold;'
    );

    window.triggerKonami = () => {
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

      konamiCode.forEach((key, index) => {
        setTimeout(() => {
          const event = new KeyboardEvent('keydown', {
            code: key,
            key: key.replace('Arrow', '').replace('Key', ''),
            bubbles: true,
            cancelable: true,
          });
          window.dispatchEvent(event);
        }, index * 50);
      });
    };

    return () => {
      delete window.triggerKonami;
    };
  }, []);

  return null;
}
