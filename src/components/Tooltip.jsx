import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const Tooltip = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2 z-50">
      <button
        type="button"
        className="text-accent/50 hover:text-accent transition-colors focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="w-3 h-3" />
      </button>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-accent text-[10px] text-gray-300 font-mono rounded shadow-[0_0_10px_rgba(0,0,0,0.8)] z-50 pointer-events-none">
          {content}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-accent transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};
