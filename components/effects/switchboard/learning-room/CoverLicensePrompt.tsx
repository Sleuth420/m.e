'use client';

import { AlertTriangle, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwitchboard } from '../SwitchboardContext';

export function CoverLicensePrompt() {
  const { coverPromptOpen, confirmCoverOpen, denyCoverOpen } = useSwitchboard();

  if (!coverPromptOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-license-title"
    >
      <div className="chrome-border w-full max-w-md rounded-2xl border border-border/70 bg-background/95 p-5 shadow-2xl backdrop-blur-md sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p id="cover-license-title" className="font-display text-lg font-semibold text-foreground">
              Are you licensed to remove this cover?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Live parts are behind this switchboard door. Only A-Grade electricians or authorised
              persons may open it. Unqualified access can kill.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 touch-manipulation gap-2"
            onClick={denyCoverOpen}
          >
            <ShieldX className="h-4 w-4" />
            No — keep it shut
          </Button>
          <Button type="button" className="min-h-11 touch-manipulation gap-2" onClick={confirmCoverOpen}>
            <ShieldCheck className="h-4 w-4" />
            Yes — I&apos;m licensed
          </Button>
        </div>
      </div>
    </div>
  );
}
