'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeading({ badge, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-4 sm:gap-5 text-center">
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text glow-text"
      >
        {title}
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="max-w-[85%] text-muted-foreground text-base sm:text-lg"
      >
        {description}
      </motion.p>
    </div>
  );
}
