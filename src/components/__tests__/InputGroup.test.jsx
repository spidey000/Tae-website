import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputGroup } from '../InputGroup';

describe('InputGroup Component', () => {
  it('renders label and input value correctly', () => {
    render(<InputGroup label="Test Label" value={100} onChange={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('calls onChange with new value', () => {
    const handleChange = vi.fn();
    render(<InputGroup label="Test" value="" onChange={handleChange} />);
    
    const input = screen.getByRole('spinbutton'); // type="number" default
    fireEvent.change(input, { target: { value: '50' } });
    
    expect(handleChange).toHaveBeenCalledWith('50');
  });

  it('renders suffix if provided', () => {
    render(<InputGroup label="Test" value={100} onChange={() => {}} suffix="EUR" />);
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  // RED PHASE: Feature to implement
  it('displays error styles when error prop is present', () => {
    const { container } = render(
      <InputGroup 
        label="Test" 
        value={100} 
        onChange={() => {}} 
        error="Invalid Value" 
      />
    );
    
    const input = screen.getByRole('spinbutton');
    // Expecting red border for error state
    expect(input).toHaveClass('border-red-500');
    // Expecting error message to be displayed
    expect(screen.getByText('Invalid Value')).toBeInTheDocument();
  });
});
