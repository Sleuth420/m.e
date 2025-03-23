"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeading({ badge, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-orange-900/60 dark:text-orange-200"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold gradient-text"
      >
        {title}
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
      >
        {description}
      </motion.p>
    </div>
  );
} 