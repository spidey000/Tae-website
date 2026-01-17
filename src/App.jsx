import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Tabs } from './components/Tabs';
import { MortgageCalculatorTab } from './components/MortgageCalculatorTab';
import { AmortizationSimulatorTab } from './components/AmortizationSimulatorTab';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { id: 'calculator', label: 'Calculadora Hipoteca' },
    { id: 'simulator', label: 'Simulador Amortización' },
  ];

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

      <main className="max-w-7xl mx-auto mt-12 px-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'calculator' ? (
          <MortgageCalculatorTab />
        ) : (
          <AmortizationSimulatorTab />
        )}
      </main>
    </div>
  );
}

export default App;
