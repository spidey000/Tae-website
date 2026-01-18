import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonTable } from '../ComparisonTable';

describe('ComparisonTable Investment Integration', () => {
  const mockBase = {
    totalInjected: 0,
    totalInterest: 10000,
    totalSavings: 0,
    finalMonths: 360,
    newTerm: '30y 0m',
    roi: 0,
    initialMonthlyPayment: 500,
    finalMonthlyPayment: 500,
    investmentReturn: 0
  };

  const mockScenarios = [
    {
      totalInjected: 10000,
      totalInterest: 8000,
      totalSavings: 2000,
      finalMonths: 300,
      newTerm: '25y 0m',
      roi: 20,
      initialMonthlyPayment: 500,
      finalMonthlyPayment: 500,
      investmentReturn: 5.15,
      strategy: 'reduceTerm'
    }
  ];

  it('should render the Rentabilidad Inyección row', () => {
    render(<ComparisonTable base={mockBase} scenarios={mockScenarios} />);
    expect(screen.getByText(/Rentabilidad Inyección \(TAE\)/i)).toBeDefined();
  });

  it('should display the correct Investment TAE values formatted as percentage', () => {
    render(<ComparisonTable base={mockBase} scenarios={mockScenarios} />);
    // "5,15 %" (Spanish locale format)
    expect(screen.getByText(/5,15\s*%/)).toBeDefined();
  });
});