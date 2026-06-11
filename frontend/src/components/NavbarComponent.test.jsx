import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NavbarComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders brand name correctly', () => {
    renderWithRouter(<NavbarComponent />);
    expect(screen.getByText('Turismo Local CR')).toBeInTheDocument();
  });

  it('does not show logout button when no token is present', () => {
    renderWithRouter(<NavbarComponent />);
    expect(screen.queryByTitle('Cerrar Sesión')).not.toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    // Set a dummy token
    localStorage.setItem('token', 'dummy.token.here');

    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    renderWithRouter(<NavbarComponent />);

    // As the token is invalid JSON base64, user won't be parsed, but token exists
    // so the fallback button "Cerrar Sesión" (text) should be present
    const logoutBtn = screen.getByText('Cerrar Sesión');
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');

    // Restore window.location1
    window.location = originalLocation;
  });
});
