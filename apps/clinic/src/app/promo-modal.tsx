import { useEffect, useState } from 'react';
import { Modal } from '@org/ui';
import { promo, whatsappHref } from '../content/site-content';

const SEEN_KEY_PREFIX = 'fh-promo-seen:';
const IMAGE_SIZES = '(max-width: 600px) calc(100vw - 40px), 520px';

export function isPromoActive(now: Date, endsAt: string): boolean {
  return now.getTime() <= Date.parse(endsAt);
}

/** Marks the promo as seen for this browser session; returns false if it already was. */
function claimSessionView(id: string): boolean {
  const key = `${SEEN_KEY_PREFIX}${id}`;
  try {
    if (window.sessionStorage.getItem(key)) {
      return false;
    }
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Storage unavailable (private mode, blocked): still show the promo.
  }
  return true;
}

export interface PromoModalProps {
  /** Open only once this is true (e.g. after the cookie choice is made). */
  ready: boolean;
}

/** Auto-opening promotional dialog, shown once per browser session until `promo.endsAt`. */
export function PromoModal({ ready }: PromoModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      ready &&
      isPromoActive(new Date(), promo.endsAt) &&
      claimSessionView(promo.id)
    ) {
      setOpen(true);
    }
  }, [ready]);

  if (!open) {
    return null;
  }

  const { image } = promo;
  const srcSet = (format: string) =>
    [480, 768, 1024]
      .map((w) => `${image.base}-${w}.${format} ${w}w`)
      .join(', ');

  return (
    <Modal
      onClose={() => setOpen(false)}
      label={promo.dialogLabel}
      className="max-h-[calc(100dvh-40px)] w-[min(520px,100%)]! overflow-y-auto p-0!"
      closeButtonClassName="top-2! right-2! z-10 grid h-10 w-10 place-items-center rounded-full bg-ivory/90! text-wine! shadow-md transition-colors hover:bg-ivory! focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes={IMAGE_SIZES} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={IMAGE_SIZES} />
        <img
          src={`${image.base}.jpg`}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="block h-auto w-full"
        />
      </picture>
      <div className="flex flex-col items-center gap-2 px-5 pt-4 pb-5 text-center">
        <a
          href={whatsappHref(promo.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="inline-flex w-full items-center justify-center gap-2.5 bg-wine px-5.5 py-3.75 text-[13px] font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
          </svg>
          <span>{promo.ctaLabel}</span>
        </a>
        <p className="text-[13px] text-muted">{promo.ctaHint}</p>
      </div>
    </Modal>
  );
}
