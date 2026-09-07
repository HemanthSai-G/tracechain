import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function TamperTest({
  tamperData,
  onRunTamperTest,
  isLoading,
  canRun
}) {
  const [copiedOrig, setCopiedOrig] = useState(false);
  const [copiedTamp, setCopiedTamp] = useState(false);
  const [copiedChain, setCopiedChain] = useState(false);

  if (!canRun) return null;

  const handleCopy = (text, setFn) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setFn(true);
      setTimeout(() => setFn(false), 2000);
    }
  };

  const origHash = tamperData?.original_fingerprint;
  const tampHash = tamperData?.tampered_fingerprint;
  const chainHash = tamperData?.on_chain_fingerprint;

  const origVerified = tamperData?.original_verified ?? (origHash && chainHash && origHash.toLowerCase() === chainHash.toLowerCase());
  const tampVerified = tamperData?.tampered_verified ?? (tampHash && chainHash && tampHash.toLowerCase() === chainHash.toLowerCase());

  return (
    <div className="border-t border-borderNeutral pt-6 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs tracking-widest uppercase text-forest font-semibold">
            FORENSIC SIMULATION
          </h3>
          <p className="text-sm font-semibold text-charcoal font-sans">
            TAMPER TEST
          </p>
          <p className="text-xs text-charcoal-muted font-sans">
            Change one character and verify whether the blockchain proof detects it.
          </p>
        </div>

        <button
          onClick={onRunTamperTest}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 border border-accentFailure text-accentFailure hover:bg-accentFailure hover:text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Running Test...' : 'RUN TAMPER TEST'}</span>
        </button>
      </div>

      {tamperData && (
        <div className="border border-accentFailure/50 bg-white p-5 space-y-5 text-xs">
          {/* SECTION 1: ORIGINAL EVIDENCE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-charcoal tracking-wider">01 ORIGINAL EVIDENCE</span>
              <button
                onClick={() => handleCopy(origHash, setCopiedOrig)}
                className="inline-flex items-center space-x-1 text-charcoal-muted hover:text-forest transition-colors text-[10px]"
              >
                {copiedOrig ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOrig ? 'Copied ✓' : 'COPY ORIGINAL HASH'}</span>
              </button>
            </div>

            <div className="p-2.5 bg-paper border border-borderNeutral font-sans text-xs text-charcoal">
              <span className="text-[10px] font-mono text-charcoal-muted uppercase block font-semibold mb-0.5">Caption Payload:</span>
              "{tamperData.original_content?.text_caption || 'Original evidence payload'}"
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-charcoal-muted uppercase block font-semibold">ORIGINAL SHA-256 FINGERPRINT</span>
              <div className="p-2.5 bg-paper border border-borderNeutral font-mono-code text-xs text-charcoal break-all select-all">
                {origHash}
              </div>
            </div>
          </div>

          {/* SECTION 2: TAMPERED EVIDENCE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-accentFailure tracking-wider">02 TAMPERED EVIDENCE (1-CHAR MUTATION)</span>
              <button
                onClick={() => handleCopy(tampHash, setCopiedTamp)}
                className="inline-flex items-center space-x-1 text-charcoal-muted hover:text-forest transition-colors text-[10px]"
              >
                {copiedTamp ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTamp ? 'Copied ✓' : 'COPY TAMPERED HASH'}</span>
              </button>
            </div>

            <div className="p-2.5 bg-paper border border-accentFailure/30 font-sans text-xs text-accentFailure font-medium">
              <span className="text-[10px] font-mono text-accentFailure uppercase block font-semibold mb-0.5">Mutated Caption Payload:</span>
              "{tamperData.tampered_content?.text_caption || 'Mutated evidence payload'}"
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-accentFailure uppercase block font-semibold">TAMPERED SHA-256 FINGERPRINT</span>
              <div className="p-2.5 bg-paper border border-accentFailure/40 font-mono-code text-xs text-accentFailure font-semibold break-all select-all">
                {tampHash}
              </div>
            </div>
          </div>

          {/* SECTION 3: BLOCKCHAIN RECORD */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-forest tracking-wider">03 BLOCKCHAIN RECORD</span>
              <button
                onClick={() => handleCopy(chainHash, setCopiedChain)}
                className="inline-flex items-center space-x-1 text-charcoal-muted hover:text-forest transition-colors text-[10px]"
              >
                {copiedChain ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                <span>{copiedChain ? 'Copied ✓' : 'COPY ON-CHAIN HASH'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-forest uppercase block font-semibold">REGISTERED ON-CHAIN FINGERPRINT</span>
              <div className="p-2.5 bg-paper border border-borderNeutral font-mono-code text-xs text-forest font-semibold break-all select-all">
                {chainHash}
              </div>
            </div>
          </div>

          {/* SECTION 4: COMPARISON MATRIX */}
          <div className="space-y-3 border-b border-borderNeutral pb-4">
            <span className="text-[11px] font-semibold text-charcoal tracking-wider block">04 COMPARISON</span>

            <div className="space-y-2 bg-paper p-3 border border-borderNeutral text-xs">
              <div className="flex justify-between items-center border-b border-borderNeutral pb-2">
                <span className="text-charcoal-muted">Original fingerprint ── On-chain fingerprint</span>
                <span className={`font-semibold ${origVerified ? 'text-forest' : 'text-accentFailure'}`}>
                  {origVerified ? '✓ ORIGINAL VERIFIED' : '✕ MISMATCH'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-charcoal-muted">Tampered fingerprint ── On-chain fingerprint</span>
                <span className={`font-semibold ${!tampVerified ? 'text-accentFailure' : 'text-forest'}`}>
                  {!tampVerified ? '✕ TAMPER DETECTED' : '✓ MATCHED'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: FINAL RESULT */}
          <div className="bg-paper border border-accentFailure/50 p-4 text-center space-y-1 font-mono">
            <div className="text-base font-bold text-accentFailure">
              ❌ VERIFICATION FAILED
            </div>
            <p className="text-xs text-charcoal-muted font-sans">
              Modified content no longer matches the fingerprint registered on-chain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
