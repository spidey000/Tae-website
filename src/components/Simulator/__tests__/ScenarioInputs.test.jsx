import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenarioInputs } from '../ScenarioInputs';
import { describe, it, expect, vi } from 'vitest';

describe('ScenarioInputs Component', () => {
  const mockScenario = {
    id: 'scenA',
    name: 'Escenario A',
    injectionAmount: 10000,
    injectionMonth: 12,
    strategy: 'reduceTerm'
  };

  const mockOnChange = vi.fn();

  it('renders standard inputs', () => {
    render(<ScenarioInputs scenario={mockScenario} onChange={mockOnChange} index={0} />);
    
    expect(screen.getByRole('textbox', { name: /Nombre/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Cantidad/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Mes/i })).toBeInTheDocument();
  });

  it('calls onChange for amount', () => {
    render(<ScenarioInputs scenario={mockScenario} onChange={mockOnChange} index={0} />);
    
    const amountInput = screen.getByRole('spinbutton', { name: /Cantidad/i });
    fireEvent.change(amountInput, { target: { value: '20000' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('injectionAmount', 20000);
  });

  it('renders strategy selection', () => {
    render(<ScenarioInputs scenario={mockScenario} onChange={mockOnChange} index={0} />);
    
    // Assuming buttons or radios for strategy
    expect(screen.getByText(/Reducir Plazo/i)).toBeInTheDocument();
    expect(screen.getByText(/Reducir Cuota/i)).toBeInTheDocument();
  });

  it('switches strategy', () => {
    render(<ScenarioInputs scenario={mockScenario} onChange={mockOnChange} index={0} />);
    
    const installmentButton = screen.getByText(/Reducir Cuota/i);
    fireEvent.click(installmentButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('strategy', 'reduceInstallment');
  });
});
