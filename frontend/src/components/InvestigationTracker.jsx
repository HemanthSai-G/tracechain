import React from 'react';
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

export default function InvestigationTracker({
  currentStep,
  faceData,
  searchData,
  fingerprintData,
  blockchainData,
  verifyData
}) {
  const steps = [
    {
      id: 1,
      num: '01',
      name: 'FACE SCAN',
      sub: faceData?.success ? 'Face Detected' : 'Scan Target',
      isDone: Boolean(faceData?.success),
      isActive: currentStep === 1
    },
    {
      id: 2,
      num: '02',
      name: 'WEB DISCOVERY',
      sub: searchData?.matched_candidate ? 'Match Discovered' : 'Google Lens Search',
      isDone: Boolean(searchData?.matched_candidate),
      isActive: currentStep === 2
    },
    {
      id: 3,
      num: '03',
      name: 'SHA-256 FINGERPRINT',
      sub: fingerprintData?.bytes32_hex ? 'Hash Generated' : 'Canonical UTF-8',
      isDone: Boolean(fingerprintData?.bytes32_hex),
      isActive: currentStep === 3
    },
    {
      id: 4,
      num: '04',
      name: 'BLOCKCHAIN PROOF',
      sub: verifyData?.verified ? 'Verified On-Chain' : 'EVM Smart Contract',
      isDone: Boolean(verifyData?.verified),
      isActive: currentStep === 4
    }
  ];

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-lg font-mono">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`p-3 rounded-lg border transition-all ${
              s.isDone
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : s.isActive
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {s.num} {s.name}
              </span>
              {s.isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : s.isActive ? (
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-600" />
              )}
            </div>
            <p className="text-[11px] font-sans font-medium truncate">
              {s.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
