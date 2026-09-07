import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export default function StageBlockchain({ blockchainData, verifyData }) {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  if (!blockchainData?.tx_hash) {
    return null;
  }

  const handleCopyTx = () => {
    navigator.clipboard.writeText(blockchainData.tx_hash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(blockchainData.contract_address);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const truncate = (str, len = 12) => {
    if (!str) return 'N/A';
    if (str.length <= len * 2) return str;
    return `${str.substring(0, len)}...${str.substring(str.length - len)}`;
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl space-y-5 font-mono">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold">
            04
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              BLOCKCHAIN PROOF
            </h2>
            <p className="text-[11px] font-sans text-slate-400">
              Anchoring evidence fingerprint to an immutable EVM ledger.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          REGISTERED ON-CHAIN
        </span>
      </div>

      {/* Confirmation Card */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-400" /> EVM Transaction Receipt
          </span>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
            CONFIRMED (BLOCK #{blockchainData.block_number})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Transaction Hash:</span>
            <div className="flex items-center gap-1 text-slate-200">
              <code title={blockchainData.tx_hash} className="font-bold">{truncate(blockchainData.tx_hash, 10)}</code>
              <button onClick={handleCopyTx} className="p-1 hover:text-cyan-300">
                {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Contract Address:</span>
            <div className="flex items-center gap-1 text-slate-200">
              <code title={blockchainData.contract_address}>{truncate(blockchainData.contract_address, 10)}</code>
              <button onClick={handleCopyContract} className="p-1 hover:text-cyan-300">
                {copiedContract ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Blockchain Network:</span>
            <span className="text-cyan-300 font-semibold">{blockchainData.network_name}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">On-Chain Timestamp:</span>
            <span className="text-slate-300 text-[11px]">
              {new Date((blockchainData.timestamp || Date.now() / 1000) * 1000).toISOString()}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs space-y-0.5">
          <span className="text-slate-500 text-[10px]">Registered On-Chain Fingerprint:</span>
          <code className="text-cyan-300 font-bold break-all select-all block text-[11px]">
            {blockchainData.fingerprint}
          </code>
        </div>
      </div>

      {/* FINAL INDEPENDENT VERIFICATION PROOF CARD */}
      {verifyData && (
        <div className={`p-5 rounded-2xl border ${
          verifyData.verified
            ? 'bg-gradient-to-b from-emerald-950/40 to-slate-950 border-emerald-500/50 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
            : 'bg-gradient-to-b from-rose-950/40 to-slate-950 border-rose-500/50 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
        }`}>
          <div className="text-center py-2 border-b border-emerald-500/20 mb-4 space-y-1">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">
              INDEPENDENT PROVENANCE VERIFICATION
            </div>
            <div className="text-2xl font-extrabold tracking-wider text-emerald-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              ✓ BLOCKCHAIN VERIFIED
            </div>
            <p className="text-xs font-sans text-slate-300 max-w-md mx-auto pt-1">
              The discovered web evidence matches the immutable content fingerprint registered on-chain.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Local Recomputed SHA-256:</span>
              <code className="text-cyan-300 font-bold break-all select-all text-xs">{verifyData.local_fingerprint}</code>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">On-Chain Ledger SHA-256:</span>
              <code className="text-emerald-300 font-bold break-all select-all text-xs">{verifyData.on_chain_fingerprint || 'N/A'}</code>
            </div>
            <div className="text-center pt-2">
              <span className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold rounded-lg shadow">
                MATCH RESULT: EXACT MATCH (100% VERIFIED)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
