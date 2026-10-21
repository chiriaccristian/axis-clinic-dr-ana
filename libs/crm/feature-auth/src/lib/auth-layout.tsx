import type { ReactNode } from 'react';

/** Centered card used by the login and invitation pages. */
export function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blush px-4 py-10">
      <div className="w-full max-w-[400px] bg-ivory px-8 py-10 shadow-sm">
        <h1 className="font-serif text-[32px] leading-tight text-wine">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[13px] text-wine">
      {message}
    </p>
  );
}
