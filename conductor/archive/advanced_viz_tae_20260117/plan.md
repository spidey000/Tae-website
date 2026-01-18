# Implementation Plan: Advanced Visualizations & TAE Analysis

## Phase 1: Engine & Logic (TAE/IRR) [checkpoint: 0a8815a]
- [x] Task: Implement IRR (Internal Rate of Return) utility 6df32f1
    - [ ] Create `src/utils/financialCalculations.js` with an iterative IRR function (Newton-Raphson or Secant method).
    - [ ] Create `src/utils/__tests__/financialCalculations.test.js` with test cases for standard loans and loans with extra injections.
- [x] Task: Integrate TAE calculation into the Amortization Engine 8573727
    - [ ] Update `src/utils/amortizationEngine.js` to collect cash flow arrays (month, amount) for each simulation.
    - [ ] Call the IRR utility at the end of `calculateAmortizationWithInjection` to return the `tae`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Engine & Logic' (Protocol in workflow.md)

## Phase 2: UI Components (Table & Layout)
- [x] Task: Update `ComparisonTable.jsx` 0306efd
    - [ ] Add the "Final Total TAE" row definition.
    - [ ] Configure it as `bestCriteria: 'min'` and `inverseDelta: true`.
    - [ ] Ensure formatting handles percentage display correctly.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Components' (Protocol in workflow.md)

## Phase 3: (Phase Canceled - Visualizations removed)
- [ ] Task: (Canceled)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Detailed Charts' (Protocol in workflow.md)

## Phase 4: Refinement & Validation
- [ ] Task: Responsive & Aesthetic Check
    - [ ] Ensure the new grid of charts scales well on mobile (stacking vs grid).
    - [ ] Verify Neon/Cyber styling consistency (colors, grid lines, tooltips).
- [ ] Task: Final Verification
    - [ ] Compare TAE results with standard financial calculators to ensure accuracy.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Refinement & Validation' (Protocol in workflow.md)
