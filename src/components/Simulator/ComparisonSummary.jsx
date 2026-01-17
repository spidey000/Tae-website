import React from 'react';
import { PiggyBank, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const formatMoney = (val) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

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

export const ComparisonSummary = ({ base, scenA, scenB }) => {
  const bInterest = base?.totalInterest || 0;
  
  const renderScenarioMetrics = (scen, label, color, border) => {
    if (!scen) return null;
    const { totalSavings, roi, newTerm, strategy } = scen;
    const isTerm = strategy === 'reduceTerm';
    
    return (
      <div className="space-y-4">
        <h4 className={`text-xs font-bold uppercase tracking-[0.2em] border-b pb-2 ${color} ${border}`}>
           {label}
        </h4>
        <div className="grid grid-cols-2 gap-2">
           <MetricCard 
             title="Ahorro Total" 
             value={formatMoney(totalSavings)} 
             icon={PiggyBank} 
             colorClass={color} 
             borderClass={border}
           />
           <MetricCard 
             title="ROI" 
             value={formatPercent(roi / 100)} 
             icon={TrendingUp} 
             colorClass={color}
             borderClass={border}
           />
           <div className="col-span-2">
              <MetricCard 
                title="Plazo Final" 
                value={newTerm} 
                subtext={isTerm ? "Terminas antes" : "Misma fecha fin"}
                icon={Clock}
                colorClass="text-gray-300"
                borderClass="border-gray-700"
              />
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

       {/* Scenario A */}
       {scenA && renderScenarioMetrics(scenA, "Escenario A", "text-accent", "border-accent/30")}

       {/* Scenario B */}
       {scenB && renderScenarioMetrics(scenB, "Escenario B", "text-accent-secondary", "border-accent-secondary/30")}
    </div>
  );
};
