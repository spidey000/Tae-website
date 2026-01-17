import { render, screen, fireEvent } from '@testing-library/react';
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
  });
});

describe('App Component Navigation', () => {
  it('renders tab navigation', () => {
    render(<App />);
    // These should fail currently
    expect(screen.getByRole('button', { name: /Calculadora Hipoteca/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simulador Amortización/i })).toBeInTheDocument();
  });

  it('switches views when tabs are clicked', () => {
    render(<App />);
    
    // Default view is Calculator (existing content)
    expect(screen.getByText(/Capital del Préstamo/i)).toBeInTheDocument();

    // Switch to Simulator
    const simulatorTab = screen.getByRole('button', { name: /Simulador Amortización/i });
    fireEvent.click(simulatorTab);

    // Expect Simulator content (which doesn't exist yet)
    expect(screen.getByText(/Simulador de Amortización/i)).toBeInTheDocument();
    
    // Expect Calculator content to be hidden (using toBeVisible because it's in the DOM but hidden via CSS)
    expect(screen.getByText(/Capital del Préstamo/i)).not.toBeVisible();
  });
});