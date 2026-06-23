'use client';

import Link from 'next/link';
import { ArrowRight, User, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { DepthCard } from '@/components/ui/depth-card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const panels = [
  {
    href: '/about',
    icon: User,
    title: 'My Story',
    description:
      'A-Grade electrician turned developer. How I ended up building sites like perrielectrics.com for other trades.',
    accent: 'from-primary to-amber-500',
  },
  {
    href: '/services',
    icon: Wrench,
    title: 'Services',
    description:
      'Electrical work, WordPress, apps, embedded projects, SEO, and CAD. Each links to a dedicated service page.',
    accent: 'from-cyan-accent to-primary',
  },
];

export default function DualTradeTeaser() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative">
      <div className="absolute inset-0 retro-grid opacity-40" aria-hidden />
      <div className="container relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-6 sm:gap-8"
        >
          {panels.map((panel) => (
            <motion.div key={panel.href} variants={fadeInUp}>
              <Link href={panel.href} className="block h-full group">
                <DepthCard className="h-full p-6 sm:p-8 md:p-10">
                  <div
                    className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${panel.accent} p-3 shadow-glow`}
                  >
                    <panel.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="display-md font-display font-bold mb-3 group-hover:text-primary transition-colors">
                    {panel.title}
                  </h2>
                  <p className="text-muted-foreground text-body mb-6">{panel.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </DepthCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
