'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { textReveal } from '@/lib/animations';

const headline = 'Melbourne Qualified Electrician & Web Developer';

/**
 * Text-first hero — switchboard lives in SwitchboardShowcase below
 * so copy/CTAs are never fighting the 3D scene.
 */
export default function ImmersiveHero() {
  return (
    <section
      id="immersive-hero"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-x-clip"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--primary)/0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.22] retro-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

      <div className="container relative z-10 flex max-w-5xl flex-col items-center gap-6 sm:gap-8 text-center py-16 sm:py-20 px-2">
        <motion.span
          initial="hidden"
          animate="show"
          variants={textReveal}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary chrome-border"
        >
          OakCodeAndTechSolutions · Melbourne
        </motion.span>

        <h1 className="display-xl font-display font-bold tracking-tight text-balance px-1">
          {headline.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.25em] last:mr-0 gradient-text glow-text"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl text-lg text-muted-foreground text-body"
        >
          I am a fully licensed A-Grade electrician based in Victoria, handling everything from home switchboard upgrades to commercial fit-outs and fault finding. But I don&apos;t just work with wires. I also build custom websites, WordPress platforms, and IoT solutions. Whether you need your office rewired or a new web app built from scratch, I can help. Get a quote through the{' '}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact form
          </Link>
          .
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none sm:w-auto px-2"
        >
          <Button size="lg" className="gradient-bg text-primary-foreground shadow-glow w-full sm:w-auto min-h-11" asChild>
            <Link href="/services">
              <Zap className="mr-2 h-4 w-4" />
              Electrical Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="chrome-border hover:border-primary/50 w-full sm:w-auto min-h-11" asChild>
            <Link href="/services/web-developer-melbourne">
              <Code className="mr-2 h-4 w-4" />
              Web Development & IoT Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
