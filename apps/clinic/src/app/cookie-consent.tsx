import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@org/ui';

const STORAGE_KEY = 'fh-cookie-consent';
const CONSENT_VERSION = 1;
export const OPEN_PREFERENCES_EVENT = 'fh:open-cookie-preferences';

interface ConsentChoice {
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent extends ConsentChoice {
  version: number;
  date: string;
}

type ConsentSignal = 'granted' | 'denied';

function pushConsent({ analytics, marketing }: ConsentChoice) {
  const granted = (value: boolean): ConsentSignal => (value ? 'granted' : 'denied');
  const scope = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  const layer = (scope.dataLayer ??= []);
  const signals = {
    analytics_storage: granted(analytics),
    ad_storage: granted(marketing),
    ad_user_data: granted(marketing),
    ad_personalization: granted(marketing),
  };

  if (typeof scope.gtag === 'function') {
    scope.gtag('consent', 'update', signals);
  } else {
    layer.push(['consent', 'update', signals]);
  }

  layer.push({ event: 'cookie_consent_update', analytics_consent: analytics, marketing_consent: marketing });
}

function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(choice: ConsentChoice) {
  try {
    const stored: StoredConsent = { ...choice, version: CONSENT_VERSION, date: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* localStorage indisponibil (mod privat) — consimțământul rămâne valabil doar în sesiune. */
  }
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

function ConsentToggle({ label, description, checked, disabled, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-4 first:border-0 first:pt-0">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-[3px] h-4 w-4 shrink-0 accent-wine disabled:opacity-50"
      />
      <span className="block">
        <span className="block text-[12px] tracking-[0.08em] text-ink uppercase">{label}</span>
        <span className="mt-1 block text-[12px] leading-[1.7] text-muted">{description}</span>
      </span>
    </label>
  );
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readConsent();

    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      pushConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    function open() {
      const stored = readConsent();
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setShowPreferences(true);
      setVisible(true);
    }

    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);


  const decide = useCallback((choice: ConsentChoice) => {
    saveConsent(choice);
    pushConsent(choice);
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setShowPreferences(false);
    setVisible(false);
  }, []);

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 md:p-6">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        className="pointer-events-auto w-full max-w-[760px] border border-line bg-ivory p-6 shadow-[0_18px_45px_rgba(24,53,62,0.16)] md:p-8"
      >
        <p className="text-[10px] tracking-[0.22em] text-accent uppercase">Confidențialitate</p>
        <h2 id="cookie-consent-title" className="mt-3 font-serif text-[22px] leading-[1.3] text-ink md:text-[26px]">
          Alegi tu ce cookie-uri folosim
        </h2>
        <p id="cookie-consent-description" className="mt-3 text-[13px] leading-[1.8] text-muted">
          Folosim cookie-uri strict necesare pentru funcționarea site-ului. Pentru statistici și marketing avem nevoie de
          acordul tău. Poți schimba alegerea oricând din footer. Detalii în{' '}
          <Link className="text-wine underline underline-offset-2 hover:opacity-70" to="/politica-de-confidentialitate">
            Politica de confidențialitate
          </Link>
          .
        </p>

        {showPreferences && (
          <div className="mt-6 flex flex-col gap-4 border border-line bg-white/60 p-5">
            <ConsentToggle
              label="Strict necesare"
              description="Necesare pentru afișarea paginilor și securitate. Nu pot fi dezactivate."
              checked
              disabled
            />
            <ConsentToggle
              label="Statistici"
              description="Ne ajută să înțelegem anonim cum este folosit site-ul, pentru a-l îmbunătăți."
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentToggle
              label="Marketing"
              description="Permit măsurarea campaniilor și afișarea de mesaje relevante."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <Button
            className="w-full tracking-[0.12em] uppercase md:w-auto"
            onClick={() => decide({ analytics: true, marketing: true })}
          >
            Accept toate
          </Button>
          <Button
            className="w-full border border-wine bg-transparent px-5.5 py-3.75 text-[12px] tracking-[0.12em] uppercase md:w-auto"
            onClick={() => decide({ analytics: false, marketing: false })}
          >
            Refuz
          </Button>
          {showPreferences ? (
            <Button
              className="w-full border border-line bg-transparent px-[22px] py-[15px] text-[12px] tracking-[0.12em] text-ink uppercase md:w-auto"
              onClick={() => decide({ analytics, marketing })}
            >
              Salvează preferințele
            </Button>
          ) : (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-left text-[12px] tracking-[0.12em] text-wine uppercase underline underline-offset-4 hover:opacity-70 md:ml-auto md:text-right"
              onClick={() => setShowPreferences(true)}
            >
              Preferințe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
