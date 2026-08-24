import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3f0] px-6 text-center text-[#58494f]">
      <div><p className="mb-3 text-sm uppercase tracking-[0.2em] text-wine">Facial Harmony Clinic</p>
        <h1 className="font-serif text-5xl">Pagina nu a fost găsită</h1>
        <p className="mx-auto mt-5 max-w-md text-base">Este posibil ca linkul să nu mai fie valabil sau pagina să fi fost mutată.</p>
        <Link className="mt-8 inline-block bg-wine px-6 py-3 text-sm text-white" to="/">Înapoi la pagina principală</Link>
      </div>
    </main>
  );
}