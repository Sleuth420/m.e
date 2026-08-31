'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwitchboard } from '../SwitchboardContext';

export function CoverLicensePrompt() {
  const { coverPromptOpen, confirmCoverOpen, denyCoverOpen } = useSwitchboard();
  const dialogRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!coverPromptOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusYes = () => yesRef.current?.focus();
    const id = window.requestAnimationFrame(focusYes);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        denyCoverOpen();
        return;
      }
      if (e.key !== 'Tab') return;
      const yes = yesRef.current;
      const no = noRef.current;
      if (!yes || !no) return;
      const cycle = [no, yes];
      const idx = cycle.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      if (e.shiftKey) {
        cycle[(idx <= 0 ? cycle.length : idx) - 1]?.focus();
      } else {
        cycle[(idx + 1) % cycle.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey, true);
      previous?.focus();
    };
  }, [coverPromptOpen, denyCoverOpen]);

  if (!coverPromptOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-license-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) denyCoverOpen();
      }}
    >
      <div className="chrome-border w-full max-w-md rounded-2xl border border-border/70 bg-background/95 p-5 shadow-2xl backdrop-blur-md sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p
              id="cover-license-title"
              className="font-display text-lg font-semibold text-foreground"
            >
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
            ref={noRef}
            type="button"
            variant="outline"
            className="min-h-11 touch-manipulation gap-2"
            onClick={denyCoverOpen}
          >
            <ShieldX className="h-4 w-4" />
            No — keep it shut
          </Button>
          <Button
            ref={yesRef}
            type="button"
            className="min-h-11 touch-manipulation gap-2"
            onClick={confirmCoverOpen}
          >
            <ShieldCheck className="h-4 w-4" />
            Yes — I&apos;m licensed
          </Button>
        </div>
      </div>
    </div>
  );
}
