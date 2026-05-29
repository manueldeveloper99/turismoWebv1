import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import PlacesPage from './pages/PlacesPage'
import AdminPanel from './pages/AdminPanel'
import ErrorPage from './pages/ErrorPage'
import NavbarComponent from './components/NavbarComponent'

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<ErrorPage message="Escanea un código QR para entrar" />} />
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
