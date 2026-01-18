# Specification: Advanced Visualizations & TAE Analysis

## 1. Overview
Enhance the Amortization Simulator with advanced financial visualizations and precise cost analysis. This includes adding new charts for interest accumulation and payment evolution, as well as calculating the real Internal Rate of Return (TAE) for each scenario.

## 2. Functional Requirements

### 2.1. Advanced Charting Section
- **Location:** A new dedicated section below the Comparison Table.
- **Charts included:**
    - **Cumulative Interest Chart:** A line chart showing the total interest accumulated over the life of the loan.
    - **Annual Interest Chart:** A bar chart showing interest paid per year.
    - **Monthly Quota Evolution:** A line/step chart showing the monthly payment amount over time.
- **Comparison Logic:** All charts must plot the "Base Scenario" alongside all active user scenarios for direct comparison.
- **X-Axis Strategy:** All charts will use the Base Scenario's original term as the fixed X-axis. Scenarios that finish early will have their values drop to 0 after the payoff month, visually highlighting the time savings.

### 2.2. TAE (IRR) Calculation
- **Logic:** Implement an Internal Rate of Return (IRR) algorithm to calculate the effective annual interest rate (TAE) for each scenario.
- **Input Cash Flows:**
    - Initial inflow: Principal amount.
    - Monthly outflows: Regular monthly payments.
    - Injection outflows: Extra amortizations at their specific months.
- **Integration:** 
    - Display the "Final Total TAE" as a new row in the `ComparisonTable`.
    - Include a "TAE Comparison" bar chart in the new visualization section.

### 2.3. Summary Table Updates
- Add a new row for **"Final Total TAE"**.
- This row should support the "Best Value" highlighting logic (lower TAE is better).

## 3. Technical Requirements
- **Calculations:** Extend `amortizationEngine.js` or create a new utility for IRR/TAE calculation.
- **Visualization:** Use the existing charting library (Recharts) ensuring consistency with the "Cyber/Neon" aesthetic.
- **Performance:** Ensure that calculating multiple IRR scenarios doesn't freeze the UI (use efficient iterative methods for IRR).

## 4. Acceptance Criteria
- [ ] Users can see a new section with 4 charts: Cumulative Interest, Annual Interest, Quota Evolution, and TAE Comparison.
- [ ] The `ComparisonTable` includes a "Final Total TAE" row with correct values.
- [ ] Charts correctly show scenarios ending early by dropping to zero.
- [ ] Deltas for TAE are calculated and displayed correctly in the table.
