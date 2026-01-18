# Plan de Implementación: Comparador Inversión

## Pasos

1.  **Actualizar `ScenarioInputs.jsx`**
    -   Importar `Toggle` (si existe, o usar checkbox estilizado). *Nota: Check components folder.*
    -   Añadir estado local o props para `investMode` y `investReturnRate`.
    -   Renderizar sección condicional.

2.  **Actualizar `AmortizationSimulatorTab.jsx`**
    -   Añadir campos por defecto en `scenarios` state: `{ investMode: false, investReturnRate: 4.0 }`.
    -   Pasar nuevos campos a `calculateAmortizationWithInjection`.

3.  **Actualizar `amortizationEngine.js`**
    -   Modificar `calculateAmortizationWithInjection`.
    -   Calcular `investmentProfit` acumulado.
    -   Devolver `investmentProfit` en el objeto de resultado.

4.  **Actualizar `ComparisonTable.jsx`**
    -   Añadir fila "Beneficio Inversión" (solo si `investMode` es true en algún escenario).
    -   Añadir fila "Diferencia (Inv - Amort)" para veredicto claro.

5.  **Verificación**
    -   Probar con casos simples (ej. 10.000€ al 5% vs Hipoteca al 3% -> Debería salir mejor invertir).
