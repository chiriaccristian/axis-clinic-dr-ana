import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface HeadingProps {
  children: ReactNode;
  className?: string;
}

/** Oversized serif headline used once per page (hero). */
export function DisplayHeading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        'my-[28px] font-serif text-[66px] leading-[0.9] font-normal tracking-[-0.065em] text-wine md:text-[clamp(58px,7.6vw,104px)]',
        '[&_em]:text-accent',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export interface SectionHeadingProps extends HeadingProps {
  /** `light` is used on the wine coloured section. */
  tone?: 'default' | 'light';
}

export function SectionHeading({
  children,
  className,
  tone = 'default',
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'm-0 font-serif text-[46px] leading-[0.98] font-normal tracking-[-0.055em] md:text-[54px]',
        tone === 'light'
          ? 'text-[#f9efea] [&_em]:text-rose'
          : 'text-wine [&_em]:text-accent',
        className,
      )}
    >
      {children}
    </h2>
  );
}
