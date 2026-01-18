import React from 'react';
import { TrendingUp, PiggyBank, AlertTriangle, CheckCircle, Wallet, Shield, Layers, FileText, PieChart, Activity, Zap, Terminal } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const ResultsSummary = ({ 
  monthlyPayment, 
  nonBonifiedPayment,
  totalCost, 
  interestSavings, 
  totalProductCost, 
  netBenefit,
  activeProductsMonthlyCost,
  activeInitialExpenses,
  initialExpensesList,
  capital,
  totalInterestBonified,
  totalInterestNonBonified
}) => {

  const isBenefitNegative = netBenefit < 0;
  const monthlyBonusSavings = nonBonifiedPayment - monthlyPayment;

  // Texto dinámico para Dummies (Refined Logic)
  const analysisText = isBenefitNegative
    ? `DECISIÓN: NO COMPENSA. Hemos aislado la comparativa: los gastos iniciales (Notaría, Registro...) los pagas igual en ambos casos, así que los hemos sacado de la ecuación. Nos centramos solo en la bonificación: Contratar los seguros te cuesta ${Math.abs(totalProductCost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€, pero solo te ahorra ${interestSavings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€ en intereses. Resultado: Regalas dinero al banco.`
    : `DECISIÓN: SÍ COMPENSA. Análisis simplificado: Los gastos de constitución (Notaría, Registro...) no afectan a esta decisión porque los pagas en ambos escenarios. La clave está en la bonificación: Te gastas ${Math.abs(totalProductCost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€ en seguros, pero a cambio el banco te perdona ${interestSavings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€ en intereses. El ahorro es real y directo a tu bolsillo.`;

  const totalNonBonified = capital + totalInterestNonBonified + activeInitialExpenses;

  return (
    <div className="space-y-8 font-mono">
      
      {/* HEADER: STATUS OVERRIDE */}
      <div className={`relative p-8 cyber-chamfer border-2 ${isBenefitNegative ? 'bg-red-950/20 border-red-500' : 'bg-accent/10 border-accent'} overflow-hidden`}>
        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-inherit" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-inherit" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className={`text-2xl md:text-4xl font-black font-display tracking-tighter uppercase cyber-glitch ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`} data-text={isBenefitNegative ? 'NO COMPENSA' : 'COMPENSA'}>
              {isBenefitNegative ? 'NO RENTABLE' : 'AHORRO CONFIRMADO'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full animate-ping ${isBenefitNegative ? 'bg-red-500' : 'bg-accent'}`} />
              <p className={`text-sm opacity-70 uppercase tracking-widest md:tracking-[0.3em]`}>
                {isBenefitNegative ? 'BONIFICACIÓN NO RENTABLE' : 'AHORRO CONFIRMADO'}
              </p>
            </div>
          </div>
          <Zap className={`w-12 h-12 ${isBenefitNegative ? 'text-red-500 animate-pulse' : 'text-accent'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOQUE DE ANÁLISIS DE DATOS */}
        <div className="col-span-1 md:col-span-2 bg-card p-6 border border-border cyber-chamfer">
          <h3 className="text-sm font-bold text-accent-tertiary mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Activity className="w-4 h-4" /> Comparativa de Ahorro
          </h3>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 mb-6">
            
            {/* SAVINGS */}
            <div className="flex-1 bg-black/40 p-4 border-l-4 border-accent">
              <span className="text-[10px] font-bold text-accent/60 uppercase flex items-center gap-1">
                Intereses Evitados <Tooltip content="Dinero que dejas de pagar al banco gracias a la bajada del tipo de interés." />
              </span>
              <div className="text-3xl font-numbers font-bold text-accent mt-1 tracking-tighter tabular-nums">
                {interestSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center text-border text-2xl font-mono">-</div>

            {/* COSTS */}
            <div className="flex-1 bg-black/40 p-4 border-l-4 border-accent-secondary">
              <span className="text-[10px] font-bold text-accent-secondary/60 uppercase flex items-center gap-1">
                Coste de los Seguros <Tooltip content="Coste total de los seguros y productos contratados durante toda la vida del préstamo." />
              </span>
              <div className="text-3xl font-numbers font-bold text-accent-secondary mt-1 tracking-tighter tabular-nums">
                -{totalProductCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center text-border text-2xl font-mono">=</div>

            {/* NET RESULT */}
            <div className={`flex-1 p-4 border-2 shadow-neon ${isBenefitNegative ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-accent/10 border-accent'}`}>
              <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`}>
                {isBenefitNegative ? 'Pérdida Total' : 'Ahorro Total'}
                <Tooltip content="El resultado final. Si es positivo, ganas dinero contratando los productos. Si es negativo, pierdes dinero." />
              </span>
              <div className={`text-4xl font-numbers font-bold mt-1 tracking-tighter tabular-nums ${isBenefitNegative ? 'text-red-500' : 'text-accent'}`}>
                {Math.abs(netBenefit).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>

          </div>

          {/* LOG TÁCTICO PARA DUMMIES */}
          <div className="bg-black/60 border border-gray-800 p-4 font-mono text-xs leading-relaxed text-gray-400 relative">
             <div className="absolute top-0 left-0 bg-gray-800 text-[9px] font-bold px-1 text-gray-300 uppercase">Mission_Log</div>
             <div className="flex gap-3 mt-2">
                <Terminal className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p>
                  <span className="text-accent mr-2">{'>'}</span>
                  {analysisText}
                </p>
             </div>
          </div>

        </div>

        {/* COLUMNA IZQUIERDA: PAGO MENSUAL HUD */}
        <div className="bg-card p-6 border border-border cyber-chamfer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Layers className="w-16 h-16" />
          </div>
          <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" /> Tu Cuota Mensual Real
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 border-l-2 border-gray-700">
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Base (Sin Bonificar)</span>
              <span className="font-bold text-gray-300 font-numbers tabular-nums">
                {nonBonifiedPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 border-l-2 border-accent/30">
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Bonificación TIN</span>
              <span className="font-bold text-accent font-numbers tabular-nums">
                -{monthlyBonusSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 border-l-2 border-accent-secondary/30">
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Coste Servicios</span>
              <span className="font-bold text-accent-secondary font-numbers tabular-nums">
                +{activeProductsMonthlyCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="pt-6 border-t border-border flex justify-between items-end">
              <div>
                <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] mb-1">Total Mes</p>
                <div className="w-12 h-1 bg-accent/30" />
              </div>
              <span className="text-4xl font-numbers font-bold text-foreground shadow-neon-secondary tabular-nums">
                {(monthlyPayment + activeProductsMonthlyCost).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: AUDITORÍA DE GASTOS */}
        <div className="bg-card p-6 border border-border cyber-chamfer">
          <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-tertiary" /> Gastos Iniciales (Notaría, etc.)
          </h3>
          
          <div className="space-y-2 mb-6 h-32 overflow-y-auto custom-scrollbar pr-2">
            {initialExpensesList.map((item) => (
              <div key={item.id} className="flex justify-between text-[11px] border-b border-border/30 pb-1 font-mono uppercase text-gray-400">
                <span>{item.name}</span>
                <span className="text-foreground font-numbers tabular-nums">{item.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-accent-tertiary/30">
            <span className="text-xs font-bold text-accent-tertiary uppercase tracking-widest">Suma Total</span>
            <span className="text-2xl font-numbers font-bold text-accent-tertiary tabular-nums">
              {activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>

        {/* FOOTER: TOTAL OPERACIÓN DESGLOSADO */}
        <div className="col-span-1 md:col-span-2 space-y-4">
           
           <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-accent" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Carga Financiera Total del Sistema</h4>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* MODELO BONIFICADO */}
              <div className="bg-accent/5 p-5 border border-accent/20 cyber-chamfer">
                 <h5 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4 border-b border-accent/20 pb-2">Modelo Bonificado (Actual)</h5>
                 <div className="space-y-2 text-[11px] text-gray-400 font-mono">
                    <div className="flex justify-between">
                       <span>Capital Amortizado</span>
                       <span className="text-gray-300 tabular-nums">{capital.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Intereses Totales</span>
                       <span className="text-accent tabular-nums">{totalInterestBonified.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Coste Productos</span>
                       <span className="text-accent-secondary tabular-nums">{totalProductCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Gastos Iniciales</span>
                       <span className="text-accent-tertiary tabular-nums">{activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                 </div>
                 <div className="mt-4 pt-3 border-t border-accent/20 flex justify-between items-end">
                    <span className="text-[10px] text-accent/70 uppercase">Total Estimado</span>
                    <span className="text-2xl font-numbers font-bold text-accent tabular-nums">
                       {totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                 </div>
              </div>

              {/* MODELO ESTÁNDAR (NO BONIFICADO) */}
              <div className="bg-black/20 p-5 border border-border/50 cyber-chamfer">
                 <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Modelo Estándar (Sin Bonificar)</h5>
                 <div className="space-y-2 text-[11px] text-gray-500 font-mono">
                    <div className="flex justify-between">
                       <span>Capital Amortizado</span>
                       <span className="text-gray-400 tabular-nums">{capital.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Intereses Totales</span>
                       <span className="text-gray-300 tabular-nums">{totalInterestNonBonified.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between opacity-50">
                       <span>Coste Productos</span>
                       <span className="tabular-nums">0,00 €</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Gastos Iniciales</span>
                       <span className="text-accent-tertiary/70 tabular-nums">{activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                 </div>
                 <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase">Total Estimado</span>
                    <span className="text-xl font-numbers font-bold text-gray-300 tabular-nums">
                       {totalNonBonified.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};
