import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComparisonCharts } from '../ComparisonCharts';

// Mock Recharts to avoid issues with SVG rendering in JSDOM
vi.mock('recharts', () => {
  const React = require('react');
  const MockComponent = ({ children, "data-testid": testId }) => (
    <div data-testid={testId}>{children}</div>
  );
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    Cell: () => <div data-testid="cell" />,
  };
});

describe('ComparisonCharts Multi-Scenario', () => {
  const mockBase = {
    schedule: [{ month: 1, balance: 100000, payment: 500 }],
    totalInterest: 20000
  };

  const mockScenarios = [
    {
      schedule: [{ month: 1, balance: 90000, payment: 600 }],
      totalSavings: 5000,
      totalInjected: 10000
    },
    {
      schedule: [{ month: 1, balance: 95000, payment: 550 }],
      totalSavings: 2000,
      totalInjected: 5000
    }
  ];

  it('renders balance chart by default', () => {
    render(<ComparisonCharts base={mockBase} scenarios={mockScenarios} principal={100000} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Saldo')).toBeInTheDocument();
  });

  it('switches to payment chart when tab is clicked', async () => {
    render(<ComparisonCharts base={mockBase} scenarios={mockScenarios} principal={100000} />);
    
    const paymentTab = screen.getByRole('button', { name: /Cuota/i });
    
    await act(async () => {
      fireEvent.click(paymentTab);
    });
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('switches to savings chart when tab is clicked', async () => {
    render(<ComparisonCharts base={mockBase} scenarios={mockScenarios} principal={100000} />);
    
    const savingsTab = screen.getByRole('button', { name: /Ahorro/i });
    
    await act(async () => {
      fireEvent.click(savingsTab);
    });
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});