import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SectionLabelProps {
  children?: ReactNode;
  className?: string;
  tone?: 'default' | 'rose';
}

export function SectionLabel({
  children,
  className,
  tone = 'default',
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        'text-[10px] tracking-[0.15em] uppercase',
        tone === 'rose' ? 'text-rose' : 'text-[#8d6c73]',
        className,
      )}
    >
      {children}
    </div>
  );
}
