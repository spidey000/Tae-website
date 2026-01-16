import React from 'react';
import { TrendingUp, PiggyBank, AlertTriangle, CheckCircle, Wallet, Shield, Layers, FileText, PieChart, Activity } from 'lucide-react';

export const ResultsSummary = ({ 
  monthlyPayment, 
  finalTIN, 
  tae, 
  totalCost, 
  nonBonifiedTAE, 
  interestSavings, 
  totalProductCost, 
  netBenefit,
  activeProductsMonthlyCost,
  activeInitialExpenses,
  initialExpensesList,
  capital,
  totalInterestBonified
}) => {

  const isBenefitNegative = netBenefit < 0;
  const expensesPercentage = (activeInitialExpenses / capital) * 100;

  return (
    <div className="space-y-6">
      
      {/* HEADER DASHBOARD */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600" />
          Análisis de Viabilidad Financiera
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Evaluación de impacto de productos vinculados y punto de equilibrio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOQUE 1: EFICIENCIA DE BONIFICACIONES */}
        <div className={`col-span-1 md:col-span-2 p-6 rounded-xl shadow-md border ${isBenefitNegative ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Eficiencia de Bonificaciones
            </h3>
            {isBenefitNegative ? (
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-orange-200">
                <AlertTriangle className="w-3 h-3" /> No Compensa
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">
                <CheckCircle className="w-3 h-3" /> Ahorro Confirmado
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white bg-opacity-60 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Diferencial TAE</p>
              <div className="mt-1">
                <span className="text-sm text-gray-400 line-through mr-2">{nonBonifiedTAE.toFixed(2)}%</span>
                <span className={`text-lg font-bold ${isBenefitNegative ? 'text-orange-600' : 'text-green-600'}`}>
                  {tae.toFixed(2)}%
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Sin bonificar vs Real</p>
            </div>

            <div className="p-3 bg-white bg-opacity-60 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Ahorro Intereses</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {interestSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-400">Bruto (toda la vida)</p>
            </div>

            <div className="p-3 bg-white bg-opacity-60 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold">Coste Productos</p>
              <p className="text-lg font-bold text-red-500 mt-1">
                -{totalProductCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-400">Suma total cuotas</p>
            </div>

            <div className={`p-3 rounded border ${isBenefitNegative ? 'bg-white border-orange-300 shadow-sm' : 'bg-green-50 border-green-200'}`}>
              <p className="text-xs text-gray-700 uppercase font-bold">Beneficio Neto Real</p>
              <p className={`text-xl font-extrabold mt-1 ${isBenefitNegative ? 'text-red-600' : 'text-green-700'}`}>
                {netBenefit.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-500">
                {isBenefitNegative ? 'Pierdes dinero con los productos' : 'Ganancia real tras costes'}
              </p>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: DESGLOSE MENSUAL */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-500" /> Desglose Cuota Mensual
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Cuota Hipotecaria</span>
              </div>
              <span className="font-bold text-gray-800">
                {monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Carga Vinculación</span>
              </div>
              <span className="font-bold text-red-500 text-sm">
                +{activeProductsMonthlyCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Desembolso Total Mes</p>
                <p className="text-[10px] text-gray-400">Lo que sale de tu banco</p>
              </div>
              <span className="text-2xl font-bold text-indigo-900">
                {(monthlyPayment + activeProductsMonthlyCost).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: AUDITORÍA GASTOS INICIALES */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Gastos de Constitución
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
               <span>Impacto sobre Capital</span>
               <span>{expensesPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(expensesPercentage, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {initialExpensesList.length === 0 ? (
               <p className="text-sm text-gray-400 text-center py-2">Sin gastos iniciales seleccionados.</p>
            ) : (
              initialExpensesList.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-800">
                    {item.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Gastos</span>
            <span className="font-bold text-indigo-900">
              {activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>

        {/* BLOQUE 4: MÉTRICAS CICLO DE VIDA */}
        <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200">
           <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-600" /> Proyección a Largo Plazo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Intereses</p>
              <p className="text-xl font-bold text-indigo-600">
                {totalInterestBonified.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-400">Coste financiero del dinero</p>
            </div>
            
            <div className="md:border-l md:border-r border-gray-200 px-4">
              <p className="text-xs text-gray-500 uppercase font-semibold">Capital + Intereses</p>
              <p className="text-xl font-bold text-gray-800">
                {(capital + totalInterestBonified).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-400">Total a devolver al banco</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Coste Real Operación</p>
              <p className="text-xl font-extrabold text-gray-900">
                {totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] text-gray-400">Incluyendo gastos y productos</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};