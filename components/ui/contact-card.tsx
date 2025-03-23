'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconSelector } from '@/components/ui/icon-selector';
import { motion } from 'framer-motion';
import { itemFadeIn } from '@/lib/animations';

interface ContactCardProps {
  title: string;
  content: string;
  icon: string;
  actionLabel?: string;
  actionUrl?: string;
}

export function ContactCard({ title, content, icon, actionLabel, actionUrl }: ContactCardProps) {
  return (
    <motion.div variants={itemFadeIn}>
      <Card className="overflow-hidden border-0 shadow-lg shadow-orange-100/30 dark:shadow-orange-900/20 hover:shadow-orange-200/40 dark:hover:shadow-orange-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
        <CardContent className="flex flex-col items-center gap-4 p-6 h-full">
          <div className="rounded-full gradient-bg p-4 mb-2">
            <IconSelector name={icon} className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{content}</p>
          {actionLabel && actionUrl && (
            <Button
              className="w-full gradient-bg hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-800 transition-all duration-300 mt-4"
              asChild
            >
              <Link href={actionUrl}>{actionLabel}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
