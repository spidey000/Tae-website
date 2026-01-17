import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparisonSummary } from '../ComparisonSummary';
import { describe, it, expect } from 'vitest';

describe('ComparisonSummary Component', () => {
  const mockBase = { 
    totalInterest: 50000,
    newTerm: '25y 0m',
    finalMonths: 300,
    initialMonthlyPayment: 1000,
    finalMonthlyPayment: 1000
  };
  const mockScenA = { 
    totalInterest: 40000, 
    totalSavings: 10000, 
    roi: 50, 
    newTerm: '22y 0m',
    finalMonths: 264,
    initialMonthlyPayment: 1000,
    finalMonthlyPayment: 1000,
    strategy: 'reduceTerm'
  };
  const mockScenB = { 
    totalInterest: 45000, 
    totalSavings: 5000, 
    roi: 25, 
    newTerm: '25y 0m',
    finalMonths: 300,
    initialMonthlyPayment: 1000,
    finalMonthlyPayment: 850,
    strategy: 'reduceInstallment'
  };

  it('renders base summary', () => {
    render(<ComparisonSummary base={mockBase} scenarios={[mockScenA, mockScenB]} />);
    expect(screen.getByText(/Base/i)).toBeInTheDocument();
    expect(screen.getByText(/50\.000/)).toBeInTheDocument();
  });

  it('renders scenario metrics', () => {
    render(<ComparisonSummary base={mockBase} scenarios={[mockScenA]} />);
    expect(screen.getByText(/ESCENARIO 1/i)).toBeInTheDocument();
    expect(screen.getByText(/10\.000/)).toBeInTheDocument();
    expect(screen.getByText(/50,00\s?%/)).toBeInTheDocument();
    expect(screen.getByText(/22y 0m/)).toBeInTheDocument();
  });

  it('handles missing scenarios gracefully', () => {
    render(<ComparisonSummary base={mockBase} scenarios={[]} />);
    expect(screen.getByText(/Base/i)).toBeInTheDocument();
  });
});