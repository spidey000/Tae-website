import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BaseLoanInputs } from '../BaseLoanInputs';
import { describe, it, expect, vi } from 'vitest';

describe('BaseLoanInputs Component', () => {
  const mockData = {
    principal: 100000,
    years: 25,
    annualTIN: 3.5
  };

  const mockOnChange = vi.fn();

  it('renders all inputs', () => {
    render(<BaseLoanInputs data={mockData} onChange={mockOnChange} />);
    
    expect(screen.getByRole('spinbutton', { name: /Capital/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Plazo/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Interés/i })).toBeInTheDocument();
  });

  it('calls onChange with correct field and value', () => {
    render(<BaseLoanInputs data={mockData} onChange={mockOnChange} />);
    
    const capitalInput = screen.getByRole('spinbutton', { name: /Capital/i });
    fireEvent.change(capitalInput, { target: { value: '150000' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('principal', 150000);
  });

  it('handles numeric conversion', () => {
    render(<BaseLoanInputs data={mockData} onChange={mockOnChange} />);
    
    const yearsInput = screen.getByRole('spinbutton', { name: /Plazo/i });
    fireEvent.change(yearsInput, { target: { value: '30' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('years', 30);
  });
});
