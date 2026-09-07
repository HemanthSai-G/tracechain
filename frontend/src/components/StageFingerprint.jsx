import React, { useState } from 'react';
import { Fingerprint, Code2, Copy, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function StageFingerprint({ fingerprintData }) {
  const [copied, setCopied] = useState(false);
  const [showCanonical, setShowCanonical] = useState(false);

  if (!fingerprintData?.sha256_hash) {
    return null;
  }

  const handleCopy = () => {
    if (fingerprintData?.bytes32_hex) {
      navigator.clipboard.writeText(fingerprintData.bytes32_hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canonicalBytesLen = fingerprintData?.canonical_json
    ? new TextEncoder().encode(fingerprintData.canonical_json).length
    : 0;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold">
            03
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              CONTENT FINGERPRINT
            </h2>
            <p className="text-[11px] font-sans text-slate-400">
              Creating a deterministic cryptographic fingerprint of discovered evidence.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          SHA-256 GENERATED
        </span>
      </div>

      {/* Compact Visual Sequence Flow */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div className="text-slate-400">DISCOVERED SOURCE</div>
        <div className="text-slate-400">→ CANONICAL CONTENT</div>
        <div className="text-slate-400">→ SHA-256 DIGEST</div>
        <div className="text-cyan-400 font-bold">→ 256-BIT PROOF</div>
      </div>

      {/* Prominent SHA-256 Fingerprint Display */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-cyan-500/40 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            SHA-256 CONTENT FINGERPRINT
          </span>
          <span className="text-emerald-400 font-bold">256 BITS (32 BYTES)</span>
        </div>

        <div className="flex items-center justify-between bg-slate-950/90 p-3 rounded-lg border border-slate-800">
          <code className="text-xs md:text-sm font-extrabold text-cyan-300 tracking-wider break-all select-all">
            {fingerprintData.bytes32_hex}
          </code>
          <button
            onClick={handleCopy}
            className="p-1.5 ml-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            title="Copy SHA-256 Hash"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
          <span>Algorithm: <strong>SHA-256</strong></span>
          <span>Properties: <strong>Deterministic • UTF-8 • Content-Based</strong></span>
          <span>Canonical Length: <strong>{canonicalBytesLen} bytes</strong></span>
        </div>
      </div>

      {/* Collapsible Canonical JSON Panel */}
      <div className="border-t border-slate-800/80 pt-2">
        <button
          onClick={() => setShowCanonical(!showCanonical)}
          className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" /> CANONICAL CONTENT PAYLOAD
          </span>
          {showCanonical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showCanonical && (
          <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-cyan-200/90 max-h-40 overflow-y-auto">
            <pre className="text-[11px] leading-relaxed select-all">
              {fingerprintData.canonical_json}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
