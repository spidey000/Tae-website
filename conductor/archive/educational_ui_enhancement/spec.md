# Educational UI Enhancement Spec

## 1. Overview
The goal is to improve user understanding of mortgage terms (TIN, TAE, Costs) by adding a dedicated educational section and contextual tooltips throughout the application. The design must adhere to the existing "Cyberpunk/Sci-Fi" aesthetic.

## 2. Features

### 2.1 TIN/TAE Explanation Card
A visually distinct card (likely using the `EducationalSection` or a new component) that explains:
- **TIN vs TAE:** Why TAE is the only important metric for comparison.
- **Impact of Costs:** How commissions, insurance, and other expenses affect the TAE.
- **Content:**
    > La Tasa Anual Equivalente o TAE es un indicador en forma de tanto por ciento anual que sirve para comparar el coste efectivo de dos o más préstamos en un plazo concreto, aunque tengan condiciones diferentes.
    >
    > **Cómo calcular la TAE en los préstamos**
    > La TAE se expresa en forma de porcentaje y se calcula con una fórmula matemática normalizada en base al tipo de interés nominal (TIN) -el precio que nos cobra el banco por prestarnos el dinero-; la frecuencia de las cuotas para devolver el préstamo (mensuales, trimestrales, anuales, etc.); las comisiones bancarias y los gastos de la operación que asume el consumidor.
    >
    > En el caso de los préstamos, la TAE incluye las comisiones que cobra el banco a excepción de los gastos derivados del incumplimiento de las obligaciones de pago del cliente. Para el cálculo de la TAE se excluyen otros gastos como los de notaría.
    >
    > En España es obligatorio que la Tasa Anual Equivalente figure en la documentación y publicidad de los productos financieros siempre que se haga referencia a algún aspecto económico del préstamo.

### 2.2 Contextual Tooltips (Info Buttons)
- **UI:** A small `<i>` or icon button (e.g., `Info` from `lucide-react`) placed next to labels.
- **Behavior:** Hovering or clicking shows a small popover/tooltip with a brief explanation.
- **Target Areas:**
    - **InputGroup:** Add an optional `infoText` prop.
    - **ResultsSummary:** Add info icons next to key metrics (Savings, Net Benefit, etc.).

## 3. Tech Stack
- React (Vite)
- Tailwind CSS (existing styling)
- Lucide React (icons)

## 4. Design Guidelines
- Use existing utility classes (`cyber-chamfer`, `text-accent`, `bg-black/40`).
- Tooltips should have a high z-index, contrasting background, and neon borders.
