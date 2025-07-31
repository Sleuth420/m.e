'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '@/lib/hooks';
import { fadeInUp } from '@/lib/animations';

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
      <div className="container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <motion.span
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          className="rounded-full bg-orange-100/10 px-3 py-1 text-sm text-orange-200 ring-1 ring-orange-300/20"
        >
          Developer - Electrician - Friend
        </motion.span>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl !leading-tight text-white"
        >
          Hi, I&apos;m Ricky
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="max-w-[42rem] leading-normal text-slate-300 sm:text-xl sm:leading-8"
        >
          Full-stack developer at{' '}
          <span className="font-semibold text-orange-400">OakCodeAndTechSolutions</span>, combining
          electrical expertise with modern web development and software engineering.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
            <Link href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>
              View My Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-orange-400/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/40"
            asChild
          >
            <Link href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>
              Contact Me
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
