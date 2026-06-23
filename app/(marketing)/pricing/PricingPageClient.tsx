'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Code,
  Microchip,
  Palette,
  Shield,
  Database,
  Camera,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { PricingTierCard } from '@/components/pricing/pricing-tier-card';
import {
  pricingNavItems,
  packageSections,
  electricalRates,
  electricalServicesList,
  otherServiceOfferings,
  type OtherServiceOffering,
} from '@/lib/pricing-data';

const navIcons: Record<string, LucideIcon> = {
  wordpress: Code,
  'custom-development': Code,
  electrical: Zap,
  'other-services': Palette,
};

const offeringIcons: Record<OtherServiceOffering['icon'], LucideIcon> = {
  camera: Camera,
  palette: Palette,
  shield: Shield,
  database: Database,
  microchip: Microchip,
};

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

export default function PricingPageClient() {
  return (
    <div className="min-h-screen bg-surface-0">
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="absolute inset-0 retro-grid opacity-40" aria-hidden />

        <div className="container text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="display-lg font-display font-bold gradient-text glow-text mb-6"
          >
            Pricing & Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 px-2"
          >
            Transparent pricing for all my services. From simple WordPress sites to complex custom
            applications, I offer flexible solutions that fit your budget and timeline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {pricingNavItems.map((item) => {
              const Icon = navIcons[item.id] ?? Code;
              return (
                <Button
                  key={item.id}
                  variant="outline"
                  className="outline-brand"
                  onClick={() => scrollToSection(item.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {packageSections.map((section) => (
        <section key={section.id} id={section.id} className="py-16 relative">
          <div className="container mx-auto">
            <SectionHeading
              badge={section.badge}
              title={section.title}
              description={section.description}
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12 px-4 sm:px-0">
              {section.tiers.map((tier, index) => (
                <PricingTierCard key={tier.name} tier={tier} delay={index * 0.1} />
              ))}
            </div>

            {section.callout && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <div className="inline-block bg-gradient-to-r from-primary/5 to-amber-500/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-8 border border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{section.callout.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{section.callout.description}</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                    <Link href="/contact">{section.callout.ctaLabel}</Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {section.infoCards && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 grid md:grid-cols-2 gap-6"
              >
                {section.infoCards.map((card) => (
                  <div key={card.title} className="surface-card rounded-2xl p-6 border border-border">
                    <h4 className="text-lg font-semibold text-foreground mb-3">{card.title}</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      {card.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      ))}

      <section id="electrical" className="py-16 relative">
        <div className="container mx-auto">
          <SectionHeading
            badge="Electrical Services"
            title="Licensed Electrical Work"
            description="Residential, commercial, and industrial electrical work with transparent pricing. Rates vary based on job complexity and site requirements."
          />

          <div className="grid md:grid-cols-2 gap-8 mt-12 px-4 sm:px-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="surface-card rounded-2xl p-8 border border-border shadow-lg"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Hourly Rates</h3>
              <div className="space-y-4">
                {electricalRates.map((rate) => (
                  <div
                    key={rate.label}
                    className="flex justify-between items-center p-4 bg-primary/10 rounded-lg"
                  >
                    <span className="font-medium text-muted-foreground">{rate.label}</span>
                    <span className="text-lg font-bold text-primary">{rate.rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                *Rates vary based on job complexity, location, and materials required
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="surface-card rounded-2xl p-8 border border-border shadow-lg"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Services Offered</h3>
              <ul className="space-y-3 mb-8">
                {electricalServicesList.map((service) => (
                  <li key={service} className="flex items-center text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Every job is unique. Get a personalized quote for your specific needs.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/contact">Request Electrical Quote</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="other-services" className="py-16 relative">
        <div className="container mx-auto">
          <SectionHeading
            badge="Additional Services"
            title="Other Professional Services"
            description="Comprehensive solutions beyond web development and electrical work."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-4 sm:px-0">
            {otherServiceOfferings.map((offering, index) => {
              const Icon = offeringIcons[offering.icon];
              return (
                <motion.div
                  key={offering.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="surface-card rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="text-center mb-4">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{offering.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-2">{offering.price}</div>
                    <p className="text-sm text-muted-foreground">{offering.priceNote}</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    {offering.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                    asChild
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary/5 to-amber-500/10 dark:from-primary/10 dark:to-primary/5 rounded-3xl p-12 border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Whether you need a simple website, custom development, or electrical work, I&apos;m here
              to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3" asChild>
                <Link href="/contact" className="flex items-center">
                  Contact Me <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="outline-brand text-lg px-6 py-3 sm:px-8" asChild>
                <Link href="/projects" className="flex items-center">
                  View My Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
