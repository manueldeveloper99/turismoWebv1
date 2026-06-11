// REACT TESTING LIBRARY: Proporciona las herramientas para renderizar el componente y consultar el DOM virtual.
import { render, screen } from '@testing-library/react';
// VITEST: Es el motor que ejecuta las pruebas y define las expectativas (expect).
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';

// VITEST: 'describe' agrupa las pruebas relacionadas con la LandingPage.
describe('LandingPage Unit Tests', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

  it('debe renderizar el título principal de la aplicación', () => {
    renderComponent();
    // REACT TESTING LIBRARY: 'screen.getByText' busca un texto específico en la pantalla.
    const title = screen.getByText(/Pueblos Mágicos/i);
    expect(title).toBeInTheDocument();
  });

  it('debe mostrar la sección de destinos turísticos', () => {
    renderComponent();
    const list = screen.getByRole('main');
    expect(list).toBeInTheDocument();
  });

  it('debe tener una barra de búsqueda funcional', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('debe mostrar las instrucciones de escaneo del código QR', () => {
    renderComponent();
    const instructions = screen.getByText(/Escanea el código QR físico/i);
    expect(instructions).toBeInTheDocument();
  });
});