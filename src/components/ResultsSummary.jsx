import React from 'react';

export const ResultsSummary = ({ monthlyPayment, finalTIN, tae, totalCost }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-md">
          <p className="text-sm text-indigo-700 font-medium">Cuota Mensual</p>
          <p className="text-2xl font-bold text-indigo-900">{monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700 font-medium">TAE Real</p>
          <p className="text-2xl font-bold text-green-900">{tae.toFixed(2)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 font-medium">TIN Final</p>
          <p className="text-xl font-bold text-gray-900">{finalTIN.toFixed(2)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 font-medium">Coste Total</p>
          <p className="text-xl font-bold text-gray-900">{totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
        </div>
      </div>
    </div>
  );
};
