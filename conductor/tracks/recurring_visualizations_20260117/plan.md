# Plan: Recurring Injection Visualizations & Dynamic Summaries

## Phase 1: Engine & Data Preparation
- [ ] Task: Verify Amortization Engine Export
    - [ ] Sub-task: Ensure `calculateAmortizationWithInjection` exports sufficient data (payment history, interest accumulated per month) for the new charts.
    - [ ] Sub-task: Add unit tests to verify the `schedule` array contains correct changing payment values for "reduceInstallment" strategy.
- [ ] Task: Conductor - User Manual Verification 'Engine & Data Preparation' (Protocol in workflow.md)

## Phase 2: Dynamic Summary Updates
- [ ] Task: Update ComparisonSummary Component
    - [ ] Sub-task: Update `MetricCard` or `renderScenarioMetrics` to handle payment ranges (Start -> End) when strategy is "reduceInstallment".
    - [ ] Sub-task: Add logic to detect if `initialMonthlyPayment` differs significantly from `finalMonthlyPayment`.
    - [ ] Sub-task: Unit tests for `ComparisonSummary` verifying the range display.
- [ ] Task: Conductor - User Manual Verification 'Dynamic Summary Updates' (Protocol in workflow.md)

## Phase 3: Chart Implementation
- [ ] Task: Create Chart Container & Tabs
    - [ ] Sub-task: Implement a new `AmortizationCharts` container component at the bottom of the simulator.
    - [ ] Sub-task: Add tabs/toggles for "Balance Path", "Payment Evolution", and "Savings Analysis".
- [ ] Task: Implement Multi-Line Balance Chart
    - [ ] Sub-task: Use Recharts `LineChart` to plot `balance` for Base, Scenario A, and Scenario B over time.
    - [ ] Sub-task: Handle different series lengths (scenarios ending earlier).
- [ ] Task: Implement Payment Evolution Area Chart
    - [ ] Sub-task: Use Recharts `AreaChart` to show `payment` value over time.
    - [ ] Sub-task: Verify visual distinction between constant payment (Base/ReduceTerm) and decreasing payment (ReduceInstallment).
- [ ] Task: Implement Savings Bar Chart
    - [ ] Sub-task: Use Recharts `BarChart` to compare Total Injected vs Total Interest Saved.
- [ ] Task: Conductor - User Manual Verification 'Chart Implementation' (Protocol in workflow.md)

## Phase 4: Integration & Polish
- [ ] Task: Integrate Charts into Simulator Tab
    - [ ] Sub-task: Import and place `AmortizationCharts` in `AmortizationSimulatorTab.jsx`.
    - [ ] Sub-task: Pass `results` data to the charts.
- [ ] Task: Verify Edge Cases
    - [ ] Sub-task: Manual verify with "0 repetitions" (infinite).
    - [ ] Sub-task: Manual verify with "Injection > Balance".
- [ ] Task: Conductor - User Manual Verification 'Integration & Polish' (Protocol in workflow.md)
