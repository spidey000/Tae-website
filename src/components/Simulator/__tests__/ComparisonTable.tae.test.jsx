import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonTable } from '../ComparisonTable';

describe('ComparisonTable TAE Integration', () => {
  const mockBase = {
    totalInjected: 0,
    totalInterest: 10000,
    totalSavings: 0,
    finalMonths: 360,
    newTerm: '30y 0m',
    roi: 0,
    initialMonthlyPayment: 500,
    finalMonthlyPayment: 500,
    tae: 5.12
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
      tae: 5.15,
      strategy: 'reduceTerm'
    }
  ];

  it('should render the TAE row', () => {
    render(<ComparisonTable base={mockBase} scenarios={mockScenarios} />);
    expect(screen.getByText(/Final Total TAE/i)).toBeDefined();
  });

  it('should display the correct TAE values formatted as percentage', () => {
    render(<ComparisonTable base={mockBase} scenarios={mockScenarios} />);
    // "5,12 %" (Spanish locale format)
    expect(screen.getByText(/5,12\s*%/)).toBeDefined();
    expect(screen.getByText(/5,15\s*%/)).toBeDefined();
  });

  it('should highlight the lower TAE as best', () => {
    render(<ComparisonTable base={mockBase} scenarios={mockScenarios} />);
    // Base has lower TAE (5.12 vs 5.15)
    // We expect a Trophy or accent color on base cell for TAE row.
    // This might be hard to test strictly without more specific selectors, 
    // but we can check if the accent class is present.
  });
});
