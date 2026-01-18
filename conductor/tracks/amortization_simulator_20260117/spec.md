# Especificación: Tabla Comparativa de Escenarios

## 1. Visión General
Reemplazar el componente de tarjetas `ComparisonSummary` por una tabla densa (`ComparisonTable`) que permita comparar métricas financieras clave entre el Escenario Base y múltiples Escenarios Simulados horizontalmente.

## 2. Estructura de Datos

### 2.1. Filas (Métricas)
La tabla mostrará las siguientes métricas en filas:
1.  **Inyección Total:** Cantidad total aportada extra.
2.  **Intereses Totales:** Coste total del préstamo.
3.  **Ahorro Total:** Diferencia de intereses respecto a la base (solo relevante para escenarios).
4.  **Plazo Total:** Tiempo restante hasta finalizar.
5.  **Cuota Mensual:** Rango de cuota (Inicial -> Final).
6.  **ROI:** Retorno de la inversión (%).

### 2.2. Columnas (Escenarios)
-   **Columna 1:** Etiquetas de métricas (Sticky en móvil si es posible, o simplemente primera columna).
-   **Columna 2:** Escenario Base (Referencia, sin deltas).
-   **Columnas 3+:** Escenarios Simulados (1, 2, 3...).

## 3. Comportamiento y Lógica

### 3.1. Visualización de Deltas
Para cada escenario simulado, mostrar el valor absoluto y la diferencia (delta) respecto al Base:
-   *Ejemplo Intereses:* `45.000 € (-12.000 €)`
-   Colores semánticos:
    -   Verde: Mejor que la base (menos intereses, menos tiempo, mayor ROI).
    -   Rojo/Neutro: Peor o igual.

### 3.2. Rango de Cuotas
Dado que existen estrategias de "Reducción de Cuota":
-   Formato: `Min - Max` o `Inicio -> Fin`.
-   Si la cuota es constante: Mostrar un solo valor.

### 3.3. "Best Value" Highlight
El sistema calculará automáticamente cuál es el "ganador" en cada fila (entre todos los escenarios, incluido el base) y lo resaltará (ej. borde dorado, fondo sutil, o icono de trofeo).
-   *Criterios:*
    -   Intereses: Mínimo.
    -   Plazo: Mínimo.
    -   ROI: Máximo.
    -   Ahorro: Máximo.

## 4. Diseño y UX

### 4.1. Layout
-   **Contenedor:** Scroll horizontal (`overflow-x-auto`) para acomodar múltiples columnas.
-   **Densidad:** Alta. Padding reducido (`py-2` o `py-1` en móvil).
-   **Estilo:**
    -   Bordes sutiles.
    -   Fondo oscuro/transparente (`bg-black/20`).
    -   Tipografía monoespaciada para números (`tabular-nums`).

### 4.2. Responsive (Móvil)
-   Compresión máxima de texto (ej. "Int. Totales" en vez de "Intereses Totales" si es necesario, o reducir tamaño de fuente).
-   Scroll horizontal obligatorio.

## 5. Plan de Implementación Técnica
1.  Crear `src/components/Simulator/ComparisonTable.jsx`.
2.  Implementar función `findBestInRow(rowKey, values)`.
3.  Implementar renderizado de celdas con lógica de Deltas.
4.  Reemplazar la importación en `AmortizationSimulatorTab.jsx`.