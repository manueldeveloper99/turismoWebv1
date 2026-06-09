import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QRPoster from './QRPoster';

describe('QRPoster Component', () => {
  it('renders the town name correctly', () => {
    const testTownName = "Pueblo Test";
    render(<QRPoster townSlug="pueblo-test" townName={testTownName} />);
    
    // The component converts to uppercase
    expect(screen.getByText(testTownName.toUpperCase())).toBeInTheDocument();
  });

  it('renders the default generated URL based on townSlug', () => {
    const slug = "mi-pueblo";
    render(<QRPoster townSlug={slug} townName="Mi Pueblo" />);
    
    // Uses import.meta.env.VITE_APP_URL, which might be undefined in tests, so it results in "undefined/p/mi-pueblo"
    const expectedUrlPart = `/p/${slug}`;
    const urlElement = screen.getByText(new RegExp(expectedUrlPart, 'i'));
    expect(urlElement).toBeInTheDocument();
  });

  it('uses exactUrl when provided', () => {
    const exactUrl = "https://example.com/p/test?destino=123";
    render(<QRPoster townSlug="test" townName="Test" exactUrl={exactUrl} />);
    
    expect(screen.getByText(exactUrl)).toBeInTheDocument();
  });

  it('renders the print button', () => {
    render(<QRPoster townSlug="test" townName="Test" />);
    expect(screen.getByRole('button', { name: /Imprimir Cartel/i })).toBeInTheDocument();
  });
});
