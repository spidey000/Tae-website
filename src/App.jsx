import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Tabs } from './components/Tabs';
import { MortgageCalculatorTab } from './components/MortgageCalculatorTab';
import { AmortizationSimulatorTab } from './components/AmortizationSimulatorTab';
import { MathAuditPage } from './components/MathAuditPage';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('tae_activeTab') || 'calculator';
  });
  const [showAudit, setShowAudit] = useState(false);

  useEffect(() => {
    localStorage.setItem('tae_activeTab', activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'calculator', label: 'Calculadora Hipoteca' },
    { id: 'simulator', label: 'Simulador Amortización' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono pb-20 selection:bg-accent selection:text-black overflow-x-hidden relative">
      
      {showAudit && <MathAuditPage onClose={() => setShowAudit(false)} />}

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

        <div style={{ display: activeTab === 'calculator' ? 'block' : 'none' }}>
          <MortgageCalculatorTab />
        </div>
        <div style={{ display: activeTab === 'simulator' ? 'block' : 'none' }}>
          <AmortizationSimulatorTab />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-8 text-center border-t border-white/5 pt-8">
        <button 
          onClick={() => setShowAudit(true)}
          className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/50 transition-all"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-accent">
            Ver Informe de Auditoría Matemática
          </span>
        </button>
        <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
          Transparencia Total • Algoritmos Verificados
        </p>
      </footer>
    </div>
  );
}

export default App;
