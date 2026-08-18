import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export type SectionTone = 'ivory' | 'blush' | 'wine' | 'transparent';

export interface SectionProps {
  id?: string;
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
}

const tones: Record<SectionTone, string> = {
  ivory: 'bg-ivory',
  blush: 'bg-blush',
  wine: 'bg-wine text-[#f9efea]',
  transparent: '',
};

export function Section({
  id,
  tone = 'transparent',
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], className)}>
      {children}
    </section>
  );
}
