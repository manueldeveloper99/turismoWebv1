// REACT TESTING LIBRARY: Importamos 'render' para cargar el componente, 'screen' para buscar elementos y 'fireEvent' para simular interacciones del usuario.
import { render, screen } from '@testing-library/react';
// VITEST: 'describe', 'it' y 'expect' son funciones proporcionadas por Vitest para organizar y validar los resultados de las pruebas.
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock de @react-oauth/google para evitar el error del Provider
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <button>Google Login</button>,
}));

// Mock de la API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('LoginPage Unit Tests', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

  it('debe renderizar el título de bienvenida para administradores', () => {
    renderComponent();
    expect(screen.getByText(/login.admin_title/i)).toBeInTheDocument(); // Cambiar esto por /BotonQueNoExiste/i
  });

  it('debe mostrar el botón de inicio de sesión con Google', () => {
    renderComponent();
    const googleBtn = screen.getByText(/Google Login/i);
    expect(googleBtn).toBeInTheDocument();
  });

  it('debe mostrar el aviso de que el sistema es exclusivo para cuentas @gmail.com', () => {
    renderComponent();
    const disclaimer = screen.getByText(/login.google_only/i);
    expect(disclaimer).toBeInTheDocument();
  });
});


//PRUEBA PULL ASH
