import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import * as api from '../services/api';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'es' }
  }),
}));

// Mock api
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Mock ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn()
  }),
}));

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
    // so the fallback button "nav.logout" (text) should be present
    const logoutBtn = screen.getByText('nav.logout');
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');

    // Restore window.location1
    window.location = originalLocation;
  });
});
