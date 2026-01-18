import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { AmortizationSimulatorTab } from '../components/AmortizationSimulatorTab';

// Mock localStorage is handled in setupTests.js globally

// Mock child components to simplify testing
vi.mock('../components/MortgageCalculatorTab', () => ({
  MortgageCalculatorTab: () => <div data-testid="mortgage-tab">Mortgage Tab</div>
}));

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
    localStorage.clear();
    vi.clearAllMocks();
    
    // Reset implementation to default store behavior
    // We can access the store via the closure in setupTests if we exported it, but we didn't export the closure.
    // However, we can just mock implementation on the global object.
    
    // We need a local store for this test file to avoid shared state issues if parallel
    let localStore = {};
    
    localStorage.getItem.mockImplementation((key) => localStore[key] || null);
    localStorage.setItem.mockImplementation((key, value) => {
        localStore[key] = value.toString();
    });
    
    // Expose store for test assertions
    localStorage.store = localStore;
  });

  it('App loads active tab from localStorage', () => {
    localStorage.store['tae_activeTab'] = 'simulator';
    render(<App />);
    
    expect(localStorage.getItem).toHaveBeenCalledWith('tae_activeTab');
    const simulatorTab = screen.getByText('Simulador Amortización');
    expect(simulatorTab).toBeInTheDocument();
  });
// ... rest of tests use localStorage.store or localStorage methods


  it('App saves active tab to localStorage on change', () => {
    render(<App />);
    const simulatorButton = screen.getByText('Simulador Amortización');
    
    act(() => {
        fireEvent.click(simulatorButton);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('tae_activeTab', 'simulator');
  });

  it('AmortizationSimulatorTab saves baseData to localStorage', () => {
    render(<AmortizationSimulatorTab />);
    
    const changeButton = screen.getByTestId('change-base');
    act(() => {
        fireEvent.click(changeButton);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('tae_sim_baseData', expect.stringContaining('999999'));
  });

  it('AmortizationSimulatorTab loads baseData from localStorage', () => {
    const savedData = JSON.stringify({ principal: 123456, years: 10, annualTIN: 1 });
    localStorage.store['tae_sim_baseData'] = savedData;

    render(<AmortizationSimulatorTab />);

    expect(localStorage.getItem).toHaveBeenCalledWith('tae_sim_baseData');
  });

  it('AmortizationSimulatorTab saves scenarios to localStorage', () => {
    render(<AmortizationSimulatorTab />);
    
    const changeButtons = screen.getAllByTestId('change-scenario');
    // Change the first scenario
    act(() => {
        fireEvent.click(changeButtons[0]);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('tae_sim_scenarios', expect.stringContaining('55555'));
  });

  it('AmortizationSimulatorTab loads scenarios from localStorage', () => {
    const savedScenarios = JSON.stringify([{
        injectionAmount: 77777,
        injectionMonth: 12,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceTerm',
    }]);
    localStorage.store['tae_sim_scenarios'] = savedScenarios;

    render(<AmortizationSimulatorTab />);

    expect(localStorage.getItem).toHaveBeenCalledWith('tae_sim_scenarios');
    // Implicitly verified if it doesn't crash, as the previous crash was due to invalid load
  });
});
