import React from 'react';

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex justify-center border-b border-white/10 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all relative
            ${activeTab === tab.id 
              ? 'text-accent' 
              : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
}
