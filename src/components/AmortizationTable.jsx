import React from 'react';

export const AmortizationTable = ({ schedule }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-[450px]">
      <div className="flex items-center bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 flex-shrink-0 pr-2">
        <div className="w-16 text-center">Mes</div>
        <div className="flex-1 text-right px-2">Cuota</div>
        <div className="flex-1 text-right px-2">Interés</div>
        <div className="flex-1 text-right px-2">Capital</div>
        <div className="flex-1 text-right pr-4">Pendiente</div>
      </div>
      <div className="overflow-y-auto flex-1">
        {schedule.map((row, index) => (
          <div key={row.month} className={`flex items-center text-sm border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="w-16 text-center text-gray-500 py-2">{row.month}</div>
            <div className="flex-1 text-right text-gray-900 py-2 px-2">{row.payment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
            <div className="flex-1 text-right text-indigo-600 py-2 px-2">{row.interest.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
            <div className="flex-1 text-right text-green-600 py-2 px-2">{row.amortization.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
            <div className="flex-1 text-right text-gray-900 py-2 pr-4">{row.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
          </div>
        ))}
      </div>
    </div>
  );
};