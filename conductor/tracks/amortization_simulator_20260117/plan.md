# Implementation Plan - Track: Amortization Simulator

## Phase 1: Architecture & Navigation
Establish the tabbed interface and isolate the existing calculator functionality.

- [x] Task: Create Tabbed Layout Structure 7216e78
    - [ ] Create `components/Tabs.jsx` (or similar) for navigation UI.
    - [ ] Refactor `App.jsx` to manage active tab state.
    - [ ] Move existing Calculator content into `components/MortgageCalculatorTab.jsx`.
    - [ ] Create placeholder `components/AmortizationSimulatorTab.jsx`.
    - [ ] **Test:** Verify tab switching renders correct components without losing state (if applicable) or crashing.
- [ ] Task: Conductor - User Manual Verification 'Architecture & Navigation' (Protocol in workflow.md)

## Phase 2: Core Calculation Logic (The Engine)
Implement the mathematical logic for amortization with capital injections.

- [ ] Task: Implement `calculateAmortizationWithInjection`
    - [ ] Create/Update `utils/amortizationEngine.js` (or extend existing utils).
    - [ ] Implement logic for "Reduce Term" (keep installment, reduce N).
    - [ ] Implement logic for "Reduce Installment" (keep N, reduce installment).
    - [ ] Ensure calculation of "Total Interest", "Total Savings", and "ROI".
    - [ ] **Test:** Unit tests validating the math against known scenarios (e.g., the User's CSV examples).
- [ ] Task: Implement Data Merging for Visualization
    - [ ] Create utility to merge 3 schedules (Base, Scen A, Scen B) into a single array for Recharts `[{ month: 1, baseBalance: X, scenABalance: Y, ... }]`.
    - [ ] **Test:** Verify data alignment (e.g., Scenario A might end earlier than Base).
- [ ] Task: Conductor - User Manual Verification 'Core Calculation Logic' (Protocol in workflow.md)

## Phase 3: Simulator UI - Inputs
Build the input forms for the independent simulator tab.

- [ ] Task: Build Base Loan Input Section
    - [ ] Create `components/Simulator/BaseLoanInputs.jsx`.
    - [ ] Reuse `InputGroup` where possible.
    - [ ] **Test:** Verify input state management.
- [ ] Task: Build Scenario Input Section
    - [ ] Create `components/Simulator/ScenarioInputs.jsx`.
    - [ ] Implement fields: Amount, Timing (Month/Year), Name.
    - [ ] Implement Strategy Toggle (Reduce Term vs Installment).
    - [ ] **Test:** Verify toggle switches logic and inputs capture data correctly.
- [ ] Task: Conductor - User Manual Verification 'Simulator UI - Inputs' (Protocol in workflow.md)

## Phase 4: Visualization & Integration
Connect inputs to logic and render the comparative charts.

- [ ] Task: Build Summary Cards
    - [ ] Create `components/Simulator/ComparisonSummary.jsx`.
    - [ ] Display Savings, Time Reduction, and ROI for Scen A & B.
    - [ ] **Test:** Verify formatting and conditional rendering (e.g., show "Time Saved" only if Term Reduced).
- [ ] Task: Build Comparative Charts
    - [ ] Create `components/Simulator/ComparisonCharts.jsx`.
    - [ ] Implement Recharts Line Chart (Balance over time).
    - [ ] Implement Interactive Tooltip (custom content showing 3 scenarios).
    - [ ] Implement Bar Chart (Total Interest/Principal breakdown).
    - [ ] **Test:** Verify chart renders with mock data.
- [ ] Task: Integrate Simulator Tab
    - [ ] Wire `AmortizationSimulatorTab.jsx` to use Inputs, Engine, and Results.
    - [ ] Implement Real-time recalculation (or "Calculate" button).
    - [ ] **Test:** Full flow - Input Data -> Charts Update.
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
