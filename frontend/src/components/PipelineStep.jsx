import React from 'react';
import { CheckCircle2, Circle, XCircle, Sparkles, Loader2 } from 'lucide-react';

export default function PipelineStep({
  number,
  title,
  subtext,
  status, // WAITING | PROCESSING | SUCCESS | FAILED
  isLast = false
}) {
  return (
    <div className="flex items-center gap-2 relative group flex-1 min-w-[120px]">
      <div
        className={`p-3 rounded-2xl border transition-all duration-300 w-full font-mono ${
          status === 'SUCCESS'
            ? 'bg-[#0d2818]/90 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/40'
            : status === 'PROCESSING'
            ? 'bg-[#1b4332]/90 border-cyan-400/60 text-cyan-200 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/40'
            : status === 'FAILED'
            ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
            : 'bg-[#05100a]/60 border-emerald-900/30 text-slate-500'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            {number} {title}
          </span>
          {status === 'SUCCESS' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : status === 'PROCESSING' ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          ) : status === 'FAILED' ? (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          )}
        </div>
        <p className="text-[11px] font-sans font-medium truncate text-slate-300">
          {subtext}
        </p>
      </div>

      {!isLast && (
        <div className="hidden lg:block w-4 h-[2px] bg-emerald-900/40 shrink-0" />
      )}
    </div>
  );
}
