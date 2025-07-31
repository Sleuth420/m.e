'use client';

interface SectionBackgroundProps {
  variant?: 'dots' | 'grid' | 'diagonal' | 'none';
  children: React.ReactNode;
}

export function SectionBackground({ children }: SectionBackgroundProps) {
  return (
    <div className="relative w-full">
      {/* No background elements at all - removed entirely */}

      {children}
    </div>
  );
}
