export interface SiteFooterProps {
  copyright: string;
  tagline: string;
  backToTopLabel: string;
  backToTopHref?: string;
  instagramHref?: string;
  privacyHref?: string;
  termsHref?: string;
  legalName?: string;
  vatId?: string;
  location?: string;
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
  privacyHref = '/politica-de-confidentialitate',
  termsHref = '/termeni-si-conditii',
  legalName,
  vatId,
  location,
}: SiteFooterProps) {
  return (
    <footer className="mt-[95px] block border-t border-line pt-[23px] pb-[30px] text-[10px] leading-[2.3] text-[#6d565b]">
      <div className="block md:flex md:justify-between md:leading-normal">
        <span className="block md:inline">{copyright}</span>
        <span className="block md:inline">{tagline}</span>
        <span className="block md:inline">
          <a href={privacyHref} className="text-wine hover:opacity-70">Politica de confidențialitate</a>{' · '}
          <a href={termsHref} className="text-wine hover:opacity-70">Termeni și condiții</a>
        </span>
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
      </div>
      {legalName && (
        <p
          className="mt-[14px] border-t border-line pt-[14px] text-[10px] leading-[2] text-[#8b7a7f] md:leading-normal"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <span itemProp="name">{legalName}</span>
          {vatId && <>{' · '}<span itemProp="vatID">{vatId}</span></>}
          {location && (
            <>
              {' · '}
              <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="addressLocality">{location}</span>
              </span>
            </>
          )}
        </p>
      )}
    </footer>
  );
}
