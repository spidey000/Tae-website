# Track Specification: Further Financial Simplification

## 1. Overview
**Goal:** Continue simplifying the UI by removing remaining technical labels, cyberpunk-themed tags, and English placeholders.
**Context:** After the first round of simplifications, some secondary labels and placeholders still use technical or themed language (e.g., `[ PARAM_INPUT_01 ]`, `YEARS`, `Inyección Requerida`).

## 2. Functional Requirements

### 2.1 App.jsx Labels and Tags
- Rename `[ PARAM_INPUT_01 ]` to `[ DATOS DEL PRÉSTAMO ]`.
- Rename `[ BONIF_NODES_02 ]` to `[ BONIFICACIONES ]`.
- Rename `[ INITIAL_BURN_03 ]` to `[ GASTOS INICIALES ]`.
- Rename `Configuración de Crédito` to `Datos de tu Hipoteca`.
- Rename `Gastos de Constitución` to `Gastos al Firmar`.
- Rename `Ciclo de Vida (Años)` to `Plazo (Años)`.
- Rename `YEARS` (suffix) to `Años`.
- Rename `TIN Base (Nominal)` to `Interés Base (TIN)`.
- Rename `Impacto TIN` to `Bajada de Interés`.
- Rename `Inyección Requerida:` to `Total Gastos:`.

### 2.2 Component Placeholders
- In `AmortizationTable.jsx`: Rename `[ NO_DATA_STREAM ]` to `[ No hay datos ]`.
- In `AmortizationChart.jsx`: Rename `[ NO_VISUAL_DATA ]` to `[ No hay datos ]`.

## 3. Non-Functional Requirements
- Maintain the visual design (cyber-chamfer styles, etc.).
- Ensure consistency in terminology.

## 4. Out of Scope
- Changing logic or calculation formulas.
