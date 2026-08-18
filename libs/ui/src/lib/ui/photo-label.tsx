import { ReactNode } from 'react';

export interface PhotoLabelProps {
  overline: string;
  children: ReactNode;
}

/** Rose caption pinned to the bottom-right corner of a photo. */
export function PhotoLabel({ overline, children }: PhotoLabelProps) {
  return (
    <div className="absolute right-[-1px] bottom-7 min-w-[165px] bg-rose px-[23px] py-[18px] font-serif text-[14px] leading-[1.2] text-wine md:right-0">
      <small className="mb-2 block font-sans text-[9px] tracking-[0.12em] uppercase">
        {overline}
      </small>
      {children}
    </div>
  );
}
