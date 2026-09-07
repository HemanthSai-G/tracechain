import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

export default function BlockchainProof({ blockchainData }) {
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
    <div className="card-goa p-5 space-y-4 font-mono">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-bold">
            04
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              BLOCKCHAIN PROOF
            </h2>
            <p className="text-[11px] font-sans text-slate-400">
              Anchoring the evidence fingerprint to an immutable ledger.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          ✓ REGISTERED ON-CHAIN
        </span>
      </div>

      {/* Confirmation Box */}
      <div className="bg-[#05100a] p-4 rounded-xl border border-emerald-900/40 space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2 text-xs">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" /> EVM Transaction Receipt
          </span>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            CONFIRMED (BLOCK #{blockchainData.block_number})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Transaction Hash:</span>
            <div className="flex items-center gap-1 text-slate-200">
              <code title={blockchainData.tx_hash} className="font-bold">{truncate(blockchainData.tx_hash, 10)}</code>
              <button onClick={handleCopyTx} className="p-1 hover:text-emerald-300">
                {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Contract Address:</span>
            <div className="flex items-center gap-1 text-slate-200">
              <code title={blockchainData.contract_address}>{truncate(blockchainData.contract_address, 10)}</code>
              <button onClick={handleCopyContract} className="p-1 hover:text-emerald-300">
                {copiedContract ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Network:</span>
            <span className="text-cyan-300 font-semibold">{blockchainData.network_name}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[10px]">Timestamp:</span>
            <span className="text-slate-300 text-[11px]">
              {new Date((blockchainData.timestamp || Date.now() / 1000) * 1000).toISOString()}
            </span>
          </div>
        </div>

        <div className="bg-[#0d2818]/60 p-2.5 rounded-lg border border-emerald-900/60 text-xs space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold">On-Chain Fingerprint:</span>
          <code className="text-emerald-300 font-bold break-all select-all block text-[11px]">
            {blockchainData.fingerprint}
          </code>
        </div>
      </div>
    </div>
  );
}
