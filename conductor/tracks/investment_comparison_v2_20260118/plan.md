# Implementation Plan: Advanced Investment Comparison

## Phase 1: Logic & Core Engine (TDD)
- [ ] Task: Update `AmortizationEngine` with advanced investment calculation logic.
    - [ ] Sub-task: Create failing tests for `calculateAmortizationWithInjection` covering:
        - [ ] Annual vs. Monthly compounding frequencies.
        - [ ] Gross vs. Net (19% tax) return calculations.
        - [ ] Scenarios where investment beats amortization and vice-versa.
    - [ ] Sub-task: Implement `compoundFrequency` parameter (options: 'monthly', 'annual') in `calculateAmortizationWithInjection`.
    - [ ] Sub-task: Implement `investmentTaxRate` constant (0.19) and calculation logic.
    - [ ] Sub-task: Ensure double-precision for all internal math (avoid floating point drift).
    - [ ] Sub-task: Verify all tests pass.
- [ ] Task: Conductor - User Manual Verification 'Logic & Core Engine (TDD)' (Protocol in workflow.md)

## Phase 2: UI Components & Integration
- [ ] Task: Update `ScenarioInputs` component.
    - [ ] Sub-task: Add "Frecuencia Compuesta" selector (Anual/Mensual) visible when "Comparar Inversión" is active.
    - [ ] Sub-task: Add mouseover `<i>` tooltips for "Retorno Anual Esperado", "Frecuencia", and the fixed 19% tax rate using the `Tooltip` component.
    - [ ] Sub-task: Wire up new state fields (`investCompounding`) to the component.
- [ ] Task: Update `ComparisonTable` component.
    - [ ] Sub-task: Add rows for "Retorno Inversión (Bruto)" and "Retorno Inversión (Neto)".
    - [ ] Sub-task: Update "Delta" logic to compare "Net Return" vs "Interest Saved".
    - [ ] Sub-task: Implement "Best Value" highlight logic to check Net Return against Interest Savings.
    - [ ] Sub-task: Add `<i>` tooltips to table headers explaining "Neto" (after tax).
- [ ] Task: Conductor - User Manual Verification 'UI Components & Integration' (Protocol in workflow.md)

## Phase 3: Final Verification & Polish
- [ ] Task: End-to-End Manual Verification.
    - [ ] Sub-task: Verify default state (Investment toggle OFF).
    - [ ] Sub-task: Verify complex scenario (e.g., Monthly Injection, Monthly Compounding, 5% Return).
    - [ ] Sub-task: Check mobile responsiveness of the new table rows and input fields.
    - [ ] Sub-task: Verify tooltip content and behavior on both desktop and mobile.
- [ ] Task: Conductor - User Manual Verification 'Final Verification & Polish' (Protocol in workflow.md)
