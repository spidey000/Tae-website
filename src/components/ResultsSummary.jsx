import React from 'react';
import { TrendingUp, PiggyBank, AlertTriangle, CheckCircle, Wallet, Shield, Layers, FileText, PieChart, Activity, Zap } from 'lucide-react';

export const ResultsSummary = ({ 
  monthlyPayment, 
  tae, 
  totalCost, 
  nonBonifiedTAE, 
  interestSavings, 
  totalProductCost, 
  netBenefit,
  activeProductsMonthlyCost,
  activeInitialExpenses,
  initialExpensesList,
}) => {

  const isBenefitNegative = netBenefit < 0;

  return (
    <div className="space-y-8 font-mono">
      
      {/* HEADER: STATUS OVERRIDE */}
      <div className={`relative p-8 cyber-chamfer border-2 ${isBenefitNegative ? 'bg-red-950/20 border-red-500' : 'bg-accent/10 border-accent'} overflow-hidden`}>
        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-inherit" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-inherit" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className={`text-4xl font-black font-display tracking-tighter uppercase cyber-glitch ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`} data-text={isBenefitNegative ? 'LINK_CORRUPTED' : 'OPTIMAL_FLUX'}>
              {isBenefitNegative ? 'SISTEMA_NO_RENTABLE' : 'AHORRO_CONFIRMADO'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full animate-ping ${isBenefitNegative ? 'bg-red-500' : 'bg-accent'}`} />
              <p className="text-sm opacity-70 uppercase tracking-[0.3em]">
                {isBenefitNegative ? 'BONIFICACIÓN_RECHAZADA' : 'INFILTRACIÓN_BANCARIA_ÉXITO'}
              </p>
            </div>
          </div>
          <Zap className={`w-12 h-12 ${isBenefitNegative ? 'text-red-500 animate-pulse' : 'text-accent'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOQUE DE ANÁLISIS DE DATOS */}
        <div className="col-span-1 md:col-span-2 bg-card p-6 border border-border cyber-chamfer">
          <h3 className="text-sm font-bold text-accent-tertiary mb-8 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Activity className="w-4 h-4" /> Flujo de Crédito vs Coste de Vida
          </h3>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
            
            {/* SAVINGS */}
            <div className="flex-1 bg-black/40 p-4 border-l-4 border-accent">
              <span className="text-[10px] font-bold text-accent/60 uppercase">Intereses Evitados</span>
              <div className="text-3xl font-display font-black text-accent mt-1 tracking-tighter">
                {interestSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <p className="text-xs text-gray-500 px-2">
                Al bajar el interés (TAE del {nonBonifiedTAE.toFixed(2)}% al {tae.toFixed(2)}%), pagas menos al banco.
              </p>
            </div>

            <div className="flex items-center justify-center text-border">-</div>

            {/* COSTS */}
            <div className="flex-1 bg-black/40 p-4 border-l-4 border-accent-secondary">
              <span className="text-[10px] font-bold text-accent-secondary/60 uppercase">Carga de Vinculación</span>
              <div className="text-3xl font-display font-black text-accent-secondary mt-1 tracking-tighter">
                -{totalProductCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <div className="mt-2 text-[10px] text-gray-500 font-mono italic">
                TOTAL_LIFE_CYCLE_COST
              </div>
            </div>

            <div className="flex items-center justify-center text-border">=</div>

            {/* NET RESULT */}
            <div className={`flex-1 p-4 border-2 shadow-neon ${isBenefitNegative ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-accent/10 border-accent'}`}>
              <span className={`text-[10px] font-bold uppercase ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`}>
                {isBenefitNegative ? 'DÉFICIT_NETO' : 'CRÉDITO_LIMPIO'}
              </span>
              <div className={`text-4xl font-display font-black mt-1 tracking-tighter ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`}>
                {Math.abs(netBenefit).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <div className="mt-2 text-[10px] opacity-50 font-mono uppercase">
                Resultado de Operación Final
              </div>
            </div>

          </div>
        </div>

        {/* COLUMNA IZQUIERDA: PAGO MENSUAL HUD */}
        <div className="bg-card p-6 border border-border cyber-chamfer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Layers className="w-16 h-16" />
          </div>
          <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" /> Desembolso Mensual Real
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 border-l-2 border-accent/30">
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Base Hipotecaria</span>
              <span className="font-bold text-foreground font-display">
                {monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 border-l-2 border-accent-secondary/30">
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Suscripciones Vinc.</span>
              <span className="font-bold text-accent-secondary font-display">
                +{activeProductsMonthlyCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="pt-6 border-t border-border flex justify-between items-end">
              <div>
                <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] mb-1">Total Mes</p>
                <div className="w-12 h-1 bg-accent/30" />
              </div>
              <span className="text-4xl font-display font-black text-foreground shadow-neon-secondary">
                {(monthlyPayment + activeProductsMonthlyCost).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: AUDITORÍA DE GASTOS */}
        <div className="bg-card p-6 border border-border cyber-chamfer">
          <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-tertiary" /> Reserva de Capital (Gastos)
          </h3>
          
          <div className="space-y-2 mb-6 h-32 overflow-y-auto custom-scrollbar pr-2">
            {initialExpensesList.map((item) => (
              <div key={item.id} className="flex justify-between text-[11px] border-b border-border/30 pb-1 font-mono uppercase text-gray-400">
                <span>{item.name}</span>
                <span className="text-foreground">{item.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-accent-tertiary/30">
            <span className="text-xs font-bold text-accent-tertiary uppercase tracking-widest">Suma Total</span>
            <span className="text-2xl font-display font-black text-accent-tertiary">
              {activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>

        {/* FOOTER: TOTAL OPERACIÓN */}
        <div className="col-span-1 md:col-span-2 bg-accent/5 p-6 border border-accent/20 cyber-chamfer flex flex-col md:flex-row justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="p-3 border border-accent/40 bg-accent/10">
                <PieChart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Carga Financiera Total del Sistema</h4>
                <p className="text-[10px] text-accent/50 italic">Cap + Int + Gast + Vinc</p>
              </div>
           </div>
           
           <div className="text-right">
              <span className="text-4xl font-display font-black text-accent tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                {totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};