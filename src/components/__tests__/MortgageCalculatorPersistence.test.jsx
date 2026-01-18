import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MortgageCalculatorTab } from '../MortgageCalculatorTab';

// Mock child components
vi.mock('../AmortizationTable', () => ({
  AmortizationTable: () => <div data-testid="amortization-table">Table</div>
}));
vi.mock('../AmortizationChart', () => ({
  AmortizationChart: () => <div data-testid="amortization-chart">Chart</div>
}));
vi.mock('../ResultsSummary', () => ({
  ResultsSummary: () => <div data-testid="results-summary">Summary</div>
}));
vi.mock('../EducationalSection', () => ({
  EducationalSection: () => <div data-testid="educational-section">Edu</div>
}));
vi.mock('../CoreConceptAnalysis', () => ({
  CoreConceptAnalysis: () => <div data-testid="core-concept">Analysis</div>
}));

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('MortgageCalculatorTab Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    localStorageMock.store = {};
    localStorageMock.getItem.mockImplementation((key) => localStorageMock.store[key] || null);
    localStorageMock.setItem.mockImplementation((key, value) => {
        localStorageMock.store[key] = value.toString();
    });
  });

  it('loads initial state from localStorage', () => {
    localStorageMock.store['tae_calc_capital'] = '300000';
    localStorageMock.store['tae_calc_years'] = '30';
    localStorageMock.store['tae_calc_viewMode'] = 'chart';

    render(<MortgageCalculatorTab />);

    const capitalInput = screen.getByRole('spinbutton', { name: /Capital del Préstamo/i });
    expect(capitalInput.value).toBe('300000');

    const yearsInput = screen.getByRole('spinbutton', { name: /Plazo/i });
    expect(yearsInput.value).toBe('30');

    expect(screen.getByTestId('amortization-chart')).toBeInTheDocument();
  });

  it('saves capital to localStorage on change', () => {
    render(<MortgageCalculatorTab />);
    
    const capitalInput = screen.getByRole('spinbutton', { name: /Capital del Préstamo/i });
    fireEvent.change(capitalInput, { target: { value: '250000' } });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('tae_calc_capital', '250000');
  });

  it('saves viewMode to localStorage on change', () => {
    render(<MortgageCalculatorTab />);
    
    const chartButton = screen.getByTitle('Vista Gráfica');
    fireEvent.click(chartButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('tae_calc_viewMode', 'chart');
  });
});
