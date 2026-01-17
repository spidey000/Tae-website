import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CoreConceptAnalysis } from '../CoreConceptAnalysis';

describe('CoreConceptAnalysis Component', () => {
  it('renders the main heading', () => {
    render(<CoreConceptAnalysis />);
    expect(screen.getByText(/La Verdad sobre TIN vs TAE/i)).toBeInTheDocument();
  });

  it('renders key concepts', () => {
    render(<CoreConceptAnalysis />);
    expect(screen.getByText(/Cómo calcular la TAE/i)).toBeInTheDocument();
    expect(screen.getByText(/Por qué es lo único que importa/i)).toBeInTheDocument();
  });
});
