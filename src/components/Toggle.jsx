import React from 'react';

export const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-14 items-center transition-all focus:outline-none border ${
        enabled ? 'bg-accent/20 border-accent shadow-[0_0_10px_rgba(0,255,136,0.3)]' : 'bg-muted border-border'
      }`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} // Sharp edges
    >
      <span className={`absolute text-[8px] font-bold uppercase ${
        enabled ? 'left-1.5 text-accent' : 'right-1.5 text-gray-500'
      }`}>
        {enabled ? 'on' : 'off'}
      </span>
      <span
        className={`inline-block h-3 w-3 transform bg-white transition-transform ${
          enabled ? 'translate-x-10 bg-accent shadow-[0_0_5px_#fff]' : 'translate-x-1 bg-gray-600'
        }`}
      />
    </button>
  );
};