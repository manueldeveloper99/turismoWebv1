// REACT TESTING LIBRARY: Nos permite verificar que la información dinámica (props) se renderice correctamente en el componente.
import { render, screen } from '@testing-library/react';
// VITEST: Framework encargado de ejecutar cada unidad de prueba.
import { describe, it, expect } from 'vitest';
import QRPoster from './QRPoster';

// VITEST: Conjunto de pruebas para el generador de pósters QR.
describe('Componente QRPoster', () => {
  const mockProps = {
    townSlug: 'santa-maria',
    townName: 'Santa María',
    exactUrl: 'http://localhost:5173/p/santa-maria'
  };

  it('debe mostrar el nombre del pueblo correctamente', () => {
    render(<QRPoster {...mockProps} />);
    expect(screen.getByText(/Santa María/i)).toBeInTheDocument();
  });

  it('debe renderizar el área del código QR', () => {
    const { container } = render(<QRPoster {...mockProps} />);
    const qrCanvas = container.querySelector('canvas');
    expect(qrCanvas).toBeInTheDocument();
  });

  it('debe mostrar la instrucción de escaneo', () => {
    render(<QRPoster {...mockProps} />);
    expect(screen.getByText(/Escanea para explorar/i)).toBeInTheDocument();
  });
});
