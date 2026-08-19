import { ReactNode } from 'react';

export interface DetailItemProps {
  label: string;
  children: ReactNode;
}

/** Label + value row used in the contact details list. */
export function DetailItem({ label, children }: DetailItemProps) {
  return (
    <div className="border-t border-line py-[19px] [&_a]:m-0 [&_a]:text-[15px] [&_a]:leading-[1.6] [&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-[1.6]">
      <small className="mb-2 block text-[9px] tracking-[0.15em] text-[#98767d] uppercase">
        {label}:
      </small>
      {children}
    </div>
  );
}
