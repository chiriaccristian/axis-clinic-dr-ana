import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SectionLabelProps {
  children?: ReactNode;
  className?: string;
  tone?: 'default' | 'rose';
  /** Ordinal marker rendered before the label text. */
  index?: string;
}

export function SectionLabel({
  children,
  className,
  tone = 'default',
  index,
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        'text-[10px] tracking-[0.15em] uppercase',
        tone === 'rose' ? 'text-rose' : 'text-[#8d6c73]',
        className,
      )}
    >
      {index && <span className="mr-[10px]">{index}</span>}
      {children}
    </div>
  );
}
