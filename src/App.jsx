import React, { useState, useMemo } from 'react';
import { InputGroup } from './components/InputGroup';
import { Toggle } from './components/Toggle';
import { Tooltip } from './components/Tooltip';
import { ResultsSummary } from './components/ResultsSummary';
import { AmortizationTable } from './components/AmortizationTable';
import { AmortizationChart } from './components/AmortizationChart';
import { EducationalSection } from './components/EducationalSection';
import { CoreConceptAnalysis } from './components/CoreConceptAnalysis';
import { calculateMonthlyPayment, calculateTAE, generateAmortizationSchedule } from './utils/mortgageCalculations';
import { Calculator, FileText, ShieldCheck, Briefcase, BarChart2, List } from 'lucide-react';

function App() {
  // --- State ---
  const [capital, setCapital] = useState(150000);
  const [years, setYears] = useState(25);
  const [baseTIN, setBaseTIN] = useState(2.99);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  const [initialExpenses, setInitialExpenses] = useState([
    { id: 'appraisal', name: 'Tasación', cost: 350, enabled: true, description: "Coste de valorar la vivienda. Obligatorio si pides hipoteca." },
    { id: 'opening', name: 'Comisión Apertura', cost: 500, enabled: false, description: "Lo que cobra el banco por 'abrir' el préstamo. Intenta negociarla a cero." },
    { id: 'notary', name: 'Notaría', cost: 800, enabled: true, description: "Honorarios del notario. Lo suele pagar el banco (Ley 2019), pero verifica." },
    { id: 'registry', name: 'Registro', cost: 400, enabled: true, description: "Inscripción en el Registro de la Propiedad. Lo suele pagar el banco." },
    { id: 'tax', name: 'IAJD', cost: 1500, enabled: false, description: "Impuesto de Actos Jurídicos Documentados. Lo paga el banco desde 2018." },
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
    totalInterestBonified,
    totalInterestNonBonified,
    nonBonifiedPayment
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
              <h1 className="text-xl font-display font-black tracking-[0.2em] uppercase cyber-glitch" data-text="CALCULADORA HIPOTECARIA">
                CALCULADORA HIPOTECARIA
              </h1>
              <p className="text-[10px] text-accent/50 font-bold uppercase tracking-widest">Simulador Avanzado</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> SISTEMA ONLINE</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent-secondary rounded-full" /> CONEXIÓN SEGURA</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Concept Analysis (Top Full Width) */}
        <CoreConceptAnalysis />

        {/* Left Column: Data Input Terminals */}
        <div className="lg:col-span-4 space-y-12 pt-4">
          
          {/* Main Inputs Terminal */}
          <section className="relative group">
            <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent uppercase tracking-widest z-10">
              [ DATOS DEL PRÉSTAMO ]
            </div>
            <div className="relative p-6 pt-8">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-tertiary uppercase tracking-widest">
                <FileText className="h-4 w-4" /> Datos de tu Hipoteca
              </h2>
              <div className="space-y-5">
                <InputGroup 
                  label="Capital del Préstamo" 
                  value={capital} 
                  onChange={(v) => setCapital(Number(v))} 
                  suffix="EUR" 
                  min={1000} 
                  step={1000}
                  helpText="La cantidad de dinero que solicitas al banco (deuda inicial)."
                />
                <InputGroup 
                  label="Plazo (Años)" 
                  value={years} 
                  onChange={(v) => setYears(Number(v))} 
                  suffix="Años" 
                  min={1} 
                  max={50} 
                  helpText="Tiempo para devolver el préstamo. A más años, cuota más baja pero más intereses pagados en total."
                />
                <InputGroup 
                  label="Interés Base (TIN)" 
                  value={baseTIN} 
                  onChange={(v) => setBaseTIN(Number(v))} 
                  suffix="%" 
                  step={0.01} 
                  helpText="Interés ofertado por el banco SIN restar bonificaciones."
                />
              </div>
            </div>
          </section>

          {/* Linked Products: Bonification Nodes */}
          <section className="relative group">
            <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-secondary uppercase tracking-widest z-10">
              [ BONIFICACIONES ]
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
                          helpText="Precio mensual del servicio (seguro, alarma, etc)."
                        />
                        <InputGroup 
                          label="Bajada de Interés" 
                          value={product.bonus} 
                          onChange={(v) => handleProductChange(product.id, 'bonus', Number(v))} 
                          suffix="%" 
                          step={0.01}
                          helpText="Porcentaje que el banco reduce tu interés si contratas esto."
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
              [ GASTOS INICIALES ]
            </div>
            <div className="relative p-6 pt-8">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-tertiary uppercase tracking-widest">
                <Briefcase className="h-4 w-4" /> Gastos al Firmar
              </h2>
              <div className="space-y-4">
                {initialExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 group/row">
                    <div className="flex items-center gap-3">
                      <Toggle enabled={expense.enabled} onChange={(v) => handleExpenseChange(expense.id, 'enabled', v)} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 ${expense.enabled ? 'text-gray-200' : 'text-gray-600'}`}>
                        {expense.name}
                        {expense.enabled && <Tooltip content={expense.description} />}
                      </span>
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
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Gastos:</span>
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
            nonBonifiedPayment={nonBonifiedPayment}
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
                <div className="w-2 h-2 bg-accent" /> Tabla de Amortización
              </h3>
              
              {/* View Toggle */}
              <div className="flex bg-black/40 border border-border rounded p-1 gap-1">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-accent/20 text-accent' : 'text-gray-500 hover:text-gray-300'}`}
                  title="Vista Tabla"
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('chart')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'chart' ? 'bg-accent/20 text-accent' : 'text-gray-500 hover:text-gray-300'}`}
                  title="Vista Gráfica"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {viewMode === 'table' ? (
              <AmortizationTable schedule={schedule} />
            ) : (
              <AmortizationChart schedule={schedule} />
            )}
          </div>
        </div>

        {/* Educational Section */}
        <EducationalSection />

      </main>
    </div>
  );
}

export default App;