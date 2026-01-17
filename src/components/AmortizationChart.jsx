import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AmortizationChart = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <div className="h-64 flex items-center justify-center text-accent/50 font-bold uppercase tracking-widest">[ No hay datos ]</div>;
  }

  // Optimize data: Filter to show roughly 1 point per year or every 6 months for large datasets to avoid clutter
  // Or just pass all, Recharts handles it decently. Let's pass all but format XAxis.
  const data = schedule.map(item => ({
    name: item.month,
    balance: item.balance,
    interest: item.interest,
    amortization: item.amortization
  }));

  return (
    <div className="h-64 w-full bg-black/20 border border-border cyber-chamfer p-4 relative">
       {/* Decorators */}
       <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 bg-accent/50" />
       </div>
       <div className="absolute bottom-0 left-0 p-1">
          <div className="w-2 h-2 bg-accent/50" />
       </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff00ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
          <XAxis 
             dataKey="name" 
             stroke="#666" 
             tick={{fontSize: 10, fill: '#666'}} 
             tickFormatter={(val) => `M${val}`}
             interval="preserveStartEnd"
          />
          <YAxis 
             stroke="#666" 
             tick={{fontSize: 10, fill: '#666'}}
             tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#00ff88', color: '#e0e0e0', fontSize: '12px' }}
            itemStyle={{ color: '#00ff88' }}
            formatter={(value) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            labelFormatter={(label) => `Mes ${label}`}
          />
          <Area 
             type="monotone" 
             dataKey="balance" 
             stroke="#00ff88" 
             fillOpacity={1} 
             fill="url(#colorBalance)" 
             strokeWidth={2}
          />
          {/* We could also stack interest paid over time if we accumulated it, but balance drop is most visual */}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
