'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';

const featured = projects.slice(0, 6);

function ProjectCard({ project }: { project: (typeof featured)[number] }) {
  return (
    <div className="flex-shrink-0 w-[min(85vw,20rem)] sm:w-72 md:w-80 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 sm:p-6 chrome-border snap-start">
      <h3 className="font-display font-semibold text-foreground mb-2 text-balance">{project.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map((tech) => (
          <span key={tech} className="brand-chip text-xs">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedProjectsMarquee() {
  return (
    <section className="py-16 sm:py-20 md:py-28 border-y border-border/50 bg-surface-1/50 overflow-hidden">
      <div className="container mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Portfolio</span>
          <h2 className="display-md font-display font-bold mt-2 gradient-text">Featured Projects</h2>
        </div>
        <Button variant="outline" className="chrome-border w-full sm:w-fit min-h-11" asChild>
          <Link href="/projects">
            View all projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Mobile: horizontal scroll, single set */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        <div className="flex gap-4 w-max">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>

      {/* Desktop: infinite marquee */}
      <div className="hidden md:block relative">
        <div className="overflow-hidden">
          <motion.div className="marquee-track gap-6 px-4" aria-label="Featured projects">
            {[...featured, ...featured].map((project, i) => (
              <ProjectCard key={`${project.title}-${i}`} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
