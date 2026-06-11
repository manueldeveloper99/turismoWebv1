// REACT TESTING LIBRARY: Importamos 'render' para cargar el componente, 'screen' para buscar elementos y 'fireEvent' para simular interacciones del usuario.
import { render, screen, fireEvent } from '@testing-library/react';
// VITEST: 'describe', 'it' y 'expect' son funciones proporcionadas por Vitest para organizar y validar los resultados de las pruebas.
import { describe, it, expect } from 'vitest';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';

describe('LoginPage Unit Tests', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

  it('debe renderizar los campos de email y contraseña', () => {
    renderComponent();
    // REACT TESTING LIBRARY: Buscamos elementos por su etiqueta o texto de ayuda (placeholder).
    expect(screen.getByLabelText(/correo/i) || screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i) || screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('debe mostrar el botón de inicio de sesión con Google', () => {
    renderComponent();
    const googleBtn = screen.getByRole('button', { name: /google/i });
    expect(googleBtn).toBeInTheDocument();
  });

  it('debe permitir escribir en el campo de email', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText(/email/i);
    // REACT TESTING LIBRARY: 'fireEvent.change' simula que el usuario escribe en el teclado.
    fireEvent.change(emailInput, { target: { value: 'test@ejemplo.com' } });
    // VITEST: 'expect' comprueba que el valor del componente haya cambiado correctamente.
    expect(emailInput.value).toBe('test@ejemplo.com');
  });

  it('debe mostrar el aviso de que el sistema es exclusivo para cuentas @gmail.com', () => {
    renderComponent();
    const disclaimer = screen.getByText(/Sistema exclusivo con cuentas @gmail.com/i);
    expect(disclaimer).toBeInTheDocument();
  });
});