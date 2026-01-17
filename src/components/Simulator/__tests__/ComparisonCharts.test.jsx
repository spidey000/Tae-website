import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparisonCharts } from '../ComparisonCharts';
import { describe, it, expect, vi } from 'vitest';

// Mock Recharts to simplify testing
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
}));

describe('ComparisonCharts', () => {
  const mockBase = {
    schedule: [{ month: 1, balance: 1000 }, { month: 2, balance: 500 }],
    totalInterest: 500,
    totalInjected: 0,
    initialMonthlyPayment: 100
  };
  
  const mockScenarios = [
    {
      schedule: [{ month: 1, balance: 900 }, { month: 2, balance: 0 }],
      totalInterest: 200,
      totalInjected: 100,
      strategy: 'reduceTerm'
    }
  ];

  it('renders titles correctly', () => {
    render(<ComparisonCharts base={mockBase} scenarios={mockScenarios} />);
    expect(screen.getByText(/Evolución del Saldo Pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/Coste Total del Préstamo/i)).toBeInTheDocument();
  });

  it('renders chart containers', () => {
    render(<ComparisonCharts base={mockBase} scenarios={mockScenarios} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
