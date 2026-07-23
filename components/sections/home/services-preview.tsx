'use client';

import Link from 'next/link';
import { ArrowRight, Code, Cpu, PenTool, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { homeServiceTeasers, type HomeServiceCategory } from '@/lib/data';
import { DepthCard } from '@/components/ui/depth-card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const categoryIcons: Record<HomeServiceCategory, typeof Zap> = {
  electrical: Zap,
  'web-dev': Code,
  'app-dev': Cpu,
  other: PenTool,
};

const categories: { key: HomeServiceCategory; label: string; href: string }[] = [
  { key: 'electrical', label: 'Electrical', href: '/services/electrician-melbourne' },
  { key: 'web-dev', label: 'Web Development', href: '/services/web-developer-melbourne' },
  { key: 'app-dev', label: 'Apps & IoT', href: '/services/app-development-melbourne' },
  { key: 'other', label: 'Other', href: '/services' },
];

export default function ServicesPreview() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">What I Do</span>
          <h2 className="display-md font-display font-bold mt-3 sm:mt-4 gradient-text">Services</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Professional electrical services and custom web development, all handled by one person right here in Melbourne.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => {
            const catServices = homeServiceTeasers.filter((s) => s.category === cat.key).slice(0, 2);
            if (catServices.length === 0) return null;
            const Icon = categoryIcons[cat.key];
            return (
              <motion.div key={cat.key} variants={fadeInUp}>
                <DepthCard className="h-full p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-4">{cat.label}</h3>
                  <ul className="space-y-3 mb-6">
                    {catServices.map((s) => (
                      <li key={s.slug} className="text-sm text-muted-foreground">
                        <Link href={`/services/${s.slug}`} className="hover:text-primary transition-colors">
                          {s.title}
                        </Link>
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
