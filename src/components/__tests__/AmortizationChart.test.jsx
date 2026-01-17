import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AmortizationChart } from '../AmortizationChart';

// Mock Recharts because it uses ResizeObserver which is not fully supported in jsdom
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
  };
});

describe('AmortizationChart Component', () => {
  const mockSchedule = [
    { month: 1, balance: 149600, payment: 700, interest: 300, amortization: 400 },
    { month: 12, balance: 145000, payment: 700, interest: 290, amortization: 410 },
  ];

  it('renders chart container', () => {
    render(<AmortizationChart schedule={mockSchedule} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders "NO DATA" message when schedule is empty', () => {
    render(<AmortizationChart schedule={[]} />);
    expect(screen.getByText(/NO_VISUAL_DATA/i)).toBeInTheDocument();
  });
});
