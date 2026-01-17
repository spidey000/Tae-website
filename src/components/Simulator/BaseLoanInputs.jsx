import React from 'react';
import { InputGroup } from '../InputGroup';
import { FileText } from 'lucide-react';

export function BaseLoanInputs({ data, onChange }) {
  const { principal, years, annualTIN } = data;

  return (
    <section className="relative group">
      <div className="absolute inset-0 bg-card border border-border cyber-chamfer pointer-events-none"></div>
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-accent uppercase tracking-widest z-10">
        [ PRESTAMO BASE ]
      </div>
      <div className="relative p-6 pt-8">
        <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-accent-tertiary uppercase tracking-widest">
          <FileText className="h-4 w-4" /> Configuración Inicial
        </h2>
        <div className="space-y-5">
          <InputGroup
            label="Capital Pendiente"
            value={principal}
            onChange={(v) => onChange('principal', v === '' ? '' : Number(v))}
            suffix="EUR"
            min={0}
            step={1000}
            helpText="Dinero que te queda por pagar hoy."
          />
          <InputGroup
            label="Plazo Restante"
            value={years}
            onChange={(v) => onChange('years', v === '' ? '' : Number(v))}
            suffix="Años"
            min={0.5}
            max={50}
            step={0.5}
            helpText="Años que te quedan de hipoteca."
          />
          <InputGroup
            label="Interés Actual (TIN)"
            value={annualTIN}
            onChange={(v) => onChange('annualTIN', v === '' ? '' : Number(v))}
            suffix="%"
            step={0.01}
            helpText="Tu tipo de interés actual."
          />
        </div>
      </div>
    </section>
  );
}
