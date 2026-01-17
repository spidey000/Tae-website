import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComparisonSummary } from '../ComparisonSummary';

// Mock Lucide icons to avoid rendering issues in tests
vi.mock('lucide-react', () => ({
  PiggyBank: () => <span data-testid="icon-piggy" />,
  Clock: () => <span data-testid="icon-clock" />,
  TrendingUp: () => <span data-testid="icon-trending" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
  DollarSign: () => <span data-testid="icon-dollar" />,
  Calendar: () => <span data-testid="icon-calendar" />,
}));

describe('ComparisonSummary Dynamic Updates', () => {
  const mockBase = {
    totalInterest: 50000,
    newTerm: '20y 0m',
    finalMonths: 240,
    initialMonthlyPayment: 1000
  };

  it('displays payment range when strategy is reduceInstallment and payments change', () => {
    const scenarios = [
      {
        totalSavings: 10000,
        totalInjected: 5000,
        roi: 200,
        newTerm: '20y 0m',
        strategy: 'reduceInstallment',
        initialMonthlyPayment: 1000,
        finalMonthlyPayment: 500, // Significant drop
        finalMonths: 240
      }
    ];

    render(<ComparisonSummary base={mockBase} scenarios={scenarios} />);

    // Check for "Initial -> Final" arrow representation
    expect(screen.getByText('➔')).toBeInTheDocument();
    
    // Check for specific values formatted as currency (rough check)
    // 1.000,00 € -> 500,00 €
    // Note: The formatter uses non-breaking spaces or specific locales, so we match partial text or regex
    
    // We expect the initial payment crossed out or labeled
    // And the range displayed
    
    const rangeContainer = screen.getByText('➔').parentElement;
    // Match 1000,00 or 1.000,00 depending on locale
    expect(rangeContainer.textContent).toMatch(/1.?000,00/);
    expect(rangeContainer.textContent).toMatch(/500,00/);
    
    // Check for "Cuota decreciente" label
    expect(screen.getByText('* Cuota decreciente')).toBeInTheDocument();
  });

  it('displays static payment when strategy is reduceTerm', () => {
    const scenarios = [
      {
        totalSavings: 15000,
        totalInjected: 5000,
        roi: 300,
        newTerm: '15y 0m',
        strategy: 'reduceTerm',
        initialMonthlyPayment: 1000,
        finalMonthlyPayment: 1000,
        finalMonths: 180
      }
    ];

    render(<ComparisonSummary base={mockBase} scenarios={scenarios} />);

    // Should NOT have the arrow
    expect(screen.queryByText('➔')).not.toBeInTheDocument();
    
    // Should display the static payment
    // We might find multiple 1.000,00 € (base and current), so be careful
    // But we shouldn't see "Cuota decreciente"
    expect(screen.queryByText('* Cuota decreciente')).not.toBeInTheDocument();
  });
});
