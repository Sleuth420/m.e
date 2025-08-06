'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconSelector } from '@/components/ui/icon-selector';
import { motion } from 'framer-motion';
import { itemFadeIn } from '@/lib/animations';

// Import the IconName type from icon-selector
import { type IconName } from '@/components/ui/icon-selector';

interface ContactCardProps {
  title: string;
  content: string;
  icon: IconName;
  actionLabel?: string;
  actionUrl?: string;
  onClick?: () => void;
}

export function ContactCard({
  title,
  content,
  icon,
  actionLabel,
  actionUrl,
  onClick,
}: ContactCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div variants={itemFadeIn}>
      <Card className="overflow-hidden border-0 shadow-lg shadow-orange-100/30 dark:shadow-orange-900/20 hover:shadow-orange-200/40 dark:hover:shadow-orange-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
        <CardContent className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 h-full text-center">
          <div className="rounded-full gradient-bg p-3 sm:p-4 mb-1 sm:mb-2">
            <IconSelector name={icon} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {content}
          </p>
          {actionLabel && (
            <Button
              className="gradient-bg hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-800 transition-all duration-300 mt-3 sm:mt-4 text-sm sm:text-base"
              asChild={!!actionUrl}
              onClick={handleClick}
            >
              {actionUrl ? <Link href={actionUrl}>{actionLabel}</Link> : <span>{actionLabel}</span>}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
