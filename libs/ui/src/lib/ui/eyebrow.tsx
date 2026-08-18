import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Small uppercase label preceded by a short rose rule. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <div
      className={cn(
        'text-[10px] tracking-[0.17em] text-[#98767d] uppercase',
        "before:mr-[11px] before:mb-[3px] before:inline-block before:w-[30px] before:border-t before:border-rose before:content-['']",
        className,
      )}
    >
      {children}
    </div>
  );
}
