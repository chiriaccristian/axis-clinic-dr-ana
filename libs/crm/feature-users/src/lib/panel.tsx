import type { ReactNode } from 'react';

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-line bg-ivory p-6">
      <h2 className="font-serif text-[24px] text-wine">{title}</h2>
      {children}
    </section>
  );
}

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'error';
  children: ReactNode;
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'mt-3 text-[13px] text-wine'
          : 'mt-3 text-[13px] text-muted'
      }
    >
      {children}
    </p>
  );
}
