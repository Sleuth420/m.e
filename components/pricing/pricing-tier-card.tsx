'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PricingTier } from '@/lib/pricing-data';

interface PricingTierCardProps {
  tier: PricingTier;
  delay?: number;
  compact?: boolean;
}

export function PricingTierCard({ tier, delay = 0, compact = false }: PricingTierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`relative surface-card rounded-2xl border border-border shadow-lg ${
        compact ? 'p-6' : 'p-8'
      } ${tier.highlighted ? 'border-2 border-primary shadow-xl md:scale-105 scale-100' : ''}`}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}

      <div className={`text-center ${compact ? 'mb-4' : 'mb-6'}`}>
        <h3 className={`font-bold text-foreground mb-2 ${compact ? 'text-xl' : 'text-2xl'}`}>
          {tier.name}
        </h3>
        <div className={`font-bold text-primary mb-2 ${compact ? 'text-2xl' : 'text-4xl'}`}>
          {tier.price}
        </div>
      {!tier.priceNote && tier.subtitle && (
          <p className="text-muted-foreground">{tier.subtitle}</p>
        )}
        {tier.priceNote && (
          <p className="text-sm text-muted-foreground">{tier.priceNote}</p>
        )}
      </div>

      <ul className={`space-y-3 ${compact ? 'mb-6 text-sm' : 'mb-8'}`}>
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center text-muted-foreground">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${compact ? 'text-sm' : ''}`}
        asChild
      >
        <Link href="/contact">Get Started</Link>
      </Button>
    </motion.div>
  );
}
