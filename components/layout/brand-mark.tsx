import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('flex min-w-0 items-center gap-2.5 group', className)}
      aria-label="Oak Code And Tech Solutions home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-lg shadow-glow transition-transform group-hover:scale-105"
      />
      <span className="min-w-0 max-w-[10.75rem] font-display text-[13px] font-semibold leading-[1.15] tracking-tight text-foreground sm:max-w-none sm:text-sm">
        Oak Code And Tech Solutions
      </span>
    </Link>
  );
}
