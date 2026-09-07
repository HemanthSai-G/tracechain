import React from 'react';
import { ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function VerificationCard({ verifyData }) {
  if (!verifyData) return null;

  return (
    <div className={`p-6 md:p-8 rounded-3xl border font-mono transition-all duration-500 ${
      verifyData.verified
        ? 'bg-gradient-to-b from-[#0d2818] via-[#081c15] to-[#05100a] border-emerald-500/50 text-emerald-200 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
        : 'bg-gradient-to-b from-rose-950/60 via-[#18111e] to-[#05100a] border-rose-500/50 text-rose-200 shadow-[0_0_40px_rgba(244,63,94,0.2)]'
    }`}>
      <div className="text-center space-y-3 pb-4 border-b border-emerald-500/20">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          verifyData.verified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
        }`}>
          {verifyData.verified ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
          {verifyData.verified ? '✓ BLOCKCHAIN VERIFIED' : '❌ VERIFICATION FAILED'}
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-slate-100 uppercase">
          {verifyData.verified ? 'THE EVIDENCE MATCHES THE ON-CHAIN PROOF.' : 'CRYPTOGRAPHIC FINGERPRINT MISMATCH.'}
        </h2>

        <p className="text-xs md:text-sm font-sans text-slate-300 max-w-xl mx-auto">
          {verifyData.verified
            ? 'The locally recomputed fingerprint matches the cryptographic fingerprint registered on the blockchain.'
            : 'The recomputed content fingerprint does not match the registered on-chain record.'}
        </p>
      </div>

      {/* Hash Comparison Table */}
      <div className="mt-5 space-y-3 text-xs">
        <div className="bg-[#05100a] p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">LOCAL RECOMPUTED SHA-256:</span>
          <code className="text-cyan-300 font-extrabold text-xs md:text-sm break-all select-all block">{verifyData.local_fingerprint}</code>
        </div>

        <div className="bg-[#05100a] p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">ON-CHAIN LEDGER SHA-256:</span>
          <code className="text-emerald-300 font-extrabold text-xs md:text-sm break-all select-all block">{verifyData.on_chain_fingerprint || 'N/A'}</code>
        </div>

        <div className="text-center pt-2">
          <span className={`inline-block px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-wider border shadow-lg ${
            verifyData.verified
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-950/40'
          }`}>
            {verifyData.verified ? 'STATUS: ✓ VERIFIED (100% MATCH)' : 'STATUS: ❌ FAILED (TAMPERED)'}
          </span>
        </div>
      </div>
    </div>
  );
}
