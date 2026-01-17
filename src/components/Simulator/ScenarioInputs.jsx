import React from 'react';
import { InputGroup } from '../InputGroup';
import { Layers } from 'lucide-react';
import { Tooltip } from '../Tooltip';

export function ScenarioInputs({ scenario, onChange, index }) {
  const { injectionAmount, injectionMonth, strategy, injectionFrequency, injectionCount } = scenario;
  const isTerm = strategy === 'reduceTerm';

  return (
    <section className="relative group">
      <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-secondary uppercase tracking-widest z-10">
        [ ESCENARIO {index + 1} ]
      </div>
      <div className="relative p-6 pt-8">
        
        {/* Frequency Selector */}
        <div className="mb-4">
          <label className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">
            Periodicidad
          </label>
          <div className="flex bg-black/40 border border-border rounded p-1 gap-1">
            {[
              { id: 'once', label: 'Puntual' },
              { id: 'monthly', label: 'Mensual' },
              { id: 'yearly', label: 'Anual' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('injectionFrequency', opt.id)}
                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all rounded ${
                  injectionFrequency === opt.id 
                    ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputGroup
            label="Cantidad a Inyectar"
            value={injectionAmount}
            onChange={(v) => onChange('injectionAmount', v === '' ? '' : Number(v))}
            suffix="EUR"
            step={1000}
            helpText="Dinero extra a aportar."
          />
          <InputGroup
            label={injectionFrequency === 'once' ? "Mes de Inyección" : "Mes de Inicio"}
            value={injectionMonth}
            onChange={(v) => onChange('injectionMonth', v === '' ? '' : Number(v))}
            suffix="Mes"
            step={1}
            min={1}
            helpText="Cuándo realizas el primer pago."
          />
        </div>

        {/* Repetitions (Only if not 'once') */}
        {injectionFrequency !== 'once' && (
           <div className="mt-4 animate-in fade-in slide-in-from-top-2">
             <InputGroup
                label="Repeticiones"
                value={injectionCount || ''}
                onChange={(v) => onChange('injectionCount', v === '' ? null : Number(v))}
                type="number"
                placeholder="∞"
                suffix="Veces"
                min={1}
                helpText="Dejar vacío para repetir hasta el final del préstamo."
              />
           </div>
        )}

        {/* Strategy Selector */}
        <div className="mt-6">
          <label className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            Estrategia de Reducción
            <Tooltip content="Elige si quieres terminar antes de pagar o reducir tu cuota mensual actual." />
          </label>
          <div className="flex bg-black/40 border border-border rounded p-1">
            <button
              onClick={() => onChange('strategy', 'reduceTerm')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded flex items-center justify-center gap-1 ${
                isTerm ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Plazo
              {isTerm && <span className="text-[8px] bg-accent/20 px-1 rounded border border-accent/30 hidden sm:inline">Rec</span>}
            </button>
            <button
              onClick={() => onChange('strategy', 'reduceInstallment')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                !isTerm ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Cuota
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            {isTerm 
              ? "Mantienes la cuota mensual, pero terminas de pagar antes." 
              : "Mantienes la fecha fin, pero pagas menos cada mes."}
          </p>
        </div>
      </div>
    </section>
  );
}
