'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconSelector } from '@/components/ui/icon-selector';
import type { IconName } from '@/components/ui/icon-selector';
import { itemFadeIn } from '@/lib/animations';

interface ContactCardProps {
  title: string;
  content: string;
  icon: IconName;
  actionLabel?: string;
  actionUrl?: string;
}

export function ContactCard({ title, content, icon, actionLabel, actionUrl }: ContactCardProps) {
  return (
    <motion.div variants={itemFadeIn} className="depth-card h-full p-5 sm:p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full gradient-bg p-3">
          <IconSelector name={icon} className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </div>
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
