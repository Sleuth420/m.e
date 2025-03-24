'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconSelector, getProjectIcon } from '@/components/ui/icon-selector';
import type { Project } from '@/lib/data';
import { itemFadeIn } from '@/lib/animations';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const item = {
    ...itemFadeIn,
    show: {
      ...itemFadeIn.show,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const iconName = getProjectIcon(project.title);

  return (
    <motion.div
      variants={item}
      className="group relative flex flex-col overflow-hidden rounded-lg border-0 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-orange-100/30 dark:shadow-orange-900/20 hover:shadow-orange-200/40 dark:hover:shadow-orange-800/30 transition-all duration-500 hover:-translate-y-2 h-full backdrop-blur-sm"
    >
      <div className="relative h-24 overflow-hidden bg-orange-500 dark:bg-orange-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSelector name={iconName} className="w-12 h-12 text-white/90" />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow">
          {project.description}
        </p>
        <div className="flex gap-2">
          {project.links.map((link, i) =>
            link.type === 'github' ? (
              link.label === "In Progress" ? (
                <Button
                  key={i}
                  variant="default"
                  size="sm"
                  className="gradient-bg hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-800 transition-all duration-300"
                >
                  <IconSelector name="Github" className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              ) : (
                <Button
                  key={i}
                  variant="default"
                  size="sm"
                  className="gradient-bg hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-800 transition-all duration-300"
                  asChild
                >
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    <IconSelector name="Github" className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              )
            ) : (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/30"
                asChild
              >
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <IconSelector name="ExternalLink" className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
