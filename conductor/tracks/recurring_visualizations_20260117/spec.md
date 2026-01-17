# Specification: Recurring Injection Visualizations & Dynamic Summaries

## Overview
Enhance the Amortization Simulator to provide deeper visual and numerical insights into the impact of recurring capital injections. This includes showing the evolution of monthly payments (as they decrease over time in "Reduce Installment" mode) and providing a comprehensive suite of charts.

## Functional Requirements
- **Dynamic Installment Summary:** 
    - In the `ComparisonSummary` card, if the strategy is "Reduce Installment", the monthly payment must be displayed as a range: `[Initial Payment] -> [Final Payment]`.
- **Comprehensive Visualizations:** Add a new section at the bottom of the simulator with the following charts:
    - **Amortization Path (Multi-Line Chart):** Compare the remaining balance over time for the Base scenario and both active scenarios.
    - **Payment Evolution (Area Chart):** Visualize how the monthly installment decreases over time for scenarios using the "Reduce Installment" strategy.
    - **Savings & Impact (Bar Chart):** Compare Total Savings and Total Injected across scenarios.
- **Data Integration:** 
    - Use the existing `calculateAmortizationWithInjection` engine data to populate all visualizations.
    - Ensure charts handle scenarios of different lengths (term reduction).

## Non-Functional Requirements
- **Performance:** Calculations and chart rendering should remain snappy on mobile devices.
- **Visual Consistency:** Use the established Cyberpunk/Glassmorphism theme (accent colors, fonts, and borders).

## Acceptance Criteria
- [ ] Summary shows "Initial -> Final" range for "Reduce Installment" strategy.
- [ ] Multi-line chart correctly plots all three schedules.
- [ ] Payment evolution chart clearly shows the "staircase" or slope effect of recurring injections.
- [ ] Bar chart correctly reflects the total capital injected vs. total interest saved.
- [ ] Edge cases (empty repetitions for "until end" and injections exceeding balance) are visually represented without errors.

## Out of Scope
- Comparison of more than two scenarios at once.
- Exporting chart data to PDF/CSV (reserved for future track).
