import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export default function LiveLog({ logs, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-borderNeutral bg-paper font-mono text-xs">
      {/* COLLAPSED BAR HEADER */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-borderNeutral select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-charcoal hover:text-forest transition-colors font-medium"
        >
          <Terminal className="w-3.5 h-3.5 text-forest" />
          <span>LIVE LOG</span>
          <span className="text-[10px] text-charcoal-muted border border-borderNeutral px-1.5 py-0.2">
            {logs.length} EVENTS
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <button
            onClick={onClear}
            className="text-[11px] text-charcoal-muted hover:text-accentFailure flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* EXPANDED CONTENT AREA */}
      {isOpen && (
        <div className="p-4 max-h-48 overflow-y-auto bg-paper space-y-1 text-[11px]">
          {logs.map((log, index) => {
            let color = 'text-charcoal-muted';
            if (log.type === 'success') color = 'text-forest font-medium';
            if (log.type === 'error') color = 'text-accentFailure font-medium';
            if (log.type === 'warn') color = 'text-ocean font-medium';

            return (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-charcoal-light select-none shrink-0">
                  [{log.timestamp}]
                </span>
                <span className={`${color} break-all font-mono-code`}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
