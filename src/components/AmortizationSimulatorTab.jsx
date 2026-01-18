import React, { useState, useEffect } from 'react';
import { BaseLoanInputs } from './Simulator/BaseLoanInputs';
import { ScenarioInputs } from './Simulator/ScenarioInputs';
import { ComparisonTable } from './Simulator/ComparisonTable';
import { ComparisonCharts } from './Simulator/ComparisonCharts';
import { calculateAmortizationWithInjection } from '../utils/amortizationEngine';
import { Plus, Trash2 } from 'lucide-react';

export function AmortizationSimulatorTab() {
  // --- State ---
  const [baseData, setBaseData] = useState(() => {
    const saved = localStorage.getItem('tae_sim_baseData');
    return saved ? JSON.parse(saved) : {
      principal: 200000,
      years: 25,
      annualTIN: 3.5,
    };
  });

  const [scenarios, setScenarios] = useState(() => {
    const saved = localStorage.getItem('tae_sim_scenarios');
    return saved ? JSON.parse(saved) : [
      {
        injectionAmount: 15000,
        injectionMonth: 12,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceTerm',
      },
      {
        injectionAmount: 15000,
        injectionMonth: 12,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceInstallment',
      }
    ];
  });

  const [results, setResults] = useState({
    base: null,
    scenarios: [],
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('tae_sim_baseData', JSON.stringify(baseData));
  }, [baseData]);

  useEffect(() => {
    localStorage.setItem('tae_sim_scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  // --- Handlers ---
  const handleBaseChange = (field, value) => {
    setBaseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScenarioChange = (index, field, value) => {
    setScenarios((prev) => {
      const newScenarios = [...prev];
      newScenarios[index] = { ...newScenarios[index], [field]: value };
      return newScenarios;
    });
  };

  const addScenario = () => {
    if (scenarios.length < 4) {
      setScenarios(prev => [...prev, {
        injectionAmount: 10000,
        injectionMonth: 12,
        injectionFrequency: 'once',
        injectionCount: null,
        strategy: 'reduceTerm',
      }]);
    }
  };

  const removeScenario = (index) => {
    if (scenarios.length > 1) {
      setScenarios(prev => prev.filter((_, i) => i !== index));
    }
  };

  // --- Calculation Effect ---
  useEffect(() => {
    // 1. Calculate Base (No Injection)
    const baseResult = calculateAmortizationWithInjection({
      ...baseData,
      injectionAmount: 0,
    });

    // 2. Calculate All Scenarios
    const scenarioResults = scenarios.map(scen => {
        const res = calculateAmortizationWithInjection({
          ...baseData,
          ...scen,
        });
        return { ...res, strategy: scen.strategy };
    });

    setResults({
      base: baseResult,
      scenarios: scenarioResults,
    });
  }, [baseData, scenarios]);

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
        {/* Left Column: Inputs */}
        <div className="xl:col-span-4 space-y-6">
          <BaseLoanInputs data={baseData} onChange={handleBaseChange} />
          
          <div className="space-y-6 relative">
            {/* Visual connector line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border -z-10 hidden xl:block"></div>
            
            {scenarios.map((scen, idx) => (
              <div key={idx} className="relative group/scen">
                 <ScenarioInputs 
                    index={idx} 
                    scenario={scen} 
                    onChange={(field, val) => handleScenarioChange(idx, field, val)} 
                 />
                 {scenarios.length > 1 && (
                   <button 
                     onClick={() => removeScenario(idx)}
                     className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-red-500 transition-colors bg-black/40 border border-transparent hover:border-red-500/30 rounded z-20"
                     title="Eliminar escenario"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                 )}
              </div>
            ))}

            {scenarios.length < 4 && (
              <button 
                onClick={addScenario}
                className="w-full py-4 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" /> Añadir Escenario
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="xl:col-span-8 space-y-6">
          <ComparisonTable 
            base={results.base} 
            scenarios={results.scenarios} 
          />

          <ComparisonCharts 
            base={results.base} 
            scenarios={results.scenarios} 
            principal={baseData.principal}
          />
        </div>
      </div>
    </div>
  );
}