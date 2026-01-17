import React from 'react';
import { render, screen } from '@testing-library/react';
import { AmortizationSimulatorTab } from '../AmortizationSimulatorTab';
import { describe, it, expect } from 'vitest';

describe('AmortizationSimulatorTab Component', () => {
  it('renders the simulator interface', () => {
    render(<AmortizationSimulatorTab />);
    
    // Check Title
    expect(screen.getByText(/Simulador de Amortización/i)).toBeInTheDocument();
    
    // Check Inputs Presence
    expect(screen.getByText(/Configuración Inicial/i)).toBeInTheDocument(); // Base inputs
    
    // Check Scenarios
    // Note: The ScenarioInputs component renders "[ ESCENARIO X ]" with uppercase styling
    // and input labels like "Nombre del Escenario"
    expect(screen.getAllByText(/Nombre del Escenario/i)).toHaveLength(2);
    
    // Check Summary Section
    expect(screen.getByText(/Escenario Base/i)).toBeInTheDocument();
  });
});