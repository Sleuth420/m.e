'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';

interface ContactCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  actionLabel?: string;
  actionUrl?: string;
}

export function ContactCard({ title, content, icon, actionLabel, actionUrl }: ContactCardProps) {
  return (
    <motion.div variants={fadeInUp} className="depth-card h-full p-5 sm:p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full gradient-bg p-3">{icon}</div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{content}</p>
        {actionLabel && actionUrl && (
          <Button size="sm" className="gradient-bg text-primary-foreground mt-2 w-full sm:w-auto" asChild>
            <a href={actionUrl} target="_blank" rel="noopener noreferrer">
              {actionLabel}
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
