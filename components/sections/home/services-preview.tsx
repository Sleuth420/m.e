'use client';

import Link from 'next/link';
import { ArrowRight, Code, Microchip, Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { services } from '@/lib/data';
import { DepthCard } from '@/components/ui/depth-card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const categoryIcons = {
  tech: Code,
  electrical: Zap,
  creative: Palette,
} as const;

const categories = [
  { key: 'electrical' as const, label: 'Electrical', href: '/services/electrician-melbourne' },
  { key: 'tech' as const, label: 'Web & Tech', href: '/services/web-developer-melbourne' },
  { key: 'creative' as const, label: 'Creative', href: '/services' },
];

export default function ServicesPreview() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">What I Do</span>
          <h2 className="display-md font-display font-bold mt-2 gradient-text">Services</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Residential, commercial, and industrial electrical work plus web development in Melbourne. No agency layer.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.category === cat.key).slice(0, 2);
            const Icon = categoryIcons[cat.key] ?? Microchip;
            return (
              <motion.div key={cat.key} variants={fadeInUp}>
                <DepthCard className="h-full p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-4">{cat.label}</h3>
                  <ul className="space-y-3 mb-6">
                    {catServices.map((s) => (
                      <li key={s.title} className="text-sm text-muted-foreground">
                        {s.title}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cat.href}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </DepthCard>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
