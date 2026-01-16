import React, { useState, useMemo } from 'react';
import { InputGroup } from './components/InputGroup';
import { Toggle } from './components/Toggle';
import { ResultsSummary } from './components/ResultsSummary';
import { AmortizationTable } from './components/AmortizationTable';
import { calculateMonthlyPayment, calculateTAE, generateAmortizationSchedule } from './utils/mortgageCalculations';
import { Calculator, FileText, ShieldCheck, Briefcase } from 'lucide-react';

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
    monthlyPayment,
    tae,
    schedule,
    totalCost,
    activeInitialExpenses,
    activeBonus,
    nonBonifiedTAE,
    interestSavings,
    totalProductCost,
    netBenefit,
    activeProductsMonthlyCost,
    totalInterestBonified
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
    // TAE for non-bonified: uses baseTIN payment, but still includes initial expenses (netCapital is same)
    const nonBonifiedTAE = calculateTAE(netCapital, nonBonifiedPayment, years); 
    
    // --- METRICS FOR DASHBOARD ---
    const totalInterestBonified = (payment * years * 12) - capital;
    const totalInterestNonBonified = (nonBonifiedPayment * years * 12) - capital;
    
    const interestSavings = totalInterestNonBonified - totalInterestBonified;
    const totalProductCost = activeProductsMonthlyCost * years * 12;
    const netBenefit = interestSavings - totalProductCost;

    return {
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
      totalInterestNonBonified,
      activeProductsMonthlyCost
    };
  }, [capital, years, baseTIN, initialExpenses, linkedProducts]);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono pb-20 selection:bg-accent selection:text-black overflow-x-hidden">
      
      {/* HEADER: NEON HUD BAR */}
      <header className="border-b border-accent/30 bg-black/60 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-accent shadow-neon">
              <Calculator className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-[0.2em] uppercase cyber-glitch" data-text="MORTGAGE_CORE_v2.0">
                MORTGAGE_CORE_v2.0
              </h1>
              <p className="text-[10px] text-accent/50 font-bold uppercase tracking-widest">Financial_Infiltration_System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> SYSTEM_ONLINE</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-secondary rounded-full" /> ENCRYPTION_AES256</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Data Input Terminals */}
        <div className="lg:col-span-4 space-y-12 pt-4">
          
          {/* Main Inputs Terminal */}
          <section className="relative group">
            <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent uppercase tracking-widest z-10">
              [ PARAM_INPUT_01 ]
            </div>
            <div className="relative p-6 pt-8">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-tertiary uppercase tracking-widest">
                <FileText className="h-4 w-4" /> Configuración de Crédito
              </h2>
              <div className="space-y-5">
                <InputGroup 
                  label="Capital del Préstamo" 
                  value={capital} 
                  onChange={(v) => setCapital(Number(v))} 
                  suffix="EUR" 
                  min={1000} 
                  step={1000}
                />
                <InputGroup 
                  label="Ciclo de Vida (Años)" 
                  value={years} 
                  onChange={(v) => setYears(Number(v))} 
                  suffix="YEARS" 
                  min={1} 
                  max={50} 
                />
                <InputGroup 
                  label="TIN Base (Nominal)" 
                  value={baseTIN} 
                  onChange={(v) => setBaseTIN(Number(v))} 
                  suffix="%" 
                  step={0.01} 
                />
              </div>
            </div>
          </section>

          {/* Linked Products: Bonification Nodes */}
          <section className="relative group">
            <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-secondary uppercase tracking-widest z-10">
              [ BONIF_NODES_02 ]
            </div>
            <div className="relative p-6 pt-8">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-secondary uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" /> Bonificaciones Activas
              </h2>
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-gray-500 mb-2 flex justify-between uppercase tracking-widest border-b border-border/30 pb-2">
                  <span>Reducción de TIN Total:</span>
                  <span className="text-accent">-{activeBonus.toFixed(2)}%</span>
                </div>
                {linkedProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-black/20 border border-border/50 hover:border-accent-secondary/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-xs uppercase tracking-widest text-gray-300">{product.name}</span>
                      <Toggle enabled={product.enabled} onChange={(v) => handleProductChange(product.id, 'enabled', v)} />
                    </div>
                    {product.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup 
                          label="Coste/Mes" 
                          value={product.cost} 
                          onChange={(v) => handleProductChange(product.id, 'cost', Number(v))} 
                          suffix="€" 
                        />
                        <InputGroup 
                          label="Impacto TIN" 
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
            </div>
          </section>

          {/* Initial Expenses: Initial Burn */}
          <section className="relative group">
            <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-tertiary uppercase tracking-widest z-10">
              [ INITIAL_BURN_03 ]
            </div>
            <div className="relative p-6 pt-8">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-tertiary uppercase tracking-widest">
                <Briefcase className="h-4 w-4" /> Gastos de Constitución
              </h2>
              <div className="space-y-4">
                {initialExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 group/row">
                    <div className="flex items-center gap-3">
                      <Toggle enabled={expense.enabled} onChange={(v) => handleExpenseChange(expense.id, 'enabled', v)} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${expense.enabled ? 'text-gray-200' : 'text-gray-600'}`}>{expense.name}</span>
                    </div>
                    {expense.enabled && (
                      <div className="w-24">
                        <input 
                          type="number" 
                          className="w-full bg-transparent text-right text-xs font-mono text-accent outline-none"
                          value={expense.cost}
                          onChange={(e) => handleExpenseChange(expense.id, 'cost', Number(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center border-t border-border">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inyección Requerida:</span>
                  <span className="text-sm font-bold text-red-500">{activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: HUD & Data Stream */}
        <div className="lg:col-span-8 space-y-10">
          <ResultsSummary 
            monthlyPayment={monthlyPayment} 
            tae={tae} 
            totalCost={totalCost}
            nonBonifiedTAE={nonBonifiedTAE}
            interestSavings={interestSavings}
            totalProductCost={totalProductCost}
            netBenefit={netBenefit}
            activeProductsMonthlyCost={activeProductsMonthlyCost}
            activeInitialExpenses={activeInitialExpenses}
            initialExpensesList={initialExpenses.filter(e => e.enabled)}
            capital={capital}
            totalInterestBonified={totalInterestBonified}
            totalInterestNonBonified={totalInterestNonBonified}
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <div className="w-2 h-2 bg-accent" /> Matriz de Amortización Mensual
              </h3>
              <span className="text-[9px] text-accent/30 font-mono tracking-tighter">DATA_STREAM_OUTPUT_v4.1</span>
            </div>
            <AmortizationTable schedule={schedule} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;