import React from 'react';

export const AmortizationTable = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <div className="p-4 text-center text-gray-500">No hay datos de amortización disponibles.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-[500px]">
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                Mes
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cuota Total
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider text-indigo-700">
                Intereses
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider text-green-700">
                Amortización
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Capital Pendiente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {schedule.map((row, index) => (
              <tr 
                key={row.month} 
                className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500 font-medium">
                  {row.month}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                  {row.payment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-600">
                  {row.interest.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-600">
                  {row.amortization.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-700 font-mono">
                  {row.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
