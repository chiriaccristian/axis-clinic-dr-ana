import { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

/** Underlined inline link used next to primary actions. */
export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <a
      className={cn(
        'border-b border-[#bba3a5] pb-1.5 text-[12px] text-wine',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
