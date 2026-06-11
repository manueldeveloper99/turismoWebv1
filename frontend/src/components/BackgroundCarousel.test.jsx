// REACT TESTING LIBRARY: 'render' monta el componente para que podamos inspeccionar su estructura HTML.
import { render } from '@testing-library/react';
// VITEST: Proporciona las funciones para definir los casos de prueba (it) y las validaciones (expect).
import { describe, it, expect } from 'vitest';
import BackgroundCarousel from './BackgroundCarousel';

// VITEST: Bloque de pruebas para el componente visual del carrusel.
describe('Componente BackgroundCarousel', () => {
  it('debe renderizar el contenedor del carrusel', () => {
    const { container } = render(<BackgroundCarousel />);
    // VITEST: Verificamos que se rendericen las capas de imágenes del carrusel (son divs con background-image).
    const divs = container.querySelectorAll('div');
    const imageLayers = Array.from(divs).filter(div => div.style.backgroundImage);
    expect(imageLayers.length).toBeGreaterThan(0);
  });

  it('debe tener imágenes con estilo de cobertura completa', () => {
    const { container } = render(<BackgroundCarousel />);
    const divs = container.querySelectorAll('div');
    const imageLayers = Array.from(divs).filter(div => div.style.backgroundImage);
    if (imageLayers.length > 0) {
      expect(imageLayers[0]).toHaveStyle({ backgroundSize: 'cover' });
    }
  });
});
