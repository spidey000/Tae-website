import React from 'react';
import { TrendingUp, PiggyBank, AlertTriangle, CheckCircle, Wallet, Shield, Layers, FileText, PieChart, Activity, ArrowRight } from 'lucide-react';

export const ResultsSummary = ({ 
  monthlyPayment, 
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
      
      {/* HEADER: VEREDICTO CLARO */}
      <div className={`p-6 rounded-xl shadow-lg border-l-8 ${isBenefitNegative ? 'bg-orange-50 border-orange-500' : 'bg-green-50 border-green-500'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isBenefitNegative ? 'text-orange-800' : 'text-green-800'}`}>
              {isBenefitNegative ? 'NO TE COMPENSA BONIFICAR' : '¡SÍ, TE AHORRAS DINERO!'}
            </h2>
            <p className="text-gray-700 font-medium">
              {isBenefitNegative 
                ? 'Los seguros te cuestan más de lo que te ahorras en intereses.' 
                : 'El descuento en la hipoteca supera el coste de los seguros.'}
            </p>
          </div>
          {isBenefitNegative ? (
             <AlertTriangle className="w-12 h-12 text-orange-400 opacity-80" />
          ) : (
             <PiggyBank className="w-12 h-12 text-green-500 opacity-80" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOQUE 1: LA CUENTA DE LA VIEJA (Explicación para Dummies) */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            ¿De dónde sale este resultado?
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* LO BUENO: El Ahorro */}
            <div className="flex-1 text-center w-full bg-green-50 p-4 rounded-lg border border-green-100">
              <span className="text-sm font-bold text-green-600 uppercase tracking-wide">Ahorras en Hipoteca</span>
              <div className="text-2xl font-bold text-green-700 my-1">
                {interestSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <p className="text-xs text-gray-500 px-2">
                Al bajar el interés (TAE del {nonBonifiedTAE.toFixed(2)}% al {tae.toFixed(2)}%), pagas menos al banco.
              </p>
            </div>

            {/* EL OPERADOR: Menos */}
            <div className="text-gray-400 font-bold text-xl hidden md:block">-</div>

            {/* LO MALO: El Coste */}
            <div className="flex-1 text-center w-full bg-red-50 p-4 rounded-lg border border-red-100">
              <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Pagas en Seguros</span>
              <div className="text-2xl font-bold text-red-700 my-1">
                {totalProductCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <p className="text-xs text-gray-500 px-2">
                Coste total acumulado de todos los productos vinculados durante el préstamo.
              </p>
            </div>

            {/* EL OPERADOR: Igual */}
            <div className="text-gray-400 font-bold text-xl hidden md:block">=</div>

            {/* EL RESULTADO */}
            <div className={`flex-1 text-center w-full p-4 rounded-lg border-2 ${isBenefitNegative ? 'bg-orange-50 border-orange-300' : 'bg-indigo-50 border-indigo-300'}`}>
              <span className={`text-sm font-bold uppercase tracking-wide ${isBenefitNegative ? 'text-orange-700' : 'text-indigo-700'}`}>
                {isBenefitNegative ? 'Pierdes en total' : 'Beneficio Real'}
              </span>
              <div className={`text-3xl font-extrabold my-1 ${isBenefitNegative ? 'text-red-600' : 'text-indigo-700'}`}>
                {Math.abs(netBenefit).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
              <p className="text-xs text-gray-500">
                {isBenefitNegative ? 'Te sale más barato NO coger los productos.' : 'Dinero que se queda en tu bolsillo.'}
              </p>
            </div>

          </div>
        </div>

        {/* BLOQUE 2: TU PAGO MENSUAL REAL */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-500" /> Tu Letra Mensual "Real"
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <p className="font-semibold text-gray-700">Cuota al Banco</p>
                <p className="text-xs text-gray-400">Hipoteca pura y dura</p>
              </div>
              <span className="font-bold text-gray-800 text-lg">
                {monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white border border-gray-200 rounded-full p-1">
                <span className="text-gray-400 text-xs font-bold">+</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <p className="font-semibold text-gray-700">Extra de Productos</p>
                <p className="text-xs text-gray-400">Seguros, alarmas, etc.</p>
              </div>
              <span className="font-bold text-red-500 text-lg">
                {activeProductsMonthlyCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>

            <div className="pt-4 mt-2 border-t-2 border-dashed border-gray-200">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-gray-800 uppercase">Total a Pagar</p>
                  <p className="text-xs text-gray-500">Lo que sale de tu cuenta cada mes</p>
                </div>
                <span className="text-3xl font-bold text-indigo-900">
                  {(monthlyPayment + activeProductsMonthlyCost).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: LA LUPA EN LOS GASTOS INICIALES */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Gastos "Ocultos" Iniciales
          </h3>
          
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800 border border-blue-100">
             Para pedir <strong>{capital.toLocaleString()}€</strong>, necesitas tener ahorrados otros <strong>{activeInitialExpenses.toLocaleString()}€</strong> para gastos.
          </div>

          <div className="space-y-3">
            {initialExpensesList.length === 0 ? (
               <p className="text-sm text-gray-400 text-center py-4">No has seleccionado gastos de inicio (Notaría, etc).</p>
            ) : (
              initialExpensesList.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <span className="font-bold text-gray-800">
                    {item.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-auto pt-4 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase">Total a desembolsar</span>
            <span className="text-xl font-bold text-indigo-900">
              {activeInitialExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>

        {/* BLOQUE 4: TOTAL DE TOTALES */}
        <div className="col-span-1 md:col-span-2 bg-gray-100 p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <PieChart className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Coste REAL de la Hipoteca</h4>
                <p className="text-sm text-gray-500">Sumando capital, intereses, gastos y seguros.</p>
              </div>
           </div>
           
           <div className="text-right">
              <span className="block text-3xl font-black text-gray-900">
                {totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};
