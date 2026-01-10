'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '@/lib/hooks';
import { textReveal, scaleIn } from '@/lib/animations';

export default function HeroSection() {
  const scrollToSection = useSmoothScroll();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-orange-900">
      {/* Simplified gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#3b82f6_0%,_transparent_30%,_transparent_100%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#f97316_0%,_transparent_30%,_transparent_100%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#6366f1_0%,_transparent_25%,_transparent_100%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,_#f59e0b_0%,_transparent_30%,_transparent_100%)]"></div>

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <motion.div
        className="container relative flex max-w-[64rem] flex-col items-center gap-4 text-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
      >
        <motion.span
          initial="hidden"
          animate="show"
          variants={textReveal}
          transition={{ delay: 0.2 }}
          className="rounded-full bg-orange-100/10 px-3 py-1 text-xs sm:text-sm text-orange-200 ring-1 ring-orange-300/20"
        >
          Developer - Electrician - Friend
        </motion.span>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={textReveal}
          transition={{ delay: 0.4 }}
          className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white"
        >
          Hi, I&apos;m Ricky
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          variants={textReveal}
          transition={{ delay: 0.6 }}
          className="max-w-[42rem] text-slate-300 text-base sm:text-lg md:text-xl"
        >
          <span className="font-semibold text-orange-400">A-Grade Licensed Electrician</span> and{' '}
          <span className="font-semibold text-orange-400">Full-Stack Developer</span> at{' '}
          <span className="font-semibold text-orange-400">OakCodeAndTechSolutions</span> in Melbourne. 
          Professional electrical services and modern web development solutions from one trusted expert.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="show"
          variants={scaleIn}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center flex-wrap max-w-4xl mx-auto"
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="#services" onClick={(e) => scrollToSection(e, 'services')}>
                View Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              className="border-orange-400/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/40 transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              className="border-orange-400/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/40 transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>
                Contact Me
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
