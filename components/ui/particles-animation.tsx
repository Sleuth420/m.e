'use client';

import { motion } from 'framer-motion';
import { particles } from '@/lib/animations';

export function ParticlesAnimation() {
  return (
    <div className="absolute inset-0 -z-10">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-orange-500/20"
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, scale: particle.scale }}
          animate={{
            x: [`${particle.x}%`, `${(particle.x + 20) % 100}%`],
            y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`],
            scale: [particle.scale, particle.scale * 1.2, particle.scale],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
