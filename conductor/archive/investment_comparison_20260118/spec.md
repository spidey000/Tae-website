# Especificación: Comparador Inversión vs Amortización

## 1. Visión General
Permitir al usuario introducir una tasa de retorno de inversión (ROI) esperada para comparar si el capital destinado a amortizar generaría más beneficio invertido.

## 2. Cambios en Interfaz

### 2.1. ScenarioInputs
-   **Toggle:** "Comparar con Inversión" (Default: Off).
-   **Input:** "Retorno Anual Esperado (%)" (Visible solo si Toggle es On).
-   **Ubicación:** Debajo de la sección de "Estrategia de Reducción" o junto a los inputs de cantidad.

### 2.2. ComparisonTable
-   **Nueva Fila:** "Retorno Inversión vs Amortización".
-   **Lógica de Visualización:**
    -   Mostrar dos valores: Ganancia Inversión vs Ahorro Intereses.
    -   O mejor, mostrar el **Beneficio Neto** de la inversión respecto a la amortización.
    -   *Decisión de Diseño:* Mostrar "Ganancia Inversión" como métrica principal de esa fila, y en el Delta (diferencia) mostrar si es mayor o menor que el "Ahorro Intereses" de esa misma columna.
    -   Alternativa más clara:
        -   Fila existente: "Ahorro Intereses" (Beneficio de Amortizar).
        -   Nueva fila: "Beneficio Potencial Inversión" (Beneficio de Invertir).
        -   El usuario compara visualmente las dos filas.
        -   **Mejor aún:** Una fila de "Veredicto Financiero" o "Diferencia Neta".
            -   Valor: `(Ganancia Inversión - Ahorro Intereses)`.
            -   Positivo (Verde): Mejor Invertir.
            -   Negativo (Rojo): Mejor Amortizar.

## 3. Lógica de Cálculo
-   Para cada inyección realizada en el mes `m` de cantidad `C`:
    -   `MesesRestantes = TotalMeses - m`
    -   `Ganancia = C * (1 + TasaMensual)^MesesRestantes - C`
    -   `TotalGananciaInversion += Ganancia`
-   **Nota:** Se asume que la inversión se mantiene hasta el final del plazo *original* del préstamo (para ser justos en la comparación temporal), o hasta el final del préstamo amortizado?
    -   *Criterio:* Coste de Oportunidad. El dinero está invertido durante el tiempo que *de otro modo* estaría "ahorrándose intereses".
    -   Simplificación válida: Calcular el valor futuro al final del préstamo original.

## 4. Estructura de Datos
-   Actualizar objeto `scenario` en `AmortizationSimulatorTab`:
    -   `investMode`: boolean
    -   `investReturnRate`: number

## 5. Componentes Afectados
-   `src/components/Simulator/ScenarioInputs.jsx`
-   `src/components/Simulator/ComparisonTable.jsx`
-   `src/utils/amortizationEngine.js`
-   `src/components/AmortizationSimulatorTab.jsx`
