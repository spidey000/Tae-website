import React from 'react';
import { render, screen } from '@testing-library/react';
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
  Bar: () => null,
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
    expect(screen.getByText(/Escenario Base/i)).toBeInTheDocument();

    // Check Charts Presence (Titles from ComparisonCharts)
    expect(screen.getByText(/Evolución del Saldo Pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/Coste Total del Préstamo/i)).toBeInTheDocument();
  });
});