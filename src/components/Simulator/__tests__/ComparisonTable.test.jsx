import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComparisonTable } from '../ComparisonTable';

describe('ComparisonTable', () => {
  const mockBase = {
    totalInjected: 0,
    totalInterest: 50000,
    totalSavings: 0,
    finalMonths: 300,
    newTerm: "25y 0m",
    roi: 0,
    finalMonthlyPayment: 1000,
    initialMonthlyPayment: 1000,
    strategy: 'base'
  };

  const mockScenario = {
    totalInjected: 10000,
    totalInterest: 40000,
    totalSavings: 10000,
    finalMonths: 240,
    newTerm: "20y 0m",
    roi: 120.71, // 120.71%
    finalMonthlyPayment: 1000,
    initialMonthlyPayment: 1000,
    strategy: 'reduceTerm'
  };

  it('renders ROI with multiplier delta', () => {
    render(<ComparisonTable base={mockBase} scenarios={[mockScenario]} />);

    // Check for ROI label
    expect(screen.getByText(/ROI Amortización/i)).toBeInTheDocument();

    // Check for Scenario ROI value (120,71 %)
    // Note: The formatPercent uses es-ES, so it might output "120,71 %" or "120.71%" depending on node/ICU version. 
    // We'll search for the number part loosely or exact string if we are confident.
    // In many CI envs, space is a non-breaking space (U+00A0) for percent.
    
    // We can try to find the text by regex
    const roiValue = screen.getByText(/120,71\s*%/);
    expect(roiValue).toBeInTheDocument();

    // Check for Multiplier Delta (+1,21x)
    // 120.71 - 0 = 120.71
    // 120.71 / 100 = 1.2071
    // 1.2071 formatted to 2 decimals -> 1,21
    // Format is: +1,21x
    const multiplierDelta = screen.getByText(/\+1,21x/);
    expect(multiplierDelta).toBeInTheDocument();
  });
});
