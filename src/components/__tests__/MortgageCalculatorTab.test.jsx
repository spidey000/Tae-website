import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MortgageCalculatorTab } from '../MortgageCalculatorTab';
import { describe, it, expect } from 'vitest';

// Mock child components to avoid testing the whole tree deeply
vi.mock('../AmortizationTable', () => ({
  AmortizationTable: () => <div data-testid="amortization-table">Table</div>
}));
vi.mock('../AmortizationChart', () => ({
  AmortizationChart: () => <div data-testid="amortization-chart">Chart</div>
}));
// We can keep InputGroup real or mock it. Let's keep it real for integration feel or mock if complex.
// Ideally, unit tests should be shallow.

describe('MortgageCalculatorTab', () => {
  it('renders the main sections', () => {
    render(<MortgageCalculatorTab />);
    
    // Check for "Datos de tu Hipoteca" section
    expect(screen.getByText(/Datos de tu Hipoteca/i)).toBeInTheDocument();
    
    // Check for "Bonificaciones Activas" section
    expect(screen.getByText(/Bonificaciones Activas/i)).toBeInTheDocument();
    
    // Check for "Gastos al Firmar" section
    expect(screen.getByText(/Gastos al Firmar/i)).toBeInTheDocument();
  });

  it('updates capital state when input changes', () => {
    render(<MortgageCalculatorTab />);
    
    // Find the capital input (using the label or surrounding context)
    // InputGroup uses "Capital del Préstamo" as label. 
    // Note: React Testing Library might need to find by LabelText.
    const capitalInput = screen.getByLabelText(/Capital del Préstamo/i);
    
    fireEvent.change(capitalInput, { target: { value: '200000' } });
    expect(capitalInput.value).toBe('200000');
  });

  it('toggles between Table and Chart view', () => {
    render(<MortgageCalculatorTab />);
    
    // Default should be Table
    expect(screen.getByTestId('amortization-table')).toBeInTheDocument();
    
    // Find chart button (title="Vista Gráfica")
    const chartButton = screen.getByTitle('Vista Gráfica');
    fireEvent.click(chartButton);
    
    expect(screen.getByTestId('amortization-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('amortization-table')).not.toBeInTheDocument();
  });
});
