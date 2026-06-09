import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ErrorPage from './ErrorPage';

describe('ErrorPage Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the 404 heading', () => {
    renderWithRouter(<ErrorPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the default error message when no message is passed', () => {
    renderWithRouter(<ErrorPage />);
    expect(screen.getByText(/El código QR escaneado no corresponde a un pueblo registrado/i)).toBeInTheDocument();
  });

  it('renders a custom error message', () => {
    const customMessage = "Custom Error Test Message";
    renderWithRouter(<ErrorPage message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('contains navigation buttons', () => {
    renderWithRouter(<ErrorPage />);
    expect(screen.getByRole('button', { name: /Volver al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar conexión/i })).toBeInTheDocument();
  });
});
