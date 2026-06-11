// REACT TESTING LIBRARY: Se utiliza para renderizar el panel y realizar consultas asíncronas con 'findByText'.
import { render, screen } from '@testing-library/react';
// VITEST: Además de la estructura, usamos 'vi' para crear simulaciones o "mocks" de la API externa.
import { describe, it, expect, vi } from 'vitest';
import AdminPanel from './AdminPanel';
import { BrowserRouter } from 'react-router-dom';

// VITEST: 'vi.mock' permite interceptar las llamadas al servidor para probar el comportamiento de la interfaz sin conexión real.
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { role: 'ROLE_USER', active: false } }))
  }
}));

describe('AdminPanel Unit Tests', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <AdminPanel />
    </BrowserRouter>
  );

  it('debe mostrar el mensaje de Acceso Denegado si el usuario no es admin', async () => {
    renderComponent();
    // REACT TESTING LIBRARY: 'findByText' espera a que el elemento aparezca (útil para procesos asíncronos).
    const accessDenied = await screen.findByText(/Acceso Denegado/i);
    expect(accessDenied).toBeInTheDocument();
  });

  it('debe mostrar el botón para volver al inicio cuando el acceso es denegado', async () => {
    renderComponent();
    const backBtn = await screen.findByRole('button', { name: /Volver al Inicio/i });
    expect(backBtn).toBeInTheDocument();
  });
});