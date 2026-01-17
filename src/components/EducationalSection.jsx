import React from 'react';
import { BookOpen, Divide, Lightbulb, GraduationCap, Activity } from 'lucide-react';

export const EducationalSection = () => {
  return (
    <section className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
      
      {/* GLOSSARY TERMINAL */}
      <div className="relative group">
        <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
        <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent uppercase tracking-widest z-10">
          [ KNOWLEDGE_BASE_01 ]
        </div>
        <div className="relative p-6 pt-8">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent uppercase tracking-widest">
            <BookOpen className="h-4 w-4" /> Glosario para Dummies
          </h2>
          
          <div className="space-y-6 h-96 overflow-y-auto custom-scrollbar pr-4">
            
            <div className="group/item">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full group-hover/item:animate-ping"/> Capital (Principal)
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Es la "pasta" que te presta el banco. Si pides 150.000€, ese es tu capital. Es la deuda pura y dura que tienes que devolver.
              </p>
            </div>

            <div className="group/item">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full group-hover/item:animate-ping"/> TIN (El Precio Oficial)
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Siglas de "Tipo de Interés Nominal". Es el porcentaje que el banco te dice que te cobra. Si es un 3%, significa que cada año pagas un 3% de lo que te queda por devolver. ¡Ojo! No incluye gastos ni seguros.
              </p>
            </div>

            <div className="group/item">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full group-hover/item:animate-ping"/> TAE (La Verdad Dolorosa)
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Siglas de "Tasa Anual Equivalente". Es el chivato. Incluye el TIN, pero SUMA las comisiones, los seguros obligatorios y los gastos de apertura. Si el TIN es bajo pero la TAE es alta, te la están colando por otro lado.
              </p>
            </div>

            <div className="group/item">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full group-hover/item:animate-ping"/> Bonificación (El Gancho)
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                El banco te dice: "Si contratas mi seguro y traes tu nómina, te bajo el interés". Eso es bonificar. Parece un regalo, pero a veces el seguro es tan caro que no compensa la bajada de interés.
              </p>
            </div>

            <div className="group/item">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full group-hover/item:animate-ping"/> Sistema de Amortización Francés
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Es el estándar en España. Significa que pagas SIEMPRE la misma cuota cada mes. Al principio, casi todo lo que pagas son intereses (ganancia del banco) y poco capital. Al final, pagas casi todo capital y pocos intereses.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* MATH TERMINAL */}
      <div className="relative group">
        <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
        <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-secondary uppercase tracking-widest z-10">
          [ MATH_CORE_02 ]
        </div>
        <div className="relative p-6 pt-8">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-secondary uppercase tracking-widest">
            <Divide className="h-4 w-4" /> Matemáticas Explicadas (Sin Dolor)
          </h2>
          
          <div className="space-y-6 h-96 overflow-y-auto custom-scrollbar pr-4">
            
            <div className="bg-black/20 p-4 border-l-2 border-accent-secondary/50">
              <h3 className="text-xs font-bold text-accent-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lightbulb className="w-3 h-3" /> ¿Cómo se calcula tu cuota?
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed mb-3">
                Usamos una fórmula "mágica" (Anualidad Constante) que equilibra todo para que pagues lo mismo mes a mes.
              </p>
              <div className="bg-black/40 p-2 rounded text-[10px] font-mono text-gray-500 overflow-x-auto whitespace-nowrap mb-2">
                Cuota = Capital * ( i * (1+i)^n ) / ( (1+i)^n - 1 )
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Donde "i" es el interés mensual (TIN / 12) y "n" es el número total de meses. Básicamente: Cuanto más tiempo pidas, más sube "n" y baja la cuota, pero pagas MUCHOS más intereses en total.
              </p>
            </div>

            <div className="bg-black/20 p-4 border-l-2 border-accent-tertiary/50">
              <h3 className="text-xs font-bold text-accent-tertiary uppercase tracking-wider mb-2 flex items-center gap-2">
                <GraduationCap className="w-3 h-3" /> El misterio de los intereses
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed mb-2">
                Cada mes, el banco mira cuánto le debes TODAVÍA y le aplica el interés mensual.
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500 font-mono space-y-1 pl-1">
                <li>Interés del Mes = (Lo que debes) * (Interés Anual / 12)</li>
                <li>Lo que amortizas = (Tu Cuota Fija) - (Interés del Mes)</li>
              </ul>
              <p className="text-[10px] text-gray-400 mt-2">
                <span className="font-bold text-accent-tertiary">Efecto Bola de Nieve:</span> Como al principio debes mucho, el interés es alto y amortizas poco. Conforme debes menos, el interés baja y amortizas más rápido.
              </p>
            </div>

            <div className="bg-black/20 p-4 border-l-2 border-red-500/50">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3" /> ¿Qué hace el Simulador? (TAE)
              </h3>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Para calcular la TAE real, el simulador hace una "ingeniería inversa". Pregunta: "¿Si tengo en cuenta que pagas 300€ de tasación hoy, y 20€ de seguro cada mes durante 25 años... cuál es el interés REAL equivalente?".
              </p>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                Usa un algoritmo llamado <strong>Newton-Raphson</strong> que prueba millones de combinaciones por segundo hasta encontrar el porcentaje exacto que hace que las cuentas cuadren. Es la única forma de no mentirte.
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
