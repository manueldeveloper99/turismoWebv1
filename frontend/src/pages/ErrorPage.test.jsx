import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';

describe('ErrorPage Unit Tests', () => {
  const renderComponent = (message = null) => render(
    <BrowserRouter>
      <ErrorPage message={message} />
    </BrowserRouter>
  );

  it('debe renderizar el encabezado 404', () => {
    renderComponent();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de error por defecto si no se proporciona uno', () => {
    renderComponent();
    expect(screen.getByText(/El código QR escaneado no corresponde/i)).toBeInTheDocument();
  });

  it('debe mostrar un mensaje de error personalizado si se proporciona', () => {
    const customMessage = '¡Ups! Este QR ya no es válido.';
    renderComponent(customMessage);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('debe renderizar los botones de navegación', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /Volver al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar conexión/i })).toBeInTheDocument();
  });
});