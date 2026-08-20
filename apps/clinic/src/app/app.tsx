import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ClinicDesign } from './clinic-design';
import { ProcedurePage } from './pages/procedure-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClinicDesign />} />
      <Route path="/proceduri/:slug" element={<ProcedurePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
