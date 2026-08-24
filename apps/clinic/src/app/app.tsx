import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClinicDesign } from './clinic-design';
import { LegalPage } from './pages/legal-page';
import { ProcedurePage } from './pages/procedure-page';
import { NotFoundPage } from './pages/not-found-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClinicDesign />} />
      <Route path="/proceduri/:slug" element={<ProcedurePage />} />
      <Route path="/politica-de-confidentialitate" element={<LegalPage type="privacy" />} />
      <Route path="/termeni-si-conditii" element={<LegalPage type="terms" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
