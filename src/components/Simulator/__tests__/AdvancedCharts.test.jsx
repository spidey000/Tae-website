import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdvancedCharts } from '../AdvancedCharts';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('AdvancedCharts Component', () => {
  const mockBase = {
    schedule: [
      { month: 1, interest: 100, payment: 500 },
      { month: 2, interest: 99, payment: 500 }
    ],
    tae: 5.12
  };

  const mockScenarios = [
    {
      schedule: [
        { month: 1, interest: 100, payment: 500 },
        { month: 2, interest: 90, payment: 500 }
      ],
      tae: 5.15
    }
  ];

  it('renders the chart containers', () => {
    render(<AdvancedCharts base={mockBase} scenarios={mockScenarios} />);
    
    expect(screen.getByText(/Interés Acumulado/i)).toBeDefined();
    expect(screen.getByText(/Evolución de Cuota Mensual/i)).toBeDefined();
    expect(screen.getByText(/Comparativa de TAE Final/i)).toBeDefined();
  });
});
