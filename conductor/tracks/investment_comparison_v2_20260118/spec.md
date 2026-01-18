# Specification: Advanced Investment Comparison

## 1. Overview
Enhance the existing investment comparison logic to include user-selectable compounding frequencies and tax-adjusted returns, providing a more realistic "Invest vs. Amortize" analysis.

## 2. Functional Requirements
### 2.1 User Interface (ScenarioInputs)
- **Compounding Frequency Selector:** Add a dropdown or toggle group to select between "Anual" and "Mensual" compounding for the investment.
- **Investment Return Field:** Maintain the ROI input field (percentage).
- **Informative Tooltips:** Add `<i>` icon tooltips (mouseover) to explain:
    - "Retorno Anual Esperado" (Expected Annual Return)
    - "Frecuencia Compuesta" (Compound Frequency)
    - "Impuestos" (Fixed 19% tax rate explanation)

### 2.2 Calculation Logic (Amortization Engine)
- **FV Calculation:** Update the Future Value calculation to support both monthly and annual compounding.
- **Tax Logic:** Apply a fixed 19% tax (non-editable) to the investment gains to calculate the Net Return.
- **Timeframe:** Calculate the growth of each capital injection from the month of injection until the end of the *original* mortgage term.

### 2.3 Results (ComparisonTable)
- **New Metrics (Rows):**
  1. **Retorno Inversión (Bruto):** Total gain before taxes.
  2. **Retorno Inversión (Neto):** Total gain after 19% tax.
  3. **Delta vs Amortización:** Difference between Net Investment Return and Interest Saved.
- **Highlighting Logic:** The "Best Value" highlight (Trophy icon/Accent color) should apply to the row that maximizes net financial gain (comparing "Ahorro Intereses" with "Retorno Inversión (Neto)").

## 3. Non-Functional Requirements
- **Transparency:** Clear mouseover tooltips explaining calculations.
- **Precision:** Use double-precision arithmetic for all financial growth calculations.

## 4. Acceptance Criteria
- [ ] Users can toggle investment comparison per scenario.
- [ ] Users can switch between monthly and annual compounding.
- [ ] The table shows both gross and net returns.
- [ ] The table correctly identifies and highlights the most profitable strategy (Amortize vs Invest).
- [ ] Tooltips are present and informative for all new financial concepts.
