import React, { useState } from 'react';
import { Fingerprint, Code2, Copy, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function FingerprintCard({ fingerprintData }) {
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
    <div className="card-goa p-5 space-y-4 font-mono">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-bold">
            03
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              CONTENT FINGERPRINT
            </h2>
            <p className="text-[11px] font-sans text-slate-400">
              Creating a deterministic cryptographic fingerprint of the discovered evidence.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          SHA-256 GENERATED
        </span>
      </div>

      {/* Visual Sequence Flow */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center bg-[#05100a] p-2.5 rounded-xl border border-emerald-900/40">
        <div className="text-slate-400">DISCOVERED CONTENT</div>
        <div className="text-slate-400">→ CANONICAL JSON</div>
        <div className="text-slate-400">→ SHA-256 DIGEST</div>
        <div className="text-emerald-400 font-bold">→ 256-BIT FINGERPRINT</div>
      </div>

      {/* SHA-256 Hash Box */}
      <div className="bg-[#05100a] p-4 rounded-xl border border-emerald-500/40 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            SHA-256 FINGERPRINT
          </span>
          <span className="text-cyan-300 font-bold">256 BITS (32 BYTES)</span>
        </div>

        <div className="flex items-center justify-between bg-[#0d2818]/60 p-3 rounded-lg border border-emerald-900/60">
          <code className="text-xs md:text-sm font-extrabold text-emerald-300 tracking-wider break-all select-all">
            {fingerprintData.bytes32_hex}
          </code>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 ml-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors shrink-0 text-xs flex items-center gap-1 font-bold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span>COPY HASH</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
          <span>Algorithm: <strong>SHA-256</strong></span>
          <span>Properties: <strong>Deterministic • UTF-8 • Content-Based</strong></span>
          <span>Canonical Length: <strong>{canonicalBytesLen} bytes</strong></span>
        </div>
      </div>

      {/* Collapsible Canonical Content */}
      <div className="pt-1">
        <button
          onClick={() => setShowCanonical(!showCanonical)}
          className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" /> VIEW CANONICAL CONTENT (JSON)
          </span>
          {showCanonical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showCanonical && (
          <div className="mt-2 p-3 bg-[#05100a] rounded-lg border border-emerald-900/40 text-xs text-emerald-200/90 max-h-40 overflow-y-auto">
            <pre className="text-[11px] leading-relaxed select-all">
              {fingerprintData.canonical_json}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
