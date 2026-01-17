import React from 'react';
import { InputGroup } from '../InputGroup';
import { Layers } from 'lucide-react';

export function ScenarioInputs({ scenario, onChange, index }) {
  const { name, injectionAmount, injectionMonth, strategy } = scenario;
  const isTerm = strategy === 'reduceTerm';

  return (
    <section className="relative group">
      <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent-secondary uppercase tracking-widest z-10">
        [ ESCENARIO {index + 1} ]
      </div>
      <div className="relative p-6 pt-8">
        <InputGroup
          label="Nombre del Escenario"
          value={name}
          onChange={(v) => onChange('name', v)}
          type="text"
          prefix=" "
          helpText="Etiqueta para identificar esta simulación."
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputGroup
            label="Cantidad a Inyectar"
            value={injectionAmount}
            onChange={(v) => onChange('injectionAmount', Number(v))}
            suffix="EUR"
            step={1000}
            helpText="Dinero extra que pagas de golpe."
          />
          <InputGroup
            label="Mes de Inyección"
            value={injectionMonth}
            onChange={(v) => onChange('injectionMonth', Number(v))}
            suffix="Mes"
            step={1}
            min={1}
            helpText="Cuándo realizas el pago (Mes 1 = primer pago)."
          />
        </div>

        {/* Strategy Selector */}
        <div className="mt-6">
          <label className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">
            Estrategia de Reducción
          </label>
          <div className="flex bg-black/40 border border-border rounded p-1">
            <button
              onClick={() => onChange('strategy', 'reduceTerm')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                isTerm ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Reducir Plazo
            </button>
            <button
              onClick={() => onChange('strategy', 'reduceInstallment')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                !isTerm ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Reducir Cuota
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
