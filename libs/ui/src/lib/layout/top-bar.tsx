import { ReactNode } from 'react';

export interface TopBarProps {
  left: ReactNode;
  right: ReactNode;
}

export function TopBar({ left, right }: TopBarProps) {
  return (
    <div className="flex h-[54px] items-center justify-between bg-wine px-5 text-[10px] tracking-[0.12em] text-topbar uppercase md:h-[34px] md:px-12 [&_b]:font-medium [&_b]:text-rose">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
