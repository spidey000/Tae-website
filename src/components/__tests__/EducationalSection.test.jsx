import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EducationalSection } from '../EducationalSection';

describe('EducationalSection Component', () => {
  it('renders the glossary section with new title', () => {
    render(<EducationalSection />);
    expect(screen.getByText(/Diccionario Financiero Básico/i)).toBeInTheDocument();
    expect(screen.getByText(/\[ GLOSARIO \]/i)).toBeInTheDocument();
  });

  it('renders the math section with new title', () => {
    render(<EducationalSection />);
    expect(screen.getByText(/¿Cómo se calculan los números\?/i)).toBeInTheDocument();
    expect(screen.getByText(/\[ MATEMÁTICAS \]/i)).toBeInTheDocument();
  });

  it('renders simplified algorithm description', () => {
    render(<EducationalSection />);
    expect(screen.getByText(/Cálculo matemático complejo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Newton-Raphson/i)).not.toBeInTheDocument();
  });
});
