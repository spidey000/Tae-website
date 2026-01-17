import React, { useState, useEffect } from 'react';
import { BaseLoanInputs } from './Simulator/BaseLoanInputs';
import { ScenarioInputs } from './Simulator/ScenarioInputs';
import { ComparisonSummary } from './Simulator/ComparisonSummary';
import { calculateAmortizationWithInjection } from '../utils/amortizationEngine';

export function AmortizationSimulatorTab() {
  // --- State ---
  const [baseData, setBaseData] = useState({
    principal: 200000,
    years: 25,
    annualTIN: 3.5,
  });

  const [scenarioA, setScenarioA] = useState({
    name: 'Ahorro Agresivo',
    injectionAmount: 15000,
    injectionMonth: 12,
    strategy: 'reduceTerm',
  });

  const [scenarioB, setScenarioB] = useState({
    name: 'Cuota Cómoda',
    injectionAmount: 15000,
    injectionMonth: 12,
    strategy: 'reduceInstallment',
  });

  const [results, setResults] = useState({
    base: null,
    scenA: null,
    scenB: null,
  });

  // --- Handlers ---
  const handleBaseChange = (field, value) => {
    setBaseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScenarioChange = (setter) => (field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  // --- Calculation Effect ---
  useEffect(() => {
    // 1. Calculate Base (No Injection) to get baseline totals
    const baseResult = calculateAmortizationWithInjection({
      ...baseData,
      injectionAmount: 0,
    });

    // 2. Calculate Scenario A
    const resultA = calculateAmortizationWithInjection({
      ...baseData,
      ...scenarioA,
    });

    // 3. Calculate Scenario B
    const resultB = calculateAmortizationWithInjection({
      ...baseData,
      ...scenarioB,
    });

    setResults({
      base: baseResult,
      scenA: { ...resultA, strategy: scenarioA.strategy },
      scenB: { ...resultB, strategy: scenarioB.strategy },
    });
  }, [baseData, scenarioA, scenarioB]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-accent mb-2">
          Simulador de Amortización
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Compara cómo impactan tus aportaciones extra: ¿Es mejor reducir plazo o cuota?
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Inputs (4 cols on large screens) */}
        <div className="xl:col-span-4 space-y-6">
          <BaseLoanInputs data={baseData} onChange={handleBaseChange} />
          
          <div className="space-y-6 relative">
            {/* Visual connector line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border -z-10 hidden xl:block"></div>
            
            <ScenarioInputs 
              index={0} 
              scenario={scenarioA} 
              onChange={handleScenarioChange(setScenarioA)} 
            />
            <ScenarioInputs 
              index={1} 
              scenario={scenarioB} 
              onChange={handleScenarioChange(setScenarioB)} 
            />
          </div>
        </div>

        {/* Right Column: Results & Visualization (8 cols on large screens) */}
        <div className="xl:col-span-8 space-y-6">
          <ComparisonSummary 
            base={results.base} 
            scenA={results.scenA} 
            scenB={results.scenB} 
          />

          {/* Chart Placeholder - Phase 4 Pending */}
          <div className="p-8 border border-dashed border-gray-700 rounded-lg bg-black/20 text-center min-h-[300px] flex flex-col items-center justify-center">
             <div className="text-gray-500 font-display uppercase tracking-widest text-sm mb-2">
               Gráficos Comparativos
             </div>
             <p className="text-xs text-gray-600">
               (Visualización detallada disponible en la próxima actualización)
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}