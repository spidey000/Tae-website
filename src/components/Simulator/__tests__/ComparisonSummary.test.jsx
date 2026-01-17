import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparisonSummary } from '../ComparisonSummary';
import { describe, it, expect } from 'vitest';

describe('ComparisonSummary Component', () => {
  const mockBase = { 
    totalInterest: 50000 
  };
  const mockScenA = { 
    totalInterest: 40000, 
    totalSavings: 10000, 
    roi: 50, 
    newTerm: '22y 0m',
    strategy: 'reduceTerm'
  };
  const mockScenB = { 
    totalInterest: 45000, 
    totalSavings: 5000, 
    roi: 25, 
    newTerm: '25y 0m',
    strategy: 'reduceInstallment'
  };

  it('renders base summary', () => {
    render(<ComparisonSummary base={mockBase} scenA={mockScenA} scenB={mockScenB} />);
    expect(screen.getByText(/Base/i)).toBeInTheDocument();
    expect(screen.getByText(/50\.000/)).toBeInTheDocument();
  });

  it('renders scenario A metrics', () => {
    render(<ComparisonSummary base={mockBase} scenA={mockScenA} scenB={mockScenB} />);
    expect(screen.getByText(/Escenario A/i)).toBeInTheDocument();
    expect(screen.getByText(/10\.000/)).toBeInTheDocument();
    // Match locale formatted percentage (e.g. 50,00%)
    // The component produces "50,00 %" or "50,00%" depending on browser locale impl in JSDOM.
    // We use a flexible regex.
    expect(screen.getByText(/50,00\s?%/)).toBeInTheDocument();
    expect(screen.getByText(/22y 0m/)).toBeInTheDocument();
  });

  it('handles missing scenarios gracefully', () => {
    render(<ComparisonSummary base={mockBase} />);
    expect(screen.getByText(/Base/i)).toBeInTheDocument();
  });
});