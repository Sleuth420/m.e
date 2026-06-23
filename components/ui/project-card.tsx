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
    <motion.div variants={item} className="depth-card overflow-hidden h-full flex flex-col">
      <div className="relative h-20 sm:h-24 overflow-hidden bg-primary">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSelector name={iconName} className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground/90" />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4 sm:p-6 space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">{project.title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground flex-grow">{project.description}</p>
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Built with:</p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="brand-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {project.links.map((link, i) =>
            link.type === 'github' ? (
              link.label === 'In Progress' ? (
                <Button
                  key={i}
                  variant="default"
                  size="sm"
                  disabled
                  className="gradient-bg text-primary-foreground w-full sm:w-auto opacity-70"
                >
                  <IconSelector name="Github" className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              ) : (
                <Button
                  key={i}
                  variant="default"
                  size="sm"
                  className="gradient-bg text-primary-foreground w-full sm:w-auto min-h-10"
                  asChild
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel={`noopener noreferrer${link.nofollow ? ' nofollow' : ''}`}
                  >
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
                className="outline-brand w-full sm:w-auto"
                asChild
              >
                <Link
                  href={link.url}
                  target="_blank"
                  rel={`noopener noreferrer${link.nofollow ? ' nofollow' : ''}`}
                >
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
