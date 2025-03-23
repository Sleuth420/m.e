'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ui/project-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { projects } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full py-16 md:py-24 lg:py-32 relative">
      <SectionBackground variant="grid">
        <div className="mx-auto px-4 sm:px-6 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <SectionHeading
            badge="My Work"
            title="Projects"
            description="Here are some of the projects I've worked on that showcase my diverse skill set."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid justify-center gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 max-w-7xl"
          >
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
