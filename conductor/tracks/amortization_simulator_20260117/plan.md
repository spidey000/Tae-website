# Implementation Plan - Track: Amortization Simulator

## Phase 1: Architecture & Navigation [checkpoint: 1bbe155]
Establish the tabbed interface and isolate the existing calculator functionality.

- [x] Task: Create Tabbed Layout Structure 7216e78
    - [ ] Create `components/Tabs.jsx` (or similar) for navigation UI.
    - [ ] Refactor `App.jsx` to manage active tab state.
    - [ ] Move existing Calculator content into `components/MortgageCalculatorTab.jsx`.
    - [ ] Create placeholder `components/AmortizationSimulatorTab.jsx`.
    - [ ] **Test:** Verify tab switching renders correct components without losing state (if applicable) or crashing.
- [x] Task: Conductor - User Manual Verification 'Architecture & Navigation' (Protocol in workflow.md) 1bbe155

## Phase 2: Core Calculation Logic (The Engine) [checkpoint: 5c1e7d5]
Implement the mathematical logic for amortization with capital injections.

- [x] Task: Implement `calculateAmortizationWithInjection` 18a3dd5
    - [ ] Create/Update `utils/amortizationEngine.js` (or extend existing utils).
    - [ ] Implement logic for "Reduce Term" (keep installment, reduce N).
    - [ ] Implement logic for "Reduce Installment" (keep N, reduce installment).
    - [ ] Ensure calculation of "Total Interest", "Total Savings", and "ROI".
    - [ ] **Test:** Unit tests validating the math against known scenarios (e.g., the User's CSV examples).
- [x] Task: Implement Data Merging for Visualization 18a3dd5
    - [ ] Create utility to merge 3 schedules (Base, Scen A, Scen B) into a single array for Recharts `[{ month: 1, baseBalance: X, scenABalance: Y, ... }]`.
    - [ ] **Test:** Verify data alignment (e.g., Scenario A might end earlier than Base).
- [x] Task: Conductor - User Manual Verification 'Core Calculation Logic' (Protocol in workflow.md) 5c1e7d5

## Phase 3: Simulator UI - Inputs [checkpoint: edb58a2]
Build the input forms for the independent simulator tab.

- [x] Task: Build Base Loan Input Section 2335ed9
    - [ ] Create `components/Simulator/BaseLoanInputs.jsx`.
    - [ ] Reuse `InputGroup` where possible.
    - [ ] **Test:** Verify input state management.
- [x] Task: Build Scenario Input Section 2335ed9
    - [ ] Create `components/Simulator/ScenarioInputs.jsx`.
    - [ ] Implement fields: Amount, Timing (Month/Year), Name.
    - [ ] Implement Strategy Toggle (Reduce Term vs Installment).
    - [ ] **Test:** Verify toggle switches logic and inputs capture data correctly.
- [x] Task: Conductor - User Manual Verification 'Simulator UI - Inputs' (Protocol in workflow.md) edb58a2

## Phase 4: Visualization & Integration
Connect inputs to logic and render the comparative charts.

- [x] Task: Build Summary Cards
    - [ ] Create `components/Simulator/ComparisonSummary.jsx`.
    - [ ] Display Savings, Time Reduction, and ROI for Scen A & B.
    - [ ] **Test:** Verify formatting and conditional rendering (e.g., show "Time Saved" only if Term Reduced).
- [x] Task: Build Comparative Charts 750424b
    - [x] Create `components/Simulator/ComparisonCharts.jsx`.
    - [x] Implement Recharts Line Chart (Balance over time).
    - [x] Implement Interactive Tooltip (custom content showing 3 scenarios).
    - [x] Implement Bar Chart (Total Interest/Principal breakdown).
    - [x] **Test:** Verify chart renders with mock data.
- [x] Task: Integrate Simulator Tab 750424b
    - [x] Wire `AmortizationSimulatorTab.jsx` to use Inputs, Engine, and Results.
    - [x] Implement Real-time recalculation (or "Calculate" button).
    - [x] **Test:** Full flow - Input Data -> Charts Update.
- [ ] Task: Conductor - User Manual Verification 'Visualization & Integration' (Protocol in workflow.md)

## Phase 5: Polish & Edge Cases
Refinement and responsive design.

- [ ] Task: UI/UX Polish
    - [ ] Ensure mobile responsiveness (stacking charts/inputs).
    - [ ] Add "Break-even" text/markers if feasible.
    - [ ] Add Help Tooltips explaining "Reduce Term" vs "Reduce Installment".
- [ ] Task: Final Code Quality Check
    - [ ] Run Linting/Formatting.
    - [ ] Ensure 80% Coverage on new utils.
- [ ] Task: Conductor - User Manual Verification 'Polish & Edge Cases' (Protocol in workflow.md)
