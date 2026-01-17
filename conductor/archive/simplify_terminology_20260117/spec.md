# Track Specification: Financial Terminology Simplification

## 1. Overview
**Goal:** simplify the terminology used throughout the mortgage calculator application, replacing complex technical jargon and "Cyberpunk" themed text with clear, "dummy-friendly" financial language.
**Context:** The current application uses technical acronyms (e.g., `CUOTA_NET`, `INT_FLOW`) and a stylized "Cyberpunk" tone (e.g., `INFILTRACIÓN_BANCARIA_ÉXITO`) which may confuse non-expert users. The goal is to make the application accessible and easy to understand for everyone.

## 2. Functional Requirements

### 2.1 Amortization Table Headers
- Rename `PROYECCIÓN TEMPORAL` to `TABLA DE AMORTIZACIÓN`.
- Rename `CUOTA_NET` to `Cuota`.
- Rename `INT_FLOW` to `Intereses`.
- Rename `AMORT_VAL` to `Capital`.
- Rename `#_MONTH` to `Mes`.
- Rename `REMAINING` to `Pendiente`.

### 2.2 Results Summary Component
- Rename `Flujo de Crédito vs Coste de Vida` to `Comparativa de Ahorro`.
- Rename `Carga de Vinculación` to `Coste de los Seguros`.
- Rename `DÉFICIT_NETO` to `Pérdida Total`.
- Rename `CRÉDITO_LIMPIO` to `Ahorro Total`.
- Rename `Reserva de Capital (Gastos)` to `Gastos Iniciales (Notaría, etc.)`.
- Rename `Desembolso Mensual Real` to `Tu Cuota Mensual Real`.
- Rename `INFILTRACIÓN_BANCARIA_ÉXITO` to `AHORRO CONFIRMADO`.
- Rename `SISTEMA_NO_RENTABLE` to `NO RENTABLE`.
- Rename `LINK_CORRUPTED` to `NO COMPENSA`.
- Rename `OPTIMAL_FLUX` to `COMPENSA`.
- Rename `BONIFICACIÓN_RECHAZADA` to `BONIFICACIÓN NO RENTABLE`.

### 2.3 Main Header & Application Shell
- Rename `MORTGAGE_CORE_v2.0` to `CALCULADORA HIPOTECARIA`.
- Rename `Financial_Infiltration_System` to `Simulador Avanzado`.
- Rename `SYSTEM_ONLINE` to `ONLINE`.
- Rename `ENCRYPTION_AES256` to `SEGURO`.

### 2.4 Educational Sections
- Rename `[ CORE_CONCEPT_ANALYSIS ]` to `[ GUÍA RÁPIDA ]`.
- Rename `La Verdad sobre TIN vs TAE` to `¿Cuál es la diferencia entre TIN y TAE?`.
- Rename `[ KNOWLEDGE_BASE_01 ]` to `[ GLOSARIO ]`.
- Rename `Glosario para Dummies` to `Diccionario Financiero Básico`.
- Rename `[ MATH_CORE_02 ]` to `[ MATEMÁTICAS ]`.
- Rename `Matemáticas Explicadas (Sin Dolor)` to `¿Cómo se calculan los números?`.
- Simplify references to complex algorithms (e.g., replace `Algoritmo llamado Newton-Raphson` with `Cálculo matemático complejo`).

## 3. Non-Functional Requirements
- **Consistency:** Ensure the new terminology is used consistently across all components.
- **Tone:** The tone should remain professional but accessible, avoiding overly casual slang while eschewing rigid academic formalism.
- **Testing:** Verify that text changes do not break layout or design constraints.

## 4. Out of Scope
- Functional changes to the calculation logic itself.
- Visual redesign of components (colors, layout) beyond text updates.
