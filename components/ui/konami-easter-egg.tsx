'use client';

import { useKonamiCode } from '@/lib/hooks/useKonamiCode';

export function KonamiEasterEgg() {
  const { konamiActivated } = useKonamiCode();

  return (
    <>
      {/* Konami mode overlay */}
      {konamiActivated && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 animate-pulse" />
          <div className="absolute top-4 right-4 text-orange-400 font-bold text-lg animate-bounce">
            🎮 KONAMI MODE! 🎮
          </div>
          <div className="absolute bottom-4 left-4 text-orange-300 text-sm animate-pulse">
            ⚡ Power Mode Activated! ⚡
          </div>
        </div>
      )}
    </>
  );
}
