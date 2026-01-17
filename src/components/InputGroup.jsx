import React from 'react';
import { Tooltip } from './Tooltip';

export const InputGroup = ({ label, value, onChange, type = 'number', suffix, prefix, min, max, step, error, helpText, id }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1 group">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={inputId} className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-accent'}`} />
          {label}
          {helpText && <Tooltip content={helpText} />}
        </label>
        {error && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-pulse">{error}</span>}
      </div>
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold ${error ? 'text-red-500/50' : 'text-accent/50'}`}>
          {prefix || '>'}
        </div>
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full bg-black/40 border font-numbers text-sm p-2.5 pl-8 outline-none transition-all cyber-chamfer 
            ${error 
              ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-border text-accent focus:border-accent focus:ring-1 focus:ring-accent'
            }`}
          placeholder="0.00"
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`text-xs font-bold ${error ? 'text-red-500/50' : 'text-accent/50'}`}>{suffix}</span>
          </div>
        )}
        {/* Glow effect on focus */}
        <div className={`absolute -inset-0.5 blur opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none cyber-chamfer ${error ? 'bg-red-500/20' : 'bg-accent/20'}`} />
      </div>
    </div>
  );
};