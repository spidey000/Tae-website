import React from 'react';

export const AmortizationTable = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <div className="p-4 text-center text-accent animate-pulse font-mono tracking-widest uppercase">[ No hay datos ]</div>;
  }

  return (
    <div className="bg-card border border-border cyber-chamfer overflow-hidden flex flex-col h-[500px]">
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-card sticky top-0 z-10">
            <tr className="border-b border-accent/20">
              <th scope="col" className="px-4 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] w-20">
                Mes
              </th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Cuota
              </th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-bold text-accent/60 uppercase tracking-[0.2em]">
                Intereses
              </th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-bold text-accent-secondary/60 uppercase tracking-[0.2em]">
                Capital
              </th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Pendiente
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-border/20 font-numbers tabular-nums">
            {schedule.map((row, index) => (
              <tr 
                key={row.month} 
                className={`hover:bg-accent/5 transition-colors group ${index % 2 === 0 ? 'bg-transparent' : 'bg-black/20'}`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-[11px] text-center text-gray-600 font-bold group-hover:text-accent">
                  {row.month.toString().padStart(3, '0')}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right font-bold">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground text-sm">
                      {row.installment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {(row.payment - row.installment) > 0.01 && (
                      <span className="text-[10px] text-accent font-mono mt-0.5 animate-pulse">
                        +{ (row.payment - row.installment).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-accent/80 font-medium">
                  {row.interest.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-accent-secondary/80 font-medium">
                  {row.amortization.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[11px] text-right text-gray-500 font-numbers opacity-60 group-hover:opacity-100">
                  {row.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};