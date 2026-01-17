# Implementation Plan - Financial Terminology Simplification

This plan outlines the steps to replace technical and cyberpunk-themed terminology with "dummy-friendly" financial concepts across the application.

## Phase 1: Amortization Table & Header Components
Focus on the primary data visualization and the application shell.

- [x] Task: Update `AmortizationTable.jsx` headers and title 2c65534
    - [x] Rename component title "Proyección Temporal" to "Tabla de Amortización" in `App.jsx`
    - [x] Rename table headers: `#_MONTH` -> `Mes`, `CUOTA_NET` -> `Cuota`, `INT_FLOW` -> `Intereses`, `AMORT_VAL` -> `Capital / Amortización`, `REMAINING` -> `Pendiente`
- [ ] Task: Update `App.jsx` header and layout text
    - [ ] Rename `MORTGAGE_CORE_v2.0` to `CALCULADORA HIPOTECARIA`
    - [ ] Rename `Financial_Infiltration_System` to `Simulador Avanzado`
    - [ ] Rename `SYSTEM_ONLINE` to `SISTEMA ONLINE`
    - [ ] Rename `ENCRYPTION_AES256` to `CONEXIÓN SEGURA`
- [x] Task: Update AmortizationTable tests 2c65534
    - [x] Update `src/components/__tests__/AmortizationTable.test.jsx` to match new header text
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Results Summary & Dashboard Components
Simplify the analysis dashboard and summary metrics.

- [ ] Task: Update `ResultsSummary.jsx` terminology
    - [ ] Rename `Flujo de Crédito vs Coste de Vida` to `Comparativa de Ahorro`
    - [ ] Rename `Carga de Vinculación` to `Coste de los Seguros`
    - [ ] Rename `DÉFICIT_NETO` -> `Pérdida Total`, `CRÉDITO_LIMPIO` -> `Ahorro Total`
    - [ ] Rename `Reserva de Capital (Gastos)` to `Gastos Iniciales (Notaría, etc.)`
    - [ ] Rename `Desembolso Mensual Real` to `Tu Cuota Mensual Real`
    - [ ] Update status messages: `INFILTRACIÓN_BANCARIA_ÉXITO` -> `AHORRO CONFIRMADO`, `SISTEMA_NO_RENTABLE` -> `SISTEMA NO RENTABLE`
    - [ ] Update glitch data-text attributes: `LINK_CORRUPTED` -> `NO COMPENSA`, `OPTIMAL_FLUX` -> `COMPENSA`
- [ ] Task: Update ResultsSummary tests
    - [ ] Update `src/components/__tests__/ResultsSummary.test.jsx` to match new labels
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Educational Content & Concepts
Refactor the glossary and math sections for maximum clarity.

- [ ] Task: Update `CoreConceptAnalysis.jsx`
    - [ ] Rename `[ CORE_CONCEPT_ANALYSIS ]` to `[ GUÍA RÁPIDA ]`
    - [ ] Rename `La Verdad sobre TIN vs TAE` to `¿Cuál es la diferencia entre TIN y TAE?`
- [ ] Task: Update `EducationalSection.jsx`
    - [ ] Rename `[ KNOWLEDGE_BASE_01 ]` to `[ GLOSARIO ]`
    - [ ] Rename `Glosario para Dummies` to `Diccionario Financiero Básico`
    - [ ] Rename `[ MATH_CORE_02 ]` to `[ MATEMÁTICAS ]`
    - [ ] Rename `Matemáticas Explicadas (Sin Dolor)` to `¿Cómo se calculan los números?`
    - [ ] Replace "Algoritmo llamado Newton-Raphson" with "Cálculo matemático complejo"
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
