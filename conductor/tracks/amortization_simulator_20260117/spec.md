# Specification: Simulador de Impacto de Amortización Anticipada

## 1. Overview
A new dedicated "Tab" within the application allowing users to simulate and visualize the financial impact of making extra mortgage payments (capital injections). The core goal is to educate users on the exponential savings of early amortization and the "Term vs. Installment" reduction trade-off.

The module enables a 3-way comparison:
1.  **Base Scenario:** The original loan without extra payments.
2.  **Scenario A:** Custom amortization (Amount + Timing + Strategy).
3.  **Scenario B:** A second custom amortization for comparison (e.g., investing the same amount at a later date).

## 2. Functional Requirements

### 2.1. Navigation & Architecture
*   **Global Navigation:** The application will transition to a Tabbed interface.
    *   **Tab 1: Calculadora Hipoteca:** The existing functionality (TAE, Bonifications).
    *   **Tab 2: Simulador Amortización:** The new feature.
*   **Independent Context:** The "Simulador Amortización" tab is standalone. It **does not** share state with Tab 1. Users must input their base loan details specifically for this simulation.

### 2.2. Inputs (Panel de Control)
The input section is divided into "Base Loan" and "Simulation Scenarios".

**A. Base Loan Details (Required)**
*   Principal Amount (€)
*   Annual Interest Rate (%)
*   Total Term (Years)
*   Start Date (Month/Year) - *Defaults to current date if unspecified*

**B. Scenario Inputs (A & B)**
Two independent forms for Scenario A and Scenario B. Each includes:
*   **Scenario Name:** (e.g., "Invertir Hoy" vs "Esperar 5 años") - *Optional, with defaults*.
*   **Extra Payment Amount (€):** The capital to inject.
*   **Timing:** When the payment is made (e.g., Month 12, Year 5).
*   **Reduction Strategy (Toggle):**
    *   **Reduce Term (Plazo):** Maintain monthly payment, finish loan earlier. (Flagged as "Recommended").
    *   **Reduce Installment (Cuota):** Maintain end date, lower monthly payment.

### 2.3. Calculation Logic
*   **Engine:** Generate three independent amortization schedules (Base, Scen A, Scen B).
*   **Injection Logic:** For Scenarios A/B, at the specified `Timing` month:
    *   `New_Principal = Current_Principal - Extra_Payment`.
    *   **If Reduce Term:** Recalculate the number of remaining months keeping the installment constant (or as close as possible).
    *   **If Reduce Installment:** Recalculate the monthly installment keeping the remaining months constant.
*   **Outputs:**
    *   Total Interest Paid.
    *   Total Duration (Years/Months).
    *   Total Savings (Base Interest - Scenario Interest).
    *   ROI (Return on Investment) %: `(Total Savings / Extra Payment Amount) * 100`.

### 2.4. Visualization & Results
*   **Summary Cards:** Display Key Metrics for Base, Scen A, and Scen B side-by-side.
    *   Total Saved (€).
    *   Time Saved (e.g., "3 years, 2 months").
    *   ROI %.
*   **Primary Chart (Line):** "Remaining Balance over Time".
    *   Three lines: Base (Gray), Scenario A (Color 1), Scenario B (Color 2).
    *   Visual "Drop" in lines A/B at the moment of injection.
    *   **Interactive Tooltip:** Hovering shows Balance, Interest Paid, and Principal Paid for all 3 scenarios at that month.
*   **Secondary Chart (Bar):** "Total Cost Comparison".
    *   Three bars showing Total Principal + Total Interest.
*   **Break-even Marker:** Visual indicator on the charts or text highlighting when the savings exceed the investment cost.

## 3. Non-Functional Requirements
*   **Performance:** Recalculation of 3 schedules must be near-instant (< 200ms) on mobile.
*   **Responsiveness:** Inputs and Charts must stack gracefully on mobile screens.
*   **Tech Stack:** Use `recharts` for visualization, matching the project's library choices.

## 4. Out of Scope
*   Recurring extra payments (e.g., "pay €100 extra every month"). This is for *one-off* injections only.
*   Inflation adjustments.
*   Tax implications (deductions).
