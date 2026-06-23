'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProjectCard } from '@/components/ui/project-card';
import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'iot', label: 'IoT' },
] as const;

type CategoryKey = (typeof categories)[number]['key'];

export function ProjectsGrid() {
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') as CategoryKey) || 'all';

  const filtered = useMemo(
    () =>
      projects.filter((p) => category === 'all' || p.category === category),
    [category]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <a
            key={cat.key}
            href={cat.key === 'all' ? '/projects' : `/projects?category=${cat.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors chrome-border ${
              category === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:text-primary'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No projects in this category.</p>
      )}
    </>
  );
}
