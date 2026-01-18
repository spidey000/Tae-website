import React, { useState } from 'react';
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
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { mergeSchedules } from '../../utils/amortizationEngine';

const COLORS = [
  '#10b981', // emerald-500 (scen0)
  '#3b82f6', // blue-500 (scen1)
  '#a855f7', // purple-500 (scen2)
  '#f59e0b', // amber-500 (scen3)
];

const BASE_COLOR = '#9ca3af'; // gray-400

const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
const formatCurrencyFull = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(val);

const CustomTooltip = ({ active, payload, label, unit = '€' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/10 p-3 rounded shadow-2xl text-xs backdrop-blur-md">
        <p className="text-gray-400 mb-2 font-bold uppercase tracking-wider">Mes {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="font-medium text-gray-200">{entry.name}:</span>
            <span className="font-numbers ml-auto">{formatCurrencyFull(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ComparisonCharts({ base, scenarios, principal }) {
  const [activeTab, setActiveTab] = useState('balance');

  if (!base) return null;

  const chartData = mergeSchedules(
    base.schedule, 
    scenarios.map(s => s.schedule)
  );

  const barData = scenarios.map((scen, idx) => ({
    name: `Escenario ${idx + 1}`,
    Ahorro: scen.totalSavings,
    Inyectado: scen.totalInjected,
    fill: COLORS[idx % COLORS.length]
  }));

  const renderBalanceChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280" 
          tick={{ fontSize: 10 }}
          tickFormatter={(val) => `A${Math.floor(val/12)}`}
          minTickGap={30}
        />
        <YAxis 
          stroke="#6b7280" 
          tick={{ fontSize: 10 }}
          tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
        
        <Line 
          type="monotone" 
          dataKey="base" 
          name="Base" 
          stroke={BASE_COLOR} 
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
        />
        
        {scenarios.map((_, idx) => (
          <Line 
            key={idx}
            type="monotone" 
            dataKey={`scen${idx}`} 
            name={`Escenario ${idx + 1}`} 
            stroke={COLORS[idx % COLORS.length]} 
            strokeWidth={3}
            dot={false}
            animationDuration={1500}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPaymentChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={BASE_COLOR} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={BASE_COLOR} stopOpacity={0}/>
          </linearGradient>
          {scenarios.map((_, idx) => (
            <linearGradient key={idx} id={`colorScen${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280" 
          tick={{ fontSize: 10 }}
          tickFormatter={(val) => `A${Math.floor(val/12)}`}
          minTickGap={30}
        />
        <YAxis 
          stroke="#6b7280" 
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
        
        <Area 
          type="stepAfter" 
          dataKey="basePayment" 
          name="Base" 
          stroke={BASE_COLOR} 
          fillOpacity={1} 
          fill="url(#colorBase)" 
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {scenarios.map((_, idx) => (
          <Area 
            key={idx}
            type="stepAfter" 
            dataKey={`scen${idx}Payment`} 
            name={`Escenario ${idx + 1}`} 
            stroke={COLORS[idx % COLORS.length]} 
            fillOpacity={1} 
            fill={`url(#colorScen${idx})`} 
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderSavingsChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} horizontal={true} vertical={false} />
        <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 10 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          content={<CustomTooltip />}
        />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
        <Bar dataKey="Inyectado" name="Inversión" stackId="a" fill="#4b5563" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Ahorro" name="Ahorro Intereses" stackId="a" radius={[4, 4, 0, 0]}>
           {barData.map((entry, index) => (
             <Area key={`cell-${index}`} fill={entry.fill} />
           ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border-b-2 ${
        activeTab === id 
          ? 'text-white border-accent bg-accent/10' 
          : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Chart Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 bg-black/20 p-1">
        <div className="flex w-full sm:w-auto">
          <TabButton id="balance" label="Saldo" />
          <TabButton id="payment" label="Cuota" />
          <TabButton id="savings" label="Ahorro" />
        </div>
        <div className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest px-4 italic">
          Análisis Visual Proyectado
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-4 sm:p-6 min-h-[400px]">
        <div className="h-[350px] w-full">
           {activeTab === 'balance' && renderBalanceChart()}
           {activeTab === 'payment' && renderPaymentChart()}
           {activeTab === 'savings' && renderSavingsChart()}
        </div>
      </div>

      {/* Insight Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div className="p-4 border border-white/5 bg-card/30 cyber-chamfer text-[10px] text-gray-400 leading-relaxed">
            <span className="text-accent font-bold uppercase mr-2">Proyección:</span>
            Los gráficos muestran la evolución teórica basada en tipos de interés constantes. 
            La estrategia de <span className="text-white">Reducción de Cuota</span> se visualiza como un escalonado descendente en el gráfico de Cuota.
         </div>
         <div className="p-4 border border-white/5 bg-card/30 cyber-chamfer text-[10px] text-gray-400 leading-relaxed">
            <span className="text-accent-secondary font-bold uppercase mr-2">Nota:</span>
            El ahorro acumulado incluye la diferencia de intereses pagados entre el escenario base y el proyectado con amortizaciones.
         </div>
      </div>

    </div>
  );
}