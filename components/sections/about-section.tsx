'use client';

import { motion } from 'framer-motion';
import { SkillCard } from '@/components/ui/skill-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { skills } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="dots">
        <div className="container mx-auto">
          <SectionHeading
            badge="Who I Am"
            title="About Me"
            description="I bring a unique blend of skills as both a licensed electrician and a passionate developer. This dual
            expertise allows me to create innovative solutions that bridge the gap between electrical systems and digital
            technologies."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid gap-4 sm:gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto text-center md:max-w-[58rem] mt-12"
          >
            <p className="leading-normal text-muted-foreground text-base sm:text-lg sm:leading-7">
              My background as an electrician gives me a unique perspective on technology projects,
              especially those involving IoT, embedded systems, and industrial applications.
            </p>
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
