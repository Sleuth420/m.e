'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { IconSelector } from '@/components/ui/icon-selector';

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="dots">
        <div className="container mx-auto">
          <SectionHeading
            badge="Who I Am"
            title="About Me"
            description="I'm a dual trade professional who bridges the gap between traditional industries and modern technology."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl mt-12"
          >
            <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
              {/* Main Story */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    As both a licensed electrician and full-stack developer, I bring a unique perspective to business solutions. 
                    My journey started in the electrical trade, where I learned the value of practical, hands-on problem-solving. 
                    After running my own business in the past, I now work as an electrical contractor while expanding into the digital world.
                  </p>
                  
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    I don't just build websites or fix electrical systems - I help businesses thrive by creating comprehensive solutions. 
                    From WordPress development and marketing strategies to business advisory services and administrative system setup, 
                    I understand what real businesses need because I've been in the trenches myself.
                  </p>
                  
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    Currently, I'm passionate about bringing technology to the electrical industry. My biggest project is developing 
                    an app that combines electrical calculations with project management - a perfect example of how I bridge the gap 
                    between traditional trades and modern technology. But I love working across all industries, helping businesses 
                    of all sizes modernize their operations and reach their customers effectively.
                  </p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-6">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-6 border border-orange-200/50 dark:border-orange-800/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <IconSelector name="Zap" className="w-5 h-5 mr-2 text-orange-600" />
                    What Drives Me
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Problem-solving with practical solutions
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Satisfied customers and lasting relationships
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Bridging traditional and modern approaches
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-6 border border-orange-200/50 dark:border-orange-800/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <IconSelector name="Target" className="w-5 h-5 mr-2 text-orange-600" />
                    Current Focus
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    50/50 split between electrical contracting and digital solutions. 
                    Passionate about creating the electrical industry's first comprehensive 
                    calculation and project management app.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
