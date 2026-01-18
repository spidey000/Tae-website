import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmortizationSimulatorTab } from '../AmortizationSimulatorTab';
import { describe, it, expect, vi } from 'vitest';

// Mock Recharts to avoid ResizeObserver issues in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: () => <div>BarChart</div>,
  Bar: ({ children }) => <div>{children}</div>,
  Cell: () => null,
}));

describe('AmortizationSimulatorTab Component', () => {
  it('renders the simulator interface with charts', () => {
    render(<AmortizationSimulatorTab />);
    
    // Check Title
    expect(screen.getByText(/Simulador de Amortización/i)).toBeInTheDocument();
    
    // Check Inputs Presence
    expect(screen.getByText(/Configuración Inicial/i)).toBeInTheDocument(); // Base inputs
    
    // Check Scenarios
    expect(screen.getAllByText(/ESCENARIO 1/i).length).toBeGreaterThanOrEqual(2);
    
    // Check Summary Section
    expect(screen.getAllByText(/Escenario Base/i).length).toBeGreaterThanOrEqual(1);

    // Check Charts Presence (New structure)
    expect(screen.getByText(/Análisis Visual Proyectado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Saldo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cuota/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Ahorro/i).length).toBeGreaterThanOrEqual(1);
  });

  it('loads initial state from localStorage', () => {
    const mockData = {
      principal: 300000,
      years: 30,
      annualTIN: 4.5,
    };
    const mockScenarios = [
      {
        injectionAmount: 20000,
        injectionMonth: 6,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceTerm',
      }
    ];

    localStorage.getItem.mockImplementation((key) => {
      if (key === 'tae_sim_baseData') return JSON.stringify(mockData);
      if (key === 'tae_sim_scenarios') return JSON.stringify(mockScenarios);
      return null;
    });

    render(<AmortizationSimulatorTab />);

    // Check if values from localStorage are rendered
    // Note: Depends on how BaseLoanInputs renders values. Assuming standard inputs.
    expect(screen.getByDisplayValue('300000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
  });

  it('saves state to localStorage on change', async () => {
    render(<AmortizationSimulatorTab />);

    // Use getByRole to be more specific and avoid finding the label text or other elements
    const principalInput = screen.getByRole('spinbutton', { name: /Capital Pendiente/i });
    fireEvent.change(principalInput, { target: { value: '250000' } });

    // Check if setItem was called
    expect(localStorage.setItem).toHaveBeenCalledWith('tae_sim_baseData', expect.stringContaining('250000'));
  });
});