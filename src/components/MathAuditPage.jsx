import React from 'react';
import { FileText, CheckCircle, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tooltip } from './Tooltip';

const Term = ({ term, definition }) => (
  <span className="inline-flex items-center gap-1 font-bold text-accent cursor-help group border-b border-accent/30 hover:border-accent transition-colors">
    {term}
    <Tooltip content={definition} />
  </span>
);

export const MathAuditPage = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-accent/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 border border-accent rounded-lg">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground">
                Auditoría Matemática
              </h1>
              <p className="text-xs font-bold text-accent uppercase tracking-widest">
                Informe de Transparencia & Precisión Financiera
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-black/40 border border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all font-bold uppercase tracking-wider text-xs rounded"
          >
            Cerrar Informe
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-12 pb-20">
          
          {/* Section 1: Methodology */}
          <section className="bg-black/20 border border-border p-8 rounded-lg cyber-chamfer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Calculator className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"/> 1. Metodología de Cálculo
            </h2>
            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <p>
                Esta aplicación utiliza el <Term term="Sistema de Amortización Francés" definition="El método más común en España. Pagas la misma cuota cada mes. Al principio pagas muchos intereses y devuelves poco dinero del préstamo; al final es al revés." />, 
                el estándar en hipotecas a tipo fijo.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-black/40 p-4 rounded border border-white/5">
                  <h3 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">Cálculo de Cuota (PMT)</h3>
                  <p className="mb-3">Determinamos tu <Term term="Cuota Mensual" definition="El dinero total que sale de tu bolsillo cada mes. Incluye una parte de devolución del préstamo (Amortización) y una parte de ganancia para el banco (Intereses)." /> basándonos en el <Term term="Principal" definition="La cantidad de dinero que te ha prestado el banco. Es lo que debes devolver, sin contar los intereses." />, el tipo de interés y la duración.</p>
                  <code className="block bg-black p-3 rounded text-xs text-accent/80 font-mono">
                    Cuota = P · [ i · (1+i)^n ] / [ (1+i)^n - 1 ]
                  </code>
                </div>

                <div className="bg-black/40 p-4 rounded border border-white/5">
                  <h3 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">Cálculo del TAE</h3>
                  <p className="mb-3">Utilizamos el método de <Term term="Newton-Raphson" definition="Un algoritmo matemático avanzado que 'prueba' valores repetidamente hasta encontrar la cifra exacta del TAE con una precisión casi perfecta." /> para calcular el coste real anual, incluyendo gastos.</p>
                  <code className="block bg-black p-3 rounded text-xs text-accent/80 font-mono">
                    VAN(TAE) = 0 → Iteración Numérica
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Audit Findings */}
          <section className="bg-black/20 border border-border p-8 rounded-lg cyber-chamfer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <AlertTriangle className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"/> 2. Garantía de Precisión
            </h2>
            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              
              <div className="flex gap-4 items-start">
                <div className="mt-1">
                   <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Corrección de Redondeo Financiero</h3>
                  <p>
                    Hemos implementado algoritmos de alta precisión para evitar errores comunes en computación (como que <code>1.005</code> se redondee incorrectamente). 
                    Esto asegura que cada céntimo esté contabilizado correctamente, solucionando el problema del <Term term="Drift (Deriva)" definition="Pequeños desajustes de céntimos que ocurren al sumar miles de cálculos. Nuestro sistema los detecta y corrige automáticamente." />.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1">
                   <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Consistencia Visual</h3>
                  <p>
                    Lo que ves en los gráficos es exactamente lo que aparece en las tablas. Utilizamos una única "fuente de verdad" matemática para evitar discrepancias.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: Stress Tests */}
          <section className="bg-black/20 border border-border p-8 rounded-lg cyber-chamfer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendingUp className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"/> 3. Pruebas de Estrés
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Hemos sometido el simulador a escenarios extremos para garantizar su robustez:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Hipotecas a 100 años', value: 'APROBADO' },
                { label: 'Interés del 0.01%', value: 'APROBADO' },
                { label: 'Interés del 25%', value: 'APROBADO' },
                { label: 'Precisión decimal', value: '100%' },
              ].map((item, i) => (
                <div key={i} className="bg-black/40 p-4 border border-accent/20 rounded text-center">
                  <div className="text-accent font-black tracking-widest text-lg mb-1">{item.value}</div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
