import { useState } from 'react';
import { cn } from '../utils/cn';
import { Button } from '../ui/button';
import { Container } from './container';

export interface NavLink {
  id: string;
  label: string;
}

export interface SiteHeaderProps {
  logoSrc: string;
  name: string;
  subtitle: string;
  links: NavLink[];
  ctaLabel: string;
  onCtaClick: () => void;
  /** Anchor the brand links back to. */
  homeHref?: string;
  /** Prefix applied before the navigation anchors, used on sub-pages. */
  linkHrefBase?: string;
  menuLabel?: string;
  skipLinkLabel?: string;
}

export function SiteHeader({
  logoSrc,
  name,
  subtitle,
  links,
  ctaLabel,
  onCtaClick,
  homeHref = '#top',
  linkHrefBase = '',
  menuLabel = 'Meniu',
  skipLinkLabel = 'Sari la conținut',
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-[75px] border-b border-line bg-ivory md:h-[92px]">
      <a
        href={homeHref}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-20 focus:bg-ivory focus:p-2 focus:text-wine"
      >
        {skipLinkLabel}
      </a>
      <Container className="flex h-full min-w-0 items-center justify-between gap-2">
        <a href={homeHref} className="flex min-w-0 items-center gap-2 md:gap-3">
          <img
            src={logoSrc}
            alt={name}
            className="block h-[36px] w-[36px] shrink-0 md:h-[42px] md:w-[42px]"
          />
          <span className="min-w-0">
            <strong className="block truncate text-[11px] tracking-[0.12em] text-wine uppercase md:text-[15px] md:tracking-[0.18em]">
              {name}
            </strong>{' '}
            <small className="mt-1 block truncate text-[7px] tracking-[0.18em] text-muted uppercase md:text-[8px] md:tracking-[0.26em]">
              {subtitle}
            </small>
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Button
            variant="icon"
            aria-label={menuLabel}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </Button>
        </div>

        <nav
          id="site-nav"
          aria-label={menuLabel}
          className={cn(
            'absolute inset-x-0 top-[109px] z-[5] flex-col items-start gap-8 border-b border-line bg-ivory px-5 py-[23px] text-[12px] text-[#75686d]',
            'md:static md:z-auto md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0',
            menuOpen ? 'flex' : 'hidden',
          )}
        >
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`${linkHrefBase}#${id}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-wine"
            >
              {label}
            </a>
          ))}
          <Button variant="nav" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </nav>
      </Container>
    </header>
  );
}
