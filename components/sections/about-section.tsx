'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { IconSelector } from '@/components/ui/icon-selector';

export default function AboutSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      icon: 'Zap',
      title: 'Dual Trade Professional',
      subtitle: 'A-Grade Electrician & Full-Stack Developer',
      description:
        'A-Grade licensed electrician and full-stack developer. I provide professional electrical services and modern web development, bringing practical trade expertise together with cutting-edge technology.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 2,
      icon: 'Building',
      title: 'Business Minded',
      subtitle: 'Past Business Owner',
      description:
        'Having run my own business, I understand what companies actually need. Now I help others build and grow their digital presence.',
      color: 'from-slate-600 to-slate-800',
    },
    {
      id: 3,
      icon: 'Heart',
      title: 'Problem Solver',
      subtitle: 'Customer Focused',
      description:
        'I believe in practical solutions that work in the real world. My goal is always satisfied customers and lasting relationships.',
      color: 'from-orange-600 to-amber-600',
    },
  ];

  return (
    <section id="about" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="dots">
        <div className="container mx-auto">
          <SectionHeading
            badge="Who I Am"
            title="About Me"
            description="I'm the electrician who codes, and the developer who understands what real businesses need."
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mx-auto max-w-6xl mt-12"
          >
            {/* Bold Opening Statement */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-10">
                I bridge the gap between
                <br />
                <span className="text-slate-900 dark:text-white">traditional trade industries</span>
                <br />
                and modern technology
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                <span className="font-semibold text-orange-600 dark:text-orange-400">OakCodeAndTechSolutions</span> brings together electrical contracting, web development, marketing, and business advisory - providing comprehensive solutions with a practical, real-world approach to every project.
              </p>
            </motion.div>

            {/* Interactive Cards */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3 mb-12 px-4 sm:px-0">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.25, delay: index * 0.1, ease: 'easeOut' }}
                  className="relative group"
                >
                  <motion.div
                    className={`relative overflow-hidden rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                      activeCard === card.id ? 'ring-2 ring-orange-500/50' : ''
                    }`}
                    onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient Header */}
                    <div className={`h-24 bg-gradient-to-r ${card.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconSelector name={card.icon as any} className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        {card.subtitle}
                      </p>

                      <motion.div
                        initial={false}
                        animate={{
                          height: activeCard === card.id ? 'auto' : '0px',
                          opacity: activeCard === card.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          {card.description}
                        </p>
                      </motion.div>

                      {/* Click indicator */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {activeCard === card.id ? 'Click to hide' : 'Click to learn more'}
                        </span>
                        <motion.div
                          animate={{ rotate: activeCard === card.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconSelector name="ExternalLink" className="w-4 h-4 text-slate-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Statement */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="inline-block bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium">
                  "I don't just build solutions - I build bridges between what businesses have and
                  what they need to thrive in today's digital world."
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
