export interface SiteFooterProps {
  copyright: string;
  backToTopLabel: string;
  backToTopHref?: string;
  instagramHref?: string;
  facebookHref?: string;
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

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8h2.75l.42-3h-3.17V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.38-.14-2.63-.14-2.6 0-4.38 1.59-4.38 4.51V10H7v3h2.79v8h3.71Z" />
    </svg>
  );
}

export function SiteFooter({
  copyright,
  backToTopLabel,
  backToTopHref = '#top',
  instagramHref,
  facebookHref,
  privacyHref = '/politica-de-confidentialitate',
  termsHref = '/termeni-si-conditii',
  legalName,
  vatId,
  location,
}: SiteFooterProps) {
  return (
    <footer className="mt-5 block border-t border-line pt-5.75 pb-7.5 text-[10px] leading-loose text-[#6d565b] md:mt-23.75 md:leading-[2.3]">
      <div className="block md:flex md:justify-between md:leading-normal">
        <span className="block text-wine md:inline">{copyright}</span>
        <span className="block md:inline">
          <a
            href={privacyHref}
            className="block text-wine hover:opacity-70 md:inline"
          >
            Politica de confidențialitate
          </a>
          <span className="hidden md:inline">{' · '}</span>
          <a
            href={termsHref}
            className="block text-wine hover:opacity-70 md:inline"
          >
            Termeni și condiții
          </a>
          <span className="hidden md:inline">{' · '}</span>
          <button
            type="button"
            className="block cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[10px] text-wine hover:opacity-70 md:inline"
            onClick={() =>
              window.dispatchEvent(new Event('fh:open-cookie-preferences'))
            }
          >
            Setări cookie-uri
          </button>
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
        {facebookHref && (
          <a
            href={facebookHref}
            aria-label="Urmărește-ne pe Facebook"
            className="flex items-center gap-2 text-wine transition-opacity hover:opacity-70 md:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookIcon />
            <span>Facebook</span>
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
          {vatId && (
            <>
              {' · '}
              <span itemProp="vatID">{vatId}</span>
            </>
          )}
          {location && (
            <>
              {' · '}
              <span
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <span itemProp="addressLocality">{location}</span>
              </span>
            </>
          )}
        </p>
      )}
    </footer>
  );
}
