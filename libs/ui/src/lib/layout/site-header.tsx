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
  menuLabel?: string;
}

export function SiteHeader({
  logoSrc,
  name,
  subtitle,
  links,
  ctaLabel,
  onCtaClick,
  homeHref = '#top',
  menuLabel = 'Meniu',
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-[75px] border-b border-line bg-ivory md:h-[92px]">
      <Container className="flex h-full items-center justify-between">
        <a href={homeHref} className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt={name}
            className="block h-[42px] w-[42px] shrink-0"
          />
          <span>
            <strong className="block text-[15px] tracking-[0.18em] text-wine">
              {name}
            </strong>
            <small className="mt-1 block text-[8px] tracking-[0.26em] text-muted">
              {subtitle}
            </small>
          </span>
        </a>

        <Button
          variant="icon"
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          className="block md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '×' : '☰'}
        </Button>

        <div
          className={cn(
            'absolute inset-x-0 top-[109px] z-[5] flex-col items-start gap-8 border-b border-line bg-ivory px-5 py-[23px] text-[12px] text-[#75686d]',
            'md:static md:z-auto md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0',
            menuOpen ? 'flex' : 'hidden',
          )}
        >
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-wine"
            >
              {label}
            </a>
          ))}
          <Button variant="nav" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </header>
  );
}
