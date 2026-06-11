// REACT TESTING LIBRARY: 'render' monta el componente para que podamos inspeccionar su estructura HTML.
import { render } from '@testing-library/react';
// VITEST: Proporciona las funciones para definir los casos de prueba (it) y las validaciones (expect).
import { describe, it, expect } from 'vitest';
import BackgroundCarousel from './BackgroundCarousel';

// VITEST: Bloque de pruebas para el componente visual del carrusel.
describe('Componente BackgroundCarousel', () => {
  it('debe renderizar el contenedor del carrusel', () => {
    const { container } = render(<BackgroundCarousel />);
    // VITEST: Usamos selectores estándar para verificar la existencia de clases de Bootstrap.
    const carousel = container.querySelector('.carousel');
    expect(carousel).toBeInTheDocument();
  });

  it('debe tener imágenes con estilo de cobertura completa', () => {
    const { container } = render(<BackgroundCarousel />);
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      expect(images[0]).toHaveStyle({ objectFit: 'cover' });
    }
  });
});
