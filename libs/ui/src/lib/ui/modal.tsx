import { MouseEvent, ReactNode } from 'react';

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  closeLabel?: string;
}

/** Centered dialog with a scrim that closes on backdrop click. */
export function Modal({
  children,
  onClose,
  closeLabel = 'Închide',
}: ModalProps) {
  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center bg-[#342c30bb] p-5"
      onClick={handleBackdrop}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-[min(480px,100%)] bg-ivory p-10 text-wine"
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute top-[14px] right-[18px] cursor-pointer border-0 bg-none text-[24px] text-muted"
        >
          ×
        </button>
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
