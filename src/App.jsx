import React, { useState, useMemo } from 'react';
import { InputGroup } from './components/InputGroup';
import { Toggle } from './components/Toggle';
import { ResultsSummary } from './components/ResultsSummary';
import { AmortizationTable } from './components/AmortizationTable';
import { calculateMonthlyPayment, calculateTAE, generateAmortizationSchedule } from './utils/mortgageCalculations';
import { Calculator, Euro, Percent, FileText, Home, ShieldCheck, Briefcase } from 'lucide-react';

function App() {
  // --- State ---
  const [capital, setCapital] = useState(150000);
  const [years, setYears] = useState(25);
  const [baseTIN, setBaseTIN] = useState(2.99);

  const [initialExpenses, setInitialExpenses] = useState([
    { id: 'appraisal', name: 'Tasación', cost: 350, enabled: true },
    { id: 'opening', name: 'Comisión Apertura', cost: 500, enabled: false },
    { id: 'notary', name: 'Notaría', cost: 800, enabled: true },
    { id: 'registry', name: 'Registro', cost: 400, enabled: true },
    { id: 'tax', name: 'IAJD', cost: 1500, enabled: false },
  ]);

  const [linkedProducts, setLinkedProducts] = useState([
    { id: 'life', name: 'Seguro de Vida', cost: 25, bonus: 0.15, enabled: true },
    { id: 'home', name: 'Seguro de Hogar', cost: 15, bonus: 0.10, enabled: true },
    { id: 'payroll', name: 'Nómina', cost: 0, bonus: 0.50, enabled: true },
  ]);

  // --- Handlers ---
  const handleExpenseChange = (id, field, value) => {
    setInitialExpenses(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleProductChange = (id, field, value) => {
    setLinkedProducts(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // --- Calculations ---
  const {
    finalTIN,
    monthlyPayment,
    tae,
    schedule,
    totalCost,
    activeInitialExpenses,
    activeBonus
  } = useMemo(() => {
    const activeExpensesSum = initialExpenses
      .filter(e => e.enabled)
      .reduce((acc, curr) => acc + Number(curr.cost), 0);

    const activeProductsMonthlyCost = linkedProducts
      .filter(p => p.enabled)
      .reduce((acc, curr) => acc + Number(curr.cost), 0);

    const activeBonusTotal = linkedProducts
      .filter(p => p.enabled)
      .reduce((acc, curr) => acc + Number(curr.bonus), 0);

    // Apply TIN floor of 0%
    const calculatedTIN = Math.max(0, baseTIN - activeBonusTotal);
    
    // Net Capital received = Requested - Initial Expenses
    const netCapital = capital - activeExpensesSum;
    
    // Monthly Outflow for TAE = Mortgage Payment + Recurring Product Costs
    const payment = calculateMonthlyPayment(capital, calculatedTIN, years);
    const monthlyOutflow = payment + activeProductsMonthlyCost;

    const calculatedTAE = calculateTAE(netCapital, monthlyOutflow, years);
    const generatedSchedule = generateAmortizationSchedule(capital, calculatedTIN, years);

    const totalPaid = (monthlyOutflow * years * 12) + activeExpensesSum;

    // --- NON-BONIFIED SCENARIO (Comparison) ---
    // Assuming no products are taken, so TIN is baseTIN
    const nonBonifiedPayment = calculateMonthlyPayment(capital, baseTIN, years);
    const nonBonifiedTotalPaid = (nonBonifiedPayment * years * 12) + activeExpensesSum;
    // TAE for non-bonified: uses baseTIN payment, but still includes initial expenses (netCapital is same)
    const nonBonifiedTAE = calculateTAE(netCapital, nonBonifiedPayment, years); 
    
    // --- METRICS FOR DASHBOARD ---
    const totalInterestBonified = (payment * years * 12) - capital;
    const totalInterestNonBonified = (nonBonifiedPayment * years * 12) - capital;
    
    const interestSavings = totalInterestNonBonified - totalInterestBonified;
    const totalProductCost = activeProductsMonthlyCost * years * 12;
    const netBenefit = interestSavings - totalProductCost;

    return {
      finalTIN: calculatedTIN,
      monthlyPayment: payment,
      tae: calculatedTAE,
      schedule: generatedSchedule,
      totalCost: totalPaid,
      activeInitialExpenses: activeExpensesSum,
      activeProductsCost: activeProductsMonthlyCost,
      activeBonus: activeBonusTotal,
      // New Comparison Data
      nonBonifiedTAE,
      interestSavings,
      totalProductCost,
      netBenefit,
      nonBonifiedPayment,
      totalInterestBonified,
      totalInterestNonBonified
    };
  }, [capital, years, baseTIN, initialExpenses, linkedProducts]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Calculator className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight">Simulador Hipotecario Pro</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Inputs */}
          <section className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <FileText className="h-5 w-5" /> Datos del Préstamo
            </h2>
            <div className="space-y-4">
              <InputGroup 
                label="Capital Solicitado" 
                value={capital} 
                onChange={(v) => setCapital(Number(v))} 
                suffix="€" 
                min={1000} 
                step={1000}
              />
              <InputGroup 
                label="Plazo (Años)" 
                value={years} 
                onChange={(v) => setYears(Number(v))} 
                suffix="años" 
                min={1} 
                max={50} 
              />
              <InputGroup 
                label="TIN Base (sin bonificar)" 
                value={baseTIN} 
                onChange={(v) => setBaseTIN(Number(v))} 
                suffix="%" 
                step={0.01} 
              />
            </div>
          </section>

          {/* Linked Products (Bonifications) */}
          <section className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <ShieldCheck className="h-5 w-5" /> Bonificaciones
            </h2>
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-2 flex justify-between">
                <span>Bonificación Actual:</span>
                <span className="font-bold text-green-600">-{activeBonus.toFixed(2)}%</span>
              </div>
              {linkedProducts.map((product) => (
                <div key={product.id} className="p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{product.name}</span>
                    <Toggle enabled={product.enabled} onChange={(v) => handleProductChange(product.id, 'enabled', v)} />
                  </div>
                  {product.enabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <InputGroup 
                        label="Coste Mes" 
                        value={product.cost} 
                        onChange={(v) => handleProductChange(product.id, 'cost', Number(v))} 
                        suffix="€" 
                      />
                      <InputGroup 
                        label="Bonif. TIN" 
                        value={product.bonus} 
                        onChange={(v) => handleProductChange(product.id, 'bonus', Number(v))} 
                        suffix="%" 
                        step={0.01}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Initial Expenses */}
          <section className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <Briefcase className="h-5 w-5" /> Gastos Iniciales
            </h2>
            <div className="space-y-3">
              <div className="text-sm text-gray-500 mb-2 flex justify-between">
                <span>Total Gastos:</span>
                <span className="font-bold text-red-600">{activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              {initialExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <Toggle enabled={expense.enabled} onChange={(v) => handleExpenseChange(expense.id, 'enabled', v)} />
                    <span className={`text-sm ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{expense.name}</span>
                  </div>
                  {expense.enabled && (
                    <div className="w-24">
                      <input 
                        type="number" 
                        className="w-full text-right text-sm p-1 border rounded border-gray-300"
                        value={expense.cost}
                        onChange={(e) => handleExpenseChange(expense.id, 'cost', Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 space-y-6">
          <ResultsSummary 
            // Basic
            monthlyPayment={monthlyPayment} 
            finalTIN={finalTIN} 
            tae={tae} 
            totalCost={totalCost}
            // Comparison / Dashboard Data
            nonBonifiedTAE={nonBonifiedTAE}
            interestSavings={interestSavings}
            totalProductCost={totalProductCost}
            netBenefit={netBenefit}
            activeProductsMonthlyCost={activeProductsMonthlyCost}
            activeInitialExpenses={activeInitialExpenses}
            initialExpensesList={initialExpenses.filter(e => e.enabled)}
            capital={capital}
            totalInterestBonified={totalInterestBonified}
          />
          
          <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Cuadro de Amortización</h3>
            <AmortizationTable schedule={schedule} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;