import React from 'react';
import { Info } from 'lucide-react';

export const CoreConceptAnalysis = () => {
  return (
    <div className="col-span-1 lg:col-span-12 relative group mb-10">
      <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent uppercase tracking-widest z-10">
        [ CORE_CONCEPT_ANALYSIS ]
      </div>
      <div className="relative p-6 pt-8">
        <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent uppercase tracking-widest">
          <Info className="h-4 w-4" /> La Verdad sobre TIN vs TAE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-gray-400 font-mono leading-relaxed">
          <div className="space-y-4">
            <p>
              <strong className="text-gray-200">La Tasa Anual Equivalente o TAE</strong> es un indicador en forma de tanto por ciento anual que sirve para comparar el coste efectivo de dos o más préstamos en un plazo concreto, aunque tengan condiciones diferentes.
            </p>
            <div className="p-4 bg-black/20 border-l-2 border-accent">
              <h3 className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">¿Por qué es lo único que importa?</h3>
              <p>
                Porque el TIN es solo el precio del "alquiler" del dinero, pero la TAE incluye <span className="text-gray-200">TODO el coste real</span>: comisiones, seguros, gastos de apertura, etc. Un banco puede darte un TIN bajo para atraerte, pero crujirte a comisiones, disparando la TAE.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider border-b border-border pb-2">Cómo calcular la TAE</h3>
            <p>
              La TAE se expresa en forma de porcentaje y se calcula con una fórmula matemática normalizada en base al:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
              <li><strong className="text-gray-300">Tipo de Interés Nominal (TIN):</strong> El precio base del dinero.</li>
              <li><strong className="text-gray-300">Frecuencia de cuotas:</strong> Mensuales, trimestrales, etc.</li>
              <li><strong className="text-gray-300">Comisiones Bancarias:</strong> Apertura, estudio, etc.</li>
              <li><strong className="text-gray-300">Gastos de la operación:</strong> Tasación, gestoría (si aplica), seguros vinculados.</li>
            </ul>
            <p className="text-[10px] italic mt-2">
              * Nota: Para el cálculo de la TAE se excluyen gastos externos como los de Notaría, ya que no los cobra el banco directamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
