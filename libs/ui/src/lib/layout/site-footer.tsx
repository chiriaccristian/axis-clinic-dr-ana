export interface SiteFooterProps {
  copyright: string;
  tagline: string;
  backToTopLabel: string;
  backToTopHref?: string;
  instagramHref?: string;
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter({
  copyright,
  tagline,
  backToTopLabel,
  backToTopHref = '#top',
  instagramHref,
}: SiteFooterProps) {
  return (
    <footer className="mt-[95px] block border-t border-line pt-[23px] pb-[30px] text-[10px] leading-[2.3] text-[#6d565b] md:flex md:justify-between md:leading-normal">
      <span className="block md:inline">{copyright}</span>
      <span className="block md:inline">{tagline}</span>
      {instagramHref && (
        <a
          href={instagramHref}
          aria-label="Urmărește-ne pe Instagram"
          className="flex items-center gap-2 text-wine transition-opacity hover:opacity-70 md:inline-flex"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon />
          <span>Instagram</span>
        </a>
      )}
      <a href={backToTopHref} className="block text-wine md:inline">
        {backToTopLabel}
      </a>
    </footer>
  );
}
