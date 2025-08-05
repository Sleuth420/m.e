'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IconSelector } from '@/components/ui/icon-selector';
import { motion } from 'framer-motion';
import type { Skill } from '@/lib/data';
import { itemFadeIn } from '@/lib/animations';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <motion.div variants={itemFadeIn}>
      <Card className="h-full overflow-hidden border-0 shadow-lg shadow-orange-100/30 dark:shadow-orange-900/20 hover:shadow-orange-200/40 dark:hover:shadow-orange-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-full">
          <div className="mb-3 sm:mb-4 rounded-full gradient-bg p-3 sm:p-4">
            <IconSelector name={skill.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-center text-slate-900 dark:text-white">{skill.title}</h3>
          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {skill.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
