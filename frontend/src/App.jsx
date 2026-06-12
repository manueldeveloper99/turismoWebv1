import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import LoginPage from './pages/LoginPage'
import PlacesPage from './pages/PlacesPage'
import AdminPanel from './pages/AdminPanel'
import ErrorPage from './pages/ErrorPage'
import LandingPage from './pages/LandingPage'
import NavbarComponent from './components/NavbarComponent'

// Inicializar GA4 con tu ID de medición
// Lo ideal es que este ID esté en tu archivo .env como VITE_GA_MEASUREMENT_ID
const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (TRACKING_ID && TRACKING_ID !== "G-XXXXXXXXXX") {
  ReactGA.initialize(TRACKING_ID);
}

// Componente auxiliar para rastrear cambios de página automáticamente
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (TRACKING_ID && TRACKING_ID !== "G-XXXXXXXXXX") {
      ReactGA.send({ 
        hitType: "pageview", 
        page: location.pathname + location.search 
      });
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/p/:townSlug" element={<LoginPage />} />
        <Route path="/p/:townSlug/places" element={<PlacesPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<ErrorPage message="Página no encontrada" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App