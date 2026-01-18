import React from 'react';
import { Trophy, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Tooltip } from '../Tooltip';

const formatMoney = (val) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatCurrency = (val) => val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatPercent = (val) => val.toLocaleString('es-ES', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ComparisonTable = ({ base, scenarios }) => {
  if (!base) return null;

  // --- Data Preparation ---

  // 1. Prepare Columns (Base + Scenarios)
  const columns = [
    { id: 'base', label: 'Escenario Base', data: base, isBase: true },
    ...scenarios.map((scen, idx) => ({
      id: `scen-${idx}`,
      label: `Escenario ${idx + 1}`,
      data: scen,
      isBase: false,
      color: ['text-accent', 'text-accent-secondary', 'text-purple-400', 'text-yellow-400'][idx % 4]
    }))
  ];

  // 2. Define Rows & Logic
  const rows = [
    {
      id: 'totalInjected',
      label: 'Inyección Total',
      icon: null,
      getValue: (d) => d.totalInjected || 0,
      format: (v) => formatMoney(v),
      bestCriteria: 'min', // Less investment is technically "better" for wallet, but context dependent. Let's say 'min' cost is good, but here it's input. Let's ignore "best" for injection amount usually, or treat 0 as best? Actually users want to see the effect. Let's not highlight "best" injection, just display it.
      highlightBest: false
    },
    {
      id: 'totalInterest',
      label: 'Intereses Totales',
      getValue: (d) => d.totalInterest || 0,
      format: (v) => formatMoney(v),
      bestCriteria: 'min',
      highlightBest: true,
      showDelta: true,
      inverseDelta: true // Negative delta (savings) is Good (Green)
    },
    {
      id: 'totalSavings',
      label: 'Ahorro Intereses',
      getValue: (d) => d.totalSavings || 0,
      format: (v) => formatMoney(v),
      bestCriteria: 'max',
      highlightBest: true,
      showDelta: false // Absolute value is already the delta vs base
    },
    {
      id: 'newTerm',
      label: 'Plazo Total',
      getValue: (d) => d.finalMonths || 0, // value for comparison
      getDisplay: (d) => d.newTerm || "0y 0m", // value for display
      bestCriteria: 'min',
      highlightBest: true,
      showDelta: true, // We will calculate delta in months/years
      deltaType: 'term'
    },
    {
      id: 'roi',
      label: 'ROI',
      getValue: (d) => d.roi || 0,
      format: (v) => formatPercent(v / 100),
      bestCriteria: 'max',
      highlightBest: true,
      showDelta: true,
      deltaType: 'multiplier',
      inverseDelta: false // Positive delta is Good
    },
    {
      id: 'monthlyPayment',
      label: 'Cuota Mensual',
      getValue: (d) => d.finalMonthlyPayment || 0, // Compare final payment?
      getDisplay: (d) => {
        const start = d.initialMonthlyPayment;
        const end = d.finalMonthlyPayment;
        if (Math.abs(start - end) < 1) return formatCurrency(start);
        return (
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="opacity-70 line-through">{formatCurrency(start)}</span>
            <span className="font-bold">{formatCurrency(end)}</span>
          </div>
        );
      },
      bestCriteria: 'min', // Usually lower monthly payment is "better" for cashflow
      highlightBest: true,
      showDelta: false 
    },
    {
      id: 'tae',
      label: 'Final Total TAE',
      getValue: (d) => d.tae || 0,
      format: (v) => formatPercent(v / 100),
      bestCriteria: 'min',
      highlightBest: true,
      showDelta: true,
      inverseDelta: true // Lower TAE is better
    }
  ];

  // 3. Helper to find "Best" value index
  const getBestIndex = (row) => {
    if (!row.highlightBest) return -1;
    let bestIdx = -1;
    let bestVal = row.bestCriteria === 'min' ? Infinity : -Infinity;

    columns.forEach((col, idx) => {
      const val = row.getValue(col.data);
      if (row.bestCriteria === 'min') {
        if (val < bestVal) { bestVal = val; bestIdx = idx; }
      } else {
        if (val > bestVal) { bestVal = val; bestIdx = idx; }
      }
    });
    return bestIdx;
  };

  return (
    <div className="w-full overflow-hidden rounded border border-border bg-card/50 cyber-chamfer">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-card border-b border-r border-border p-2 sm:p-4 min-w-[120px] sm:min-w-[150px]">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">Métrica</span>
              </th>
              {columns.map((col, idx) => (
                <th key={col.id} className={`border-b border-border p-2 sm:p-4 min-w-[140px] sm:min-w-[160px] bg-card/30 ${idx === 0 ? 'bg-black/20' : ''}`}>
                  <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap ${col.isBase ? 'text-gray-400' : (col.color || 'text-white')}`}>
                    {col.label}
                    {!col.isBase && <div className="text-[9px] opacity-70 font-normal normal-case mt-0.5">{col.data.strategy === 'reduceTerm' ? 'Red. Plazo' : 'Red. Cuota'}</div>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((row) => {
              const bestIdx = getBestIndex(row);
              return (
                <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                  {/* Label Column */}
                  <td className="sticky left-0 z-20 bg-card/95 backdrop-blur border-r border-border p-2 sm:p-4 group-hover:bg-card">
                    <div className="text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wide">
                      {row.label}
                    </div>
                  </td>

                  {/* Data Columns */}
                  {columns.map((col, idx) => {
                    const val = row.getValue(col.data);
                    const display = row.getDisplay ? row.getDisplay(col.data) : row.format(val);
                    const isBest = idx === bestIdx;
                    
                    // Delta Calculation
                    let deltaDisplay = null;
                    if (!col.isBase && row.showDelta) {
                       const baseVal = row.getValue(base);
                       const delta = val - baseVal;
                       
                       if (row.deltaType === 'term') {
                          // Term Delta in months
                          if (delta !== 0) {
                            const absDelta = Math.abs(delta);
                            const years = Math.floor(absDelta / 12);
                            const months = absDelta % 12;
                            const sign = delta > 0 ? '+' : '-';
                            const color = delta < 0 ? 'text-accent' : 'text-red-400'; // Less time is good
                            deltaDisplay = <span className={`text-[9px] font-bold ${color}`}>{sign}{years}a {months}m</span>;
                          }
                       } else if (row.deltaType === 'multiplier') {
                          if (Math.abs(delta) > 0.01) {
                             const multiplier = delta / 100;
                             const sign = multiplier > 0 ? '+' : '';
                             const isGood = row.inverseDelta ? delta < 0 : delta > 0;
                             const color = isGood ? 'text-accent' : 'text-red-400';
                             deltaDisplay = <span className={`text-[9px] font-bold ${color}`}>{sign}{multiplier.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x</span>;
                          }
                       } else {
                          // Numeric Delta
                          if (Math.abs(delta) > 0.01) {
                             const sign = delta > 0 ? '+' : ''; // Minus is part of number
                             // Determine color based on criteria
                             const isGood = row.inverseDelta ? delta < 0 : delta > 0;
                             const color = isGood ? 'text-accent' : 'text-red-400';
                             deltaDisplay = <span className={`text-[9px] font-bold ${color}`}>{sign}{row.format(delta)}</span>;
                          }
                       }
                    }

                    return (
                      <td key={col.id} className={`p-2 sm:p-4 relative ${isBest ? 'bg-accent/5' : ''}`}>
                        {isBest && (
                          <div className="absolute top-0 right-0 p-1 opacity-50">
                             <Trophy className="w-2 h-2 text-accent" />
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <div className={`font-numbers font-bold text-sm sm:text-base ${isBest ? 'text-accent' : 'text-gray-200'}`}>
                            {display}
                          </div>
                          {deltaDisplay}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ComparisonTable };
