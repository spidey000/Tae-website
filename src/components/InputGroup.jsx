import React from 'react';

export const InputGroup = ({ label, value, onChange, type = 'number', suffix, prefix, min, max, step }) => {
  return (
    <div className="flex flex-col gap-1 group">
      <label className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-accent/50 font-bold">
          {prefix || '>'}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full bg-black/40 border border-border text-accent font-mono text-sm p-2.5 pl-8 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all cyber-chamfer"
          placeholder="0.00"
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-accent/50 text-xs font-bold">{suffix}</span>
          </div>
        )}
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 bg-accent/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none cyber-chamfer" />
      </div>
    </div>
  );
};