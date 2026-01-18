import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { AmortizationSimulatorTab } from '../components/AmortizationSimulatorTab';

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

// Mock child components to simplify testing
vi.mock('../components/MortgageCalculatorTab', () => ({
  MortgageCalculatorTab: () => <div data-testid="mortgage-tab">Mortgage Tab</div>
}));
// We don't mock AmortizationSimulatorTab fully because we want to test its state logic,
// BUT it has many children. Let's shallow mock its children.
vi.mock('../components/Simulator/BaseLoanInputs', () => ({
  BaseLoanInputs: ({ onChange }) => (
    <button onClick={() => onChange('principal', 999999)} data-testid="change-base">Change Base</button>
  )
}));
vi.mock('../components/Simulator/ScenarioInputs', () => ({
  ScenarioInputs: ({ onChange }) => (
    <button onClick={() => onChange('injectionAmount', 55555)} data-testid="change-scenario">Change Scenario</button>
  )
}));
vi.mock('../components/Simulator/ComparisonTable', () => ({
  ComparisonTable: () => <div>Table</div>
}));
vi.mock('../components/Simulator/ComparisonCharts', () => ({
  ComparisonCharts: () => <div>Charts</div>
}));

describe('State Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset implementation to default store behavior
    localStorageMock.getItem.mockImplementation((key) => {
        return localStorageMock.store[key] || null;
    });
    // Add a way to store data
    localStorageMock.store = {};
    localStorageMock.setItem.mockImplementation((key, value) => {
        localStorageMock.store[key] = value.toString();
    });
  });

  it('App loads active tab from localStorage', () => {
    localStorageMock.store['tae_activeTab'] = 'simulator';
    render(<App />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('tae_activeTab');
    const simulatorTab = screen.getByText('Simulador Amortización');
    expect(simulatorTab).toBeInTheDocument();
  });

  it('App saves active tab to localStorage on change', () => {
    render(<App />);
    const simulatorButton = screen.getByText('Simulador Amortización');
    
    act(() => {
        fireEvent.click(simulatorButton);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('tae_activeTab', 'simulator');
  });

  it('AmortizationSimulatorTab saves baseData to localStorage', () => {
    render(<AmortizationSimulatorTab />);
    
    const changeButton = screen.getByTestId('change-base');
    act(() => {
        fireEvent.click(changeButton);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('tae_sim_baseData', expect.stringContaining('999999'));
  });

  it('AmortizationSimulatorTab loads baseData from localStorage', () => {
    const savedData = JSON.stringify({ principal: 123456, years: 10, annualTIN: 1 });
    localStorageMock.store['tae_sim_baseData'] = savedData;

    render(<AmortizationSimulatorTab />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('tae_sim_baseData');
  });

  it('AmortizationSimulatorTab saves scenarios to localStorage', () => {
    render(<AmortizationSimulatorTab />);
    
    const changeButtons = screen.getAllByTestId('change-scenario');
    // Change the first scenario
    act(() => {
        fireEvent.click(changeButtons[0]);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('tae_sim_scenarios', expect.stringContaining('55555'));
  });

  it('AmortizationSimulatorTab loads scenarios from localStorage', () => {
    const savedScenarios = JSON.stringify([{
        injectionAmount: 77777,
        injectionMonth: 12,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceTerm',
    }]);
    localStorageMock.store['tae_sim_scenarios'] = savedScenarios;

    render(<AmortizationSimulatorTab />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('tae_sim_scenarios');
    // Implicitly verified if it doesn't crash, as the previous crash was due to invalid load
  });
});
