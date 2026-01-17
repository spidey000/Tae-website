import React from 'react';
import { render, screen } from '@testing-library/react';
import { AmortizationSimulatorTab } from '../AmortizationSimulatorTab';
import { describe, it, expect } from 'vitest';

describe('AmortizationSimulatorTab Component', () => {
  it('renders the construction message', () => {
    render(<AmortizationSimulatorTab />);
    
    expect(screen.getByText(/Simulador de Amortización Anticipada/i)).toBeInTheDocument();
    expect(screen.getByText(/Módulo en construcción/i)).toBeInTheDocument();
  });
});
