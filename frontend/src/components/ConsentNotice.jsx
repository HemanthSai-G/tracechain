import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ConsentNotice() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 px-4 flex items-center justify-between text-xs font-mono text-amber-300 mb-6">
      <div className="flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="text-amber-200 uppercase font-semibold">Demo Mode Notice:</strong> Use only faces and media content you have explicit authorization to process.
        </span>
      </div>
      <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-semibold hidden md:inline">
        Consented Biometrics Policy Enforced
      </span>
    </div>
  );
}
