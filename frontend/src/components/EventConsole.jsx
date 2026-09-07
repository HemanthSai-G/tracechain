import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export default function EventConsole({ logs, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-950/90 flex items-center justify-between text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <span className="flex items-center gap-2 font-bold text-xs">
          <Terminal className="w-4 h-4 text-cyan-400" />
          LIVE INVESTIGATION LOG ({logs.length} EVENTS)
        </span>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 max-h-48 overflow-y-auto space-y-1 text-[11px]">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={
                log.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : log.type === 'error'
                  ? 'text-rose-400 font-semibold'
                  : log.type === 'warn'
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
