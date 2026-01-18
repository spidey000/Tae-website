import React from 'react';
import { PiggyBank, Clock, TrendingUp, AlertCircle, DollarSign, Calendar } from 'lucide-react';

const formatMoney = (val) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatCurrency = (val) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatPercent = (val) => val.toLocaleString('es-ES', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MetricCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass }) => (
  <div className={`p-4 border bg-card/50 cyber-chamfer ${borderClass}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>{title}</span>
    </div>
    <div className="text-2xl font-numbers font-bold text-white tabular-nums">
      {value}
    </div>
    {subtext && <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{subtext}</div>}
  </div>
);

export const ComparisonSummary = ({ base, scenarios }) => {
  const bInterest = base?.totalInterest || 0;
  const baseTermStr = base?.newTerm || "0y 0m";
  const baseMonths = base?.finalMonths || 0;
  
  const COLORS = [
    { text: 'text-accent', border: 'border-accent/30' },
    { text: 'text-accent-secondary', border: 'border-accent-secondary/30' },
    { text: 'text-purple-400', border: 'border-purple-500/30' },
    { text: 'text-yellow-400', border: 'border-yellow-500/30' },
  ];

  const renderScenarioMetrics = (scen, index) => {
    if (!scen) return null;
    const theme = COLORS[index % COLORS.length];
    
    const { totalSavings, totalInjected, roi, newTerm, strategy, initialMonthlyPayment, finalMonthlyPayment, finalMonths } = scen;
    const isTerm = strategy === 'reduceTerm';
    
    // Payment Logic
    const startPayment = initialMonthlyPayment;
    const endPayment = finalMonthlyPayment;
    const isVariablePayment = Math.abs(startPayment - endPayment) > 0.05; // Tolerance
    const monthlyDiff = endPayment - startPayment;
    
    // Term Logic
    const termDiffMonths = baseMonths - finalMonths;
    const termDiffStr = `${Math.floor(termDiffMonths / 12)}y ${termDiffMonths % 12}m`;
    
    const StrategyBadge = () => (
      <span className={`text-[10px] px-2 py-0.5 rounded border ${isTerm ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-blue-500/10 border-blue-500 text-blue-400'} ml-2`}>
        {isTerm ? 'REDUCE PLAZO' : 'REDUCE CUOTA'}
      </span>
    );

    return (
      <div key={index} className="space-y-4">
        <h4 className={`text-xs font-bold uppercase tracking-[0.2em] border-b pb-2 ${theme.text} ${theme.border} flex items-center justify-between`}>
           <span>ESCENARIO {index + 1}</span>
           <StrategyBadge />
        </h4>
        <div className="grid grid-cols-2 gap-2">
           <MetricCard 
             title="Ahorro Total" 
             value={formatMoney(totalSavings)} 
             icon={PiggyBank} 
             colorClass={theme.text} 
             borderClass={theme.border}
           />
           <MetricCard 
             title="Total Inyectado" 
             value={formatMoney(totalInjected || 0)} 
             icon={DollarSign} 
             colorClass={theme.text} 
             borderClass={theme.border}
           />
           <MetricCard 
             title="ROI" 
             value={formatPercent(roi / 100)} 
             icon={TrendingUp} 
             colorClass={theme.text}
             borderClass={theme.border}
           />
        </div>

        {/* Detailed Comparison Block */}
        <div className={`p-4 border bg-card/50 cyber-chamfer ${theme.border} space-y-4`}>
          
          {/* Monthly Payment Comparison */}
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Cuota Mensual
             </span>
             
             {isVariablePayment ? (
               // Variable Range Display
               <div className="flex flex-col">
                  <div className="text-gray-500 text-xs line-through decoration-white/20 mb-1">
                    {formatCurrency(startPayment)} (Inicial)
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold font-numbers text-lg">
                     <span className="text-gray-400 text-sm">{formatCurrency(startPayment)}</span>
                     <span className="text-gray-600">➔</span>
                     <span className="text-green-400">{formatCurrency(endPayment)}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 text-right mt-1">
                    * Cuota decreciente
                  </div>
               </div>
             ) : (
               // Static Display
               <>
                 <div className="flex items-baseline justify-between">
                    <div className="text-gray-500 text-xs line-through decoration-white/20">
                      {formatCurrency(startPayment)}
                    </div>
                    <div className={`text-lg font-bold font-numbers ${monthlyDiff < -0.01 ? 'text-green-400' : 'text-white'}`}>
                      {formatCurrency(endPayment)}
                    </div>
                 </div>
                 {Math.abs(monthlyDiff) > 0.01 && (
                   <div className={`text-right text-[10px] font-bold ${monthlyDiff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {monthlyDiff > 0 ? '+' : ''}{formatCurrency(monthlyDiff)}
                   </div>
                 )}
               </>
             )}
          </div>

          <div className="h-px bg-white/5 border-t border-dashed border-white/10" />

          {/* Term Comparison */}
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Plazo Total
             </span>
             <div className="flex items-baseline justify-between">
                <div className="text-gray-500 text-xs">
                  {baseTermStr}
                </div>
                <div className={`text-lg font-bold font-numbers ${termDiffMonths > 0 ? 'text-green-400' : 'text-white'}`}>
                  {newTerm}
                </div>
             </div>
             {termDiffMonths > 0 && (
               <div className="text-right text-[10px] font-bold text-green-400">
                 -{termDiffStr}
               </div>
             )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${Math.min(scenarios?.length + 1, 4)} gap-6`}>
       {/* Base Card */}
       <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-700 pb-2">
             Escenario Base
          </h4>
          <MetricCard 
             title="Intereses Totales"
             value={formatMoney(bInterest)}
             icon={AlertCircle}
             colorClass="text-gray-400"
             borderClass="border-gray-700"
             subtext="Sin amortizar nada"
          />
       </div>

       {/* Scenarios */}
       {scenarios?.map((scen, idx) => renderScenarioMetrics(scen, idx))}
    </div>
  );
};
