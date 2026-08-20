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
      <Container className="flex h-full items-center justify-between">
        <a href={homeHref} className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt={name}
            className="block h-[42px] w-[42px] shrink-0"
          />
          <span>
            <strong className="block text-[15px] tracking-[0.18em] text-wine uppercase">
              {name}
            </strong>{' '}
            <small className="mt-1 block text-[8px] tracking-[0.26em] text-muted uppercase">
              {subtitle}
            </small>
          </span>
        </a>

        <Button
          variant="icon"
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          className="block md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </Button>

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
