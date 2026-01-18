# Calculadora Hipotecaria (Mortgage Calculator)

A comprehensive, React-based financial tool designed to help users estimate mortgage payments, understand the true cost of loans (TAE vs TIN), and simulate various amortization strategies. Built with a modern Cyberpunk/Neon aesthetic.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tae-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`.

## 📖 User Guide

The application consists of two main modules accessible via tabs:

### 1. Calculadora Hipoteca (Mortgage Calculator)

This module helps you understand your monthly mortgage payments and the impact of banking bonuses and initial expenses.

#### **Input Sections**

*   **[ DATOS DEL PRÉSTAMO ]**
    *   **Capital:** The amount of money you are requesting from the bank.
    *   **Plazo (Años):** The duration of the loan. Longer terms mean lower monthly payments but more total interest paid.
    *   **Interés Base (TIN):** The starting interest rate offered by the bank *before* any discounts.

*   **[ BONIFICACIONES ]**
    *   Toggle various "linked products" (e.g., Home Insurance, Payroll/Nómina).
    *   **Impact:** Enabling these often reduces your interest rate (Bonus) but adds a monthly cost.
    *   **Goal:** Use the "Beneficio Neto" metric to see if the interest savings outweigh the cost of the products.

*   **[ GASTOS INICIALES ]**
    *   Toggle expenses like Appraisal (Tasación), Notary, or Registry.
    *   These one-off costs are used to calculate the **TAE** (Annual Percentage Rate), which represents the *true* cost of the loan.

#### **Results & Visualization**
*   **Results Summary:** Real-time updates of your Monthly Payment, TAE, and Total Cost.
*   **Comparison:** See a direct comparison between the "Bonified" scenario (with products) and the "Standard" scenario.
*   **Amortization Schedule:** Switch between a **Table** view (detailed list of payments) and a **Chart** view (visualizing interest vs. capital) using the toggle buttons.

### 2. Simulador Amortización (Amortization Simulator)

This module allows you to project the future of your loan and compare different strategies for paying it off early.

#### **Setting Up**
1.  **Base Loan Data:** Enter your *current* outstanding principal, remaining years, and interest rate.
2.  **Scenarios:** You can create up to 4 different scenarios to compare against your base loan.

#### **Creating a Scenario**
*   **Strategy:** Choose between:
    *   **Reducir Plazo (Reduce Term):** Keeps your monthly payment the same but shortens the loan duration. *Usually saves the most interest.*
    *   **Reducir Cuota (Reduce Installment):** Lowers your monthly payment but keeps the original end date.
*   **Injection (Aportación):**
    *   **Amount:** How much extra money you want to pay.
    *   **Frequency:** Choose "Once" (Puntual) for a lump sum or configure recurring payments.

#### **Analyzing Results**
*   **Comparison Table:** View side-by-side metrics:
    *   **Total Savings:** How much interest you save in each scenario.
    *   **Time Saved:** How many months/years you shave off the mortgage.
*   **Charts:** Comprehensive visualization suite:
    *   **Balance Path:** Multi-line chart comparing the outstanding debt over time for all scenarios.
    *   **Payment Evolution:** Visualization of how the monthly quota decreases in "Reduce Installment" scenarios.
    *   **Savings Analysis:** Bar chart comparing total capital injected vs. interest saved.

## 🛠️ Technical Stack

*   **Framework:** React 18 + Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Persistence:** LocalStorage is used to save your inputs between sessions.

## 📂 Project Structure

*   `src/components/`: UI Components broken down by feature.
    *   `MortgageCalculatorTab.jsx`: Main logic for the calculator.
    *   `AmortizationSimulatorTab.jsx`: Main logic for the simulator.
*   `src/utils/`: Financial calculation engines.
    *   `mortgageCalculations.js`: Standard annuity formulas (French method).
    *   `amortizationEngine.js`: Logic for handling extra payments and changing schedules.

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.