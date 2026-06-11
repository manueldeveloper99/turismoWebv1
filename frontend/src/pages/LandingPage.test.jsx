// REACT TESTING LIBRARY: Proporciona las herramientas para renderizar el componente y consultar el DOM virtual.
import { render, screen } from '@testing-library/react';
// VITEST: Es el motor que ejecuta las pruebas y define las expectativas (expect).
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-i18next para manejar las traducciones
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Devuelve la clave de traducción como texto
  }),
}));

// Mock de la API para evitar llamadas reales al servidor
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
  },
}));

describe('LandingPage Unit Tests', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

  it('debe renderizar el título principal de la aplicación', () => {
    renderComponent();
    // Buscamos la clave de traducción que definiste en el componente
    const title = screen.getByText(/landing.title/i);
    expect(title).toBeInTheDocument();
  });

  it('debe mostrar el enlace de acceso para administradores', () => {
    renderComponent();
    const adminLink = screen.getByText(/landing.admin_link/i);
    expect(adminLink).toBeInTheDocument();
  });

  it('debe mostrar las instrucciones de escaneo del código QR', () => {
    renderComponent();
    const instructions = screen.getByText(/landing.instruction/i);
    expect(instructions).toBeInTheDocument();
  });
});