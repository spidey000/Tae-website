# Implementation Plan: Investment Comparison & Return Analysis

## Phase 1: Investment Return Logic
- [x] Task: Implement `calculateInvestmentReturn` in `amortizationEngine.js`
    - [x] Create a function that generates a cash flow difference stream between Base and Scenario.
    - [x] Calculate IRR of this stream to get the Annualized Return of the Injection.
    - [x] Add unit tests for this new calculation.
- [~] Task: Update `AmortizationSimulatorTab.jsx`
    - [x] Calculate the return metric for each scenario after the base simulation is done.
    - [x] Pass the new metric to the results.
- [x] Task: Update `ComparisonTable.jsx`
    - [x] Replace or add to the TAE row to show "Rentabilidad Inyección (TAE)".