import { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClinicDesign } from './clinic-design';
import { LegalPage } from './pages/legal-page';
import { ProcedurePage } from './pages/procedure-page';
import { NotFoundPage } from './pages/not-found-page';
import { CookieConsent } from './cookie-consent';
import { PromoModal } from './promo-modal';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClinicDesign />} />
      <Route path="/proceduri/:slug" element={<ProcedurePage />} />
      <Route
        path="/politica-de-confidentialitate"
        element={<LegalPage type="privacy" />}
      />
      <Route path="/termeni-si-conditii" element={<LegalPage type="terms" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  // The promo waits for the cookie banner so the two never overlap.
  const [consentSettled, setConsentSettled] = useState(false);
  const handleConsentSettled = useCallback(() => setConsentSettled(true), []);

  return (
    <BrowserRouter>
      <AppRoutes />
      <PromoModal ready={consentSettled} />
      <CookieConsent onSettled={handleConsentSettled} />
    </BrowserRouter>
  );
}

export default App;
