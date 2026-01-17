import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('App Component', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText(/CALCULADORA HIPOTECARIA/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulador Avanzado/i)).toBeInTheDocument();
  });
});
