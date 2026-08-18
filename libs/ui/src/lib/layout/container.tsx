import { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-[calc(100%-40px)] md:w-[min(1180px,calc(100%-96px))]',
        className,
      )}
    >
      {children}
    </div>
  );
}
