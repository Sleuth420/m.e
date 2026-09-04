'use client';

import Link from 'next/link';
import { ArrowRight, Code, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DepthCard } from '@/components/ui/depth-card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const panels = [
  {
    href: '/services/electrician-melbourne',
    icon: Zap,
    title: 'Electrical',
    description: 'A-Grade work across homes, commercial sites, and industrial.',
    jobs: [
      'Residential, commercial, and industrial',
      'Data, comms, and smart home',
      'Switchboards, lighting, and fault finding',
    ],
    cta: 'Electrical services',
  },
  {
    href: '/services/web-developer-melbourne',
    icon: Code,
    title: 'Digital',
    description: 'Websites, apps, security, and marketing — the same person who can also wire the site.',
    jobs: [
      'Websites, WordPress, and custom apps',
      'IoT and connected hardware',
      'Cybersecurity, SEO, and marketing',
    ],
    cta: 'Digital services',
  },
];

export default function DualTradeTeaser() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24">
      <div className="absolute inset-0 retro-grid opacity-40" aria-hidden />
      <div className="container relative">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="display-md font-display font-bold gradient-text">What I take on</h2>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-6 sm:gap-8 md:grid-cols-2"
        >
          {panels.map((panel) => (
            <motion.div key={panel.href} variants={fadeInUp}>
              <Link href={panel.href} className="group block h-full">
                <DepthCard className="h-full p-6 sm:p-8">
                  <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
                    <panel.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-primary">
                    {panel.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{panel.description}</p>
                  <ul className="mt-5 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                    {panel.jobs.map((job) => (
                      <li key={job}>{job}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                    {panel.cta}
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
