import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { mergeSchedules } from '../../utils/amortizationEngine';

export function ComparisonCharts({ base, scenarios, principal }) {
  if (!base) return null;

  // 1. Prepare Line Chart Data (Balance over time)
  // Scenarios might be empty, or have 1 or 2 items.
  const scenA = scenarios[0];
  const scenB = scenarios[1];

  const chartData = mergeSchedules(
    base.schedule, 
    scenA?.schedule, 
    scenB?.schedule
  );

  // 2. Prepare Bar Chart Data (Total Cost)
  // Data structure: { name: 'Escenario', interest: 1000, principal: 20000 }
  // Use the passed principal prop, or fallback to 0 if missing (though it should be passed)
  const loanPrincipal = principal || 0;

  const barData = [
    {
      name: 'Base',
      Principal: loanPrincipal,
      Intereses: base.totalInterest,
    }
  ];

  if (scenA) {
    barData.push({
      name: 'Escenario A',
      Principal: loanPrincipal,
      Intereses: scenA.totalInterest,
    });
  }

  if (scenB) {
    barData.push({
      name: 'Escenario B',
      Principal: loanPrincipal,
      Intereses: scenB.totalInterest,
      totalCost: loanPrincipal + scenB.totalInterest
    });
  }

  // Find the cheapest scenario to highlight it
  const cheapest = [...barData].sort((a, b) => (a.Intereses || 0) - (b.Intereses || 0))[0];

  // Colors
  const colors = {
    base: '#9ca3af', // gray-400
    scenA: '#10b981', // emerald-500
    scenB: '#3b82f6', // blue-500
    principal: '#4b5563', // gray-600
    interest: '#f59e0b', // amber-500
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl text-xs">
          <p className="text-gray-400 mb-2">Mes {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span>{entry.name}: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      
      {/* Line Chart: Balance */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-display font-bold uppercase tracking-wider text-gray-200 mb-6">
          Evolución del Saldo Pendiente
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => `A${Math.floor(val/12)}`} // Show years approx
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Line 
                type="monotone" 
                dataKey="base" 
                name="Base (Sin cambios)" 
                stroke={colors.base} 
                strokeWidth={2}
                dot={false}
              />
              
              {scenA && (
                <Line 
                  type="monotone" 
                  dataKey="scenA" 
                  name="Escenario A" 
                  stroke={colors.scenA} 
                  strokeWidth={2}
                  dot={false}
                />
              )}
              
              {scenB && (
                <Line 
                  type="monotone" 
                  dataKey="scenB" 
                  name="Escenario B" 
                  stroke={colors.scenB} 
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Total Cost */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-display font-bold uppercase tracking-wider text-gray-200 mb-6">
          Coste Total del Préstamo
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} horizontal={false} />
              <XAxis type="number" stroke="#6b7280" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} tick={{ fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Principal" stackId="a" fill={colors.principal} name="Principal Devuelto" />
              <Bar dataKey="Intereses" stackId="a" fill={colors.interest} name="Intereses Totales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-gray-500 mt-4 text-center">
          {cheapest && cheapest.name !== 'Base' 
            ? `💡 El ${cheapest.name} es la opción más económica, ahorrando ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(base.totalInterest - (cheapest.Intereses || 0))} en intereses.`
            : "Compara los escenarios para ver el ahorro potencial en intereses."}
        </p>
      </div>

    </div>
  );
}
