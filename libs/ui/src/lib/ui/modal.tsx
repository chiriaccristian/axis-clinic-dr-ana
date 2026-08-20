import {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  /** Accessible name of the dialog. */
  label?: string;
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Centered dialog with a scrim that closes on backdrop click. */
export function Modal({
  children,
  onClose,
  closeLabel = 'Închide',
  label = 'Formular de contact',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const first = dialogRef.current?.querySelector<HTMLElement>(
      focusableSelector,
    );
    (first ?? dialogRef.current)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousActive?.focus?.();
    };
  }, []);

  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center bg-[#342c30bb] p-5"
      onClick={handleBackdrop}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-[min(480px,100%)] bg-ivory p-10 text-wine"
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute top-[14px] right-[18px] cursor-pointer border-0 bg-none text-[24px] text-muted"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div id={titleId} className="sr-only">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

export interface ModalHeadingProps {
  children: ReactNode;
}

export function ModalHeading({ children }: ModalHeadingProps) {
  return (
    <h2 className="my-[18px] font-serif text-[44px] leading-[0.95] font-normal">
      {children}
    </h2>
  );
}

export function ModalText({ children }: ModalHeadingProps) {
  return <p className="leading-[1.6] text-muted">{children}</p>;
}
