import React from 'react';
import { ShieldCheck, HelpCircle, Cpu, RotateCcw, Sparkles } from 'lucide-react';

export default function Navbar({
  onNewInvestigation,
  onOpenHowItWorks,
  onOpenTechDetails,
  isInvestigating
}) {
  return (
    <header className="bg-[#05100a]/90 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#05100a] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-base md:text-lg tracking-wider text-slate-100">
                TRACECHAIN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                AI × WEB × BLOCKCHAIN
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 hidden sm:block">
              FROM FACE TO SOURCE. FROM SOURCE TO PROOF.
            </p>
          </div>
        </div>

        {/* Status Badge & Action Navigation */}
        <div className="flex items-center gap-2 md:gap-3 font-mono text-xs">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM ONLINE
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="px-3 py-1.5 rounded-xl border border-emerald-900/40 bg-[#0d2818]/60 hover:bg-[#1b4332] text-slate-200 transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          <button
            onClick={onOpenTechDetails}
            className="px-3 py-1.5 rounded-xl border border-emerald-900/40 bg-[#0d2818]/60 hover:bg-[#1b4332] text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Technical Details</span>
          </button>

          <button
            onClick={onNewInvestigation}
            disabled={isInvestigating}
            className="px-3.5 py-1.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Investigation</span>
          </button>
        </div>
      </div>
    </header>
  );
}
