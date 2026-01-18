import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-border p-3 rounded shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
          Mes {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-xs font-numbers font-bold text-white">
                {entry.value.toLocaleString('es-ES', { 
                  style: entry.name.includes('TAE') ? 'decimal' : 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}{entry.name.includes('TAE') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const AdvancedCharts = ({ base, scenarios }) => {
  if (!base || !scenarios || scenarios.length === 0) return null;

  // 1. Prepare Data for Cumulative Interest & Quota Evolution
  const maxMonths = base.schedule.length;
  const chartData = [];

  for (let i = 0; i < maxMonths; i++) {
    const month = i + 1;
    const entry = { month };

    // Base Scenario
    const baseItem = base.schedule[i];
    entry['Base (Interés)'] = base.schedule.slice(0, month).reduce((acc, curr) => acc + curr.interest, 0);
    entry['Base (Cuota)'] = baseItem ? baseItem.payment : 0;

    // User Scenarios
    scenarios.forEach((scen, idx) => {
      const scenItem = scen.schedule[i];
      const name = `E${idx + 1}`;
      // Cumulative Interest
      entry[`${name} (Interés)`] = scen.schedule.slice(0, month).reduce((acc, curr) => acc + curr.interest, 0);
      // Quota Evolution
      entry[`${name} (Cuota)`] = scenItem ? scenItem.payment : 0;
    });

    chartData.push(entry);
  }

  // 2. Prepare Data for TAE Comparison
  const taeData = [
    { name: 'Base', value: base.tae, color: '#9ca3af' },
    ...scenarios.map((scen, idx) => ({
      name: `Escenario ${idx + 1}`,
      value: scen.tae,
      color: ['#00f2ff', '#00ff9f', '#c084fc', '#fbbf24'][idx % 4]
    }))
  ];

  const colors = ['#00f2ff', '#00ff9f', '#c084fc', '#fbbf24'];

  return (
    <div className="space-y-8 pt-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cumulative Interest Chart */}
        <div className="bg-card/30 border border-border p-4 rounded-lg space-y-4 cyber-chamfer">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Interés Acumulado
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={10} 
                  tickFormatter={(val) => `M${val}`}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={10} 
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k€`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Base (Interés)" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Base"
                />
                {scenarios.map((_, idx) => (
                  <Line 
                    key={idx}
                    type="monotone" 
                    dataKey={`E${idx + 1} (Interés)`} 
                    stroke={colors[idx % colors.length]} 
                    strokeWidth={2} 
                    dot={false} 
                    name={`Escenario ${idx + 1}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quota Evolution Chart */}
        <div className="bg-card/30 border border-border p-4 rounded-lg space-y-4 cyber-chamfer">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Evolución de Cuota Mensual
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={10} 
                  tickFormatter={(val) => `M${val}`}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={10} 
                  tickFormatter={(val) => `${val}€`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line 
                  type="stepAfter" 
                  dataKey="Base (Cuota)" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Base"
                />
                {scenarios.map((_, idx) => (
                  <Line 
                    key={idx}
                    type="stepAfter" 
                    dataKey={`E${idx + 1} (Cuota)`} 
                    stroke={colors[idx % colors.length]} 
                    strokeWidth={2} 
                    dot={false} 
                    name={`Escenario ${idx + 1}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TAE Comparison Chart */}
        <div className="bg-card/30 border border-border p-4 rounded-lg space-y-4 lg:col-span-2 cyber-chamfer">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Comparativa de TAE Final
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taeData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#666" 
                  fontSize={10} 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={(val) => `${val.toFixed(2)}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={10} 
                />
                <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {taeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
